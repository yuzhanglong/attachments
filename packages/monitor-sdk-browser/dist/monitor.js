(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Monitor"] = factory();
	else
		root["Monitor"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ ((module) => {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),

/***/ "../../node_modules/@babel/runtime/helpers/defineProperty.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \*******************************************************************/
/***/ ((module) => {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ ((module) => {

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),

/***/ "../../node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ../../node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \********************************************************************/
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;

/***/ }),

/***/ "../../node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!******************************************************************!*\
  !*** ../../node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ "../../node_modules/@babel/runtime/helpers/arrayWithHoles.js");

var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ "../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");

var nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ "../../node_modules/@babel/runtime/helpers/nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),

/***/ "./src/assets-error/assets-error-monitor.ts":
/*!**************************************************!*\
  !*** ./src/assets-error/assets-error-monitor.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createAssetsErrorMonitor": () => (/* binding */ createAssetsErrorMonitor)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _utils_get_url_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/get-url-data */ "./src/utils/get-url-data.ts");
/* harmony import */ var _utils_performance_entry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/performance-entry */ "./src/utils/performance-entry.ts");


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }





/**
 * 初始化资源异常监听器
 *
 * @author yuzhanglong
 * @date 2021-08-25 21:55:26
 * @param options 初始化选项
 */

var createAssetsErrorMonitor = function createAssetsErrorMonitor(options) {
  // 保证 window 存在
  var window = (0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_2__.getBrowserWindow)();

  if (!window) {
    return;
  } // 从捕获到的 error 时间中筛选出有用的异常信息，如果这个 error 和资源异常无关，我们返回 undefined


  var getErrorInfoFromErrorEvent = function getErrorInfoFromErrorEvent(e) {
    var target = e.target;
    var tagName = target.tagName;
    var isSourceErrorEvent = target && tagName;

    if (!isSourceErrorEvent) {
      // 在通过 window.addEventListener('error') 捕获的同时
      // 一些非静态资源造成的异常也被捕获进来
      // 而这些异常应该在 js-error-monitor 处理
      return;
    } // 一般情况下资源属性为 src


    var srcAttr = target === null || target === void 0 ? void 0 : target.getAttribute('src'); // link 标签（常用于加载 css）的 href 属性会指向资源路径

    var hrefAttr = target === null || target === void 0 ? void 0 : target.getAttribute('href');
    return {
      tagName: tagName,
      url: srcAttr || hrefAttr
    };
  };

  var errorListener = function errorListener(e) {
    var res = getErrorInfoFromErrorEvent(e);

    if (!res) {
      return;
    }

    var url = res.url,
        tagName = res.tagName;
    var urlData = (0,_utils_get_url_data__WEBPACK_IMPORTED_MODULE_3__.getUrlData)(url);
    var performance = (0,_utils_performance_entry__WEBPACK_IMPORTED_MODULE_4__.getPerformanceEntriesByName)(urlData.href).pop();

    var data = _objectSpread({
      tagName: tagName.toLowerCase(),
      timestamp: Date.now(),
      performance: performance
    }, urlData); // 上报


    options.onReport({
      data: data,
      eventType: _types__WEBPACK_IMPORTED_MODULE_1__.EventType.ASSETS_ERROR
    });
  }; // 静态资源的异常加载不会冒泡到 window, 要在捕获阶段处理


  window.addEventListener('error', errorListener, true);

  var destroy = function destroy() {
    window.removeEventListener('error', errorListener, false);
  };

  return {
    destroy: destroy
  };
};

/***/ }),

/***/ "./src/assets/assets-monitor.ts":
/*!**************************************!*\
  !*** ./src/assets/assets-monitor.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createAssetsMonitor": () => (/* binding */ createAssetsMonitor)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_observe_performance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/observe-performance */ "./src/utils/observe-performance.ts");
/**
 * File: assets-monitor.ts
 * Description: 资源性能相关监控
 * Created: 2021-08-26 11:20:23
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */



function createAssetsMonitor(options) {
  var observerOptions = {
    entryTypes: [_constants__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_ENTRY_TYPES.RESOURCE]
  };
  var destroy = (0,_utils_observe_performance__WEBPACK_IMPORTED_MODULE_2__.observePerformance)(observerOptions, function (entryList) {
    entryList.forEach(function (entry) {
      options.onReport({
        data: {
          timeStamp: Date.now(),
          performance: entry
        },
        eventType: _types__WEBPACK_IMPORTED_MODULE_1__.EventType.ASSETS
      });
    });
  });
  return {
    destroy: destroy
  };
}

/***/ }),

/***/ "./src/cls/cls-monitor.ts":
/*!********************************!*\
  !*** ./src/cls/cls-monitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LAYOUT_SHIFT_GAP": () => (/* binding */ LAYOUT_SHIFT_GAP),
/* harmony export */   "LAYOUT_SHIFT_SESSION_MAX_SIZE": () => (/* binding */ LAYOUT_SHIFT_SESSION_MAX_SIZE),
/* harmony export */   "createClsMonitor": () => (/* binding */ createClsMonitor)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../../node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_get_first_and_last__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/get-first-and-last */ "./src/utils/get-first-and-last.ts");
/* harmony import */ var _utils_observe_performance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/observe-performance */ "./src/utils/observe-performance.ts");


/**
 * File: cls-monitor.ts
 * Description: 累积布局偏移监控
 * Created: 2021-08-27 23:17:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */



 // 每个 layout shift 间隔的最大值

var LAYOUT_SHIFT_GAP = 1000; // 一次 layout session 的间隔

var LAYOUT_SHIFT_SESSION_MAX_SIZE = 5000;
function createClsMonitor(clsMonitorOptions) {
  // CLS 是衡量页面整个生命周期内发生的每个意外布局偏移的最大布局偏移分数的度量
  // 可以参考：
  // https://web.dev/cls/#what-is-cls
  // https://github.com/GoogleChrome/web-vitals/blob/main/src/getCLS.ts
  var observerOptions = {
    type: _constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_ENTRY_TYPES.LAYOUT_SHIFT
  };
  var clsValue = 0;
  var sessionValue = 0;
  var sessionEntries = [];
  var destroy = (0,_utils_observe_performance__WEBPACK_IMPORTED_MODULE_4__.observePerformance)(observerOptions, function (entryList) {
    var len = entryList.length;

    for (var i = 0; i < len; i += 1) {
      var entry = entryList[i]; // 只计算没有最近用户输入的布局变化

      if (!entry.hadRecentInput) {
        var _getFirstAndLast = (0,_utils_get_first_and_last__WEBPACK_IMPORTED_MODULE_3__.getFirstAndLast)(sessionEntries),
            _getFirstAndLast2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_getFirstAndLast, 2),
            firstSessionEntry = _getFirstAndLast2[0],
            lastSessionEntry = _getFirstAndLast2[1]; // session: 某一小段时间的变化
        // 距离上一次 layoutShift 不到 1s, 距离本次 session 的开始时 layoutShift 不到 5s，参考 Chrome 的开源库：
        // https://github.com/GoogleChrome/web-vitals/blob/main/src/getCLS.ts


        if (sessionValue && entry.startTime - lastSessionEntry.startTime < LAYOUT_SHIFT_GAP && entry.startTime - firstSessionEntry.startTime < LAYOUT_SHIFT_SESSION_MAX_SIZE) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        } // 如果当前会话值大于当前 CLS 值，更新 CLS


        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          clsMonitorOptions.onReport({
            data: {
              clsValue: clsValue
            },
            eventType: _types__WEBPACK_IMPORTED_MODULE_2__.EventType.CUMULATIVE_LAYOUT_SHIFT
          });
        }
      }
    }
  });
  return {
    destroy: destroy
  };
}

/***/ }),

/***/ "./src/common-timing/common-timing-monitor.ts":
/*!****************************************************!*\
  !*** ./src/common-timing/common-timing-monitor.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createCommonTimingMonitor": () => (/* binding */ createCommonTimingMonitor)
/* harmony export */ });
/* harmony import */ var _utils_on_page_load__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/on-page-load */ "./src/utils/on-page-load.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/types.ts");


var createCommonTimingMonitor = function createCommonTimingMonitor(options) {
  (0,_utils_on_page_load__WEBPACK_IMPORTED_MODULE_0__.onPageLoad)(function () {
    options.onReport({
      data: {
        timing: performance.timing
      },
      eventType: _types__WEBPACK_IMPORTED_MODULE_1__.EventType.COMMON_PERFORMANCE_TIMING
    });
  });
};

/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PERFORMANCE_ENTRY_TYPES": () => (/* binding */ PERFORMANCE_ENTRY_TYPES)
/* harmony export */ });
/**
 * File: common.ts
 * Description: 静态常量
 * Created: 2021-08-26 11:44:30
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
var PERFORMANCE_ENTRY_TYPES;

(function (PERFORMANCE_ENTRY_TYPES) {
  PERFORMANCE_ENTRY_TYPES["RESOURCE"] = "resource";
  PERFORMANCE_ENTRY_TYPES["PAINT"] = "paint";
  PERFORMANCE_ENTRY_TYPES["LARGEST_CONTENTFUL_PAINT"] = "largest-contentful-paint";
  PERFORMANCE_ENTRY_TYPES["LAYOUT_SHIFT"] = "layout-shift";
  PERFORMANCE_ENTRY_TYPES["LONG_TASK"] = "longtask";
  PERFORMANCE_ENTRY_TYPES["FIRST_INPUT"] = "first-input";
})(PERFORMANCE_ENTRY_TYPES || (PERFORMANCE_ENTRY_TYPES = {}));

/***/ }),

/***/ "./src/fid/fid-monitor.ts":
/*!********************************!*\
  !*** ./src/fid/fid-monitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createFIDMonitor": () => (/* binding */ createFIDMonitor)
/* harmony export */ });
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/first */ "../../node_modules/lodash/first.js");
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_first__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _utils_observe_performance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/observe-performance */ "./src/utils/observe-performance.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _utils_performance_entry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/performance-entry */ "./src/utils/performance-entry.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../types */ "./src/types.ts");






var createFIDMonitor = function createFIDMonitor(options) {
  if (!(0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformanceObserver)()) {
    return;
  }

  var reportData = function reportData(entry) {
    if (!entry) {
      return;
    }

    options.onReport({
      data: {
        fid: entry
      },
      eventType: _types__WEBPACK_IMPORTED_MODULE_5__.EventType.FID
    });
  };

  var observeFID = function observeFID() {
    (0,_utils_observe_performance__WEBPACK_IMPORTED_MODULE_2__.observePerformance)({
      entryTypes: [_constants__WEBPACK_IMPORTED_MODULE_3__.PERFORMANCE_ENTRY_TYPES.FIRST_INPUT]
    }, function (entryList) {
      var entry = lodash_first__WEBPACK_IMPORTED_MODULE_0___default()(entryList);

      reportData(entry);
    }, true);
  };

  var getFIDDirectly = function getFIDDirectly() {
    return lodash_first__WEBPACK_IMPORTED_MODULE_0___default()((0,_utils_performance_entry__WEBPACK_IMPORTED_MODULE_4__.getPerformanceEntriesByType)(_constants__WEBPACK_IMPORTED_MODULE_3__.PERFORMANCE_ENTRY_TYPES.FIRST_INPUT));
  }; // 先尝试直接获取，如果没有再开启监听器


  var entry = getFIDDirectly();

  if (!entry) {
    observeFID();
  } else {
    reportData(entry);
  }
};

/***/ }),

/***/ "./src/js-error/js-error-monitor.ts":
/*!******************************************!*\
  !*** ./src/js-error/js-error-monitor.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createJsErrorMonitor": () => (/* binding */ createJsErrorMonitor)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _utils_format_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/format-error */ "./src/utils/format-error.ts");



/**
 * javaScript 异常监控能力
 *
 * @author yuzhanglong
 * @date 2021-08-24 17:08:10
 */

function createJsErrorMonitor(options) {
  var window = (0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getBrowserWindow)();

  if (!window) {
    return;
  }

  var handleError = function handleError(e) {
    var data = (0,_utils_format_error__WEBPACK_IMPORTED_MODULE_2__.formatError)(e);

    if (data) {
      options.onReport({
        eventType: _types__WEBPACK_IMPORTED_MODULE_0__.EventType.JS_ERROR,
        data: data
      });
    }
  };

  var handleRejection = function handleRejection(e) {
    options.onReport({
      eventType: _types__WEBPACK_IMPORTED_MODULE_0__.EventType.JS_ERROR,
      data: (0,_utils_format_error__WEBPACK_IMPORTED_MODULE_2__.formatError)(e)
    });
  };

  var destroyListeners = function destroyListeners() {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  }; // 捕获异步 error


  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);
  return {
    destroy: destroyListeners
  };
}

/***/ }),

/***/ "./src/mpfid/mpfid-monitor.ts":
/*!************************************!*\
  !*** ./src/mpfid/mpfid-monitor.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createMPFIDMonitor": () => (/* binding */ createMPFIDMonitor)
/* harmony export */ });
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/first */ "../../node_modules/lodash/first.js");
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_first__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_observe_performance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/observe-performance */ "./src/utils/observe-performance.ts");
/* harmony import */ var _utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _utils_on_page_load__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/on-page-load */ "./src/utils/on-page-load.ts");
/* harmony import */ var _utils_performance_entry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/performance-entry */ "./src/utils/performance-entry.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../types */ "./src/types.ts");







var createMPFIDMonitor = function createMPFIDMonitor(options) {
  if (!(0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_2__.getPerformance)() || !(0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_2__.getPerformanceObserver)()) {
    return;
  }

  var longTaskEntries = [];
  var performanceOptions = {
    entryTypes: [_constants__WEBPACK_IMPORTED_MODULE_3__.PERFORMANCE_ENTRY_TYPES.LONG_TASK]
  };
  var destroy = (0,_utils_observe_performance__WEBPACK_IMPORTED_MODULE_1__.observePerformance)(performanceOptions, function (entryList) {
    entryList.forEach(function (entry) {
      longTaskEntries.push(entry);
    });
  }); // MPFID 衡量从用户首次与您的网站交互（例如单击按钮）到浏览器实际能够响应该交互的时间。
  // 通过查找 First Contentful Paint 之后最长任务的持续时间来计算 Max Potential FID。
  // First Contentful Paint 之前的任务被排除在外，
  // 因为用户不太可能在任何内容呈现到屏幕之前尝试与您的页面进行交互
  // 而这正是 First Contentful Paint 所衡量的。

  var getMPFID = function getMPFID() {
    destroy();
    var fcp = lodash_first__WEBPACK_IMPORTED_MODULE_0___default()((0,_utils_performance_entry__WEBPACK_IMPORTED_MODULE_5__.getPerformanceEntriesByName)(_constants__WEBPACK_IMPORTED_MODULE_3__.PERFORMANCE_ENTRY_TYPES.PAINT)) || 0;
    var result = longTaskEntries.reduce(function (res, entry) {
      var duration = entry.duration,
          startTime = entry.startTime;
      var isBeforeFCP = startTime < fcp;
      return res < duration && !isBeforeFCP ? duration : res;
    }, 0);
    options.onReport({
      eventType: _types__WEBPACK_IMPORTED_MODULE_6__.EventType.MPFID,
      data: {
        mpfid: result
      }
    });
  };

  (0,_utils_on_page_load__WEBPACK_IMPORTED_MODULE_4__.onPageLoad)(function () {
    return getMPFID();
  });
};

/***/ }),

/***/ "./src/paint/paint-monitor.ts":
/*!************************************!*\
  !*** ./src/paint/paint-monitor.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPaintMonitor": () => (/* binding */ createPaintMonitor)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../../node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isFunction */ "../../node_modules/lodash/isFunction.js");
/* harmony import */ var lodash_isFunction__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isFunction__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_noop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/noop */ "./src/utils/noop.ts");
/* harmony import */ var _utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _utils_observe_performance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/observe-performance */ "./src/utils/observe-performance.ts");







var FIRST_PAINT = 'first-paint';
var FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
function createPaintMonitor(options) {
  var performance = (0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_5__.getPerformance)();

  if (!performance) {
    return;
  } // 销毁回调合集


  var destroyCallback = [];

  var getDataFromPaintPreferenceArray = function getDataFromPaintPreferenceArray(entries) {
    // 无法确定由于浏览器的差异造成的可能的先后顺序问题，我们使用 filter name 来拿到相关指标
    var firstPaintEntry = entries.filter(function (entry) {
      return entry.name === FIRST_PAINT;
    }).pop();
    var firstContentfulPaintEntry = entries.filter(function (entry) {
      return entry.name === FIRST_CONTENTFUL_PAINT;
    }).pop();
    return [firstPaintEntry, firstContentfulPaintEntry];
  };

  var doReport = function doReport(fp, fcp, type) {
    options.onReport({
      data: {
        timeStamp: Date.now(),
        firstPaint: fp,
        firstContentfulPaint: fcp
      },
      eventType: type
    });
  }; // 尝试监听器上报 FP && FCP


  var reportFirstPaintAndFirstContentfulPaintByObserver = function reportFirstPaintAndFirstContentfulPaintByObserver() {
    // 先尝试主动上报 FP && FCP
    var entries = performance.getEntriesByType(_constants__WEBPACK_IMPORTED_MODULE_2__.PERFORMANCE_ENTRY_TYPES.PAINT);

    var _getDataFromPaintPref = getDataFromPaintPreferenceArray(entries),
        _getDataFromPaintPref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_getDataFromPaintPref, 2),
        firstPaintEntry = _getDataFromPaintPref2[0],
        firstContentfulPaintEntry = _getDataFromPaintPref2[1];

    if (firstPaintEntry && firstContentfulPaintEntry) {
      doReport(firstPaintEntry, firstContentfulPaintEntry, _types__WEBPACK_IMPORTED_MODULE_3__.EventType.PAINT);
      return;
    } // 如果主动获取失败（脚本执行，但还没绘制完成），再添加监听器


    var observerOptions = {
      entryTypes: [_constants__WEBPACK_IMPORTED_MODULE_2__.PERFORMANCE_ENTRY_TYPES.PAINT]
    };
    var destroy = (0,_utils_observe_performance__WEBPACK_IMPORTED_MODULE_6__.observePerformance)(observerOptions, function (entryList) {
      var _getDataFromPaintPref3 = getDataFromPaintPreferenceArray(entryList),
          _getDataFromPaintPref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_getDataFromPaintPref3, 2),
          firstPaintEntry = _getDataFromPaintPref4[0],
          firstContentfulPaintEntry = _getDataFromPaintPref4[1];

      doReport(firstPaintEntry, firstContentfulPaintEntry, _types__WEBPACK_IMPORTED_MODULE_3__.EventType.PAINT);
    }, true);
    destroyCallback.push(destroy);
  }; // 监听最大内容绘制时间


  var reportLargestContentfulPaintByObserver = function reportLargestContentfulPaintByObserver() {
    // Largest Contentful Paint考虑的元素类型是：<img> / <img> 内的 <svg> / <video>
    var observerOptions = {
      entryTypes: [_constants__WEBPACK_IMPORTED_MODULE_2__.PERFORMANCE_ENTRY_TYPES.LARGEST_CONTENTFUL_PAINT]
    };
    var destroy = (0,_utils_observe_performance__WEBPACK_IMPORTED_MODULE_6__.observePerformance)(observerOptions, function (entryList) {
      entryList.forEach(function (entry) {
        options.onReport({
          data: {
            timeStamp: Date.now(),
            largestContentfulPaint: entry
          },
          eventType: _types__WEBPACK_IMPORTED_MODULE_3__.EventType.LARGEST_CONTENTFUL_PAINT
        });
      });
    });
    destroyCallback.push(destroy);
  };

  reportFirstPaintAndFirstContentfulPaintByObserver();
  reportLargestContentfulPaintByObserver();
  return {
    destroy: function destroy() {
      destroyCallback.forEach(function (fn) {
        return lodash_isFunction__WEBPACK_IMPORTED_MODULE_1___default()(fn) ? fn() : (0,_utils_noop__WEBPACK_IMPORTED_MODULE_4__.noop)();
      });
    }
  };
}

/***/ }),

/***/ "./src/tti/tti-monitor.ts":
/*!********************************!*\
  !*** ./src/tti/tti-monitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTtiMonitor": () => (/* binding */ createTtiMonitor)
/* harmony export */ });
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/last */ "../../node_modules/lodash/last.js");
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_last__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _utils_performance_entry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/performance-entry */ "./src/utils/performance-entry.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_create_scheduler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/create-scheduler */ "./src/utils/create-scheduler.ts");
/* harmony import */ var _utils_calculate_tti__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/calculate-tti */ "./src/utils/calculate-tti.ts");
/* harmony import */ var _utils_compute_last_known_network_2_busy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/compute-last-known-network-2-busy */ "./src/utils/compute-last-known-network-2-busy.ts");
/* harmony import */ var _utils_observe_incoming_requests__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/observe-incoming-requests */ "./src/utils/observe-incoming-requests.ts");
/* harmony import */ var _utils_observe_long_task_and_resources__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/observe-long-task-and-resources */ "./src/utils/observe-long-task-and-resources.ts");









var TIME_GAP = 5000;
/**
 * 上报 tti
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:56:44
 * @param options 选项
 * @param lastKnownNetwork2Busy
 * @param longTasks
 */

var checkAndReportTTI = function checkAndReportTTI(options, lastKnownNetwork2Busy, longTasks) {
  var fcp = (0,_utils_performance_entry__WEBPACK_IMPORTED_MODULE_2__.getPerformanceEntriesByName)('first-contentful-paint')[0];
  var searchStartTime = fcp ? fcp.startTime : 0;
  var tti = (0,_utils_calculate_tti__WEBPACK_IMPORTED_MODULE_5__.calculateTTI)({
    searchStart: searchStartTime,
    checkTimeInQuiteWindow: performance.now(),
    longTasks: longTasks,
    lastKnownNetwork2Busy: lastKnownNetwork2Busy
  });
  console.log('tti:', tti);
  options.onReport({
    eventType: _types__WEBPACK_IMPORTED_MODULE_3__.EventType.TTI,
    data: {
      tti: tti
    }
  });
};

var createTtiMonitor = function createTtiMonitor(options) {
  var _last2;

  var XMLHttpRequest = (0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getXMLHttpRequest)();
  var performanceObserver = (0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformanceObserver)();
  var performance = (0,_utils_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformance)();

  if (!XMLHttpRequest || !performanceObserver || !performance) {
    return;
  }

  var longTasks = [];
  var networkRequests = [];
  var ttiCalculatorScheduler = (0,_utils_create_scheduler__WEBPACK_IMPORTED_MODULE_4__.createScheduler)();

  var _observeIncomingReque = (0,_utils_observe_incoming_requests__WEBPACK_IMPORTED_MODULE_7__.observeIncomingRequests)(),
      getIncomingRequestsTimes = _observeIncomingReque.getIncomingRequestsTimes;

  var getLastKnownNetworkBusy = function getLastKnownNetworkBusy() {
    return (0,_utils_compute_last_known_network_2_busy__WEBPACK_IMPORTED_MODULE_6__.computeLastKnownNetwork2Busy)(getIncomingRequestsTimes(), networkRequests);
  }; // 监听 long task 和 network resource


  (0,_utils_observe_long_task_and_resources__WEBPACK_IMPORTED_MODULE_8__.observeLongTaskAndResources)(function (timeInfo) {
    // 在 long task 5 秒 后尝试获取 tti
    longTasks.push(timeInfo);
    ttiCalculatorScheduler.resetScheduler(timeInfo.endTime + TIME_GAP);
  }, function (timeInfo) {
    networkRequests.push(timeInfo); // 遇到资源请求，在最后一次请求数大于 2 的时刻五秒后尝试获取 tti

    ttiCalculatorScheduler.resetScheduler(getLastKnownNetworkBusy() + TIME_GAP);
  });

  var checkAndReport = function checkAndReport() {
    checkAndReportTTI(options, getLastKnownNetworkBusy(), longTasks);
  };

  var lastLongTask = ((_last2 = lodash_last__WEBPACK_IMPORTED_MODULE_0___default()(longTasks)) === null || _last2 === void 0 ? void 0 : _last2.endTime) || 0;
  ttiCalculatorScheduler.startSchedule(checkAndReport, Math.max(getLastKnownNetworkBusy() + TIME_GAP, lastLongTask));
};

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventType": () => (/* binding */ EventType)
/* harmony export */ });
// 推断某个对象的所有 Functional keys
// 推断某个对象所有非 Functional key
// 回调
var EventType;

(function (EventType) {
  EventType["XHR"] = "XHR";
  EventType["JS_ERROR"] = "JS_ERROR";
  EventType["ASSETS"] = "ASSETS";
  EventType["ASSETS_ERROR"] = "ASSETS_ERROR";
  EventType["PAINT"] = "PAINT";
  EventType["LARGEST_CONTENTFUL_PAINT"] = "LARGEST_CONTENTFUL_PAINT";
  EventType["CUMULATIVE_LAYOUT_SHIFT"] = "CUMULATIVE_LAYOUT_SHIFT";
  EventType["TTI"] = "TTI";
  EventType["MPFID"] = "MPFID";
  EventType["FID"] = "FID";
  EventType["COMMON_PERFORMANCE_TIMING"] = "COMMON_PERFORMANCE_TIMING";
})(EventType || (EventType = {}));

/***/ }),

/***/ "./src/utils/assign-keys-between-objects.ts":
/*!**************************************************!*\
  !*** ./src/utils/assign-keys-between-objects.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "assignKeysBetweenObjects": () => (/* binding */ assignKeysBetweenObjects)
/* harmony export */ });
/**
 * 传入多个 key, 将 object1 对应的值赋值到 object2 对应的值
 *
 * @author yuzhanglong
 * @date 2021-08-23 00:47:02
 */
var assignKeysBetweenObjects = function assignKeysBetweenObjects(obj1, obj2, keys) {
  for (var i = 0; i < keys.length; i += 1) {
    var k = keys[i]; // eslint-disable-next-line no-param-reassign

    obj2[k] = obj1[k];
  }
};

/***/ }),

/***/ "./src/utils/browser-interfaces.ts":
/*!*****************************************!*\
  !*** ./src/utils/browser-interfaces.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBrowserWindow": () => (/* binding */ getBrowserWindow),
/* harmony export */   "getPerformance": () => (/* binding */ getPerformance),
/* harmony export */   "getPerformanceObserver": () => (/* binding */ getPerformanceObserver),
/* harmony export */   "getXMLHttpRequest": () => (/* binding */ getXMLHttpRequest),
/* harmony export */   "getDocument": () => (/* binding */ getDocument)
/* harmony export */ });
/* harmony import */ var lodash_isObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isObject */ "../../node_modules/lodash/isObject.js");
/* harmony import */ var lodash_isObject__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isObject__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isFunction */ "../../node_modules/lodash/isFunction.js");
/* harmony import */ var lodash_isFunction__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isFunction__WEBPACK_IMPORTED_MODULE_1__);


var getBrowserWindow = function getBrowserWindow() {
  if (lodash_isObject__WEBPACK_IMPORTED_MODULE_0___default()(window)) {
    return window;
  }

  return null;
};
var getPerformance = function getPerformance() {
  if (getBrowserWindow() && lodash_isObject__WEBPACK_IMPORTED_MODULE_0___default()(window.performance)) {
    return window.performance;
  }

  return null;
};
var getPerformanceObserver = function getPerformanceObserver() {
  if (getBrowserWindow() && lodash_isFunction__WEBPACK_IMPORTED_MODULE_1___default()(window.PerformanceObserver)) {
    return window.PerformanceObserver;
  }

  return null;
};
var getXMLHttpRequest = function getXMLHttpRequest() {
  if (getBrowserWindow() && lodash_isFunction__WEBPACK_IMPORTED_MODULE_1___default()(window.XMLHttpRequest)) {
    return window.XMLHttpRequest;
  }

  return null;
};
var getDocument = function getDocument() {
  var window = getBrowserWindow();

  if (!window || !window.document) {
    return null;
  }

  return window.document;
};

/***/ }),

/***/ "./src/utils/calculate-tti.ts":
/*!************************************!*\
  !*** ./src/utils/calculate-tti.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calculateTTI": () => (/* binding */ calculateTTI)
/* harmony export */ });
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/last */ "../../node_modules/lodash/last.js");
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_last__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _browser_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser-interfaces */ "./src/utils/browser-interfaces.ts");



var getDomContentLoadedEventEndTime = function getDomContentLoadedEventEndTime() {
  var _getPerformance = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformance)(),
      timing = _getPerformance.timing;

  if (timing && timing.domContentLoadedEventEnd) {
    var domContentLoadedEventEnd = timing.domContentLoadedEventEnd,
        navigationStart = timing.navigationStart;
    return domContentLoadedEventEnd - navigationStart;
  }

  return null;
};
/**
 * 计算 TTI
 *
 * TTI 算法描述如下：
 * - 从起始点（一般是 FCP 或者 FMP），向前搜索一个不小于 5s 的静默窗口期
 * - 所谓静默窗口期，就是该窗口所对应的时间没有 long task 并且进行中的网络请求数目不超过 2 个
 * - 如果没有找到 long task，则起始点就是 TTI
 * - 如果 TTI < DOMContentLoadedEventEnd, 则以 DOMContentLoadedEventEnd 作为 TTI
 *
 * @author yuzhanglong
 * @date 2021-09-06 15:31:41
 * @param options 见 TTICalculateOptions
 */


var calculateTTI = function calculateTTI(options) {
  var searchStart = options.searchStart,
      longTasks = options.longTasks,
      checkTimeInQuiteWindow = options.checkTimeInQuiteWindow,
      lastKnownNetwork2Busy = options.lastKnownNetwork2Busy; // 确保静默窗口期中没有请求数超过 2 的时刻

  if (checkTimeInQuiteWindow - lastKnownNetwork2Busy < 5000) {
    return null;
  } // 如果没有 long task，那么 FCP 时间就是 TTI 时间


  var maybeFCI = longTasks.length === 0 ? searchStart : lodash_last__WEBPACK_IMPORTED_MODULE_0___default()(longTasks).endTime; // 确保窗口期没有 long task

  if (checkTimeInQuiteWindow - maybeFCI < 5000) {
    return null;
  }

  return Math.max(maybeFCI, getDomContentLoadedEventEndTime());
};

/***/ }),

/***/ "./src/utils/compute-last-known-network-2-busy.ts":
/*!********************************************************!*\
  !*** ./src/utils/compute-last-known-network-2-busy.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "computeLastKnownNetwork2Busy": () => (/* binding */ computeLastKnownNetwork2Busy)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * 计算当前时间点之前，距离最近的、同时进行的网络请求数量 >= 2 的时机，单位为毫秒
 *
 * @author yuzhanglong
 * @date 2021-09-05 23:49:27
 * @param incompleteRequestStarts 已经开始但未结束的网络请求（你可以通过 劫持 XMLHttpRequest 来得到）
 * @param observedResourceRequests 已经监听到的网络(资源)请求（你可以通过 Performance API 来得到）
 */
var computeLastKnownNetwork2Busy = function computeLastKnownNetwork2Busy(incompleteRequestStarts, observedResourceRequests) {
  // 当前进行的请求超过 2 个，直接返回当前时间
  if (incompleteRequestStarts.length > 2) {
    return performance.now();
  } // endpoints 包含了每个请求的开始时间点和结束时间点，最后会按时间先后顺序排序


  var endpoints = [];

  var _iterator = _createForOfIteratorHelper(observedResourceRequests),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
          startTime = _step$value.startTime,
          endTime = _step$value.endTime;
      endpoints.push({
        timestamp: startTime,
        type: 'request-start'
      });
      endpoints.push({
        timestamp: endTime,
        type: 'request-end'
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(incompleteRequestStarts),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var incompleteRequestStart = _step2.value;
      endpoints.push({
        timestamp: incompleteRequestStart,
        type: 'request-start'
      });
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  endpoints.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  }); // 开始【时间倒推】，首先初始化当前活跃的请求数目
  // 接下来，如果是请求开始阶段，则将此时活跃的请求数 - 1，反之 + 1
  // 如果在某一个时刻 currentActive 的值大于 2，那么这个时候就是当前时间点之前，距离最近的、同时进行的网络请求数量 >= 2 的时机

  var currentActive = incompleteRequestStarts.length;

  for (var i = endpoints.length - 1; i >= 0; i -= 1) {
    var endpoint = endpoints[i];

    switch (endpoint.type) {
      case 'request-start':
        currentActive -= 1;
        break;

      case 'request-end':
        currentActive += 1;

        if (currentActive > 2) {
          return endpoint.timestamp;
        }

        break;

      default:
        throw Error('Internal Error: This should never happen');
    }
  }

  return 0;
};

/***/ }),

/***/ "./src/utils/create-scheduler.ts":
/*!***************************************!*\
  !*** ./src/utils/create-scheduler.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createScheduler": () => (/* binding */ createScheduler)
/* harmony export */ });
/**
 * File: create-scheduler.ts
 * Description: 定时调度器工具函数
 * Created: 2021-09-05 21:06:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
var createScheduler = function createScheduler() {
  // 任务 id
  var taskId; // 执行调度的回调函数

  var callback; // 即将调度的时间

  var scheduleTime = -Infinity;

  var getCurrentTime = function getCurrentTime() {
    return performance.now();
  };

  var clearCurrentScheduleTimer = function clearCurrentScheduleTimer() {
    window.clearTimeout(taskId);
  };

  var resetScheduler = function resetScheduler(newScheduleTime) {
    if (!callback) {
      return;
    } // 新配置的时间早于即将调度的时间，不处理


    if (newScheduleTime < scheduleTime) {
      return;
    }

    clearCurrentScheduleTimer();
    var newTime = newScheduleTime - getCurrentTime();
    taskId = window.setTimeout(function () {
      callback();
    }, newTime);
    scheduleTime = newScheduleTime;
  };

  var startSchedule = function startSchedule(cb, time) {
    callback = cb;
    resetScheduler(time);
  };

  var stopSchedule = function stopSchedule() {
    clearCurrentScheduleTimer();
    callback = undefined;
  };

  return {
    resetScheduler: resetScheduler,
    startSchedule: startSchedule,
    stopSchedule: stopSchedule
  };
};

/***/ }),

/***/ "./src/utils/format-error.ts":
/*!***********************************!*\
  !*** ./src/utils/format-error.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatError": () => (/* binding */ formatError)
/* harmony export */ });
/* harmony import */ var _instance_of__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance-of */ "./src/utils/instance-of.ts");

/**
 * 格式化错误信息，将其转换为简单对象
 *
 * @author yuzhanglong
 * @date 2021-08-24 22:59:27
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error
 * @param e 异常 ErrorEvent, 或者 PromiseRejectionEvent 实例
 * 前者来自 window.addEventListener('error') 的回调
 * 后者来自 window.addEventListener('unhandledrejection') 的回调
 */

function formatError(e) {
  var error;

  if ((0,_instance_of__WEBPACK_IMPORTED_MODULE_0__.instanceOf)(e, PromiseRejectionEvent)) {
    error = e.reason;
  } else if ((0,_instance_of__WEBPACK_IMPORTED_MODULE_0__.instanceOf)(e, ErrorEvent)) {
    error = e.error;
  } else {
    // @ts-ignore
    error = e.reason || e.error;
  }

  if (!error) {
    // 这是为了处理跨域脚本内部异常详细信息无法获取的边界情况
    // 此类错误我们忽略之
    return;
  }

  return {
    // 发生异常的时间戳
    timestamp: Date.now(),
    // 核心内容，包括堆栈错误信息
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  };
}

/***/ }),

/***/ "./src/utils/format-plain-headers-string.ts":
/*!**************************************************!*\
  !*** ./src/utils/format-plain-headers-string.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatPlainHeadersString": () => (/* binding */ formatPlainHeadersString)
/* harmony export */ });
/**
 * 格式化 headers 字符串，返回一个对象
 *
 * @author yuzhanglong
 * @date 2021-08-24 00:26:43
 */
var formatPlainHeadersString = function formatPlainHeadersString(headerStr) {
  var headers = headerStr.trim().split(/[\r\n]+/);
  var headerMap = {};

  for (var i = 0; i < headers.length; i += 1) {
    var line = headers[i];
    var parts = line.split(': ');
    var header = parts.shift();
    headerMap[header] = parts.join(': ');
  }

  return headerMap;
};

/***/ }),

/***/ "./src/utils/get-first-and-last.ts":
/*!*****************************************!*\
  !*** ./src/utils/get-first-and-last.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFirstAndLast": () => (/* binding */ getFirstAndLast)
/* harmony export */ });
var getFirstAndLast = function getFirstAndLast(arr) {
  if (Array.isArray(arr) && arr.length > 0) {
    return [arr[0], arr[arr.length - 1]];
  }

  return [undefined, undefined];
};

/***/ }),

/***/ "./src/utils/get-url-data.ts":
/*!***********************************!*\
  !*** ./src/utils/get-url-data.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUrlData": () => (/* binding */ getUrlData)
/* harmony export */ });
/* harmony import */ var _browser_interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser-interfaces */ "./src/utils/browser-interfaces.ts");
/* harmony import */ var _assign_keys_between_objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assign-keys-between-objects */ "./src/utils/assign-keys-between-objects.ts");


var getUrlData = function getUrlData(url) {
  // 支持 url
  var keys = ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol', 'search'];
  var res = {
    url: url,
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: ''
  };
  var w = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_0__.getBrowserWindow)(); // 这里不推荐用浏览器内置的 URL 实例，而是利用原生 a 标签的特性来实现
  // 因为像下面 img 标签这样的错误，拿到的 "url" 是不规范的，使用 new URL() 会抛出异常
  // <img src="i_am_not_a_url"/>

  if (w && w.document) {
    var a = document.createElement('a');
    a.href = url;
    (0,_assign_keys_between_objects__WEBPACK_IMPORTED_MODULE_1__.assignKeysBetweenObjects)(a, res, keys);
  }

  return res;
};

/***/ }),

/***/ "./src/utils/instance-of.ts":
/*!**********************************!*\
  !*** ./src/utils/instance-of.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "instanceOf": () => (/* binding */ instanceOf)
/* harmony export */ });
var instanceOf = function instanceOf(a, b) {
  if (b) {
    return a instanceof b;
  }

  return false;
};

/***/ }),

/***/ "./src/utils/noop.ts":
/*!***************************!*\
  !*** ./src/utils/noop.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "noop": () => (/* binding */ noop)
/* harmony export */ });
/**
 * 空函数
 *
 * @author yuzhanglong
 * @date 2021-08-22 20:46:34
 */
var noop = function noop() {
  return undefined;
};

/***/ }),

/***/ "./src/utils/observe-incoming-requests.ts":
/*!************************************************!*\
  !*** ./src/utils/observe-incoming-requests.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observeIncomingRequests": () => (/* binding */ observeIncomingRequests)
/* harmony export */ });
/* harmony import */ var _patch_method__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./patch-method */ "./src/utils/patch-method.ts");


/**
 * 使用劫持方式监听正在进行中的请求
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:59:14
 * @return incomingRequests 一个对象，唯一的 key 代表某个进行中的请求
 * 如果是 **XMLHttpRequest**, 为偶数，如果是 **fetch** 则为奇数，对应的 value 为这次请求开始的时间戳
 * @return getIncomingRequestsTimes 基于所有 incomingRequests 的 value 合并得到的一个数组
 */
var observeIncomingRequests = function observeIncomingRequests() {
  var incomingRequests = {}; // 监听 XMLHttpRequest open 方法

  (0,_patch_method__WEBPACK_IMPORTED_MODULE_0__.patchMethod)(XMLHttpRequest.prototype, 'open', function (origin) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var method = args[0];
      this.taggedMethod = method;
      return origin.apply(this, args);
    };
  })(); // 监听 XMLHttpRequest send 方法

  (0,_patch_method__WEBPACK_IMPORTED_MODULE_0__.patchMethod)(XMLHttpRequest.prototype, 'send', function (origin) {
    var uniqueId = 0;
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (this.taggedMethod !== 'GET') {
        return origin.apply(this, args);
      } // uniqueId 为偶数


      uniqueId += 2;
      var reqId = uniqueId;
      incomingRequests[reqId] = Date.now();
      (0,_patch_method__WEBPACK_IMPORTED_MODULE_0__.patchMethod)(this, 'onreadystatechange', function (origin) {
        return function (e) {
          origin.call(this, e);

          if (this.readyState === XMLHttpRequest.DONE) {
            // 从【进行中】表中移除
            delete incomingRequests[reqId];
          }
        };
      })();
      return origin.apply(this, args);
    };
  })(); // 监听 window.fetch 方法

  (0,_patch_method__WEBPACK_IMPORTED_MODULE_0__.patchMethod)(window, 'fetch', function (origin) {
    var uniqueId = 0;
    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var request = args[0],
          init = args[1];
      var method = (request === null || request === void 0 ? void 0 : request.method) || init.method;

      if (method !== 'GET') {
        return origin.apply(void 0, args);
      }

      return new Promise(function (resolve, reject) {
        uniqueId += 2;
        var reqId = uniqueId;
        incomingRequests[reqId] = Date.now();
        origin.apply(void 0, args).then(function (value) {
          delete incomingRequests[reqId];
          resolve(value);
        })["catch"](function (e) {
          delete incomingRequests[reqId];
          reject(e);
        });
      });
    };
  })();

  var getIncomingRequestsTimes = function getIncomingRequestsTimes() {
    var entries = Object.entries(incomingRequests);
    return entries.map(function (res) {
      return res[1];
    });
  };

  return {
    incomingRequests: incomingRequests,
    getIncomingRequestsTimes: getIncomingRequestsTimes
  };
};

/***/ }),

/***/ "./src/utils/observe-long-task-and-resources.ts":
/*!******************************************************!*\
  !*** ./src/utils/observe-long-task-and-resources.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observeLongTaskAndResources": () => (/* binding */ observeLongTaskAndResources)
/* harmony export */ });
/* harmony import */ var _observe_performance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observe-performance */ "./src/utils/observe-performance.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




/**
 * 监听长任务和资源请求
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:37:20
 * @param onLongTask 在监听到长任务时做些什么，第一个回调参数为本次长任务的开始时间和结束时间，第二个为对应的 performanceEntry 对象
 * @param onNetworkRequest 在监听到网络请求后做些什么，参数同上
 */
var observeLongTaskAndResources = function observeLongTaskAndResources(onLongTask, onNetworkRequest) {
  (0,_observe_performance__WEBPACK_IMPORTED_MODULE_0__.observePerformance)({
    entryTypes: [_constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_ENTRY_TYPES.LONG_TASK, _constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_ENTRY_TYPES.RESOURCE]
  }, function (entryList) {
    var _iterator = _createForOfIteratorHelper(entryList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _entry = _step.value;
        var startTime = _entry.startTime,
            duration = _entry.duration,
            entryType = _entry.entryType;

        if (entryType === _constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_ENTRY_TYPES.LONG_TASK) {
          onLongTask({
            startTime: startTime,
            endTime: startTime + duration
          }, _entry);
        } else if (_entry.entryType === _constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_ENTRY_TYPES.RESOURCE) {
          var _ref = _entry,
              fetchStart = _ref.fetchStart,
              responseEnd = _ref.responseEnd;
          onNetworkRequest({
            startTime: fetchStart,
            endTime: responseEnd
          }, _entry);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
};

/***/ }),

/***/ "./src/utils/observe-performance.ts":
/*!******************************************!*\
  !*** ./src/utils/observe-performance.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observePerformance": () => (/* binding */ observePerformance)
/* harmony export */ });
/* harmony import */ var _noop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./noop */ "./src/utils/noop.ts");
/* harmony import */ var _browser_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser-interfaces */ "./src/utils/browser-interfaces.ts");


/**
 * 监听 performance 性能指标， 当不支持 performance API 时，我们不进行任何动作
 *
 * @author yuzhanglong
 * @date 2021-08-26 16:38:12
 * @param options 监听的选项，可以在这里配置监听目标
 * @param callback 监听回调
 * @param once 仅监听一次
 * @return Function 一个销毁监听器的函数，如果 performance API 不存在，则返回 noop
 *
 */

var observePerformance = function observePerformance(options, callback) {
  var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var destroy = _noop__WEBPACK_IMPORTED_MODULE_0__.noop;
  var isExecuted = false; // 通过 observer 监听

  var PerformanceObserver = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformanceObserver)();

  if (PerformanceObserver) {
    var observerInstance = new PerformanceObserver(function (list) {
      // 用户配置了只回调一次，并且已经执行过，我们不再执行
      if (once && isExecuted) {
        return;
      } // performanceEntries 是【某小一段时间】得到的性能结果
      // 我们再遍历他们，并逐一调用 callback, 这样上层调用者无需再额外处理


      var performanceEntries = list.getEntries();
      callback(performanceEntries);
      isExecuted = true;
    });
    observerInstance.observe(options); // 覆写销毁函数

    destroy = function destroy() {
      observerInstance.disconnect();
    };
  }

  return destroy;
};

/***/ }),

/***/ "./src/utils/on-page-load.ts":
/*!***********************************!*\
  !*** ./src/utils/on-page-load.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onPageLoad": () => (/* binding */ onPageLoad)
/* harmony export */ });
/* harmony import */ var _browser_interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser-interfaces */ "./src/utils/browser-interfaces.ts");

var onPageLoad = function onPageLoad(callback) {
  var window = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_0__.getBrowserWindow)();
  var document = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_0__.getDocument)();

  if (!window || !document) {
    return;
  }

  if (document.readyState === 'complete') {
    callback();
    return;
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      callback();
    }, 0);
  }, false);
};

/***/ }),

/***/ "./src/utils/patch-method.ts":
/*!***********************************!*\
  !*** ./src/utils/patch-method.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patchMethod": () => (/* binding */ patchMethod)
/* harmony export */ });
/**
 * patch 一个方法（方法劫持）
 *
 * @author yuzhanglong
 * @date 2021-08-22 20:41:45
 * @param obj 被劫持的对象
 * @param key 需要劫持的 key
 * @param patchFn 劫持回调，劫持回调返回一个函数（即覆盖后的函数），其中：
 * 回调的第一个参数为将要被覆盖的对象
 * 第二个参数为携带的参数（可选）
 * @return function 返回一个函数，当这个函数被调用后，劫持工作将被执行
 */
var patchMethod = function patchMethod(obj, key, patchFn) {
  return function () {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    // eslint-disable-next-line no-param-reassign
    obj[key] = patchFn.apply(void 0, [obj[key]].concat(params));
  };
};

/***/ }),

/***/ "./src/utils/performance-entry.ts":
/*!****************************************!*\
  !*** ./src/utils/performance-entry.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPerformanceEntriesByName": () => (/* binding */ getPerformanceEntriesByName),
/* harmony export */   "getPerformanceEntriesByType": () => (/* binding */ getPerformanceEntriesByType)
/* harmony export */ });
/* harmony import */ var lodash_isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isFunction */ "../../node_modules/lodash/isFunction.js");
/* harmony import */ var lodash_isFunction__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isFunction__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _browser_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser-interfaces */ "./src/utils/browser-interfaces.ts");


/**
 * 根据 entry 名称获取 entry，如果浏览器不兼容，返回一个空数组
 *
 * @author yuzhanglong
 * @date 2021-09-12 11:12:21
 * @param name entry 名称
 */

var getPerformanceEntriesByName = function getPerformanceEntriesByName(name) {
  var performance = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformance)();

  if (performance && lodash_isFunction__WEBPACK_IMPORTED_MODULE_0___default()(performance.getEntriesByName)) {
    return performance.getEntriesByName(name);
  }

  return [];
};
/**
 * 根据 entry 类型获取 entry，如果浏览器不兼容，返回一个空数组
 *
 * @author yuzhanglong
 * @date 2021-09-12 11:12:21
 * @param type entry 名称
 */

var getPerformanceEntriesByType = function getPerformanceEntriesByType(type) {
  var performance = (0,_browser_interfaces__WEBPACK_IMPORTED_MODULE_1__.getPerformance)();

  if (performance && lodash_isFunction__WEBPACK_IMPORTED_MODULE_0___default()(performance.getEntriesByType)) {
    return performance.getEntriesByType(type);
  }

  return [];
};

/***/ }),

/***/ "./src/xhr/xhr-monitor.ts":
/*!********************************!*\
  !*** ./src/xhr/xhr-monitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createXhrMonitor": () => (/* binding */ createXhrMonitor)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_patch_method__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/patch-method */ "./src/utils/patch-method.ts");
/* harmony import */ var _utils_format_plain_headers_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/format-plain-headers-string */ "./src/utils/format-plain-headers-string.ts");
/* harmony import */ var _utils_get_url_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/get-url-data */ "./src/utils/get-url-data.ts");
/* harmony import */ var _utils_performance_entry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/performance-entry */ "./src/utils/performance-entry.ts");


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }






/**
 * 初始化 xhr 监控
 *
 * @author yuzhanglong
 * @date 2021-08-23 21:54:29
 * @param options 监控配置
 */

function createXhrMonitor(options) {
  var XMLHttpRequestPrototype = XMLHttpRequest.prototype; // 生成请求报告

  var getReportData = function getReportData(patchedXhrInstance) {
    var current = Date.now();
    var responseHeaders = (patchedXhrInstance === null || patchedXhrInstance === void 0 ? void 0 : patchedXhrInstance.getAllResponseHeaders()) || '';
    var isError = patchedXhrInstance.status >= 400;
    var _patchedXhrInstance$m = patchedXhrInstance.monitorRecords,
        url = _patchedXhrInstance$m.url,
        method = _patchedXhrInstance$m.method,
        startTime = _patchedXhrInstance$m.startTime,
        requestHeaders = _patchedXhrInstance$m.requestHeaders,
        requestData = _patchedXhrInstance$m.requestData;
    return {
      request: _objectSpread(_objectSpread({}, (0,_utils_get_url_data__WEBPACK_IMPORTED_MODULE_4__.getUrlData)(url)), {}, {
        method: method.toUpperCase(),
        headers: requestHeaders,
        body: isError ? "".concat(requestData) : null
      }),
      response: {
        status: patchedXhrInstance.status || -1,
        timestamp: current,
        headers: responseHeaders ? (0,_utils_format_plain_headers_string__WEBPACK_IMPORTED_MODULE_3__.formatPlainHeadersString)(responseHeaders) : {},
        body: isError ? "".concat(patchedXhrInstance.response) : null
      },
      // 如果URL有重定向， responseURL 的值会是经过多次重定向后的最终 URL
      performance: (0,_utils_performance_entry__WEBPACK_IMPORTED_MODULE_5__.getPerformanceEntriesByName)(patchedXhrInstance.responseURL).pop(),
      duration: current - startTime
    };
  }; // XMLHttpRequest.prototype.open


  var patchOpen = (0,_utils_patch_method__WEBPACK_IMPORTED_MODULE_2__.patchMethod)(XMLHttpRequestPrototype, 'open', function (open) {
    return function () {
      for (var _len = arguments.length, openOptions = new Array(_len), _key = 0; _key < _len; _key++) {
        openOptions[_key] = arguments[_key];
      }

      var method = openOptions[0],
          url = openOptions[1];
      this.monitorRecords = this.monitorRecords || {};
      this.monitorRecords.url = url;
      this.monitorRecords.method = method;
      return open.apply(this, openOptions);
    };
  }); // XMLHttpRequest.prototype.onReadyStateChange

  var patchOnReadyStateChange = function patchOnReadyStateChange(target) {
    return (0,_utils_patch_method__WEBPACK_IMPORTED_MODULE_2__.patchMethod)(target, 'onreadystatechange', function (origin) {
      return function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          options.onReport({
            eventType: _types__WEBPACK_IMPORTED_MODULE_1__.EventType.XHR,
            data: getReportData(this)
          });
        }

        for (var _len2 = arguments.length, event = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          event[_key2] = arguments[_key2];
        }

        return origin && origin.apply(this, event);
      };
    });
  }; // XMLHttpRequest.prototype.send


  var patchSend = (0,_utils_patch_method__WEBPACK_IMPORTED_MODULE_2__.patchMethod)(XMLHttpRequestPrototype, 'send', function (send) {
    return function () {
      // 不可以直接修改原型上的 onReadyStateChange
      patchOnReadyStateChange(this)();
      this.monitorRecords = this.monitorRecords || {};
      this.monitorRecords.startTime = new Date().getTime();
      this.monitorRecords.requestData = send === null || send === void 0 ? void 0 : send[0];

      for (var _len3 = arguments.length, sendOptions = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        sendOptions[_key3] = arguments[_key3];
      }

      return send.apply(this, sendOptions);
    };
  });
  var patchSetRequestHeader = (0,_utils_patch_method__WEBPACK_IMPORTED_MODULE_2__.patchMethod)(XMLHttpRequestPrototype, 'setRequestHeader', function (origin) {
    return function () {
      for (var _len4 = arguments.length, options = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        options[_key4] = arguments[_key4];
      }

      var name = options[0],
          value = options[1];
      this.monitorRecords = this.monitorRecords || {};
      this.monitorRecords.requestHeaders = this.monitorRecords.requestHeaders || {};
      this.monitorRecords.requestHeaders[name.toLowerCase()] = value;
      return origin.apply(this, options);
    };
  }); // patch 需要覆盖的 methods

  patchOpen();
  patchSend();
  patchSetRequestHeader();
}

/***/ }),

/***/ "../../node_modules/lodash/_Symbol.js":
/*!********************************************!*\
  !*** ../../node_modules/lodash/_Symbol.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "../../node_modules/lodash/_baseGetTag.js":
/*!************************************************!*\
  !*** ../../node_modules/lodash/_baseGetTag.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "../../node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "../../node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "../../node_modules/lodash/_freeGlobal.js":
/*!************************************************!*\
  !*** ../../node_modules/lodash/_freeGlobal.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "../../node_modules/lodash/_getRawTag.js":
/*!***********************************************!*\
  !*** ../../node_modules/lodash/_getRawTag.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "../../node_modules/lodash/_objectToString.js":
/*!****************************************************!*\
  !*** ../../node_modules/lodash/_objectToString.js ***!
  \****************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "../../node_modules/lodash/_root.js":
/*!******************************************!*\
  !*** ../../node_modules/lodash/_root.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "../../node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "../../node_modules/lodash/first.js":
/*!******************************************!*\
  !*** ../../node_modules/lodash/first.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./head */ "../../node_modules/lodash/head.js");


/***/ }),

/***/ "../../node_modules/lodash/head.js":
/*!*****************************************!*\
  !*** ../../node_modules/lodash/head.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

module.exports = head;


/***/ }),

/***/ "../../node_modules/lodash/isFunction.js":
/*!***********************************************!*\
  !*** ../../node_modules/lodash/isFunction.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "../../node_modules/lodash/isObject.js":
/*!*********************************************!*\
  !*** ../../node_modules/lodash/isObject.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "../../node_modules/lodash/last.js":
/*!*****************************************!*\
  !*** ../../node_modules/lodash/last.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createClsMonitor": () => (/* reexport safe */ _cls_cls_monitor__WEBPACK_IMPORTED_MODULE_0__.createClsMonitor),
/* harmony export */   "createXhrMonitor": () => (/* reexport safe */ _xhr_xhr_monitor__WEBPACK_IMPORTED_MODULE_1__.createXhrMonitor),
/* harmony export */   "createJsErrorMonitor": () => (/* reexport safe */ _js_error_js_error_monitor__WEBPACK_IMPORTED_MODULE_2__.createJsErrorMonitor),
/* harmony export */   "createAssetsMonitor": () => (/* reexport safe */ _assets_assets_monitor__WEBPACK_IMPORTED_MODULE_3__.createAssetsMonitor),
/* harmony export */   "createAssetsErrorMonitor": () => (/* reexport safe */ _assets_error_assets_error_monitor__WEBPACK_IMPORTED_MODULE_4__.createAssetsErrorMonitor),
/* harmony export */   "createPaintMonitor": () => (/* reexport safe */ _paint_paint_monitor__WEBPACK_IMPORTED_MODULE_5__.createPaintMonitor),
/* harmony export */   "createTtiMonitor": () => (/* reexport safe */ _tti_tti_monitor__WEBPACK_IMPORTED_MODULE_6__.createTtiMonitor),
/* harmony export */   "createMPFIDMonitor": () => (/* reexport safe */ _mpfid_mpfid_monitor__WEBPACK_IMPORTED_MODULE_7__.createMPFIDMonitor),
/* harmony export */   "createFIDMonitor": () => (/* reexport safe */ _fid_fid_monitor__WEBPACK_IMPORTED_MODULE_8__.createFIDMonitor),
/* harmony export */   "createCommonTimingMonitor": () => (/* reexport safe */ _common_timing_common_timing_monitor__WEBPACK_IMPORTED_MODULE_9__.createCommonTimingMonitor)
/* harmony export */ });
/* harmony import */ var _cls_cls_monitor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cls/cls-monitor */ "./src/cls/cls-monitor.ts");
/* harmony import */ var _xhr_xhr_monitor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr/xhr-monitor */ "./src/xhr/xhr-monitor.ts");
/* harmony import */ var _js_error_js_error_monitor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js-error/js-error-monitor */ "./src/js-error/js-error-monitor.ts");
/* harmony import */ var _assets_assets_monitor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/assets-monitor */ "./src/assets/assets-monitor.ts");
/* harmony import */ var _assets_error_assets_error_monitor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets-error/assets-error-monitor */ "./src/assets-error/assets-error-monitor.ts");
/* harmony import */ var _paint_paint_monitor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./paint/paint-monitor */ "./src/paint/paint-monitor.ts");
/* harmony import */ var _tti_tti_monitor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tti/tti-monitor */ "./src/tti/tti-monitor.ts");
/* harmony import */ var _mpfid_mpfid_monitor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mpfid/mpfid-monitor */ "./src/mpfid/mpfid-monitor.ts");
/* harmony import */ var _fid_fid_monitor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./fid/fid-monitor */ "./src/fid/fid-monitor.ts");
/* harmony import */ var _common_timing_common_timing_monitor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common-timing/common-timing-monitor */ "./src/common-timing/common-timing-monitor.ts");
/**
 * File: index.ts
 * Description: entry
 * Created: 2021-08-23 22:06:48
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */










})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});