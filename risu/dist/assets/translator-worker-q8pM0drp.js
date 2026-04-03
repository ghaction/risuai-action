var M = (a, e) => () => (e || a((e = { exports: {} }).exports, e), e.exports), d = M(((a, e) => {
	e.exports = {};
})), p = {};
typeof self > "u" && (global.Module = p, global.self = new class {
	#e;
	constructor() {
		const { parentPort: e } = d();
		this.#e = e;
	}
	addEventListener(e, s) {
		this.#e.on(e, (t) => s({ data: t }));
	}
	postMessage(e) {
		this.#e.postMessage(e);
	}
	importScripts(...e) {
		const { readFileSync: s } = d(), { join: t } = d();
		for (let r of e) {
			const n = s(t(__dirname, r), { encoding: "utf-8" });
			eval.call(global, n);
		}
	}
	async fetch(e, s) {
		if (e.protocol === "file:") {
			const { readFile: t } = d(), r = await t(e.pathname), n = new Blob([r]);
			return new Response(n, {
				status: 200,
				statusText: "OK",
				headers: {
					"Content-Type": "application/wasm",
					"Content-Length": n.size.toString()
				}
			});
		}
		return await fetch(e, s);
	}
	get location() {
		return new URL(`file://${__filename}`);
	}
}());
var u = class {
	static parse(a) {
		const e = {};
		return a.split(`
`).reduce((s, t, r) => {
			let n;
			if (n = t.match(/^\s*-\s+(.+?)$/)) Array.isArray(e[s]) || (e[s] = e[s].trim() ? [e[s]] : []), e[s].push(n[1].trim());
			else if (n = t.match(/^\s*([A-Za-z0-9_][A-Za-z0-9_-]*):\s*(.*)$/)) s = n[1], e[s] = n[2].trim();
			else if (t.trim()) throw Error(`Could not parse line ${r + 1}: "${t}"`);
			return s;
		}, null), e;
	}
	static stringify(a) {
		return Object.entries(a).reduce((e, [s, t]) => {
			let r = "";
			return Array.isArray(t) ? r = t.map((n) => `
  - ${n}`).join("") : typeof t == "number" || typeof t == "boolean" || t.match(/^\d*(\.\d+)?$/) ? r = `${t}` : r = `${t}`, `${e}${s}: ${r}
`;
		}, "");
	}
}, w = class g {
	static GEMM_TO_FALLBACK_FUNCTIONS_MAP = {
		int8_prepare_a: "int8PrepareAFallback",
		int8_prepare_b: "int8PrepareBFallback",
		int8_prepare_b_from_transposed: "int8PrepareBFromTransposedFallback",
		int8_prepare_b_from_quantized_transposed: "int8PrepareBFromQuantizedTransposedFallback",
		int8_prepare_bias: "int8PrepareBiasFallback",
		int8_multiply_and_add_bias: "int8MultiplyAndAddBiasFallback",
		int8_select_columns_of_b: "int8SelectColumnsOfBFallback"
	};
	static NATIVE_INT_GEMM = "mozIntGemm";
	constructor(e) {}
	async initialize(e) {
		this.options = e || {}, this.models = /* @__PURE__ */ new Map(), this.module = await this.loadModule(), this.service = await this.loadTranslationService();
	}
	linkNativeIntGemm(e) {
		if (!WebAssembly.mozIntGemm) return console.warn("Native gemm requested but not available, falling back to embedded gemm"), this.linkFallbackIntGemm(e);
		const s = new WebAssembly.Instance(WebAssembly.mozIntGemm(), { "": { memory: e.env.memory } });
		return Array.from(Object.keys(g.GEMM_TO_FALLBACK_FUNCTIONS_MAP)).every((t) => s.exports[t]) ? s.exports : (console.warn("Native gemm is missing expected functions, falling back to embedded gemm"), this.linkFallbackIntGemm(e));
	}
	linkFallbackIntGemm(e) {
		const s = Object.entries(g.GEMM_TO_FALLBACK_FUNCTIONS_MAP).map(([t, r]) => [t, (...n) => p.asm[r](...n)]);
		return Object.fromEntries(s);
	}
	loadModule() {
		return new Promise(async (e, s) => {
			try {
				const t = await self.fetch(new URL("./bergamot-translator-worker.wasm", self.location));
				Object.assign(p, {
					instantiateWasm: (r, n) => {
						try {
							WebAssembly.instantiateStreaming(t, {
								...r,
								wasm_gemm: this.options.useNativeIntGemm ? this.linkNativeIntGemm(r) : this.linkFallbackIntGemm(r)
							}).then(({ instance: i }) => n(i)).catch(s);
						} catch (i) {
							s(i);
						}
						return {};
					},
					onRuntimeInitialized: () => {
						e(p);
					}
				}), self.Module = p, self.importScripts("bergamot-translator-worker.js");
			} catch (t) {
				s(t);
			}
		});
	}
	loadTranslationService() {
		return new this.module.BlockingService({ cacheSize: Math.max(this.options.cacheSize || 0, 0) });
	}
	hasTranslationModel({ from: e, to: s }) {
		const t = JSON.stringify({
			from: e,
			to: s
		});
		return this.models.has(t);
	}
	loadTranslationModel({ from: e, to: s }, t) {
		const r = t.vocabs.filter((m, y, _) => !_.slice(0, y).includes(m)), [n, i, h, ...o] = [
			this.prepareAlignedMemoryFromBuffer(t.model, 256),
			this.prepareAlignedMemoryFromBuffer(t.shortlist, 64),
			t.qualityModel ? this.prepareAlignedMemoryFromBuffer(t.qualityModel, 64) : null,
			...r.map((m) => this.prepareAlignedMemoryFromBuffer(m, 64))
		], l = new this.module.AlignedMemoryList();
		o.forEach((m) => l.push_back(m));
		let c = u.parse(`
            beam-size: 1
            normalize: 1.0
            word-penalty: 0
            cpu-threads: 0
            gemm-precision: int8shiftAlphaAll
            skip-cost: true
        `);
		t.config && Object.assign(c, t.config), c["gemm-precision"] === "int8" && (c["gemm-precision"] = "int8shiftAll"), Object.assign(c, u.parse(`
            alignment: soft
            quiet: true
            quiet-translation: true
            max-length-break: 128
            mini-batch-words: 1024
            workspace: 128
            max-length-factor: 2.0
        `));
		const b = JSON.stringify({
			from: e,
			to: s
		});
		this.models.set(b, new this.module.TranslationModel(u.stringify(c), n, i, l, h));
	}
	freeTranslationModel({ from: e, to: s }) {
		const t = JSON.stringify({
			from: e,
			to: s
		});
		if (!this.models.has(t)) return;
		const r = this.models.get(t);
		this.models.delete(t), r.delete();
	}
	prepareAlignedMemoryFromBuffer(e, s) {
		const t = new Int8Array(e), r = new this.module.AlignedMemory(t.byteLength, s);
		return r.getByteArrayView().set(t), r;
	}
	translate({ models: e, texts: s }) {
		let t = new this.module.VectorString();
		s.forEach(({ text: o }) => t.push_back(o));
		let r = new this.module.VectorResponseOptions();
		s.forEach(({ html: o, qualityScores: l }) => r.push_back({
			alignment: !1,
			html: o,
			qualityScores: l
		}));
		const n = e.map(({ from: o, to: l }) => {
			const c = JSON.stringify({
				from: o,
				to: l
			});
			return this.models.get(c);
		}), i = e.length > 1 ? this.service.translateViaPivoting(...n, t, r) : this.service.translate(...n, t, r);
		t.delete(), r.delete();
		const h = s.map((o, l) => ({ target: { text: i.get(l).getTranslatedText() } }));
		return i.delete(), h;
	}
};
function A(a) {
	return {
		name: a.name,
		message: a.message,
		stack: a.stack
	};
}
const f = new w();
self.addEventListener("message", async function({ data: { id: a, name: e, args: s } }) {
	a || console.error("Received message without id", arguments[0]);
	try {
		if (typeof f[e] != "function") throw TypeError(`worker[${e}] is not a function`);
		const t = await Promise.resolve(Reflect.apply(f[e], f, s));
		self.postMessage({
			id: a,
			result: t
		});
	} catch (t) {
		self.postMessage({
			id: a,
			error: A(t)
		});
	}
});

//# sourceMappingURL=translator-worker-q8pM0drp.js.map