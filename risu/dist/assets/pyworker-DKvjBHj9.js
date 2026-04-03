var fe = Object.create, C = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, me = Object.getOwnPropertyNames, ye = Object.getPrototypeOf, he = Object.prototype.hasOwnProperty, Fe = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), ge = (e, t, n, i) => {
	if (t && typeof t == "object" || typeof t == "function") for (var a = me(t), r = 0, o = a.length, s; r < o; r++) s = a[r], !he.call(e, s) && s !== n && C(e, s, {
		get: ((c) => t[c]).bind(null, s),
		enumerable: !(i = pe(t, s)) || i.enumerable
	});
	return e;
}, y = (e, t, n) => (n = e != null ? fe(ye(e)) : {}, ge(t || !e || !e.__esModule ? C(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), _ = ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), we = Object.defineProperty, l = (e, t) => we(e, "name", {
	value: t,
	configurable: !0
}), H = ((e) => typeof _ < "u" ? _ : typeof Proxy < "u" ? new Proxy(e, { get: (t, n) => (typeof _ < "u" ? _ : t)[n] }) : e)(function(e) {
	if (typeof _ < "u") return _.apply(this, arguments);
	throw new Error("Dynamic require of \"" + e + "\" is not supported");
});
function q(e) {
	return !isNaN(parseFloat(e)) && isFinite(e);
}
l(q, "_isNumber");
function w(e) {
	return e.charAt(0).toUpperCase() + e.substring(1);
}
l(w, "_capitalize");
function I(e) {
	return function() {
		return this[e];
	};
}
l(I, "_getter");
var F = [
	"isConstructor",
	"isEval",
	"isNative",
	"isToplevel"
], P = ["columnNumber", "lineNumber"], x = [
	"fileName",
	"functionName",
	"source"
], k = F.concat(P, x, ["args"], ["evalOrigin"]);
function m(e) {
	if (e) for (var t = 0; t < k.length; t++) e[k[t]] !== void 0 && this["set" + w(k[t])](e[k[t]]);
}
l(m, "StackFrame");
m.prototype = {
	getArgs: function() {
		return this.args;
	},
	setArgs: function(e) {
		if (Object.prototype.toString.call(e) !== "[object Array]") throw new TypeError("Args must be an Array");
		this.args = e;
	},
	getEvalOrigin: function() {
		return this.evalOrigin;
	},
	setEvalOrigin: function(e) {
		if (e instanceof m) this.evalOrigin = e;
		else if (e instanceof Object) this.evalOrigin = new m(e);
		else throw new TypeError("Eval Origin must be an Object or StackFrame");
	},
	toString: function() {
		var e = this.getFileName() || "", t = this.getLineNumber() || "", n = this.getColumnNumber() || "", i = this.getFunctionName() || "";
		return this.getIsEval() ? e ? "[eval] (" + e + ":" + t + ":" + n + ")" : "[eval]:" + t + ":" + n : i ? i + " (" + e + ":" + t + ":" + n + ")" : e + ":" + t + ":" + n;
	}
};
m.fromString = l(function(e) {
	var t = e.indexOf("("), n = e.lastIndexOf(")"), i = e.substring(0, t), a = e.substring(t + 1, n).split(","), r = e.substring(n + 1);
	if (r.indexOf("@") === 0) var o = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(r, ""), s = o[1], c = o[2], u = o[3];
	return new m({
		functionName: i,
		args: a || void 0,
		fileName: s,
		lineNumber: c || void 0,
		columnNumber: u || void 0
	});
}, "StackFrame$$fromString");
for (b = 0; b < F.length; b++) m.prototype["get" + w(F[b])] = I(F[b]), m.prototype["set" + w(F[b])] = (function(e) {
	return function(t) {
		this[e] = !!t;
	};
})(F[b]);
var b;
for (E = 0; E < P.length; E++) m.prototype["get" + w(P[E])] = I(P[E]), m.prototype["set" + w(P[E])] = (function(e) {
	return function(t) {
		if (!q(t)) throw new TypeError(e + " must be a Number");
		this[e] = Number(t);
	};
})(P[E]);
var E;
for (S = 0; S < x.length; S++) m.prototype["get" + w(x[S])] = I(x[S]), m.prototype["set" + w(x[S])] = (function(e) {
	return function(t) {
		this[e] = String(t);
	};
})(x[S]);
var S, N = m;
function W() {
	var e = /^\s*at .*(\S+:\d+|\(native\))/m, t = /^(eval@)?(\[native code])?$/;
	return {
		parse: l(function(n) {
			if (n.stack && n.stack.match(e)) return this.parseV8OrIE(n);
			if (n.stack) return this.parseFFOrSafari(n);
			throw new Error("Cannot parse given Error object");
		}, "ErrorStackParser$$parse"),
		extractLocation: l(function(n) {
			if (n.indexOf(":") === -1) return [n];
			var i = /(.+?)(?::(\d+))?(?::(\d+))?$/.exec(n.replace(/[()]/g, ""));
			return [
				i[1],
				i[2] || void 0,
				i[3] || void 0
			];
		}, "ErrorStackParser$$extractLocation"),
		parseV8OrIE: l(function(n) {
			return n.stack.split(`
`).filter(function(i) {
				return !!i.match(e);
			}, this).map(function(i) {
				i.indexOf("(eval ") > -1 && (i = i.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, ""));
				var a = i.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, ""), r = a.match(/ (\(.+\)$)/);
				a = r ? a.replace(r[0], "") : a;
				var o = this.extractLocation(r ? r[1] : a);
				return new N({
					functionName: r && a || void 0,
					fileName: ["eval", "<anonymous>"].indexOf(o[0]) > -1 ? void 0 : o[0],
					lineNumber: o[1],
					columnNumber: o[2],
					source: i
				});
			}, this);
		}, "ErrorStackParser$$parseV8OrIE"),
		parseFFOrSafari: l(function(n) {
			return n.stack.split(`
`).filter(function(i) {
				return !i.match(t);
			}, this).map(function(i) {
				if (i.indexOf(" > eval") > -1 && (i = i.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1")), i.indexOf("@") === -1 && i.indexOf(":") === -1) return new N({ functionName: i });
				var a = /((.*".+"[^@]*)?[^@]*)(?:@)/, r = i.match(a), o = r && r[1] ? r[1] : void 0, s = this.extractLocation(i.replace(a, ""));
				return new N({
					functionName: o,
					fileName: s[0],
					lineNumber: s[1],
					columnNumber: s[2],
					source: i
				});
			}, this);
		}, "ErrorStackParser$$parseFFOrSafari")
	};
}
l(W, "ErrorStackParser");
var ve = new W(), h = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && !process.browser, z = h && typeof module < "u" && typeof module.exports < "u" && typeof H < "u" && typeof __dirname < "u", be = h && !z;
globalThis.Bun;
var B = !h && !(typeof Deno < "u"), Ee = B && typeof window == "object" && typeof document == "object" && typeof document.createElement == "function" && "sessionStorage" in window && typeof importScripts != "function", Se = B && typeof importScripts == "function" && typeof self == "object";
typeof navigator == "object" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Chrome") == -1 && navigator.userAgent.indexOf("Safari");
var V, D, J, U, T;
async function A() {
	if (!h || (V = (await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1))).default, U = await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1)), T = await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1)), J = (await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1))).default, D = await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1)), $ = D.sep, typeof H < "u")) return;
	let e = {
		fs: U,
		crypto: await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1)),
		ws: await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1)),
		child_process: await import("./__vite-browser-external-Ch-JDLA5.js").then((t) => y(t.default, 1))
	};
	globalThis.require = function(t) {
		return e[t];
	};
}
l(A, "initNodeModules");
function Y(e, t) {
	return D.resolve(t || ".", e);
}
l(Y, "node_resolvePath");
function G(e, t) {
	return t === void 0 && (t = location), new URL(e, t).toString();
}
l(G, "browser_resolvePath");
var j;
h ? j = Y : j = G;
var $;
h || ($ = "/");
function K(e, t) {
	return e.startsWith("file://") && (e = e.slice(7)), e.includes("://") ? { response: fetch(e) } : { binary: T.readFile(e).then((n) => new Uint8Array(n.buffer, n.byteOffset, n.byteLength)) };
}
l(K, "node_getBinaryResponse");
function Q(e, t) {
	let n = new URL(e, location);
	return { response: fetch(n, t ? { integrity: t } : {}) };
}
l(Q, "browser_getBinaryResponse");
var L;
h ? L = K : L = Q;
async function X(e, t) {
	let { response: n, binary: i } = L(e, t);
	if (i) return i;
	let a = await n;
	if (!a.ok) throw new Error(`Failed to load '${e}': request failed.`);
	return new Uint8Array(await a.arrayBuffer());
}
l(X, "loadBinaryFile");
var R;
if (Ee) R = l(async (e) => await import(e), "loadScript");
else if (Se) R = l(async (e) => {
	try {
		globalThis.importScripts(e);
	} catch (t) {
		if (t instanceof TypeError) await import(e);
		else throw t;
	}
}, "loadScript");
else if (h) R = Z;
else throw new Error("Cannot determine runtime environment");
async function Z(e) {
	e.startsWith("file://") && (e = e.slice(7)), e.includes("://") ? J.runInThisContext(await (await fetch(e)).text()) : await import(V.pathToFileURL(e).href);
}
l(Z, "nodeLoadScript");
async function ee(e) {
	if (h) {
		await A();
		let t = await T.readFile(e, { encoding: "utf8" });
		return JSON.parse(t);
	} else return await (await fetch(e)).json();
}
l(ee, "loadLockFile");
async function te() {
	if (z) return __dirname;
	let e;
	try {
		throw new Error();
	} catch (i) {
		e = i;
	}
	let t = ve.parse(e)[0].fileName;
	if (h && !t.startsWith("file://") && (t = `file://${t}`), be) {
		let i = await import("./__vite-browser-external-Ch-JDLA5.js").then((a) => y(a.default, 1));
		return (await import("./__vite-browser-external-Ch-JDLA5.js").then((a) => y(a.default, 1))).fileURLToPath(i.dirname(t));
	}
	let n = t.lastIndexOf($);
	if (n === -1) throw new Error("Could not extract indexURL path from pyodide module location");
	return t.slice(0, n);
}
l(te, "calculateDirname");
function re(e) {
	let t = e.FS, n = e.FS.filesystems.MEMFS, i = e.PATH, a = {
		DIR_MODE: 16895,
		FILE_MODE: 33279,
		mount: function(r) {
			if (!r.opts.fileSystemHandle) throw new Error("opts.fileSystemHandle is required");
			return n.mount.apply(null, arguments);
		},
		syncfs: async (r, o, s) => {
			try {
				let c = a.getLocalSet(r), u = await a.getRemoteSet(r), d = o ? u : c, p = o ? c : u;
				await a.reconcile(r, d, p), s(null);
			} catch (c) {
				s(c);
			}
		},
		getLocalSet: (r) => {
			let o = Object.create(null);
			function s(d) {
				return d !== "." && d !== "..";
			}
			l(s, "isRealDir");
			function c(d) {
				return (p) => i.join2(d, p);
			}
			l(c, "toAbsolute");
			let u = t.readdir(r.mountpoint).filter(s).map(c(r.mountpoint));
			for (; u.length;) {
				let d = u.pop(), p = t.stat(d);
				t.isDir(p.mode) && u.push.apply(u, t.readdir(d).filter(s).map(c(d))), o[d] = {
					timestamp: p.mtime,
					mode: p.mode
				};
			}
			return {
				type: "local",
				entries: o
			};
		},
		getRemoteSet: async (r) => {
			let o = Object.create(null), s = await Oe(r.opts.fileSystemHandle);
			for (let [c, u] of s) c !== "." && (o[i.join2(r.mountpoint, c)] = {
				timestamp: u.kind === "file" ? new Date((await u.getFile()).lastModified) : /* @__PURE__ */ new Date(),
				mode: u.kind === "file" ? a.FILE_MODE : a.DIR_MODE
			});
			return {
				type: "remote",
				entries: o,
				handles: s
			};
		},
		loadLocalEntry: (r) => {
			let o = t.lookupPath(r).node, s = t.stat(r);
			if (t.isDir(s.mode)) return {
				timestamp: s.mtime,
				mode: s.mode
			};
			if (t.isFile(s.mode)) return o.contents = n.getFileDataAsTypedArray(o), {
				timestamp: s.mtime,
				mode: s.mode,
				contents: o.contents
			};
			throw new Error("node type not supported");
		},
		storeLocalEntry: (r, o) => {
			if (t.isDir(o.mode)) t.mkdirTree(r, o.mode);
			else if (t.isFile(o.mode)) t.writeFile(r, o.contents, { canOwn: !0 });
			else throw new Error("node type not supported");
			t.chmod(r, o.mode), t.utime(r, o.timestamp, o.timestamp);
		},
		removeLocalEntry: (r) => {
			var o = t.stat(r);
			t.isDir(o.mode) ? t.rmdir(r) : t.isFile(o.mode) && t.unlink(r);
		},
		loadRemoteEntry: async (r) => {
			if (r.kind === "file") {
				let o = await r.getFile();
				return {
					contents: new Uint8Array(await o.arrayBuffer()),
					mode: a.FILE_MODE,
					timestamp: new Date(o.lastModified)
				};
			} else {
				if (r.kind === "directory") return {
					mode: a.DIR_MODE,
					timestamp: /* @__PURE__ */ new Date()
				};
				throw new Error("unknown kind: " + r.kind);
			}
		},
		storeRemoteEntry: async (r, o, s) => {
			let c = r.get(i.dirname(o)), u = t.isFile(s.mode) ? await c.getFileHandle(i.basename(o), { create: !0 }) : await c.getDirectoryHandle(i.basename(o), { create: !0 });
			if (u.kind === "file") {
				let d = await u.createWritable();
				await d.write(s.contents), await d.close();
			}
			r.set(o, u);
		},
		removeRemoteEntry: async (r, o) => {
			await r.get(i.dirname(o)).removeEntry(i.basename(o)), r.delete(o);
		},
		reconcile: async (r, o, s) => {
			let c = 0, u = [];
			Object.keys(o.entries).forEach(function(f) {
				let v = o.entries[f], O = s.entries[f];
				(!O || t.isFile(v.mode) && v.timestamp.getTime() > O.timestamp.getTime()) && (u.push(f), c++);
			}), u.sort();
			let d = [];
			if (Object.keys(s.entries).forEach(function(f) {
				o.entries[f] || (d.push(f), c++);
			}), d.sort().reverse(), !c) return;
			let p = o.type === "remote" ? o.handles : s.handles;
			for (let f of u) {
				let v = i.normalize(f.replace(r.mountpoint, "/")).substring(1);
				if (s.type === "local") {
					let O = p.get(v), de = await a.loadRemoteEntry(O);
					a.storeLocalEntry(f, de);
				} else {
					let O = a.loadLocalEntry(f);
					await a.storeRemoteEntry(p, v, O);
				}
			}
			for (let f of d) if (s.type === "local") a.removeLocalEntry(f);
			else {
				let v = i.normalize(f.replace(r.mountpoint, "/")).substring(1);
				await a.removeRemoteEntry(p, v);
			}
		}
	};
	e.FS.filesystems.NATIVEFS_ASYNC = a;
}
l(re, "initializeNativeFS");
var Oe = l(async (e) => {
	let t = [];
	async function n(a) {
		for await (let r of a.values()) t.push(r), r.kind === "directory" && await n(r);
	}
	l(n, "collect"), await n(e);
	let i = /* @__PURE__ */ new Map();
	i.set(".", e);
	for (let a of t) {
		let r = (await e.resolve(a)).join("/");
		i.set(r, a);
	}
	return i;
}, "getFsHandles");
function ne(e) {
	let t = {
		noImageDecoding: !0,
		noAudioDecoding: !0,
		noWasmDecoding: !1,
		preRun: le(e),
		quit(n, i) {
			throw t.exited = {
				status: n,
				toThrow: i
			}, i;
		},
		print: e.stdout,
		printErr: e.stderr,
		thisProgram: e._sysExecutable,
		arguments: e.args,
		API: { config: e },
		locateFile: (n) => e.indexURL + n,
		instantiateWasm: ce(e.indexURL)
	};
	return t;
}
l(ne, "createSettings");
function ie(e) {
	return function(t) {
		let n = "/";
		try {
			t.FS.mkdirTree(e);
		} catch (i) {
			console.error(`Error occurred while making a home directory '${e}':`), console.error(i), console.error(`Using '${n}' for a home directory instead`), e = n;
		}
		t.FS.chdir(e);
	};
}
l(ie, "createHomeDirectory");
function oe(e) {
	return function(t) {
		Object.assign(t.ENV, e);
	};
}
l(oe, "setEnvironment");
function ae(e) {
	return e ? [async (t) => {
		t.addRunDependency("fsInitHook");
		try {
			await e(t.FS, { sitePackages: t.API.sitePackages });
		} finally {
			t.removeRunDependency("fsInitHook");
		}
	}] : [];
}
l(ae, "callFsInitHook");
function se(e) {
	let t = X(e);
	return async (n) => {
		let i = n._py_version_major(), a = n._py_version_minor();
		n.FS.mkdirTree("/lib"), n.API.sitePackages = `/lib/python${i}.${a}/site-packages`, n.FS.mkdirTree(n.API.sitePackages), n.addRunDependency("install-stdlib");
		try {
			let r = await t;
			n.FS.writeFile(`/lib/python${i}${a}.zip`, r);
		} catch (r) {
			console.error("Error occurred while installing the standard library:"), console.error(r);
		} finally {
			n.removeRunDependency("install-stdlib");
		}
	};
}
l(se, "installStdlib");
function le(e) {
	let t;
	return e.stdLibURL != null ? t = e.stdLibURL : t = e.indexURL + "python_stdlib.zip", [
		...ae(e.fsInit),
		se(t),
		ie(e.env.HOME),
		oe(e.env),
		re
	];
}
l(le, "getFileSystemInitializationFuncs");
function ce(e) {
	if (typeof WasmOffsetConverter < "u") return;
	let { binary: t, response: n } = L(e + "pyodide.asm.wasm");
	return function(i, a) {
		return (async function() {
			try {
				let r;
				n ? r = await WebAssembly.instantiateStreaming(n, i) : r = await WebAssembly.instantiate(await t, i);
				let { instance: o, module: s } = r;
				a(o, s);
			} catch (r) {
				console.warn("wasm instantiation failed!"), console.warn(r);
			}
		})(), {};
	};
}
l(ce, "getInstantiateWasmFunc");
var M = "0.27.7";
async function ue(e = {}) {
	var t, n;
	await A();
	let i = e.indexURL || await te();
	i = j(i), i.endsWith("/") || (i += "/"), e.indexURL = i;
	let a = {
		fullStdLib: !1,
		jsglobals: globalThis,
		stdin: globalThis.prompt ? globalThis.prompt : void 0,
		lockFileURL: i + "pyodide-lock.json",
		args: [],
		env: {},
		packageCacheDir: i,
		packages: [],
		enableRunUntilComplete: !0,
		checkAPIVersion: !0,
		BUILD_ID: "e94377f5ce7dcf67e0417b69a0016733c2cfb6b4622ee8c490a6f17eb58e863b"
	}, r = Object.assign(a, e);
	(t = r.env).HOME ?? (t.HOME = "/home/pyodide"), (n = r.env).PYTHONINSPECT ?? (n.PYTHONINSPECT = "1");
	let o = ne(r), s = o.API;
	if (s.lockFilePromise = ee(r.lockFileURL), typeof _createPyodideModule != "function") {
		let f = `${r.indexURL}pyodide.asm.js`;
		await R(f);
	}
	let c;
	if (e._loadSnapshot) {
		let f = await e._loadSnapshot;
		ArrayBuffer.isView(f) ? c = f : c = new Uint8Array(f), o.noInitialRun = !0, o.INITIAL_MEMORY = c.length;
	}
	let u = await _createPyodideModule(o);
	if (o.exited) throw o.exited.toThrow;
	if (e.pyproxyToStringRepr && s.setPyProxyToStringMethod(!0), s.version !== "0.27.7" && r.checkAPIVersion) throw new Error(`Pyodide version does not match: '${M}' <==> '${s.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);
	u.locateFile = (f) => {
		throw new Error("Didn't expect to load any more file_packager files!");
	};
	let d;
	c && (d = s.restoreSnapshot(c));
	let p = s.finalizeBootstrap(d, e._snapshotDeserializer);
	return s.sys.path.insert(0, ""), p.version.includes("dev") || s.setCdnUrl(`https://cdn.jsdelivr.net/pyodide/v${p.version}/full/`), s._pyodide.set_excepthook(), await s.packageIndexReady, s.initializeStreams(r.stdin, r.stdout, r.stderr), p;
}
l(ue, "loadPyodide");
let g;
async function _e() {
	return g || (g = await ue({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${M}/full/` }), g);
}
self.onmessage = async (e) => {
	await _e();
	const { type: t } = e.data;
	switch (t) {
		case "init": {
			const { id: n, moduleFunctions: i, code: a } = e.data;
			let r = {};
			for (const o of i) r[o] = (...s) => new Promise((c, u) => {
				const d = crypto.randomUUID();
				self.postMessage({
					type: "call",
					function: o,
					args: s,
					callId: d
				});
				const p = (f) => {
					f.detail.callId === d && (globalThis.removeEventListener("x-function-call", p), c(f.detail.result));
				};
				globalThis.addEventListener("x-function-call", p);
			});
			g.unregisterJsModule("js"), g.registerJsModule("risuai", r), g.FS.writeFile("./cd.py", a), self.postMessage({
				type: "init",
				id: n,
				version: M
			});
			break;
		}
		case "functionResult": {
			const { callId: n, result: i } = e.data;
			globalThis.dispatchEvent(new CustomEvent("x-function-call", { detail: {
				callId: n,
				result: i
			} }));
			break;
		}
		case "python": {
			const { call: n, id: i } = e.data;
			try {
				const a = await g.pyimport("cd")?.[n]?.() || null;
				self.postMessage({
					type: "pythonResult",
					result: a,
					id: i
				});
			} catch (a) {
				console.error("Error executing Python code:", a), self.postMessage({
					type: "pythonResult",
					result: a,
					id: i
				});
			}
			break;
		}
	}
};
export { Fe as t };

//# sourceMappingURL=pyworker-DKvjBHj9.js.map