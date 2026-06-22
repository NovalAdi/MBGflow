var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-GcTBYS/strip-cf-connecting-ip-header.js
var require_strip_cf_connecting_ip_header = __commonJS({
  ".wrangler/tmp/bundle-GcTBYS/strip-cf-connecting-ip-header.js"() {
    function stripCfConnectingIPHeader(input, init) {
      const request = new Request(input, init);
      request.headers.delete("CF-Connecting-IP");
      return request;
    }
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var import_strip_cf_connecting_ip_header;
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    import_strip_cf_connecting_ip_header = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var import_strip_cf_connecting_ip_header2, _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    import_strip_cf_connecting_ip_header2 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var import_strip_cf_connecting_ip_header3;
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    import_strip_cf_connecting_ip_header3 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var import_strip_cf_connecting_ip_header4, noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    import_strip_cf_connecting_ip_header4 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var import_strip_cf_connecting_ip_header5, _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    import_strip_cf_connecting_ip_header5 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var import_strip_cf_connecting_ip_header6, workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    import_strip_cf_connecting_ip_header6 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var import_strip_cf_connecting_ip_header7, hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    import_strip_cf_connecting_ip_header7 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var import_strip_cf_connecting_ip_header8, ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    import_strip_cf_connecting_ip_header8 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var import_strip_cf_connecting_ip_header9, WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    import_strip_cf_connecting_ip_header9 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var import_strip_cf_connecting_ip_header10;
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    import_strip_cf_connecting_ip_header10 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var import_strip_cf_connecting_ip_header11, Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    import_strip_cf_connecting_ip_header11 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var import_strip_cf_connecting_ip_header12, globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    import_strip_cf_connecting_ip_header12 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var import_strip_cf_connecting_ip_header13;
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    import_strip_cf_connecting_ip_header13 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/hono/dist/cjs/compose.js
var require_compose = __commonJS({
  "node_modules/hono/dist/cjs/compose.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var compose_exports = {};
    __export(compose_exports, {
      compose: () => compose
    });
    module.exports = __toCommonJS(compose_exports);
    var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
      return (context2, next) => {
        let index = -1;
        return dispatch(0);
        async function dispatch(i) {
          if (i <= index) {
            throw new Error("next() called multiple times");
          }
          index = i;
          let res;
          let isError2 = false;
          let handler;
          if (middleware[i]) {
            handler = middleware[i][0][0];
            context2.req.routeIndex = i;
          } else {
            handler = i === middleware.length && next || void 0;
          }
          if (handler) {
            try {
              res = await handler(context2, () => dispatch(i + 1));
            } catch (err) {
              if (err instanceof Error && onError) {
                context2.error = err;
                res = await onError(err, context2);
                isError2 = true;
              } else {
                throw err;
              }
            }
          } else {
            if (context2.finalized === false && onNotFound) {
              res = await onNotFound(context2);
            }
          }
          if (res && (context2.finalized === false || isError2)) {
            context2.res = res;
          }
          return context2;
        }
        __name(dispatch, "dispatch");
      };
    }, "compose");
  }
});

// node_modules/hono/dist/cjs/http-exception.js
var require_http_exception = __commonJS({
  "node_modules/hono/dist/cjs/http-exception.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var http_exception_exports = {};
    __export(http_exception_exports, {
      HTTPException: () => HTTPException
    });
    module.exports = __toCommonJS(http_exception_exports);
    var HTTPException = class extends Error {
      res;
      status;
      /**
       * Creates an instance of `HTTPException`.
       * @param status - HTTP status code for the exception. Defaults to 500.
       * @param options - Additional options for the exception.
       */
      constructor(status = 500, options) {
        super(options?.message, { cause: options?.cause });
        this.res = options?.res;
        this.status = status;
      }
      /**
       * Returns the response object associated with the exception.
       * If a response object is not provided, a new response is created with the error message and status code.
       * @returns The response object.
       */
      getResponse() {
        if (this.res) {
          const newResponse = new Response(this.res.body, {
            status: this.status,
            headers: this.res.headers
          });
          return newResponse;
        }
        return new Response(this.message, {
          status: this.status
        });
      }
    };
    __name(HTTPException, "HTTPException");
  }
});

// node_modules/hono/dist/cjs/request/constants.js
var require_constants = __commonJS({
  "node_modules/hono/dist/cjs/request/constants.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var constants_exports = {};
    __export(constants_exports, {
      GET_MATCH_RESULT: () => GET_MATCH_RESULT
    });
    module.exports = __toCommonJS(constants_exports);
    var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
  }
});

// node_modules/hono/dist/cjs/utils/body.js
var require_body = __commonJS({
  "node_modules/hono/dist/cjs/utils/body.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var body_exports = {};
    __export(body_exports, {
      parseBody: () => parseBody
    });
    module.exports = __toCommonJS(body_exports);
    var import_request = require_request();
    var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
      const { all = false, dot = false } = options;
      const headers = request instanceof import_request.HonoRequest ? request.raw.headers : request.headers;
      const contentType = headers.get("Content-Type");
      if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
        return parseFormData(request, { all, dot });
      }
      return {};
    }, "parseBody");
    async function parseFormData(request, options) {
      const formData = await request.formData();
      if (formData) {
        return convertFormDataToBodyData(formData, options);
      }
      return {};
    }
    __name(parseFormData, "parseFormData");
    function convertFormDataToBodyData(formData, options) {
      const form = /* @__PURE__ */ Object.create(null);
      formData.forEach((value, key) => {
        const shouldParseAllValues = options.all || key.endsWith("[]");
        if (!shouldParseAllValues) {
          form[key] = value;
        } else {
          handleParsingAllValues(form, key, value);
        }
      });
      if (options.dot) {
        Object.entries(form).forEach(([key, value]) => {
          const shouldParseDotValues = key.includes(".");
          if (shouldParseDotValues) {
            handleParsingNestedValues(form, key, value);
            delete form[key];
          }
        });
      }
      return form;
    }
    __name(convertFormDataToBodyData, "convertFormDataToBodyData");
    var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
      if (form[key] !== void 0) {
        if (Array.isArray(form[key])) {
          ;
          form[key].push(value);
        } else {
          form[key] = [form[key], value];
        }
      } else {
        if (!key.endsWith("[]")) {
          form[key] = value;
        } else {
          form[key] = [value];
        }
      }
    }, "handleParsingAllValues");
    var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
      if (/(?:^|\.)__proto__\./.test(key)) {
        return;
      }
      let nestedForm = form;
      const keys = key.split(".");
      keys.forEach((key2, index) => {
        if (index === keys.length - 1) {
          nestedForm[key2] = value;
        } else {
          if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
            nestedForm[key2] = /* @__PURE__ */ Object.create(null);
          }
          nestedForm = nestedForm[key2];
        }
      });
    }, "handleParsingNestedValues");
  }
});

// node_modules/hono/dist/cjs/utils/url.js
var require_url = __commonJS({
  "node_modules/hono/dist/cjs/utils/url.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var url_exports = {};
    __export(url_exports, {
      checkOptionalParameter: () => checkOptionalParameter,
      decodeURIComponent_: () => decodeURIComponent_,
      getPath: () => getPath,
      getPathNoStrict: () => getPathNoStrict,
      getPattern: () => getPattern,
      getQueryParam: () => getQueryParam,
      getQueryParams: () => getQueryParams,
      getQueryStrings: () => getQueryStrings,
      mergePath: () => mergePath,
      splitPath: () => splitPath,
      splitRoutingPath: () => splitRoutingPath,
      tryDecode: () => tryDecode,
      tryDecodeURI: () => tryDecodeURI
    });
    module.exports = __toCommonJS(url_exports);
    var splitPath = /* @__PURE__ */ __name((path) => {
      const paths = path.split("/");
      if (paths[0] === "") {
        paths.shift();
      }
      return paths;
    }, "splitPath");
    var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
      const { groups, path } = extractGroupsFromPath(routePath);
      const paths = splitPath(path);
      return replaceGroupMarks(paths, groups);
    }, "splitRoutingPath");
    var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
      const groups = [];
      path = path.replace(/\{[^}]+\}/g, (match, index) => {
        const mark = `@${index}`;
        groups.push([mark, match]);
        return mark;
      });
      return { groups, path };
    }, "extractGroupsFromPath");
    var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
      for (let i = groups.length - 1; i >= 0; i--) {
        const [mark] = groups[i];
        for (let j = paths.length - 1; j >= 0; j--) {
          if (paths[j].includes(mark)) {
            paths[j] = paths[j].replace(mark, groups[i][1]);
            break;
          }
        }
      }
      return paths;
    }, "replaceGroupMarks");
    var patternCache = {};
    var getPattern = /* @__PURE__ */ __name((label, next) => {
      if (label === "*") {
        return "*";
      }
      const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      if (match) {
        const cacheKey = `${label}#${next}`;
        if (!patternCache[cacheKey]) {
          if (match[2]) {
            patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
          } else {
            patternCache[cacheKey] = [label, match[1], true];
          }
        }
        return patternCache[cacheKey];
      }
      return null;
    }, "getPattern");
    var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
      try {
        return decoder(str);
      } catch {
        return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
          try {
            return decoder(match);
          } catch {
            return match;
          }
        });
      }
    }, "tryDecode");
    var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
    var getPath = /* @__PURE__ */ __name((request) => {
      const url = request.url;
      const start = url.indexOf("/", url.indexOf(":") + 4);
      let i = start;
      for (; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        if (charCode === 37) {
          const queryIndex = url.indexOf("?", i);
          const hashIndex = url.indexOf("#", i);
          const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
          const path = url.slice(start, end);
          return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
        } else if (charCode === 63 || charCode === 35) {
          break;
        }
      }
      return url.slice(start, i);
    }, "getPath");
    var getQueryStrings = /* @__PURE__ */ __name((url) => {
      const queryIndex = url.indexOf("?", 8);
      return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
    }, "getQueryStrings");
    var getPathNoStrict = /* @__PURE__ */ __name((request) => {
      const result = getPath(request);
      return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
    }, "getPathNoStrict");
    var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
      if (rest.length) {
        sub = mergePath(sub, ...rest);
      }
      return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
    }, "mergePath");
    var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
      if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
        return null;
      }
      const segments = path.split("/");
      const results = [];
      let basePath = "";
      segments.forEach((segment) => {
        if (segment !== "" && !/\:/.test(segment)) {
          basePath += "/" + segment;
        } else if (/\:/.test(segment)) {
          if (/\?/.test(segment)) {
            if (results.length === 0 && basePath === "") {
              results.push("/");
            } else {
              results.push(basePath);
            }
            const optionalSegment = segment.replace("?", "");
            basePath += "/" + optionalSegment;
            results.push(basePath);
          } else {
            basePath += "/" + segment;
          }
        }
      });
      return results.filter((v, i, a) => a.indexOf(v) === i);
    }, "checkOptionalParameter");
    var _decodeURI = /* @__PURE__ */ __name((value) => {
      if (!/[%+]/.test(value)) {
        return value;
      }
      if (value.indexOf("+") !== -1) {
        value = value.replace(/\+/g, " ");
      }
      return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
    }, "_decodeURI");
    var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
      let encoded;
      if (!multiple && key && !/[%+]/.test(key)) {
        let keyIndex2 = url.indexOf("?", 8);
        if (keyIndex2 === -1) {
          return void 0;
        }
        if (!url.startsWith(key, keyIndex2 + 1)) {
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        while (keyIndex2 !== -1) {
          const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
          if (trailingKeyCode === 61) {
            const valueIndex = keyIndex2 + key.length + 2;
            const endIndex = url.indexOf("&", valueIndex);
            return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
          } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
            return "";
          }
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        encoded = /[%+]/.test(url);
        if (!encoded) {
          return void 0;
        }
      }
      const results = {};
      encoded ??= /[%+]/.test(url);
      let keyIndex = url.indexOf("?", 8);
      while (keyIndex !== -1) {
        const nextKeyIndex = url.indexOf("&", keyIndex + 1);
        let valueIndex = url.indexOf("=", keyIndex);
        if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
          valueIndex = -1;
        }
        let name = url.slice(
          keyIndex + 1,
          valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
        );
        if (encoded) {
          name = _decodeURI(name);
        }
        keyIndex = nextKeyIndex;
        if (name === "") {
          continue;
        }
        let value;
        if (valueIndex === -1) {
          value = "";
        } else {
          value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
          if (encoded) {
            value = _decodeURI(value);
          }
        }
        if (multiple) {
          if (!(results[name] && Array.isArray(results[name]))) {
            results[name] = [];
          }
          ;
          results[name].push(value);
        } else {
          results[name] ??= value;
        }
      }
      return key ? results[key] : results;
    }, "_getQueryParam");
    var getQueryParam = _getQueryParam;
    var getQueryParams = /* @__PURE__ */ __name((url, key) => {
      return _getQueryParam(url, key, true);
    }, "getQueryParams");
    var decodeURIComponent_ = decodeURIComponent;
  }
});

// node_modules/hono/dist/cjs/request.js
var require_request = __commonJS({
  "node_modules/hono/dist/cjs/request.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var request_exports = {};
    __export(request_exports, {
      HonoRequest: () => HonoRequest,
      cloneRawRequest: () => cloneRawRequest
    });
    module.exports = __toCommonJS(request_exports);
    var import_http_exception = require_http_exception();
    var import_constants2 = require_constants();
    var import_body = require_body();
    var import_url = require_url();
    var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => (0, import_url.tryDecode)(str, import_url.decodeURIComponent_), "tryDecodeURIComponent");
    var HonoRequest = class {
      /**
       * `.raw` can get the raw Request object.
       *
       * @see {@link https://hono.dev/docs/api/request#raw}
       *
       * @example
       * ```ts
       * // For Cloudflare Workers
       * app.post('/', async (c) => {
       *   const metadata = c.req.raw.cf?.hostMetadata?
       *   ...
       * })
       * ```
       */
      raw;
      #validatedData;
      // Short name of validatedData
      #matchResult;
      routeIndex = 0;
      /**
       * `.path` can get the pathname of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#path}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const pathname = c.req.path // `/about/me`
       * })
       * ```
       */
      path;
      bodyCache = {};
      constructor(request, path = "/", matchResult = [[]]) {
        this.raw = request;
        this.path = path;
        this.#matchResult = matchResult;
        this.#validatedData = {};
      }
      param(key) {
        return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
      }
      #getDecodedParam(key) {
        const paramKey = this.#matchResult[0][this.routeIndex][1][key];
        const param = this.#getParamValue(paramKey);
        return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
      }
      #getAllDecodedParams() {
        const decoded = {};
        const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
        for (const key of keys) {
          const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
          if (value !== void 0) {
            decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
          }
        }
        return decoded;
      }
      #getParamValue(paramKey) {
        return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
      }
      query(key) {
        return (0, import_url.getQueryParam)(this.url, key);
      }
      queries(key) {
        return (0, import_url.getQueryParams)(this.url, key);
      }
      header(name) {
        if (name) {
          return this.raw.headers.get(name) ?? void 0;
        }
        const headerData = {};
        this.raw.headers.forEach((value, key) => {
          headerData[key] = value;
        });
        return headerData;
      }
      async parseBody(options) {
        return (0, import_body.parseBody)(this, options);
      }
      #cachedBody = (key) => {
        const { bodyCache, raw } = this;
        const cachedBody = bodyCache[key];
        if (cachedBody) {
          return cachedBody;
        }
        const anyCachedKey = Object.keys(bodyCache)[0];
        if (anyCachedKey) {
          return bodyCache[anyCachedKey].then((body) => {
            if (anyCachedKey === "json") {
              body = JSON.stringify(body);
            }
            return new Response(body)[key]();
          });
        }
        return bodyCache[key] = raw[key]();
      };
      /**
       * `.json()` can parse Request body of type `application/json`
       *
       * @see {@link https://hono.dev/docs/api/request#json}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.json()
       * })
       * ```
       */
      json() {
        return this.#cachedBody("text").then((text) => JSON.parse(text));
      }
      /**
       * `.text()` can parse Request body of type `text/plain`
       *
       * @see {@link https://hono.dev/docs/api/request#text}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.text()
       * })
       * ```
       */
      text() {
        return this.#cachedBody("text");
      }
      /**
       * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
       *
       * @see {@link https://hono.dev/docs/api/request#arraybuffer}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.arrayBuffer()
       * })
       * ```
       */
      arrayBuffer() {
        return this.#cachedBody("arrayBuffer");
      }
      /**
       * `.bytes()` parses the request body as a `Uint8Array`.
       *
       * @see {@link https://hono.dev/docs/api/request#bytes}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.bytes()
       * })
       * ```
       */
      bytes() {
        return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
      }
      /**
       * Parses the request body as a `Blob`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.blob();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#blob
       */
      blob() {
        return this.#cachedBody("blob");
      }
      /**
       * Parses the request body as `FormData`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.formData();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#formdata
       */
      formData() {
        return this.#cachedBody("formData");
      }
      /**
       * Adds validated data to the request.
       *
       * @param target - The target of the validation.
       * @param data - The validated data to add.
       */
      addValidatedData(target, data) {
        this.#validatedData[target] = data;
      }
      valid(target) {
        return this.#validatedData[target];
      }
      /**
       * `.url()` can get the request url strings.
       *
       * @see {@link https://hono.dev/docs/api/request#url}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const url = c.req.url // `http://localhost:8787/about/me`
       *   ...
       * })
       * ```
       */
      get url() {
        return this.raw.url;
      }
      /**
       * `.method()` can get the method name of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#method}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const method = c.req.method // `GET`
       * })
       * ```
       */
      get method() {
        return this.raw.method;
      }
      get [import_constants2.GET_MATCH_RESULT]() {
        return this.#matchResult;
      }
      /**
       * `.matchedRoutes()` can return a matched route in the handler
       *
       * @deprecated
       *
       * Use matchedRoutes helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#matchedroutes}
       *
       * @example
       * ```ts
       * app.use('*', async function logger(c, next) {
       *   await next()
       *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
       *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
       *     console.log(
       *       method,
       *       ' ',
       *       path,
       *       ' '.repeat(Math.max(10 - path.length, 0)),
       *       name,
       *       i === c.req.routeIndex ? '<- respond from here' : ''
       *     )
       *   })
       * })
       * ```
       */
      get matchedRoutes() {
        return this.#matchResult[0].map(([[, route]]) => route);
      }
      /**
       * `routePath()` can retrieve the path registered within the handler
       *
       * @deprecated
       *
       * Use routePath helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#routepath}
       *
       * @example
       * ```ts
       * app.get('/posts/:id', (c) => {
       *   return c.json({ path: c.req.routePath })
       * })
       * ```
       */
      get routePath() {
        return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
      }
    };
    __name(HonoRequest, "HonoRequest");
    var cloneRawRequest = /* @__PURE__ */ __name(async (req) => {
      if (!req.raw.bodyUsed) {
        return req.raw.clone();
      }
      const cacheKey = Object.keys(req.bodyCache)[0];
      if (!cacheKey) {
        throw new import_http_exception.HTTPException(500, {
          message: "Cannot clone request: body was already consumed and not cached. Please use HonoRequest methods (e.g., req.json(), req.text()) instead of consuming req.raw directly."
        });
      }
      const requestInit = {
        body: await req[cacheKey](),
        cache: req.raw.cache,
        credentials: req.raw.credentials,
        headers: req.header(),
        integrity: req.raw.integrity,
        keepalive: req.raw.keepalive,
        method: req.method,
        mode: req.raw.mode,
        redirect: req.raw.redirect,
        referrer: req.raw.referrer,
        referrerPolicy: req.raw.referrerPolicy,
        signal: req.raw.signal
      };
      return new Request(req.url, requestInit);
    }, "cloneRawRequest");
  }
});

// node_modules/hono/dist/cjs/utils/html.js
var require_html = __commonJS({
  "node_modules/hono/dist/cjs/utils/html.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var html_exports = {};
    __export(html_exports, {
      HtmlEscapedCallbackPhase: () => HtmlEscapedCallbackPhase,
      escapeToBuffer: () => escapeToBuffer,
      raw: () => raw,
      resolveCallback: () => resolveCallback,
      resolveCallbackSync: () => resolveCallbackSync,
      stringBufferToString: () => stringBufferToString
    });
    module.exports = __toCommonJS(html_exports);
    var HtmlEscapedCallbackPhase = {
      Stringify: 1,
      BeforeStream: 2,
      Stream: 3
    };
    var raw = /* @__PURE__ */ __name((value, callbacks) => {
      const escapedString = new String(value);
      escapedString.isEscaped = true;
      escapedString.callbacks = callbacks;
      return escapedString;
    }, "raw");
    var escapeRe = /[&<>'"]/;
    var stringBufferToString = /* @__PURE__ */ __name(async (buffer, callbacks) => {
      let str = "";
      callbacks ||= [];
      const resolvedBuffer = await Promise.all(buffer);
      for (let i = resolvedBuffer.length - 1; ; i--) {
        str += resolvedBuffer[i];
        i--;
        if (i < 0) {
          break;
        }
        let r = resolvedBuffer[i];
        if (typeof r === "object") {
          callbacks.push(...r.callbacks || []);
        }
        const isEscaped = r.isEscaped;
        r = await (typeof r === "object" ? r.toString() : r);
        if (typeof r === "object") {
          callbacks.push(...r.callbacks || []);
        }
        if (r.isEscaped ?? isEscaped) {
          str += r;
        } else {
          const buf = [str];
          escapeToBuffer(r, buf);
          str = buf[0];
        }
      }
      return raw(str, callbacks);
    }, "stringBufferToString");
    var escapeToBuffer = /* @__PURE__ */ __name((str, buffer) => {
      const match = str.search(escapeRe);
      if (match === -1) {
        buffer[0] += str;
        return;
      }
      let escape;
      let index;
      let lastIndex = 0;
      for (index = match; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            escape = "&quot;";
            break;
          case 39:
            escape = "&#39;";
            break;
          case 38:
            escape = "&amp;";
            break;
          case 60:
            escape = "&lt;";
            break;
          case 62:
            escape = "&gt;";
            break;
          default:
            continue;
        }
        buffer[0] += str.substring(lastIndex, index) + escape;
        lastIndex = index + 1;
      }
      buffer[0] += str.substring(lastIndex, index);
    }, "escapeToBuffer");
    var resolveCallbackSync = /* @__PURE__ */ __name((str) => {
      const callbacks = str.callbacks;
      if (!callbacks?.length) {
        return str;
      }
      const buffer = [str];
      const context2 = {};
      callbacks.forEach((c) => c({ phase: HtmlEscapedCallbackPhase.Stringify, buffer, context: context2 }));
      return buffer[0];
    }, "resolveCallbackSync");
    var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
      if (typeof str === "object" && !(str instanceof String)) {
        if (!(str instanceof Promise)) {
          str = str.toString();
        }
        if (str instanceof Promise) {
          str = await str;
        }
      }
      const callbacks = str.callbacks;
      if (!callbacks?.length) {
        return Promise.resolve(str);
      }
      if (buffer) {
        buffer[0] += str;
      } else {
        buffer = [str];
      }
      const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
        (res) => Promise.all(
          res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
        ).then(() => buffer[0])
      );
      if (preserveCallbacks) {
        return raw(await resStr, callbacks);
      } else {
        return resStr;
      }
    }, "resolveCallback");
  }
});

// node_modules/hono/dist/cjs/context.js
var require_context = __commonJS({
  "node_modules/hono/dist/cjs/context.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var context_exports = {};
    __export(context_exports, {
      Context: () => Context2,
      TEXT_PLAIN: () => TEXT_PLAIN
    });
    module.exports = __toCommonJS(context_exports);
    var import_request = require_request();
    var import_html = require_html();
    var TEXT_PLAIN = "text/plain; charset=UTF-8";
    var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
      return {
        "Content-Type": contentType,
        ...headers
      };
    }, "setDefaultContentType");
    var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
    var Context2 = class {
      #rawRequest;
      #req;
      /**
       * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
       *
       * @see {@link https://hono.dev/docs/api/context#env}
       *
       * @example
       * ```ts
       * // Environment object for Cloudflare Workers
       * app.get('*', async c => {
       *   const counter = c.env.COUNTER
       * })
       * ```
       */
      env = {};
      #var;
      finalized = false;
      /**
       * `.error` can get the error object from the middleware if the Handler throws an error.
       *
       * @see {@link https://hono.dev/docs/api/context#error}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   await next()
       *   if (c.error) {
       *     // do something...
       *   }
       * })
       * ```
       */
      error;
      #status;
      #executionCtx;
      #res;
      #layout;
      #renderer;
      #notFoundHandler;
      #preparedHeaders;
      #matchResult;
      #path;
      /**
       * Creates an instance of the Context class.
       *
       * @param req - The Request object.
       * @param options - Optional configuration options for the context.
       */
      constructor(req, options) {
        this.#rawRequest = req;
        if (options) {
          this.#executionCtx = options.executionCtx;
          this.env = options.env;
          this.#notFoundHandler = options.notFoundHandler;
          this.#path = options.path;
          this.#matchResult = options.matchResult;
        }
      }
      /**
       * `.req` is the instance of {@link HonoRequest}.
       */
      get req() {
        this.#req ??= new import_request.HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
        return this.#req;
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#event}
       * The FetchEvent associated with the current request.
       *
       * @throws Will throw an error if the context does not have a FetchEvent.
       */
      get event() {
        if (this.#executionCtx && "respondWith" in this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no FetchEvent");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#executionctx}
       * The ExecutionContext associated with the current request.
       *
       * @throws Will throw an error if the context does not have an ExecutionContext.
       */
      get executionCtx() {
        if (this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no ExecutionContext");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#res}
       * The Response object for the current request.
       */
      get res() {
        return this.#res ||= createResponseInstance(null, {
          headers: this.#preparedHeaders ??= new Headers()
        });
      }
      /**
       * Sets the Response object for the current request.
       *
       * @param _res - The Response object to set.
       */
      set res(_res) {
        if (this.#res && _res) {
          _res = createResponseInstance(_res.body, _res);
          for (const [k, v] of this.#res.headers.entries()) {
            if (k === "content-type") {
              continue;
            }
            if (k === "set-cookie") {
              const cookies = this.#res.headers.getSetCookie();
              _res.headers.delete("set-cookie");
              for (const cookie of cookies) {
                _res.headers.append("set-cookie", cookie);
              }
            } else {
              _res.headers.set(k, v);
            }
          }
        }
        this.#res = _res;
        this.finalized = true;
      }
      /**
       * `.render()` can create a response within a layout.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   return c.render('Hello!')
       * })
       * ```
       */
      render = (...args) => {
        this.#renderer ??= (content) => this.html(content);
        return this.#renderer(...args);
      };
      /**
       * Sets the layout for the response.
       *
       * @param layout - The layout to set.
       * @returns The layout function.
       */
      setLayout = (layout) => this.#layout = layout;
      /**
       * Gets the current layout for the response.
       *
       * @returns The current layout function.
       */
      getLayout = () => this.#layout;
      /**
       * `.setRenderer()` can set the layout in the custom middleware.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```tsx
       * app.use('*', async (c, next) => {
       *   c.setRenderer((content) => {
       *     return c.html(
       *       <html>
       *         <body>
       *           <p>{content}</p>
       *         </body>
       *       </html>
       *     )
       *   })
       *   await next()
       * })
       * ```
       */
      setRenderer = (renderer) => {
        this.#renderer = renderer;
      };
      /**
       * `.header()` can set headers.
       *
       * @see {@link https://hono.dev/docs/api/context#header}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      header = (name, value, options) => {
        if (this.finalized) {
          this.#res = createResponseInstance(this.#res.body, this.#res);
        }
        const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
        if (value === void 0) {
          headers.delete(name);
        } else if (options?.append) {
          headers.append(name, value);
        } else {
          headers.set(name, value);
        }
      };
      status = (status) => {
        this.#status = status;
      };
      /**
       * `.set()` can set the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   c.set('message', 'Hono is hot!!')
       *   await next()
       * })
       * ```
       */
      set = (key, value) => {
        this.#var ??= /* @__PURE__ */ new Map();
        this.#var.set(key, value);
      };
      /**
       * `.get()` can use the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   const message = c.get('message')
       *   return c.text(`The message is "${message}"`)
       * })
       * ```
       */
      get = (key) => {
        return this.#var ? this.#var.get(key) : void 0;
      };
      /**
       * `.var` can access the value of a variable.
       *
       * @see {@link https://hono.dev/docs/api/context#var}
       *
       * @example
       * ```ts
       * const result = c.var.client.oneMethod()
       * ```
       */
      // c.var.propName is a read-only
      get var() {
        if (!this.#var) {
          return {};
        }
        return Object.fromEntries(this.#var);
      }
      #newResponse(data, arg, headers) {
        const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
        if (typeof arg === "object" && "headers" in arg) {
          const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
          for (const [key, value] of argHeaders) {
            if (key.toLowerCase() === "set-cookie") {
              responseHeaders.append(key, value);
            } else {
              responseHeaders.set(key, value);
            }
          }
        }
        if (headers) {
          for (const [k, v] of Object.entries(headers)) {
            if (typeof v === "string") {
              responseHeaders.set(k, v);
            } else {
              responseHeaders.delete(k);
              for (const v2 of v) {
                responseHeaders.append(k, v2);
              }
            }
          }
        }
        const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
        return createResponseInstance(data, { status, headers: responseHeaders });
      }
      newResponse = (...args) => this.#newResponse(...args);
      /**
       * `.body()` can return the HTTP response.
       * You can set headers with `.header()` and set HTTP status code with `.status`.
       * This can also be set in `.text()`, `.json()` and so on.
       *
       * @see {@link https://hono.dev/docs/api/context#body}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *   // Set HTTP status code
       *   c.status(201)
       *
       *   // Return the response body
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      body = (data, arg, headers) => this.#newResponse(data, arg, headers);
      /**
       * `.text()` can render text as `Content-Type:text/plain`.
       *
       * @see {@link https://hono.dev/docs/api/context#text}
       *
       * @example
       * ```ts
       * app.get('/say', (c) => {
       *   return c.text('Hello!')
       * })
       * ```
       */
      text = (text, arg, headers) => {
        return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
          text,
          arg,
          setDefaultContentType(TEXT_PLAIN, headers)
        );
      };
      /**
       * `.json()` can render JSON as `Content-Type:application/json`.
       *
       * @see {@link https://hono.dev/docs/api/context#json}
       *
       * @example
       * ```ts
       * app.get('/api', (c) => {
       *   return c.json({ message: 'Hello!' })
       * })
       * ```
       */
      json = (object, arg, headers) => {
        return this.#newResponse(
          JSON.stringify(object),
          arg,
          setDefaultContentType("application/json", headers)
        );
      };
      html = (html, arg, headers) => {
        const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
        return typeof html === "object" ? (0, import_html.resolveCallback)(html, import_html.HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
      };
      /**
       * `.redirect()` can Redirect, default status code is 302.
       *
       * @see {@link https://hono.dev/docs/api/context#redirect}
       *
       * @example
       * ```ts
       * app.get('/redirect', (c) => {
       *   return c.redirect('/')
       * })
       * app.get('/redirect-permanently', (c) => {
       *   return c.redirect('/', 301)
       * })
       * ```
       */
      redirect = (location, status) => {
        const locationString = String(location);
        this.header(
          "Location",
          // Multibyes should be encoded
          // eslint-disable-next-line no-control-regex
          !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
        );
        return this.newResponse(null, status ?? 302);
      };
      /**
       * `.notFound()` can return the Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/context#notfound}
       *
       * @example
       * ```ts
       * app.get('/notfound', (c) => {
       *   return c.notFound()
       * })
       * ```
       */
      notFound = () => {
        this.#notFoundHandler ??= () => createResponseInstance();
        return this.#notFoundHandler(this);
      };
    };
    __name(Context2, "Context");
  }
});

// node_modules/hono/dist/cjs/router.js
var require_router = __commonJS({
  "node_modules/hono/dist/cjs/router.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var router_exports = {};
    __export(router_exports, {
      MESSAGE_MATCHER_IS_ALREADY_BUILT: () => MESSAGE_MATCHER_IS_ALREADY_BUILT,
      METHODS: () => METHODS,
      METHOD_NAME_ALL: () => METHOD_NAME_ALL,
      METHOD_NAME_ALL_LOWERCASE: () => METHOD_NAME_ALL_LOWERCASE,
      UnsupportedPathError: () => UnsupportedPathError
    });
    module.exports = __toCommonJS(router_exports);
    var METHOD_NAME_ALL = "ALL";
    var METHOD_NAME_ALL_LOWERCASE = "all";
    var METHODS = ["get", "post", "put", "delete", "options", "patch"];
    var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
    var UnsupportedPathError = class extends Error {
    };
    __name(UnsupportedPathError, "UnsupportedPathError");
  }
});

// node_modules/hono/dist/cjs/utils/constants.js
var require_constants2 = __commonJS({
  "node_modules/hono/dist/cjs/utils/constants.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var constants_exports = {};
    __export(constants_exports, {
      COMPOSED_HANDLER: () => COMPOSED_HANDLER
    });
    module.exports = __toCommonJS(constants_exports);
    var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
  }
});

// node_modules/hono/dist/cjs/hono-base.js
var require_hono_base = __commonJS({
  "node_modules/hono/dist/cjs/hono-base.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var hono_base_exports = {};
    __export(hono_base_exports, {
      HonoBase: () => Hono3
    });
    module.exports = __toCommonJS(hono_base_exports);
    var import_compose = require_compose();
    var import_context = require_context();
    var import_router = require_router();
    var import_constants2 = require_constants2();
    var import_url = require_url();
    var notFoundHandler = /* @__PURE__ */ __name((c) => {
      return c.text("404 Not Found", 404);
    }, "notFoundHandler");
    var errorHandler = /* @__PURE__ */ __name((err, c) => {
      if ("getResponse" in err) {
        const res = err.getResponse();
        return c.newResponse(res.body, res);
      }
      console.error(err);
      return c.text("Internal Server Error", 500);
    }, "errorHandler");
    var Hono3 = class {
      get;
      post;
      put;
      delete;
      options;
      patch;
      all;
      on;
      use;
      /*
        This class is like an abstract class and does not have a router.
        To use it, inherit the class and implement router in the constructor.
      */
      router;
      getPath;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      _basePath = "/";
      #path = "/";
      routes = [];
      constructor(options = {}) {
        const allMethods = [...import_router.METHODS, import_router.METHOD_NAME_ALL_LOWERCASE];
        allMethods.forEach((method) => {
          this[method] = (args1, ...args) => {
            if (typeof args1 === "string") {
              this.#path = args1;
            } else {
              this.#addRoute(method, this.#path, args1);
            }
            args.forEach((handler) => {
              this.#addRoute(method, this.#path, handler);
            });
            return this;
          };
        });
        this.on = (method, path, ...handlers) => {
          for (const p of [path].flat()) {
            this.#path = p;
            for (const m of [method].flat()) {
              handlers.map((handler) => {
                this.#addRoute(m.toUpperCase(), this.#path, handler);
              });
            }
          }
          return this;
        };
        this.use = (arg1, ...handlers) => {
          if (typeof arg1 === "string") {
            this.#path = arg1;
          } else {
            this.#path = "*";
            handlers.unshift(arg1);
          }
          handlers.forEach((handler) => {
            this.#addRoute(import_router.METHOD_NAME_ALL, this.#path, handler);
          });
          return this;
        };
        const { strict, ...optionsWithoutStrict } = options;
        Object.assign(this, optionsWithoutStrict);
        this.getPath = strict ?? true ? options.getPath ?? import_url.getPath : import_url.getPathNoStrict;
      }
      #clone() {
        const clone = new Hono3({
          router: this.router,
          getPath: this.getPath
        });
        clone.errorHandler = this.errorHandler;
        clone.#notFoundHandler = this.#notFoundHandler;
        clone.routes = this.routes;
        return clone;
      }
      #notFoundHandler = notFoundHandler;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      errorHandler = errorHandler;
      /**
       * `.route()` allows grouping other Hono instance in routes.
       *
       * @see {@link https://hono.dev/docs/api/routing#grouping}
       *
       * @param {string} path - base Path
       * @param {Hono} app - other Hono instance
       * @returns {Hono} routed Hono instance
       *
       * @example
       * ```ts
       * const app = new Hono()
       * const app2 = new Hono()
       *
       * app2.get("/user", (c) => c.text("user"))
       * app.route("/api", app2) // GET /api/user
       * ```
       */
      route(path, app2) {
        const subApp = this.basePath(path);
        app2.routes.map((r) => {
          let handler;
          if (app2.errorHandler === errorHandler) {
            handler = r.handler;
          } else {
            handler = /* @__PURE__ */ __name(async (c, next) => (await (0, import_compose.compose)([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
            handler[import_constants2.COMPOSED_HANDLER] = r.handler;
          }
          subApp.#addRoute(r.method, r.path, handler, r.basePath);
        });
        return this;
      }
      /**
       * `.basePath()` allows base paths to be specified.
       *
       * @see {@link https://hono.dev/docs/api/routing#base-path}
       *
       * @param {string} path - base Path
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * const api = new Hono().basePath('/api')
       * ```
       */
      basePath(path) {
        const subApp = this.#clone();
        subApp._basePath = (0, import_url.mergePath)(this._basePath, path);
        return subApp;
      }
      /**
       * `.onError()` handles an error and returns a customized Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#error-handling}
       *
       * @param {ErrorHandler} handler - request Handler for error
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.onError((err, c) => {
       *   console.error(`${err}`)
       *   return c.text('Custom Error Message', 500)
       * })
       * ```
       */
      onError = (handler) => {
        this.errorHandler = handler;
        return this;
      };
      /**
       * `.notFound()` allows you to customize a Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#not-found}
       *
       * @param {NotFoundHandler} handler - request handler for not-found
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.notFound((c) => {
       *   return c.text('Custom 404 Message', 404)
       * })
       * ```
       */
      notFound = (handler) => {
        this.#notFoundHandler = handler;
        return this;
      };
      /**
       * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
       *
       * @see {@link https://hono.dev/docs/api/hono#mount}
       *
       * @param {string} path - base Path
       * @param {Function} applicationHandler - other Request Handler
       * @param {MountOptions} [options] - options of `.mount()`
       * @returns {Hono} mounted Hono instance
       *
       * @example
       * ```ts
       * import { Router as IttyRouter } from 'itty-router'
       * import { Hono } from 'hono'
       * // Create itty-router application
       * const ittyRouter = IttyRouter()
       * // GET /itty-router/hello
       * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
       *
       * const app = new Hono()
       * app.mount('/itty-router', ittyRouter.handle)
       * ```
       *
       * @example
       * ```ts
       * const app = new Hono()
       * // Send the request to another application without modification.
       * app.mount('/app', anotherApp, {
       *   replaceRequest: (req) => req,
       * })
       * ```
       */
      mount(path, applicationHandler, options) {
        let replaceRequest;
        let optionHandler;
        if (options) {
          if (typeof options === "function") {
            optionHandler = options;
          } else {
            optionHandler = options.optionHandler;
            if (options.replaceRequest === false) {
              replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
            } else {
              replaceRequest = options.replaceRequest;
            }
          }
        }
        const getOptions = optionHandler ? (c) => {
          const options2 = optionHandler(c);
          return Array.isArray(options2) ? options2 : [options2];
        } : (c) => {
          let executionContext = void 0;
          try {
            executionContext = c.executionCtx;
          } catch {
          }
          return [c.env, executionContext];
        };
        replaceRequest ||= (() => {
          const mergedPath = (0, import_url.mergePath)(this._basePath, path);
          const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
          return (request) => {
            const url = new URL(request.url);
            url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
            return new Request(url, request);
          };
        })();
        const handler = /* @__PURE__ */ __name(async (c, next) => {
          const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
          if (res) {
            return res;
          }
          await next();
        }, "handler");
        this.#addRoute(import_router.METHOD_NAME_ALL, (0, import_url.mergePath)(path, "*"), handler);
        return this;
      }
      #addRoute(method, path, handler, baseRoutePath) {
        method = method.toUpperCase();
        path = (0, import_url.mergePath)(this._basePath, path);
        const r = {
          basePath: baseRoutePath !== void 0 ? (0, import_url.mergePath)(this._basePath, baseRoutePath) : this._basePath,
          path,
          method,
          handler
        };
        this.router.add(method, path, [handler, r]);
        this.routes.push(r);
      }
      #handleError(err, c) {
        if (err instanceof Error) {
          return this.errorHandler(err, c);
        }
        throw err;
      }
      #dispatch(request, executionCtx, env2, method) {
        if (method === "HEAD") {
          return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
        }
        const path = this.getPath(request, { env: env2 });
        const matchResult = this.router.match(method, path);
        const c = new import_context.Context(request, {
          path,
          matchResult,
          env: env2,
          executionCtx,
          notFoundHandler: this.#notFoundHandler
        });
        if (matchResult[0].length === 1) {
          let res;
          try {
            res = matchResult[0][0][0][0](c, async () => {
              c.res = await this.#notFoundHandler(c);
            });
          } catch (err) {
            return this.#handleError(err, c);
          }
          return res instanceof Promise ? res.then(
            (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
          ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
        }
        const composed = (0, import_compose.compose)(matchResult[0], this.errorHandler, this.#notFoundHandler);
        return (async () => {
          try {
            const context2 = await composed(c);
            if (!context2.finalized) {
              throw new Error(
                "Context is not finalized. Did you forget to return a Response object or `await next()`?"
              );
            }
            return context2.res;
          } catch (err) {
            return this.#handleError(err, c);
          }
        })();
      }
      /**
       * `.fetch()` will be entry point of your app.
       *
       * @see {@link https://hono.dev/docs/api/hono#fetch}
       *
       * @param {Request} request - request Object of request
       * @param {Env} Env - env Object
       * @param {ExecutionContext} - context of execution
       * @returns {Response | Promise<Response>} response of request
       *
       */
      fetch = (request, ...rest) => {
        return this.#dispatch(request, rest[1], rest[0], request.method);
      };
      /**
       * `.request()` is a useful method for testing.
       * You can pass a URL or pathname to send a GET request.
       * app will return a Response object.
       * ```ts
       * test('GET /hello is ok', async () => {
       *   const res = await app.request('/hello')
       *   expect(res.status).toBe(200)
       * })
       * ```
       * @see https://hono.dev/docs/api/hono#request
       */
      request = (input, requestInit, Env, executionCtx) => {
        if (input instanceof Request) {
          return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
        }
        input = input.toString();
        return this.fetch(
          new Request(
            /^https?:\/\//.test(input) ? input : `http://localhost${(0, import_url.mergePath)("/", input)}`,
            requestInit
          ),
          Env,
          executionCtx
        );
      };
      /**
       * `.fire()` automatically adds a global fetch event listener.
       * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
       * @deprecated
       * Use `fire` from `hono/service-worker` instead.
       * ```ts
       * import { Hono } from 'hono'
       * import { fire } from 'hono/service-worker'
       *
       * const app = new Hono()
       * // ...
       * fire(app)
       * ```
       * @see https://hono.dev/docs/api/hono#fire
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
       * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
       */
      fire = () => {
        addEventListener("fetch", (event) => {
          event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
        });
      };
    };
    __name(Hono3, "Hono");
  }
});

// node_modules/hono/dist/cjs/router/reg-exp-router/matcher.js
var require_matcher = __commonJS({
  "node_modules/hono/dist/cjs/router/reg-exp-router/matcher.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var matcher_exports = {};
    __export(matcher_exports, {
      emptyParam: () => emptyParam,
      match: () => match
    });
    module.exports = __toCommonJS(matcher_exports);
    var import_router = require_router();
    var emptyParam = [];
    function match(method, path) {
      const matchers = this.buildAllMatchers();
      const match2 = /* @__PURE__ */ __name((method2, path2) => {
        const matcher = matchers[method2] || matchers[import_router.METHOD_NAME_ALL];
        const staticMatch = matcher[2][path2];
        if (staticMatch) {
          return staticMatch;
        }
        const match3 = path2.match(matcher[0]);
        if (!match3) {
          return [[], emptyParam];
        }
        const index = match3.indexOf("", 1);
        return [matcher[1][index], match3];
      }, "match2");
      this.match = match2;
      return match2(method, path);
    }
    __name(match, "match");
  }
});

// node_modules/hono/dist/cjs/router/reg-exp-router/node.js
var require_node = __commonJS({
  "node_modules/hono/dist/cjs/router/reg-exp-router/node.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var node_exports = {};
    __export(node_exports, {
      Node: () => Node,
      PATH_ERROR: () => PATH_ERROR
    });
    module.exports = __toCommonJS(node_exports);
    var LABEL_REG_EXP_STR = "[^/]+";
    var ONLY_WILDCARD_REG_EXP_STR = ".*";
    var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
    var PATH_ERROR = /* @__PURE__ */ Symbol();
    var regExpMetaChars = new Set(".\\+*[^]$()");
    function compareKey(a, b) {
      if (a.length === 1) {
        return b.length === 1 ? a < b ? -1 : 1 : -1;
      }
      if (b.length === 1) {
        return 1;
      }
      if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
        return 1;
      } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
        return -1;
      }
      if (a === LABEL_REG_EXP_STR) {
        return 1;
      } else if (b === LABEL_REG_EXP_STR) {
        return -1;
      }
      return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
    }
    __name(compareKey, "compareKey");
    var Node = class {
      #index;
      #varIndex;
      #children = /* @__PURE__ */ Object.create(null);
      insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
        if (tokens.length === 0) {
          if (this.#index !== void 0) {
            throw PATH_ERROR;
          }
          if (pathErrorCheckOnly) {
            return;
          }
          this.#index = index;
          return;
        }
        const [token, ...restTokens] = tokens;
        const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        let node;
        if (pattern) {
          const name = pattern[1];
          let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
          if (name && pattern[2]) {
            if (regexpStr === ".*") {
              throw PATH_ERROR;
            }
            regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
            if (/\((?!\?:)/.test(regexpStr)) {
              throw PATH_ERROR;
            }
          }
          node = this.#children[regexpStr];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[regexpStr] = new Node();
            if (name !== "") {
              node.#varIndex = context2.varIndex++;
            }
          }
          if (!pathErrorCheckOnly && name !== "") {
            paramMap.push([name, node.#varIndex]);
          }
        } else {
          node = this.#children[token];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[token] = new Node();
          }
        }
        node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
      }
      buildRegExpStr() {
        const childKeys = Object.keys(this.#children).sort(compareKey);
        const strList = childKeys.map((k) => {
          const c = this.#children[k];
          return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
        });
        if (typeof this.#index === "number") {
          strList.unshift(`#${this.#index}`);
        }
        if (strList.length === 0) {
          return "";
        }
        if (strList.length === 1) {
          return strList[0];
        }
        return "(?:" + strList.join("|") + ")";
      }
    };
    __name(Node, "Node");
  }
});

// node_modules/hono/dist/cjs/router/reg-exp-router/trie.js
var require_trie = __commonJS({
  "node_modules/hono/dist/cjs/router/reg-exp-router/trie.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var trie_exports = {};
    __export(trie_exports, {
      Trie: () => Trie
    });
    module.exports = __toCommonJS(trie_exports);
    var import_node = require_node();
    var Trie = class {
      #context = { varIndex: 0 };
      #root = new import_node.Node();
      insert(path, index, pathErrorCheckOnly) {
        const paramAssoc = [];
        const groups = [];
        for (let i = 0; ; ) {
          let replaced = false;
          path = path.replace(/\{[^}]+\}/g, (m) => {
            const mark = `@\\${i}`;
            groups[i] = [mark, m];
            i++;
            replaced = true;
            return mark;
          });
          if (!replaced) {
            break;
          }
        }
        const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
        for (let i = groups.length - 1; i >= 0; i--) {
          const [mark] = groups[i];
          for (let j = tokens.length - 1; j >= 0; j--) {
            if (tokens[j].indexOf(mark) !== -1) {
              tokens[j] = tokens[j].replace(mark, groups[i][1]);
              break;
            }
          }
        }
        this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
        return paramAssoc;
      }
      buildRegExp() {
        let regexp = this.#root.buildRegExpStr();
        if (regexp === "") {
          return [/^$/, [], []];
        }
        let captureIndex = 0;
        const indexReplacementMap = [];
        const paramReplacementMap = [];
        regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
          if (handlerIndex !== void 0) {
            indexReplacementMap[++captureIndex] = Number(handlerIndex);
            return "$()";
          }
          if (paramIndex !== void 0) {
            paramReplacementMap[Number(paramIndex)] = ++captureIndex;
            return "";
          }
          return "";
        });
        return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
      }
    };
    __name(Trie, "Trie");
  }
});

// node_modules/hono/dist/cjs/router/reg-exp-router/router.js
var require_router2 = __commonJS({
  "node_modules/hono/dist/cjs/router/reg-exp-router/router.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var router_exports = {};
    __export(router_exports, {
      RegExpRouter: () => RegExpRouter2
    });
    module.exports = __toCommonJS(router_exports);
    var import_router = require_router();
    var import_url = require_url();
    var import_matcher = require_matcher();
    var import_node = require_node();
    var import_trie = require_trie();
    var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
    var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
    function buildWildcardRegExp(path) {
      return wildcardRegExpCache[path] ??= new RegExp(
        path === "*" ? "" : `^${path.replace(
          /\/\*$|([.\\+*[^\]$()])/g,
          (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
        )}$`
      );
    }
    __name(buildWildcardRegExp, "buildWildcardRegExp");
    function clearWildcardRegExpCache() {
      wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
    }
    __name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
    function buildMatcherFromPreprocessedRoutes(routes) {
      const trie = new import_trie.Trie();
      const handlerData = [];
      if (routes.length === 0) {
        return nullMatcher;
      }
      const routesWithStaticPathFlag = routes.map(
        (route) => [!/\*|\/:/.test(route[0]), ...route]
      ).sort(
        ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
      );
      const staticMap = /* @__PURE__ */ Object.create(null);
      for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
        const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
        if (pathErrorCheckOnly) {
          staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), import_matcher.emptyParam];
        } else {
          j++;
        }
        let paramAssoc;
        try {
          paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
        } catch (e) {
          throw e === import_node.PATH_ERROR ? new import_router.UnsupportedPathError(path) : e;
        }
        if (pathErrorCheckOnly) {
          continue;
        }
        handlerData[j] = handlers.map(([h, paramCount]) => {
          const paramIndexMap = /* @__PURE__ */ Object.create(null);
          paramCount -= 1;
          for (; paramCount >= 0; paramCount--) {
            const [key, value] = paramAssoc[paramCount];
            paramIndexMap[key] = value;
          }
          return [h, paramIndexMap];
        });
      }
      const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
      for (let i = 0, len = handlerData.length; i < len; i++) {
        for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
          const map = handlerData[i][j]?.[1];
          if (!map) {
            continue;
          }
          const keys = Object.keys(map);
          for (let k = 0, len3 = keys.length; k < len3; k++) {
            map[keys[k]] = paramReplacementMap[map[keys[k]]];
          }
        }
      }
      const handlerMap = [];
      for (const i in indexReplacementMap) {
        handlerMap[i] = handlerData[indexReplacementMap[i]];
      }
      return [regexp, handlerMap, staticMap];
    }
    __name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
    function findMiddleware(middleware, path) {
      if (!middleware) {
        return void 0;
      }
      for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
        if (buildWildcardRegExp(k).test(path)) {
          return [...middleware[k]];
        }
      }
      return void 0;
    }
    __name(findMiddleware, "findMiddleware");
    var RegExpRouter2 = class {
      name = "RegExpRouter";
      #middleware;
      #routes;
      constructor() {
        this.#middleware = { [import_router.METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
        this.#routes = { [import_router.METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
      }
      add(method, path, handler) {
        const middleware = this.#middleware;
        const routes = this.#routes;
        if (!middleware || !routes) {
          throw new Error(import_router.MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        if (!middleware[method]) {
          ;
          [middleware, routes].forEach((handlerMap) => {
            handlerMap[method] = /* @__PURE__ */ Object.create(null);
            Object.keys(handlerMap[import_router.METHOD_NAME_ALL]).forEach((p) => {
              handlerMap[method][p] = [...handlerMap[import_router.METHOD_NAME_ALL][p]];
            });
          });
        }
        if (path === "/*") {
          path = "*";
        }
        const paramCount = (path.match(/\/:/g) || []).length;
        if (/\*$/.test(path)) {
          const re = buildWildcardRegExp(path);
          if (method === import_router.METHOD_NAME_ALL) {
            Object.keys(middleware).forEach((m) => {
              middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[import_router.METHOD_NAME_ALL], path) || [];
            });
          } else {
            middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[import_router.METHOD_NAME_ALL], path) || [];
          }
          Object.keys(middleware).forEach((m) => {
            if (method === import_router.METHOD_NAME_ALL || method === m) {
              Object.keys(middleware[m]).forEach((p) => {
                re.test(p) && middleware[m][p].push([handler, paramCount]);
              });
            }
          });
          Object.keys(routes).forEach((m) => {
            if (method === import_router.METHOD_NAME_ALL || method === m) {
              Object.keys(routes[m]).forEach(
                (p) => re.test(p) && routes[m][p].push([handler, paramCount])
              );
            }
          });
          return;
        }
        const paths = (0, import_url.checkOptionalParameter)(path) || [path];
        for (let i = 0, len = paths.length; i < len; i++) {
          const path2 = paths[i];
          Object.keys(routes).forEach((m) => {
            if (method === import_router.METHOD_NAME_ALL || method === m) {
              routes[m][path2] ||= [
                ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[import_router.METHOD_NAME_ALL], path2) || []
              ];
              routes[m][path2].push([handler, paramCount - len + i + 1]);
            }
          });
        }
      }
      match = import_matcher.match;
      buildAllMatchers() {
        const matchers = /* @__PURE__ */ Object.create(null);
        Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
          matchers[method] ||= this.#buildMatcher(method);
        });
        this.#middleware = this.#routes = void 0;
        clearWildcardRegExpCache();
        return matchers;
      }
      #buildMatcher(method) {
        const routes = [];
        let hasOwnRoute = method === import_router.METHOD_NAME_ALL;
        [this.#middleware, this.#routes].forEach((r) => {
          const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
          if (ownRoute.length !== 0) {
            hasOwnRoute ||= true;
            routes.push(...ownRoute);
          } else if (method !== import_router.METHOD_NAME_ALL) {
            routes.push(
              ...Object.keys(r[import_router.METHOD_NAME_ALL]).map((path) => [path, r[import_router.METHOD_NAME_ALL][path]])
            );
          }
        });
        if (!hasOwnRoute) {
          return null;
        } else {
          return buildMatcherFromPreprocessedRoutes(routes);
        }
      }
    };
    __name(RegExpRouter2, "RegExpRouter");
  }
});

// node_modules/hono/dist/cjs/router/reg-exp-router/prepared-router.js
var require_prepared_router = __commonJS({
  "node_modules/hono/dist/cjs/router/reg-exp-router/prepared-router.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var prepared_router_exports = {};
    __export(prepared_router_exports, {
      PreparedRegExpRouter: () => PreparedRegExpRouter2,
      buildInitParams: () => buildInitParams2,
      serializeInitParams: () => serializeInitParams2
    });
    module.exports = __toCommonJS(prepared_router_exports);
    var import_router = require_router();
    var import_matcher = require_matcher();
    var import_router2 = require_router2();
    var PreparedRegExpRouter2 = class {
      name = "PreparedRegExpRouter";
      #matchers;
      #relocateMap;
      constructor(matchers, relocateMap) {
        this.#matchers = matchers;
        this.#relocateMap = relocateMap;
      }
      #addWildcard(method, handlerData) {
        const matcher = this.#matchers[method];
        matcher[1].forEach((list) => list && list.push(handlerData));
        Object.values(matcher[2]).forEach((list) => list[0].push(handlerData));
      }
      #addPath(method, path, handler, indexes, map) {
        const matcher = this.#matchers[method];
        if (!map) {
          matcher[2][path][0].push([handler, {}]);
        } else {
          indexes.forEach((index) => {
            if (typeof index === "number") {
              matcher[1][index].push([handler, map]);
            } else {
              ;
              matcher[2][index || path][0].push([handler, map]);
            }
          });
        }
      }
      add(method, path, handler) {
        if (!this.#matchers[method]) {
          const all = this.#matchers[import_router.METHOD_NAME_ALL];
          const staticMap = {};
          for (const key in all[2]) {
            staticMap[key] = [all[2][key][0].slice(), import_matcher.emptyParam];
          }
          this.#matchers[method] = [
            all[0],
            all[1].map((list) => Array.isArray(list) ? list.slice() : 0),
            staticMap
          ];
        }
        if (path === "/*" || path === "*") {
          const handlerData = [handler, {}];
          if (method === import_router.METHOD_NAME_ALL) {
            for (const m in this.#matchers) {
              this.#addWildcard(m, handlerData);
            }
          } else {
            this.#addWildcard(method, handlerData);
          }
          return;
        }
        const data = this.#relocateMap[path];
        if (!data) {
          throw new Error(`Path ${path} is not registered`);
        }
        for (const [indexes, map] of data) {
          if (method === import_router.METHOD_NAME_ALL) {
            for (const m in this.#matchers) {
              this.#addPath(m, path, handler, indexes, map);
            }
          } else {
            this.#addPath(method, path, handler, indexes, map);
          }
        }
      }
      buildAllMatchers() {
        return this.#matchers;
      }
      match = import_matcher.match;
    };
    __name(PreparedRegExpRouter2, "PreparedRegExpRouter");
    var buildInitParams2 = /* @__PURE__ */ __name(({ paths }) => {
      const RegExpRouterWithMatcherExport = /* @__PURE__ */ __name(class extends import_router2.RegExpRouter {
        buildAndExportAllMatchers() {
          return this.buildAllMatchers();
        }
      }, "RegExpRouterWithMatcherExport");
      const router = new RegExpRouterWithMatcherExport();
      for (const path of paths) {
        router.add(import_router.METHOD_NAME_ALL, path, path);
      }
      const matchers = router.buildAndExportAllMatchers();
      const all = matchers[import_router.METHOD_NAME_ALL];
      const relocateMap = {};
      for (const path of paths) {
        if (path === "/*" || path === "*") {
          continue;
        }
        all[1].forEach((list, i) => {
          list.forEach(([p, map]) => {
            if (p === path) {
              if (relocateMap[path]) {
                relocateMap[path][0][1] = {
                  ...relocateMap[path][0][1],
                  ...map
                };
              } else {
                relocateMap[path] = [[[], map]];
              }
              if (relocateMap[path][0][0].findIndex((j) => j === i) === -1) {
                relocateMap[path][0][0].push(i);
              }
            }
          });
        });
        for (const path2 in all[2]) {
          all[2][path2][0].forEach(([p]) => {
            if (p === path) {
              relocateMap[path] ||= [[[]]];
              const value = path2 === path ? "" : path2;
              if (relocateMap[path][0][0].findIndex((v) => v === value) === -1) {
                relocateMap[path][0][0].push(value);
              }
            }
          });
        }
      }
      for (let i = 0, len = all[1].length; i < len; i++) {
        all[1][i] = all[1][i] ? [] : 0;
      }
      for (const path in all[2]) {
        all[2][path][0] = [];
      }
      return [matchers, relocateMap];
    }, "buildInitParams");
    var serializeInitParams2 = /* @__PURE__ */ __name(([matchers, relocateMap]) => {
      const matchersStr = JSON.stringify(
        matchers,
        (_, value) => value instanceof RegExp ? `##${value.toString()}##` : value
      ).replace(/"##(.+?)##"/g, (_, str) => str.replace(/\\\\/g, "\\"));
      const relocateMapStr = JSON.stringify(relocateMap);
      return `[${matchersStr},${relocateMapStr}]`;
    }, "serializeInitParams");
  }
});

// node_modules/hono/dist/cjs/router/reg-exp-router/index.js
var require_reg_exp_router = __commonJS({
  "node_modules/hono/dist/cjs/router/reg-exp-router/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var reg_exp_router_exports = {};
    __export(reg_exp_router_exports, {
      PreparedRegExpRouter: () => import_prepared_router.PreparedRegExpRouter,
      RegExpRouter: () => import_router.RegExpRouter,
      buildInitParams: () => import_prepared_router.buildInitParams,
      serializeInitParams: () => import_prepared_router.serializeInitParams
    });
    module.exports = __toCommonJS(reg_exp_router_exports);
    var import_router = require_router2();
    var import_prepared_router = require_prepared_router();
  }
});

// node_modules/hono/dist/cjs/router/smart-router/router.js
var require_router3 = __commonJS({
  "node_modules/hono/dist/cjs/router/smart-router/router.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var router_exports = {};
    __export(router_exports, {
      SmartRouter: () => SmartRouter2
    });
    module.exports = __toCommonJS(router_exports);
    var import_router = require_router();
    var SmartRouter2 = class {
      name = "SmartRouter";
      #routers = [];
      #routes = [];
      constructor(init) {
        this.#routers = init.routers;
      }
      add(method, path, handler) {
        if (!this.#routes) {
          throw new Error(import_router.MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        this.#routes.push([method, path, handler]);
      }
      match(method, path) {
        if (!this.#routes) {
          throw new Error("Fatal error");
        }
        const routers = this.#routers;
        const routes = this.#routes;
        const len = routers.length;
        let i = 0;
        let res;
        for (; i < len; i++) {
          const router = routers[i];
          try {
            for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
              router.add(...routes[i2]);
            }
            res = router.match(method, path);
          } catch (e) {
            if (e instanceof import_router.UnsupportedPathError) {
              continue;
            }
            throw e;
          }
          this.match = router.match.bind(router);
          this.#routers = [router];
          this.#routes = void 0;
          break;
        }
        if (i === len) {
          throw new Error("Fatal error");
        }
        this.name = `SmartRouter + ${this.activeRouter.name}`;
        return res;
      }
      get activeRouter() {
        if (this.#routes || this.#routers.length !== 1) {
          throw new Error("No active router has been determined yet.");
        }
        return this.#routers[0];
      }
    };
    __name(SmartRouter2, "SmartRouter");
  }
});

// node_modules/hono/dist/cjs/router/smart-router/index.js
var require_smart_router = __commonJS({
  "node_modules/hono/dist/cjs/router/smart-router/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var smart_router_exports = {};
    __export(smart_router_exports, {
      SmartRouter: () => import_router.SmartRouter
    });
    module.exports = __toCommonJS(smart_router_exports);
    var import_router = require_router3();
  }
});

// node_modules/hono/dist/cjs/router/trie-router/node.js
var require_node2 = __commonJS({
  "node_modules/hono/dist/cjs/router/trie-router/node.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var node_exports = {};
    __export(node_exports, {
      Node: () => Node
    });
    module.exports = __toCommonJS(node_exports);
    var import_router = require_router();
    var import_url = require_url();
    var emptyParams = /* @__PURE__ */ Object.create(null);
    var hasChildren = /* @__PURE__ */ __name((children) => {
      for (const _ in children) {
        return true;
      }
      return false;
    }, "hasChildren");
    var Node = class {
      #methods;
      #children;
      #patterns;
      #order = 0;
      #params = emptyParams;
      constructor(method, handler, children) {
        this.#children = children || /* @__PURE__ */ Object.create(null);
        this.#methods = [];
        if (method && handler) {
          const m = /* @__PURE__ */ Object.create(null);
          m[method] = { handler, possibleKeys: [], score: 0 };
          this.#methods = [m];
        }
        this.#patterns = [];
      }
      insert(method, path, handler) {
        this.#order = ++this.#order;
        let curNode = this;
        const parts = (0, import_url.splitRoutingPath)(path);
        const possibleKeys = [];
        for (let i = 0, len = parts.length; i < len; i++) {
          const p = parts[i];
          const nextP = parts[i + 1];
          const pattern = (0, import_url.getPattern)(p, nextP);
          const key = Array.isArray(pattern) ? pattern[0] : p;
          if (key in curNode.#children) {
            curNode = curNode.#children[key];
            if (pattern) {
              possibleKeys.push(pattern[1]);
            }
            continue;
          }
          curNode.#children[key] = new Node();
          if (pattern) {
            curNode.#patterns.push(pattern);
            possibleKeys.push(pattern[1]);
          }
          curNode = curNode.#children[key];
        }
        curNode.#methods.push({
          [method]: {
            handler,
            possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
            score: this.#order
          }
        });
        return curNode;
      }
      #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
        for (let i = 0, len = node.#methods.length; i < len; i++) {
          const m = node.#methods[i];
          const handlerSet = m[method] || m[import_router.METHOD_NAME_ALL];
          const processedSet = {};
          if (handlerSet !== void 0) {
            handlerSet.params = /* @__PURE__ */ Object.create(null);
            handlerSets.push(handlerSet);
            if (nodeParams !== emptyParams || params && params !== emptyParams) {
              for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
                const key = handlerSet.possibleKeys[i2];
                const processed = processedSet[handlerSet.score];
                handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
                processedSet[handlerSet.score] = true;
              }
            }
          }
        }
      }
      search(method, path) {
        const handlerSets = [];
        this.#params = emptyParams;
        const curNode = this;
        let curNodes = [curNode];
        const parts = (0, import_url.splitPath)(path);
        const curNodesQueue = [];
        const len = parts.length;
        let partOffsets = null;
        for (let i = 0; i < len; i++) {
          const part = parts[i];
          const isLast = i === len - 1;
          const tempNodes = [];
          for (let j = 0, len2 = curNodes.length; j < len2; j++) {
            const node = curNodes[j];
            const nextNode = node.#children[part];
            if (nextNode) {
              nextNode.#params = node.#params;
              if (isLast) {
                if (nextNode.#children["*"]) {
                  this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
                }
                this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
              } else {
                tempNodes.push(nextNode);
              }
            }
            for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
              const pattern = node.#patterns[k];
              const params = node.#params === emptyParams ? {} : { ...node.#params };
              if (pattern === "*") {
                const astNode = node.#children["*"];
                if (astNode) {
                  this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
                  astNode.#params = params;
                  tempNodes.push(astNode);
                }
                continue;
              }
              const [key, name, matcher] = pattern;
              if (!part && !(matcher instanceof RegExp)) {
                continue;
              }
              const child = node.#children[key];
              if (matcher instanceof RegExp) {
                if (partOffsets === null) {
                  partOffsets = new Array(len);
                  let offset = path[0] === "/" ? 1 : 0;
                  for (let p = 0; p < len; p++) {
                    partOffsets[p] = offset;
                    offset += parts[p].length + 1;
                  }
                }
                const restPathString = path.substring(partOffsets[i]);
                const m = matcher.exec(restPathString);
                if (m) {
                  params[name] = m[0];
                  this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
                  if (hasChildren(child.#children)) {
                    child.#params = params;
                    const componentCount = m[0].match(/\//)?.length ?? 0;
                    const targetCurNodes = curNodesQueue[componentCount] ||= [];
                    targetCurNodes.push(child);
                  }
                  continue;
                }
              }
              if (matcher === true || matcher.test(part)) {
                params[name] = part;
                if (isLast) {
                  this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
                  if (child.#children["*"]) {
                    this.#pushHandlerSets(
                      handlerSets,
                      child.#children["*"],
                      method,
                      params,
                      node.#params
                    );
                  }
                } else {
                  child.#params = params;
                  tempNodes.push(child);
                }
              }
            }
          }
          const shifted = curNodesQueue.shift();
          curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
        }
        if (handlerSets.length > 1) {
          handlerSets.sort((a, b) => {
            return a.score - b.score;
          });
        }
        return [handlerSets.map(({ handler, params }) => [handler, params])];
      }
    };
    __name(Node, "Node");
  }
});

// node_modules/hono/dist/cjs/router/trie-router/router.js
var require_router4 = __commonJS({
  "node_modules/hono/dist/cjs/router/trie-router/router.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var router_exports = {};
    __export(router_exports, {
      TrieRouter: () => TrieRouter2
    });
    module.exports = __toCommonJS(router_exports);
    var import_url = require_url();
    var import_node = require_node2();
    var TrieRouter2 = class {
      name = "TrieRouter";
      #node;
      constructor() {
        this.#node = new import_node.Node();
      }
      add(method, path, handler) {
        const results = (0, import_url.checkOptionalParameter)(path);
        if (results) {
          for (let i = 0, len = results.length; i < len; i++) {
            this.#node.insert(method, results[i], handler);
          }
          return;
        }
        this.#node.insert(method, path, handler);
      }
      match(method, path) {
        return this.#node.search(method, path);
      }
    };
    __name(TrieRouter2, "TrieRouter");
  }
});

// node_modules/hono/dist/cjs/router/trie-router/index.js
var require_trie_router = __commonJS({
  "node_modules/hono/dist/cjs/router/trie-router/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var trie_router_exports = {};
    __export(trie_router_exports, {
      TrieRouter: () => import_router.TrieRouter
    });
    module.exports = __toCommonJS(trie_router_exports);
    var import_router = require_router4();
  }
});

// node_modules/hono/dist/cjs/hono.js
var require_hono = __commonJS({
  "node_modules/hono/dist/cjs/hono.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var hono_exports = {};
    __export(hono_exports, {
      Hono: () => Hono3
    });
    module.exports = __toCommonJS(hono_exports);
    var import_hono_base = require_hono_base();
    var import_reg_exp_router = require_reg_exp_router();
    var import_smart_router = require_smart_router();
    var import_trie_router = require_trie_router();
    var Hono3 = class extends import_hono_base.HonoBase {
      /**
       * Creates an instance of the Hono class.
       *
       * @param options - Optional configuration options for the Hono instance.
       */
      constructor(options = {}) {
        super(options);
        this.router = options.router ?? new import_smart_router.SmartRouter({
          routers: [new import_reg_exp_router.RegExpRouter(), new import_trie_router.TrieRouter()]
        });
      }
    };
    __name(Hono3, "Hono");
  }
});

// node_modules/hono/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/hono/dist/cjs/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var index_exports = {};
    __export(index_exports, {
      Context: () => import_context.Context,
      Hono: () => import_hono.Hono
    });
    module.exports = __toCommonJS(index_exports);
    var import_hono = require_hono();
    var import_context = require_context();
  }
});

// node_modules/hono/dist/cjs/middleware/cors/index.js
var require_cors = __commonJS({
  "node_modules/hono/dist/cjs/middleware/cors/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var cors_exports = {};
    __export(cors_exports, {
      cors: () => cors2
    });
    module.exports = __toCommonJS(cors_exports);
    var cors2 = /* @__PURE__ */ __name((options) => {
      const opts = {
        origin: "*",
        allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
        allowHeaders: [],
        exposeHeaders: [],
        ...options
      };
      const findAllowOrigin = ((optsOrigin) => {
        if (typeof optsOrigin === "string") {
          if (optsOrigin === "*") {
            return () => optsOrigin;
          } else {
            return (origin) => optsOrigin === origin ? origin : null;
          }
        } else if (typeof optsOrigin === "function") {
          return optsOrigin;
        } else {
          return (origin) => optsOrigin.includes(origin) ? origin : null;
        }
      })(opts.origin);
      const findAllowMethods = ((optsAllowMethods) => {
        if (typeof optsAllowMethods === "function") {
          return optsAllowMethods;
        } else if (Array.isArray(optsAllowMethods)) {
          return () => optsAllowMethods;
        } else {
          return () => [];
        }
      })(opts.allowMethods);
      return /* @__PURE__ */ __name(async function cors22(c, next) {
        function set(key, value) {
          c.res.headers.set(key, value);
        }
        __name(set, "set");
        const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
        if (allowOrigin) {
          set("Access-Control-Allow-Origin", allowOrigin);
        }
        if (opts.credentials) {
          set("Access-Control-Allow-Credentials", "true");
        }
        if (opts.exposeHeaders?.length) {
          set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
        }
        if (c.req.method === "OPTIONS") {
          if (opts.origin !== "*") {
            set("Vary", "Origin");
          }
          if (opts.maxAge != null) {
            set("Access-Control-Max-Age", opts.maxAge.toString());
          }
          const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
          if (allowMethods.length) {
            set("Access-Control-Allow-Methods", allowMethods.join(","));
          }
          let headers = opts.allowHeaders;
          if (!headers?.length) {
            const requestHeaders = c.req.header("Access-Control-Request-Headers");
            if (requestHeaders) {
              headers = requestHeaders.split(/\s*,\s*/);
            }
          }
          if (headers?.length) {
            set("Access-Control-Allow-Headers", headers.join(","));
            c.res.headers.append("Vary", "Access-Control-Request-Headers");
          }
          c.res.headers.delete("Content-Length");
          c.res.headers.delete("Content-Type");
          return new Response(null, {
            headers: c.res.headers,
            status: 204,
            statusText: "No Content"
          });
        }
        await next();
        if (opts.origin !== "*") {
          c.header("Vary", "Origin", { append: true });
        }
      }, "cors2");
    }, "cors");
  }
});

// node_modules/unenv/dist/runtime/node/internal/crypto/web.mjs
var import_strip_cf_connecting_ip_header14, subtle;
var init_web = __esm({
  "node_modules/unenv/dist/runtime/node/internal/crypto/web.mjs"() {
    import_strip_cf_connecting_ip_header14 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    subtle = globalThis.crypto?.subtle;
  }
});

// node_modules/unenv/dist/runtime/node/internal/crypto/node.mjs
var import_strip_cf_connecting_ip_header15, webcrypto, createCipher, createDecipher, pseudoRandomBytes, createCipheriv, createDecipheriv, createECDH, createSign, createVerify, diffieHellman, getCipherInfo, privateDecrypt, privateEncrypt, publicDecrypt, publicEncrypt, sign, verify, hash, Cipher, Cipheriv, Decipher, Decipheriv, ECDH, Sign, Verify;
var init_node = __esm({
  "node_modules/unenv/dist/runtime/node/internal/crypto/node.mjs"() {
    import_strip_cf_connecting_ip_header15 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    webcrypto = new Proxy(globalThis.crypto, { get(_, key) {
      if (key === "CryptoKey") {
        return globalThis.CryptoKey;
      }
      if (typeof globalThis.crypto[key] === "function") {
        return globalThis.crypto[key].bind(globalThis.crypto);
      }
      return globalThis.crypto[key];
    } });
    createCipher = /* @__PURE__ */ notImplemented("crypto.createCipher");
    createDecipher = /* @__PURE__ */ notImplemented("crypto.createDecipher");
    pseudoRandomBytes = /* @__PURE__ */ notImplemented("crypto.pseudoRandomBytes");
    createCipheriv = /* @__PURE__ */ notImplemented("crypto.createCipheriv");
    createDecipheriv = /* @__PURE__ */ notImplemented("crypto.createDecipheriv");
    createECDH = /* @__PURE__ */ notImplemented("crypto.createECDH");
    createSign = /* @__PURE__ */ notImplemented("crypto.createSign");
    createVerify = /* @__PURE__ */ notImplemented("crypto.createVerify");
    diffieHellman = /* @__PURE__ */ notImplemented("crypto.diffieHellman");
    getCipherInfo = /* @__PURE__ */ notImplemented("crypto.getCipherInfo");
    privateDecrypt = /* @__PURE__ */ notImplemented("crypto.privateDecrypt");
    privateEncrypt = /* @__PURE__ */ notImplemented("crypto.privateEncrypt");
    publicDecrypt = /* @__PURE__ */ notImplemented("crypto.publicDecrypt");
    publicEncrypt = /* @__PURE__ */ notImplemented("crypto.publicEncrypt");
    sign = /* @__PURE__ */ notImplemented("crypto.sign");
    verify = /* @__PURE__ */ notImplemented("crypto.verify");
    hash = /* @__PURE__ */ notImplemented("crypto.hash");
    Cipher = /* @__PURE__ */ notImplementedClass("crypto.Cipher");
    Cipheriv = /* @__PURE__ */ notImplementedClass(
      "crypto.Cipheriv"
      // @ts-expect-error not typed yet
    );
    Decipher = /* @__PURE__ */ notImplementedClass("crypto.Decipher");
    Decipheriv = /* @__PURE__ */ notImplementedClass(
      "crypto.Decipheriv"
      // @ts-expect-error not typed yet
    );
    ECDH = /* @__PURE__ */ notImplementedClass("crypto.ECDH");
    Sign = /* @__PURE__ */ notImplementedClass("crypto.Sign");
    Verify = /* @__PURE__ */ notImplementedClass("crypto.Verify");
  }
});

// node_modules/unenv/dist/runtime/node/internal/crypto/constants.mjs
var import_strip_cf_connecting_ip_header16, SSL_OP_ALL, SSL_OP_ALLOW_NO_DHE_KEX, SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION, SSL_OP_CIPHER_SERVER_PREFERENCE, SSL_OP_CISCO_ANYCONNECT, SSL_OP_COOKIE_EXCHANGE, SSL_OP_CRYPTOPRO_TLSEXT_BUG, SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS, SSL_OP_LEGACY_SERVER_CONNECT, SSL_OP_NO_COMPRESSION, SSL_OP_NO_ENCRYPT_THEN_MAC, SSL_OP_NO_QUERY_MTU, SSL_OP_NO_RENEGOTIATION, SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION, SSL_OP_NO_SSLv2, SSL_OP_NO_SSLv3, SSL_OP_NO_TICKET, SSL_OP_NO_TLSv1, SSL_OP_NO_TLSv1_1, SSL_OP_NO_TLSv1_2, SSL_OP_NO_TLSv1_3, SSL_OP_PRIORITIZE_CHACHA, SSL_OP_TLS_ROLLBACK_BUG, ENGINE_METHOD_RSA, ENGINE_METHOD_DSA, ENGINE_METHOD_DH, ENGINE_METHOD_RAND, ENGINE_METHOD_EC, ENGINE_METHOD_CIPHERS, ENGINE_METHOD_DIGESTS, ENGINE_METHOD_PKEY_METHS, ENGINE_METHOD_PKEY_ASN1_METHS, ENGINE_METHOD_ALL, ENGINE_METHOD_NONE, DH_CHECK_P_NOT_SAFE_PRIME, DH_CHECK_P_NOT_PRIME, DH_UNABLE_TO_CHECK_GENERATOR, DH_NOT_SUITABLE_GENERATOR, RSA_PKCS1_PADDING, RSA_NO_PADDING, RSA_PKCS1_OAEP_PADDING, RSA_X931_PADDING, RSA_PKCS1_PSS_PADDING, RSA_PSS_SALTLEN_DIGEST, RSA_PSS_SALTLEN_MAX_SIGN, RSA_PSS_SALTLEN_AUTO, POINT_CONVERSION_COMPRESSED, POINT_CONVERSION_UNCOMPRESSED, POINT_CONVERSION_HYBRID, defaultCoreCipherList, defaultCipherList, OPENSSL_VERSION_NUMBER, TLS1_VERSION, TLS1_1_VERSION, TLS1_2_VERSION, TLS1_3_VERSION;
var init_constants = __esm({
  "node_modules/unenv/dist/runtime/node/internal/crypto/constants.mjs"() {
    import_strip_cf_connecting_ip_header16 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    SSL_OP_ALL = 2147485776;
    SSL_OP_ALLOW_NO_DHE_KEX = 1024;
    SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION = 262144;
    SSL_OP_CIPHER_SERVER_PREFERENCE = 4194304;
    SSL_OP_CISCO_ANYCONNECT = 32768;
    SSL_OP_COOKIE_EXCHANGE = 8192;
    SSL_OP_CRYPTOPRO_TLSEXT_BUG = 2147483648;
    SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS = 2048;
    SSL_OP_LEGACY_SERVER_CONNECT = 4;
    SSL_OP_NO_COMPRESSION = 131072;
    SSL_OP_NO_ENCRYPT_THEN_MAC = 524288;
    SSL_OP_NO_QUERY_MTU = 4096;
    SSL_OP_NO_RENEGOTIATION = 1073741824;
    SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION = 65536;
    SSL_OP_NO_SSLv2 = 0;
    SSL_OP_NO_SSLv3 = 33554432;
    SSL_OP_NO_TICKET = 16384;
    SSL_OP_NO_TLSv1 = 67108864;
    SSL_OP_NO_TLSv1_1 = 268435456;
    SSL_OP_NO_TLSv1_2 = 134217728;
    SSL_OP_NO_TLSv1_3 = 536870912;
    SSL_OP_PRIORITIZE_CHACHA = 2097152;
    SSL_OP_TLS_ROLLBACK_BUG = 8388608;
    ENGINE_METHOD_RSA = 1;
    ENGINE_METHOD_DSA = 2;
    ENGINE_METHOD_DH = 4;
    ENGINE_METHOD_RAND = 8;
    ENGINE_METHOD_EC = 2048;
    ENGINE_METHOD_CIPHERS = 64;
    ENGINE_METHOD_DIGESTS = 128;
    ENGINE_METHOD_PKEY_METHS = 512;
    ENGINE_METHOD_PKEY_ASN1_METHS = 1024;
    ENGINE_METHOD_ALL = 65535;
    ENGINE_METHOD_NONE = 0;
    DH_CHECK_P_NOT_SAFE_PRIME = 2;
    DH_CHECK_P_NOT_PRIME = 1;
    DH_UNABLE_TO_CHECK_GENERATOR = 4;
    DH_NOT_SUITABLE_GENERATOR = 8;
    RSA_PKCS1_PADDING = 1;
    RSA_NO_PADDING = 3;
    RSA_PKCS1_OAEP_PADDING = 4;
    RSA_X931_PADDING = 5;
    RSA_PKCS1_PSS_PADDING = 6;
    RSA_PSS_SALTLEN_DIGEST = -1;
    RSA_PSS_SALTLEN_MAX_SIGN = -2;
    RSA_PSS_SALTLEN_AUTO = -2;
    POINT_CONVERSION_COMPRESSED = 2;
    POINT_CONVERSION_UNCOMPRESSED = 4;
    POINT_CONVERSION_HYBRID = 6;
    defaultCoreCipherList = "";
    defaultCipherList = "";
    OPENSSL_VERSION_NUMBER = 0;
    TLS1_VERSION = 0;
    TLS1_1_VERSION = 0;
    TLS1_2_VERSION = 0;
    TLS1_3_VERSION = 0;
  }
});

// node_modules/unenv/dist/runtime/node/crypto.mjs
var import_strip_cf_connecting_ip_header17, constants;
var init_crypto = __esm({
  "node_modules/unenv/dist/runtime/node/crypto.mjs"() {
    import_strip_cf_connecting_ip_header17 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_constants();
    init_web();
    init_node();
    constants = {
      OPENSSL_VERSION_NUMBER,
      SSL_OP_ALL,
      SSL_OP_ALLOW_NO_DHE_KEX,
      SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
      SSL_OP_CIPHER_SERVER_PREFERENCE,
      SSL_OP_CISCO_ANYCONNECT,
      SSL_OP_COOKIE_EXCHANGE,
      SSL_OP_CRYPTOPRO_TLSEXT_BUG,
      SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS,
      SSL_OP_LEGACY_SERVER_CONNECT,
      SSL_OP_NO_COMPRESSION,
      SSL_OP_NO_ENCRYPT_THEN_MAC,
      SSL_OP_NO_QUERY_MTU,
      SSL_OP_NO_RENEGOTIATION,
      SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION,
      SSL_OP_NO_SSLv2,
      SSL_OP_NO_SSLv3,
      SSL_OP_NO_TICKET,
      SSL_OP_NO_TLSv1,
      SSL_OP_NO_TLSv1_1,
      SSL_OP_NO_TLSv1_2,
      SSL_OP_NO_TLSv1_3,
      SSL_OP_PRIORITIZE_CHACHA,
      SSL_OP_TLS_ROLLBACK_BUG,
      ENGINE_METHOD_RSA,
      ENGINE_METHOD_DSA,
      ENGINE_METHOD_DH,
      ENGINE_METHOD_RAND,
      ENGINE_METHOD_EC,
      ENGINE_METHOD_CIPHERS,
      ENGINE_METHOD_DIGESTS,
      ENGINE_METHOD_PKEY_METHS,
      ENGINE_METHOD_PKEY_ASN1_METHS,
      ENGINE_METHOD_ALL,
      ENGINE_METHOD_NONE,
      DH_CHECK_P_NOT_SAFE_PRIME,
      DH_CHECK_P_NOT_PRIME,
      DH_UNABLE_TO_CHECK_GENERATOR,
      DH_NOT_SUITABLE_GENERATOR,
      RSA_PKCS1_PADDING,
      RSA_NO_PADDING,
      RSA_PKCS1_OAEP_PADDING,
      RSA_X931_PADDING,
      RSA_PKCS1_PSS_PADDING,
      RSA_PSS_SALTLEN_DIGEST,
      RSA_PSS_SALTLEN_MAX_SIGN,
      RSA_PSS_SALTLEN_AUTO,
      defaultCoreCipherList,
      TLS1_VERSION,
      TLS1_1_VERSION,
      TLS1_2_VERSION,
      TLS1_3_VERSION,
      POINT_CONVERSION_COMPRESSED,
      POINT_CONVERSION_UNCOMPRESSED,
      POINT_CONVERSION_HYBRID,
      defaultCipherList
    };
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/crypto.mjs
var import_strip_cf_connecting_ip_header18, workerdCrypto, Certificate, DiffieHellman, DiffieHellmanGroup, Hash, Hmac, KeyObject, X509Certificate, checkPrime, checkPrimeSync, createDiffieHellman, createDiffieHellmanGroup, createHash, createHmac, createPrivateKey, createPublicKey, createSecretKey, generateKey, generateKeyPair, generateKeyPairSync, generateKeySync, generatePrime, generatePrimeSync, getCiphers, getCurves, getDiffieHellman, getFips, getHashes, hkdf, hkdfSync, pbkdf2, pbkdf2Sync, randomBytes, randomFill, randomFillSync, randomInt, randomUUID, scrypt, scryptSync, secureHeapUsed, setEngine, setFips, subtle2, timingSafeEqual, getRandomValues, webcrypto2, fips, crypto_default;
var init_crypto2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/crypto.mjs"() {
    import_strip_cf_connecting_ip_header18 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_crypto();
    workerdCrypto = process.getBuiltinModule("node:crypto");
    ({
      Certificate,
      DiffieHellman,
      DiffieHellmanGroup,
      Hash,
      Hmac,
      KeyObject,
      X509Certificate,
      checkPrime,
      checkPrimeSync,
      createDiffieHellman,
      createDiffieHellmanGroup,
      createHash,
      createHmac,
      createPrivateKey,
      createPublicKey,
      createSecretKey,
      generateKey,
      generateKeyPair,
      generateKeyPairSync,
      generateKeySync,
      generatePrime,
      generatePrimeSync,
      getCiphers,
      getCurves,
      getDiffieHellman,
      getFips,
      getHashes,
      hkdf,
      hkdfSync,
      pbkdf2,
      pbkdf2Sync,
      randomBytes,
      randomFill,
      randomFillSync,
      randomInt,
      randomUUID,
      scrypt,
      scryptSync,
      secureHeapUsed,
      setEngine,
      setFips,
      subtle: subtle2,
      timingSafeEqual
    } = workerdCrypto);
    getRandomValues = workerdCrypto.getRandomValues.bind(
      workerdCrypto.webcrypto
    );
    webcrypto2 = {
      // @ts-expect-error unenv has unknown type
      CryptoKey: webcrypto.CryptoKey,
      getRandomValues,
      randomUUID,
      subtle: subtle2
    };
    fips = workerdCrypto.fips;
    crypto_default = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      Certificate,
      Cipher,
      Cipheriv,
      Decipher,
      Decipheriv,
      ECDH,
      Sign,
      Verify,
      X509Certificate,
      // @ts-expect-error @types/node is out of date - this is a bug in typings
      constants,
      // @ts-expect-error unenv has unknown type
      createCipheriv,
      // @ts-expect-error unenv has unknown type
      createDecipheriv,
      // @ts-expect-error unenv has unknown type
      createECDH,
      // @ts-expect-error unenv has unknown type
      createSign,
      // @ts-expect-error unenv has unknown type
      createVerify,
      // @ts-expect-error unenv has unknown type
      diffieHellman,
      // @ts-expect-error unenv has unknown type
      getCipherInfo,
      // @ts-expect-error unenv has unknown type
      hash,
      // @ts-expect-error unenv has unknown type
      privateDecrypt,
      // @ts-expect-error unenv has unknown type
      privateEncrypt,
      // @ts-expect-error unenv has unknown type
      publicDecrypt,
      // @ts-expect-error unenv has unknown type
      publicEncrypt,
      scrypt,
      scryptSync,
      // @ts-expect-error unenv has unknown type
      sign,
      // @ts-expect-error unenv has unknown type
      verify,
      // default-only export from unenv
      // @ts-expect-error unenv has unknown type
      createCipher,
      // @ts-expect-error unenv has unknown type
      createDecipher,
      // @ts-expect-error unenv has unknown type
      pseudoRandomBytes,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      DiffieHellman,
      DiffieHellmanGroup,
      Hash,
      Hmac,
      KeyObject,
      checkPrime,
      checkPrimeSync,
      createDiffieHellman,
      createDiffieHellmanGroup,
      createHash,
      createHmac,
      createPrivateKey,
      createPublicKey,
      createSecretKey,
      generateKey,
      generateKeyPair,
      generateKeyPairSync,
      generateKeySync,
      generatePrime,
      generatePrimeSync,
      getCiphers,
      getCurves,
      getDiffieHellman,
      getFips,
      getHashes,
      getRandomValues,
      hkdf,
      hkdfSync,
      pbkdf2,
      pbkdf2Sync,
      randomBytes,
      randomFill,
      randomFillSync,
      randomInt,
      randomUUID,
      secureHeapUsed,
      setEngine,
      setFips,
      subtle: subtle2,
      timingSafeEqual,
      // default-only export from workerd
      fips,
      // special-cased deep merged symbols
      webcrypto: webcrypto2
    };
  }
});

// node-built-in-modules:crypto
var require_crypto = __commonJS({
  "node-built-in-modules:crypto"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_crypto2();
    module.exports = crypto_default;
  }
});

// node_modules/bcryptjs/umd/index.js
var require_umd = __commonJS({
  "node_modules/bcryptjs/umd/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    (function(global, factory) {
      function preferDefault(exports2) {
        return exports2.default || exports2;
      }
      __name(preferDefault, "preferDefault");
      if (typeof define === "function" && define.amd) {
        define(["crypto"], function(_crypto) {
          var exports2 = {};
          factory(exports2, _crypto);
          return preferDefault(exports2);
        });
      } else if (typeof exports === "object") {
        factory(exports, require_crypto());
        if (typeof module === "object")
          module.exports = preferDefault(exports);
      } else {
        (function() {
          var exports2 = {};
          factory(exports2, global.crypto);
          global.bcrypt = preferDefault(exports2);
        })();
      }
    })(
      typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports,
      function(_exports, _crypto) {
        "use strict";
        Object.defineProperty(_exports, "__esModule", {
          value: true
        });
        _exports.compare = compare;
        _exports.compareSync = compareSync;
        _exports.decodeBase64 = decodeBase64;
        _exports.default = void 0;
        _exports.encodeBase64 = encodeBase64;
        _exports.genSalt = genSalt;
        _exports.genSaltSync = genSaltSync;
        _exports.getRounds = getRounds;
        _exports.getSalt = getSalt;
        _exports.hash = hash2;
        _exports.hashSync = hashSync;
        _exports.setRandomFallback = setRandomFallback;
        _exports.truncates = truncates;
        _crypto = _interopRequireDefault(_crypto);
        function _interopRequireDefault(e) {
          return e && e.__esModule ? e : { default: e };
        }
        __name(_interopRequireDefault, "_interopRequireDefault");
        var randomFallback = null;
        function randomBytes2(len) {
          try {
            return crypto.getRandomValues(new Uint8Array(len));
          } catch {
          }
          try {
            return _crypto.default.randomBytes(len);
          } catch {
          }
          if (!randomFallback) {
            throw Error(
              "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
            );
          }
          return randomFallback(len);
        }
        __name(randomBytes2, "randomBytes");
        function setRandomFallback(random) {
          randomFallback = random;
        }
        __name(setRandomFallback, "setRandomFallback");
        function genSaltSync(rounds, seed_length) {
          rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
          if (typeof rounds !== "number")
            throw Error(
              "Illegal arguments: " + typeof rounds + ", " + typeof seed_length
            );
          if (rounds < 4)
            rounds = 4;
          else if (rounds > 31)
            rounds = 31;
          var salt = [];
          salt.push("$2b$");
          if (rounds < 10)
            salt.push("0");
          salt.push(rounds.toString());
          salt.push("$");
          salt.push(base64_encode(randomBytes2(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
          return salt.join("");
        }
        __name(genSaltSync, "genSaltSync");
        function genSalt(rounds, seed_length, callback) {
          if (typeof seed_length === "function")
            callback = seed_length, seed_length = void 0;
          if (typeof rounds === "function")
            callback = rounds, rounds = void 0;
          if (typeof rounds === "undefined")
            rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
          else if (typeof rounds !== "number")
            throw Error("illegal arguments: " + typeof rounds);
          function _async(callback2) {
            nextTick2(function() {
              try {
                callback2(null, genSaltSync(rounds));
              } catch (err) {
                callback2(err);
              }
            });
          }
          __name(_async, "_async");
          if (callback) {
            if (typeof callback !== "function")
              throw Error("Illegal callback: " + typeof callback);
            _async(callback);
          } else
            return new Promise(function(resolve, reject) {
              _async(function(err, res) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(res);
              });
            });
        }
        __name(genSalt, "genSalt");
        function hashSync(password, salt) {
          if (typeof salt === "undefined")
            salt = GENSALT_DEFAULT_LOG2_ROUNDS;
          if (typeof salt === "number")
            salt = genSaltSync(salt);
          if (typeof password !== "string" || typeof salt !== "string")
            throw Error(
              "Illegal arguments: " + typeof password + ", " + typeof salt
            );
          return _hash(password, salt);
        }
        __name(hashSync, "hashSync");
        function hash2(password, salt, callback, progressCallback) {
          function _async(callback2) {
            if (typeof password === "string" && typeof salt === "number")
              genSalt(salt, function(err, salt2) {
                _hash(password, salt2, callback2, progressCallback);
              });
            else if (typeof password === "string" && typeof salt === "string")
              _hash(password, salt, callback2, progressCallback);
            else
              nextTick2(
                callback2.bind(
                  this,
                  Error(
                    "Illegal arguments: " + typeof password + ", " + typeof salt
                  )
                )
              );
          }
          __name(_async, "_async");
          if (callback) {
            if (typeof callback !== "function")
              throw Error("Illegal callback: " + typeof callback);
            _async(callback);
          } else
            return new Promise(function(resolve, reject) {
              _async(function(err, res) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(res);
              });
            });
        }
        __name(hash2, "hash");
        function safeStringCompare(known, unknown) {
          var diff = known.length ^ unknown.length;
          for (var i = 0; i < known.length; ++i) {
            diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
          }
          return diff === 0;
        }
        __name(safeStringCompare, "safeStringCompare");
        function compareSync(password, hash3) {
          if (typeof password !== "string" || typeof hash3 !== "string")
            throw Error(
              "Illegal arguments: " + typeof password + ", " + typeof hash3
            );
          if (hash3.length !== 60)
            return false;
          return safeStringCompare(
            hashSync(password, hash3.substring(0, hash3.length - 31)),
            hash3
          );
        }
        __name(compareSync, "compareSync");
        function compare(password, hashValue, callback, progressCallback) {
          function _async(callback2) {
            if (typeof password !== "string" || typeof hashValue !== "string") {
              nextTick2(
                callback2.bind(
                  this,
                  Error(
                    "Illegal arguments: " + typeof password + ", " + typeof hashValue
                  )
                )
              );
              return;
            }
            if (hashValue.length !== 60) {
              nextTick2(callback2.bind(this, null, false));
              return;
            }
            hash2(
              password,
              hashValue.substring(0, 29),
              function(err, comp) {
                if (err)
                  callback2(err);
                else
                  callback2(null, safeStringCompare(comp, hashValue));
              },
              progressCallback
            );
          }
          __name(_async, "_async");
          if (callback) {
            if (typeof callback !== "function")
              throw Error("Illegal callback: " + typeof callback);
            _async(callback);
          } else
            return new Promise(function(resolve, reject) {
              _async(function(err, res) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(res);
              });
            });
        }
        __name(compare, "compare");
        function getRounds(hash3) {
          if (typeof hash3 !== "string")
            throw Error("Illegal arguments: " + typeof hash3);
          return parseInt(hash3.split("$")[2], 10);
        }
        __name(getRounds, "getRounds");
        function getSalt(hash3) {
          if (typeof hash3 !== "string")
            throw Error("Illegal arguments: " + typeof hash3);
          if (hash3.length !== 60)
            throw Error("Illegal hash length: " + hash3.length + " != 60");
          return hash3.substring(0, 29);
        }
        __name(getSalt, "getSalt");
        function truncates(password) {
          if (typeof password !== "string")
            throw Error("Illegal arguments: " + typeof password);
          return utf8Length(password) > 72;
        }
        __name(truncates, "truncates");
        var nextTick2 = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
        function utf8Length(string) {
          var len = 0, c = 0;
          for (var i = 0; i < string.length; ++i) {
            c = string.charCodeAt(i);
            if (c < 128)
              len += 1;
            else if (c < 2048)
              len += 2;
            else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
              ++i;
              len += 4;
            } else
              len += 3;
          }
          return len;
        }
        __name(utf8Length, "utf8Length");
        function utf8Array(string) {
          var offset = 0, c1, c2;
          var buffer = new Array(utf8Length(string));
          for (var i = 0, k = string.length; i < k; ++i) {
            c1 = string.charCodeAt(i);
            if (c1 < 128) {
              buffer[offset++] = c1;
            } else if (c1 < 2048) {
              buffer[offset++] = c1 >> 6 | 192;
              buffer[offset++] = c1 & 63 | 128;
            } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
              c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
              ++i;
              buffer[offset++] = c1 >> 18 | 240;
              buffer[offset++] = c1 >> 12 & 63 | 128;
              buffer[offset++] = c1 >> 6 & 63 | 128;
              buffer[offset++] = c1 & 63 | 128;
            } else {
              buffer[offset++] = c1 >> 12 | 224;
              buffer[offset++] = c1 >> 6 & 63 | 128;
              buffer[offset++] = c1 & 63 | 128;
            }
          }
          return buffer;
        }
        __name(utf8Array, "utf8Array");
        var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
          ""
        );
        var BASE64_INDEX = [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          0,
          1,
          54,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          52,
          53,
          -1,
          -1,
          -1,
          -1,
          -1
        ];
        function base64_encode(b, len) {
          var off2 = 0, rs = [], c1, c2;
          if (len <= 0 || len > b.length)
            throw Error("Illegal len: " + len);
          while (off2 < len) {
            c1 = b[off2++] & 255;
            rs.push(BASE64_CODE[c1 >> 2 & 63]);
            c1 = (c1 & 3) << 4;
            if (off2 >= len) {
              rs.push(BASE64_CODE[c1 & 63]);
              break;
            }
            c2 = b[off2++] & 255;
            c1 |= c2 >> 4 & 15;
            rs.push(BASE64_CODE[c1 & 63]);
            c1 = (c2 & 15) << 2;
            if (off2 >= len) {
              rs.push(BASE64_CODE[c1 & 63]);
              break;
            }
            c2 = b[off2++] & 255;
            c1 |= c2 >> 6 & 3;
            rs.push(BASE64_CODE[c1 & 63]);
            rs.push(BASE64_CODE[c2 & 63]);
          }
          return rs.join("");
        }
        __name(base64_encode, "base64_encode");
        function base64_decode(s, len) {
          var off2 = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
          if (len <= 0)
            throw Error("Illegal len: " + len);
          while (off2 < slen - 1 && olen < len) {
            code = s.charCodeAt(off2++);
            c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
            code = s.charCodeAt(off2++);
            c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
            if (c1 == -1 || c2 == -1)
              break;
            o = c1 << 2 >>> 0;
            o |= (c2 & 48) >> 4;
            rs.push(String.fromCharCode(o));
            if (++olen >= len || off2 >= slen)
              break;
            code = s.charCodeAt(off2++);
            c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
            if (c3 == -1)
              break;
            o = (c2 & 15) << 4 >>> 0;
            o |= (c3 & 60) >> 2;
            rs.push(String.fromCharCode(o));
            if (++olen >= len || off2 >= slen)
              break;
            code = s.charCodeAt(off2++);
            c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
            o = (c3 & 3) << 6 >>> 0;
            o |= c4;
            rs.push(String.fromCharCode(o));
            ++olen;
          }
          var res = [];
          for (off2 = 0; off2 < olen; off2++)
            res.push(rs[off2].charCodeAt(0));
          return res;
        }
        __name(base64_decode, "base64_decode");
        var BCRYPT_SALT_LEN = 16;
        var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
        var BLOWFISH_NUM_ROUNDS = 16;
        var MAX_EXECUTION_TIME = 100;
        var P_ORIG = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ];
        var S_ORIG = [
          3509652390,
          2564797868,
          805139163,
          3491422135,
          3101798381,
          1780907670,
          3128725573,
          4046225305,
          614570311,
          3012652279,
          134345442,
          2240740374,
          1667834072,
          1901547113,
          2757295779,
          4103290238,
          227898511,
          1921955416,
          1904987480,
          2182433518,
          2069144605,
          3260701109,
          2620446009,
          720527379,
          3318853667,
          677414384,
          3393288472,
          3101374703,
          2390351024,
          1614419982,
          1822297739,
          2954791486,
          3608508353,
          3174124327,
          2024746970,
          1432378464,
          3864339955,
          2857741204,
          1464375394,
          1676153920,
          1439316330,
          715854006,
          3033291828,
          289532110,
          2706671279,
          2087905683,
          3018724369,
          1668267050,
          732546397,
          1947742710,
          3462151702,
          2609353502,
          2950085171,
          1814351708,
          2050118529,
          680887927,
          999245976,
          1800124847,
          3300911131,
          1713906067,
          1641548236,
          4213287313,
          1216130144,
          1575780402,
          4018429277,
          3917837745,
          3693486850,
          3949271944,
          596196993,
          3549867205,
          258830323,
          2213823033,
          772490370,
          2760122372,
          1774776394,
          2652871518,
          566650946,
          4142492826,
          1728879713,
          2882767088,
          1783734482,
          3629395816,
          2517608232,
          2874225571,
          1861159788,
          326777828,
          3124490320,
          2130389656,
          2716951837,
          967770486,
          1724537150,
          2185432712,
          2364442137,
          1164943284,
          2105845187,
          998989502,
          3765401048,
          2244026483,
          1075463327,
          1455516326,
          1322494562,
          910128902,
          469688178,
          1117454909,
          936433444,
          3490320968,
          3675253459,
          1240580251,
          122909385,
          2157517691,
          634681816,
          4142456567,
          3825094682,
          3061402683,
          2540495037,
          79693498,
          3249098678,
          1084186820,
          1583128258,
          426386531,
          1761308591,
          1047286709,
          322548459,
          995290223,
          1845252383,
          2603652396,
          3431023940,
          2942221577,
          3202600964,
          3727903485,
          1712269319,
          422464435,
          3234572375,
          1170764815,
          3523960633,
          3117677531,
          1434042557,
          442511882,
          3600875718,
          1076654713,
          1738483198,
          4213154764,
          2393238008,
          3677496056,
          1014306527,
          4251020053,
          793779912,
          2902807211,
          842905082,
          4246964064,
          1395751752,
          1040244610,
          2656851899,
          3396308128,
          445077038,
          3742853595,
          3577915638,
          679411651,
          2892444358,
          2354009459,
          1767581616,
          3150600392,
          3791627101,
          3102740896,
          284835224,
          4246832056,
          1258075500,
          768725851,
          2589189241,
          3069724005,
          3532540348,
          1274779536,
          3789419226,
          2764799539,
          1660621633,
          3471099624,
          4011903706,
          913787905,
          3497959166,
          737222580,
          2514213453,
          2928710040,
          3937242737,
          1804850592,
          3499020752,
          2949064160,
          2386320175,
          2390070455,
          2415321851,
          4061277028,
          2290661394,
          2416832540,
          1336762016,
          1754252060,
          3520065937,
          3014181293,
          791618072,
          3188594551,
          3933548030,
          2332172193,
          3852520463,
          3043980520,
          413987798,
          3465142937,
          3030929376,
          4245938359,
          2093235073,
          3534596313,
          375366246,
          2157278981,
          2479649556,
          555357303,
          3870105701,
          2008414854,
          3344188149,
          4221384143,
          3956125452,
          2067696032,
          3594591187,
          2921233993,
          2428461,
          544322398,
          577241275,
          1471733935,
          610547355,
          4027169054,
          1432588573,
          1507829418,
          2025931657,
          3646575487,
          545086370,
          48609733,
          2200306550,
          1653985193,
          298326376,
          1316178497,
          3007786442,
          2064951626,
          458293330,
          2589141269,
          3591329599,
          3164325604,
          727753846,
          2179363840,
          146436021,
          1461446943,
          4069977195,
          705550613,
          3059967265,
          3887724982,
          4281599278,
          3313849956,
          1404054877,
          2845806497,
          146425753,
          1854211946,
          1266315497,
          3048417604,
          3681880366,
          3289982499,
          290971e4,
          1235738493,
          2632868024,
          2414719590,
          3970600049,
          1771706367,
          1449415276,
          3266420449,
          422970021,
          1963543593,
          2690192192,
          3826793022,
          1062508698,
          1531092325,
          1804592342,
          2583117782,
          2714934279,
          4024971509,
          1294809318,
          4028980673,
          1289560198,
          2221992742,
          1669523910,
          35572830,
          157838143,
          1052438473,
          1016535060,
          1802137761,
          1753167236,
          1386275462,
          3080475397,
          2857371447,
          1040679964,
          2145300060,
          2390574316,
          1461121720,
          2956646967,
          4031777805,
          4028374788,
          33600511,
          2920084762,
          1018524850,
          629373528,
          3691585981,
          3515945977,
          2091462646,
          2486323059,
          586499841,
          988145025,
          935516892,
          3367335476,
          2599673255,
          2839830854,
          265290510,
          3972581182,
          2759138881,
          3795373465,
          1005194799,
          847297441,
          406762289,
          1314163512,
          1332590856,
          1866599683,
          4127851711,
          750260880,
          613907577,
          1450815602,
          3165620655,
          3734664991,
          3650291728,
          3012275730,
          3704569646,
          1427272223,
          778793252,
          1343938022,
          2676280711,
          2052605720,
          1946737175,
          3164576444,
          3914038668,
          3967478842,
          3682934266,
          1661551462,
          3294938066,
          4011595847,
          840292616,
          3712170807,
          616741398,
          312560963,
          711312465,
          1351876610,
          322626781,
          1910503582,
          271666773,
          2175563734,
          1594956187,
          70604529,
          3617834859,
          1007753275,
          1495573769,
          4069517037,
          2549218298,
          2663038764,
          504708206,
          2263041392,
          3941167025,
          2249088522,
          1514023603,
          1998579484,
          1312622330,
          694541497,
          2582060303,
          2151582166,
          1382467621,
          776784248,
          2618340202,
          3323268794,
          2497899128,
          2784771155,
          503983604,
          4076293799,
          907881277,
          423175695,
          432175456,
          1378068232,
          4145222326,
          3954048622,
          3938656102,
          3820766613,
          2793130115,
          2977904593,
          26017576,
          3274890735,
          3194772133,
          1700274565,
          1756076034,
          4006520079,
          3677328699,
          720338349,
          1533947780,
          354530856,
          688349552,
          3973924725,
          1637815568,
          332179504,
          3949051286,
          53804574,
          2852348879,
          3044236432,
          1282449977,
          3583942155,
          3416972820,
          4006381244,
          1617046695,
          2628476075,
          3002303598,
          1686838959,
          431878346,
          2686675385,
          1700445008,
          1080580658,
          1009431731,
          832498133,
          3223435511,
          2605976345,
          2271191193,
          2516031870,
          1648197032,
          4164389018,
          2548247927,
          300782431,
          375919233,
          238389289,
          3353747414,
          2531188641,
          2019080857,
          1475708069,
          455242339,
          2609103871,
          448939670,
          3451063019,
          1395535956,
          2413381860,
          1841049896,
          1491858159,
          885456874,
          4264095073,
          4001119347,
          1565136089,
          3898914787,
          1108368660,
          540939232,
          1173283510,
          2745871338,
          3681308437,
          4207628240,
          3343053890,
          4016749493,
          1699691293,
          1103962373,
          3625875870,
          2256883143,
          3830138730,
          1031889488,
          3479347698,
          1535977030,
          4236805024,
          3251091107,
          2132092099,
          1774941330,
          1199868427,
          1452454533,
          157007616,
          2904115357,
          342012276,
          595725824,
          1480756522,
          206960106,
          497939518,
          591360097,
          863170706,
          2375253569,
          3596610801,
          1814182875,
          2094937945,
          3421402208,
          1082520231,
          3463918190,
          2785509508,
          435703966,
          3908032597,
          1641649973,
          2842273706,
          3305899714,
          1510255612,
          2148256476,
          2655287854,
          3276092548,
          4258621189,
          236887753,
          3681803219,
          274041037,
          1734335097,
          3815195456,
          3317970021,
          1899903192,
          1026095262,
          4050517792,
          356393447,
          2410691914,
          3873677099,
          3682840055,
          3913112168,
          2491498743,
          4132185628,
          2489919796,
          1091903735,
          1979897079,
          3170134830,
          3567386728,
          3557303409,
          857797738,
          1136121015,
          1342202287,
          507115054,
          2535736646,
          337727348,
          3213592640,
          1301675037,
          2528481711,
          1895095763,
          1721773893,
          3216771564,
          62756741,
          2142006736,
          835421444,
          2531993523,
          1442658625,
          3659876326,
          2882144922,
          676362277,
          1392781812,
          170690266,
          3921047035,
          1759253602,
          3611846912,
          1745797284,
          664899054,
          1329594018,
          3901205900,
          3045908486,
          2062866102,
          2865634940,
          3543621612,
          3464012697,
          1080764994,
          553557557,
          3656615353,
          3996768171,
          991055499,
          499776247,
          1265440854,
          648242737,
          3940784050,
          980351604,
          3713745714,
          1749149687,
          3396870395,
          4211799374,
          3640570775,
          1161844396,
          3125318951,
          1431517754,
          545492359,
          4268468663,
          3499529547,
          1437099964,
          2702547544,
          3433638243,
          2581715763,
          2787789398,
          1060185593,
          1593081372,
          2418618748,
          4260947970,
          69676912,
          2159744348,
          86519011,
          2512459080,
          3838209314,
          1220612927,
          3339683548,
          133810670,
          1090789135,
          1078426020,
          1569222167,
          845107691,
          3583754449,
          4072456591,
          1091646820,
          628848692,
          1613405280,
          3757631651,
          526609435,
          236106946,
          48312990,
          2942717905,
          3402727701,
          1797494240,
          859738849,
          992217954,
          4005476642,
          2243076622,
          3870952857,
          3732016268,
          765654824,
          3490871365,
          2511836413,
          1685915746,
          3888969200,
          1414112111,
          2273134842,
          3281911079,
          4080962846,
          172450625,
          2569994100,
          980381355,
          4109958455,
          2819808352,
          2716589560,
          2568741196,
          3681446669,
          3329971472,
          1835478071,
          660984891,
          3704678404,
          4045999559,
          3422617507,
          3040415634,
          1762651403,
          1719377915,
          3470491036,
          2693910283,
          3642056355,
          3138596744,
          1364962596,
          2073328063,
          1983633131,
          926494387,
          3423689081,
          2150032023,
          4096667949,
          1749200295,
          3328846651,
          309677260,
          2016342300,
          1779581495,
          3079819751,
          111262694,
          1274766160,
          443224088,
          298511866,
          1025883608,
          3806446537,
          1145181785,
          168956806,
          3641502830,
          3584813610,
          1689216846,
          3666258015,
          3200248200,
          1692713982,
          2646376535,
          4042768518,
          1618508792,
          1610833997,
          3523052358,
          4130873264,
          2001055236,
          3610705100,
          2202168115,
          4028541809,
          2961195399,
          1006657119,
          2006996926,
          3186142756,
          1430667929,
          3210227297,
          1314452623,
          4074634658,
          4101304120,
          2273951170,
          1399257539,
          3367210612,
          3027628629,
          1190975929,
          2062231137,
          2333990788,
          2221543033,
          2438960610,
          1181637006,
          548689776,
          2362791313,
          3372408396,
          3104550113,
          3145860560,
          296247880,
          1970579870,
          3078560182,
          3769228297,
          1714227617,
          3291629107,
          3898220290,
          166772364,
          1251581989,
          493813264,
          448347421,
          195405023,
          2709975567,
          677966185,
          3703036547,
          1463355134,
          2715995803,
          1338867538,
          1343315457,
          2802222074,
          2684532164,
          233230375,
          2599980071,
          2000651841,
          3277868038,
          1638401717,
          4028070440,
          3237316320,
          6314154,
          819756386,
          300326615,
          590932579,
          1405279636,
          3267499572,
          3150704214,
          2428286686,
          3959192993,
          3461946742,
          1862657033,
          1266418056,
          963775037,
          2089974820,
          2263052895,
          1917689273,
          448879540,
          3550394620,
          3981727096,
          150775221,
          3627908307,
          1303187396,
          508620638,
          2975983352,
          2726630617,
          1817252668,
          1876281319,
          1457606340,
          908771278,
          3720792119,
          3617206836,
          2455994898,
          1729034894,
          1080033504,
          976866871,
          3556439503,
          2881648439,
          1522871579,
          1555064734,
          1336096578,
          3548522304,
          2579274686,
          3574697629,
          3205460757,
          3593280638,
          3338716283,
          3079412587,
          564236357,
          2993598910,
          1781952180,
          1464380207,
          3163844217,
          3332601554,
          1699332808,
          1393555694,
          1183702653,
          3581086237,
          1288719814,
          691649499,
          2847557200,
          2895455976,
          3193889540,
          2717570544,
          1781354906,
          1676643554,
          2592534050,
          3230253752,
          1126444790,
          2770207658,
          2633158820,
          2210423226,
          2615765581,
          2414155088,
          3127139286,
          673620729,
          2805611233,
          1269405062,
          4015350505,
          3341807571,
          4149409754,
          1057255273,
          2012875353,
          2162469141,
          2276492801,
          2601117357,
          993977747,
          3918593370,
          2654263191,
          753973209,
          36408145,
          2530585658,
          25011837,
          3520020182,
          2088578344,
          530523599,
          2918365339,
          1524020338,
          1518925132,
          3760827505,
          3759777254,
          1202760957,
          3985898139,
          3906192525,
          674977740,
          4174734889,
          2031300136,
          2019492241,
          3983892565,
          4153806404,
          3822280332,
          352677332,
          2297720250,
          60907813,
          90501309,
          3286998549,
          1016092578,
          2535922412,
          2839152426,
          457141659,
          509813237,
          4120667899,
          652014361,
          1966332200,
          2975202805,
          55981186,
          2327461051,
          676427537,
          3255491064,
          2882294119,
          3433927263,
          1307055953,
          942726286,
          933058658,
          2468411793,
          3933900994,
          4215176142,
          1361170020,
          2001714738,
          2830558078,
          3274259782,
          1222529897,
          1679025792,
          2729314320,
          3714953764,
          1770335741,
          151462246,
          3013232138,
          1682292957,
          1483529935,
          471910574,
          1539241949,
          458788160,
          3436315007,
          1807016891,
          3718408830,
          978976581,
          1043663428,
          3165965781,
          1927990952,
          4200891579,
          2372276910,
          3208408903,
          3533431907,
          1412390302,
          2931980059,
          4132332400,
          1947078029,
          3881505623,
          4168226417,
          2941484381,
          1077988104,
          1320477388,
          886195818,
          18198404,
          3786409e3,
          2509781533,
          112762804,
          3463356488,
          1866414978,
          891333506,
          18488651,
          661792760,
          1628790961,
          3885187036,
          3141171499,
          876946877,
          2693282273,
          1372485963,
          791857591,
          2686433993,
          3759982718,
          3167212022,
          3472953795,
          2716379847,
          445679433,
          3561995674,
          3504004811,
          3574258232,
          54117162,
          3331405415,
          2381918588,
          3769707343,
          4154350007,
          1140177722,
          4074052095,
          668550556,
          3214352940,
          367459370,
          261225585,
          2610173221,
          4209349473,
          3468074219,
          3265815641,
          314222801,
          3066103646,
          3808782860,
          282218597,
          3406013506,
          3773591054,
          379116347,
          1285071038,
          846784868,
          2669647154,
          3771962079,
          3550491691,
          2305946142,
          453669953,
          1268987020,
          3317592352,
          3279303384,
          3744833421,
          2610507566,
          3859509063,
          266596637,
          3847019092,
          517658769,
          3462560207,
          3443424879,
          370717030,
          4247526661,
          2224018117,
          4143653529,
          4112773975,
          2788324899,
          2477274417,
          1456262402,
          2901442914,
          1517677493,
          1846949527,
          2295493580,
          3734397586,
          2176403920,
          1280348187,
          1908823572,
          3871786941,
          846861322,
          1172426758,
          3287448474,
          3383383037,
          1655181056,
          3139813346,
          901632758,
          1897031941,
          2986607138,
          3066810236,
          3447102507,
          1393639104,
          373351379,
          950779232,
          625454576,
          3124240540,
          4148612726,
          2007998917,
          544563296,
          2244738638,
          2330496472,
          2058025392,
          1291430526,
          424198748,
          50039436,
          29584100,
          3605783033,
          2429876329,
          2791104160,
          1057563949,
          3255363231,
          3075367218,
          3463963227,
          1469046755,
          985887462
        ];
        var C_ORIG = [
          1332899944,
          1700884034,
          1701343084,
          1684370003,
          1668446532,
          1869963892
        ];
        function _encipher(lr, off2, P, S) {
          var n, l = lr[off2], r = lr[off2 + 1];
          l ^= P[0];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[1];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[2];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[3];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[4];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[5];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[6];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[7];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[8];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[9];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[10];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[11];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[12];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[13];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[14];
          n = S[l >>> 24];
          n += S[256 | l >> 16 & 255];
          n ^= S[512 | l >> 8 & 255];
          n += S[768 | l & 255];
          r ^= n ^ P[15];
          n = S[r >>> 24];
          n += S[256 | r >> 16 & 255];
          n ^= S[512 | r >> 8 & 255];
          n += S[768 | r & 255];
          l ^= n ^ P[16];
          lr[off2] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
          lr[off2 + 1] = l;
          return lr;
        }
        __name(_encipher, "_encipher");
        function _streamtoword(data, offp) {
          for (var i = 0, word = 0; i < 4; ++i)
            word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
          return {
            key: word,
            offp
          };
        }
        __name(_streamtoword, "_streamtoword");
        function _key(key, P, S) {
          var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
          for (var i = 0; i < plen; i++)
            sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
          for (i = 0; i < plen; i += 2)
            lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
          for (i = 0; i < slen; i += 2)
            lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
        }
        __name(_key, "_key");
        function _ekskey(data, key, P, S) {
          var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
          for (var i = 0; i < plen; i++)
            sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
          offp = 0;
          for (i = 0; i < plen; i += 2)
            sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
          for (i = 0; i < slen; i += 2)
            sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
        }
        __name(_ekskey, "_ekskey");
        function _crypt(b, salt, rounds, callback, progressCallback) {
          var cdata = C_ORIG.slice(), clen = cdata.length, err;
          if (rounds < 4 || rounds > 31) {
            err = Error("Illegal number of rounds (4-31): " + rounds);
            if (callback) {
              nextTick2(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          if (salt.length !== BCRYPT_SALT_LEN) {
            err = Error(
              "Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN
            );
            if (callback) {
              nextTick2(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          rounds = 1 << rounds >>> 0;
          var P, S, i = 0, j;
          if (typeof Int32Array === "function") {
            P = new Int32Array(P_ORIG);
            S = new Int32Array(S_ORIG);
          } else {
            P = P_ORIG.slice();
            S = S_ORIG.slice();
          }
          _ekskey(salt, b, P, S);
          function next() {
            if (progressCallback)
              progressCallback(i / rounds);
            if (i < rounds) {
              var start = Date.now();
              for (; i < rounds; ) {
                i = i + 1;
                _key(b, P, S);
                _key(salt, P, S);
                if (Date.now() - start > MAX_EXECUTION_TIME)
                  break;
              }
            } else {
              for (i = 0; i < 64; i++)
                for (j = 0; j < clen >> 1; j++)
                  _encipher(cdata, j << 1, P, S);
              var ret = [];
              for (i = 0; i < clen; i++)
                ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
              if (callback) {
                callback(null, ret);
                return;
              } else
                return ret;
            }
            if (callback)
              nextTick2(next);
          }
          __name(next, "next");
          if (typeof callback !== "undefined") {
            next();
          } else {
            var res;
            while (true)
              if (typeof (res = next()) !== "undefined")
                return res || [];
          }
        }
        __name(_crypt, "_crypt");
        function _hash(password, salt, callback, progressCallback) {
          var err;
          if (typeof password !== "string" || typeof salt !== "string") {
            err = Error("Invalid string / salt: Not a string");
            if (callback) {
              nextTick2(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          var minor, offset;
          if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
            err = Error("Invalid salt version: " + salt.substring(0, 2));
            if (callback) {
              nextTick2(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          if (salt.charAt(2) === "$")
            minor = String.fromCharCode(0), offset = 3;
          else {
            minor = salt.charAt(2);
            if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
              err = Error("Invalid salt revision: " + salt.substring(2, 4));
              if (callback) {
                nextTick2(callback.bind(this, err));
                return;
              } else
                throw err;
            }
            offset = 4;
          }
          if (salt.charAt(offset + 2) > "$") {
            err = Error("Missing salt rounds");
            if (callback) {
              nextTick2(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
          password += minor >= "a" ? "\0" : "";
          var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
          function finish(bytes) {
            var res = [];
            res.push("$2");
            if (minor >= "a")
              res.push(minor);
            res.push("$");
            if (rounds < 10)
              res.push("0");
            res.push(rounds.toString());
            res.push("$");
            res.push(base64_encode(saltb, saltb.length));
            res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
            return res.join("");
          }
          __name(finish, "finish");
          if (typeof callback == "undefined")
            return finish(_crypt(passwordb, saltb, rounds));
          else {
            _crypt(
              passwordb,
              saltb,
              rounds,
              function(err2, bytes) {
                if (err2)
                  callback(err2, null);
                else
                  callback(null, finish(bytes));
              },
              progressCallback
            );
          }
        }
        __name(_hash, "_hash");
        function encodeBase64(bytes, length) {
          return base64_encode(bytes, length);
        }
        __name(encodeBase64, "encodeBase64");
        function decodeBase64(string, length) {
          return base64_decode(string, length);
        }
        __name(decodeBase64, "decodeBase64");
        var _default = _exports.default = {
          setRandomFallback,
          genSaltSync,
          genSalt,
          hashSync,
          hash: hash2,
          compareSync,
          compare,
          getRounds,
          getSalt,
          truncates,
          encodeBase64,
          decodeBase64
        };
      }
    );
  }
});

// src/config/db.js
var require_db = __commonJS({
  "src/config/db.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var bcrypt = require_umd();
    var currentDb = null;
    var initDb = /* @__PURE__ */ __name((d1Database) => {
      currentDb = d1Database;
    }, "initDb");
    var query = /* @__PURE__ */ __name(async (sql, params = []) => {
      if (!currentDb) {
        throw new Error("Database connection not initialized. Check if initDb was called.");
      }
      const formattedParams = Array.isArray(params) ? params : params !== void 0 ? [params] : [];
      const isSelect = sql.trim().toLowerCase().startsWith("select");
      try {
        if (isSelect) {
          const res = await currentDb.prepare(sql).bind(...formattedParams).all();
          return [res.results || [], null];
        } else {
          const res = await currentDb.prepare(sql).bind(...formattedParams).run();
          return [res, null];
        }
      } catch (error3) {
        console.error("Database query execution error:", error3, "SQL:", sql, "Params:", formattedParams);
        throw error3;
      }
    }, "query");
    async function initializeDatabase() {
      if (!currentDb)
        return;
      try {
        await createTables();
        const { results } = await currentDb.prepare("SELECT COUNT(*) as count FROM users").all();
        const count3 = results[0]?.count || 0;
        if (count3 === 0) {
          console.log("Database is empty. Seeding comprehensive demo data...");
          await seedDatabase();
        } else {
          console.log("Database already initialized. Skipping seeding.");
        }
      } catch (error3) {
        console.error("Failed to initialize database:", error3);
        throw error3;
      }
    }
    __name(initializeDatabase, "initializeDatabase");
    async function createTables() {
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS kitchens (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      capacity INTEGER,
      city TEXT,
      latitude REAL NULL,
      longitude REAL NULL,
      maps_url TEXT NULL
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS menus (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menuId TEXT NOT NULL,
      name TEXT NOT NULL,
      perPortion REAL NOT NULL,
      unit TEXT NOT NULL,
      FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      logistics_sku TEXT NULL,
      base_unit TEXT NOT NULL DEFAULT 'kg',
      has_packaging INTEGER DEFAULT 0,
      packaging_name TEXT NULL,
      packaging_capacity REAL NULL
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS inventory_batches (
      id TEXT PRIMARY KEY,
      inventoryId TEXT NOT NULL,
      kitchenId TEXT NOT NULL,
      container TEXT,
      weight TEXT NOT NULL,
      qty_packed INTEGER NOT NULL DEFAULT 0,
      qty_loose REAL NOT NULL DEFAULT 0.0000,
      unit TEXT NOT NULL DEFAULT 'kg',
      package_capacity REAL NULL,
      package_unit TEXT NULL,
      expiry TEXT NOT NULL,
      FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      avatar TEXT,
      kitchenId TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL DEFAULT 'password',
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS production_plans (
      id TEXT PRIMARY KEY,
      day TEXT NOT NULL,
      menuId TEXT NOT NULL,
      kitchenId TEXT NOT NULL,
      portions INTEGER NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      userId TEXT,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
      FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS production_logs (
      id TEXT PRIMARY KEY,
      kitchenId TEXT,
      menuId TEXT NOT NULL,
      servings INTEGER NOT NULL,
      startTime TEXT,
      endTime TEXT,
      qaNotes TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL,
      FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS stock_requests (
      id TEXT PRIMARY KEY,
      material TEXT NOT NULL,
      amount TEXT NOT NULL,
      urgency TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      createdAt TEXT NOT NULL,
      kitchenId TEXT NULL,
      supplierKitchenId TEXT NULL,
      note TEXT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL,
      FOREIGN KEY (supplierKitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS wastage_records (
      id TEXT PRIMARY KEY,
      kitchenId TEXT NOT NULL,
      inventoryId TEXT NOT NULL,
      weight REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'kg',
      reason TEXT NOT NULL,
      cost INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
      FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      kitchenId TEXT NOT NULL,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
    );
  `).run();
      await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS stock_verifications (
      id TEXT PRIMARY KEY,
      kitchenId TEXT NOT NULL,
      verifiedAt TEXT NOT NULL,
      verifiedBy TEXT NOT NULL,
      details TEXT NOT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
    );
  `).run();
      console.log("SQLite tables initialized successfully.");
    }
    __name(createTables, "createTables");
    async function seedDatabase() {
      try {
        const kitchens = [
          { id: "k1", name: "Dapur Pusat Jakarta", address: "Grogol, Jakarta Barat", capacity: 5e3, city: "Jakarta", latitude: -6.1668, longitude: 106.7865, maps_url: "https://www.google.com/maps/place/Grogol,+West+Jakarta+City,+Jakarta/@-6.1668,106.7865,15z" },
          { id: "k2", name: "Dapur Satelit Tangerang", address: "BSD, Tangerang Selatan", capacity: 2500, city: "Tangerang", latitude: -6.3024, longitude: 106.6522, maps_url: "https://www.google.com/maps/place/BSD+City/@-6.3024,106.6522,15z" },
          { id: "k3", name: "Production Hub Bandung", address: "Dago, Bandung", capacity: 3e3, city: "Bandung", latitude: -6.8915, longitude: 107.6106, maps_url: "https://www.google.com/maps/place/Dago,+Bandung+City,+West+Java/@-6.8915,107.6106,15z" }
        ];
        for (const k of kitchens) {
          await currentDb.prepare(
            "INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(k.id, k.name, k.address, k.capacity, k.city, k.latitude, k.longitude, k.maps_url).run();
        }
        const menus = [
          {
            id: "menu-1",
            name: "Ayam Goreng Gurih",
            ingredients: [
              { name: "Ayam Negri", perPortion: 0.25, unit: "kg" },
              { name: "Minyak Goreng", perPortion: 0.05, unit: "L" },
              { name: "Bumbu Kuning", perPortion: 0.02, unit: "kg" }
            ]
          },
          {
            id: "menu-2",
            name: "Ayam Bakar Madu",
            ingredients: [
              { name: "Ayam Negri", perPortion: 0.25, unit: "kg" },
              { name: "Kecap Manis", perPortion: 0.03, unit: "L" },
              { name: "Minyak Goreng", perPortion: 0.01, unit: "L" }
            ]
          },
          {
            id: "menu-3",
            name: "Ikan Gurame Goreng",
            ingredients: [
              { name: "Ikan Gurame", perPortion: 0.4, unit: "kg" },
              { name: "Minyak Goreng", perPortion: 0.05, unit: "L" },
              { name: "Bumbu Ikan", perPortion: 0.02, unit: "kg" }
            ]
          },
          {
            id: "menu-4",
            name: "Ikan Gurame Bakar",
            ingredients: [
              { name: "Ikan Gurame", perPortion: 0.4, unit: "kg" },
              { name: "Kecap Manis", perPortion: 0.05, unit: "L" },
              { name: "Sambal Kecap", perPortion: 0.02, unit: "kg" }
            ]
          },
          {
            id: "menu-5",
            name: "Bebek Goreng Spesial",
            ingredients: [
              { name: "Daging Bebek", perPortion: 0.3, unit: "kg" },
              { name: "Minyak Goreng", perPortion: 0.06, unit: "L" },
              { name: "Bumbu Bebek", perPortion: 0.03, unit: "kg" }
            ]
          },
          {
            id: "menu-6",
            name: "Bebek Bakar Kecap",
            ingredients: [
              { name: "Daging Bebek", perPortion: 0.3, unit: "kg" },
              { name: "Madu & Kecap", perPortion: 0.04, unit: "L" },
              { name: "Bumbu Bakar", perPortion: 0.02, unit: "kg" }
            ]
          }
        ];
        for (const menu of menus) {
          await currentDb.prepare("INSERT INTO menus (id, name) VALUES (?, ?)").bind(menu.id, menu.name).run();
          for (const ing of menu.ingredients) {
            await currentDb.prepare(
              "INSERT INTO ingredients (menuId, name, perPortion, unit) VALUES (?, ?, ?, ?)"
            ).bind(menu.id, ing.name, ing.perPortion, ing.unit).run();
          }
        }
        const inventory = [
          {
            id: "mat-1",
            name: "Ayam Negri",
            logistics_sku: "SKU-AYM-01",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Karton",
            packaging_capacity: 25,
            batches: [
              { id: "b1", kitchenId: "k1", container: "Karton", qty_packed: 6, qty_loose: 0, unit: "karton", weight: "6 karton", expiry: "2025-08-10", package_capacity: 25, package_unit: "kg" },
              { id: "b2a", kitchenId: "k2", container: "Karton", qty_packed: 8, qty_loose: 0, unit: "karton", weight: "8 karton", expiry: "2025-08-15", package_capacity: 25, package_unit: "kg" },
              { id: "b2b", kitchenId: "k3", container: "Karton", qty_packed: 5, qty_loose: 0, unit: "karton", weight: "5 karton", expiry: "2025-07-20", package_capacity: 25, package_unit: "kg" }
            ]
          },
          {
            id: "mat-2",
            name: "Minyak Goreng",
            logistics_sku: "SKU-MNG-02",
            base_unit: "L",
            has_packaging: 1,
            packaging_name: "Jerigen",
            packaging_capacity: 20,
            batches: [
              { id: "b3", kitchenId: "k1", container: "Jerigen", qty_packed: 5, qty_loose: 0, unit: "jerigen", weight: "5 jerigen", expiry: "2025-12-10", package_capacity: 20, package_unit: "L" },
              { id: "b4", kitchenId: "k2", container: "Jerigen", qty_packed: 4, qty_loose: 0, unit: "jerigen", weight: "4 jerigen", expiry: "2025-12-15", package_capacity: 20, package_unit: "L" },
              { id: "b5", kitchenId: "k3", container: "Jerigen", qty_packed: 6, qty_loose: 0, unit: "jerigen", weight: "6 jerigen", expiry: "2025-12-20", package_capacity: 20, package_unit: "L" }
            ]
          },
          {
            id: "mat-3",
            name: "Bumbu Kuning",
            logistics_sku: "SKU-BMK-03",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Box",
            packaging_capacity: 10,
            batches: [
              { id: "b6", kitchenId: "k1", container: "Box", qty_packed: 4, qty_loose: 0, unit: "box", weight: "4 box", expiry: "2025-07-01", package_capacity: 10, package_unit: "kg" },
              { id: "b6a", kitchenId: "k3", container: "Box", qty_packed: 2, qty_loose: 0, unit: "box", weight: "2 box", expiry: "2025-07-10", package_capacity: 10, package_unit: "kg" }
            ]
          },
          {
            id: "mat-4",
            name: "Kecap Manis",
            logistics_sku: "SKU-KCP-04",
            base_unit: "L",
            has_packaging: 1,
            packaging_name: "Jerigen",
            packaging_capacity: 5,
            batches: [
              { id: "b7", kitchenId: "k1", container: "Jerigen", qty_packed: 3, qty_loose: 0, unit: "jerigen", weight: "3 jerigen", expiry: "2026-01-01", package_capacity: 5, package_unit: "L" },
              { id: "b7_refill", kitchenId: "k1", container: "Kemasan Refill", qty_packed: 10, qty_loose: 0, unit: "kemasan refill", weight: "10 kemasan refill", expiry: "2026-01-05", package_capacity: 1, package_unit: "L" },
              { id: "b8", kitchenId: "k2", container: "Jerigen", qty_packed: 2, qty_loose: 0, unit: "jerigen", weight: "2 jerigen", expiry: "2025-11-20", package_capacity: 20, package_unit: "L" }
            ]
          },
          {
            id: "mat-5",
            name: "Ikan Gurame",
            logistics_sku: "SKU-IKN-05",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Karton",
            packaging_capacity: 25,
            batches: [
              { id: "b9", kitchenId: "k2", container: "Karton", qty_packed: 12, qty_loose: 0, unit: "karton", weight: "12 karton", expiry: "2025-07-15", package_capacity: 25, package_unit: "kg" },
              { id: "b9a", kitchenId: "k3", container: "Karton", qty_packed: 4, qty_loose: 0, unit: "karton", weight: "4 karton", expiry: "2025-07-25", package_capacity: 25, package_unit: "kg" }
            ]
          },
          {
            id: "mat-6",
            name: "Bumbu Ikan",
            logistics_sku: "SKU-BMI-06",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Box",
            packaging_capacity: 10,
            batches: [
              { id: "b10", kitchenId: "k2", container: "Box", qty_packed: 3, qty_loose: 0, unit: "box", weight: "3 box", expiry: "2025-08-10", package_capacity: 10, package_unit: "kg" }
            ]
          },
          {
            id: "mat-7",
            name: "Sambal Kecap",
            logistics_sku: "SKU-SBC-07",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Box",
            packaging_capacity: 10,
            batches: [
              { id: "b11", kitchenId: "k2", container: "Box", qty_packed: 2, qty_loose: 0, unit: "box", weight: "2 box", expiry: "2025-07-30", package_capacity: 10, package_unit: "kg" }
            ]
          },
          {
            id: "mat-8",
            name: "Daging Bebek",
            logistics_sku: "SKU-BBK-08",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Karton",
            packaging_capacity: 25,
            batches: [
              { id: "b12", kitchenId: "k3", container: "Karton", qty_packed: 16, qty_loose: 0, unit: "karton", weight: "16 karton", expiry: "2025-07-18", package_capacity: 25, package_unit: "kg" }
            ]
          },
          {
            id: "mat-9",
            name: "Bumbu Bebek",
            logistics_sku: "SKU-BMB-09",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Box",
            packaging_capacity: 10,
            batches: [
              { id: "b13", kitchenId: "k3", container: "Box", qty_packed: 5, qty_loose: 0, unit: "box", weight: "5 box", expiry: "2025-09-01", package_capacity: 10, package_unit: "kg" }
            ]
          },
          {
            id: "mat-10",
            name: "Madu & Kecap",
            logistics_sku: "SKU-MNK-10",
            base_unit: "L",
            has_packaging: 1,
            packaging_name: "Box",
            packaging_capacity: 10,
            batches: [
              { id: "b14", kitchenId: "k3", container: "Box", qty_packed: 4, qty_loose: 0, unit: "box", weight: "4 box", expiry: "2025-10-15", package_capacity: 10, package_unit: "L" }
            ]
          },
          {
            id: "mat-11",
            name: "Bumbu Bakar",
            logistics_sku: "SKU-BBB-11",
            base_unit: "kg",
            has_packaging: 1,
            packaging_name: "Box",
            packaging_capacity: 10,
            batches: [
              { id: "b15", kitchenId: "k1", container: "Box", qty_packed: 2, qty_loose: 0, unit: "box", weight: "2 box", expiry: "2025-08-20", package_capacity: 10, package_unit: "kg" },
              { id: "b15a", kitchenId: "k3", container: "Box", qty_packed: 3, qty_loose: 0, unit: "box", weight: "3 box", expiry: "2025-08-20", package_capacity: 10, package_unit: "kg" }
            ]
          }
        ];
        for (const item of inventory) {
          await currentDb.prepare(
            "INSERT INTO inventory (id, name, logistics_sku, base_unit, has_packaging, packaging_name, packaging_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)"
          ).bind(item.id, item.name, item.logistics_sku, item.base_unit, item.has_packaging, item.packaging_name, item.packaging_capacity).run();
          for (const batch of item.batches) {
            await currentDb.prepare(
              "INSERT INTO inventory_batches (id, inventoryId, kitchenId, container, weight, qty_packed, qty_loose, unit, expiry, package_capacity, package_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            ).bind(batch.id, item.id, batch.kitchenId, batch.container, batch.weight, batch.qty_packed, batch.qty_loose, batch.unit, batch.expiry, batch.package_capacity, batch.package_unit).run();
          }
        }
        const usersList = [
          { id: "s1", name: "Noval Admin", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=noval", kitchenId: "k1", email: "novaladiperasetya@gmail.com", password: "password" },
          { id: "s2", name: "Andi Jakarta", role: "Chef", status: "Active", avatar: "https://i.pravatar.cc/150?u=andi", kitchenId: "k1", email: "chef.jakarta@mbg.com", password: "password" },
          { id: "s3", name: "Budi Tangerang", role: "Chef", status: "Active", avatar: "https://i.pravatar.cc/150?u=budi", kitchenId: "k2", email: "chef.tangerang@mbg.com", password: "password" },
          { id: "s4", name: "Citra Bandung", role: "Chef", status: "Active", avatar: "https://i.pravatar.cc/150?u=citra", kitchenId: "k3", email: "chef.bandung@mbg.com", password: "password" },
          { id: "s5", name: "Admin MBG", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=admin", kitchenId: "k1", email: "admin@mbg.com", password: "password" },
          { id: "s6", name: "Chef Utomo", role: "Chef", status: "Active", avatar: "https://i.pravatar.cc/150?u=chefutama", kitchenId: "k1", email: "chef@mbg.com", password: "password" },
          { id: "s_k1_1", name: "Siti Rahma", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=siti", kitchenId: "k1", email: "siti.rahma@mbg.com", password: "password" },
          { id: "s_k1_2", name: "Rian Hidayat", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=rian", kitchenId: "k1", email: "rian.hidayat@mbg.com", password: "password" },
          { id: "s_k1_3", name: "Dedi Kurniawan", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=dedi", kitchenId: "k1", email: "dedi.kurniawan@mbg.com", password: "password" },
          { id: "s_k2_1", name: "Agus Pratama", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=agus", kitchenId: "k2", email: "agus.pratama@mbg.com", password: "password" },
          { id: "s_k2_2", name: "Siska Wijaya", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=siska", kitchenId: "k2", email: "siska.wijaya@mbg.com", password: "password" },
          { id: "s_k2_3", name: "Lina Marlina", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=lina", kitchenId: "k2", email: "lina.marlina@mbg.com", password: "password" },
          { id: "s_k3_1", name: "Eko Prasetyo", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=eko", kitchenId: "k3", email: "eko.prasetyo@mbg.com", password: "password" },
          { id: "s_k3_2", name: "Yudi Hermawan", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=yudi", kitchenId: "k3", email: "yudi.hermawan@mbg.com", password: "password" },
          { id: "s_k3_3", name: "Dewi Lestari", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=dewi", kitchenId: "k3", email: "dewi.lestari@mbg.com", password: "password" },
          { id: "s_test_admin", name: "Admin Test", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=s_test_admin", kitchenId: null, email: "admin.test@mbg.com", password: "password" },
          { id: "s_test_chef", name: "Head Chef Test", role: "Head Chef", status: "Active", avatar: "https://i.pravatar.cc/150?u=s_test_chef", kitchenId: null, email: "chef.test@mbg.com", password: "password" },
          { id: "s_test_staff", name: "Staff Test", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/150?u=s_test_staff", kitchenId: null, email: "staff.test@mbg.com", password: "password" }
        ];
        for (const user of usersList) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await currentDb.prepare(
            "INSERT INTO users (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(user.id, user.name, user.role, user.status, user.avatar, user.kitchenId, user.email, hashedPassword).run();
        }
        const productionPlans = [
          { id: "plan-1", day: "Senin", menuId: "menu-1", kitchenId: "k1", portions: 400, note: "Gunakan Batch b1", status: "Ready", userId: "s2" },
          { id: "plan-2", day: "Senin", menuId: "menu-3", kitchenId: "k2", portions: 200, note: "Gunakan batch b9", status: "Cooking", userId: "s3" },
          { id: "plan-3", day: "Selasa", menuId: "menu-2", kitchenId: "k1", portions: 300, note: "", status: "Preparing", userId: "s2" },
          { id: "plan-4", day: "Selasa", menuId: "menu-4", kitchenId: "k2", portions: 150, note: "", status: "Pending", userId: "s3" },
          { id: "plan-5", day: "Rabu", menuId: "menu-5", kitchenId: "k3", portions: 350, note: "Gunakan batch b12", status: "Pending", userId: "s4" },
          { id: "plan-6", day: "Rabu", menuId: "menu-6", kitchenId: "k3", portions: 200, note: "", status: "Pending", userId: "s4" },
          { id: "plan-7", day: "Kamis", menuId: "menu-1", kitchenId: "k2", portions: 250, note: "Batch b2a", status: "Pending", userId: "s3" },
          { id: "plan-8", day: "Kamis", menuId: "menu-5", kitchenId: "k1", portions: 180, note: "", status: "Pending", userId: "s6" },
          { id: "plan-9", day: "Jumat", menuId: "menu-3", kitchenId: "k3", portions: 300, note: "Batch b9a", status: "Pending", userId: "s4" },
          { id: "plan-10", day: "Jumat", menuId: "menu-2", kitchenId: "k2", portions: 220, note: "", status: "Pending", userId: "s3" }
        ];
        for (const plan of productionPlans) {
          await currentDb.prepare(
            "INSERT INTO production_plans (id, day, menuId, kitchenId, portions, note, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(plan.id, plan.day, plan.menuId, plan.kitchenId, plan.portions, plan.note, plan.status, plan.userId).run();
          const logStatus = plan.status === "NotStarted" ? "Pending" : plan.status;
          let startTime = null;
          let endTime = null;
          if (plan.status === "Cooking") {
            startTime = (/* @__PURE__ */ new Date()).toISOString();
          } else if (plan.status === "Ready") {
            startTime = new Date(Date.now() - 864e5).toISOString();
            endTime = new Date(Date.now() - 828e5).toISOString();
          }
          await currentDb.prepare(
            "INSERT INTO production_logs (id, kitchenId, menuId, servings, startTime, endTime, qaNotes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(plan.id, plan.kitchenId, plan.menuId, plan.portions, startTime, endTime, plan.note, logStatus).run();
        }
        const now = /* @__PURE__ */ new Date();
        const stockRequests = [
          { id: "sr-1", material: "Ayam Negri", amount: "10 karton", urgency: "High", status: "Approved", createdAt: new Date(now - 864e5 * 5).toISOString(), kitchenId: "k1", supplierKitchenId: null, note: "Disetujui, kirim besok pagi" },
          { id: "sr-2", material: "Minyak Goreng", amount: "5 jerigen", urgency: "Medium", status: "Pending", createdAt: new Date(now - 864e5 * 3).toISOString(), kitchenId: "k2", supplierKitchenId: null, note: null },
          { id: "sr-3", material: "Ikan Gurame", amount: "8 karton", urgency: "High", status: "Pending", createdAt: new Date(now - 864e5 * 2).toISOString(), kitchenId: "k2", supplierKitchenId: null, note: null },
          { id: "sr-4", material: "Bumbu Kuning", amount: "3 box", urgency: "Low", status: "Approved", createdAt: new Date(now - 864e5 * 7).toISOString(), kitchenId: "k1", supplierKitchenId: "k3", note: "Transfer antar dapur disetujui" },
          { id: "sr-5", material: "Daging Bebek", amount: "12 karton", urgency: "High", status: "Rejected", createdAt: new Date(now - 864e5 * 4).toISOString(), kitchenId: "k3", supplierKitchenId: null, note: "Supplier belum tersedia, coba minggu depan" },
          { id: "sr-6", material: "Kecap Manis", amount: "4 jerigen", urgency: "Medium", status: "Pending", createdAt: new Date(now - 864e5 * 1).toISOString(), kitchenId: "k1", supplierKitchenId: null, note: null },
          { id: "sr-7", material: "Bumbu Bebek", amount: "2 box", urgency: "Low", status: "Approved", createdAt: new Date(now - 864e5 * 6).toISOString(), kitchenId: "k3", supplierKitchenId: "k1", note: "Kirim dari Jakarta" },
          { id: "sr-8", material: "Sambal Kecap", amount: "1 box", urgency: "Medium", status: "Pending", createdAt: new Date(now - 864e5 * 1).toISOString(), kitchenId: "k2", supplierKitchenId: null, note: null }
        ];
        for (const sr of stockRequests) {
          await currentDb.prepare(
            "INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(sr.id, sr.material, sr.amount, sr.urgency, sr.status, sr.createdAt, sr.kitchenId, sr.supplierKitchenId, sr.note).run();
        }
        const wastageRecords = [
          { id: "W-1001", kitchenId: "k1", inventoryId: "mat-1", weight: 2.5, unit: "kg", reason: "Kadaluarsa", cost: 87500, date: "2025-06-01" },
          { id: "W-1002", kitchenId: "k1", inventoryId: "mat-2", weight: 1, unit: "L", reason: "Tumpah", cost: 35e3, date: "2025-06-02" },
          { id: "W-1003", kitchenId: "k2", inventoryId: "mat-5", weight: 3.2, unit: "kg", reason: "Busuk", cost: 112e3, date: "2025-06-01" },
          { id: "W-1004", kitchenId: "k2", inventoryId: "mat-6", weight: 0.5, unit: "kg", reason: "Kadaluarsa", cost: 17500, date: "2025-06-03" },
          { id: "W-1005", kitchenId: "k3", inventoryId: "mat-8", weight: 4, unit: "kg", reason: "Freezer Rusak", cost: 14e4, date: "2025-05-28" },
          { id: "W-1006", kitchenId: "k3", inventoryId: "mat-9", weight: 1, unit: "kg", reason: "Packaging Rusak", cost: 35e3, date: "2025-05-30" },
          { id: "W-1007", kitchenId: "k1", inventoryId: "mat-3", weight: 0.8, unit: "kg", reason: "Kadaluarsa", cost: 28e3, date: "2025-06-04" },
          { id: "W-1008", kitchenId: "k2", inventoryId: "mat-4", weight: 1.5, unit: "L", reason: "Tumpah", cost: 52500, date: "2025-06-05" },
          { id: "W-1009", kitchenId: "k3", inventoryId: "mat-10", weight: 0.5, unit: "L", reason: "Kadaluarsa", cost: 17500, date: "2025-06-03" },
          { id: "W-1010", kitchenId: "k1", inventoryId: "mat-1", weight: 1.8, unit: "kg", reason: "Sisa Produksi", cost: 63e3, date: "2025-06-06" }
        ];
        for (const w of wastageRecords) {
          await currentDb.prepare(
            "INSERT INTO wastage_records (id, kitchenId, inventoryId, weight, unit, reason, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(w.id, w.kitchenId, w.inventoryId, w.weight, w.unit, w.reason, w.cost, w.date).run();
        }
        const notifications = [
          { id: "ntf-1", kitchenId: "k1", message: "Dapur Pusat Jakarta memiliki sisa stok Ayam Negri yang kritis. Harap perhatikan!", isRead: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString() },
          { id: "ntf-2", kitchenId: "k2", message: "Peringatan: Rencana produksi Ikan Gurame Bakar (150 porsi) pada hari Selasa kekurangan bahan: Ikan Gurame (kurang 40.0 kg).", isRead: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString() },
          { id: "ntf-3", kitchenId: "k3", message: "Peringatan: Rencana produksi Bebek Goreng Spesial (350 porsi) pada hari Rabu kekurangan bahan: Daging Bebek (kurang 105.0 kg).", isRead: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString() }
        ];
        for (const n of notifications) {
          await currentDb.prepare(
            "INSERT INTO notifications (id, kitchenId, message, isRead, createdAt) VALUES (?, ?, ?, ?, ?)"
          ).bind(n.id, n.kitchenId, n.message, n.isRead, n.createdAt).run();
        }
        const stockVerifications = [
          {
            id: "v-1001",
            kitchenId: "k1",
            verifiedAt: new Date(Date.now() - 864e5).toISOString(),
            verifiedBy: "Chef Andi Jakarta",
            details: JSON.stringify([
              { batchId: "b1", qty_packed: 5, qty_loose: 12.5 },
              { batchId: "b3", qty_packed: 4, qty_loose: 8 }
            ])
          },
          {
            id: "v-1002",
            kitchenId: "k2",
            verifiedAt: new Date(Date.now() - 864e5 * 2).toISOString(),
            verifiedBy: "Chef Budi Tangerang",
            details: JSON.stringify([
              { batchId: "b2a", qty_packed: 7, qty_loose: 5 },
              { batchId: "b4", qty_packed: 3, qty_loose: 15 },
              { batchId: "b9", qty_packed: 10, qty_loose: 2 }
            ])
          },
          {
            id: "v-1002",
            kitchenId: "k2",
            verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
            verifiedBy: "Chef Budi Tangerang",
            details: JSON.stringify([
              { batchId: "b2a", qty_packed: 7, qty_loose: 5 },
              { batchId: "b4", qty_packed: 3, qty_loose: 15 }
            ])
          }
        ];
        for (const sv of stockVerifications) {
          await currentDb.prepare(
            "INSERT INTO stock_verifications (id, kitchenId, verifiedAt, verifiedBy, details) VALUES (?, ?, ?, ?, ?)"
          ).bind(sv.id, sv.kitchenId, sv.verifiedAt, sv.verifiedBy, sv.details).run();
        }
        console.log("SQLite database seeded successfully.");
      } catch (error3) {
        console.error("Error seeding SQLite database:", error3);
        throw error3;
      }
    }
    __name(seedDatabase, "seedDatabase");
    module.exports = {
      initDb,
      query,
      initializeDatabase
    };
  }
});

// node-built-in-modules:buffer
import libDefault from "buffer";
var require_buffer = __commonJS({
  "node-built-in-modules:buffer"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault;
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var buffer = require_buffer();
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    __name(copyProps, "copyProps");
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    __name(SafeBuffer, "SafeBuffer");
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node-built-in-modules:stream
import libDefault2 from "stream";
var require_stream = __commonJS({
  "node-built-in-modules:stream"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault2;
  }
});

// node_modules/unenv/dist/runtime/node/internal/util/legacy-types.mjs
var import_strip_cf_connecting_ip_header19, isRegExp, isDate, isBoolean, isNull, isNullOrUndefined, isNumber, isString, isSymbol, isUndefined, isFunction, isBuffer, isObject, isError, isPrimitive;
var init_legacy_types = __esm({
  "node_modules/unenv/dist/runtime/node/internal/util/legacy-types.mjs"() {
    import_strip_cf_connecting_ip_header19 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    isRegExp = /* @__PURE__ */ __name((val) => val instanceof RegExp, "isRegExp");
    isDate = /* @__PURE__ */ __name((val) => val instanceof Date, "isDate");
    isBoolean = /* @__PURE__ */ __name((val) => typeof val === "boolean", "isBoolean");
    isNull = /* @__PURE__ */ __name((val) => val === null, "isNull");
    isNullOrUndefined = /* @__PURE__ */ __name((val) => val === null || val === void 0, "isNullOrUndefined");
    isNumber = /* @__PURE__ */ __name((val) => typeof val === "number", "isNumber");
    isString = /* @__PURE__ */ __name((val) => typeof val === "string", "isString");
    isSymbol = /* @__PURE__ */ __name((val) => typeof val === "symbol", "isSymbol");
    isUndefined = /* @__PURE__ */ __name((val) => val === void 0, "isUndefined");
    isFunction = /* @__PURE__ */ __name((val) => typeof val === "function", "isFunction");
    isBuffer = /* @__PURE__ */ __name((val) => {
      return val && typeof val === "object" && typeof val.copy === "function" && typeof val.fill === "function" && typeof val.readUInt8 === "function";
    }, "isBuffer");
    isObject = /* @__PURE__ */ __name((val) => val !== null && typeof val === "object" && Object.getPrototypeOf(val).isPrototypeOf(Object), "isObject");
    isError = /* @__PURE__ */ __name((val) => val instanceof Error, "isError");
    isPrimitive = /* @__PURE__ */ __name((val) => {
      if (typeof val === "object") {
        return val === null;
      }
      return typeof val !== "function";
    }, "isPrimitive");
  }
});

// node_modules/unenv/dist/runtime/node/internal/util/log.mjs
var import_strip_cf_connecting_ip_header20;
var init_log = __esm({
  "node_modules/unenv/dist/runtime/node/internal/util/log.mjs"() {
    import_strip_cf_connecting_ip_header20 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/unenv/dist/runtime/node/util.mjs
import types from "node:util/types";
import { default as default2 } from "node:util/types";
var import_strip_cf_connecting_ip_header21, TextDecoder, TextEncoder, _errnoException, _exceptionWithHostPort, getSystemErrorMap, getSystemErrorName, parseEnv, styleText;
var init_util = __esm({
  "node_modules/unenv/dist/runtime/node/util.mjs"() {
    import_strip_cf_connecting_ip_header21 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_legacy_types();
    init_log();
    TextDecoder = globalThis.TextDecoder;
    TextEncoder = globalThis.TextEncoder;
    _errnoException = /* @__PURE__ */ notImplemented("util._errnoException");
    _exceptionWithHostPort = /* @__PURE__ */ notImplemented("util._exceptionWithHostPort");
    getSystemErrorMap = /* @__PURE__ */ notImplemented("util.getSystemErrorMap");
    getSystemErrorName = /* @__PURE__ */ notImplemented("util.getSystemErrorName");
    parseEnv = /* @__PURE__ */ notImplemented("util.parseEnv");
    styleText = /* @__PURE__ */ notImplemented("util.styleText");
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/util.mjs
var import_strip_cf_connecting_ip_header22, workerdUtil, MIMEParams, MIMEType, TextDecoder2, TextEncoder2, _extend, aborted, callbackify, debug3, debuglog, deprecate, format, formatWithOptions, getCallSite, inherits, inspect, isArray, isDeepStrictEqual, log3, parseArgs, promisify, stripVTControlCharacters, toUSVString, transferableAbortController, transferableAbortSignal, types2, util_default;
var init_util2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/util.mjs"() {
    import_strip_cf_connecting_ip_header22 = __toESM(require_strip_cf_connecting_ip_header(), 1);
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_util();
    workerdUtil = process.getBuiltinModule("node:util");
    ({
      MIMEParams,
      MIMEType,
      TextDecoder: TextDecoder2,
      TextEncoder: TextEncoder2,
      _extend: (
        // @ts-expect-error missing types?
        _extend
      ),
      aborted,
      callbackify,
      debug: debug3,
      debuglog,
      deprecate,
      format,
      formatWithOptions,
      getCallSite: (
        // @ts-expect-error unknown type
        getCallSite
      ),
      inherits,
      inspect,
      isArray,
      isDeepStrictEqual,
      log: log3,
      parseArgs,
      promisify,
      stripVTControlCharacters,
      toUSVString,
      transferableAbortController,
      transferableAbortSignal
    } = workerdUtil);
    types2 = workerdUtil.types;
    util_default = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      _errnoException,
      _exceptionWithHostPort,
      // @ts-expect-error unenv has unknown type
      getSystemErrorMap,
      // @ts-expect-error unenv has unknown type
      getSystemErrorName,
      isBoolean,
      isBuffer,
      isDate,
      isError,
      isFunction,
      isNull,
      isNullOrUndefined,
      isNumber,
      isObject,
      isPrimitive,
      isRegExp,
      isString,
      isSymbol,
      isUndefined,
      // @ts-expect-error unenv has unknown type
      parseEnv,
      // @ts-expect-error unenv has unknown type
      styleText,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      _extend,
      aborted,
      callbackify,
      debug: debug3,
      debuglog,
      deprecate,
      format,
      formatWithOptions,
      getCallSite,
      inherits,
      inspect,
      isArray,
      isDeepStrictEqual,
      log: log3,
      MIMEParams,
      MIMEType,
      parseArgs,
      promisify,
      stripVTControlCharacters,
      TextDecoder: TextDecoder2,
      TextEncoder: TextEncoder2,
      toUSVString,
      transferableAbortController,
      transferableAbortSignal,
      // special-cased deep merged symbols
      types: types2
    };
  }
});

// node-built-in-modules:util
var require_util = __commonJS({
  "node-built-in-modules:util"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_util2();
    module.exports = util_default;
  }
});

// node_modules/jws/lib/data-stream.js
var require_data_stream = __commonJS({
  "node_modules/jws/lib/data-stream.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_safe_buffer().Buffer;
    var Stream = require_stream();
    var util = require_util();
    function DataStream(data) {
      this.buffer = null;
      this.writable = true;
      this.readable = true;
      if (!data) {
        this.buffer = Buffer2.alloc(0);
        return this;
      }
      if (typeof data.pipe === "function") {
        this.buffer = Buffer2.alloc(0);
        data.pipe(this);
        return this;
      }
      if (data.length || typeof data === "object") {
        this.buffer = data;
        this.writable = false;
        process.nextTick(function() {
          this.emit("end", data);
          this.readable = false;
          this.emit("close");
        }.bind(this));
        return this;
      }
      throw new TypeError("Unexpected data type (" + typeof data + ")");
    }
    __name(DataStream, "DataStream");
    util.inherits(DataStream, Stream);
    DataStream.prototype.write = /* @__PURE__ */ __name(function write(data) {
      this.buffer = Buffer2.concat([this.buffer, Buffer2.from(data)]);
      this.emit("data", data);
    }, "write");
    DataStream.prototype.end = /* @__PURE__ */ __name(function end(data) {
      if (data)
        this.write(data);
      this.emit("end", data);
      this.emit("close");
      this.writable = false;
      this.readable = false;
    }, "end");
    module.exports = DataStream;
  }
});

// node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js
var require_param_bytes_for_alg = __commonJS({
  "node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function getParamSize(keySize) {
      var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
      return result;
    }
    __name(getParamSize, "getParamSize");
    var paramBytesForAlg = {
      ES256: getParamSize(256),
      ES384: getParamSize(384),
      ES512: getParamSize(521)
    };
    function getParamBytesForAlg(alg) {
      var paramBytes = paramBytesForAlg[alg];
      if (paramBytes) {
        return paramBytes;
      }
      throw new Error('Unknown algorithm "' + alg + '"');
    }
    __name(getParamBytesForAlg, "getParamBytesForAlg");
    module.exports = getParamBytesForAlg;
  }
});

// node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js
var require_ecdsa_sig_formatter = __commonJS({
  "node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_safe_buffer().Buffer;
    var getParamBytesForAlg = require_param_bytes_for_alg();
    var MAX_OCTET = 128;
    var CLASS_UNIVERSAL = 0;
    var PRIMITIVE_BIT = 32;
    var TAG_SEQ = 16;
    var TAG_INT = 2;
    var ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6;
    var ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
    function base64Url(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    __name(base64Url, "base64Url");
    function signatureAsBuffer(signature) {
      if (Buffer2.isBuffer(signature)) {
        return signature;
      } else if ("string" === typeof signature) {
        return Buffer2.from(signature, "base64");
      }
      throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
    }
    __name(signatureAsBuffer, "signatureAsBuffer");
    function derToJose(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var maxEncodedParamLength = paramBytes + 1;
      var inputLength = signature.length;
      var offset = 0;
      if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
      }
      var seqLength = signature[offset++];
      if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
      }
      if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
      }
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
      }
      var rLength = signature[offset++];
      if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
      }
      if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var rOffset = offset;
      offset += rLength;
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
      }
      var sLength = signature[offset++];
      if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
      }
      if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var sOffset = offset;
      offset += sLength;
      if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
      }
      var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
      var dst = Buffer2.allocUnsafe(rPadding + rLength + sPadding + sLength);
      for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
      offset = paramBytes;
      for (var o = offset; offset < o + sPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
      dst = dst.toString("base64");
      dst = base64Url(dst);
      return dst;
    }
    __name(derToJose, "derToJose");
    function countPadding(buf, start, stop) {
      var padding = 0;
      while (start + padding < stop && buf[start + padding] === 0) {
        ++padding;
      }
      var needsSign = buf[start + padding] >= MAX_OCTET;
      if (needsSign) {
        --padding;
      }
      return padding;
    }
    __name(countPadding, "countPadding");
    function joseToDer(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var signatureBytes = signature.length;
      if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
      }
      var rPadding = countPadding(signature, 0, paramBytes);
      var sPadding = countPadding(signature, paramBytes, signature.length);
      var rLength = paramBytes - rPadding;
      var sLength = paramBytes - sPadding;
      var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
      var shortLength = rsBytes < MAX_OCTET;
      var dst = Buffer2.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
      var offset = 0;
      dst[offset++] = ENCODED_TAG_SEQ;
      if (shortLength) {
        dst[offset++] = rsBytes;
      } else {
        dst[offset++] = MAX_OCTET | 1;
        dst[offset++] = rsBytes & 255;
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = rLength;
      if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
      } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = sLength;
      if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
      } else {
        signature.copy(dst, offset, paramBytes + sPadding);
      }
      return dst;
    }
    __name(joseToDer, "joseToDer");
    module.exports = {
      derToJose,
      joseToDer
    };
  }
});

// node_modules/buffer-equal-constant-time/index.js
var require_buffer_equal_constant_time = __commonJS({
  "node_modules/buffer-equal-constant-time/index.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_buffer().Buffer;
    var SlowBuffer = require_buffer().SlowBuffer;
    module.exports = bufferEq;
    function bufferEq(a, b) {
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      var c = 0;
      for (var i = 0; i < a.length; i++) {
        c |= a[i] ^ b[i];
      }
      return c === 0;
    }
    __name(bufferEq, "bufferEq");
    bufferEq.install = function() {
      Buffer2.prototype.equal = SlowBuffer.prototype.equal = /* @__PURE__ */ __name(function equal(that) {
        return bufferEq(this, that);
      }, "equal");
    };
    var origBufEqual = Buffer2.prototype.equal;
    var origSlowBufEqual = SlowBuffer.prototype.equal;
    bufferEq.restore = function() {
      Buffer2.prototype.equal = origBufEqual;
      SlowBuffer.prototype.equal = origSlowBufEqual;
    };
  }
});

// node_modules/jwa/index.js
var require_jwa = __commonJS({
  "node_modules/jwa/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto2 = require_crypto();
    var formatEcdsa = require_ecdsa_sig_formatter();
    var util = require_util();
    var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
    var MSG_INVALID_SECRET = "secret must be a string or buffer";
    var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
    var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
    var supportsKeyObjects = typeof crypto2.createPublicKey === "function";
    if (supportsKeyObjects) {
      MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
      MSG_INVALID_SECRET += "or a KeyObject";
    }
    function checkIsPublicKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key !== "object") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.type !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.asymmetricKeyType !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
    }
    __name(checkIsPublicKey, "checkIsPublicKey");
    function checkIsPrivateKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return;
      }
      if (typeof key === "object") {
        return;
      }
      throw typeError(MSG_INVALID_SIGNER_KEY);
    }
    __name(checkIsPrivateKey, "checkIsPrivateKey");
    function checkIsSecretKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return key;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key !== "object") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (key.type !== "secret") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_SECRET);
      }
    }
    __name(checkIsSecretKey, "checkIsSecretKey");
    function fromBase64(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    __name(fromBase64, "fromBase64");
    function toBase64(base64url) {
      base64url = base64url.toString();
      var padding = 4 - base64url.length % 4;
      if (padding !== 4) {
        for (var i = 0; i < padding; ++i) {
          base64url += "=";
        }
      }
      return base64url.replace(/\-/g, "+").replace(/_/g, "/");
    }
    __name(toBase64, "toBase64");
    function typeError(template) {
      var args = [].slice.call(arguments, 1);
      var errMsg = util.format.bind(util, template).apply(null, args);
      return new TypeError(errMsg);
    }
    __name(typeError, "typeError");
    function bufferOrString(obj) {
      return Buffer2.isBuffer(obj) || typeof obj === "string";
    }
    __name(bufferOrString, "bufferOrString");
    function normalizeInput(thing) {
      if (!bufferOrString(thing))
        thing = JSON.stringify(thing);
      return thing;
    }
    __name(normalizeInput, "normalizeInput");
    function createHmacSigner(bits) {
      return /* @__PURE__ */ __name(function sign2(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto2.createHmac("sha" + bits, secret);
        var sig = (hmac.update(thing), hmac.digest("base64"));
        return fromBase64(sig);
      }, "sign");
    }
    __name(createHmacSigner, "createHmacSigner");
    var bufferEqual;
    var timingSafeEqual2 = "timingSafeEqual" in crypto2 ? /* @__PURE__ */ __name(function timingSafeEqual3(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      return crypto2.timingSafeEqual(a, b);
    }, "timingSafeEqual") : /* @__PURE__ */ __name(function timingSafeEqual3(a, b) {
      if (!bufferEqual) {
        bufferEqual = require_buffer_equal_constant_time();
      }
      return bufferEqual(a, b);
    }, "timingSafeEqual");
    function createHmacVerifier(bits) {
      return /* @__PURE__ */ __name(function verify2(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return timingSafeEqual2(Buffer2.from(signature), Buffer2.from(computedSig));
      }, "verify");
    }
    __name(createHmacVerifier, "createHmacVerifier");
    function createKeySigner(bits) {
      return /* @__PURE__ */ __name(function sign2(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto2.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
        return fromBase64(sig);
      }, "sign");
    }
    __name(createKeySigner, "createKeySigner");
    function createKeyVerifier(bits) {
      return /* @__PURE__ */ __name(function verify2(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto2.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, "base64");
      }, "verify");
    }
    __name(createKeyVerifier, "createKeyVerifier");
    function createPSSKeySigner(bits) {
      return /* @__PURE__ */ __name(function sign2(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto2.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign({
          key: privateKey,
          padding: crypto2.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto2.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
        return fromBase64(sig);
      }, "sign");
    }
    __name(createPSSKeySigner, "createPSSKeySigner");
    function createPSSKeyVerifier(bits) {
      return /* @__PURE__ */ __name(function verify2(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto2.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify({
          key: publicKey,
          padding: crypto2.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto2.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, "base64");
      }, "verify");
    }
    __name(createPSSKeyVerifier, "createPSSKeyVerifier");
    function createECDSASigner(bits) {
      var inner = createKeySigner(bits);
      return /* @__PURE__ */ __name(function sign2() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, "ES" + bits);
        return signature;
      }, "sign");
    }
    __name(createECDSASigner, "createECDSASigner");
    function createECDSAVerifer(bits) {
      var inner = createKeyVerifier(bits);
      return /* @__PURE__ */ __name(function verify2(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
        var result = inner(thing, signature, publicKey);
        return result;
      }, "verify");
    }
    __name(createECDSAVerifer, "createECDSAVerifer");
    function createNoneSigner() {
      return /* @__PURE__ */ __name(function sign2() {
        return "";
      }, "sign");
    }
    __name(createNoneSigner, "createNoneSigner");
    function createNoneVerifier() {
      return /* @__PURE__ */ __name(function verify2(thing, signature) {
        return signature === "";
      }, "verify");
    }
    __name(createNoneVerifier, "createNoneVerifier");
    module.exports = /* @__PURE__ */ __name(function jwa(algorithm) {
      var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
      };
      var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
      };
      var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
      if (!match)
        throw typeError(MSG_INVALID_ALGORITHM, algorithm);
      var algo = (match[1] || match[3]).toLowerCase();
      var bits = match[2];
      return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
      };
    }, "jwa");
  }
});

// node_modules/jws/lib/tostring.js
var require_tostring = __commonJS({
  "node_modules/jws/lib/tostring.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_buffer().Buffer;
    module.exports = /* @__PURE__ */ __name(function toString(obj) {
      if (typeof obj === "string")
        return obj;
      if (typeof obj === "number" || Buffer2.isBuffer(obj))
        return obj.toString();
      return JSON.stringify(obj);
    }, "toString");
  }
});

// node_modules/jws/lib/sign-stream.js
var require_sign_stream = __commonJS({
  "node_modules/jws/lib/sign-stream.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require_stream();
    var toString = require_tostring();
    var util = require_util();
    function base64url(string, encoding) {
      return Buffer2.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    __name(base64url, "base64url");
    function jwsSecuredInput(header, payload, encoding) {
      encoding = encoding || "utf8";
      var encodedHeader = base64url(toString(header), "binary");
      var encodedPayload = base64url(toString(payload), encoding);
      return util.format("%s.%s", encodedHeader, encodedPayload);
    }
    __name(jwsSecuredInput, "jwsSecuredInput");
    function jwsSign(opts) {
      var header = opts.header;
      var payload = opts.payload;
      var secretOrKey = opts.secret || opts.privateKey;
      var encoding = opts.encoding;
      var algo = jwa(header.alg);
      var securedInput = jwsSecuredInput(header, payload, encoding);
      var signature = algo.sign(securedInput, secretOrKey);
      return util.format("%s.%s", securedInput, signature);
    }
    __name(jwsSign, "jwsSign");
    function SignStream(opts) {
      var secret = opts.secret;
      secret = secret == null ? opts.privateKey : secret;
      secret = secret == null ? opts.key : secret;
      if (/^hs/i.test(opts.header.alg) === true && secret == null) {
        throw new TypeError("secret must be a string or buffer or a KeyObject");
      }
      var secretStream = new DataStream(secret);
      this.readable = true;
      this.header = opts.header;
      this.encoding = opts.encoding;
      this.secret = this.privateKey = this.key = secretStream;
      this.payload = new DataStream(opts.payload);
      this.secret.once("close", function() {
        if (!this.payload.writable && this.readable)
          this.sign();
      }.bind(this));
      this.payload.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.sign();
      }.bind(this));
    }
    __name(SignStream, "SignStream");
    util.inherits(SignStream, Stream);
    SignStream.prototype.sign = /* @__PURE__ */ __name(function sign2() {
      try {
        var signature = jwsSign({
          header: this.header,
          payload: this.payload.buffer,
          secret: this.secret.buffer,
          encoding: this.encoding
        });
        this.emit("done", signature);
        this.emit("data", signature);
        this.emit("end");
        this.readable = false;
        return signature;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    }, "sign");
    SignStream.sign = jwsSign;
    module.exports = SignStream;
  }
});

// node_modules/jws/lib/verify-stream.js
var require_verify_stream = __commonJS({
  "node_modules/jws/lib/verify-stream.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require_stream();
    var toString = require_tostring();
    var util = require_util();
    var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
    function isObject2(thing) {
      return Object.prototype.toString.call(thing) === "[object Object]";
    }
    __name(isObject2, "isObject");
    function safeJsonParse(thing) {
      if (isObject2(thing))
        return thing;
      try {
        return JSON.parse(thing);
      } catch (e) {
        return void 0;
      }
    }
    __name(safeJsonParse, "safeJsonParse");
    function headerFromJWS(jwsSig) {
      var encodedHeader = jwsSig.split(".", 1)[0];
      return safeJsonParse(Buffer2.from(encodedHeader, "base64").toString("binary"));
    }
    __name(headerFromJWS, "headerFromJWS");
    function securedInputFromJWS(jwsSig) {
      return jwsSig.split(".", 2).join(".");
    }
    __name(securedInputFromJWS, "securedInputFromJWS");
    function signatureFromJWS(jwsSig) {
      return jwsSig.split(".")[2];
    }
    __name(signatureFromJWS, "signatureFromJWS");
    function payloadFromJWS(jwsSig, encoding) {
      encoding = encoding || "utf8";
      var payload = jwsSig.split(".")[1];
      return Buffer2.from(payload, "base64").toString(encoding);
    }
    __name(payloadFromJWS, "payloadFromJWS");
    function isValidJws(string) {
      return JWS_REGEX.test(string) && !!headerFromJWS(string);
    }
    __name(isValidJws, "isValidJws");
    function jwsVerify(jwsSig, algorithm, secretOrKey) {
      if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
      }
      jwsSig = toString(jwsSig);
      var signature = signatureFromJWS(jwsSig);
      var securedInput = securedInputFromJWS(jwsSig);
      var algo = jwa(algorithm);
      return algo.verify(securedInput, signature, secretOrKey);
    }
    __name(jwsVerify, "jwsVerify");
    function jwsDecode(jwsSig, opts) {
      opts = opts || {};
      jwsSig = toString(jwsSig);
      if (!isValidJws(jwsSig))
        return null;
      var header = headerFromJWS(jwsSig);
      if (!header)
        return null;
      var payload = payloadFromJWS(jwsSig);
      if (header.typ === "JWT" || opts.json)
        payload = JSON.parse(payload, opts.encoding);
      return {
        header,
        payload,
        signature: signatureFromJWS(jwsSig)
      };
    }
    __name(jwsDecode, "jwsDecode");
    function VerifyStream(opts) {
      opts = opts || {};
      var secretOrKey = opts.secret;
      secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
      secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
      if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
        throw new TypeError("secret must be a string or buffer or a KeyObject");
      }
      var secretStream = new DataStream(secretOrKey);
      this.readable = true;
      this.algorithm = opts.algorithm;
      this.encoding = opts.encoding;
      this.secret = this.publicKey = this.key = secretStream;
      this.signature = new DataStream(opts.signature);
      this.secret.once("close", function() {
        if (!this.signature.writable && this.readable)
          this.verify();
      }.bind(this));
      this.signature.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.verify();
      }.bind(this));
    }
    __name(VerifyStream, "VerifyStream");
    util.inherits(VerifyStream, Stream);
    VerifyStream.prototype.verify = /* @__PURE__ */ __name(function verify2() {
      try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit("done", valid, obj);
        this.emit("data", valid);
        this.emit("end");
        this.readable = false;
        return valid;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    }, "verify");
    VerifyStream.decode = jwsDecode;
    VerifyStream.isValid = isValidJws;
    VerifyStream.verify = jwsVerify;
    module.exports = VerifyStream;
  }
});

// node_modules/jws/index.js
var require_jws = __commonJS({
  "node_modules/jws/index.js"(exports) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SignStream = require_sign_stream();
    var VerifyStream = require_verify_stream();
    var ALGORITHMS = [
      "HS256",
      "HS384",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "PS256",
      "PS384",
      "PS512",
      "ES256",
      "ES384",
      "ES512"
    ];
    exports.ALGORITHMS = ALGORITHMS;
    exports.sign = SignStream.sign;
    exports.verify = VerifyStream.verify;
    exports.decode = VerifyStream.decode;
    exports.isValid = VerifyStream.isValid;
    exports.createSign = /* @__PURE__ */ __name(function createSign2(opts) {
      return new SignStream(opts);
    }, "createSign");
    exports.createVerify = /* @__PURE__ */ __name(function createVerify2(opts) {
      return new VerifyStream(opts);
    }, "createVerify");
  }
});

// node_modules/jsonwebtoken/decode.js
var require_decode = __commonJS({
  "node_modules/jsonwebtoken/decode.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var jws = require_jws();
    module.exports = function(jwt, options) {
      options = options || {};
      var decoded = jws.decode(jwt, options);
      if (!decoded) {
        return null;
      }
      var payload = decoded.payload;
      if (typeof payload === "string") {
        try {
          var obj = JSON.parse(payload);
          if (obj !== null && typeof obj === "object") {
            payload = obj;
          }
        } catch (e) {
        }
      }
      if (options.complete === true) {
        return {
          header: decoded.header,
          payload,
          signature: decoded.signature
        };
      }
      return payload;
    };
  }
});

// node_modules/jsonwebtoken/lib/JsonWebTokenError.js
var require_JsonWebTokenError = __commonJS({
  "node_modules/jsonwebtoken/lib/JsonWebTokenError.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var JsonWebTokenError = /* @__PURE__ */ __name(function(message, error3) {
      Error.call(this, message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "JsonWebTokenError";
      this.message = message;
      if (error3)
        this.inner = error3;
    }, "JsonWebTokenError");
    JsonWebTokenError.prototype = Object.create(Error.prototype);
    JsonWebTokenError.prototype.constructor = JsonWebTokenError;
    module.exports = JsonWebTokenError;
  }
});

// node_modules/jsonwebtoken/lib/NotBeforeError.js
var require_NotBeforeError = __commonJS({
  "node_modules/jsonwebtoken/lib/NotBeforeError.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = /* @__PURE__ */ __name(function(message, date) {
      JsonWebTokenError.call(this, message);
      this.name = "NotBeforeError";
      this.date = date;
    }, "NotBeforeError");
    NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
    NotBeforeError.prototype.constructor = NotBeforeError;
    module.exports = NotBeforeError;
  }
});

// node_modules/jsonwebtoken/lib/TokenExpiredError.js
var require_TokenExpiredError = __commonJS({
  "node_modules/jsonwebtoken/lib/TokenExpiredError.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var JsonWebTokenError = require_JsonWebTokenError();
    var TokenExpiredError = /* @__PURE__ */ __name(function(message, expiredAt) {
      JsonWebTokenError.call(this, message);
      this.name = "TokenExpiredError";
      this.expiredAt = expiredAt;
    }, "TokenExpiredError");
    TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
    TokenExpiredError.prototype.constructor = TokenExpiredError;
    module.exports = TokenExpiredError;
  }
});

// node_modules/jsonwebtoken/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/jsonwebtoken/node_modules/ms/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    __name(parse, "parse");
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    __name(fmtShort, "fmtShort");
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    __name(fmtLong, "fmtLong");
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
    __name(plural, "plural");
  }
});

// node_modules/jsonwebtoken/lib/timespan.js
var require_timespan = __commonJS({
  "node_modules/jsonwebtoken/lib/timespan.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ms = require_ms();
    module.exports = function(time3, iat) {
      var timestamp = iat || Math.floor(Date.now() / 1e3);
      if (typeof time3 === "string") {
        var milliseconds = ms(time3);
        if (typeof milliseconds === "undefined") {
          return;
        }
        return Math.floor(timestamp + milliseconds / 1e3);
      } else if (typeof time3 === "number") {
        return timestamp + time3;
      } else {
        return;
      }
    };
  }
});

// node_modules/semver/internal/constants.js
var require_constants3 = __commonJS({
  "node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var debug4 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug4;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants3();
    var debug4 = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = /* @__PURE__ */ __name((value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    }, "makeSafeRegex");
    var createToken = /* @__PURE__ */ __name((name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug4(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    }, "createToken");
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = /* @__PURE__ */ __name((options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    }, "parseOptions");
    module.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = /* @__PURE__ */ __name((a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }, "compareIdentifiers");
    var rcompareIdentifiers = /* @__PURE__ */ __name((a, b) => compareIdentifiers(b, a), "rcompareIdentifiers");
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var debug4 = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants3();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class {
      constructor(version2, options) {
        options = parseOptions(options);
        if (version2 instanceof SemVer) {
          if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
            return version2;
          } else {
            version2 = version2.version;
          }
        } else if (typeof version2 !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version2}".`);
        }
        if (version2.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug4("SemVer", version2, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version2.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version2}`);
        }
        this.raw = version2;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug4("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug4("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug4("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release2, identifier, identifierBase) {
        if (release2.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release2) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release2}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    __name(SemVer, "SemVer");
    module.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var parse = /* @__PURE__ */ __name((version2, options, throwErrors = false) => {
      if (version2 instanceof SemVer) {
        return version2;
      }
      try {
        return new SemVer(version2, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    }, "parse");
    module.exports = parse;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var parse = require_parse();
    var valid = /* @__PURE__ */ __name((version2, options) => {
      const v = parse(version2, options);
      return v ? v.version : null;
    }, "valid");
    module.exports = valid;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var parse = require_parse();
    var clean = /* @__PURE__ */ __name((version2, options) => {
      const s = parse(version2.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }, "clean");
    module.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var inc = /* @__PURE__ */ __name((version2, release2, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version2 instanceof SemVer ? version2.version : version2,
          options
        ).inc(release2, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    }, "inc");
    module.exports = inc;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var parse = require_parse();
    var diff = /* @__PURE__ */ __name((version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    }, "diff");
    module.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var major = /* @__PURE__ */ __name((a, loose) => new SemVer(a, loose).major, "major");
    module.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var minor = /* @__PURE__ */ __name((a, loose) => new SemVer(a, loose).minor, "minor");
    module.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var patch = /* @__PURE__ */ __name((a, loose) => new SemVer(a, loose).patch, "patch");
    module.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var parse = require_parse();
    var prerelease = /* @__PURE__ */ __name((version2, options) => {
      const parsed = parse(version2, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }, "prerelease");
    module.exports = prerelease;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var compare = /* @__PURE__ */ __name((a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose)), "compare");
    module.exports = compare;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var rcompare = /* @__PURE__ */ __name((a, b, loose) => compare(b, a, loose), "rcompare");
    module.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var compareLoose = /* @__PURE__ */ __name((a, b) => compare(a, b, true), "compareLoose");
    module.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var compareBuild = /* @__PURE__ */ __name((a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    }, "compareBuild");
    module.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compareBuild = require_compare_build();
    var sort = /* @__PURE__ */ __name((list, loose) => list.sort((a, b) => compareBuild(a, b, loose)), "sort");
    module.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compareBuild = require_compare_build();
    var rsort = /* @__PURE__ */ __name((list, loose) => list.sort((a, b) => compareBuild(b, a, loose)), "rsort");
    module.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var gt = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) > 0, "gt");
    module.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var lt = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) < 0, "lt");
    module.exports = lt;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var eq = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) === 0, "eq");
    module.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var neq = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) !== 0, "neq");
    module.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var gte = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) >= 0, "gte");
    module.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var compare = require_compare();
    var lte = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) <= 0, "lte");
    module.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = /* @__PURE__ */ __name((a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    }, "cmp");
    module.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = /* @__PURE__ */ __name((version2, options) => {
      if (version2 instanceof SemVer) {
        return version2;
      }
      if (typeof version2 === "number") {
        version2 = String(version2);
      }
      if (typeof version2 !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version2.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    }, "coerce");
    module.exports = coerce;
  }
});

// node_modules/semver/functions/truncate.js
var require_truncate = __commonJS({
  "node_modules/semver/functions/truncate.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var parse = require_parse();
    var constants2 = require_constants3();
    var SemVer = require_semver();
    var truncate = /* @__PURE__ */ __name((version2, truncation, options) => {
      if (!constants2.RELEASE_TYPES.includes(truncation)) {
        return null;
      }
      const clonedVersion = cloneInputVersion(version2, options);
      return clonedVersion && doTruncation(clonedVersion, truncation);
    }, "truncate");
    var cloneInputVersion = /* @__PURE__ */ __name((version2, options) => {
      const versionStringToParse = version2 instanceof SemVer ? version2.version : version2;
      return parse(versionStringToParse, options);
    }, "cloneInputVersion");
    var doTruncation = /* @__PURE__ */ __name((version2, truncation) => {
      if (isPrerelease(truncation)) {
        return version2.version;
      }
      version2.prerelease = [];
      switch (truncation) {
        case "major":
          version2.minor = 0;
          version2.patch = 0;
          break;
        case "minor":
          version2.patch = 0;
          break;
      }
      return version2.format();
    }, "doTruncation");
    var isPrerelease = /* @__PURE__ */ __name((type) => {
      return type.startsWith("pre");
    }, "isPrerelease");
    module.exports = truncate;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    __name(LRUCache, "LRUCache");
    module.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug4("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug4("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug4("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug4("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug4("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug4("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version2) {
        if (!version2) {
          return false;
        }
        if (typeof version2 === "string") {
          try {
            version2 = new SemVer(version2, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version2, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    __name(Range, "Range");
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug4 = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants3();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = /* @__PURE__ */ __name((c) => c.value === "<0.0.0-0", "isNullSet");
    var isAny = /* @__PURE__ */ __name((c) => c.value === "", "isAny");
    var isSatisfiable = /* @__PURE__ */ __name((comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    }, "isSatisfiable");
    var parseComparator = /* @__PURE__ */ __name((comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug4("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug4("caret", comp);
      comp = replaceTildes(comp, options);
      debug4("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug4("xrange", comp);
      comp = replaceStars(comp, options);
      debug4("stars", comp);
      return comp;
    }, "parseComparator");
    var isX = /* @__PURE__ */ __name((id) => !id || id.toLowerCase() === "x" || id === "*", "isX");
    var replaceTildes = /* @__PURE__ */ __name((comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    }, "replaceTildes");
    var replaceTilde = /* @__PURE__ */ __name((comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug4("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug4("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug4("tilde return", ret);
        return ret;
      });
    }, "replaceTilde");
    var replaceCarets = /* @__PURE__ */ __name((comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    }, "replaceCarets");
    var replaceCaret = /* @__PURE__ */ __name((comp, options) => {
      debug4("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug4("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug4("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug4("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug4("caret return", ret);
        return ret;
      });
    }, "replaceCaret");
    var replaceXRanges = /* @__PURE__ */ __name((comp, options) => {
      debug4("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    }, "replaceXRanges");
    var replaceXRange = /* @__PURE__ */ __name((comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug4("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug4("xRange return", ret);
        return ret;
      });
    }, "replaceXRange");
    var replaceStars = /* @__PURE__ */ __name((comp, options) => {
      debug4("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    }, "replaceStars");
    var replaceGTE0 = /* @__PURE__ */ __name((comp, options) => {
      debug4("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    }, "replaceGTE0");
    var hyphenReplace = /* @__PURE__ */ __name((incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    }, "hyphenReplace");
    var testSet = /* @__PURE__ */ __name((set, version2, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version2)) {
          return false;
        }
      }
      if (version2.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug4(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }, "testSet");
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ANY = Symbol("SemVer ANY");
    var Comparator = class {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug4("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug4("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version2) {
        debug4("Comparator.test", version2, this.options.loose);
        if (this.semver === ANY || version2 === ANY) {
          return true;
        }
        if (typeof version2 === "string") {
          try {
            version2 = new SemVer(version2, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version2, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    __name(Comparator, "Comparator");
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug4 = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Range = require_range();
    var satisfies = /* @__PURE__ */ __name((version2, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version2);
    }, "satisfies");
    module.exports = satisfies;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Range = require_range();
    var toComparators = /* @__PURE__ */ __name((range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" ")), "toComparators");
    module.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = /* @__PURE__ */ __name((versions2, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions2.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    }, "maxSatisfying");
    module.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = /* @__PURE__ */ __name((versions2, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions2.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    }, "minSatisfying");
    module.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = /* @__PURE__ */ __name((range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }, "minVersion");
    module.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Range = require_range();
    var validRange = /* @__PURE__ */ __name((range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }, "validRange");
    module.exports = validRange;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = /* @__PURE__ */ __name((version2, range, hilo, options) => {
      version2 = new SemVer(version2, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version2, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
          return false;
        }
      }
      return true;
    }, "outside");
    module.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var outside = require_outside();
    var gtr = /* @__PURE__ */ __name((version2, range, options) => outside(version2, range, ">", options), "gtr");
    module.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var outside = require_outside();
    var ltr = /* @__PURE__ */ __name((version2, range, options) => outside(version2, range, "<", options), "ltr");
    module.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Range = require_range();
    var intersects = /* @__PURE__ */ __name((r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    }, "intersects");
    module.exports = intersects;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions2, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions2.sort((a, b) => compare(a, b, options));
      for (const version2 of v) {
        const included = satisfies(version2, range, options);
        if (included) {
          prev = version2;
          if (!first) {
            first = version2;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = /* @__PURE__ */ __name((sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER:
        for (const simpleSub of sub.set) {
          for (const simpleDom of dom.set) {
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
              continue OUTER;
            }
          }
          if (sawNonNull) {
            return false;
          }
        }
      return true;
    }, "subset");
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = /* @__PURE__ */ __name((sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !c.test(gt.semver)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !c.test(lt.semver)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    }, "simpleSubset");
    var higherGT = /* @__PURE__ */ __name((a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    }, "higherGT");
    var lowerLT = /* @__PURE__ */ __name((a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    }, "lowerLT");
    module.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/semver/index.js"(exports, module) {
    "use strict";
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var internalRe = require_re();
    var constants2 = require_constants3();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var truncate = require_truncate();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      truncate,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants2.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js
var require_asymmetricKeyDetailsSupported = __commonJS({
  "node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var semver = require_semver2();
    module.exports = semver.satisfies(process.version, ">=15.7.0");
  }
});

// node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js
var require_rsaPssKeyDetailsSupported = __commonJS({
  "node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var semver = require_semver2();
    module.exports = semver.satisfies(process.version, ">=16.9.0");
  }
});

// node_modules/jsonwebtoken/lib/validateAsymmetricKey.js
var require_validateAsymmetricKey = __commonJS({
  "node_modules/jsonwebtoken/lib/validateAsymmetricKey.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ASYMMETRIC_KEY_DETAILS_SUPPORTED = require_asymmetricKeyDetailsSupported();
    var RSA_PSS_KEY_DETAILS_SUPPORTED = require_rsaPssKeyDetailsSupported();
    var allowedAlgorithmsForKeys = {
      "ec": ["ES256", "ES384", "ES512"],
      "rsa": ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    };
    var allowedCurves = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
    module.exports = function(algorithm, key) {
      if (!algorithm || !key)
        return;
      const keyType = key.asymmetricKeyType;
      if (!keyType)
        return;
      const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
      if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
      }
      if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
      }
      if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch (keyType) {
          case "ec":
            const keyCurve = key.asymmetricKeyDetails.namedCurve;
            const allowedCurve = allowedCurves[algorithm];
            if (keyCurve !== allowedCurve) {
              throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
            }
            break;
          case "rsa-pss":
            if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
              const length = parseInt(algorithm.slice(-3), 10);
              const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
              if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
              }
              if (saltLength !== void 0 && saltLength > length >> 3) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
              }
            }
            break;
        }
      }
    };
  }
});

// node_modules/jsonwebtoken/lib/psSupported.js
var require_psSupported = __commonJS({
  "node_modules/jsonwebtoken/lib/psSupported.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var semver = require_semver2();
    module.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");
  }
});

// node_modules/jsonwebtoken/verify.js
var require_verify = __commonJS({
  "node_modules/jsonwebtoken/verify.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = require_NotBeforeError();
    var TokenExpiredError = require_TokenExpiredError();
    var decode = require_decode();
    var timespan = require_timespan();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var PS_SUPPORTED = require_psSupported();
    var jws = require_jws();
    var { KeyObject: KeyObject2, createSecretKey: createSecretKey2, createPublicKey: createPublicKey2 } = require_crypto();
    var PUB_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var EC_KEY_ALGS = ["ES256", "ES384", "ES512"];
    var RSA_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var HS_ALGS = ["HS256", "HS384", "HS512"];
    if (PS_SUPPORTED) {
      PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
      RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
    }
    module.exports = function(jwtString, secretOrPublicKey, options, callback) {
      if (typeof options === "function" && !callback) {
        callback = options;
        options = {};
      }
      if (!options) {
        options = {};
      }
      options = Object.assign({}, options);
      let done;
      if (callback) {
        done = callback;
      } else {
        done = /* @__PURE__ */ __name(function(err, data) {
          if (err)
            throw err;
          return data;
        }, "done");
      }
      if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
        return done(new JsonWebTokenError("clockTimestamp must be a number"));
      }
      if (options.nonce !== void 0 && (typeof options.nonce !== "string" || options.nonce.trim() === "")) {
        return done(new JsonWebTokenError("nonce must be a non-empty string"));
      }
      if (options.allowInvalidAsymmetricKeyTypes !== void 0 && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean") {
        return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
      }
      const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1e3);
      if (!jwtString) {
        return done(new JsonWebTokenError("jwt must be provided"));
      }
      if (typeof jwtString !== "string") {
        return done(new JsonWebTokenError("jwt must be a string"));
      }
      const parts = jwtString.split(".");
      if (parts.length !== 3) {
        return done(new JsonWebTokenError("jwt malformed"));
      }
      let decodedToken;
      try {
        decodedToken = decode(jwtString, { complete: true });
      } catch (err) {
        return done(err);
      }
      if (!decodedToken) {
        return done(new JsonWebTokenError("invalid token"));
      }
      const header = decodedToken.header;
      let getSecret;
      if (typeof secretOrPublicKey === "function") {
        if (!callback) {
          return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
        }
        getSecret = secretOrPublicKey;
      } else {
        getSecret = /* @__PURE__ */ __name(function(header2, secretCallback) {
          return secretCallback(null, secretOrPublicKey);
        }, "getSecret");
      }
      return getSecret(header, function(err, secretOrPublicKey2) {
        if (err) {
          return done(new JsonWebTokenError("error in secret or public key callback: " + err.message));
        }
        const hasSignature = parts[2].trim() !== "";
        if (!hasSignature && secretOrPublicKey2) {
          return done(new JsonWebTokenError("jwt signature is required"));
        }
        if (hasSignature && !secretOrPublicKey2) {
          return done(new JsonWebTokenError("secret or public key must be provided"));
        }
        if (!hasSignature && !options.algorithms) {
          return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey2 != null && !(secretOrPublicKey2 instanceof KeyObject2)) {
          try {
            secretOrPublicKey2 = createPublicKey2(secretOrPublicKey2);
          } catch (_) {
            try {
              secretOrPublicKey2 = createSecretKey2(typeof secretOrPublicKey2 === "string" ? Buffer.from(secretOrPublicKey2) : secretOrPublicKey2);
            } catch (_2) {
              return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
            }
          }
        }
        if (!options.algorithms) {
          if (secretOrPublicKey2.type === "secret") {
            options.algorithms = HS_ALGS;
          } else if (["rsa", "rsa-pss"].includes(secretOrPublicKey2.asymmetricKeyType)) {
            options.algorithms = RSA_KEY_ALGS;
          } else if (secretOrPublicKey2.asymmetricKeyType === "ec") {
            options.algorithms = EC_KEY_ALGS;
          } else {
            options.algorithms = PUB_KEY_ALGS;
          }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
          return done(new JsonWebTokenError("invalid algorithm"));
        }
        if (header.alg.startsWith("HS") && secretOrPublicKey2.type !== "secret") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey2.type !== "public") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
          try {
            validateAsymmetricKey(header.alg, secretOrPublicKey2);
          } catch (e) {
            return done(e);
          }
        }
        let valid;
        try {
          valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey2);
        } catch (e) {
          return done(e);
        }
        if (!valid) {
          return done(new JsonWebTokenError("invalid signature"));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
          if (typeof payload.nbf !== "number") {
            return done(new JsonWebTokenError("invalid nbf value"));
          }
          if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
            return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1e3)));
          }
        }
        if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
          if (typeof payload.exp !== "number") {
            return done(new JsonWebTokenError("invalid exp value"));
          }
          if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1e3)));
          }
        }
        if (options.audience) {
          const audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
          const target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
          const match = target.some(function(targetAudience) {
            return audiences.some(function(audience) {
              return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
            });
          });
          if (!match) {
            return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
          }
        }
        if (options.issuer) {
          const invalid_issuer = typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
          if (invalid_issuer) {
            return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
          }
        }
        if (options.subject) {
          if (payload.sub !== options.subject) {
            return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
          }
        }
        if (options.jwtid) {
          if (payload.jti !== options.jwtid) {
            return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
          }
        }
        if (options.nonce) {
          if (payload.nonce !== options.nonce) {
            return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
          }
        }
        if (options.maxAge) {
          if (typeof payload.iat !== "number") {
            return done(new JsonWebTokenError("iat required when maxAge is specified"));
          }
          const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
          if (typeof maxAgeTimestamp === "undefined") {
            return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
          }
          if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1e3)));
          }
        }
        if (options.complete === true) {
          const signature = decodedToken.signature;
          return done(null, {
            header,
            payload,
            signature
          });
        }
        return done(null, payload);
      });
    };
  }
});

// node_modules/lodash.includes/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.includes/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var freeParseInt = parseInt;
    function arrayMap(array, iteratee) {
      var index = -1, length = array ? array.length : 0, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    __name(arrayMap, "arrayMap");
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    __name(baseFindIndex, "baseFindIndex");
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    __name(baseIndexOf, "baseIndexOf");
    function baseIsNaN(value) {
      return value !== value;
    }
    __name(baseIsNaN, "baseIsNaN");
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    __name(baseTimes, "baseTimes");
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    __name(baseValues, "baseValues");
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    __name(overArg, "overArg");
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeKeys = overArg(Object.keys, Object);
    var nativeMax = Math.max;
    function arrayLikeKeys(value, inherited) {
      var result = isArray2(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    __name(arrayLikeKeys, "arrayLikeKeys");
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    __name(baseKeys, "baseKeys");
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    __name(isIndex, "isIndex");
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    __name(isPrototype, "isPrototype");
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString2(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
    }
    __name(includes, "includes");
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    __name(isArguments, "isArguments");
    var isArray2 = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction2(value);
    }
    __name(isArrayLike, "isArrayLike");
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    __name(isArrayLikeObject, "isArrayLikeObject");
    function isFunction2(value) {
      var tag = isObject2(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    __name(isFunction2, "isFunction");
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    __name(isLength, "isLength");
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function isString2(value) {
      return typeof value == "string" || !isArray2(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    __name(isString2, "isString");
    function isSymbol2(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    __name(isSymbol2, "isSymbol");
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign2 = value < 0 ? -1 : 1;
        return sign2 * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    __name(toFinite, "toFinite");
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    __name(toInteger, "toInteger");
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol2(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    __name(toNumber, "toNumber");
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    __name(keys, "keys");
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }
    __name(values, "values");
    module.exports = includes;
  }
});

// node_modules/lodash.isboolean/index.js
var require_lodash2 = __commonJS({
  "node_modules/lodash.isboolean/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var boolTag = "[object Boolean]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isBoolean2(value) {
      return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
    }
    __name(isBoolean2, "isBoolean");
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    module.exports = isBoolean2;
  }
});

// node_modules/lodash.isinteger/index.js
var require_lodash3 = __commonJS({
  "node_modules/lodash.isinteger/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isInteger(value) {
      return typeof value == "number" && value == toInteger(value);
    }
    __name(isInteger, "isInteger");
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function isSymbol2(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    __name(isSymbol2, "isSymbol");
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign2 = value < 0 ? -1 : 1;
        return sign2 * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    __name(toFinite, "toFinite");
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    __name(toInteger, "toInteger");
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol2(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    __name(toNumber, "toNumber");
    module.exports = isInteger;
  }
});

// node_modules/lodash.isnumber/index.js
var require_lodash4 = __commonJS({
  "node_modules/lodash.isnumber/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var numberTag = "[object Number]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function isNumber2(value) {
      return typeof value == "number" || isObjectLike(value) && objectToString.call(value) == numberTag;
    }
    __name(isNumber2, "isNumber");
    module.exports = isNumber2;
  }
});

// node_modules/lodash.isplainobject/index.js
var require_lodash5 = __commonJS({
  "node_modules/lodash.isplainobject/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var objectTag = "[object Object]";
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    __name(isHostObject, "isHostObject");
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    __name(overArg, "overArg");
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    var objectToString = objectProto.toString;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function isPlainObject(value) {
      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    __name(isPlainObject, "isPlainObject");
    module.exports = isPlainObject;
  }
});

// node_modules/lodash.isstring/index.js
var require_lodash6 = __commonJS({
  "node_modules/lodash.isstring/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var stringTag = "[object String]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var isArray2 = Array.isArray;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function isString2(value) {
      return typeof value == "string" || !isArray2(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    __name(isString2, "isString");
    module.exports = isString2;
  }
});

// node_modules/lodash.once/index.js
var require_lodash7 = __commonJS({
  "node_modules/lodash.once/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var FUNC_ERROR_TEXT = "Expected a function";
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function before(n, func) {
      var result;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = void 0;
        }
        return result;
      };
    }
    __name(before, "before");
    function once2(func) {
      return before(2, func);
    }
    __name(once2, "once");
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function isSymbol2(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    __name(isSymbol2, "isSymbol");
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign2 = value < 0 ? -1 : 1;
        return sign2 * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    __name(toFinite, "toFinite");
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    __name(toInteger, "toInteger");
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol2(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    __name(toNumber, "toNumber");
    module.exports = once2;
  }
});

// node_modules/jsonwebtoken/sign.js
var require_sign = __commonJS({
  "node_modules/jsonwebtoken/sign.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var timespan = require_timespan();
    var PS_SUPPORTED = require_psSupported();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var jws = require_jws();
    var includes = require_lodash();
    var isBoolean2 = require_lodash2();
    var isInteger = require_lodash3();
    var isNumber2 = require_lodash4();
    var isPlainObject = require_lodash5();
    var isString2 = require_lodash6();
    var once2 = require_lodash7();
    var { KeyObject: KeyObject2, createSecretKey: createSecretKey2, createPrivateKey: createPrivateKey2 } = require_crypto();
    var SUPPORTED_ALGS = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (PS_SUPPORTED) {
      SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
    }
    var sign_options_schema = {
      expiresIn: { isValid: function(value) {
        return isInteger(value) || isString2(value) && value;
      }, message: '"expiresIn" should be a number of seconds or string representing a timespan' },
      notBefore: { isValid: function(value) {
        return isInteger(value) || isString2(value) && value;
      }, message: '"notBefore" should be a number of seconds or string representing a timespan' },
      audience: { isValid: function(value) {
        return isString2(value) || Array.isArray(value);
      }, message: '"audience" must be a string or array' },
      algorithm: { isValid: includes.bind(null, SUPPORTED_ALGS), message: '"algorithm" must be a valid string enum value' },
      header: { isValid: isPlainObject, message: '"header" must be an object' },
      encoding: { isValid: isString2, message: '"encoding" must be a string' },
      issuer: { isValid: isString2, message: '"issuer" must be a string' },
      subject: { isValid: isString2, message: '"subject" must be a string' },
      jwtid: { isValid: isString2, message: '"jwtid" must be a string' },
      noTimestamp: { isValid: isBoolean2, message: '"noTimestamp" must be a boolean' },
      keyid: { isValid: isString2, message: '"keyid" must be a string' },
      mutatePayload: { isValid: isBoolean2, message: '"mutatePayload" must be a boolean' },
      allowInsecureKeySizes: { isValid: isBoolean2, message: '"allowInsecureKeySizes" must be a boolean' },
      allowInvalidAsymmetricKeyTypes: { isValid: isBoolean2, message: '"allowInvalidAsymmetricKeyTypes" must be a boolean' }
    };
    var registered_claims_schema = {
      iat: { isValid: isNumber2, message: '"iat" should be a number of seconds' },
      exp: { isValid: isNumber2, message: '"exp" should be a number of seconds' },
      nbf: { isValid: isNumber2, message: '"nbf" should be a number of seconds' }
    };
    function validate(schema, allowUnknown, object, parameterName) {
      if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
      }
      Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
          if (!allowUnknown) {
            throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
          }
          return;
        }
        if (!validator.isValid(object[key])) {
          throw new Error(validator.message);
        }
      });
    }
    __name(validate, "validate");
    function validateOptions(options) {
      return validate(sign_options_schema, false, options, "options");
    }
    __name(validateOptions, "validateOptions");
    function validatePayload(payload) {
      return validate(registered_claims_schema, true, payload, "payload");
    }
    __name(validatePayload, "validatePayload");
    var options_to_payload = {
      "audience": "aud",
      "issuer": "iss",
      "subject": "sub",
      "jwtid": "jti"
    };
    var options_for_objects = [
      "expiresIn",
      "notBefore",
      "noTimestamp",
      "audience",
      "issuer",
      "subject",
      "jwtid"
    ];
    module.exports = function(payload, secretOrPrivateKey, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
      const isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload);
      const header = Object.assign({
        alg: options.algorithm || "HS256",
        typ: isObjectPayload ? "JWT" : void 0,
        kid: options.keyid
      }, options.header);
      function failure(err) {
        if (callback) {
          return callback(err);
        }
        throw err;
      }
      __name(failure, "failure");
      if (!secretOrPrivateKey && options.algorithm !== "none") {
        return failure(new Error("secretOrPrivateKey must have a value"));
      }
      if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject2)) {
        try {
          secretOrPrivateKey = createPrivateKey2(secretOrPrivateKey);
        } catch (_) {
          try {
            secretOrPrivateKey = createSecretKey2(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
          } catch (_2) {
            return failure(new Error("secretOrPrivateKey is not valid key material"));
          }
        }
      }
      if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret") {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
      } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== "private") {
          return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== void 0 && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
          return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
      }
      if (typeof payload === "undefined") {
        return failure(new Error("payload is required"));
      } else if (isObjectPayload) {
        try {
          validatePayload(payload);
        } catch (error3) {
          return failure(error3);
        }
        if (!options.mutatePayload) {
          payload = Object.assign({}, payload);
        }
      } else {
        const invalid_options = options_for_objects.filter(function(opt) {
          return typeof options[opt] !== "undefined";
        });
        if (invalid_options.length > 0) {
          return failure(new Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
        }
      }
      if (typeof payload.exp !== "undefined" && typeof options.expiresIn !== "undefined") {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
      }
      if (typeof payload.nbf !== "undefined" && typeof options.notBefore !== "undefined") {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
      }
      try {
        validateOptions(options);
      } catch (error3) {
        return failure(error3);
      }
      if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
          validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error3) {
          return failure(error3);
        }
      }
      const timestamp = payload.iat || Math.floor(Date.now() / 1e3);
      if (options.noTimestamp) {
        delete payload.iat;
      } else if (isObjectPayload) {
        payload.iat = timestamp;
      }
      if (typeof options.notBefore !== "undefined") {
        try {
          payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
          return failure(err);
        }
        if (typeof payload.nbf === "undefined") {
          return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
        try {
          payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
          return failure(err);
        }
        if (typeof payload.exp === "undefined") {
          return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== "undefined") {
          if (typeof payload[claim] !== "undefined") {
            return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
          }
          payload[claim] = options[key];
        }
      });
      const encoding = options.encoding || "utf8";
      if (typeof callback === "function") {
        callback = callback && once2(callback);
        jws.createSign({
          header,
          privateKey: secretOrPrivateKey,
          payload,
          encoding
        }).once("error", callback).once("done", function(signature) {
          if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
          }
          callback(null, signature);
        });
      } else {
        let signature = jws.sign({ header, payload, secret: secretOrPrivateKey, encoding });
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
          throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
      }
    };
  }
});

// node_modules/jsonwebtoken/index.js
var require_jsonwebtoken = __commonJS({
  "node_modules/jsonwebtoken/index.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = {
      decode: require_decode(),
      verify: require_verify(),
      sign: require_sign(),
      JsonWebTokenError: require_JsonWebTokenError(),
      NotBeforeError: require_NotBeforeError(),
      TokenExpiredError: require_TokenExpiredError()
    };
  }
});

// src/middlewares/authMiddleware.js
var require_authMiddleware = __commonJS({
  "src/middlewares/authMiddleware.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var jwt = require_jsonwebtoken();
    var db2 = require_db();
    var JWT_SECRET = process.env.JWT_SECRET || "mbgflow_secret_key_12345";
    async function protect(req, res, next) {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
          token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, JWT_SECRET);
          const [rows] = await db2.query("SELECT id, name, role, email, status, avatar, kitchenId FROM users WHERE id = ?", [decoded.id]);
          if (rows.length === 0) {
            return res.status(401).json({ error: "Tidak terotorisasi, pengguna tidak ditemukan." });
          }
          req.user = rows[0];
          return next();
        } catch (error3) {
          console.error("Auth verification error:", error3);
          return res.status(401).json({ error: "Tidak terotorisasi, token gagal diverifikasi." });
        }
      }
      if (!token) {
        return res.status(401).json({ error: "Tidak terotorisasi, tidak ada token." });
      }
    }
    __name(protect, "protect");
    module.exports = {
      protect,
      JWT_SECRET
    };
  }
});

// src/controllers/authController.js
var require_authController = __commonJS({
  "src/controllers/authController.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var bcrypt = require_umd();
    var jwt = require_jsonwebtoken();
    var db2 = require_db();
    var { JWT_SECRET } = require_authMiddleware();
    var delay = /* @__PURE__ */ __name((ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)), "delay");
    async function login(req, res) {
      await delay(150);
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email dan password wajib diisi." });
      }
      try {
        const [rows] = await db2.query("SELECT * FROM users WHERE LOWER(email) = ?", [email.toLowerCase()]);
        if (rows.length === 0) {
          return res.status(401).json({ error: "Kredensial tidak valid: email tidak terdaftar." });
        }
        const user = rows[0];
        let isMatch = false;
        if (user.password.startsWith("$2")) {
          isMatch = await bcrypt.compare(password, user.password);
        } else {
          isMatch = user.password === password;
        }
        if (!isMatch) {
          return res.status(401).json({ error: "Kata sandi salah. Silakan coba lagi." });
        }
        const allowedRoles = ["Admin", "Chef", "Head Chef"];
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ error: "Akses ditolak. Staf dapur dan Perwakilan sekolah tidak diizinkan mengakses website ini." });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
          expiresIn: "30d"
        });
        const { password: _, ...userWithoutPassword } = user;
        res.json({
          success: true,
          token,
          user: userWithoutPassword
        });
      } catch (error3) {
        console.error("Login error:", error3);
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
      }
    }
    __name(login, "login");
    async function getUsers(req, res) {
      await delay(50);
      try {
        const [rows] = await db2.query("SELECT id, name, role, status, avatar, kitchenId, email FROM users");
        res.json(rows);
      } catch (error3) {
        console.error("Users list error:", error3);
        res.status(500).json({ error: "Server error fetching users." });
      }
    }
    __name(getUsers, "getUsers");
    async function updateUser(req, res) {
      await delay(100);
      const { id } = req.params;
      const { name, email, role, password } = req.body;
      try {
        const [rows] = await db2.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }
        const current = rows[0];
        if (email && email.toLowerCase() !== current.email.toLowerCase()) {
          const [existing] = await db2.query("SELECT * FROM users WHERE LOWER(email) = ? AND id != ?", [email.toLowerCase(), id]);
          if (existing.length > 0) {
            return res.status(400).json({ error: "Email sudah terdaftar." });
          }
        }
        let passwordHash = current.password;
        if (password) {
          const bcrypt2 = require_umd();
          passwordHash = await bcrypt2.hash(password, 10);
        }
        const updated = {
          name: name || current.name,
          email: email ? email.toLowerCase() : current.email,
          role: role || current.role,
          password: passwordHash
        };
        await db2.query(
          "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?",
          [updated.name, updated.email, updated.role, updated.password, id]
        );
        res.json({ success: true, message: "User successfully updated." });
      } catch (error3) {
        console.error("Update user error:", error3);
        res.status(500).json({ error: "Server error updating user." });
      }
    }
    __name(updateUser, "updateUser");
    async function deleteUser(req, res) {
      await delay(100);
      const { id } = req.params;
      try {
        const [rows] = await db2.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }
        await db2.query("UPDATE users SET kitchenId = NULL WHERE id = ?", [id]);
        res.json({ success: true, message: "User successfully unassigned from kitchen." });
      } catch (error3) {
        console.error("Delete user error:", error3);
        res.status(500).json({ error: "Server error deleting/unassigning user." });
      }
    }
    __name(deleteUser, "deleteUser");
    module.exports = {
      login,
      getUsers,
      updateUser,
      deleteUser
    };
  }
});

// src/utils/expressCompat.js
var require_expressCompat = __commonJS({
  "src/utils/expressCompat.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var toExpress = /* @__PURE__ */ __name((handler) => {
      return async (c) => {
        let body = {};
        if (c.req.method !== "GET" && c.req.method !== "HEAD") {
          try {
            body = await c.req.json();
          } catch (e) {
            try {
              body = await c.req.parseBody();
            } catch (_) {
            }
          }
        }
        const req = {
          body,
          params: c.req.param(),
          query: c.req.query(),
          headers: c.req.header() || {},
          user: c.get("user")
        };
        let status = 200;
        let sentResponse = null;
        return new Promise(async (resolve, reject) => {
          const res = {
            status(code) {
              status = code;
              return this;
            },
            json(data) {
              sentResponse = c.json(data, status);
              resolve(sentResponse);
              return this;
            },
            send(data) {
              if (typeof data === "object") {
                sentResponse = c.json(data, status);
              } else {
                sentResponse = c.text(data, status);
              }
              resolve(sentResponse);
              return this;
            }
          };
          try {
            await handler(req, res, () => {
              resolve(c.text("", status));
            });
          } catch (error3) {
            console.error("Express handler wrapper error:", error3);
            reject(error3);
          }
        });
      };
    }, "toExpress");
    var toExpressMiddleware = /* @__PURE__ */ __name((middleware) => {
      return async (c, next) => {
        let body = {};
        if (c.req.method !== "GET" && c.req.method !== "HEAD") {
          try {
            body = await c.req.json();
          } catch (e) {
            try {
              body = await c.req.parseBody();
            } catch (_) {
            }
          }
        }
        const req = {
          body,
          params: c.req.param(),
          query: c.req.query(),
          headers: c.req.header() || {},
          user: c.get("user")
        };
        let status = 200;
        let middlewareResponse = null;
        let nextCalled = false;
        const res = {
          status(code) {
            status = code;
            return this;
          },
          json(data) {
            middlewareResponse = c.json(data, status);
            return this;
          },
          send(data) {
            if (typeof data === "object") {
              middlewareResponse = c.json(data, status);
            } else {
              middlewareResponse = c.text(data, status);
            }
            return this;
          }
        };
        await middleware(req, res, () => {
          nextCalled = true;
        });
        if (nextCalled) {
          if (req.user) {
            c.set("user", req.user);
          }
          return await next();
        }
        return middlewareResponse || c.json({ error: "Unauthorized" }, status);
      };
    }, "toExpressMiddleware");
    module.exports = {
      toExpress,
      toExpressMiddleware
    };
  }
});

// src/routes/authRoutes.js
var require_authRoutes = __commonJS({
  "src/routes/authRoutes.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { Hono: Hono3 } = require_cjs();
    var router = new Hono3();
    var authController = require_authController();
    var { protect } = require_authMiddleware();
    var { toExpress, toExpressMiddleware } = require_expressCompat();
    router.post("/login", toExpress(authController.login));
    router.get("/users", toExpressMiddleware(protect), toExpress(authController.getUsers));
    router.put("/users/:id", toExpressMiddleware(protect), toExpress(authController.updateUser));
    router.delete("/users/:id", toExpressMiddleware(protect), toExpress(authController.deleteUser));
    module.exports = router;
  }
});

// src/utils/formatters.js
var require_formatters = __commonJS({
  "src/utils/formatters.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function formatSingleBatch(qty_packed, qty_loose, container, package_capacity, package_unit) {
      const qPacked = Number(qty_packed) || 0;
      const qLoose = Number(qty_loose) || 0;
      const cap = Number(package_capacity);
      const pkgU = (package_unit || "").trim();
      if (!isNaN(cap) && cap > 0 && pkgU) {
        const totalVal2 = qPacked * cap + qLoose;
        let totalStr = "";
        const pkgULower = pkgU.toLowerCase();
        if (pkgULower === "kg" && totalVal2 < 1 && totalVal2 > 0) {
          totalStr = `${Math.round(totalVal2 * 1e3)} g`;
        } else if (pkgULower === "l" && totalVal2 < 1 && totalVal2 > 0) {
          totalStr = `${Math.round(totalVal2 * 1e3)} ml`;
        } else {
          totalStr = `${parseFloat(totalVal2.toFixed(2))} ${pkgU}`;
        }
        return totalStr;
      }
      const totalVal = qLoose || qPacked;
      const u = (container || "kg").trim();
      const uLower = u.toLowerCase();
      if (totalVal === 0) {
        return `0 ${u}`;
      }
      if (uLower === "kg" && totalVal < 1) {
        return `${Math.round(totalVal * 1e3)} g`;
      }
      if (uLower === "l" && totalVal < 1) {
        return `${Math.round(totalVal * 1e3)} ml`;
      }
      const rounded = parseFloat(totalVal.toFixed(2));
      return `${rounded} ${u}`;
    }
    __name(formatSingleBatch, "formatSingleBatch");
    module.exports = {
      formatSingleBatch
    };
  }
});

// src/utils/unitConverter.js
var require_unitConverter = __commonJS({
  "src/utils/unitConverter.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function convertUnit(value, fromUnit, toUnit, package_capacity, package_unit) {
      const val = Number(value) || 0;
      const f = (fromUnit || "").toLowerCase().trim();
      const t = (toUnit || "").toLowerCase().trim();
      if (f === t)
        return val;
      if (f === "kg" && t === "g")
        return val * 1e3;
      if (f === "g" && t === "kg")
        return val / 1e3;
      if (f === "l" && t === "ml")
        return val * 1e3;
      if (f === "ml" && t === "l")
        return val / 1e3;
      const cap = Number(package_capacity);
      const pkgU = (package_unit || "").trim().toLowerCase();
      if (!isNaN(cap) && cap > 0 && pkgU) {
        const isFromPkg = f !== "kg" && f !== "g" && f !== "l" && f !== "ml";
        const isToPkg = t !== "kg" && t !== "g" && t !== "l" && t !== "ml";
        if (isFromPkg && !isToPkg) {
          const valInStandardPkgUnit = val * cap;
          return convertUnit(valInStandardPkgUnit, pkgU, t);
        }
        if (!isFromPkg && isToPkg) {
          const valInStandardPkgUnit = convertUnit(val, f, pkgU);
          return valInStandardPkgUnit / cap;
        }
      }
      return val;
    }
    __name(convertUnit, "convertUnit");
    function getDisplayUnit(weight_value, unit, package_capacity, package_unit) {
      const val = Number(weight_value) || 0;
      const u = (unit || "kg").trim();
      const cap = Number(package_capacity);
      const pkgU = (package_unit || "").trim();
      if (!isNaN(cap) && cap > 0 && pkgU) {
        const pkgULower = pkgU.toLowerCase();
        const totalVal = val * cap;
        if (pkgULower === "kg" && totalVal < 1 && totalVal > 0)
          return "g";
        if (pkgULower === "l" && totalVal < 1 && totalVal > 0)
          return "ml";
        return pkgU;
      }
      const uLower = u.toLowerCase();
      if (uLower === "kg" && val < 1 && val > 0)
        return "g";
      if (uLower === "l" && val < 1 && val > 0)
        return "ml";
      return u;
    }
    __name(getDisplayUnit, "getDisplayUnit");
    function aggregateStock(itemBatches) {
      if (!itemBatches || itemBatches.length === 0) {
        return { totalWeight: "0 kg", volume: 0 };
      }
      let weightSumKg = 0;
      let volumeSumL = 0;
      let hasWeights = false;
      let hasVolumes = false;
      for (const b of itemBatches) {
        const qtyPacked = Number(b.qty_packed) || 0;
        const qtyLoose = Number(b.qty_loose) || 0;
        const u = (b.unit || "kg").trim();
        const uLower = u.toLowerCase();
        const cap = Number(b.package_capacity);
        const pkgUnit = (b.package_unit || "").trim().toLowerCase();
        let val = 0;
        if (!isNaN(cap) && cap > 0 && pkgUnit) {
          val = qtyPacked * cap + qtyLoose;
        } else {
          val = qtyLoose || Number(b.weight_value) || 0;
        }
        const targetUnit = pkgUnit || uLower;
        if (targetUnit === "kg" || targetUnit === "g") {
          hasWeights = true;
          weightSumKg += targetUnit === "g" ? val / 1e3 : val;
        } else if (targetUnit === "l" || targetUnit === "ml") {
          hasVolumes = true;
          volumeSumL += targetUnit === "ml" ? val / 1e3 : val;
        } else {
          hasWeights = true;
          weightSumKg += val;
        }
      }
      const parts = [];
      let progressVal = 0;
      if (hasWeights) {
        if (weightSumKg < 1 && weightSumKg > 0) {
          parts.push(`${Math.round(weightSumKg * 1e3)} g`);
        } else {
          parts.push(`${parseFloat(weightSumKg.toFixed(2))} kg`);
        }
        progressVal += weightSumKg;
      }
      if (hasVolumes) {
        if (volumeSumL < 1 && volumeSumL > 0) {
          parts.push(`${Math.round(volumeSumL * 1e3)} ml`);
        } else {
          parts.push(`${parseFloat(volumeSumL.toFixed(2))} L`);
        }
        progressVal += volumeSumL;
      }
      const totalWeight = parts.join(" - ") || "0 kg";
      const volume = Math.min(progressVal / 500 * 100, 100);
      return { totalWeight, volume };
    }
    __name(aggregateStock, "aggregateStock");
    module.exports = {
      convertUnit,
      getDisplayUnit,
      aggregateStock
    };
  }
});

// src/controllers/kitchenController.js
var require_kitchenController = __commonJS({
  "src/controllers/kitchenController.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var db2 = require_db();
    var { formatSingleBatch } = require_formatters();
    var { aggregateStock } = require_unitConverter();
    var delay = /* @__PURE__ */ __name((ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)), "delay");
    async function getKitchens(req, res) {
      await delay(50);
      try {
        const [rows] = await db2.query("SELECT * FROM kitchens");
        res.json(rows);
      } catch (error3) {
        console.error("Kitchens list error:", error3);
        res.status(500).json({ error: "Server error fetching kitchens list." });
      }
    }
    __name(getKitchens, "getKitchens");
    async function createKitchen(req, res) {
      await delay(100);
      const { name, address, capacity, city, latitude, longitude, staffIds, maps_url } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Kitchen name is required." });
      }
      let guessedCity = city || "Unknown";
      if (!city && address) {
        guessedCity = address.split(",")[0].trim();
      }
      const id = `k${Date.now()}`;
      const newKitchen = {
        id,
        name,
        address: address || "",
        capacity: Number(capacity) || 0,
        city: guessedCity,
        latitude: latitude !== void 0 ? Number(latitude) : null,
        longitude: longitude !== void 0 ? Number(longitude) : null,
        maps_url: maps_url || null
      };
      try {
        await db2.query(
          "INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [newKitchen.id, newKitchen.name, newKitchen.address, newKitchen.capacity, newKitchen.city, newKitchen.latitude, newKitchen.longitude, newKitchen.maps_url]
        );
        if (Array.isArray(staffIds) && staffIds.length > 0) {
          const placeholders = staffIds.map(() => "?").join(",");
          await db2.query(
            `UPDATE users SET kitchenId = ? WHERE id IN (${placeholders})`,
            [newKitchen.id, ...staffIds]
          );
        }
        res.status(201).json(newKitchen);
      } catch (error3) {
        console.error("Create kitchen error:", error3);
        res.status(500).json({ error: "Server error creating kitchen." });
      }
    }
    __name(createKitchen, "createKitchen");
    async function updateKitchen(req, res) {
      await delay(100);
      const { id } = req.params;
      const { name, address, capacity, city, latitude, longitude, maps_url } = req.body;
      try {
        const [rows] = await db2.query("SELECT * FROM kitchens WHERE id = ?", [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: "Kitchen not found." });
        }
        const current = rows[0];
        const updated = {
          name: name || current.name,
          address: address || current.address,
          capacity: capacity !== void 0 ? Number(capacity) : current.capacity,
          city: city || (address ? address.split(",")[0].trim() : current.city),
          latitude: latitude !== void 0 ? Number(latitude) : current.latitude,
          longitude: longitude !== void 0 ? Number(longitude) : current.longitude,
          maps_url: maps_url !== void 0 ? maps_url : current.maps_url
        };
        await db2.query(
          "UPDATE kitchens SET name = ?, address = ?, capacity = ?, city = ?, latitude = ?, longitude = ?, maps_url = ? WHERE id = ?",
          [updated.name, updated.address, updated.capacity, updated.city, updated.latitude, updated.longitude, updated.maps_url, id]
        );
        res.json({ id, ...updated });
      } catch (error3) {
        console.error("Update kitchen error:", error3);
        res.status(500).json({ error: "Server error updating kitchen." });
      }
    }
    __name(updateKitchen, "updateKitchen");
    async function deleteKitchen(req, res) {
      await delay(100);
      const { id } = req.params;
      try {
        const [rows] = await db2.query("SELECT * FROM kitchens WHERE id = ?", [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: "Kitchen not found." });
        }
        await db2.query("DELETE FROM kitchens WHERE id = ?", [id]);
        res.json(rows[0]);
      } catch (error3) {
        console.error("Delete kitchen error:", error3);
        res.status(500).json({ error: "Server error deleting kitchen." });
      }
    }
    __name(deleteKitchen, "deleteKitchen");
    async function getKitchenDetail(req, res) {
      await delay(100);
      const { id } = req.params;
      try {
        const [kitchens] = await db2.query("SELECT * FROM kitchens WHERE id = ?", [id]);
        if (kitchens.length === 0) {
          return res.status(404).json({ error: "Kitchen not found." });
        }
        const kitchen = kitchens[0];
        const [activeProductions] = await db2.query(
          `SELECT pl.*, m.name as menu, k.name as kitchen, k.city
       FROM production_logs pl
       JOIN menus m ON pl.menuId = m.id
       JOIN kitchens k ON pl.kitchenId = k.id
       WHERE pl.kitchenId = ? AND pl.status != 'Done'`,
          [id]
        );
        const [userList] = await db2.query("SELECT * FROM users WHERE kitchenId = ? AND role IN ('Admin', 'Chef', 'Head Chef', 'Staff')", [id]);
        const [inventoryItems] = await db2.query("SELECT * FROM inventory");
        const [batches] = await db2.query("SELECT * FROM inventory_batches WHERE kitchenId = ?", [id]);
        const kitchenInventory = inventoryItems.map((item) => {
          const dbBatches = batches.filter((b) => b.inventoryId === item.id);
          if (dbBatches.length === 0)
            return null;
          const itemBatches = dbBatches.map((b) => {
            const qtyPacked = Number(b.qty_packed) || 0;
            const qtyLoose = Number(b.qty_loose) || 0;
            const cap = b.package_capacity !== null ? Number(b.package_capacity) : null;
            const totalVal = cap !== null && cap > 0 ? qtyPacked * cap + qtyLoose : qtyLoose;
            const formattedWeight = formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit);
            return {
              id: b.id,
              kitchenId: b.kitchenId,
              container: b.container,
              qty_packed: qtyPacked,
              qty_loose: qtyLoose,
              weight_value: totalVal,
              unit: b.unit,
              weight: formattedWeight,
              package_capacity: cap,
              package_unit: b.package_unit,
              expiry: b.expiry ? b.expiry.toISOString().split("T")[0] : ""
            };
          });
          const { totalWeight, volume } = aggregateStock(itemBatches);
          return {
            id: item.id,
            name: item.name,
            logistics_sku: item.logistics_sku,
            base_unit: item.base_unit,
            has_packaging: item.has_packaging,
            packaging_name: item.packaging_name,
            packaging_capacity: item.packaging_capacity !== null ? Number(item.packaging_capacity) : null,
            volume,
            totalWeight,
            batches: itemBatches
          };
        }).filter(Boolean);
        res.json({
          ...kitchen,
          staff: userList,
          shifts: [
            { type: "Pagi", time: "06:00 - 14:00", staffCount: 6, avatars: ["https://i.pravatar.cc/150?u=a1", "https://i.pravatar.cc/150?u=a2"] },
            { type: "Sore", time: "14:00 - 22:00", staffCount: 4, avatars: ["https://i.pravatar.cc/150?u=a3"] }
          ],
          stock: kitchenInventory,
          activeProductions
        });
      } catch (error3) {
        console.error("Kitchen detail error:", error3);
        res.status(500).json({ error: "Server error fetching kitchen detail." });
      }
    }
    __name(getKitchenDetail, "getKitchenDetail");
    async function parseMapsUrl(req, res) {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required." });
      }
      try {
        let targetUrl = url;
        if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            redirect: "follow"
          });
          targetUrl = response.url;
        }
        let latitude = null;
        let longitude = null;
        const atMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) {
          latitude = parseFloat(atMatch[1]);
          longitude = parseFloat(atMatch[2]);
        } else {
          const queryMatch = targetUrl.match(/[?&](q|query|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (queryMatch) {
            latitude = parseFloat(queryMatch[2]);
            longitude = parseFloat(queryMatch[3]);
          } else {
            const dataMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
            if (dataMatch) {
              latitude = parseFloat(dataMatch[1]);
              longitude = parseFloat(dataMatch[2]);
            }
          }
        }
        let placeName = null;
        const placeMatch = targetUrl.match(/\/place\/([^/]+)/);
        if (placeMatch) {
          try {
            placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
          } catch (e) {
            placeName = placeMatch[1].replace(/\+/g, " ");
          }
        }
        if (latitude === null || longitude === null) {
          return res.status(400).json({ error: "Gagal mendeteksi koordinat dari Google Maps link ini." });
        }
        res.json({
          success: true,
          latitude,
          longitude,
          address: placeName || ""
        });
      } catch (error3) {
        console.error("Parse maps URL error:", error3);
        res.status(500).json({ error: "Server error parsing Google Maps URL." });
      }
    }
    __name(parseMapsUrl, "parseMapsUrl");
    async function addKitchenStaff(req, res) {
      await delay(100);
      const { id: kitchenId } = req.params;
      const { staffId, name, role, email, password } = req.body;
      try {
        const [kitchens] = await db2.query("SELECT * FROM kitchens WHERE id = ?", [kitchenId]);
        if (kitchens.length === 0) {
          return res.status(404).json({ error: "Kitchen not found." });
        }
        if (staffId) {
          const [users] = await db2.query("SELECT * FROM users WHERE id = ?", [staffId]);
          if (users.length === 0) {
            return res.status(404).json({ error: "User not found." });
          }
          if (role) {
            await db2.query("UPDATE users SET kitchenId = ?, role = ? WHERE id = ?", [kitchenId, role, staffId]);
          } else {
            await db2.query("UPDATE users SET kitchenId = ? WHERE id = ?", [kitchenId, staffId]);
          }
          return res.json({ success: true, message: "User successfully assigned to kitchen." });
        }
        if (!name || !role || !email) {
          return res.status(400).json({ error: "Name, role, and email are required for manual creation." });
        }
        const [existing] = await db2.query("SELECT * FROM users WHERE LOWER(email) = ?", [email.toLowerCase()]);
        if (existing.length > 0) {
          return res.status(400).json({ error: "Email sudah terdaftar." });
        }
        const bcrypt = require_umd();
        const newId = `s_manual_${Date.now()}`;
        const defaultPassword = password || "password";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const newUser = {
          id: newId,
          name,
          role,
          status: "Active",
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(newId)}`,
          kitchenId,
          email: email.toLowerCase(),
          password: hashedPassword
        };
        await db2.query(
          "INSERT INTO users (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [newUser.id, newUser.name, newUser.role, newUser.status, newUser.avatar, newUser.kitchenId, newUser.email, newUser.password]
        );
        const { password: _, ...responseUser } = newUser;
        res.status(201).json(responseUser);
      } catch (error3) {
        console.error("Add kitchen staff error:", error3);
        res.status(500).json({ error: "Server error assigning or creating kitchen staff." });
      }
    }
    __name(addKitchenStaff, "addKitchenStaff");
    module.exports = {
      getKitchens,
      createKitchen,
      updateKitchen,
      deleteKitchen,
      getKitchenDetail,
      parseMapsUrl,
      addKitchenStaff
    };
  }
});

// src/routes/kitchenRoutes.js
var require_kitchenRoutes = __commonJS({
  "src/routes/kitchenRoutes.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { Hono: Hono3 } = require_cjs();
    var router = new Hono3();
    var kitchenController = require_kitchenController();
    var { protect } = require_authMiddleware();
    var { toExpress, toExpressMiddleware } = require_expressCompat();
    router.use("*", toExpressMiddleware(protect));
    router.get("/", toExpress(kitchenController.getKitchens));
    router.post("/", toExpress(kitchenController.createKitchen));
    router.post("/parse-maps-url", toExpress(kitchenController.parseMapsUrl));
    router.put("/:id", toExpress(kitchenController.updateKitchen));
    router.delete("/:id", toExpress(kitchenController.deleteKitchen));
    router.get("/:id/detail", toExpress(kitchenController.getKitchenDetail));
    router.post("/:id/staff", toExpress(kitchenController.addKitchenStaff));
    module.exports = router;
  }
});

// src/controllers/inventoryController.js
var require_inventoryController = __commonJS({
  "src/controllers/inventoryController.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var db2 = require_db();
    var { formatSingleBatch } = require_formatters();
    var { convertUnit, getDisplayUnit, aggregateStock } = require_unitConverter();
    var delay = /* @__PURE__ */ __name((ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)), "delay");
    async function getInventory(req, res) {
      await delay(50);
      try {
        const [items] = await db2.query("SELECT * FROM inventory");
        const [batches] = await db2.query("SELECT * FROM inventory_batches");
        const formattedInventory = items.map((item) => {
          const itemBatches = batches.filter((b) => b.inventoryId === item.id).map((b) => {
            const qtyPacked = Number(b.qty_packed) || 0;
            const qtyLoose = Number(b.qty_loose) || 0;
            const cap = b.package_capacity !== null ? Number(b.package_capacity) : null;
            const totalVal = cap !== null && cap > 0 ? qtyPacked * cap + qtyLoose : qtyLoose;
            const formattedWeight = formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit);
            return {
              id: b.id,
              kitchenId: b.kitchenId,
              container: b.container,
              qty_packed: qtyPacked,
              qty_loose: qtyLoose,
              weight_value: totalVal,
              unit: b.unit,
              weight: formattedWeight,
              package_capacity: cap,
              package_unit: b.package_unit,
              expiry: b.expiry ? b.expiry.toISOString().split("T")[0] : ""
            };
          });
          return {
            id: item.id,
            name: item.name,
            logistics_sku: item.logistics_sku,
            base_unit: item.base_unit,
            has_packaging: item.has_packaging,
            packaging_name: item.packaging_name,
            packaging_capacity: item.packaging_capacity !== null ? Number(item.packaging_capacity) : null,
            batches: itemBatches
          };
        });
        res.json(formattedInventory);
      } catch (error3) {
        console.error("Inventory list error:", error3);
        res.status(500).json({ error: "Server error fetching inventory." });
      }
    }
    __name(getInventory, "getInventory");
    async function getStockRequests(req, res) {
      await delay(50);
      const { kitchenId } = req.query;
      try {
        let rows;
        if (kitchenId) {
          [rows] = await db2.query(
            `SELECT sr.*, k.name as kitchenName, sk.name as supplierKitchenName
         FROM stock_requests sr
         LEFT JOIN kitchens k ON sr.kitchenId = k.id
         LEFT JOIN kitchens sk ON sr.supplierKitchenId = sk.id
         WHERE sr.kitchenId = ?
         ORDER BY sr.createdAt DESC`,
            [kitchenId]
          );
        } else {
          [rows] = await db2.query(
            `SELECT sr.*, k.name as kitchenName, sk.name as supplierKitchenName
         FROM stock_requests sr
         LEFT JOIN kitchens k ON sr.kitchenId = k.id
         LEFT JOIN kitchens sk ON sr.supplierKitchenId = sk.id
         ORDER BY sr.createdAt DESC`
          );
        }
        const mapped = rows.map((r) => ({
          ...r,
          adminNotes: r.note
        }));
        res.json(mapped);
      } catch (error3) {
        console.error("Fetch stock requests error:", error3);
        res.status(500).json({ error: "Server error fetching stock requests." });
      }
    }
    __name(getStockRequests, "getStockRequests");
    async function createStockRequest(req, res) {
      await delay(100);
      const { material, amount, urgency, kitchenId, kitchenName, supplierKitchenId, supplierKitchenName } = req.body;
      const newRequest = {
        id: Date.now().toString(),
        material,
        amount,
        urgency,
        status: "Pending",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        kitchenId: kitchenId || null,
        supplierKitchenId: supplierKitchenId || null,
        note: null
      };
      try {
        await db2.query(
          "INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.supplierKitchenId, newRequest.note]
        );
        let responseKitchenName = kitchenName || null;
        let responseSupplierName = supplierKitchenName || null;
        if (newRequest.kitchenId && !responseKitchenName) {
          const [k] = await db2.query("SELECT name FROM kitchens WHERE id = ?", [newRequest.kitchenId]);
          if (k.length > 0)
            responseKitchenName = k[0].name;
        }
        if (newRequest.supplierKitchenId && !responseSupplierName) {
          const [sk] = await db2.query("SELECT name FROM kitchens WHERE id = ?", [newRequest.supplierKitchenId]);
          if (sk.length > 0)
            responseSupplierName = sk[0].name;
        }
        res.status(201).json({
          ...newRequest,
          kitchenName: responseKitchenName,
          supplierKitchenName: responseSupplierName,
          adminNotes: newRequest.note
        });
      } catch (error3) {
        console.error("Stock request error:", error3);
        res.status(500).json({ error: "Server error placing stock request." });
      }
    }
    __name(createStockRequest, "createStockRequest");
    async function createStockRequestBatch(req, res) {
      await delay(100);
      const { requests, kitchenId, kitchenName } = req.body;
      if (!requests || !Array.isArray(requests)) {
        return res.status(400).json({ error: "Invalid requests format." });
      }
      try {
        const newRequests = [];
        let resolvedKitchenName = kitchenName || null;
        if (kitchenId && !resolvedKitchenName) {
          const [k] = await db2.query("SELECT name FROM kitchens WHERE id = ?", [kitchenId]);
          if (k.length > 0)
            resolvedKitchenName = k[0].name;
        }
        for (let i = 0; i < requests.length; i++) {
          const reqItem = requests[i];
          const newRequest = {
            id: (Date.now() + i).toString(),
            material: reqItem.material,
            amount: reqItem.amount,
            urgency: reqItem.urgency,
            status: "Pending",
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            kitchenId: reqItem.kitchenId || kitchenId || null,
            supplierKitchenId: reqItem.supplierKitchenId || null,
            note: null
          };
          await db2.query(
            "INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.supplierKitchenId, newRequest.note]
          );
          let supplierName = reqItem.supplierKitchenName || null;
          if (newRequest.supplierKitchenId && !supplierName) {
            const [sk] = await db2.query("SELECT name FROM kitchens WHERE id = ?", [newRequest.supplierKitchenId]);
            if (sk.length > 0)
              supplierName = sk[0].name;
          }
          newRequests.push({
            ...newRequest,
            kitchenName: resolvedKitchenName,
            supplierKitchenName: supplierName,
            adminNotes: newRequest.note
          });
        }
        res.status(201).json(newRequests);
      } catch (error3) {
        console.error("Stock request batch error:", error3);
        res.status(500).json({ error: "Server error placing batch stock request." });
      }
    }
    __name(createStockRequestBatch, "createStockRequestBatch");
    async function reportWastage(req, res) {
      await delay(100);
      const { batchId, kitchenId, materialName, weight, reason } = req.body;
      if (!batchId || !kitchenId || !materialName || weight === void 0) {
        return res.status(400).json({ error: "Data wastage tidak lengkap." });
      }
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const [batches] = await connection.query(
          "SELECT * FROM inventory_batches WHERE id = ? AND kitchenId = ?",
          [batchId, kitchenId]
        );
        let displayUnit = "kg";
        let newQtyPacked = 0;
        let newQtyLoose = 0;
        let standardQty = Number(weight);
        let inventoryId = null;
        if (batches.length > 0) {
          const batch = batches[0];
          inventoryId = batch.inventoryId;
          const qtyPacked = Number(batch.qty_packed) || 0;
          const qtyLoose = Number(batch.qty_loose) || 0;
          const dbUnit = batch.unit || "kg";
          const cap = Number(batch.package_capacity);
          const pkgUnit = (batch.package_unit || "").trim();
          const currentTotal = !isNaN(cap) && cap > 0 ? qtyPacked * cap + qtyLoose : qtyLoose;
          displayUnit = getDisplayUnit(currentTotal, dbUnit, cap, pkgUnit);
          const discardedInStandardUnit = convertUnit(Number(weight), displayUnit, pkgUnit || dbUnit, cap, pkgUnit);
          if (discardedInStandardUnit > currentTotal) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ error: "Jumlah wastage melebihi stok yang tersedia (Stok tidak cukup)." });
          }
          const newTotal = Math.max(0, currentTotal - discardedInStandardUnit);
          if (!isNaN(cap) && cap > 0) {
            newQtyPacked = Math.floor(newTotal / cap);
            newQtyLoose = Number((newTotal % cap).toFixed(4));
          } else {
            newQtyPacked = 0;
            newQtyLoose = Number(newTotal.toFixed(4));
          }
          const formattedWeight = formatSingleBatch(newQtyPacked, newQtyLoose, batch.container, cap, pkgUnit);
          await connection.query(
            "UPDATE inventory_batches SET qty_packed = ?, qty_loose = ?, weight = ? WHERE id = ?",
            [newQtyPacked, newQtyLoose, formattedWeight, batchId]
          );
          if (!isNaN(cap) && cap > 0 && pkgUnit) {
            standardQty = convertUnit(Number(weight), displayUnit, pkgUnit, cap, pkgUnit);
          } else {
            const isWeightUnit = dbUnit.toLowerCase() === "kg" || dbUnit.toLowerCase() === "g";
            const isVolumeUnit = dbUnit.toLowerCase() === "l" || dbUnit.toLowerCase() === "ml";
            if (isWeightUnit) {
              standardQty = convertUnit(Number(weight), displayUnit, "kg");
            } else if (isVolumeUnit) {
              standardQty = convertUnit(Number(weight), displayUnit, "L");
            }
          }
        } else {
          const [invItems] = await connection.query("SELECT id FROM inventory WHERE LOWER(name) = ?", [materialName.toLowerCase()]);
          if (invItems.length > 0) {
            inventoryId = invItems[0].id;
          }
        }
        if (!inventoryId) {
          const [invItems] = await connection.query("SELECT id FROM inventory WHERE LOWER(name) = ?", [materialName.toLowerCase()]);
          if (invItems.length > 0) {
            inventoryId = invItems[0].id;
          } else {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ error: "Bahan baku tidak ditemukan di inventory." });
          }
        }
        const [kitchens] = await connection.query("SELECT * FROM kitchens WHERE id = ?", [kitchenId]);
        const kName = kitchens.length > 0 ? kitchens[0].name : "Dapur Umum";
        const city = kitchens.length > 0 ? kitchens[0].city : "Jakarta";
        const newWastageRecord = {
          id: `W-${Date.now()}`,
          kitchenId,
          inventoryId,
          weight: Number(weight),
          unit: displayUnit,
          reason: reason || "Busuk",
          cost: Math.round(standardQty * 35e3),
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        };
        await connection.query(
          "INSERT INTO wastage_records (id, kitchenId, inventoryId, weight, unit, reason, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newWastageRecord.id,
            newWastageRecord.kitchenId,
            newWastageRecord.inventoryId,
            newWastageRecord.weight,
            newWastageRecord.unit,
            newWastageRecord.reason,
            newWastageRecord.cost,
            newWastageRecord.date
          ]
        );
        await connection.commit();
        connection.release();
        res.status(201).json({
          ...newWastageRecord,
          kitchen: kName,
          city,
          material: materialName
        });
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Wastage reporting error:", error3);
        res.status(500).json({ error: "Server error reporting wastage." });
      }
    }
    __name(reportWastage, "reportWastage");
    async function getWastage(req, res) {
      await delay(50);
      try {
        const [rows] = await db2.query(
          `SELECT wr.*, k.name as kitchen, k.city, i.name as material
       FROM wastage_records wr
       JOIN kitchens k ON wr.kitchenId = k.id
       JOIN inventory i ON wr.inventoryId = i.id
       ORDER BY wr.id DESC`
        );
        res.json(rows);
      } catch (error3) {
        console.error("Wastage logs error:", error3);
        res.status(500).json({ error: "Server error fetching wastage logs." });
      }
    }
    __name(getWastage, "getWastage");
    async function getChefDashboardData(req, res) {
      await delay(100);
      const { kitchenId } = req.params;
      try {
        const [kitchenRows] = await db2.query("SELECT * FROM kitchens WHERE id = ?", [kitchenId]);
        if (kitchenRows.length === 0) {
          return res.status(404).json({ error: "Kitchen not found" });
        }
        const kitchen = kitchenRows[0];
        const [users] = await db2.query("SELECT * FROM users WHERE kitchenId = ? AND role IN ('Chef', 'Head Chef', 'Staff')", [kitchenId]);
        const [todayPlans] = await db2.query(
          `SELECT pl.*, m.name as menu
       FROM production_logs pl
       JOIN menus m ON pl.menuId = m.id
       WHERE pl.kitchenId = ?`,
          [kitchenId]
        );
        let totalPortions = 0;
        let completedPortions = 0;
        let activeCookingCount = 0;
        for (const plan of todayPlans) {
          totalPortions += plan.servings || 0;
          if (plan.status === "Ready" || plan.status === "Done") {
            completedPortions += plan.servings || 0;
          } else if (plan.status === "Cooking") {
            activeCookingCount++;
          }
        }
        const [batches] = await db2.query(
          `SELECT b.*, i.name as materialName 
       FROM inventory_batches b 
       JOIN inventory i ON b.inventoryId = i.id 
       WHERE b.kitchenId = ?`,
          [kitchenId]
        );
        const criticalStock = [];
        const now = /* @__PURE__ */ new Date();
        for (const b of batches) {
          const expiryDate = new Date(b.expiry);
          const diffTime = expiryDate - now;
          const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
          const qtyPacked = Number(b.qty_packed) || 0;
          const qtyLoose = Number(b.qty_loose) || 0;
          const cap = Number(b.package_capacity);
          const val = !isNaN(cap) && cap > 0 ? qtyPacked * cap + qtyLoose : qtyLoose;
          const isLow = val <= 2;
          const isExpiringSoon = diffDays <= 30;
          if (isLow || isExpiringSoon) {
            criticalStock.push({
              id: b.id,
              material: b.materialName,
              container: b.container,
              qty_packed: qtyPacked,
              qty_loose: qtyLoose,
              weight_value: val,
              unit: b.unit,
              weight: formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit),
              package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
              package_unit: b.package_unit,
              expiry: b.expiry ? b.expiry.toISOString().split("T")[0] : "",
              isLow,
              isExpiringSoon,
              daysToExpiry: diffDays
            });
          }
        }
        const [recentRequests] = await db2.query(
          `SELECT sr.*, k.name as kitchenName, sk.name as supplierKitchenName
       FROM stock_requests sr
       LEFT JOIN kitchens k ON sr.kitchenId = k.id
       LEFT JOIN kitchens sk ON sr.supplierKitchenId = sk.id
       WHERE sr.kitchenId = ?
       ORDER BY sr.createdAt DESC LIMIT 5`,
          [kitchenId]
        );
        res.json({
          kitchenName: kitchen.name,
          city: kitchen.city,
          todayStats: {
            totalPortions,
            completedPortions,
            activeCookingCount,
            efficiency: "94%",
            wastageRate: "1.4%"
          },
          todayMenu: todayPlans.map((plan) => ({
            id: plan.id,
            menu: plan.menu,
            servings: plan.servings,
            status: plan.status,
            startTime: plan.startTime
          })),
          staff: users,
          criticalStock,
          recentRequests
        });
      } catch (error3) {
        console.error("Chef dashboard API error:", error3);
        res.status(500).json({ error: "Server error compiling chef dashboard data." });
      }
    }
    __name(getChefDashboardData, "getChefDashboardData");
    async function getMaterialAvailability(req, res) {
      await delay(50);
      const { material } = req.query;
      if (!material) {
        return res.status(400).json({ error: "Material name is required." });
      }
      try {
        const [items] = await db2.query("SELECT * FROM inventory WHERE LOWER(name) = ?", [material.toLowerCase()]);
        if (items.length === 0) {
          return res.json([]);
        }
        const itemId = items[0].id;
        const [batches] = await db2.query(
          `SELECT b.*, k.name as kitchenName, k.city, k.latitude, k.longitude 
       FROM inventory_batches b
       JOIN kitchens k ON b.kitchenId = k.id
       WHERE b.inventoryId = ?`,
          [itemId]
        );
        const aggregated = {};
        for (const b of batches) {
          const qtyPacked = Number(b.qty_packed) || 0;
          const qtyLoose = Number(b.qty_loose) || 0;
          const cap = Number(b.package_capacity);
          const val = !isNaN(cap) && cap > 0 ? qtyPacked * cap + qtyLoose : qtyLoose;
          if (!aggregated[b.kitchenId]) {
            aggregated[b.kitchenId] = {
              kitchenId: b.kitchenId,
              kitchenName: b.kitchenName,
              city: b.city,
              latitude: b.latitude ? Number(b.latitude) : null,
              longitude: b.longitude ? Number(b.longitude) : null,
              totalWeightValue: 0,
              unit: b.unit,
              package_capacity: b.package_capacity,
              package_unit: b.package_unit,
              batches: []
            };
          }
          aggregated[b.kitchenId].totalWeightValue += val;
          const formattedWeight = formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit);
          aggregated[b.kitchenId].batches.push({
            id: b.id,
            container: b.container,
            qty_packed: qtyPacked,
            qty_loose: qtyLoose,
            unit: b.unit,
            weight: formattedWeight,
            expiry: b.expiry ? b.expiry.toISOString().split("T")[0] : ""
          });
        }
        const aggregatedList = Object.values(aggregated).map((k) => {
          const baseUnit = k.unit || "kg";
          const cap = Number(k.package_capacity);
          const pkgUnit = k.package_unit || "";
          const formattedTotal = formatSingleBatch(0, k.totalWeightValue, baseUnit, cap, pkgUnit);
          return {
            ...k,
            totalWeight: formattedTotal
          };
        });
        res.json(aggregatedList);
      } catch (error3) {
        console.error("Material availability error:", error3);
        res.status(500).json({ error: "Server error checking material availability." });
      }
    }
    __name(getMaterialAvailability, "getMaterialAvailability");
    async function updateStockRequestStatus(req, res) {
      await delay(100);
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required." });
      }
      try {
        const [rows] = await db2.query("SELECT * FROM stock_requests WHERE id = ?", [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: "Stock request not found." });
        }
        const requestItem = rows[0];
        if (requestItem.status !== "Pending") {
          return res.status(400).json({ error: "Permintaan stock sudah diproses sebelumnya." });
        }
        await db2.query(
          "UPDATE stock_requests SET status = ?, note = ? WHERE id = ?",
          [status, adminNotes || null, id]
        );
        res.json({ id, status, adminNotes });
      } catch (error3) {
        console.error("Update stock request status error:", error3);
        res.status(500).json({ error: "Server error updating stock request status." });
      }
    }
    __name(updateStockRequestStatus, "updateStockRequestStatus");
    async function validateStockArrival(req, res) {
      await delay(100);
      const { requestIds } = req.body;
      if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
        return res.status(400).json({ error: "Array requestIds tidak boleh kosong." });
      }
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const processedRequests = [];
        for (const requestId of requestIds) {
          const [requests] = await connection.query(
            "SELECT * FROM stock_requests WHERE id = ?",
            [requestId]
          );
          if (requests.length === 0) {
            continue;
          }
          const request = requests[0];
          if (request.status !== "Approved") {
            continue;
          }
          await connection.query(
            "UPDATE stock_requests SET status = 'Delivered' WHERE id = ?",
            [requestId]
          );
          const amountStr = request.amount || "";
          const match = amountStr.match(/^([\d.]+)\s*(.*)$/);
          if (!match)
            continue;
          const quantity = parseFloat(match[1]);
          const requestedUnit = match[2] ? match[2].trim() : "";
          let [invItems] = await connection.query(
            "SELECT * FROM inventory WHERE LOWER(name) = ?",
            [request.material.toLowerCase()]
          );
          let invItem;
          if (invItems.length === 0) {
            const newInvId = `mat-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
            const sku = `SKU-${request.material.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${Date.now()}`;
            const baseUnit = ["kg", "g", "l", "ml", "pcs"].includes(requestedUnit.toLowerCase()) ? requestedUnit : "kg";
            await connection.query(
              "INSERT INTO inventory (id, name, logistics_sku, base_unit, has_packaging, packaging_name, packaging_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [newInvId, request.material, sku, baseUnit, 0, null, null]
            );
            invItem = {
              id: newInvId,
              name: request.material,
              base_unit: baseUnit,
              has_packaging: 0,
              packaging_name: null,
              packaging_capacity: null
            };
          } else {
            invItem = invItems[0];
          }
          const batchId = `b-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
          const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
          let container = "Wadah";
          let qty_packed = 0;
          let qty_loose = quantity;
          let unit = requestedUnit || invItem.base_unit || "kg";
          let package_capacity = invItem.packaging_capacity !== null ? Number(invItem.packaging_capacity) : null;
          let package_unit = invItem.base_unit;
          if (invItem.has_packaging && invItem.packaging_capacity > 0 && invItem.packaging_name) {
            package_capacity = Number(invItem.packaging_capacity);
            const pkgName = invItem.packaging_name;
            if (requestedUnit.toLowerCase() === pkgName.toLowerCase()) {
              qty_packed = quantity;
              qty_loose = 0;
              container = pkgName;
              unit = requestedUnit.toLowerCase();
            } else if (requestedUnit.toLowerCase() === invItem.base_unit.toLowerCase()) {
              qty_packed = Math.floor(quantity / package_capacity);
              qty_loose = Number((quantity % package_capacity).toFixed(4));
              container = pkgName;
              unit = pkgName.toLowerCase();
            } else {
              qty_packed = 0;
              qty_loose = quantity;
              container = "Wadah";
              unit = requestedUnit;
            }
          } else {
            container = "Wadah";
            qty_packed = 0;
            qty_loose = quantity;
            unit = requestedUnit || invItem.base_unit || "kg";
          }
          const weight = formatSingleBatch(qty_packed, qty_loose, container, package_capacity, package_unit);
          await connection.query(
            `INSERT INTO inventory_batches 
         (id, inventoryId, kitchenId, container, weight, qty_packed, qty_loose, unit, package_capacity, package_unit, expiry) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [batchId, invItem.id, request.kitchenId, container, weight, qty_packed, qty_loose, unit, package_capacity, package_unit, expiry]
          );
          processedRequests.push(requestId);
        }
        await connection.commit();
        connection.release();
        res.json({ success: true, processedRequests });
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Validate stock arrival error:", error3);
        res.status(500).json({ error: "Server error validating stock arrival." });
      }
    }
    __name(validateStockArrival, "validateStockArrival");
    module.exports = {
      getInventory,
      getStockRequests,
      createStockRequest,
      createStockRequestBatch,
      reportWastage,
      getWastage,
      getChefDashboardData,
      getMaterialAvailability,
      updateStockRequestStatus,
      validateStockArrival
    };
  }
});

// src/controllers/stockVerificationController.js
var require_stockVerificationController = __commonJS({
  "src/controllers/stockVerificationController.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var db2 = require_db();
    var { formatSingleBatch } = require_formatters();
    var delay = /* @__PURE__ */ __name((ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)), "delay");
    async function checkVerificationStatus(req, res) {
      await delay(50);
      const { kitchenId } = req.query;
      if (!kitchenId) {
        return res.status(400).json({ error: "kitchenId is required." });
      }
      if (kitchenId === "k2") {
        return res.json({ verified: true });
      }
      try {
        const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const [rows] = await db2.query(
          "SELECT * FROM stock_verifications WHERE kitchenId = ? AND verifiedAt LIKE ? LIMIT 1",
          [kitchenId, `${todayStr}%`]
        );
        res.json({ verified: rows.length > 0 });
      } catch (error3) {
        console.error("Check verification status error:", error3);
        res.status(500).json({ error: "Server error checking verification status." });
      }
    }
    __name(checkVerificationStatus, "checkVerificationStatus");
    async function getLastCookedMenu(req, res) {
      await delay(50);
      const { kitchenId } = req.query;
      if (!kitchenId) {
        return res.status(400).json({ error: "kitchenId is required." });
      }
      try {
        const [logs] = await db2.query(
          `SELECT pl.*, m.name as menuName
       FROM production_logs pl
       JOIN menus m ON pl.menuId = m.id
       WHERE pl.kitchenId = ? AND pl.status IN ('Ready', 'Done')
       ORDER BY pl.startTime DESC LIMIT 1`,
          [kitchenId]
        );
        let lastMenu = null;
        let detailedIngredientNames = [];
        if (logs.length > 0) {
          lastMenu = logs[0].menuName;
          const [ingredients] = await db2.query("SELECT name FROM ingredients WHERE menuId = ?", [logs[0].menuId]);
          detailedIngredientNames = ingredients.map((ing) => ing.name.toLowerCase());
        }
        const [batches] = await db2.query(
          `SELECT b.*, i.name as materialName, i.has_packaging, i.packaging_name, i.packaging_capacity
       FROM inventory_batches b
       JOIN inventory i ON b.inventoryId = i.id
       WHERE b.kitchenId = ?`,
          [kitchenId]
        );
        const detailedIngredients = [];
        const otherIngredients = [];
        for (const b of batches) {
          const isDetailed = detailedIngredientNames.includes(b.materialName.toLowerCase());
          const formattedBatch = {
            batchId: b.id,
            materialName: b.materialName,
            container: b.container,
            qty_packed: Number(b.qty_packed) || 0,
            qty_loose: Number(b.qty_loose) || 0,
            unit: b.unit,
            package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
            package_unit: b.package_unit,
            expiry: b.expiry ? b.expiry.toISOString().split("T")[0] : ""
          };
          if (isDetailed) {
            detailedIngredients.push(formattedBatch);
          } else {
            otherIngredients.push(formattedBatch);
          }
        }
        res.json({
          lastMenu,
          detailedIngredients,
          otherIngredients
        });
      } catch (error3) {
        console.error("Get last cooked menu error:", error3);
        res.status(500).json({ error: "Server error retrieving verification items." });
      }
    }
    __name(getLastCookedMenu, "getLastCookedMenu");
    async function submitVerification(req, res) {
      await delay(100);
      const { kitchenId, verifiedBy, items } = req.body;
      if (!kitchenId || !verifiedBy || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Verification data is incomplete." });
      }
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const verificationId = `v-${Date.now()}`;
        const verifiedAt = (/* @__PURE__ */ new Date()).toISOString();
        await connection.query(
          "INSERT INTO stock_verifications (id, kitchenId, verifiedAt, verifiedBy, details) VALUES (?, ?, ?, ?, ?)",
          [verificationId, kitchenId, verifiedAt, verifiedBy, JSON.stringify(items)]
        );
        for (const item of items) {
          const { batchId, qty_packed, qty_loose } = item;
          const [batches] = await connection.query(
            "SELECT * FROM inventory_batches WHERE id = ? AND kitchenId = ?",
            [batchId, kitchenId]
          );
          if (batches.length > 0) {
            const b = batches[0];
            const cap = b.package_capacity !== null ? Number(b.package_capacity) : null;
            const qPacked = qty_packed !== void 0 ? Number(qty_packed) : Number(b.qty_packed);
            const qLoose = qty_loose !== void 0 ? Number(qty_loose) : Number(b.qty_loose);
            const formattedWeight = formatSingleBatch(qPacked, qLoose, b.container, cap, b.package_unit);
            await connection.query(
              "UPDATE inventory_batches SET qty_packed = ?, qty_loose = ?, weight = ? WHERE id = ? AND kitchenId = ?",
              [qPacked, qLoose, formattedWeight, batchId, kitchenId]
            );
          }
        }
        await connection.commit();
        connection.release();
        res.status(201).json({ success: true, verificationId });
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Submit verification error:", error3);
        res.status(500).json({ error: "Server error submitting stock verification." });
      }
    }
    __name(submitVerification, "submitVerification");
    module.exports = {
      checkVerificationStatus,
      getLastCookedMenu,
      submitVerification
    };
  }
});

// src/routes/inventoryRoutes.js
var require_inventoryRoutes = __commonJS({
  "src/routes/inventoryRoutes.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { Hono: Hono3 } = require_cjs();
    var router = new Hono3();
    var inventoryController = require_inventoryController();
    var stockVerificationController = require_stockVerificationController();
    var { protect } = require_authMiddleware();
    var { toExpress, toExpressMiddleware } = require_expressCompat();
    router.use("*", toExpressMiddleware(protect));
    router.get("/inventory", toExpress(inventoryController.getInventory));
    router.get("/inventory/material-availability", toExpress(inventoryController.getMaterialAvailability));
    router.get("/stock-requests", toExpress(inventoryController.getStockRequests));
    router.post("/stock-requests", toExpress(inventoryController.createStockRequest));
    router.post("/stock-requests/batch", toExpress(inventoryController.createStockRequestBatch));
    router.put("/stock-requests/:id/status", toExpress(inventoryController.updateStockRequestStatus));
    router.post("/stock-requests/validate-arrival", toExpress(inventoryController.validateStockArrival));
    router.post("/wastage", toExpress(inventoryController.reportWastage));
    router.get("/wastage", toExpress(inventoryController.getWastage));
    router.get("/chef/dashboard/:kitchenId", toExpress(inventoryController.getChefDashboardData));
    router.get("/stock-verifications/status", toExpress(stockVerificationController.checkVerificationStatus));
    router.get("/stock-verifications/last-cooked", toExpress(stockVerificationController.getLastCookedMenu));
    router.post("/stock-verifications", toExpress(stockVerificationController.submitVerification));
    module.exports = router;
  }
});

// src/controllers/productionController.js
var require_productionController = __commonJS({
  "src/controllers/productionController.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var db2 = require_db();
    var { convertUnit } = require_unitConverter();
    var { formatSingleBatch } = require_formatters();
    var delay = /* @__PURE__ */ __name((ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)), "delay");
    async function getActivity(req, res) {
      await delay(50);
      const { kitchenId } = req.query;
      try {
        let rows;
        if (kitchenId) {
          [rows] = await db2.query(
            `SELECT pl.*, m.name as menu, k.name as kitchen, k.city, u.name as chefPenanggungJawab
         FROM production_logs pl
         JOIN menus m ON pl.menuId = m.id
         JOIN kitchens k ON pl.kitchenId = k.id
         LEFT JOIN production_plans pp ON pl.id = pp.id
         LEFT JOIN users u ON pp.userId = u.id
         WHERE pl.kitchenId = ?`,
            [kitchenId]
          );
        } else {
          [rows] = await db2.query(
            `SELECT pl.*, m.name as menu, k.name as kitchen, k.city, u.name as chefPenanggungJawab
         FROM production_logs pl
         JOIN menus m ON pl.menuId = m.id
         JOIN kitchens k ON pl.kitchenId = k.id
         LEFT JOIN production_plans pp ON pl.id = pp.id
         LEFT JOIN users u ON pp.userId = u.id`
          );
        }
        res.json(rows);
      } catch (error3) {
        console.error("Activity logs error:", error3);
        res.status(500).json({ error: "Server error fetching activity logs." });
      }
    }
    __name(getActivity, "getActivity");
    async function getProductionPlans(req, res) {
      await delay(50);
      const { kitchenId } = req.query;
      try {
        let rows;
        if (kitchenId) {
          [rows] = await db2.query(
            `SELECT pp.*, m.name as menuName, k.name as kitchenName, u.name as chefPenanggungJawab
         FROM production_plans pp
         JOIN menus m ON pp.menuId = m.id
         JOIN kitchens k ON pp.kitchenId = k.id
         LEFT JOIN users u ON pp.userId = u.id
         WHERE pp.kitchenId = ?`,
            [kitchenId]
          );
        } else {
          [rows] = await db2.query(
            `SELECT pp.*, m.name as menuName, k.name as kitchenName, u.name as chefPenanggungJawab
         FROM production_plans pp
         JOIN menus m ON pp.menuId = m.id
         JOIN kitchens k ON pp.kitchenId = k.id
         LEFT JOIN users u ON pp.userId = u.id`
          );
        }
        res.json(rows);
      } catch (error3) {
        console.error("Production plans error:", error3);
        res.status(500).json({ error: "Server error fetching plans." });
      }
    }
    __name(getProductionPlans, "getProductionPlans");
    async function createProductionPlan(req, res) {
      await delay(100);
      const { id, day, menu, kitchenId, portions, note } = req.body;
      if (!day || !menu || !kitchenId || !portions) {
        return res.status(400).json({ error: "Data rencana produksi tidak lengkap." });
      }
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const [kitchens] = await connection.query("SELECT * FROM kitchens WHERE id = ?", [kitchenId]);
        if (kitchens.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Kitchen tidak ditemukan." });
        }
        const kitchen = kitchens[0];
        const [menus] = await connection.query("SELECT * FROM menus WHERE LOWER(name) = ?", [menu.toLowerCase()]);
        if (menus.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Menu tidak ditemukan." });
        }
        const menuData = menus[0];
        const [chefs] = await connection.query("SELECT id, name FROM users WHERE kitchenId = ? AND role = 'Chef' LIMIT 1", [kitchenId]);
        const chefId = chefs.length > 0 ? chefs[0].id : null;
        const chefName = chefs.length > 0 ? chefs[0].name : "";
        const planId = id || `p${Date.now()}`;
        await connection.query(
          "INSERT INTO production_plans (id, day, menuId, kitchenId, portions, note, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [planId, day, menuData.id, kitchen.id, Number(portions), note || "", "Pending", chefId]
        );
        await connection.query(
          "INSERT INTO production_logs (id, kitchenId, menuId, servings, startTime, endTime, qaNotes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [planId, kitchen.id, menuData.id, Number(portions), null, null, note || "", "Pending"]
        );
        await checkAndNotifyShortage(planId, connection);
        await connection.commit();
        connection.release();
        res.status(201).json({
          id: planId,
          day,
          menuId: menuData.id,
          menuName: menuData.name,
          kitchenId: kitchen.id,
          kitchenName: kitchen.name,
          portions: Number(portions),
          note: note || "",
          status: "Pending",
          chefPenanggungJawab: chefName
        });
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Create plan error:", error3);
        res.status(500).json({ error: "Server error creating production plan." });
      }
    }
    __name(createProductionPlan, "createProductionPlan");
    async function updateProductionPlan(req, res) {
      await delay(100);
      const { id } = req.params;
      const { day, menu, kitchenId, portions, note } = req.body;
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const [existing] = await connection.query(
          `SELECT pp.*, m.name as menuName, k.name as kitchenName
       FROM production_plans pp
       JOIN menus m ON pp.menuId = m.id
       JOIN kitchens k ON pp.kitchenId = k.id
       WHERE pp.id = ?`,
          [id]
        );
        if (existing.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Rencana produksi tidak ditemukan." });
        }
        const current = existing[0];
        if (current.status !== "Pending") {
          connection.release();
          return res.status(400).json({ error: "Rencana sedang berjalan dan tidak bisa diubah." });
        }
        const mergedDay = day !== void 0 ? day : current.day;
        const mergedPortions = portions !== void 0 ? Number(portions) : current.portions;
        const mergedNote = note !== void 0 ? note : current.note;
        const mergedKitchenId = kitchenId !== void 0 ? kitchenId : current.kitchenId;
        const mergedMenuName = menu !== void 0 ? menu : current.menuName;
        const [kitchens] = await connection.query("SELECT * FROM kitchens WHERE id = ?", [mergedKitchenId]);
        if (kitchens.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Kitchen tidak ditemukan." });
        }
        const kitchen = kitchens[0];
        const [menus] = await connection.query("SELECT * FROM menus WHERE LOWER(name) = ?", [mergedMenuName.toLowerCase()]);
        if (menus.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Menu tidak ditemukan." });
        }
        const menuData = menus[0];
        let userId = current.userId;
        let chefName = "";
        if (mergedKitchenId !== current.kitchenId) {
          const [chefs] = await connection.query("SELECT id, name FROM users WHERE kitchenId = ? AND role = 'Chef' LIMIT 1", [mergedKitchenId]);
          userId = chefs.length > 0 ? chefs[0].id : null;
          chefName = chefs.length > 0 ? chefs[0].name : "";
        } else {
          if (userId) {
            const [chefRows] = await connection.query("SELECT name FROM users WHERE id = ?", [userId]);
            chefName = chefRows.length > 0 ? chefRows[0].name : "";
          }
        }
        await connection.query(
          "UPDATE production_plans SET day = ?, menuId = ?, kitchenId = ?, portions = ?, note = ?, userId = ? WHERE id = ?",
          [mergedDay, menuData.id, kitchen.id, mergedPortions, mergedNote || "", userId, id]
        );
        await connection.query(
          "UPDATE production_logs SET kitchenId = ?, menuId = ?, servings = ?, qaNotes = ? WHERE id = ?",
          [kitchen.id, menuData.id, mergedPortions, mergedNote || "", id]
        );
        await checkAndNotifyShortage(id, connection);
        await connection.commit();
        connection.release();
        res.json({
          id,
          day: mergedDay,
          menuId: menuData.id,
          menuName: menuData.name,
          kitchenId: kitchen.id,
          kitchenName: kitchen.name,
          portions: mergedPortions,
          note: mergedNote || "",
          status: current.status,
          chefPenanggungJawab: chefName
        });
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Update plan error:", error3);
        res.status(500).json({ error: "Server error updating production plan." });
      }
    }
    __name(updateProductionPlan, "updateProductionPlan");
    async function deleteProductionPlan(req, res) {
      await delay(100);
      const { id } = req.params;
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const [existing] = await connection.query("SELECT * FROM production_plans WHERE id = ?", [id]);
        if (existing.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Rencana produksi tidak ditemukan." });
        }
        const current = existing[0];
        if (current.status !== "Pending") {
          connection.release();
          return res.status(400).json({ error: "Rencana sedang berjalan dan tidak bisa dihapus." });
        }
        await connection.query("DELETE FROM production_plans WHERE id = ?", [id]);
        await connection.query("DELETE FROM production_logs WHERE id = ?", [id]);
        await connection.commit();
        connection.release();
        res.json(existing[0]);
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Delete plan error:", error3);
        res.status(500).json({ error: "Server error deleting production plan." });
      }
    }
    __name(deleteProductionPlan, "deleteProductionPlan");
    async function finishProductionLog(req, res) {
      await delay(100);
      const { productionId, notes } = req.body;
      try {
        const endTime = (/* @__PURE__ */ new Date()).toISOString();
        const [existing] = await db2.query("SELECT status FROM production_logs WHERE id = ?", [productionId]);
        const currentStatus = existing[0]?.status;
        let nextStatus = "Ready";
        if (currentStatus === "Ready") {
          nextStatus = "Done";
        }
        if (notes !== void 0 && notes !== null) {
          await db2.query("UPDATE production_logs SET status = ?, endTime = ?, qaNotes = ? WHERE id = ?", [nextStatus, endTime, notes, productionId]);
        } else {
          await db2.query("UPDATE production_logs SET status = ?, endTime = ? WHERE id = ?", [nextStatus, endTime, productionId]);
        }
        await db2.query("UPDATE production_plans SET status = ? WHERE id = ?", [nextStatus, productionId]);
        res.json({ success: true, handoverId: `H-${Date.now()}` });
      } catch (error3) {
        console.error("Finish task error:", error3);
        res.status(500).json({ error: "Server error completing task." });
      }
    }
    __name(finishProductionLog, "finishProductionLog");
    async function startProductionLog(req, res) {
      await delay(100);
      const { id } = req.body;
      const connection = await db2.pool.getConnection();
      try {
        await connection.beginTransaction();
        const [tasks] = await connection.query(
          `SELECT pl.*, m.name as menuName
       FROM production_logs pl
       JOIN menus m ON pl.menuId = m.id
       WHERE pl.id = ?`,
          [id]
        );
        if (tasks.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Task not found." });
        }
        const plan = tasks[0];
        const startTime = (/* @__PURE__ */ new Date()).toISOString();
        await connection.query("UPDATE production_logs SET status = 'Cooking', startTime = ? WHERE id = ?", [startTime, id]);
        await connection.query("UPDATE production_plans SET status = 'Cooking' WHERE id = ?", [id]);
        const [menus] = await connection.query("SELECT * FROM menus WHERE id = ?", [plan.menuId]);
        if (menus.length > 0) {
          const menu = menus[0];
          const [ingredients] = await connection.query("SELECT * FROM ingredients WHERE menuId = ?", [menu.id]);
          for (const ing of ingredients) {
            const totalNeeded = Number(ing.perPortion) * plan.servings;
            let totalAvailable = 0;
            const [invItems] = await connection.query("SELECT * FROM inventory WHERE LOWER(name) = ?", [ing.name.toLowerCase()]);
            if (invItems.length > 0) {
              const invItem = invItems[0];
              const [batches] = await connection.query(
                "SELECT * FROM inventory_batches WHERE inventoryId = ? AND kitchenId = ?",
                [invItem.id, plan.kitchenId]
              );
              for (const batch of batches) {
                const qtyPacked = Number(batch.qty_packed) || 0;
                const qtyLoose = Number(batch.qty_loose) || 0;
                const batchUnit = batch.unit || "kg";
                const cap = Number(batch.package_capacity);
                const pkgUnit = (batch.package_unit || "").trim();
                const currentTotal = !isNaN(cap) && cap > 0 && pkgUnit ? qtyPacked * cap + qtyLoose : qtyLoose;
                const targetUnit = pkgUnit || batchUnit;
                const convertedVal = convertUnit(currentTotal, targetUnit, ing.unit, cap, pkgUnit);
                totalAvailable += convertedVal;
              }
            }
            if (totalAvailable < totalNeeded) {
              await connection.rollback();
              connection.release();
              return res.status(400).json({
                error: `Stok tidak mencukupi untuk bahan ${ing.name}. Butuh ${totalNeeded} ${ing.unit}, tersedia ${totalAvailable} ${ing.unit}.`
              });
            }
          }
          for (const ing of ingredients) {
            const totalNeeded = Number(ing.perPortion) * plan.servings;
            let remainingNeeded = totalNeeded;
            const [invItems] = await connection.query("SELECT * FROM inventory WHERE LOWER(name) = ?", [ing.name.toLowerCase()]);
            if (invItems.length > 0) {
              const invItem = invItems[0];
              const [batches] = await connection.query(
                "SELECT * FROM inventory_batches WHERE inventoryId = ? AND kitchenId = ? ORDER BY expiry ASC",
                [invItem.id, plan.kitchenId]
              );
              for (const batch of batches) {
                if (remainingNeeded <= 0)
                  break;
                const qtyPacked = Number(batch.qty_packed) || 0;
                const qtyLoose = Number(batch.qty_loose) || 0;
                const batchUnit = batch.unit || "kg";
                const cap = Number(batch.package_capacity);
                const pkgUnit = (batch.package_unit || "").trim();
                const currentTotal = !isNaN(cap) && cap > 0 && pkgUnit ? qtyPacked * cap + qtyLoose : qtyLoose;
                if (currentTotal > 0) {
                  const targetUnit = pkgUnit || batchUnit;
                  const neededInStandardUnit = convertUnit(remainingNeeded, ing.unit, targetUnit, cap, pkgUnit);
                  if (currentTotal >= neededInStandardUnit) {
                    const newTotal = currentTotal - neededInStandardUnit;
                    let newQtyPacked = 0;
                    let newQtyLoose = 0;
                    if (!isNaN(cap) && cap > 0) {
                      newQtyPacked = Math.floor(newTotal / cap);
                      newQtyLoose = Number((newTotal % cap).toFixed(4));
                    } else {
                      newQtyLoose = Number(newTotal.toFixed(4));
                    }
                    const formattedWeight = formatSingleBatch(newQtyPacked, newQtyLoose, batch.container, cap, pkgUnit);
                    await connection.query(
                      "UPDATE inventory_batches SET qty_packed = ?, qty_loose = ?, weight = ? WHERE id = ?",
                      [newQtyPacked, newQtyLoose, formattedWeight, batch.id]
                    );
                    remainingNeeded = 0;
                  } else {
                    const consumedInIngredientUnit = convertUnit(currentTotal, targetUnit, ing.unit, cap, pkgUnit);
                    remainingNeeded = Math.max(0, remainingNeeded - consumedInIngredientUnit);
                    const formattedWeight = formatSingleBatch(0, 0, batch.container, cap, pkgUnit);
                    await connection.query(
                      "UPDATE inventory_batches SET qty_packed = 0, qty_loose = 0, weight = ? WHERE id = ?",
                      [formattedWeight, batch.id]
                    );
                  }
                }
              }
            }
          }
        }
        await connection.commit();
        connection.release();
        res.json({ ...plan, status: "Cooking", startTime, menu: plan.menuName });
      } catch (error3) {
        await connection.rollback();
        connection.release();
        console.error("Start task error:", error3);
        res.status(500).json({ error: "Server error starting cooking task." });
      }
    }
    __name(startProductionLog, "startProductionLog");
    async function getMenus(req, res) {
      await delay(50);
      try {
        const [menus] = await db2.query("SELECT * FROM menus");
        const [ingredients] = await db2.query("SELECT * FROM ingredients");
        const formattedMenus = menus.map((menu) => {
          const menuIngredients = ingredients.filter((ing) => ing.menuId === menu.id).map((ing) => ({
            name: ing.name,
            perPortion: parseFloat(ing.perPortion),
            unit: ing.unit
          }));
          return {
            id: menu.id,
            name: menu.name,
            ingredients: menuIngredients
          };
        });
        res.json(formattedMenus);
      } catch (error3) {
        console.error("Menus list error:", error3);
        res.status(500).json({ error: "Server error fetching menus." });
      }
    }
    __name(getMenus, "getMenus");
    async function checkAndNotifyShortage(planId, connection) {
      try {
        const [plans] = await connection.query(
          `SELECT pp.*, m.name as menuName
       FROM production_plans pp
       JOIN menus m ON pp.menuId = m.id
       WHERE pp.id = ?`,
          [planId]
        );
        if (plans.length === 0)
          return;
        const plan = plans[0];
        const [ingredients] = await connection.query("SELECT * FROM ingredients WHERE menuId = ?", [plan.menuId]);
        if (ingredients.length === 0)
          return;
        const shortages = [];
        for (const ing of ingredients) {
          const needed = Number(ing.perPortion) * Number(plan.portions);
          const [invItems] = await connection.query("SELECT id FROM inventory WHERE LOWER(name) = ?", [ing.name.toLowerCase()]);
          if (invItems.length === 0) {
            shortages.push(`${ing.name} (kurang ${needed.toFixed(1)} ${ing.unit})`);
            continue;
          }
          const invId = invItems[0].id;
          const [batches] = await connection.query(
            "SELECT * FROM inventory_batches WHERE inventoryId = ? AND kitchenId = ?",
            [invId, plan.kitchenId]
          );
          let available = 0;
          for (const batch of batches) {
            const qtyPacked = Number(batch.qty_packed) || 0;
            const qtyLoose = Number(batch.qty_loose) || 0;
            const cap = Number(batch.package_capacity);
            const pkgU = batch.package_unit;
            let val = !isNaN(cap) && cap > 0 && pkgU ? qtyPacked * cap + qtyLoose : qtyLoose;
            let baseUnit = pkgU || batch.unit || "kg";
            const uLower = baseUnit.toLowerCase();
            if (uLower === "g" || uLower === "ml") {
              val = val / 1e3;
            }
            available += val;
          }
          if (needed > available) {
            const diff = needed - available;
            shortages.push(`${ing.name} (kurang ${diff.toFixed(1)} ${ing.unit})`);
          }
        }
        if (shortages.length > 0) {
          const message = `Peringatan: Rencana produksi ${plan.menuName} (${plan.portions} porsi) pada hari ${plan.day} kekurangan bahan: ${shortages.join(", ")}.`;
          const notificationId = `ntf-${Date.now()}`;
          await connection.query(
            "INSERT INTO notifications (id, kitchenId, message, isRead, createdAt) VALUES (?, ?, ?, 0, ?)",
            [notificationId, plan.kitchenId, message, (/* @__PURE__ */ new Date()).toISOString()]
          );
        }
      } catch (error3) {
        console.error("Error checking and notifying shortage:", error3);
      }
    }
    __name(checkAndNotifyShortage, "checkAndNotifyShortage");
    async function getNotifications(req, res) {
      await delay(50);
      const { kitchenId } = req.query;
      try {
        let rows;
        if (kitchenId) {
          [rows] = await db2.query("SELECT * FROM notifications WHERE kitchenId = ? ORDER BY createdAt DESC", [kitchenId]);
        } else {
          [rows] = await db2.query("SELECT * FROM notifications ORDER BY createdAt DESC");
        }
        res.json(rows);
      } catch (error3) {
        console.error("Fetch notifications error:", error3);
        res.status(500).json({ error: "Server error fetching notifications." });
      }
    }
    __name(getNotifications, "getNotifications");
    async function markNotificationRead(req, res) {
      await delay(50);
      const { id } = req.params;
      try {
        await db2.query("UPDATE notifications SET isRead = 1 WHERE id = ?", [id]);
        res.json({ success: true, id });
      } catch (error3) {
        console.error("Mark notification read error:", error3);
        res.status(500).json({ error: "Server error updating notification." });
      }
    }
    __name(markNotificationRead, "markNotificationRead");
    async function deleteNotification(req, res) {
      await delay(50);
      const { id } = req.params;
      try {
        await db2.query("DELETE FROM notifications WHERE id = ?", [id]);
        res.json({ success: true, id });
      } catch (error3) {
        console.error("Delete notification error:", error3);
        res.status(500).json({ error: "Server error deleting notification." });
      }
    }
    __name(deleteNotification, "deleteNotification");
    async function createNotification(req, res) {
      await delay(50);
      const { kitchenId, message } = req.body;
      if (!kitchenId || !message) {
        return res.status(400).json({ error: "KitchenId and message are required." });
      }
      try {
        const notificationId = `ntf-${Date.now()}`;
        await db2.query(
          "INSERT INTO notifications (id, kitchenId, message, isRead, createdAt) VALUES (?, ?, ?, 0, ?)",
          [notificationId, kitchenId, message, (/* @__PURE__ */ new Date()).toISOString()]
        );
        res.status(201).json({ id: notificationId, kitchenId, message, isRead: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      } catch (error3) {
        console.error("Create notification error:", error3);
        res.status(500).json({ error: "Server error creating notification." });
      }
    }
    __name(createNotification, "createNotification");
    async function getDailyRecap(req, res) {
      await delay(50);
      try {
        const [verifications] = await db2.query(`
      SELECT 
        sv.id,
        sv.kitchenId,
        sv.verifiedAt,
        sv.verifiedBy,
        sv.details,
        k.name as kitchenName,
        k.city as kitchenCity
      FROM stock_verifications sv
      JOIN kitchens k ON sv.kitchenId = k.id
      ORDER BY sv.verifiedAt DESC
    `);
        const [batches] = await db2.query(`
      SELECT 
        b.id as batchId,
        b.container,
        b.unit,
        i.name as materialName,
        i.packaging_name as packagingName,
        b.package_capacity as packageCapacity
      FROM inventory_batches b
      JOIN inventory i ON b.inventoryId = i.id
    `);
        const batchMap = {};
        batches.forEach((b) => {
          batchMap[b.batchId] = b;
        });
        const recapData = verifications.map((v) => {
          let itemsList = [];
          try {
            itemsList = typeof v.details === "string" ? JSON.parse(v.details) : v.details;
          } catch (e) {
            itemsList = [];
          }
          const enrichedItems = itemsList.map((item) => {
            const batchInfo = batchMap[item.batchId];
            return {
              batchId: item.batchId,
              qty_packed: item.qty_packed,
              qty_loose: item.qty_loose,
              materialName: batchInfo ? batchInfo.materialName : "Bahan Baku (ID: " + item.batchId + ")",
              container: batchInfo ? batchInfo.container : "Wadah",
              unit: batchInfo ? batchInfo.unit : "kg",
              packagingName: batchInfo ? batchInfo.packagingName : null,
              packageCapacity: batchInfo ? batchInfo.packageCapacity : null
            };
          });
          return {
            id: v.id,
            kitchenId: v.kitchenId,
            kitchenName: v.kitchenName,
            kitchenCity: v.kitchenCity,
            verifiedAt: v.verifiedAt,
            verifiedBy: v.verifiedBy,
            items: enrichedItems
          };
        });
        res.json(recapData);
      } catch (error3) {
        console.error("Daily recap error:", error3);
        res.status(500).json({ error: "Server error fetching daily recap." });
      }
    }
    __name(getDailyRecap, "getDailyRecap");
    module.exports = {
      getActivity,
      getProductionPlans,
      createProductionPlan,
      updateProductionPlan,
      deleteProductionPlan,
      finishProductionLog,
      startProductionLog,
      getMenus,
      getNotifications,
      markNotificationRead,
      deleteNotification,
      createNotification,
      getDailyRecap
    };
  }
});

// src/routes/productionRoutes.js
var require_productionRoutes = __commonJS({
  "src/routes/productionRoutes.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { Hono: Hono3 } = require_cjs();
    var router = new Hono3();
    var productionController = require_productionController();
    var { protect } = require_authMiddleware();
    var { toExpress, toExpressMiddleware } = require_expressCompat();
    router.use("*", toExpressMiddleware(protect));
    router.get("/activity", toExpress(productionController.getActivity));
    router.get("/production-plans", toExpress(productionController.getProductionPlans));
    router.post("/production-plans", toExpress(productionController.createProductionPlan));
    router.put("/production-plans/:id", toExpress(productionController.updateProductionPlan));
    router.delete("/production-plans/:id", toExpress(productionController.deleteProductionPlan));
    router.post("/production-logs/finish", toExpress(productionController.finishProductionLog));
    router.post("/production-logs/start", toExpress(productionController.startProductionLog));
    router.get("/menus", toExpress(productionController.getMenus));
    router.get("/daily-recap", toExpress(productionController.getDailyRecap));
    router.get("/notifications", toExpress(productionController.getNotifications));
    router.post("/notifications", toExpress(productionController.createNotification));
    router.put("/notifications/:id/read", toExpress(productionController.markNotificationRead));
    router.delete("/notifications/:id", toExpress(productionController.deleteNotification));
    module.exports = router;
  }
});

// src/controllers/statsController.js
var require_statsController = __commonJS({
  "src/controllers/statsController.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var db2 = require_db();
    var delay = /* @__PURE__ */ __name((ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)), "delay");
    async function getStats(req, res) {
      await delay(50);
      try {
        const [kitchenCount] = await db2.query("SELECT COUNT(*) as count FROM kitchens");
        const [successfulServings] = await db2.query("SELECT SUM(servings) as count FROM production_logs WHERE status IN ('Ready', 'Done')");
        const [currentlyCooking] = await db2.query("SELECT COUNT(*) as count FROM production_logs WHERE status = 'Cooking'");
        const [totalActivities] = await db2.query("SELECT COUNT(*) as count FROM production_logs");
        const [chefsOnDuty] = await db2.query("SELECT COUNT(*) as count FROM users WHERE role = 'Chef'");
        res.json({
          activeKitchens: kitchenCount[0].count,
          successfulServings: parseInt(successfulServings[0].count || 0),
          currentlyCooking: currentlyCooking[0].count,
          totalDailyActivities: totalActivities[0].count,
          chefsOnDuty: chefsOnDuty[0].count
        });
      } catch (error3) {
        console.error("Stats error:", error3);
        res.status(500).json({ error: "Server error fetching statistics." });
      }
    }
    __name(getStats, "getStats");
    module.exports = {
      getStats
    };
  }
});

// src/routes/statsRoutes.js
var require_statsRoutes = __commonJS({
  "src/routes/statsRoutes.js"(exports, module) {
    var import_strip_cf_connecting_ip_header29 = __toESM(require_strip_cf_connecting_ip_header());
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { Hono: Hono3 } = require_cjs();
    var router = new Hono3();
    var statsController = require_statsController();
    var { protect } = require_authMiddleware();
    var { toExpress, toExpressMiddleware } = require_expressCompat();
    router.get("/stats", toExpressMiddleware(protect), toExpress(statsController.getStats));
    module.exports = router;
  }
});

// .wrangler/tmp/bundle-GcTBYS/middleware-loader.entry.ts
var import_strip_cf_connecting_ip_header28 = __toESM(require_strip_cf_connecting_ip_header());
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-GcTBYS/middleware-insertion-facade.js
var import_strip_cf_connecting_ip_header26 = __toESM(require_strip_cf_connecting_ip_header());
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// server.js
var import_strip_cf_connecting_ip_header23 = __toESM(require_strip_cf_connecting_ip_header());
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var { Hono: Hono2 } = require_cjs();
var { cors } = require_cors();
var db = require_db();
var authRoutes = require_authRoutes();
var kitchenRoutes = require_kitchenRoutes();
var inventoryRoutes = require_inventoryRoutes();
var productionRoutes = require_productionRoutes();
var statsRoutes = require_statsRoutes();
var app = new Hono2();
app.use("*", cors());
var dbInitialized = false;
app.use("*", async (c, next) => {
  db.initDb(c.env.DB);
  if (!dbInitialized) {
    try {
      await db.initializeDatabase();
      dbInitialized = true;
    } catch (e) {
      console.error("Cloudflare D1 database initialization failed:", e);
    }
  }
  await next();
});
app.get("/", (c) => c.text("MBGflow Cloudflare Workers Backend is active."));
app.route("/api", authRoutes);
app.route("/api", inventoryRoutes);
app.route("/api", productionRoutes);
app.route("/api", statsRoutes);
app.route("/api/kitchens", kitchenRoutes);
var server_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var import_strip_cf_connecting_ip_header24 = __toESM(require_strip_cf_connecting_ip_header());
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
var import_strip_cf_connecting_ip_header25 = __toESM(require_strip_cf_connecting_ip_header());
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-GcTBYS/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = server_default;

// node_modules/wrangler/templates/middleware/common.ts
var import_strip_cf_connecting_ip_header27 = __toESM(require_strip_cf_connecting_ip_header());
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-GcTBYS/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
//# sourceMappingURL=server.js.map
