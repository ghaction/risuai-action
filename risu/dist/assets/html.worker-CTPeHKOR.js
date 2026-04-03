var ko = class {
	constructor() {
		this.listeners = [], this.unexpectedErrorHandler = function(e) {
			setTimeout(() => {
				throw e.stack ? Mn.isErrorNoTelemetry(e) ? new Mn(e.message + `

` + e.stack) : /* @__PURE__ */ new Error(e.message + `

` + e.stack) : e;
			}, 0);
		};
	}
	emit(e) {
		this.listeners.forEach((t) => {
			t(e);
		});
	}
	onUnexpectedError(e) {
		this.unexpectedErrorHandler(e), this.emit(e);
	}
	onUnexpectedExternalError(e) {
		this.unexpectedErrorHandler(e);
	}
};
const So = new ko();
function Nt(e) {
	xo(e) || So.onUnexpectedError(e);
}
function Rn(e) {
	if (e instanceof Error) {
		const { name: t, message: n, cause: r } = e;
		return {
			$isError: !0,
			name: t,
			message: n,
			stack: e.stacktrace || e.stack,
			noTelemetry: Mn.isErrorNoTelemetry(e),
			cause: r ? Rn(r) : void 0,
			code: e.code
		};
	}
	return e;
}
const Lo = "Canceled";
function xo(e) {
	return e instanceof Ra ? !0 : e instanceof Error && e.name === "Canceled" && e.message === "Canceled";
}
var Ra = class extends Error {
	constructor() {
		super(Lo), this.name = this.message;
	}
}, Mn = class En extends Error {
	constructor(t) {
		super(t), this.name = "CodeExpectedError";
	}
	static fromError(t) {
		if (t instanceof En) return t;
		const n = new En();
		return n.message = t.message, n.stack = t.stack, n;
	}
	static isErrorNoTelemetry(t) {
		return t.name === "CodeExpectedError";
	}
}, oe = class Ma extends Error {
	constructor(t) {
		super(t || "An unexpected bug occurred."), Object.setPrototypeOf(this, Ma.prototype);
	}
};
function Ao(e, t = "Unreachable") {
	throw new Error(t);
}
function Ro(e, t = "unexpected state") {
	if (!e) throw typeof t == "string" ? new oe(`Assertion Failed: ${t}`) : t;
}
function jt(e) {
	if (!e()) {
		debugger;
		e(), Nt(new oe("Assertion Failed"));
	}
}
function Ea(e, t) {
	let n = 0;
	for (; n < e.length - 1;) {
		const r = e[n], i = e[n + 1];
		if (!t(r, i)) return !1;
		n++;
	}
	return !0;
}
function Mo(e) {
	return typeof e == "string";
}
function Eo(e) {
	return !!e && typeof e[Symbol.iterator] == "function";
}
var $t;
(function(e) {
	function t(f) {
		return !!f && typeof f == "object" && typeof f[Symbol.iterator] == "function";
	}
	e.is = t;
	const n = Object.freeze([]);
	function r() {
		return n;
	}
	e.empty = r;
	function* i(f) {
		yield f;
	}
	e.single = i;
	function s(f) {
		return t(f) ? f : i(f);
	}
	e.wrap = s;
	function a(f) {
		return f || n;
	}
	e.from = a;
	function* o(f) {
		for (let _ = f.length - 1; _ >= 0; _--) yield f[_];
	}
	e.reverse = o;
	function l(f) {
		return !f || f[Symbol.iterator]().next().done === !0;
	}
	e.isEmpty = l;
	function c(f) {
		return f[Symbol.iterator]().next().value;
	}
	e.first = c;
	function u(f, _) {
		let C = 0;
		for (const z of f) if (_(z, C++)) return !0;
		return !1;
	}
	e.some = u;
	function d(f, _) {
		let C = 0;
		for (const z of f) if (!_(z, C++)) return !1;
		return !0;
	}
	e.every = d;
	function m(f, _) {
		for (const C of f) if (_(C)) return C;
	}
	e.find = m;
	function* p(f, _) {
		for (const C of f) _(C) && (yield C);
	}
	e.filter = p;
	function* b(f, _) {
		let C = 0;
		for (const z of f) yield _(z, C++);
	}
	e.map = b;
	function* g(f, _) {
		let C = 0;
		for (const z of f) yield* _(z, C++);
	}
	e.flatMap = g;
	function* v(...f) {
		for (const _ of f) Eo(_) ? yield* _ : yield _;
	}
	e.concat = v;
	function T(f, _, C) {
		let z = C;
		for (const L of f) z = _(z, L);
		return z;
	}
	e.reduce = T;
	function k(f) {
		let _ = 0;
		for (const C of f) _++;
		return _;
	}
	e.length = k;
	function* E(f, _, C = f.length) {
		for (_ < -f.length && (_ = 0), _ < 0 && (_ += f.length), C < 0 ? C += f.length : C > f.length && (C = f.length); _ < C; _++) yield f[_];
	}
	e.slice = E;
	function I(f, _ = Number.POSITIVE_INFINITY) {
		const C = [];
		if (_ === 0) return [C, f];
		const z = f[Symbol.iterator]();
		for (let L = 0; L < _; L++) {
			const S = z.next();
			if (S.done) return [C, e.empty()];
			C.push(S.value);
		}
		return [C, { [Symbol.iterator]() {
			return z;
		} }];
	}
	e.consume = I;
	async function D(f) {
		const _ = [];
		for await (const C of f) _.push(C);
		return _;
	}
	e.asyncToArray = D;
	async function w(f) {
		let _ = [];
		for await (const C of f) _ = _.concat(C);
		return _;
	}
	e.asyncToArrayFlat = w;
})($t || ($t = {}));
function Na(e) {
	if ($t.is(e)) {
		const t = [];
		for (const n of e) if (n) try {
			n.dispose();
		} catch (r) {
			t.push(r);
		}
		if (t.length === 1) throw t[0];
		if (t.length > 1) throw new AggregateError(t, "Encountered errors while disposing of store");
		return Array.isArray(e) ? [] : e;
	} else if (e) return e.dispose(), e;
}
function No(...e) {
	return Gt(() => Na(e));
}
var Co = class {
	constructor(e) {
		this._isDisposed = !1, this._fn = e;
	}
	dispose() {
		if (!this._isDisposed) {
			if (!this._fn) throw new Error("Unbound disposable context: Need to use an arrow function to preserve the value of this");
			this._isDisposed = !0, this._fn();
		}
	}
};
function Gt(e) {
	return new Co(e);
}
var Ti = class Ca {
	static {
		this.DISABLE_DISPOSED_WARNING = !1;
	}
	constructor() {
		this._toDispose = /* @__PURE__ */ new Set(), this._isDisposed = !1;
	}
	dispose() {
		this._isDisposed || (this._isDisposed = !0, this.clear());
	}
	get isDisposed() {
		return this._isDisposed;
	}
	clear() {
		if (this._toDispose.size !== 0) try {
			Na(this._toDispose);
		} finally {
			this._toDispose.clear();
		}
	}
	add(t) {
		if (!t || t === kt.None) return t;
		if (t === this) throw new Error("Cannot register a disposable on itself!");
		return this._isDisposed ? Ca.DISABLE_DISPOSED_WARNING || console.warn((/* @__PURE__ */ new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!")).stack) : this._toDispose.add(t), t;
	}
	delete(t) {
		if (t) {
			if (t === this) throw new Error("Cannot dispose a disposable on itself!");
			this._toDispose.delete(t), t.dispose();
		}
	}
}, kt = class {
	static {
		this.None = Object.freeze({ dispose() {} });
	}
	constructor() {
		this._store = new Ti(), this._store;
	}
	dispose() {
		this._store.dispose();
	}
	_register(e) {
		if (e === this) throw new Error("Cannot register a disposable on itself!");
		return this._store.add(e);
	}
}, K = class Ct {
	static {
		this.Undefined = new Ct(void 0);
	}
	constructor(t) {
		this.element = t, this.next = Ct.Undefined, this.prev = Ct.Undefined;
	}
}, Io = class {
	constructor() {
		this._first = K.Undefined, this._last = K.Undefined, this._size = 0;
	}
	get size() {
		return this._size;
	}
	isEmpty() {
		return this._first === K.Undefined;
	}
	clear() {
		let e = this._first;
		for (; e !== K.Undefined;) {
			const t = e.next;
			e.prev = K.Undefined, e.next = K.Undefined, e = t;
		}
		this._first = K.Undefined, this._last = K.Undefined, this._size = 0;
	}
	unshift(e) {
		return this._insert(e, !1);
	}
	push(e) {
		return this._insert(e, !0);
	}
	_insert(e, t) {
		const n = new K(e);
		if (this._first === K.Undefined) this._first = n, this._last = n;
		else if (t) {
			const i = this._last;
			this._last = n, n.prev = i, i.next = n;
		} else {
			const i = this._first;
			this._first = n, n.next = i, i.prev = n;
		}
		this._size += 1;
		let r = !1;
		return () => {
			r || (r = !0, this._remove(n));
		};
	}
	shift() {
		if (this._first !== K.Undefined) {
			const e = this._first.element;
			return this._remove(this._first), e;
		}
	}
	pop() {
		if (this._last !== K.Undefined) {
			const e = this._last.element;
			return this._remove(this._last), e;
		}
	}
	_remove(e) {
		if (e.prev !== K.Undefined && e.next !== K.Undefined) {
			const t = e.prev;
			t.next = e.next, e.next.prev = t;
		} else e.prev === K.Undefined && e.next === K.Undefined ? (this._first = K.Undefined, this._last = K.Undefined) : e.next === K.Undefined ? (this._last = this._last.prev, this._last.next = K.Undefined) : e.prev === K.Undefined && (this._first = this._first.next, this._first.prev = K.Undefined);
		this._size -= 1;
	}
	*[Symbol.iterator]() {
		let e = this._first;
		for (; e !== K.Undefined;) yield e.element, e = e.next;
	}
};
const zo = globalThis.performance.now.bind(globalThis.performance);
var Ia = class za {
	static create(t) {
		return new za(t);
	}
	constructor(t) {
		this._now = t === !1 ? Date.now : zo, this._startTime = this._now(), this._stopTime = -1;
	}
	stop() {
		this._stopTime = this._now();
	}
	reset() {
		this._startTime = this._now(), this._stopTime = -1;
	}
	elapsed() {
		return this._stopTime !== -1 ? this._stopTime - this._startTime : this._now() - this._startTime;
	}
}, Nn;
(function(e) {
	e.None = () => kt.None;
	function t(S, A) {
		return m(S, () => {}, 0, void 0, !0, void 0, A);
	}
	e.defer = t;
	function n(S) {
		return (A, y = null, M) => {
			let N = !1, H;
			return H = S((q) => {
				if (!N) return H ? H.dispose() : N = !0, A.call(y, q);
			}, null, M), N && H.dispose(), H;
		};
	}
	e.once = n;
	function r(S, A) {
		return e.once(e.filter(S, A));
	}
	e.onceIf = r;
	function i(S, A, y) {
		return u((M, N = null, H) => S((q) => M.call(N, A(q)), null, H), y);
	}
	e.map = i;
	function s(S, A, y) {
		return u((M, N = null, H) => S((q) => {
			A(q), M.call(N, q);
		}, null, H), y);
	}
	e.forEach = s;
	function a(S, A, y) {
		return u((M, N = null, H) => S((q) => A(q) && M.call(N, q), null, H), y);
	}
	e.filter = a;
	function o(S) {
		return S;
	}
	e.signal = o;
	function l(...S) {
		return (A, y = null, M) => d(No(...S.map((N) => N((H) => A.call(y, H)))), M);
	}
	e.any = l;
	function c(S, A, y, M) {
		let N = y;
		return i(S, (H) => (N = A(N, H), N), M);
	}
	e.reduce = c;
	function u(S, A) {
		let y;
		const M = new Se({
			onWillAddFirstListener() {
				y = S(M.fire, M);
			},
			onDidRemoveLastListener() {
				y?.dispose();
			}
		});
		return A?.add(M), M.event;
	}
	function d(S, A) {
		return A instanceof Array ? A.push(S) : A && A.add(S), S;
	}
	function m(S, A, y = 100, M = !1, N = !1, H, q) {
		let P, W, G, Z = 0, ae;
		const xe = new Se({
			leakWarningThreshold: H,
			onWillAddFirstListener() {
				P = S((yo) => {
					Z++, W = A(W, yo), M && !G && (xe.fire(W), W = void 0), ae = () => {
						const To = W;
						W = void 0, G = void 0, (!M || Z > 1) && xe.fire(To), Z = 0;
					}, typeof y == "number" ? (G && clearTimeout(G), G = setTimeout(ae, y)) : G === void 0 && (G = null, queueMicrotask(ae));
				});
			},
			onWillRemoveListener() {
				N && Z > 0 && ae?.();
			},
			onDidRemoveLastListener() {
				ae = void 0, P.dispose();
			}
		});
		return q?.add(xe), xe.event;
	}
	e.debounce = m;
	function p(S, A = 0, y) {
		return e.debounce(S, (M, N) => M ? (M.push(N), M) : [N], A, void 0, !0, void 0, y);
	}
	e.accumulate = p;
	function b(S, A = (M, N) => M === N, y) {
		let M = !0, N;
		return a(S, (H) => {
			const q = M || !A(H, N);
			return M = !1, N = H, q;
		}, y);
	}
	e.latch = b;
	function g(S, A, y) {
		return [e.filter(S, A, y), e.filter(S, (M) => !A(M), y)];
	}
	e.split = g;
	function v(S, A = !1, y = [], M) {
		let N = y.slice(), H = S((W) => {
			N ? N.push(W) : P.fire(W);
		});
		M && M.add(H);
		const q = () => {
			N?.forEach((W) => P.fire(W)), N = null;
		}, P = new Se({
			onWillAddFirstListener() {
				H || (H = S((W) => P.fire(W)), M && M.add(H));
			},
			onDidAddFirstListener() {
				N && (A ? setTimeout(q) : q());
			},
			onDidRemoveLastListener() {
				H && H.dispose(), H = null;
			}
		});
		return M && M.add(P), P.event;
	}
	e.buffer = v;
	function T(S, A) {
		return (M, N, H) => {
			const q = A(new E());
			return S(function(P) {
				const W = q.evaluate(P);
				W !== k && M.call(N, W);
			}, void 0, H);
		};
	}
	e.chain = T;
	const k = Symbol("HaltChainable");
	class E {
		constructor() {
			this.steps = [];
		}
		map(A) {
			return this.steps.push(A), this;
		}
		forEach(A) {
			return this.steps.push((y) => (A(y), y)), this;
		}
		filter(A) {
			return this.steps.push((y) => A(y) ? y : k), this;
		}
		reduce(A, y) {
			let M = y;
			return this.steps.push((N) => (M = A(M, N), M)), this;
		}
		latch(A = (y, M) => y === M) {
			let y = !0, M;
			return this.steps.push((N) => {
				const H = y || !A(N, M);
				return y = !1, M = N, H ? N : k;
			}), this;
		}
		evaluate(A) {
			for (const y of this.steps) if (A = y(A), A === k) break;
			return A;
		}
	}
	function I(S, A, y = (M) => M) {
		const M = (...P) => q.fire(y(...P)), N = () => S.on(A, M), H = () => S.removeListener(A, M), q = new Se({
			onWillAddFirstListener: N,
			onDidRemoveLastListener: H
		});
		return q.event;
	}
	e.fromNodeEventEmitter = I;
	function D(S, A, y = (M) => M) {
		const M = (...P) => q.fire(y(...P)), N = () => S.addEventListener(A, M), H = () => S.removeEventListener(A, M), q = new Se({
			onWillAddFirstListener: N,
			onDidRemoveLastListener: H
		});
		return q.event;
	}
	e.fromDOMEventEmitter = D;
	function w(S, A) {
		let y;
		const M = new Promise((N, H) => {
			const q = n(S)(N, null, A);
			y = () => q.dispose();
		});
		return M.cancel = y, M;
	}
	e.toPromise = w;
	function f(S, A) {
		return S((y) => A.fire(y));
	}
	e.forward = f;
	function _(S, A, y) {
		return A(y), S((M) => A(M));
	}
	e.runAndSubscribe = _;
	class C {
		constructor(A, y) {
			this._observable = A, this._counter = 0, this._hasChanged = !1, this.emitter = new Se({
				onWillAddFirstListener: () => {
					A.addObserver(this), this._observable.reportChanges();
				},
				onDidRemoveLastListener: () => {
					A.removeObserver(this);
				}
			}), y && y.add(this.emitter);
		}
		beginUpdate(A) {
			this._counter++;
		}
		handlePossibleChange(A) {}
		handleChange(A, y) {
			this._hasChanged = !0;
		}
		endUpdate(A) {
			this._counter--, this._counter === 0 && (this._observable.reportChanges(), this._hasChanged && (this._hasChanged = !1, this.emitter.fire(this._observable.get())));
		}
	}
	function z(S, A) {
		return new C(S, A).emitter.event;
	}
	e.fromObservable = z;
	function L(S) {
		return (A, y, M) => {
			let N = 0, H = !1;
			const q = {
				beginUpdate() {
					N++;
				},
				endUpdate() {
					N--, N === 0 && (S.reportChanges(), H && (H = !1, A.call(y)));
				},
				handlePossibleChange() {},
				handleChange() {
					H = !0;
				}
			};
			S.addObserver(q), S.reportChanges();
			const P = { dispose() {
				S.removeObserver(q);
			} };
			return M instanceof Ti ? M.add(P) : Array.isArray(M) && M.push(P), P;
		};
	}
	e.fromObservableLight = L;
})(Nn || (Nn = {}));
var Ho = class Cn {
	static {
		this.all = /* @__PURE__ */ new Set();
	}
	static {
		this._idPool = 0;
	}
	constructor(t) {
		this.listenerCount = 0, this.invocationCount = 0, this.elapsedOverall = 0, this.durations = [], this.name = `${t}_${Cn._idPool++}`, Cn.all.add(this);
	}
	start(t) {
		this._stopWatch = new Ia(), this.listenerCount = t;
	}
	stop() {
		if (this._stopWatch) {
			const t = this._stopWatch.elapsed();
			this.durations.push(t), this.elapsedOverall += t, this.invocationCount += 1, this._stopWatch = void 0;
		}
	}
};
let Uo = -1;
var Do = class Ha {
	static {
		this._idPool = 1;
	}
	constructor(t, n, r = (Ha._idPool++).toString(16).padStart(3, "0")) {
		this._errorHandler = t, this.threshold = n, this.name = r, this._warnCountdown = 0;
	}
	dispose() {
		this._stacks?.clear();
	}
	check(t, n) {
		const r = this.threshold;
		if (r <= 0 || n < r) return;
		this._stacks || (this._stacks = /* @__PURE__ */ new Map());
		const i = this._stacks.get(t.value) || 0;
		if (this._stacks.set(t.value, i + 1), this._warnCountdown -= 1, this._warnCountdown <= 0) {
			this._warnCountdown = r * .5;
			const [s, a] = this.getMostFrequentStack(), o = `[${this.name}] potential listener LEAK detected, having ${n} listeners already. MOST frequent listener (${a}):`;
			console.warn(o), console.warn(s);
			const l = new Po(o, s);
			this._errorHandler(l);
		}
		return () => {
			const s = this._stacks.get(t.value) || 0;
			this._stacks.set(t.value, s - 1);
		};
	}
	getMostFrequentStack() {
		if (!this._stacks) return;
		let t, n = 0;
		for (const [r, i] of this._stacks) (!t || n < i) && (t = [r, i], n = i);
		return t;
	}
}, Wo = class Ua {
	static create() {
		return new Ua((/* @__PURE__ */ new Error()).stack ?? "");
	}
	constructor(t) {
		this.value = t;
	}
	print() {
		console.warn(this.value.split(`
`).slice(2).join(`
`));
	}
}, Po = class extends Error {
	constructor(e, t) {
		super(e), this.name = "ListenerLeakError", this.stack = t;
	}
}, qo = class extends Error {
	constructor(e, t) {
		super(e), this.name = "ListenerRefusalError", this.stack = t;
	}
}, fn = class {
	constructor(e) {
		this.value = e;
	}
};
const Oo = 2;
var Se = class {
	constructor(e) {
		this._size = 0, this._options = e, this._leakageMon = this._options?.leakWarningThreshold ? new Do(e?.onListenerError ?? Nt, this._options?.leakWarningThreshold ?? Uo) : void 0, this._perfMon = this._options?._profName ? new Ho(this._options._profName) : void 0, this._deliveryQueue = this._options?.deliveryQueue;
	}
	dispose() {
		this._disposed || (this._disposed = !0, this._deliveryQueue?.current === this && this._deliveryQueue.reset(), this._listeners && (this._listeners = void 0, this._size = 0), this._options?.onDidRemoveLastListener?.(), this._leakageMon?.dispose());
	}
	get event() {
		return this._event ??= (e, t, n) => {
			if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
				const a = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;
				console.warn(a);
				const o = this._leakageMon.getMostFrequentStack() ?? ["UNKNOWN stack", -1], l = new qo(`${a}. HINT: Stack shows most frequent listener (${o[1]}-times)`, o[0]);
				return (this._options?.onListenerError || Nt)(l), kt.None;
			}
			if (this._disposed) return kt.None;
			t && (e = e.bind(t));
			const r = new fn(e);
			let i;
			this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * .2) && (r.stack = Wo.create(), i = this._leakageMon.check(r.stack, this._size + 1)), this._listeners ? this._listeners instanceof fn ? (this._deliveryQueue ??= new Fo(), this._listeners = [this._listeners, r]) : this._listeners.push(r) : (this._options?.onWillAddFirstListener?.(this), this._listeners = r, this._options?.onDidAddFirstListener?.(this)), this._options?.onDidAddListener?.(this), this._size++;
			const s = Gt(() => {
				i?.(), this._removeListener(r);
			});
			return n instanceof Ti ? n.add(s) : Array.isArray(n) && n.push(s), s;
		}, this._event;
	}
	_removeListener(e) {
		if (this._options?.onWillRemoveListener?.(this), !this._listeners) return;
		if (this._size === 1) {
			this._listeners = void 0, this._options?.onDidRemoveLastListener?.(this), this._size = 0;
			return;
		}
		const t = this._listeners, n = t.indexOf(e);
		if (n === -1) throw console.log("disposed?", this._disposed), console.log("size?", this._size), console.log("arr?", JSON.stringify(this._listeners)), /* @__PURE__ */ new Error("Attempted to dispose unknown listener");
		this._size--, t[n] = void 0;
		const r = this._deliveryQueue.current === this;
		if (this._size * Oo <= t.length) {
			let i = 0;
			for (let s = 0; s < t.length; s++) t[s] ? t[i++] = t[s] : r && i < this._deliveryQueue.end && (this._deliveryQueue.end--, i < this._deliveryQueue.i && this._deliveryQueue.i--);
			t.length = i;
		}
	}
	_deliver(e, t) {
		if (!e) return;
		const n = this._options?.onListenerError || Nt;
		if (!n) {
			e.value(t);
			return;
		}
		try {
			e.value(t);
		} catch (r) {
			n(r);
		}
	}
	_deliverQueue(e) {
		const t = e.current._listeners;
		for (; e.i < e.end;) this._deliver(t[e.i++], e.value);
		e.reset();
	}
	fire(e) {
		if (this._deliveryQueue?.current && (this._deliverQueue(this._deliveryQueue), this._perfMon?.stop()), this._perfMon?.start(this._size), this._listeners) if (this._listeners instanceof fn) this._deliver(this._listeners, e);
		else {
			const t = this._deliveryQueue;
			t.enqueue(this, e, this._listeners.length), this._deliverQueue(t);
		}
		this._perfMon?.stop();
	}
	hasListeners() {
		return this._size > 0;
	}
}, Fo = class {
	constructor() {
		this.i = -1, this.end = 0;
	}
	enqueue(e, t, n) {
		this.i = 0, this.end = n, this.current = e, this.value = t;
	}
	reset() {
		this.i = this.end, this.current = void 0, this.value = void 0;
	}
};
function Bo() {
	return globalThis._VSCODE_NLS_MESSAGES;
}
function Da() {
	return globalThis._VSCODE_NLS_LANGUAGE;
}
const Vo = Da() === "pseudo" || typeof document < "u" && document.location && typeof document.location.hash == "string" && document.location.hash.indexOf("pseudo=true") >= 0;
function Ri(e, t) {
	let n;
	return t.length === 0 ? n = e : n = e.replace(/\{(\d+)\}/g, (r, i) => {
		const s = t[i[0]];
		let a = r;
		return typeof s == "string" ? a = s : (typeof s == "number" || typeof s == "boolean" || s === void 0 || s === null) && (a = String(s)), a;
	}), Vo && (n = "［" + n.replace(/[aouei]/g, "$&$&") + "］"), n;
}
function F(e, t, ...n) {
	return Ri(typeof e == "number" ? jo(e, t) : t, n);
}
function jo(e, t) {
	const n = Bo()?.[e];
	if (typeof n != "string") {
		if (typeof t == "string") return t;
		throw new Error(`!!! NLS MISSING: ${e} !!!`);
	}
	return n;
}
let Xt = !1, Yt = !1, It = !1, Wa = !1, Me;
const ze = globalThis;
let he;
typeof ze.vscode < "u" && typeof ze.vscode.process < "u" ? he = ze.vscode.process : typeof process < "u" && typeof process?.versions?.node == "string" && (he = process);
const Yo = typeof he?.versions?.electron == "string" && he?.type === "renderer";
if (typeof he == "object") {
	Xt = he.platform === "win32", Yt = he.platform === "darwin", It = he.platform === "linux", It && he.env.SNAP && he.env.SNAP_REVISION, he.env.CI || he.env.BUILD_ARTIFACTSTAGINGDIRECTORY || he.env.GITHUB_WORKSPACE;
	const e = he.env.VSCODE_NLS_CONFIG;
	if (e) try {
		const t = JSON.parse(e);
		t.userLocale, t.osLocale, t.resolvedLanguage, t.languagePack?.translationsConfigFile;
	} catch {}
} else typeof navigator == "object" && !Yo ? (Me = navigator.userAgent, Xt = Me.indexOf("Windows") >= 0, Yt = Me.indexOf("Macintosh") >= 0, (Me.indexOf("Macintosh") >= 0 || Me.indexOf("iPad") >= 0 || Me.indexOf("iPhone") >= 0) && navigator.maxTouchPoints && navigator.maxTouchPoints, It = Me.indexOf("Linux") >= 0, Me?.indexOf("Mobi"), Wa = !0, Da(), navigator.language.toLowerCase()) : console.error("Unable to resolve platform.");
const St = Xt, Jo = Yt;
Wa && typeof ze.importScripts == "function" && ze.origin;
const Le = Me, Zo = typeof ze.postMessage == "function" && !ze.importScripts;
(() => {
	if (Zo) {
		const e = [];
		ze.addEventListener("message", (n) => {
			if (n.data && n.data.vscodeScheduleAsyncWork) for (let r = 0, i = e.length; r < i; r++) {
				const s = e[r];
				if (s.id === n.data.vscodeScheduleAsyncWork) {
					e.splice(r, 1), s.callback();
					return;
				}
			}
		});
		let t = 0;
		return (n) => {
			const r = ++t;
			e.push({
				id: r,
				callback: n
			}), ze.postMessage({ vscodeScheduleAsyncWork: r }, "*");
		};
	}
	return (e) => setTimeout(e);
})();
const el = !!(Le && Le.indexOf("Chrome") >= 0);
Le && Le.indexOf("Firefox");
!el && Le && Le.indexOf("Safari");
Le && Le.indexOf("Edg/");
Le && Le.indexOf("Android");
function tl(e) {
	return e;
}
var nl = class {
	constructor(e, t) {
		this.lastCache = void 0, this.lastArgKey = void 0, typeof e == "function" ? (this._fn = e, this._computeKey = tl) : (this._fn = t, this._computeKey = e.getCacheKey);
	}
	get(e) {
		const t = this._computeKey(e);
		return this.lastArgKey !== t && (this.lastArgKey = t, this.lastCache = this._fn(e)), this.lastCache;
	}
}, Be;
(function(e) {
	e[e.Uninitialized = 0] = "Uninitialized", e[e.Running = 1] = "Running", e[e.Completed = 2] = "Completed";
})(Be || (Be = {}));
var In = class {
	constructor(e) {
		this.executor = e, this._state = Be.Uninitialized;
	}
	get value() {
		if (this._state === Be.Uninitialized) {
			this._state = Be.Running;
			try {
				this._value = this.executor();
			} catch (e) {
				this._error = e;
			} finally {
				this._state = Be.Completed;
			}
		} else if (this._state === Be.Running) throw new Error("Cannot read the value of a lazy that is being initialized");
		if (this._error) throw this._error;
		return this._value;
	}
	get rawValue() {
		return this._value;
	}
};
function il(e) {
	return e.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&");
}
function rl(e) {
	return e.source === "^" || e.source === "^$" || e.source === "$" || e.source === "^\\s*$" ? !1 : !!(e.exec("") && e.lastIndex === 0);
}
function sl(e) {
	return e.split(/\r\n|\r|\n/);
}
function al(e) {
	for (let t = 0, n = e.length; t < n; t++) {
		const r = e.charCodeAt(t);
		if (r !== 32 && r !== 9) return t;
	}
	return -1;
}
function ol(e, t = e.length - 1) {
	for (let n = t; n >= 0; n--) {
		const r = e.charCodeAt(n);
		if (r !== 32 && r !== 9) return n;
	}
	return -1;
}
function Pa(e) {
	return e >= 65 && e <= 90;
}
function ll(e, t) {
	const n = Math.min(e.length, t.length);
	let r;
	for (r = 0; r < n; r++) if (e.charCodeAt(r) !== t.charCodeAt(r)) return r;
	return n;
}
function cl(e, t) {
	const n = Math.min(e.length, t.length);
	let r;
	const i = e.length - 1, s = t.length - 1;
	for (r = 0; r < n; r++) if (e.charCodeAt(i - r) !== t.charCodeAt(s - r)) return r;
	return n;
}
function Jt(e) {
	return 55296 <= e && e <= 56319;
}
function zn(e) {
	return 56320 <= e && e <= 57343;
}
function qa(e, t) {
	return (e - 55296 << 10) + (t - 56320) + 65536;
}
function hl(e, t, n) {
	const r = e.charCodeAt(n);
	if (Jt(r) && n + 1 < t) {
		const i = e.charCodeAt(n + 1);
		if (zn(i)) return qa(r, i);
	}
	return r;
}
const ul = /^[\t\n\r\x20-\x7E]*$/;
function dl(e) {
	return ul.test(e);
}
(class ft {
	static {
		this._INSTANCE = null;
	}
	static getInstance() {
		return ft._INSTANCE || (ft._INSTANCE = new ft()), ft._INSTANCE;
	}
	constructor() {
		this._data = ml();
	}
	getGraphemeBreakType(t) {
		if (t < 32) return t === 10 ? 3 : t === 13 ? 2 : 4;
		if (t < 127) return 0;
		const n = this._data, r = n.length / 3;
		let i = 1;
		for (; i <= r;) if (t < n[3 * i]) i = 2 * i;
		else if (t > n[3 * i + 1]) i = 2 * i + 1;
		else return n[3 * i + 2];
		return 0;
	}
});
function ml() {
	return JSON.parse("[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]");
}
var Hn = class pt {
	static {
		this.ambiguousCharacterData = new In(() => JSON.parse("{\"_common\":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,1523,96,8242,96,1370,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,118002,50,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,118003,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,118004,52,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,118005,53,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,118006,54,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,118007,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,118008,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,118009,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,117974,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,117975,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71913,67,71922,67,65315,67,8557,67,8450,67,8493,67,117976,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,117977,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,117978,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,117979,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,117980,71,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,117981,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,117983,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,117984,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,118001,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,117982,108,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,117985,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,117986,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,117987,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,118000,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,117988,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,117989,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,117990,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,117991,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,117992,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,117993,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,117994,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,117995,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71910,87,71919,87,117996,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,117997,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,117998,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,71909,90,66293,90,65338,90,8484,90,8488,90,117999,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65283,35,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],\"_default\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"cs\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"de\":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"es\":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"fr\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"it\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"ja\":[8211,45,8218,44,65281,33,8216,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65292,44,65297,49,65307,59],\"ko\":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"pl\":[65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"pt-BR\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"qps-ploc\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"ru\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"tr\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"zh-hans\":[160,32,65374,126,8218,44,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65297,49],\"zh-hant\":[8211,45,65374,126,8218,44,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89]}"));
	}
	static {
		this.cache = new nl({ getCacheKey: JSON.stringify }, (t) => {
			function n(l) {
				const c = /* @__PURE__ */ new Map();
				for (let u = 0; u < l.length; u += 2) c.set(l[u], l[u + 1]);
				return c;
			}
			function r(l, c) {
				const u = new Map(l);
				for (const [d, m] of c) u.set(d, m);
				return u;
			}
			function i(l, c) {
				if (!l) return c;
				const u = /* @__PURE__ */ new Map();
				for (const [d, m] of l) c.has(d) && u.set(d, m);
				return u;
			}
			const s = this.ambiguousCharacterData.value;
			let a = t.filter((l) => !l.startsWith("_") && Object.hasOwn(s, l));
			a.length === 0 && (a = ["_default"]);
			let o;
			for (const l of a) {
				const c = n(s[l]);
				o = i(o, c);
			}
			return new pt(r(n(s._common), o));
		});
	}
	static getInstance(t) {
		return pt.cache.get(Array.from(t));
	}
	static {
		this._locales = new In(() => Object.keys(pt.ambiguousCharacterData.value).filter((t) => !t.startsWith("_")));
	}
	static getLocales() {
		return pt._locales.value;
	}
	constructor(t) {
		this.confusableDictionary = t;
	}
	isAmbiguous(t) {
		return this.confusableDictionary.has(t);
	}
	getPrimaryConfusable(t) {
		return this.confusableDictionary.get(t);
	}
	getConfusableCodePoints() {
		return new Set(this.confusableDictionary.keys());
	}
}, bn = class zt {
	static getRawData() {
		return JSON.parse("{\"_common\":[11,12,13,127,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999],\"cs\":[173,8203,12288],\"de\":[173,8203,12288],\"es\":[8203,12288],\"fr\":[173,8203,12288],\"it\":[160,173,12288],\"ja\":[173],\"ko\":[173,12288],\"pl\":[173,8203,12288],\"pt-BR\":[173,8203,12288],\"qps-ploc\":[160,173,8203,12288],\"ru\":[173,12288],\"tr\":[160,173,8203,12288],\"zh-hans\":[160,173,8203,12288],\"zh-hant\":[173,12288]}");
	}
	static {
		this._data = void 0;
	}
	static getData() {
		return this._data || (this._data = new Set([...Object.values(zt.getRawData())].flat())), this._data;
	}
	static isInvisibleCharacter(t) {
		return zt.getData().has(t);
	}
	static get codePoints() {
		return zt.getData();
	}
};
const wn = "default", fl = "$initialize";
var pl = class {
	constructor(e, t, n, r, i) {
		this.vsWorker = e, this.req = t, this.channel = n, this.method = r, this.args = i, this.type = 0;
	}
}, Mi = class {
	constructor(e, t, n, r) {
		this.vsWorker = e, this.seq = t, this.res = n, this.err = r, this.type = 1;
	}
}, gl = class {
	constructor(e, t, n, r, i) {
		this.vsWorker = e, this.req = t, this.channel = n, this.eventName = r, this.arg = i, this.type = 2;
	}
}, bl = class {
	constructor(e, t, n) {
		this.vsWorker = e, this.req = t, this.event = n, this.type = 3;
	}
}, wl = class {
	constructor(e, t) {
		this.vsWorker = e, this.req = t, this.type = 4;
	}
}, _l = class {
	constructor(e) {
		this._workerId = -1, this._handler = e, this._lastSentReq = 0, this._pendingReplies = Object.create(null), this._pendingEmitters = /* @__PURE__ */ new Map(), this._pendingEvents = /* @__PURE__ */ new Map();
	}
	setWorkerId(e) {
		this._workerId = e;
	}
	async sendMessage(e, t, n) {
		const r = String(++this._lastSentReq);
		return new Promise((i, s) => {
			this._pendingReplies[r] = {
				resolve: i,
				reject: s
			}, this._send(new pl(this._workerId, r, e, t, n));
		});
	}
	listen(e, t, n) {
		let r = null;
		const i = new Se({
			onWillAddFirstListener: () => {
				r = String(++this._lastSentReq), this._pendingEmitters.set(r, i), this._send(new gl(this._workerId, r, e, t, n));
			},
			onDidRemoveLastListener: () => {
				this._pendingEmitters.delete(r), this._send(new wl(this._workerId, r)), r = null;
			}
		});
		return i.event;
	}
	handleMessage(e) {
		!e || !e.vsWorker || this._workerId !== -1 && e.vsWorker !== this._workerId || this._handleMessage(e);
	}
	createProxyToRemoteChannel(e, t) {
		return new Proxy(Object.create(null), { get: (n, r) => (typeof r == "string" && !n[r] && (Fa(r) ? n[r] = (i) => this.listen(e, r, i) : Oa(r) ? n[r] = this.listen(e, r, void 0) : r.charCodeAt(0) === 36 && (n[r] = async (...i) => (await t?.(), this.sendMessage(e, r, i)))), n[r]) });
	}
	_handleMessage(e) {
		switch (e.type) {
			case 1: return this._handleReplyMessage(e);
			case 0: return this._handleRequestMessage(e);
			case 2: return this._handleSubscribeEventMessage(e);
			case 3: return this._handleEventMessage(e);
			case 4: return this._handleUnsubscribeEventMessage(e);
		}
	}
	_handleReplyMessage(e) {
		if (!this._pendingReplies[e.seq]) {
			console.warn("Got reply to unknown seq");
			return;
		}
		const t = this._pendingReplies[e.seq];
		if (delete this._pendingReplies[e.seq], e.err) {
			let n = e.err;
			if (e.err.$isError) {
				const r = /* @__PURE__ */ new Error();
				r.name = e.err.name, r.message = e.err.message, r.stack = e.err.stack, n = r;
			}
			t.reject(n);
			return;
		}
		t.resolve(e.res);
	}
	_handleRequestMessage(e) {
		const t = e.req;
		this._handler.handleMessage(e.channel, e.method, e.args).then((n) => {
			this._send(new Mi(this._workerId, t, n, void 0));
		}, (n) => {
			n.detail instanceof Error && (n.detail = Rn(n.detail)), this._send(new Mi(this._workerId, t, void 0, Rn(n)));
		});
	}
	_handleSubscribeEventMessage(e) {
		const t = e.req, n = this._handler.handleEvent(e.channel, e.eventName, e.arg)((r) => {
			this._send(new bl(this._workerId, t, r));
		});
		this._pendingEvents.set(t, n);
	}
	_handleEventMessage(e) {
		if (!this._pendingEmitters.has(e.req)) {
			console.warn("Got event for unknown req");
			return;
		}
		this._pendingEmitters.get(e.req).fire(e.event);
	}
	_handleUnsubscribeEventMessage(e) {
		if (!this._pendingEvents.has(e.req)) {
			console.warn("Got unsubscribe for unknown req");
			return;
		}
		this._pendingEvents.get(e.req).dispose(), this._pendingEvents.delete(e.req);
	}
	_send(e) {
		const t = [];
		if (e.type === 0) for (let n = 0; n < e.args.length; n++) {
			const r = e.args[n];
			r instanceof ArrayBuffer && t.push(r);
		}
		else e.type === 1 && e.res instanceof ArrayBuffer && t.push(e.res);
		this._handler.sendMessage(e, t);
	}
};
function Oa(e) {
	return e[0] === "o" && e[1] === "n" && Pa(e.charCodeAt(2));
}
function Fa(e) {
	return /^onDynamic/.test(e) && Pa(e.charCodeAt(9));
}
var vl = class {
	constructor(e, t) {
		this._localChannels = /* @__PURE__ */ new Map(), this._remoteChannels = /* @__PURE__ */ new Map(), this._protocol = new _l({
			sendMessage: (n, r) => {
				e(n, r);
			},
			handleMessage: (n, r, i) => this._handleMessage(n, r, i),
			handleEvent: (n, r, i) => this._handleEvent(n, r, i)
		}), this.requestHandler = t(this);
	}
	onmessage(e) {
		this._protocol.handleMessage(e);
	}
	_handleMessage(e, t, n) {
		if (e === wn && t === fl) return this.initialize(n[0]);
		const r = e === wn ? this.requestHandler : this._localChannels.get(e);
		if (!r) return Promise.reject(/* @__PURE__ */ new Error(`Missing channel ${e} on worker thread`));
		const i = r[t];
		if (typeof i != "function") return Promise.reject(/* @__PURE__ */ new Error(`Missing method ${t} on worker thread channel ${e}`));
		try {
			return Promise.resolve(i.apply(r, n));
		} catch (s) {
			return Promise.reject(s);
		}
	}
	_handleEvent(e, t, n) {
		const r = e === wn ? this.requestHandler : this._localChannels.get(e);
		if (!r) throw new Error(`Missing channel ${e} on worker thread`);
		if (Fa(t)) {
			const i = r[t];
			if (typeof i != "function") throw new Error(`Missing dynamic event ${t} on request handler.`);
			const s = i.call(r, n);
			if (typeof s != "function") throw new Error(`Missing dynamic event ${t} on request handler.`);
			return s;
		}
		if (Oa(t)) {
			const i = r[t];
			if (typeof i != "function") throw new Error(`Missing event ${t} on request handler.`);
			return i;
		}
		throw new Error(`Malformed event name ${t}`);
	}
	getChannel(e) {
		if (!this._remoteChannels.has(e)) {
			const t = this._protocol.createProxyToRemoteChannel(e);
			this._remoteChannels.set(e, t);
		}
		return this._remoteChannels.get(e);
	}
	async initialize(e) {
		this._protocol.setWorkerId(e);
	}
};
let Ei = !1;
function yl(e) {
	if (Ei) throw new Error("WebWorker already initialized!");
	Ei = !0;
	const t = new vl((n) => globalThis.postMessage(n), (n) => e(n));
	return globalThis.onmessage = (n) => {
		t.onmessage(n.data);
	}, t;
}
var He = class {
	constructor(e, t, n, r) {
		this.originalStart = e, this.originalLength = t, this.modifiedStart = n, this.modifiedLength = r;
	}
	getOriginalEnd() {
		return this.originalStart + this.originalLength;
	}
	getModifiedEnd() {
		return this.modifiedStart + this.modifiedLength;
	}
};
const Ni = typeof Buffer < "u";
new In(() => new Uint8Array(256));
let _n;
var Tl = class Ba {
	static wrap(t) {
		return Ni && !Buffer.isBuffer(t) && (t = Buffer.from(t.buffer, t.byteOffset, t.byteLength)), new Ba(t);
	}
	constructor(t) {
		this.buffer = t, this.byteLength = this.buffer.byteLength;
	}
	toString() {
		return Ni ? this.buffer.toString() : (_n || (_n = new TextDecoder()), _n.decode(this.buffer));
	}
};
const Ci = "0123456789abcdef";
function kl({ buffer: e }) {
	let t = "";
	for (let n = 0; n < e.length; n++) {
		const r = e[n];
		t += Ci[r >>> 4], t += Ci[r & 15];
	}
	return t;
}
function Ii(e, t) {
	return (t << 5) - t + e | 0;
}
function Sl(e, t) {
	t = Ii(149417, t);
	for (let n = 0, r = e.length; n < r; n++) t = Ii(e.charCodeAt(n), t);
	return t;
}
function vn(e, t, n = 32) {
	const r = n - t, i = ~((1 << r) - 1);
	return (e << t | (i & e) >>> r) >>> 0;
}
function ht(e, t = 32) {
	return e instanceof ArrayBuffer ? kl(Tl.wrap(new Uint8Array(e))) : (e >>> 0).toString(16).padStart(t / 4, "0");
}
(class Va {
	static {
		this._bigBlock32 = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(320));
	}
	constructor() {
		this._h0 = 1732584193, this._h1 = 4023233417, this._h2 = 2562383102, this._h3 = 271733878, this._h4 = 3285377520, this._buff = new Uint8Array(67), this._buffDV = new DataView(this._buff.buffer), this._buffLen = 0, this._totalLen = 0, this._leftoverHighSurrogate = 0, this._finished = !1;
	}
	update(t) {
		const n = t.length;
		if (n === 0) return;
		const r = this._buff;
		let i = this._buffLen, s = this._leftoverHighSurrogate, a, o;
		for (s !== 0 ? (a = s, o = -1, s = 0) : (a = t.charCodeAt(0), o = 0);;) {
			let l = a;
			if (Jt(a)) if (o + 1 < n) {
				const c = t.charCodeAt(o + 1);
				zn(c) ? (o++, l = qa(a, c)) : l = 65533;
			} else {
				s = a;
				break;
			}
			else zn(a) && (l = 65533);
			if (i = this._push(r, i, l), o++, o < n) a = t.charCodeAt(o);
			else break;
		}
		this._buffLen = i, this._leftoverHighSurrogate = s;
	}
	_push(t, n, r) {
		return r < 128 ? t[n++] = r : r < 2048 ? (t[n++] = 192 | (r & 1984) >>> 6, t[n++] = 128 | (r & 63) >>> 0) : r < 65536 ? (t[n++] = 224 | (r & 61440) >>> 12, t[n++] = 128 | (r & 4032) >>> 6, t[n++] = 128 | (r & 63) >>> 0) : (t[n++] = 240 | (r & 1835008) >>> 18, t[n++] = 128 | (r & 258048) >>> 12, t[n++] = 128 | (r & 4032) >>> 6, t[n++] = 128 | (r & 63) >>> 0), n >= 64 && (this._step(), n -= 64, this._totalLen += 64, t[0] = t[64], t[1] = t[65], t[2] = t[66]), n;
	}
	digest() {
		return this._finished || (this._finished = !0, this._leftoverHighSurrogate && (this._leftoverHighSurrogate = 0, this._buffLen = this._push(this._buff, this._buffLen, 65533)), this._totalLen += this._buffLen, this._wrapUp()), ht(this._h0) + ht(this._h1) + ht(this._h2) + ht(this._h3) + ht(this._h4);
	}
	_wrapUp() {
		this._buff[this._buffLen++] = 128, this._buff.subarray(this._buffLen).fill(0), this._buffLen > 56 && (this._step(), this._buff.fill(0));
		const t = 8 * this._totalLen;
		this._buffDV.setUint32(56, Math.floor(t / 4294967296), !1), this._buffDV.setUint32(60, t % 4294967296, !1), this._step();
	}
	_step() {
		const t = Va._bigBlock32, n = this._buffDV;
		for (let d = 0; d < 64; d += 4) t.setUint32(d, n.getUint32(d, !1), !1);
		for (let d = 64; d < 320; d += 4) t.setUint32(d, vn(t.getUint32(d - 12, !1) ^ t.getUint32(d - 32, !1) ^ t.getUint32(d - 56, !1) ^ t.getUint32(d - 64, !1), 1), !1);
		let r = this._h0, i = this._h1, s = this._h2, a = this._h3, o = this._h4, l, c, u;
		for (let d = 0; d < 80; d++) d < 20 ? (l = i & s | ~i & a, c = 1518500249) : d < 40 ? (l = i ^ s ^ a, c = 1859775393) : d < 60 ? (l = i & s | i & a | s & a, c = 2400959708) : (l = i ^ s ^ a, c = 3395469782), u = vn(r, 5) + l + o + c + t.getUint32(d * 4, !1) & 4294967295, o = a, a = s, s = vn(i, 30), i = r, r = u;
		this._h0 = this._h0 + r & 4294967295, this._h1 = this._h1 + i & 4294967295, this._h2 = this._h2 + s & 4294967295, this._h3 = this._h3 + a & 4294967295, this._h4 = this._h4 + o & 4294967295;
	}
});
var zi = class {
	constructor(e) {
		this.source = e;
	}
	getElements() {
		const e = this.source, t = new Int32Array(e.length);
		for (let n = 0, r = e.length; n < r; n++) t[n] = e.charCodeAt(n);
		return t;
	}
};
function Ll(e, t, n) {
	return new ja(new zi(e), new zi(t)).ComputeDiff(n).changes;
}
var Ge = class {
	static Assert(e, t) {
		if (!e) throw new Error(t);
	}
}, Xe = class {
	static Copy(e, t, n, r, i) {
		for (let s = 0; s < i; s++) n[r + s] = e[t + s];
	}
	static Copy2(e, t, n, r, i) {
		for (let s = 0; s < i; s++) n[r + s] = e[t + s];
	}
}, Hi = class {
	constructor() {
		this.m_changes = [], this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824, this.m_originalCount = 0, this.m_modifiedCount = 0;
	}
	MarkNextChange() {
		(this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new He(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount)), this.m_originalCount = 0, this.m_modifiedCount = 0, this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824;
	}
	AddOriginalElement(e, t) {
		this.m_originalStart = Math.min(this.m_originalStart, e), this.m_modifiedStart = Math.min(this.m_modifiedStart, t), this.m_originalCount++;
	}
	AddModifiedElement(e, t) {
		this.m_originalStart = Math.min(this.m_originalStart, e), this.m_modifiedStart = Math.min(this.m_modifiedStart, t), this.m_modifiedCount++;
	}
	getChanges() {
		return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes;
	}
	getReverseChanges() {
		return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes.reverse(), this.m_changes;
	}
}, ja = class et {
	constructor(t, n, r = null) {
		this.ContinueProcessingPredicate = r, this._originalSequence = t, this._modifiedSequence = n;
		const [i, s, a] = et._getElements(t), [o, l, c] = et._getElements(n);
		this._hasStrings = a && c, this._originalStringElements = i, this._originalElementsOrHash = s, this._modifiedStringElements = o, this._modifiedElementsOrHash = l, this.m_forwardHistory = [], this.m_reverseHistory = [];
	}
	static _isStringArray(t) {
		return t.length > 0 && typeof t[0] == "string";
	}
	static _getElements(t) {
		const n = t.getElements();
		if (et._isStringArray(n)) {
			const r = new Int32Array(n.length);
			for (let i = 0, s = n.length; i < s; i++) r[i] = Sl(n[i], 0);
			return [
				n,
				r,
				!0
			];
		}
		return n instanceof Int32Array ? [
			[],
			n,
			!1
		] : [
			[],
			new Int32Array(n),
			!1
		];
	}
	ElementsAreEqual(t, n) {
		return this._originalElementsOrHash[t] !== this._modifiedElementsOrHash[n] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._modifiedStringElements[n] : !0;
	}
	ElementsAreStrictEqual(t, n) {
		return this.ElementsAreEqual(t, n) ? et._getStrictElement(this._originalSequence, t) === et._getStrictElement(this._modifiedSequence, n) : !1;
	}
	static _getStrictElement(t, n) {
		return typeof t.getStrictElement == "function" ? t.getStrictElement(n) : null;
	}
	OriginalElementsAreEqual(t, n) {
		return this._originalElementsOrHash[t] !== this._originalElementsOrHash[n] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._originalStringElements[n] : !0;
	}
	ModifiedElementsAreEqual(t, n) {
		return this._modifiedElementsOrHash[t] !== this._modifiedElementsOrHash[n] ? !1 : this._hasStrings ? this._modifiedStringElements[t] === this._modifiedStringElements[n] : !0;
	}
	ComputeDiff(t) {
		return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, t);
	}
	_ComputeDiff(t, n, r, i, s) {
		const a = [!1];
		let o = this.ComputeDiffRecursive(t, n, r, i, a);
		return s && (o = this.PrettifyChanges(o)), {
			quitEarly: a[0],
			changes: o
		};
	}
	ComputeDiffRecursive(t, n, r, i, s) {
		for (s[0] = !1; t <= n && r <= i && this.ElementsAreEqual(t, r);) t++, r++;
		for (; n >= t && i >= r && this.ElementsAreEqual(n, i);) n--, i--;
		if (t > n || r > i) {
			let d;
			return r <= i ? (Ge.Assert(t === n + 1, "originalStart should only be one more than originalEnd"), d = [new He(t, 0, r, i - r + 1)]) : t <= n ? (Ge.Assert(r === i + 1, "modifiedStart should only be one more than modifiedEnd"), d = [new He(t, n - t + 1, r, 0)]) : (Ge.Assert(t === n + 1, "originalStart should only be one more than originalEnd"), Ge.Assert(r === i + 1, "modifiedStart should only be one more than modifiedEnd"), d = []), d;
		}
		const a = [0], o = [0], l = this.ComputeRecursionPoint(t, n, r, i, a, o, s), c = a[0], u = o[0];
		if (l !== null) return l;
		if (!s[0]) {
			const d = this.ComputeDiffRecursive(t, c, r, u, s);
			let m = [];
			return s[0] ? m = [new He(c + 1, n - (c + 1) + 1, u + 1, i - (u + 1) + 1)] : m = this.ComputeDiffRecursive(c + 1, n, u + 1, i, s), this.ConcatenateChanges(d, m);
		}
		return [new He(t, n - t + 1, r, i - r + 1)];
	}
	WALKTRACE(t, n, r, i, s, a, o, l, c, u, d, m, p, b, g, v, T, k) {
		let E = null, I = null, D = new Hi(), w = n, f = r, _ = p[0] - v[0] - i, C = -1073741824, z = this.m_forwardHistory.length - 1;
		do {
			const L = _ + t;
			L === w || L < f && c[L - 1] < c[L + 1] ? (d = c[L + 1], b = d - _ - i, d < C && D.MarkNextChange(), C = d, D.AddModifiedElement(d + 1, b), _ = L + 1 - t) : (d = c[L - 1] + 1, b = d - _ - i, d < C && D.MarkNextChange(), C = d - 1, D.AddOriginalElement(d, b + 1), _ = L - 1 - t), z >= 0 && (c = this.m_forwardHistory[z], t = c[0], w = 1, f = c.length - 1);
		} while (--z >= -1);
		if (E = D.getReverseChanges(), k[0]) {
			let L = p[0] + 1, S = v[0] + 1;
			if (E !== null && E.length > 0) {
				const A = E[E.length - 1];
				L = Math.max(L, A.getOriginalEnd()), S = Math.max(S, A.getModifiedEnd());
			}
			I = [new He(L, m - L + 1, S, g - S + 1)];
		} else {
			D = new Hi(), w = a, f = o, _ = p[0] - v[0] - l, C = 1073741824, z = T ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
			do {
				const L = _ + s;
				L === w || L < f && u[L - 1] >= u[L + 1] ? (d = u[L + 1] - 1, b = d - _ - l, d > C && D.MarkNextChange(), C = d + 1, D.AddOriginalElement(d + 1, b + 1), _ = L + 1 - s) : (d = u[L - 1], b = d - _ - l, d > C && D.MarkNextChange(), C = d, D.AddModifiedElement(d + 1, b + 1), _ = L - 1 - s), z >= 0 && (u = this.m_reverseHistory[z], s = u[0], w = 1, f = u.length - 1);
			} while (--z >= -1);
			I = D.getChanges();
		}
		return this.ConcatenateChanges(E, I);
	}
	ComputeRecursionPoint(t, n, r, i, s, a, o) {
		let l = 0, c = 0, u = 0, d = 0, m = 0, p = 0;
		t--, r--, s[0] = 0, a[0] = 0, this.m_forwardHistory = [], this.m_reverseHistory = [];
		const b = n - t + (i - r), g = b + 1, v = new Int32Array(g), T = new Int32Array(g), k = i - r, E = n - t, I = t - r, D = n - i, w = (E - k) % 2 === 0;
		v[k] = t, T[E] = n, o[0] = !1;
		for (let f = 1; f <= b / 2 + 1; f++) {
			let _ = 0, C = 0;
			u = this.ClipDiagonalBound(k - f, f, k, g), d = this.ClipDiagonalBound(k + f, f, k, g);
			for (let L = u; L <= d; L += 2) {
				L === u || L < d && v[L - 1] < v[L + 1] ? l = v[L + 1] : l = v[L - 1] + 1, c = l - (L - k) - I;
				const S = l;
				for (; l < n && c < i && this.ElementsAreEqual(l + 1, c + 1);) l++, c++;
				if (v[L] = l, l + c > _ + C && (_ = l, C = c), !w && Math.abs(L - E) <= f - 1 && l >= T[L]) return s[0] = l, a[0] = c, S <= T[L] && f <= 1448 ? this.WALKTRACE(k, u, d, I, E, m, p, D, v, T, l, n, s, c, i, a, w, o) : null;
			}
			const z = (_ - t + (C - r) - f) / 2;
			if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(_, z)) return o[0] = !0, s[0] = _, a[0] = C, z > 0 && f <= 1448 ? this.WALKTRACE(k, u, d, I, E, m, p, D, v, T, l, n, s, c, i, a, w, o) : (t++, r++, [new He(t, n - t + 1, r, i - r + 1)]);
			m = this.ClipDiagonalBound(E - f, f, E, g), p = this.ClipDiagonalBound(E + f, f, E, g);
			for (let L = m; L <= p; L += 2) {
				L === m || L < p && T[L - 1] >= T[L + 1] ? l = T[L + 1] - 1 : l = T[L - 1], c = l - (L - E) - D;
				const S = l;
				for (; l > t && c > r && this.ElementsAreEqual(l, c);) l--, c--;
				if (T[L] = l, w && Math.abs(L - k) <= f && l <= v[L]) return s[0] = l, a[0] = c, S >= v[L] && f <= 1448 ? this.WALKTRACE(k, u, d, I, E, m, p, D, v, T, l, n, s, c, i, a, w, o) : null;
			}
			if (f <= 1447) {
				let L = new Int32Array(d - u + 2);
				L[0] = k - u + 1, Xe.Copy2(v, u, L, 1, d - u + 1), this.m_forwardHistory.push(L), L = new Int32Array(p - m + 2), L[0] = E - m + 1, Xe.Copy2(T, m, L, 1, p - m + 1), this.m_reverseHistory.push(L);
			}
		}
		return this.WALKTRACE(k, u, d, I, E, m, p, D, v, T, l, n, s, c, i, a, w, o);
	}
	PrettifyChanges(t) {
		for (let n = 0; n < t.length; n++) {
			const r = t[n], i = n < t.length - 1 ? t[n + 1].originalStart : this._originalElementsOrHash.length, s = n < t.length - 1 ? t[n + 1].modifiedStart : this._modifiedElementsOrHash.length, a = r.originalLength > 0, o = r.modifiedLength > 0;
			for (; r.originalStart + r.originalLength < i && r.modifiedStart + r.modifiedLength < s && (!a || this.OriginalElementsAreEqual(r.originalStart, r.originalStart + r.originalLength)) && (!o || this.ModifiedElementsAreEqual(r.modifiedStart, r.modifiedStart + r.modifiedLength));) {
				const c = this.ElementsAreStrictEqual(r.originalStart, r.modifiedStart);
				if (this.ElementsAreStrictEqual(r.originalStart + r.originalLength, r.modifiedStart + r.modifiedLength) && !c) break;
				r.originalStart++, r.modifiedStart++;
			}
			const l = [null];
			if (n < t.length - 1 && this.ChangesOverlap(t[n], t[n + 1], l)) {
				t[n] = l[0], t.splice(n + 1, 1), n--;
				continue;
			}
		}
		for (let n = t.length - 1; n >= 0; n--) {
			const r = t[n];
			let i = 0, s = 0;
			if (n > 0) {
				const d = t[n - 1];
				i = d.originalStart + d.originalLength, s = d.modifiedStart + d.modifiedLength;
			}
			const a = r.originalLength > 0, o = r.modifiedLength > 0;
			let l = 0, c = this._boundaryScore(r.originalStart, r.originalLength, r.modifiedStart, r.modifiedLength);
			for (let d = 1;; d++) {
				const m = r.originalStart - d, p = r.modifiedStart - d;
				if (m < i || p < s || a && !this.OriginalElementsAreEqual(m, m + r.originalLength) || o && !this.ModifiedElementsAreEqual(p, p + r.modifiedLength)) break;
				const b = (m === i && p === s ? 5 : 0) + this._boundaryScore(m, r.originalLength, p, r.modifiedLength);
				b > c && (c = b, l = d);
			}
			r.originalStart -= l, r.modifiedStart -= l;
			const u = [null];
			if (n > 0 && this.ChangesOverlap(t[n - 1], t[n], u)) {
				t[n - 1] = u[0], t.splice(n, 1), n++;
				continue;
			}
		}
		if (this._hasStrings) for (let n = 1, r = t.length; n < r; n++) {
			const i = t[n - 1], s = t[n], a = s.originalStart - i.originalStart - i.originalLength, o = i.originalStart, l = s.originalStart + s.originalLength, c = l - o, u = i.modifiedStart, d = s.modifiedStart + s.modifiedLength, m = d - u;
			if (a < 5 && c < 20 && m < 20) {
				const p = this._findBetterContiguousSequence(o, c, u, m, a);
				if (p) {
					const [b, g] = p;
					(b !== i.originalStart + i.originalLength || g !== i.modifiedStart + i.modifiedLength) && (i.originalLength = b - i.originalStart, i.modifiedLength = g - i.modifiedStart, s.originalStart = b + a, s.modifiedStart = g + a, s.originalLength = l - s.originalStart, s.modifiedLength = d - s.modifiedStart);
				}
			}
		}
		return t;
	}
	_findBetterContiguousSequence(t, n, r, i, s) {
		if (n < s || i < s) return null;
		const a = t + n - s + 1, o = r + i - s + 1;
		let l = 0, c = 0, u = 0;
		for (let d = t; d < a; d++) for (let m = r; m < o; m++) {
			const p = this._contiguousSequenceScore(d, m, s);
			p > 0 && p > l && (l = p, c = d, u = m);
		}
		return l > 0 ? [c, u] : null;
	}
	_contiguousSequenceScore(t, n, r) {
		let i = 0;
		for (let s = 0; s < r; s++) {
			if (!this.ElementsAreEqual(t + s, n + s)) return 0;
			i += this._originalStringElements[t + s].length;
		}
		return i;
	}
	_OriginalIsBoundary(t) {
		return t <= 0 || t >= this._originalElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._originalStringElements[t]);
	}
	_OriginalRegionIsBoundary(t, n) {
		if (this._OriginalIsBoundary(t) || this._OriginalIsBoundary(t - 1)) return !0;
		if (n > 0) {
			const r = t + n;
			if (this._OriginalIsBoundary(r - 1) || this._OriginalIsBoundary(r)) return !0;
		}
		return !1;
	}
	_ModifiedIsBoundary(t) {
		return t <= 0 || t >= this._modifiedElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._modifiedStringElements[t]);
	}
	_ModifiedRegionIsBoundary(t, n) {
		if (this._ModifiedIsBoundary(t) || this._ModifiedIsBoundary(t - 1)) return !0;
		if (n > 0) {
			const r = t + n;
			if (this._ModifiedIsBoundary(r - 1) || this._ModifiedIsBoundary(r)) return !0;
		}
		return !1;
	}
	_boundaryScore(t, n, r, i) {
		return (this._OriginalRegionIsBoundary(t, n) ? 1 : 0) + (this._ModifiedRegionIsBoundary(r, i) ? 1 : 0);
	}
	ConcatenateChanges(t, n) {
		const r = [];
		if (t.length === 0 || n.length === 0) return n.length > 0 ? n : t;
		if (this.ChangesOverlap(t[t.length - 1], n[0], r)) {
			const i = new Array(t.length + n.length - 1);
			return Xe.Copy(t, 0, i, 0, t.length - 1), i[t.length - 1] = r[0], Xe.Copy(n, 1, i, t.length, n.length - 1), i;
		} else {
			const i = new Array(t.length + n.length);
			return Xe.Copy(t, 0, i, 0, t.length), Xe.Copy(n, 0, i, t.length, n.length), i;
		}
	}
	ChangesOverlap(t, n, r) {
		if (Ge.Assert(t.originalStart <= n.originalStart, "Left change is not less than or equal to right change"), Ge.Assert(t.modifiedStart <= n.modifiedStart, "Left change is not less than or equal to right change"), t.originalStart + t.originalLength >= n.originalStart || t.modifiedStart + t.modifiedLength >= n.modifiedStart) {
			const i = t.originalStart;
			let s = t.originalLength;
			const a = t.modifiedStart;
			let o = t.modifiedLength;
			return t.originalStart + t.originalLength >= n.originalStart && (s = n.originalStart + n.originalLength - t.originalStart), t.modifiedStart + t.modifiedLength >= n.modifiedStart && (o = n.modifiedStart + n.modifiedLength - t.modifiedStart), r[0] = new He(i, s, a, o), !0;
		} else return r[0] = null, !1;
	}
	ClipDiagonalBound(t, n, r, i) {
		if (t >= 0 && t < i) return t;
		const s = r, a = i - r - 1, o = n % 2 === 0;
		return t < 0 ? o === (s % 2 === 0) ? 0 : 1 : o === (a % 2 === 0) ? i - 1 : i - 2;
	}
}, Y = class qe {
	constructor(t, n) {
		this.lineNumber = t, this.column = n;
	}
	with(t = this.lineNumber, n = this.column) {
		return t === this.lineNumber && n === this.column ? this : new qe(t, n);
	}
	delta(t = 0, n = 0) {
		return this.with(Math.max(1, this.lineNumber + t), Math.max(1, this.column + n));
	}
	equals(t) {
		return qe.equals(this, t);
	}
	static equals(t, n) {
		return !t && !n ? !0 : !!t && !!n && t.lineNumber === n.lineNumber && t.column === n.column;
	}
	isBefore(t) {
		return qe.isBefore(this, t);
	}
	static isBefore(t, n) {
		return t.lineNumber < n.lineNumber ? !0 : n.lineNumber < t.lineNumber ? !1 : t.column < n.column;
	}
	isBeforeOrEqual(t) {
		return qe.isBeforeOrEqual(this, t);
	}
	static isBeforeOrEqual(t, n) {
		return t.lineNumber < n.lineNumber ? !0 : n.lineNumber < t.lineNumber ? !1 : t.column <= n.column;
	}
	static compare(t, n) {
		const r = t.lineNumber | 0, i = n.lineNumber | 0;
		return r === i ? (t.column | 0) - (n.column | 0) : r - i;
	}
	clone() {
		return new qe(this.lineNumber, this.column);
	}
	toString() {
		return "(" + this.lineNumber + "," + this.column + ")";
	}
	static lift(t) {
		return new qe(t.lineNumber, t.column);
	}
	static isIPosition(t) {
		return !!t && typeof t.lineNumber == "number" && typeof t.column == "number";
	}
	toJSON() {
		return {
			lineNumber: this.lineNumber,
			column: this.column
		};
	}
}, j = class te {
	constructor(t, n, r, i) {
		t > r || t === r && n > i ? (this.startLineNumber = r, this.startColumn = i, this.endLineNumber = t, this.endColumn = n) : (this.startLineNumber = t, this.startColumn = n, this.endLineNumber = r, this.endColumn = i);
	}
	isEmpty() {
		return te.isEmpty(this);
	}
	static isEmpty(t) {
		return t.startLineNumber === t.endLineNumber && t.startColumn === t.endColumn;
	}
	containsPosition(t) {
		return te.containsPosition(this, t);
	}
	static containsPosition(t, n) {
		return !(n.lineNumber < t.startLineNumber || n.lineNumber > t.endLineNumber || n.lineNumber === t.startLineNumber && n.column < t.startColumn || n.lineNumber === t.endLineNumber && n.column > t.endColumn);
	}
	static strictContainsPosition(t, n) {
		return !(n.lineNumber < t.startLineNumber || n.lineNumber > t.endLineNumber || n.lineNumber === t.startLineNumber && n.column <= t.startColumn || n.lineNumber === t.endLineNumber && n.column >= t.endColumn);
	}
	containsRange(t) {
		return te.containsRange(this, t);
	}
	static containsRange(t, n) {
		return !(n.startLineNumber < t.startLineNumber || n.endLineNumber < t.startLineNumber || n.startLineNumber > t.endLineNumber || n.endLineNumber > t.endLineNumber || n.startLineNumber === t.startLineNumber && n.startColumn < t.startColumn || n.endLineNumber === t.endLineNumber && n.endColumn > t.endColumn);
	}
	strictContainsRange(t) {
		return te.strictContainsRange(this, t);
	}
	static strictContainsRange(t, n) {
		return !(n.startLineNumber < t.startLineNumber || n.endLineNumber < t.startLineNumber || n.startLineNumber > t.endLineNumber || n.endLineNumber > t.endLineNumber || n.startLineNumber === t.startLineNumber && n.startColumn <= t.startColumn || n.endLineNumber === t.endLineNumber && n.endColumn >= t.endColumn);
	}
	plusRange(t) {
		return te.plusRange(this, t);
	}
	static plusRange(t, n) {
		let r, i, s, a;
		return n.startLineNumber < t.startLineNumber ? (r = n.startLineNumber, i = n.startColumn) : n.startLineNumber === t.startLineNumber ? (r = n.startLineNumber, i = Math.min(n.startColumn, t.startColumn)) : (r = t.startLineNumber, i = t.startColumn), n.endLineNumber > t.endLineNumber ? (s = n.endLineNumber, a = n.endColumn) : n.endLineNumber === t.endLineNumber ? (s = n.endLineNumber, a = Math.max(n.endColumn, t.endColumn)) : (s = t.endLineNumber, a = t.endColumn), new te(r, i, s, a);
	}
	intersectRanges(t) {
		return te.intersectRanges(this, t);
	}
	static intersectRanges(t, n) {
		let r = t.startLineNumber, i = t.startColumn, s = t.endLineNumber, a = t.endColumn;
		const o = n.startLineNumber, l = n.startColumn, c = n.endLineNumber, u = n.endColumn;
		return r < o ? (r = o, i = l) : r === o && (i = Math.max(i, l)), s > c ? (s = c, a = u) : s === c && (a = Math.min(a, u)), r > s || r === s && i > a ? null : new te(r, i, s, a);
	}
	equalsRange(t) {
		return te.equalsRange(this, t);
	}
	static equalsRange(t, n) {
		return !t && !n ? !0 : !!t && !!n && t.startLineNumber === n.startLineNumber && t.startColumn === n.startColumn && t.endLineNumber === n.endLineNumber && t.endColumn === n.endColumn;
	}
	getEndPosition() {
		return te.getEndPosition(this);
	}
	static getEndPosition(t) {
		return new Y(t.endLineNumber, t.endColumn);
	}
	getStartPosition() {
		return te.getStartPosition(this);
	}
	static getStartPosition(t) {
		return new Y(t.startLineNumber, t.startColumn);
	}
	toString() {
		return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
	}
	setEndPosition(t, n) {
		return new te(this.startLineNumber, this.startColumn, t, n);
	}
	setStartPosition(t, n) {
		return new te(t, n, this.endLineNumber, this.endColumn);
	}
	collapseToStart() {
		return te.collapseToStart(this);
	}
	static collapseToStart(t) {
		return new te(t.startLineNumber, t.startColumn, t.startLineNumber, t.startColumn);
	}
	collapseToEnd() {
		return te.collapseToEnd(this);
	}
	static collapseToEnd(t) {
		return new te(t.endLineNumber, t.endColumn, t.endLineNumber, t.endColumn);
	}
	delta(t) {
		return new te(this.startLineNumber + t, this.startColumn, this.endLineNumber + t, this.endColumn);
	}
	isSingleLine() {
		return this.startLineNumber === this.endLineNumber;
	}
	static fromPositions(t, n = t) {
		return new te(t.lineNumber, t.column, n.lineNumber, n.column);
	}
	static lift(t) {
		return t ? new te(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : null;
	}
	static isIRange(t) {
		return !!t && typeof t.startLineNumber == "number" && typeof t.startColumn == "number" && typeof t.endLineNumber == "number" && typeof t.endColumn == "number";
	}
	static areIntersectingOrTouching(t, n) {
		return !(t.endLineNumber < n.startLineNumber || t.endLineNumber === n.startLineNumber && t.endColumn < n.startColumn || n.endLineNumber < t.startLineNumber || n.endLineNumber === t.startLineNumber && n.endColumn < t.startColumn);
	}
	static areIntersecting(t, n) {
		return !(t.endLineNumber < n.startLineNumber || t.endLineNumber === n.startLineNumber && t.endColumn <= n.startColumn || n.endLineNumber < t.startLineNumber || n.endLineNumber === t.startLineNumber && n.endColumn <= t.startColumn);
	}
	static areOnlyIntersecting(t, n) {
		return !(t.endLineNumber < n.startLineNumber - 1 || t.endLineNumber === n.startLineNumber && t.endColumn < n.startColumn - 1 || n.endLineNumber < t.startLineNumber - 1 || n.endLineNumber === t.startLineNumber && n.endColumn < t.startColumn - 1);
	}
	static compareRangesUsingStarts(t, n) {
		if (t && n) {
			const r = t.startLineNumber | 0, i = n.startLineNumber | 0;
			if (r === i) {
				const s = t.startColumn | 0, a = n.startColumn | 0;
				if (s === a) {
					const o = t.endLineNumber | 0, l = n.endLineNumber | 0;
					return o === l ? (t.endColumn | 0) - (n.endColumn | 0) : o - l;
				}
				return s - a;
			}
			return r - i;
		}
		return (t ? 1 : 0) - (n ? 1 : 0);
	}
	static compareRangesUsingEnds(t, n) {
		return t.endLineNumber === n.endLineNumber ? t.endColumn === n.endColumn ? t.startLineNumber === n.startLineNumber ? t.startColumn - n.startColumn : t.startLineNumber - n.startLineNumber : t.endColumn - n.endColumn : t.endLineNumber - n.endLineNumber;
	}
	static spansMultipleLines(t) {
		return t.endLineNumber > t.startLineNumber;
	}
	toJSON() {
		return this;
	}
};
function Ui(e) {
	return e < 0 ? 0 : e > 255 ? 255 : e | 0;
}
function Ye(e) {
	return e < 0 ? 0 : e > 4294967295 ? 4294967295 : e | 0;
}
var xl = class $a {
	constructor(t) {
		const n = Ui(t);
		this._defaultValue = n, this._asciiMap = $a._createAsciiMap(n), this._map = /* @__PURE__ */ new Map();
	}
	static _createAsciiMap(t) {
		const n = new Uint8Array(256);
		return n.fill(t), n;
	}
	set(t, n) {
		const r = Ui(n);
		t >= 0 && t < 256 ? this._asciiMap[t] = r : this._map.set(t, r);
	}
	get(t) {
		return t >= 0 && t < 256 ? this._asciiMap[t] : this._map.get(t) || this._defaultValue;
	}
	clear() {
		this._asciiMap.fill(this._defaultValue), this._map.clear();
	}
}, Al = class {
	constructor(e, t, n) {
		const r = new Uint8Array(e * t);
		for (let i = 0, s = e * t; i < s; i++) r[i] = n;
		this._data = r, this.rows = e, this.cols = t;
	}
	get(e, t) {
		return this._data[e * this.cols + t];
	}
	set(e, t, n) {
		this._data[e * this.cols + t] = n;
	}
}, Rl = class {
	constructor(e) {
		let t = 0, n = 0;
		for (let i = 0, s = e.length; i < s; i++) {
			const [a, o, l] = e[i];
			o > t && (t = o), a > n && (n = a), l > n && (n = l);
		}
		t++, n++;
		const r = new Al(n, t, 0);
		for (let i = 0, s = e.length; i < s; i++) {
			const [a, o, l] = e[i];
			r.set(a, o, l);
		}
		this._states = r, this._maxCharCode = t;
	}
	nextState(e, t) {
		return t < 0 || t >= this._maxCharCode ? 0 : this._states.get(e, t);
	}
};
let yn = null;
function Ml() {
	return yn === null && (yn = new Rl([
		[
			1,
			104,
			2
		],
		[
			1,
			72,
			2
		],
		[
			1,
			102,
			6
		],
		[
			1,
			70,
			6
		],
		[
			2,
			116,
			3
		],
		[
			2,
			84,
			3
		],
		[
			3,
			116,
			4
		],
		[
			3,
			84,
			4
		],
		[
			4,
			112,
			5
		],
		[
			4,
			80,
			5
		],
		[
			5,
			115,
			9
		],
		[
			5,
			83,
			9
		],
		[
			5,
			58,
			10
		],
		[
			6,
			105,
			7
		],
		[
			6,
			73,
			7
		],
		[
			7,
			108,
			8
		],
		[
			7,
			76,
			8
		],
		[
			8,
			101,
			9
		],
		[
			8,
			69,
			9
		],
		[
			9,
			58,
			10
		],
		[
			10,
			47,
			11
		],
		[
			11,
			47,
			12
		]
	])), yn;
}
let ut = null;
function El() {
	if (ut === null) {
		ut = new xl(0);
		const e = ` 	<>'"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…|`;
		for (let n = 0; n < 36; n++) ut.set(e.charCodeAt(n), 1);
		const t = ".,;:";
		for (let n = 0; n < 4; n++) ut.set(t.charCodeAt(n), 2);
	}
	return ut;
}
var Nl = class Un {
	static _createLink(t, n, r, i, s) {
		let a = s - 1;
		do {
			const o = n.charCodeAt(a);
			if (t.get(o) !== 2) break;
			a--;
		} while (a > i);
		if (i > 0) {
			const o = n.charCodeAt(i - 1), l = n.charCodeAt(a);
			(o === 40 && l === 41 || o === 91 && l === 93 || o === 123 && l === 125) && a--;
		}
		return {
			range: {
				startLineNumber: r,
				startColumn: i + 1,
				endLineNumber: r,
				endColumn: a + 2
			},
			url: n.substring(i, a + 1)
		};
	}
	static computeLinks(t, n = Ml()) {
		const r = El(), i = [];
		for (let s = 1, a = t.getLineCount(); s <= a; s++) {
			const o = t.getLineContent(s), l = o.length;
			let c = 0, u = 0, d = 0, m = 1, p = !1, b = !1, g = !1, v = !1;
			for (; c < l;) {
				let T = !1;
				const k = o.charCodeAt(c);
				if (m === 13) {
					let E;
					switch (k) {
						case 40:
							p = !0, E = 0;
							break;
						case 41:
							E = p ? 0 : 1;
							break;
						case 91:
							g = !0, b = !0, E = 0;
							break;
						case 93:
							g = !1, E = b ? 0 : 1;
							break;
						case 123:
							v = !0, E = 0;
							break;
						case 125:
							E = v ? 0 : 1;
							break;
						case 39:
						case 34:
						case 96:
							d === k ? E = 1 : d === 39 || d === 34 || d === 96 ? E = 0 : E = 1;
							break;
						case 42:
							E = d === 42 ? 1 : 0;
							break;
						case 32:
							E = g ? 0 : 1;
							break;
						default: E = r.get(k);
					}
					E === 1 && (i.push(Un._createLink(r, o, s, u, c)), T = !0);
				} else if (m === 12) {
					let E;
					k === 91 ? (b = !0, E = 0) : E = r.get(k), E === 1 ? T = !0 : m = 13;
				} else m = n.nextState(m, k), m === 0 && (T = !0);
				T && (m = 1, p = !1, b = !1, v = !1, u = c + 1, d = k), c++;
			}
			m === 13 && i.push(Un._createLink(r, o, s, u, l));
		}
		return i;
	}
};
function Cl(e) {
	return !e || typeof e.getLineCount != "function" || typeof e.getLineContent != "function" ? [] : Nl.computeLinks(e);
}
var Il = class Ga {
	constructor() {
		this._defaultValueSet = [
			["true", "false"],
			["True", "False"],
			[
				"Private",
				"Public",
				"Friend",
				"ReadOnly",
				"Partial",
				"Protected",
				"WriteOnly"
			],
			[
				"public",
				"protected",
				"private"
			]
		];
	}
	static {
		this.INSTANCE = new Ga();
	}
	navigateValueSet(t, n, r, i, s) {
		if (t && n) {
			const a = this.doNavigateValueSet(n, s);
			if (a) return {
				range: t,
				value: a
			};
		}
		if (r && i) {
			const a = this.doNavigateValueSet(i, s);
			if (a) return {
				range: r,
				value: a
			};
		}
		return null;
	}
	doNavigateValueSet(t, n) {
		const r = this.numberReplace(t, n);
		return r !== null ? r : this.textReplace(t, n);
	}
	numberReplace(t, n) {
		const r = Math.pow(10, t.length - (t.lastIndexOf(".") + 1));
		let i = Number(t);
		const s = parseFloat(t);
		return !isNaN(i) && !isNaN(s) && i === s ? i === 0 && !n ? null : (i = Math.floor(i * r), i += n ? r : -r, String(i / r)) : null;
	}
	textReplace(t, n) {
		return this.valueSetsReplace(this._defaultValueSet, t, n);
	}
	valueSetsReplace(t, n, r) {
		let i = null;
		for (let s = 0, a = t.length; i === null && s < a; s++) i = this.valueSetReplace(t[s], n, r);
		return i;
	}
	valueSetReplace(t, n, r) {
		let i = t.indexOf(n);
		return i >= 0 ? (i += r ? 1 : -1, i < 0 ? i = t.length - 1 : i %= t.length, t[i]) : null;
	}
};
const Xa = Object.freeze(function(e, t) {
	const n = setTimeout(e.bind(t), 0);
	return { dispose() {
		clearTimeout(n);
	} };
});
var Qt;
(function(e) {
	function t(n) {
		return n === e.None || n === e.Cancelled || n instanceof Ht ? !0 : !n || typeof n != "object" ? !1 : typeof n.isCancellationRequested == "boolean" && typeof n.onCancellationRequested == "function";
	}
	e.isCancellationToken = t, e.None = Object.freeze({
		isCancellationRequested: !1,
		onCancellationRequested: Nn.None
	}), e.Cancelled = Object.freeze({
		isCancellationRequested: !0,
		onCancellationRequested: Xa
	});
})(Qt || (Qt = {}));
var Ht = class {
	constructor() {
		this._isCancelled = !1, this._emitter = null;
	}
	cancel() {
		this._isCancelled || (this._isCancelled = !0, this._emitter && (this._emitter.fire(void 0), this.dispose()));
	}
	get isCancellationRequested() {
		return this._isCancelled;
	}
	get onCancellationRequested() {
		return this._isCancelled ? Xa : (this._emitter || (this._emitter = new Se()), this._emitter.event);
	}
	dispose() {
		this._emitter && (this._emitter.dispose(), this._emitter = null);
	}
}, zl = class {
	constructor(e) {
		this._token = void 0, this._parentListener = void 0, this._parentListener = e && e.onCancellationRequested(this.cancel, this);
	}
	get token() {
		return this._token || (this._token = new Ht()), this._token;
	}
	cancel() {
		this._token ? this._token instanceof Ht && this._token.cancel() : this._token = Qt.Cancelled;
	}
	dispose(e = !1) {
		e && this.cancel(), this._parentListener?.dispose(), this._token ? this._token instanceof Ht && this._token.dispose() : this._token = Qt.None;
	}
}, ki = class {
	constructor() {
		this._keyCodeToStr = [], this._strToKeyCode = Object.create(null);
	}
	define(e, t) {
		this._keyCodeToStr[e] = t, this._strToKeyCode[t.toLowerCase()] = e;
	}
	keyCodeToStr(e) {
		return this._keyCodeToStr[e];
	}
	strToKeyCode(e) {
		return this._strToKeyCode[e.toLowerCase()] || 0;
	}
};
const Ut = new ki(), Dn = new ki(), Wn = new ki(), Hl = new Array(230), Ul = Object.create(null), Dl = Object.create(null), Ya = [];
for (let e = 0; e <= 193; e++) Ya[e] = -1;
(function() {
	const t = [
		[
			1,
			0,
			"None",
			0,
			"unknown",
			0,
			"VK_UNKNOWN",
			"",
			""
		],
		[
			1,
			1,
			"Hyper",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			2,
			"Super",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			3,
			"Fn",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			4,
			"FnLock",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			5,
			"Suspend",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			6,
			"Resume",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			7,
			"Turbo",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			8,
			"Sleep",
			0,
			"",
			0,
			"VK_SLEEP",
			"",
			""
		],
		[
			1,
			9,
			"WakeUp",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			0,
			10,
			"KeyA",
			31,
			"A",
			65,
			"VK_A",
			"",
			""
		],
		[
			0,
			11,
			"KeyB",
			32,
			"B",
			66,
			"VK_B",
			"",
			""
		],
		[
			0,
			12,
			"KeyC",
			33,
			"C",
			67,
			"VK_C",
			"",
			""
		],
		[
			0,
			13,
			"KeyD",
			34,
			"D",
			68,
			"VK_D",
			"",
			""
		],
		[
			0,
			14,
			"KeyE",
			35,
			"E",
			69,
			"VK_E",
			"",
			""
		],
		[
			0,
			15,
			"KeyF",
			36,
			"F",
			70,
			"VK_F",
			"",
			""
		],
		[
			0,
			16,
			"KeyG",
			37,
			"G",
			71,
			"VK_G",
			"",
			""
		],
		[
			0,
			17,
			"KeyH",
			38,
			"H",
			72,
			"VK_H",
			"",
			""
		],
		[
			0,
			18,
			"KeyI",
			39,
			"I",
			73,
			"VK_I",
			"",
			""
		],
		[
			0,
			19,
			"KeyJ",
			40,
			"J",
			74,
			"VK_J",
			"",
			""
		],
		[
			0,
			20,
			"KeyK",
			41,
			"K",
			75,
			"VK_K",
			"",
			""
		],
		[
			0,
			21,
			"KeyL",
			42,
			"L",
			76,
			"VK_L",
			"",
			""
		],
		[
			0,
			22,
			"KeyM",
			43,
			"M",
			77,
			"VK_M",
			"",
			""
		],
		[
			0,
			23,
			"KeyN",
			44,
			"N",
			78,
			"VK_N",
			"",
			""
		],
		[
			0,
			24,
			"KeyO",
			45,
			"O",
			79,
			"VK_O",
			"",
			""
		],
		[
			0,
			25,
			"KeyP",
			46,
			"P",
			80,
			"VK_P",
			"",
			""
		],
		[
			0,
			26,
			"KeyQ",
			47,
			"Q",
			81,
			"VK_Q",
			"",
			""
		],
		[
			0,
			27,
			"KeyR",
			48,
			"R",
			82,
			"VK_R",
			"",
			""
		],
		[
			0,
			28,
			"KeyS",
			49,
			"S",
			83,
			"VK_S",
			"",
			""
		],
		[
			0,
			29,
			"KeyT",
			50,
			"T",
			84,
			"VK_T",
			"",
			""
		],
		[
			0,
			30,
			"KeyU",
			51,
			"U",
			85,
			"VK_U",
			"",
			""
		],
		[
			0,
			31,
			"KeyV",
			52,
			"V",
			86,
			"VK_V",
			"",
			""
		],
		[
			0,
			32,
			"KeyW",
			53,
			"W",
			87,
			"VK_W",
			"",
			""
		],
		[
			0,
			33,
			"KeyX",
			54,
			"X",
			88,
			"VK_X",
			"",
			""
		],
		[
			0,
			34,
			"KeyY",
			55,
			"Y",
			89,
			"VK_Y",
			"",
			""
		],
		[
			0,
			35,
			"KeyZ",
			56,
			"Z",
			90,
			"VK_Z",
			"",
			""
		],
		[
			0,
			36,
			"Digit1",
			22,
			"1",
			49,
			"VK_1",
			"",
			""
		],
		[
			0,
			37,
			"Digit2",
			23,
			"2",
			50,
			"VK_2",
			"",
			""
		],
		[
			0,
			38,
			"Digit3",
			24,
			"3",
			51,
			"VK_3",
			"",
			""
		],
		[
			0,
			39,
			"Digit4",
			25,
			"4",
			52,
			"VK_4",
			"",
			""
		],
		[
			0,
			40,
			"Digit5",
			26,
			"5",
			53,
			"VK_5",
			"",
			""
		],
		[
			0,
			41,
			"Digit6",
			27,
			"6",
			54,
			"VK_6",
			"",
			""
		],
		[
			0,
			42,
			"Digit7",
			28,
			"7",
			55,
			"VK_7",
			"",
			""
		],
		[
			0,
			43,
			"Digit8",
			29,
			"8",
			56,
			"VK_8",
			"",
			""
		],
		[
			0,
			44,
			"Digit9",
			30,
			"9",
			57,
			"VK_9",
			"",
			""
		],
		[
			0,
			45,
			"Digit0",
			21,
			"0",
			48,
			"VK_0",
			"",
			""
		],
		[
			1,
			46,
			"Enter",
			3,
			"Enter",
			13,
			"VK_RETURN",
			"",
			""
		],
		[
			1,
			47,
			"Escape",
			9,
			"Escape",
			27,
			"VK_ESCAPE",
			"",
			""
		],
		[
			1,
			48,
			"Backspace",
			1,
			"Backspace",
			8,
			"VK_BACK",
			"",
			""
		],
		[
			1,
			49,
			"Tab",
			2,
			"Tab",
			9,
			"VK_TAB",
			"",
			""
		],
		[
			1,
			50,
			"Space",
			10,
			"Space",
			32,
			"VK_SPACE",
			"",
			""
		],
		[
			0,
			51,
			"Minus",
			88,
			"-",
			189,
			"VK_OEM_MINUS",
			"-",
			"OEM_MINUS"
		],
		[
			0,
			52,
			"Equal",
			86,
			"=",
			187,
			"VK_OEM_PLUS",
			"=",
			"OEM_PLUS"
		],
		[
			0,
			53,
			"BracketLeft",
			92,
			"[",
			219,
			"VK_OEM_4",
			"[",
			"OEM_4"
		],
		[
			0,
			54,
			"BracketRight",
			94,
			"]",
			221,
			"VK_OEM_6",
			"]",
			"OEM_6"
		],
		[
			0,
			55,
			"Backslash",
			93,
			"\\",
			220,
			"VK_OEM_5",
			"\\",
			"OEM_5"
		],
		[
			0,
			56,
			"IntlHash",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			0,
			57,
			"Semicolon",
			85,
			";",
			186,
			"VK_OEM_1",
			";",
			"OEM_1"
		],
		[
			0,
			58,
			"Quote",
			95,
			"'",
			222,
			"VK_OEM_7",
			"'",
			"OEM_7"
		],
		[
			0,
			59,
			"Backquote",
			91,
			"`",
			192,
			"VK_OEM_3",
			"`",
			"OEM_3"
		],
		[
			0,
			60,
			"Comma",
			87,
			",",
			188,
			"VK_OEM_COMMA",
			",",
			"OEM_COMMA"
		],
		[
			0,
			61,
			"Period",
			89,
			".",
			190,
			"VK_OEM_PERIOD",
			".",
			"OEM_PERIOD"
		],
		[
			0,
			62,
			"Slash",
			90,
			"/",
			191,
			"VK_OEM_2",
			"/",
			"OEM_2"
		],
		[
			1,
			63,
			"CapsLock",
			8,
			"CapsLock",
			20,
			"VK_CAPITAL",
			"",
			""
		],
		[
			1,
			64,
			"F1",
			59,
			"F1",
			112,
			"VK_F1",
			"",
			""
		],
		[
			1,
			65,
			"F2",
			60,
			"F2",
			113,
			"VK_F2",
			"",
			""
		],
		[
			1,
			66,
			"F3",
			61,
			"F3",
			114,
			"VK_F3",
			"",
			""
		],
		[
			1,
			67,
			"F4",
			62,
			"F4",
			115,
			"VK_F4",
			"",
			""
		],
		[
			1,
			68,
			"F5",
			63,
			"F5",
			116,
			"VK_F5",
			"",
			""
		],
		[
			1,
			69,
			"F6",
			64,
			"F6",
			117,
			"VK_F6",
			"",
			""
		],
		[
			1,
			70,
			"F7",
			65,
			"F7",
			118,
			"VK_F7",
			"",
			""
		],
		[
			1,
			71,
			"F8",
			66,
			"F8",
			119,
			"VK_F8",
			"",
			""
		],
		[
			1,
			72,
			"F9",
			67,
			"F9",
			120,
			"VK_F9",
			"",
			""
		],
		[
			1,
			73,
			"F10",
			68,
			"F10",
			121,
			"VK_F10",
			"",
			""
		],
		[
			1,
			74,
			"F11",
			69,
			"F11",
			122,
			"VK_F11",
			"",
			""
		],
		[
			1,
			75,
			"F12",
			70,
			"F12",
			123,
			"VK_F12",
			"",
			""
		],
		[
			1,
			76,
			"PrintScreen",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			77,
			"ScrollLock",
			84,
			"ScrollLock",
			145,
			"VK_SCROLL",
			"",
			""
		],
		[
			1,
			78,
			"Pause",
			7,
			"PauseBreak",
			19,
			"VK_PAUSE",
			"",
			""
		],
		[
			1,
			79,
			"Insert",
			19,
			"Insert",
			45,
			"VK_INSERT",
			"",
			""
		],
		[
			1,
			80,
			"Home",
			14,
			"Home",
			36,
			"VK_HOME",
			"",
			""
		],
		[
			1,
			81,
			"PageUp",
			11,
			"PageUp",
			33,
			"VK_PRIOR",
			"",
			""
		],
		[
			1,
			82,
			"Delete",
			20,
			"Delete",
			46,
			"VK_DELETE",
			"",
			""
		],
		[
			1,
			83,
			"End",
			13,
			"End",
			35,
			"VK_END",
			"",
			""
		],
		[
			1,
			84,
			"PageDown",
			12,
			"PageDown",
			34,
			"VK_NEXT",
			"",
			""
		],
		[
			1,
			85,
			"ArrowRight",
			17,
			"RightArrow",
			39,
			"VK_RIGHT",
			"Right",
			""
		],
		[
			1,
			86,
			"ArrowLeft",
			15,
			"LeftArrow",
			37,
			"VK_LEFT",
			"Left",
			""
		],
		[
			1,
			87,
			"ArrowDown",
			18,
			"DownArrow",
			40,
			"VK_DOWN",
			"Down",
			""
		],
		[
			1,
			88,
			"ArrowUp",
			16,
			"UpArrow",
			38,
			"VK_UP",
			"Up",
			""
		],
		[
			1,
			89,
			"NumLock",
			83,
			"NumLock",
			144,
			"VK_NUMLOCK",
			"",
			""
		],
		[
			1,
			90,
			"NumpadDivide",
			113,
			"NumPad_Divide",
			111,
			"VK_DIVIDE",
			"",
			""
		],
		[
			1,
			91,
			"NumpadMultiply",
			108,
			"NumPad_Multiply",
			106,
			"VK_MULTIPLY",
			"",
			""
		],
		[
			1,
			92,
			"NumpadSubtract",
			111,
			"NumPad_Subtract",
			109,
			"VK_SUBTRACT",
			"",
			""
		],
		[
			1,
			93,
			"NumpadAdd",
			109,
			"NumPad_Add",
			107,
			"VK_ADD",
			"",
			""
		],
		[
			1,
			94,
			"NumpadEnter",
			3,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			95,
			"Numpad1",
			99,
			"NumPad1",
			97,
			"VK_NUMPAD1",
			"",
			""
		],
		[
			1,
			96,
			"Numpad2",
			100,
			"NumPad2",
			98,
			"VK_NUMPAD2",
			"",
			""
		],
		[
			1,
			97,
			"Numpad3",
			101,
			"NumPad3",
			99,
			"VK_NUMPAD3",
			"",
			""
		],
		[
			1,
			98,
			"Numpad4",
			102,
			"NumPad4",
			100,
			"VK_NUMPAD4",
			"",
			""
		],
		[
			1,
			99,
			"Numpad5",
			103,
			"NumPad5",
			101,
			"VK_NUMPAD5",
			"",
			""
		],
		[
			1,
			100,
			"Numpad6",
			104,
			"NumPad6",
			102,
			"VK_NUMPAD6",
			"",
			""
		],
		[
			1,
			101,
			"Numpad7",
			105,
			"NumPad7",
			103,
			"VK_NUMPAD7",
			"",
			""
		],
		[
			1,
			102,
			"Numpad8",
			106,
			"NumPad8",
			104,
			"VK_NUMPAD8",
			"",
			""
		],
		[
			1,
			103,
			"Numpad9",
			107,
			"NumPad9",
			105,
			"VK_NUMPAD9",
			"",
			""
		],
		[
			1,
			104,
			"Numpad0",
			98,
			"NumPad0",
			96,
			"VK_NUMPAD0",
			"",
			""
		],
		[
			1,
			105,
			"NumpadDecimal",
			112,
			"NumPad_Decimal",
			110,
			"VK_DECIMAL",
			"",
			""
		],
		[
			0,
			106,
			"IntlBackslash",
			97,
			"OEM_102",
			226,
			"VK_OEM_102",
			"",
			""
		],
		[
			1,
			107,
			"ContextMenu",
			58,
			"ContextMenu",
			93,
			"",
			"",
			""
		],
		[
			1,
			108,
			"Power",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			109,
			"NumpadEqual",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			110,
			"F13",
			71,
			"F13",
			124,
			"VK_F13",
			"",
			""
		],
		[
			1,
			111,
			"F14",
			72,
			"F14",
			125,
			"VK_F14",
			"",
			""
		],
		[
			1,
			112,
			"F15",
			73,
			"F15",
			126,
			"VK_F15",
			"",
			""
		],
		[
			1,
			113,
			"F16",
			74,
			"F16",
			127,
			"VK_F16",
			"",
			""
		],
		[
			1,
			114,
			"F17",
			75,
			"F17",
			128,
			"VK_F17",
			"",
			""
		],
		[
			1,
			115,
			"F18",
			76,
			"F18",
			129,
			"VK_F18",
			"",
			""
		],
		[
			1,
			116,
			"F19",
			77,
			"F19",
			130,
			"VK_F19",
			"",
			""
		],
		[
			1,
			117,
			"F20",
			78,
			"F20",
			131,
			"VK_F20",
			"",
			""
		],
		[
			1,
			118,
			"F21",
			79,
			"F21",
			132,
			"VK_F21",
			"",
			""
		],
		[
			1,
			119,
			"F22",
			80,
			"F22",
			133,
			"VK_F22",
			"",
			""
		],
		[
			1,
			120,
			"F23",
			81,
			"F23",
			134,
			"VK_F23",
			"",
			""
		],
		[
			1,
			121,
			"F24",
			82,
			"F24",
			135,
			"VK_F24",
			"",
			""
		],
		[
			1,
			122,
			"Open",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			123,
			"Help",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			124,
			"Select",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			125,
			"Again",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			126,
			"Undo",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			127,
			"Cut",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			128,
			"Copy",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			129,
			"Paste",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			130,
			"Find",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			131,
			"AudioVolumeMute",
			117,
			"AudioVolumeMute",
			173,
			"VK_VOLUME_MUTE",
			"",
			""
		],
		[
			1,
			132,
			"AudioVolumeUp",
			118,
			"AudioVolumeUp",
			175,
			"VK_VOLUME_UP",
			"",
			""
		],
		[
			1,
			133,
			"AudioVolumeDown",
			119,
			"AudioVolumeDown",
			174,
			"VK_VOLUME_DOWN",
			"",
			""
		],
		[
			1,
			134,
			"NumpadComma",
			110,
			"NumPad_Separator",
			108,
			"VK_SEPARATOR",
			"",
			""
		],
		[
			0,
			135,
			"IntlRo",
			115,
			"ABNT_C1",
			193,
			"VK_ABNT_C1",
			"",
			""
		],
		[
			1,
			136,
			"KanaMode",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			0,
			137,
			"IntlYen",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			138,
			"Convert",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			139,
			"NonConvert",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			140,
			"Lang1",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			141,
			"Lang2",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			142,
			"Lang3",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			143,
			"Lang4",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			144,
			"Lang5",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			145,
			"Abort",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			146,
			"Props",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			147,
			"NumpadParenLeft",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			148,
			"NumpadParenRight",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			149,
			"NumpadBackspace",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			150,
			"NumpadMemoryStore",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			151,
			"NumpadMemoryRecall",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			152,
			"NumpadMemoryClear",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			153,
			"NumpadMemoryAdd",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			154,
			"NumpadMemorySubtract",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			155,
			"NumpadClear",
			131,
			"Clear",
			12,
			"VK_CLEAR",
			"",
			""
		],
		[
			1,
			156,
			"NumpadClearEntry",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			0,
			"",
			5,
			"Ctrl",
			17,
			"VK_CONTROL",
			"",
			""
		],
		[
			1,
			0,
			"",
			4,
			"Shift",
			16,
			"VK_SHIFT",
			"",
			""
		],
		[
			1,
			0,
			"",
			6,
			"Alt",
			18,
			"VK_MENU",
			"",
			""
		],
		[
			1,
			0,
			"",
			57,
			"Meta",
			91,
			"VK_COMMAND",
			"",
			""
		],
		[
			1,
			157,
			"ControlLeft",
			5,
			"",
			0,
			"VK_LCONTROL",
			"",
			""
		],
		[
			1,
			158,
			"ShiftLeft",
			4,
			"",
			0,
			"VK_LSHIFT",
			"",
			""
		],
		[
			1,
			159,
			"AltLeft",
			6,
			"",
			0,
			"VK_LMENU",
			"",
			""
		],
		[
			1,
			160,
			"MetaLeft",
			57,
			"",
			0,
			"VK_LWIN",
			"",
			""
		],
		[
			1,
			161,
			"ControlRight",
			5,
			"",
			0,
			"VK_RCONTROL",
			"",
			""
		],
		[
			1,
			162,
			"ShiftRight",
			4,
			"",
			0,
			"VK_RSHIFT",
			"",
			""
		],
		[
			1,
			163,
			"AltRight",
			6,
			"",
			0,
			"VK_RMENU",
			"",
			""
		],
		[
			1,
			164,
			"MetaRight",
			57,
			"",
			0,
			"VK_RWIN",
			"",
			""
		],
		[
			1,
			165,
			"BrightnessUp",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			166,
			"BrightnessDown",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			167,
			"MediaPlay",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			168,
			"MediaRecord",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			169,
			"MediaFastForward",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			170,
			"MediaRewind",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			171,
			"MediaTrackNext",
			124,
			"MediaTrackNext",
			176,
			"VK_MEDIA_NEXT_TRACK",
			"",
			""
		],
		[
			1,
			172,
			"MediaTrackPrevious",
			125,
			"MediaTrackPrevious",
			177,
			"VK_MEDIA_PREV_TRACK",
			"",
			""
		],
		[
			1,
			173,
			"MediaStop",
			126,
			"MediaStop",
			178,
			"VK_MEDIA_STOP",
			"",
			""
		],
		[
			1,
			174,
			"Eject",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			175,
			"MediaPlayPause",
			127,
			"MediaPlayPause",
			179,
			"VK_MEDIA_PLAY_PAUSE",
			"",
			""
		],
		[
			1,
			176,
			"MediaSelect",
			128,
			"LaunchMediaPlayer",
			181,
			"VK_MEDIA_LAUNCH_MEDIA_SELECT",
			"",
			""
		],
		[
			1,
			177,
			"LaunchMail",
			129,
			"LaunchMail",
			180,
			"VK_MEDIA_LAUNCH_MAIL",
			"",
			""
		],
		[
			1,
			178,
			"LaunchApp2",
			130,
			"LaunchApp2",
			183,
			"VK_MEDIA_LAUNCH_APP2",
			"",
			""
		],
		[
			1,
			179,
			"LaunchApp1",
			0,
			"",
			0,
			"VK_MEDIA_LAUNCH_APP1",
			"",
			""
		],
		[
			1,
			180,
			"SelectTask",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			181,
			"LaunchScreenSaver",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			182,
			"BrowserSearch",
			120,
			"BrowserSearch",
			170,
			"VK_BROWSER_SEARCH",
			"",
			""
		],
		[
			1,
			183,
			"BrowserHome",
			121,
			"BrowserHome",
			172,
			"VK_BROWSER_HOME",
			"",
			""
		],
		[
			1,
			184,
			"BrowserBack",
			122,
			"BrowserBack",
			166,
			"VK_BROWSER_BACK",
			"",
			""
		],
		[
			1,
			185,
			"BrowserForward",
			123,
			"BrowserForward",
			167,
			"VK_BROWSER_FORWARD",
			"",
			""
		],
		[
			1,
			186,
			"BrowserStop",
			0,
			"",
			0,
			"VK_BROWSER_STOP",
			"",
			""
		],
		[
			1,
			187,
			"BrowserRefresh",
			0,
			"",
			0,
			"VK_BROWSER_REFRESH",
			"",
			""
		],
		[
			1,
			188,
			"BrowserFavorites",
			0,
			"",
			0,
			"VK_BROWSER_FAVORITES",
			"",
			""
		],
		[
			1,
			189,
			"ZoomToggle",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			190,
			"MailReply",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			191,
			"MailForward",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			192,
			"MailSend",
			0,
			"",
			0,
			"",
			"",
			""
		],
		[
			1,
			0,
			"",
			114,
			"KeyInComposition",
			229,
			"",
			"",
			""
		],
		[
			1,
			0,
			"",
			116,
			"ABNT_C2",
			194,
			"VK_ABNT_C2",
			"",
			""
		],
		[
			1,
			0,
			"",
			96,
			"OEM_8",
			223,
			"VK_OEM_8",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_KANA",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_HANGUL",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_JUNJA",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_FINAL",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_HANJA",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_KANJI",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_CONVERT",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_NONCONVERT",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_ACCEPT",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_MODECHANGE",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_SELECT",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_PRINT",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_EXECUTE",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_SNAPSHOT",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_HELP",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_APPS",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_PROCESSKEY",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_PACKET",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_DBE_SBCSCHAR",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_DBE_DBCSCHAR",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_ATTN",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_CRSEL",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_EXSEL",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_EREOF",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_PLAY",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_ZOOM",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_NONAME",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_PA1",
			"",
			""
		],
		[
			1,
			0,
			"",
			0,
			"",
			0,
			"VK_OEM_CLEAR",
			"",
			""
		]
	], n = [], r = [];
	for (const i of t) {
		const [s, a, o, l, c, u, d, m, p] = i;
		if (r[a] || (r[a] = !0, Ul[o] = a, Dl[o.toLowerCase()] = a, s && (Ya[a] = l)), !n[l]) {
			if (n[l] = !0, !c) throw new Error(`String representation missing for key code ${l} around scan code ${o}`);
			Ut.define(l, c), Dn.define(l, m || c), Wn.define(l, p || m || c);
		}
		u && (Hl[u] = l);
	}
})();
var Di;
(function(e) {
	function t(o) {
		return Ut.keyCodeToStr(o);
	}
	e.toString = t;
	function n(o) {
		return Ut.strToKeyCode(o);
	}
	e.fromString = n;
	function r(o) {
		return Dn.keyCodeToStr(o);
	}
	e.toUserSettingsUS = r;
	function i(o) {
		return Wn.keyCodeToStr(o);
	}
	e.toUserSettingsGeneral = i;
	function s(o) {
		return Dn.strToKeyCode(o) || Wn.strToKeyCode(o);
	}
	e.fromUserSettings = s;
	function a(o) {
		if (o >= 98 && o <= 113) return null;
		switch (o) {
			case 16: return "Up";
			case 18: return "Down";
			case 15: return "Left";
			case 17: return "Right";
		}
		return Ut.keyCodeToStr(o);
	}
	e.toElectronAccelerator = a;
})(Di || (Di = {}));
function Wl(e, t) {
	return (e | (t & 65535) << 16 >>> 0) >>> 0;
}
let it;
const Tn = globalThis.vscode;
if (typeof Tn < "u" && typeof Tn.process < "u") {
	const e = Tn.process;
	it = {
		get platform() {
			return e.platform;
		},
		get arch() {
			return e.arch;
		},
		get env() {
			return e.env;
		},
		cwd() {
			return e.cwd();
		}
	};
} else typeof process < "u" && typeof process?.versions?.node == "string" ? it = {
	get platform() {
		return process.platform;
	},
	get arch() {
		return process.arch;
	},
	get env() {
		return {};
	},
	cwd() {
		return {}.VSCODE_CWD || process.cwd();
	}
} : it = {
	get platform() {
		return St ? "win32" : Jo ? "darwin" : "linux";
	},
	get arch() {},
	get env() {
		return {};
	},
	cwd() {
		return "/";
	}
};
const Zt = it.cwd, Pl = it.env, ql = it.platform, Ol = 65, Fl = 97, Bl = 90, Vl = 122, $e = 46, re = 47, ce = 92, Ae = 58, jl = 63;
var Ja = class extends Error {
	constructor(e, t, n) {
		let r;
		typeof t == "string" && t.indexOf("not ") === 0 ? (r = "must not be", t = t.replace(/^not /, "")) : r = "must be";
		let i = `The "${e}" ${e.indexOf(".") !== -1 ? "property" : "argument"} ${r} of type ${t}`;
		i += `. Received type ${typeof n}`, super(i), this.code = "ERR_INVALID_ARG_TYPE";
	}
};
function $l(e, t) {
	if (e === null || typeof e != "object") throw new Ja(t, "Object", e);
}
function ee(e, t) {
	if (typeof e != "string") throw new Ja(t, "string", e);
}
const Pe = ql === "win32";
function V(e) {
	return e === re || e === ce;
}
function Pn(e) {
	return e === re;
}
function Re(e) {
	return e >= Ol && e <= Bl || e >= Fl && e <= Vl;
}
function Kt(e, t, n, r) {
	let i = "", s = 0, a = -1, o = 0, l = 0;
	for (let c = 0; c <= e.length; ++c) {
		if (c < e.length) l = e.charCodeAt(c);
		else {
			if (r(l)) break;
			l = re;
		}
		if (r(l)) {
			if (!(a === c - 1 || o === 1)) if (o === 2) {
				if (i.length < 2 || s !== 2 || i.charCodeAt(i.length - 1) !== $e || i.charCodeAt(i.length - 2) !== $e) {
					if (i.length > 2) {
						const u = i.lastIndexOf(n);
						u === -1 ? (i = "", s = 0) : (i = i.slice(0, u), s = i.length - 1 - i.lastIndexOf(n)), a = c, o = 0;
						continue;
					} else if (i.length !== 0) {
						i = "", s = 0, a = c, o = 0;
						continue;
					}
				}
				t && (i += i.length > 0 ? `${n}..` : "..", s = 2);
			} else i.length > 0 ? i += `${n}${e.slice(a + 1, c)}` : i = e.slice(a + 1, c), s = c - a - 1;
			a = c, o = 0;
		} else l === $e && o !== -1 ? ++o : o = -1;
	}
	return i;
}
function Gl(e) {
	return e ? `${e[0] === "." ? "" : "."}${e}` : "";
}
function Qa(e, t) {
	$l(t, "pathObject");
	const n = t.dir || t.root, r = t.base || `${t.name || ""}${Gl(t.ext)}`;
	return n ? n === t.root ? `${n}${r}` : `${n}${e}${r}` : r;
}
const le = {
	resolve(...e) {
		let t = "", n = "", r = !1;
		for (let i = e.length - 1; i >= -1; i--) {
			let s;
			if (i >= 0) {
				if (s = e[i], ee(s, `paths[${i}]`), s.length === 0) continue;
			} else t.length === 0 ? s = Zt() : (s = Pl[`=${t}`] || Zt(), (s === void 0 || s.slice(0, 2).toLowerCase() !== t.toLowerCase() && s.charCodeAt(2) === ce) && (s = `${t}\\`));
			const a = s.length;
			let o = 0, l = "", c = !1;
			const u = s.charCodeAt(0);
			if (a === 1) V(u) && (o = 1, c = !0);
			else if (V(u)) if (c = !0, V(s.charCodeAt(1))) {
				let d = 2, m = d;
				for (; d < a && !V(s.charCodeAt(d));) d++;
				if (d < a && d !== m) {
					const p = s.slice(m, d);
					for (m = d; d < a && V(s.charCodeAt(d));) d++;
					if (d < a && d !== m) {
						for (m = d; d < a && !V(s.charCodeAt(d));) d++;
						(d === a || d !== m) && (l = `\\\\${p}\\${s.slice(m, d)}`, o = d);
					}
				}
			} else o = 1;
			else Re(u) && s.charCodeAt(1) === Ae && (l = s.slice(0, 2), o = 2, a > 2 && V(s.charCodeAt(2)) && (c = !0, o = 3));
			if (l.length > 0) if (t.length > 0) {
				if (l.toLowerCase() !== t.toLowerCase()) continue;
			} else t = l;
			if (r) {
				if (t.length > 0) break;
			} else if (n = `${s.slice(o)}\\${n}`, r = c, c && t.length > 0) break;
		}
		return n = Kt(n, !r, "\\", V), r ? `${t}\\${n}` : `${t}${n}` || ".";
	},
	normalize(e) {
		ee(e, "path");
		const t = e.length;
		if (t === 0) return ".";
		let n = 0, r, i = !1;
		const s = e.charCodeAt(0);
		if (t === 1) return Pn(s) ? "\\" : e;
		if (V(s)) if (i = !0, V(e.charCodeAt(1))) {
			let o = 2, l = o;
			for (; o < t && !V(e.charCodeAt(o));) o++;
			if (o < t && o !== l) {
				const c = e.slice(l, o);
				for (l = o; o < t && V(e.charCodeAt(o));) o++;
				if (o < t && o !== l) {
					for (l = o; o < t && !V(e.charCodeAt(o));) o++;
					if (o === t) return `\\\\${c}\\${e.slice(l)}\\`;
					o !== l && (r = `\\\\${c}\\${e.slice(l, o)}`, n = o);
				}
			}
		} else n = 1;
		else Re(s) && e.charCodeAt(1) === Ae && (r = e.slice(0, 2), n = 2, t > 2 && V(e.charCodeAt(2)) && (i = !0, n = 3));
		let a = n < t ? Kt(e.slice(n), !i, "\\", V) : "";
		if (a.length === 0 && !i && (a = "."), a.length > 0 && V(e.charCodeAt(t - 1)) && (a += "\\"), !i && r === void 0 && e.includes(":")) {
			if (a.length >= 2 && Re(a.charCodeAt(0)) && a.charCodeAt(1) === Ae) return `.\\${a}`;
			let o = e.indexOf(":");
			do
				if (o === t - 1 || V(e.charCodeAt(o + 1))) return `.\\${a}`;
			while ((o = e.indexOf(":", o + 1)) !== -1);
		}
		return r === void 0 ? i ? `\\${a}` : a : i ? `${r}\\${a}` : `${r}${a}`;
	},
	isAbsolute(e) {
		ee(e, "path");
		const t = e.length;
		if (t === 0) return !1;
		const n = e.charCodeAt(0);
		return V(n) || t > 2 && Re(n) && e.charCodeAt(1) === Ae && V(e.charCodeAt(2));
	},
	join(...e) {
		if (e.length === 0) return ".";
		let t, n;
		for (let s = 0; s < e.length; ++s) {
			const a = e[s];
			ee(a, "path"), a.length > 0 && (t === void 0 ? t = n = a : t += `\\${a}`);
		}
		if (t === void 0) return ".";
		let r = !0, i = 0;
		if (typeof n == "string" && V(n.charCodeAt(0))) {
			++i;
			const s = n.length;
			s > 1 && V(n.charCodeAt(1)) && (++i, s > 2 && (V(n.charCodeAt(2)) ? ++i : r = !1));
		}
		if (r) {
			for (; i < t.length && V(t.charCodeAt(i));) i++;
			i >= 2 && (t = `\\${t.slice(i)}`);
		}
		return le.normalize(t);
	},
	relative(e, t) {
		if (ee(e, "from"), ee(t, "to"), e === t) return "";
		const n = le.resolve(e), r = le.resolve(t);
		if (n === r || (e = n.toLowerCase(), t = r.toLowerCase(), e === t)) return "";
		if (n.length !== e.length || r.length !== t.length) {
			const b = n.split("\\"), g = r.split("\\");
			b[b.length - 1] === "" && b.pop(), g[g.length - 1] === "" && g.pop();
			const v = b.length, T = g.length, k = v < T ? v : T;
			let E;
			for (E = 0; E < k && b[E].toLowerCase() === g[E].toLowerCase(); E++);
			return E === 0 ? r : E === k ? T > k ? g.slice(E).join("\\") : v > k ? "..\\".repeat(v - 1 - E) + ".." : "" : "..\\".repeat(v - E) + g.slice(E).join("\\");
		}
		let i = 0;
		for (; i < e.length && e.charCodeAt(i) === ce;) i++;
		let s = e.length;
		for (; s - 1 > i && e.charCodeAt(s - 1) === ce;) s--;
		const a = s - i;
		let o = 0;
		for (; o < t.length && t.charCodeAt(o) === ce;) o++;
		let l = t.length;
		for (; l - 1 > o && t.charCodeAt(l - 1) === ce;) l--;
		const c = l - o, u = a < c ? a : c;
		let d = -1, m = 0;
		for (; m < u; m++) {
			const b = e.charCodeAt(i + m);
			if (b !== t.charCodeAt(o + m)) break;
			b === ce && (d = m);
		}
		if (m !== u) {
			if (d === -1) return r;
		} else {
			if (c > u) {
				if (t.charCodeAt(o + m) === ce) return r.slice(o + m + 1);
				if (m === 2) return r.slice(o + m);
			}
			a > u && (e.charCodeAt(i + m) === ce ? d = m : m === 2 && (d = 3)), d === -1 && (d = 0);
		}
		let p = "";
		for (m = i + d + 1; m <= s; ++m) (m === s || e.charCodeAt(m) === ce) && (p += p.length === 0 ? ".." : "\\..");
		return o += d, p.length > 0 ? `${p}${r.slice(o, l)}` : (r.charCodeAt(o) === ce && ++o, r.slice(o, l));
	},
	toNamespacedPath(e) {
		if (typeof e != "string" || e.length === 0) return e;
		const t = le.resolve(e);
		if (t.length <= 2) return e;
		if (t.charCodeAt(0) === ce) {
			if (t.charCodeAt(1) === ce) {
				const n = t.charCodeAt(2);
				if (n !== jl && n !== $e) return `\\\\?\\UNC\\${t.slice(2)}`;
			}
		} else if (Re(t.charCodeAt(0)) && t.charCodeAt(1) === Ae && t.charCodeAt(2) === ce) return `\\\\?\\${t}`;
		return t;
	},
	dirname(e) {
		ee(e, "path");
		const t = e.length;
		if (t === 0) return ".";
		let n = -1, r = 0;
		const i = e.charCodeAt(0);
		if (t === 1) return V(i) ? e : ".";
		if (V(i)) {
			if (n = r = 1, V(e.charCodeAt(1))) {
				let o = 2, l = o;
				for (; o < t && !V(e.charCodeAt(o));) o++;
				if (o < t && o !== l) {
					for (l = o; o < t && V(e.charCodeAt(o));) o++;
					if (o < t && o !== l) {
						for (l = o; o < t && !V(e.charCodeAt(o));) o++;
						if (o === t) return e;
						o !== l && (n = r = o + 1);
					}
				}
			}
		} else Re(i) && e.charCodeAt(1) === Ae && (n = t > 2 && V(e.charCodeAt(2)) ? 3 : 2, r = n);
		let s = -1, a = !0;
		for (let o = t - 1; o >= r; --o) if (V(e.charCodeAt(o))) {
			if (!a) {
				s = o;
				break;
			}
		} else a = !1;
		if (s === -1) {
			if (n === -1) return ".";
			s = n;
		}
		return e.slice(0, s);
	},
	basename(e, t) {
		t !== void 0 && ee(t, "suffix"), ee(e, "path");
		let n = 0, r = -1, i = !0, s;
		if (e.length >= 2 && Re(e.charCodeAt(0)) && e.charCodeAt(1) === Ae && (n = 2), t !== void 0 && t.length > 0 && t.length <= e.length) {
			if (t === e) return "";
			let a = t.length - 1, o = -1;
			for (s = e.length - 1; s >= n; --s) {
				const l = e.charCodeAt(s);
				if (V(l)) {
					if (!i) {
						n = s + 1;
						break;
					}
				} else o === -1 && (i = !1, o = s + 1), a >= 0 && (l === t.charCodeAt(a) ? --a === -1 && (r = s) : (a = -1, r = o));
			}
			return n === r ? r = o : r === -1 && (r = e.length), e.slice(n, r);
		}
		for (s = e.length - 1; s >= n; --s) if (V(e.charCodeAt(s))) {
			if (!i) {
				n = s + 1;
				break;
			}
		} else r === -1 && (i = !1, r = s + 1);
		return r === -1 ? "" : e.slice(n, r);
	},
	extname(e) {
		ee(e, "path");
		let t = 0, n = -1, r = 0, i = -1, s = !0, a = 0;
		e.length >= 2 && e.charCodeAt(1) === Ae && Re(e.charCodeAt(0)) && (t = r = 2);
		for (let o = e.length - 1; o >= t; --o) {
			const l = e.charCodeAt(o);
			if (V(l)) {
				if (!s) {
					r = o + 1;
					break;
				}
				continue;
			}
			i === -1 && (s = !1, i = o + 1), l === $e ? n === -1 ? n = o : a !== 1 && (a = 1) : n !== -1 && (a = -1);
		}
		return n === -1 || i === -1 || a === 0 || a === 1 && n === i - 1 && n === r + 1 ? "" : e.slice(n, i);
	},
	format: Qa.bind(null, "\\"),
	parse(e) {
		ee(e, "path");
		const t = {
			root: "",
			dir: "",
			base: "",
			ext: "",
			name: ""
		};
		if (e.length === 0) return t;
		const n = e.length;
		let r = 0, i = e.charCodeAt(0);
		if (n === 1) return V(i) ? (t.root = t.dir = e, t) : (t.base = t.name = e, t);
		if (V(i)) {
			if (r = 1, V(e.charCodeAt(1))) {
				let d = 2, m = d;
				for (; d < n && !V(e.charCodeAt(d));) d++;
				if (d < n && d !== m) {
					for (m = d; d < n && V(e.charCodeAt(d));) d++;
					if (d < n && d !== m) {
						for (m = d; d < n && !V(e.charCodeAt(d));) d++;
						d === n ? r = d : d !== m && (r = d + 1);
					}
				}
			}
		} else if (Re(i) && e.charCodeAt(1) === Ae) {
			if (n <= 2) return t.root = t.dir = e, t;
			if (r = 2, V(e.charCodeAt(2))) {
				if (n === 3) return t.root = t.dir = e, t;
				r = 3;
			}
		}
		r > 0 && (t.root = e.slice(0, r));
		let s = -1, a = r, o = -1, l = !0, c = e.length - 1, u = 0;
		for (; c >= r; --c) {
			if (i = e.charCodeAt(c), V(i)) {
				if (!l) {
					a = c + 1;
					break;
				}
				continue;
			}
			o === -1 && (l = !1, o = c + 1), i === $e ? s === -1 ? s = c : u !== 1 && (u = 1) : s !== -1 && (u = -1);
		}
		return o !== -1 && (s === -1 || u === 0 || u === 1 && s === o - 1 && s === a + 1 ? t.base = t.name = e.slice(a, o) : (t.name = e.slice(a, s), t.base = e.slice(a, o), t.ext = e.slice(s, o))), a > 0 && a !== r ? t.dir = e.slice(0, a - 1) : t.dir = t.root, t;
	},
	sep: "\\",
	delimiter: ";",
	win32: null,
	posix: null
}, Xl = (() => {
	if (Pe) {
		const e = /\\/g;
		return () => {
			const t = Zt().replace(e, "/");
			return t.slice(t.indexOf("/"));
		};
	}
	return () => Zt();
})(), de = {
	resolve(...e) {
		let t = "", n = !1;
		for (let r = e.length - 1; r >= 0 && !n; r--) {
			const i = e[r];
			ee(i, `paths[${r}]`), i.length !== 0 && (t = `${i}/${t}`, n = i.charCodeAt(0) === re);
		}
		if (!n) {
			const r = Xl();
			t = `${r}/${t}`, n = r.charCodeAt(0) === re;
		}
		return t = Kt(t, !n, "/", Pn), n ? `/${t}` : t.length > 0 ? t : ".";
	},
	normalize(e) {
		if (ee(e, "path"), e.length === 0) return ".";
		const t = e.charCodeAt(0) === re, n = e.charCodeAt(e.length - 1) === re;
		return e = Kt(e, !t, "/", Pn), e.length === 0 ? t ? "/" : n ? "./" : "." : (n && (e += "/"), t ? `/${e}` : e);
	},
	isAbsolute(e) {
		return ee(e, "path"), e.length > 0 && e.charCodeAt(0) === re;
	},
	join(...e) {
		if (e.length === 0) return ".";
		const t = [];
		for (let n = 0; n < e.length; ++n) {
			const r = e[n];
			ee(r, "path"), r.length > 0 && t.push(r);
		}
		return t.length === 0 ? "." : de.normalize(t.join("/"));
	},
	relative(e, t) {
		if (ee(e, "from"), ee(t, "to"), e === t || (e = de.resolve(e), t = de.resolve(t), e === t)) return "";
		const n = 1, r = e.length, i = r - n, s = 1, a = t.length - s, o = i < a ? i : a;
		let l = -1, c = 0;
		for (; c < o; c++) {
			const d = e.charCodeAt(n + c);
			if (d !== t.charCodeAt(s + c)) break;
			d === re && (l = c);
		}
		if (c === o) if (a > o) {
			if (t.charCodeAt(s + c) === re) return t.slice(s + c + 1);
			if (c === 0) return t.slice(s + c);
		} else i > o && (e.charCodeAt(n + c) === re ? l = c : c === 0 && (l = 0));
		let u = "";
		for (c = n + l + 1; c <= r; ++c) (c === r || e.charCodeAt(c) === re) && (u += u.length === 0 ? ".." : "/..");
		return `${u}${t.slice(s + l)}`;
	},
	toNamespacedPath(e) {
		return e;
	},
	dirname(e) {
		if (ee(e, "path"), e.length === 0) return ".";
		const t = e.charCodeAt(0) === re;
		let n = -1, r = !0;
		for (let i = e.length - 1; i >= 1; --i) if (e.charCodeAt(i) === re) {
			if (!r) {
				n = i;
				break;
			}
		} else r = !1;
		return n === -1 ? t ? "/" : "." : t && n === 1 ? "//" : e.slice(0, n);
	},
	basename(e, t) {
		t !== void 0 && ee(t, "suffix"), ee(e, "path");
		let n = 0, r = -1, i = !0, s;
		if (t !== void 0 && t.length > 0 && t.length <= e.length) {
			if (t === e) return "";
			let a = t.length - 1, o = -1;
			for (s = e.length - 1; s >= 0; --s) {
				const l = e.charCodeAt(s);
				if (l === re) {
					if (!i) {
						n = s + 1;
						break;
					}
				} else o === -1 && (i = !1, o = s + 1), a >= 0 && (l === t.charCodeAt(a) ? --a === -1 && (r = s) : (a = -1, r = o));
			}
			return n === r ? r = o : r === -1 && (r = e.length), e.slice(n, r);
		}
		for (s = e.length - 1; s >= 0; --s) if (e.charCodeAt(s) === re) {
			if (!i) {
				n = s + 1;
				break;
			}
		} else r === -1 && (i = !1, r = s + 1);
		return r === -1 ? "" : e.slice(n, r);
	},
	extname(e) {
		ee(e, "path");
		let t = -1, n = 0, r = -1, i = !0, s = 0;
		for (let a = e.length - 1; a >= 0; --a) {
			const o = e[a];
			if (o === "/") {
				if (!i) {
					n = a + 1;
					break;
				}
				continue;
			}
			r === -1 && (i = !1, r = a + 1), o === "." ? t === -1 ? t = a : s !== 1 && (s = 1) : t !== -1 && (s = -1);
		}
		return t === -1 || r === -1 || s === 0 || s === 1 && t === r - 1 && t === n + 1 ? "" : e.slice(t, r);
	},
	format: Qa.bind(null, "/"),
	parse(e) {
		ee(e, "path");
		const t = {
			root: "",
			dir: "",
			base: "",
			ext: "",
			name: ""
		};
		if (e.length === 0) return t;
		const n = e.charCodeAt(0) === re;
		let r;
		n ? (t.root = "/", r = 1) : r = 0;
		let i = -1, s = 0, a = -1, o = !0, l = e.length - 1, c = 0;
		for (; l >= r; --l) {
			const u = e.charCodeAt(l);
			if (u === re) {
				if (!o) {
					s = l + 1;
					break;
				}
				continue;
			}
			a === -1 && (o = !1, a = l + 1), u === $e ? i === -1 ? i = l : c !== 1 && (c = 1) : i !== -1 && (c = -1);
		}
		if (a !== -1) {
			const u = s === 0 && n ? 1 : s;
			i === -1 || c === 0 || c === 1 && i === a - 1 && i === s + 1 ? t.base = t.name = e.slice(u, a) : (t.name = e.slice(u, i), t.base = e.slice(u, a), t.ext = e.slice(i, a));
		}
		return s > 0 ? t.dir = e.slice(0, s - 1) : n && (t.dir = "/"), t;
	},
	sep: "/",
	delimiter: ":",
	win32: null,
	posix: null
};
de.win32 = le.win32 = le;
de.posix = le.posix = de;
Pe ? le.normalize : de.normalize;
Pe ? le.resolve : de.resolve;
Pe ? le.relative : de.relative;
Pe ? le.dirname : de.dirname;
Pe ? le.basename : de.basename;
Pe ? le.extname : de.extname;
Pe ? le.sep : de.sep;
const Yl = /^\w[\w\d+.-]*$/, Jl = /^\//, Ql = /^\/\//;
function Zl(e, t) {
	if (!e.scheme && t) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
	if (e.scheme && !Yl.test(e.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
	if (e.path) {
		if (e.authority) {
			if (!Jl.test(e.path)) throw new Error("[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash (\"/\") character");
		} else if (Ql.test(e.path)) throw new Error("[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters (\"//\")");
	}
}
function Kl(e, t) {
	return !e && !t ? "file" : e;
}
function ec(e, t) {
	switch (e) {
		case "https":
		case "http":
		case "file":
			t ? t[0] !== Te && (t = Te + t) : t = Te;
			break;
	}
	return t;
}
const Q = "", Te = "/", tc = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
var Si = class Dt {
	static isUri(t) {
		return t instanceof Dt ? !0 : !t || typeof t != "object" ? !1 : typeof t.authority == "string" && typeof t.fragment == "string" && typeof t.path == "string" && typeof t.query == "string" && typeof t.scheme == "string" && typeof t.fsPath == "string" && typeof t.with == "function" && typeof t.toString == "function";
	}
	constructor(t, n, r, i, s, a = !1) {
		typeof t == "object" ? (this.scheme = t.scheme || Q, this.authority = t.authority || Q, this.path = t.path || Q, this.query = t.query || Q, this.fragment = t.fragment || Q) : (this.scheme = Kl(t, a), this.authority = n || Q, this.path = ec(this.scheme, r || Q), this.query = i || Q, this.fragment = s || Q, Zl(this, a));
	}
	get fsPath() {
		return qn(this, !1);
	}
	with(t) {
		if (!t) return this;
		let { scheme: n, authority: r, path: i, query: s, fragment: a } = t;
		return n === void 0 ? n = this.scheme : n === null && (n = Q), r === void 0 ? r = this.authority : r === null && (r = Q), i === void 0 ? i = this.path : i === null && (i = Q), s === void 0 ? s = this.query : s === null && (s = Q), a === void 0 ? a = this.fragment : a === null && (a = Q), n === this.scheme && r === this.authority && i === this.path && s === this.query && a === this.fragment ? this : new Je(n, r, i, s, a);
	}
	static parse(t, n = !1) {
		const r = tc.exec(t);
		return r ? new Je(r[2] || Q, At(r[4] || Q), At(r[5] || Q), At(r[7] || Q), At(r[9] || Q), n) : new Je(Q, Q, Q, Q, Q);
	}
	static file(t) {
		let n = Q;
		if (St && (t = t.replace(/\\/g, Te)), t[0] === Te && t[1] === Te) {
			const r = t.indexOf(Te, 2);
			r === -1 ? (n = t.substring(2), t = Te) : (n = t.substring(2, r), t = t.substring(r) || Te);
		}
		return new Je("file", n, t, Q, Q);
	}
	static from(t, n) {
		return new Je(t.scheme, t.authority, t.path, t.query, t.fragment, n);
	}
	static joinPath(t, ...n) {
		if (!t.path) throw new Error("[UriError]: cannot call joinPath on URI without path");
		let r;
		return St && t.scheme === "file" ? r = Dt.file(le.join(qn(t, !0), ...n)).path : r = de.join(t.path, ...n), t.with({ path: r });
	}
	toString(t = !1) {
		return On(this, t);
	}
	toJSON() {
		return this;
	}
	static revive(t) {
		if (t) {
			if (t instanceof Dt) return t;
			{
				const n = new Je(t);
				return n._formatted = t.external ?? null, n._fsPath = t._sep === Za ? t.fsPath ?? null : null, n;
			}
		} else return t;
	}
};
const Za = St ? 1 : void 0;
var Je = class extends Si {
	constructor() {
		super(...arguments), this._formatted = null, this._fsPath = null;
	}
	get fsPath() {
		return this._fsPath || (this._fsPath = qn(this, !1)), this._fsPath;
	}
	toString(e = !1) {
		return e ? On(this, !0) : (this._formatted || (this._formatted = On(this, !1)), this._formatted);
	}
	toJSON() {
		const e = { $mid: 1 };
		return this._fsPath && (e.fsPath = this._fsPath, e._sep = Za), this._formatted && (e.external = this._formatted), this.path && (e.path = this.path), this.scheme && (e.scheme = this.scheme), this.authority && (e.authority = this.authority), this.query && (e.query = this.query), this.fragment && (e.fragment = this.fragment), e;
	}
};
const Ka = {
	58: "%3A",
	47: "%2F",
	63: "%3F",
	35: "%23",
	91: "%5B",
	93: "%5D",
	64: "%40",
	33: "%21",
	36: "%24",
	38: "%26",
	39: "%27",
	40: "%28",
	41: "%29",
	42: "%2A",
	43: "%2B",
	44: "%2C",
	59: "%3B",
	61: "%3D",
	32: "%20"
};
function Wi(e, t, n) {
	let r, i = -1;
	for (let s = 0; s < e.length; s++) {
		const a = e.charCodeAt(s);
		if (a >= 97 && a <= 122 || a >= 65 && a <= 90 || a >= 48 && a <= 57 || a === 45 || a === 46 || a === 95 || a === 126 || t && a === 47 || n && a === 91 || n && a === 93 || n && a === 58) i !== -1 && (r += encodeURIComponent(e.substring(i, s)), i = -1), r !== void 0 && (r += e.charAt(s));
		else {
			r === void 0 && (r = e.substr(0, s));
			const o = Ka[a];
			o !== void 0 ? (i !== -1 && (r += encodeURIComponent(e.substring(i, s)), i = -1), r += o) : i === -1 && (i = s);
		}
	}
	return i !== -1 && (r += encodeURIComponent(e.substring(i))), r !== void 0 ? r : e;
}
function nc(e) {
	let t;
	for (let n = 0; n < e.length; n++) {
		const r = e.charCodeAt(n);
		r === 35 || r === 63 ? (t === void 0 && (t = e.substr(0, n)), t += Ka[r]) : t !== void 0 && (t += e[n]);
	}
	return t !== void 0 ? t : e;
}
function qn(e, t) {
	let n;
	return e.authority && e.path.length > 1 && e.scheme === "file" ? n = `//${e.authority}${e.path}` : e.path.charCodeAt(0) === 47 && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && e.path.charCodeAt(2) === 58 ? t ? n = e.path.substr(1) : n = e.path[1].toLowerCase() + e.path.substr(2) : n = e.path, St && (n = n.replace(/\//g, "\\")), n;
}
function On(e, t) {
	const n = t ? nc : Wi;
	let r = "", { scheme: i, authority: s, path: a, query: o, fragment: l } = e;
	if (i && (r += i, r += ":"), (s || i === "file") && (r += Te, r += Te), s) {
		let c = s.indexOf("@");
		if (c !== -1) {
			const u = s.substr(0, c);
			s = s.substr(c + 1), c = u.lastIndexOf(":"), c === -1 ? r += n(u, !1, !1) : (r += n(u.substr(0, c), !1, !1), r += ":", r += n(u.substr(c + 1), !1, !0)), r += "@";
		}
		s = s.toLowerCase(), c = s.lastIndexOf(":"), c === -1 ? r += n(s, !1, !0) : (r += n(s.substr(0, c), !1, !0), r += s.substr(c));
	}
	if (a) {
		if (a.length >= 3 && a.charCodeAt(0) === 47 && a.charCodeAt(2) === 58) {
			const c = a.charCodeAt(1);
			c >= 65 && c <= 90 && (a = `/${String.fromCharCode(c + 32)}:${a.substr(3)}`);
		} else if (a.length >= 2 && a.charCodeAt(1) === 58) {
			const c = a.charCodeAt(0);
			c >= 65 && c <= 90 && (a = `${String.fromCharCode(c + 32)}:${a.substr(2)}`);
		}
		r += n(a, !0, !1);
	}
	return o && (r += "?", r += n(o, !1, !1)), l && (r += "#", r += t ? l : Wi(l, !1, !1)), r;
}
function eo(e) {
	try {
		return decodeURIComponent(e);
	} catch {
		return e.length > 3 ? e.substr(0, 3) + eo(e.substr(3)) : e;
	}
}
const Pi = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
function At(e) {
	return e.match(Pi) ? e.replace(Pi, (t) => eo(t)) : e;
}
var ic = class be extends j {
	constructor(t, n, r, i) {
		super(t, n, r, i), this.selectionStartLineNumber = t, this.selectionStartColumn = n, this.positionLineNumber = r, this.positionColumn = i;
	}
	toString() {
		return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
	}
	equalsSelection(t) {
		return be.selectionsEqual(this, t);
	}
	static selectionsEqual(t, n) {
		return t.selectionStartLineNumber === n.selectionStartLineNumber && t.selectionStartColumn === n.selectionStartColumn && t.positionLineNumber === n.positionLineNumber && t.positionColumn === n.positionColumn;
	}
	getDirection() {
		return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ? 0 : 1;
	}
	setEndPosition(t, n) {
		return this.getDirection() === 0 ? new be(this.startLineNumber, this.startColumn, t, n) : new be(t, n, this.startLineNumber, this.startColumn);
	}
	getPosition() {
		return new Y(this.positionLineNumber, this.positionColumn);
	}
	getSelectionStart() {
		return new Y(this.selectionStartLineNumber, this.selectionStartColumn);
	}
	setStartPosition(t, n) {
		return this.getDirection() === 0 ? new be(t, n, this.endLineNumber, this.endColumn) : new be(this.endLineNumber, this.endColumn, t, n);
	}
	static fromPositions(t, n = t) {
		return new be(t.lineNumber, t.column, n.lineNumber, n.column);
	}
	static fromRange(t, n) {
		return n === 0 ? new be(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : new be(t.endLineNumber, t.endColumn, t.startLineNumber, t.startColumn);
	}
	static liftSelection(t) {
		return new be(t.selectionStartLineNumber, t.selectionStartColumn, t.positionLineNumber, t.positionColumn);
	}
	static selectionsArrEqual(t, n) {
		if (t && !n || !t && n) return !1;
		if (!t && !n) return !0;
		if (t.length !== n.length) return !1;
		for (let r = 0, i = t.length; r < i; r++) if (!this.selectionsEqual(t[r], n[r])) return !1;
		return !0;
	}
	static isISelection(t) {
		return !!t && typeof t.selectionStartLineNumber == "number" && typeof t.selectionStartColumn == "number" && typeof t.positionLineNumber == "number" && typeof t.positionColumn == "number";
	}
	static createWithDirection(t, n, r, i, s) {
		return s === 0 ? new be(t, n, r, i) : new be(r, i, t, n);
	}
};
const qi = Object.create(null);
function h(e, t) {
	if (Mo(t)) {
		const n = qi[t];
		if (n === void 0) throw new Error(`${e} references an unknown codicon: ${t}`);
		t = n;
	}
	return qi[e] = t, { id: e };
}
const rc = {
	add: h("add", 6e4),
	plus: h("plus", 6e4),
	gistNew: h("gist-new", 6e4),
	repoCreate: h("repo-create", 6e4),
	lightbulb: h("lightbulb", 60001),
	lightBulb: h("light-bulb", 60001),
	repo: h("repo", 60002),
	repoDelete: h("repo-delete", 60002),
	gistFork: h("gist-fork", 60003),
	repoForked: h("repo-forked", 60003),
	gitPullRequest: h("git-pull-request", 60004),
	gitPullRequestAbandoned: h("git-pull-request-abandoned", 60004),
	recordKeys: h("record-keys", 60005),
	keyboard: h("keyboard", 60005),
	tag: h("tag", 60006),
	gitPullRequestLabel: h("git-pull-request-label", 60006),
	tagAdd: h("tag-add", 60006),
	tagRemove: h("tag-remove", 60006),
	person: h("person", 60007),
	personFollow: h("person-follow", 60007),
	personOutline: h("person-outline", 60007),
	personFilled: h("person-filled", 60007),
	sourceControl: h("source-control", 60008),
	mirror: h("mirror", 60009),
	mirrorPublic: h("mirror-public", 60009),
	star: h("star", 60010),
	starAdd: h("star-add", 60010),
	starDelete: h("star-delete", 60010),
	starEmpty: h("star-empty", 60010),
	comment: h("comment", 60011),
	commentAdd: h("comment-add", 60011),
	alert: h("alert", 60012),
	warning: h("warning", 60012),
	search: h("search", 60013),
	searchSave: h("search-save", 60013),
	logOut: h("log-out", 60014),
	signOut: h("sign-out", 60014),
	logIn: h("log-in", 60015),
	signIn: h("sign-in", 60015),
	eye: h("eye", 60016),
	eyeUnwatch: h("eye-unwatch", 60016),
	eyeWatch: h("eye-watch", 60016),
	circleFilled: h("circle-filled", 60017),
	primitiveDot: h("primitive-dot", 60017),
	closeDirty: h("close-dirty", 60017),
	debugBreakpoint: h("debug-breakpoint", 60017),
	debugBreakpointDisabled: h("debug-breakpoint-disabled", 60017),
	debugHint: h("debug-hint", 60017),
	terminalDecorationSuccess: h("terminal-decoration-success", 60017),
	primitiveSquare: h("primitive-square", 60018),
	edit: h("edit", 60019),
	pencil: h("pencil", 60019),
	info: h("info", 60020),
	issueOpened: h("issue-opened", 60020),
	gistPrivate: h("gist-private", 60021),
	gitForkPrivate: h("git-fork-private", 60021),
	lock: h("lock", 60021),
	mirrorPrivate: h("mirror-private", 60021),
	close: h("close", 60022),
	removeClose: h("remove-close", 60022),
	x: h("x", 60022),
	repoSync: h("repo-sync", 60023),
	sync: h("sync", 60023),
	clone: h("clone", 60024),
	desktopDownload: h("desktop-download", 60024),
	beaker: h("beaker", 60025),
	microscope: h("microscope", 60025),
	vm: h("vm", 60026),
	deviceDesktop: h("device-desktop", 60026),
	file: h("file", 60027),
	more: h("more", 60028),
	ellipsis: h("ellipsis", 60028),
	kebabHorizontal: h("kebab-horizontal", 60028),
	mailReply: h("mail-reply", 60029),
	reply: h("reply", 60029),
	organization: h("organization", 60030),
	organizationFilled: h("organization-filled", 60030),
	organizationOutline: h("organization-outline", 60030),
	newFile: h("new-file", 60031),
	fileAdd: h("file-add", 60031),
	newFolder: h("new-folder", 60032),
	fileDirectoryCreate: h("file-directory-create", 60032),
	trash: h("trash", 60033),
	trashcan: h("trashcan", 60033),
	history: h("history", 60034),
	clock: h("clock", 60034),
	folder: h("folder", 60035),
	fileDirectory: h("file-directory", 60035),
	symbolFolder: h("symbol-folder", 60035),
	logoGithub: h("logo-github", 60036),
	markGithub: h("mark-github", 60036),
	github: h("github", 60036),
	terminal: h("terminal", 60037),
	console: h("console", 60037),
	repl: h("repl", 60037),
	zap: h("zap", 60038),
	symbolEvent: h("symbol-event", 60038),
	error: h("error", 60039),
	stop: h("stop", 60039),
	variable: h("variable", 60040),
	symbolVariable: h("symbol-variable", 60040),
	array: h("array", 60042),
	symbolArray: h("symbol-array", 60042),
	symbolModule: h("symbol-module", 60043),
	symbolPackage: h("symbol-package", 60043),
	symbolNamespace: h("symbol-namespace", 60043),
	symbolObject: h("symbol-object", 60043),
	symbolMethod: h("symbol-method", 60044),
	symbolFunction: h("symbol-function", 60044),
	symbolConstructor: h("symbol-constructor", 60044),
	symbolBoolean: h("symbol-boolean", 60047),
	symbolNull: h("symbol-null", 60047),
	symbolNumeric: h("symbol-numeric", 60048),
	symbolNumber: h("symbol-number", 60048),
	symbolStructure: h("symbol-structure", 60049),
	symbolStruct: h("symbol-struct", 60049),
	symbolParameter: h("symbol-parameter", 60050),
	symbolTypeParameter: h("symbol-type-parameter", 60050),
	symbolKey: h("symbol-key", 60051),
	symbolText: h("symbol-text", 60051),
	symbolReference: h("symbol-reference", 60052),
	goToFile: h("go-to-file", 60052),
	symbolEnum: h("symbol-enum", 60053),
	symbolValue: h("symbol-value", 60053),
	symbolRuler: h("symbol-ruler", 60054),
	symbolUnit: h("symbol-unit", 60054),
	activateBreakpoints: h("activate-breakpoints", 60055),
	archive: h("archive", 60056),
	arrowBoth: h("arrow-both", 60057),
	arrowDown: h("arrow-down", 60058),
	arrowLeft: h("arrow-left", 60059),
	arrowRight: h("arrow-right", 60060),
	arrowSmallDown: h("arrow-small-down", 60061),
	arrowSmallLeft: h("arrow-small-left", 60062),
	arrowSmallRight: h("arrow-small-right", 60063),
	arrowSmallUp: h("arrow-small-up", 60064),
	arrowUp: h("arrow-up", 60065),
	bell: h("bell", 60066),
	bold: h("bold", 60067),
	book: h("book", 60068),
	bookmark: h("bookmark", 60069),
	debugBreakpointConditionalUnverified: h("debug-breakpoint-conditional-unverified", 60070),
	debugBreakpointConditional: h("debug-breakpoint-conditional", 60071),
	debugBreakpointConditionalDisabled: h("debug-breakpoint-conditional-disabled", 60071),
	debugBreakpointDataUnverified: h("debug-breakpoint-data-unverified", 60072),
	debugBreakpointData: h("debug-breakpoint-data", 60073),
	debugBreakpointDataDisabled: h("debug-breakpoint-data-disabled", 60073),
	debugBreakpointLogUnverified: h("debug-breakpoint-log-unverified", 60074),
	debugBreakpointLog: h("debug-breakpoint-log", 60075),
	debugBreakpointLogDisabled: h("debug-breakpoint-log-disabled", 60075),
	briefcase: h("briefcase", 60076),
	broadcast: h("broadcast", 60077),
	browser: h("browser", 60078),
	bug: h("bug", 60079),
	calendar: h("calendar", 60080),
	caseSensitive: h("case-sensitive", 60081),
	check: h("check", 60082),
	checklist: h("checklist", 60083),
	chevronDown: h("chevron-down", 60084),
	chevronLeft: h("chevron-left", 60085),
	chevronRight: h("chevron-right", 60086),
	chevronUp: h("chevron-up", 60087),
	chromeClose: h("chrome-close", 60088),
	chromeMaximize: h("chrome-maximize", 60089),
	chromeMinimize: h("chrome-minimize", 60090),
	chromeRestore: h("chrome-restore", 60091),
	circleOutline: h("circle-outline", 60092),
	circle: h("circle", 60092),
	debugBreakpointUnverified: h("debug-breakpoint-unverified", 60092),
	terminalDecorationIncomplete: h("terminal-decoration-incomplete", 60092),
	circleSlash: h("circle-slash", 60093),
	circuitBoard: h("circuit-board", 60094),
	clearAll: h("clear-all", 60095),
	clippy: h("clippy", 60096),
	closeAll: h("close-all", 60097),
	cloudDownload: h("cloud-download", 60098),
	cloudUpload: h("cloud-upload", 60099),
	code: h("code", 60100),
	collapseAll: h("collapse-all", 60101),
	colorMode: h("color-mode", 60102),
	commentDiscussion: h("comment-discussion", 60103),
	creditCard: h("credit-card", 60105),
	dash: h("dash", 60108),
	dashboard: h("dashboard", 60109),
	database: h("database", 60110),
	debugContinue: h("debug-continue", 60111),
	debugDisconnect: h("debug-disconnect", 60112),
	debugPause: h("debug-pause", 60113),
	debugRestart: h("debug-restart", 60114),
	debugStart: h("debug-start", 60115),
	debugStepInto: h("debug-step-into", 60116),
	debugStepOut: h("debug-step-out", 60117),
	debugStepOver: h("debug-step-over", 60118),
	debugStop: h("debug-stop", 60119),
	debug: h("debug", 60120),
	deviceCameraVideo: h("device-camera-video", 60121),
	deviceCamera: h("device-camera", 60122),
	deviceMobile: h("device-mobile", 60123),
	diffAdded: h("diff-added", 60124),
	diffIgnored: h("diff-ignored", 60125),
	diffModified: h("diff-modified", 60126),
	diffRemoved: h("diff-removed", 60127),
	diffRenamed: h("diff-renamed", 60128),
	diff: h("diff", 60129),
	diffSidebyside: h("diff-sidebyside", 60129),
	discard: h("discard", 60130),
	editorLayout: h("editor-layout", 60131),
	emptyWindow: h("empty-window", 60132),
	exclude: h("exclude", 60133),
	extensions: h("extensions", 60134),
	eyeClosed: h("eye-closed", 60135),
	fileBinary: h("file-binary", 60136),
	fileCode: h("file-code", 60137),
	fileMedia: h("file-media", 60138),
	filePdf: h("file-pdf", 60139),
	fileSubmodule: h("file-submodule", 60140),
	fileSymlinkDirectory: h("file-symlink-directory", 60141),
	fileSymlinkFile: h("file-symlink-file", 60142),
	fileZip: h("file-zip", 60143),
	files: h("files", 60144),
	filter: h("filter", 60145),
	flame: h("flame", 60146),
	foldDown: h("fold-down", 60147),
	foldUp: h("fold-up", 60148),
	fold: h("fold", 60149),
	folderActive: h("folder-active", 60150),
	folderOpened: h("folder-opened", 60151),
	gear: h("gear", 60152),
	gift: h("gift", 60153),
	gistSecret: h("gist-secret", 60154),
	gist: h("gist", 60155),
	gitCommit: h("git-commit", 60156),
	gitCompare: h("git-compare", 60157),
	compareChanges: h("compare-changes", 60157),
	gitMerge: h("git-merge", 60158),
	githubAction: h("github-action", 60159),
	githubAlt: h("github-alt", 60160),
	globe: h("globe", 60161),
	grabber: h("grabber", 60162),
	graph: h("graph", 60163),
	gripper: h("gripper", 60164),
	heart: h("heart", 60165),
	home: h("home", 60166),
	horizontalRule: h("horizontal-rule", 60167),
	hubot: h("hubot", 60168),
	inbox: h("inbox", 60169),
	issueReopened: h("issue-reopened", 60171),
	issues: h("issues", 60172),
	italic: h("italic", 60173),
	jersey: h("jersey", 60174),
	json: h("json", 60175),
	kebabVertical: h("kebab-vertical", 60176),
	key: h("key", 60177),
	law: h("law", 60178),
	lightbulbAutofix: h("lightbulb-autofix", 60179),
	linkExternal: h("link-external", 60180),
	link: h("link", 60181),
	listOrdered: h("list-ordered", 60182),
	listUnordered: h("list-unordered", 60183),
	liveShare: h("live-share", 60184),
	loading: h("loading", 60185),
	location: h("location", 60186),
	mailRead: h("mail-read", 60187),
	mail: h("mail", 60188),
	markdown: h("markdown", 60189),
	megaphone: h("megaphone", 60190),
	mention: h("mention", 60191),
	milestone: h("milestone", 60192),
	gitPullRequestMilestone: h("git-pull-request-milestone", 60192),
	mortarBoard: h("mortar-board", 60193),
	move: h("move", 60194),
	multipleWindows: h("multiple-windows", 60195),
	mute: h("mute", 60196),
	noNewline: h("no-newline", 60197),
	note: h("note", 60198),
	octoface: h("octoface", 60199),
	openPreview: h("open-preview", 60200),
	package: h("package", 60201),
	paintcan: h("paintcan", 60202),
	pin: h("pin", 60203),
	play: h("play", 60204),
	run: h("run", 60204),
	plug: h("plug", 60205),
	preserveCase: h("preserve-case", 60206),
	preview: h("preview", 60207),
	project: h("project", 60208),
	pulse: h("pulse", 60209),
	question: h("question", 60210),
	quote: h("quote", 60211),
	radioTower: h("radio-tower", 60212),
	reactions: h("reactions", 60213),
	references: h("references", 60214),
	refresh: h("refresh", 60215),
	regex: h("regex", 60216),
	remoteExplorer: h("remote-explorer", 60217),
	remote: h("remote", 60218),
	remove: h("remove", 60219),
	replaceAll: h("replace-all", 60220),
	replace: h("replace", 60221),
	repoClone: h("repo-clone", 60222),
	repoForcePush: h("repo-force-push", 60223),
	repoPull: h("repo-pull", 60224),
	repoPush: h("repo-push", 60225),
	report: h("report", 60226),
	requestChanges: h("request-changes", 60227),
	rocket: h("rocket", 60228),
	rootFolderOpened: h("root-folder-opened", 60229),
	rootFolder: h("root-folder", 60230),
	rss: h("rss", 60231),
	ruby: h("ruby", 60232),
	saveAll: h("save-all", 60233),
	saveAs: h("save-as", 60234),
	save: h("save", 60235),
	screenFull: h("screen-full", 60236),
	screenNormal: h("screen-normal", 60237),
	searchStop: h("search-stop", 60238),
	server: h("server", 60240),
	settingsGear: h("settings-gear", 60241),
	settings: h("settings", 60242),
	shield: h("shield", 60243),
	smiley: h("smiley", 60244),
	sortPrecedence: h("sort-precedence", 60245),
	splitHorizontal: h("split-horizontal", 60246),
	splitVertical: h("split-vertical", 60247),
	squirrel: h("squirrel", 60248),
	starFull: h("star-full", 60249),
	starHalf: h("star-half", 60250),
	symbolClass: h("symbol-class", 60251),
	symbolColor: h("symbol-color", 60252),
	symbolConstant: h("symbol-constant", 60253),
	symbolEnumMember: h("symbol-enum-member", 60254),
	symbolField: h("symbol-field", 60255),
	symbolFile: h("symbol-file", 60256),
	symbolInterface: h("symbol-interface", 60257),
	symbolKeyword: h("symbol-keyword", 60258),
	symbolMisc: h("symbol-misc", 60259),
	symbolOperator: h("symbol-operator", 60260),
	symbolProperty: h("symbol-property", 60261),
	wrench: h("wrench", 60261),
	wrenchSubaction: h("wrench-subaction", 60261),
	symbolSnippet: h("symbol-snippet", 60262),
	tasklist: h("tasklist", 60263),
	telescope: h("telescope", 60264),
	textSize: h("text-size", 60265),
	threeBars: h("three-bars", 60266),
	thumbsdown: h("thumbsdown", 60267),
	thumbsup: h("thumbsup", 60268),
	tools: h("tools", 60269),
	triangleDown: h("triangle-down", 60270),
	triangleLeft: h("triangle-left", 60271),
	triangleRight: h("triangle-right", 60272),
	triangleUp: h("triangle-up", 60273),
	twitter: h("twitter", 60274),
	unfold: h("unfold", 60275),
	unlock: h("unlock", 60276),
	unmute: h("unmute", 60277),
	unverified: h("unverified", 60278),
	verified: h("verified", 60279),
	versions: h("versions", 60280),
	vmActive: h("vm-active", 60281),
	vmOutline: h("vm-outline", 60282),
	vmRunning: h("vm-running", 60283),
	watch: h("watch", 60284),
	whitespace: h("whitespace", 60285),
	wholeWord: h("whole-word", 60286),
	window: h("window", 60287),
	wordWrap: h("word-wrap", 60288),
	zoomIn: h("zoom-in", 60289),
	zoomOut: h("zoom-out", 60290),
	listFilter: h("list-filter", 60291),
	listFlat: h("list-flat", 60292),
	listSelection: h("list-selection", 60293),
	selection: h("selection", 60293),
	listTree: h("list-tree", 60294),
	debugBreakpointFunctionUnverified: h("debug-breakpoint-function-unverified", 60295),
	debugBreakpointFunction: h("debug-breakpoint-function", 60296),
	debugBreakpointFunctionDisabled: h("debug-breakpoint-function-disabled", 60296),
	debugStackframeActive: h("debug-stackframe-active", 60297),
	circleSmallFilled: h("circle-small-filled", 60298),
	debugStackframeDot: h("debug-stackframe-dot", 60298),
	terminalDecorationMark: h("terminal-decoration-mark", 60298),
	debugStackframe: h("debug-stackframe", 60299),
	debugStackframeFocused: h("debug-stackframe-focused", 60299),
	debugBreakpointUnsupported: h("debug-breakpoint-unsupported", 60300),
	symbolString: h("symbol-string", 60301),
	debugReverseContinue: h("debug-reverse-continue", 60302),
	debugStepBack: h("debug-step-back", 60303),
	debugRestartFrame: h("debug-restart-frame", 60304),
	debugAlt: h("debug-alt", 60305),
	callIncoming: h("call-incoming", 60306),
	callOutgoing: h("call-outgoing", 60307),
	menu: h("menu", 60308),
	expandAll: h("expand-all", 60309),
	feedback: h("feedback", 60310),
	gitPullRequestReviewer: h("git-pull-request-reviewer", 60310),
	groupByRefType: h("group-by-ref-type", 60311),
	ungroupByRefType: h("ungroup-by-ref-type", 60312),
	account: h("account", 60313),
	gitPullRequestAssignee: h("git-pull-request-assignee", 60313),
	bellDot: h("bell-dot", 60314),
	debugConsole: h("debug-console", 60315),
	library: h("library", 60316),
	output: h("output", 60317),
	runAll: h("run-all", 60318),
	syncIgnored: h("sync-ignored", 60319),
	pinned: h("pinned", 60320),
	githubInverted: h("github-inverted", 60321),
	serverProcess: h("server-process", 60322),
	serverEnvironment: h("server-environment", 60323),
	pass: h("pass", 60324),
	issueClosed: h("issue-closed", 60324),
	stopCircle: h("stop-circle", 60325),
	playCircle: h("play-circle", 60326),
	record: h("record", 60327),
	debugAltSmall: h("debug-alt-small", 60328),
	vmConnect: h("vm-connect", 60329),
	cloud: h("cloud", 60330),
	merge: h("merge", 60331),
	export: h("export", 60332),
	graphLeft: h("graph-left", 60333),
	magnet: h("magnet", 60334),
	notebook: h("notebook", 60335),
	redo: h("redo", 60336),
	checkAll: h("check-all", 60337),
	pinnedDirty: h("pinned-dirty", 60338),
	passFilled: h("pass-filled", 60339),
	circleLargeFilled: h("circle-large-filled", 60340),
	circleLarge: h("circle-large", 60341),
	circleLargeOutline: h("circle-large-outline", 60341),
	combine: h("combine", 60342),
	gather: h("gather", 60342),
	table: h("table", 60343),
	variableGroup: h("variable-group", 60344),
	typeHierarchy: h("type-hierarchy", 60345),
	typeHierarchySub: h("type-hierarchy-sub", 60346),
	typeHierarchySuper: h("type-hierarchy-super", 60347),
	gitPullRequestCreate: h("git-pull-request-create", 60348),
	runAbove: h("run-above", 60349),
	runBelow: h("run-below", 60350),
	notebookTemplate: h("notebook-template", 60351),
	debugRerun: h("debug-rerun", 60352),
	workspaceTrusted: h("workspace-trusted", 60353),
	workspaceUntrusted: h("workspace-untrusted", 60354),
	workspaceUnknown: h("workspace-unknown", 60355),
	terminalCmd: h("terminal-cmd", 60356),
	terminalDebian: h("terminal-debian", 60357),
	terminalLinux: h("terminal-linux", 60358),
	terminalPowershell: h("terminal-powershell", 60359),
	terminalTmux: h("terminal-tmux", 60360),
	terminalUbuntu: h("terminal-ubuntu", 60361),
	terminalBash: h("terminal-bash", 60362),
	arrowSwap: h("arrow-swap", 60363),
	copy: h("copy", 60364),
	personAdd: h("person-add", 60365),
	filterFilled: h("filter-filled", 60366),
	wand: h("wand", 60367),
	debugLineByLine: h("debug-line-by-line", 60368),
	inspect: h("inspect", 60369),
	layers: h("layers", 60370),
	layersDot: h("layers-dot", 60371),
	layersActive: h("layers-active", 60372),
	compass: h("compass", 60373),
	compassDot: h("compass-dot", 60374),
	compassActive: h("compass-active", 60375),
	azure: h("azure", 60376),
	issueDraft: h("issue-draft", 60377),
	gitPullRequestClosed: h("git-pull-request-closed", 60378),
	gitPullRequestDraft: h("git-pull-request-draft", 60379),
	debugAll: h("debug-all", 60380),
	debugCoverage: h("debug-coverage", 60381),
	runErrors: h("run-errors", 60382),
	folderLibrary: h("folder-library", 60383),
	debugContinueSmall: h("debug-continue-small", 60384),
	beakerStop: h("beaker-stop", 60385),
	graphLine: h("graph-line", 60386),
	graphScatter: h("graph-scatter", 60387),
	pieChart: h("pie-chart", 60388),
	bracket: h("bracket", 60175),
	bracketDot: h("bracket-dot", 60389),
	bracketError: h("bracket-error", 60390),
	lockSmall: h("lock-small", 60391),
	azureDevops: h("azure-devops", 60392),
	verifiedFilled: h("verified-filled", 60393),
	newline: h("newline", 60394),
	layout: h("layout", 60395),
	layoutActivitybarLeft: h("layout-activitybar-left", 60396),
	layoutActivitybarRight: h("layout-activitybar-right", 60397),
	layoutPanelLeft: h("layout-panel-left", 60398),
	layoutPanelCenter: h("layout-panel-center", 60399),
	layoutPanelJustify: h("layout-panel-justify", 60400),
	layoutPanelRight: h("layout-panel-right", 60401),
	layoutPanel: h("layout-panel", 60402),
	layoutSidebarLeft: h("layout-sidebar-left", 60403),
	layoutSidebarRight: h("layout-sidebar-right", 60404),
	layoutStatusbar: h("layout-statusbar", 60405),
	layoutMenubar: h("layout-menubar", 60406),
	layoutCentered: h("layout-centered", 60407),
	target: h("target", 60408),
	indent: h("indent", 60409),
	recordSmall: h("record-small", 60410),
	errorSmall: h("error-small", 60411),
	terminalDecorationError: h("terminal-decoration-error", 60411),
	arrowCircleDown: h("arrow-circle-down", 60412),
	arrowCircleLeft: h("arrow-circle-left", 60413),
	arrowCircleRight: h("arrow-circle-right", 60414),
	arrowCircleUp: h("arrow-circle-up", 60415),
	layoutSidebarRightOff: h("layout-sidebar-right-off", 60416),
	layoutPanelOff: h("layout-panel-off", 60417),
	layoutSidebarLeftOff: h("layout-sidebar-left-off", 60418),
	blank: h("blank", 60419),
	heartFilled: h("heart-filled", 60420),
	map: h("map", 60421),
	mapHorizontal: h("map-horizontal", 60421),
	foldHorizontal: h("fold-horizontal", 60421),
	mapFilled: h("map-filled", 60422),
	mapHorizontalFilled: h("map-horizontal-filled", 60422),
	foldHorizontalFilled: h("fold-horizontal-filled", 60422),
	circleSmall: h("circle-small", 60423),
	bellSlash: h("bell-slash", 60424),
	bellSlashDot: h("bell-slash-dot", 60425),
	commentUnresolved: h("comment-unresolved", 60426),
	gitPullRequestGoToChanges: h("git-pull-request-go-to-changes", 60427),
	gitPullRequestNewChanges: h("git-pull-request-new-changes", 60428),
	searchFuzzy: h("search-fuzzy", 60429),
	commentDraft: h("comment-draft", 60430),
	send: h("send", 60431),
	sparkle: h("sparkle", 60432),
	insert: h("insert", 60433),
	mic: h("mic", 60434),
	thumbsdownFilled: h("thumbsdown-filled", 60435),
	thumbsupFilled: h("thumbsup-filled", 60436),
	coffee: h("coffee", 60437),
	snake: h("snake", 60438),
	game: h("game", 60439),
	vr: h("vr", 60440),
	chip: h("chip", 60441),
	piano: h("piano", 60442),
	music: h("music", 60443),
	micFilled: h("mic-filled", 60444),
	repoFetch: h("repo-fetch", 60445),
	copilot: h("copilot", 60446),
	lightbulbSparkle: h("lightbulb-sparkle", 60447),
	robot: h("robot", 60448),
	sparkleFilled: h("sparkle-filled", 60449),
	diffSingle: h("diff-single", 60450),
	diffMultiple: h("diff-multiple", 60451),
	surroundWith: h("surround-with", 60452),
	share: h("share", 60453),
	gitStash: h("git-stash", 60454),
	gitStashApply: h("git-stash-apply", 60455),
	gitStashPop: h("git-stash-pop", 60456),
	vscode: h("vscode", 60457),
	vscodeInsiders: h("vscode-insiders", 60458),
	codeOss: h("code-oss", 60459),
	runCoverage: h("run-coverage", 60460),
	runAllCoverage: h("run-all-coverage", 60461),
	coverage: h("coverage", 60462),
	githubProject: h("github-project", 60463),
	mapVertical: h("map-vertical", 60464),
	foldVertical: h("fold-vertical", 60464),
	mapVerticalFilled: h("map-vertical-filled", 60465),
	foldVerticalFilled: h("fold-vertical-filled", 60465),
	goToSearch: h("go-to-search", 60466),
	percentage: h("percentage", 60467),
	sortPercentage: h("sort-percentage", 60467),
	attach: h("attach", 60468),
	goToEditingSession: h("go-to-editing-session", 60469),
	editSession: h("edit-session", 60470),
	codeReview: h("code-review", 60471),
	copilotWarning: h("copilot-warning", 60472),
	python: h("python", 60473),
	copilotLarge: h("copilot-large", 60474),
	copilotWarningLarge: h("copilot-warning-large", 60475),
	keyboardTab: h("keyboard-tab", 60476),
	copilotBlocked: h("copilot-blocked", 60477),
	copilotNotConnected: h("copilot-not-connected", 60478),
	flag: h("flag", 60479),
	lightbulbEmpty: h("lightbulb-empty", 60480),
	symbolMethodArrow: h("symbol-method-arrow", 60481),
	copilotUnavailable: h("copilot-unavailable", 60482),
	repoPinned: h("repo-pinned", 60483),
	keyboardTabAbove: h("keyboard-tab-above", 60484),
	keyboardTabBelow: h("keyboard-tab-below", 60485),
	gitPullRequestDone: h("git-pull-request-done", 60486),
	mcp: h("mcp", 60487),
	extensionsLarge: h("extensions-large", 60488),
	layoutPanelDock: h("layout-panel-dock", 60489),
	layoutSidebarLeftDock: h("layout-sidebar-left-dock", 60490),
	layoutSidebarRightDock: h("layout-sidebar-right-dock", 60491),
	copilotInProgress: h("copilot-in-progress", 60492),
	copilotError: h("copilot-error", 60493),
	copilotSuccess: h("copilot-success", 60494),
	chatSparkle: h("chat-sparkle", 60495),
	searchSparkle: h("search-sparkle", 60496),
	editSparkle: h("edit-sparkle", 60497),
	copilotSnooze: h("copilot-snooze", 60498),
	sendToRemoteAgent: h("send-to-remote-agent", 60499),
	commentDiscussionSparkle: h("comment-discussion-sparkle", 60500),
	chatSparkleWarning: h("chat-sparkle-warning", 60501),
	chatSparkleError: h("chat-sparkle-error", 60502),
	collection: h("collection", 60503),
	newCollection: h("new-collection", 60504),
	thinking: h("thinking", 60505),
	build: h("build", 60506),
	commentDiscussionQuote: h("comment-discussion-quote", 60507),
	cursor: h("cursor", 60508),
	eraser: h("eraser", 60509),
	fileText: h("file-text", 60510),
	gitLens: h("git-lens", 60511),
	quotes: h("quotes", 60512),
	rename: h("rename", 60513),
	runWithDeps: h("run-with-deps", 60514),
	debugConnected: h("debug-connected", 60515),
	strikethrough: h("strikethrough", 60516),
	openInProduct: h("open-in-product", 60517),
	indexZero: h("index-zero", 60518),
	agent: h("agent", 60519),
	editCode: h("edit-code", 60520),
	repoSelected: h("repo-selected", 60521),
	skip: h("skip", 60522),
	mergeInto: h("merge-into", 60523),
	gitBranchChanges: h("git-branch-changes", 60524),
	gitBranchStagedChanges: h("git-branch-staged-changes", 60525),
	gitBranchConflicts: h("git-branch-conflicts", 60526),
	gitBranch: h("git-branch", 60527),
	gitBranchCreate: h("git-branch-create", 60527),
	gitBranchDelete: h("git-branch-delete", 60527),
	searchLarge: h("search-large", 60528),
	terminalGitBash: h("terminal-git-bash", 60529)
}, sc = {
	dialogError: h("dialog-error", "error"),
	dialogWarning: h("dialog-warning", "warning"),
	dialogInfo: h("dialog-info", "info"),
	dialogClose: h("dialog-close", "close"),
	treeItemExpanded: h("tree-item-expanded", "chevron-down"),
	treeFilterOnTypeOn: h("tree-filter-on-type-on", "list-filter"),
	treeFilterOnTypeOff: h("tree-filter-on-type-off", "list-selection"),
	treeFilterClear: h("tree-filter-clear", "close"),
	treeItemLoading: h("tree-item-loading", "loading"),
	menuSelection: h("menu-selection", "check"),
	menuSubmenu: h("menu-submenu", "chevron-right"),
	menuBarMore: h("menubar-more", "more"),
	scrollbarButtonLeft: h("scrollbar-button-left", "triangle-left"),
	scrollbarButtonRight: h("scrollbar-button-right", "triangle-right"),
	scrollbarButtonUp: h("scrollbar-button-up", "triangle-up"),
	scrollbarButtonDown: h("scrollbar-button-down", "triangle-down"),
	toolBarMore: h("toolbar-more", "more"),
	quickInputBack: h("quick-input-back", "arrow-left"),
	dropDownButton: h("drop-down-button", 60084),
	symbolCustomColor: h("symbol-customcolor", 60252),
	exportIcon: h("export", 60332),
	workspaceUnspecified: h("workspace-unspecified", 60355),
	newLine: h("newline", 60394),
	thumbsDownFilled: h("thumbsdown-filled", 60435),
	thumbsUpFilled: h("thumbsup-filled", 60436),
	gitFetch: h("git-fetch", 60445),
	lightbulbSparkleAutofix: h("lightbulb-sparkle-autofix", 60447),
	debugBreakpointPending: h("debug-breakpoint-pending", 60377)
}, O = {
	...rc,
	...sc
};
var ac = class {
	constructor() {
		this._tokenizationSupports = /* @__PURE__ */ new Map(), this._factories = /* @__PURE__ */ new Map(), this._onDidChange = new Se(), this.onDidChange = this._onDidChange.event, this._colorMap = null;
	}
	handleChange(e) {
		this._onDidChange.fire({
			changedLanguages: e,
			changedColorMap: !1
		});
	}
	register(e, t) {
		return this._tokenizationSupports.set(e, t), this.handleChange([e]), Gt(() => {
			this._tokenizationSupports.get(e) === t && (this._tokenizationSupports.delete(e), this.handleChange([e]));
		});
	}
	get(e) {
		return this._tokenizationSupports.get(e) || null;
	}
	registerFactory(e, t) {
		this._factories.get(e)?.dispose();
		const n = new oc(this, e, t);
		return this._factories.set(e, n), Gt(() => {
			const r = this._factories.get(e);
			!r || r !== n || (this._factories.delete(e), r.dispose());
		});
	}
	async getOrCreate(e) {
		const t = this.get(e);
		if (t) return t;
		const n = this._factories.get(e);
		return !n || n.isResolved ? null : (await n.resolve(), this.get(e));
	}
	isResolved(e) {
		if (this.get(e)) return !0;
		const t = this._factories.get(e);
		return !!(!t || t.isResolved);
	}
	setColorMap(e) {
		this._colorMap = e, this._onDidChange.fire({
			changedLanguages: Array.from(this._tokenizationSupports.keys()),
			changedColorMap: !0
		});
	}
	getColorMap() {
		return this._colorMap;
	}
	getDefaultBackground() {
		return this._colorMap && this._colorMap.length > 2 ? this._colorMap[2] : null;
	}
}, oc = class extends kt {
	get isResolved() {
		return this._isResolved;
	}
	constructor(e, t, n) {
		super(), this._registry = e, this._languageId = t, this._factory = n, this._isDisposed = !1, this._resolvePromise = null, this._isResolved = !1;
	}
	dispose() {
		this._isDisposed = !0, super.dispose();
	}
	async resolve() {
		return this._resolvePromise || (this._resolvePromise = this._create()), this._resolvePromise;
	}
	async _create() {
		const e = await this._factory.tokenizationSupport;
		this._isResolved = !0, e && !this._isDisposed && this._register(this._registry.register(this._languageId, e));
	}
}, lc = class {
	constructor(e, t, n) {
		this.offset = e, this.type = t, this.language = n, this._tokenBrand = void 0;
	}
	toString() {
		return "(" + this.offset + ", " + this.type + ")";
	}
}, Oi;
(function(e) {
	e[e.Increase = 0] = "Increase", e[e.Decrease = 1] = "Decrease";
})(Oi || (Oi = {}));
var Fi;
(function(e) {
	const t = /* @__PURE__ */ new Map();
	t.set(0, O.symbolMethod), t.set(1, O.symbolFunction), t.set(2, O.symbolConstructor), t.set(3, O.symbolField), t.set(4, O.symbolVariable), t.set(5, O.symbolClass), t.set(6, O.symbolStruct), t.set(7, O.symbolInterface), t.set(8, O.symbolModule), t.set(9, O.symbolProperty), t.set(10, O.symbolEvent), t.set(11, O.symbolOperator), t.set(12, O.symbolUnit), t.set(13, O.symbolValue), t.set(15, O.symbolEnum), t.set(14, O.symbolConstant), t.set(15, O.symbolEnum), t.set(16, O.symbolEnumMember), t.set(17, O.symbolKeyword), t.set(28, O.symbolSnippet), t.set(18, O.symbolText), t.set(19, O.symbolColor), t.set(20, O.symbolFile), t.set(21, O.symbolReference), t.set(22, O.symbolCustomColor), t.set(23, O.symbolFolder), t.set(24, O.symbolTypeParameter), t.set(25, O.account), t.set(26, O.issues), t.set(27, O.tools);
	function n(a) {
		let o = t.get(a);
		return o || (console.info("No codicon found for CompletionItemKind " + a), o = O.symbolProperty), o;
	}
	e.toIcon = n;
	function r(a) {
		switch (a) {
			case 0: return F(728, "Method");
			case 1: return F(729, "Function");
			case 2: return F(730, "Constructor");
			case 3: return F(731, "Field");
			case 4: return F(732, "Variable");
			case 5: return F(733, "Class");
			case 6: return F(734, "Struct");
			case 7: return F(735, "Interface");
			case 8: return F(736, "Module");
			case 9: return F(737, "Property");
			case 10: return F(738, "Event");
			case 11: return F(739, "Operator");
			case 12: return F(740, "Unit");
			case 13: return F(741, "Value");
			case 14: return F(742, "Constant");
			case 15: return F(743, "Enum");
			case 16: return F(744, "Enum Member");
			case 17: return F(745, "Keyword");
			case 18: return F(746, "Text");
			case 19: return F(747, "Color");
			case 20: return F(748, "File");
			case 21: return F(749, "Reference");
			case 22: return F(750, "Custom Color");
			case 23: return F(751, "Folder");
			case 24: return F(752, "Type Parameter");
			case 25: return F(753, "User");
			case 26: return F(754, "Issue");
			case 27: return F(755, "Tool");
			case 28: return F(756, "Snippet");
			default: return "";
		}
	}
	e.toLabel = r;
	const i = /* @__PURE__ */ new Map();
	i.set("method", 0), i.set("function", 1), i.set("constructor", 2), i.set("field", 3), i.set("variable", 4), i.set("class", 5), i.set("struct", 6), i.set("interface", 7), i.set("module", 8), i.set("property", 9), i.set("event", 10), i.set("operator", 11), i.set("unit", 12), i.set("value", 13), i.set("constant", 14), i.set("enum", 15), i.set("enum-member", 16), i.set("enumMember", 16), i.set("keyword", 17), i.set("snippet", 28), i.set("text", 18), i.set("color", 19), i.set("file", 20), i.set("reference", 21), i.set("customcolor", 22), i.set("folder", 23), i.set("type-parameter", 24), i.set("typeParameter", 24), i.set("account", 25), i.set("issue", 26), i.set("tool", 27);
	function s(a, o) {
		let l = i.get(a);
		return typeof l > "u" && !o && (l = 9), l;
	}
	e.fromString = s;
})(Fi || (Fi = {}));
var Bi;
(function(e) {
	e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(Bi || (Bi = {}));
var Vi;
(function(e) {
	e[e.Code = 1] = "Code", e[e.Label = 2] = "Label";
})(Vi || (Vi = {}));
var ji;
(function(e) {
	e[e.Accepted = 0] = "Accepted", e[e.Rejected = 1] = "Rejected", e[e.Ignored = 2] = "Ignored";
})(ji || (ji = {}));
var $i;
(function(e) {
	e[e.Automatic = 0] = "Automatic", e[e.PasteAs = 1] = "PasteAs";
})($i || ($i = {}));
var Gi;
(function(e) {
	e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(Gi || (Gi = {}));
var Xi;
(function(e) {
	e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(Xi || (Xi = {}));
F(757, "array"), F(758, "boolean"), F(759, "class"), F(760, "constant"), F(761, "constructor"), F(762, "enumeration"), F(763, "enumeration member"), F(764, "event"), F(765, "field"), F(766, "file"), F(767, "function"), F(768, "interface"), F(769, "key"), F(770, "method"), F(771, "module"), F(772, "namespace"), F(773, "null"), F(774, "number"), F(775, "object"), F(776, "operator"), F(777, "package"), F(778, "property"), F(779, "string"), F(780, "struct"), F(781, "type parameter"), F(782, "variable");
var Yi;
(function(e) {
	const t = /* @__PURE__ */ new Map();
	t.set(0, O.symbolFile), t.set(1, O.symbolModule), t.set(2, O.symbolNamespace), t.set(3, O.symbolPackage), t.set(4, O.symbolClass), t.set(5, O.symbolMethod), t.set(6, O.symbolProperty), t.set(7, O.symbolField), t.set(8, O.symbolConstructor), t.set(9, O.symbolEnum), t.set(10, O.symbolInterface), t.set(11, O.symbolFunction), t.set(12, O.symbolVariable), t.set(13, O.symbolConstant), t.set(14, O.symbolString), t.set(15, O.symbolNumber), t.set(16, O.symbolBoolean), t.set(17, O.symbolArray), t.set(18, O.symbolObject), t.set(19, O.symbolKey), t.set(20, O.symbolNull), t.set(21, O.symbolEnumMember), t.set(22, O.symbolStruct), t.set(23, O.symbolEvent), t.set(24, O.symbolOperator), t.set(25, O.symbolTypeParameter);
	function n(s) {
		let a = t.get(s);
		return a || (console.info("No codicon found for SymbolKind " + s), a = O.symbolProperty), a;
	}
	e.toIcon = n;
	const r = /* @__PURE__ */ new Map();
	r.set(0, 20), r.set(1, 8), r.set(2, 8), r.set(3, 8), r.set(4, 5), r.set(5, 0), r.set(6, 9), r.set(7, 3), r.set(8, 2), r.set(9, 15), r.set(10, 7), r.set(11, 1), r.set(12, 4), r.set(13, 14), r.set(14, 18), r.set(15, 13), r.set(16, 13), r.set(17, 13), r.set(18, 13), r.set(19, 17), r.set(20, 13), r.set(21, 16), r.set(22, 6), r.set(23, 10), r.set(24, 11), r.set(25, 24);
	function i(s) {
		let a = r.get(s);
		return a === void 0 && (console.info("No completion kind found for SymbolKind " + s), a = 20), a;
	}
	e.toCompletionKind = i;
})(Yi || (Yi = {}));
(class Ue {
	static {
		this.Comment = new Ue("comment");
	}
	static {
		this.Imports = new Ue("imports");
	}
	static {
		this.Region = new Ue("region");
	}
	static fromValue(t) {
		switch (t) {
			case "comment": return Ue.Comment;
			case "imports": return Ue.Imports;
			case "region": return Ue.Region;
		}
		return new Ue(t);
	}
	constructor(t) {
		this.value = t;
	}
});
var Ji;
(function(e) {
	e[e.AIGenerated = 1] = "AIGenerated";
})(Ji || (Ji = {}));
var Qi;
(function(e) {
	e[e.Invoke = 0] = "Invoke", e[e.Automatic = 1] = "Automatic";
})(Qi || (Qi = {}));
var Zi;
(function(e) {
	function t(n) {
		return !n || typeof n != "object" ? !1 : typeof n.id == "string" && typeof n.title == "string";
	}
	e.is = t;
})(Zi || (Zi = {}));
var Ki;
(function(e) {
	e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(Ki || (Ki = {}));
new ac();
var er;
(function(e) {
	e[e.Unknown = 0] = "Unknown", e[e.Disabled = 1] = "Disabled", e[e.Enabled = 2] = "Enabled";
})(er || (er = {}));
var tr;
(function(e) {
	e[e.Invoke = 1] = "Invoke", e[e.Auto = 2] = "Auto";
})(tr || (tr = {}));
var nr;
(function(e) {
	e[e.None = 0] = "None", e[e.KeepWhitespace = 1] = "KeepWhitespace", e[e.InsertAsSnippet = 4] = "InsertAsSnippet";
})(nr || (nr = {}));
var ir;
(function(e) {
	e[e.Method = 0] = "Method", e[e.Function = 1] = "Function", e[e.Constructor = 2] = "Constructor", e[e.Field = 3] = "Field", e[e.Variable = 4] = "Variable", e[e.Class = 5] = "Class", e[e.Struct = 6] = "Struct", e[e.Interface = 7] = "Interface", e[e.Module = 8] = "Module", e[e.Property = 9] = "Property", e[e.Event = 10] = "Event", e[e.Operator = 11] = "Operator", e[e.Unit = 12] = "Unit", e[e.Value = 13] = "Value", e[e.Constant = 14] = "Constant", e[e.Enum = 15] = "Enum", e[e.EnumMember = 16] = "EnumMember", e[e.Keyword = 17] = "Keyword", e[e.Text = 18] = "Text", e[e.Color = 19] = "Color", e[e.File = 20] = "File", e[e.Reference = 21] = "Reference", e[e.Customcolor = 22] = "Customcolor", e[e.Folder = 23] = "Folder", e[e.TypeParameter = 24] = "TypeParameter", e[e.User = 25] = "User", e[e.Issue = 26] = "Issue", e[e.Tool = 27] = "Tool", e[e.Snippet = 28] = "Snippet";
})(ir || (ir = {}));
var rr;
(function(e) {
	e[e.Deprecated = 1] = "Deprecated";
})(rr || (rr = {}));
var sr;
(function(e) {
	e[e.Invoke = 0] = "Invoke", e[e.TriggerCharacter = 1] = "TriggerCharacter", e[e.TriggerForIncompleteCompletions = 2] = "TriggerForIncompleteCompletions";
})(sr || (sr = {}));
var ar;
(function(e) {
	e[e.EXACT = 0] = "EXACT", e[e.ABOVE = 1] = "ABOVE", e[e.BELOW = 2] = "BELOW";
})(ar || (ar = {}));
var or;
(function(e) {
	e[e.NotSet = 0] = "NotSet", e[e.ContentFlush = 1] = "ContentFlush", e[e.RecoverFromMarkers = 2] = "RecoverFromMarkers", e[e.Explicit = 3] = "Explicit", e[e.Paste = 4] = "Paste", e[e.Undo = 5] = "Undo", e[e.Redo = 6] = "Redo";
})(or || (or = {}));
var lr;
(function(e) {
	e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(lr || (lr = {}));
var cr;
(function(e) {
	e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(cr || (cr = {}));
var hr;
(function(e) {
	e[e.None = 0] = "None", e[e.Keep = 1] = "Keep", e[e.Brackets = 2] = "Brackets", e[e.Advanced = 3] = "Advanced", e[e.Full = 4] = "Full";
})(hr || (hr = {}));
var ur;
(function(e) {
	e[e.acceptSuggestionOnCommitCharacter = 0] = "acceptSuggestionOnCommitCharacter", e[e.acceptSuggestionOnEnter = 1] = "acceptSuggestionOnEnter", e[e.accessibilitySupport = 2] = "accessibilitySupport", e[e.accessibilityPageSize = 3] = "accessibilityPageSize", e[e.allowOverflow = 4] = "allowOverflow", e[e.allowVariableLineHeights = 5] = "allowVariableLineHeights", e[e.allowVariableFonts = 6] = "allowVariableFonts", e[e.allowVariableFontsInAccessibilityMode = 7] = "allowVariableFontsInAccessibilityMode", e[e.ariaLabel = 8] = "ariaLabel", e[e.ariaRequired = 9] = "ariaRequired", e[e.autoClosingBrackets = 10] = "autoClosingBrackets", e[e.autoClosingComments = 11] = "autoClosingComments", e[e.screenReaderAnnounceInlineSuggestion = 12] = "screenReaderAnnounceInlineSuggestion", e[e.autoClosingDelete = 13] = "autoClosingDelete", e[e.autoClosingOvertype = 14] = "autoClosingOvertype", e[e.autoClosingQuotes = 15] = "autoClosingQuotes", e[e.autoIndent = 16] = "autoIndent", e[e.autoIndentOnPaste = 17] = "autoIndentOnPaste", e[e.autoIndentOnPasteWithinString = 18] = "autoIndentOnPasteWithinString", e[e.automaticLayout = 19] = "automaticLayout", e[e.autoSurround = 20] = "autoSurround", e[e.bracketPairColorization = 21] = "bracketPairColorization", e[e.guides = 22] = "guides", e[e.codeLens = 23] = "codeLens", e[e.codeLensFontFamily = 24] = "codeLensFontFamily", e[e.codeLensFontSize = 25] = "codeLensFontSize", e[e.colorDecorators = 26] = "colorDecorators", e[e.colorDecoratorsLimit = 27] = "colorDecoratorsLimit", e[e.columnSelection = 28] = "columnSelection", e[e.comments = 29] = "comments", e[e.contextmenu = 30] = "contextmenu", e[e.copyWithSyntaxHighlighting = 31] = "copyWithSyntaxHighlighting", e[e.cursorBlinking = 32] = "cursorBlinking", e[e.cursorSmoothCaretAnimation = 33] = "cursorSmoothCaretAnimation", e[e.cursorStyle = 34] = "cursorStyle", e[e.cursorSurroundingLines = 35] = "cursorSurroundingLines", e[e.cursorSurroundingLinesStyle = 36] = "cursorSurroundingLinesStyle", e[e.cursorWidth = 37] = "cursorWidth", e[e.cursorHeight = 38] = "cursorHeight", e[e.disableLayerHinting = 39] = "disableLayerHinting", e[e.disableMonospaceOptimizations = 40] = "disableMonospaceOptimizations", e[e.domReadOnly = 41] = "domReadOnly", e[e.dragAndDrop = 42] = "dragAndDrop", e[e.dropIntoEditor = 43] = "dropIntoEditor", e[e.editContext = 44] = "editContext", e[e.emptySelectionClipboard = 45] = "emptySelectionClipboard", e[e.experimentalGpuAcceleration = 46] = "experimentalGpuAcceleration", e[e.experimentalWhitespaceRendering = 47] = "experimentalWhitespaceRendering", e[e.extraEditorClassName = 48] = "extraEditorClassName", e[e.fastScrollSensitivity = 49] = "fastScrollSensitivity", e[e.find = 50] = "find", e[e.fixedOverflowWidgets = 51] = "fixedOverflowWidgets", e[e.folding = 52] = "folding", e[e.foldingStrategy = 53] = "foldingStrategy", e[e.foldingHighlight = 54] = "foldingHighlight", e[e.foldingImportsByDefault = 55] = "foldingImportsByDefault", e[e.foldingMaximumRegions = 56] = "foldingMaximumRegions", e[e.unfoldOnClickAfterEndOfLine = 57] = "unfoldOnClickAfterEndOfLine", e[e.fontFamily = 58] = "fontFamily", e[e.fontInfo = 59] = "fontInfo", e[e.fontLigatures = 60] = "fontLigatures", e[e.fontSize = 61] = "fontSize", e[e.fontWeight = 62] = "fontWeight", e[e.fontVariations = 63] = "fontVariations", e[e.formatOnPaste = 64] = "formatOnPaste", e[e.formatOnType = 65] = "formatOnType", e[e.glyphMargin = 66] = "glyphMargin", e[e.gotoLocation = 67] = "gotoLocation", e[e.hideCursorInOverviewRuler = 68] = "hideCursorInOverviewRuler", e[e.hover = 69] = "hover", e[e.inDiffEditor = 70] = "inDiffEditor", e[e.inlineSuggest = 71] = "inlineSuggest", e[e.letterSpacing = 72] = "letterSpacing", e[e.lightbulb = 73] = "lightbulb", e[e.lineDecorationsWidth = 74] = "lineDecorationsWidth", e[e.lineHeight = 75] = "lineHeight", e[e.lineNumbers = 76] = "lineNumbers", e[e.lineNumbersMinChars = 77] = "lineNumbersMinChars", e[e.linkedEditing = 78] = "linkedEditing", e[e.links = 79] = "links", e[e.matchBrackets = 80] = "matchBrackets", e[e.minimap = 81] = "minimap", e[e.mouseStyle = 82] = "mouseStyle", e[e.mouseWheelScrollSensitivity = 83] = "mouseWheelScrollSensitivity", e[e.mouseWheelZoom = 84] = "mouseWheelZoom", e[e.multiCursorMergeOverlapping = 85] = "multiCursorMergeOverlapping", e[e.multiCursorModifier = 86] = "multiCursorModifier", e[e.mouseMiddleClickAction = 87] = "mouseMiddleClickAction", e[e.multiCursorPaste = 88] = "multiCursorPaste", e[e.multiCursorLimit = 89] = "multiCursorLimit", e[e.occurrencesHighlight = 90] = "occurrencesHighlight", e[e.occurrencesHighlightDelay = 91] = "occurrencesHighlightDelay", e[e.overtypeCursorStyle = 92] = "overtypeCursorStyle", e[e.overtypeOnPaste = 93] = "overtypeOnPaste", e[e.overviewRulerBorder = 94] = "overviewRulerBorder", e[e.overviewRulerLanes = 95] = "overviewRulerLanes", e[e.padding = 96] = "padding", e[e.pasteAs = 97] = "pasteAs", e[e.parameterHints = 98] = "parameterHints", e[e.peekWidgetDefaultFocus = 99] = "peekWidgetDefaultFocus", e[e.placeholder = 100] = "placeholder", e[e.definitionLinkOpensInPeek = 101] = "definitionLinkOpensInPeek", e[e.quickSuggestions = 102] = "quickSuggestions", e[e.quickSuggestionsDelay = 103] = "quickSuggestionsDelay", e[e.readOnly = 104] = "readOnly", e[e.readOnlyMessage = 105] = "readOnlyMessage", e[e.renameOnType = 106] = "renameOnType", e[e.renderRichScreenReaderContent = 107] = "renderRichScreenReaderContent", e[e.renderControlCharacters = 108] = "renderControlCharacters", e[e.renderFinalNewline = 109] = "renderFinalNewline", e[e.renderLineHighlight = 110] = "renderLineHighlight", e[e.renderLineHighlightOnlyWhenFocus = 111] = "renderLineHighlightOnlyWhenFocus", e[e.renderValidationDecorations = 112] = "renderValidationDecorations", e[e.renderWhitespace = 113] = "renderWhitespace", e[e.revealHorizontalRightPadding = 114] = "revealHorizontalRightPadding", e[e.roundedSelection = 115] = "roundedSelection", e[e.rulers = 116] = "rulers", e[e.scrollbar = 117] = "scrollbar", e[e.scrollBeyondLastColumn = 118] = "scrollBeyondLastColumn", e[e.scrollBeyondLastLine = 119] = "scrollBeyondLastLine", e[e.scrollPredominantAxis = 120] = "scrollPredominantAxis", e[e.selectionClipboard = 121] = "selectionClipboard", e[e.selectionHighlight = 122] = "selectionHighlight", e[e.selectionHighlightMaxLength = 123] = "selectionHighlightMaxLength", e[e.selectionHighlightMultiline = 124] = "selectionHighlightMultiline", e[e.selectOnLineNumbers = 125] = "selectOnLineNumbers", e[e.showFoldingControls = 126] = "showFoldingControls", e[e.showUnused = 127] = "showUnused", e[e.snippetSuggestions = 128] = "snippetSuggestions", e[e.smartSelect = 129] = "smartSelect", e[e.smoothScrolling = 130] = "smoothScrolling", e[e.stickyScroll = 131] = "stickyScroll", e[e.stickyTabStops = 132] = "stickyTabStops", e[e.stopRenderingLineAfter = 133] = "stopRenderingLineAfter", e[e.suggest = 134] = "suggest", e[e.suggestFontSize = 135] = "suggestFontSize", e[e.suggestLineHeight = 136] = "suggestLineHeight", e[e.suggestOnTriggerCharacters = 137] = "suggestOnTriggerCharacters", e[e.suggestSelection = 138] = "suggestSelection", e[e.tabCompletion = 139] = "tabCompletion", e[e.tabIndex = 140] = "tabIndex", e[e.trimWhitespaceOnDelete = 141] = "trimWhitespaceOnDelete", e[e.unicodeHighlighting = 142] = "unicodeHighlighting", e[e.unusualLineTerminators = 143] = "unusualLineTerminators", e[e.useShadowDOM = 144] = "useShadowDOM", e[e.useTabStops = 145] = "useTabStops", e[e.wordBreak = 146] = "wordBreak", e[e.wordSegmenterLocales = 147] = "wordSegmenterLocales", e[e.wordSeparators = 148] = "wordSeparators", e[e.wordWrap = 149] = "wordWrap", e[e.wordWrapBreakAfterCharacters = 150] = "wordWrapBreakAfterCharacters", e[e.wordWrapBreakBeforeCharacters = 151] = "wordWrapBreakBeforeCharacters", e[e.wordWrapColumn = 152] = "wordWrapColumn", e[e.wordWrapOverride1 = 153] = "wordWrapOverride1", e[e.wordWrapOverride2 = 154] = "wordWrapOverride2", e[e.wrappingIndent = 155] = "wrappingIndent", e[e.wrappingStrategy = 156] = "wrappingStrategy", e[e.showDeprecated = 157] = "showDeprecated", e[e.inertialScroll = 158] = "inertialScroll", e[e.inlayHints = 159] = "inlayHints", e[e.wrapOnEscapedLineFeeds = 160] = "wrapOnEscapedLineFeeds", e[e.effectiveCursorStyle = 161] = "effectiveCursorStyle", e[e.editorClassName = 162] = "editorClassName", e[e.pixelRatio = 163] = "pixelRatio", e[e.tabFocusMode = 164] = "tabFocusMode", e[e.layoutInfo = 165] = "layoutInfo", e[e.wrappingInfo = 166] = "wrappingInfo", e[e.defaultColorDecorators = 167] = "defaultColorDecorators", e[e.colorDecoratorsActivatedOn = 168] = "colorDecoratorsActivatedOn", e[e.inlineCompletionsAccessibilityVerbose = 169] = "inlineCompletionsAccessibilityVerbose", e[e.effectiveEditContext = 170] = "effectiveEditContext", e[e.scrollOnMiddleClick = 171] = "scrollOnMiddleClick", e[e.effectiveAllowVariableFonts = 172] = "effectiveAllowVariableFonts";
})(ur || (ur = {}));
var dr;
(function(e) {
	e[e.TextDefined = 0] = "TextDefined", e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(dr || (dr = {}));
var mr;
(function(e) {
	e[e.LF = 0] = "LF", e[e.CRLF = 1] = "CRLF";
})(mr || (mr = {}));
var fr;
(function(e) {
	e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 3] = "Right";
})(fr || (fr = {}));
var pr;
(function(e) {
	e[e.Increase = 0] = "Increase", e[e.Decrease = 1] = "Decrease";
})(pr || (pr = {}));
var gr;
(function(e) {
	e[e.None = 0] = "None", e[e.Indent = 1] = "Indent", e[e.IndentOutdent = 2] = "IndentOutdent", e[e.Outdent = 3] = "Outdent";
})(gr || (gr = {}));
var br;
(function(e) {
	e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(br || (br = {}));
var wr;
(function(e) {
	e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(wr || (wr = {}));
var _r;
(function(e) {
	e[e.Accepted = 0] = "Accepted", e[e.Rejected = 1] = "Rejected", e[e.Ignored = 2] = "Ignored";
})(_r || (_r = {}));
var vr;
(function(e) {
	e[e.Code = 1] = "Code", e[e.Label = 2] = "Label";
})(vr || (vr = {}));
var yr;
(function(e) {
	e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(yr || (yr = {}));
var Fn;
(function(e) {
	e[e.DependsOnKbLayout = -1] = "DependsOnKbLayout", e[e.Unknown = 0] = "Unknown", e[e.Backspace = 1] = "Backspace", e[e.Tab = 2] = "Tab", e[e.Enter = 3] = "Enter", e[e.Shift = 4] = "Shift", e[e.Ctrl = 5] = "Ctrl", e[e.Alt = 6] = "Alt", e[e.PauseBreak = 7] = "PauseBreak", e[e.CapsLock = 8] = "CapsLock", e[e.Escape = 9] = "Escape", e[e.Space = 10] = "Space", e[e.PageUp = 11] = "PageUp", e[e.PageDown = 12] = "PageDown", e[e.End = 13] = "End", e[e.Home = 14] = "Home", e[e.LeftArrow = 15] = "LeftArrow", e[e.UpArrow = 16] = "UpArrow", e[e.RightArrow = 17] = "RightArrow", e[e.DownArrow = 18] = "DownArrow", e[e.Insert = 19] = "Insert", e[e.Delete = 20] = "Delete", e[e.Digit0 = 21] = "Digit0", e[e.Digit1 = 22] = "Digit1", e[e.Digit2 = 23] = "Digit2", e[e.Digit3 = 24] = "Digit3", e[e.Digit4 = 25] = "Digit4", e[e.Digit5 = 26] = "Digit5", e[e.Digit6 = 27] = "Digit6", e[e.Digit7 = 28] = "Digit7", e[e.Digit8 = 29] = "Digit8", e[e.Digit9 = 30] = "Digit9", e[e.KeyA = 31] = "KeyA", e[e.KeyB = 32] = "KeyB", e[e.KeyC = 33] = "KeyC", e[e.KeyD = 34] = "KeyD", e[e.KeyE = 35] = "KeyE", e[e.KeyF = 36] = "KeyF", e[e.KeyG = 37] = "KeyG", e[e.KeyH = 38] = "KeyH", e[e.KeyI = 39] = "KeyI", e[e.KeyJ = 40] = "KeyJ", e[e.KeyK = 41] = "KeyK", e[e.KeyL = 42] = "KeyL", e[e.KeyM = 43] = "KeyM", e[e.KeyN = 44] = "KeyN", e[e.KeyO = 45] = "KeyO", e[e.KeyP = 46] = "KeyP", e[e.KeyQ = 47] = "KeyQ", e[e.KeyR = 48] = "KeyR", e[e.KeyS = 49] = "KeyS", e[e.KeyT = 50] = "KeyT", e[e.KeyU = 51] = "KeyU", e[e.KeyV = 52] = "KeyV", e[e.KeyW = 53] = "KeyW", e[e.KeyX = 54] = "KeyX", e[e.KeyY = 55] = "KeyY", e[e.KeyZ = 56] = "KeyZ", e[e.Meta = 57] = "Meta", e[e.ContextMenu = 58] = "ContextMenu", e[e.F1 = 59] = "F1", e[e.F2 = 60] = "F2", e[e.F3 = 61] = "F3", e[e.F4 = 62] = "F4", e[e.F5 = 63] = "F5", e[e.F6 = 64] = "F6", e[e.F7 = 65] = "F7", e[e.F8 = 66] = "F8", e[e.F9 = 67] = "F9", e[e.F10 = 68] = "F10", e[e.F11 = 69] = "F11", e[e.F12 = 70] = "F12", e[e.F13 = 71] = "F13", e[e.F14 = 72] = "F14", e[e.F15 = 73] = "F15", e[e.F16 = 74] = "F16", e[e.F17 = 75] = "F17", e[e.F18 = 76] = "F18", e[e.F19 = 77] = "F19", e[e.F20 = 78] = "F20", e[e.F21 = 79] = "F21", e[e.F22 = 80] = "F22", e[e.F23 = 81] = "F23", e[e.F24 = 82] = "F24", e[e.NumLock = 83] = "NumLock", e[e.ScrollLock = 84] = "ScrollLock", e[e.Semicolon = 85] = "Semicolon", e[e.Equal = 86] = "Equal", e[e.Comma = 87] = "Comma", e[e.Minus = 88] = "Minus", e[e.Period = 89] = "Period", e[e.Slash = 90] = "Slash", e[e.Backquote = 91] = "Backquote", e[e.BracketLeft = 92] = "BracketLeft", e[e.Backslash = 93] = "Backslash", e[e.BracketRight = 94] = "BracketRight", e[e.Quote = 95] = "Quote", e[e.OEM_8 = 96] = "OEM_8", e[e.IntlBackslash = 97] = "IntlBackslash", e[e.Numpad0 = 98] = "Numpad0", e[e.Numpad1 = 99] = "Numpad1", e[e.Numpad2 = 100] = "Numpad2", e[e.Numpad3 = 101] = "Numpad3", e[e.Numpad4 = 102] = "Numpad4", e[e.Numpad5 = 103] = "Numpad5", e[e.Numpad6 = 104] = "Numpad6", e[e.Numpad7 = 105] = "Numpad7", e[e.Numpad8 = 106] = "Numpad8", e[e.Numpad9 = 107] = "Numpad9", e[e.NumpadMultiply = 108] = "NumpadMultiply", e[e.NumpadAdd = 109] = "NumpadAdd", e[e.NUMPAD_SEPARATOR = 110] = "NUMPAD_SEPARATOR", e[e.NumpadSubtract = 111] = "NumpadSubtract", e[e.NumpadDecimal = 112] = "NumpadDecimal", e[e.NumpadDivide = 113] = "NumpadDivide", e[e.KEY_IN_COMPOSITION = 114] = "KEY_IN_COMPOSITION", e[e.ABNT_C1 = 115] = "ABNT_C1", e[e.ABNT_C2 = 116] = "ABNT_C2", e[e.AudioVolumeMute = 117] = "AudioVolumeMute", e[e.AudioVolumeUp = 118] = "AudioVolumeUp", e[e.AudioVolumeDown = 119] = "AudioVolumeDown", e[e.BrowserSearch = 120] = "BrowserSearch", e[e.BrowserHome = 121] = "BrowserHome", e[e.BrowserBack = 122] = "BrowserBack", e[e.BrowserForward = 123] = "BrowserForward", e[e.MediaTrackNext = 124] = "MediaTrackNext", e[e.MediaTrackPrevious = 125] = "MediaTrackPrevious", e[e.MediaStop = 126] = "MediaStop", e[e.MediaPlayPause = 127] = "MediaPlayPause", e[e.LaunchMediaPlayer = 128] = "LaunchMediaPlayer", e[e.LaunchMail = 129] = "LaunchMail", e[e.LaunchApp2 = 130] = "LaunchApp2", e[e.Clear = 131] = "Clear", e[e.MAX_VALUE = 132] = "MAX_VALUE";
})(Fn || (Fn = {}));
var Bn;
(function(e) {
	e[e.Hint = 1] = "Hint", e[e.Info = 2] = "Info", e[e.Warning = 4] = "Warning", e[e.Error = 8] = "Error";
})(Bn || (Bn = {}));
var Vn;
(function(e) {
	e[e.Unnecessary = 1] = "Unnecessary", e[e.Deprecated = 2] = "Deprecated";
})(Vn || (Vn = {}));
var Tr;
(function(e) {
	e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(Tr || (Tr = {}));
var kr;
(function(e) {
	e[e.Normal = 1] = "Normal", e[e.Underlined = 2] = "Underlined";
})(kr || (kr = {}));
var Sr;
(function(e) {
	e[e.UNKNOWN = 0] = "UNKNOWN", e[e.TEXTAREA = 1] = "TEXTAREA", e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN", e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS", e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT", e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", e[e.SCROLLBAR = 11] = "SCROLLBAR", e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET", e[e.OUTSIDE_EDITOR = 13] = "OUTSIDE_EDITOR";
})(Sr || (Sr = {}));
var Lr;
(function(e) {
	e[e.AIGenerated = 1] = "AIGenerated";
})(Lr || (Lr = {}));
var xr;
(function(e) {
	e[e.Invoke = 0] = "Invoke", e[e.Automatic = 1] = "Automatic";
})(xr || (xr = {}));
var Ar;
(function(e) {
	e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER", e[e.BOTTOM_RIGHT_CORNER = 1] = "BOTTOM_RIGHT_CORNER", e[e.TOP_CENTER = 2] = "TOP_CENTER";
})(Ar || (Ar = {}));
var Rr;
(function(e) {
	e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(Rr || (Rr = {}));
var Mr;
(function(e) {
	e[e.Word = 0] = "Word", e[e.Line = 1] = "Line", e[e.Suggest = 2] = "Suggest";
})(Mr || (Mr = {}));
var Er;
(function(e) {
	e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.None = 2] = "None", e[e.LeftOfInjectedText = 3] = "LeftOfInjectedText", e[e.RightOfInjectedText = 4] = "RightOfInjectedText";
})(Er || (Er = {}));
var Nr;
(function(e) {
	e[e.Off = 0] = "Off", e[e.On = 1] = "On", e[e.Relative = 2] = "Relative", e[e.Interval = 3] = "Interval", e[e.Custom = 4] = "Custom";
})(Nr || (Nr = {}));
var Cr;
(function(e) {
	e[e.None = 0] = "None", e[e.Text = 1] = "Text", e[e.Blocks = 2] = "Blocks";
})(Cr || (Cr = {}));
var Ir;
(function(e) {
	e[e.Smooth = 0] = "Smooth", e[e.Immediate = 1] = "Immediate";
})(Ir || (Ir = {}));
var zr;
(function(e) {
	e[e.Auto = 1] = "Auto", e[e.Hidden = 2] = "Hidden", e[e.Visible = 3] = "Visible";
})(zr || (zr = {}));
var jn;
(function(e) {
	e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(jn || (jn = {}));
var Hr;
(function(e) {
	e.Off = "off", e.OnCode = "onCode", e.On = "on";
})(Hr || (Hr = {}));
var Ur;
(function(e) {
	e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(Ur || (Ur = {}));
var Dr;
(function(e) {
	e[e.File = 0] = "File", e[e.Module = 1] = "Module", e[e.Namespace = 2] = "Namespace", e[e.Package = 3] = "Package", e[e.Class = 4] = "Class", e[e.Method = 5] = "Method", e[e.Property = 6] = "Property", e[e.Field = 7] = "Field", e[e.Constructor = 8] = "Constructor", e[e.Enum = 9] = "Enum", e[e.Interface = 10] = "Interface", e[e.Function = 11] = "Function", e[e.Variable = 12] = "Variable", e[e.Constant = 13] = "Constant", e[e.String = 14] = "String", e[e.Number = 15] = "Number", e[e.Boolean = 16] = "Boolean", e[e.Array = 17] = "Array", e[e.Object = 18] = "Object", e[e.Key = 19] = "Key", e[e.Null = 20] = "Null", e[e.EnumMember = 21] = "EnumMember", e[e.Struct = 22] = "Struct", e[e.Event = 23] = "Event", e[e.Operator = 24] = "Operator", e[e.TypeParameter = 25] = "TypeParameter";
})(Dr || (Dr = {}));
var Wr;
(function(e) {
	e[e.Deprecated = 1] = "Deprecated";
})(Wr || (Wr = {}));
var Pr;
(function(e) {
	e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(Pr || (Pr = {}));
var qr;
(function(e) {
	e[e.Hidden = 0] = "Hidden", e[e.Blink = 1] = "Blink", e[e.Smooth = 2] = "Smooth", e[e.Phase = 3] = "Phase", e[e.Expand = 4] = "Expand", e[e.Solid = 5] = "Solid";
})(qr || (qr = {}));
var Or;
(function(e) {
	e[e.Line = 1] = "Line", e[e.Block = 2] = "Block", e[e.Underline = 3] = "Underline", e[e.LineThin = 4] = "LineThin", e[e.BlockOutline = 5] = "BlockOutline", e[e.UnderlineThin = 6] = "UnderlineThin";
})(Or || (Or = {}));
var Fr;
(function(e) {
	e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges", e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges", e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore", e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
})(Fr || (Fr = {}));
var Br;
(function(e) {
	e[e.None = 0] = "None", e[e.Same = 1] = "Same", e[e.Indent = 2] = "Indent", e[e.DeepIndent = 3] = "DeepIndent";
})(Br || (Br = {}));
var cc = class {
	static {
		this.CtrlCmd = 2048;
	}
	static {
		this.Shift = 1024;
	}
	static {
		this.Alt = 512;
	}
	static {
		this.WinCtrl = 256;
	}
	static chord(e, t) {
		return Wl(e, t);
	}
};
function hc() {
	return {
		editor: void 0,
		languages: void 0,
		CancellationTokenSource: zl,
		Emitter: Se,
		KeyCode: Fn,
		KeyMod: cc,
		Position: Y,
		Range: j,
		Selection: ic,
		SelectionDirection: jn,
		MarkerSeverity: Bn,
		MarkerTag: Vn,
		Uri: Si,
		Token: lc
	};
}
var Vr, $r, uc = class {
	constructor(e, t) {
		this.uri = e, this.value = t;
	}
};
function dc(e) {
	return Array.isArray(e);
}
(class gt {
	static {
		this.defaultToKey = (t) => t.toString();
	}
	constructor(t, n) {
		if (this[Vr] = "ResourceMap", t instanceof gt) this.map = new Map(t.map), this.toKey = n ?? gt.defaultToKey;
		else if (dc(t)) {
			this.map = /* @__PURE__ */ new Map(), this.toKey = n ?? gt.defaultToKey;
			for (const [r, i] of t) this.set(r, i);
		} else this.map = /* @__PURE__ */ new Map(), this.toKey = t ?? gt.defaultToKey;
	}
	set(t, n) {
		return this.map.set(this.toKey(t), new uc(t, n)), this;
	}
	get(t) {
		return this.map.get(this.toKey(t))?.value;
	}
	has(t) {
		return this.map.has(this.toKey(t));
	}
	get size() {
		return this.map.size;
	}
	clear() {
		this.map.clear();
	}
	delete(t) {
		return this.map.delete(this.toKey(t));
	}
	forEach(t, n) {
		typeof n < "u" && (t = t.bind(n));
		for (const [r, i] of this.map) t(i.value, i.uri, this);
	}
	*values() {
		for (const t of this.map.values()) yield t.value;
	}
	*keys() {
		for (const t of this.map.values()) yield t.uri;
	}
	*entries() {
		for (const t of this.map.values()) yield [t.uri, t.value];
	}
	*[(Vr = Symbol.toStringTag, Symbol.iterator)]() {
		for (const [, t] of this.map) yield [t.uri, t.value];
	}
});
var mc = class {
	constructor() {
		this[$r] = "LinkedMap", this._map = /* @__PURE__ */ new Map(), this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0;
	}
	clear() {
		this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++;
	}
	isEmpty() {
		return !this._head && !this._tail;
	}
	get size() {
		return this._size;
	}
	get first() {
		return this._head?.value;
	}
	get last() {
		return this._tail?.value;
	}
	has(e) {
		return this._map.has(e);
	}
	get(e, t = 0) {
		const n = this._map.get(e);
		if (n) return t !== 0 && this.touch(n, t), n.value;
	}
	set(e, t, n = 0) {
		let r = this._map.get(e);
		if (r) r.value = t, n !== 0 && this.touch(r, n);
		else {
			switch (r = {
				key: e,
				value: t,
				next: void 0,
				previous: void 0
			}, n) {
				case 0:
					this.addItemLast(r);
					break;
				case 1:
					this.addItemFirst(r);
					break;
				case 2:
					this.addItemLast(r);
					break;
				default:
					this.addItemLast(r);
					break;
			}
			this._map.set(e, r), this._size++;
		}
		return this;
	}
	delete(e) {
		return !!this.remove(e);
	}
	remove(e) {
		const t = this._map.get(e);
		if (t) return this._map.delete(e), this.removeItem(t), this._size--, t.value;
	}
	shift() {
		if (!this._head && !this._tail) return;
		if (!this._head || !this._tail) throw new Error("Invalid list");
		const e = this._head;
		return this._map.delete(e.key), this.removeItem(e), this._size--, e.value;
	}
	forEach(e, t) {
		const n = this._state;
		let r = this._head;
		for (; r;) {
			if (t ? e.bind(t)(r.value, r.key, this) : e(r.value, r.key, this), this._state !== n) throw new Error("LinkedMap got modified during iteration.");
			r = r.next;
		}
	}
	keys() {
		const e = this, t = this._state;
		let n = this._head;
		const r = {
			[Symbol.iterator]() {
				return r;
			},
			next() {
				if (e._state !== t) throw new Error("LinkedMap got modified during iteration.");
				if (n) {
					const i = {
						value: n.key,
						done: !1
					};
					return n = n.next, i;
				} else return {
					value: void 0,
					done: !0
				};
			}
		};
		return r;
	}
	values() {
		const e = this, t = this._state;
		let n = this._head;
		const r = {
			[Symbol.iterator]() {
				return r;
			},
			next() {
				if (e._state !== t) throw new Error("LinkedMap got modified during iteration.");
				if (n) {
					const i = {
						value: n.value,
						done: !1
					};
					return n = n.next, i;
				} else return {
					value: void 0,
					done: !0
				};
			}
		};
		return r;
	}
	entries() {
		const e = this, t = this._state;
		let n = this._head;
		const r = {
			[Symbol.iterator]() {
				return r;
			},
			next() {
				if (e._state !== t) throw new Error("LinkedMap got modified during iteration.");
				if (n) {
					const i = {
						value: [n.key, n.value],
						done: !1
					};
					return n = n.next, i;
				} else return {
					value: void 0,
					done: !0
				};
			}
		};
		return r;
	}
	[($r = Symbol.toStringTag, Symbol.iterator)]() {
		return this.entries();
	}
	trimOld(e) {
		if (e >= this.size) return;
		if (e === 0) {
			this.clear();
			return;
		}
		let t = this._head, n = this.size;
		for (; t && n > e;) this._map.delete(t.key), t = t.next, n--;
		this._head = t, this._size = n, t && (t.previous = void 0), this._state++;
	}
	trimNew(e) {
		if (e >= this.size) return;
		if (e === 0) {
			this.clear();
			return;
		}
		let t = this._tail, n = this.size;
		for (; t && n > e;) this._map.delete(t.key), t = t.previous, n--;
		this._tail = t, this._size = n, t && (t.next = void 0), this._state++;
	}
	addItemFirst(e) {
		if (!this._head && !this._tail) this._tail = e;
		else if (this._head) e.next = this._head, this._head.previous = e;
		else throw new Error("Invalid list");
		this._head = e, this._state++;
	}
	addItemLast(e) {
		if (!this._head && !this._tail) this._head = e;
		else if (this._tail) e.previous = this._tail, this._tail.next = e;
		else throw new Error("Invalid list");
		this._tail = e, this._state++;
	}
	removeItem(e) {
		if (e === this._head && e === this._tail) this._head = void 0, this._tail = void 0;
		else if (e === this._head) {
			if (!e.next) throw new Error("Invalid list");
			e.next.previous = void 0, this._head = e.next;
		} else if (e === this._tail) {
			if (!e.previous) throw new Error("Invalid list");
			e.previous.next = void 0, this._tail = e.previous;
		} else {
			const t = e.next, n = e.previous;
			if (!t || !n) throw new Error("Invalid list");
			t.previous = n, n.next = t;
		}
		e.next = void 0, e.previous = void 0, this._state++;
	}
	touch(e, t) {
		if (!this._head || !this._tail) throw new Error("Invalid list");
		if (!(t !== 1 && t !== 2)) {
			if (t === 1) {
				if (e === this._head) return;
				const n = e.next, r = e.previous;
				e === this._tail ? (r.next = void 0, this._tail = r) : (n.previous = r, r.next = n), e.previous = void 0, e.next = this._head, this._head.previous = e, this._head = e, this._state++;
			} else if (t === 2) {
				if (e === this._tail) return;
				const n = e.next, r = e.previous;
				e === this._head ? (n.previous = void 0, this._head = n) : (n.previous = r, r.next = n), e.next = void 0, e.previous = this._tail, this._tail.next = e, this._tail = e, this._state++;
			}
		}
	}
	toJSON() {
		const e = [];
		return this.forEach((t, n) => {
			e.push([n, t]);
		}), e;
	}
	fromJSON(e) {
		this.clear();
		for (const [t, n] of e) this.set(t, n);
	}
}, fc = class extends mc {
	constructor(e, t = 1) {
		super(), this._limit = e, this._ratio = Math.min(Math.max(0, t), 1);
	}
	get limit() {
		return this._limit;
	}
	set limit(e) {
		this._limit = e, this.checkTrim();
	}
	get(e, t = 2) {
		return super.get(e, t);
	}
	peek(e) {
		return super.get(e, 0);
	}
	set(e, t) {
		return super.set(e, t, 2), this;
	}
	checkTrim() {
		this.size > this._limit && this.trim(Math.round(this._limit * this._ratio));
	}
}, pc = class extends fc {
	constructor(e, t = 1) {
		super(e, t);
	}
	trim(e) {
		this.trimOld(e);
	}
	set(e, t) {
		return super.set(e, t), this.checkTrim(), this;
	}
}, gc = class {
	constructor() {
		this.map = /* @__PURE__ */ new Map();
	}
	add(e, t) {
		let n = this.map.get(e);
		n || (n = /* @__PURE__ */ new Set(), this.map.set(e, n)), n.add(t);
	}
	delete(e, t) {
		const n = this.map.get(e);
		n && (n.delete(t), n.size === 0 && this.map.delete(e));
	}
	forEach(e, t) {
		const n = this.map.get(e);
		n && n.forEach(t);
	}
};
new pc(10);
var Xr;
(function(e) {
	e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(Xr || (Xr = {}));
var Yr;
(function(e) {
	e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 3] = "Right";
})(Yr || (Yr = {}));
var Jr;
(function(e) {
	e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(Jr || (Jr = {}));
var Qr;
(function(e) {
	e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(Qr || (Qr = {}));
function bc(e) {
	if (!e || e.length === 0) return !1;
	for (let t = 0, n = e.length; t < n; t++) {
		const r = e.charCodeAt(t);
		if (r === 10) return !0;
		if (r === 92) {
			if (t++, t >= n) break;
			const i = e.charCodeAt(t);
			if (i === 110 || i === 114 || i === 87) return !0;
		}
	}
	return !1;
}
function wc(e, t, n, r, i) {
	if (r === 0) return !0;
	const s = t.charCodeAt(r - 1);
	if (e.get(s) !== 0 || s === 13 || s === 10) return !0;
	if (i > 0) {
		const a = t.charCodeAt(r);
		if (e.get(a) !== 0) return !0;
	}
	return !1;
}
function _c(e, t, n, r, i) {
	if (r + i === n) return !0;
	const s = t.charCodeAt(r + i);
	if (e.get(s) !== 0 || s === 13 || s === 10) return !0;
	if (i > 0) {
		const a = t.charCodeAt(r + i - 1);
		if (e.get(a) !== 0) return !0;
	}
	return !1;
}
function vc(e, t, n, r, i) {
	return wc(e, t, n, r, i) && _c(e, t, n, r, i);
}
var yc = class {
	constructor(e, t) {
		this._wordSeparators = e, this._searchRegex = t, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
	}
	reset(e) {
		this._searchRegex.lastIndex = e, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
	}
	next(e) {
		const t = e.length;
		let n;
		do {
			if (this._prevMatchStartIndex + this._prevMatchLength === t || (n = this._searchRegex.exec(e), !n)) return null;
			const r = n.index, i = n[0].length;
			if (r === this._prevMatchStartIndex && i === this._prevMatchLength) {
				if (i === 0) {
					hl(e, t, this._searchRegex.lastIndex) > 65535 ? this._searchRegex.lastIndex += 2 : this._searchRegex.lastIndex += 1;
					continue;
				}
				return null;
			}
			if (this._prevMatchStartIndex = r, this._prevMatchLength = i, !this._wordSeparators || vc(this._wordSeparators, e, t, r, i)) return n;
		} while (n);
		return null;
	}
};
const Tc = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
function kc(e = "") {
	let t = "(-?\\d*\\.\\d\\w*)|([^";
	for (const n of Tc) e.indexOf(n) >= 0 || (t += "\\" + n);
	return t += "\\s]+)", new RegExp(t, "g");
}
const to = kc();
function no(e) {
	let t = to;
	if (e && e instanceof RegExp) if (e.global) t = e;
	else {
		let n = "g";
		e.ignoreCase && (n += "i"), e.multiline && (n += "m"), e.unicode && (n += "u"), t = new RegExp(e.source, n);
	}
	return t.lastIndex = 0, t;
}
const io = new Io();
io.unshift({
	maxLen: 1e3,
	windowSize: 15,
	timeBudget: 150
});
function Li(e, t, n, r, i) {
	if (t = no(t), i || (i = $t.first(io)), n.length > i.maxLen) {
		let c = e - i.maxLen / 2;
		return c < 0 ? c = 0 : r += c, n = n.substring(c, e + i.maxLen / 2), Li(e, t, n, r, i);
	}
	const s = Date.now(), a = e - 1 - r;
	let o = -1, l = null;
	for (let c = 1; !(Date.now() - s >= i.timeBudget); c++) {
		const u = a - i.windowSize * c;
		t.lastIndex = Math.max(0, u);
		const d = Sc(t, n, a, o);
		if (!d && l || (l = d, u <= 0)) break;
		o = u;
	}
	if (l) {
		const c = {
			word: l[0],
			startColumn: r + 1 + l.index,
			endColumn: r + 1 + l.index + l[0].length
		};
		return t.lastIndex = 0, c;
	}
	return null;
}
function Sc(e, t, n, r) {
	let i;
	for (; i = e.exec(t);) {
		const s = i.index || 0;
		if (s <= n && e.lastIndex >= n) return i;
		if (r > 0 && s > r) return null;
	}
	return null;
}
var Lc = class {
	static computeUnicodeHighlights(e, t, n) {
		const r = n ? n.startLineNumber : 1, i = n ? n.endLineNumber : e.getLineCount(), s = new Zr(t), a = s.getCandidateCodePoints();
		let o;
		a === "allNonBasicAscii" ? o = /* @__PURE__ */ new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g") : o = new RegExp(`${xc(Array.from(a))}`, "g");
		const l = new yc(null, o), c = [];
		let u = !1, d, m = 0, p = 0, b = 0;
		e: for (let g = r, v = i; g <= v; g++) {
			const T = e.getLineContent(g), k = T.length;
			l.reset(0);
			do
				if (d = l.next(T), d) {
					let E = d.index, I = d.index + d[0].length;
					E > 0 && Jt(T.charCodeAt(E - 1)) && E--, I + 1 < k && Jt(T.charCodeAt(I - 1)) && I++;
					const D = T.substring(E, I);
					let w = Li(E + 1, to, T, 0);
					w && w.endColumn <= E + 1 && (w = null);
					const f = s.shouldHighlightNonBasicASCII(D, w ? w.word : null);
					if (f !== 0) {
						if (f === 3 ? m++ : f === 2 ? p++ : f === 1 ? b++ : Ao(), c.length >= 1e3) {
							u = !0;
							break e;
						}
						c.push(new j(g, E + 1, g, I + 1));
					}
				}
			while (d);
		}
		return {
			ranges: c,
			hasMore: u,
			ambiguousCharacterCount: m,
			invisibleCharacterCount: p,
			nonBasicAsciiCharacterCount: b
		};
	}
	static computeUnicodeHighlightReason(e, t) {
		const n = new Zr(t);
		switch (n.shouldHighlightNonBasicASCII(e, null)) {
			case 0: return null;
			case 2: return { kind: 1 };
			case 3: {
				const r = e.codePointAt(0), i = n.ambiguousCharacters.getPrimaryConfusable(r), s = Hn.getLocales().filter((a) => !Hn.getInstance(new Set([...t.allowedLocales, a])).isAmbiguous(r));
				return {
					kind: 0,
					confusableWith: String.fromCodePoint(i),
					notAmbiguousInLocales: s
				};
			}
			case 1: return { kind: 2 };
		}
	}
};
function xc(e, t) {
	return `[${il(e.map((n) => String.fromCodePoint(n)).join(""))}]`;
}
var Zr = class {
	constructor(e) {
		this.options = e, this.allowedCodePoints = new Set(e.allowedCodePoints), this.ambiguousCharacters = Hn.getInstance(new Set(e.allowedLocales));
	}
	getCandidateCodePoints() {
		if (this.options.nonBasicASCII) return "allNonBasicAscii";
		const e = /* @__PURE__ */ new Set();
		if (this.options.invisibleCharacters) for (const t of bn.codePoints) Kr(String.fromCodePoint(t)) || e.add(t);
		if (this.options.ambiguousCharacters) for (const t of this.ambiguousCharacters.getConfusableCodePoints()) e.add(t);
		for (const t of this.allowedCodePoints) e.delete(t);
		return e;
	}
	shouldHighlightNonBasicASCII(e, t) {
		const n = e.codePointAt(0);
		if (this.allowedCodePoints.has(n)) return 0;
		if (this.options.nonBasicASCII) return 1;
		let r = !1, i = !1;
		if (t) for (const s of t) {
			const a = s.codePointAt(0), o = dl(s);
			r = r || o, !o && !this.ambiguousCharacters.isAmbiguous(a) && !bn.isInvisibleCharacter(a) && (i = !0);
		}
		return !r && i ? 0 : this.options.invisibleCharacters && !Kr(e) && bn.isInvisibleCharacter(n) ? 2 : this.options.ambiguousCharacters && this.ambiguousCharacters.isAmbiguous(n) ? 3 : 0;
	}
};
function Kr(e) {
	return e === " " || e === `
` || e === "	";
}
var Wt = class {
	constructor(e, t, n) {
		this.changes = e, this.moves = t, this.hitTimeout = n;
	}
}, Ac = class {
	constructor(e, t) {
		this.lineRangeMapping = e, this.changes = t;
	}
};
function Rc(e, t, n = (r, i) => r === i) {
	if (e === t) return !0;
	if (!e || !t || e.length !== t.length) return !1;
	for (let r = 0, i = e.length; r < i; r++) if (!n(e[r], t[r])) return !1;
	return !0;
}
function* Mc(e, t) {
	let n, r;
	for (const i of e) r !== void 0 && t(r, i) ? n.push(i) : (n && (yield n), n = [i]), r = i;
	n && (yield n);
}
function Ec(e, t) {
	for (let n = 0; n <= e.length; n++) t(n === 0 ? void 0 : e[n - 1], n === e.length ? void 0 : e[n]);
}
function Nc(e, t) {
	for (let n = 0; n < e.length; n++) t(n === 0 ? void 0 : e[n - 1], e[n], n + 1 === e.length ? void 0 : e[n + 1]);
}
function Cc(e, t) {
	for (const n of t) e.push(n);
}
var $n;
(function(e) {
	function t(s) {
		return s < 0;
	}
	e.isLessThan = t;
	function n(s) {
		return s <= 0;
	}
	e.isLessThanOrEqual = n;
	function r(s) {
		return s > 0;
	}
	e.isGreaterThan = r;
	function i(s) {
		return s === 0;
	}
	e.isNeitherLessOrGreaterThan = i, e.greaterThan = 1, e.lessThan = -1, e.neitherLessOrGreaterThan = 0;
})($n || ($n = {}));
function _t(e, t) {
	return (n, r) => t(e(n), e(r));
}
const vt = (e, t) => e - t;
function Ic(e) {
	return (t, n) => -e(t, n);
}
(class Pt {
	static {
		this.empty = new Pt((t) => {});
	}
	constructor(t) {
		this.iterate = t;
	}
	toArray() {
		const t = [];
		return this.iterate((n) => (t.push(n), !0)), t;
	}
	filter(t) {
		return new Pt((n) => this.iterate((r) => t(r) ? n(r) : !0));
	}
	map(t) {
		return new Pt((n) => this.iterate((r) => n(t(r))));
	}
	findLast(t) {
		let n;
		return this.iterate((r) => (t(r) && (n = r), !0)), n;
	}
	findLastMaxBy(t) {
		let n, r = !0;
		return this.iterate((i) => ((r || $n.isGreaterThan(t(i, n))) && (r = !1, n = i), !0)), n;
	}
});
var J = class fe {
	static fromTo(t, n) {
		return new fe(t, n);
	}
	static addRange(t, n) {
		let r = 0;
		for (; r < n.length && n[r].endExclusive < t.start;) r++;
		let i = r;
		for (; i < n.length && n[i].start <= t.endExclusive;) i++;
		if (r === i) n.splice(r, 0, t);
		else {
			const s = Math.min(t.start, n[r].start), a = Math.max(t.endExclusive, n[i - 1].endExclusive);
			n.splice(r, i - r, new fe(s, a));
		}
	}
	static tryCreate(t, n) {
		if (!(t > n)) return new fe(t, n);
	}
	static ofLength(t) {
		return new fe(0, t);
	}
	static ofStartAndLength(t, n) {
		return new fe(t, t + n);
	}
	static emptyAt(t) {
		return new fe(t, t);
	}
	constructor(t, n) {
		if (this.start = t, this.endExclusive = n, t > n) throw new oe(`Invalid range: ${this.toString()}`);
	}
	get isEmpty() {
		return this.start === this.endExclusive;
	}
	delta(t) {
		return new fe(this.start + t, this.endExclusive + t);
	}
	deltaStart(t) {
		return new fe(this.start + t, this.endExclusive);
	}
	deltaEnd(t) {
		return new fe(this.start, this.endExclusive + t);
	}
	get length() {
		return this.endExclusive - this.start;
	}
	toString() {
		return `[${this.start}, ${this.endExclusive})`;
	}
	equals(t) {
		return this.start === t.start && this.endExclusive === t.endExclusive;
	}
	contains(t) {
		return this.start <= t && t < this.endExclusive;
	}
	join(t) {
		return new fe(Math.min(this.start, t.start), Math.max(this.endExclusive, t.endExclusive));
	}
	intersect(t) {
		const n = Math.max(this.start, t.start), r = Math.min(this.endExclusive, t.endExclusive);
		if (n <= r) return new fe(n, r);
	}
	intersectionLength(t) {
		const n = Math.max(this.start, t.start), r = Math.min(this.endExclusive, t.endExclusive);
		return Math.max(0, r - n);
	}
	intersects(t) {
		return Math.max(this.start, t.start) < Math.min(this.endExclusive, t.endExclusive);
	}
	intersectsOrTouches(t) {
		return Math.max(this.start, t.start) <= Math.min(this.endExclusive, t.endExclusive);
	}
	isBefore(t) {
		return this.endExclusive <= t.start;
	}
	isAfter(t) {
		return this.start >= t.endExclusive;
	}
	slice(t) {
		return t.slice(this.start, this.endExclusive);
	}
	substring(t) {
		return t.substring(this.start, this.endExclusive);
	}
	clip(t) {
		if (this.isEmpty) throw new oe(`Invalid clipping range: ${this.toString()}`);
		return Math.max(this.start, Math.min(this.endExclusive - 1, t));
	}
	clipCyclic(t) {
		if (this.isEmpty) throw new oe(`Invalid clipping range: ${this.toString()}`);
		return t < this.start ? this.endExclusive - (this.start - t) % this.length : t >= this.endExclusive ? this.start + (t - this.start) % this.length : t;
	}
	forEach(t) {
		for (let n = this.start; n < this.endExclusive; n++) t(n);
	}
	joinRightTouching(t) {
		if (this.endExclusive !== t.start) throw new oe(`Invalid join: ${this.toString()} and ${t.toString()}`);
		return new fe(this.start, t.endExclusive);
	}
};
function st(e, t) {
	const n = at(e, t);
	return n === -1 ? void 0 : e[n];
}
function at(e, t, n = 0, r = e.length) {
	let i = n, s = r;
	for (; i < s;) {
		const a = Math.floor((i + s) / 2);
		t(e[a]) ? i = a + 1 : s = a;
	}
	return i - 1;
}
function zc(e, t) {
	const n = Gn(e, t);
	return n === e.length ? void 0 : e[n];
}
function Gn(e, t, n = 0, r = e.length) {
	let i = n, s = r;
	for (; i < s;) {
		const a = Math.floor((i + s) / 2);
		t(e[a]) ? s = a : i = a + 1;
	}
	return i;
}
var ro = class so {
	static {
		this.assertInvariants = !1;
	}
	constructor(t) {
		this._array = t, this._findLastMonotonousLastIdx = 0;
	}
	findLastMonotonous(t) {
		if (so.assertInvariants) {
			if (this._prevFindLastPredicate) {
				for (const r of this._array) if (this._prevFindLastPredicate(r) && !t(r)) throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.");
			}
			this._prevFindLastPredicate = t;
		}
		const n = at(this._array, t, this._findLastMonotonousLastIdx);
		return this._findLastMonotonousLastIdx = n + 1, n === -1 ? void 0 : this._array[n];
	}
}, X = class _e {
	static ofLength(t, n) {
		return new _e(t, t + n);
	}
	static fromRange(t) {
		return new _e(t.startLineNumber, t.endLineNumber);
	}
	static fromRangeInclusive(t) {
		return new _e(t.startLineNumber, t.endLineNumber + 1);
	}
	static {
		this.compareByStart = _t((t) => t.startLineNumber, vt);
	}
	static joinMany(t) {
		if (t.length === 0) return [];
		let n = new en(t[0].slice());
		for (let r = 1; r < t.length; r++) n = n.getUnion(new en(t[r].slice()));
		return n.ranges;
	}
	static join(t) {
		if (t.length === 0) throw new oe("lineRanges cannot be empty");
		let n = t[0].startLineNumber, r = t[0].endLineNumberExclusive;
		for (let i = 1; i < t.length; i++) n = Math.min(n, t[i].startLineNumber), r = Math.max(r, t[i].endLineNumberExclusive);
		return new _e(n, r);
	}
	static deserialize(t) {
		return new _e(t[0], t[1]);
	}
	constructor(t, n) {
		if (t > n) throw new oe(`startLineNumber ${t} cannot be after endLineNumberExclusive ${n}`);
		this.startLineNumber = t, this.endLineNumberExclusive = n;
	}
	contains(t) {
		return this.startLineNumber <= t && t < this.endLineNumberExclusive;
	}
	get isEmpty() {
		return this.startLineNumber === this.endLineNumberExclusive;
	}
	delta(t) {
		return new _e(this.startLineNumber + t, this.endLineNumberExclusive + t);
	}
	deltaLength(t) {
		return new _e(this.startLineNumber, this.endLineNumberExclusive + t);
	}
	get length() {
		return this.endLineNumberExclusive - this.startLineNumber;
	}
	join(t) {
		return new _e(Math.min(this.startLineNumber, t.startLineNumber), Math.max(this.endLineNumberExclusive, t.endLineNumberExclusive));
	}
	toString() {
		return `[${this.startLineNumber},${this.endLineNumberExclusive})`;
	}
	intersect(t) {
		const n = Math.max(this.startLineNumber, t.startLineNumber), r = Math.min(this.endLineNumberExclusive, t.endLineNumberExclusive);
		if (n <= r) return new _e(n, r);
	}
	intersectsStrict(t) {
		return this.startLineNumber < t.endLineNumberExclusive && t.startLineNumber < this.endLineNumberExclusive;
	}
	intersectsOrTouches(t) {
		return this.startLineNumber <= t.endLineNumberExclusive && t.startLineNumber <= this.endLineNumberExclusive;
	}
	equals(t) {
		return this.startLineNumber === t.startLineNumber && this.endLineNumberExclusive === t.endLineNumberExclusive;
	}
	toInclusiveRange() {
		return this.isEmpty ? null : new j(this.startLineNumber, 1, this.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER);
	}
	toExclusiveRange() {
		return new j(this.startLineNumber, 1, this.endLineNumberExclusive, 1);
	}
	mapToLineArray(t) {
		const n = [];
		for (let r = this.startLineNumber; r < this.endLineNumberExclusive; r++) n.push(t(r));
		return n;
	}
	forEach(t) {
		for (let n = this.startLineNumber; n < this.endLineNumberExclusive; n++) t(n);
	}
	serialize() {
		return [this.startLineNumber, this.endLineNumberExclusive];
	}
	toOffsetRange() {
		return new J(this.startLineNumber - 1, this.endLineNumberExclusive - 1);
	}
	addMargin(t, n) {
		return new _e(this.startLineNumber - t, this.endLineNumberExclusive + n);
	}
}, en = class tt {
	constructor(t = []) {
		this._normalizedRanges = t;
	}
	get ranges() {
		return this._normalizedRanges;
	}
	addRange(t) {
		if (t.length === 0) return;
		const n = Gn(this._normalizedRanges, (i) => i.endLineNumberExclusive >= t.startLineNumber), r = at(this._normalizedRanges, (i) => i.startLineNumber <= t.endLineNumberExclusive) + 1;
		if (n === r) this._normalizedRanges.splice(n, 0, t);
		else if (n === r - 1) {
			const i = this._normalizedRanges[n];
			this._normalizedRanges[n] = i.join(t);
		} else {
			const i = this._normalizedRanges[n].join(this._normalizedRanges[r - 1]).join(t);
			this._normalizedRanges.splice(n, r - n, i);
		}
	}
	contains(t) {
		const n = st(this._normalizedRanges, (r) => r.startLineNumber <= t);
		return !!n && n.endLineNumberExclusive > t;
	}
	intersects(t) {
		const n = st(this._normalizedRanges, (r) => r.startLineNumber < t.endLineNumberExclusive);
		return !!n && n.endLineNumberExclusive > t.startLineNumber;
	}
	getUnion(t) {
		if (this._normalizedRanges.length === 0) return t;
		if (t._normalizedRanges.length === 0) return this;
		const n = [];
		let r = 0, i = 0, s = null;
		for (; r < this._normalizedRanges.length || i < t._normalizedRanges.length;) {
			let a = null;
			if (r < this._normalizedRanges.length && i < t._normalizedRanges.length) {
				const o = this._normalizedRanges[r], l = t._normalizedRanges[i];
				o.startLineNumber < l.startLineNumber ? (a = o, r++) : (a = l, i++);
			} else r < this._normalizedRanges.length ? (a = this._normalizedRanges[r], r++) : (a = t._normalizedRanges[i], i++);
			s === null ? s = a : s.endLineNumberExclusive >= a.startLineNumber ? s = new X(s.startLineNumber, Math.max(s.endLineNumberExclusive, a.endLineNumberExclusive)) : (n.push(s), s = a);
		}
		return s !== null && n.push(s), new tt(n);
	}
	subtractFrom(t) {
		const n = Gn(this._normalizedRanges, (a) => a.endLineNumberExclusive >= t.startLineNumber), r = at(this._normalizedRanges, (a) => a.startLineNumber <= t.endLineNumberExclusive) + 1;
		if (n === r) return new tt([t]);
		const i = [];
		let s = t.startLineNumber;
		for (let a = n; a < r; a++) {
			const o = this._normalizedRanges[a];
			o.startLineNumber > s && i.push(new X(s, o.startLineNumber)), s = o.endLineNumberExclusive;
		}
		return s < t.endLineNumberExclusive && i.push(new X(s, t.endLineNumberExclusive)), new tt(i);
	}
	toString() {
		return this._normalizedRanges.map((t) => t.toString()).join(", ");
	}
	getIntersection(t) {
		const n = [];
		let r = 0, i = 0;
		for (; r < this._normalizedRanges.length && i < t._normalizedRanges.length;) {
			const s = this._normalizedRanges[r], a = t._normalizedRanges[i], o = s.intersect(a);
			o && !o.isEmpty && n.push(o), s.endLineNumberExclusive < a.endLineNumberExclusive ? r++ : i++;
		}
		return new tt(n);
	}
	getWithDelta(t) {
		return new tt(this._normalizedRanges.map((n) => n.delta(t)));
	}
}, Xn = class Ee {
	static {
		this.zero = new Ee(0, 0);
	}
	static betweenPositions(t, n) {
		return t.lineNumber === n.lineNumber ? new Ee(0, n.column - t.column) : new Ee(n.lineNumber - t.lineNumber, n.column - 1);
	}
	static fromPosition(t) {
		return new Ee(t.lineNumber - 1, t.column - 1);
	}
	static ofRange(t) {
		return Ee.betweenPositions(t.getStartPosition(), t.getEndPosition());
	}
	static ofText(t) {
		let n = 0, r = 0;
		for (const i of t) i === `
` ? (n++, r = 0) : r++;
		return new Ee(n, r);
	}
	constructor(t, n) {
		this.lineCount = t, this.columnCount = n;
	}
	isGreaterThanOrEqualTo(t) {
		return this.lineCount !== t.lineCount ? this.lineCount > t.lineCount : this.columnCount >= t.columnCount;
	}
	add(t) {
		return t.lineCount === 0 ? new Ee(this.lineCount, this.columnCount + t.columnCount) : new Ee(this.lineCount + t.lineCount, t.columnCount);
	}
	createRange(t) {
		return this.lineCount === 0 ? new j(t.lineNumber, t.column, t.lineNumber, t.column + this.columnCount) : new j(t.lineNumber, t.column, t.lineNumber + this.lineCount, this.columnCount + 1);
	}
	toRange() {
		return new j(1, 1, this.lineCount + 1, this.columnCount + 1);
	}
	toLineRange() {
		return X.ofLength(1, this.lineCount + 1);
	}
	addToPosition(t) {
		return this.lineCount === 0 ? new Y(t.lineNumber, t.column + this.columnCount) : new Y(t.lineNumber + this.lineCount, this.columnCount + 1);
	}
	toString() {
		return `${this.lineCount},${this.columnCount}`;
	}
}, Hc = class {
	getOffsetRange(e) {
		return new J(this.getOffset(e.getStartPosition()), this.getOffset(e.getEndPosition()));
	}
	getRange(e) {
		return j.fromPositions(this.getPosition(e.start), this.getPosition(e.endExclusive));
	}
	getStringReplacement(e) {
		return new qt.deps.StringReplacement(this.getOffsetRange(e.range), e.text);
	}
	getTextReplacement(e) {
		return new qt.deps.TextReplacement(this.getRange(e.replaceRange), e.newText);
	}
	getTextEdit(e) {
		const t = e.replacements.map((n) => this.getTextReplacement(n));
		return new qt.deps.TextEdit(t);
	}
}, qt = class {
	static {
		this._deps = void 0;
	}
	static get deps() {
		if (!this._deps) throw new Error("Dependencies not set. Call _setDependencies first.");
		return this._deps;
	}
}, Uc = class extends Hc {
	constructor(e) {
		super(), this.text = e, this.lineStartOffsetByLineIdx = [], this.lineEndOffsetByLineIdx = [], this.lineStartOffsetByLineIdx.push(0);
		for (let t = 0; t < e.length; t++) e.charAt(t) === `
` && (this.lineStartOffsetByLineIdx.push(t + 1), t > 0 && e.charAt(t - 1) === "\r" ? this.lineEndOffsetByLineIdx.push(t - 1) : this.lineEndOffsetByLineIdx.push(t));
		this.lineEndOffsetByLineIdx.push(e.length);
	}
	getOffset(e) {
		const t = this._validatePosition(e);
		return this.lineStartOffsetByLineIdx[t.lineNumber - 1] + t.column - 1;
	}
	_validatePosition(e) {
		if (e.lineNumber < 1) return new Y(1, 1);
		const t = this.textLength.lineCount + 1;
		if (e.lineNumber > t) return new Y(t, this.getLineLength(t) + 1);
		if (e.column < 1) return new Y(e.lineNumber, 1);
		const n = this.getLineLength(e.lineNumber);
		return e.column - 1 > n ? new Y(e.lineNumber, n + 1) : e;
	}
	getPosition(e) {
		const t = at(this.lineStartOffsetByLineIdx, (n) => n <= e);
		return new Y(t + 1, e - this.lineStartOffsetByLineIdx[t] + 1);
	}
	get textLength() {
		const e = this.lineStartOffsetByLineIdx.length - 1;
		return new qt.deps.TextLength(e, this.text.length - this.lineStartOffsetByLineIdx[e]);
	}
	getLineLength(e) {
		return this.lineEndOffsetByLineIdx[e - 1] - this.lineStartOffsetByLineIdx[e - 1];
	}
}, Dc = class {
	constructor() {
		this._transformer = void 0;
	}
	get endPositionExclusive() {
		return this.length.addToPosition(new Y(1, 1));
	}
	get lineRange() {
		return this.length.toLineRange();
	}
	getValue() {
		return this.getValueOfRange(this.length.toRange());
	}
	getValueOfOffsetRange(e) {
		return this.getValueOfRange(this.getTransformer().getRange(e));
	}
	getLineLength(e) {
		return this.getValueOfRange(new j(e, 1, e, Number.MAX_SAFE_INTEGER)).length;
	}
	getTransformer() {
		return this._transformer || (this._transformer = new Uc(this.getValue())), this._transformer;
	}
	getLineAt(e) {
		return this.getValueOfRange(new j(e, 1, e, Number.MAX_SAFE_INTEGER));
	}
}, Wc = class extends Dc {
	constructor(e, t) {
		Ro(t >= 1), super(), this._getLineContent = e, this._lineCount = t;
	}
	getValueOfRange(e) {
		if (e.startLineNumber === e.endLineNumber) return this._getLineContent(e.startLineNumber).substring(e.startColumn - 1, e.endColumn - 1);
		let t = this._getLineContent(e.startLineNumber).substring(e.startColumn - 1);
		for (let n = e.startLineNumber + 1; n < e.endLineNumber; n++) t += `
` + this._getLineContent(n);
		return t += `
` + this._getLineContent(e.endLineNumber).substring(0, e.endColumn - 1), t;
	}
	getLineLength(e) {
		return this._getLineContent(e).length;
	}
	get length() {
		const e = this._getLineContent(this._lineCount);
		return new Xn(this._lineCount - 1, e.length);
	}
}, Rt = class extends Wc {
	constructor(e) {
		super((t) => e[t - 1], e.length);
	}
}, Pc = class Oe {
	static joinReplacements(t, n) {
		if (t.length === 0) throw new oe();
		if (t.length === 1) return t[0];
		const r = t[0].range.getStartPosition(), i = t[t.length - 1].range.getEndPosition();
		let s = "";
		for (let a = 0; a < t.length; a++) {
			const o = t[a];
			if (s += o.text, a < t.length - 1) {
				const l = t[a + 1], c = j.fromPositions(o.range.getEndPosition(), l.range.getStartPosition()), u = n.getValueOfRange(c);
				s += u;
			}
		}
		return new Oe(j.fromPositions(r, i), s);
	}
	static fromStringReplacement(t, n) {
		return new Oe(n.getTransformer().getRange(t.replaceRange), t.newText);
	}
	static delete(t) {
		return new Oe(t, "");
	}
	constructor(t, n) {
		this.range = t, this.text = n;
	}
	get isEmpty() {
		return this.range.isEmpty() && this.text.length === 0;
	}
	static equals(t, n) {
		return t.range.equalsRange(n.range) && t.text === n.text;
	}
	equals(t) {
		return Oe.equals(this, t);
	}
	removeCommonPrefixAndSuffix(t) {
		return this.removeCommonPrefix(t).removeCommonSuffix(t);
	}
	removeCommonPrefix(t) {
		const n = t.getValueOfRange(this.range).replaceAll(`\r
`, `
`), r = this.text.replaceAll(`\r
`, `
`), i = ll(n, r), s = Xn.ofText(n.substring(0, i)).addToPosition(this.range.getStartPosition()), a = r.substring(i);
		return new Oe(j.fromPositions(s, this.range.getEndPosition()), a);
	}
	removeCommonSuffix(t) {
		const n = t.getValueOfRange(this.range).replaceAll(`\r
`, `
`), r = this.text.replaceAll(`\r
`, `
`), i = cl(n, r), s = Xn.ofText(n.substring(0, n.length - i)).addToPosition(this.range.getStartPosition()), a = r.substring(0, r.length - i);
		return new Oe(j.fromPositions(this.range.getStartPosition(), s), a);
	}
	toString() {
		const t = this.range.getStartPosition(), n = this.range.getEndPosition();
		return `(${t.lineNumber},${t.column} -> ${n.lineNumber},${n.column}): "${this.text}"`;
	}
}, ot = class nt {
	static inverse(t, n, r) {
		const i = [];
		let s = 1, a = 1;
		for (const l of t) {
			const c = new nt(new X(s, l.original.startLineNumber), new X(a, l.modified.startLineNumber));
			c.modified.isEmpty || i.push(c), s = l.original.endLineNumberExclusive, a = l.modified.endLineNumberExclusive;
		}
		const o = new nt(new X(s, n + 1), new X(a, r + 1));
		return o.modified.isEmpty || i.push(o), i;
	}
	static clip(t, n, r) {
		const i = [];
		for (const s of t) {
			const a = s.original.intersect(n), o = s.modified.intersect(r);
			a && !a.isEmpty && o && !o.isEmpty && i.push(new nt(a, o));
		}
		return i;
	}
	constructor(t, n) {
		this.original = t, this.modified = n;
	}
	toString() {
		return `{${this.original.toString()}->${this.modified.toString()}}`;
	}
	flip() {
		return new nt(this.modified, this.original);
	}
	join(t) {
		return new nt(this.original.join(t.original), this.modified.join(t.modified));
	}
	toRangeMapping() {
		const t = this.original.toInclusiveRange(), n = this.modified.toInclusiveRange();
		if (t && n) return new Ce(t, n);
		if (this.original.startLineNumber === 1 || this.modified.startLineNumber === 1) {
			if (!(this.modified.startLineNumber === 1 && this.original.startLineNumber === 1)) throw new oe("not a valid diff");
			return new Ce(new j(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new j(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
		} else return new Ce(new j(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), new j(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER));
	}
	toRangeMapping2(t, n) {
		if (es(this.original.endLineNumberExclusive, t) && es(this.modified.endLineNumberExclusive, n)) return new Ce(new j(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new j(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
		if (!this.original.isEmpty && !this.modified.isEmpty) return new Ce(j.fromPositions(new Y(this.original.startLineNumber, 1), Qe(new Y(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), t)), j.fromPositions(new Y(this.modified.startLineNumber, 1), Qe(new Y(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), n)));
		if (this.original.startLineNumber > 1 && this.modified.startLineNumber > 1) return new Ce(j.fromPositions(Qe(new Y(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER), t), Qe(new Y(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), t)), j.fromPositions(Qe(new Y(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER), n), Qe(new Y(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), n)));
		throw new oe();
	}
};
function Qe(e, t) {
	if (e.lineNumber < 1) return new Y(1, 1);
	if (e.lineNumber > t.length) return new Y(t.length, t[t.length - 1].length + 1);
	const n = t[e.lineNumber - 1];
	return e.column > n.length + 1 ? new Y(e.lineNumber, n.length + 1) : e;
}
function es(e, t) {
	return e >= 1 && e <= t.length;
}
var Lt = class Ot extends ot {
	static fromRangeMappings(t) {
		return new Ot(X.join(t.map((n) => X.fromRangeInclusive(n.originalRange))), X.join(t.map((n) => X.fromRangeInclusive(n.modifiedRange))), t);
	}
	constructor(t, n, r) {
		super(t, n), this.innerChanges = r;
	}
	flip() {
		return new Ot(this.modified, this.original, this.innerChanges?.map((t) => t.flip()));
	}
	withInnerChangesFromLineRanges() {
		return new Ot(this.original, this.modified, [this.toRangeMapping()]);
	}
}, Ce = class Yn {
	static fromEdit(t) {
		const n = t.getNewRanges();
		return t.replacements.map((r, i) => new Yn(r.range, n[i]));
	}
	static assertSorted(t) {
		for (let n = 1; n < t.length; n++) {
			const r = t[n - 1], i = t[n];
			if (!(r.originalRange.getEndPosition().isBeforeOrEqual(i.originalRange.getStartPosition()) && r.modifiedRange.getEndPosition().isBeforeOrEqual(i.modifiedRange.getStartPosition()))) throw new oe("Range mappings must be sorted");
		}
	}
	constructor(t, n) {
		this.originalRange = t, this.modifiedRange = n;
	}
	toString() {
		return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
	}
	flip() {
		return new Yn(this.modifiedRange, this.originalRange);
	}
	toTextEdit(t) {
		const n = t.getValueOfRange(this.modifiedRange);
		return new Pc(this.originalRange, n);
	}
};
function ts(e, t, n, r = !1) {
	const i = [];
	for (const s of Mc(e.map((a) => qc(a, t, n)), (a, o) => a.original.intersectsOrTouches(o.original) || a.modified.intersectsOrTouches(o.modified))) {
		const a = s[0], o = s[s.length - 1];
		i.push(new Lt(a.original.join(o.original), a.modified.join(o.modified), s.map((l) => l.innerChanges[0])));
	}
	return jt(() => !r && i.length > 0 && (i[0].modified.startLineNumber !== i[0].original.startLineNumber || n.length.lineCount - i[i.length - 1].modified.endLineNumberExclusive !== t.length.lineCount - i[i.length - 1].original.endLineNumberExclusive) ? !1 : Ea(i, (s, a) => a.original.startLineNumber - s.original.endLineNumberExclusive === a.modified.startLineNumber - s.modified.endLineNumberExclusive && s.original.endLineNumberExclusive < a.original.startLineNumber && s.modified.endLineNumberExclusive < a.modified.startLineNumber)), i;
}
function qc(e, t, n) {
	let r = 0, i = 0;
	return e.modifiedRange.endColumn === 1 && e.originalRange.endColumn === 1 && e.originalRange.startLineNumber + r <= e.originalRange.endLineNumber && e.modifiedRange.startLineNumber + r <= e.modifiedRange.endLineNumber && (i = -1), e.modifiedRange.startColumn - 1 >= n.getLineLength(e.modifiedRange.startLineNumber) && e.originalRange.startColumn - 1 >= t.getLineLength(e.originalRange.startLineNumber) && e.originalRange.startLineNumber <= e.originalRange.endLineNumber + i && e.modifiedRange.startLineNumber <= e.modifiedRange.endLineNumber + i && (r = 1), new Lt(new X(e.originalRange.startLineNumber + r, e.originalRange.endLineNumber + 1 + i), new X(e.modifiedRange.startLineNumber + r, e.modifiedRange.endLineNumber + 1 + i), [e]);
}
const Oc = 3;
var Fc = class {
	computeDiff(e, t, n) {
		const r = new jc(e, t, {
			maxComputationTime: n.maxComputationTimeMs,
			shouldIgnoreTrimWhitespace: n.ignoreTrimWhitespace,
			shouldComputeCharChanges: !0,
			shouldMakePrettyDiff: !0,
			shouldPostProcessCharChanges: !0
		}).computeDiff(), i = [];
		let s = null;
		for (const a of r.changes) {
			let o;
			a.originalEndLineNumber === 0 ? o = new X(a.originalStartLineNumber + 1, a.originalStartLineNumber + 1) : o = new X(a.originalStartLineNumber, a.originalEndLineNumber + 1);
			let l;
			a.modifiedEndLineNumber === 0 ? l = new X(a.modifiedStartLineNumber + 1, a.modifiedStartLineNumber + 1) : l = new X(a.modifiedStartLineNumber, a.modifiedEndLineNumber + 1);
			let c = new Lt(o, l, a.charChanges?.map((u) => new Ce(new j(u.originalStartLineNumber, u.originalStartColumn, u.originalEndLineNumber, u.originalEndColumn), new j(u.modifiedStartLineNumber, u.modifiedStartColumn, u.modifiedEndLineNumber, u.modifiedEndColumn))));
			s && (s.modified.endLineNumberExclusive === c.modified.startLineNumber || s.original.endLineNumberExclusive === c.original.startLineNumber) && (c = new Lt(s.original.join(c.original), s.modified.join(c.modified), s.innerChanges && c.innerChanges ? s.innerChanges.concat(c.innerChanges) : void 0), i.pop()), i.push(c), s = c;
		}
		return jt(() => Ea(i, (a, o) => o.original.startLineNumber - a.original.endLineNumberExclusive === o.modified.startLineNumber - a.modified.endLineNumberExclusive && a.original.endLineNumberExclusive < o.original.startLineNumber && a.modified.endLineNumberExclusive < o.modified.startLineNumber)), new Wt(i, [], r.quitEarly);
	}
};
function ao(e, t, n, r) {
	return new ja(e, t, n).ComputeDiff(r);
}
var ns = class {
	constructor(e) {
		const t = [], n = [];
		for (let r = 0, i = e.length; r < i; r++) t[r] = Jn(e[r], 1), n[r] = Qn(e[r], 1);
		this.lines = e, this._startColumns = t, this._endColumns = n;
	}
	getElements() {
		const e = [];
		for (let t = 0, n = this.lines.length; t < n; t++) e[t] = this.lines[t].substring(this._startColumns[t] - 1, this._endColumns[t] - 1);
		return e;
	}
	getStrictElement(e) {
		return this.lines[e];
	}
	getStartLineNumber(e) {
		return e + 1;
	}
	getEndLineNumber(e) {
		return e + 1;
	}
	createCharSequence(e, t, n) {
		const r = [], i = [], s = [];
		let a = 0;
		for (let o = t; o <= n; o++) {
			const l = this.lines[o], c = e ? this._startColumns[o] : 1, u = e ? this._endColumns[o] : l.length + 1;
			for (let d = c; d < u; d++) r[a] = l.charCodeAt(d - 1), i[a] = o + 1, s[a] = d, a++;
			!e && o < n && (r[a] = 10, i[a] = o + 1, s[a] = l.length + 1, a++);
		}
		return new Bc(r, i, s);
	}
}, Bc = class {
	constructor(e, t, n) {
		this._charCodes = e, this._lineNumbers = t, this._columns = n;
	}
	toString() {
		return "[" + this._charCodes.map((e, t) => (e === 10 ? "\\n" : String.fromCharCode(e)) + `-(${this._lineNumbers[t]},${this._columns[t]})`).join(", ") + "]";
	}
	_assertIndex(e, t) {
		if (e < 0 || e >= t.length) throw new Error("Illegal index");
	}
	getElements() {
		return this._charCodes;
	}
	getStartLineNumber(e) {
		return e > 0 && e === this._lineNumbers.length ? this.getEndLineNumber(e - 1) : (this._assertIndex(e, this._lineNumbers), this._lineNumbers[e]);
	}
	getEndLineNumber(e) {
		return e === -1 ? this.getStartLineNumber(e + 1) : (this._assertIndex(e, this._lineNumbers), this._charCodes[e] === 10 ? this._lineNumbers[e] + 1 : this._lineNumbers[e]);
	}
	getStartColumn(e) {
		return e > 0 && e === this._columns.length ? this.getEndColumn(e - 1) : (this._assertIndex(e, this._columns), this._columns[e]);
	}
	getEndColumn(e) {
		return e === -1 ? this.getStartColumn(e + 1) : (this._assertIndex(e, this._columns), this._charCodes[e] === 10 ? 1 : this._columns[e] + 1);
	}
}, Ft = class oo {
	constructor(t, n, r, i, s, a, o, l) {
		this.originalStartLineNumber = t, this.originalStartColumn = n, this.originalEndLineNumber = r, this.originalEndColumn = i, this.modifiedStartLineNumber = s, this.modifiedStartColumn = a, this.modifiedEndLineNumber = o, this.modifiedEndColumn = l;
	}
	static createFromDiffChange(t, n, r) {
		return new oo(n.getStartLineNumber(t.originalStart), n.getStartColumn(t.originalStart), n.getEndLineNumber(t.originalStart + t.originalLength - 1), n.getEndColumn(t.originalStart + t.originalLength - 1), r.getStartLineNumber(t.modifiedStart), r.getStartColumn(t.modifiedStart), r.getEndLineNumber(t.modifiedStart + t.modifiedLength - 1), r.getEndColumn(t.modifiedStart + t.modifiedLength - 1));
	}
};
function Vc(e) {
	if (e.length <= 1) return e;
	const t = [e[0]];
	let n = t[0];
	for (let r = 1, i = e.length; r < i; r++) {
		const s = e[r], a = s.originalStart - (n.originalStart + n.originalLength), o = s.modifiedStart - (n.modifiedStart + n.modifiedLength);
		Math.min(a, o) < Oc ? (n.originalLength = s.originalStart + s.originalLength - n.originalStart, n.modifiedLength = s.modifiedStart + s.modifiedLength - n.modifiedStart) : (t.push(s), n = s);
	}
	return t;
}
var kn = class lo {
	constructor(t, n, r, i, s) {
		this.originalStartLineNumber = t, this.originalEndLineNumber = n, this.modifiedStartLineNumber = r, this.modifiedEndLineNumber = i, this.charChanges = s;
	}
	static createFromDiffResult(t, n, r, i, s, a, o) {
		let l, c, u, d, m;
		if (n.originalLength === 0 ? (l = r.getStartLineNumber(n.originalStart) - 1, c = 0) : (l = r.getStartLineNumber(n.originalStart), c = r.getEndLineNumber(n.originalStart + n.originalLength - 1)), n.modifiedLength === 0 ? (u = i.getStartLineNumber(n.modifiedStart) - 1, d = 0) : (u = i.getStartLineNumber(n.modifiedStart), d = i.getEndLineNumber(n.modifiedStart + n.modifiedLength - 1)), a && n.originalLength > 0 && n.originalLength < 20 && n.modifiedLength > 0 && n.modifiedLength < 20 && s()) {
			const p = r.createCharSequence(t, n.originalStart, n.originalStart + n.originalLength - 1), b = i.createCharSequence(t, n.modifiedStart, n.modifiedStart + n.modifiedLength - 1);
			if (p.getElements().length > 0 && b.getElements().length > 0) {
				let g = ao(p, b, s, !0).changes;
				o && (g = Vc(g)), m = [];
				for (let v = 0, T = g.length; v < T; v++) m.push(Ft.createFromDiffChange(g[v], p, b));
			}
		}
		return new lo(l, c, u, d, m);
	}
}, jc = class {
	constructor(e, t, n) {
		this.shouldComputeCharChanges = n.shouldComputeCharChanges, this.shouldPostProcessCharChanges = n.shouldPostProcessCharChanges, this.shouldIgnoreTrimWhitespace = n.shouldIgnoreTrimWhitespace, this.shouldMakePrettyDiff = n.shouldMakePrettyDiff, this.originalLines = e, this.modifiedLines = t, this.original = new ns(e), this.modified = new ns(t), this.continueLineDiff = is(n.maxComputationTime), this.continueCharDiff = is(n.maxComputationTime === 0 ? 0 : Math.min(n.maxComputationTime, 5e3));
	}
	computeDiff() {
		if (this.original.lines.length === 1 && this.original.lines[0].length === 0) return this.modified.lines.length === 1 && this.modified.lines[0].length === 0 ? {
			quitEarly: !1,
			changes: []
		} : {
			quitEarly: !1,
			changes: [{
				originalStartLineNumber: 1,
				originalEndLineNumber: 1,
				modifiedStartLineNumber: 1,
				modifiedEndLineNumber: this.modified.lines.length,
				charChanges: void 0
			}]
		};
		if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) return {
			quitEarly: !1,
			changes: [{
				originalStartLineNumber: 1,
				originalEndLineNumber: this.original.lines.length,
				modifiedStartLineNumber: 1,
				modifiedEndLineNumber: 1,
				charChanges: void 0
			}]
		};
		const e = ao(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff), t = e.changes, n = e.quitEarly;
		if (this.shouldIgnoreTrimWhitespace) {
			const a = [];
			for (let o = 0, l = t.length; o < l; o++) a.push(kn.createFromDiffResult(this.shouldIgnoreTrimWhitespace, t[o], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
			return {
				quitEarly: n,
				changes: a
			};
		}
		const r = [];
		let i = 0, s = 0;
		for (let a = -1, o = t.length; a < o; a++) {
			const l = a + 1 < o ? t[a + 1] : null, c = l ? l.originalStart : this.originalLines.length, u = l ? l.modifiedStart : this.modifiedLines.length;
			for (; i < c && s < u;) {
				const d = this.originalLines[i], m = this.modifiedLines[s];
				if (d !== m) {
					{
						let p = Jn(d, 1), b = Jn(m, 1);
						for (; p > 1 && b > 1 && d.charCodeAt(p - 2) === m.charCodeAt(b - 2);) p--, b--;
						(p > 1 || b > 1) && this._pushTrimWhitespaceCharChange(r, i + 1, 1, p, s + 1, 1, b);
					}
					{
						let p = Qn(d, 1), b = Qn(m, 1);
						const g = d.length + 1, v = m.length + 1;
						for (; p < g && b < v && d.charCodeAt(p - 1) === d.charCodeAt(b - 1);) p++, b++;
						(p < g || b < v) && this._pushTrimWhitespaceCharChange(r, i + 1, p, g, s + 1, b, v);
					}
				}
				i++, s++;
			}
			l && (r.push(kn.createFromDiffResult(this.shouldIgnoreTrimWhitespace, l, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges)), i += l.originalLength, s += l.modifiedLength);
		}
		return {
			quitEarly: n,
			changes: r
		};
	}
	_pushTrimWhitespaceCharChange(e, t, n, r, i, s, a) {
		if (this._mergeTrimWhitespaceCharChange(e, t, n, r, i, s, a)) return;
		let o;
		this.shouldComputeCharChanges && (o = [new Ft(t, n, t, r, i, s, i, a)]), e.push(new kn(t, t, i, i, o));
	}
	_mergeTrimWhitespaceCharChange(e, t, n, r, i, s, a) {
		const o = e.length;
		if (o === 0) return !1;
		const l = e[o - 1];
		return l.originalEndLineNumber === 0 || l.modifiedEndLineNumber === 0 ? !1 : l.originalEndLineNumber === t && l.modifiedEndLineNumber === i ? (this.shouldComputeCharChanges && l.charChanges && l.charChanges.push(new Ft(t, n, t, r, i, s, i, a)), !0) : l.originalEndLineNumber + 1 === t && l.modifiedEndLineNumber + 1 === i ? (l.originalEndLineNumber = t, l.modifiedEndLineNumber = i, this.shouldComputeCharChanges && l.charChanges && l.charChanges.push(new Ft(t, n, t, r, i, s, i, a)), !0) : !1;
	}
};
function Jn(e, t) {
	const n = al(e);
	return n === -1 ? t : n + 1;
}
function Qn(e, t) {
	const n = ol(e);
	return n === -1 ? t : n + 2;
}
function is(e) {
	if (e === 0) return () => !0;
	const t = Date.now();
	return () => Date.now() - t < e;
}
var rt = class Zn {
	static trivial(t, n) {
		return new Zn([new me(J.ofLength(t.length), J.ofLength(n.length))], !1);
	}
	static trivialTimedOut(t, n) {
		return new Zn([new me(J.ofLength(t.length), J.ofLength(n.length))], !0);
	}
	constructor(t, n) {
		this.diffs = t, this.hitTimeout = n;
	}
}, me = class Ne {
	static invert(t, n) {
		const r = [];
		return Ec(t, (i, s) => {
			r.push(Ne.fromOffsetPairs(i ? i.getEndExclusives() : Ve.zero, s ? s.getStarts() : new Ve(n, (i ? i.seq2Range.endExclusive - i.seq1Range.endExclusive : 0) + n)));
		}), r;
	}
	static fromOffsetPairs(t, n) {
		return new Ne(new J(t.offset1, n.offset1), new J(t.offset2, n.offset2));
	}
	static assertSorted(t) {
		let n;
		for (const r of t) {
			if (n && !(n.seq1Range.endExclusive <= r.seq1Range.start && n.seq2Range.endExclusive <= r.seq2Range.start)) throw new oe("Sequence diffs must be sorted");
			n = r;
		}
	}
	constructor(t, n) {
		this.seq1Range = t, this.seq2Range = n;
	}
	swap() {
		return new Ne(this.seq2Range, this.seq1Range);
	}
	toString() {
		return `${this.seq1Range} <-> ${this.seq2Range}`;
	}
	join(t) {
		return new Ne(this.seq1Range.join(t.seq1Range), this.seq2Range.join(t.seq2Range));
	}
	delta(t) {
		return t === 0 ? this : new Ne(this.seq1Range.delta(t), this.seq2Range.delta(t));
	}
	deltaStart(t) {
		return t === 0 ? this : new Ne(this.seq1Range.deltaStart(t), this.seq2Range.deltaStart(t));
	}
	deltaEnd(t) {
		return t === 0 ? this : new Ne(this.seq1Range.deltaEnd(t), this.seq2Range.deltaEnd(t));
	}
	intersect(t) {
		const n = this.seq1Range.intersect(t.seq1Range), r = this.seq2Range.intersect(t.seq2Range);
		if (!(!n || !r)) return new Ne(n, r);
	}
	getStarts() {
		return new Ve(this.seq1Range.start, this.seq2Range.start);
	}
	getEndExclusives() {
		return new Ve(this.seq1Range.endExclusive, this.seq2Range.endExclusive);
	}
}, Ve = class Bt {
	static {
		this.zero = new Bt(0, 0);
	}
	static {
		this.max = new Bt(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
	}
	constructor(t, n) {
		this.offset1 = t, this.offset2 = n;
	}
	toString() {
		return `${this.offset1} <-> ${this.offset2}`;
	}
	delta(t) {
		return t === 0 ? this : new Bt(this.offset1 + t, this.offset2 + t);
	}
	equals(t) {
		return this.offset1 === t.offset1 && this.offset2 === t.offset2;
	}
}, xi = class co {
	static {
		this.instance = new co();
	}
	isValid() {
		return !0;
	}
}, $c = class {
	constructor(e) {
		if (this.timeout = e, this.startTime = Date.now(), this.valid = !0, e <= 0) throw new oe("timeout must be positive");
	}
	isValid() {
		return !(Date.now() - this.startTime < this.timeout) && this.valid && (this.valid = !1), this.valid;
	}
}, Sn = class {
	constructor(e, t) {
		this.width = e, this.height = t, this.array = [], this.array = new Array(e * t);
	}
	get(e, t) {
		return this.array[e + t * this.width];
	}
	set(e, t, n) {
		this.array[e + t * this.width] = n;
	}
};
function Kn(e) {
	return e === 32 || e === 9;
}
var rs = class ei {
	static {
		this.chrKeys = /* @__PURE__ */ new Map();
	}
	static getKey(t) {
		let n = this.chrKeys.get(t);
		return n === void 0 && (n = this.chrKeys.size, this.chrKeys.set(t, n)), n;
	}
	constructor(t, n, r) {
		this.range = t, this.lines = n, this.source = r, this.histogram = [];
		let i = 0;
		for (let s = t.startLineNumber - 1; s < t.endLineNumberExclusive - 1; s++) {
			const a = n[s];
			for (let l = 0; l < a.length; l++) {
				i++;
				const c = a[l], u = ei.getKey(c);
				this.histogram[u] = (this.histogram[u] || 0) + 1;
			}
			i++;
			const o = ei.getKey(`
`);
			this.histogram[o] = (this.histogram[o] || 0) + 1;
		}
		this.totalCount = i;
	}
	computeSimilarity(t) {
		let n = 0;
		const r = Math.max(this.histogram.length, t.histogram.length);
		for (let i = 0; i < r; i++) n += Math.abs((this.histogram[i] ?? 0) - (t.histogram[i] ?? 0));
		return 1 - n / (this.totalCount + t.totalCount);
	}
}, Gc = class {
	compute(e, t, n = xi.instance, r) {
		if (e.length === 0 || t.length === 0) return rt.trivial(e, t);
		const i = new Sn(e.length, t.length), s = new Sn(e.length, t.length), a = new Sn(e.length, t.length);
		for (let p = 0; p < e.length; p++) for (let b = 0; b < t.length; b++) {
			if (!n.isValid()) return rt.trivialTimedOut(e, t);
			const g = p === 0 ? 0 : i.get(p - 1, b), v = b === 0 ? 0 : i.get(p, b - 1);
			let T;
			e.getElement(p) === t.getElement(b) ? (p === 0 || b === 0 ? T = 0 : T = i.get(p - 1, b - 1), p > 0 && b > 0 && s.get(p - 1, b - 1) === 3 && (T += a.get(p - 1, b - 1)), T += r ? r(p, b) : 1) : T = -1;
			const k = Math.max(g, v, T);
			if (k === T) {
				const E = p > 0 && b > 0 ? a.get(p - 1, b - 1) : 0;
				a.set(p, b, E + 1), s.set(p, b, 3);
			} else k === g ? (a.set(p, b, 0), s.set(p, b, 1)) : k === v && (a.set(p, b, 0), s.set(p, b, 2));
			i.set(p, b, k);
		}
		const o = [];
		let l = e.length, c = t.length;
		function u(p, b) {
			(p + 1 !== l || b + 1 !== c) && o.push(new me(new J(p + 1, l), new J(b + 1, c))), l = p, c = b;
		}
		let d = e.length - 1, m = t.length - 1;
		for (; d >= 0 && m >= 0;) s.get(d, m) === 3 ? (u(d, m), d--, m--) : s.get(d, m) === 1 ? d-- : m--;
		return u(-1, -1), o.reverse(), new rt(o, !1);
	}
}, ho = class {
	compute(e, t, n = xi.instance) {
		if (e.length === 0 || t.length === 0) return rt.trivial(e, t);
		const r = e, i = t;
		function s(b, g) {
			for (; b < r.length && g < i.length && r.getElement(b) === i.getElement(g);) b++, g++;
			return b;
		}
		let a = 0;
		const o = new Xc();
		o.set(0, s(0, 0));
		const l = new Yc();
		l.set(0, o.get(0) === 0 ? null : new ss(null, 0, 0, o.get(0)));
		let c = 0;
		e: for (;;) {
			if (a++, !n.isValid()) return rt.trivialTimedOut(r, i);
			const b = -Math.min(a, i.length + a % 2), g = Math.min(a, r.length + a % 2);
			for (c = b; c <= g; c += 2) {
				const v = c === g ? -1 : o.get(c + 1), T = c === b ? -1 : o.get(c - 1) + 1, k = Math.min(Math.max(v, T), r.length), E = k - c;
				if (k > r.length || E > i.length) continue;
				const I = s(k, E);
				o.set(c, I);
				const D = k === v ? l.get(c + 1) : l.get(c - 1);
				if (l.set(c, I !== k ? new ss(D, k, E, I - k) : D), o.get(c) === r.length && o.get(c) - c === i.length) break e;
			}
		}
		let u = l.get(c);
		const d = [];
		let m = r.length, p = i.length;
		for (;;) {
			const b = u ? u.x + u.length : 0, g = u ? u.y + u.length : 0;
			if ((b !== m || g !== p) && d.push(new me(new J(b, m), new J(g, p))), !u) break;
			m = u.x, p = u.y, u = u.prev;
		}
		return d.reverse(), new rt(d, !1);
	}
}, ss = class {
	constructor(e, t, n, r) {
		this.prev = e, this.x = t, this.y = n, this.length = r;
	}
}, Xc = class {
	constructor() {
		this.positiveArr = new Int32Array(10), this.negativeArr = new Int32Array(10);
	}
	get(e) {
		return e < 0 ? (e = -e - 1, this.negativeArr[e]) : this.positiveArr[e];
	}
	set(e, t) {
		if (e < 0) {
			if (e = -e - 1, e >= this.negativeArr.length) {
				const n = this.negativeArr;
				this.negativeArr = new Int32Array(n.length * 2), this.negativeArr.set(n);
			}
			this.negativeArr[e] = t;
		} else {
			if (e >= this.positiveArr.length) {
				const n = this.positiveArr;
				this.positiveArr = new Int32Array(n.length * 2), this.positiveArr.set(n);
			}
			this.positiveArr[e] = t;
		}
	}
}, Yc = class {
	constructor() {
		this.positiveArr = [], this.negativeArr = [];
	}
	get(e) {
		return e < 0 ? (e = -e - 1, this.negativeArr[e]) : this.positiveArr[e];
	}
	set(e, t) {
		e < 0 ? (e = -e - 1, this.negativeArr[e] = t) : this.positiveArr[e] = t;
	}
}, tn = class {
	constructor(e, t, n) {
		this.lines = e, this.range = t, this.considerWhitespaceChanges = n, this.elements = [], this.firstElementOffsetByLineIdx = [], this.lineStartOffsets = [], this.trimmedWsLengthsByLineIdx = [], this.firstElementOffsetByLineIdx.push(0);
		for (let r = this.range.startLineNumber; r <= this.range.endLineNumber; r++) {
			let i = e[r - 1], s = 0;
			r === this.range.startLineNumber && this.range.startColumn > 1 && (s = this.range.startColumn - 1, i = i.substring(s)), this.lineStartOffsets.push(s);
			let a = 0;
			if (!n) {
				const l = i.trimStart();
				a = i.length - l.length, i = l.trimEnd();
			}
			this.trimmedWsLengthsByLineIdx.push(a);
			const o = r === this.range.endLineNumber ? Math.min(this.range.endColumn - 1 - s - a, i.length) : i.length;
			for (let l = 0; l < o; l++) this.elements.push(i.charCodeAt(l));
			r < this.range.endLineNumber && (this.elements.push(10), this.firstElementOffsetByLineIdx.push(this.elements.length));
		}
	}
	toString() {
		return `Slice: "${this.text}"`;
	}
	get text() {
		return this.getText(new J(0, this.length));
	}
	getText(e) {
		return this.elements.slice(e.start, e.endExclusive).map((t) => String.fromCharCode(t)).join("");
	}
	getElement(e) {
		return this.elements[e];
	}
	get length() {
		return this.elements.length;
	}
	getBoundaryScore(e) {
		const t = ls(e > 0 ? this.elements[e - 1] : -1), n = ls(e < this.elements.length ? this.elements[e] : -1);
		if (t === 7 && n === 8) return 0;
		if (t === 8) return 150;
		let r = 0;
		return t !== n && (r += 10, t === 0 && n === 1 && (r += 1)), r += os(t), r += os(n), r;
	}
	translateOffset(e, t = "right") {
		const n = at(this.firstElementOffsetByLineIdx, (i) => i <= e), r = e - this.firstElementOffsetByLineIdx[n];
		return new Y(this.range.startLineNumber + n, 1 + this.lineStartOffsets[n] + r + (r === 0 && t === "left" ? 0 : this.trimmedWsLengthsByLineIdx[n]));
	}
	translateRange(e) {
		const t = this.translateOffset(e.start, "right"), n = this.translateOffset(e.endExclusive, "left");
		return n.isBefore(t) ? j.fromPositions(n, n) : j.fromPositions(t, n);
	}
	findWordContaining(e) {
		if (e < 0 || e >= this.elements.length || !Ze(this.elements[e])) return;
		let t = e;
		for (; t > 0 && Ze(this.elements[t - 1]);) t--;
		let n = e;
		for (; n < this.elements.length && Ze(this.elements[n]);) n++;
		return new J(t, n);
	}
	findSubWordContaining(e) {
		if (e < 0 || e >= this.elements.length || !Ze(this.elements[e])) return;
		let t = e;
		for (; t > 0 && Ze(this.elements[t - 1]) && !as(this.elements[t]);) t--;
		let n = e;
		for (; n < this.elements.length && Ze(this.elements[n]) && !as(this.elements[n]);) n++;
		return new J(t, n);
	}
	countLinesIn(e) {
		return this.translateOffset(e.endExclusive).lineNumber - this.translateOffset(e.start).lineNumber;
	}
	isStronglyEqual(e, t) {
		return this.elements[e] === this.elements[t];
	}
	extendToFullLines(e) {
		return new J(st(this.firstElementOffsetByLineIdx, (t) => t <= e.start) ?? 0, zc(this.firstElementOffsetByLineIdx, (t) => e.endExclusive <= t) ?? this.elements.length);
	}
};
function Ze(e) {
	return e >= 97 && e <= 122 || e >= 65 && e <= 90 || e >= 48 && e <= 57;
}
function as(e) {
	return e >= 65 && e <= 90;
}
const Jc = {
	0: 0,
	1: 0,
	2: 0,
	3: 10,
	4: 2,
	5: 30,
	6: 3,
	7: 10,
	8: 10
};
function os(e) {
	return Jc[e];
}
function ls(e) {
	return e === 10 ? 8 : e === 13 ? 7 : Kn(e) ? 6 : e >= 97 && e <= 122 ? 0 : e >= 65 && e <= 90 ? 1 : e >= 48 && e <= 57 ? 2 : e === -1 ? 3 : e === 44 || e === 59 ? 5 : 4;
}
function Qc(e, t, n, r, i, s) {
	let { moves: a, excludedChanges: o } = Kc(e, t, n, s);
	if (!s.isValid()) return [];
	const l = eh(e.filter((c) => !o.has(c)), r, i, t, n, s);
	return Cc(a, l), a = th(a), a = a.filter((c) => {
		const u = c.original.toOffsetRange().slice(t).map((d) => d.trim());
		return u.join(`
`).length >= 15 && Zc(u, (d) => d.length >= 2) >= 2;
	}), a = nh(e, a), a;
}
function Zc(e, t) {
	let n = 0;
	for (const r of e) t(r) && n++;
	return n;
}
function Kc(e, t, n, r) {
	const i = [], s = e.filter((l) => l.modified.isEmpty && l.original.length >= 3).map((l) => new rs(l.original, t, l)), a = new Set(e.filter((l) => l.original.isEmpty && l.modified.length >= 3).map((l) => new rs(l.modified, n, l))), o = /* @__PURE__ */ new Set();
	for (const l of s) {
		let c = -1, u;
		for (const d of a) {
			const m = l.computeSimilarity(d);
			m > c && (c = m, u = d);
		}
		if (c > .9 && u && (a.delete(u), i.push(new ot(l.range, u.range)), o.add(l.source), o.add(u.source)), !r.isValid()) return {
			moves: i,
			excludedChanges: o
		};
	}
	return {
		moves: i,
		excludedChanges: o
	};
}
function eh(e, t, n, r, i, s) {
	const a = [], o = new gc();
	for (const m of e) for (let p = m.original.startLineNumber; p < m.original.endLineNumberExclusive - 2; p++) {
		const b = `${t[p - 1]}:${t[p + 1 - 1]}:${t[p + 2 - 1]}`;
		o.add(b, { range: new X(p, p + 3) });
	}
	const l = [];
	e.sort(_t((m) => m.modified.startLineNumber, vt));
	for (const m of e) {
		let p = [];
		for (let b = m.modified.startLineNumber; b < m.modified.endLineNumberExclusive - 2; b++) {
			const g = `${n[b - 1]}:${n[b + 1 - 1]}:${n[b + 2 - 1]}`, v = new X(b, b + 3), T = [];
			o.forEach(g, ({ range: k }) => {
				for (const I of p) if (I.originalLineRange.endLineNumberExclusive + 1 === k.endLineNumberExclusive && I.modifiedLineRange.endLineNumberExclusive + 1 === v.endLineNumberExclusive) {
					I.originalLineRange = new X(I.originalLineRange.startLineNumber, k.endLineNumberExclusive), I.modifiedLineRange = new X(I.modifiedLineRange.startLineNumber, v.endLineNumberExclusive), T.push(I);
					return;
				}
				const E = {
					modifiedLineRange: v,
					originalLineRange: k
				};
				l.push(E), T.push(E);
			}), p = T;
		}
		if (!s.isValid()) return [];
	}
	l.sort(Ic(_t((m) => m.modifiedLineRange.length, vt)));
	const c = new en(), u = new en();
	for (const m of l) {
		const p = m.modifiedLineRange.startLineNumber - m.originalLineRange.startLineNumber, b = c.subtractFrom(m.modifiedLineRange), g = u.subtractFrom(m.originalLineRange).getWithDelta(p), v = b.getIntersection(g);
		for (const T of v.ranges) {
			if (T.length < 3) continue;
			const k = T, E = T.delta(-p);
			a.push(new ot(E, k)), c.addRange(k), u.addRange(E);
		}
	}
	a.sort(_t((m) => m.original.startLineNumber, vt));
	const d = new ro(e);
	for (let m = 0; m < a.length; m++) {
		const p = a[m], b = d.findLastMonotonous((w) => w.original.startLineNumber <= p.original.startLineNumber), g = st(e, (w) => w.modified.startLineNumber <= p.modified.startLineNumber), v = Math.max(p.original.startLineNumber - b.original.startLineNumber, p.modified.startLineNumber - g.modified.startLineNumber), T = d.findLastMonotonous((w) => w.original.startLineNumber < p.original.endLineNumberExclusive), k = st(e, (w) => w.modified.startLineNumber < p.modified.endLineNumberExclusive), E = Math.max(T.original.endLineNumberExclusive - p.original.endLineNumberExclusive, k.modified.endLineNumberExclusive - p.modified.endLineNumberExclusive);
		let I;
		for (I = 0; I < v; I++) {
			const w = p.original.startLineNumber - I - 1, f = p.modified.startLineNumber - I - 1;
			if (w > r.length || f > i.length || c.contains(f) || u.contains(w) || !cs(r[w - 1], i[f - 1], s)) break;
		}
		I > 0 && (u.addRange(new X(p.original.startLineNumber - I, p.original.startLineNumber)), c.addRange(new X(p.modified.startLineNumber - I, p.modified.startLineNumber)));
		let D;
		for (D = 0; D < E; D++) {
			const w = p.original.endLineNumberExclusive + D, f = p.modified.endLineNumberExclusive + D;
			if (w > r.length || f > i.length || c.contains(f) || u.contains(w) || !cs(r[w - 1], i[f - 1], s)) break;
		}
		D > 0 && (u.addRange(new X(p.original.endLineNumberExclusive, p.original.endLineNumberExclusive + D)), c.addRange(new X(p.modified.endLineNumberExclusive, p.modified.endLineNumberExclusive + D))), (I > 0 || D > 0) && (a[m] = new ot(new X(p.original.startLineNumber - I, p.original.endLineNumberExclusive + D), new X(p.modified.startLineNumber - I, p.modified.endLineNumberExclusive + D)));
	}
	return a;
}
function cs(e, t, n) {
	if (e.trim() === t.trim()) return !0;
	if (e.length > 300 && t.length > 300) return !1;
	const r = new ho().compute(new tn([e], new j(1, 1, 1, e.length), !1), new tn([t], new j(1, 1, 1, t.length), !1), n);
	let i = 0;
	const s = me.invert(r.diffs, e.length);
	for (const l of s) l.seq1Range.forEach((c) => {
		Kn(e.charCodeAt(c)) || i++;
	});
	function a(l) {
		let c = 0;
		for (let u = 0; u < e.length; u++) Kn(l.charCodeAt(u)) || c++;
		return c;
	}
	const o = a(e.length > t.length ? e : t);
	return i / o > .6 && o > 10;
}
function th(e) {
	if (e.length === 0) return e;
	e.sort(_t((n) => n.original.startLineNumber, vt));
	const t = [e[0]];
	for (let n = 1; n < e.length; n++) {
		const r = t[t.length - 1], i = e[n], s = i.original.startLineNumber - r.original.endLineNumberExclusive, a = i.modified.startLineNumber - r.modified.endLineNumberExclusive;
		if (s >= 0 && a >= 0 && s + a <= 2) {
			t[t.length - 1] = r.join(i);
			continue;
		}
		t.push(i);
	}
	return t;
}
function nh(e, t) {
	const n = new ro(e);
	return t = t.filter((r) => (n.findLastMonotonous((i) => i.original.startLineNumber < r.original.endLineNumberExclusive) || new ot(new X(1, 1), new X(1, 1))) !== st(e, (i) => i.modified.startLineNumber < r.modified.endLineNumberExclusive)), t;
}
function hs(e, t, n) {
	let r = n;
	return r = us(e, t, r), r = us(e, t, r), r = ih(e, t, r), r;
}
function us(e, t, n) {
	if (n.length === 0) return n;
	const r = [];
	r.push(n[0]);
	for (let s = 1; s < n.length; s++) {
		const a = r[r.length - 1];
		let o = n[s];
		if (o.seq1Range.isEmpty || o.seq2Range.isEmpty) {
			const l = o.seq1Range.start - a.seq1Range.endExclusive;
			let c;
			for (c = 1; c <= l && !(e.getElement(o.seq1Range.start - c) !== e.getElement(o.seq1Range.endExclusive - c) || t.getElement(o.seq2Range.start - c) !== t.getElement(o.seq2Range.endExclusive - c)); c++);
			if (c--, c === l) {
				r[r.length - 1] = new me(new J(a.seq1Range.start, o.seq1Range.endExclusive - l), new J(a.seq2Range.start, o.seq2Range.endExclusive - l));
				continue;
			}
			o = o.delta(-c);
		}
		r.push(o);
	}
	const i = [];
	for (let s = 0; s < r.length - 1; s++) {
		const a = r[s + 1];
		let o = r[s];
		if (o.seq1Range.isEmpty || o.seq2Range.isEmpty) {
			const l = a.seq1Range.start - o.seq1Range.endExclusive;
			let c;
			for (c = 0; c < l && !(!e.isStronglyEqual(o.seq1Range.start + c, o.seq1Range.endExclusive + c) || !t.isStronglyEqual(o.seq2Range.start + c, o.seq2Range.endExclusive + c)); c++);
			if (c === l) {
				r[s + 1] = new me(new J(o.seq1Range.start + l, a.seq1Range.endExclusive), new J(o.seq2Range.start + l, a.seq2Range.endExclusive));
				continue;
			}
			c > 0 && (o = o.delta(c));
		}
		i.push(o);
	}
	return r.length > 0 && i.push(r[r.length - 1]), i;
}
function ih(e, t, n) {
	if (!e.getBoundaryScore || !t.getBoundaryScore) return n;
	for (let r = 0; r < n.length; r++) {
		const i = r > 0 ? n[r - 1] : void 0, s = n[r], a = r + 1 < n.length ? n[r + 1] : void 0, o = new J(i ? i.seq1Range.endExclusive + 1 : 0, a ? a.seq1Range.start - 1 : e.length), l = new J(i ? i.seq2Range.endExclusive + 1 : 0, a ? a.seq2Range.start - 1 : t.length);
		s.seq1Range.isEmpty ? n[r] = ds(s, e, t, o, l) : s.seq2Range.isEmpty && (n[r] = ds(s.swap(), t, e, l, o).swap());
	}
	return n;
}
function ds(e, t, n, r, i) {
	let a = 1;
	for (; e.seq1Range.start - a >= r.start && e.seq2Range.start - a >= i.start && n.isStronglyEqual(e.seq2Range.start - a, e.seq2Range.endExclusive - a) && a < 100;) a++;
	a--;
	let o = 0;
	for (; e.seq1Range.start + o < r.endExclusive && e.seq2Range.endExclusive + o < i.endExclusive && n.isStronglyEqual(e.seq2Range.start + o, e.seq2Range.endExclusive + o) && o < 100;) o++;
	if (a === 0 && o === 0) return e;
	let l = 0, c = -1;
	for (let u = -a; u <= o; u++) {
		const d = e.seq2Range.start + u, m = e.seq2Range.endExclusive + u, p = e.seq1Range.start + u, b = t.getBoundaryScore(p) + n.getBoundaryScore(d) + n.getBoundaryScore(m);
		b > c && (c = b, l = u);
	}
	return e.delta(l);
}
function rh(e, t, n) {
	const r = [];
	for (const i of n) {
		const s = r[r.length - 1];
		if (!s) {
			r.push(i);
			continue;
		}
		i.seq1Range.start - s.seq1Range.endExclusive <= 2 || i.seq2Range.start - s.seq2Range.endExclusive <= 2 ? r[r.length - 1] = new me(s.seq1Range.join(i.seq1Range), s.seq2Range.join(i.seq2Range)) : r.push(i);
	}
	return r;
}
function ms(e, t, n, r, i = !1) {
	const s = me.invert(n, e.length), a = [];
	let o = new Ve(0, 0);
	function l(c, u) {
		if (c.offset1 < o.offset1 || c.offset2 < o.offset2) return;
		const d = r(e, c.offset1), m = r(t, c.offset2);
		if (!d || !m) return;
		let p = new me(d, m);
		const b = p.intersect(u);
		let g = b.seq1Range.length, v = b.seq2Range.length;
		for (; s.length > 0;) {
			const T = s[0];
			if (!(T.seq1Range.intersects(p.seq1Range) || T.seq2Range.intersects(p.seq2Range))) break;
			const k = new me(r(e, T.seq1Range.start), r(t, T.seq2Range.start)), E = k.intersect(T);
			if (g += E.seq1Range.length, v += E.seq2Range.length, p = p.join(k), p.seq1Range.endExclusive >= T.seq1Range.endExclusive) s.shift();
			else break;
		}
		(i && g + v < p.seq1Range.length + p.seq2Range.length || g + v < (p.seq1Range.length + p.seq2Range.length) * 2 / 3) && a.push(p), o = p.getEndExclusives();
	}
	for (; s.length > 0;) {
		const c = s.shift();
		c.seq1Range.isEmpty || (l(c.getStarts(), c), l(c.getEndExclusives().delta(-1), c));
	}
	return sh(n, a);
}
function sh(e, t) {
	const n = [];
	for (; e.length > 0 || t.length > 0;) {
		const r = e[0], i = t[0];
		let s;
		r && (!i || r.seq1Range.start < i.seq1Range.start) ? s = e.shift() : s = t.shift(), n.length > 0 && n[n.length - 1].seq1Range.endExclusive >= s.seq1Range.start ? n[n.length - 1] = n[n.length - 1].join(s) : n.push(s);
	}
	return n;
}
function ah(e, t, n) {
	let r = n;
	if (r.length === 0) return r;
	let i = 0, s;
	do {
		s = !1;
		const o = [r[0]];
		for (let l = 1; l < r.length; l++) {
			let d = function(m, p) {
				const b = new J(u.seq1Range.endExclusive, c.seq1Range.start);
				return e.getText(b).replace(/\s/g, "").length <= 4 && (m.seq1Range.length + m.seq2Range.length > 5 || p.seq1Range.length + p.seq2Range.length > 5);
			};
			const c = r[l], u = o[o.length - 1];
			d(u, c) ? (s = !0, o[o.length - 1] = o[o.length - 1].join(c)) : o.push(c);
		}
		r = o;
	} while (i++ < 10 && s);
	return r;
}
function oh(e, t, n) {
	let r = n;
	if (r.length === 0) return r;
	let i = 0, s;
	do {
		s = !1;
		const l = [r[0]];
		for (let c = 1; c < r.length; c++) {
			let m = function(p, b) {
				const g = new J(d.seq1Range.endExclusive, u.seq1Range.start);
				if (e.countLinesIn(g) > 5 || g.length > 500) return !1;
				const v = e.getText(g).trim();
				if (v.length > 20 || v.split(/\r\n|\r|\n/).length > 1) return !1;
				const T = e.countLinesIn(p.seq1Range), k = p.seq1Range.length, E = t.countLinesIn(p.seq2Range), I = p.seq2Range.length, D = e.countLinesIn(b.seq1Range), w = b.seq1Range.length, f = t.countLinesIn(b.seq2Range), _ = b.seq2Range.length, C = 130;
				function z(L) {
					return Math.min(L, C);
				}
				return Math.pow(Math.pow(z(T * 40 + k), 1.5) + Math.pow(z(E * 40 + I), 1.5), 1.5) + Math.pow(Math.pow(z(D * 40 + w), 1.5) + Math.pow(z(f * 40 + _), 1.5), 1.5) > (C ** 1.5) ** 1.5 * 1.3;
			};
			const u = r[c], d = l[l.length - 1];
			m(d, u) ? (s = !0, l[l.length - 1] = l[l.length - 1].join(u)) : l.push(u);
		}
		r = l;
	} while (i++ < 10 && s);
	const a = [];
	return Nc(r, (l, c, u) => {
		let d = c;
		function m(k) {
			return k.length > 0 && k.trim().length <= 3 && c.seq1Range.length + c.seq2Range.length > 100;
		}
		const p = e.extendToFullLines(c.seq1Range), b = e.getText(new J(p.start, c.seq1Range.start));
		m(b) && (d = d.deltaStart(-b.length));
		const g = e.getText(new J(c.seq1Range.endExclusive, p.endExclusive));
		m(g) && (d = d.deltaEnd(g.length));
		const v = me.fromOffsetPairs(l ? l.getEndExclusives() : Ve.zero, u ? u.getStarts() : Ve.max), T = d.intersect(v);
		a.length > 0 && T.getStarts().equals(a[a.length - 1].getEndExclusives()) ? a[a.length - 1] = a[a.length - 1].join(T) : a.push(T);
	}), a;
}
var fs = class {
	constructor(e, t) {
		this.trimmedHash = e, this.lines = t;
	}
	getElement(e) {
		return this.trimmedHash[e];
	}
	get length() {
		return this.trimmedHash.length;
	}
	getBoundaryScore(e) {
		return 1e3 - ((e === 0 ? 0 : ps(this.lines[e - 1])) + (e === this.lines.length ? 0 : ps(this.lines[e])));
	}
	getText(e) {
		return this.lines.slice(e.start, e.endExclusive).join(`
`);
	}
	isStronglyEqual(e, t) {
		return this.lines[e] === this.lines[t];
	}
};
function ps(e) {
	let t = 0;
	for (; t < e.length && (e.charCodeAt(t) === 32 || e.charCodeAt(t) === 9);) t++;
	return t;
}
var lh = class {
	constructor() {
		this.dynamicProgrammingDiffing = new Gc(), this.myersDiffingAlgorithm = new ho();
	}
	computeDiff(e, t, n) {
		if (e.length <= 1 && Rc(e, t, (I, D) => I === D)) return new Wt([], [], !1);
		if (e.length === 1 && e[0].length === 0 || t.length === 1 && t[0].length === 0) return new Wt([new Lt(new X(1, e.length + 1), new X(1, t.length + 1), [new Ce(new j(1, 1, e.length, e[e.length - 1].length + 1), new j(1, 1, t.length, t[t.length - 1].length + 1))])], [], !1);
		const r = n.maxComputationTimeMs === 0 ? xi.instance : new $c(n.maxComputationTimeMs), i = !n.ignoreTrimWhitespace, s = /* @__PURE__ */ new Map();
		function a(I) {
			let D = s.get(I);
			return D === void 0 && (D = s.size, s.set(I, D)), D;
		}
		const o = e.map((I) => a(I.trim())), l = t.map((I) => a(I.trim())), c = new fs(o, e), u = new fs(l, t), d = c.length + u.length < 1700 ? this.dynamicProgrammingDiffing.compute(c, u, r, (I, D) => e[I] === t[D] ? t[D].length === 0 ? .1 : 1 + Math.log(1 + t[D].length) : .99) : this.myersDiffingAlgorithm.compute(c, u, r);
		let m = d.diffs, p = d.hitTimeout;
		m = hs(c, u, m), m = ah(c, u, m);
		const b = [], g = (I) => {
			if (i) for (let D = 0; D < I; D++) {
				const w = v + D, f = T + D;
				if (e[w] !== t[f]) {
					const _ = this.refineDiff(e, t, new me(new J(w, w + 1), new J(f, f + 1)), r, i, n);
					for (const C of _.mappings) b.push(C);
					_.hitTimeout && (p = !0);
				}
			}
		};
		let v = 0, T = 0;
		for (const I of m) {
			jt(() => I.seq1Range.start - v === I.seq2Range.start - T), g(I.seq1Range.start - v), v = I.seq1Range.endExclusive, T = I.seq2Range.endExclusive;
			const D = this.refineDiff(e, t, I, r, i, n);
			D.hitTimeout && (p = !0);
			for (const w of D.mappings) b.push(w);
		}
		g(e.length - v);
		const k = ts(b, new Rt(e), new Rt(t));
		let E = [];
		return n.computeMoves && (E = this.computeMoves(k, e, t, o, l, r, i, n)), jt(() => {
			function I(w, f) {
				if (w.lineNumber < 1 || w.lineNumber > f.length) return !1;
				const _ = f[w.lineNumber - 1];
				return !(w.column < 1 || w.column > _.length + 1);
			}
			function D(w, f) {
				return !(w.startLineNumber < 1 || w.startLineNumber > f.length + 1 || w.endLineNumberExclusive < 1 || w.endLineNumberExclusive > f.length + 1);
			}
			for (const w of k) {
				if (!w.innerChanges) return !1;
				for (const f of w.innerChanges) if (!(I(f.modifiedRange.getStartPosition(), t) && I(f.modifiedRange.getEndPosition(), t) && I(f.originalRange.getStartPosition(), e) && I(f.originalRange.getEndPosition(), e))) return !1;
				if (!D(w.modified, t) || !D(w.original, e)) return !1;
			}
			return !0;
		}), new Wt(k, E, p);
	}
	computeMoves(e, t, n, r, i, s, a, o) {
		return Qc(e, t, n, r, i, s).map((l) => new Ac(l, ts(this.refineDiff(t, n, new me(l.original.toOffsetRange(), l.modified.toOffsetRange()), s, a, o).mappings, new Rt(t), new Rt(n), !0)));
	}
	refineDiff(e, t, n, r, i, s) {
		const a = ch(n).toRangeMapping2(e, t), o = new tn(e, a.originalRange, i), l = new tn(t, a.modifiedRange, i), c = o.length + l.length < 500 ? this.dynamicProgrammingDiffing.compute(o, l, r) : this.myersDiffingAlgorithm.compute(o, l, r);
		let u = c.diffs;
		return u = hs(o, l, u), u = ms(o, l, u, (d, m) => d.findWordContaining(m)), s.extendToSubwords && (u = ms(o, l, u, (d, m) => d.findSubWordContaining(m), !0)), u = rh(o, l, u), u = oh(o, l, u), {
			mappings: u.map((d) => new Ce(o.translateRange(d.seq1Range), l.translateRange(d.seq2Range))),
			hitTimeout: c.hitTimeout
		};
	}
};
function ch(e) {
	return new ot(new X(e.seq1Range.start + 1, e.seq1Range.endExclusive + 1), new X(e.seq2Range.start + 1, e.seq2Range.endExclusive + 1));
}
const gs = {
	getLegacy: () => new Fc(),
	getDefault: () => new lh()
};
function De(e, t) {
	const n = Math.pow(10, t);
	return Math.round(e * n) / n;
}
var x = class {
	constructor(e, t, n, r = 1) {
		this._rgbaBrand = void 0, this.r = Math.min(255, Math.max(0, e)) | 0, this.g = Math.min(255, Math.max(0, t)) | 0, this.b = Math.min(255, Math.max(0, n)) | 0, this.a = De(Math.max(Math.min(1, r), 0), 3);
	}
	static equals(e, t) {
		return e.r === t.r && e.g === t.g && e.b === t.b && e.a === t.a;
	}
}, Fe = class bt {
	constructor(t, n, r, i) {
		this._hslaBrand = void 0, this.h = Math.max(Math.min(360, t), 0) | 0, this.s = De(Math.max(Math.min(1, n), 0), 3), this.l = De(Math.max(Math.min(1, r), 0), 3), this.a = De(Math.max(Math.min(1, i), 0), 3);
	}
	static equals(t, n) {
		return t.h === n.h && t.s === n.s && t.l === n.l && t.a === n.a;
	}
	static fromRGBA(t) {
		const n = t.r / 255, r = t.g / 255, i = t.b / 255, s = t.a, a = Math.max(n, r, i), o = Math.min(n, r, i);
		let l = 0, c = 0;
		const u = (o + a) / 2, d = a - o;
		if (d > 0) {
			switch (c = Math.min(u <= .5 ? d / (2 * u) : d / (2 - 2 * u), 1), a) {
				case n:
					l = (r - i) / d + (r < i ? 6 : 0);
					break;
				case r:
					l = (i - n) / d + 2;
					break;
				case i:
					l = (n - r) / d + 4;
					break;
			}
			l *= 60, l = Math.round(l);
		}
		return new bt(l, c, u, s);
	}
	static _hue2rgb(t, n, r) {
		return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? t + (n - t) * 6 * r : r < 1 / 2 ? n : r < 2 / 3 ? t + (n - t) * (2 / 3 - r) * 6 : t;
	}
	static toRGBA(t) {
		const n = t.h / 360, { s: r, l: i, a: s } = t;
		let a, o, l;
		if (r === 0) a = o = l = i;
		else {
			const c = i < .5 ? i * (1 + r) : i + r - i * r, u = 2 * i - c;
			a = bt._hue2rgb(u, c, n + 1 / 3), o = bt._hue2rgb(u, c, n), l = bt._hue2rgb(u, c, n - 1 / 3);
		}
		return new x(Math.round(a * 255), Math.round(o * 255), Math.round(l * 255), s);
	}
}, Mt = class uo {
	constructor(t, n, r, i) {
		this._hsvaBrand = void 0, this.h = Math.max(Math.min(360, t), 0) | 0, this.s = De(Math.max(Math.min(1, n), 0), 3), this.v = De(Math.max(Math.min(1, r), 0), 3), this.a = De(Math.max(Math.min(1, i), 0), 3);
	}
	static equals(t, n) {
		return t.h === n.h && t.s === n.s && t.v === n.v && t.a === n.a;
	}
	static fromRGBA(t) {
		const n = t.r / 255, r = t.g / 255, i = t.b / 255, s = Math.max(n, r, i), a = s - Math.min(n, r, i), o = s === 0 ? 0 : a / s;
		let l;
		return a === 0 ? l = 0 : s === n ? l = ((r - i) / a % 6 + 6) % 6 : s === r ? l = (i - n) / a + 2 : l = (n - r) / a + 4, new uo(Math.round(l * 60), o, s, t.a);
	}
	static toRGBA(t) {
		const { h: n, s: r, v: i, a: s } = t, a = i * r, o = a * (1 - Math.abs(n / 60 % 2 - 1)), l = i - a;
		let [c, u, d] = [
			0,
			0,
			0
		];
		return n < 60 ? (c = a, u = o) : n < 120 ? (c = o, u = a) : n < 180 ? (u = a, d = o) : n < 240 ? (u = o, d = a) : n < 300 ? (c = o, d = a) : n <= 360 && (c = a, d = o), c = Math.round((c + l) * 255), u = Math.round((u + l) * 255), d = Math.round((d + l) * 255), new x(c, u, d, s);
	}
}, nn = class ne {
	static fromHex(t) {
		return ne.Format.CSS.parseHex(t) || ne.red;
	}
	static equals(t, n) {
		return !t && !n ? !0 : !t || !n ? !1 : t.equals(n);
	}
	get hsla() {
		return this._hsla ? this._hsla : Fe.fromRGBA(this.rgba);
	}
	get hsva() {
		return this._hsva ? this._hsva : Mt.fromRGBA(this.rgba);
	}
	constructor(t) {
		if (t) if (t instanceof x) this.rgba = t;
		else if (t instanceof Fe) this._hsla = t, this.rgba = Fe.toRGBA(t);
		else if (t instanceof Mt) this._hsva = t, this.rgba = Mt.toRGBA(t);
		else throw new Error("Invalid color ctor argument");
		else throw new Error("Color needs a value");
	}
	equals(t) {
		return !!t && x.equals(this.rgba, t.rgba) && Fe.equals(this.hsla, t.hsla) && Mt.equals(this.hsva, t.hsva);
	}
	getRelativeLuminance() {
		const t = ne._relativeLuminanceForComponent(this.rgba.r), n = ne._relativeLuminanceForComponent(this.rgba.g), r = ne._relativeLuminanceForComponent(this.rgba.b);
		return De(.2126 * t + .7152 * n + .0722 * r, 4);
	}
	static _relativeLuminanceForComponent(t) {
		const n = t / 255;
		return n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4);
	}
	isLighter() {
		return (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1e3 >= 128;
	}
	isLighterThan(t) {
		return this.getRelativeLuminance() > t.getRelativeLuminance();
	}
	isDarkerThan(t) {
		return this.getRelativeLuminance() < t.getRelativeLuminance();
	}
	lighten(t) {
		return new ne(new Fe(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * t, this.hsla.a));
	}
	darken(t) {
		return new ne(new Fe(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * t, this.hsla.a));
	}
	transparent(t) {
		const { r: n, g: r, b: i, a: s } = this.rgba;
		return new ne(new x(n, r, i, s * t));
	}
	isTransparent() {
		return this.rgba.a === 0;
	}
	isOpaque() {
		return this.rgba.a === 1;
	}
	opposite() {
		return new ne(new x(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
	}
	mix(t, n = .5) {
		const r = Math.min(Math.max(n, 0), 1), i = this.rgba, s = t.rgba;
		return new ne(new x(i.r + (s.r - i.r) * r, i.g + (s.g - i.g) * r, i.b + (s.b - i.b) * r, i.a + (s.a - i.a) * r));
	}
	makeOpaque(t) {
		if (this.isOpaque() || t.rgba.a !== 1) return this;
		const { r: n, g: r, b: i, a: s } = this.rgba;
		return new ne(new x(t.rgba.r - s * (t.rgba.r - n), t.rgba.g - s * (t.rgba.g - r), t.rgba.b - s * (t.rgba.b - i), 1));
	}
	toString() {
		return this._toString || (this._toString = ne.Format.CSS.format(this)), this._toString;
	}
	toNumber32Bit() {
		return this._toNumber32Bit || (this._toNumber32Bit = (this.rgba.r << 24 | this.rgba.g << 16 | this.rgba.b << 8 | this.rgba.a * 255 << 0) >>> 0), this._toNumber32Bit;
	}
	static getLighterColor(t, n, r) {
		if (t.isLighterThan(n)) return t;
		r = r || .5;
		const i = t.getRelativeLuminance(), s = n.getRelativeLuminance();
		return r = r * (s - i) / s, t.lighten(r);
	}
	static getDarkerColor(t, n, r) {
		if (t.isDarkerThan(n)) return t;
		r = r || .5;
		const i = t.getRelativeLuminance(), s = n.getRelativeLuminance();
		return r = r * (i - s) / i, t.darken(r);
	}
	static {
		this.white = new ne(new x(255, 255, 255, 1));
	}
	static {
		this.black = new ne(new x(0, 0, 0, 1));
	}
	static {
		this.red = new ne(new x(255, 0, 0, 1));
	}
	static {
		this.blue = new ne(new x(0, 0, 255, 1));
	}
	static {
		this.green = new ne(new x(0, 255, 0, 1));
	}
	static {
		this.cyan = new ne(new x(0, 255, 255, 1));
	}
	static {
		this.lightgrey = new ne(new x(211, 211, 211, 1));
	}
	static {
		this.transparent = new ne(new x(0, 0, 0, 0));
	}
};
(function(e) {
	(function(t) {
		(function(n) {
			function r(g) {
				return g.rgba.a === 1 ? `rgb(${g.rgba.r}, ${g.rgba.g}, ${g.rgba.b})` : e.Format.CSS.formatRGBA(g);
			}
			n.formatRGB = r;
			function i(g) {
				return `rgba(${g.rgba.r}, ${g.rgba.g}, ${g.rgba.b}, ${+g.rgba.a.toFixed(2)})`;
			}
			n.formatRGBA = i;
			function s(g) {
				return g.hsla.a === 1 ? `hsl(${g.hsla.h}, ${Math.round(g.hsla.s * 100)}%, ${Math.round(g.hsla.l * 100)}%)` : e.Format.CSS.formatHSLA(g);
			}
			n.formatHSL = s;
			function a(g) {
				return `hsla(${g.hsla.h}, ${Math.round(g.hsla.s * 100)}%, ${Math.round(g.hsla.l * 100)}%, ${g.hsla.a.toFixed(2)})`;
			}
			n.formatHSLA = a;
			function o(g) {
				const v = g.toString(16);
				return v.length !== 2 ? "0" + v : v;
			}
			function l(g) {
				return `#${o(g.rgba.r)}${o(g.rgba.g)}${o(g.rgba.b)}`;
			}
			n.formatHex = l;
			function c(g, v = !1) {
				return v && g.rgba.a === 1 ? e.Format.CSS.formatHex(g) : `#${o(g.rgba.r)}${o(g.rgba.g)}${o(g.rgba.b)}${o(Math.round(g.rgba.a * 255))}`;
			}
			n.formatHexA = c;
			function u(g) {
				return g.isOpaque() ? e.Format.CSS.formatHex(g) : e.Format.CSS.formatRGBA(g);
			}
			n.format = u;
			function d(g) {
				if (g === "transparent") return e.transparent;
				if (g.startsWith("#")) return p(g);
				if (g.startsWith("rgba(")) {
					const v = g.match(/rgba\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+), *(?<a>(?:\+|-)?\d+(\.\d+)?)\)/);
					if (!v) throw new Error("Invalid color format " + g);
					return new e(new x(parseInt(v.groups?.r ?? "0"), parseInt(v.groups?.g ?? "0"), parseInt(v.groups?.b ?? "0"), parseFloat(v.groups?.a ?? "0")));
				}
				if (g.startsWith("rgb(")) {
					const v = g.match(/rgb\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+)\)/);
					if (!v) throw new Error("Invalid color format " + g);
					return new e(new x(parseInt(v.groups?.r ?? "0"), parseInt(v.groups?.g ?? "0"), parseInt(v.groups?.b ?? "0")));
				}
				return m(g);
			}
			n.parse = d;
			function m(g) {
				switch (g) {
					case "aliceblue": return new e(new x(240, 248, 255, 1));
					case "antiquewhite": return new e(new x(250, 235, 215, 1));
					case "aqua": return new e(new x(0, 255, 255, 1));
					case "aquamarine": return new e(new x(127, 255, 212, 1));
					case "azure": return new e(new x(240, 255, 255, 1));
					case "beige": return new e(new x(245, 245, 220, 1));
					case "bisque": return new e(new x(255, 228, 196, 1));
					case "black": return new e(new x(0, 0, 0, 1));
					case "blanchedalmond": return new e(new x(255, 235, 205, 1));
					case "blue": return new e(new x(0, 0, 255, 1));
					case "blueviolet": return new e(new x(138, 43, 226, 1));
					case "brown": return new e(new x(165, 42, 42, 1));
					case "burlywood": return new e(new x(222, 184, 135, 1));
					case "cadetblue": return new e(new x(95, 158, 160, 1));
					case "chartreuse": return new e(new x(127, 255, 0, 1));
					case "chocolate": return new e(new x(210, 105, 30, 1));
					case "coral": return new e(new x(255, 127, 80, 1));
					case "cornflowerblue": return new e(new x(100, 149, 237, 1));
					case "cornsilk": return new e(new x(255, 248, 220, 1));
					case "crimson": return new e(new x(220, 20, 60, 1));
					case "cyan": return new e(new x(0, 255, 255, 1));
					case "darkblue": return new e(new x(0, 0, 139, 1));
					case "darkcyan": return new e(new x(0, 139, 139, 1));
					case "darkgoldenrod": return new e(new x(184, 134, 11, 1));
					case "darkgray": return new e(new x(169, 169, 169, 1));
					case "darkgreen": return new e(new x(0, 100, 0, 1));
					case "darkgrey": return new e(new x(169, 169, 169, 1));
					case "darkkhaki": return new e(new x(189, 183, 107, 1));
					case "darkmagenta": return new e(new x(139, 0, 139, 1));
					case "darkolivegreen": return new e(new x(85, 107, 47, 1));
					case "darkorange": return new e(new x(255, 140, 0, 1));
					case "darkorchid": return new e(new x(153, 50, 204, 1));
					case "darkred": return new e(new x(139, 0, 0, 1));
					case "darksalmon": return new e(new x(233, 150, 122, 1));
					case "darkseagreen": return new e(new x(143, 188, 143, 1));
					case "darkslateblue": return new e(new x(72, 61, 139, 1));
					case "darkslategray": return new e(new x(47, 79, 79, 1));
					case "darkslategrey": return new e(new x(47, 79, 79, 1));
					case "darkturquoise": return new e(new x(0, 206, 209, 1));
					case "darkviolet": return new e(new x(148, 0, 211, 1));
					case "deeppink": return new e(new x(255, 20, 147, 1));
					case "deepskyblue": return new e(new x(0, 191, 255, 1));
					case "dimgray": return new e(new x(105, 105, 105, 1));
					case "dimgrey": return new e(new x(105, 105, 105, 1));
					case "dodgerblue": return new e(new x(30, 144, 255, 1));
					case "firebrick": return new e(new x(178, 34, 34, 1));
					case "floralwhite": return new e(new x(255, 250, 240, 1));
					case "forestgreen": return new e(new x(34, 139, 34, 1));
					case "fuchsia": return new e(new x(255, 0, 255, 1));
					case "gainsboro": return new e(new x(220, 220, 220, 1));
					case "ghostwhite": return new e(new x(248, 248, 255, 1));
					case "gold": return new e(new x(255, 215, 0, 1));
					case "goldenrod": return new e(new x(218, 165, 32, 1));
					case "gray": return new e(new x(128, 128, 128, 1));
					case "green": return new e(new x(0, 128, 0, 1));
					case "greenyellow": return new e(new x(173, 255, 47, 1));
					case "grey": return new e(new x(128, 128, 128, 1));
					case "honeydew": return new e(new x(240, 255, 240, 1));
					case "hotpink": return new e(new x(255, 105, 180, 1));
					case "indianred": return new e(new x(205, 92, 92, 1));
					case "indigo": return new e(new x(75, 0, 130, 1));
					case "ivory": return new e(new x(255, 255, 240, 1));
					case "khaki": return new e(new x(240, 230, 140, 1));
					case "lavender": return new e(new x(230, 230, 250, 1));
					case "lavenderblush": return new e(new x(255, 240, 245, 1));
					case "lawngreen": return new e(new x(124, 252, 0, 1));
					case "lemonchiffon": return new e(new x(255, 250, 205, 1));
					case "lightblue": return new e(new x(173, 216, 230, 1));
					case "lightcoral": return new e(new x(240, 128, 128, 1));
					case "lightcyan": return new e(new x(224, 255, 255, 1));
					case "lightgoldenrodyellow": return new e(new x(250, 250, 210, 1));
					case "lightgray": return new e(new x(211, 211, 211, 1));
					case "lightgreen": return new e(new x(144, 238, 144, 1));
					case "lightgrey": return new e(new x(211, 211, 211, 1));
					case "lightpink": return new e(new x(255, 182, 193, 1));
					case "lightsalmon": return new e(new x(255, 160, 122, 1));
					case "lightseagreen": return new e(new x(32, 178, 170, 1));
					case "lightskyblue": return new e(new x(135, 206, 250, 1));
					case "lightslategray": return new e(new x(119, 136, 153, 1));
					case "lightslategrey": return new e(new x(119, 136, 153, 1));
					case "lightsteelblue": return new e(new x(176, 196, 222, 1));
					case "lightyellow": return new e(new x(255, 255, 224, 1));
					case "lime": return new e(new x(0, 255, 0, 1));
					case "limegreen": return new e(new x(50, 205, 50, 1));
					case "linen": return new e(new x(250, 240, 230, 1));
					case "magenta": return new e(new x(255, 0, 255, 1));
					case "maroon": return new e(new x(128, 0, 0, 1));
					case "mediumaquamarine": return new e(new x(102, 205, 170, 1));
					case "mediumblue": return new e(new x(0, 0, 205, 1));
					case "mediumorchid": return new e(new x(186, 85, 211, 1));
					case "mediumpurple": return new e(new x(147, 112, 219, 1));
					case "mediumseagreen": return new e(new x(60, 179, 113, 1));
					case "mediumslateblue": return new e(new x(123, 104, 238, 1));
					case "mediumspringgreen": return new e(new x(0, 250, 154, 1));
					case "mediumturquoise": return new e(new x(72, 209, 204, 1));
					case "mediumvioletred": return new e(new x(199, 21, 133, 1));
					case "midnightblue": return new e(new x(25, 25, 112, 1));
					case "mintcream": return new e(new x(245, 255, 250, 1));
					case "mistyrose": return new e(new x(255, 228, 225, 1));
					case "moccasin": return new e(new x(255, 228, 181, 1));
					case "navajowhite": return new e(new x(255, 222, 173, 1));
					case "navy": return new e(new x(0, 0, 128, 1));
					case "oldlace": return new e(new x(253, 245, 230, 1));
					case "olive": return new e(new x(128, 128, 0, 1));
					case "olivedrab": return new e(new x(107, 142, 35, 1));
					case "orange": return new e(new x(255, 165, 0, 1));
					case "orangered": return new e(new x(255, 69, 0, 1));
					case "orchid": return new e(new x(218, 112, 214, 1));
					case "palegoldenrod": return new e(new x(238, 232, 170, 1));
					case "palegreen": return new e(new x(152, 251, 152, 1));
					case "paleturquoise": return new e(new x(175, 238, 238, 1));
					case "palevioletred": return new e(new x(219, 112, 147, 1));
					case "papayawhip": return new e(new x(255, 239, 213, 1));
					case "peachpuff": return new e(new x(255, 218, 185, 1));
					case "peru": return new e(new x(205, 133, 63, 1));
					case "pink": return new e(new x(255, 192, 203, 1));
					case "plum": return new e(new x(221, 160, 221, 1));
					case "powderblue": return new e(new x(176, 224, 230, 1));
					case "purple": return new e(new x(128, 0, 128, 1));
					case "rebeccapurple": return new e(new x(102, 51, 153, 1));
					case "red": return new e(new x(255, 0, 0, 1));
					case "rosybrown": return new e(new x(188, 143, 143, 1));
					case "royalblue": return new e(new x(65, 105, 225, 1));
					case "saddlebrown": return new e(new x(139, 69, 19, 1));
					case "salmon": return new e(new x(250, 128, 114, 1));
					case "sandybrown": return new e(new x(244, 164, 96, 1));
					case "seagreen": return new e(new x(46, 139, 87, 1));
					case "seashell": return new e(new x(255, 245, 238, 1));
					case "sienna": return new e(new x(160, 82, 45, 1));
					case "silver": return new e(new x(192, 192, 192, 1));
					case "skyblue": return new e(new x(135, 206, 235, 1));
					case "slateblue": return new e(new x(106, 90, 205, 1));
					case "slategray": return new e(new x(112, 128, 144, 1));
					case "slategrey": return new e(new x(112, 128, 144, 1));
					case "snow": return new e(new x(255, 250, 250, 1));
					case "springgreen": return new e(new x(0, 255, 127, 1));
					case "steelblue": return new e(new x(70, 130, 180, 1));
					case "tan": return new e(new x(210, 180, 140, 1));
					case "teal": return new e(new x(0, 128, 128, 1));
					case "thistle": return new e(new x(216, 191, 216, 1));
					case "tomato": return new e(new x(255, 99, 71, 1));
					case "turquoise": return new e(new x(64, 224, 208, 1));
					case "violet": return new e(new x(238, 130, 238, 1));
					case "wheat": return new e(new x(245, 222, 179, 1));
					case "white": return new e(new x(255, 255, 255, 1));
					case "whitesmoke": return new e(new x(245, 245, 245, 1));
					case "yellow": return new e(new x(255, 255, 0, 1));
					case "yellowgreen": return new e(new x(154, 205, 50, 1));
					default: return null;
				}
			}
			function p(g) {
				const v = g.length;
				if (v === 0 || g.charCodeAt(0) !== 35) return null;
				if (v === 7) return new e(new x(16 * b(g.charCodeAt(1)) + b(g.charCodeAt(2)), 16 * b(g.charCodeAt(3)) + b(g.charCodeAt(4)), 16 * b(g.charCodeAt(5)) + b(g.charCodeAt(6)), 1));
				if (v === 9) return new e(new x(16 * b(g.charCodeAt(1)) + b(g.charCodeAt(2)), 16 * b(g.charCodeAt(3)) + b(g.charCodeAt(4)), 16 * b(g.charCodeAt(5)) + b(g.charCodeAt(6)), (16 * b(g.charCodeAt(7)) + b(g.charCodeAt(8))) / 255));
				if (v === 4) {
					const T = b(g.charCodeAt(1)), k = b(g.charCodeAt(2)), E = b(g.charCodeAt(3));
					return new e(new x(16 * T + T, 16 * k + k, 16 * E + E));
				}
				if (v === 5) {
					const T = b(g.charCodeAt(1)), k = b(g.charCodeAt(2)), E = b(g.charCodeAt(3)), I = b(g.charCodeAt(4));
					return new e(new x(16 * T + T, 16 * k + k, 16 * E + E, (16 * I + I) / 255));
				}
				return null;
			}
			n.parseHex = p;
			function b(g) {
				switch (g) {
					case 48: return 0;
					case 49: return 1;
					case 50: return 2;
					case 51: return 3;
					case 52: return 4;
					case 53: return 5;
					case 54: return 6;
					case 55: return 7;
					case 56: return 8;
					case 57: return 9;
					case 97: return 10;
					case 65: return 10;
					case 98: return 11;
					case 66: return 11;
					case 99: return 12;
					case 67: return 12;
					case 100: return 13;
					case 68: return 13;
					case 101: return 14;
					case 69: return 14;
					case 102: return 15;
					case 70: return 15;
				}
				return 0;
			}
		})(t.CSS || (t.CSS = {}));
	})(e.Format || (e.Format = {}));
})(nn || (nn = {}));
function mo(e) {
	const t = [];
	for (const n of e) {
		const r = Number(n);
		(r || r === 0 && n.replace(/\s/g, "") !== "") && t.push(r);
	}
	return t;
}
function Ai(e, t, n, r) {
	return {
		red: e / 255,
		blue: n / 255,
		green: t / 255,
		alpha: r
	};
}
function dt(e, t) {
	const n = t.index, r = t[0].length;
	if (n === void 0) return;
	const i = e.positionAt(n);
	return {
		startLineNumber: i.lineNumber,
		startColumn: i.column,
		endLineNumber: i.lineNumber,
		endColumn: i.column + r
	};
}
function hh(e, t) {
	if (!e) return;
	const n = nn.Format.CSS.parseHex(t);
	if (n) return {
		range: e,
		color: Ai(n.rgba.r, n.rgba.g, n.rgba.b, n.rgba.a)
	};
}
function bs(e, t, n) {
	if (!e || t.length !== 1) return;
	const r = mo(t[0].values());
	return {
		range: e,
		color: Ai(r[0], r[1], r[2], n ? r[3] : 1)
	};
}
function ws(e, t, n) {
	if (!e || t.length !== 1) return;
	const r = mo(t[0].values()), i = new nn(new Fe(r[0], r[1] / 100, r[2] / 100, n ? r[3] : 1));
	return {
		range: e,
		color: Ai(i.rgba.r, i.rgba.g, i.rgba.b, i.rgba.a)
	};
}
function mt(e, t) {
	return typeof e == "string" ? [...e.matchAll(t)] : e.findMatches(t);
}
function uh(e) {
	const t = [], n = mt(e, /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|^(#)([A-Fa-f0-9]{3})\b|^(#)([A-Fa-f0-9]{4})\b|^(#)([A-Fa-f0-9]{6})\b|^(#)([A-Fa-f0-9]{8})\b|(?<=['"\s])(#)([A-Fa-f0-9]{3})\b|(?<=['"\s])(#)([A-Fa-f0-9]{4})\b|(?<=['"\s])(#)([A-Fa-f0-9]{6})\b|(?<=['"\s])(#)([A-Fa-f0-9]{8})\b/gm);
	if (n.length > 0) for (const r of n) {
		const i = r.filter((l) => l !== void 0), s = i[1], a = i[2];
		if (!a) continue;
		let o;
		s === "rgb" ? o = bs(dt(e, r), mt(a, /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm), !1) : s === "rgba" ? o = bs(dt(e, r), mt(a, /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm), !0) : s === "hsl" ? o = ws(dt(e, r), mt(a, /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm), !1) : s === "hsla" ? o = ws(dt(e, r), mt(a, /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(0[.][0-9]+|[.][0-9]+|[01][.]0*|[01])\s*\)$/gm), !0) : s === "#" && (o = hh(dt(e, r), s + a)), o && t.push(o);
	}
	return t;
}
function dh(e) {
	return !e || typeof e.getValue != "function" || typeof e.positionAt != "function" ? [] : uh(e);
}
const mh = /^-+|-+$/g, _s = 100, fh = 5;
function ph(e, t) {
	let n = [];
	if (t.findRegionSectionHeaders && t.foldingRules?.markers) {
		const r = gh(e, t);
		n = n.concat(r);
	}
	if (t.findMarkSectionHeaders) {
		const r = bh(e, t);
		n = n.concat(r);
	}
	return n;
}
function gh(e, t) {
	const n = [], r = e.getLineCount();
	for (let i = 1; i <= r; i++) {
		const s = e.getLineContent(i), a = s.match(t.foldingRules.markers.start);
		if (a) {
			const o = {
				startLineNumber: i,
				startColumn: a[0].length + 1,
				endLineNumber: i,
				endColumn: s.length + 1
			};
			if (o.endColumn > o.startColumn) {
				const l = {
					range: o,
					...wh(s.substring(a[0].length)),
					shouldBeInComments: !1
				};
				(l.text || l.hasSeparatorLine) && n.push(l);
			}
		}
	}
	return n;
}
function bh(e, t) {
	const n = [], r = e.getLineCount();
	if (!t.markSectionHeaderRegex || t.markSectionHeaderRegex.trim() === "") return n;
	const i = bc(t.markSectionHeaderRegex), s = new RegExp(t.markSectionHeaderRegex, `gdm${i ? "s" : ""}`);
	if (rl(s)) return n;
	for (let a = 1; a <= r; a += _s - fh) {
		const o = Math.min(a + _s - 1, r), l = [];
		for (let d = a; d <= o; d++) l.push(e.getLineContent(d));
		const c = l.join(`
`);
		s.lastIndex = 0;
		let u;
		for (; (u = s.exec(c)) !== null;) {
			const d = c.substring(0, u.index), m = (d.match(/\n/g) || []).length, p = a + m, b = u[0].split(`
`), g = b.length, v = p + g - 1, T = d.lastIndexOf(`
`) + 1, k = u.index - T + 1, E = b[b.length - 1], I = {
				range: {
					startLineNumber: p,
					startColumn: k,
					endLineNumber: v,
					endColumn: g === 1 ? k + u[0].length : E.length + 1
				},
				text: (u.groups ?? {}).label ?? "",
				hasSeparatorLine: ((u.groups ?? {}).separator ?? "") !== "",
				shouldBeInComments: !0
			};
			(I.text || I.hasSeparatorLine) && (n.length === 0 || n[n.length - 1].range.endLineNumber < I.range.startLineNumber) && n.push(I), s.lastIndex = u.index + u[0].length;
		}
	}
	return n;
}
function wh(e) {
	e = e.trim();
	const t = e.startsWith("-");
	return e = e.replace(mh, ""), {
		text: e,
		hasSeparatorLine: t
	};
}
(function() {
	const e = globalThis;
	typeof e.requestIdleCallback != "function" || e.cancelIdleCallback;
})();
var vh = class {
	get isRejected() {
		return this.outcome?.outcome === 1;
	}
	get isSettled() {
		return !!this.outcome;
	}
	constructor() {
		this.p = new Promise((e, t) => {
			this.completeCallback = e, this.errorCallback = t;
		});
	}
	complete(e) {
		return this.isSettled ? Promise.resolve() : new Promise((t) => {
			this.completeCallback(e), this.outcome = {
				outcome: 0,
				value: e
			}, t();
		});
	}
	error(e) {
		return this.isSettled ? Promise.resolve() : new Promise((t) => {
			this.errorCallback(e), this.outcome = {
				outcome: 1,
				value: e
			}, t();
		});
	}
	cancel() {
		return this.error(new Ra());
	}
}, vs;
(function(e) {
	async function t(r) {
		let i;
		const s = await Promise.all(r.map((a) => a.then((o) => o, (o) => {
			i || (i = o);
		})));
		if (typeof i < "u") throw i;
		return s;
	}
	e.settled = t;
	function n(r) {
		return new Promise(async (i, s) => {
			try {
				await r(i, s);
			} catch (a) {
				s(a);
			}
		});
	}
	e.withAsyncBody = n;
})(vs || (vs = {}));
var yh = class {
	constructor() {
		this._unsatisfiedConsumers = [], this._unconsumedValues = [];
	}
	get hasFinalValue() {
		return !!this._finalValue;
	}
	produce(e) {
		if (this._ensureNoFinalValue(), this._unsatisfiedConsumers.length > 0) {
			const t = this._unsatisfiedConsumers.shift();
			this._resolveOrRejectDeferred(t, e);
		} else this._unconsumedValues.push(e);
	}
	produceFinal(e) {
		this._ensureNoFinalValue(), this._finalValue = e;
		for (const t of this._unsatisfiedConsumers) this._resolveOrRejectDeferred(t, e);
		this._unsatisfiedConsumers.length = 0;
	}
	_ensureNoFinalValue() {
		if (this._finalValue) throw new oe("ProducerConsumer: cannot produce after final value has been set");
	}
	_resolveOrRejectDeferred(e, t) {
		t.ok ? e.complete(t.value) : e.error(t.error);
	}
	consume() {
		if (this._unconsumedValues.length > 0 || this._finalValue) {
			const e = this._unconsumedValues.length > 0 ? this._unconsumedValues.shift() : this._finalValue;
			return e.ok ? Promise.resolve(e.value) : Promise.reject(e.error);
		} else {
			const e = new vh();
			return this._unsatisfiedConsumers.push(e), e.p;
		}
	}
};
(class we {
	constructor(t, n) {
		this._onReturn = n, this._producerConsumer = new yh(), this._iterator = {
			next: () => this._producerConsumer.consume(),
			return: () => (this._onReturn?.(), Promise.resolve({
				done: !0,
				value: void 0
			})),
			throw: async (r) => (this._finishError(r), {
				done: !0,
				value: void 0
			})
		}, queueMicrotask(async () => {
			const r = t({
				emitOne: (i) => this._producerConsumer.produce({
					ok: !0,
					value: {
						done: !1,
						value: i
					}
				}),
				emitMany: (i) => {
					for (const s of i) this._producerConsumer.produce({
						ok: !0,
						value: {
							done: !1,
							value: s
						}
					});
				},
				reject: (i) => this._finishError(i)
			});
			if (!this._producerConsumer.hasFinalValue) try {
				await r, this._finishOk();
			} catch (i) {
				this._finishError(i);
			}
		});
	}
	static fromArray(t) {
		return new we((n) => {
			n.emitMany(t);
		});
	}
	static fromPromise(t) {
		return new we(async (n) => {
			n.emitMany(await t);
		});
	}
	static fromPromisesResolveOrder(t) {
		return new we(async (n) => {
			await Promise.all(t.map(async (r) => n.emitOne(await r)));
		});
	}
	static merge(t) {
		return new we(async (n) => {
			await Promise.all(t.map(async (r) => {
				for await (const i of r) n.emitOne(i);
			}));
		});
	}
	static {
		this.EMPTY = we.fromArray([]);
	}
	static map(t, n) {
		return new we(async (r) => {
			for await (const i of t) r.emitOne(n(i));
		});
	}
	map(t) {
		return we.map(this, t);
	}
	static coalesce(t) {
		return we.filter(t, (n) => !!n);
	}
	coalesce() {
		return we.coalesce(this);
	}
	static filter(t, n) {
		return new we(async (r) => {
			for await (const i of t) n(i) && r.emitOne(i);
		});
	}
	filter(t) {
		return we.filter(this, t);
	}
	_finishOk() {
		this._producerConsumer.hasFinalValue || this._producerConsumer.produceFinal({
			ok: !0,
			value: {
				done: !0,
				value: void 0
			}
		});
	}
	_finishError(t) {
		this._producerConsumer.hasFinalValue || this._producerConsumer.produceFinal({
			ok: !1,
			error: t
		});
	}
	[Symbol.asyncIterator]() {
		return this._iterator;
	}
});
var Th = class {
	constructor(e) {
		this.values = e, this.prefixSum = new Uint32Array(e.length), this.prefixSumValidIndex = new Int32Array(1), this.prefixSumValidIndex[0] = -1;
	}
	insertValues(e, t) {
		e = Ye(e);
		const n = this.values, r = this.prefixSum, i = t.length;
		return i === 0 ? !1 : (this.values = new Uint32Array(n.length + i), this.values.set(n.subarray(0, e), 0), this.values.set(n.subarray(e), e + i), this.values.set(t, e), e - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = e - 1), this.prefixSum = new Uint32Array(this.values.length), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(r.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
	}
	setValue(e, t) {
		return e = Ye(e), t = Ye(t), this.values[e] === t ? !1 : (this.values[e] = t, e - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = e - 1), !0);
	}
	removeValues(e, t) {
		e = Ye(e), t = Ye(t);
		const n = this.values, r = this.prefixSum;
		if (e >= n.length) return !1;
		const i = n.length - e;
		return t >= i && (t = i), t === 0 ? !1 : (this.values = new Uint32Array(n.length - t), this.values.set(n.subarray(0, e), 0), this.values.set(n.subarray(e + t), e), this.prefixSum = new Uint32Array(this.values.length), e - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = e - 1), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(r.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
	}
	getTotalSum() {
		return this.values.length === 0 ? 0 : this._getPrefixSum(this.values.length - 1);
	}
	getPrefixSum(e) {
		return e < 0 ? 0 : (e = Ye(e), this._getPrefixSum(e));
	}
	_getPrefixSum(e) {
		if (e <= this.prefixSumValidIndex[0]) return this.prefixSum[e];
		let t = this.prefixSumValidIndex[0] + 1;
		t === 0 && (this.prefixSum[0] = this.values[0], t++), e >= this.values.length && (e = this.values.length - 1);
		for (let n = t; n <= e; n++) this.prefixSum[n] = this.prefixSum[n - 1] + this.values[n];
		return this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], e), this.prefixSum[e];
	}
	getIndexOf(e) {
		e = Math.floor(e), this.getTotalSum();
		let t = 0, n = this.values.length - 1, r = 0, i = 0, s = 0;
		for (; t <= n;) if (r = t + (n - t) / 2 | 0, i = this.prefixSum[r], s = i - this.values[r], e < s) n = r - 1;
		else if (e >= i) t = r + 1;
		else break;
		return new kh(r, e - s);
	}
}, kh = class {
	constructor(e, t) {
		this.index = e, this.remainder = t, this._prefixSumIndexOfResultBrand = void 0, this.index = e, this.remainder = t;
	}
}, Sh = class {
	constructor(e, t, n, r) {
		this._uri = e, this._lines = t, this._eol = n, this._versionId = r, this._lineStarts = null, this._cachedTextValue = null;
	}
	dispose() {
		this._lines.length = 0;
	}
	get version() {
		return this._versionId;
	}
	getText() {
		return this._cachedTextValue === null && (this._cachedTextValue = this._lines.join(this._eol)), this._cachedTextValue;
	}
	onEvents(e) {
		e.eol && e.eol !== this._eol && (this._eol = e.eol, this._lineStarts = null);
		const t = e.changes;
		for (const n of t) this._acceptDeleteRange(n.range), this._acceptInsertText(new Y(n.range.startLineNumber, n.range.startColumn), n.text);
		this._versionId = e.versionId, this._cachedTextValue = null;
	}
	_ensureLineStarts() {
		if (!this._lineStarts) {
			const e = this._eol.length, t = this._lines.length, n = new Uint32Array(t);
			for (let r = 0; r < t; r++) n[r] = this._lines[r].length + e;
			this._lineStarts = new Th(n);
		}
	}
	_setLineText(e, t) {
		this._lines[e] = t, this._lineStarts && this._lineStarts.setValue(e, this._lines[e].length + this._eol.length);
	}
	_acceptDeleteRange(e) {
		if (e.startLineNumber === e.endLineNumber) {
			if (e.startColumn === e.endColumn) return;
			this._setLineText(e.startLineNumber - 1, this._lines[e.startLineNumber - 1].substring(0, e.startColumn - 1) + this._lines[e.startLineNumber - 1].substring(e.endColumn - 1));
			return;
		}
		this._setLineText(e.startLineNumber - 1, this._lines[e.startLineNumber - 1].substring(0, e.startColumn - 1) + this._lines[e.endLineNumber - 1].substring(e.endColumn - 1)), this._lines.splice(e.startLineNumber, e.endLineNumber - e.startLineNumber), this._lineStarts && this._lineStarts.removeValues(e.startLineNumber, e.endLineNumber - e.startLineNumber);
	}
	_acceptInsertText(e, t) {
		if (t.length === 0) return;
		const n = sl(t);
		if (n.length === 1) {
			this._setLineText(e.lineNumber - 1, this._lines[e.lineNumber - 1].substring(0, e.column - 1) + n[0] + this._lines[e.lineNumber - 1].substring(e.column - 1));
			return;
		}
		n[n.length - 1] += this._lines[e.lineNumber - 1].substring(e.column - 1), this._setLineText(e.lineNumber - 1, this._lines[e.lineNumber - 1].substring(0, e.column - 1) + n[0]);
		const r = new Uint32Array(n.length - 1);
		for (let i = 1; i < n.length; i++) this._lines.splice(e.lineNumber + i - 1, 0, n[i]), r[i - 1] = n[i].length + this._eol.length;
		this._lineStarts && this._lineStarts.insertValues(e.lineNumber, r);
	}
}, Lh = class {
	constructor() {
		this._models = Object.create(null);
	}
	getModel(e) {
		return this._models[e];
	}
	getModels() {
		const e = [];
		return Object.keys(this._models).forEach((t) => e.push(this._models[t])), e;
	}
	$acceptNewModel(e) {
		this._models[e.url] = new xh(Si.parse(e.url), e.lines, e.EOL, e.versionId);
	}
	$acceptModelChanged(e, t) {
		this._models[e] && this._models[e].onEvents(t);
	}
	$acceptRemovedModel(e) {
		this._models[e] && delete this._models[e];
	}
}, xh = class extends Sh {
	get uri() {
		return this._uri;
	}
	get eol() {
		return this._eol;
	}
	getValue() {
		return this.getText();
	}
	findMatches(e) {
		const t = [];
		for (let n = 0; n < this._lines.length; n++) {
			const r = this._lines[n], i = this.offsetAt(new Y(n + 1, 1)), s = r.matchAll(e);
			for (const a of s) (a.index || a.index === 0) && (a.index = a.index + i), t.push(a);
		}
		return t;
	}
	getLinesContent() {
		return this._lines.slice(0);
	}
	getLineCount() {
		return this._lines.length;
	}
	getLineContent(e) {
		return this._lines[e - 1];
	}
	getWordAtPosition(e, t) {
		const n = Li(e.column, no(t), this._lines[e.lineNumber - 1], 0);
		return n ? new j(e.lineNumber, n.startColumn, e.lineNumber, n.endColumn) : null;
	}
	words(e) {
		const t = this._lines, n = this._wordenize.bind(this);
		let r = 0, i = "", s = 0, a = [];
		return { *[Symbol.iterator]() {
			for (;;) if (s < a.length) {
				const o = i.substring(a[s].start, a[s].end);
				s += 1, yield o;
			} else if (r < t.length) i = t[r], a = n(i, e), s = 0, r += 1;
			else break;
		} };
	}
	getLineWords(e, t) {
		const n = this._lines[e - 1], r = this._wordenize(n, t), i = [];
		for (const s of r) i.push({
			word: n.substring(s.start, s.end),
			startColumn: s.start + 1,
			endColumn: s.end + 1
		});
		return i;
	}
	_wordenize(e, t) {
		const n = [];
		let r;
		for (t.lastIndex = 0; (r = t.exec(e)) && r[0].length !== 0;) n.push({
			start: r.index,
			end: r.index + r[0].length
		});
		return n;
	}
	getValueInRange(e) {
		if (e = this._validateRange(e), e.startLineNumber === e.endLineNumber) return this._lines[e.startLineNumber - 1].substring(e.startColumn - 1, e.endColumn - 1);
		const t = this._eol, n = e.startLineNumber - 1, r = e.endLineNumber - 1, i = [];
		i.push(this._lines[n].substring(e.startColumn - 1));
		for (let s = n + 1; s < r; s++) i.push(this._lines[s]);
		return i.push(this._lines[r].substring(0, e.endColumn - 1)), i.join(t);
	}
	offsetAt(e) {
		return e = this._validatePosition(e), this._ensureLineStarts(), this._lineStarts.getPrefixSum(e.lineNumber - 2) + (e.column - 1);
	}
	positionAt(e) {
		e = Math.floor(e), e = Math.max(0, e), this._ensureLineStarts();
		const t = this._lineStarts.getIndexOf(e), n = this._lines[t.index].length;
		return {
			lineNumber: 1 + t.index,
			column: 1 + Math.min(t.remainder, n)
		};
	}
	_validateRange(e) {
		const t = this._validatePosition({
			lineNumber: e.startLineNumber,
			column: e.startColumn
		}), n = this._validatePosition({
			lineNumber: e.endLineNumber,
			column: e.endColumn
		});
		return t.lineNumber !== e.startLineNumber || t.column !== e.startColumn || n.lineNumber !== e.endLineNumber || n.column !== e.endColumn ? {
			startLineNumber: t.lineNumber,
			startColumn: t.column,
			endLineNumber: n.lineNumber,
			endColumn: n.column
		} : e;
	}
	_validatePosition(e) {
		if (!Y.isIPosition(e)) throw new Error("bad position");
		let { lineNumber: t, column: n } = e, r = !1;
		if (t < 1) t = 1, n = 1, r = !0;
		else if (t > this._lines.length) t = this._lines.length, n = this._lines[t - 1].length + 1, r = !0;
		else {
			const i = this._lines[t - 1].length + 1;
			n < 1 ? (n = 1, r = !0) : n > i && (n = i, r = !0);
		}
		return r ? {
			lineNumber: t,
			column: n
		} : e;
	}
}, Ah = class Vt {
	constructor(t = null) {
		this._foreignModule = t, this._requestHandlerBrand = void 0, this._workerTextModelSyncServer = new Lh();
	}
	dispose() {}
	async $ping() {
		return "pong";
	}
	_getModel(t) {
		return this._workerTextModelSyncServer.getModel(t);
	}
	getModels() {
		return this._workerTextModelSyncServer.getModels();
	}
	$acceptNewModel(t) {
		this._workerTextModelSyncServer.$acceptNewModel(t);
	}
	$acceptModelChanged(t, n) {
		this._workerTextModelSyncServer.$acceptModelChanged(t, n);
	}
	$acceptRemovedModel(t) {
		this._workerTextModelSyncServer.$acceptRemovedModel(t);
	}
	async $computeUnicodeHighlights(t, n, r) {
		const i = this._getModel(t);
		return i ? Lc.computeUnicodeHighlights(i, n, r) : {
			ranges: [],
			hasMore: !1,
			ambiguousCharacterCount: 0,
			invisibleCharacterCount: 0,
			nonBasicAsciiCharacterCount: 0
		};
	}
	async $findSectionHeaders(t, n) {
		const r = this._getModel(t);
		return r ? ph(r, n) : [];
	}
	async $computeDiff(t, n, r, i) {
		const s = this._getModel(t), a = this._getModel(n);
		return !s || !a ? null : Vt.computeDiff(s, a, r, i);
	}
	static computeDiff(t, n, r, i) {
		const s = i === "advanced" ? gs.getDefault() : gs.getLegacy(), a = t.getLinesContent(), o = n.getLinesContent(), l = s.computeDiff(a, o, r), c = l.changes.length > 0 ? !1 : this._modelsAreIdentical(t, n);
		function u(d) {
			return d.map((m) => [
				m.original.startLineNumber,
				m.original.endLineNumberExclusive,
				m.modified.startLineNumber,
				m.modified.endLineNumberExclusive,
				m.innerChanges?.map((p) => [
					p.originalRange.startLineNumber,
					p.originalRange.startColumn,
					p.originalRange.endLineNumber,
					p.originalRange.endColumn,
					p.modifiedRange.startLineNumber,
					p.modifiedRange.startColumn,
					p.modifiedRange.endLineNumber,
					p.modifiedRange.endColumn
				])
			]);
		}
		return {
			identical: c,
			quitEarly: l.hitTimeout,
			changes: u(l.changes),
			moves: l.moves.map((d) => [
				d.lineRangeMapping.original.startLineNumber,
				d.lineRangeMapping.original.endLineNumberExclusive,
				d.lineRangeMapping.modified.startLineNumber,
				d.lineRangeMapping.modified.endLineNumberExclusive,
				u(d.changes)
			])
		};
	}
	static _modelsAreIdentical(t, n) {
		const r = t.getLineCount();
		if (r !== n.getLineCount()) return !1;
		for (let i = 1; i <= r; i++) if (t.getLineContent(i) !== n.getLineContent(i)) return !1;
		return !0;
	}
	static {
		this._diffLimit = 1e5;
	}
	async $computeMoreMinimalEdits(t, n, r) {
		const i = this._getModel(t);
		if (!i) return n;
		const s = [];
		let a;
		n = n.slice(0).sort((l, c) => l.range && c.range ? j.compareRangesUsingStarts(l.range, c.range) : (l.range ? 0 : 1) - (c.range ? 0 : 1));
		let o = 0;
		for (let l = 1; l < n.length; l++) j.getEndPosition(n[o].range).equals(j.getStartPosition(n[l].range)) ? (n[o].range = j.fromPositions(j.getStartPosition(n[o].range), j.getEndPosition(n[l].range)), n[o].text += n[l].text) : (o++, n[o] = n[l]);
		n.length = o + 1;
		for (let { range: l, text: c, eol: u } of n) {
			if (typeof u == "number" && (a = u), j.isEmpty(l) && !c) continue;
			const d = i.getValueInRange(l);
			if (c = c.replace(/\r\n|\n|\r/g, i.eol), d === c) continue;
			if (Math.max(c.length, d.length) > Vt._diffLimit) {
				s.push({
					range: l,
					text: c
				});
				continue;
			}
			const m = Ll(d, c, r), p = i.offsetAt(j.lift(l).getStartPosition());
			for (const b of m) {
				const g = i.positionAt(p + b.originalStart), v = i.positionAt(p + b.originalStart + b.originalLength), T = {
					text: c.substr(b.modifiedStart, b.modifiedLength),
					range: {
						startLineNumber: g.lineNumber,
						startColumn: g.column,
						endLineNumber: v.lineNumber,
						endColumn: v.column
					}
				};
				i.getValueInRange(T.range) !== T.text && s.push(T);
			}
		}
		return typeof a == "number" && s.push({
			eol: a,
			text: "",
			range: {
				startLineNumber: 0,
				startColumn: 0,
				endLineNumber: 0,
				endColumn: 0
			}
		}), s;
	}
	async $computeLinks(t) {
		const n = this._getModel(t);
		return n ? Cl(n) : null;
	}
	async $computeDefaultDocumentColors(t) {
		const n = this._getModel(t);
		return n ? dh(n) : null;
	}
	static {
		this._suggestionsLimit = 1e4;
	}
	async $textualSuggest(t, n, r, i) {
		const s = new Ia(), a = new RegExp(r, i), o = /* @__PURE__ */ new Set();
		e: for (const l of t) {
			const c = this._getModel(l);
			if (c) {
				for (const u of c.words(a)) if (!(u === n || !isNaN(Number(u))) && (o.add(u), o.size > Vt._suggestionsLimit)) break e;
			}
		}
		return {
			words: Array.from(o),
			duration: s.elapsed()
		};
	}
	async $computeWordRanges(t, n, r, i) {
		const s = this._getModel(t);
		if (!s) return Object.create(null);
		const a = new RegExp(r, i), o = Object.create(null);
		for (let l = n.startLineNumber; l < n.endLineNumber; l++) {
			const c = s.getLineWords(l, a);
			for (const u of c) {
				if (!isNaN(Number(u.word))) continue;
				let d = o[u.word];
				d || (d = [], o[u.word] = d), d.push({
					startLineNumber: l,
					startColumn: u.startColumn,
					endLineNumber: l,
					endColumn: u.endColumn
				});
			}
		}
		return o;
	}
	async $navigateValueSet(t, n, r, i, s) {
		const a = this._getModel(t);
		if (!a) return null;
		const o = new RegExp(i, s);
		n.startColumn === n.endColumn && (n = {
			startLineNumber: n.startLineNumber,
			startColumn: n.startColumn,
			endLineNumber: n.endLineNumber,
			endColumn: n.endColumn + 1
		});
		const l = a.getValueInRange(n), c = a.getWordAtPosition({
			lineNumber: n.startLineNumber,
			column: n.startColumn
		}, o);
		if (!c) return null;
		const u = a.getValueInRange(c);
		return Il.INSTANCE.navigateValueSet(n, l, c, u, r);
	}
	$fmr(t, n) {
		if (!this._foreignModule || typeof this._foreignModule[t] != "function") return Promise.reject(/* @__PURE__ */ new Error("Missing requestHandler or method: " + t));
		try {
			return Promise.resolve(this._foreignModule[t].apply(this._foreignModule, n));
		} catch (r) {
			return Promise.reject(r);
		}
	}
};
typeof importScripts == "function" && (globalThis.monaco = hc());
var Rh = class ti {
	static {
		this.CHANNEL_NAME = "editorWorkerHost";
	}
	static getChannel(t) {
		return t.getChannel(ti.CHANNEL_NAME);
	}
	static setChannel(t, n) {
		t.setChannel(ti.CHANNEL_NAME, n);
	}
};
function Mh(e) {
	let t;
	const n = yl((r) => {
		const i = Rh.getChannel(r);
		return t = e({
			host: new Proxy({}, { get(s, a, o) {
				if (a !== "then") {
					if (typeof a != "string") throw new Error("Not supported");
					return (...l) => i.$fhr(a, l);
				}
			} }),
			getMirrorModels: () => n.requestHandler.getModels()
		}), new Ah(t);
	});
	return t;
}
function Nh(e) {
	self.onmessage = (t) => {
		Mh((n) => e(n, t.data));
	};
}
function ye(...e) {
	const t = e[0];
	let n, r, i;
	if (typeof t == "string") n = t, r = t, e.splice(0, 1), i = !e || typeof e[0] != "object" ? e : e[0];
	else if (t instanceof Array) {
		const s = e.slice(1);
		if (t.length !== s.length + 1) throw new Error("expected a string as the first argument to l10n.t");
		let a = t[0];
		for (let o = 1; o < t.length; o++) a += `{${o - 1}}` + t[o];
		return ye(a, ...s);
	} else r = t.message, n = r, t.comment && t.comment.length > 0 && (n += `/${Array.isArray(t.comment) ? t.comment.join("") : t.comment}`), i = t.args ?? {};
	return Ih(r, i);
}
var Ch = /{([^}]+)}/g;
function Ih(e, t) {
	return Object.keys(t).length === 0 ? e : e.replace(Ch, (n, r) => t[r] ?? n);
}
var ys;
(function(e) {
	function t(n) {
		return typeof n == "string";
	}
	e.is = t;
})(ys || (ys = {}));
var ni;
(function(e) {
	function t(n) {
		return typeof n == "string";
	}
	e.is = t;
})(ni || (ni = {}));
var Ts;
(function(e) {
	e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647;
	function t(n) {
		return typeof n == "number" && e.MIN_VALUE <= n && n <= e.MAX_VALUE;
	}
	e.is = t;
})(Ts || (Ts = {}));
var rn;
(function(e) {
	e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647;
	function t(n) {
		return typeof n == "number" && e.MIN_VALUE <= n && n <= e.MAX_VALUE;
	}
	e.is = t;
})(rn || (rn = {}));
var ie;
(function(e) {
	function t(r, i) {
		return r === Number.MAX_VALUE && (r = rn.MAX_VALUE), i === Number.MAX_VALUE && (i = rn.MAX_VALUE), {
			line: r,
			character: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.objectLiteral(i) && R.uinteger(i.line) && R.uinteger(i.character);
	}
	e.is = n;
})(ie || (ie = {}));
var $;
(function(e) {
	function t(r, i, s, a) {
		if (R.uinteger(r) && R.uinteger(i) && R.uinteger(s) && R.uinteger(a)) return {
			start: ie.create(r, i),
			end: ie.create(s, a)
		};
		if (ie.is(r) && ie.is(i)) return {
			start: r,
			end: i
		};
		throw new Error(`Range#create called with invalid arguments[${r}, ${i}, ${s}, ${a}]`);
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.objectLiteral(i) && ie.is(i.start) && ie.is(i.end);
	}
	e.is = n;
})($ || ($ = {}));
var sn;
(function(e) {
	function t(r, i) {
		return {
			uri: r,
			range: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.objectLiteral(i) && $.is(i.range) && (R.string(i.uri) || R.undefined(i.uri));
	}
	e.is = n;
})(sn || (sn = {}));
var ks;
(function(e) {
	function t(r, i, s, a) {
		return {
			targetUri: r,
			targetRange: i,
			targetSelectionRange: s,
			originSelectionRange: a
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.objectLiteral(i) && $.is(i.targetRange) && R.string(i.targetUri) && $.is(i.targetSelectionRange) && ($.is(i.originSelectionRange) || R.undefined(i.originSelectionRange));
	}
	e.is = n;
})(ks || (ks = {}));
var ii;
(function(e) {
	function t(r, i, s, a) {
		return {
			red: r,
			green: i,
			blue: s,
			alpha: a
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && R.numberRange(i.red, 0, 1) && R.numberRange(i.green, 0, 1) && R.numberRange(i.blue, 0, 1) && R.numberRange(i.alpha, 0, 1);
	}
	e.is = n;
})(ii || (ii = {}));
var Ss;
(function(e) {
	function t(r, i) {
		return {
			range: r,
			color: i
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && $.is(i.range) && ii.is(i.color);
	}
	e.is = n;
})(Ss || (Ss = {}));
var Ls;
(function(e) {
	function t(r, i, s) {
		return {
			label: r,
			textEdit: i,
			additionalTextEdits: s
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && R.string(i.label) && (R.undefined(i.textEdit) || se.is(i)) && (R.undefined(i.additionalTextEdits) || R.typedArray(i.additionalTextEdits, se.is));
	}
	e.is = n;
})(Ls || (Ls = {}));
var an;
(function(e) {
	e.Comment = "comment", e.Imports = "imports", e.Region = "region";
})(an || (an = {}));
var xs;
(function(e) {
	function t(r, i, s, a, o, l) {
		const c = {
			startLine: r,
			endLine: i
		};
		return R.defined(s) && (c.startCharacter = s), R.defined(a) && (c.endCharacter = a), R.defined(o) && (c.kind = o), R.defined(l) && (c.collapsedText = l), c;
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && R.uinteger(i.startLine) && R.uinteger(i.startLine) && (R.undefined(i.startCharacter) || R.uinteger(i.startCharacter)) && (R.undefined(i.endCharacter) || R.uinteger(i.endCharacter)) && (R.undefined(i.kind) || R.string(i.kind));
	}
	e.is = n;
})(xs || (xs = {}));
var ri;
(function(e) {
	function t(r, i) {
		return {
			location: r,
			message: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && sn.is(i.location) && R.string(i.message);
	}
	e.is = n;
})(ri || (ri = {}));
var As;
(function(e) {
	e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
})(As || (As = {}));
var Rs;
(function(e) {
	e.Unnecessary = 1, e.Deprecated = 2;
})(Rs || (Rs = {}));
var Ms;
(function(e) {
	function t(n) {
		const r = n;
		return R.objectLiteral(r) && R.string(r.href);
	}
	e.is = t;
})(Ms || (Ms = {}));
var on;
(function(e) {
	function t(r, i, s, a, o, l) {
		let c = {
			range: r,
			message: i
		};
		return R.defined(s) && (c.severity = s), R.defined(a) && (c.code = a), R.defined(o) && (c.source = o), R.defined(l) && (c.relatedInformation = l), c;
	}
	e.create = t;
	function n(r) {
		var i;
		let s = r;
		return R.defined(s) && $.is(s.range) && R.string(s.message) && (R.number(s.severity) || R.undefined(s.severity)) && (R.integer(s.code) || R.string(s.code) || R.undefined(s.code)) && (R.undefined(s.codeDescription) || R.string((i = s.codeDescription) === null || i === void 0 ? void 0 : i.href)) && (R.string(s.source) || R.undefined(s.source)) && (R.undefined(s.relatedInformation) || R.typedArray(s.relatedInformation, ri.is));
	}
	e.is = n;
})(on || (on = {}));
var lt;
(function(e) {
	function t(r, i, ...s) {
		let a = {
			title: r,
			command: i
		};
		return R.defined(s) && s.length > 0 && (a.arguments = s), a;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.string(i.title) && R.string(i.command);
	}
	e.is = n;
})(lt || (lt = {}));
var se;
(function(e) {
	function t(s, a) {
		return {
			range: s,
			newText: a
		};
	}
	e.replace = t;
	function n(s, a) {
		return {
			range: {
				start: s,
				end: s
			},
			newText: a
		};
	}
	e.insert = n;
	function r(s) {
		return {
			range: s,
			newText: ""
		};
	}
	e.del = r;
	function i(s) {
		const a = s;
		return R.objectLiteral(a) && R.string(a.newText) && $.is(a.range);
	}
	e.is = i;
})(se || (se = {}));
var si;
(function(e) {
	function t(r, i, s) {
		const a = { label: r };
		return i !== void 0 && (a.needsConfirmation = i), s !== void 0 && (a.description = s), a;
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && R.string(i.label) && (R.boolean(i.needsConfirmation) || i.needsConfirmation === void 0) && (R.string(i.description) || i.description === void 0);
	}
	e.is = n;
})(si || (si = {}));
var ct;
(function(e) {
	function t(n) {
		const r = n;
		return R.string(r);
	}
	e.is = t;
})(ct || (ct = {}));
var Es;
(function(e) {
	function t(s, a, o) {
		return {
			range: s,
			newText: a,
			annotationId: o
		};
	}
	e.replace = t;
	function n(s, a, o) {
		return {
			range: {
				start: s,
				end: s
			},
			newText: a,
			annotationId: o
		};
	}
	e.insert = n;
	function r(s, a) {
		return {
			range: s,
			newText: "",
			annotationId: a
		};
	}
	e.del = r;
	function i(s) {
		const a = s;
		return se.is(a) && (si.is(a.annotationId) || ct.is(a.annotationId));
	}
	e.is = i;
})(Es || (Es = {}));
var ai;
(function(e) {
	function t(r, i) {
		return {
			textDocument: r,
			edits: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && ui.is(i.textDocument) && Array.isArray(i.edits);
	}
	e.is = n;
})(ai || (ai = {}));
var oi;
(function(e) {
	function t(r, i, s) {
		let a = {
			kind: "create",
			uri: r
		};
		return i !== void 0 && (i.overwrite !== void 0 || i.ignoreIfExists !== void 0) && (a.options = i), s !== void 0 && (a.annotationId = s), a;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return i && i.kind === "create" && R.string(i.uri) && (i.options === void 0 || (i.options.overwrite === void 0 || R.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || R.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || ct.is(i.annotationId));
	}
	e.is = n;
})(oi || (oi = {}));
var li;
(function(e) {
	function t(r, i, s, a) {
		let o = {
			kind: "rename",
			oldUri: r,
			newUri: i
		};
		return s !== void 0 && (s.overwrite !== void 0 || s.ignoreIfExists !== void 0) && (o.options = s), a !== void 0 && (o.annotationId = a), o;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return i && i.kind === "rename" && R.string(i.oldUri) && R.string(i.newUri) && (i.options === void 0 || (i.options.overwrite === void 0 || R.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || R.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || ct.is(i.annotationId));
	}
	e.is = n;
})(li || (li = {}));
var ci;
(function(e) {
	function t(r, i, s) {
		let a = {
			kind: "delete",
			uri: r
		};
		return i !== void 0 && (i.recursive !== void 0 || i.ignoreIfNotExists !== void 0) && (a.options = i), s !== void 0 && (a.annotationId = s), a;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return i && i.kind === "delete" && R.string(i.uri) && (i.options === void 0 || (i.options.recursive === void 0 || R.boolean(i.options.recursive)) && (i.options.ignoreIfNotExists === void 0 || R.boolean(i.options.ignoreIfNotExists))) && (i.annotationId === void 0 || ct.is(i.annotationId));
	}
	e.is = n;
})(ci || (ci = {}));
var hi;
(function(e) {
	function t(n) {
		let r = n;
		return r && (r.changes !== void 0 || r.documentChanges !== void 0) && (r.documentChanges === void 0 || r.documentChanges.every((i) => R.string(i.kind) ? oi.is(i) || li.is(i) || ci.is(i) : ai.is(i)));
	}
	e.is = t;
})(hi || (hi = {}));
var Ns;
(function(e) {
	function t(r) {
		return { uri: r };
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.string(i.uri);
	}
	e.is = n;
})(Ns || (Ns = {}));
var Cs;
(function(e) {
	function t(r, i) {
		return {
			uri: r,
			version: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.string(i.uri) && R.integer(i.version);
	}
	e.is = n;
})(Cs || (Cs = {}));
var ui;
(function(e) {
	function t(r, i) {
		return {
			uri: r,
			version: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.string(i.uri) && (i.version === null || R.integer(i.version));
	}
	e.is = n;
})(ui || (ui = {}));
var Is;
(function(e) {
	function t(r, i, s, a) {
		return {
			uri: r,
			languageId: i,
			version: s,
			text: a
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.string(i.uri) && R.string(i.languageId) && R.integer(i.version) && R.string(i.text);
	}
	e.is = n;
})(Is || (Is = {}));
var Ie;
(function(e) {
	e.PlainText = "plaintext", e.Markdown = "markdown";
	function t(n) {
		const r = n;
		return r === e.PlainText || r === e.Markdown;
	}
	e.is = t;
})(Ie || (Ie = {}));
var xt;
(function(e) {
	function t(n) {
		const r = n;
		return R.objectLiteral(n) && Ie.is(r.kind) && R.string(r.value);
	}
	e.is = t;
})(xt || (xt = {}));
var ue;
(function(e) {
	e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
})(ue || (ue = {}));
var ve;
(function(e) {
	e.PlainText = 1, e.Snippet = 2;
})(ve || (ve = {}));
var zs;
(function(e) {
	e.Deprecated = 1;
})(zs || (zs = {}));
var Hs;
(function(e) {
	function t(r, i, s) {
		return {
			newText: r,
			insert: i,
			replace: s
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return i && R.string(i.newText) && $.is(i.insert) && $.is(i.replace);
	}
	e.is = n;
})(Hs || (Hs = {}));
var Us;
(function(e) {
	e.asIs = 1, e.adjustIndentation = 2;
})(Us || (Us = {}));
var Ds;
(function(e) {
	function t(n) {
		const r = n;
		return r && (R.string(r.detail) || r.detail === void 0) && (R.string(r.description) || r.description === void 0);
	}
	e.is = t;
})(Ds || (Ds = {}));
var Ws;
(function(e) {
	function t(n) {
		return { label: n };
	}
	e.create = t;
})(Ws || (Ws = {}));
var Ps;
(function(e) {
	function t(n, r) {
		return {
			items: n || [],
			isIncomplete: !!r
		};
	}
	e.create = t;
})(Ps || (Ps = {}));
var ln;
(function(e) {
	function t(r) {
		return r.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
	}
	e.fromPlainText = t;
	function n(r) {
		const i = r;
		return R.string(i) || R.objectLiteral(i) && R.string(i.language) && R.string(i.value);
	}
	e.is = n;
})(ln || (ln = {}));
var qs;
(function(e) {
	function t(n) {
		let r = n;
		return !!r && R.objectLiteral(r) && (xt.is(r.contents) || ln.is(r.contents) || R.typedArray(r.contents, ln.is)) && (n.range === void 0 || $.is(n.range));
	}
	e.is = t;
})(qs || (qs = {}));
var Os;
(function(e) {
	function t(n, r) {
		return r ? {
			label: n,
			documentation: r
		} : { label: n };
	}
	e.create = t;
})(Os || (Os = {}));
var Fs;
(function(e) {
	function t(n, r, ...i) {
		let s = { label: n };
		return R.defined(r) && (s.documentation = r), R.defined(i) ? s.parameters = i : s.parameters = [], s;
	}
	e.create = t;
})(Fs || (Fs = {}));
var cn;
(function(e) {
	e.Text = 1, e.Read = 2, e.Write = 3;
})(cn || (cn = {}));
var Bs;
(function(e) {
	function t(n, r) {
		let i = { range: n };
		return R.number(r) && (i.kind = r), i;
	}
	e.create = t;
})(Bs || (Bs = {}));
var di;
(function(e) {
	e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
})(di || (di = {}));
var Vs;
(function(e) {
	e.Deprecated = 1;
})(Vs || (Vs = {}));
var mi;
(function(e) {
	function t(n, r, i, s, a) {
		let o = {
			name: n,
			kind: r,
			location: {
				uri: s,
				range: i
			}
		};
		return a && (o.containerName = a), o;
	}
	e.create = t;
})(mi || (mi = {}));
var js;
(function(e) {
	function t(n, r, i, s) {
		return s !== void 0 ? {
			name: n,
			kind: r,
			location: {
				uri: i,
				range: s
			}
		} : {
			name: n,
			kind: r,
			location: { uri: i }
		};
	}
	e.create = t;
})(js || (js = {}));
var fi;
(function(e) {
	function t(r, i, s, a, o, l) {
		let c = {
			name: r,
			detail: i,
			kind: s,
			range: a,
			selectionRange: o
		};
		return l !== void 0 && (c.children = l), c;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return i && R.string(i.name) && R.number(i.kind) && $.is(i.range) && $.is(i.selectionRange) && (i.detail === void 0 || R.string(i.detail)) && (i.deprecated === void 0 || R.boolean(i.deprecated)) && (i.children === void 0 || Array.isArray(i.children)) && (i.tags === void 0 || Array.isArray(i.tags));
	}
	e.is = n;
})(fi || (fi = {}));
var $s;
(function(e) {
	e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
})($s || ($s = {}));
var hn;
(function(e) {
	e.Invoked = 1, e.Automatic = 2;
})(hn || (hn = {}));
var Gs;
(function(e) {
	function t(r, i, s) {
		let a = { diagnostics: r };
		return i != null && (a.only = i), s != null && (a.triggerKind = s), a;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.typedArray(i.diagnostics, on.is) && (i.only === void 0 || R.typedArray(i.only, R.string)) && (i.triggerKind === void 0 || i.triggerKind === hn.Invoked || i.triggerKind === hn.Automatic);
	}
	e.is = n;
})(Gs || (Gs = {}));
var Xs;
(function(e) {
	function t(r, i, s) {
		let a = { title: r }, o = !0;
		return typeof i == "string" ? (o = !1, a.kind = i) : lt.is(i) ? a.command = i : a.edit = i, o && s !== void 0 && (a.kind = s), a;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return i && R.string(i.title) && (i.diagnostics === void 0 || R.typedArray(i.diagnostics, on.is)) && (i.kind === void 0 || R.string(i.kind)) && (i.edit !== void 0 || i.command !== void 0) && (i.command === void 0 || lt.is(i.command)) && (i.isPreferred === void 0 || R.boolean(i.isPreferred)) && (i.edit === void 0 || hi.is(i.edit));
	}
	e.is = n;
})(Xs || (Xs = {}));
var Ys;
(function(e) {
	function t(r, i) {
		let s = { range: r };
		return R.defined(i) && (s.data = i), s;
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && $.is(i.range) && (R.undefined(i.command) || lt.is(i.command));
	}
	e.is = n;
})(Ys || (Ys = {}));
var Js;
(function(e) {
	function t(r, i) {
		return {
			tabSize: r,
			insertSpaces: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && R.uinteger(i.tabSize) && R.boolean(i.insertSpaces);
	}
	e.is = n;
})(Js || (Js = {}));
var Qs;
(function(e) {
	function t(r, i, s) {
		return {
			range: r,
			target: i,
			data: s
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.defined(i) && $.is(i.range) && (R.undefined(i.target) || R.string(i.target));
	}
	e.is = n;
})(Qs || (Qs = {}));
var un;
(function(e) {
	function t(r, i) {
		return {
			range: r,
			parent: i
		};
	}
	e.create = t;
	function n(r) {
		let i = r;
		return R.objectLiteral(i) && $.is(i.range) && (i.parent === void 0 || e.is(i.parent));
	}
	e.is = n;
})(un || (un = {}));
var Zs;
(function(e) {
	e.namespace = "namespace", e.type = "type", e.class = "class", e.enum = "enum", e.interface = "interface", e.struct = "struct", e.typeParameter = "typeParameter", e.parameter = "parameter", e.variable = "variable", e.property = "property", e.enumMember = "enumMember", e.event = "event", e.function = "function", e.method = "method", e.macro = "macro", e.keyword = "keyword", e.modifier = "modifier", e.comment = "comment", e.string = "string", e.number = "number", e.regexp = "regexp", e.operator = "operator", e.decorator = "decorator";
})(Zs || (Zs = {}));
var Ks;
(function(e) {
	e.declaration = "declaration", e.definition = "definition", e.readonly = "readonly", e.static = "static", e.deprecated = "deprecated", e.abstract = "abstract", e.async = "async", e.modification = "modification", e.documentation = "documentation", e.defaultLibrary = "defaultLibrary";
})(Ks || (Ks = {}));
var ea;
(function(e) {
	function t(n) {
		const r = n;
		return R.objectLiteral(r) && (r.resultId === void 0 || typeof r.resultId == "string") && Array.isArray(r.data) && (r.data.length === 0 || typeof r.data[0] == "number");
	}
	e.is = t;
})(ea || (ea = {}));
var ta;
(function(e) {
	function t(r, i) {
		return {
			range: r,
			text: i
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return i != null && $.is(i.range) && R.string(i.text);
	}
	e.is = n;
})(ta || (ta = {}));
var na;
(function(e) {
	function t(r, i, s) {
		return {
			range: r,
			variableName: i,
			caseSensitiveLookup: s
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return i != null && $.is(i.range) && R.boolean(i.caseSensitiveLookup) && (R.string(i.variableName) || i.variableName === void 0);
	}
	e.is = n;
})(na || (na = {}));
var ia;
(function(e) {
	function t(r, i) {
		return {
			range: r,
			expression: i
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return i != null && $.is(i.range) && (R.string(i.expression) || i.expression === void 0);
	}
	e.is = n;
})(ia || (ia = {}));
var ra;
(function(e) {
	function t(r, i) {
		return {
			frameId: r,
			stoppedLocation: i
		};
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.defined(i) && $.is(r.stoppedLocation);
	}
	e.is = n;
})(ra || (ra = {}));
var pi;
(function(e) {
	e.Type = 1, e.Parameter = 2;
	function t(n) {
		return n === 1 || n === 2;
	}
	e.is = t;
})(pi || (pi = {}));
var gi;
(function(e) {
	function t(r) {
		return { value: r };
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && (i.tooltip === void 0 || R.string(i.tooltip) || xt.is(i.tooltip)) && (i.location === void 0 || sn.is(i.location)) && (i.command === void 0 || lt.is(i.command));
	}
	e.is = n;
})(gi || (gi = {}));
var sa;
(function(e) {
	function t(r, i, s) {
		const a = {
			position: r,
			label: i
		};
		return s !== void 0 && (a.kind = s), a;
	}
	e.create = t;
	function n(r) {
		const i = r;
		return R.objectLiteral(i) && ie.is(i.position) && (R.string(i.label) || R.typedArray(i.label, gi.is)) && (i.kind === void 0 || pi.is(i.kind)) && i.textEdits === void 0 || R.typedArray(i.textEdits, se.is) && (i.tooltip === void 0 || R.string(i.tooltip) || xt.is(i.tooltip)) && (i.paddingLeft === void 0 || R.boolean(i.paddingLeft)) && (i.paddingRight === void 0 || R.boolean(i.paddingRight));
	}
	e.is = n;
})(sa || (sa = {}));
var aa;
(function(e) {
	function t(n) {
		return {
			kind: "snippet",
			value: n
		};
	}
	e.createSnippet = t;
})(aa || (aa = {}));
var oa;
(function(e) {
	function t(n, r, i, s) {
		return {
			insertText: n,
			filterText: r,
			range: i,
			command: s
		};
	}
	e.create = t;
})(oa || (oa = {}));
var la;
(function(e) {
	function t(n) {
		return { items: n };
	}
	e.create = t;
})(la || (la = {}));
var ca;
(function(e) {
	e.Invoked = 0, e.Automatic = 1;
})(ca || (ca = {}));
var ha;
(function(e) {
	function t(n, r) {
		return {
			range: n,
			text: r
		};
	}
	e.create = t;
})(ha || (ha = {}));
var ua;
(function(e) {
	function t(n, r) {
		return {
			triggerKind: n,
			selectedCompletionInfo: r
		};
	}
	e.create = t;
})(ua || (ua = {}));
var da;
(function(e) {
	function t(n) {
		const r = n;
		return R.objectLiteral(r) && ni.is(r.uri) && R.string(r.name);
	}
	e.is = t;
})(da || (da = {}));
var ma;
(function(e) {
	function t(s, a, o, l) {
		return new zh(s, a, o, l);
	}
	e.create = t;
	function n(s) {
		let a = s;
		return !!(R.defined(a) && R.string(a.uri) && (R.undefined(a.languageId) || R.string(a.languageId)) && R.uinteger(a.lineCount) && R.func(a.getText) && R.func(a.positionAt) && R.func(a.offsetAt));
	}
	e.is = n;
	function r(s, a) {
		let o = s.getText(), l = i(a, (u, d) => {
			let m = u.range.start.line - d.range.start.line;
			return m === 0 ? u.range.start.character - d.range.start.character : m;
		}), c = o.length;
		for (let u = l.length - 1; u >= 0; u--) {
			let d = l[u], m = s.offsetAt(d.range.start), p = s.offsetAt(d.range.end);
			if (p <= c) o = o.substring(0, m) + d.newText + o.substring(p, o.length);
			else throw new Error("Overlapping edit");
			c = m;
		}
		return o;
	}
	e.applyEdits = r;
	function i(s, a) {
		if (s.length <= 1) return s;
		const o = s.length / 2 | 0, l = s.slice(0, o), c = s.slice(o);
		i(l, a), i(c, a);
		let u = 0, d = 0, m = 0;
		for (; u < l.length && d < c.length;) a(l[u], c[d]) <= 0 ? s[m++] = l[u++] : s[m++] = c[d++];
		for (; u < l.length;) s[m++] = l[u++];
		for (; d < c.length;) s[m++] = c[d++];
		return s;
	}
})(ma || (ma = {}));
var zh = class {
	constructor(e, t, n, r) {
		this._uri = e, this._languageId = t, this._version = n, this._content = r, this._lineOffsets = void 0;
	}
	get uri() {
		return this._uri;
	}
	get languageId() {
		return this._languageId;
	}
	get version() {
		return this._version;
	}
	getText(e) {
		if (e) {
			let t = this.offsetAt(e.start), n = this.offsetAt(e.end);
			return this._content.substring(t, n);
		}
		return this._content;
	}
	update(e, t) {
		this._content = e.text, this._version = t, this._lineOffsets = void 0;
	}
	getLineOffsets() {
		if (this._lineOffsets === void 0) {
			let e = [], t = this._content, n = !0;
			for (let r = 0; r < t.length; r++) {
				n && (e.push(r), n = !1);
				let i = t.charAt(r);
				n = i === "\r" || i === `
`, i === "\r" && r + 1 < t.length && t.charAt(r + 1) === `
` && r++;
			}
			n && t.length > 0 && e.push(t.length), this._lineOffsets = e;
		}
		return this._lineOffsets;
	}
	positionAt(e) {
		e = Math.max(Math.min(e, this._content.length), 0);
		let t = this.getLineOffsets(), n = 0, r = t.length;
		if (r === 0) return ie.create(0, e);
		for (; n < r;) {
			let s = Math.floor((n + r) / 2);
			t[s] > e ? r = s : n = s + 1;
		}
		let i = n - 1;
		return ie.create(i, e - t[i]);
	}
	offsetAt(e) {
		let t = this.getLineOffsets();
		if (e.line >= t.length) return this._content.length;
		if (e.line < 0) return 0;
		let n = t[e.line], r = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
		return Math.max(Math.min(n + e.character, r), n);
	}
	get lineCount() {
		return this.getLineOffsets().length;
	}
}, R;
(function(e) {
	const t = Object.prototype.toString;
	function n(p) {
		return typeof p < "u";
	}
	e.defined = n;
	function r(p) {
		return typeof p > "u";
	}
	e.undefined = r;
	function i(p) {
		return p === !0 || p === !1;
	}
	e.boolean = i;
	function s(p) {
		return t.call(p) === "[object String]";
	}
	e.string = s;
	function a(p) {
		return t.call(p) === "[object Number]";
	}
	e.number = a;
	function o(p, b, g) {
		return t.call(p) === "[object Number]" && b <= p && p <= g;
	}
	e.numberRange = o;
	function l(p) {
		return t.call(p) === "[object Number]" && -2147483648 <= p && p <= 2147483647;
	}
	e.integer = l;
	function c(p) {
		return t.call(p) === "[object Number]" && 0 <= p && p <= 2147483647;
	}
	e.uinteger = c;
	function u(p) {
		return t.call(p) === "[object Function]";
	}
	e.func = u;
	function d(p) {
		return p !== null && typeof p == "object";
	}
	e.objectLiteral = d;
	function m(p, b) {
		return Array.isArray(p) && p.every(b);
	}
	e.typedArray = m;
})(R || (R = {}));
var fa = class bi {
	constructor(t, n, r, i) {
		this._uri = t, this._languageId = n, this._version = r, this._content = i, this._lineOffsets = void 0;
	}
	get uri() {
		return this._uri;
	}
	get languageId() {
		return this._languageId;
	}
	get version() {
		return this._version;
	}
	getText(t) {
		if (t) {
			const n = this.offsetAt(t.start), r = this.offsetAt(t.end);
			return this._content.substring(n, r);
		}
		return this._content;
	}
	update(t, n) {
		for (let r of t) if (bi.isIncremental(r)) {
			const i = fo(r.range), s = this.offsetAt(i.start), a = this.offsetAt(i.end);
			this._content = this._content.substring(0, s) + r.text + this._content.substring(a, this._content.length);
			const o = Math.max(i.start.line, 0), l = Math.max(i.end.line, 0);
			let c = this._lineOffsets;
			const u = pa(r.text, !1, s);
			if (l - o === u.length) for (let m = 0, p = u.length; m < p; m++) c[m + o + 1] = u[m];
			else u.length < 1e4 ? c.splice(o + 1, l - o, ...u) : this._lineOffsets = c = c.slice(0, o + 1).concat(u, c.slice(l + 1));
			const d = r.text.length - (a - s);
			if (d !== 0) for (let m = o + 1 + u.length, p = c.length; m < p; m++) c[m] = c[m] + d;
		} else if (bi.isFull(r)) this._content = r.text, this._lineOffsets = void 0;
		else throw new Error("Unknown change event received");
		this._version = n;
	}
	getLineOffsets() {
		return this._lineOffsets === void 0 && (this._lineOffsets = pa(this._content, !0)), this._lineOffsets;
	}
	positionAt(t) {
		t = Math.max(Math.min(t, this._content.length), 0);
		let n = this.getLineOffsets(), r = 0, i = n.length;
		if (i === 0) return {
			line: 0,
			character: t
		};
		for (; r < i;) {
			let a = Math.floor((r + i) / 2);
			n[a] > t ? i = a : r = a + 1;
		}
		let s = r - 1;
		return {
			line: s,
			character: t - n[s]
		};
	}
	offsetAt(t) {
		let n = this.getLineOffsets();
		if (t.line >= n.length) return this._content.length;
		if (t.line < 0) return 0;
		let r = n[t.line], i = t.line + 1 < n.length ? n[t.line + 1] : this._content.length;
		return Math.max(Math.min(r + t.character, i), r);
	}
	get lineCount() {
		return this.getLineOffsets().length;
	}
	static isIncremental(t) {
		let n = t;
		return n != null && typeof n.text == "string" && n.range !== void 0 && (n.rangeLength === void 0 || typeof n.rangeLength == "number");
	}
	static isFull(t) {
		let n = t;
		return n != null && typeof n.text == "string" && n.range === void 0 && n.rangeLength === void 0;
	}
}, wi;
(function(e) {
	function t(i, s, a, o) {
		return new fa(i, s, a, o);
	}
	e.create = t;
	function n(i, s, a) {
		if (i instanceof fa) return i.update(s, a), i;
		throw new Error("TextDocument.update: document must be created by TextDocument.create");
	}
	e.update = n;
	function r(i, s) {
		let a = i.getText(), o = _i(s.map(Hh), (u, d) => {
			let m = u.range.start.line - d.range.start.line;
			return m === 0 ? u.range.start.character - d.range.start.character : m;
		}), l = 0;
		const c = [];
		for (const u of o) {
			let d = i.offsetAt(u.range.start);
			if (d < l) throw new Error("Overlapping edit");
			d > l && c.push(a.substring(l, d)), u.newText.length && c.push(u.newText), l = i.offsetAt(u.range.end);
		}
		return c.push(a.substr(l)), c.join("");
	}
	e.applyEdits = r;
})(wi || (wi = {}));
function _i(e, t) {
	if (e.length <= 1) return e;
	const n = e.length / 2 | 0, r = e.slice(0, n), i = e.slice(n);
	_i(r, t), _i(i, t);
	let s = 0, a = 0, o = 0;
	for (; s < r.length && a < i.length;) t(r[s], i[a]) <= 0 ? e[o++] = r[s++] : e[o++] = i[a++];
	for (; s < r.length;) e[o++] = r[s++];
	for (; a < i.length;) e[o++] = i[a++];
	return e;
}
function pa(e, t, n = 0) {
	const r = t ? [n] : [];
	for (let i = 0; i < e.length; i++) {
		let s = e.charCodeAt(i);
		(s === 13 || s === 10) && (s === 13 && i + 1 < e.length && e.charCodeAt(i + 1) === 10 && i++, r.push(n + i + 1));
	}
	return r;
}
function fo(e) {
	const t = e.start, n = e.end;
	return t.line > n.line || t.line === n.line && t.character > n.character ? {
		start: n,
		end: t
	} : e;
}
function Hh(e) {
	const t = fo(e.range);
	return t !== e.range ? {
		newText: e.newText,
		range: t
	} : e;
}
var U;
(function(e) {
	e[e.StartCommentTag = 0] = "StartCommentTag", e[e.Comment = 1] = "Comment", e[e.EndCommentTag = 2] = "EndCommentTag", e[e.StartTagOpen = 3] = "StartTagOpen", e[e.StartTagClose = 4] = "StartTagClose", e[e.StartTagSelfClose = 5] = "StartTagSelfClose", e[e.StartTag = 6] = "StartTag", e[e.EndTagOpen = 7] = "EndTagOpen", e[e.EndTagClose = 8] = "EndTagClose", e[e.EndTag = 9] = "EndTag", e[e.DelimiterAssign = 10] = "DelimiterAssign", e[e.AttributeName = 11] = "AttributeName", e[e.AttributeValue = 12] = "AttributeValue", e[e.StartDoctypeTag = 13] = "StartDoctypeTag", e[e.Doctype = 14] = "Doctype", e[e.EndDoctypeTag = 15] = "EndDoctypeTag", e[e.Content = 16] = "Content", e[e.Whitespace = 17] = "Whitespace", e[e.Unknown = 18] = "Unknown", e[e.Script = 19] = "Script", e[e.Styles = 20] = "Styles", e[e.EOS = 21] = "EOS";
})(U || (U = {}));
var B;
(function(e) {
	e[e.WithinContent = 0] = "WithinContent", e[e.AfterOpeningStartTag = 1] = "AfterOpeningStartTag", e[e.AfterOpeningEndTag = 2] = "AfterOpeningEndTag", e[e.WithinDoctype = 3] = "WithinDoctype", e[e.WithinTag = 4] = "WithinTag", e[e.WithinEndTag = 5] = "WithinEndTag", e[e.WithinComment = 6] = "WithinComment", e[e.WithinScriptContent = 7] = "WithinScriptContent", e[e.WithinStyleContent = 8] = "WithinStyleContent", e[e.AfterAttributeName = 9] = "AfterAttributeName", e[e.BeforeAttributeValue = 10] = "BeforeAttributeValue";
})(B || (B = {}));
var ga;
(function(e) {
	e.LATEST = { textDocument: {
		completion: { completionItem: { documentationFormat: [Ie.Markdown, Ie.PlainText] } },
		hover: { contentFormat: [Ie.Markdown, Ie.PlainText] }
	} };
})(ga || (ga = {}));
var vi;
(function(e) {
	e[e.Unknown = 0] = "Unknown", e[e.File = 1] = "File", e[e.Directory = 2] = "Directory", e[e.SymbolicLink = 64] = "SymbolicLink";
})(vi || (vi = {}));
var Uh = class {
	constructor(e, t) {
		this.source = e, this.len = e.length, this.position = t;
	}
	eos() {
		return this.len <= this.position;
	}
	getSource() {
		return this.source;
	}
	pos() {
		return this.position;
	}
	goBackTo(e) {
		this.position = e;
	}
	goBack(e) {
		this.position -= e;
	}
	advance(e) {
		this.position += e;
	}
	goToEnd() {
		this.position = this.source.length;
	}
	nextChar() {
		return this.source.charCodeAt(this.position++) || 0;
	}
	peekChar(e = 0) {
		return this.source.charCodeAt(this.position + e) || 0;
	}
	advanceIfChar(e) {
		return e === this.source.charCodeAt(this.position) ? (this.position++, !0) : !1;
	}
	advanceIfChars(e) {
		let t;
		if (this.position + e.length > this.source.length) return !1;
		for (t = 0; t < e.length; t++) if (this.source.charCodeAt(this.position + t) !== e[t]) return !1;
		return this.advance(t), !0;
	}
	advanceIfRegExp(e) {
		const t = this.source.substr(this.position).match(e);
		return t ? (this.position = this.position + t.index + t[0].length, t[0]) : "";
	}
	advanceUntilRegExp(e) {
		const t = this.source.substr(this.position).match(e);
		return t ? (this.position = this.position + t.index, t[0]) : (this.goToEnd(), "");
	}
	advanceUntilChar(e) {
		for (; this.position < this.source.length;) {
			if (this.source.charCodeAt(this.position) === e) return !0;
			this.advance(1);
		}
		return !1;
	}
	advanceUntilChars(e) {
		for (; this.position + e.length <= this.source.length;) {
			let t = 0;
			for (; t < e.length && this.source.charCodeAt(this.position + t) === e[t]; t++);
			if (t === e.length) return !0;
			this.advance(1);
		}
		return this.goToEnd(), !1;
	}
	skipWhitespace() {
		return this.advanceWhileChar((e) => e === Bh || e === Vh || e === qh || e === Fh || e === Oh) > 0;
	}
	advanceWhileChar(e) {
		const t = this.position;
		for (; this.position < this.len && e(this.source.charCodeAt(this.position));) this.position++;
		return this.position - t;
	}
};
const ba = 33, Ke = 45, Et = 60, ke = 62, xn = 47, Dh = 61, Wh = 34, Ph = 39, qh = 10, Oh = 13, Fh = 12, Bh = 32, Vh = 9, jh = {
	"text/x-handlebars-template": !0,
	"text/html": !0
};
function ge(e, t = 0, n = B.WithinContent, r = !1) {
	const i = new Uh(e, t);
	let s = n, a = 0, o = U.Unknown, l, c, u, d, m;
	function p() {
		return i.advanceIfRegExp(/^[_:\w][_:\w-.\d]*/).toLowerCase();
	}
	function b() {
		return i.advanceIfRegExp(/^[^\s"'></=\x00-\x0F\x7F\x80-\x9F]*/).toLowerCase();
	}
	function g(k, E, I) {
		return o = E, a = k, l = I, E;
	}
	function v() {
		const k = i.pos(), E = s, I = T();
		return I !== U.EOS && k === i.pos() && !(r && (I === U.StartTagClose || I === U.EndTagClose)) ? (console.warn("Scanner.scan has not advanced at offset " + k + ", state before: " + E + " after: " + s), i.advance(1), g(k, U.Unknown)) : I;
	}
	function T() {
		const k = i.pos();
		if (i.eos()) return g(k, U.EOS);
		let E;
		switch (s) {
			case B.WithinComment: return i.advanceIfChars([
				Ke,
				Ke,
				ke
			]) ? (s = B.WithinContent, g(k, U.EndCommentTag)) : (i.advanceUntilChars([
				Ke,
				Ke,
				ke
			]), g(k, U.Comment));
			case B.WithinDoctype: return i.advanceIfChar(ke) ? (s = B.WithinContent, g(k, U.EndDoctypeTag)) : (i.advanceUntilChar(ke), g(k, U.Doctype));
			case B.WithinContent:
				if (i.advanceIfChar(Et)) {
					if (!i.eos() && i.peekChar() === ba) {
						if (i.advanceIfChars([
							ba,
							Ke,
							Ke
						])) return s = B.WithinComment, g(k, U.StartCommentTag);
						if (i.advanceIfRegExp(/^!doctype/i)) return s = B.WithinDoctype, g(k, U.StartDoctypeTag);
					}
					return i.advanceIfChar(xn) ? (s = B.AfterOpeningEndTag, g(k, U.EndTagOpen)) : (s = B.AfterOpeningStartTag, g(k, U.StartTagOpen));
				}
				return i.advanceUntilChar(Et), g(k, U.Content);
			case B.AfterOpeningEndTag: return p().length > 0 ? (s = B.WithinEndTag, g(k, U.EndTag)) : i.skipWhitespace() ? g(k, U.Whitespace, ye("Tag name must directly follow the open bracket.")) : (s = B.WithinEndTag, i.advanceUntilChar(ke), k < i.pos() ? g(k, U.Unknown, ye("End tag name expected.")) : T());
			case B.WithinEndTag:
				if (i.skipWhitespace()) return g(k, U.Whitespace);
				if (i.advanceIfChar(ke)) return s = B.WithinContent, g(k, U.EndTagClose);
				if (r && i.peekChar() === Et) return s = B.WithinContent, g(k, U.EndTagClose, ye("Closing bracket missing."));
				E = ye("Closing bracket expected.");
				break;
			case B.AfterOpeningStartTag: return u = p(), m = void 0, d = void 0, u.length > 0 ? (c = !1, s = B.WithinTag, g(k, U.StartTag)) : i.skipWhitespace() ? g(k, U.Whitespace, ye("Tag name must directly follow the open bracket.")) : (s = B.WithinTag, i.advanceUntilChar(ke), k < i.pos() ? g(k, U.Unknown, ye("Start tag name expected.")) : T());
			case B.WithinTag: return i.skipWhitespace() ? (c = !0, g(k, U.Whitespace)) : c && (d = b(), d.length > 0) ? (s = B.AfterAttributeName, c = !1, g(k, U.AttributeName)) : i.advanceIfChars([xn, ke]) ? (s = B.WithinContent, g(k, U.StartTagSelfClose)) : i.advanceIfChar(ke) ? (u === "script" ? m && jh[m] ? s = B.WithinContent : s = B.WithinScriptContent : u === "style" ? s = B.WithinStyleContent : s = B.WithinContent, g(k, U.StartTagClose)) : r && i.peekChar() === Et ? (s = B.WithinContent, g(k, U.StartTagClose, ye("Closing bracket missing."))) : (i.advance(1), g(k, U.Unknown, ye("Unexpected character in tag.")));
			case B.AfterAttributeName: return i.skipWhitespace() ? (c = !0, g(k, U.Whitespace)) : i.advanceIfChar(Dh) ? (s = B.BeforeAttributeValue, g(k, U.DelimiterAssign)) : (s = B.WithinTag, T());
			case B.BeforeAttributeValue:
				if (i.skipWhitespace()) return g(k, U.Whitespace);
				let I = i.advanceIfRegExp(/^[^\s"'`=<>]+/);
				if (I.length > 0 && (i.peekChar() === ke && i.peekChar(-1) === xn && (i.goBack(1), I = I.substring(0, I.length - 1)), d === "type" && (m = I), I.length > 0)) return s = B.WithinTag, c = !1, g(k, U.AttributeValue);
				const D = i.peekChar();
				return D === Ph || D === Wh ? (i.advance(1), i.advanceUntilChar(D) && i.advance(1), d === "type" && (m = i.getSource().substring(k + 1, i.pos() - 1)), s = B.WithinTag, c = !1, g(k, U.AttributeValue)) : (s = B.WithinTag, c = !1, T());
			case B.WithinScriptContent:
				let w = 1;
				for (; !i.eos();) {
					const f = i.advanceIfRegExp(/<!--|-->|<\/?script\s*\/?>?/i);
					if (f.length === 0) return i.goToEnd(), g(k, U.Script);
					if (f === "<!--") w === 1 && (w = 2);
					else if (f === "-->") w = 1;
					else if (f[1] !== "/") w === 2 && (w = 3);
					else if (w === 3) w = 2;
					else {
						i.goBack(f.length);
						break;
					}
				}
				return s = B.WithinContent, k < i.pos() ? g(k, U.Script) : T();
			case B.WithinStyleContent: return i.advanceUntilRegExp(/<\/style/i), s = B.WithinContent, k < i.pos() ? g(k, U.Styles) : T();
		}
		return i.advance(1), s = B.WithinContent, g(k, U.Unknown, E);
	}
	return {
		scan: v,
		getTokenType: () => o,
		getTokenOffset: () => a,
		getTokenLength: () => i.pos() - a,
		getTokenEnd: () => i.pos(),
		getTokenText: () => i.getSource().substring(a, i.pos()),
		getScannerState: () => s,
		getTokenError: () => l
	};
}
function wa(e, t) {
	let n = 0, r = e.length;
	if (r === 0) return 0;
	for (; n < r;) {
		let i = Math.floor((n + r) / 2);
		t(e[i]) ? r = i : n = i + 1;
	}
	return n;
}
function $h(e, t, n) {
	let r = 0, i = e.length - 1;
	for (; r <= i;) {
		const s = (r + i) / 2 | 0, a = n(e[s], t);
		if (a < 0) r = s + 1;
		else if (a > 0) i = s - 1;
		else return s;
	}
	return -(r + 1);
}
var _a = class {
	get attributeNames() {
		return this.attributes ? Object.keys(this.attributes) : [];
	}
	constructor(e, t, n, r) {
		this.start = e, this.end = t, this.children = n, this.parent = r, this.closed = !1;
	}
	isSameTag(e) {
		return this.tag === void 0 ? e === void 0 : e !== void 0 && this.tag.length === e.length && this.tag.toLowerCase() === e;
	}
	get firstChild() {
		return this.children[0];
	}
	get lastChild() {
		return this.children.length ? this.children[this.children.length - 1] : void 0;
	}
	findNodeBefore(e) {
		const t = wa(this.children, (n) => e <= n.start) - 1;
		if (t >= 0) {
			const n = this.children[t];
			if (e > n.start) {
				if (e < n.end) return n.findNodeBefore(e);
				const r = n.lastChild;
				return r && r.end === n.end ? n.findNodeBefore(e) : n;
			}
		}
		return this;
	}
	findNodeAt(e) {
		const t = wa(this.children, (n) => e <= n.start) - 1;
		if (t >= 0) {
			const n = this.children[t];
			if (e > n.start && e <= n.end) return n.findNodeAt(e);
		}
		return this;
	}
}, Gh = class {
	constructor(e) {
		this.dataManager = e;
	}
	parseDocument(e) {
		return this.parse(e.getText(), this.dataManager.getVoidElements(e.languageId));
	}
	parse(e, t) {
		const n = ge(e, void 0, void 0, !0), r = new _a(0, e.length, [], void 0);
		let i = r, s = -1, a, o = null, l = n.scan();
		for (; l !== U.EOS;) {
			switch (l) {
				case U.StartTagOpen:
					const c = new _a(n.getTokenOffset(), e.length, [], i);
					i.children.push(c), i = c;
					break;
				case U.StartTag:
					i.tag = n.getTokenText();
					break;
				case U.StartTagClose:
					i.parent && (i.end = n.getTokenEnd(), n.getTokenLength() ? (i.startTagEnd = n.getTokenEnd(), i.tag && this.dataManager.isVoidElement(i.tag, t) && (i.closed = !0, i = i.parent)) : i = i.parent);
					break;
				case U.StartTagSelfClose:
					i.parent && (i.closed = !0, i.end = n.getTokenEnd(), i.startTagEnd = n.getTokenEnd(), i = i.parent);
					break;
				case U.EndTagOpen:
					s = n.getTokenOffset(), a = void 0;
					break;
				case U.EndTag:
					a = n.getTokenText().toLowerCase();
					break;
				case U.EndTagClose:
					let u = i;
					for (; !u.isSameTag(a) && u.parent;) u = u.parent;
					if (u.parent) {
						for (; i !== u;) i.end = s, i.closed = !1, i = i.parent;
						i.closed = !0, i.endTagStart = s, i.end = n.getTokenEnd(), i = i.parent;
					}
					break;
				case U.AttributeName: {
					o = n.getTokenText();
					let d = i.attributes;
					d || (i.attributes = d = {}), d[o] = null;
					break;
				}
				case U.AttributeValue: {
					const d = n.getTokenText(), m = i.attributes;
					m && o && (m[o] = d, o = null);
					break;
				}
			}
			l = n.scan();
		}
		for (; i.parent;) i.end = e.length, i.closed = !1, i = i.parent;
		return {
			roots: r.children,
			findNodeBefore: r.findNodeBefore.bind(r),
			findNodeAt: r.findNodeAt.bind(r)
		};
	}
};
const yt = {
	"Aacute;": "Á",
	Aacute: "Á",
	"aacute;": "á",
	aacute: "á",
	"Abreve;": "Ă",
	"abreve;": "ă",
	"ac;": "∾",
	"acd;": "∿",
	"acE;": "∾̳",
	"Acirc;": "Â",
	Acirc: "Â",
	"acirc;": "â",
	acirc: "â",
	"acute;": "´",
	acute: "´",
	"Acy;": "А",
	"acy;": "а",
	"AElig;": "Æ",
	AElig: "Æ",
	"aelig;": "æ",
	aelig: "æ",
	"af;": "⁡",
	"Afr;": "𝔄",
	"afr;": "𝔞",
	"Agrave;": "À",
	Agrave: "À",
	"agrave;": "à",
	agrave: "à",
	"alefsym;": "ℵ",
	"aleph;": "ℵ",
	"Alpha;": "Α",
	"alpha;": "α",
	"Amacr;": "Ā",
	"amacr;": "ā",
	"amalg;": "⨿",
	"AMP;": "&",
	AMP: "&",
	"amp;": "&",
	amp: "&",
	"And;": "⩓",
	"and;": "∧",
	"andand;": "⩕",
	"andd;": "⩜",
	"andslope;": "⩘",
	"andv;": "⩚",
	"ang;": "∠",
	"ange;": "⦤",
	"angle;": "∠",
	"angmsd;": "∡",
	"angmsdaa;": "⦨",
	"angmsdab;": "⦩",
	"angmsdac;": "⦪",
	"angmsdad;": "⦫",
	"angmsdae;": "⦬",
	"angmsdaf;": "⦭",
	"angmsdag;": "⦮",
	"angmsdah;": "⦯",
	"angrt;": "∟",
	"angrtvb;": "⊾",
	"angrtvbd;": "⦝",
	"angsph;": "∢",
	"angst;": "Å",
	"angzarr;": "⍼",
	"Aogon;": "Ą",
	"aogon;": "ą",
	"Aopf;": "𝔸",
	"aopf;": "𝕒",
	"ap;": "≈",
	"apacir;": "⩯",
	"apE;": "⩰",
	"ape;": "≊",
	"apid;": "≋",
	"apos;": "'",
	"ApplyFunction;": "⁡",
	"approx;": "≈",
	"approxeq;": "≊",
	"Aring;": "Å",
	Aring: "Å",
	"aring;": "å",
	aring: "å",
	"Ascr;": "𝒜",
	"ascr;": "𝒶",
	"Assign;": "≔",
	"ast;": "*",
	"asymp;": "≈",
	"asympeq;": "≍",
	"Atilde;": "Ã",
	Atilde: "Ã",
	"atilde;": "ã",
	atilde: "ã",
	"Auml;": "Ä",
	Auml: "Ä",
	"auml;": "ä",
	auml: "ä",
	"awconint;": "∳",
	"awint;": "⨑",
	"backcong;": "≌",
	"backepsilon;": "϶",
	"backprime;": "‵",
	"backsim;": "∽",
	"backsimeq;": "⋍",
	"Backslash;": "∖",
	"Barv;": "⫧",
	"barvee;": "⊽",
	"Barwed;": "⌆",
	"barwed;": "⌅",
	"barwedge;": "⌅",
	"bbrk;": "⎵",
	"bbrktbrk;": "⎶",
	"bcong;": "≌",
	"Bcy;": "Б",
	"bcy;": "б",
	"bdquo;": "„",
	"becaus;": "∵",
	"Because;": "∵",
	"because;": "∵",
	"bemptyv;": "⦰",
	"bepsi;": "϶",
	"bernou;": "ℬ",
	"Bernoullis;": "ℬ",
	"Beta;": "Β",
	"beta;": "β",
	"beth;": "ℶ",
	"between;": "≬",
	"Bfr;": "𝔅",
	"bfr;": "𝔟",
	"bigcap;": "⋂",
	"bigcirc;": "◯",
	"bigcup;": "⋃",
	"bigodot;": "⨀",
	"bigoplus;": "⨁",
	"bigotimes;": "⨂",
	"bigsqcup;": "⨆",
	"bigstar;": "★",
	"bigtriangledown;": "▽",
	"bigtriangleup;": "△",
	"biguplus;": "⨄",
	"bigvee;": "⋁",
	"bigwedge;": "⋀",
	"bkarow;": "⤍",
	"blacklozenge;": "⧫",
	"blacksquare;": "▪",
	"blacktriangle;": "▴",
	"blacktriangledown;": "▾",
	"blacktriangleleft;": "◂",
	"blacktriangleright;": "▸",
	"blank;": "␣",
	"blk12;": "▒",
	"blk14;": "░",
	"blk34;": "▓",
	"block;": "█",
	"bne;": "=⃥",
	"bnequiv;": "≡⃥",
	"bNot;": "⫭",
	"bnot;": "⌐",
	"Bopf;": "𝔹",
	"bopf;": "𝕓",
	"bot;": "⊥",
	"bottom;": "⊥",
	"bowtie;": "⋈",
	"boxbox;": "⧉",
	"boxDL;": "╗",
	"boxDl;": "╖",
	"boxdL;": "╕",
	"boxdl;": "┐",
	"boxDR;": "╔",
	"boxDr;": "╓",
	"boxdR;": "╒",
	"boxdr;": "┌",
	"boxH;": "═",
	"boxh;": "─",
	"boxHD;": "╦",
	"boxHd;": "╤",
	"boxhD;": "╥",
	"boxhd;": "┬",
	"boxHU;": "╩",
	"boxHu;": "╧",
	"boxhU;": "╨",
	"boxhu;": "┴",
	"boxminus;": "⊟",
	"boxplus;": "⊞",
	"boxtimes;": "⊠",
	"boxUL;": "╝",
	"boxUl;": "╜",
	"boxuL;": "╛",
	"boxul;": "┘",
	"boxUR;": "╚",
	"boxUr;": "╙",
	"boxuR;": "╘",
	"boxur;": "└",
	"boxV;": "║",
	"boxv;": "│",
	"boxVH;": "╬",
	"boxVh;": "╫",
	"boxvH;": "╪",
	"boxvh;": "┼",
	"boxVL;": "╣",
	"boxVl;": "╢",
	"boxvL;": "╡",
	"boxvl;": "┤",
	"boxVR;": "╠",
	"boxVr;": "╟",
	"boxvR;": "╞",
	"boxvr;": "├",
	"bprime;": "‵",
	"Breve;": "˘",
	"breve;": "˘",
	"brvbar;": "¦",
	brvbar: "¦",
	"Bscr;": "ℬ",
	"bscr;": "𝒷",
	"bsemi;": "⁏",
	"bsim;": "∽",
	"bsime;": "⋍",
	"bsol;": "\\",
	"bsolb;": "⧅",
	"bsolhsub;": "⟈",
	"bull;": "•",
	"bullet;": "•",
	"bump;": "≎",
	"bumpE;": "⪮",
	"bumpe;": "≏",
	"Bumpeq;": "≎",
	"bumpeq;": "≏",
	"Cacute;": "Ć",
	"cacute;": "ć",
	"Cap;": "⋒",
	"cap;": "∩",
	"capand;": "⩄",
	"capbrcup;": "⩉",
	"capcap;": "⩋",
	"capcup;": "⩇",
	"capdot;": "⩀",
	"CapitalDifferentialD;": "ⅅ",
	"caps;": "∩︀",
	"caret;": "⁁",
	"caron;": "ˇ",
	"Cayleys;": "ℭ",
	"ccaps;": "⩍",
	"Ccaron;": "Č",
	"ccaron;": "č",
	"Ccedil;": "Ç",
	Ccedil: "Ç",
	"ccedil;": "ç",
	ccedil: "ç",
	"Ccirc;": "Ĉ",
	"ccirc;": "ĉ",
	"Cconint;": "∰",
	"ccups;": "⩌",
	"ccupssm;": "⩐",
	"Cdot;": "Ċ",
	"cdot;": "ċ",
	"cedil;": "¸",
	cedil: "¸",
	"Cedilla;": "¸",
	"cemptyv;": "⦲",
	"cent;": "¢",
	cent: "¢",
	"CenterDot;": "·",
	"centerdot;": "·",
	"Cfr;": "ℭ",
	"cfr;": "𝔠",
	"CHcy;": "Ч",
	"chcy;": "ч",
	"check;": "✓",
	"checkmark;": "✓",
	"Chi;": "Χ",
	"chi;": "χ",
	"cir;": "○",
	"circ;": "ˆ",
	"circeq;": "≗",
	"circlearrowleft;": "↺",
	"circlearrowright;": "↻",
	"circledast;": "⊛",
	"circledcirc;": "⊚",
	"circleddash;": "⊝",
	"CircleDot;": "⊙",
	"circledR;": "®",
	"circledS;": "Ⓢ",
	"CircleMinus;": "⊖",
	"CirclePlus;": "⊕",
	"CircleTimes;": "⊗",
	"cirE;": "⧃",
	"cire;": "≗",
	"cirfnint;": "⨐",
	"cirmid;": "⫯",
	"cirscir;": "⧂",
	"ClockwiseContourIntegral;": "∲",
	"CloseCurlyDoubleQuote;": "”",
	"CloseCurlyQuote;": "’",
	"clubs;": "♣",
	"clubsuit;": "♣",
	"Colon;": "∷",
	"colon;": ":",
	"Colone;": "⩴",
	"colone;": "≔",
	"coloneq;": "≔",
	"comma;": ",",
	"commat;": "@",
	"comp;": "∁",
	"compfn;": "∘",
	"complement;": "∁",
	"complexes;": "ℂ",
	"cong;": "≅",
	"congdot;": "⩭",
	"Congruent;": "≡",
	"Conint;": "∯",
	"conint;": "∮",
	"ContourIntegral;": "∮",
	"Copf;": "ℂ",
	"copf;": "𝕔",
	"coprod;": "∐",
	"Coproduct;": "∐",
	"COPY;": "©",
	COPY: "©",
	"copy;": "©",
	copy: "©",
	"copysr;": "℗",
	"CounterClockwiseContourIntegral;": "∳",
	"crarr;": "↵",
	"Cross;": "⨯",
	"cross;": "✗",
	"Cscr;": "𝒞",
	"cscr;": "𝒸",
	"csub;": "⫏",
	"csube;": "⫑",
	"csup;": "⫐",
	"csupe;": "⫒",
	"ctdot;": "⋯",
	"cudarrl;": "⤸",
	"cudarrr;": "⤵",
	"cuepr;": "⋞",
	"cuesc;": "⋟",
	"cularr;": "↶",
	"cularrp;": "⤽",
	"Cup;": "⋓",
	"cup;": "∪",
	"cupbrcap;": "⩈",
	"CupCap;": "≍",
	"cupcap;": "⩆",
	"cupcup;": "⩊",
	"cupdot;": "⊍",
	"cupor;": "⩅",
	"cups;": "∪︀",
	"curarr;": "↷",
	"curarrm;": "⤼",
	"curlyeqprec;": "⋞",
	"curlyeqsucc;": "⋟",
	"curlyvee;": "⋎",
	"curlywedge;": "⋏",
	"curren;": "¤",
	curren: "¤",
	"curvearrowleft;": "↶",
	"curvearrowright;": "↷",
	"cuvee;": "⋎",
	"cuwed;": "⋏",
	"cwconint;": "∲",
	"cwint;": "∱",
	"cylcty;": "⌭",
	"Dagger;": "‡",
	"dagger;": "†",
	"daleth;": "ℸ",
	"Darr;": "↡",
	"dArr;": "⇓",
	"darr;": "↓",
	"dash;": "‐",
	"Dashv;": "⫤",
	"dashv;": "⊣",
	"dbkarow;": "⤏",
	"dblac;": "˝",
	"Dcaron;": "Ď",
	"dcaron;": "ď",
	"Dcy;": "Д",
	"dcy;": "д",
	"DD;": "ⅅ",
	"dd;": "ⅆ",
	"ddagger;": "‡",
	"ddarr;": "⇊",
	"DDotrahd;": "⤑",
	"ddotseq;": "⩷",
	"deg;": "°",
	deg: "°",
	"Del;": "∇",
	"Delta;": "Δ",
	"delta;": "δ",
	"demptyv;": "⦱",
	"dfisht;": "⥿",
	"Dfr;": "𝔇",
	"dfr;": "𝔡",
	"dHar;": "⥥",
	"dharl;": "⇃",
	"dharr;": "⇂",
	"DiacriticalAcute;": "´",
	"DiacriticalDot;": "˙",
	"DiacriticalDoubleAcute;": "˝",
	"DiacriticalGrave;": "`",
	"DiacriticalTilde;": "˜",
	"diam;": "⋄",
	"Diamond;": "⋄",
	"diamond;": "⋄",
	"diamondsuit;": "♦",
	"diams;": "♦",
	"die;": "¨",
	"DifferentialD;": "ⅆ",
	"digamma;": "ϝ",
	"disin;": "⋲",
	"div;": "÷",
	"divide;": "÷",
	divide: "÷",
	"divideontimes;": "⋇",
	"divonx;": "⋇",
	"DJcy;": "Ђ",
	"djcy;": "ђ",
	"dlcorn;": "⌞",
	"dlcrop;": "⌍",
	"dollar;": "$",
	"Dopf;": "𝔻",
	"dopf;": "𝕕",
	"Dot;": "¨",
	"dot;": "˙",
	"DotDot;": "⃜",
	"doteq;": "≐",
	"doteqdot;": "≑",
	"DotEqual;": "≐",
	"dotminus;": "∸",
	"dotplus;": "∔",
	"dotsquare;": "⊡",
	"doublebarwedge;": "⌆",
	"DoubleContourIntegral;": "∯",
	"DoubleDot;": "¨",
	"DoubleDownArrow;": "⇓",
	"DoubleLeftArrow;": "⇐",
	"DoubleLeftRightArrow;": "⇔",
	"DoubleLeftTee;": "⫤",
	"DoubleLongLeftArrow;": "⟸",
	"DoubleLongLeftRightArrow;": "⟺",
	"DoubleLongRightArrow;": "⟹",
	"DoubleRightArrow;": "⇒",
	"DoubleRightTee;": "⊨",
	"DoubleUpArrow;": "⇑",
	"DoubleUpDownArrow;": "⇕",
	"DoubleVerticalBar;": "∥",
	"DownArrow;": "↓",
	"Downarrow;": "⇓",
	"downarrow;": "↓",
	"DownArrowBar;": "⤓",
	"DownArrowUpArrow;": "⇵",
	"DownBreve;": "̑",
	"downdownarrows;": "⇊",
	"downharpoonleft;": "⇃",
	"downharpoonright;": "⇂",
	"DownLeftRightVector;": "⥐",
	"DownLeftTeeVector;": "⥞",
	"DownLeftVector;": "↽",
	"DownLeftVectorBar;": "⥖",
	"DownRightTeeVector;": "⥟",
	"DownRightVector;": "⇁",
	"DownRightVectorBar;": "⥗",
	"DownTee;": "⊤",
	"DownTeeArrow;": "↧",
	"drbkarow;": "⤐",
	"drcorn;": "⌟",
	"drcrop;": "⌌",
	"Dscr;": "𝒟",
	"dscr;": "𝒹",
	"DScy;": "Ѕ",
	"dscy;": "ѕ",
	"dsol;": "⧶",
	"Dstrok;": "Đ",
	"dstrok;": "đ",
	"dtdot;": "⋱",
	"dtri;": "▿",
	"dtrif;": "▾",
	"duarr;": "⇵",
	"duhar;": "⥯",
	"dwangle;": "⦦",
	"DZcy;": "Џ",
	"dzcy;": "џ",
	"dzigrarr;": "⟿",
	"Eacute;": "É",
	Eacute: "É",
	"eacute;": "é",
	eacute: "é",
	"easter;": "⩮",
	"Ecaron;": "Ě",
	"ecaron;": "ě",
	"ecir;": "≖",
	"Ecirc;": "Ê",
	Ecirc: "Ê",
	"ecirc;": "ê",
	ecirc: "ê",
	"ecolon;": "≕",
	"Ecy;": "Э",
	"ecy;": "э",
	"eDDot;": "⩷",
	"Edot;": "Ė",
	"eDot;": "≑",
	"edot;": "ė",
	"ee;": "ⅇ",
	"efDot;": "≒",
	"Efr;": "𝔈",
	"efr;": "𝔢",
	"eg;": "⪚",
	"Egrave;": "È",
	Egrave: "È",
	"egrave;": "è",
	egrave: "è",
	"egs;": "⪖",
	"egsdot;": "⪘",
	"el;": "⪙",
	"Element;": "∈",
	"elinters;": "⏧",
	"ell;": "ℓ",
	"els;": "⪕",
	"elsdot;": "⪗",
	"Emacr;": "Ē",
	"emacr;": "ē",
	"empty;": "∅",
	"emptyset;": "∅",
	"EmptySmallSquare;": "◻",
	"emptyv;": "∅",
	"EmptyVerySmallSquare;": "▫",
	"emsp;": " ",
	"emsp13;": " ",
	"emsp14;": " ",
	"ENG;": "Ŋ",
	"eng;": "ŋ",
	"ensp;": " ",
	"Eogon;": "Ę",
	"eogon;": "ę",
	"Eopf;": "𝔼",
	"eopf;": "𝕖",
	"epar;": "⋕",
	"eparsl;": "⧣",
	"eplus;": "⩱",
	"epsi;": "ε",
	"Epsilon;": "Ε",
	"epsilon;": "ε",
	"epsiv;": "ϵ",
	"eqcirc;": "≖",
	"eqcolon;": "≕",
	"eqsim;": "≂",
	"eqslantgtr;": "⪖",
	"eqslantless;": "⪕",
	"Equal;": "⩵",
	"equals;": "=",
	"EqualTilde;": "≂",
	"equest;": "≟",
	"Equilibrium;": "⇌",
	"equiv;": "≡",
	"equivDD;": "⩸",
	"eqvparsl;": "⧥",
	"erarr;": "⥱",
	"erDot;": "≓",
	"Escr;": "ℰ",
	"escr;": "ℯ",
	"esdot;": "≐",
	"Esim;": "⩳",
	"esim;": "≂",
	"Eta;": "Η",
	"eta;": "η",
	"ETH;": "Ð",
	ETH: "Ð",
	"eth;": "ð",
	eth: "ð",
	"Euml;": "Ë",
	Euml: "Ë",
	"euml;": "ë",
	euml: "ë",
	"euro;": "€",
	"excl;": "!",
	"exist;": "∃",
	"Exists;": "∃",
	"expectation;": "ℰ",
	"ExponentialE;": "ⅇ",
	"exponentiale;": "ⅇ",
	"fallingdotseq;": "≒",
	"Fcy;": "Ф",
	"fcy;": "ф",
	"female;": "♀",
	"ffilig;": "ﬃ",
	"fflig;": "ﬀ",
	"ffllig;": "ﬄ",
	"Ffr;": "𝔉",
	"ffr;": "𝔣",
	"filig;": "ﬁ",
	"FilledSmallSquare;": "◼",
	"FilledVerySmallSquare;": "▪",
	"fjlig;": "fj",
	"flat;": "♭",
	"fllig;": "ﬂ",
	"fltns;": "▱",
	"fnof;": "ƒ",
	"Fopf;": "𝔽",
	"fopf;": "𝕗",
	"ForAll;": "∀",
	"forall;": "∀",
	"fork;": "⋔",
	"forkv;": "⫙",
	"Fouriertrf;": "ℱ",
	"fpartint;": "⨍",
	"frac12;": "½",
	frac12: "½",
	"frac13;": "⅓",
	"frac14;": "¼",
	frac14: "¼",
	"frac15;": "⅕",
	"frac16;": "⅙",
	"frac18;": "⅛",
	"frac23;": "⅔",
	"frac25;": "⅖",
	"frac34;": "¾",
	frac34: "¾",
	"frac35;": "⅗",
	"frac38;": "⅜",
	"frac45;": "⅘",
	"frac56;": "⅚",
	"frac58;": "⅝",
	"frac78;": "⅞",
	"frasl;": "⁄",
	"frown;": "⌢",
	"Fscr;": "ℱ",
	"fscr;": "𝒻",
	"gacute;": "ǵ",
	"Gamma;": "Γ",
	"gamma;": "γ",
	"Gammad;": "Ϝ",
	"gammad;": "ϝ",
	"gap;": "⪆",
	"Gbreve;": "Ğ",
	"gbreve;": "ğ",
	"Gcedil;": "Ģ",
	"Gcirc;": "Ĝ",
	"gcirc;": "ĝ",
	"Gcy;": "Г",
	"gcy;": "г",
	"Gdot;": "Ġ",
	"gdot;": "ġ",
	"gE;": "≧",
	"ge;": "≥",
	"gEl;": "⪌",
	"gel;": "⋛",
	"geq;": "≥",
	"geqq;": "≧",
	"geqslant;": "⩾",
	"ges;": "⩾",
	"gescc;": "⪩",
	"gesdot;": "⪀",
	"gesdoto;": "⪂",
	"gesdotol;": "⪄",
	"gesl;": "⋛︀",
	"gesles;": "⪔",
	"Gfr;": "𝔊",
	"gfr;": "𝔤",
	"Gg;": "⋙",
	"gg;": "≫",
	"ggg;": "⋙",
	"gimel;": "ℷ",
	"GJcy;": "Ѓ",
	"gjcy;": "ѓ",
	"gl;": "≷",
	"gla;": "⪥",
	"glE;": "⪒",
	"glj;": "⪤",
	"gnap;": "⪊",
	"gnapprox;": "⪊",
	"gnE;": "≩",
	"gne;": "⪈",
	"gneq;": "⪈",
	"gneqq;": "≩",
	"gnsim;": "⋧",
	"Gopf;": "𝔾",
	"gopf;": "𝕘",
	"grave;": "`",
	"GreaterEqual;": "≥",
	"GreaterEqualLess;": "⋛",
	"GreaterFullEqual;": "≧",
	"GreaterGreater;": "⪢",
	"GreaterLess;": "≷",
	"GreaterSlantEqual;": "⩾",
	"GreaterTilde;": "≳",
	"Gscr;": "𝒢",
	"gscr;": "ℊ",
	"gsim;": "≳",
	"gsime;": "⪎",
	"gsiml;": "⪐",
	"GT;": ">",
	GT: ">",
	"Gt;": "≫",
	"gt;": ">",
	gt: ">",
	"gtcc;": "⪧",
	"gtcir;": "⩺",
	"gtdot;": "⋗",
	"gtlPar;": "⦕",
	"gtquest;": "⩼",
	"gtrapprox;": "⪆",
	"gtrarr;": "⥸",
	"gtrdot;": "⋗",
	"gtreqless;": "⋛",
	"gtreqqless;": "⪌",
	"gtrless;": "≷",
	"gtrsim;": "≳",
	"gvertneqq;": "≩︀",
	"gvnE;": "≩︀",
	"Hacek;": "ˇ",
	"hairsp;": " ",
	"half;": "½",
	"hamilt;": "ℋ",
	"HARDcy;": "Ъ",
	"hardcy;": "ъ",
	"hArr;": "⇔",
	"harr;": "↔",
	"harrcir;": "⥈",
	"harrw;": "↭",
	"Hat;": "^",
	"hbar;": "ℏ",
	"Hcirc;": "Ĥ",
	"hcirc;": "ĥ",
	"hearts;": "♥",
	"heartsuit;": "♥",
	"hellip;": "…",
	"hercon;": "⊹",
	"Hfr;": "ℌ",
	"hfr;": "𝔥",
	"HilbertSpace;": "ℋ",
	"hksearow;": "⤥",
	"hkswarow;": "⤦",
	"hoarr;": "⇿",
	"homtht;": "∻",
	"hookleftarrow;": "↩",
	"hookrightarrow;": "↪",
	"Hopf;": "ℍ",
	"hopf;": "𝕙",
	"horbar;": "―",
	"HorizontalLine;": "─",
	"Hscr;": "ℋ",
	"hscr;": "𝒽",
	"hslash;": "ℏ",
	"Hstrok;": "Ħ",
	"hstrok;": "ħ",
	"HumpDownHump;": "≎",
	"HumpEqual;": "≏",
	"hybull;": "⁃",
	"hyphen;": "‐",
	"Iacute;": "Í",
	Iacute: "Í",
	"iacute;": "í",
	iacute: "í",
	"ic;": "⁣",
	"Icirc;": "Î",
	Icirc: "Î",
	"icirc;": "î",
	icirc: "î",
	"Icy;": "И",
	"icy;": "и",
	"Idot;": "İ",
	"IEcy;": "Е",
	"iecy;": "е",
	"iexcl;": "¡",
	iexcl: "¡",
	"iff;": "⇔",
	"Ifr;": "ℑ",
	"ifr;": "𝔦",
	"Igrave;": "Ì",
	Igrave: "Ì",
	"igrave;": "ì",
	igrave: "ì",
	"ii;": "ⅈ",
	"iiiint;": "⨌",
	"iiint;": "∭",
	"iinfin;": "⧜",
	"iiota;": "℩",
	"IJlig;": "Ĳ",
	"ijlig;": "ĳ",
	"Im;": "ℑ",
	"Imacr;": "Ī",
	"imacr;": "ī",
	"image;": "ℑ",
	"ImaginaryI;": "ⅈ",
	"imagline;": "ℐ",
	"imagpart;": "ℑ",
	"imath;": "ı",
	"imof;": "⊷",
	"imped;": "Ƶ",
	"Implies;": "⇒",
	"in;": "∈",
	"incare;": "℅",
	"infin;": "∞",
	"infintie;": "⧝",
	"inodot;": "ı",
	"Int;": "∬",
	"int;": "∫",
	"intcal;": "⊺",
	"integers;": "ℤ",
	"Integral;": "∫",
	"intercal;": "⊺",
	"Intersection;": "⋂",
	"intlarhk;": "⨗",
	"intprod;": "⨼",
	"InvisibleComma;": "⁣",
	"InvisibleTimes;": "⁢",
	"IOcy;": "Ё",
	"iocy;": "ё",
	"Iogon;": "Į",
	"iogon;": "į",
	"Iopf;": "𝕀",
	"iopf;": "𝕚",
	"Iota;": "Ι",
	"iota;": "ι",
	"iprod;": "⨼",
	"iquest;": "¿",
	iquest: "¿",
	"Iscr;": "ℐ",
	"iscr;": "𝒾",
	"isin;": "∈",
	"isindot;": "⋵",
	"isinE;": "⋹",
	"isins;": "⋴",
	"isinsv;": "⋳",
	"isinv;": "∈",
	"it;": "⁢",
	"Itilde;": "Ĩ",
	"itilde;": "ĩ",
	"Iukcy;": "І",
	"iukcy;": "і",
	"Iuml;": "Ï",
	Iuml: "Ï",
	"iuml;": "ï",
	iuml: "ï",
	"Jcirc;": "Ĵ",
	"jcirc;": "ĵ",
	"Jcy;": "Й",
	"jcy;": "й",
	"Jfr;": "𝔍",
	"jfr;": "𝔧",
	"jmath;": "ȷ",
	"Jopf;": "𝕁",
	"jopf;": "𝕛",
	"Jscr;": "𝒥",
	"jscr;": "𝒿",
	"Jsercy;": "Ј",
	"jsercy;": "ј",
	"Jukcy;": "Є",
	"jukcy;": "є",
	"Kappa;": "Κ",
	"kappa;": "κ",
	"kappav;": "ϰ",
	"Kcedil;": "Ķ",
	"kcedil;": "ķ",
	"Kcy;": "К",
	"kcy;": "к",
	"Kfr;": "𝔎",
	"kfr;": "𝔨",
	"kgreen;": "ĸ",
	"KHcy;": "Х",
	"khcy;": "х",
	"KJcy;": "Ќ",
	"kjcy;": "ќ",
	"Kopf;": "𝕂",
	"kopf;": "𝕜",
	"Kscr;": "𝒦",
	"kscr;": "𝓀",
	"lAarr;": "⇚",
	"Lacute;": "Ĺ",
	"lacute;": "ĺ",
	"laemptyv;": "⦴",
	"lagran;": "ℒ",
	"Lambda;": "Λ",
	"lambda;": "λ",
	"Lang;": "⟪",
	"lang;": "⟨",
	"langd;": "⦑",
	"langle;": "⟨",
	"lap;": "⪅",
	"Laplacetrf;": "ℒ",
	"laquo;": "«",
	laquo: "«",
	"Larr;": "↞",
	"lArr;": "⇐",
	"larr;": "←",
	"larrb;": "⇤",
	"larrbfs;": "⤟",
	"larrfs;": "⤝",
	"larrhk;": "↩",
	"larrlp;": "↫",
	"larrpl;": "⤹",
	"larrsim;": "⥳",
	"larrtl;": "↢",
	"lat;": "⪫",
	"lAtail;": "⤛",
	"latail;": "⤙",
	"late;": "⪭",
	"lates;": "⪭︀",
	"lBarr;": "⤎",
	"lbarr;": "⤌",
	"lbbrk;": "❲",
	"lbrace;": "{",
	"lbrack;": "[",
	"lbrke;": "⦋",
	"lbrksld;": "⦏",
	"lbrkslu;": "⦍",
	"Lcaron;": "Ľ",
	"lcaron;": "ľ",
	"Lcedil;": "Ļ",
	"lcedil;": "ļ",
	"lceil;": "⌈",
	"lcub;": "{",
	"Lcy;": "Л",
	"lcy;": "л",
	"ldca;": "⤶",
	"ldquo;": "“",
	"ldquor;": "„",
	"ldrdhar;": "⥧",
	"ldrushar;": "⥋",
	"ldsh;": "↲",
	"lE;": "≦",
	"le;": "≤",
	"LeftAngleBracket;": "⟨",
	"LeftArrow;": "←",
	"Leftarrow;": "⇐",
	"leftarrow;": "←",
	"LeftArrowBar;": "⇤",
	"LeftArrowRightArrow;": "⇆",
	"leftarrowtail;": "↢",
	"LeftCeiling;": "⌈",
	"LeftDoubleBracket;": "⟦",
	"LeftDownTeeVector;": "⥡",
	"LeftDownVector;": "⇃",
	"LeftDownVectorBar;": "⥙",
	"LeftFloor;": "⌊",
	"leftharpoondown;": "↽",
	"leftharpoonup;": "↼",
	"leftleftarrows;": "⇇",
	"LeftRightArrow;": "↔",
	"Leftrightarrow;": "⇔",
	"leftrightarrow;": "↔",
	"leftrightarrows;": "⇆",
	"leftrightharpoons;": "⇋",
	"leftrightsquigarrow;": "↭",
	"LeftRightVector;": "⥎",
	"LeftTee;": "⊣",
	"LeftTeeArrow;": "↤",
	"LeftTeeVector;": "⥚",
	"leftthreetimes;": "⋋",
	"LeftTriangle;": "⊲",
	"LeftTriangleBar;": "⧏",
	"LeftTriangleEqual;": "⊴",
	"LeftUpDownVector;": "⥑",
	"LeftUpTeeVector;": "⥠",
	"LeftUpVector;": "↿",
	"LeftUpVectorBar;": "⥘",
	"LeftVector;": "↼",
	"LeftVectorBar;": "⥒",
	"lEg;": "⪋",
	"leg;": "⋚",
	"leq;": "≤",
	"leqq;": "≦",
	"leqslant;": "⩽",
	"les;": "⩽",
	"lescc;": "⪨",
	"lesdot;": "⩿",
	"lesdoto;": "⪁",
	"lesdotor;": "⪃",
	"lesg;": "⋚︀",
	"lesges;": "⪓",
	"lessapprox;": "⪅",
	"lessdot;": "⋖",
	"lesseqgtr;": "⋚",
	"lesseqqgtr;": "⪋",
	"LessEqualGreater;": "⋚",
	"LessFullEqual;": "≦",
	"LessGreater;": "≶",
	"lessgtr;": "≶",
	"LessLess;": "⪡",
	"lesssim;": "≲",
	"LessSlantEqual;": "⩽",
	"LessTilde;": "≲",
	"lfisht;": "⥼",
	"lfloor;": "⌊",
	"Lfr;": "𝔏",
	"lfr;": "𝔩",
	"lg;": "≶",
	"lgE;": "⪑",
	"lHar;": "⥢",
	"lhard;": "↽",
	"lharu;": "↼",
	"lharul;": "⥪",
	"lhblk;": "▄",
	"LJcy;": "Љ",
	"ljcy;": "љ",
	"Ll;": "⋘",
	"ll;": "≪",
	"llarr;": "⇇",
	"llcorner;": "⌞",
	"Lleftarrow;": "⇚",
	"llhard;": "⥫",
	"lltri;": "◺",
	"Lmidot;": "Ŀ",
	"lmidot;": "ŀ",
	"lmoust;": "⎰",
	"lmoustache;": "⎰",
	"lnap;": "⪉",
	"lnapprox;": "⪉",
	"lnE;": "≨",
	"lne;": "⪇",
	"lneq;": "⪇",
	"lneqq;": "≨",
	"lnsim;": "⋦",
	"loang;": "⟬",
	"loarr;": "⇽",
	"lobrk;": "⟦",
	"LongLeftArrow;": "⟵",
	"Longleftarrow;": "⟸",
	"longleftarrow;": "⟵",
	"LongLeftRightArrow;": "⟷",
	"Longleftrightarrow;": "⟺",
	"longleftrightarrow;": "⟷",
	"longmapsto;": "⟼",
	"LongRightArrow;": "⟶",
	"Longrightarrow;": "⟹",
	"longrightarrow;": "⟶",
	"looparrowleft;": "↫",
	"looparrowright;": "↬",
	"lopar;": "⦅",
	"Lopf;": "𝕃",
	"lopf;": "𝕝",
	"loplus;": "⨭",
	"lotimes;": "⨴",
	"lowast;": "∗",
	"lowbar;": "_",
	"LowerLeftArrow;": "↙",
	"LowerRightArrow;": "↘",
	"loz;": "◊",
	"lozenge;": "◊",
	"lozf;": "⧫",
	"lpar;": "(",
	"lparlt;": "⦓",
	"lrarr;": "⇆",
	"lrcorner;": "⌟",
	"lrhar;": "⇋",
	"lrhard;": "⥭",
	"lrm;": "‎",
	"lrtri;": "⊿",
	"lsaquo;": "‹",
	"Lscr;": "ℒ",
	"lscr;": "𝓁",
	"Lsh;": "↰",
	"lsh;": "↰",
	"lsim;": "≲",
	"lsime;": "⪍",
	"lsimg;": "⪏",
	"lsqb;": "[",
	"lsquo;": "‘",
	"lsquor;": "‚",
	"Lstrok;": "Ł",
	"lstrok;": "ł",
	"LT;": "<",
	LT: "<",
	"Lt;": "≪",
	"lt;": "<",
	lt: "<",
	"ltcc;": "⪦",
	"ltcir;": "⩹",
	"ltdot;": "⋖",
	"lthree;": "⋋",
	"ltimes;": "⋉",
	"ltlarr;": "⥶",
	"ltquest;": "⩻",
	"ltri;": "◃",
	"ltrie;": "⊴",
	"ltrif;": "◂",
	"ltrPar;": "⦖",
	"lurdshar;": "⥊",
	"luruhar;": "⥦",
	"lvertneqq;": "≨︀",
	"lvnE;": "≨︀",
	"macr;": "¯",
	macr: "¯",
	"male;": "♂",
	"malt;": "✠",
	"maltese;": "✠",
	"Map;": "⤅",
	"map;": "↦",
	"mapsto;": "↦",
	"mapstodown;": "↧",
	"mapstoleft;": "↤",
	"mapstoup;": "↥",
	"marker;": "▮",
	"mcomma;": "⨩",
	"Mcy;": "М",
	"mcy;": "м",
	"mdash;": "—",
	"mDDot;": "∺",
	"measuredangle;": "∡",
	"MediumSpace;": " ",
	"Mellintrf;": "ℳ",
	"Mfr;": "𝔐",
	"mfr;": "𝔪",
	"mho;": "℧",
	"micro;": "µ",
	micro: "µ",
	"mid;": "∣",
	"midast;": "*",
	"midcir;": "⫰",
	"middot;": "·",
	middot: "·",
	"minus;": "−",
	"minusb;": "⊟",
	"minusd;": "∸",
	"minusdu;": "⨪",
	"MinusPlus;": "∓",
	"mlcp;": "⫛",
	"mldr;": "…",
	"mnplus;": "∓",
	"models;": "⊧",
	"Mopf;": "𝕄",
	"mopf;": "𝕞",
	"mp;": "∓",
	"Mscr;": "ℳ",
	"mscr;": "𝓂",
	"mstpos;": "∾",
	"Mu;": "Μ",
	"mu;": "μ",
	"multimap;": "⊸",
	"mumap;": "⊸",
	"nabla;": "∇",
	"Nacute;": "Ń",
	"nacute;": "ń",
	"nang;": "∠⃒",
	"nap;": "≉",
	"napE;": "⩰̸",
	"napid;": "≋̸",
	"napos;": "ŉ",
	"napprox;": "≉",
	"natur;": "♮",
	"natural;": "♮",
	"naturals;": "ℕ",
	"nbsp;": "\xA0",
	nbsp: "\xA0",
	"nbump;": "≎̸",
	"nbumpe;": "≏̸",
	"ncap;": "⩃",
	"Ncaron;": "Ň",
	"ncaron;": "ň",
	"Ncedil;": "Ņ",
	"ncedil;": "ņ",
	"ncong;": "≇",
	"ncongdot;": "⩭̸",
	"ncup;": "⩂",
	"Ncy;": "Н",
	"ncy;": "н",
	"ndash;": "–",
	"ne;": "≠",
	"nearhk;": "⤤",
	"neArr;": "⇗",
	"nearr;": "↗",
	"nearrow;": "↗",
	"nedot;": "≐̸",
	"NegativeMediumSpace;": "​",
	"NegativeThickSpace;": "​",
	"NegativeThinSpace;": "​",
	"NegativeVeryThinSpace;": "​",
	"nequiv;": "≢",
	"nesear;": "⤨",
	"nesim;": "≂̸",
	"NestedGreaterGreater;": "≫",
	"NestedLessLess;": "≪",
	"NewLine;": `
`,
	"nexist;": "∄",
	"nexists;": "∄",
	"Nfr;": "𝔑",
	"nfr;": "𝔫",
	"ngE;": "≧̸",
	"nge;": "≱",
	"ngeq;": "≱",
	"ngeqq;": "≧̸",
	"ngeqslant;": "⩾̸",
	"nges;": "⩾̸",
	"nGg;": "⋙̸",
	"ngsim;": "≵",
	"nGt;": "≫⃒",
	"ngt;": "≯",
	"ngtr;": "≯",
	"nGtv;": "≫̸",
	"nhArr;": "⇎",
	"nharr;": "↮",
	"nhpar;": "⫲",
	"ni;": "∋",
	"nis;": "⋼",
	"nisd;": "⋺",
	"niv;": "∋",
	"NJcy;": "Њ",
	"njcy;": "њ",
	"nlArr;": "⇍",
	"nlarr;": "↚",
	"nldr;": "‥",
	"nlE;": "≦̸",
	"nle;": "≰",
	"nLeftarrow;": "⇍",
	"nleftarrow;": "↚",
	"nLeftrightarrow;": "⇎",
	"nleftrightarrow;": "↮",
	"nleq;": "≰",
	"nleqq;": "≦̸",
	"nleqslant;": "⩽̸",
	"nles;": "⩽̸",
	"nless;": "≮",
	"nLl;": "⋘̸",
	"nlsim;": "≴",
	"nLt;": "≪⃒",
	"nlt;": "≮",
	"nltri;": "⋪",
	"nltrie;": "⋬",
	"nLtv;": "≪̸",
	"nmid;": "∤",
	"NoBreak;": "⁠",
	"NonBreakingSpace;": "\xA0",
	"Nopf;": "ℕ",
	"nopf;": "𝕟",
	"Not;": "⫬",
	"not;": "¬",
	not: "¬",
	"NotCongruent;": "≢",
	"NotCupCap;": "≭",
	"NotDoubleVerticalBar;": "∦",
	"NotElement;": "∉",
	"NotEqual;": "≠",
	"NotEqualTilde;": "≂̸",
	"NotExists;": "∄",
	"NotGreater;": "≯",
	"NotGreaterEqual;": "≱",
	"NotGreaterFullEqual;": "≧̸",
	"NotGreaterGreater;": "≫̸",
	"NotGreaterLess;": "≹",
	"NotGreaterSlantEqual;": "⩾̸",
	"NotGreaterTilde;": "≵",
	"NotHumpDownHump;": "≎̸",
	"NotHumpEqual;": "≏̸",
	"notin;": "∉",
	"notindot;": "⋵̸",
	"notinE;": "⋹̸",
	"notinva;": "∉",
	"notinvb;": "⋷",
	"notinvc;": "⋶",
	"NotLeftTriangle;": "⋪",
	"NotLeftTriangleBar;": "⧏̸",
	"NotLeftTriangleEqual;": "⋬",
	"NotLess;": "≮",
	"NotLessEqual;": "≰",
	"NotLessGreater;": "≸",
	"NotLessLess;": "≪̸",
	"NotLessSlantEqual;": "⩽̸",
	"NotLessTilde;": "≴",
	"NotNestedGreaterGreater;": "⪢̸",
	"NotNestedLessLess;": "⪡̸",
	"notni;": "∌",
	"notniva;": "∌",
	"notnivb;": "⋾",
	"notnivc;": "⋽",
	"NotPrecedes;": "⊀",
	"NotPrecedesEqual;": "⪯̸",
	"NotPrecedesSlantEqual;": "⋠",
	"NotReverseElement;": "∌",
	"NotRightTriangle;": "⋫",
	"NotRightTriangleBar;": "⧐̸",
	"NotRightTriangleEqual;": "⋭",
	"NotSquareSubset;": "⊏̸",
	"NotSquareSubsetEqual;": "⋢",
	"NotSquareSuperset;": "⊐̸",
	"NotSquareSupersetEqual;": "⋣",
	"NotSubset;": "⊂⃒",
	"NotSubsetEqual;": "⊈",
	"NotSucceeds;": "⊁",
	"NotSucceedsEqual;": "⪰̸",
	"NotSucceedsSlantEqual;": "⋡",
	"NotSucceedsTilde;": "≿̸",
	"NotSuperset;": "⊃⃒",
	"NotSupersetEqual;": "⊉",
	"NotTilde;": "≁",
	"NotTildeEqual;": "≄",
	"NotTildeFullEqual;": "≇",
	"NotTildeTilde;": "≉",
	"NotVerticalBar;": "∤",
	"npar;": "∦",
	"nparallel;": "∦",
	"nparsl;": "⫽⃥",
	"npart;": "∂̸",
	"npolint;": "⨔",
	"npr;": "⊀",
	"nprcue;": "⋠",
	"npre;": "⪯̸",
	"nprec;": "⊀",
	"npreceq;": "⪯̸",
	"nrArr;": "⇏",
	"nrarr;": "↛",
	"nrarrc;": "⤳̸",
	"nrarrw;": "↝̸",
	"nRightarrow;": "⇏",
	"nrightarrow;": "↛",
	"nrtri;": "⋫",
	"nrtrie;": "⋭",
	"nsc;": "⊁",
	"nsccue;": "⋡",
	"nsce;": "⪰̸",
	"Nscr;": "𝒩",
	"nscr;": "𝓃",
	"nshortmid;": "∤",
	"nshortparallel;": "∦",
	"nsim;": "≁",
	"nsime;": "≄",
	"nsimeq;": "≄",
	"nsmid;": "∤",
	"nspar;": "∦",
	"nsqsube;": "⋢",
	"nsqsupe;": "⋣",
	"nsub;": "⊄",
	"nsubE;": "⫅̸",
	"nsube;": "⊈",
	"nsubset;": "⊂⃒",
	"nsubseteq;": "⊈",
	"nsubseteqq;": "⫅̸",
	"nsucc;": "⊁",
	"nsucceq;": "⪰̸",
	"nsup;": "⊅",
	"nsupE;": "⫆̸",
	"nsupe;": "⊉",
	"nsupset;": "⊃⃒",
	"nsupseteq;": "⊉",
	"nsupseteqq;": "⫆̸",
	"ntgl;": "≹",
	"Ntilde;": "Ñ",
	Ntilde: "Ñ",
	"ntilde;": "ñ",
	ntilde: "ñ",
	"ntlg;": "≸",
	"ntriangleleft;": "⋪",
	"ntrianglelefteq;": "⋬",
	"ntriangleright;": "⋫",
	"ntrianglerighteq;": "⋭",
	"Nu;": "Ν",
	"nu;": "ν",
	"num;": "#",
	"numero;": "№",
	"numsp;": " ",
	"nvap;": "≍⃒",
	"nVDash;": "⊯",
	"nVdash;": "⊮",
	"nvDash;": "⊭",
	"nvdash;": "⊬",
	"nvge;": "≥⃒",
	"nvgt;": ">⃒",
	"nvHarr;": "⤄",
	"nvinfin;": "⧞",
	"nvlArr;": "⤂",
	"nvle;": "≤⃒",
	"nvlt;": "<⃒",
	"nvltrie;": "⊴⃒",
	"nvrArr;": "⤃",
	"nvrtrie;": "⊵⃒",
	"nvsim;": "∼⃒",
	"nwarhk;": "⤣",
	"nwArr;": "⇖",
	"nwarr;": "↖",
	"nwarrow;": "↖",
	"nwnear;": "⤧",
	"Oacute;": "Ó",
	Oacute: "Ó",
	"oacute;": "ó",
	oacute: "ó",
	"oast;": "⊛",
	"ocir;": "⊚",
	"Ocirc;": "Ô",
	Ocirc: "Ô",
	"ocirc;": "ô",
	ocirc: "ô",
	"Ocy;": "О",
	"ocy;": "о",
	"odash;": "⊝",
	"Odblac;": "Ő",
	"odblac;": "ő",
	"odiv;": "⨸",
	"odot;": "⊙",
	"odsold;": "⦼",
	"OElig;": "Œ",
	"oelig;": "œ",
	"ofcir;": "⦿",
	"Ofr;": "𝔒",
	"ofr;": "𝔬",
	"ogon;": "˛",
	"Ograve;": "Ò",
	Ograve: "Ò",
	"ograve;": "ò",
	ograve: "ò",
	"ogt;": "⧁",
	"ohbar;": "⦵",
	"ohm;": "Ω",
	"oint;": "∮",
	"olarr;": "↺",
	"olcir;": "⦾",
	"olcross;": "⦻",
	"oline;": "‾",
	"olt;": "⧀",
	"Omacr;": "Ō",
	"omacr;": "ō",
	"Omega;": "Ω",
	"omega;": "ω",
	"Omicron;": "Ο",
	"omicron;": "ο",
	"omid;": "⦶",
	"ominus;": "⊖",
	"Oopf;": "𝕆",
	"oopf;": "𝕠",
	"opar;": "⦷",
	"OpenCurlyDoubleQuote;": "“",
	"OpenCurlyQuote;": "‘",
	"operp;": "⦹",
	"oplus;": "⊕",
	"Or;": "⩔",
	"or;": "∨",
	"orarr;": "↻",
	"ord;": "⩝",
	"order;": "ℴ",
	"orderof;": "ℴ",
	"ordf;": "ª",
	ordf: "ª",
	"ordm;": "º",
	ordm: "º",
	"origof;": "⊶",
	"oror;": "⩖",
	"orslope;": "⩗",
	"orv;": "⩛",
	"oS;": "Ⓢ",
	"Oscr;": "𝒪",
	"oscr;": "ℴ",
	"Oslash;": "Ø",
	Oslash: "Ø",
	"oslash;": "ø",
	oslash: "ø",
	"osol;": "⊘",
	"Otilde;": "Õ",
	Otilde: "Õ",
	"otilde;": "õ",
	otilde: "õ",
	"Otimes;": "⨷",
	"otimes;": "⊗",
	"otimesas;": "⨶",
	"Ouml;": "Ö",
	Ouml: "Ö",
	"ouml;": "ö",
	ouml: "ö",
	"ovbar;": "⌽",
	"OverBar;": "‾",
	"OverBrace;": "⏞",
	"OverBracket;": "⎴",
	"OverParenthesis;": "⏜",
	"par;": "∥",
	"para;": "¶",
	para: "¶",
	"parallel;": "∥",
	"parsim;": "⫳",
	"parsl;": "⫽",
	"part;": "∂",
	"PartialD;": "∂",
	"Pcy;": "П",
	"pcy;": "п",
	"percnt;": "%",
	"period;": ".",
	"permil;": "‰",
	"perp;": "⊥",
	"pertenk;": "‱",
	"Pfr;": "𝔓",
	"pfr;": "𝔭",
	"Phi;": "Φ",
	"phi;": "φ",
	"phiv;": "ϕ",
	"phmmat;": "ℳ",
	"phone;": "☎",
	"Pi;": "Π",
	"pi;": "π",
	"pitchfork;": "⋔",
	"piv;": "ϖ",
	"planck;": "ℏ",
	"planckh;": "ℎ",
	"plankv;": "ℏ",
	"plus;": "+",
	"plusacir;": "⨣",
	"plusb;": "⊞",
	"pluscir;": "⨢",
	"plusdo;": "∔",
	"plusdu;": "⨥",
	"pluse;": "⩲",
	"PlusMinus;": "±",
	"plusmn;": "±",
	plusmn: "±",
	"plussim;": "⨦",
	"plustwo;": "⨧",
	"pm;": "±",
	"Poincareplane;": "ℌ",
	"pointint;": "⨕",
	"Popf;": "ℙ",
	"popf;": "𝕡",
	"pound;": "£",
	pound: "£",
	"Pr;": "⪻",
	"pr;": "≺",
	"prap;": "⪷",
	"prcue;": "≼",
	"prE;": "⪳",
	"pre;": "⪯",
	"prec;": "≺",
	"precapprox;": "⪷",
	"preccurlyeq;": "≼",
	"Precedes;": "≺",
	"PrecedesEqual;": "⪯",
	"PrecedesSlantEqual;": "≼",
	"PrecedesTilde;": "≾",
	"preceq;": "⪯",
	"precnapprox;": "⪹",
	"precneqq;": "⪵",
	"precnsim;": "⋨",
	"precsim;": "≾",
	"Prime;": "″",
	"prime;": "′",
	"primes;": "ℙ",
	"prnap;": "⪹",
	"prnE;": "⪵",
	"prnsim;": "⋨",
	"prod;": "∏",
	"Product;": "∏",
	"profalar;": "⌮",
	"profline;": "⌒",
	"profsurf;": "⌓",
	"prop;": "∝",
	"Proportion;": "∷",
	"Proportional;": "∝",
	"propto;": "∝",
	"prsim;": "≾",
	"prurel;": "⊰",
	"Pscr;": "𝒫",
	"pscr;": "𝓅",
	"Psi;": "Ψ",
	"psi;": "ψ",
	"puncsp;": " ",
	"Qfr;": "𝔔",
	"qfr;": "𝔮",
	"qint;": "⨌",
	"Qopf;": "ℚ",
	"qopf;": "𝕢",
	"qprime;": "⁗",
	"Qscr;": "𝒬",
	"qscr;": "𝓆",
	"quaternions;": "ℍ",
	"quatint;": "⨖",
	"quest;": "?",
	"questeq;": "≟",
	"QUOT;": "\"",
	QUOT: "\"",
	"quot;": "\"",
	quot: "\"",
	"rAarr;": "⇛",
	"race;": "∽̱",
	"Racute;": "Ŕ",
	"racute;": "ŕ",
	"radic;": "√",
	"raemptyv;": "⦳",
	"Rang;": "⟫",
	"rang;": "⟩",
	"rangd;": "⦒",
	"range;": "⦥",
	"rangle;": "⟩",
	"raquo;": "»",
	raquo: "»",
	"Rarr;": "↠",
	"rArr;": "⇒",
	"rarr;": "→",
	"rarrap;": "⥵",
	"rarrb;": "⇥",
	"rarrbfs;": "⤠",
	"rarrc;": "⤳",
	"rarrfs;": "⤞",
	"rarrhk;": "↪",
	"rarrlp;": "↬",
	"rarrpl;": "⥅",
	"rarrsim;": "⥴",
	"Rarrtl;": "⤖",
	"rarrtl;": "↣",
	"rarrw;": "↝",
	"rAtail;": "⤜",
	"ratail;": "⤚",
	"ratio;": "∶",
	"rationals;": "ℚ",
	"RBarr;": "⤐",
	"rBarr;": "⤏",
	"rbarr;": "⤍",
	"rbbrk;": "❳",
	"rbrace;": "}",
	"rbrack;": "]",
	"rbrke;": "⦌",
	"rbrksld;": "⦎",
	"rbrkslu;": "⦐",
	"Rcaron;": "Ř",
	"rcaron;": "ř",
	"Rcedil;": "Ŗ",
	"rcedil;": "ŗ",
	"rceil;": "⌉",
	"rcub;": "}",
	"Rcy;": "Р",
	"rcy;": "р",
	"rdca;": "⤷",
	"rdldhar;": "⥩",
	"rdquo;": "”",
	"rdquor;": "”",
	"rdsh;": "↳",
	"Re;": "ℜ",
	"real;": "ℜ",
	"realine;": "ℛ",
	"realpart;": "ℜ",
	"reals;": "ℝ",
	"rect;": "▭",
	"REG;": "®",
	REG: "®",
	"reg;": "®",
	reg: "®",
	"ReverseElement;": "∋",
	"ReverseEquilibrium;": "⇋",
	"ReverseUpEquilibrium;": "⥯",
	"rfisht;": "⥽",
	"rfloor;": "⌋",
	"Rfr;": "ℜ",
	"rfr;": "𝔯",
	"rHar;": "⥤",
	"rhard;": "⇁",
	"rharu;": "⇀",
	"rharul;": "⥬",
	"Rho;": "Ρ",
	"rho;": "ρ",
	"rhov;": "ϱ",
	"RightAngleBracket;": "⟩",
	"RightArrow;": "→",
	"Rightarrow;": "⇒",
	"rightarrow;": "→",
	"RightArrowBar;": "⇥",
	"RightArrowLeftArrow;": "⇄",
	"rightarrowtail;": "↣",
	"RightCeiling;": "⌉",
	"RightDoubleBracket;": "⟧",
	"RightDownTeeVector;": "⥝",
	"RightDownVector;": "⇂",
	"RightDownVectorBar;": "⥕",
	"RightFloor;": "⌋",
	"rightharpoondown;": "⇁",
	"rightharpoonup;": "⇀",
	"rightleftarrows;": "⇄",
	"rightleftharpoons;": "⇌",
	"rightrightarrows;": "⇉",
	"rightsquigarrow;": "↝",
	"RightTee;": "⊢",
	"RightTeeArrow;": "↦",
	"RightTeeVector;": "⥛",
	"rightthreetimes;": "⋌",
	"RightTriangle;": "⊳",
	"RightTriangleBar;": "⧐",
	"RightTriangleEqual;": "⊵",
	"RightUpDownVector;": "⥏",
	"RightUpTeeVector;": "⥜",
	"RightUpVector;": "↾",
	"RightUpVectorBar;": "⥔",
	"RightVector;": "⇀",
	"RightVectorBar;": "⥓",
	"ring;": "˚",
	"risingdotseq;": "≓",
	"rlarr;": "⇄",
	"rlhar;": "⇌",
	"rlm;": "‏",
	"rmoust;": "⎱",
	"rmoustache;": "⎱",
	"rnmid;": "⫮",
	"roang;": "⟭",
	"roarr;": "⇾",
	"robrk;": "⟧",
	"ropar;": "⦆",
	"Ropf;": "ℝ",
	"ropf;": "𝕣",
	"roplus;": "⨮",
	"rotimes;": "⨵",
	"RoundImplies;": "⥰",
	"rpar;": ")",
	"rpargt;": "⦔",
	"rppolint;": "⨒",
	"rrarr;": "⇉",
	"Rrightarrow;": "⇛",
	"rsaquo;": "›",
	"Rscr;": "ℛ",
	"rscr;": "𝓇",
	"Rsh;": "↱",
	"rsh;": "↱",
	"rsqb;": "]",
	"rsquo;": "’",
	"rsquor;": "’",
	"rthree;": "⋌",
	"rtimes;": "⋊",
	"rtri;": "▹",
	"rtrie;": "⊵",
	"rtrif;": "▸",
	"rtriltri;": "⧎",
	"RuleDelayed;": "⧴",
	"ruluhar;": "⥨",
	"rx;": "℞",
	"Sacute;": "Ś",
	"sacute;": "ś",
	"sbquo;": "‚",
	"Sc;": "⪼",
	"sc;": "≻",
	"scap;": "⪸",
	"Scaron;": "Š",
	"scaron;": "š",
	"sccue;": "≽",
	"scE;": "⪴",
	"sce;": "⪰",
	"Scedil;": "Ş",
	"scedil;": "ş",
	"Scirc;": "Ŝ",
	"scirc;": "ŝ",
	"scnap;": "⪺",
	"scnE;": "⪶",
	"scnsim;": "⋩",
	"scpolint;": "⨓",
	"scsim;": "≿",
	"Scy;": "С",
	"scy;": "с",
	"sdot;": "⋅",
	"sdotb;": "⊡",
	"sdote;": "⩦",
	"searhk;": "⤥",
	"seArr;": "⇘",
	"searr;": "↘",
	"searrow;": "↘",
	"sect;": "§",
	sect: "§",
	"semi;": ";",
	"seswar;": "⤩",
	"setminus;": "∖",
	"setmn;": "∖",
	"sext;": "✶",
	"Sfr;": "𝔖",
	"sfr;": "𝔰",
	"sfrown;": "⌢",
	"sharp;": "♯",
	"SHCHcy;": "Щ",
	"shchcy;": "щ",
	"SHcy;": "Ш",
	"shcy;": "ш",
	"ShortDownArrow;": "↓",
	"ShortLeftArrow;": "←",
	"shortmid;": "∣",
	"shortparallel;": "∥",
	"ShortRightArrow;": "→",
	"ShortUpArrow;": "↑",
	"shy;": "­",
	shy: "­",
	"Sigma;": "Σ",
	"sigma;": "σ",
	"sigmaf;": "ς",
	"sigmav;": "ς",
	"sim;": "∼",
	"simdot;": "⩪",
	"sime;": "≃",
	"simeq;": "≃",
	"simg;": "⪞",
	"simgE;": "⪠",
	"siml;": "⪝",
	"simlE;": "⪟",
	"simne;": "≆",
	"simplus;": "⨤",
	"simrarr;": "⥲",
	"slarr;": "←",
	"SmallCircle;": "∘",
	"smallsetminus;": "∖",
	"smashp;": "⨳",
	"smeparsl;": "⧤",
	"smid;": "∣",
	"smile;": "⌣",
	"smt;": "⪪",
	"smte;": "⪬",
	"smtes;": "⪬︀",
	"SOFTcy;": "Ь",
	"softcy;": "ь",
	"sol;": "/",
	"solb;": "⧄",
	"solbar;": "⌿",
	"Sopf;": "𝕊",
	"sopf;": "𝕤",
	"spades;": "♠",
	"spadesuit;": "♠",
	"spar;": "∥",
	"sqcap;": "⊓",
	"sqcaps;": "⊓︀",
	"sqcup;": "⊔",
	"sqcups;": "⊔︀",
	"Sqrt;": "√",
	"sqsub;": "⊏",
	"sqsube;": "⊑",
	"sqsubset;": "⊏",
	"sqsubseteq;": "⊑",
	"sqsup;": "⊐",
	"sqsupe;": "⊒",
	"sqsupset;": "⊐",
	"sqsupseteq;": "⊒",
	"squ;": "□",
	"Square;": "□",
	"square;": "□",
	"SquareIntersection;": "⊓",
	"SquareSubset;": "⊏",
	"SquareSubsetEqual;": "⊑",
	"SquareSuperset;": "⊐",
	"SquareSupersetEqual;": "⊒",
	"SquareUnion;": "⊔",
	"squarf;": "▪",
	"squf;": "▪",
	"srarr;": "→",
	"Sscr;": "𝒮",
	"sscr;": "𝓈",
	"ssetmn;": "∖",
	"ssmile;": "⌣",
	"sstarf;": "⋆",
	"Star;": "⋆",
	"star;": "☆",
	"starf;": "★",
	"straightepsilon;": "ϵ",
	"straightphi;": "ϕ",
	"strns;": "¯",
	"Sub;": "⋐",
	"sub;": "⊂",
	"subdot;": "⪽",
	"subE;": "⫅",
	"sube;": "⊆",
	"subedot;": "⫃",
	"submult;": "⫁",
	"subnE;": "⫋",
	"subne;": "⊊",
	"subplus;": "⪿",
	"subrarr;": "⥹",
	"Subset;": "⋐",
	"subset;": "⊂",
	"subseteq;": "⊆",
	"subseteqq;": "⫅",
	"SubsetEqual;": "⊆",
	"subsetneq;": "⊊",
	"subsetneqq;": "⫋",
	"subsim;": "⫇",
	"subsub;": "⫕",
	"subsup;": "⫓",
	"succ;": "≻",
	"succapprox;": "⪸",
	"succcurlyeq;": "≽",
	"Succeeds;": "≻",
	"SucceedsEqual;": "⪰",
	"SucceedsSlantEqual;": "≽",
	"SucceedsTilde;": "≿",
	"succeq;": "⪰",
	"succnapprox;": "⪺",
	"succneqq;": "⪶",
	"succnsim;": "⋩",
	"succsim;": "≿",
	"SuchThat;": "∋",
	"Sum;": "∑",
	"sum;": "∑",
	"sung;": "♪",
	"Sup;": "⋑",
	"sup;": "⊃",
	"sup1;": "¹",
	sup1: "¹",
	"sup2;": "²",
	sup2: "²",
	"sup3;": "³",
	sup3: "³",
	"supdot;": "⪾",
	"supdsub;": "⫘",
	"supE;": "⫆",
	"supe;": "⊇",
	"supedot;": "⫄",
	"Superset;": "⊃",
	"SupersetEqual;": "⊇",
	"suphsol;": "⟉",
	"suphsub;": "⫗",
	"suplarr;": "⥻",
	"supmult;": "⫂",
	"supnE;": "⫌",
	"supne;": "⊋",
	"supplus;": "⫀",
	"Supset;": "⋑",
	"supset;": "⊃",
	"supseteq;": "⊇",
	"supseteqq;": "⫆",
	"supsetneq;": "⊋",
	"supsetneqq;": "⫌",
	"supsim;": "⫈",
	"supsub;": "⫔",
	"supsup;": "⫖",
	"swarhk;": "⤦",
	"swArr;": "⇙",
	"swarr;": "↙",
	"swarrow;": "↙",
	"swnwar;": "⤪",
	"szlig;": "ß",
	szlig: "ß",
	"Tab;": "	",
	"target;": "⌖",
	"Tau;": "Τ",
	"tau;": "τ",
	"tbrk;": "⎴",
	"Tcaron;": "Ť",
	"tcaron;": "ť",
	"Tcedil;": "Ţ",
	"tcedil;": "ţ",
	"Tcy;": "Т",
	"tcy;": "т",
	"tdot;": "⃛",
	"telrec;": "⌕",
	"Tfr;": "𝔗",
	"tfr;": "𝔱",
	"there4;": "∴",
	"Therefore;": "∴",
	"therefore;": "∴",
	"Theta;": "Θ",
	"theta;": "θ",
	"thetasym;": "ϑ",
	"thetav;": "ϑ",
	"thickapprox;": "≈",
	"thicksim;": "∼",
	"ThickSpace;": "  ",
	"thinsp;": " ",
	"ThinSpace;": " ",
	"thkap;": "≈",
	"thksim;": "∼",
	"THORN;": "Þ",
	THORN: "Þ",
	"thorn;": "þ",
	thorn: "þ",
	"Tilde;": "∼",
	"tilde;": "˜",
	"TildeEqual;": "≃",
	"TildeFullEqual;": "≅",
	"TildeTilde;": "≈",
	"times;": "×",
	times: "×",
	"timesb;": "⊠",
	"timesbar;": "⨱",
	"timesd;": "⨰",
	"tint;": "∭",
	"toea;": "⤨",
	"top;": "⊤",
	"topbot;": "⌶",
	"topcir;": "⫱",
	"Topf;": "𝕋",
	"topf;": "𝕥",
	"topfork;": "⫚",
	"tosa;": "⤩",
	"tprime;": "‴",
	"TRADE;": "™",
	"trade;": "™",
	"triangle;": "▵",
	"triangledown;": "▿",
	"triangleleft;": "◃",
	"trianglelefteq;": "⊴",
	"triangleq;": "≜",
	"triangleright;": "▹",
	"trianglerighteq;": "⊵",
	"tridot;": "◬",
	"trie;": "≜",
	"triminus;": "⨺",
	"TripleDot;": "⃛",
	"triplus;": "⨹",
	"trisb;": "⧍",
	"tritime;": "⨻",
	"trpezium;": "⏢",
	"Tscr;": "𝒯",
	"tscr;": "𝓉",
	"TScy;": "Ц",
	"tscy;": "ц",
	"TSHcy;": "Ћ",
	"tshcy;": "ћ",
	"Tstrok;": "Ŧ",
	"tstrok;": "ŧ",
	"twixt;": "≬",
	"twoheadleftarrow;": "↞",
	"twoheadrightarrow;": "↠",
	"Uacute;": "Ú",
	Uacute: "Ú",
	"uacute;": "ú",
	uacute: "ú",
	"Uarr;": "↟",
	"uArr;": "⇑",
	"uarr;": "↑",
	"Uarrocir;": "⥉",
	"Ubrcy;": "Ў",
	"ubrcy;": "ў",
	"Ubreve;": "Ŭ",
	"ubreve;": "ŭ",
	"Ucirc;": "Û",
	Ucirc: "Û",
	"ucirc;": "û",
	ucirc: "û",
	"Ucy;": "У",
	"ucy;": "у",
	"udarr;": "⇅",
	"Udblac;": "Ű",
	"udblac;": "ű",
	"udhar;": "⥮",
	"ufisht;": "⥾",
	"Ufr;": "𝔘",
	"ufr;": "𝔲",
	"Ugrave;": "Ù",
	Ugrave: "Ù",
	"ugrave;": "ù",
	ugrave: "ù",
	"uHar;": "⥣",
	"uharl;": "↿",
	"uharr;": "↾",
	"uhblk;": "▀",
	"ulcorn;": "⌜",
	"ulcorner;": "⌜",
	"ulcrop;": "⌏",
	"ultri;": "◸",
	"Umacr;": "Ū",
	"umacr;": "ū",
	"uml;": "¨",
	uml: "¨",
	"UnderBar;": "_",
	"UnderBrace;": "⏟",
	"UnderBracket;": "⎵",
	"UnderParenthesis;": "⏝",
	"Union;": "⋃",
	"UnionPlus;": "⊎",
	"Uogon;": "Ų",
	"uogon;": "ų",
	"Uopf;": "𝕌",
	"uopf;": "𝕦",
	"UpArrow;": "↑",
	"Uparrow;": "⇑",
	"uparrow;": "↑",
	"UpArrowBar;": "⤒",
	"UpArrowDownArrow;": "⇅",
	"UpDownArrow;": "↕",
	"Updownarrow;": "⇕",
	"updownarrow;": "↕",
	"UpEquilibrium;": "⥮",
	"upharpoonleft;": "↿",
	"upharpoonright;": "↾",
	"uplus;": "⊎",
	"UpperLeftArrow;": "↖",
	"UpperRightArrow;": "↗",
	"Upsi;": "ϒ",
	"upsi;": "υ",
	"upsih;": "ϒ",
	"Upsilon;": "Υ",
	"upsilon;": "υ",
	"UpTee;": "⊥",
	"UpTeeArrow;": "↥",
	"upuparrows;": "⇈",
	"urcorn;": "⌝",
	"urcorner;": "⌝",
	"urcrop;": "⌎",
	"Uring;": "Ů",
	"uring;": "ů",
	"urtri;": "◹",
	"Uscr;": "𝒰",
	"uscr;": "𝓊",
	"utdot;": "⋰",
	"Utilde;": "Ũ",
	"utilde;": "ũ",
	"utri;": "▵",
	"utrif;": "▴",
	"uuarr;": "⇈",
	"Uuml;": "Ü",
	Uuml: "Ü",
	"uuml;": "ü",
	uuml: "ü",
	"uwangle;": "⦧",
	"vangrt;": "⦜",
	"varepsilon;": "ϵ",
	"varkappa;": "ϰ",
	"varnothing;": "∅",
	"varphi;": "ϕ",
	"varpi;": "ϖ",
	"varpropto;": "∝",
	"vArr;": "⇕",
	"varr;": "↕",
	"varrho;": "ϱ",
	"varsigma;": "ς",
	"varsubsetneq;": "⊊︀",
	"varsubsetneqq;": "⫋︀",
	"varsupsetneq;": "⊋︀",
	"varsupsetneqq;": "⫌︀",
	"vartheta;": "ϑ",
	"vartriangleleft;": "⊲",
	"vartriangleright;": "⊳",
	"Vbar;": "⫫",
	"vBar;": "⫨",
	"vBarv;": "⫩",
	"Vcy;": "В",
	"vcy;": "в",
	"VDash;": "⊫",
	"Vdash;": "⊩",
	"vDash;": "⊨",
	"vdash;": "⊢",
	"Vdashl;": "⫦",
	"Vee;": "⋁",
	"vee;": "∨",
	"veebar;": "⊻",
	"veeeq;": "≚",
	"vellip;": "⋮",
	"Verbar;": "‖",
	"verbar;": "|",
	"Vert;": "‖",
	"vert;": "|",
	"VerticalBar;": "∣",
	"VerticalLine;": "|",
	"VerticalSeparator;": "❘",
	"VerticalTilde;": "≀",
	"VeryThinSpace;": " ",
	"Vfr;": "𝔙",
	"vfr;": "𝔳",
	"vltri;": "⊲",
	"vnsub;": "⊂⃒",
	"vnsup;": "⊃⃒",
	"Vopf;": "𝕍",
	"vopf;": "𝕧",
	"vprop;": "∝",
	"vrtri;": "⊳",
	"Vscr;": "𝒱",
	"vscr;": "𝓋",
	"vsubnE;": "⫋︀",
	"vsubne;": "⊊︀",
	"vsupnE;": "⫌︀",
	"vsupne;": "⊋︀",
	"Vvdash;": "⊪",
	"vzigzag;": "⦚",
	"Wcirc;": "Ŵ",
	"wcirc;": "ŵ",
	"wedbar;": "⩟",
	"Wedge;": "⋀",
	"wedge;": "∧",
	"wedgeq;": "≙",
	"weierp;": "℘",
	"Wfr;": "𝔚",
	"wfr;": "𝔴",
	"Wopf;": "𝕎",
	"wopf;": "𝕨",
	"wp;": "℘",
	"wr;": "≀",
	"wreath;": "≀",
	"Wscr;": "𝒲",
	"wscr;": "𝓌",
	"xcap;": "⋂",
	"xcirc;": "◯",
	"xcup;": "⋃",
	"xdtri;": "▽",
	"Xfr;": "𝔛",
	"xfr;": "𝔵",
	"xhArr;": "⟺",
	"xharr;": "⟷",
	"Xi;": "Ξ",
	"xi;": "ξ",
	"xlArr;": "⟸",
	"xlarr;": "⟵",
	"xmap;": "⟼",
	"xnis;": "⋻",
	"xodot;": "⨀",
	"Xopf;": "𝕏",
	"xopf;": "𝕩",
	"xoplus;": "⨁",
	"xotime;": "⨂",
	"xrArr;": "⟹",
	"xrarr;": "⟶",
	"Xscr;": "𝒳",
	"xscr;": "𝓍",
	"xsqcup;": "⨆",
	"xuplus;": "⨄",
	"xutri;": "△",
	"xvee;": "⋁",
	"xwedge;": "⋀",
	"Yacute;": "Ý",
	Yacute: "Ý",
	"yacute;": "ý",
	yacute: "ý",
	"YAcy;": "Я",
	"yacy;": "я",
	"Ycirc;": "Ŷ",
	"ycirc;": "ŷ",
	"Ycy;": "Ы",
	"ycy;": "ы",
	"yen;": "¥",
	yen: "¥",
	"Yfr;": "𝔜",
	"yfr;": "𝔶",
	"YIcy;": "Ї",
	"yicy;": "ї",
	"Yopf;": "𝕐",
	"yopf;": "𝕪",
	"Yscr;": "𝒴",
	"yscr;": "𝓎",
	"YUcy;": "Ю",
	"yucy;": "ю",
	"Yuml;": "Ÿ",
	"yuml;": "ÿ",
	yuml: "ÿ",
	"Zacute;": "Ź",
	"zacute;": "ź",
	"Zcaron;": "Ž",
	"zcaron;": "ž",
	"Zcy;": "З",
	"zcy;": "з",
	"Zdot;": "Ż",
	"zdot;": "ż",
	"zeetrf;": "ℨ",
	"ZeroWidthSpace;": "​",
	"Zeta;": "Ζ",
	"zeta;": "ζ",
	"Zfr;": "ℨ",
	"zfr;": "𝔷",
	"ZHcy;": "Ж",
	"zhcy;": "ж",
	"zigrarr;": "⇝",
	"Zopf;": "ℤ",
	"zopf;": "𝕫",
	"Zscr;": "𝒵",
	"zscr;": "𝓏",
	"zwj;": "‍",
	"zwnj;": "‌"
};
function We(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function Xh(e, t) {
	const n = e.length - t.length;
	return n > 0 ? e.lastIndexOf(t) === n : n === 0 ? e === t : !1;
}
function va(e, t) {
	let n = "";
	for (; t > 0;) (t & 1) === 1 && (n += e), e += e, t = t >>> 1;
	return n;
}
const Yh = 97, Jh = 122, Qh = 65, Zh = 90, Kh = 48, eu = 57;
function wt(e, t) {
	const n = e.charCodeAt(t);
	return Yh <= n && n <= Jh || Qh <= n && n <= Zh || Kh <= n && n <= eu;
}
function dn(e) {
	return typeof e < "u";
}
function tu(e) {
	if (e) return typeof e == "string" ? {
		kind: "markdown",
		value: e
	} : {
		kind: "markdown",
		value: e.value
	};
}
var po = class {
	isApplicable() {
		return !0;
	}
	constructor(e, t) {
		this.id = e, this._tags = [], this._tagMap = {}, this._valueSetMap = {}, this._tags = t.tags || [], this._globalAttributes = t.globalAttributes || [], this._tags.forEach((n) => {
			this._tagMap[n.name.toLowerCase()] = n;
		}), t.valueSets && t.valueSets.forEach((n) => {
			this._valueSetMap[n.name] = n.values;
		});
	}
	getId() {
		return this.id;
	}
	provideTags() {
		return this._tags;
	}
	provideAttributes(e) {
		const t = [], n = (i) => {
			t.push(i);
		}, r = this._tagMap[e.toLowerCase()];
		return r && r.attributes.forEach(n), this._globalAttributes.forEach(n), t;
	}
	provideValues(e, t) {
		const n = [];
		t = t.toLowerCase();
		const r = (s) => {
			s.forEach((a) => {
				a.name.toLowerCase() === t && (a.values && a.values.forEach((o) => {
					n.push(o);
				}), a.valueSet && this._valueSetMap[a.valueSet] && this._valueSetMap[a.valueSet].forEach((o) => {
					n.push(o);
				}));
			});
		}, i = this._tagMap[e.toLowerCase()];
		return i && r(i.attributes), r(this._globalAttributes), n;
	}
};
function je(e, t = {}, n) {
	const r = {
		kind: n ? "markdown" : "plaintext",
		value: ""
	};
	if (e.description && t.documentation !== !1) {
		const i = tu(e.description);
		i && (r.value += i.value);
	}
	if (e.references && e.references.length > 0 && t.references !== !1 && (r.value.length && (r.value += `

`), n ? r.value += e.references.map((i) => `[${i.name}](${i.url})`).join(" | ") : r.value += e.references.map((i) => `${i.name}: ${i.url}`).join(`
`)), r.value !== "") return r;
}
var nu = class {
	constructor(e, t) {
		this.dataManager = e, this.readDirectory = t, this.atributeCompletions = [];
	}
	onHtmlAttributeValue(e) {
		this.dataManager.isPathAttribute(e.tag, e.attribute) && this.atributeCompletions.push(e);
	}
	async computeCompletions(e, t) {
		const n = {
			items: [],
			isIncomplete: !1
		};
		for (const r of this.atributeCompletions) {
			const i = ru(e.getText(r.range));
			if (su(i)) if (i === "." || i === "..") n.isIncomplete = !0;
			else {
				const s = au(r.value, i, r.range), a = await this.providePathSuggestions(r.value, s, e, t);
				for (const o of a) n.items.push(o);
			}
		}
		return n;
	}
	async providePathSuggestions(e, t, n, r) {
		const i = e.substring(0, e.lastIndexOf("/") + 1);
		let s = r.resolveReference(i || ".", n.uri);
		if (s) try {
			const a = [], o = await this.readDirectory(s);
			for (const [l, c] of o) l.charCodeAt(0) !== iu && a.push(ou(l, c === vi.Directory, t));
			return a;
		} catch {}
		return [];
	}
};
const iu = 46;
function ru(e) {
	return We(e, "'") || We(e, "\"") ? e.slice(1, -1) : e;
}
function su(e) {
	return !(We(e, "http") || We(e, "https") || We(e, "//"));
}
function au(e, t, n) {
	let r;
	const i = e.lastIndexOf("/");
	if (i === -1) r = lu(n, 1, -1);
	else {
		const s = t.slice(i + 1), a = Tt(n.end, -1 - s.length), o = s.indexOf(" ");
		let l;
		o !== -1 ? l = Tt(a, o) : l = Tt(n.end, -1), r = $.create(a, l);
	}
	return r;
}
function ou(e, t, n) {
	return t ? (e = e + "/", {
		label: e,
		kind: ue.Folder,
		textEdit: se.replace(n, e),
		command: {
			title: "Suggest",
			command: "editor.action.triggerSuggest"
		}
	}) : {
		label: e,
		kind: ue.File,
		textEdit: se.replace(n, e)
	};
}
function Tt(e, t) {
	return ie.create(e.line, e.character + t);
}
function lu(e, t, n) {
	const r = Tt(e.start, t), i = Tt(e.end, n);
	return $.create(r, i);
}
var cu = class {
	constructor(e, t) {
		this.lsOptions = e, this.dataManager = t, this.completionParticipants = [];
	}
	setCompletionParticipants(e) {
		this.completionParticipants = e || [];
	}
	async doComplete2(e, t, n, r, i) {
		if (!this.lsOptions.fileSystemProvider || !this.lsOptions.fileSystemProvider.readDirectory) return this.doComplete(e, t, n, i);
		const s = new nu(this.dataManager, this.lsOptions.fileSystemProvider.readDirectory), a = this.completionParticipants;
		this.completionParticipants = [s].concat(a);
		const o = this.doComplete(e, t, n, i);
		try {
			const l = await s.computeCompletions(e, r);
			return {
				isIncomplete: o.isIncomplete || l.isIncomplete,
				items: l.items.concat(o.items)
			};
		} finally {
			this.completionParticipants = a;
		}
	}
	doComplete(e, t, n, r) {
		const i = this._doComplete(e, t, n, r);
		return this.convertCompletionList(i);
	}
	_doComplete(e, t, n, r) {
		const i = {
			isIncomplete: !1,
			items: []
		}, s = this.completionParticipants, a = this.dataManager.getDataProviders().filter((y) => y.isApplicable(e.languageId) && (!r || r[y.getId()] !== !1)), o = this.dataManager.getVoidElements(a), l = this.doesSupportMarkdown(), c = e.getText(), u = e.offsetAt(t), d = n.findNodeBefore(u);
		if (!d) return i;
		const m = ge(c, d.start);
		let p = "", b;
		function g(y, M = u) {
			return y > u && (y = u), {
				start: e.positionAt(y),
				end: e.positionAt(M)
			};
		}
		function v(y, M) {
			const N = g(y, M);
			return a.forEach((H) => {
				H.provideTags().forEach((q) => {
					i.items.push({
						label: q.name,
						kind: ue.Property,
						documentation: je(q, void 0, l),
						textEdit: se.replace(N, q.name),
						insertTextFormat: ve.PlainText
					});
				});
			}), i;
		}
		function T(y) {
			let M = y;
			for (; M > 0;) {
				const N = c.charAt(M - 1);
				if (`
\r`.indexOf(N) >= 0) return c.substring(M, y);
				if (!mn(N)) return null;
				M--;
			}
			return c.substring(0, y);
		}
		function k(y, M, N = u) {
			const H = g(y, N), q = ya(c, N, B.WithinEndTag, U.EndTagClose) ? "" : ">";
			let P = d;
			for (M && (P = P.parent); P;) {
				const W = P.tag;
				if (W && (!P.closed || P.endTagStart && P.endTagStart > u)) {
					const G = {
						label: "/" + W,
						kind: ue.Property,
						filterText: "/" + W,
						textEdit: se.replace(H, "/" + W + q),
						insertTextFormat: ve.PlainText
					}, Z = T(P.start), ae = T(y - 1);
					if (Z !== null && ae !== null && Z !== ae) {
						const xe = Z + "</" + W + q;
						G.textEdit = se.replace(g(y - 1 - ae.length), xe), G.filterText = ae + "</" + W;
					}
					return i.items.push(G), i;
				}
				P = P.parent;
			}
			return M || a.forEach((W) => {
				W.provideTags().forEach((G) => {
					i.items.push({
						label: "/" + G.name,
						kind: ue.Property,
						documentation: je(G, void 0, l),
						filterText: "/" + G.name + q,
						textEdit: se.replace(H, "/" + G.name + q),
						insertTextFormat: ve.PlainText
					});
				});
			}), i;
		}
		const E = (y, M) => {
			if (r && r.hideAutoCompleteProposals) return i;
			if (!this.dataManager.isVoidElement(M, o)) {
				const N = e.positionAt(y);
				i.items.push({
					label: "</" + M + ">",
					kind: ue.Property,
					filterText: "</" + M + ">",
					textEdit: se.insert(N, "$0</" + M + ">"),
					insertTextFormat: ve.Snippet
				});
			}
			return i;
		};
		function I(y, M) {
			return v(y, M), k(y, !0, M), i;
		}
		function D() {
			const y = Object.create(null);
			return d.attributeNames.forEach((M) => {
				y[M] = !0;
			}), y;
		}
		function w(y, M = u) {
			let N = u;
			for (; N < M && c[N] !== "<";) N++;
			const H = c.substring(y, M), q = g(y, N);
			let P = "";
			if (!ya(c, M, B.AfterAttributeName, U.DelimiterAssign)) {
				const G = r?.attributeDefaultValue ?? "doublequotes";
				G === "empty" ? P = "=$1" : G === "singlequotes" ? P = "='$1'" : P = "=\"$1\"";
			}
			const W = D();
			return W[H] = !1, a.forEach((G) => {
				G.provideAttributes(p).forEach((Z) => {
					if (W[Z.name]) return;
					W[Z.name] = !0;
					let ae = Z.name, xe;
					Z.valueSet !== "v" && P.length && (ae = ae + P, (Z.valueSet || Z.name === "style") && (xe = {
						title: "Suggest",
						command: "editor.action.triggerSuggest"
					})), i.items.push({
						label: Z.name,
						kind: Z.valueSet === "handler" ? ue.Function : ue.Value,
						documentation: je(Z, void 0, l),
						textEdit: se.replace(q, ae),
						insertTextFormat: ve.Snippet,
						command: xe
					});
				});
			}), f(q, W), i;
		}
		function f(y, M) {
			const N = "data-", H = {};
			H[N] = `${N}$1="$2"`;
			function q(P) {
				P.attributeNames.forEach((W) => {
					We(W, N) && !H[W] && !M[W] && (H[W] = W + "=\"$1\"");
				}), P.children.forEach((W) => q(W));
			}
			n && n.roots.forEach((P) => q(P)), Object.keys(H).forEach((P) => i.items.push({
				label: P,
				kind: ue.Value,
				textEdit: se.replace(y, H[P]),
				insertTextFormat: ve.Snippet
			}));
		}
		function _(y, M = u) {
			let N, H, q;
			if (u > y && u <= M && hu(c[y])) {
				const P = y + 1;
				let W = M;
				M > y && c[M - 1] === c[y] && W--, N = g(uu(c, u, P), du(c, u, W)), q = u >= P && u <= W ? c.substring(P, u) : "", H = !1;
			} else N = g(y, M), q = c.substring(y, u), H = !0;
			if (s.length > 0) {
				const P = p.toLowerCase(), W = b.toLowerCase(), G = g(y, M);
				for (const Z of s) Z.onHtmlAttributeValue && Z.onHtmlAttributeValue({
					document: e,
					position: t,
					tag: P,
					attribute: W,
					value: q,
					range: G
				});
			}
			return a.forEach((P) => {
				P.provideValues(p, b).forEach((W) => {
					const G = H ? "\"" + W.name + "\"" : W.name;
					i.items.push({
						label: W.name,
						filterText: G,
						kind: ue.Unit,
						documentation: je(W, void 0, l),
						textEdit: se.replace(N, G),
						insertTextFormat: ve.PlainText
					});
				});
			}), L(), i;
		}
		function C(y) {
			return u === m.getTokenEnd() && (A = m.scan(), A === y && m.getTokenOffset() === u) ? m.getTokenEnd() : u;
		}
		function z() {
			for (const y of s) y.onHtmlContent && y.onHtmlContent({
				document: e,
				position: t
			});
			return L();
		}
		function L() {
			let y = u - 1, M = t.character;
			for (; y >= 0 && wt(c, y);) y--, M--;
			if (y >= 0 && c[y] === "&") {
				const N = $.create(ie.create(t.line, M - 1), t);
				for (const H in yt) if (Xh(H, ";")) {
					const q = "&" + H;
					i.items.push({
						label: q,
						kind: ue.Keyword,
						documentation: ye("Character entity representing '{0}'", yt[H]),
						textEdit: se.replace(N, q),
						insertTextFormat: ve.PlainText
					});
				}
			}
			return i;
		}
		function S(y, M) {
			const N = g(y, M);
			i.items.push({
				label: "!DOCTYPE",
				kind: ue.Property,
				documentation: "A preamble for an HTML document.",
				textEdit: se.replace(N, "!DOCTYPE html>"),
				insertTextFormat: ve.PlainText
			});
		}
		let A = m.scan();
		for (; A !== U.EOS && m.getTokenOffset() <= u;) {
			switch (A) {
				case U.StartTagOpen:
					if (m.getTokenEnd() === u) {
						const y = C(U.StartTag);
						return t.line === 0 && S(u, y), I(u, y);
					}
					break;
				case U.StartTag:
					if (m.getTokenOffset() <= u && u <= m.getTokenEnd()) return v(m.getTokenOffset(), m.getTokenEnd());
					p = m.getTokenText();
					break;
				case U.AttributeName:
					if (m.getTokenOffset() <= u && u <= m.getTokenEnd()) return w(m.getTokenOffset(), m.getTokenEnd());
					b = m.getTokenText();
					break;
				case U.DelimiterAssign:
					if (m.getTokenEnd() === u) return _(u, C(U.AttributeValue));
					break;
				case U.AttributeValue:
					if (m.getTokenOffset() <= u && u <= m.getTokenEnd()) return _(m.getTokenOffset(), m.getTokenEnd());
					break;
				case U.Whitespace:
					if (u <= m.getTokenEnd()) switch (m.getScannerState()) {
						case B.AfterOpeningStartTag: return I(m.getTokenOffset(), C(U.StartTag));
						case B.WithinTag:
						case B.AfterAttributeName: return w(m.getTokenEnd());
						case B.BeforeAttributeValue: return _(m.getTokenEnd());
						case B.AfterOpeningEndTag: return k(m.getTokenOffset() - 1, !1);
						case B.WithinContent: return z();
					}
					break;
				case U.EndTagOpen:
					if (u <= m.getTokenEnd()) return k(m.getTokenOffset() + 1, !1, C(U.EndTag));
					break;
				case U.EndTag:
					if (u <= m.getTokenEnd()) {
						let y = m.getTokenOffset() - 1;
						for (; y >= 0;) {
							const M = c.charAt(y);
							if (M === "/") return k(y, !1, m.getTokenEnd());
							if (!mn(M)) break;
							y--;
						}
					}
					break;
				case U.StartTagClose:
					if (u <= m.getTokenEnd() && p) return E(m.getTokenEnd(), p);
					break;
				case U.Content:
					if (u <= m.getTokenEnd()) return z();
					break;
				default:
					if (u <= m.getTokenEnd()) return i;
					break;
			}
			A = m.scan();
		}
		return i;
	}
	doQuoteComplete(e, t, n, r) {
		const i = e.offsetAt(t);
		if (i <= 0) return null;
		const s = r?.attributeDefaultValue ?? "doublequotes";
		if (s === "empty" || e.getText().charAt(i - 1) !== "=") return null;
		const a = s === "doublequotes" ? "\"$1\"" : "'$1'", o = n.findNodeBefore(i);
		if (o && o.attributes && o.start < i && (!o.endTagStart || o.endTagStart > i)) {
			const l = ge(e.getText(), o.start);
			let c = l.scan();
			for (; c !== U.EOS && l.getTokenEnd() <= i;) {
				if (c === U.AttributeName && l.getTokenEnd() === i - 1) return c = l.scan(), c !== U.DelimiterAssign || (c = l.scan(), c === U.Unknown || c === U.AttributeValue) ? null : a;
				c = l.scan();
			}
		}
		return null;
	}
	doTagComplete(e, t, n) {
		const r = e.offsetAt(t);
		if (r <= 0) return null;
		const i = e.getText().charAt(r - 1);
		if (i === ">") {
			const s = this.dataManager.getVoidElements(e.languageId), a = n.findNodeBefore(r);
			if (a && a.tag && !this.dataManager.isVoidElement(a.tag, s) && a.start < r && (!a.endTagStart || a.endTagStart > r)) {
				const o = ge(e.getText(), a.start);
				let l = o.scan();
				for (; l !== U.EOS && o.getTokenEnd() <= r;) {
					if (l === U.StartTagClose && o.getTokenEnd() === r) return `$0</${a.tag}>`;
					l = o.scan();
				}
			}
		} else if (i === "/") {
			let s = n.findNodeBefore(r);
			for (; s && s.closed && !(s.endTagStart && s.endTagStart > r);) s = s.parent;
			if (s && s.tag) {
				const a = ge(e.getText(), s.start);
				let o = a.scan();
				for (; o !== U.EOS && a.getTokenEnd() <= r;) {
					if (o === U.EndTagOpen && a.getTokenEnd() === r) return e.getText().charAt(r) !== ">" ? `${s.tag}>` : s.tag;
					o = a.scan();
				}
			}
		}
		return null;
	}
	convertCompletionList(e) {
		return this.doesSupportMarkdown() || e.items.forEach((t) => {
			t.documentation && typeof t.documentation != "string" && (t.documentation = {
				kind: "plaintext",
				value: t.documentation.value
			});
		}), e;
	}
	doesSupportMarkdown() {
		if (!dn(this.supportsMarkdown)) {
			if (!dn(this.lsOptions.clientCapabilities)) return this.supportsMarkdown = !0, this.supportsMarkdown;
			const e = this.lsOptions.clientCapabilities.textDocument?.completion?.completionItem?.documentationFormat;
			this.supportsMarkdown = Array.isArray(e) && e.indexOf(Ie.Markdown) !== -1;
		}
		return this.supportsMarkdown;
	}
};
function hu(e) {
	return /^["']*$/.test(e);
}
function mn(e) {
	return /^\s*$/.test(e);
}
function ya(e, t, n, r) {
	const i = ge(e, t, n);
	let s = i.scan();
	for (; s === U.Whitespace;) s = i.scan();
	return s === r;
}
function uu(e, t, n) {
	for (; t > n && !mn(e[t - 1]);) t--;
	return t;
}
function du(e, t, n) {
	for (; t < n && !mn(e[t]);) t++;
	return t;
}
var mu = class {
	constructor(e, t) {
		this.lsOptions = e, this.dataManager = t;
	}
	doHover(e, t, n, r) {
		const i = this.convertContents.bind(this), s = this.doesSupportMarkdown(), a = e.offsetAt(t), o = n.findNodeAt(a), l = e.getText();
		if (!o || !o.tag) return null;
		const c = this.dataManager.getDataProviders().filter((w) => w.isApplicable(e.languageId));
		function u(w, f, _) {
			for (const C of c) {
				let z = null;
				if (C.provideTags().forEach((L) => {
					if (L.name.toLowerCase() === w.toLowerCase()) {
						let S = je(L, r, s);
						S || (S = {
							kind: s ? "markdown" : "plaintext",
							value: ""
						}), z = {
							contents: S,
							range: f
						};
					}
				}), z) return z.contents = i(z.contents), z;
			}
			return null;
		}
		function d(w, f, _) {
			for (const C of c) {
				let z = null;
				if (C.provideAttributes(w).forEach((L) => {
					if (f === L.name && L.description) {
						const S = je(L, r, s);
						S ? z = {
							contents: S,
							range: _
						} : z = null;
					}
				}), z) return z.contents = i(z.contents), z;
			}
			return null;
		}
		function m(w, f, _, C) {
			for (const z of c) {
				let L = null;
				if (z.provideValues(w, f).forEach((S) => {
					if (_ === S.name && S.description) {
						const A = je(S, r, s);
						A ? L = {
							contents: A,
							range: C
						} : L = null;
					}
				}), L) return L.contents = i(L.contents), L;
			}
			return null;
		}
		function p(w, f) {
			let _ = v(w);
			for (const C in yt) {
				let z = null;
				if (_ === "&" + C) {
					let L = yt[C].charCodeAt(0).toString(16).toUpperCase(), S = "U+";
					if (L.length < 4) {
						const y = 4 - L.length;
						let M = 0;
						for (; M < y;) S += "0", M += 1;
					}
					S += L;
					const A = ye("Character entity representing '{0}', unicode equivalent '{1}'", yt[C], S);
					A ? z = {
						contents: A,
						range: f
					} : z = null;
				}
				if (z) return z.contents = i(z.contents), z;
			}
			return null;
		}
		function b(w, f) {
			const _ = ge(e.getText(), f);
			let C = _.scan();
			for (; C !== U.EOS && (_.getTokenEnd() < a || _.getTokenEnd() === a && C !== w);) C = _.scan();
			return C === w && a <= _.getTokenEnd() ? {
				start: e.positionAt(_.getTokenOffset()),
				end: e.positionAt(_.getTokenEnd())
			} : null;
		}
		function g() {
			let w = a - 1, f = t.character;
			for (; w >= 0 && wt(l, w);) w--, f--;
			let _ = w + 1, C = f;
			for (; wt(l, _);) _++, C++;
			if (w >= 0 && l[w] === "&") {
				let z = null;
				return l[_] === ";" ? z = $.create(ie.create(t.line, f), ie.create(t.line, C + 1)) : z = $.create(ie.create(t.line, f), ie.create(t.line, C)), z;
			}
			return null;
		}
		function v(w) {
			let f = a - 1, _ = "&";
			for (; f >= 0 && wt(w, f);) f--;
			for (f = f + 1; wt(w, f);) _ += w[f], f += 1;
			return _ += ";", _;
		}
		if (o.endTagStart && a >= o.endTagStart) {
			const w = b(U.EndTag, o.endTagStart);
			return w ? u(o.tag, w) : null;
		}
		const T = b(U.StartTag, o.start);
		if (T) return u(o.tag, T);
		const k = b(U.AttributeName, o.start);
		if (k) {
			const w = o.tag;
			return d(w, e.getText(k), k);
		}
		const E = g();
		if (E) return p(l, E);
		function I(w, f) {
			const _ = ge(e.getText(), w);
			let C = _.scan(), z;
			for (; C !== U.EOS && _.getTokenEnd() <= f;) C = _.scan(), C === U.AttributeName && (z = _.getTokenText());
			return z;
		}
		const D = b(U.AttributeValue, o.start);
		if (D) {
			const w = o.tag, f = fu(e.getText(D)), _ = I(o.start, e.offsetAt(D.start));
			if (_) return m(w, _, f, D);
		}
		return null;
	}
	convertContents(e) {
		if (!this.doesSupportMarkdown()) {
			if (typeof e == "string") return e;
			if ("kind" in e) return {
				kind: "plaintext",
				value: e.value
			};
			if (Array.isArray(e)) e.map((t) => typeof t == "string" ? t : t.value);
			else return e.value;
		}
		return e;
	}
	doesSupportMarkdown() {
		if (!dn(this.supportsMarkdown)) {
			if (!dn(this.lsOptions.clientCapabilities)) return this.supportsMarkdown = !0, this.supportsMarkdown;
			const e = this.lsOptions.clientCapabilities?.textDocument?.hover?.contentFormat;
			this.supportsMarkdown = Array.isArray(e) && e.indexOf(Ie.Markdown) !== -1;
		}
		return this.supportsMarkdown;
	}
};
function fu(e) {
	return e.length <= 1 ? e.replace(/['"]/, "") : ((e[0] === "'" || e[0] === "\"") && (e = e.slice(1)), (e[e.length - 1] === "'" || e[e.length - 1] === "\"") && (e = e.slice(0, -1)), e);
}
function pu(e, t) {
	return e;
}
var go;
(function() {
	var e = [
		,
		,
		(function(r) {
			function i(o) {
				this.__parent = o, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
			}
			i.prototype.clone_empty = function() {
				var o = new i(this.__parent);
				return o.set_indent(this.__indent_count, this.__alignment_count), o;
			}, i.prototype.item = function(o) {
				return o < 0 ? this.__items[this.__items.length + o] : this.__items[o];
			}, i.prototype.has_match = function(o) {
				for (var l = this.__items.length - 1; l >= 0; l--) if (this.__items[l].match(o)) return !0;
				return !1;
			}, i.prototype.set_indent = function(o, l) {
				this.is_empty() && (this.__indent_count = o || 0, this.__alignment_count = l || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
			}, i.prototype._set_wrap_point = function() {
				this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
			}, i.prototype._should_wrap = function() {
				return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
			}, i.prototype._allow_wrap = function() {
				if (this._should_wrap()) {
					this.__parent.add_new_line();
					var o = this.__parent.current_line;
					return o.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), o.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), o.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, o.__items[0] === " " && (o.__items.splice(0, 1), o.__character_count -= 1), !0;
				}
				return !1;
			}, i.prototype.is_empty = function() {
				return this.__items.length === 0;
			}, i.prototype.last = function() {
				return this.is_empty() ? null : this.__items[this.__items.length - 1];
			}, i.prototype.push = function(o) {
				this.__items.push(o);
				var l = o.lastIndexOf(`
`);
				l !== -1 ? this.__character_count = o.length - l : this.__character_count += o.length;
			}, i.prototype.pop = function() {
				var o = null;
				return this.is_empty() || (o = this.__items.pop(), this.__character_count -= o.length), o;
			}, i.prototype._remove_indent = function() {
				this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
			}, i.prototype._remove_wrap_indent = function() {
				this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
			}, i.prototype.trim = function() {
				for (; this.last() === " ";) this.__items.pop(), this.__character_count -= 1;
			}, i.prototype.toString = function() {
				var o = "";
				return this.is_empty() ? this.__parent.indent_empty_lines && (o = this.__parent.get_indent_string(this.__indent_count)) : (o = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), o += this.__items.join("")), o;
			};
			function s(o, l) {
				this.__cache = [""], this.__indent_size = o.indent_size, this.__indent_string = o.indent_char, o.indent_with_tabs || (this.__indent_string = new Array(o.indent_size + 1).join(o.indent_char)), l = l || "", o.indent_level > 0 && (l = new Array(o.indent_level + 1).join(this.__indent_string)), this.__base_string = l, this.__base_string_length = l.length;
			}
			s.prototype.get_indent_size = function(o, l) {
				var c = this.__base_string_length;
				return l = l || 0, o < 0 && (c = 0), c += o * this.__indent_size, c += l, c;
			}, s.prototype.get_indent_string = function(o, l) {
				var c = this.__base_string;
				return l = l || 0, o < 0 && (o = 0, c = ""), l += o * this.__indent_size, this.__ensure_cache(l), c += this.__cache[l], c;
			}, s.prototype.__ensure_cache = function(o) {
				for (; o >= this.__cache.length;) this.__add_column();
			}, s.prototype.__add_column = function() {
				var o = this.__cache.length, l = 0, c = "";
				this.__indent_size && o >= this.__indent_size && (l = Math.floor(o / this.__indent_size), o -= l * this.__indent_size, c = new Array(l + 1).join(this.__indent_string)), o && (c += new Array(o + 1).join(" ")), this.__cache.push(c);
			};
			function a(o, l) {
				this.__indent_cache = new s(o, l), this.raw = !1, this._end_with_newline = o.end_with_newline, this.indent_size = o.indent_size, this.wrap_line_length = o.wrap_line_length, this.indent_empty_lines = o.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new i(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline();
			}
			a.prototype.__add_outputline = function() {
				this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
			}, a.prototype.get_line_number = function() {
				return this.__lines.length;
			}, a.prototype.get_indent_string = function(o, l) {
				return this.__indent_cache.get_indent_string(o, l);
			}, a.prototype.get_indent_size = function(o, l) {
				return this.__indent_cache.get_indent_size(o, l);
			}, a.prototype.is_empty = function() {
				return !this.previous_line && this.current_line.is_empty();
			}, a.prototype.add_new_line = function(o) {
				return this.is_empty() || !o && this.just_added_newline() ? !1 : (this.raw || this.__add_outputline(), !0);
			}, a.prototype.get_code = function(o) {
				this.trim(!0);
				var l = this.current_line.pop();
				l && (l[l.length - 1] === `
` && (l = l.replace(/\n+$/g, "")), this.current_line.push(l)), this._end_with_newline && this.__add_outputline();
				var c = this.__lines.join(`
`);
				return o !== `
` && (c = c.replace(/[\n]/g, o)), c;
			}, a.prototype.set_wrap_point = function() {
				this.current_line._set_wrap_point();
			}, a.prototype.set_indent = function(o, l) {
				return o = o || 0, l = l || 0, this.next_line.set_indent(o, l), this.__lines.length > 1 ? (this.current_line.set_indent(o, l), !0) : (this.current_line.set_indent(), !1);
			}, a.prototype.add_raw_token = function(o) {
				for (var l = 0; l < o.newlines; l++) this.__add_outputline();
				this.current_line.set_indent(-1), this.current_line.push(o.whitespace_before), this.current_line.push(o.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1;
			}, a.prototype.add_token = function(o) {
				this.__add_space_before_token(), this.current_line.push(o), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap();
			}, a.prototype.__add_space_before_token = function() {
				this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
			}, a.prototype.remove_indent = function(o) {
				for (var l = this.__lines.length; o < l;) this.__lines[o]._remove_indent(), o++;
				this.current_line._remove_wrap_indent();
			}, a.prototype.trim = function(o) {
				for (o = o === void 0 ? !1 : o, this.current_line.trim(); o && this.__lines.length > 1 && this.current_line.is_empty();) this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
				this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
			}, a.prototype.just_added_newline = function() {
				return this.current_line.is_empty();
			}, a.prototype.just_added_blankline = function() {
				return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
			}, a.prototype.ensure_empty_line_above = function(o, l) {
				for (var c = this.__lines.length - 2; c >= 0;) {
					var u = this.__lines[c];
					if (u.is_empty()) break;
					if (u.item(0).indexOf(o) !== 0 && u.item(-1) !== l) {
						this.__lines.splice(c + 1, 0, new i(this)), this.previous_line = this.__lines[this.__lines.length - 2];
						break;
					}
					c--;
				}
			}, r.exports.Output = a;
		}),
		,
		,
		,
		(function(r) {
			function i(o, l) {
				this.raw_options = s(o, l), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", [
					"auto",
					"none",
					"angular",
					"django",
					"erb",
					"handlebars",
					"php",
					"smarty"
				], ["auto"]);
			}
			i.prototype._get_array = function(o, l) {
				var c = this.raw_options[o], u = l || [];
				return typeof c == "object" ? c !== null && typeof c.concat == "function" && (u = c.concat()) : typeof c == "string" && (u = c.split(/[^a-zA-Z0-9_\/\-]+/)), u;
			}, i.prototype._get_boolean = function(o, l) {
				var c = this.raw_options[o];
				return c === void 0 ? !!l : !!c;
			}, i.prototype._get_characters = function(o, l) {
				var c = this.raw_options[o], u = l || "";
				return typeof c == "string" && (u = c.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), u;
			}, i.prototype._get_number = function(o, l) {
				var c = this.raw_options[o];
				l = parseInt(l, 10), isNaN(l) && (l = 0);
				var u = parseInt(c, 10);
				return isNaN(u) && (u = l), u;
			}, i.prototype._get_selection = function(o, l, c) {
				var u = this._get_selection_list(o, l, c);
				if (u.length !== 1) throw new Error("Invalid Option Value: The option '" + o + `' can only be one of the following values:
` + l + `
You passed in: '` + this.raw_options[o] + "'");
				return u[0];
			}, i.prototype._get_selection_list = function(o, l, c) {
				if (!l || l.length === 0) throw new Error("Selection list cannot be empty.");
				if (c = c || [l[0]], !this._is_valid_selection(c, l)) throw new Error("Invalid Default Value!");
				var u = this._get_array(o, c);
				if (!this._is_valid_selection(u, l)) throw new Error("Invalid Option Value: The option '" + o + `' can contain only the following values:
` + l + `
You passed in: '` + this.raw_options[o] + "'");
				return u;
			}, i.prototype._is_valid_selection = function(o, l) {
				return o.length && l.length && !o.some(function(c) {
					return l.indexOf(c) === -1;
				});
			};
			function s(o, l) {
				var c = {};
				o = a(o);
				var u;
				for (u in o) u !== l && (c[u] = o[u]);
				if (l && o[l]) for (u in o[l]) c[u] = o[l][u];
				return c;
			}
			function a(o) {
				var l = {}, c;
				for (c in o) {
					var u = c.replace(/-/g, "_");
					l[u] = o[c];
				}
				return l;
			}
			r.exports.Options = i, r.exports.normalizeOpts = a, r.exports.mergeOpts = s;
		}),
		,
		(function(r) {
			var i = RegExp.prototype.hasOwnProperty("sticky");
			function s(a) {
				this.__input = a || "", this.__input_length = this.__input.length, this.__position = 0;
			}
			s.prototype.restart = function() {
				this.__position = 0;
			}, s.prototype.back = function() {
				this.__position > 0 && (this.__position -= 1);
			}, s.prototype.hasNext = function() {
				return this.__position < this.__input_length;
			}, s.prototype.next = function() {
				var a = null;
				return this.hasNext() && (a = this.__input.charAt(this.__position), this.__position += 1), a;
			}, s.prototype.peek = function(a) {
				var o = null;
				return a = a || 0, a += this.__position, a >= 0 && a < this.__input_length && (o = this.__input.charAt(a)), o;
			}, s.prototype.__match = function(a, o) {
				a.lastIndex = o;
				var l = a.exec(this.__input);
				return l && !(i && a.sticky) && l.index !== o && (l = null), l;
			}, s.prototype.test = function(a, o) {
				return o = o || 0, o += this.__position, o >= 0 && o < this.__input_length ? !!this.__match(a, o) : !1;
			}, s.prototype.testChar = function(a, o) {
				var l = this.peek(o);
				return a.lastIndex = 0, l !== null && a.test(l);
			}, s.prototype.match = function(a) {
				var o = this.__match(a, this.__position);
				return o ? this.__position += o[0].length : o = null, o;
			}, s.prototype.read = function(a, o, l) {
				var c = "", u;
				return a && (u = this.match(a), u && (c += u[0])), o && (u || !a) && (c += this.readUntil(o, l)), c;
			}, s.prototype.readUntil = function(a, o) {
				var l = "", c = this.__position;
				a.lastIndex = this.__position;
				var u = a.exec(this.__input);
				return u ? (c = u.index, o && (c += u[0].length)) : c = this.__input_length, l = this.__input.substring(this.__position, c), this.__position = c, l;
			}, s.prototype.readUntilAfter = function(a) {
				return this.readUntil(a, !0);
			}, s.prototype.get_regexp = function(a, o) {
				var l = null, c = "g";
				return o && i && (c = "y"), typeof a == "string" && a !== "" ? l = new RegExp(a, c) : a && (l = new RegExp(a.source, c)), l;
			}, s.prototype.get_literal_regexp = function(a) {
				return RegExp(a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
			}, s.prototype.peekUntilAfter = function(a) {
				var o = this.__position, l = this.readUntilAfter(a);
				return this.__position = o, l;
			}, s.prototype.lookBack = function(a) {
				var o = this.__position - 1;
				return o >= a.length && this.__input.substring(o - a.length, o).toLowerCase() === a;
			}, r.exports.InputScanner = s;
		}),
		,
		,
		,
		,
		(function(r) {
			function i(s, a) {
				s = typeof s == "string" ? s : s.source, a = typeof a == "string" ? a : a.source, this.__directives_block_pattern = new RegExp(s + / beautify( \w+[:]\w+)+ /.source + a, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(s + /\sbeautify\signore:end\s/.source + a, "g");
			}
			i.prototype.get_directives = function(s) {
				if (!s.match(this.__directives_block_pattern)) return null;
				var a = {};
				this.__directive_pattern.lastIndex = 0;
				for (var o = this.__directive_pattern.exec(s); o;) a[o[1]] = o[2], o = this.__directive_pattern.exec(s);
				return a;
			}, i.prototype.readIgnored = function(s) {
				return s.readUntilAfter(this.__directives_end_ignore_pattern);
			}, r.exports.Directives = i;
		}),
		,
		(function(r, i, s) {
			var a = s(16).Beautifier, o = s(17).Options;
			function l(c, u) {
				return new a(c, u).beautify();
			}
			r.exports = l, r.exports.defaultOptions = function() {
				return new o();
			};
		}),
		(function(r, i, s) {
			var a = s(17).Options, o = s(2).Output, l = s(8).InputScanner, c = s(13).Directives, u = new c(/\/\*/, /\*\//), d = /\r\n|[\r\n]/, m = /\r\n|[\r\n]/g, p = /\s/, b = /(?:\s|\n)+/g, g = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g, v = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
			function T(k, E) {
				this._source_text = k || "", this._options = new a(E), this._ch = null, this._input = null, this.NESTED_AT_RULE = {
					page: !0,
					"font-face": !0,
					keyframes: !0,
					media: !0,
					supports: !0,
					document: !0
				}, this.CONDITIONAL_GROUP_RULE = {
					media: !0,
					supports: !0,
					document: !0
				}, this.NON_SEMICOLON_NEWLINE_PROPERTY = ["grid-template-areas", "grid-template"];
			}
			T.prototype.eatString = function(k) {
				var E = "";
				for (this._ch = this._input.next(); this._ch;) {
					if (E += this._ch, this._ch === "\\") E += this._input.next();
					else if (k.indexOf(this._ch) !== -1 || this._ch === `
`) break;
					this._ch = this._input.next();
				}
				return E;
			}, T.prototype.eatWhitespace = function(k) {
				for (var E = p.test(this._input.peek()), I = 0; p.test(this._input.peek());) this._ch = this._input.next(), k && this._ch === `
` && (I === 0 || I < this._options.max_preserve_newlines) && (I++, this._output.add_new_line(!0));
				return E;
			}, T.prototype.foundNestedPseudoClass = function() {
				for (var k = 0, E = 1, I = this._input.peek(E); I;) {
					if (I === "{") return !0;
					if (I === "(") k += 1;
					else if (I === ")") {
						if (k === 0) return !1;
						k -= 1;
					} else if (I === ";" || I === "}") return !1;
					E++, I = this._input.peek(E);
				}
				return !1;
			}, T.prototype.print_string = function(k) {
				this._output.set_indent(this._indentLevel), this._output.non_breaking_space = !0, this._output.add_token(k);
			}, T.prototype.preserveSingleSpace = function(k) {
				k && (this._output.space_before_token = !0);
			}, T.prototype.indent = function() {
				this._indentLevel++;
			}, T.prototype.outdent = function() {
				this._indentLevel > 0 && this._indentLevel--;
			}, T.prototype.beautify = function() {
				if (this._options.disabled) return this._source_text;
				var k = this._source_text, E = this._options.eol;
				E === "auto" && (E = `
`, k && d.test(k || "") && (E = k.match(d)[0])), k = k.replace(m, `
`);
				var I = k.match(/^[\t ]*/)[0];
				this._output = new o(this._options, I), this._input = new l(k), this._indentLevel = 0, this._nestedLevel = 0, this._ch = null;
				for (var D = 0, w = !1, f = !1, _ = !1, C = !1, z = !1, L = this._ch, S = !1, A, y, M; A = this._input.read(b), y = A !== "", M = L, this._ch = this._input.next(), this._ch === "\\" && this._input.hasNext() && (this._ch += this._input.next()), L = this._ch, this._ch;) if (this._ch === "/" && this._input.peek() === "*") {
					this._output.add_new_line(), this._input.back();
					var N = this._input.read(g), H = u.get_directives(N);
					H && H.ignore === "start" && (N += u.readIgnored(this._input)), this.print_string(N), this.eatWhitespace(!0), this._output.add_new_line();
				} else if (this._ch === "/" && this._input.peek() === "/") this._output.space_before_token = !0, this._input.back(), this.print_string(this._input.read(v)), this.eatWhitespace(!0);
				else if (this._ch === "$") {
					this.preserveSingleSpace(y), this.print_string(this._ch);
					var q = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
					q.match(/[ :]$/) && (q = this.eatString(": ").replace(/\s+$/, ""), this.print_string(q), this._output.space_before_token = !0), D === 0 && q.indexOf(":") !== -1 && (f = !0, this.indent());
				} else if (this._ch === "@") if (this.preserveSingleSpace(y), this._input.peek() === "{") this.print_string(this._ch + this.eatString("}"));
				else {
					this.print_string(this._ch);
					var P = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
					P.match(/[ :]$/) && (P = this.eatString(": ").replace(/\s+$/, ""), this.print_string(P), this._output.space_before_token = !0), D === 0 && P.indexOf(":") !== -1 ? (f = !0, this.indent()) : P in this.NESTED_AT_RULE ? (this._nestedLevel += 1, P in this.CONDITIONAL_GROUP_RULE && (_ = !0)) : D === 0 && !f && (C = !0);
				}
				else if (this._ch === "#" && this._input.peek() === "{") this.preserveSingleSpace(y), this.print_string(this._ch + this.eatString("}"));
				else if (this._ch === "{") f && (f = !1, this.outdent()), C = !1, _ ? (_ = !1, w = this._indentLevel >= this._nestedLevel) : w = this._indentLevel >= this._nestedLevel - 1, this._options.newline_between_rules && w && this._output.previous_line && this._output.previous_line.item(-1) !== "{" && this._output.ensure_empty_line_above("/", ","), this._output.space_before_token = !0, this._options.brace_style === "expand" ? (this._output.add_new_line(), this.print_string(this._ch), this.indent(), this._output.set_indent(this._indentLevel)) : (M === "(" ? this._output.space_before_token = !1 : M !== "," && this.indent(), this.print_string(this._ch)), this.eatWhitespace(!0), this._output.add_new_line();
				else if (this._ch === "}") this.outdent(), this._output.add_new_line(), M === "{" && this._output.trim(!0), f && (this.outdent(), f = !1), this.print_string(this._ch), w = !1, this._nestedLevel && this._nestedLevel--, this.eatWhitespace(!0), this._output.add_new_line(), this._options.newline_between_rules && !this._output.just_added_blankline() && this._input.peek() !== "}" && this._output.add_new_line(!0), this._input.peek() === ")" && (this._output.trim(!0), this._options.brace_style === "expand" && this._output.add_new_line(!0));
				else if (this._ch === ":") {
					for (var W = 0; W < this.NON_SEMICOLON_NEWLINE_PROPERTY.length; W++) if (this._input.lookBack(this.NON_SEMICOLON_NEWLINE_PROPERTY[W])) {
						S = !0;
						break;
					}
					(w || _) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !C && D === 0 ? (this.print_string(":"), f || (f = !0, this._output.space_before_token = !0, this.eatWhitespace(!0), this.indent())) : (this._input.lookBack(" ") && (this._output.space_before_token = !0), this._input.peek() === ":" ? (this._ch = this._input.next(), this.print_string("::")) : this.print_string(":"));
				} else if (this._ch === "\"" || this._ch === "'") {
					var G = M === "\"" || M === "'";
					this.preserveSingleSpace(G || y), this.print_string(this._ch + this.eatString(this._ch)), this.eatWhitespace(!0);
				} else if (this._ch === ";") S = !1, D === 0 ? (f && (this.outdent(), f = !1), C = !1, this.print_string(this._ch), this.eatWhitespace(!0), this._input.peek() !== "/" && this._output.add_new_line()) : (this.print_string(this._ch), this.eatWhitespace(!0), this._output.space_before_token = !0);
				else if (this._ch === "(") if (this._input.lookBack("url")) this.print_string(this._ch), this.eatWhitespace(), D++, this.indent(), this._ch = this._input.next(), this._ch === ")" || this._ch === "\"" || this._ch === "'" ? this._input.back() : this._ch && (this.print_string(this._ch + this.eatString(")")), D && (D--, this.outdent()));
				else {
					var Z = !1;
					this._input.lookBack("with") && (Z = !0), this.preserveSingleSpace(y || Z), this.print_string(this._ch), f && M === "$" && this._options.selector_separator_newline ? (this._output.add_new_line(), z = !0) : (this.eatWhitespace(), D++, this.indent());
				}
				else if (this._ch === ")") D && (D--, this.outdent()), z && this._input.peek() === ";" && this._options.selector_separator_newline && (z = !1, this.outdent(), this._output.add_new_line()), this.print_string(this._ch);
				else if (this._ch === ",") this.print_string(this._ch), this.eatWhitespace(!0), this._options.selector_separator_newline && (!f || z) && D === 0 && !C ? this._output.add_new_line() : this._output.space_before_token = !0;
				else if ((this._ch === ">" || this._ch === "+" || this._ch === "~") && !f && D === 0) this._options.space_around_combinator ? (this._output.space_before_token = !0, this.print_string(this._ch), this._output.space_before_token = !0) : (this.print_string(this._ch), this.eatWhitespace(), this._ch && p.test(this._ch) && (this._ch = ""));
				else if (this._ch === "]") this.print_string(this._ch);
				else if (this._ch === "[") this.preserveSingleSpace(y), this.print_string(this._ch);
				else if (this._ch === "=") this.eatWhitespace(), this.print_string("="), p.test(this._ch) && (this._ch = "");
				else if (this._ch === "!" && !this._input.lookBack("\\")) this._output.space_before_token = !0, this.print_string(this._ch);
				else {
					var ae = M === "\"" || M === "'";
					this.preserveSingleSpace(ae || y), this.print_string(this._ch), !this._output.just_added_newline() && this._input.peek() === `
` && S && this._output.add_new_line();
				}
				return this._output.get_code(E);
			}, r.exports.Beautifier = T;
		}),
		(function(r, i, s) {
			var a = s(6).Options;
			function o(l) {
				a.call(this, l, "css"), this.selector_separator_newline = this._get_boolean("selector_separator_newline", !0), this.newline_between_rules = this._get_boolean("newline_between_rules", !0);
				var c = this._get_boolean("space_around_selector_separator");
				this.space_around_combinator = this._get_boolean("space_around_combinator") || c;
				var u = this._get_selection_list("brace_style", [
					"collapse",
					"expand",
					"end-expand",
					"none",
					"preserve-inline"
				]);
				this.brace_style = "collapse";
				for (var d = 0; d < u.length; d++) u[d] !== "expand" ? this.brace_style = "collapse" : this.brace_style = u[d];
			}
			o.prototype = new a(), r.exports.Options = o;
		})
	], t = {};
	function n(r) {
		var i = t[r];
		if (i !== void 0) return i.exports;
		var s = t[r] = { exports: {} };
		return e[r](s, s.exports, n), s.exports;
	}
	go = n(15);
})();
var gu = go, bo;
(function() {
	var e = [
		,
		,
		(function(r) {
			function i(o) {
				this.__parent = o, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
			}
			i.prototype.clone_empty = function() {
				var o = new i(this.__parent);
				return o.set_indent(this.__indent_count, this.__alignment_count), o;
			}, i.prototype.item = function(o) {
				return o < 0 ? this.__items[this.__items.length + o] : this.__items[o];
			}, i.prototype.has_match = function(o) {
				for (var l = this.__items.length - 1; l >= 0; l--) if (this.__items[l].match(o)) return !0;
				return !1;
			}, i.prototype.set_indent = function(o, l) {
				this.is_empty() && (this.__indent_count = o || 0, this.__alignment_count = l || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
			}, i.prototype._set_wrap_point = function() {
				this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
			}, i.prototype._should_wrap = function() {
				return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
			}, i.prototype._allow_wrap = function() {
				if (this._should_wrap()) {
					this.__parent.add_new_line();
					var o = this.__parent.current_line;
					return o.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), o.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), o.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, o.__items[0] === " " && (o.__items.splice(0, 1), o.__character_count -= 1), !0;
				}
				return !1;
			}, i.prototype.is_empty = function() {
				return this.__items.length === 0;
			}, i.prototype.last = function() {
				return this.is_empty() ? null : this.__items[this.__items.length - 1];
			}, i.prototype.push = function(o) {
				this.__items.push(o);
				var l = o.lastIndexOf(`
`);
				l !== -1 ? this.__character_count = o.length - l : this.__character_count += o.length;
			}, i.prototype.pop = function() {
				var o = null;
				return this.is_empty() || (o = this.__items.pop(), this.__character_count -= o.length), o;
			}, i.prototype._remove_indent = function() {
				this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
			}, i.prototype._remove_wrap_indent = function() {
				this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
			}, i.prototype.trim = function() {
				for (; this.last() === " ";) this.__items.pop(), this.__character_count -= 1;
			}, i.prototype.toString = function() {
				var o = "";
				return this.is_empty() ? this.__parent.indent_empty_lines && (o = this.__parent.get_indent_string(this.__indent_count)) : (o = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), o += this.__items.join("")), o;
			};
			function s(o, l) {
				this.__cache = [""], this.__indent_size = o.indent_size, this.__indent_string = o.indent_char, o.indent_with_tabs || (this.__indent_string = new Array(o.indent_size + 1).join(o.indent_char)), l = l || "", o.indent_level > 0 && (l = new Array(o.indent_level + 1).join(this.__indent_string)), this.__base_string = l, this.__base_string_length = l.length;
			}
			s.prototype.get_indent_size = function(o, l) {
				var c = this.__base_string_length;
				return l = l || 0, o < 0 && (c = 0), c += o * this.__indent_size, c += l, c;
			}, s.prototype.get_indent_string = function(o, l) {
				var c = this.__base_string;
				return l = l || 0, o < 0 && (o = 0, c = ""), l += o * this.__indent_size, this.__ensure_cache(l), c += this.__cache[l], c;
			}, s.prototype.__ensure_cache = function(o) {
				for (; o >= this.__cache.length;) this.__add_column();
			}, s.prototype.__add_column = function() {
				var o = this.__cache.length, l = 0, c = "";
				this.__indent_size && o >= this.__indent_size && (l = Math.floor(o / this.__indent_size), o -= l * this.__indent_size, c = new Array(l + 1).join(this.__indent_string)), o && (c += new Array(o + 1).join(" ")), this.__cache.push(c);
			};
			function a(o, l) {
				this.__indent_cache = new s(o, l), this.raw = !1, this._end_with_newline = o.end_with_newline, this.indent_size = o.indent_size, this.wrap_line_length = o.wrap_line_length, this.indent_empty_lines = o.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new i(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline();
			}
			a.prototype.__add_outputline = function() {
				this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
			}, a.prototype.get_line_number = function() {
				return this.__lines.length;
			}, a.prototype.get_indent_string = function(o, l) {
				return this.__indent_cache.get_indent_string(o, l);
			}, a.prototype.get_indent_size = function(o, l) {
				return this.__indent_cache.get_indent_size(o, l);
			}, a.prototype.is_empty = function() {
				return !this.previous_line && this.current_line.is_empty();
			}, a.prototype.add_new_line = function(o) {
				return this.is_empty() || !o && this.just_added_newline() ? !1 : (this.raw || this.__add_outputline(), !0);
			}, a.prototype.get_code = function(o) {
				this.trim(!0);
				var l = this.current_line.pop();
				l && (l[l.length - 1] === `
` && (l = l.replace(/\n+$/g, "")), this.current_line.push(l)), this._end_with_newline && this.__add_outputline();
				var c = this.__lines.join(`
`);
				return o !== `
` && (c = c.replace(/[\n]/g, o)), c;
			}, a.prototype.set_wrap_point = function() {
				this.current_line._set_wrap_point();
			}, a.prototype.set_indent = function(o, l) {
				return o = o || 0, l = l || 0, this.next_line.set_indent(o, l), this.__lines.length > 1 ? (this.current_line.set_indent(o, l), !0) : (this.current_line.set_indent(), !1);
			}, a.prototype.add_raw_token = function(o) {
				for (var l = 0; l < o.newlines; l++) this.__add_outputline();
				this.current_line.set_indent(-1), this.current_line.push(o.whitespace_before), this.current_line.push(o.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1;
			}, a.prototype.add_token = function(o) {
				this.__add_space_before_token(), this.current_line.push(o), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap();
			}, a.prototype.__add_space_before_token = function() {
				this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
			}, a.prototype.remove_indent = function(o) {
				for (var l = this.__lines.length; o < l;) this.__lines[o]._remove_indent(), o++;
				this.current_line._remove_wrap_indent();
			}, a.prototype.trim = function(o) {
				for (o = o === void 0 ? !1 : o, this.current_line.trim(); o && this.__lines.length > 1 && this.current_line.is_empty();) this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
				this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
			}, a.prototype.just_added_newline = function() {
				return this.current_line.is_empty();
			}, a.prototype.just_added_blankline = function() {
				return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
			}, a.prototype.ensure_empty_line_above = function(o, l) {
				for (var c = this.__lines.length - 2; c >= 0;) {
					var u = this.__lines[c];
					if (u.is_empty()) break;
					if (u.item(0).indexOf(o) !== 0 && u.item(-1) !== l) {
						this.__lines.splice(c + 1, 0, new i(this)), this.previous_line = this.__lines[this.__lines.length - 2];
						break;
					}
					c--;
				}
			}, r.exports.Output = a;
		}),
		(function(r) {
			function i(s, a, o, l) {
				this.type = s, this.text = a, this.comments_before = null, this.newlines = o || 0, this.whitespace_before = l || "", this.parent = null, this.next = null, this.previous = null, this.opened = null, this.closed = null, this.directives = null;
			}
			r.exports.Token = i;
		}),
		,
		,
		(function(r) {
			function i(o, l) {
				this.raw_options = s(o, l), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", [
					"auto",
					"none",
					"angular",
					"django",
					"erb",
					"handlebars",
					"php",
					"smarty"
				], ["auto"]);
			}
			i.prototype._get_array = function(o, l) {
				var c = this.raw_options[o], u = l || [];
				return typeof c == "object" ? c !== null && typeof c.concat == "function" && (u = c.concat()) : typeof c == "string" && (u = c.split(/[^a-zA-Z0-9_\/\-]+/)), u;
			}, i.prototype._get_boolean = function(o, l) {
				var c = this.raw_options[o];
				return c === void 0 ? !!l : !!c;
			}, i.prototype._get_characters = function(o, l) {
				var c = this.raw_options[o], u = l || "";
				return typeof c == "string" && (u = c.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), u;
			}, i.prototype._get_number = function(o, l) {
				var c = this.raw_options[o];
				l = parseInt(l, 10), isNaN(l) && (l = 0);
				var u = parseInt(c, 10);
				return isNaN(u) && (u = l), u;
			}, i.prototype._get_selection = function(o, l, c) {
				var u = this._get_selection_list(o, l, c);
				if (u.length !== 1) throw new Error("Invalid Option Value: The option '" + o + `' can only be one of the following values:
` + l + `
You passed in: '` + this.raw_options[o] + "'");
				return u[0];
			}, i.prototype._get_selection_list = function(o, l, c) {
				if (!l || l.length === 0) throw new Error("Selection list cannot be empty.");
				if (c = c || [l[0]], !this._is_valid_selection(c, l)) throw new Error("Invalid Default Value!");
				var u = this._get_array(o, c);
				if (!this._is_valid_selection(u, l)) throw new Error("Invalid Option Value: The option '" + o + `' can contain only the following values:
` + l + `
You passed in: '` + this.raw_options[o] + "'");
				return u;
			}, i.prototype._is_valid_selection = function(o, l) {
				return o.length && l.length && !o.some(function(c) {
					return l.indexOf(c) === -1;
				});
			};
			function s(o, l) {
				var c = {};
				o = a(o);
				var u;
				for (u in o) u !== l && (c[u] = o[u]);
				if (l && o[l]) for (u in o[l]) c[u] = o[l][u];
				return c;
			}
			function a(o) {
				var l = {}, c;
				for (c in o) {
					var u = c.replace(/-/g, "_");
					l[u] = o[c];
				}
				return l;
			}
			r.exports.Options = i, r.exports.normalizeOpts = a, r.exports.mergeOpts = s;
		}),
		,
		(function(r) {
			var i = RegExp.prototype.hasOwnProperty("sticky");
			function s(a) {
				this.__input = a || "", this.__input_length = this.__input.length, this.__position = 0;
			}
			s.prototype.restart = function() {
				this.__position = 0;
			}, s.prototype.back = function() {
				this.__position > 0 && (this.__position -= 1);
			}, s.prototype.hasNext = function() {
				return this.__position < this.__input_length;
			}, s.prototype.next = function() {
				var a = null;
				return this.hasNext() && (a = this.__input.charAt(this.__position), this.__position += 1), a;
			}, s.prototype.peek = function(a) {
				var o = null;
				return a = a || 0, a += this.__position, a >= 0 && a < this.__input_length && (o = this.__input.charAt(a)), o;
			}, s.prototype.__match = function(a, o) {
				a.lastIndex = o;
				var l = a.exec(this.__input);
				return l && !(i && a.sticky) && l.index !== o && (l = null), l;
			}, s.prototype.test = function(a, o) {
				return o = o || 0, o += this.__position, o >= 0 && o < this.__input_length ? !!this.__match(a, o) : !1;
			}, s.prototype.testChar = function(a, o) {
				var l = this.peek(o);
				return a.lastIndex = 0, l !== null && a.test(l);
			}, s.prototype.match = function(a) {
				var o = this.__match(a, this.__position);
				return o ? this.__position += o[0].length : o = null, o;
			}, s.prototype.read = function(a, o, l) {
				var c = "", u;
				return a && (u = this.match(a), u && (c += u[0])), o && (u || !a) && (c += this.readUntil(o, l)), c;
			}, s.prototype.readUntil = function(a, o) {
				var l = "", c = this.__position;
				a.lastIndex = this.__position;
				var u = a.exec(this.__input);
				return u ? (c = u.index, o && (c += u[0].length)) : c = this.__input_length, l = this.__input.substring(this.__position, c), this.__position = c, l;
			}, s.prototype.readUntilAfter = function(a) {
				return this.readUntil(a, !0);
			}, s.prototype.get_regexp = function(a, o) {
				var l = null, c = "g";
				return o && i && (c = "y"), typeof a == "string" && a !== "" ? l = new RegExp(a, c) : a && (l = new RegExp(a.source, c)), l;
			}, s.prototype.get_literal_regexp = function(a) {
				return RegExp(a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
			}, s.prototype.peekUntilAfter = function(a) {
				var o = this.__position, l = this.readUntilAfter(a);
				return this.__position = o, l;
			}, s.prototype.lookBack = function(a) {
				var o = this.__position - 1;
				return o >= a.length && this.__input.substring(o - a.length, o).toLowerCase() === a;
			}, r.exports.InputScanner = s;
		}),
		(function(r, i, s) {
			var a = s(8).InputScanner, o = s(3).Token, l = s(10).TokenStream, c = s(11).WhitespacePattern, u = {
				START: "TK_START",
				RAW: "TK_RAW",
				EOF: "TK_EOF"
			}, d = function(m, p) {
				this._input = new a(m), this._options = p || {}, this.__tokens = null, this._patterns = {}, this._patterns.whitespace = new c(this._input);
			};
			d.prototype.tokenize = function() {
				this._input.restart(), this.__tokens = new l(), this._reset();
				for (var m, p = new o(u.START, ""), b = null, g = [], v = new l(); p.type !== u.EOF;) {
					for (m = this._get_next_token(p, b); this._is_comment(m);) v.add(m), m = this._get_next_token(p, b);
					v.isEmpty() || (m.comments_before = v, v = new l()), m.parent = b, this._is_opening(m) ? (g.push(b), b = m) : b && this._is_closing(m, b) && (m.opened = b, b.closed = m, b = g.pop(), m.parent = b), m.previous = p, p.next = m, this.__tokens.add(m), p = m;
				}
				return this.__tokens;
			}, d.prototype._is_first_token = function() {
				return this.__tokens.isEmpty();
			}, d.prototype._reset = function() {}, d.prototype._get_next_token = function(m, p) {
				this._readWhitespace();
				var b = this._input.read(/.+/g);
				return b ? this._create_token(u.RAW, b) : this._create_token(u.EOF, "");
			}, d.prototype._is_comment = function(m) {
				return !1;
			}, d.prototype._is_opening = function(m) {
				return !1;
			}, d.prototype._is_closing = function(m, p) {
				return !1;
			}, d.prototype._create_token = function(m, p) {
				return new o(m, p, this._patterns.whitespace.newline_count, this._patterns.whitespace.whitespace_before_token);
			}, d.prototype._readWhitespace = function() {
				return this._patterns.whitespace.read();
			}, r.exports.Tokenizer = d, r.exports.TOKEN = u;
		}),
		(function(r) {
			function i(s) {
				this.__tokens = [], this.__tokens_length = this.__tokens.length, this.__position = 0, this.__parent_token = s;
			}
			i.prototype.restart = function() {
				this.__position = 0;
			}, i.prototype.isEmpty = function() {
				return this.__tokens_length === 0;
			}, i.prototype.hasNext = function() {
				return this.__position < this.__tokens_length;
			}, i.prototype.next = function() {
				var s = null;
				return this.hasNext() && (s = this.__tokens[this.__position], this.__position += 1), s;
			}, i.prototype.peek = function(s) {
				var a = null;
				return s = s || 0, s += this.__position, s >= 0 && s < this.__tokens_length && (a = this.__tokens[s]), a;
			}, i.prototype.add = function(s) {
				this.__parent_token && (s.parent = this.__parent_token), this.__tokens.push(s), this.__tokens_length += 1;
			}, r.exports.TokenStream = i;
		}),
		(function(r, i, s) {
			var a = s(12).Pattern;
			function o(l, c) {
				a.call(this, l, c), c ? this._line_regexp = this._input.get_regexp(c._line_regexp) : this.__set_whitespace_patterns("", ""), this.newline_count = 0, this.whitespace_before_token = "";
			}
			o.prototype = new a(), o.prototype.__set_whitespace_patterns = function(l, c) {
				l += "\\t ", c += "\\n\\r", this._match_pattern = this._input.get_regexp("[" + l + c + "]+", !0), this._newline_regexp = this._input.get_regexp("\\r\\n|[" + c + "]");
			}, o.prototype.read = function() {
				this.newline_count = 0, this.whitespace_before_token = "";
				var l = this._input.read(this._match_pattern);
				if (l === " ") this.whitespace_before_token = " ";
				else if (l) {
					var c = this.__split(this._newline_regexp, l);
					this.newline_count = c.length - 1, this.whitespace_before_token = c[this.newline_count];
				}
				return l;
			}, o.prototype.matching = function(l, c) {
				var u = this._create();
				return u.__set_whitespace_patterns(l, c), u._update(), u;
			}, o.prototype._create = function() {
				return new o(this._input, this);
			}, o.prototype.__split = function(l, c) {
				l.lastIndex = 0;
				for (var u = 0, d = [], m = l.exec(c); m;) d.push(c.substring(u, m.index)), u = m.index + m[0].length, m = l.exec(c);
				return u < c.length ? d.push(c.substring(u, c.length)) : d.push(""), d;
			}, r.exports.WhitespacePattern = o;
		}),
		(function(r) {
			function i(s, a) {
				this._input = s, this._starting_pattern = null, this._match_pattern = null, this._until_pattern = null, this._until_after = !1, a && (this._starting_pattern = this._input.get_regexp(a._starting_pattern, !0), this._match_pattern = this._input.get_regexp(a._match_pattern, !0), this._until_pattern = this._input.get_regexp(a._until_pattern), this._until_after = a._until_after);
			}
			i.prototype.read = function() {
				var s = this._input.read(this._starting_pattern);
				return (!this._starting_pattern || s) && (s += this._input.read(this._match_pattern, this._until_pattern, this._until_after)), s;
			}, i.prototype.read_match = function() {
				return this._input.match(this._match_pattern);
			}, i.prototype.until_after = function(s) {
				var a = this._create();
				return a._until_after = !0, a._until_pattern = this._input.get_regexp(s), a._update(), a;
			}, i.prototype.until = function(s) {
				var a = this._create();
				return a._until_after = !1, a._until_pattern = this._input.get_regexp(s), a._update(), a;
			}, i.prototype.starting_with = function(s) {
				var a = this._create();
				return a._starting_pattern = this._input.get_regexp(s, !0), a._update(), a;
			}, i.prototype.matching = function(s) {
				var a = this._create();
				return a._match_pattern = this._input.get_regexp(s, !0), a._update(), a;
			}, i.prototype._create = function() {
				return new i(this._input, this);
			}, i.prototype._update = function() {}, r.exports.Pattern = i;
		}),
		(function(r) {
			function i(s, a) {
				s = typeof s == "string" ? s : s.source, a = typeof a == "string" ? a : a.source, this.__directives_block_pattern = new RegExp(s + / beautify( \w+[:]\w+)+ /.source + a, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(s + /\sbeautify\signore:end\s/.source + a, "g");
			}
			i.prototype.get_directives = function(s) {
				if (!s.match(this.__directives_block_pattern)) return null;
				var a = {};
				this.__directive_pattern.lastIndex = 0;
				for (var o = this.__directive_pattern.exec(s); o;) a[o[1]] = o[2], o = this.__directive_pattern.exec(s);
				return a;
			}, i.prototype.readIgnored = function(s) {
				return s.readUntilAfter(this.__directives_end_ignore_pattern);
			}, r.exports.Directives = i;
		}),
		(function(r, i, s) {
			var a = s(12).Pattern, o = {
				django: !1,
				erb: !1,
				handlebars: !1,
				php: !1,
				smarty: !1,
				angular: !1
			};
			function l(c, u) {
				a.call(this, c, u), this.__template_pattern = null, this._disabled = Object.assign({}, o), this._excluded = Object.assign({}, o), u && (this.__template_pattern = this._input.get_regexp(u.__template_pattern), this._excluded = Object.assign(this._excluded, u._excluded), this._disabled = Object.assign(this._disabled, u._disabled));
				var d = new a(c);
				this.__patterns = {
					handlebars_comment: d.starting_with(/{{!--/).until_after(/--}}/),
					handlebars_unescaped: d.starting_with(/{{{/).until_after(/}}}/),
					handlebars: d.starting_with(/{{/).until_after(/}}/),
					php: d.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
					erb: d.starting_with(/<%[^%]/).until_after(/[^%]%>/),
					django: d.starting_with(/{%/).until_after(/%}/),
					django_value: d.starting_with(/{{/).until_after(/}}/),
					django_comment: d.starting_with(/{#/).until_after(/#}/),
					smarty: d.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
					smarty_comment: d.starting_with(/{\*/).until_after(/\*}/),
					smarty_literal: d.starting_with(/{literal}/).until_after(/{\/literal}/)
				};
			}
			l.prototype = new a(), l.prototype._create = function() {
				return new l(this._input, this);
			}, l.prototype._update = function() {
				this.__set_templated_pattern();
			}, l.prototype.disable = function(c) {
				var u = this._create();
				return u._disabled[c] = !0, u._update(), u;
			}, l.prototype.read_options = function(c) {
				var u = this._create();
				for (var d in o) u._disabled[d] = c.templating.indexOf(d) === -1;
				return u._update(), u;
			}, l.prototype.exclude = function(c) {
				var u = this._create();
				return u._excluded[c] = !0, u._update(), u;
			}, l.prototype.read = function() {
				var c = "";
				this._match_pattern ? c = this._input.read(this._starting_pattern) : c = this._input.read(this._starting_pattern, this.__template_pattern);
				for (var u = this._read_template(); u;) this._match_pattern ? u += this._input.read(this._match_pattern) : u += this._input.readUntil(this.__template_pattern), c += u, u = this._read_template();
				return this._until_after && (c += this._input.readUntilAfter(this._until_pattern)), c;
			}, l.prototype.__set_templated_pattern = function() {
				var c = [];
				this._disabled.php || c.push(this.__patterns.php._starting_pattern.source), this._disabled.handlebars || c.push(this.__patterns.handlebars._starting_pattern.source), this._disabled.erb || c.push(this.__patterns.erb._starting_pattern.source), this._disabled.django || (c.push(this.__patterns.django._starting_pattern.source), c.push(this.__patterns.django_value._starting_pattern.source), c.push(this.__patterns.django_comment._starting_pattern.source)), this._disabled.smarty || c.push(this.__patterns.smarty._starting_pattern.source), this._until_pattern && c.push(this._until_pattern.source), this.__template_pattern = this._input.get_regexp("(?:" + c.join("|") + ")");
			}, l.prototype._read_template = function() {
				var c = "", u = this._input.peek();
				if (u === "<") {
					var d = this._input.peek(1);
					!this._disabled.php && !this._excluded.php && d === "?" && (c = c || this.__patterns.php.read()), !this._disabled.erb && !this._excluded.erb && d === "%" && (c = c || this.__patterns.erb.read());
				} else u === "{" && (!this._disabled.handlebars && !this._excluded.handlebars && (c = c || this.__patterns.handlebars_comment.read(), c = c || this.__patterns.handlebars_unescaped.read(), c = c || this.__patterns.handlebars.read()), this._disabled.django || (!this._excluded.django && !this._excluded.handlebars && (c = c || this.__patterns.django_value.read()), this._excluded.django || (c = c || this.__patterns.django_comment.read(), c = c || this.__patterns.django.read())), this._disabled.smarty || this._disabled.django && this._disabled.handlebars && (c = c || this.__patterns.smarty_comment.read(), c = c || this.__patterns.smarty_literal.read(), c = c || this.__patterns.smarty.read()));
				return c;
			}, r.exports.TemplatablePattern = l;
		}),
		,
		,
		,
		(function(r, i, s) {
			var a = s(19).Beautifier, o = s(20).Options;
			function l(c, u, d, m) {
				return new a(c, u, d, m).beautify();
			}
			r.exports = l, r.exports.defaultOptions = function() {
				return new o();
			};
		}),
		(function(r, i, s) {
			var a = s(20).Options, o = s(2).Output, l = s(21).Tokenizer, c = s(21).TOKEN, u = /\r\n|[\r\n]/, d = /\r\n|[\r\n]/g, m = function(w, f) {
				this.indent_level = 0, this.alignment_size = 0, this.max_preserve_newlines = w.max_preserve_newlines, this.preserve_newlines = w.preserve_newlines, this._output = new o(w, f);
			};
			m.prototype.current_line_has_match = function(w) {
				return this._output.current_line.has_match(w);
			}, m.prototype.set_space_before_token = function(w, f) {
				this._output.space_before_token = w, this._output.non_breaking_space = f;
			}, m.prototype.set_wrap_point = function() {
				this._output.set_indent(this.indent_level, this.alignment_size), this._output.set_wrap_point();
			}, m.prototype.add_raw_token = function(w) {
				this._output.add_raw_token(w);
			}, m.prototype.print_preserved_newlines = function(w) {
				var f = 0;
				w.type !== c.TEXT && w.previous.type !== c.TEXT && (f = w.newlines ? 1 : 0), this.preserve_newlines && (f = w.newlines < this.max_preserve_newlines + 1 ? w.newlines : this.max_preserve_newlines + 1);
				for (var _ = 0; _ < f; _++) this.print_newline(_ > 0);
				return f !== 0;
			}, m.prototype.traverse_whitespace = function(w) {
				return w.whitespace_before || w.newlines ? (this.print_preserved_newlines(w) || (this._output.space_before_token = !0), !0) : !1;
			}, m.prototype.previous_token_wrapped = function() {
				return this._output.previous_token_wrapped;
			}, m.prototype.print_newline = function(w) {
				this._output.add_new_line(w);
			}, m.prototype.print_token = function(w) {
				w.text && (this._output.set_indent(this.indent_level, this.alignment_size), this._output.add_token(w.text));
			}, m.prototype.indent = function() {
				this.indent_level++;
			}, m.prototype.deindent = function() {
				this.indent_level > 0 && (this.indent_level--, this._output.set_indent(this.indent_level, this.alignment_size));
			}, m.prototype.get_full_indent = function(w) {
				return w = this.indent_level + (w || 0), w < 1 ? "" : this._output.get_indent_string(w);
			};
			var p = function(w) {
				for (var f = null, _ = w.next; _.type !== c.EOF && w.closed !== _;) {
					if (_.type === c.ATTRIBUTE && _.text === "type") {
						_.next && _.next.type === c.EQUALS && _.next.next && _.next.next.type === c.VALUE && (f = _.next.next.text);
						break;
					}
					_ = _.next;
				}
				return f;
			}, b = function(w, f) {
				var _ = null, C = null;
				return f.closed ? (w === "script" ? _ = "text/javascript" : w === "style" && (_ = "text/css"), _ = p(f) || _, _.search("text/css") > -1 ? C = "css" : _.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1 ? C = "javascript" : _.search(/(text|application|dojo)\/(x-)?(html)/) > -1 ? C = "html" : _.search(/test\/null/) > -1 && (C = "null"), C) : null;
			};
			function g(w, f) {
				return f.indexOf(w) !== -1;
			}
			function v(w, f, _) {
				this.parent = w || null, this.tag = f ? f.tag_name : "", this.indent_level = _ || 0, this.parser_token = f || null;
			}
			function T(w) {
				this._printer = w, this._current_frame = null;
			}
			T.prototype.get_parser_token = function() {
				return this._current_frame ? this._current_frame.parser_token : null;
			}, T.prototype.record_tag = function(w) {
				this._current_frame = new v(this._current_frame, w, this._printer.indent_level);
			}, T.prototype._try_pop_frame = function(w) {
				var f = null;
				return w && (f = w.parser_token, this._printer.indent_level = w.indent_level, this._current_frame = w.parent), f;
			}, T.prototype._get_frame = function(w, f) {
				for (var _ = this._current_frame; _ && w.indexOf(_.tag) === -1;) {
					if (f && f.indexOf(_.tag) !== -1) {
						_ = null;
						break;
					}
					_ = _.parent;
				}
				return _;
			}, T.prototype.try_pop = function(w, f) {
				var _ = this._get_frame([w], f);
				return this._try_pop_frame(_);
			}, T.prototype.indent_to_tag = function(w) {
				var f = this._get_frame(w);
				f && (this._printer.indent_level = f.indent_level);
			};
			function k(w, f, _, C) {
				this._source_text = w || "", f = f || {}, this._js_beautify = _, this._css_beautify = C, this._tag_stack = null, this._options = new a(f, "html"), this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 5) === "force", this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline", this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned", this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple", this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, 8) === "preserve", this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
			}
			k.prototype.beautify = function() {
				if (this._options.disabled) return this._source_text;
				var w = this._source_text, f = this._options.eol;
				this._options.eol === "auto" && (f = `
`, w && u.test(w) && (f = w.match(u)[0])), w = w.replace(d, `
`);
				var _ = w.match(/^[\t ]*/)[0], C = {
					text: "",
					type: ""
				}, z = new E(), L = new m(this._options, _), S = new l(w, this._options).tokenize();
				this._tag_stack = new T(L);
				for (var A = null, y = S.next(); y.type !== c.EOF;) y.type === c.TAG_OPEN || y.type === c.COMMENT ? (A = this._handle_tag_open(L, y, z, C, S), z = A) : y.type === c.ATTRIBUTE || y.type === c.EQUALS || y.type === c.VALUE || y.type === c.TEXT && !z.tag_complete ? A = this._handle_inside_tag(L, y, z, C) : y.type === c.TAG_CLOSE ? A = this._handle_tag_close(L, y, z) : y.type === c.TEXT ? A = this._handle_text(L, y, z) : y.type === c.CONTROL_FLOW_OPEN ? A = this._handle_control_flow_open(L, y) : y.type === c.CONTROL_FLOW_CLOSE ? A = this._handle_control_flow_close(L, y) : L.add_raw_token(y), C = A, y = S.next();
				return L._output.get_code(f);
			}, k.prototype._handle_control_flow_open = function(w, f) {
				var _ = {
					text: f.text,
					type: f.type
				};
				return w.set_space_before_token(f.newlines || f.whitespace_before !== "", !0), f.newlines ? w.print_preserved_newlines(f) : w.set_space_before_token(f.newlines || f.whitespace_before !== "", !0), w.print_token(f), w.indent(), _;
			}, k.prototype._handle_control_flow_close = function(w, f) {
				var _ = {
					text: f.text,
					type: f.type
				};
				return w.deindent(), f.newlines ? w.print_preserved_newlines(f) : w.set_space_before_token(f.newlines || f.whitespace_before !== "", !0), w.print_token(f), _;
			}, k.prototype._handle_tag_close = function(w, f, _) {
				var C = {
					text: f.text,
					type: f.type
				};
				return w.alignment_size = 0, _.tag_complete = !0, w.set_space_before_token(f.newlines || f.whitespace_before !== "", !0), _.is_unformatted ? w.add_raw_token(f) : (_.tag_start_char === "<" && (w.set_space_before_token(f.text[0] === "/", !0), this._is_wrap_attributes_force_expand_multiline && _.has_wrapped_attrs && w.print_newline(!1)), w.print_token(f)), _.indent_content && !(_.is_unformatted || _.is_content_unformatted) && (w.indent(), _.indent_content = !1), !_.is_inline_element && !(_.is_unformatted || _.is_content_unformatted) && w.set_wrap_point(), C;
			}, k.prototype._handle_inside_tag = function(w, f, _, C) {
				var z = _.has_wrapped_attrs, L = {
					text: f.text,
					type: f.type
				};
				return w.set_space_before_token(f.newlines || f.whitespace_before !== "", !0), _.is_unformatted ? w.add_raw_token(f) : _.tag_start_char === "{" && f.type === c.TEXT ? w.print_preserved_newlines(f) ? (f.newlines = 0, w.add_raw_token(f)) : w.print_token(f) : (f.type === c.ATTRIBUTE ? w.set_space_before_token(!0) : (f.type === c.EQUALS || f.type === c.VALUE && f.previous.type === c.EQUALS) && w.set_space_before_token(!1), f.type === c.ATTRIBUTE && _.tag_start_char === "<" && ((this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) && (w.traverse_whitespace(f), z = z || f.newlines !== 0), this._is_wrap_attributes_force && _.attr_count >= this._options.wrap_attributes_min_attrs && (C.type !== c.TAG_OPEN || this._is_wrap_attributes_force_expand_multiline) && (w.print_newline(!1), z = !0)), w.print_token(f), z = z || w.previous_token_wrapped(), _.has_wrapped_attrs = z), L;
			}, k.prototype._handle_text = function(w, f, _) {
				var C = {
					text: f.text,
					type: "TK_CONTENT"
				};
				return _.custom_beautifier_name ? this._print_custom_beatifier_text(w, f, _) : _.is_unformatted || _.is_content_unformatted ? w.add_raw_token(f) : (w.traverse_whitespace(f), w.print_token(f)), C;
			}, k.prototype._print_custom_beatifier_text = function(w, f, _) {
				var C = this;
				if (f.text !== "") {
					var z = f.text, L, S = 1, A = "", y = "";
					_.custom_beautifier_name === "javascript" && typeof this._js_beautify == "function" ? L = this._js_beautify : _.custom_beautifier_name === "css" && typeof this._css_beautify == "function" ? L = this._css_beautify : _.custom_beautifier_name === "html" && (L = function(W, G) {
						return new k(W, G, C._js_beautify, C._css_beautify).beautify();
					}), this._options.indent_scripts === "keep" ? S = 0 : this._options.indent_scripts === "separate" && (S = -w.indent_level);
					var M = w.get_full_indent(S);
					if (z = z.replace(/\n[ \t]*$/, ""), _.custom_beautifier_name !== "html" && z[0] === "<" && z.match(/^(<!--|<!\[CDATA\[)/)) {
						var N = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(z);
						if (!N) {
							w.add_raw_token(f);
							return;
						}
						A = M + N[1] + `
`, z = N[4], N[5] && (y = M + N[5]), z = z.replace(/\n[ \t]*$/, ""), (N[2] || N[3].indexOf(`
`) !== -1) && (N = N[3].match(/[ \t]+$/), N && (f.whitespace_before = N[0]));
					}
					if (z) if (L) {
						var H = function() {
							this.eol = `
`;
						};
						H.prototype = this._options.raw_options;
						var q = new H();
						z = L(M + z, q);
					} else {
						var P = f.whitespace_before;
						P && (z = z.replace(new RegExp(`
(` + P + ")?", "g"), `
`)), z = M + z.replace(/\n/g, `
` + M);
					}
					A && (z ? z = A + z + `
` + y : z = A + y), w.print_newline(!1), z && (f.text = z, f.whitespace_before = "", f.newlines = 0, w.add_raw_token(f), w.print_newline(!0));
				}
			}, k.prototype._handle_tag_open = function(w, f, _, C, z) {
				var L = this._get_tag_open_token(f);
				if ((_.is_unformatted || _.is_content_unformatted) && !_.is_empty_element && f.type === c.TAG_OPEN && !L.is_start_tag ? (w.add_raw_token(f), L.start_tag_token = this._tag_stack.try_pop(L.tag_name)) : (w.traverse_whitespace(f), this._set_tag_position(w, f, L, _, C), L.is_inline_element || w.set_wrap_point(), w.print_token(f)), L.is_start_tag && this._is_wrap_attributes_force) {
					var S = 0, A;
					do
						A = z.peek(S), A.type === c.ATTRIBUTE && (L.attr_count += 1), S += 1;
					while (A.type !== c.EOF && A.type !== c.TAG_CLOSE);
				}
				return (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) && (L.alignment_size = f.text.length + 1), !L.tag_complete && !L.is_unformatted && (w.alignment_size = L.alignment_size), L;
			};
			var E = function(w, f) {
				if (this.parent = w || null, this.text = "", this.type = "TK_TAG_OPEN", this.tag_name = "", this.is_inline_element = !1, this.is_unformatted = !1, this.is_content_unformatted = !1, this.is_empty_element = !1, this.is_start_tag = !1, this.is_end_tag = !1, this.indent_content = !1, this.multiline_content = !1, this.custom_beautifier_name = null, this.start_tag_token = null, this.attr_count = 0, this.has_wrapped_attrs = !1, this.alignment_size = 0, this.tag_complete = !1, this.tag_start_char = "", this.tag_check = "", !f) this.tag_complete = !0;
				else {
					var _;
					this.tag_start_char = f.text[0], this.text = f.text, this.tag_start_char === "<" ? (_ = f.text.match(/^<([^\s>]*)/), this.tag_check = _ ? _[1] : "") : (_ = f.text.match(/^{{~?(?:[\^]|#\*?)?([^\s}]+)/), this.tag_check = _ ? _[1] : "", (f.text.startsWith("{{#>") || f.text.startsWith("{{~#>")) && this.tag_check[0] === ">" && (this.tag_check === ">" && f.next !== null ? this.tag_check = f.next.text.split(" ")[0] : this.tag_check = f.text.split(">")[1])), this.tag_check = this.tag_check.toLowerCase(), f.type === c.COMMENT && (this.tag_complete = !0), this.is_start_tag = this.tag_check.charAt(0) !== "/", this.tag_name = this.is_start_tag ? this.tag_check : this.tag_check.substr(1), this.is_end_tag = !this.is_start_tag || f.closed && f.closed.text === "/>";
					var C = 2;
					this.tag_start_char === "{" && this.text.length >= 3 && this.text.charAt(2) === "~" && (C = 3), this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(C)));
				}
			};
			k.prototype._get_tag_open_token = function(w) {
				var f = new E(this._tag_stack.get_parser_token(), w);
				return f.alignment_size = this._options.wrap_attributes_indent_size, f.is_end_tag = f.is_end_tag || g(f.tag_check, this._options.void_elements), f.is_empty_element = f.tag_complete || f.is_start_tag && f.is_end_tag, f.is_unformatted = !f.tag_complete && g(f.tag_check, this._options.unformatted), f.is_content_unformatted = !f.is_empty_element && g(f.tag_check, this._options.content_unformatted), f.is_inline_element = g(f.tag_name, this._options.inline) || this._options.inline_custom_elements && f.tag_name.includes("-") || f.tag_start_char === "{", f;
			}, k.prototype._set_tag_position = function(w, f, _, C, z) {
				if (_.is_empty_element || (_.is_end_tag ? _.start_tag_token = this._tag_stack.try_pop(_.tag_name) : (this._do_optional_end_element(_) && (_.is_inline_element || w.print_newline(!1)), this._tag_stack.record_tag(_), (_.tag_name === "script" || _.tag_name === "style") && !(_.is_unformatted || _.is_content_unformatted) && (_.custom_beautifier_name = b(_.tag_check, f)))), g(_.tag_check, this._options.extra_liners) && (w.print_newline(!1), w._output.just_added_blankline() || w.print_newline(!0)), _.is_empty_element) _.tag_start_char === "{" && _.tag_check === "else" && (this._tag_stack.indent_to_tag([
					"if",
					"unless",
					"each"
				]), _.indent_content = !0, w.current_line_has_match(/{{#if/) || w.print_newline(!1)), _.tag_name === "!--" && z.type === c.TAG_CLOSE && C.is_end_tag && _.text.indexOf(`
`) === -1 || (_.is_inline_element || _.is_unformatted || w.print_newline(!1), this._calcluate_parent_multiline(w, _));
				else if (_.is_end_tag) {
					var L = !1;
					L = _.start_tag_token && _.start_tag_token.multiline_content, L = L || !_.is_inline_element && !(C.is_inline_element || C.is_unformatted) && !(z.type === c.TAG_CLOSE && _.start_tag_token === C) && z.type !== "TK_CONTENT", (_.is_content_unformatted || _.is_unformatted) && (L = !1), L && w.print_newline(!1);
				} else _.indent_content = !_.custom_beautifier_name, _.tag_start_char === "<" && (_.tag_name === "html" ? _.indent_content = this._options.indent_inner_html : _.tag_name === "head" ? _.indent_content = this._options.indent_head_inner_html : _.tag_name === "body" && (_.indent_content = this._options.indent_body_inner_html)), !(_.is_inline_element || _.is_unformatted) && (z.type !== "TK_CONTENT" || _.is_content_unformatted) && w.print_newline(!1), this._calcluate_parent_multiline(w, _);
			}, k.prototype._calcluate_parent_multiline = function(w, f) {
				f.parent && w._output.just_added_newline() && !((f.is_inline_element || f.is_unformatted) && f.parent.is_inline_element) && (f.parent.multiline_content = !0);
			};
			var I = [
				"address",
				"article",
				"aside",
				"blockquote",
				"details",
				"div",
				"dl",
				"fieldset",
				"figcaption",
				"figure",
				"footer",
				"form",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"header",
				"hr",
				"main",
				"menu",
				"nav",
				"ol",
				"p",
				"pre",
				"section",
				"table",
				"ul"
			], D = [
				"a",
				"audio",
				"del",
				"ins",
				"map",
				"noscript",
				"video"
			];
			k.prototype._do_optional_end_element = function(w) {
				var f = null;
				if (!(w.is_empty_element || !w.is_start_tag || !w.parent)) {
					if (w.tag_name === "body") f = f || this._tag_stack.try_pop("head");
					else if (w.tag_name === "li") f = f || this._tag_stack.try_pop("li", [
						"ol",
						"ul",
						"menu"
					]);
					else if (w.tag_name === "dd" || w.tag_name === "dt") f = f || this._tag_stack.try_pop("dt", ["dl"]), f = f || this._tag_stack.try_pop("dd", ["dl"]);
					else if (w.parent.tag_name === "p" && I.indexOf(w.tag_name) !== -1) {
						var _ = w.parent.parent;
						(!_ || D.indexOf(_.tag_name) === -1) && (f = f || this._tag_stack.try_pop("p"));
					} else w.tag_name === "rp" || w.tag_name === "rt" ? (f = f || this._tag_stack.try_pop("rt", ["ruby", "rtc"]), f = f || this._tag_stack.try_pop("rp", ["ruby", "rtc"])) : w.tag_name === "optgroup" ? f = f || this._tag_stack.try_pop("optgroup", ["select"]) : w.tag_name === "option" ? f = f || this._tag_stack.try_pop("option", [
						"select",
						"datalist",
						"optgroup"
					]) : w.tag_name === "colgroup" ? f = f || this._tag_stack.try_pop("caption", ["table"]) : w.tag_name === "thead" ? (f = f || this._tag_stack.try_pop("caption", ["table"]), f = f || this._tag_stack.try_pop("colgroup", ["table"])) : w.tag_name === "tbody" || w.tag_name === "tfoot" ? (f = f || this._tag_stack.try_pop("caption", ["table"]), f = f || this._tag_stack.try_pop("colgroup", ["table"]), f = f || this._tag_stack.try_pop("thead", ["table"]), f = f || this._tag_stack.try_pop("tbody", ["table"])) : w.tag_name === "tr" ? (f = f || this._tag_stack.try_pop("caption", ["table"]), f = f || this._tag_stack.try_pop("colgroup", ["table"]), f = f || this._tag_stack.try_pop("tr", [
						"table",
						"thead",
						"tbody",
						"tfoot"
					])) : (w.tag_name === "th" || w.tag_name === "td") && (f = f || this._tag_stack.try_pop("td", [
						"table",
						"thead",
						"tbody",
						"tfoot",
						"tr"
					]), f = f || this._tag_stack.try_pop("th", [
						"table",
						"thead",
						"tbody",
						"tfoot",
						"tr"
					]));
					return w.parent = this._tag_stack.get_parser_token(), f;
				}
			}, r.exports.Beautifier = k;
		}),
		(function(r, i, s) {
			var a = s(6).Options;
			function o(l) {
				a.call(this, l, "html"), this.templating.length === 1 && this.templating[0] === "auto" && (this.templating = [
					"django",
					"erb",
					"handlebars",
					"php"
				]), this.indent_inner_html = this._get_boolean("indent_inner_html"), this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", !0), this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", !0), this.indent_handlebars = this._get_boolean("indent_handlebars", !0), this.wrap_attributes = this._get_selection("wrap_attributes", [
					"auto",
					"force",
					"force-aligned",
					"force-expand-multiline",
					"aligned-multiple",
					"preserve",
					"preserve-aligned"
				]), this.wrap_attributes_min_attrs = this._get_number("wrap_attributes_min_attrs", 2), this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size), this.extra_liners = this._get_array("extra_liners", [
					"head",
					"body",
					"/html"
				]), this.inline = this._get_array("inline", [
					"a",
					"abbr",
					"area",
					"audio",
					"b",
					"bdi",
					"bdo",
					"br",
					"button",
					"canvas",
					"cite",
					"code",
					"data",
					"datalist",
					"del",
					"dfn",
					"em",
					"embed",
					"i",
					"iframe",
					"img",
					"input",
					"ins",
					"kbd",
					"keygen",
					"label",
					"map",
					"mark",
					"math",
					"meter",
					"noscript",
					"object",
					"output",
					"progress",
					"q",
					"ruby",
					"s",
					"samp",
					"select",
					"small",
					"span",
					"strong",
					"sub",
					"sup",
					"svg",
					"template",
					"textarea",
					"time",
					"u",
					"var",
					"video",
					"wbr",
					"text",
					"acronym",
					"big",
					"strike",
					"tt"
				]), this.inline_custom_elements = this._get_boolean("inline_custom_elements", !0), this.void_elements = this._get_array("void_elements", [
					"area",
					"base",
					"br",
					"col",
					"embed",
					"hr",
					"img",
					"input",
					"keygen",
					"link",
					"menuitem",
					"meta",
					"param",
					"source",
					"track",
					"wbr",
					"!doctype",
					"?xml",
					"basefont",
					"isindex"
				]), this.unformatted = this._get_array("unformatted", []), this.content_unformatted = this._get_array("content_unformatted", ["pre", "textarea"]), this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter"), this.indent_scripts = this._get_selection("indent_scripts", [
					"normal",
					"keep",
					"separate"
				]);
			}
			o.prototype = new a(), r.exports.Options = o;
		}),
		(function(r, i, s) {
			var a = s(9).Tokenizer, o = s(9).TOKEN, l = s(13).Directives, c = s(14).TemplatablePattern, u = s(12).Pattern, d = {
				TAG_OPEN: "TK_TAG_OPEN",
				TAG_CLOSE: "TK_TAG_CLOSE",
				CONTROL_FLOW_OPEN: "TK_CONTROL_FLOW_OPEN",
				CONTROL_FLOW_CLOSE: "TK_CONTROL_FLOW_CLOSE",
				ATTRIBUTE: "TK_ATTRIBUTE",
				EQUALS: "TK_EQUALS",
				VALUE: "TK_VALUE",
				COMMENT: "TK_COMMENT",
				TEXT: "TK_TEXT",
				UNKNOWN: "TK_UNKNOWN",
				START: o.START,
				RAW: o.RAW,
				EOF: o.EOF
			}, m = new l(/<\!--/, /-->/), p = function(b, g) {
				a.call(this, b, g), this._current_tag_name = "";
				var v = new c(this._input).read_options(this._options), T = new u(this._input);
				if (this.__patterns = {
					word: v.until(/[\n\r\t <]/),
					word_control_flow_close_excluded: v.until(/[\n\r\t <}]/),
					single_quote: v.until_after(/'/),
					double_quote: v.until_after(/"/),
					attribute: v.until(/[\n\r\t =>]|\/>/),
					element_name: v.until(/[\n\r\t >\/]/),
					angular_control_flow_start: T.matching(/\@[a-zA-Z]+[^({]*[({]/),
					handlebars_comment: T.starting_with(/{{!--/).until_after(/--}}/),
					handlebars: T.starting_with(/{{/).until_after(/}}/),
					handlebars_open: T.until(/[\n\r\t }]/),
					handlebars_raw_close: T.until(/}}/),
					comment: T.starting_with(/<!--/).until_after(/-->/),
					cdata: T.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
					conditional_comment: T.starting_with(/<!\[/).until_after(/]>/),
					processing: T.starting_with(/<\?/).until_after(/\?>/)
				}, this._options.indent_handlebars && (this.__patterns.word = this.__patterns.word.exclude("handlebars"), this.__patterns.word_control_flow_close_excluded = this.__patterns.word_control_flow_close_excluded.exclude("handlebars")), this._unformatted_content_delimiter = null, this._options.unformatted_content_delimiter) {
					var k = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
					this.__patterns.unformatted_content_delimiter = T.matching(k).until_after(k);
				}
			};
			p.prototype = new a(), p.prototype._is_comment = function(b) {
				return !1;
			}, p.prototype._is_opening = function(b) {
				return b.type === d.TAG_OPEN || b.type === d.CONTROL_FLOW_OPEN;
			}, p.prototype._is_closing = function(b, g) {
				return b.type === d.TAG_CLOSE && g && ((b.text === ">" || b.text === "/>") && g.text[0] === "<" || b.text === "}}" && g.text[0] === "{" && g.text[1] === "{") || b.type === d.CONTROL_FLOW_CLOSE && b.text === "}" && g.text.endsWith("{");
			}, p.prototype._reset = function() {
				this._current_tag_name = "";
			}, p.prototype._get_next_token = function(b, g) {
				var v = null;
				this._readWhitespace();
				var T = this._input.peek();
				return T === null ? this._create_token(d.EOF, "") : (v = v || this._read_open_handlebars(T, g), v = v || this._read_attribute(T, b, g), v = v || this._read_close(T, g), v = v || this._read_control_flows(T, g), v = v || this._read_raw_content(T, b, g), v = v || this._read_content_word(T, g), v = v || this._read_comment_or_cdata(T), v = v || this._read_processing(T), v = v || this._read_open(T, g), v = v || this._create_token(d.UNKNOWN, this._input.next()), v);
			}, p.prototype._read_comment_or_cdata = function(b) {
				var g = null, v = null, T = null;
				return b === "<" && (this._input.peek(1) === "!" && (v = this.__patterns.comment.read(), v ? (T = m.get_directives(v), T && T.ignore === "start" && (v += m.readIgnored(this._input))) : v = this.__patterns.cdata.read()), v && (g = this._create_token(d.COMMENT, v), g.directives = T)), g;
			}, p.prototype._read_processing = function(b) {
				var g = null, v = null, T = null;
				if (b === "<") {
					var k = this._input.peek(1);
					(k === "!" || k === "?") && (v = this.__patterns.conditional_comment.read(), v = v || this.__patterns.processing.read()), v && (g = this._create_token(d.COMMENT, v), g.directives = T);
				}
				return g;
			}, p.prototype._read_open = function(b, g) {
				var v = null, T = null;
				return (!g || g.type === d.CONTROL_FLOW_OPEN) && b === "<" && (v = this._input.next(), this._input.peek() === "/" && (v += this._input.next()), v += this.__patterns.element_name.read(), T = this._create_token(d.TAG_OPEN, v)), T;
			}, p.prototype._read_open_handlebars = function(b, g) {
				var v = null, T = null;
				return (!g || g.type === d.CONTROL_FLOW_OPEN) && this._options.indent_handlebars && b === "{" && this._input.peek(1) === "{" && (this._input.peek(2) === "!" ? (v = this.__patterns.handlebars_comment.read(), v = v || this.__patterns.handlebars.read(), T = this._create_token(d.COMMENT, v)) : (v = this.__patterns.handlebars_open.read(), T = this._create_token(d.TAG_OPEN, v))), T;
			}, p.prototype._read_control_flows = function(b, g) {
				var v = "", T = null;
				if (!this._options.templating.includes("angular") || !this._options.indent_handlebars) return T;
				if (b === "@") {
					if (v = this.__patterns.angular_control_flow_start.read(), v === "") return T;
					for (var k = v.endsWith("(") ? 1 : 0, E = 0; !(v.endsWith("{") && k === E);) {
						var I = this._input.next();
						if (I === null) break;
						I === "(" ? k++ : I === ")" && E++, v += I;
					}
					T = this._create_token(d.CONTROL_FLOW_OPEN, v);
				} else b === "}" && g && g.type === d.CONTROL_FLOW_OPEN && (v = this._input.next(), T = this._create_token(d.CONTROL_FLOW_CLOSE, v));
				return T;
			}, p.prototype._read_close = function(b, g) {
				var v = null, T = null;
				return g && g.type === d.TAG_OPEN && (g.text[0] === "<" && (b === ">" || b === "/" && this._input.peek(1) === ">") ? (v = this._input.next(), b === "/" && (v += this._input.next()), T = this._create_token(d.TAG_CLOSE, v)) : g.text[0] === "{" && b === "}" && this._input.peek(1) === "}" && (this._input.next(), this._input.next(), T = this._create_token(d.TAG_CLOSE, "}}"))), T;
			}, p.prototype._read_attribute = function(b, g, v) {
				var T = null, k = "";
				if (v && v.text[0] === "<") if (b === "=") T = this._create_token(d.EQUALS, this._input.next());
				else if (b === "\"" || b === "'") {
					var E = this._input.next();
					b === "\"" ? E += this.__patterns.double_quote.read() : E += this.__patterns.single_quote.read(), T = this._create_token(d.VALUE, E);
				} else k = this.__patterns.attribute.read(), k && (g.type === d.EQUALS ? T = this._create_token(d.VALUE, k) : T = this._create_token(d.ATTRIBUTE, k));
				return T;
			}, p.prototype._is_content_unformatted = function(b) {
				return this._options.void_elements.indexOf(b) === -1 && (this._options.content_unformatted.indexOf(b) !== -1 || this._options.unformatted.indexOf(b) !== -1);
			}, p.prototype._read_raw_content = function(b, g, v) {
				var T = "";
				if (v && v.text[0] === "{") T = this.__patterns.handlebars_raw_close.read();
				else if (g.type === d.TAG_CLOSE && g.opened.text[0] === "<" && g.text[0] !== "/") {
					var k = g.opened.text.substr(1).toLowerCase();
					if (k === "script" || k === "style") {
						var E = this._read_comment_or_cdata(b);
						if (E) return E.type = d.TEXT, E;
						T = this._input.readUntil(new RegExp("</" + k + "[\\n\\r\\t ]*?>", "ig"));
					} else this._is_content_unformatted(k) && (T = this._input.readUntil(new RegExp("</" + k + "[\\n\\r\\t ]*?>", "ig")));
				}
				return T ? this._create_token(d.TEXT, T) : null;
			}, p.prototype._read_content_word = function(b, g) {
				var v = "";
				if (this._options.unformatted_content_delimiter && b === this._options.unformatted_content_delimiter[0] && (v = this.__patterns.unformatted_content_delimiter.read()), v || (v = g && g.type === d.CONTROL_FLOW_OPEN ? this.__patterns.word_control_flow_close_excluded.read() : this.__patterns.word.read()), v) return this._create_token(d.TEXT, v);
			}, r.exports.Tokenizer = p, r.exports.TOKEN = d;
		})
	], t = {};
	function n(r) {
		var i = t[r];
		if (i !== void 0) return i.exports;
		var s = t[r] = { exports: {} };
		return e[r](s, s.exports, n), s.exports;
	}
	bo = n(18);
})();
function bu(e, t) {
	return bo(e, t, pu, gu);
}
function wu(e, t, n) {
	let r = e.getText(), i = !0, s = 0;
	const a = n.tabSize || 4;
	if (t) {
		let c = e.offsetAt(t.start), u = c;
		for (; u > 0 && ka(r, u - 1);) u--;
		u === 0 || Ta(r, u - 1) ? c = u : u < c && (c = u + 1);
		let d = e.offsetAt(t.end), m = d;
		for (; m < r.length && ka(r, m);) m++;
		(m === r.length || Ta(r, m)) && (d = m), t = $.create(e.positionAt(c), e.positionAt(d));
		const p = r.substring(0, c);
		if ((/* @__PURE__ */ new RegExp(/.*[<][^>]*$/)).test(p)) return r = r.substring(c, d), [{
			range: t,
			newText: r
		}];
		if (i = d === r.length, r = r.substring(c, d), c !== 0) {
			const b = e.offsetAt(ie.create(t.start.line, 0));
			s = yu(e.getText(), b, n);
		}
	} else t = $.create(ie.create(0, 0), e.positionAt(r.length));
	const o = {
		indent_size: a,
		indent_char: n.insertSpaces ? " " : "	",
		indent_empty_lines: pe(n, "indentEmptyLines", !1),
		wrap_line_length: pe(n, "wrapLineLength", 120),
		unformatted: An(n, "unformatted", void 0),
		content_unformatted: An(n, "contentUnformatted", void 0),
		indent_inner_html: pe(n, "indentInnerHtml", !1),
		preserve_newlines: pe(n, "preserveNewLines", !0),
		max_preserve_newlines: pe(n, "maxPreserveNewLines", 32786),
		indent_handlebars: pe(n, "indentHandlebars", !1),
		end_with_newline: i && pe(n, "endWithNewline", !1),
		extra_liners: An(n, "extraLiners", void 0),
		wrap_attributes: pe(n, "wrapAttributes", "auto"),
		wrap_attributes_indent_size: pe(n, "wrapAttributesIndentSize", void 0),
		eol: `
`,
		indent_scripts: pe(n, "indentScripts", "normal"),
		templating: vu(n, "all"),
		unformatted_content_delimiter: pe(n, "unformattedContentDelimiter", "")
	};
	let l = bu(_u(r), o);
	if (s > 0) {
		const c = n.insertSpaces ? va(" ", a * s) : va("	", s);
		l = l.split(`
`).join(`
` + c), t.start.character === 0 && (l = c + l);
	}
	return [{
		range: t,
		newText: l
	}];
}
function _u(e) {
	return e.replace(/^\s+/, "");
}
function pe(e, t, n) {
	if (e && e.hasOwnProperty(t)) {
		const r = e[t];
		if (r !== null) return r;
	}
	return n;
}
function An(e, t, n) {
	const r = pe(e, t, null);
	return typeof r == "string" ? r.length > 0 ? r.split(",").map((i) => i.trim().toLowerCase()) : [] : n;
}
function vu(e, t) {
	const n = pe(e, "templating", t);
	return n === !0 ? ["auto"] : n === !1 || n === t || Array.isArray(n) === !1 ? ["none"] : n;
}
function yu(e, t, n) {
	let r = t, i = 0;
	const s = n.tabSize || 4;
	for (; r < e.length;) {
		const a = e.charAt(r);
		if (a === " ") i++;
		else if (a === "	") i += s;
		else break;
		r++;
	}
	return Math.floor(i / s);
}
function Ta(e, t) {
	return `\r
`.indexOf(e.charAt(t)) !== -1;
}
function ka(e, t) {
	return " 	".indexOf(e.charAt(t)) !== -1;
}
var wo;
(() => {
	var e = { 470: (i) => {
		function s(l) {
			if (typeof l != "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(l));
		}
		function a(l, c) {
			for (var u, d = "", m = 0, p = -1, b = 0, g = 0; g <= l.length; ++g) {
				if (g < l.length) u = l.charCodeAt(g);
				else {
					if (u === 47) break;
					u = 47;
				}
				if (u === 47) {
					if (!(p === g - 1 || b === 1)) if (p !== g - 1 && b === 2) {
						if (d.length < 2 || m !== 2 || d.charCodeAt(d.length - 1) !== 46 || d.charCodeAt(d.length - 2) !== 46) {
							if (d.length > 2) {
								var v = d.lastIndexOf("/");
								if (v !== d.length - 1) {
									v === -1 ? (d = "", m = 0) : m = (d = d.slice(0, v)).length - 1 - d.lastIndexOf("/"), p = g, b = 0;
									continue;
								}
							} else if (d.length === 2 || d.length === 1) {
								d = "", m = 0, p = g, b = 0;
								continue;
							}
						}
						c && (d.length > 0 ? d += "/.." : d = "..", m = 2);
					} else d.length > 0 ? d += "/" + l.slice(p + 1, g) : d = l.slice(p + 1, g), m = g - p - 1;
					p = g, b = 0;
				} else u === 46 && b !== -1 ? ++b : b = -1;
			}
			return d;
		}
		var o = {
			resolve: function() {
				for (var l, c = "", u = !1, d = arguments.length - 1; d >= -1 && !u; d--) {
					var m;
					d >= 0 ? m = arguments[d] : (l === void 0 && (l = process.cwd()), m = l), s(m), m.length !== 0 && (c = m + "/" + c, u = m.charCodeAt(0) === 47);
				}
				return c = a(c, !u), u ? c.length > 0 ? "/" + c : "/" : c.length > 0 ? c : ".";
			},
			normalize: function(l) {
				if (s(l), l.length === 0) return ".";
				var c = l.charCodeAt(0) === 47, u = l.charCodeAt(l.length - 1) === 47;
				return (l = a(l, !c)).length !== 0 || c || (l = "."), l.length > 0 && u && (l += "/"), c ? "/" + l : l;
			},
			isAbsolute: function(l) {
				return s(l), l.length > 0 && l.charCodeAt(0) === 47;
			},
			join: function() {
				if (arguments.length === 0) return ".";
				for (var l, c = 0; c < arguments.length; ++c) {
					var u = arguments[c];
					s(u), u.length > 0 && (l === void 0 ? l = u : l += "/" + u);
				}
				return l === void 0 ? "." : o.normalize(l);
			},
			relative: function(l, c) {
				if (s(l), s(c), l === c || (l = o.resolve(l)) === (c = o.resolve(c))) return "";
				for (var u = 1; u < l.length && l.charCodeAt(u) === 47; ++u);
				for (var d = l.length, m = d - u, p = 1; p < c.length && c.charCodeAt(p) === 47; ++p);
				for (var b = c.length - p, g = m < b ? m : b, v = -1, T = 0; T <= g; ++T) {
					if (T === g) {
						if (b > g) {
							if (c.charCodeAt(p + T) === 47) return c.slice(p + T + 1);
							if (T === 0) return c.slice(p + T);
						} else m > g && (l.charCodeAt(u + T) === 47 ? v = T : T === 0 && (v = 0));
						break;
					}
					var k = l.charCodeAt(u + T);
					if (k !== c.charCodeAt(p + T)) break;
					k === 47 && (v = T);
				}
				var E = "";
				for (T = u + v + 1; T <= d; ++T) T !== d && l.charCodeAt(T) !== 47 || (E.length === 0 ? E += ".." : E += "/..");
				return E.length > 0 ? E + c.slice(p + v) : (p += v, c.charCodeAt(p) === 47 && ++p, c.slice(p));
			},
			_makeLong: function(l) {
				return l;
			},
			dirname: function(l) {
				if (s(l), l.length === 0) return ".";
				for (var c = l.charCodeAt(0), u = c === 47, d = -1, m = !0, p = l.length - 1; p >= 1; --p) if ((c = l.charCodeAt(p)) === 47) {
					if (!m) {
						d = p;
						break;
					}
				} else m = !1;
				return d === -1 ? u ? "/" : "." : u && d === 1 ? "//" : l.slice(0, d);
			},
			basename: function(l, c) {
				if (c !== void 0 && typeof c != "string") throw new TypeError("\"ext\" argument must be a string");
				s(l);
				var u, d = 0, m = -1, p = !0;
				if (c !== void 0 && c.length > 0 && c.length <= l.length) {
					if (c.length === l.length && c === l) return "";
					var b = c.length - 1, g = -1;
					for (u = l.length - 1; u >= 0; --u) {
						var v = l.charCodeAt(u);
						if (v === 47) {
							if (!p) {
								d = u + 1;
								break;
							}
						} else g === -1 && (p = !1, g = u + 1), b >= 0 && (v === c.charCodeAt(b) ? --b == -1 && (m = u) : (b = -1, m = g));
					}
					return d === m ? m = g : m === -1 && (m = l.length), l.slice(d, m);
				}
				for (u = l.length - 1; u >= 0; --u) if (l.charCodeAt(u) === 47) {
					if (!p) {
						d = u + 1;
						break;
					}
				} else m === -1 && (p = !1, m = u + 1);
				return m === -1 ? "" : l.slice(d, m);
			},
			extname: function(l) {
				s(l);
				for (var c = -1, u = 0, d = -1, m = !0, p = 0, b = l.length - 1; b >= 0; --b) {
					var g = l.charCodeAt(b);
					if (g !== 47) d === -1 && (m = !1, d = b + 1), g === 46 ? c === -1 ? c = b : p !== 1 && (p = 1) : c !== -1 && (p = -1);
					else if (!m) {
						u = b + 1;
						break;
					}
				}
				return c === -1 || d === -1 || p === 0 || p === 1 && c === d - 1 && c === u + 1 ? "" : l.slice(c, d);
			},
			format: function(l) {
				if (l === null || typeof l != "object") throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof l);
				return (function(c, u) {
					var d = u.dir || u.root, m = u.base || (u.name || "") + (u.ext || "");
					return d ? d === u.root ? d + m : d + "/" + m : m;
				})(0, l);
			},
			parse: function(l) {
				s(l);
				var c = {
					root: "",
					dir: "",
					base: "",
					ext: "",
					name: ""
				};
				if (l.length === 0) return c;
				var u, d = l.charCodeAt(0), m = d === 47;
				m ? (c.root = "/", u = 1) : u = 0;
				for (var p = -1, b = 0, g = -1, v = !0, T = l.length - 1, k = 0; T >= u; --T) if ((d = l.charCodeAt(T)) !== 47) g === -1 && (v = !1, g = T + 1), d === 46 ? p === -1 ? p = T : k !== 1 && (k = 1) : p !== -1 && (k = -1);
				else if (!v) {
					b = T + 1;
					break;
				}
				return p === -1 || g === -1 || k === 0 || k === 1 && p === g - 1 && p === b + 1 ? g !== -1 && (c.base = c.name = b === 0 && m ? l.slice(1, g) : l.slice(b, g)) : (b === 0 && m ? (c.name = l.slice(1, p), c.base = l.slice(1, g)) : (c.name = l.slice(b, p), c.base = l.slice(b, g)), c.ext = l.slice(p, g)), b > 0 ? c.dir = l.slice(0, b - 1) : m && (c.dir = "/"), c;
			},
			sep: "/",
			delimiter: ":",
			win32: null,
			posix: null
		};
		o.posix = o, i.exports = o;
	} }, t = {};
	function n(i) {
		var s = t[i];
		if (s !== void 0) return s.exports;
		var a = t[i] = { exports: {} };
		return e[i](a, a.exports, n), a.exports;
	}
	n.d = (i, s) => {
		for (var a in s) n.o(s, a) && !n.o(i, a) && Object.defineProperty(i, a, {
			enumerable: !0,
			get: s[a]
		});
	}, n.o = (i, s) => Object.prototype.hasOwnProperty.call(i, s), n.r = (i) => {
		typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i, "__esModule", { value: !0 });
	};
	var r = {};
	(() => {
		let i;
		n.r(r), n.d(r, {
			URI: () => m,
			Utils: () => z
		}), typeof process == "object" ? i = process.platform === "win32" : typeof navigator == "object" && (i = navigator.userAgent.indexOf("Windows") >= 0);
		const s = /^\w[\w\d+.-]*$/, a = /^\//, o = /^\/\//;
		function l(L, S) {
			if (!L.scheme && S) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${L.authority}", path: "${L.path}", query: "${L.query}", fragment: "${L.fragment}"}`);
			if (L.scheme && !s.test(L.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
			if (L.path) {
				if (L.authority) {
					if (!a.test(L.path)) throw new Error("[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash (\"/\") character");
				} else if (o.test(L.path)) throw new Error("[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters (\"//\")");
			}
		}
		const c = "", u = "/", d = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
		class m {
			static isUri(S) {
				return S instanceof m || !!S && typeof S.authority == "string" && typeof S.fragment == "string" && typeof S.path == "string" && typeof S.query == "string" && typeof S.scheme == "string" && typeof S.fsPath == "string" && typeof S.with == "function" && typeof S.toString == "function";
			}
			scheme;
			authority;
			path;
			query;
			fragment;
			constructor(S, A, y, M, N, H = !1) {
				typeof S == "object" ? (this.scheme = S.scheme || c, this.authority = S.authority || c, this.path = S.path || c, this.query = S.query || c, this.fragment = S.fragment || c) : (this.scheme = (function(q, P) {
					return q || P ? q : "file";
				})(S, H), this.authority = A || c, this.path = (function(q, P) {
					switch (q) {
						case "https":
						case "http":
						case "file": P ? P[0] !== u && (P = u + P) : P = u;
					}
					return P;
				})(this.scheme, y || c), this.query = M || c, this.fragment = N || c, l(this, H));
			}
			get fsPath() {
				return k(this);
			}
			with(S) {
				if (!S) return this;
				let { scheme: A, authority: y, path: M, query: N, fragment: H } = S;
				return A === void 0 ? A = this.scheme : A === null && (A = c), y === void 0 ? y = this.authority : y === null && (y = c), M === void 0 ? M = this.path : M === null && (M = c), N === void 0 ? N = this.query : N === null && (N = c), H === void 0 ? H = this.fragment : H === null && (H = c), A === this.scheme && y === this.authority && M === this.path && N === this.query && H === this.fragment ? this : new b(A, y, M, N, H);
			}
			static parse(S, A = !1) {
				const y = d.exec(S);
				return y ? new b(y[2] || c, w(y[4] || c), w(y[5] || c), w(y[7] || c), w(y[9] || c), A) : new b(c, c, c, c, c);
			}
			static file(S) {
				let A = c;
				if (i && (S = S.replace(/\\/g, u)), S[0] === u && S[1] === u) {
					const y = S.indexOf(u, 2);
					y === -1 ? (A = S.substring(2), S = u) : (A = S.substring(2, y), S = S.substring(y) || u);
				}
				return new b("file", A, S, c, c);
			}
			static from(S) {
				const A = new b(S.scheme, S.authority, S.path, S.query, S.fragment);
				return l(A, !0), A;
			}
			toString(S = !1) {
				return E(this, S);
			}
			toJSON() {
				return this;
			}
			static revive(S) {
				if (S) {
					if (S instanceof m) return S;
					{
						const A = new b(S);
						return A._formatted = S.external, A._fsPath = S._sep === p ? S.fsPath : null, A;
					}
				}
				return S;
			}
		}
		const p = i ? 1 : void 0;
		class b extends m {
			_formatted = null;
			_fsPath = null;
			get fsPath() {
				return this._fsPath || (this._fsPath = k(this)), this._fsPath;
			}
			toString(S = !1) {
				return S ? E(this, !0) : (this._formatted || (this._formatted = E(this, !1)), this._formatted);
			}
			toJSON() {
				const S = { $mid: 1 };
				return this._fsPath && (S.fsPath = this._fsPath, S._sep = p), this._formatted && (S.external = this._formatted), this.path && (S.path = this.path), this.scheme && (S.scheme = this.scheme), this.authority && (S.authority = this.authority), this.query && (S.query = this.query), this.fragment && (S.fragment = this.fragment), S;
			}
		}
		const g = {
			58: "%3A",
			47: "%2F",
			63: "%3F",
			35: "%23",
			91: "%5B",
			93: "%5D",
			64: "%40",
			33: "%21",
			36: "%24",
			38: "%26",
			39: "%27",
			40: "%28",
			41: "%29",
			42: "%2A",
			43: "%2B",
			44: "%2C",
			59: "%3B",
			61: "%3D",
			32: "%20"
		};
		function v(L, S, A) {
			let y, M = -1;
			for (let N = 0; N < L.length; N++) {
				const H = L.charCodeAt(N);
				if (H >= 97 && H <= 122 || H >= 65 && H <= 90 || H >= 48 && H <= 57 || H === 45 || H === 46 || H === 95 || H === 126 || S && H === 47 || A && H === 91 || A && H === 93 || A && H === 58) M !== -1 && (y += encodeURIComponent(L.substring(M, N)), M = -1), y !== void 0 && (y += L.charAt(N));
				else {
					y === void 0 && (y = L.substr(0, N));
					const q = g[H];
					q !== void 0 ? (M !== -1 && (y += encodeURIComponent(L.substring(M, N)), M = -1), y += q) : M === -1 && (M = N);
				}
			}
			return M !== -1 && (y += encodeURIComponent(L.substring(M))), y !== void 0 ? y : L;
		}
		function T(L) {
			let S;
			for (let A = 0; A < L.length; A++) {
				const y = L.charCodeAt(A);
				y === 35 || y === 63 ? (S === void 0 && (S = L.substr(0, A)), S += g[y]) : S !== void 0 && (S += L[A]);
			}
			return S !== void 0 ? S : L;
		}
		function k(L, S) {
			let A;
			return A = L.authority && L.path.length > 1 && L.scheme === "file" ? `//${L.authority}${L.path}` : L.path.charCodeAt(0) === 47 && (L.path.charCodeAt(1) >= 65 && L.path.charCodeAt(1) <= 90 || L.path.charCodeAt(1) >= 97 && L.path.charCodeAt(1) <= 122) && L.path.charCodeAt(2) === 58 ? L.path[1].toLowerCase() + L.path.substr(2) : L.path, i && (A = A.replace(/\//g, "\\")), A;
		}
		function E(L, S) {
			const A = S ? T : v;
			let y = "", { scheme: M, authority: N, path: H, query: q, fragment: P } = L;
			if (M && (y += M, y += ":"), (N || M === "file") && (y += u, y += u), N) {
				let W = N.indexOf("@");
				if (W !== -1) {
					const G = N.substr(0, W);
					N = N.substr(W + 1), W = G.lastIndexOf(":"), W === -1 ? y += A(G, !1, !1) : (y += A(G.substr(0, W), !1, !1), y += ":", y += A(G.substr(W + 1), !1, !0)), y += "@";
				}
				N = N.toLowerCase(), W = N.lastIndexOf(":"), W === -1 ? y += A(N, !1, !0) : (y += A(N.substr(0, W), !1, !0), y += N.substr(W));
			}
			if (H) {
				if (H.length >= 3 && H.charCodeAt(0) === 47 && H.charCodeAt(2) === 58) {
					const W = H.charCodeAt(1);
					W >= 65 && W <= 90 && (H = `/${String.fromCharCode(W + 32)}:${H.substr(3)}`);
				} else if (H.length >= 2 && H.charCodeAt(1) === 58) {
					const W = H.charCodeAt(0);
					W >= 65 && W <= 90 && (H = `${String.fromCharCode(W + 32)}:${H.substr(2)}`);
				}
				y += A(H, !0, !1);
			}
			return q && (y += "?", y += A(q, !1, !1)), P && (y += "#", y += S ? P : v(P, !1, !1)), y;
		}
		function I(L) {
			try {
				return decodeURIComponent(L);
			} catch {
				return L.length > 3 ? L.substr(0, 3) + I(L.substr(3)) : L;
			}
		}
		const D = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
		function w(L) {
			return L.match(D) ? L.replace(D, ((S) => I(S))) : L;
		}
		var f = n(470);
		const _ = f.posix || f, C = "/";
		var z;
		(function(L) {
			L.joinPath = function(S, ...A) {
				return S.with({ path: _.join(S.path, ...A) });
			}, L.resolvePath = function(S, ...A) {
				let y = S.path, M = !1;
				y[0] !== C && (y = C + y, M = !0);
				let N = _.resolve(y, ...A);
				return M && N[0] === C && !S.authority && (N = N.substring(1)), S.with({ path: N });
			}, L.dirname = function(S) {
				if (S.path.length === 0 || S.path === C) return S;
				let A = _.dirname(S.path);
				return A.length === 1 && A.charCodeAt(0) === 46 && (A = ""), S.with({ path: A });
			}, L.basename = function(S) {
				return _.basename(S.path);
			}, L.extname = function(S) {
				return _.extname(S.path);
			};
		})(z || (z = {}));
	})(), wo = r;
})();
const { URI: Tu, Utils: ud } = wo;
function yi(e) {
	const t = e[0];
	return t === e[e.length - 1] && (t === "'" || t === "\"") && (e = e.substring(1, e.length - 1)), e;
}
function ku(e, t) {
	return !e.length || t === "handlebars" && /{{|}}/.test(e) ? !1 : /\b(w[\w\d+.-]*:\/\/)?[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/.test(e);
}
function Su(e, t, n, r) {
	if (/^\s*javascript\:/i.test(t) || /[\n\r]/.test(t)) return;
	t = t.replace(/^\s*/g, "");
	const i = t.match(/^(\w[\w\d+.-]*):/);
	if (i) {
		const s = i[1].toLowerCase();
		return s === "http" || s === "https" || s === "file" ? t : void 0;
	}
	return /^\#/i.test(t) ? e + t : /^\/\//i.test(t) ? (We(e, "https://") ? "https" : "http") + ":" + t.replace(/^\s*/g, "") : n ? n.resolveReference(t, r || e) : t;
}
function Lu(e, t, n, r, i, s) {
	const a = yi(n);
	if (!ku(a, e.languageId)) return;
	a.length < n.length && (r++, i--);
	const o = Su(e.uri, a, t, s);
	if (!o) return;
	const l = Au(o, e);
	return {
		range: $.create(e.positionAt(r), e.positionAt(i)),
		target: l
	};
}
const xu = 35;
function Au(e, t) {
	try {
		let n = Tu.parse(e);
		return n.scheme === "file" && n.query && (n = n.with({ query: null }), e = n.toString(!0)), n.scheme === "file" && n.fragment && !(e.startsWith(t.uri) && e.charCodeAt(t.uri.length) === xu) ? n.with({ fragment: null }).toString(!0) : e;
	} catch {
		return;
	}
}
var Ru = class {
	constructor(e) {
		this.dataManager = e;
	}
	findDocumentLinks(e, t) {
		const n = [], r = ge(e.getText(), 0);
		let i = r.scan(), s, a, o = !1, l;
		const c = {};
		for (; i !== U.EOS;) {
			switch (i) {
				case U.StartTag:
					a = r.getTokenText().toLowerCase(), l || (o = a === "base");
					break;
				case U.AttributeName:
					s = r.getTokenText().toLowerCase();
					break;
				case U.AttributeValue:
					if (a && s && this.dataManager.isPathAttribute(a, s)) {
						const u = r.getTokenText();
						if (!o) {
							const d = Lu(e, t, u, r.getTokenOffset(), r.getTokenEnd(), l);
							d && n.push(d);
						}
						o && typeof l > "u" && (l = yi(u), l && t && (l = t.resolveReference(l, e.uri))), o = !1, s = void 0;
					} else if (s === "id") {
						const u = yi(r.getTokenText());
						c[u] = r.getTokenOffset();
					}
					break;
			}
			i = r.scan();
		}
		for (const u of n) {
			const d = e.uri + "#";
			if (u.target && We(u.target, d)) {
				const m = c[u.target.substring(d.length)];
				if (m !== void 0) {
					const p = e.positionAt(m);
					u.target = `${d}${p.line + 1},${p.character + 1}`;
				} else u.target = e.uri;
			}
		}
		return n;
	}
};
function Mu(e, t, n) {
	const r = e.offsetAt(t), i = n.findNodeAt(r);
	if (!i.tag) return [];
	const s = [], a = xa(U.StartTag, e, i.start), o = typeof i.endTagStart == "number" && xa(U.EndTag, e, i.endTagStart);
	return (a && La(a, t) || o && La(o, t)) && (a && s.push({
		kind: cn.Read,
		range: a
	}), o && s.push({
		kind: cn.Read,
		range: o
	})), s;
}
function Sa(e, t) {
	return e.line < t.line || e.line === t.line && e.character <= t.character;
}
function La(e, t) {
	return Sa(e.start, t) && Sa(t, e.end);
}
function xa(e, t, n) {
	const r = ge(t.getText(), n);
	let i = r.scan();
	for (; i !== U.EOS && i !== e;) i = r.scan();
	return i !== U.EOS ? {
		start: t.positionAt(r.getTokenOffset()),
		end: t.positionAt(r.getTokenEnd())
	} : null;
}
function Eu(e, t) {
	const n = [], r = _o(e, t);
	for (const s of r) i(s, void 0);
	return n;
	function i(s, a) {
		const o = mi.create(s.name, s.kind, s.range, e.uri, a?.name);
		if (o.containerName ?? (o.containerName = ""), n.push(o), s.children) for (const l of s.children) i(l, s);
	}
}
function _o(e, t) {
	const n = [];
	return t.roots.forEach((r) => {
		vo(e, r, n);
	}), n;
}
function vo(e, t, n) {
	const r = Nu(t), i = $.create(e.positionAt(t.start), e.positionAt(t.end)), s = fi.create(r, void 0, di.Field, i, i);
	n.push(s), t.children.forEach((a) => {
		s.children ?? (s.children = []), vo(e, a, s.children);
	});
}
function Nu(e) {
	let t = e.tag;
	if (e.attributes) {
		const n = e.attributes.id, r = e.attributes.class;
		n && (t += `#${n.replace(/[\"\']/g, "")}`), r && (t += r.replace(/[\"\']/g, "").split(/\s+/).map((i) => `.${i}`).join(""));
	}
	return t || "?";
}
function Cu(e, t, n, r) {
	const i = e.offsetAt(t), s = r.findNodeAt(i);
	if (!s.tag || !Iu(s, i, s.tag)) return null;
	const a = [], o = {
		start: e.positionAt(s.start + 1),
		end: e.positionAt(s.start + 1 + s.tag.length)
	};
	if (a.push({
		range: o,
		newText: n
	}), s.endTagStart) {
		const l = {
			start: e.positionAt(s.endTagStart + 2),
			end: e.positionAt(s.endTagStart + 2 + s.tag.length)
		};
		a.push({
			range: l,
			newText: n
		});
	}
	return { changes: { [e.uri.toString()]: a } };
}
function Iu(e, t, n) {
	return e.endTagStart && e.endTagStart + 2 <= t && t <= e.endTagStart + 2 + n.length ? !0 : e.start + 1 <= t && t <= e.start + 1 + n.length;
}
function zu(e, t, n) {
	const r = e.offsetAt(t), i = n.findNodeAt(r);
	if (!i.tag || !i.endTagStart) return null;
	if (i.start + 1 <= r && r <= i.start + 1 + i.tag.length) {
		const s = r - 1 - i.start + i.endTagStart + 2;
		return e.positionAt(s);
	}
	if (i.endTagStart + 2 <= r && r <= i.endTagStart + 2 + i.tag.length) {
		const s = r - 2 - i.endTagStart + i.start + 1;
		return e.positionAt(s);
	}
	return null;
}
function Aa(e, t, n) {
	const r = e.offsetAt(t), i = n.findNodeAt(r), s = i.tag ? i.tag.length : 0;
	return i.endTagStart && (i.start + 1 <= r && r <= i.start + 1 + s || i.endTagStart + 2 <= r && r <= i.endTagStart + 2 + s) ? [$.create(e.positionAt(i.start + 1), e.positionAt(i.start + 1 + s)), $.create(e.positionAt(i.endTagStart + 2), e.positionAt(i.endTagStart + 2 + s))] : null;
}
var Hu = class {
	constructor(e) {
		this.dataManager = e;
	}
	limitRanges(e, t) {
		e = e.sort((u, d) => {
			let m = u.startLine - d.startLine;
			return m === 0 && (m = u.endLine - d.endLine), m;
		});
		let n;
		const r = [], i = [], s = [], a = (u, d) => {
			i[u] = d, d < 30 && (s[d] = (s[d] || 0) + 1);
		};
		for (let u = 0; u < e.length; u++) {
			const d = e[u];
			if (!n) n = d, a(u, 0);
			else if (d.startLine > n.startLine) {
				if (d.endLine <= n.endLine) r.push(n), n = d, a(u, r.length);
				else if (d.startLine > n.endLine) {
					do
						n = r.pop();
					while (n && d.startLine > n.endLine);
					n && r.push(n), n = d, a(u, r.length);
				}
			}
		}
		let o = 0, l = 0;
		for (let u = 0; u < s.length; u++) {
			const d = s[u];
			if (d) {
				if (d + o > t) {
					l = u;
					break;
				}
				o += d;
			}
		}
		const c = [];
		for (let u = 0; u < e.length; u++) {
			const d = i[u];
			typeof d == "number" && (d < l || d === l && o++ < t) && c.push(e[u]);
		}
		return c;
	}
	getFoldingRanges(e, t) {
		const n = this.dataManager.getVoidElements(e.languageId), r = ge(e.getText());
		let i = r.scan();
		const s = [], a = [];
		let o = null, l = -1;
		function c(d) {
			s.push(d), l = d.startLine;
		}
		for (; i !== U.EOS;) {
			switch (i) {
				case U.StartTag: {
					const d = r.getTokenText(), m = e.positionAt(r.getTokenOffset()).line;
					a.push({
						startLine: m,
						tagName: d
					}), o = d;
					break;
				}
				case U.EndTag:
					o = r.getTokenText();
					break;
				case U.StartTagClose: if (!o || !this.dataManager.isVoidElement(o, n)) break;
				case U.EndTagClose:
				case U.StartTagSelfClose: {
					let d = a.length - 1;
					for (; d >= 0 && a[d].tagName !== o;) d--;
					if (d >= 0) {
						const m = a[d];
						a.length = d;
						const p = e.positionAt(r.getTokenOffset()).line, b = m.startLine, g = p - 1;
						g > b && l !== b && c({
							startLine: b,
							endLine: g
						});
					}
					break;
				}
				case U.Comment: {
					let d = e.positionAt(r.getTokenOffset()).line;
					const m = r.getTokenText().match(/^\s*#(region\b)|(endregion\b)/);
					if (m) if (m[1]) a.push({
						startLine: d,
						tagName: ""
					});
					else {
						let p = a.length - 1;
						for (; p >= 0 && a[p].tagName.length;) p--;
						if (p >= 0) {
							const b = a[p];
							a.length = p;
							const g = d;
							d = b.startLine, g > d && l !== d && c({
								startLine: d,
								endLine: g,
								kind: an.Region
							});
						}
					}
					else {
						const p = e.positionAt(r.getTokenOffset() + r.getTokenLength()).line;
						d < p && c({
							startLine: d,
							endLine: p,
							kind: an.Comment
						});
					}
					break;
				}
			}
			i = r.scan();
		}
		const u = t && t.rangeLimit || Number.MAX_VALUE;
		return s.length > u ? this.limitRanges(s, u) : s;
	}
}, Uu = class {
	constructor(e) {
		this.htmlParser = e;
	}
	getSelectionRanges(e, t) {
		const n = this.htmlParser.parseDocument(e);
		return t.map((r) => this.getSelectionRange(r, e, n));
	}
	getSelectionRange(e, t, n) {
		const r = this.getApplicableRanges(t, e, n);
		let i, s;
		for (let a = r.length - 1; a >= 0; a--) {
			const o = r[a];
			(!i || o[0] !== i[0] || o[1] !== i[1]) && (s = un.create($.create(t.positionAt(r[a][0]), t.positionAt(r[a][1])), s)), i = o;
		}
		return s || (s = un.create($.create(e, e))), s;
	}
	getApplicableRanges(e, t, n) {
		const r = e.offsetAt(t), i = n.findNodeAt(r);
		let s = this.getAllParentTagRanges(i);
		if (i.startTagEnd && !i.endTagStart) {
			if (i.startTagEnd !== i.end) return [[i.start, i.end]];
			const a = $.create(e.positionAt(i.startTagEnd - 2), e.positionAt(i.startTagEnd));
			return e.getText(a) === "/>" ? s.unshift([i.start + 1, i.startTagEnd - 2]) : s.unshift([i.start + 1, i.startTagEnd - 1]), s = this.getAttributeLevelRanges(e, i, r).concat(s), s;
		}
		return !i.startTagEnd || !i.endTagStart ? s : (s.unshift([i.start, i.end]), i.start < r && r < i.startTagEnd ? (s.unshift([i.start + 1, i.startTagEnd - 1]), s = this.getAttributeLevelRanges(e, i, r).concat(s), s) : i.startTagEnd <= r && r <= i.endTagStart ? (s.unshift([i.startTagEnd, i.endTagStart]), s) : (r >= i.endTagStart + 2 && s.unshift([i.endTagStart + 2, i.end - 1]), s));
	}
	getAllParentTagRanges(e) {
		let t = e;
		const n = [];
		for (; t.parent;) t = t.parent, this.getNodeRanges(t).forEach((r) => n.push(r));
		return n;
	}
	getNodeRanges(e) {
		return e.startTagEnd && e.endTagStart && e.startTagEnd < e.endTagStart ? [[e.startTagEnd, e.endTagStart], [e.start, e.end]] : [[e.start, e.end]];
	}
	getAttributeLevelRanges(e, t, n) {
		const r = $.create(e.positionAt(t.start), e.positionAt(t.end)), i = e.getText(r), s = n - t.start, a = ge(i);
		let o = a.scan();
		const l = t.start, c = [];
		let u = !1, d = -1;
		for (; o !== U.EOS;) {
			switch (o) {
				case U.AttributeName:
					if (s < a.getTokenOffset()) {
						u = !1;
						break;
					}
					s <= a.getTokenEnd() && c.unshift([a.getTokenOffset(), a.getTokenEnd()]), u = !0, d = a.getTokenOffset();
					break;
				case U.AttributeValue: {
					if (!u) break;
					const m = a.getTokenText();
					if (s < a.getTokenOffset()) {
						c.push([d, a.getTokenEnd()]);
						break;
					}
					s >= a.getTokenOffset() && s <= a.getTokenEnd() && (c.unshift([a.getTokenOffset(), a.getTokenEnd()]), (m[0] === "\"" && m[m.length - 1] === "\"" || m[0] === "'" && m[m.length - 1] === "'") && s >= a.getTokenOffset() + 1 && s <= a.getTokenEnd() - 1 && c.unshift([a.getTokenOffset() + 1, a.getTokenEnd() - 1]), c.push([d, a.getTokenEnd()]));
					break;
				}
			}
			o = a.scan();
		}
		return c.map((m) => [m[0] + l, m[1] + l]);
	}
};
const Du = {
	version: 1.1,
	tags: [
		{
			name: "html",
			description: {
				kind: "markdown",
				value: "The html element represents the root of an HTML document."
			},
			attributes: [
				{
					name: "manifest",
					description: {
						kind: "markdown",
						value: "Specifies the URI of a resource manifest indicating resources that should be cached locally. See [Using the application cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) for details."
					}
				},
				{
					name: "version",
					description: "Specifies the version of the HTML [Document Type Definition](https://developer.mozilla.org/en-US/docs/Glossary/DTD \"Document Type Definition: In HTML, the doctype is the required \"<!DOCTYPE html>\" preamble found at the top of all documents. Its sole purpose is to prevent a browser from switching into so-called “quirks mode” when rendering a document; that is, the \"<!DOCTYPE html>\" doctype ensures that the browser makes a best-effort attempt at following the relevant specifications, rather than using a different rendering mode that is incompatible with some specifications.\") that governs the current document. This attribute is not needed, because it is redundant with the version information in the document type declaration."
				},
				{
					name: "xmlns",
					description: "Specifies the XML Namespace of the document. Default value is `\"http://www.w3.org/1999/xhtml\"`. This is required in documents parsed with XML parsers, and optional in text/html documents."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/html"
			}]
		},
		{
			name: "head",
			description: {
				kind: "markdown",
				value: "The head element represents a collection of metadata for the Document."
			},
			attributes: [{
				name: "profile",
				description: "The URIs of one or more metadata profiles, separated by white space."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/head"
			}]
		},
		{
			name: "title",
			description: {
				kind: "markdown",
				value: "The title element represents the document's title or name. Authors should use titles that identify their documents even when they are used out of context, for example in a user's history or bookmarks, or in search results. The document's title is often different from its first heading, since the first heading does not have to stand alone when taken out of context."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/title"
			}]
		},
		{
			name: "base",
			description: {
				kind: "markdown",
				value: "The base element allows authors to specify the document base URL for the purposes of resolving relative URLs, and the name of the default browsing context for the purposes of following hyperlinks. The element does not represent any content beyond this information."
			},
			void: !0,
			attributes: [{
				name: "href",
				description: {
					kind: "markdown",
					value: "The base URL to be used throughout the document for relative URL addresses. If this attribute is specified, this element must come before any other elements with attributes whose values are URLs. Absolute and relative URLs are allowed."
				}
			}, {
				name: "target",
				valueSet: "target",
				description: {
					kind: "markdown",
					value: "A name or keyword indicating the default location to display the result when hyperlinks or forms cause navigation, for elements that do not have an explicit target reference. It is a name of, or keyword for, a _browsing context_ (for example: tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the result into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the result into a new unnamed browsing context.\n*   `_parent`: Load the result into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the result into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n\nIf this attribute is specified, this element must come before any other elements with attributes whose values are URLs."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/base"
			}]
		},
		{
			name: "link",
			description: {
				kind: "markdown",
				value: "The link element allows authors to link their document to other resources."
			},
			void: !0,
			attributes: [
				{
					name: "href",
					description: {
						kind: "markdown",
						value: "This attribute specifies the [URL](https://developer.mozilla.org/en-US/docs/Glossary/URL \"URL: Uniform Resource Locator (URL) is a text string specifying where a resource can be found on the Internet.\") of the linked resource. A URL can be absolute or relative."
					}
				},
				{
					name: "crossorigin",
					valueSet: "xo",
					description: {
						kind: "markdown",
						value: "This enumerated attribute indicates whether [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS \"CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.\") must be used when fetching the resource. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas \"Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.\") element without being _tainted_. The allowed values are:\n\n`anonymous`\n\nA cross-origin request (i.e. with an [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin \"The Origin request header indicates where a fetch originates from. It doesn't include any path information, but only the server name. It is sent with CORS requests, as well as with POST requests. It is similar to the Referer header, but, unlike this header, it doesn't disclose the whole path.\") HTTP header) is performed, but no credential is sent (i.e. no cookie, X.509 certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (by not setting the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin \"The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.\") HTTP header) the image will be tainted and its usage restricted.\n\n`use-credentials`\n\nA cross-origin request (i.e. with an `Origin` HTTP header) is performed along with a credential sent (i.e. a cookie, certificate, and/or HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials \"The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to frontend JavaScript code when the request's credentials mode (Request.credentials) is \"include\".\") HTTP header), the resource will be _tainted_ and its usage restricted.\n\nIf the attribute is not present, the resource is fetched without a [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS \"CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.\") request (i.e. without sending the `Origin` HTTP header), preventing its non-tainted usage. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for additional information."
					}
				},
				{
					name: "rel",
					description: {
						kind: "markdown",
						value: "This attribute names a relationship of the linked document to the current document. The attribute must be a space-separated list of the [link types values](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
					}
				},
				{
					name: "media",
					description: {
						kind: "markdown",
						value: "This attribute specifies the media that the linked resource applies to. Its value must be a media type / [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries). This attribute is mainly useful when linking to external stylesheets — it allows the user agent to pick the best adapted one for the device it runs on.\n\n**Notes:**\n\n*   In HTML 4, this can only be a simple white-space-separated list of media description literals, i.e., [media types and groups](https://developer.mozilla.org/en-US/docs/Web/CSS/@media), where defined and allowed as values for this attribute, such as `print`, `screen`, `aural`, `braille`. HTML5 extended this to any kind of [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries), which are a superset of the allowed values of HTML 4.\n*   Browsers not supporting [CSS3 Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries) won't necessarily recognize the adequate link; do not forget to set fallback links, the restricted set of media queries defined in HTML 4."
					}
				},
				{
					name: "hreflang",
					description: {
						kind: "markdown",
						value: "This attribute indicates the language of the linked resource. It is purely advisory. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt). Use this attribute only if the [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute is present."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "This attribute is used to define the type of the content linked to. The value of the attribute should be a MIME type such as **text/html**, **text/css**, and so on. The common use of this attribute is to define the type of stylesheet being referenced (such as **text/css**), but given that CSS is the only stylesheet language used on the web, not only is it possible to omit the `type` attribute, but is actually now recommended practice. It is also used on `rel=\"preload\"` link types, to make sure the browser only downloads file types that it supports."
					}
				},
				{
					name: "sizes",
					description: {
						kind: "markdown",
						value: "This attribute defines the sizes of the icons for visual media contained in the resource. It must be present only if the [`rel`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-rel) contains a value of `icon` or a non-standard type such as Apple's `apple-touch-icon`. It may have the following values:\n\n*   `any`, meaning that the icon can be scaled to any size as it is in a vector format, like `image/svg+xml`.\n*   a white-space separated list of sizes, each in the format `_<width in pixels>_x_<height in pixels>_` or `_<width in pixels>_X_<height in pixels>_`. Each of these sizes must be contained in the resource.\n\n**Note:** Most icon formats are only able to store one single icon; therefore most of the time the [`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-sizes) contains only one entry. MS's ICO format does, as well as Apple's ICNS. ICO is more ubiquitous; you should definitely use it."
					}
				},
				{
					name: "as",
					description: "This attribute is only used when `rel=\"preload\"` or `rel=\"prefetch\"` has been set on the `<link>` element. It specifies the type of content being loaded by the `<link>`, which is necessary for content prioritization, request matching, application of correct [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), and setting of correct [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept \"The Accept request HTTP header advertises which content types, expressed as MIME types, the client is able to understand. Using content negotiation, the server then selects one of the proposals, uses it and informs the client of its choice with the Content-Type response header. Browsers set adequate values for this header depending on\xA0the context where the request is done: when fetching a CSS stylesheet a different value is set for the request than when fetching an image,\xA0video or a script.\") request header."
				},
				{
					name: "importance",
					description: "Indicates the relative importance of the resource. Priority hints are delegated using the values:"
				},
				{
					name: "importance",
					description: "**`auto`**: Indicates\xA0**no\xA0preference**. The browser may use its own heuristics to decide the priority of the resource.\n\n**`high`**: Indicates to the\xA0browser\xA0that the resource is of\xA0**high** priority.\n\n**`low`**:\xA0Indicates to the\xA0browser\xA0that the resource is of\xA0**low** priority.\n\n**Note:** The `importance` attribute may only be used for the `<link>` element if `rel=\"preload\"` or `rel=\"prefetch\"` is present."
				},
				{
					name: "integrity",
					description: "Contains inline metadata — a base64-encoded cryptographic hash of the resource (file) you’re telling the browser to fetch. The browser can use this to verify that the fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)."
				},
				{
					name: "referrerpolicy",
					description: "A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer` means that the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade` means that no [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent’s default behavior, if no policy is otherwise specified.\n*   `origin` means that the referrer will be the origin of the page, which is roughly the scheme, the host, and the port.\n*   `origin-when-cross-origin` means that navigating to other origins will be limited to the scheme, the host, and the port, while navigating on the same origin will include the referrer's path.\n*   `unsafe-url` means that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins."
				},
				{
					name: "title",
					description: "The `title` attribute has special semantics on the `<link>` element. When used on a `<link rel=\"stylesheet\">` it defines a [preferred or an alternate stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets). Incorrectly using it may [cause the stylesheet to be ignored](https://developer.mozilla.org/en-US/docs/Correctly_Using_Titles_With_External_Stylesheets)."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/link"
			}]
		},
		{
			name: "meta",
			description: {
				kind: "markdown",
				value: "The meta element represents various kinds of metadata that cannot be expressed using the title, base, link, style, and script elements."
			},
			void: !0,
			attributes: [
				{
					name: "name",
					description: {
						kind: "markdown",
						value: `This attribute defines the name of a piece of document-level metadata. It should not be set if one of the attributes [\`itemprop\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-itemprop), [\`http-equiv\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [\`charset\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) is also set.

This metadata name is associated with the value contained by the [\`content\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute. The possible values for the name attribute are:

*   \`application-name\` which defines the name of the application running in the web page.
    
    **Note:**
    
    *   Browsers may use this to identify the application. It is different from the [\`<title>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title "The HTML Title element (<title>) defines the document's title that is shown in a browser's title bar or a page's tab.") element, which usually contain the application name, but may also contain information like the document name or a status.
    *   Simple web pages shouldn't define an application-name.
    
*   \`author\` which defines the name of the document's author.
*   \`description\` which contains a short and accurate summary of the content of the page. Several browsers, like Firefox and Opera, use this as the default description of bookmarked pages.
*   \`generator\` which contains the identifier of the software that generated the page.
*   \`keywords\` which contains words relevant to the page's content separated by commas.
*   \`referrer\` which controls the [\`Referer\` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) attached to requests sent from the document:
    
    Values for the \`content\` attribute of \`<meta name="referrer">\`
    
    \`no-referrer\`
    
    Do not send a HTTP \`Referrer\` header.
    
    \`origin\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the document.
    
    \`no-referrer-when-downgrade\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) as a referrer to URLs as secure as the current page, (https→https), but does not send a referrer to less secure URLs (https→http). This is the default behaviour.
    
    \`origin-when-cross-origin\`
    
    Send the full URL (stripped of parameters) for same-origin requests, but only send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) for other cases.
    
    \`same-origin\`
    
    A referrer will be sent for [same-site origins](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), but cross-origin requests will contain no referrer information.
    
    \`strict-origin\`
    
    Only send the origin of the document as the referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but don't send it to a less secure destination (HTTPS->HTTP).
    
    \`strict-origin-when-cross-origin\`
    
    Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).
    
    \`unsafe-URL\`
    
    Send the full URL (stripped of parameters) for same-origin or cross-origin requests.
    
    **Notes:**
    
    *   Some browsers support the deprecated values of \`always\`, \`default\`, and \`never\` for referrer.
    *   Dynamically inserting \`<meta name="referrer">\` (with [\`document.write\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) or [\`appendChild\`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)) makes the referrer behaviour unpredictable.
    *   When several conflicting policies are defined, the no-referrer policy is applied.
    

This attribute may also have a value taken from the extended list defined on [WHATWG Wiki MetaExtensions page](https://wiki.whatwg.org/wiki/MetaExtensions). Although none have been formally accepted yet, a few commonly used names are:

*   \`creator\` which defines the name of the creator of the document, such as an organization or institution. If there are more than one, several [\`<meta>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") elements should be used.
*   \`googlebot\`, a synonym of \`robots\`, is only followed by Googlebot (the indexing crawler for Google).
*   \`publisher\` which defines the name of the document's publisher.
*   \`robots\` which defines the behaviour that cooperative crawlers, or "robots", should use with the page. It is a comma-separated list of the values below:
    
    Values for the content of \`<meta name="robots">\`
    
    Value
    
    Description
    
    Used by
    
    \`index\`
    
    Allows the robot to index the page (default).
    
    All
    
    \`noindex\`
    
    Requests the robot to not index the page.
    
    All
    
    \`follow\`
    
    Allows the robot to follow the links on the page (default).
    
    All
    
    \`nofollow\`
    
    Requests the robot to not follow the links on the page.
    
    All
    
    \`none\`
    
    Equivalent to \`noindex, nofollow\`
    
    [Google](https://support.google.com/webmasters/answer/79812)
    
    \`noodp\`
    
    Prevents using the [Open Directory Project](https://www.dmoz.org/) description, if any, as the page description in search engine results.
    
    [Google](https://support.google.com/webmasters/answer/35624#nodmoz), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/meta-tags-robotstxt-yahoo-search-sln2213.html#cont5), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noarchive\`
    
    Requests the search engine not to cache the page content.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/SLN2213.html), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`nosnippet\`
    
    Prevents displaying any description of the page in search engine results.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noimageindex\`
    
    Requests this page not to appear as the referring page of an indexed image.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives)
    
    \`nocache\`
    
    Synonym of \`noarchive\`.
    
    [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    **Notes:**
    
    *   Only cooperative robots follow these rules. Do not expect to prevent e-mail harvesters with them.
    *   The robot still needs to access the page in order to read these rules. To prevent bandwidth consumption, use a _[robots.txt](https://developer.mozilla.org/en-US/docs/Glossary/robots.txt "robots.txt: Robots.txt is a file which is usually placed in the root of any website. It decides whether crawlers are permitted or forbidden access to the web site.")_ file.
    *   If you want to remove a page, \`noindex\` will work, but only after the robot visits the page again. Ensure that the \`robots.txt\` file is not preventing revisits.
    *   Some values are mutually exclusive, like \`index\` and \`noindex\`, or \`follow\` and \`nofollow\`. In these cases the robot's behaviour is undefined and may vary between them.
    *   Some crawler robots, like Google, Yahoo and Bing, support the same values for the HTTP header \`X-Robots-Tag\`; this allows non-HTML documents like images to use these rules.
    
*   \`slurp\`, is a synonym of \`robots\`, but only for Slurp - the crawler for Yahoo Search.
*   \`viewport\`, which gives hints about the size of the initial size of the [viewport](https://developer.mozilla.org/en-US/docs/Glossary/viewport "viewport: A viewport represents a polygonal (normally rectangular) area in computer graphics that is currently being viewed. In web browser terms, it refers to the part of the document you're viewing which is currently visible in its window (or the screen, if the document is being viewed in full screen mode). Content outside the viewport is not visible onscreen until scrolled into view."). Used by mobile devices only.
    
    Values for the content of \`<meta name="viewport">\`
    
    Value
    
    Possible subvalues
    
    Description
    
    \`width\`
    
    A positive integer number, or the text \`device-width\`
    
    Defines the pixel width of the viewport that you want the web site to be rendered at.
    
    \`height\`
    
    A positive integer, or the text \`device-height\`
    
    Defines the height of the viewport. Not used by any browser.
    
    \`initial-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the ratio between the device width (\`device-width\` in portrait mode or \`device-height\` in landscape mode) and the viewport size.
    
    \`maximum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the maximum amount to zoom in. It must be greater or equal to the \`minimum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`minimum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the minimum zoom level. It must be smaller or equal to the \`maximum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`user-scalable\`
    
    \`yes\` or \`no\`
    
    If set to \`no\`, the user is not able to zoom in the webpage. The default is \`yes\`. Browser settings can ignore this rule, and iOS10+ ignores it by default.
    
    Specification
    
    Status
    
    Comment
    
    [CSS Device Adaptation  
    The definition of '<meta name="viewport">' in that specification.](https://drafts.csswg.org/css-device-adapt/#viewport-meta)
    
    Working Draft
    
    Non-normatively describes the Viewport META element
    
    See also: [\`@viewport\`](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport "The @viewport CSS at-rule lets you configure the viewport through which the document is viewed. It's primarily used for mobile devices, but is also used by desktop browsers that support features like "snap to edge" (such as Microsoft Edge).")
    
    **Notes:**
    
    *   Though unstandardized, this declaration is respected by most mobile browsers due to de-facto dominance.
    *   The default values may vary between devices and browsers.
    *   To learn about this declaration in Firefox for Mobile, see [this article](https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag "Mobile/Viewport meta tag").`
					}
				},
				{
					name: "http-equiv",
					description: {
						kind: "markdown",
						value: "Defines a pragma directive. The attribute is named `**http-equiv**(alent)` because all the allowed values are names of particular HTTP headers:\n\n*   `\"content-language\"`  \n    Defines the default language of the page. It can be overridden by the [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) attribute on any element.\n    \n    **Warning:** Do not use this value, as it is obsolete. Prefer the `lang` attribute on the [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html \"The HTML <html> element represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.\") element.\n    \n*   `\"content-security-policy\"`  \n    Allows page authors to define a [content policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives) for the current page. Content policies mostly specify allowed server origins and script endpoints which help guard against cross-site scripting attacks.\n*   `\"content-type\"`  \n    Defines the [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the document, followed by its character encoding. It follows the same syntax as the HTTP `content-type` entity-header field, but as it is inside a HTML page, most values other than `text/html` are impossible. Therefore the valid syntax for its `content` is the string '`text/html`' followed by a character set with the following syntax: '`; charset=_IANAcharset_`', where `IANAcharset` is the _preferred MIME name_ for a character set as [defined by the IANA.](https://www.iana.org/assignments/character-sets)\n    \n    **Warning:** Do not use this value, as it is obsolete. Use the [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute on the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta \"The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.\") element.\n    \n    **Note:** As [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta \"The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.\") can't change documents' types in XHTML or HTML5's XHTML serialization, never set the MIME type to an XHTML MIME type with `<meta>`.\n    \n*   `\"refresh\"`  \n    This instruction specifies:\n    *   The number of seconds until the page should be reloaded - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer.\n    *   The number of seconds until the page should redirect to another - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer followed by the string '`;url=`', and a valid URL.\n*   `\"set-cookie\"`  \n    Defines a [cookie](https://developer.mozilla.org/en-US/docs/cookie) for the page. Its content must follow the syntax defined in the [IETF HTTP Cookie Specification](https://tools.ietf.org/html/draft-ietf-httpstate-cookie-14).\n    \n    **Warning:** Do not use this instruction, as it is obsolete. Use the HTTP header [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) instead."
					}
				},
				{
					name: "content",
					description: {
						kind: "markdown",
						value: "This attribute contains the value for the [`http-equiv`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-name) attribute, depending on which is used."
					}
				},
				{
					name: "charset",
					description: {
						kind: "markdown",
						value: "This attribute declares the page's character encoding. It must contain a [standard IANA MIME name for character encodings](https://www.iana.org/assignments/character-sets). Although the standard doesn't request a specific encoding, it suggests:\n\n*   Authors are encouraged to use [`UTF-8`](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8).\n*   Authors should not use ASCII-incompatible encodings to avoid security risk: browsers not supporting them may interpret harmful content as HTML. This happens with the `JIS_C6226-1983`, `JIS_X0212-1990`, `HZ-GB-2312`, `JOHAB`, the ISO-2022 family and the EBCDIC family.\n\n**Note:** ASCII-incompatible encodings are those that don't map the 8-bit code points `0x20` to `0x7E` to the `0x0020` to `0x007E` Unicode code points)\n\n*   Authors **must not** use `CESU-8`, `UTF-7`, `BOCU-1` and/or `SCSU` as [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) attacks with these encodings have been demonstrated.\n*   Authors should not use `UTF-32` because not all HTML5 encoding algorithms can distinguish it from `UTF-16`.\n\n**Notes:**\n\n*   The declared character encoding must match the one the page was saved with to avoid garbled characters and security holes.\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta \"The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.\") element declaring the encoding must be inside the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head \"The HTML <head> element provides general information (metadata) about the document, including its title and links to its\xA0scripts and style sheets.\") element and **within the first 1024 bytes** of the HTML as some browsers only look at those bytes before choosing an encoding.\n*   This [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta \"The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.\") element is only one part of the [algorithm to determine a page's character set](https://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#encoding-sniffing-algorithm \"Algorithm charset page\"). The [`Content-Type` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) and any [Byte-Order Marks](https://developer.mozilla.org/en-US/docs/Glossary/Byte-Order_Mark \"The definition of that term (Byte-Order Marks) has not been written yet; please consider contributing it!\") override this element.\n*   It is strongly recommended to define the character encoding. If a page's encoding is undefined, cross-scripting techniques are possible, such as the [`UTF-7` fallback cross-scripting technique](https://code.google.com/p/doctype-mirror/wiki/ArticleUtf7).\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta \"The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.\") element with a `charset` attribute is a synonym for the pre-HTML5 `<meta http-equiv=\"Content-Type\" content=\"text/html; charset=_IANAcharset_\">`, where _`IANAcharset`_ contains the value of the equivalent [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute. This syntax is still allowed, although no longer recommended."
					}
				},
				{
					name: "scheme",
					description: "This attribute defines the scheme in which metadata is described. A scheme is a context leading to the correct interpretations of the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) value, like a format.\n\n**Warning:** Do not use this value, as it is obsolete. There is no replacement as there was no real usage for it."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/meta"
			}]
		},
		{
			name: "style",
			description: {
				kind: "markdown",
				value: "The style element allows authors to embed style information in their documents. The style element is one of several inputs to the styling processing model. The element does not represent content for the user."
			},
			attributes: [
				{
					name: "media",
					description: {
						kind: "markdown",
						value: "This attribute defines which media the style should be applied to. Its value is a [media query](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries), which defaults to `all` if the attribute is missing."
					}
				},
				{
					name: "nonce",
					description: {
						kind: "markdown",
						value: "A cryptographic nonce (number used once) used to whitelist inline styles in a [style-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource’s policy is otherwise trivial."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "This attribute defines the styling language as a MIME type (charset should not be specified). This attribute is optional and defaults to `text/css` if it is not specified — there is very little reason to include this in modern web documents."
					}
				},
				{
					name: "scoped",
					valueSet: "v"
				},
				{
					name: "title",
					description: "This attribute specifies [alternative style sheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets) sets."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/style"
			}]
		},
		{
			name: "body",
			description: {
				kind: "markdown",
				value: "The body element represents the content of the document."
			},
			attributes: [
				{
					name: "onafterprint",
					description: {
						kind: "markdown",
						value: "Function to call after the user has printed the document."
					}
				},
				{
					name: "onbeforeprint",
					description: {
						kind: "markdown",
						value: "Function to call when the user requests printing of the document."
					}
				},
				{
					name: "onbeforeunload",
					description: {
						kind: "markdown",
						value: "Function to call when the document is about to be unloaded."
					}
				},
				{
					name: "onhashchange",
					description: {
						kind: "markdown",
						value: "Function to call when the fragment identifier part (starting with the hash (`'#'`) character) of the document's current address has changed."
					}
				},
				{
					name: "onlanguagechange",
					description: {
						kind: "markdown",
						value: "Function to call when the preferred languages changed."
					}
				},
				{
					name: "onmessage",
					description: {
						kind: "markdown",
						value: "Function to call when the document has received a message."
					}
				},
				{
					name: "onoffline",
					description: {
						kind: "markdown",
						value: "Function to call when network communication has failed."
					}
				},
				{
					name: "ononline",
					description: {
						kind: "markdown",
						value: "Function to call when network communication has been restored."
					}
				},
				{ name: "onpagehide" },
				{ name: "onpageshow" },
				{
					name: "onpopstate",
					description: {
						kind: "markdown",
						value: "Function to call when the user has navigated session history."
					}
				},
				{
					name: "onstorage",
					description: {
						kind: "markdown",
						value: "Function to call when the storage area has changed."
					}
				},
				{
					name: "onunload",
					description: {
						kind: "markdown",
						value: "Function to call when the document is going away."
					}
				},
				{
					name: "alink",
					description: "Color of text for hyperlinks when selected. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color \"The color CSS property sets the foreground color value of an element's text and text decorations, and sets the currentcolor value.\") property in conjunction with the [`:active`](https://developer.mozilla.org/en-US/docs/Web/CSS/:active \"The :active CSS pseudo-class represents an element (such as a button) that is being activated by the user.\") pseudo-class instead._"
				},
				{
					name: "background",
					description: "URI of a image to use as a background. _This method is non-conforming, use CSS [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background \"The background shorthand CSS property sets all background style properties at once, such as color, image, origin and size, or repeat method.\") property on the element instead._"
				},
				{
					name: "bgcolor",
					description: "Background color for the document. _This method is non-conforming, use CSS [`background-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color \"The background-color CSS property sets the background color of an element.\") property on the element instead._"
				},
				{
					name: "bottommargin",
					description: "The margin of the bottom of the body. _This method is non-conforming, use CSS [`margin-bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom \"The margin-bottom CSS property sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer.\") property on the element instead._"
				},
				{
					name: "leftmargin",
					description: "The margin of the left of the body. _This method is non-conforming, use CSS [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left \"The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.\") property on the element instead._"
				},
				{
					name: "link",
					description: "Color of text for unvisited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color \"The color CSS property sets the foreground color value of an element's text and text decorations, and sets the currentcolor value.\") property in conjunction with the [`:link`](https://developer.mozilla.org/en-US/docs/Web/CSS/:link \"The :link CSS pseudo-class represents an element that has not yet been visited. It matches every unvisited <a>, <area>, or <link> element that has an href attribute.\") pseudo-class instead._"
				},
				{
					name: "onblur",
					description: "Function to call when the document loses focus."
				},
				{
					name: "onerror",
					description: "Function to call when the document fails to load properly."
				},
				{
					name: "onfocus",
					description: "Function to call when the document receives focus."
				},
				{
					name: "onload",
					description: "Function to call when the document has finished loading."
				},
				{
					name: "onredo",
					description: "Function to call when the user has moved forward in undo transaction history."
				},
				{
					name: "onresize",
					description: "Function to call when the document has been resized."
				},
				{
					name: "onundo",
					description: "Function to call when the user has moved backward in undo transaction history."
				},
				{
					name: "rightmargin",
					description: "The margin of the right of the body. _This method is non-conforming, use CSS [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right \"The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.\") property on the element instead._"
				},
				{
					name: "text",
					description: "Foreground color of text. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color \"The color CSS property sets the foreground color value of an element's text and text decorations, and sets the currentcolor value.\") property on the element instead._"
				},
				{
					name: "topmargin",
					description: "The margin of the top of the body. _This method is non-conforming, use CSS [`margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top \"The margin-top CSS property sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer.\") property on the element instead._"
				},
				{
					name: "vlink",
					description: "Color of text for visited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color \"The color CSS property sets the foreground color value of an element's text and text decorations, and sets the currentcolor value.\") property in conjunction with the [`:visited`](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited \"The :visited CSS pseudo-class represents links that the user has already visited. For privacy reasons, the styles that can be modified using this selector are very limited.\") pseudo-class instead._"
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/body"
			}]
		},
		{
			name: "article",
			description: {
				kind: "markdown",
				value: "The article element represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content. Each article should be identified, typically by including a heading (h1–h6 element) as a child of the article element."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/article"
			}]
		},
		{
			name: "section",
			description: {
				kind: "markdown",
				value: "The section element represents a generic section of a document or application. A section, in this context, is a thematic grouping of content. Each section should be identified, typically by including a heading ( h1- h6 element) as a child of the section element."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/section"
			}]
		},
		{
			name: "nav",
			description: {
				kind: "markdown",
				value: "The nav element represents a section of a page that links to other pages or to parts within the page: a section with navigation links."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/nav"
			}]
		},
		{
			name: "aside",
			description: {
				kind: "markdown",
				value: "The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element, and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/aside"
			}]
		},
		{
			name: "h1",
			description: {
				kind: "markdown",
				value: "The h1 element represents a section heading."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
			}]
		},
		{
			name: "h2",
			description: {
				kind: "markdown",
				value: "The h2 element represents a section heading."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
			}]
		},
		{
			name: "h3",
			description: {
				kind: "markdown",
				value: "The h3 element represents a section heading."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
			}]
		},
		{
			name: "h4",
			description: {
				kind: "markdown",
				value: "The h4 element represents a section heading."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
			}]
		},
		{
			name: "h5",
			description: {
				kind: "markdown",
				value: "The h5 element represents a section heading."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
			}]
		},
		{
			name: "h6",
			description: {
				kind: "markdown",
				value: "The h6 element represents a section heading."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
			}]
		},
		{
			name: "header",
			description: {
				kind: "markdown",
				value: "The header element represents introductory content for its nearest ancestor sectioning content or sectioning root element. A header typically contains a group of introductory or navigational aids. When the nearest ancestor sectioning content or sectioning root element is the body element, then it applies to the whole page."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/header"
			}]
		},
		{
			name: "footer",
			description: {
				kind: "markdown",
				value: "The footer element represents a footer for its nearest ancestor sectioning content or sectioning root element. A footer typically contains information about its section such as who wrote it, links to related documents, copyright data, and the like."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/footer"
			}]
		},
		{
			name: "address",
			description: {
				kind: "markdown",
				value: "The address element represents the contact information for its nearest article or body element ancestor. If that is the body element, then the contact information applies to the document as a whole."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/address"
			}]
		},
		{
			name: "p",
			description: {
				kind: "markdown",
				value: "The p element represents a paragraph."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/p"
			}]
		},
		{
			name: "hr",
			description: {
				kind: "markdown",
				value: "The hr element represents a paragraph-level thematic break, e.g. a scene change in a story, or a transition to another topic within a section of a reference book."
			},
			void: !0,
			attributes: [
				{
					name: "align",
					description: "Sets the alignment of the rule on the page. If no value is specified, the default value is `left`."
				},
				{
					name: "color",
					description: "Sets the color of the rule through color name or hexadecimal value."
				},
				{
					name: "noshade",
					description: "Sets the rule to have no shading."
				},
				{
					name: "size",
					description: "Sets the height, in pixels, of the rule."
				},
				{
					name: "width",
					description: "Sets the length of the rule on the page through a pixel or percentage value."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/hr"
			}]
		},
		{
			name: "pre",
			description: {
				kind: "markdown",
				value: "The pre element represents a block of preformatted text, in which structure is represented by typographic conventions rather than by elements."
			},
			attributes: [
				{
					name: "cols",
					description: "Contains the _preferred_ count of characters that a line should have. It was a non-standard synonym of [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre#attr-width). To achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width \"The width CSS property sets an element's width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.\") instead."
				},
				{
					name: "width",
					description: "Contains the _preferred_ count of characters that a line should have. Though technically still implemented, this attribute has no visual effect; to achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width \"The width CSS property sets an element's width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.\") instead."
				},
				{
					name: "wrap",
					description: "Is a _hint_ indicating how the overflow must happen. In modern browser this hint is ignored and no visual effect results in its present; to achieve such an effect, use CSS [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space \"The white-space CSS property sets how white space inside an element is handled.\") instead."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/pre"
			}]
		},
		{
			name: "blockquote",
			description: {
				kind: "markdown",
				value: "The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a footer or cite element, and optionally with in-line changes such as annotations and abbreviations."
			},
			attributes: [{
				name: "cite",
				description: {
					kind: "markdown",
					value: "A URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/blockquote"
			}]
		},
		{
			name: "ol",
			description: {
				kind: "markdown",
				value: "The ol element represents a list of items, where the items have been intentionally ordered, such that changing the order would change the meaning of the document."
			},
			attributes: [
				{
					name: "reversed",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute specifies that the items of the list are specified in reversed order."
					}
				},
				{
					name: "start",
					description: {
						kind: "markdown",
						value: "This integer attribute specifies the start value for numbering the individual list items. Although the ordering type of list elements might be Roman numerals, such as XXXI, or letters, the value of start is always represented as a number. To start numbering elements from the letter \"C\", use `<ol start=\"3\">`.\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5."
					}
				},
				{
					name: "type",
					valueSet: "lt",
					description: {
						kind: "markdown",
						value: "Indicates the numbering type:\n\n*   `'a'` indicates lowercase letters,\n*   `'A'` indicates uppercase letters,\n*   `'i'` indicates lowercase Roman numerals,\n*   `'I'` indicates uppercase Roman numerals,\n*   and `'1'` indicates numbers (default).\n\nThe type set is used for the entire list unless a different [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attr-type) attribute is used within an enclosed [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li \"The HTML <li> element is used to represent an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.\") element.\n\n**Note:** This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\nUnless the value of the list number matters (e.g. in legal or technical documents where items are to be referenced by their number/letter), the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type \"The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.\") property should be used instead."
					}
				},
				{
					name: "compact",
					description: "This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn't work in all browsers.\n\n**Warning:** Do not use this attribute, as it has been deprecated: the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol \"The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.\") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give an effect similar to the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [`line-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height \"The line-height CSS property sets the amount of space used for lines, such as in text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height.\") can be used with a value of `80%`."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/ol"
			}]
		},
		{
			name: "ul",
			description: {
				kind: "markdown",
				value: "The ul element represents a list of items, where the order of the items is not important — that is, where changing the order would not materially change the meaning of the document."
			},
			attributes: [{
				name: "compact",
				description: "This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn't work in all browsers.\n\n**Usage note:\xA0**Do not use this attribute, as it has been deprecated: the [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul \"The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.\") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give a similar effect as the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [line-height](https://developer.mozilla.org/en-US/docs/CSS/line-height) can be used with a value of `80%`."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/ul"
			}]
		},
		{
			name: "li",
			description: {
				kind: "markdown",
				value: "The li element represents a list item. If its parent element is an ol, ul, or menu element, then the element is an item of the parent element's list, as defined for those elements. Otherwise, the list item has no defined list-related relationship to any other li element."
			},
			attributes: [{
				name: "value",
				description: {
					kind: "markdown",
					value: "This integer attribute indicates the current ordinal value of the list item as defined by the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol \"The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.\") element. The only allowed value for this attribute is a number, even if the list is displayed with Roman numerals or letters. List items that follow this one continue numbering from the value set. The **value** attribute has no meaning for unordered lists ([`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul \"The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.\")) or for menus ([`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu \"The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.\")).\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\n**Note:** Prior to Gecko\xA09.0, negative values were incorrectly converted to 0. Starting in Gecko\xA09.0 all integer values are correctly parsed."
				}
			}, {
				name: "type",
				description: "This character attribute indicates the numbering type:\n\n*   `a`: lowercase letters\n*   `A`: uppercase letters\n*   `i`: lowercase Roman numerals\n*   `I`: uppercase Roman numerals\n*   `1`: numbers\n\nThis type overrides the one used by its parent [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol \"The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.\") element, if any.\n\n**Usage note:** This attribute has been deprecated: use the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type \"The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.\") property instead."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/li"
			}]
		},
		{
			name: "dl",
			description: {
				kind: "markdown",
				value: "The dl element represents an association list consisting of zero or more name-value groups (a description list). A name-value group consists of one or more names (dt elements) followed by one or more values (dd elements), ignoring any nodes other than dt and dd elements. Within a single dl element, there should not be more than one dt element for each name."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/dl"
			}]
		},
		{
			name: "dt",
			description: {
				kind: "markdown",
				value: "The dt element represents the term, or name, part of a term-description group in a description list (dl element)."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/dt"
			}]
		},
		{
			name: "dd",
			description: {
				kind: "markdown",
				value: "The dd element represents the description, definition, or value, part of a term-description group in a description list (dl element)."
			},
			attributes: [{
				name: "nowrap",
				description: "If the value of this attribute is set to `yes`, the definition text will not wrap. The default value is `no`."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/dd"
			}]
		},
		{
			name: "figure",
			description: {
				kind: "markdown",
				value: "The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/figure"
			}]
		},
		{
			name: "figcaption",
			description: {
				kind: "markdown",
				value: "The figcaption element represents a caption or legend for the rest of the contents of the figcaption element's parent figure element, if any."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/figcaption"
			}]
		},
		{
			name: "main",
			description: {
				kind: "markdown",
				value: "The main element represents the main content of the body of a document or application. The main content area consists of content that is directly related to or expands upon the central topic of a document or central functionality of an application."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/main"
			}]
		},
		{
			name: "div",
			description: {
				kind: "markdown",
				value: "The div element has no special meaning at all. It represents its children. It can be used with the class, lang, and title attributes to mark up semantics common to a group of consecutive elements."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/div"
			}]
		},
		{
			name: "a",
			description: {
				kind: "markdown",
				value: "If the a element has an href attribute, then it represents a hyperlink (a hypertext anchor) labeled by its contents."
			},
			attributes: [
				{
					name: "href",
					description: {
						kind: "markdown",
						value: "Contains a URL or a URL fragment that the hyperlink points to.\nA URL fragment is a name preceded by a hash mark (`#`), which specifies an internal target location (an [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id) of an HTML element) within the current document. URLs are not restricted to Web (HTTP)-based documents, but can use any protocol supported by the browser. For example, [`file:`](https://en.wikipedia.org/wiki/File_URI_scheme), `ftp:`, and `mailto:` work in most browsers.\n\n**Note:** You can use `href=\"#top\"` or the empty fragment `href=\"#\"` to link to the top of the current page. [This behavior is specified by HTML5](https://www.w3.org/TR/html5/single-page.html#scroll-to-fragid)."
					}
				},
				{
					name: "target",
					valueSet: "target",
					description: {
						kind: "markdown",
						value: "Specifies where to display the linked URL. It is a name of, or keyword for, a _browsing context_: a tab, window, or `<iframe>`. The following keywords have special meanings:\n\n*   `_self`: Load the URL into the same browsing context as the current one. This is the default behavior.\n*   `_blank`: Load the URL into a new browsing context. This is usually a tab, but users can configure browsers to use new windows instead.\n*   `_parent`: Load the URL into the parent browsing context of the current one. If there is no parent, this behaves the same way as `_self`.\n*   `_top`: Load the URL into the top-level browsing context (that is, the \"highest\" browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this behaves the same way as `_self`.\n\n**Note:** When using `target`, consider adding `rel=\"noreferrer\"` to avoid exploitation of the `window.opener` API.\n\n**Note:** Linking to another page using `target=\"_blank\"` will run the new page on the same process as your page. If the new page is executing expensive JS, your page's performance may suffer. To avoid this use `rel=\"noopener\"`."
					}
				},
				{
					name: "download",
					description: {
						kind: "markdown",
						value: "This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). There are no restrictions on allowed values, though `/` and `\\` are converted to underscores. Most file systems limit some punctuation in file names, and browsers will adjust the suggested name accordingly.\n\n**Notes:**\n\n*   This attribute only works for [same-origin URLs](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).\n*   Although HTTP(s) URLs need to be in the same-origin, [`blob:` URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL) and [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are allowed so that content generated by JavaScript, such as pictures created in an image-editor Web app, can be downloaded.\n*   If the HTTP header [`Content-Disposition:`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) gives a different filename than this attribute, the HTTP header takes priority over this attribute.\n*   If `Content-Disposition:` is set to `inline`, Firefox prioritizes `Content-Disposition`, like the filename case, while Chrome prioritizes the `download` attribute."
					}
				},
				{
					name: "ping",
					description: {
						kind: "markdown",
						value: "Contains a space-separated list of URLs to which, when the hyperlink is followed, [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST \"The HTTP POST method sends data to the server. The type of the body of the request is indicated by the Content-Type header.\") requests with the body `PING` will be sent by the browser (in the background). Typically used for tracking."
					}
				},
				{
					name: "rel",
					description: {
						kind: "markdown",
						value: "Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
					}
				},
				{
					name: "hreflang",
					description: {
						kind: "markdown",
						value: "This attribute indicates the human language of the linked resource. It is purely advisory, with no built-in functionality. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt \"Tags for Identifying Languages\")."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "Specifies the media type in the form of a [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type \"MIME type: A\xA0MIME type\xA0(now properly called \"media type\", but\xA0also sometimes \"content type\") is a string sent along\xA0with a file indicating the type of the file (describing the content format, for example, a sound file might be labeled\xA0audio/ogg, or an image file\xA0image/png).\") for the linked URL. It is purely advisory, with no built-in functionality."
					}
				},
				{
					name: "referrerpolicy",
					description: "Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) to send when fetching the URL:\n\n*   `'no-referrer'` means the `Referer:` header will not be sent.\n*   `'no-referrer-when-downgrade'` means no `Referer:` header will be sent when navigating to an origin without HTTPS. This is the default behavior.\n*   `'origin'` means the referrer will be the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the page, not including information after the domain.\n*   `'origin-when-cross-origin'` meaning that navigations to other origins will be limited to the scheme, the host and the port, while navigations on the same origin will include the referrer's path.\n*   `'strict-origin-when-cross-origin'`\n*   `'unsafe-url'` means the referrer will include the origin and path, but not the fragment, password, or username. This is unsafe because it can leak data from secure URLs to insecure ones."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/a"
			}]
		},
		{
			name: "em",
			description: {
				kind: "markdown",
				value: "The em element represents stress emphasis of its contents."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/em"
			}]
		},
		{
			name: "strong",
			description: {
				kind: "markdown",
				value: "The strong element represents strong importance, seriousness, or urgency for its contents."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/strong"
			}]
		},
		{
			name: "small",
			description: {
				kind: "markdown",
				value: "The small element represents side comments such as small print."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/small"
			}]
		},
		{
			name: "s",
			description: {
				kind: "markdown",
				value: "The s element represents contents that are no longer accurate or no longer relevant."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/s"
			}]
		},
		{
			name: "cite",
			description: {
				kind: "markdown",
				value: "The cite element represents a reference to a creative work. It must include the title of the work or the name of the author(person, people or organization) or an URL reference, or a reference in abbreviated form as per the conventions used for the addition of citation metadata."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/cite"
			}]
		},
		{
			name: "q",
			description: {
				kind: "markdown",
				value: "The q element represents some phrasing content quoted from another source."
			},
			attributes: [{
				name: "cite",
				description: {
					kind: "markdown",
					value: "The value of this attribute is a URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/q"
			}]
		},
		{
			name: "dfn",
			description: {
				kind: "markdown",
				value: "The dfn element represents the defining instance of a term. The paragraph, description list group, or section that is the nearest ancestor of the dfn element must also contain the definition(s) for the term given by the dfn element."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/dfn"
			}]
		},
		{
			name: "abbr",
			description: {
				kind: "markdown",
				value: "The abbr element represents an abbreviation or acronym, optionally with its expansion. The title attribute may be used to provide an expansion of the abbreviation. The attribute, if specified, must contain an expansion of the abbreviation, and nothing else."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/abbr"
			}]
		},
		{
			name: "ruby",
			description: {
				kind: "markdown",
				value: "The ruby element allows one or more spans of phrasing content to be marked with ruby annotations. Ruby annotations are short runs of text presented alongside base text, primarily used in East Asian typography as a guide for pronunciation or to include other annotations. In Japanese, this form of typography is also known as furigana. Ruby text can appear on either side, and sometimes both sides, of the base text, and it is possible to control its position using CSS. A more complete introduction to ruby can be found in the Use Cases & Exploratory Approaches for Ruby Markup document as well as in CSS Ruby Module Level 1. [RUBY-UC] [CSSRUBY]"
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/ruby"
			}]
		},
		{
			name: "rb",
			description: {
				kind: "markdown",
				value: "The rb element marks the base text component of a ruby annotation. When it is the child of a ruby element, it doesn't represent anything itself, but its parent ruby element uses it as part of determining what it represents."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/rb"
			}]
		},
		{
			name: "rt",
			description: {
				kind: "markdown",
				value: "The rt element marks the ruby text component of a ruby annotation. When it is the child of a ruby element or of an rtc element that is itself the child of a ruby element, it doesn't represent anything itself, but its ancestor ruby element uses it as part of determining what it represents."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/rt"
			}]
		},
		{
			name: "rp",
			description: {
				kind: "markdown",
				value: "The rp element is used to provide fallback text to be shown by user agents that don't support ruby annotations. One widespread convention is to provide parentheses around the ruby text component of a ruby annotation."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/rp"
			}]
		},
		{
			name: "time",
			description: {
				kind: "markdown",
				value: "The time element represents its contents, along with a machine-readable form of those contents in the datetime attribute. The kind of content is limited to various kinds of dates, times, time-zone offsets, and durations, as described below."
			},
			attributes: [{
				name: "datetime",
				description: {
					kind: "markdown",
					value: "This attribute indicates the time and/or date of the element and must be in one of the formats described below."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/time"
			}]
		},
		{
			name: "code",
			description: {
				kind: "markdown",
				value: "The code element represents a fragment of computer code. This could be an XML element name, a file name, a computer program, or any other string that a computer would recognize."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/code"
			}]
		},
		{
			name: "var",
			description: {
				kind: "markdown",
				value: "The var element represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/var"
			}]
		},
		{
			name: "samp",
			description: {
				kind: "markdown",
				value: "The samp element represents sample or quoted output from another program or computing system."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/samp"
			}]
		},
		{
			name: "kbd",
			description: {
				kind: "markdown",
				value: "The kbd element represents user input (typically keyboard input, although it may also be used to represent other input, such as voice commands)."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/kbd"
			}]
		},
		{
			name: "sub",
			description: {
				kind: "markdown",
				value: "The sub element represents a subscript."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/sub"
			}]
		},
		{
			name: "sup",
			description: {
				kind: "markdown",
				value: "The sup element represents a superscript."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/sup"
			}]
		},
		{
			name: "i",
			description: {
				kind: "markdown",
				value: "The i element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/i"
			}]
		},
		{
			name: "b",
			description: {
				kind: "markdown",
				value: "The b element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/b"
			}]
		},
		{
			name: "u",
			description: {
				kind: "markdown",
				value: "The u element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelt."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/u"
			}]
		},
		{
			name: "mark",
			description: {
				kind: "markdown",
				value: "The mark element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader's attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user's current activity."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/mark"
			}]
		},
		{
			name: "bdi",
			description: {
				kind: "markdown",
				value: "The bdi element represents a span of text that is to be isolated from its surroundings for the purposes of bidirectional text formatting. [BIDI]"
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdi"
			}]
		},
		{
			name: "bdo",
			description: {
				kind: "markdown",
				value: "The bdo element represents explicit text directionality formatting control for its children. It allows authors to override the Unicode bidirectional algorithm by explicitly specifying a direction override. [BIDI]"
			},
			attributes: [{
				name: "dir",
				description: "The direction in which text should be rendered in this element's contents. Possible values are:\n\n*   `ltr`: Indicates that the text should go in a left-to-right direction.\n*   `rtl`: Indicates that the text should go in a right-to-left direction."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdo"
			}]
		},
		{
			name: "span",
			description: {
				kind: "markdown",
				value: "The span element doesn't mean anything on its own, but can be useful when used together with the global attributes, e.g. class, lang, or dir. It represents its children."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/span"
			}]
		},
		{
			name: "br",
			description: {
				kind: "markdown",
				value: "The br element represents a line break."
			},
			void: !0,
			attributes: [{
				name: "clear",
				description: "Indicates where to begin the next line after the break."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/br"
			}]
		},
		{
			name: "wbr",
			description: {
				kind: "markdown",
				value: "The wbr element represents a line break opportunity."
			},
			void: !0,
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/wbr"
			}]
		},
		{
			name: "ins",
			description: {
				kind: "markdown",
				value: "The ins element represents an addition to the document."
			},
			attributes: [{
				name: "cite",
				description: "This attribute defines the URI of a resource that explains the change, such as a link to meeting minutes or a ticket in a troubleshooting system."
			}, {
				name: "datetime",
				description: "This attribute indicates the time and date of the change and must be a valid date with an optional time string. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\"). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\")."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/ins"
			}]
		},
		{
			name: "del",
			description: {
				kind: "markdown",
				value: "The del element represents a removal from the document."
			},
			attributes: [{
				name: "cite",
				description: {
					kind: "markdown",
					value: "A URI for a resource that explains the change (for example, meeting minutes)."
				}
			}, {
				name: "datetime",
				description: {
					kind: "markdown",
					value: "This attribute indicates the time and date of the change and must be a valid date string with an optional time. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\"). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats \"Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.\")."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/del"
			}]
		},
		{
			name: "picture",
			description: {
				kind: "markdown",
				value: "The picture element is a container which provides multiple sources to its contained img element to allow authors to declaratively control or give hints to the user agent about which image resource to use, based on the screen pixel density, viewport size, image format, and other factors. It represents its children."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/picture"
			}]
		},
		{
			name: "img",
			description: {
				kind: "markdown",
				value: "An img element represents an image."
			},
			void: !0,
			attributes: [
				{
					name: "alt",
					description: {
						kind: "markdown",
						value: "This attribute defines an alternative text description of the image.\n\n**Note:** Browsers do not always display the image referenced by the element. This is the case for non-graphical browsers (including those used by people with visual impairments), if the user chooses not to display images, or if the browser cannot display the image because it is invalid or an [unsupported type](#Supported_image_formats). In these cases, the browser may replace the image with the text defined in this element's `alt` attribute. You should, for these reasons and others, provide a useful value for `alt` whenever possible.\n\n**Note:** Omitting this attribute altogether indicates that the image is a key part of the content, and no textual equivalent is available. Setting this attribute to an empty string (`alt=\"\"`) indicates that this image is _not_ a key part of the content (decorative), and that non-visual browsers may omit it from rendering."
					}
				},
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "The image URL. This attribute is mandatory for the `<img>` element. On browsers supporting `srcset`, `src` is treated like a candidate image with a pixel density descriptor `1x` unless an image with this pixel density descriptor is already defined in `srcset,` or unless `srcset` contains '`w`' descriptors."
					}
				},
				{
					name: "srcset",
					description: {
						kind: "markdown",
						value: "A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use. Each string is composed of:\n\n1.  a URL to an image,\n2.  optionally, whitespace followed by one of:\n    *   A width descriptor, or a positive integer directly followed by '`w`'. The width descriptor is divided by the source size given in the `sizes` attribute to calculate the effective pixel density.\n    *   A pixel density descriptor, which is a positive floating point number directly followed by '`x`'.\n\nIf no descriptor is specified, the source is assigned the default descriptor: `1x`.\n\nIt is incorrect to mix width descriptors and pixel density descriptors in the same `srcset` attribute. Duplicate descriptors (for instance, two sources in the same `srcset` which are both described with '`2x`') are also invalid.\n\nThe user agent selects any one of the available sources at its discretion. This provides them with significant leeway to tailor their selection based on things like user preferences or bandwidth conditions. See our [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) tutorial for an example."
					}
				},
				{
					name: "crossorigin",
					valueSet: "xo",
					description: {
						kind: "markdown",
						value: "This enumerated attribute indicates if the fetching of the related image must be done using CORS or not. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas \"Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.\") element without being \"[tainted](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#What_is_a_tainted_canvas).\" The allowed values are:\n`anonymous`\n\nA cross-origin request (i.e., with `Origin:` HTTP header) is performed, but no credential is sent (i.e., no cookie, X.509 certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (by not setting the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin \"The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.\") HTTP header), the image will be tainted and its usage restricted.\n\n`use-credentials`\n\nA cross-origin request (i.e., with the [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin \"The Origin request header indicates where a fetch originates from. It doesn't include any path information, but only the server name. It is sent with CORS requests, as well as with POST requests. It is similar to the Referer header, but, unlike this header, it doesn't disclose the whole path.\") HTTP header) performed along with credentials sent (i.e., a cookie, certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (through the `Access-Control-Allow-Credentials` HTTP header), the image will be tainted and its usage restricted.\n\nIf the attribute is not present, the resource is fetched without a CORS request (i.e., without sending the `Origin` HTTP header), preventing its non-tainted usage in [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas \"Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.\") elements. If invalid, it is handled as if the `anonymous` value was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes) for additional information."
					}
				},
				{
					name: "usemap",
					description: {
						kind: "markdown",
						value: "The partial URL (starting with '#') of an [image map](https://developer.mozilla.org/en-US/docs/HTML/Element/map) associated with the element.\n\n**Note:** You cannot use this attribute if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \"The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.\") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") element."
					}
				},
				{
					name: "ismap",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that the image is part of a server-side map. If so, the precise coordinates of a click are sent to the server.\n\n**Note:** This attribute is allowed only if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \"The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.\") element with a valid [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute."
					}
				},
				{
					name: "width",
					description: {
						kind: "markdown",
						value: "The intrinsic width of the image in pixels."
					}
				},
				{
					name: "height",
					description: {
						kind: "markdown",
						value: "The intrinsic height of the image in pixels."
					}
				},
				{
					name: "decoding",
					valueSet: "decoding",
					description: {
						kind: "markdown",
						value: `Provides an image decoding hint to the browser. The allowed values are:
\`sync\`

Decode the image synchronously for atomic presentation with other content.

\`async\`

Decode the image asynchronously to reduce delay in presenting other content.

\`auto\`

Default mode, which indicates no preference for the decoding mode. The browser decides what is best for the user.`
					}
				},
				{
					name: "loading",
					valueSet: "loading",
					description: {
						kind: "markdown",
						value: "Indicates how the browser should load the image."
					}
				},
				{
					name: "referrerpolicy",
					valueSet: "referrerpolicy",
					description: {
						kind: "markdown",
						value: "A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer:` The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade:` No `Referer` header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent’s default behavior if no policy is otherwise specified.\n*   `origin:` The `Referer` header will include the page of origin's scheme, the host, and the port.\n*   `origin-when-cross-origin:` Navigating to other origins will limit the included referral data to the scheme, the host and the port, while navigating from the same origin will include the referrer's full path.\n*   `unsafe-url:` The `Referer` header will include the origin and the path, but not the fragment, password, or username. This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins."
					}
				},
				{
					name: "sizes",
					description: {
						kind: "markdown",
						value: "A list of one or more strings separated by commas indicating a set of source sizes. Each source size consists of:\n\n1.  a media condition. This must be omitted for the last item.\n2.  a source size value.\n\nSource size values specify the intended display size of the image. User agents use the current source size to select one of the sources supplied by the `srcset` attribute, when those sources are described using width ('`w`') descriptors. The selected source size affects the intrinsic size of the image (the image’s display size if no CSS styling is applied). If the `srcset` attribute is absent, or contains no values with a width (`w`) descriptor, then the `sizes` attribute has no effect."
					}
				},
				{
					name: "importance",
					description: "Indicates the relative importance of the resource. Priority hints are delegated using the values:"
				},
				{
					name: "importance",
					description: "`auto`: Indicates\xA0**no\xA0preference**. The browser may use its own heuristics to decide the priority of the image.\n\n`high`: Indicates to the\xA0browser\xA0that the image is of\xA0**high** priority.\n\n`low`:\xA0Indicates to the\xA0browser\xA0that the image is of\xA0**low** priority."
				},
				{
					name: "intrinsicsize",
					description: "This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute. Specifically, the image would raster at these dimensions and `naturalWidth`/`naturalHeight` on images would return the values specified in this attribute. [Explainer](https://github.com/ojanvafai/intrinsicsize-attribute), [examples](https://googlechrome.github.io/samples/intrinsic-size/index.html)"
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/img"
			}]
		},
		{
			name: "iframe",
			description: {
				kind: "markdown",
				value: "The iframe element represents a nested browsing context."
			},
			attributes: [
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "The URL of the page to embed. Use a value of `about:blank` to embed an empty page that conforms to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#Inherited_origins). Also note that programatically removing an `<iframe>`'s src attribute (e.g. via [`Element.removeAttribute()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute \"The Element method removeAttribute() removes the attribute with the specified name from the element.\")) causes `about:blank` to be loaded in the frame in Firefox (from version 65), Chromium-based browsers, and Safari/iOS."
					}
				},
				{
					name: "srcdoc",
					description: {
						kind: "markdown",
						value: "Inline HTML to embed, overriding the `src` attribute. If a browser does not support the `srcdoc` attribute, it will fall back to the URL in the `src` attribute."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "A targetable name for the embedded browsing context. This can be used in the `target` attribute of the [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a \"The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.\"), [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\"), or [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base \"The HTML <base> element specifies the base URL to use for all relative URLs contained within a document. There can be only one <base> element in a document.\") elements; the `formtarget` attribute of the [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") elements; or the `windowName` parameter in the [`window.open()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open \"The\xA0Window interface's open() method loads the specified resource into the browsing context (window, <iframe> or tab) with the specified name. If the name doesn't exist, then a new window is opened and the specified resource is loaded into its browsing context.\") method."
					}
				},
				{
					name: "sandbox",
					valueSet: "sb",
					description: {
						kind: "markdown",
						value: "Applies extra restrictions to the content in the frame. The value of the attribute can either be empty to apply all restrictions, or space-separated tokens to lift particular restrictions:\n\n*   `allow-forms`: Allows the resource to submit forms. If this keyword is not used, form submission is blocked.\n*   `allow-modals`: Lets the resource [open modal windows](https://html.spec.whatwg.org/multipage/origin.html#sandboxed-modals-flag).\n*   `allow-orientation-lock`: Lets the resource [lock the screen orientation](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation).\n*   `allow-pointer-lock`: Lets the resource use the [Pointer Lock API](https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock).\n*   `allow-popups`: Allows popups (such as `window.open()`, `target=\"_blank\"`, or `showModalDialog()`). If this keyword is not used, the popup will silently fail to open.\n*   `allow-popups-to-escape-sandbox`: Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to.\n*   `allow-presentation`: Lets the resource start a [presentation session](https://developer.mozilla.org/en-US/docs/Web/API/PresentationRequest).\n*   `allow-same-origin`: If this token is not used, the resource is treated as being from a special origin that always fails the [same-origin policy](https://developer.mozilla.org/en-US/docs/Glossary/same-origin_policy \"same-origin policy: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin.\").\n*   `allow-scripts`: Lets the resource run scripts (but not create popup windows).\n*   `allow-storage-access-by-user-activation` : Lets the resource request access to the parent's storage capabilities with the [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API).\n*   `allow-top-navigation`: Lets the resource navigate the top-level browsing context (the one named `_top`).\n*   `allow-top-navigation-by-user-activation`: Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture.\n\n**Notes about sandboxing:**\n\n*   When the embedded document has the same origin as the embedding page, it is **strongly discouraged** to use both `allow-scripts` and `allow-same-origin`, as that lets the embedded document remove the `sandbox` attribute — making it no more secure than not using the `sandbox` attribute at all.\n*   Sandboxing is useless if the attacker can display content outside a sandboxed `iframe` — such as if the viewer opens the frame in a new tab. Such content should be also served from a _separate origin_ to limit potential damage.\n*   The `sandbox` attribute is unsupported in Internet Explorer 9 and earlier."
					}
				},
				{
					name: "seamless",
					valueSet: "v"
				},
				{
					name: "allowfullscreen",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "Set to `true` if the `<iframe>` can activate fullscreen mode by calling the [`requestFullscreen()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen \"The Element.requestFullscreen() method issues an asynchronous request to make the element be displayed in full-screen mode.\") method.\nThis attribute is considered a legacy attribute and redefined as `allow=\"fullscreen\"`."
					}
				},
				{
					name: "width",
					description: {
						kind: "markdown",
						value: "The width of the frame in CSS pixels. Default is `300`."
					}
				},
				{
					name: "height",
					description: {
						kind: "markdown",
						value: "The height of the frame in CSS pixels. Default is `150`."
					}
				},
				{
					name: "allow",
					description: "Specifies a [feature policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy) for the `<iframe>`."
				},
				{
					name: "allowpaymentrequest",
					description: "Set to `true` if a cross-origin `<iframe>` should be allowed to invoke the [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)."
				},
				{
					name: "allowpaymentrequest",
					description: "This attribute is considered a legacy attribute and redefined as `allow=\"payment\"`."
				},
				{
					name: "csp",
					description: "A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) enforced for the embedded resource. See [`HTMLIFrameElement.csp`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/csp \"The csp property of the HTMLIFrameElement interface specifies the Content Security Policy that an embedded document must agree to enforce upon itself.\") for details."
				},
				{
					name: "importance",
					description: `The download priority of the resource in the \`<iframe>\`'s \`src\` attribute. Allowed values:

\`auto\` (default)

No preference. The browser uses its own heuristics to decide the priority of the resource.

\`high\`

The resource should be downloaded before other lower-priority page resources.

\`low\`

The resource should be downloaded after other higher-priority page resources.`
				},
				{
					name: "referrerpolicy",
					description: "Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the frame's resource:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin \"origin: Web content's origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.\")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS \"TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.\") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS \"HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.\")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host \"host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails.\"), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port \"port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.\").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy \"same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin.\"), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don't send it to a less secure destination (HTTPS→HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/iframe"
			}]
		},
		{
			name: "embed",
			description: {
				kind: "markdown",
				value: "The embed element provides an integration point for an external (typically non-HTML) application or interactive content."
			},
			void: !0,
			attributes: [
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "The URL\xA0of the resource being embedded."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "The MIME\xA0type to use to select the plug-in to instantiate."
					}
				},
				{
					name: "width",
					description: {
						kind: "markdown",
						value: "The displayed width of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed."
					}
				},
				{
					name: "height",
					description: {
						kind: "markdown",
						value: "The displayed height of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/embed"
			}]
		},
		{
			name: "object",
			description: {
				kind: "markdown",
				value: "The object element can represent an external resource, which, depending on the type of the resource, will either be treated as an image, as a nested browsing context, or as an external resource to be processed by a plugin."
			},
			attributes: [
				{
					name: "data",
					description: {
						kind: "markdown",
						value: "The address of the resource as a valid URL. At least one of **data** and **type** must be defined."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "The [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource specified by **data**. At least one of **data** and **type** must be defined."
					}
				},
				{
					name: "typemustmatch",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates if the **type** attribute and the actual [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource must match to be used."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "The name of valid browsing context (HTML5), or the name of the control (HTML 4)."
					}
				},
				{
					name: "usemap",
					description: {
						kind: "markdown",
						value: "A hash-name reference to a [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map \"The HTML <map> element is used with <area> elements to define an image map (a clickable link area).\") element; that is a '#' followed by the value of a [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map#attr-name) of a map element."
					}
				},
				{
					name: "form",
					description: {
						kind: "markdown",
						value: "The form element, if any, that the object element is associated with (its _form owner_). The value of the attribute must be an ID of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element in the same document."
					}
				},
				{
					name: "width",
					description: {
						kind: "markdown",
						value: "The width of the display resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))"
					}
				},
				{
					name: "height",
					description: {
						kind: "markdown",
						value: "The height of the displayed resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))"
					}
				},
				{
					name: "archive",
					description: "A space-separated list of URIs for archives of resources for the object."
				},
				{
					name: "border",
					description: "The width of a border around the control, in pixels."
				},
				{
					name: "classid",
					description: "The URI of the object's implementation. It can be used together with, or in place of, the **data** attribute."
				},
				{
					name: "codebase",
					description: "The base path used to resolve relative URIs specified by **classid**, **data**, or **archive**. If not specified, the default is the base URI of the current document."
				},
				{
					name: "codetype",
					description: "The content type of the data specified by **classid**."
				},
				{
					name: "declare",
					description: "The presence of this Boolean attribute makes this element a declaration only. The object must be instantiated by a subsequent `<object>` element. In HTML5, repeat the <object> element completely each that that the resource is reused."
				},
				{
					name: "standby",
					description: "A message that the browser can show while loading the object's implementation and data."
				},
				{
					name: "tabindex",
					description: "The position of the element in the tabbing navigation order for the current document."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/object"
			}]
		},
		{
			name: "param",
			description: {
				kind: "markdown",
				value: "The param element defines parameters for plugins invoked by object elements. It does not represent anything on its own."
			},
			void: !0,
			attributes: [
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "Name of the parameter."
					}
				},
				{
					name: "value",
					description: {
						kind: "markdown",
						value: "Specifies the value of the parameter."
					}
				},
				{
					name: "type",
					description: "Only used if the `valuetype` is set to \"ref\". Specifies the MIME type of values found at the URI specified by value."
				},
				{
					name: "valuetype",
					description: `Specifies the type of the \`value\` attribute. Possible values are:

*   data: Default value. The value is passed to the object's implementation as a string.
*   ref: The value is a URI to a resource where run-time values are stored.
*   object: An ID of another [\`<object>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object "The HTML <object> element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.") in the same document.`
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/param"
			}]
		},
		{
			name: "video",
			description: {
				kind: "markdown",
				value: "A video element is used for playing videos or movies, and audio files with captions."
			},
			attributes: [
				{ name: "src" },
				{
					name: "crossorigin",
					valueSet: "xo"
				},
				{ name: "poster" },
				{
					name: "preload",
					valueSet: "pl"
				},
				{
					name: "autoplay",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data.\n**Note**: Sites that automatically play audio (or video with an audio track) can be an unpleasant experience for users, so it should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control.\n\nTo disable video autoplay, `autoplay=\"false\"` will not work; the video will autoplay if the attribute is there in the `<video>` tag at all. To remove autoplay the attribute needs to be removed altogether.\n\nIn some browsers (e.g. Chrome 70.0) autoplay is not working if no `muted` attribute is present."
					}
				},
				{ name: "mediagroup" },
				{
					name: "loop",
					valueSet: "v"
				},
				{
					name: "muted",
					valueSet: "v"
				},
				{
					name: "controls",
					valueSet: "v"
				},
				{ name: "width" },
				{ name: "height" }
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/video"
			}]
		},
		{
			name: "audio",
			description: {
				kind: "markdown",
				value: "An audio element represents a sound or audio stream."
			},
			attributes: [
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "The URL of the audio to embed. This is subject to [HTTP access controls](https://developer.mozilla.org/en-US/docs/HTTP_access_control). This is optional; you may instead use the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source \"The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.\") element within the audio block to specify the audio to embed."
					}
				},
				{
					name: "crossorigin",
					valueSet: "xo",
					description: {
						kind: "markdown",
						value: "This enumerated attribute indicates whether to use CORS to fetch the related image. [CORS-enabled resources](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas \"Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.\") element without being _tainted_. The allowed values are:\n\nanonymous\n\nSends a cross-origin request without a credential. In other words, it sends the `Origin:` HTTP header without a cookie, X.509 certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin:` HTTP header), the image will be _tainted_, and its usage restricted.\n\nuse-credentials\n\nSends a cross-origin request with a credential. In other words, it sends the `Origin:` HTTP header with a cookie, a certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (through `Access-Control-Allow-Credentials:` HTTP header), the image will be _tainted_ and its usage restricted.\n\nWhen not present, the resource is fetched without a CORS request (i.e. without sending the `Origin:` HTTP header), preventing its non-tainted used in [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas \"Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.\") elements. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes) for additional information."
					}
				},
				{
					name: "preload",
					valueSet: "pl",
					description: {
						kind: "markdown",
						value: "This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:\n\n*   `none`: Indicates that the audio should not be preloaded.\n*   `metadata`: Indicates that only audio metadata (e.g. length) is fetched.\n*   `auto`: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.\n*   _empty string_: A synonym of the `auto` value.\n\nIf not set, `preload`'s default value is browser-defined (i.e. each browser may have its own default value). The spec advises it to be set to `metadata`.\n\n**Usage notes:**\n\n*   The `autoplay` attribute has precedence over\xA0`preload`. If `autoplay` is specified, the browser would obviously need to start downloading the audio for playback.\n*   The browser is not forced by the specification to follow the value of this attribute; it is a mere hint."
					}
				},
				{
					name: "autoplay",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: `A Boolean attribute: if specified, the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.

**Note**: Sites that automatically play audio (or videos with an audio track) can be an unpleasant experience for users, so should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control.`
					}
				},
				{ name: "mediagroup" },
				{
					name: "loop",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "A Boolean attribute:\xA0if specified, the audio player will\xA0automatically seek back to the start\xA0upon reaching the end of the audio."
					}
				},
				{
					name: "muted",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "A Boolean attribute that indicates whether the audio will be initially silenced. Its default value is `false`."
					}
				},
				{
					name: "controls",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/audio"
			}]
		},
		{
			name: "source",
			description: {
				kind: "markdown",
				value: "The source element allows authors to specify multiple alternative media resources for media elements. It does not represent anything on its own."
			},
			void: !0,
			attributes: [
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "Required for [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio \"The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element:\xA0the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.\") and [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video \"The HTML Video element (<video>) embeds a media player which supports video playback into the document.\"), address of the media resource. The value of this attribute is ignored when the `<source>` element is placed inside a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "The MIME-type of the resource, optionally with a `codecs` parameter. See [RFC 4281](https://tools.ietf.org/html/rfc4281) for information about how to specify codecs."
					}
				},
				{
					name: "sizes",
					description: "Is a list of source sizes that describes the final rendered width of the image represented by the source. Each source size consists of a comma-separated list of media condition-length pairs. This information is used by the browser to determine, before laying the page out, which image defined in [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-srcset) to use.  \nThe `sizes` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source \"The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.\") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element."
				},
				{
					name: "srcset",
					description: "A list of one or more strings separated by commas indicating a set of possible images represented by the source for the browser to use. Each string is composed of:\n\n1.  one URL to an image,\n2.  a width descriptor, that is a positive integer directly followed by `'w'`. The default value, if missing, is the infinity.\n3.  a pixel density descriptor, that is a positive floating number directly followed by `'x'`. The default value, if missing, is `1x`.\n\nEach string in the list must have at least a width descriptor or a pixel density descriptor to be valid. Among the list, there must be only one string containing the same tuple of width descriptor and pixel density descriptor.  \nThe browser chooses the most adequate image to display at a given point of time.  \nThe `srcset` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source \"The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.\") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element."
				},
				{
					name: "media",
					description: "[Media query](https://developer.mozilla.org/en-US/docs/CSS/Media_queries) of the resource's intended media; this should be used only in a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/source"
			}]
		},
		{
			name: "track",
			description: {
				kind: "markdown",
				value: "The track element allows authors to specify explicit external timed text tracks for media elements. It does not represent anything on its own."
			},
			void: !0,
			attributes: [
				{
					name: "default",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This attribute indicates that the track should be enabled unless the user's preferences indicate that another track is more appropriate. This may only be used on one `track` element per media element."
					}
				},
				{
					name: "kind",
					valueSet: "tk",
					description: {
						kind: "markdown",
						value: "How the text track is meant to be used. If omitted the default kind is `subtitles`. If the attribute is not present, it will use the `subtitles`. If the attribute contains an invalid value, it will use `metadata`. (Versions of Chrome earlier than 52 treated an invalid value as `subtitles`.)\xA0The following keywords are allowed:\n\n*   `subtitles`\n    *   Subtitles provide translation of content that cannot be understood by the viewer. For example dialogue or text that is not English in an English language film.\n    *   Subtitles may contain additional content, usually extra background information. For example the text at the beginning of the Star Wars films, or the date, time, and location of a scene.\n*   `captions`\n    *   Closed captions provide a transcription and possibly a translation of audio.\n    *   It may include important non-verbal information such as music cues or sound effects. It may indicate the cue's source (e.g. music, text, character).\n    *   Suitable for users who are deaf or when the sound is muted.\n*   `descriptions`\n    *   Textual description of the video content.\n    *   Suitable for users who are blind or where the video cannot be seen.\n*   `chapters`\n    *   Chapter titles are intended to be used when the user is navigating the media resource.\n*   `metadata`\n    *   Tracks used by scripts. Not visible to the user."
					}
				},
				{
					name: "label",
					description: {
						kind: "markdown",
						value: "A user-readable title of the text track which is used by the browser when listing available text tracks."
					}
				},
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "Address of the track (`.vtt` file). Must be a valid URL. This attribute must be specified and its URL value must have the same origin as the document — unless the [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio \"The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element:\xA0the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.\") or [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video \"The HTML Video element (<video>) embeds a media player which supports video playback into the document.\") parent element of the `track` element has a [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) attribute."
					}
				},
				{
					name: "srclang",
					description: {
						kind: "markdown",
						value: "Language of the track text data. It must be a valid [BCP 47](https://r12a.github.io/app-subtags/) language tag. If the `kind` attribute is set to\xA0`subtitles,` then `srclang` must be defined."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/track"
			}]
		},
		{
			name: "map",
			description: {
				kind: "markdown",
				value: "The map element, in conjunction with an img element and any area element descendants, defines an image map. The element represents its children."
			},
			attributes: [{
				name: "name",
				description: {
					kind: "markdown",
					value: "The name attribute gives the map a name so that it can be referenced. The attribute must be present and must have a non-empty value with no space characters. The value of the name attribute must not be a compatibility-caseless match for the value of the name attribute of another map element in the same document. If the id attribute is also specified, both attributes must have the same value."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/map"
			}]
		},
		{
			name: "area",
			description: {
				kind: "markdown",
				value: "The area element represents either a hyperlink with some text and a corresponding area on an image map, or a dead area on an image map."
			},
			void: !0,
			attributes: [
				{ name: "alt" },
				{ name: "coords" },
				{
					name: "shape",
					valueSet: "sh"
				},
				{ name: "href" },
				{
					name: "target",
					valueSet: "target"
				},
				{ name: "download" },
				{ name: "ping" },
				{ name: "rel" },
				{ name: "hreflang" },
				{ name: "type" },
				{
					name: "accesskey",
					description: "Specifies a keyboard navigation accelerator for the element. Pressing ALT or a similar key in association with the specified character selects the form control correlated with that key sequence. Page designers are forewarned to avoid key sequences already bound to browsers. This attribute is global since HTML5."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/area"
			}]
		},
		{
			name: "table",
			description: {
				kind: "markdown",
				value: "The table element represents data with more than one dimension, in the form of a table."
			},
			attributes: [{ name: "border" }, {
				name: "align",
				description: "This enumerated attribute indicates how the table must be aligned inside the containing document. It may have the following values:\n\n*   left: the table is displayed on the left side of the document;\n*   center: the table is displayed in the center of the document;\n*   right: the table is displayed on the right side of the document.\n\n**Usage Note**\n\n*   **Do not use this attribute**, as it has been deprecated. The [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table \"The HTML <table> element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.\") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). Set [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left \"The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.\") and [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right \"The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.\") to `auto` or [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin \"The margin CSS property sets the margin area on all four sides of an element. It is a shorthand for margin-top, margin-right, margin-bottom, and margin-left.\") to `0 auto` to achieve an effect that is similar to the align attribute.\n*   Prior to Firefox 4, Firefox also supported the `middle`, `absmiddle`, and `abscenter` values as synonyms of `center`, in quirks mode only."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/table"
			}]
		},
		{
			name: "caption",
			description: {
				kind: "markdown",
				value: "The caption element represents the title of the table that is its parent, if it has a parent and that is a table element."
			},
			attributes: [{
				name: "align",
				description: `This enumerated attribute indicates how the caption must be aligned with respect to the table. It may have one of the following values:

\`left\`

The caption is displayed to the left of the table.

\`top\`

The caption is displayed above the table.

\`right\`

The caption is displayed to the right of the table.

\`bottom\`

The caption is displayed below the table.

**Usage note:** Do not use this attribute, as it has been deprecated. The [\`<caption>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption "The HTML Table Caption element (<caption>) specifies the caption (or title) of a table, and if used is always the first child of a <table>.") element should be styled using the [CSS](https://developer.mozilla.org/en-US/docs/CSS) properties [\`caption-side\`](https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side "The caption-side CSS property puts the content of a table's <caption> on the specified side. The values are relative to the writing-mode of the table.") and [\`text-align\`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.").`
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/caption"
			}]
		},
		{
			name: "colgroup",
			description: {
				kind: "markdown",
				value: "The colgroup element represents a group of one or more columns in the table that is its parent, if it has a parent and that is a table element."
			},
			attributes: [{ name: "span" }, {
				name: "align",
				description: "This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 \"character alignment not implemented (align=char, charoff=, text-align:<string>)\")).\n\nIf this attribute is not set, the `left` value is assumed. The descendant [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col \"The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.\") elements may override this value using their own [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-align) attribute.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property on a selector giving a [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup \"The HTML <colgroup> element defines a group of columns within a table.\") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td \"The HTML <td> element defines a cell of a table that contains data. It participates in the table model.\") elements are not descendant of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup \"The HTML <colgroup> element defines a group of columns within a table.\") element, they won't inherit it.\n    *   If the table doesn't use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use one `td:nth-child(an+b)` CSS selector per column, where a is the total number of the columns in the table and b is the ordinal position of this column in the table. Only after this selector the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property can be used.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property Unimplemented."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/colgroup"
			}]
		},
		{
			name: "col",
			description: {
				kind: "markdown",
				value: "If a col element has a parent and that is a colgroup element that itself has a parent that is a table element, then the col element represents one or more columns in the column group represented by that colgroup."
			},
			void: !0,
			attributes: [{ name: "span" }, {
				name: "align",
				description: "This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 \"character alignment not implemented (align=char, charoff=, text-align:<string>)\")).\n\nIf this attribute is not set, its value is inherited from the [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-align) of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup \"The HTML <colgroup> element defines a group of columns within a table.\") element this `<col>` element belongs too. If there are none, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property on a selector giving a [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col \"The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.\") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td \"The HTML <td> element defines a cell of a table that contains data. It participates in the table model.\") elements are not descendant of the [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col \"The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.\") element, they won't inherit it.\n    *   If the table doesn't use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use the `td:nth-child(an+b)` CSS selector. Set `a` to zero and `b` to the position of the column in the table, e.g. `td:nth-child(2) { text-align: right; }` to right-align the second column.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property Unimplemented."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/col"
			}]
		},
		{
			name: "tbody",
			description: {
				kind: "markdown",
				value: "The tbody element represents a block of rows that consist of a body of data for the parent table element, if the tbody element has a parent and it is a table."
			},
			attributes: [{
				name: "align",
				description: "This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes.\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property Unimplemented."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/tbody"
			}]
		},
		{
			name: "thead",
			description: {
				kind: "markdown",
				value: "The thead element represents the block of rows that consist of the column labels (headers) for the parent table element, if the thead element has a parent and it is a table."
			},
			attributes: [{
				name: "align",
				description: "This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 \"character alignment not implemented (align=char, charoff=, text-align:<string>)\")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property Unimplemented."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/thead"
			}]
		},
		{
			name: "tfoot",
			description: {
				kind: "markdown",
				value: "The tfoot element represents the block of rows that consist of the column summaries (footers) for the parent table element, if the tfoot element has a parent and it is a table."
			},
			attributes: [{
				name: "align",
				description: "This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 \"character alignment not implemented (align=char, charoff=, text-align:<string>)\")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property Unimplemented."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/tfoot"
			}]
		},
		{
			name: "tr",
			description: {
				kind: "markdown",
				value: "The tr element represents a row of cells in a table."
			},
			attributes: [{
				name: "align",
				description: "A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString \"DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.\") which specifies how the cell's context should be aligned horizontally within the cells in the row; this is shorthand for using `align` on every cell in the row individually. Possible values are:\n\n`left`\n\nAlign the content of each cell at its left edge.\n\n`center`\n\nCenter the contents of each cell between their left and right edges.\n\n`right`\n\nAlign the content of each cell at its right edge.\n\n`justify`\n\nWiden whitespaces within the text of each cell so that the text fills the full width of each cell (full justification).\n\n`char`\n\nAlign each cell in the row on a specific character (such that each row in the column that is configured this way will horizontally align its cells on that character). This uses the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-charoff) to establish the alignment character (typically \".\" or \",\" when aligning numerical data) and the number of characters that should follow the alignment character. This alignment type was never widely supported.\n\nIf no value is expressly set for `align`, the parent node's value is inherited.\n\nInstead of using the obsolete `align` attribute, you should instead use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property to establish `left`, `center`, `right`, or `justify` alignment for the row's cells. To apply character-based alignment, set the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property to the alignment character (such as `\".\"` or `\",\"`)."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/tr"
			}]
		},
		{
			name: "td",
			description: {
				kind: "markdown",
				value: "The td element represents a data cell in a table."
			},
			attributes: [
				{ name: "colspan" },
				{ name: "rowspan" },
				{ name: "headers" },
				{
					name: "abbr",
					description: `This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself.

**Note:** Do not use this attribute as it is obsolete in the latest standard. Alternatively, you can put the abbreviated description inside the cell and place the long content in the **title** attribute.`
				},
				{
					name: "align",
					description: "This enumerated attribute specifies how the cell content's horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 \"character alignment not implemented (align=char, charoff=, text-align:<string>)\")).\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char). Unimplemented in CSS3."
				},
				{
					name: "axis",
					description: "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard."
				},
				{
					name: "bgcolor",
					description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

 

\`black\` = "#000000"

 

\`green\` = "#008000"

 

\`silver\` = "#C0C0C0"

 

\`lime\` = "#00FF00"

 

\`gray\` = "#808080"

 

\`olive\` = "#808000"

 

\`white\` = "#FFFFFF"

 

\`yellow\` = "#FFFF00"

 

\`maroon\` = "#800000"

 

\`navy\` = "#000080"

 

\`red\` = "#FF0000"

 

\`blue\` = "#0000FF"

 

\`purple\` = "#800080"

 

\`teal\` = "#008080"

 

\`fuchsia\` = "#FF00FF"

 

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<td>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/CSS) instead.`
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/td"
			}]
		},
		{
			name: "th",
			description: {
				kind: "markdown",
				value: "The th element represents a header cell in a table."
			},
			attributes: [
				{ name: "colspan" },
				{ name: "rowspan" },
				{ name: "headers" },
				{
					name: "scope",
					valueSet: "s"
				},
				{ name: "sorted" },
				{
					name: "abbr",
					description: {
						kind: "markdown",
						value: "This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself."
					}
				},
				{
					name: "align",
					description: "This enumerated attribute specifies how the cell content's horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-charoff) attributes.\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align \"The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.\") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char). Unimplemented in CSS3."
				},
				{
					name: "axis",
					description: "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard: use the [`scope`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope) attribute instead."
				},
				{
					name: "bgcolor",
					description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

 

\`black\` = "#000000"

 

\`green\` = "#008000"

 

\`silver\` = "#C0C0C0"

 

\`lime\` = "#00FF00"

 

\`gray\` = "#808080"

 

\`olive\` = "#808000"

 

\`white\` = "#FFFFFF"

 

\`yellow\` = "#FFFF00"

 

\`maroon\` = "#800000"

 

\`navy\` = "#000080"

 

\`red\` = "#FF0000"

 

\`blue\` = "#0000FF"

 

\`purple\` = "#800080"

 

\`teal\` = "#008080"

 

\`fuchsia\` = "#FF00FF"

 

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<th>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th "The HTML <th> element defines a cell as header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) instead.`
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/th"
			}]
		},
		{
			name: "form",
			description: {
				kind: "markdown",
				value: "The form element represents a collection of form-associated elements, some of which can represent editable values that can be submitted to a server for processing."
			},
			attributes: [
				{
					name: "accept-charset",
					description: {
						kind: "markdown",
						value: "A space- or comma-delimited list of character encodings that the server accepts. The browser uses them in the order in which they are listed. The default value, the reserved string `\"UNKNOWN\"`, indicates the same encoding as that of the document containing the form element.  \nIn previous versions of HTML, the different character encodings could be delimited by spaces or commas. In HTML5, only spaces are allowed as delimiters."
					}
				},
				{
					name: "action",
					description: {
						kind: "markdown",
						value: "The URI of a program that processes the form information. This value can be overridden by a [`formaction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formaction) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element."
					}
				},
				{
					name: "autocomplete",
					valueSet: "o",
					description: {
						kind: "markdown",
						value: "Indicates whether input elements can by default have their values automatically completed by the browser. This setting can be overridden by an `autocomplete` attribute on an element belonging to the form. Possible values are:\n\n*   `off`: The user must explicitly enter a value into each field for every use, or the document provides its own auto-completion method; the browser does not automatically complete entries.\n*   `on`: The browser can automatically complete values based on values that the user has previously entered in the form.\n\nFor most modern browsers (including Firefox 38+, Google Chrome 34+, IE 11+) setting the autocomplete attribute will not prevent a browser's password manager from asking the user if they want to store login fields (username and password), if the user permits the storage the browser will autofill the login the next time the user visits the page. See [The autocomplete attribute and login fields](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#The_autocomplete_attribute_and_login_fields).\n**Note:** If you set `autocomplete` to `off` in a form because the document provides its own auto-completion, then you should also set `autocomplete` to `off` for each of the form's `input` elements that the document can auto-complete. For details, see the note regarding Google Chrome in the [Browser Compatibility chart](#compatChart)."
					}
				},
				{
					name: "enctype",
					valueSet: "et",
					description: {
						kind: "markdown",
						value: "When the value of the `method` attribute is `post`, enctype is the [MIME type](https://en.wikipedia.org/wiki/Mime_type) of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: The value used for an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element with the `type` attribute set to \"file\".\n*   `text/plain`: (HTML5)\n\nThis value can be overridden by a [`formenctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formenctype) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element."
					}
				},
				{
					name: "method",
					valueSet: "m",
					description: {
						kind: "markdown",
						value: "The [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) method that the browser uses to submit the form. Possible values are:\n\n*   `post`: Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5) ; form data are included in the body of the form and sent to the server.\n*   `get`: Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n*   `dialog`: Use when the form is inside a\xA0[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog \"The HTML <dialog> element represents a dialog box or other interactive component, such as an inspector or window.\") element to close the dialog when submitted.\n\nThis value can be overridden by a [`formmethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formmethod) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "The name of the form. In HTML 4, its use is deprecated (`id` should be used instead). It must be unique among the forms in a document and not just an empty string in HTML 5."
					}
				},
				{
					name: "novalidate",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that the form is not to be validated when submitted. If this attribute is not specified (and therefore the form is validated), this default setting can be overridden by a [`formnovalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formnovalidate) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element belonging to the form."
					}
				},
				{
					name: "target",
					valueSet: "target",
					description: {
						kind: "markdown",
						value: "A name or keyword indicating where to display the response that is received after submitting the form. In HTML 4, this is the name/keyword for a frame. In HTML5, it is a name/keyword for a _browsing context_ (for example, tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the response into the same HTML 4 frame (or HTML5 browsing context) as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed HTML 4 window or HTML5 browsing context.\n*   `_parent`: Load the response into the HTML 4 frameset parent of the current frame, or HTML5 parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: HTML 4: Load the response into the full original window, and cancel all other frames. HTML5: Load the response into the top-level browsing context (i.e., the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n*   _iframename_: The response is displayed in a named [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe \"The HTML Inline Frame element (<iframe>) represents a nested browsing context, embedding another HTML page into the current one.\").\n\nHTML5: This value can be overridden by a [`formtarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formtarget) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element."
					}
				},
				{
					name: "accept",
					description: "A comma-separated list of content types that the server accepts.\n\n**Usage note:** This attribute has been removed in HTML5 and should no longer be used. Instead, use the [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept) attribute of the specific [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element."
				},
				{
					name: "autocapitalize",
					description: "This is a nonstandard attribute used by iOS Safari Mobile which controls whether and how the text value for textual form control descendants should be automatically capitalized as it is entered/edited by the user. If the `autocapitalize` attribute is specified on an individual form control descendant, it trumps the form-wide `autocapitalize` setting. The non-deprecated values are available in iOS 5 and later. The default value is `sentences`. Possible values are:\n\n*   `none`: Completely disables automatic capitalization\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/form"
			}]
		},
		{
			name: "label",
			description: {
				kind: "markdown",
				value: "The label element represents a caption in a user interface. The caption can be associated with a specific form control, known as the label element's labeled control, either using the for attribute, or by putting the form control inside the label element itself."
			},
			attributes: [{
				name: "form",
				description: {
					kind: "markdown",
					value: "The [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element with which the label is associated (its _form owner_). If specified, the value of the attribute is the `id` of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element in the same document. This lets you place label elements anywhere within a document, not just as descendants of their form elements."
				}
			}, {
				name: "for",
				description: {
					kind: "markdown",
					value: "The [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id) of a [labelable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Form_labelable) form-related element in the same document as the `<label>` element. The first element in the document with an `id` matching the value of the `for` attribute is the _labeled control_ for this label element, if it is a labelable element. If it is\xA0not labelable then the `for` attribute has no effect. If there are other elements which also match the `id` value, later in the document, they are not considered.\n\n**Note**: A `<label>` element can have both a `for` attribute and a contained control element, as long as the `for` attribute points to the contained control element."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/label"
			}]
		},
		{
			name: "input",
			description: {
				kind: "markdown",
				value: "The input element represents a typed data field, usually with a form control to allow the user to edit the data."
			},
			void: !0,
			attributes: [
				{ name: "accept" },
				{ name: "alt" },
				{
					name: "autocomplete",
					valueSet: "inputautocomplete"
				},
				{
					name: "autofocus",
					valueSet: "v"
				},
				{
					name: "checked",
					valueSet: "v"
				},
				{ name: "dirname" },
				{
					name: "disabled",
					valueSet: "v"
				},
				{ name: "form" },
				{ name: "formaction" },
				{
					name: "formenctype",
					valueSet: "et"
				},
				{
					name: "formmethod",
					valueSet: "fm"
				},
				{
					name: "formnovalidate",
					valueSet: "v"
				},
				{ name: "formtarget" },
				{ name: "height" },
				{
					name: "inputmode",
					valueSet: "im"
				},
				{ name: "list" },
				{ name: "max" },
				{ name: "maxlength" },
				{ name: "min" },
				{ name: "minlength" },
				{
					name: "multiple",
					valueSet: "v"
				},
				{ name: "name" },
				{ name: "pattern" },
				{ name: "placeholder" },
				{
					name: "readonly",
					valueSet: "v"
				},
				{
					name: "required",
					valueSet: "v"
				},
				{ name: "size" },
				{ name: "src" },
				{ name: "step" },
				{
					name: "type",
					valueSet: "t"
				},
				{ name: "value" },
				{ name: "width" }
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/input"
			}]
		},
		{
			name: "button",
			description: {
				kind: "markdown",
				value: "The button element represents a button labeled by its contents."
			},
			attributes: [
				{
					name: "autofocus",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute lets you specify that the button should have input focus when the page loads, unless the user overrides it, for example by typing in a different control. Only one form-associated element in a document can have this attribute specified."
					}
				},
				{
					name: "disabled",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that the user cannot interact with the button. If this attribute is not specified, the button inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset \"The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form.\"); if there is no containing element with the **disabled** attribute set, then the button is enabled.\n\nFirefox will, unlike other browsers, by default, [persist the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") across page loads. Use the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-autocomplete) attribute to control this feature."
					}
				},
				{
					name: "form",
					description: {
						kind: "markdown",
						value: "The form element that the button is associated with (its _form owner_). The value of the attribute must be the **id** attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element in the same document. If this attribute is not specified, the `<button>` element will be associated to an ancestor [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element, if one exists. This attribute enables you to associate `<button>` elements to [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") elements anywhere within a document, not just as descendants of [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") elements."
					}
				},
				{
					name: "formaction",
					description: {
						kind: "markdown",
						value: "The URI of a program that processes the information submitted by the button. If specified, it overrides the [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-action) attribute of the button's form owner."
					}
				},
				{
					name: "formenctype",
					valueSet: "et",
					description: {
						kind: "markdown",
						value: "If the button is a submit button, this attribute specifies the type of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: Use this value if you are using an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") element with the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type) attribute set to `file`.\n*   `text/plain`\n\nIf this attribute is specified, it overrides the [`enctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-enctype) attribute of the button's form owner."
					}
				},
				{
					name: "formmethod",
					valueSet: "fm",
					description: {
						kind: "markdown",
						value: "If the button is a submit button, this attribute specifies the HTTP method that the browser uses to submit the form. Possible values are:\n\n*   `post`: The data from the form are included in the body of the form and sent to the server.\n*   `get`: The data from the form are appended to the **form** attribute URI, with a '?' as a separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n\nIf specified, this attribute overrides the [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-method) attribute of the button's form owner."
					}
				},
				{
					name: "formnovalidate",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "If the button is a submit button, this Boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the [`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-novalidate) attribute of the button's form owner."
					}
				},
				{
					name: "formtarget",
					description: {
						kind: "markdown",
						value: "If the button is a submit button, this attribute is a name or keyword indicating where to display the response that is received after submitting the form. This is a name of, or keyword for, a _browsing context_ (for example, tab, window, or inline frame). If this attribute is specified, it overrides the [`target`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-target) attribute of the button's form owner. The following keywords have special meanings:\n\n*   `_self`: Load the response into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed browsing context.\n*   `_parent`: Load the response into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "The name of the button, which is submitted with the form data."
					}
				},
				{
					name: "type",
					valueSet: "bt",
					description: {
						kind: "markdown",
						value: "The type of the button. Possible values are:\n\n*   `submit`: The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.\n*   `reset`: The button resets all the controls to their initial values.\n*   `button`: The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur."
					}
				},
				{
					name: "value",
					description: {
						kind: "markdown",
						value: "The initial value of the button. It defines the value associated with the button which is submitted with the form data. This value is passed to the server in params when the form is submitted."
					}
				},
				{
					name: "autocomplete",
					description: "The use of this attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") is nonstandard and Firefox-specific. By default, unlike other browsers, [Firefox persists the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \"The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.\") across page loads. Setting the value of this attribute to `off` (i.e. `autocomplete=\"off\"`) disables this feature. See [bug\xA0654072](https://bugzilla.mozilla.org/show_bug.cgi?id=654072 \"if disabled state is changed with javascript, the normal state doesn't return after refreshing the page\")."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/button"
			}]
		},
		{
			name: "select",
			description: {
				kind: "markdown",
				value: "The select element represents a control for selecting amongst a set of options."
			},
			attributes: [
				{
					name: "autocomplete",
					valueSet: "inputautocomplete",
					description: {
						kind: "markdown",
						value: "A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString \"DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.\") providing a hint for a [user agent's](https://developer.mozilla.org/en-US/docs/Glossary/user_agent \"user agent's: A user agent is a computer program representing a person, for example, a browser in a Web context.\") autocomplete feature. See [The HTML autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for a complete list of values and details on how to use autocomplete."
					}
				},
				{
					name: "autofocus",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form element in a document can have the `autofocus` attribute."
					}
				},
				{
					name: "disabled",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example `fieldset`; if there is no containing element with the `disabled` attribute set, then the control is enabled."
					}
				},
				{
					name: "form",
					description: {
						kind: "markdown",
						value: "This attribute lets you specify the form element to\xA0which\xA0the select element is associated\xA0(that is, its \"form owner\"). If this attribute is specified, its value must be the same as the `id` of a form element in the same document. This enables you to place select elements anywhere within a document, not just as descendants of their form elements."
					}
				},
				{
					name: "multiple",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that multiple options can be selected in the list. If it is not specified, then only one option can be selected at a time. When `multiple` is specified, most browsers will show a scrolling list box instead of a single line dropdown."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "This attribute is used to specify the name of the control."
					}
				},
				{
					name: "required",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "A Boolean attribute indicating that an option with a non-empty string value must be selected."
					}
				},
				{
					name: "size",
					description: {
						kind: "markdown",
						value: "If the control is presented as a scrolling list box (e.g. when `multiple` is specified), this attribute represents the number of rows in the list that should be visible at one time. Browsers are not required to present a select element as a scrolled list box. The default value is 0.\n\n**Note:** According to the HTML5 specification, the default value for size should be 1; however, in practice, this has been found to break some web sites, and no other browser currently does that, so Mozilla has opted to continue to return 0 for the time being with Firefox."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/select"
			}]
		},
		{
			name: "datalist",
			description: {
				kind: "markdown",
				value: "The datalist element represents a set of option elements that represent predefined options for other controls. In the rendering, the datalist element represents nothing and it, along with its children, should be hidden."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/datalist"
			}]
		},
		{
			name: "optgroup",
			description: {
				kind: "markdown",
				value: "The optgroup element represents a group of option elements with a common label."
			},
			attributes: [{
				name: "disabled",
				valueSet: "v",
				description: {
					kind: "markdown",
					value: "If this Boolean attribute is set, none of the items in this option group is selectable. Often browsers grey out such control and it won't receive any browsing events, like mouse clicks or focus-related ones."
				}
			}, {
				name: "label",
				description: {
					kind: "markdown",
					value: "The name of the group of options, which the browser can use when labeling the options in the user interface. This attribute is mandatory if this element is used."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/optgroup"
			}]
		},
		{
			name: "option",
			description: {
				kind: "markdown",
				value: "The option element represents an option in a select element or as part of a list of suggestions in a datalist element."
			},
			attributes: [
				{
					name: "disabled",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "If this Boolean attribute is set, this option is not checkable. Often browsers grey out such control and it won't receive any browsing event, like mouse clicks or focus-related ones. If this attribute is not set, the element can still be disabled if one of its ancestors is a disabled [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup \"The HTML <optgroup> element creates a grouping of options within a <select> element.\") element."
					}
				},
				{
					name: "label",
					description: {
						kind: "markdown",
						value: "This attribute is text for the label indicating the meaning of the option. If the `label` attribute isn't defined, its value is that of the element text content."
					}
				},
				{
					name: "selected",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "If present, this Boolean attribute indicates that the option is initially selected. If the `<option>` element is the descendant of a [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select \"The HTML <select> element represents a control that provides a menu of options\") element whose [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple) attribute is not set, only one single `<option>` of this [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select \"The HTML <select> element represents a control that provides a menu of options\") element may have the `selected` attribute."
					}
				},
				{
					name: "value",
					description: {
						kind: "markdown",
						value: "The content of this attribute represents the value to be submitted with the form, should this option be selected.\xA0If this attribute is omitted, the value is taken from the text content of the option element."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/option"
			}]
		},
		{
			name: "textarea",
			description: {
				kind: "markdown",
				value: "The textarea element represents a multiline plain text edit control for the element's raw value. The contents of the control represent the control's default value."
			},
			attributes: [
				{
					name: "autocomplete",
					valueSet: "inputautocomplete",
					description: {
						kind: "markdown",
						value: "This attribute indicates whether the value of the control can be automatically completed by the browser. Possible values are:\n\n*   `off`: The user must explicitly enter a value into this field for every use, or the document provides its own auto-completion method; the browser does not automatically complete the entry.\n*   `on`: The browser can automatically complete the value based on values that the user has entered during previous uses.\n\nIf the `autocomplete` attribute is not specified on a `<textarea>` element, then the browser uses the `autocomplete` attribute value of the `<textarea>` element's form owner. The form owner is either the [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element that this `<textarea>` element is a descendant of or the form element whose `id` is specified by the `form` attribute of the input element. For more information, see the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-autocomplete) attribute in [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\")."
					}
				},
				{
					name: "autofocus",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form-associated element in a document can have this attribute specified."
					}
				},
				{
					name: "cols",
					description: {
						kind: "markdown",
						value: "The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. If it is not specified, the default value is `20`."
					}
				},
				{ name: "dirname" },
				{
					name: "disabled",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset \"The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form.\"); if there is no containing element when the `disabled` attribute is set, the control is enabled."
					}
				},
				{
					name: "form",
					description: {
						kind: "markdown",
						value: "The form element that the `<textarea>` element is associated with (its \"form owner\"). The value of the attribute must be the `id` of a form element in the same document. If this attribute is not specified, the `<textarea>` element must be a descendant of a form element. This attribute enables you to place `<textarea>` elements anywhere within a document, not just as descendants of form elements."
					}
				},
				{
					name: "inputmode",
					valueSet: "im"
				},
				{
					name: "maxlength",
					description: {
						kind: "markdown",
						value: "The maximum number of characters (unicode code points) that the user can enter. If this value isn't specified, the user can enter an unlimited number of characters."
					}
				},
				{
					name: "minlength",
					description: {
						kind: "markdown",
						value: "The minimum number of characters (unicode code points) required that the user should enter."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "The name of the control."
					}
				},
				{
					name: "placeholder",
					description: {
						kind: "markdown",
						value: "A hint to the user of what can be entered in the control. Carriage returns or line-feeds within the placeholder text must be treated as line breaks when rendering the hint.\n\n**Note:** Placeholders should only be used to show an example of the type of data that should be entered into a form; they are _not_ a substitute for a proper [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label \"The HTML <label> element represents a caption for an item in a user interface.\") element tied to the input. See [Labels and placeholders](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") in [<input>: The Input (Form Input) element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") for a full explanation."
					}
				},
				{
					name: "readonly",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute indicates that the user cannot modify the value of the control. Unlike the `disabled` attribute, the `readonly` attribute does not prevent the user from clicking or selecting in the control. The value of a read-only control is still submitted with the form."
					}
				},
				{
					name: "required",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This attribute specifies that the user must fill in a value before submitting a form."
					}
				},
				{
					name: "rows",
					description: {
						kind: "markdown",
						value: "The number of visible text lines for the control."
					}
				},
				{
					name: "wrap",
					valueSet: "w",
					description: {
						kind: "markdown",
						value: "Indicates how the control wraps text. Possible values are:\n\n*   `hard`: The browser automatically inserts line breaks (CR+LF) so that each line has no more than the width of the control; the `cols` attribute must also be specified for this to take effect.\n*   `soft`: The browser ensures that all line breaks in the value consist of a CR+LF pair, but does not insert any additional line breaks.\n*   `off` : Like `soft` but changes appearance to `white-space: pre` so line segments exceeding `cols` are not wrapped and the `<textarea>` becomes horizontally scrollable.\n\nIf this attribute is not specified, `soft` is its default value."
					}
				},
				{
					name: "autocapitalize",
					description: "This is a non-standard attribute supported by WebKit on iOS (therefore nearly all browsers running on iOS, including Safari, Firefox, and Chrome), which controls whether and how the text value should be automatically capitalized as it is entered/edited by the user. The non-deprecated values are available in iOS 5 and later. Possible values are:\n\n*   `none`: Completely disables automatic capitalization.\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5."
				},
				{
					name: "spellcheck",
					description: "Specifies whether the `<textarea>` is subject to spell checking by the underlying browser/OS. the value can be:\n\n*   `true`: Indicates that the element needs to have its spelling and grammar checked.\n*   `default` : Indicates that the element is to act according to a default behavior, possibly based on the parent element's own `spellcheck` value.\n*   `false` : Indicates that the element should not be spell checked."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea"
			}]
		},
		{
			name: "output",
			description: {
				kind: "markdown",
				value: "The output element represents the result of a calculation performed by the application, or the result of a user action."
			},
			attributes: [
				{
					name: "for",
					description: {
						kind: "markdown",
						value: "A space-separated list of other elements’ [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)s, indicating that those elements contributed input values to (or otherwise affected) the calculation."
					}
				},
				{
					name: "form",
					description: {
						kind: "markdown",
						value: "The [form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) that this element is associated with (its \"form owner\"). The value of the attribute must be an `id` of a form element in the same document. If this attribute is not specified, the output element must be a descendant of a form element. This attribute enables you to place output elements anywhere within a document, not just as descendants of their form elements."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "The name of the element, exposed in the [`HTMLFormElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement \"The HTMLFormElement interface represents a <form> element in the DOM; it allows access to and in some cases modification of aspects of the form, as well as access to its component elements.\") API."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/output"
			}]
		},
		{
			name: "progress",
			description: {
				kind: "markdown",
				value: "The progress element represents the completion progress of a task. The progress is either indeterminate, indicating that progress is being made but that it is not clear how much more work remains to be done before the task is complete (e.g. because the task is waiting for a remote host to respond), or the progress is a number in the range zero to a maximum, giving the fraction of work that has so far been completed."
			},
			attributes: [{
				name: "value",
				description: {
					kind: "markdown",
					value: "This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0 and `max`, or between 0 and 1 if `max` is omitted. If there is no `value` attribute, the progress bar is indeterminate; this indicates that an activity is ongoing with no indication of how long it is expected to take."
				}
			}, {
				name: "max",
				description: {
					kind: "markdown",
					value: "This attribute describes how much work the task indicated by the `progress` element requires. The `max` attribute, if present, must have a value greater than zero and be a valid floating point number. The default value is 1."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/progress"
			}]
		},
		{
			name: "meter",
			description: {
				kind: "markdown",
				value: "The meter element represents a scalar measurement within a known range, or a fractional value; for example disk usage, the relevance of a query result, or the fraction of a voting population to have selected a particular candidate."
			},
			attributes: [
				{
					name: "value",
					description: {
						kind: "markdown",
						value: "The current numeric value. This must be between the minimum and maximum values (`min` attribute and `max` attribute) if they are specified. If unspecified or malformed, the value is 0. If specified, but not within the range given by the `min` attribute and `max` attribute, the value is equal to the nearest end of the range.\n\n**Usage note:** Unless the `value` attribute is between `0` and `1` (inclusive), the `min` and `max` attributes should define the range so that the `value` attribute's value is within it."
					}
				},
				{
					name: "min",
					description: {
						kind: "markdown",
						value: "The lower numeric bound of the measured range. This must be less than the maximum value (`max` attribute), if specified. If unspecified, the minimum value is 0."
					}
				},
				{
					name: "max",
					description: {
						kind: "markdown",
						value: "The upper numeric bound of the measured range. This must be greater than the minimum value (`min` attribute), if specified. If unspecified, the maximum value is 1."
					}
				},
				{
					name: "low",
					description: {
						kind: "markdown",
						value: "The upper numeric bound of the low end of the measured range. This must be greater than the minimum value (`min` attribute), and it also must be less than the high value and maximum value (`high` attribute and `max` attribute, respectively), if any are specified. If unspecified, or if less than the minimum value, the `low` value is equal to the minimum value."
					}
				},
				{
					name: "high",
					description: {
						kind: "markdown",
						value: "The lower numeric bound of the high end of the measured range. This must be less than the maximum value (`max` attribute), and it also must be greater than the low value and minimum value (`low` attribute and **min** attribute, respectively), if any are specified. If unspecified, or if greater than the maximum value, the `high` value is equal to the maximum value."
					}
				},
				{
					name: "optimum",
					description: {
						kind: "markdown",
						value: "This attribute indicates the optimal numeric value. It must be within the range (as defined by the `min` attribute and `max` attribute). When used with the `low` attribute and `high` attribute, it gives an indication where along the range is considered preferable. For example, if it is between the `min` attribute and the `low` attribute, then the lower range is considered preferred."
					}
				},
				{
					name: "form",
					description: "This attribute associates the element with a `form` element that has ownership of the `meter` element. For example, a `meter` might be displaying a range corresponding to an `input` element of `type` _number_. This attribute is only used if the `meter` element is being used as a form-associated element; even then, it may be omitted if the element appears as a descendant of a `form` element."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/meter"
			}]
		},
		{
			name: "fieldset",
			description: {
				kind: "markdown",
				value: "The fieldset element represents a set of form controls optionally grouped under a common name."
			},
			attributes: [
				{
					name: "disabled",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "If this Boolean attribute is set, all form controls that are descendants of the `<fieldset>`, are disabled, meaning they are not editable and won't be submitted along with the `<form>`. They won't receive any browsing events, like mouse clicks or focus-related events. By default browsers display such controls grayed out. Note that form elements inside the [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend \"The HTML <legend> element represents a caption for the content of its parent <fieldset>.\") element won't be disabled."
					}
				},
				{
					name: "form",
					description: {
						kind: "markdown",
						value: "This attribute takes the value of the `id` attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form \"The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.\") element you want the `<fieldset>` to be part of, even if it is not inside the form."
					}
				},
				{
					name: "name",
					description: {
						kind: "markdown",
						value: "The name associated with the group.\n\n**Note**: The caption for the fieldset is given by the first [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend \"The HTML <legend> element represents a caption for the content of its parent <fieldset>.\") element nested inside it."
					}
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/fieldset"
			}]
		},
		{
			name: "legend",
			description: {
				kind: "markdown",
				value: "The legend element represents a caption for the rest of the contents of the legend element's parent fieldset element, if any."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/legend"
			}]
		},
		{
			name: "details",
			description: {
				kind: "markdown",
				value: "The details element represents a disclosure widget from which the user can obtain additional information or controls."
			},
			attributes: [{
				name: "open",
				valueSet: "v",
				description: {
					kind: "markdown",
					value: "This Boolean attribute indicates whether or not the details — that is, the contents of the `<details>` element — are currently visible. The default, `false`, means the details are not visible."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/details"
			}]
		},
		{
			name: "summary",
			description: {
				kind: "markdown",
				value: "The summary element represents a summary, caption, or legend for the rest of the contents of the summary element's parent details element, if any."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/summary"
			}]
		},
		{
			name: "dialog",
			description: {
				kind: "markdown",
				value: "The dialog element represents a part of an application that a user interacts with to perform a task, for example a dialog box, inspector, or window."
			},
			attributes: [{
				name: "open",
				description: "Indicates that the dialog is active and available for interaction. When the `open` attribute is not set, the dialog shouldn't be shown to the user."
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/dialog"
			}]
		},
		{
			name: "script",
			description: {
				kind: "markdown",
				value: "The script element allows authors to include dynamic script and data blocks in their documents. The element does not represent content for the user."
			},
			attributes: [
				{
					name: "src",
					description: {
						kind: "markdown",
						value: "This attribute specifies the URI of an external script; this can be used as an alternative to embedding a script directly within a document.\n\nIf a `script` element has a `src` attribute specified, it should not have a script embedded inside its tags."
					}
				},
				{
					name: "type",
					description: {
						kind: "markdown",
						value: "This attribute indicates the type of script represented. The value of this attribute will be in one of the following categories:\n\n*   **Omitted or a JavaScript MIME type:** For HTML5-compliant browsers this indicates the script is JavaScript. HTML5 specification urges authors to omit the attribute rather than provide a redundant MIME type. In earlier browsers, this identified the scripting language of the embedded or imported (via the `src` attribute) code. JavaScript MIME types are [listed in the specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#JavaScript_types).\n*   **`module`:** For HTML5-compliant browsers the code is treated as a JavaScript module. The processing of the script contents is not affected by the `charset` and `defer` attributes. For information on using `module`, see [ES6 in Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/). Code may behave differently when the `module` keyword is used.\n*   **Any other value:** The embedded content is treated as a data block which won't be processed by the browser. Developers must use a valid MIME type that is not a JavaScript MIME type to denote data blocks. The `src` attribute will be ignored.\n\n**Note:** in Firefox you could specify the version of JavaScript contained in a `<script>` element by including a non-standard `version` parameter inside the `type` attribute — for example `type=\"text/javascript;version=1.8\"`. This has been removed in Firefox 59 (see [bug\xA01428745](https://bugzilla.mozilla.org/show_bug.cgi?id=1428745 \"FIXED: Remove support for version parameter from script loader\"))."
					}
				},
				{ name: "charset" },
				{
					name: "async",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: `This is a Boolean attribute indicating that the browser should, if possible, load the script asynchronously.

This attribute must not be used if the \`src\` attribute is absent (i.e. for inline scripts). If it is included in this case it will have no effect.

Browsers usually assume the worst case scenario and load scripts synchronously, (i.e. \`async="false"\`) during HTML parsing.

Dynamically inserted scripts (using [\`document.createElement()\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement "In an HTML document, the document.createElement() method creates the HTML element specified by tagName, or an HTMLUnknownElement if tagName isn't recognized.")) load asynchronously by default, so to turn on synchronous loading (i.e. scripts load in the order they were inserted) set \`async="false"\`.

See [Browser compatibility](#Browser_compatibility) for notes on browser support. See also [Async scripts for asm.js](https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts).`
					}
				},
				{
					name: "defer",
					valueSet: "v",
					description: {
						kind: "markdown",
						value: "This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded \"/en-US/docs/Web/Events/DOMContentLoaded\").\n\nScripts with the `defer` attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating.\n\nThis attribute must not be used if the `src` attribute is absent (i.e. for inline scripts), in this case it would have no effect.\n\nTo achieve a similar effect for dynamically inserted scripts use `async=\"false\"` instead. Scripts with the `defer` attribute will execute in the order in which they appear in the document."
					}
				},
				{
					name: "crossorigin",
					valueSet: "xo",
					description: {
						kind: "markdown",
						value: "Normal `script` elements pass minimal information to the [`window.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror \"The onerror property of the GlobalEventHandlers mixin is an EventHandler that processes error events.\") for scripts which do not pass the standard [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS \"CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.\") checks. To allow error logging for sites which use a separate domain for static media, use this attribute. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for a more descriptive explanation of its valid arguments."
					}
				},
				{
					name: "nonce",
					description: {
						kind: "markdown",
						value: "A cryptographic nonce (number used once) to list the allowed inline scripts in a [script-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource's policy is otherwise trivial."
					}
				},
				{
					name: "integrity",
					description: "This attribute contains inline metadata that a user agent can use to verify that a fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)."
				},
				{
					name: "nomodule",
					description: "This Boolean attribute is set to indicate that the script should not be executed in browsers that support [ES2015 modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/) — in effect, this can be used to serve fallback scripts to older browsers that do not support modular JavaScript code."
				},
				{
					name: "referrerpolicy",
					description: "Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the script, or resources fetched by the script:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin \"origin: Web content's origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.\")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS \"TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.\") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS \"HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.\")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host \"host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails.\"), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port \"port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.\").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy \"same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin.\"), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (e.g. HTTPS→HTTPS), but don't send it to a less secure destination (e.g. HTTPS→HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, but only send the origin when the protocol security level stays the same (e.g.HTTPS→HTTPS), and send no header to a less secure destination (e.g. HTTPS→HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.\n\n**Note**: An empty string value (`\"\"`) is both the default value, and a fallback value if `referrerpolicy` is not supported. If `referrerpolicy` is not explicitly specified on the `<script>` element, it will adopt a higher-level referrer policy, i.e. one set on the whole document or domain. If a higher-level policy is not available,\xA0the empty string is treated as being equivalent to `no-referrer-when-downgrade`."
				},
				{
					name: "text",
					description: "Like the `textContent` attribute, this attribute sets the text content of the element. Unlike the `textContent` attribute, however, this attribute is evaluated as executable code after the node is inserted into the DOM."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/script"
			}]
		},
		{
			name: "noscript",
			description: {
				kind: "markdown",
				value: "The noscript element represents nothing if scripting is enabled, and represents its children if scripting is disabled. It is used to present different markup to user agents that support scripting and those that don't support scripting, by affecting how the document is parsed."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/noscript"
			}]
		},
		{
			name: "template",
			description: {
				kind: "markdown",
				value: "The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/template"
			}]
		},
		{
			name: "canvas",
			description: {
				kind: "markdown",
				value: "The canvas element provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly."
			},
			attributes: [
				{
					name: "width",
					description: {
						kind: "markdown",
						value: "The width of the coordinate space in CSS pixels. Defaults to 300."
					}
				},
				{
					name: "height",
					description: {
						kind: "markdown",
						value: "The height of the coordinate space in CSS pixels. Defaults to 150."
					}
				},
				{
					name: "moz-opaque",
					description: "Lets the canvas know whether or not translucency will be a factor. If the canvas knows there's no translucency, painting performance can be optimized. This is only supported by Mozilla-based browsers; use the standardized [`canvas.getContext('2d', { alpha: false })`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext \"The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.\") instead."
				}
			],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/canvas"
			}]
		},
		{
			name: "slot",
			description: {
				kind: "markdown",
				value: "The slot element is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together."
			},
			attributes: [{
				name: "name",
				description: {
					kind: "markdown",
					value: "The slot's name.\nA **named slot** is a `<slot>` element with a `name` attribute."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/slot"
			}]
		},
		{
			name: "data",
			description: {
				kind: "markdown",
				value: "The data element links a given piece of content with a machine-readable translation."
			},
			attributes: [{
				name: "value",
				description: {
					kind: "markdown",
					value: "This attribute specifies the machine-readable translation of the content of the element."
				}
			}],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/data"
			}]
		},
		{
			name: "hgroup",
			description: {
				kind: "markdown",
				value: "The hgroup element represents a heading and related content. It groups a single h1–h6 element with one or more p."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/hgroup"
			}]
		},
		{
			name: "menu",
			description: {
				kind: "markdown",
				value: "The menu element represents an unordered list of interactive items."
			},
			attributes: [],
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Element/menu"
			}]
		}
	],
	globalAttributes: [
		{
			name: "accesskey",
			description: {
				kind: "markdown",
				value: "Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/accesskey"
			}]
		},
		{
			name: "autocapitalize",
			description: {
				kind: "markdown",
				value: "Controls whether and how text input is automatically capitalized as it is entered/edited by the user. It can have the following values:\n\n*   `off` or `none`, no autocapitalization is applied (all letters default to lowercase)\n*   `on` or `sentences`, the first letter of each sentence defaults to a capital letter; all other letters default to lowercase\n*   `words`, the first letter of each word defaults to a capital letter; all other letters default to lowercase\n*   `characters`, all letters should default to uppercase"
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autocapitalize"
			}]
		},
		{
			name: "class",
			description: {
				kind: "markdown",
				value: "A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the [class selectors](https://developer.mozilla.org/docs/Web/CSS/Class_selectors) or functions like the method [`Document.getElementsByClassName()`](https://developer.mozilla.org/docs/Web/API/Document/getElementsByClassName \"returns an array-like object of all child elements which have all of the given class names.\")."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/class"
			}]
		},
		{
			name: "contenteditable",
			description: {
				kind: "markdown",
				value: "An enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:\n\n*   `true` or the _empty string_, which indicates that the element must be editable;\n*   `false`, which indicates that the element must not be editable."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contenteditable"
			}]
		},
		{
			name: "contextmenu",
			description: {
				kind: "markdown",
				value: "The `[**id**](#attr-id)` of a [`<menu>`](https://developer.mozilla.org/docs/Web/HTML/Element/menu \"The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.\") to use as the contextual menu for this element."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contextmenu"
			}]
		},
		{
			name: "dir",
			description: {
				kind: "markdown",
				value: "An enumerated attribute indicating the directionality of the element's text. It can have the following values:\n\n*   `ltr`, which means _left to right_ and is to be used for languages that are written from the left to the right (like English);\n*   `rtl`, which means _right to left_ and is to be used for languages that are written from the right to the left (like Arabic);\n*   `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element."
			},
			valueSet: "d",
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/dir"
			}]
		},
		{
			name: "draggable",
			description: {
				kind: "markdown",
				value: "An enumerated attribute indicating whether the element can be dragged, using the [Drag and Drop API](https://developer.mozilla.org/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `true`, which indicates that the element may be dragged\n*   `false`, which indicates that the element may not be dragged."
			},
			valueSet: "b",
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/draggable"
			}]
		},
		{
			name: "dropzone",
			description: {
				kind: "markdown",
				value: "An enumerated attribute indicating what types of content can be dropped on an element, using the [Drag and Drop API](https://developer.mozilla.org/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `copy`, which indicates that dropping will create a copy of the element that was dragged\n*   `move`, which indicates that the element that was dragged will be moved to this new location.\n*   `link`, will create a link to the dragged data."
			}
		},
		{
			name: "exportparts",
			description: {
				kind: "markdown",
				value: "Used to transitively export shadow parts from a nested shadow tree into a containing light tree."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/exportparts"
			}]
		},
		{
			name: "hidden",
			description: {
				kind: "markdown",
				value: "A Boolean attribute indicates that the element is not yet, or is no longer, _relevant_. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown."
			},
			valueSet: "v",
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/hidden"
			}]
		},
		{
			name: "id",
			description: {
				kind: "markdown",
				value: "Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS)."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/id"
			}]
		},
		{
			name: "inputmode",
			description: {
				kind: "markdown",
				value: "Provides a hint to browsers as to the type of virtual keyboard configuration to use when editing this element or its contents. Used primarily on [`<input>`](https://developer.mozilla.org/docs/Web/HTML/Element/input \"The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.\") elements, but is usable on any element while in `[contenteditable](https://developer.mozilla.org/docs/Web/HTML/Global_attributes#attr-contenteditable)` mode."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode"
			}]
		},
		{
			name: "is",
			description: {
				kind: "markdown",
				value: "Allows you to specify that a standard HTML element should behave like a registered custom built-in element (see [Using custom elements](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) for more details)."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/is"
			}]
		},
		{
			name: "itemid",
			description: {
				kind: "markdown",
				value: "The unique, global identifier of an item."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemid"
			}]
		},
		{
			name: "itemprop",
			description: {
				kind: "markdown",
				value: "Used to add properties to an item. Every HTML element may have an `itemprop` attribute specified, where an `itemprop` consists of a name and value pair."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemprop"
			}]
		},
		{
			name: "itemref",
			description: {
				kind: "markdown",
				value: "Properties that are not descendants of an element with the `itemscope` attribute can be associated with the item using an `itemref`. It provides a list of element ids (not `itemid`s) with additional properties elsewhere in the document."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemref"
			}]
		},
		{
			name: "itemscope",
			description: {
				kind: "markdown",
				value: "`itemscope` (usually) works along with `[itemtype](https://developer.mozilla.org/docs/Web/HTML/Global_attributes#attr-itemtype)` to specify that the HTML contained in a block is about a particular item. `itemscope` creates the Item and defines the scope of the `itemtype` associated with it. `itemtype` is a valid URL of a vocabulary (such as [schema.org](https://schema.org/)) that describes the item and its properties context."
			},
			valueSet: "v",
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemscope"
			}]
		},
		{
			name: "itemtype",
			description: {
				kind: "markdown",
				value: "Specifies the URL of the vocabulary that will be used to define `itemprop`s (item properties) in the data structure. `[itemscope](https://developer.mozilla.org/docs/Web/HTML/Global_attributes#attr-itemscope)` is used to set the scope of where in the data structure the vocabulary set by `itemtype` will be active."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemtype"
			}]
		},
		{
			name: "lang",
			description: {
				kind: "markdown",
				value: "Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute contains one “language tag” (made of hyphen-separated “language subtags”) in the format defined in [_Tags for Identifying Languages (BCP47)_](https://www.ietf.org/rfc/bcp/bcp47.txt). [**xml:lang**](#attr-xml:lang) has priority over it."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang"
			}]
		},
		{
			name: "part",
			description: {
				kind: "markdown",
				value: "A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the [`::part`](https://developer.mozilla.org/docs/Web/CSS/::part \"The ::part CSS pseudo-element represents any element within a shadow tree that has a matching part attribute.\") pseudo-element."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/part"
			}]
		},
		{
			name: "role",
			valueSet: "roles"
		},
		{
			name: "slot",
			description: {
				kind: "markdown",
				value: "Assigns a slot in a [shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Shadow_DOM) shadow tree to an element: An element with a `slot` attribute is assigned to the slot created by the [`<slot>`](https://developer.mozilla.org/docs/Web/HTML/Element/slot \"The HTML <slot> element—part of the Web Components technology suite—is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together.\") element whose `[name](https://developer.mozilla.org/docs/Web/HTML/Element/slot#attr-name)` attribute's value matches that `slot` attribute's value."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/slot"
			}]
		},
		{
			name: "spellcheck",
			description: {
				kind: "markdown",
				value: "An enumerated attribute defines whether the element may be checked for spelling errors. It may have the following values:\n\n*   `true`, which indicates that the element should be, if possible, checked for spelling errors;\n*   `false`, which indicates that the element should not be checked for spelling errors."
			},
			valueSet: "b",
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck"
			}]
		},
		{
			name: "style",
			description: {
				kind: "markdown",
				value: "Contains [CSS](https://developer.mozilla.org/docs/Web/CSS) styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the [`<style>`](https://developer.mozilla.org/docs/Web/HTML/Element/style \"The HTML <style> element contains style information for a document, or part of a document.\") element have mainly the purpose of allowing for quick styling, for example for testing purposes."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/style"
			}]
		},
		{
			name: "tabindex",
			description: {
				kind: "markdown",
				value: `An integer attribute indicating if the element can take input focus (is _focusable_), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:

*   a _negative value_ means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
*   \`0\` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
*   a _positive value_ means that the element should be focusable and reachable via sequential keyboard navigation; the order in which the elements are focused is the increasing value of the [**tabindex**](#attr-tabindex). If several elements share the same tabindex, their relative order follows their relative positions in the document.`
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex"
			}]
		},
		{
			name: "title",
			description: {
				kind: "markdown",
				value: "Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip."
			},
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/title"
			}]
		},
		{
			name: "translate",
			description: {
				kind: "markdown",
				value: "An enumerated attribute that is used to specify whether an element's attribute values and the values of its [`Text`](https://developer.mozilla.org/docs/Web/API/Text \"The Text interface represents the textual content of Element or Attr. If an element has no markup within its content, it has a single child implementing Text that contains the element's text. However, if the element contains markup, it is parsed into information items and Text nodes that form its children.\") node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:\n\n*   empty string and `yes`, which indicates that the element will be translated.\n*   `no`, which indicates that the element will not be translated."
			},
			valueSet: "y",
			references: [{
				name: "MDN Reference",
				url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/translate"
			}]
		},
		{
			name: "onabort",
			description: {
				kind: "markdown",
				value: "The loading of a resource has been aborted."
			}
		},
		{
			name: "onblur",
			description: {
				kind: "markdown",
				value: "An element has lost focus (does not bubble)."
			}
		},
		{
			name: "oncanplay",
			description: {
				kind: "markdown",
				value: "The user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content."
			}
		},
		{
			name: "oncanplaythrough",
			description: {
				kind: "markdown",
				value: "The user agent can play the media up to its end without having to stop for further buffering of content."
			}
		},
		{
			name: "onchange",
			description: {
				kind: "markdown",
				value: "The change event is fired for <input>, <select>, and <textarea> elements when a change to the element's value is committed by the user."
			}
		},
		{
			name: "onclick",
			description: {
				kind: "markdown",
				value: "A pointing device button has been pressed and released on an element."
			}
		},
		{
			name: "oncontextmenu",
			description: {
				kind: "markdown",
				value: "The right button of the mouse is clicked (before the context menu is displayed)."
			}
		},
		{
			name: "ondblclick",
			description: {
				kind: "markdown",
				value: "A pointing device button is clicked twice on an element."
			}
		},
		{
			name: "ondrag",
			description: {
				kind: "markdown",
				value: "An element or text selection is being dragged (every 350ms)."
			}
		},
		{
			name: "ondragend",
			description: {
				kind: "markdown",
				value: "A drag operation is being ended (by releasing a mouse button or hitting the escape key)."
			}
		},
		{
			name: "ondragenter",
			description: {
				kind: "markdown",
				value: "A dragged element or text selection enters a valid drop target."
			}
		},
		{
			name: "ondragleave",
			description: {
				kind: "markdown",
				value: "A dragged element or text selection leaves a valid drop target."
			}
		},
		{
			name: "ondragover",
			description: {
				kind: "markdown",
				value: "An element or text selection is being dragged over a valid drop target (every 350ms)."
			}
		},
		{
			name: "ondragstart",
			description: {
				kind: "markdown",
				value: "The user starts dragging an element or text selection."
			}
		},
		{
			name: "ondrop",
			description: {
				kind: "markdown",
				value: "An element is dropped on a valid drop target."
			}
		},
		{
			name: "ondurationchange",
			description: {
				kind: "markdown",
				value: "The duration attribute has been updated."
			}
		},
		{
			name: "onemptied",
			description: {
				kind: "markdown",
				value: "The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it."
			}
		},
		{
			name: "onended",
			description: {
				kind: "markdown",
				value: "Playback has stopped because the end of the media was reached."
			}
		},
		{
			name: "onerror",
			description: {
				kind: "markdown",
				value: "A resource failed to load."
			}
		},
		{
			name: "onfocus",
			description: {
				kind: "markdown",
				value: "An element has received focus (does not bubble)."
			}
		},
		{ name: "onformchange" },
		{ name: "onforminput" },
		{
			name: "oninput",
			description: {
				kind: "markdown",
				value: "The value of an element changes or the content of an element with the attribute contenteditable is modified."
			}
		},
		{
			name: "oninvalid",
			description: {
				kind: "markdown",
				value: "A submittable element has been checked and doesn't satisfy its constraints."
			}
		},
		{
			name: "onkeydown",
			description: {
				kind: "markdown",
				value: "A key is pressed down."
			}
		},
		{
			name: "onkeypress",
			description: {
				kind: "markdown",
				value: "A key is pressed down and that key normally produces a character value (use input instead)."
			}
		},
		{
			name: "onkeyup",
			description: {
				kind: "markdown",
				value: "A key is released."
			}
		},
		{
			name: "onload",
			description: {
				kind: "markdown",
				value: "A resource and its dependent resources have finished loading."
			}
		},
		{
			name: "onloadeddata",
			description: {
				kind: "markdown",
				value: "The first frame of the media has finished loading."
			}
		},
		{
			name: "onloadedmetadata",
			description: {
				kind: "markdown",
				value: "The metadata has been loaded."
			}
		},
		{
			name: "onloadstart",
			description: {
				kind: "markdown",
				value: "Progress has begun."
			}
		},
		{
			name: "onmousedown",
			description: {
				kind: "markdown",
				value: "A pointing device button (usually a mouse) is pressed on an element."
			}
		},
		{
			name: "onmousemove",
			description: {
				kind: "markdown",
				value: "A pointing device is moved over an element."
			}
		},
		{
			name: "onmouseout",
			description: {
				kind: "markdown",
				value: "A pointing device is moved off the element that has the listener attached or off one of its children."
			}
		},
		{
			name: "onmouseover",
			description: {
				kind: "markdown",
				value: "A pointing device is moved onto the element that has the listener attached or onto one of its children."
			}
		},
		{
			name: "onmouseup",
			description: {
				kind: "markdown",
				value: "A pointing device button is released over an element."
			}
		},
		{ name: "onmousewheel" },
		{
			name: "onmouseenter",
			description: {
				kind: "markdown",
				value: "A pointing device is moved onto the element that has the listener attached."
			}
		},
		{
			name: "onmouseleave",
			description: {
				kind: "markdown",
				value: "A pointing device is moved off the element that has the listener attached."
			}
		},
		{
			name: "onpause",
			description: {
				kind: "markdown",
				value: "Playback has been paused."
			}
		},
		{
			name: "onplay",
			description: {
				kind: "markdown",
				value: "Playback has begun."
			}
		},
		{
			name: "onplaying",
			description: {
				kind: "markdown",
				value: "Playback is ready to start after having been paused or delayed due to lack of data."
			}
		},
		{
			name: "onprogress",
			description: {
				kind: "markdown",
				value: "In progress."
			}
		},
		{
			name: "onratechange",
			description: {
				kind: "markdown",
				value: "The playback rate has changed."
			}
		},
		{
			name: "onreset",
			description: {
				kind: "markdown",
				value: "A form is reset."
			}
		},
		{
			name: "onresize",
			description: {
				kind: "markdown",
				value: "The document view has been resized."
			}
		},
		{
			name: "onreadystatechange",
			description: {
				kind: "markdown",
				value: "The readyState attribute of a document has changed."
			}
		},
		{
			name: "onscroll",
			description: {
				kind: "markdown",
				value: "The document view or an element has been scrolled."
			}
		},
		{
			name: "onseeked",
			description: {
				kind: "markdown",
				value: "A seek operation completed."
			}
		},
		{
			name: "onseeking",
			description: {
				kind: "markdown",
				value: "A seek operation began."
			}
		},
		{
			name: "onselect",
			description: {
				kind: "markdown",
				value: "Some text is being selected."
			}
		},
		{
			name: "onshow",
			description: {
				kind: "markdown",
				value: "A contextmenu event was fired on/bubbled to an element that has a contextmenu attribute"
			}
		},
		{
			name: "onstalled",
			description: {
				kind: "markdown",
				value: "The user agent is trying to fetch media data, but data is unexpectedly not forthcoming."
			}
		},
		{
			name: "onsubmit",
			description: {
				kind: "markdown",
				value: "A form is submitted."
			}
		},
		{
			name: "onsuspend",
			description: {
				kind: "markdown",
				value: "Media data loading has been suspended."
			}
		},
		{
			name: "ontimeupdate",
			description: {
				kind: "markdown",
				value: "The time indicated by the currentTime attribute has been updated."
			}
		},
		{
			name: "onvolumechange",
			description: {
				kind: "markdown",
				value: "The volume has changed."
			}
		},
		{
			name: "onwaiting",
			description: {
				kind: "markdown",
				value: "Playback has stopped because of a temporary lack of data."
			}
		},
		{
			name: "onpointercancel",
			description: {
				kind: "markdown",
				value: "The pointer is unlikely to produce any more events."
			}
		},
		{
			name: "onpointerdown",
			description: {
				kind: "markdown",
				value: "The pointer enters the active buttons state."
			}
		},
		{
			name: "onpointerenter",
			description: {
				kind: "markdown",
				value: "Pointing device is moved inside the hit-testing boundary."
			}
		},
		{
			name: "onpointerleave",
			description: {
				kind: "markdown",
				value: "Pointing device is moved out of the hit-testing boundary."
			}
		},
		{
			name: "onpointerlockchange",
			description: {
				kind: "markdown",
				value: "The pointer was locked or released."
			}
		},
		{
			name: "onpointerlockerror",
			description: {
				kind: "markdown",
				value: "It was impossible to lock the pointer for technical reasons or because the permission was denied."
			}
		},
		{
			name: "onpointermove",
			description: {
				kind: "markdown",
				value: "The pointer changed coordinates."
			}
		},
		{
			name: "onpointerout",
			description: {
				kind: "markdown",
				value: "The pointing device moved out of hit-testing boundary or leaves detectable hover range."
			}
		},
		{
			name: "onpointerover",
			description: {
				kind: "markdown",
				value: "The pointing device is moved into the hit-testing boundary."
			}
		},
		{
			name: "onpointerup",
			description: {
				kind: "markdown",
				value: "The pointer leaves the active buttons state."
			}
		},
		{
			name: "aria-activedescendant",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant"
			}],
			description: {
				kind: "markdown",
				value: "Identifies the currently active element when DOM focus is on a [`composite`](https://www.w3.org/TR/wai-aria-1.1/#composite) widget, [`textbox`](https://www.w3.org/TR/wai-aria-1.1/#textbox), [`group`](https://www.w3.org/TR/wai-aria-1.1/#group), or [`application`](https://www.w3.org/TR/wai-aria-1.1/#application)."
			}
		},
		{
			name: "aria-atomic",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-atomic"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology) will present all, or only parts of, the changed region based on the change notifications defined by the [`aria-relevant`](https://www.w3.org/TR/wai-aria-1.1/#aria-relevant) attribute."
			}
		},
		{
			name: "aria-autocomplete",
			valueSet: "autocomplete",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made."
			}
		},
		{
			name: "aria-busy",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-busy"
			}],
			description: {
				kind: "markdown",
				value: "Indicates an element is being modified and that assistive technologies _MAY_ want to wait until the modifications are complete before exposing them to the user."
			}
		},
		{
			name: "aria-checked",
			valueSet: "tristate",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-checked"
			}],
			description: {
				kind: "markdown",
				value: "Indicates the current \"checked\" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of checkboxes, radio buttons, and other [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected)."
			}
		},
		{
			name: "aria-colcount",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colcount"
			}],
			description: {
				kind: "markdown",
				value: "Defines the total number of columns in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex)."
			}
		},
		{
			name: "aria-colindex",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colindex"
			}],
			description: {
				kind: "markdown",
				value: "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) column index or position with respect to the total number of columns within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-colcount) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan)."
			}
		},
		{
			name: "aria-colspan",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colspan"
			}],
			description: {
				kind: "markdown",
				value: "Defines the number of columns spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan)."
			}
		},
		{
			name: "aria-controls",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-controls"
			}],
			description: {
				kind: "markdown",
				value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) whose contents or presence are controlled by the current element. See related [`aria-owns`](https://www.w3.org/TR/wai-aria-1.1/#aria-owns)."
			}
		},
		{
			name: "aria-current",
			valueSet: "current",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-current"
			}],
			description: {
				kind: "markdown",
				value: "Indicates the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that represents the current item within a container or set of related elements."
			}
		},
		{
			name: "aria-describedby",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-describedby"
			}],
			description: {
				kind: "markdown",
				value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that describes the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby)."
			}
		},
		{
			name: "aria-disabled",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-disabled"
			}],
			description: {
				kind: "markdown",
				value: "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is [perceivable](https://www.w3.org/TR/wai-aria-1.1/#dfn-perceivable) but disabled, so it is not editable or otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.1/#aria-hidden) and [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.1/#aria-readonly)."
			}
		},
		{
			name: "aria-dropeffect",
			valueSet: "dropeffect",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-dropeffect"
			}],
			description: {
				kind: "markdown",
				value: "\\[Deprecated in ARIA 1.1\\] Indicates what functions can be performed when a dragged object is released on the drop target."
			}
		},
		{
			name: "aria-errormessage",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage"
			}],
			description: {
				kind: "markdown",
				value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides an error message for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.1/#aria-invalid) and [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
			}
		},
		{
			name: "aria-expanded",
			valueSet: "u",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-expanded"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed."
			}
		},
		{
			name: "aria-flowto",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-flowto"
			}],
			description: {
				kind: "markdown",
				value: "Identifies the next [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order."
			}
		},
		{
			name: "aria-grabbed",
			valueSet: "u",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-grabbed"
			}],
			description: {
				kind: "markdown",
				value: `\\[Deprecated in ARIA 1.1\\] Indicates an element's "grabbed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) in a drag-and-drop operation.`
			}
		},
		{
			name: "aria-haspopup",
			valueSet: "haspopup",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup"
			}],
			description: {
				kind: "markdown",
				value: "Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)."
			}
		},
		{
			name: "aria-hidden",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-hidden"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is exposed to an accessibility API. See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled)."
			}
		},
		{
			name: "aria-invalid",
			valueSet: "invalid",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-invalid"
			}],
			description: {
				kind: "markdown",
				value: "Indicates the entered value does not conform to the format expected by the application. See related [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage)."
			}
		},
		{
			name: "aria-label",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-label"
			}],
			description: {
				kind: "markdown",
				value: "Defines a string value that labels the current element. See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby)."
			}
		},
		{
			name: "aria-labelledby",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby"
			}],
			description: {
				kind: "markdown",
				value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that labels the current element. See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
			}
		},
		{
			name: "aria-level",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-level"
			}],
			description: {
				kind: "markdown",
				value: "Defines the hierarchical level of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) within a structure."
			}
		},
		{
			name: "aria-live",
			valueSet: "live",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-live"
			}],
			description: {
				kind: "markdown",
				value: "Indicates that an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) will be updated, and describes the types of updates the [user agents](https://www.w3.org/TR/wai-aria-1.1/#dfn-user-agent), [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology), and user can expect from the [live region](https://www.w3.org/TR/wai-aria-1.1/#dfn-live-region)."
			}
		},
		{
			name: "aria-modal",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-modal"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is modal when displayed."
			}
		},
		{
			name: "aria-multiline",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiline"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether a text box accepts multiple lines of input or only a single line."
			}
		},
		{
			name: "aria-multiselectable",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable"
			}],
			description: {
				kind: "markdown",
				value: "Indicates that the user may select more than one item from the current selectable descendants."
			}
		},
		{
			name: "aria-orientation",
			valueSet: "orientation",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-orientation"
			}],
			description: {
				kind: "markdown",
				value: "Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous."
			}
		},
		{
			name: "aria-owns",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-owns"
			}],
			description: {
				kind: "markdown",
				value: "Identifies an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in order to define a visual, functional, or contextual parent/child [relationship](https://www.w3.org/TR/wai-aria-1.1/#dfn-relationship) between DOM elements where the DOM hierarchy cannot be used to represent the relationship. See related [`aria-controls`](https://www.w3.org/TR/wai-aria-1.1/#aria-controls)."
			}
		},
		{
			name: "aria-placeholder",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder"
			}],
			description: {
				kind: "markdown",
				value: "Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format."
			}
		},
		{
			name: "aria-posinset",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-posinset"
			}],
			description: {
				kind: "markdown",
				value: "Defines an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)'s number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-setsize`](https://www.w3.org/TR/wai-aria-1.1/#aria-setsize)."
			}
		},
		{
			name: "aria-pressed",
			valueSet: "tristate",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-pressed"
			}],
			description: {
				kind: "markdown",
				value: "Indicates the current \"pressed\" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of toggle buttons. See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected)."
			}
		},
		{
			name: "aria-readonly",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-readonly"
			}],
			description: {
				kind: "markdown",
				value: "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is not editable, but is otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled)."
			}
		},
		{
			name: "aria-relevant",
			valueSet: "relevant",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-relevant"
			}],
			description: {
				kind: "markdown",
				value: "Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. See related [`aria-atomic`](https://www.w3.org/TR/wai-aria-1.1/#aria-atomic)."
			}
		},
		{
			name: "aria-required",
			valueSet: "b",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-required"
			}],
			description: {
				kind: "markdown",
				value: "Indicates that user input is required on the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) before a form may be submitted."
			}
		},
		{
			name: "aria-roledescription",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription"
			}],
			description: {
				kind: "markdown",
				value: "Defines a human-readable, author-localized description for the [role](https://www.w3.org/TR/wai-aria-1.1/#dfn-role) of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)."
			}
		},
		{
			name: "aria-rowcount",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount"
			}],
			description: {
				kind: "markdown",
				value: "Defines the total number of rows in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex)."
			}
		},
		{
			name: "aria-rowindex",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex"
			}],
			description: {
				kind: "markdown",
				value: "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) row index or position with respect to the total number of rows within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan)."
			}
		},
		{
			name: "aria-rowspan",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan"
			}],
			description: {
				kind: "markdown",
				value: "Defines the number of rows spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan)."
			}
		},
		{
			name: "aria-selected",
			valueSet: "u",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-selected"
			}],
			description: {
				kind: "markdown",
				value: "Indicates the current \"selected\" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of various [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed)."
			}
		},
		{
			name: "aria-setsize",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-setsize"
			}],
			description: {
				kind: "markdown",
				value: "Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-posinset`](https://www.w3.org/TR/wai-aria-1.1/#aria-posinset)."
			}
		},
		{
			name: "aria-sort",
			valueSet: "sort",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-sort"
			}],
			description: {
				kind: "markdown",
				value: "Indicates if items in a table or grid are sorted in ascending or descending order."
			}
		},
		{
			name: "aria-valuemax",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax"
			}],
			description: {
				kind: "markdown",
				value: "Defines the maximum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
			}
		},
		{
			name: "aria-valuemin",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin"
			}],
			description: {
				kind: "markdown",
				value: "Defines the minimum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
			}
		},
		{
			name: "aria-valuenow",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow"
			}],
			description: {
				kind: "markdown",
				value: "Defines the current value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-valuetext`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext)."
			}
		},
		{
			name: "aria-valuetext",
			references: [{
				name: "WAI-ARIA Reference",
				url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext"
			}],
			description: {
				kind: "markdown",
				value: "Defines the human readable text alternative of [`aria-valuenow`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow) for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
			}
		},
		{
			name: "aria-details",
			description: {
				kind: "markdown",
				value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides a detailed, extended description for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
			}
		},
		{
			name: "aria-keyshortcuts",
			description: {
				kind: "markdown",
				value: "Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element."
			}
		}
	],
	valueSets: [
		{
			name: "b",
			values: [{ name: "true" }, { name: "false" }]
		},
		{
			name: "u",
			values: [
				{ name: "true" },
				{ name: "false" },
				{ name: "undefined" }
			]
		},
		{
			name: "o",
			values: [{ name: "on" }, { name: "off" }]
		},
		{
			name: "y",
			values: [{ name: "yes" }, { name: "no" }]
		},
		{
			name: "w",
			values: [{ name: "soft" }, { name: "hard" }]
		},
		{
			name: "d",
			values: [
				{ name: "ltr" },
				{ name: "rtl" },
				{ name: "auto" }
			]
		},
		{
			name: "m",
			values: [
				{
					name: "get",
					description: {
						kind: "markdown",
						value: "Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters."
					}
				},
				{
					name: "post",
					description: {
						kind: "markdown",
						value: "Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5); form data are included in the body of the form and sent to the server."
					}
				},
				{
					name: "dialog",
					description: {
						kind: "markdown",
						value: "Use when the form is inside a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element to close the dialog when submitted."
					}
				}
			]
		},
		{
			name: "fm",
			values: [{ name: "get" }, { name: "post" }]
		},
		{
			name: "s",
			values: [
				{ name: "row" },
				{ name: "col" },
				{ name: "rowgroup" },
				{ name: "colgroup" }
			]
		},
		{
			name: "t",
			values: [
				{ name: "hidden" },
				{ name: "text" },
				{ name: "search" },
				{ name: "tel" },
				{ name: "url" },
				{ name: "email" },
				{ name: "password" },
				{ name: "datetime" },
				{ name: "date" },
				{ name: "month" },
				{ name: "week" },
				{ name: "time" },
				{ name: "datetime-local" },
				{ name: "number" },
				{ name: "range" },
				{ name: "color" },
				{ name: "checkbox" },
				{ name: "radio" },
				{ name: "file" },
				{ name: "submit" },
				{ name: "image" },
				{ name: "reset" },
				{ name: "button" }
			]
		},
		{
			name: "im",
			values: [
				{ name: "verbatim" },
				{ name: "latin" },
				{ name: "latin-name" },
				{ name: "latin-prose" },
				{ name: "full-width-latin" },
				{ name: "kana" },
				{ name: "kana-name" },
				{ name: "katakana" },
				{ name: "numeric" },
				{ name: "tel" },
				{ name: "email" },
				{ name: "url" }
			]
		},
		{
			name: "bt",
			values: [
				{ name: "button" },
				{ name: "submit" },
				{ name: "reset" },
				{ name: "menu" }
			]
		},
		{
			name: "lt",
			values: [
				{ name: "1" },
				{ name: "a" },
				{ name: "A" },
				{ name: "i" },
				{ name: "I" }
			]
		},
		{
			name: "mt",
			values: [{ name: "context" }, { name: "toolbar" }]
		},
		{
			name: "mit",
			values: [
				{ name: "command" },
				{ name: "checkbox" },
				{ name: "radio" }
			]
		},
		{
			name: "et",
			values: [
				{ name: "application/x-www-form-urlencoded" },
				{ name: "multipart/form-data" },
				{ name: "text/plain" }
			]
		},
		{
			name: "tk",
			values: [
				{ name: "subtitles" },
				{ name: "captions" },
				{ name: "descriptions" },
				{ name: "chapters" },
				{ name: "metadata" }
			]
		},
		{
			name: "pl",
			values: [
				{ name: "none" },
				{ name: "metadata" },
				{ name: "auto" }
			]
		},
		{
			name: "sh",
			values: [
				{ name: "circle" },
				{ name: "default" },
				{ name: "poly" },
				{ name: "rect" }
			]
		},
		{
			name: "xo",
			values: [{ name: "anonymous" }, { name: "use-credentials" }]
		},
		{
			name: "target",
			values: [
				{ name: "_self" },
				{ name: "_blank" },
				{ name: "_parent" },
				{ name: "_top" }
			]
		},
		{
			name: "sb",
			values: [
				{ name: "allow-forms" },
				{ name: "allow-modals" },
				{ name: "allow-pointer-lock" },
				{ name: "allow-popups" },
				{ name: "allow-popups-to-escape-sandbox" },
				{ name: "allow-same-origin" },
				{ name: "allow-scripts" },
				{ name: "allow-top-navigation" }
			]
		},
		{
			name: "tristate",
			values: [
				{ name: "true" },
				{ name: "false" },
				{ name: "mixed" },
				{ name: "undefined" }
			]
		},
		{
			name: "inputautocomplete",
			values: [
				{ name: "additional-name" },
				{ name: "address-level1" },
				{ name: "address-level2" },
				{ name: "address-level3" },
				{ name: "address-level4" },
				{ name: "address-line1" },
				{ name: "address-line2" },
				{ name: "address-line3" },
				{ name: "bday" },
				{ name: "bday-year" },
				{ name: "bday-day" },
				{ name: "bday-month" },
				{ name: "billing" },
				{ name: "cc-additional-name" },
				{ name: "cc-csc" },
				{ name: "cc-exp" },
				{ name: "cc-exp-month" },
				{ name: "cc-exp-year" },
				{ name: "cc-family-name" },
				{ name: "cc-given-name" },
				{ name: "cc-name" },
				{ name: "cc-number" },
				{ name: "cc-type" },
				{ name: "country" },
				{ name: "country-name" },
				{ name: "current-password" },
				{ name: "email" },
				{ name: "family-name" },
				{ name: "fax" },
				{ name: "given-name" },
				{ name: "home" },
				{ name: "honorific-prefix" },
				{ name: "honorific-suffix" },
				{ name: "impp" },
				{ name: "language" },
				{ name: "mobile" },
				{ name: "name" },
				{ name: "new-password" },
				{ name: "nickname" },
				{ name: "off" },
				{ name: "on" },
				{ name: "organization" },
				{ name: "organization-title" },
				{ name: "pager" },
				{ name: "photo" },
				{ name: "postal-code" },
				{ name: "sex" },
				{ name: "shipping" },
				{ name: "street-address" },
				{ name: "tel-area-code" },
				{ name: "tel" },
				{ name: "tel-country-code" },
				{ name: "tel-extension" },
				{ name: "tel-local" },
				{ name: "tel-local-prefix" },
				{ name: "tel-local-suffix" },
				{ name: "tel-national" },
				{ name: "transaction-amount" },
				{ name: "transaction-currency" },
				{ name: "url" },
				{ name: "username" },
				{ name: "work" }
			]
		},
		{
			name: "autocomplete",
			values: [
				{ name: "inline" },
				{ name: "list" },
				{ name: "both" },
				{ name: "none" }
			]
		},
		{
			name: "current",
			values: [
				{ name: "page" },
				{ name: "step" },
				{ name: "location" },
				{ name: "date" },
				{ name: "time" },
				{ name: "true" },
				{ name: "false" }
			]
		},
		{
			name: "dropeffect",
			values: [
				{ name: "copy" },
				{ name: "move" },
				{ name: "link" },
				{ name: "execute" },
				{ name: "popup" },
				{ name: "none" }
			]
		},
		{
			name: "invalid",
			values: [
				{ name: "grammar" },
				{ name: "false" },
				{ name: "spelling" },
				{ name: "true" }
			]
		},
		{
			name: "live",
			values: [
				{ name: "off" },
				{ name: "polite" },
				{ name: "assertive" }
			]
		},
		{
			name: "orientation",
			values: [
				{ name: "vertical" },
				{ name: "horizontal" },
				{ name: "undefined" }
			]
		},
		{
			name: "relevant",
			values: [
				{ name: "additions" },
				{ name: "removals" },
				{ name: "text" },
				{ name: "all" },
				{ name: "additions text" }
			]
		},
		{
			name: "sort",
			values: [
				{ name: "ascending" },
				{ name: "descending" },
				{ name: "none" },
				{ name: "other" }
			]
		},
		{
			name: "roles",
			values: [
				{ name: "alert" },
				{ name: "alertdialog" },
				{ name: "button" },
				{ name: "checkbox" },
				{ name: "dialog" },
				{ name: "gridcell" },
				{ name: "link" },
				{ name: "log" },
				{ name: "marquee" },
				{ name: "menuitem" },
				{ name: "menuitemcheckbox" },
				{ name: "menuitemradio" },
				{ name: "option" },
				{ name: "progressbar" },
				{ name: "radio" },
				{ name: "scrollbar" },
				{ name: "searchbox" },
				{ name: "slider" },
				{ name: "spinbutton" },
				{ name: "status" },
				{ name: "switch" },
				{ name: "tab" },
				{ name: "tabpanel" },
				{ name: "textbox" },
				{ name: "timer" },
				{ name: "tooltip" },
				{ name: "treeitem" },
				{ name: "combobox" },
				{ name: "grid" },
				{ name: "listbox" },
				{ name: "menu" },
				{ name: "menubar" },
				{ name: "radiogroup" },
				{ name: "tablist" },
				{ name: "tree" },
				{ name: "treegrid" },
				{ name: "application" },
				{ name: "article" },
				{ name: "cell" },
				{ name: "columnheader" },
				{ name: "definition" },
				{ name: "directory" },
				{ name: "document" },
				{ name: "feed" },
				{ name: "figure" },
				{ name: "group" },
				{ name: "heading" },
				{ name: "img" },
				{ name: "list" },
				{ name: "listitem" },
				{ name: "math" },
				{ name: "none" },
				{ name: "note" },
				{ name: "presentation" },
				{ name: "region" },
				{ name: "row" },
				{ name: "rowgroup" },
				{ name: "rowheader" },
				{ name: "separator" },
				{ name: "table" },
				{ name: "term" },
				{ name: "text" },
				{ name: "toolbar" },
				{ name: "banner" },
				{ name: "complementary" },
				{ name: "contentinfo" },
				{ name: "form" },
				{ name: "main" },
				{ name: "navigation" },
				{ name: "region" },
				{ name: "search" },
				{ name: "doc-abstract" },
				{ name: "doc-acknowledgments" },
				{ name: "doc-afterword" },
				{ name: "doc-appendix" },
				{ name: "doc-backlink" },
				{ name: "doc-biblioentry" },
				{ name: "doc-bibliography" },
				{ name: "doc-biblioref" },
				{ name: "doc-chapter" },
				{ name: "doc-colophon" },
				{ name: "doc-conclusion" },
				{ name: "doc-cover" },
				{ name: "doc-credit" },
				{ name: "doc-credits" },
				{ name: "doc-dedication" },
				{ name: "doc-endnote" },
				{ name: "doc-endnotes" },
				{ name: "doc-epigraph" },
				{ name: "doc-epilogue" },
				{ name: "doc-errata" },
				{ name: "doc-example" },
				{ name: "doc-footnote" },
				{ name: "doc-foreword" },
				{ name: "doc-glossary" },
				{ name: "doc-glossref" },
				{ name: "doc-index" },
				{ name: "doc-introduction" },
				{ name: "doc-noteref" },
				{ name: "doc-notice" },
				{ name: "doc-pagebreak" },
				{ name: "doc-pagelist" },
				{ name: "doc-part" },
				{ name: "doc-preface" },
				{ name: "doc-prologue" },
				{ name: "doc-pullquote" },
				{ name: "doc-qna" },
				{ name: "doc-subtitle" },
				{ name: "doc-tip" },
				{ name: "doc-toc" }
			]
		},
		{
			name: "metanames",
			values: [
				{ name: "application-name" },
				{ name: "author" },
				{ name: "description" },
				{ name: "format-detection" },
				{ name: "generator" },
				{ name: "keywords" },
				{ name: "publisher" },
				{ name: "referrer" },
				{ name: "robots" },
				{ name: "theme-color" },
				{ name: "viewport" }
			]
		},
		{
			name: "haspopup",
			values: [
				{
					name: "false",
					description: {
						kind: "markdown",
						value: "(default) Indicates the element does not have a popup."
					}
				},
				{
					name: "true",
					description: {
						kind: "markdown",
						value: "Indicates the popup is a menu."
					}
				},
				{
					name: "menu",
					description: {
						kind: "markdown",
						value: "Indicates the popup is a menu."
					}
				},
				{
					name: "listbox",
					description: {
						kind: "markdown",
						value: "Indicates the popup is a listbox."
					}
				},
				{
					name: "tree",
					description: {
						kind: "markdown",
						value: "Indicates the popup is a tree."
					}
				},
				{
					name: "grid",
					description: {
						kind: "markdown",
						value: "Indicates the popup is a grid."
					}
				},
				{
					name: "dialog",
					description: {
						kind: "markdown",
						value: "Indicates the popup is a dialog."
					}
				}
			]
		},
		{
			name: "decoding",
			values: [
				{ name: "sync" },
				{ name: "async" },
				{ name: "auto" }
			]
		},
		{
			name: "loading",
			values: [{
				name: "eager",
				description: {
					kind: "markdown",
					value: "Loads the image immediately, regardless of whether or not the image is currently within the visible viewport (this is the default value)."
				}
			}, {
				name: "lazy",
				description: {
					kind: "markdown",
					value: "Defers loading the image until it reaches a calculated distance from the viewport, as defined by the browser. The intent is to avoid the network and storage bandwidth needed to handle the image until it's reasonably certain that it will be needed. This generally improves the performance of the content in most typical use cases."
				}
			}]
		},
		{
			name: "referrerpolicy",
			values: [
				{ name: "no-referrer" },
				{ name: "no-referrer-when-downgrade" },
				{ name: "origin" },
				{ name: "origin-when-cross-origin" },
				{ name: "same-origin" },
				{ name: "strict-origin" },
				{ name: "strict-origin-when-cross-origin" },
				{ name: "unsafe-url" }
			]
		}
	]
};
var Wu = class {
	constructor(e) {
		this.dataProviders = [], this.setDataProviders(e.useDefaultDataProvider !== !1, e.customDataProviders || []);
	}
	setDataProviders(e, t) {
		this.dataProviders = [], e && this.dataProviders.push(new po("html5", Du)), this.dataProviders.push(...t);
	}
	getDataProviders() {
		return this.dataProviders;
	}
	isVoidElement(e, t) {
		return !!e && $h(t, e.toLowerCase(), (n, r) => n.localeCompare(r)) >= 0;
	}
	getVoidElements(e) {
		const t = Array.isArray(e) ? e : this.getDataProviders().filter((r) => r.isApplicable(e)), n = [];
		return t.forEach((r) => {
			r.provideTags().filter((i) => i.void).forEach((i) => n.push(i.name));
		}), n.sort();
	}
	isPathAttribute(e, t) {
		if (t === "src" || t === "href") return !0;
		const n = Pu[e];
		return n ? typeof n == "string" ? n === t : n.indexOf(t) !== -1 : !1;
	}
};
const Pu = {
	a: "href",
	area: "href",
	body: "background",
	blockquote: "cite",
	del: "cite",
	form: "action",
	frame: ["src", "longdesc"],
	img: ["src", "longdesc"],
	ins: "cite",
	link: "href",
	object: "data",
	q: "cite",
	script: "src",
	audio: "src",
	button: "formaction",
	command: "icon",
	embed: "src",
	html: "manifest",
	input: ["src", "formaction"],
	source: "src",
	track: "src",
	video: ["src", "poster"]
}, qu = {};
function Ou(e = qu) {
	const t = new Wu(e), n = new mu(e, t), r = new cu(e, t), i = new Gh(t), s = new Uu(i), a = new Hu(t), o = new Ru(t);
	return {
		setDataProviders: t.setDataProviders.bind(t),
		createScanner: ge,
		parseHTMLDocument: i.parseDocument.bind(i),
		doComplete: r.doComplete.bind(r),
		doComplete2: r.doComplete2.bind(r),
		setCompletionParticipants: r.setCompletionParticipants.bind(r),
		doHover: n.doHover.bind(n),
		format: wu,
		findDocumentHighlights: Mu,
		findDocumentLinks: o.findDocumentLinks.bind(o),
		findDocumentSymbols: Eu,
		findDocumentSymbols2: _o,
		getFoldingRanges: a.getFoldingRanges.bind(a),
		getSelectionRanges: s.getSelectionRanges.bind(s),
		doQuoteComplete: r.doQuoteComplete.bind(r),
		doTagComplete: r.doTagComplete.bind(r),
		doRename: Cu,
		findMatchingTagPosition: zu,
		findOnTypeRenameRanges: Aa,
		findLinkedEditingRanges: Aa
	};
}
function Fu(e, t) {
	return new po(e, t);
}
var Bu = class {
	constructor(e, t) {
		this._ctx = e, this._languageSettings = t.languageSettings, this._languageId = t.languageId;
		const n = this._languageSettings.data, r = n?.useDefaultDataProvider, i = [];
		if (n?.dataProviders) for (const s in n.dataProviders) i.push(Fu(s, n.dataProviders[s]));
		this._languageService = Ou({
			useDefaultDataProvider: r,
			customDataProviders: i
		});
	}
	async doComplete(e, t) {
		let n = this._getTextDocument(e);
		if (!n) return null;
		let r = this._languageService.parseHTMLDocument(n);
		return Promise.resolve(this._languageService.doComplete(n, t, r, this._languageSettings && this._languageSettings.suggest));
	}
	async format(e, t, n) {
		let r = this._getTextDocument(e);
		if (!r) return [];
		let i = {
			...this._languageSettings.format,
			...n
		}, s = this._languageService.format(r, t, i);
		return Promise.resolve(s);
	}
	async doHover(e, t) {
		let n = this._getTextDocument(e);
		if (!n) return null;
		let r = this._languageService.parseHTMLDocument(n), i = this._languageService.doHover(n, t, r);
		return Promise.resolve(i);
	}
	async findDocumentHighlights(e, t) {
		let n = this._getTextDocument(e);
		if (!n) return [];
		let r = this._languageService.parseHTMLDocument(n), i = this._languageService.findDocumentHighlights(n, t, r);
		return Promise.resolve(i);
	}
	async findDocumentLinks(e) {
		let t = this._getTextDocument(e);
		if (!t) return [];
		let n = this._languageService.findDocumentLinks(t, null);
		return Promise.resolve(n);
	}
	async findDocumentSymbols(e) {
		let t = this._getTextDocument(e);
		if (!t) return [];
		let n = this._languageService.parseHTMLDocument(t), r = this._languageService.findDocumentSymbols(t, n);
		return Promise.resolve(r);
	}
	async getFoldingRanges(e, t) {
		let n = this._getTextDocument(e);
		if (!n) return [];
		let r = this._languageService.getFoldingRanges(n, t);
		return Promise.resolve(r);
	}
	async getSelectionRanges(e, t) {
		let n = this._getTextDocument(e);
		if (!n) return [];
		let r = this._languageService.getSelectionRanges(n, t);
		return Promise.resolve(r);
	}
	async doRename(e, t, n) {
		let r = this._getTextDocument(e);
		if (!r) return null;
		let i = this._languageService.parseHTMLDocument(r), s = this._languageService.doRename(r, t, n, i);
		return Promise.resolve(s);
	}
	_getTextDocument(e) {
		let t = this._ctx.getMirrorModels();
		for (let n of t) if (n.uri.toString() === e) return wi.create(e, this._languageId, n.version, n.getValue());
		return null;
	}
};
self.onmessage = () => {
	Nh((e, t) => new Bu(e, t));
};

//# sourceMappingURL=html.worker-CTPeHKOR.js.map