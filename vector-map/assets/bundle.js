/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* no static exports found */
/* all exports used */
/*!******************************************!*\
  !*** ./~/simplify-geometry/lib/index.js ***!
  \******************************************/
/***/ (function(module, exports, __webpack_require__) {

eval("var Line = __webpack_require__(/*! ./line */ 2);\n\nvar simplifyGeometry = function(points, tolerance){\n\n  var dmax = 0;\n  var index = 0;\n\n  for (var i = 1; i <= points.length - 2; i++){\n    var d = new Line(points[0], points[points.length - 1]).perpendicularDistance(points[i]);\n    if (d > dmax){\n      index = i;\n      dmax = d;\n    }\n  }\n\n  if (dmax > tolerance){\n    var results_one = simplifyGeometry(points.slice(0, index), tolerance);\n    var results_two = simplifyGeometry(points.slice(index, points.length), tolerance);\n\n    var results = results_one.concat(results_two);\n\n  }\n\n  else if (points.length > 1) {\n\n    results = [points[0], points[points.length - 1]];\n\n  }\n\n  else {\n\n    results = [points[0]];\n\n  }\n\n  return results;\n\n\n}\n\nmodule.exports = simplifyGeometry;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL34vc2ltcGxpZnktZ2VvbWV0cnkvbGliL2luZGV4LmpzPzc2ZjIiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIExpbmUgPSByZXF1aXJlKCcuL2xpbmUnKTtcblxudmFyIHNpbXBsaWZ5R2VvbWV0cnkgPSBmdW5jdGlvbihwb2ludHMsIHRvbGVyYW5jZSl7XG5cbiAgdmFyIGRtYXggPSAwO1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IHBvaW50cy5sZW5ndGggLSAyOyBpKyspe1xuICAgIHZhciBkID0gbmV3IExpbmUocG9pbnRzWzBdLCBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdKS5wZXJwZW5kaWN1bGFyRGlzdGFuY2UocG9pbnRzW2ldKTtcbiAgICBpZiAoZCA+IGRtYXgpe1xuICAgICAgaW5kZXggPSBpO1xuICAgICAgZG1heCA9IGQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRtYXggPiB0b2xlcmFuY2Upe1xuICAgIHZhciByZXN1bHRzX29uZSA9IHNpbXBsaWZ5R2VvbWV0cnkocG9pbnRzLnNsaWNlKDAsIGluZGV4KSwgdG9sZXJhbmNlKTtcbiAgICB2YXIgcmVzdWx0c190d28gPSBzaW1wbGlmeUdlb21ldHJ5KHBvaW50cy5zbGljZShpbmRleCwgcG9pbnRzLmxlbmd0aCksIHRvbGVyYW5jZSk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHJlc3VsdHNfb25lLmNvbmNhdChyZXN1bHRzX3R3byk7XG5cbiAgfVxuXG4gIGVsc2UgaWYgKHBvaW50cy5sZW5ndGggPiAxKSB7XG5cbiAgICByZXN1bHRzID0gW3BvaW50c1swXSwgcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXV07XG5cbiAgfVxuXG4gIGVsc2Uge1xuXG4gICAgcmVzdWx0cyA9IFtwb2ludHNbMF1dO1xuXG4gIH1cblxuICByZXR1cm4gcmVzdWx0cztcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2ltcGxpZnlHZW9tZXRyeTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zaW1wbGlmeS1nZW9tZXRyeS9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/* no static exports found */
/* all exports used */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar simplify = __webpack_require__(/*! simplify-geometry */ 0);\nwindow.simplify = simplify;\n\nmodule.exports = function (geojson, tolerance, dontClone) {\n  if (!dontClone) geojson = JSON.parse(JSON.stringify(geojson)); // clone obj\n  if (geojson.features) return simplifyFeatureCollection(geojson, tolerance);else if (geojson.type && geojson.type === 'Feature') return simplifyFeature(geojson, tolerance);else return new Error('FeatureCollection or individual Feature required');\n};\n\nmodule.exports.simplify = function (coordinates, tolerance) {\n  return simplify(coordinates, tolerance);\n};\n\n// modifies in-place\nfunction simplifyFeature(feat, tolerance) {\n  var geom = feat.geometry;\n  var type = geom.type;\n  if (type === 'LineString') {\n    geom.coordinates = module.exports.simplify(geom.coordinates, tolerance);\n  } else if (type === 'Polygon' || type === 'MultiLineString') {\n    for (var j = 0; j < geom.coordinates.length; j++) {\n      geom.coordinates[j] = module.exports.simplify(geom.coordinates[j], tolerance);\n    }\n  } else if (type === 'MultiPolygon') {\n    for (var k = 0; k < geom.coordinates.length; k++) {\n      for (var l = 0; l < geom.coordinates[k].length; l++) {\n        geom.coordinates[k][l] = module.exports.simplify(geom.coordinates[k][l], tolerance);\n      }\n    }\n  }\n  return feat;\n}\n\n// modifies in-place\nfunction simplifyFeatureCollection(fc, tolerance) {\n  // process all LineString features, skip non LineStrings\n  for (var i = 0; i < fc.features.length; i++) {\n    fc.features[i] = simplifyFeature(fc.features[i], tolerance);\n  }\n  return fc;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvaW5kZXguanM/MWZkZiJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc2ltcGxpZnkgPSByZXF1aXJlKCdzaW1wbGlmeS1nZW9tZXRyeScpXG53aW5kb3cuc2ltcGxpZnkgPSBzaW1wbGlmeTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZ2VvanNvbiwgdG9sZXJhbmNlLCBkb250Q2xvbmUpIHtcbiAgaWYgKCFkb250Q2xvbmUpIGdlb2pzb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdlb2pzb24pKSAvLyBjbG9uZSBvYmpcbiAgaWYgKGdlb2pzb24uZmVhdHVyZXMpIHJldHVybiBzaW1wbGlmeUZlYXR1cmVDb2xsZWN0aW9uKGdlb2pzb24sIHRvbGVyYW5jZSlcbiAgZWxzZSBpZiAoZ2VvanNvbi50eXBlICYmIGdlb2pzb24udHlwZSA9PT0gJ0ZlYXR1cmUnKSByZXR1cm4gc2ltcGxpZnlGZWF0dXJlKGdlb2pzb24sIHRvbGVyYW5jZSlcbiAgZWxzZSByZXR1cm4gbmV3IEVycm9yKCdGZWF0dXJlQ29sbGVjdGlvbiBvciBpbmRpdmlkdWFsIEZlYXR1cmUgcmVxdWlyZWQnKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zaW1wbGlmeSA9IGZ1bmN0aW9uIChjb29yZGluYXRlcywgdG9sZXJhbmNlKSB7XG4gIHJldHVybiBzaW1wbGlmeShjb29yZGluYXRlcywgdG9sZXJhbmNlKVxufVxuXG4vLyBtb2RpZmllcyBpbi1wbGFjZVxuZnVuY3Rpb24gc2ltcGxpZnlGZWF0dXJlIChmZWF0LCB0b2xlcmFuY2UpIHtcbiAgdmFyIGdlb20gPSBmZWF0Lmdlb21ldHJ5XG4gIHZhciB0eXBlID0gZ2VvbS50eXBlXG4gIGlmICh0eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICBnZW9tLmNvb3JkaW5hdGVzID0gbW9kdWxlLmV4cG9ydHMuc2ltcGxpZnkoZ2VvbS5jb29yZGluYXRlcywgdG9sZXJhbmNlKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdQb2x5Z29uJyB8fCB0eXBlID09PSAnTXVsdGlMaW5lU3RyaW5nJykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgZ2VvbS5jb29yZGluYXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgZ2VvbS5jb29yZGluYXRlc1tqXSA9IG1vZHVsZS5leHBvcnRzLnNpbXBsaWZ5KGdlb20uY29vcmRpbmF0ZXNbal0sIHRvbGVyYW5jZSlcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ011bHRpUG9seWdvbicpIHtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IGdlb20uY29vcmRpbmF0ZXMubGVuZ3RoOyBrKyspIHtcbiAgICAgIGZvciAodmFyIGwgPSAwOyBsIDwgZ2VvbS5jb29yZGluYXRlc1trXS5sZW5ndGg7IGwrKykge1xuICAgICAgICBnZW9tLmNvb3JkaW5hdGVzW2tdW2xdID0gbW9kdWxlLmV4cG9ydHMuc2ltcGxpZnkoZ2VvbS5jb29yZGluYXRlc1trXVtsXSwgdG9sZXJhbmNlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmVhdFxufVxuXG4vLyBtb2RpZmllcyBpbi1wbGFjZVxuZnVuY3Rpb24gc2ltcGxpZnlGZWF0dXJlQ29sbGVjdGlvbiAoZmMsIHRvbGVyYW5jZSkge1xuICAvLyBwcm9jZXNzIGFsbCBMaW5lU3RyaW5nIGZlYXR1cmVzLCBza2lwIG5vbiBMaW5lU3RyaW5nc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZjLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZmMuZmVhdHVyZXNbaV0gPSBzaW1wbGlmeUZlYXR1cmUoZmMuZmVhdHVyZXNbaV0sIHRvbGVyYW5jZSlcbiAgfVxuICByZXR1cm4gZmNcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvaW5kZXguanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1\n");

/***/ }),
/* 2 */
/* no static exports found */
/* all exports used */
/*!*****************************************!*\
  !*** ./~/simplify-geometry/lib/line.js ***!
  \*****************************************/
/***/ (function(module, exports) {

eval("var Line = function(p1, p2){\n\n  this.p1 = p1;\n  this.p2 = p2;\n\n};\n\nLine.prototype.rise = function() {\n\n  return this.p2[1] - this.p1[1];\n\n};\n\nLine.prototype.run = function() {\n\n  return this.p2[0] - this.p1[0];\n\n};\n\nLine.prototype.slope = function(){\n\n  return  this.rise() / this.run();\n\n};\n\nLine.prototype.yIntercept = function(){\n\n  return this.p1[1] - (this.p1[0] * this.slope(this.p1, this.p2));\n\n};\n\nLine.prototype.isVertical = function() {\n\n  return !isFinite(this.slope());\n\n};\n\nLine.prototype.isHorizontal = function() {\n\n  return this.p1[1] == this.p2[1];\n\n};\n\nLine.prototype._perpendicularDistanceHorizontal = function(point){\n\n  return Math.abs(this.p1[1] - point[1]);\n\n};\n\nLine.prototype._perpendicularDistanceVertical = function(point){\n\n  return Math.abs(this.p1[0] - point[0]);\n\n};\n\nLine.prototype._perpendicularDistanceHasSlope = function(point){\n  var slope = this.slope();\n  var y_intercept = this.yIntercept();\n\n  return Math.abs((slope * point[0]) - point[1] + y_intercept) / Math.sqrt((Math.pow(slope, 2)) + 1);\n\n};\n\nLine.prototype.perpendicularDistance = function(point){\n  if (this.isVertical()) {\n\n    return this._perpendicularDistanceVertical(point);\n\n  }\n\n  else if (this.isHorizontal()){\n\n    return this._perpendicularDistanceHorizontal(point);\n\n  }\n\n  else {\n\n    return this._perpendicularDistanceHasSlope(point);\n\n  }\n\n};\n\nmodule.exports = Line;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL34vc2ltcGxpZnktZ2VvbWV0cnkvbGliL2xpbmUuanM/MWY0MCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGluZSA9IGZ1bmN0aW9uKHAxLCBwMil7XG5cbiAgdGhpcy5wMSA9IHAxO1xuICB0aGlzLnAyID0gcDI7XG5cbn07XG5cbkxpbmUucHJvdG90eXBlLnJpc2UgPSBmdW5jdGlvbigpIHtcblxuICByZXR1cm4gdGhpcy5wMlsxXSAtIHRoaXMucDFbMV07XG5cbn07XG5cbkxpbmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXG4gIHJldHVybiB0aGlzLnAyWzBdIC0gdGhpcy5wMVswXTtcblxufTtcblxuTGluZS5wcm90b3R5cGUuc2xvcGUgPSBmdW5jdGlvbigpe1xuXG4gIHJldHVybiAgdGhpcy5yaXNlKCkgLyB0aGlzLnJ1bigpO1xuXG59O1xuXG5MaW5lLnByb3RvdHlwZS55SW50ZXJjZXB0ID0gZnVuY3Rpb24oKXtcblxuICByZXR1cm4gdGhpcy5wMVsxXSAtICh0aGlzLnAxWzBdICogdGhpcy5zbG9wZSh0aGlzLnAxLCB0aGlzLnAyKSk7XG5cbn07XG5cbkxpbmUucHJvdG90eXBlLmlzVmVydGljYWwgPSBmdW5jdGlvbigpIHtcblxuICByZXR1cm4gIWlzRmluaXRlKHRoaXMuc2xvcGUoKSk7XG5cbn07XG5cbkxpbmUucHJvdG90eXBlLmlzSG9yaXpvbnRhbCA9IGZ1bmN0aW9uKCkge1xuXG4gIHJldHVybiB0aGlzLnAxWzFdID09IHRoaXMucDJbMV07XG5cbn07XG5cbkxpbmUucHJvdG90eXBlLl9wZXJwZW5kaWN1bGFyRGlzdGFuY2VIb3Jpem9udGFsID0gZnVuY3Rpb24ocG9pbnQpe1xuXG4gIHJldHVybiBNYXRoLmFicyh0aGlzLnAxWzFdIC0gcG9pbnRbMV0pO1xuXG59O1xuXG5MaW5lLnByb3RvdHlwZS5fcGVycGVuZGljdWxhckRpc3RhbmNlVmVydGljYWwgPSBmdW5jdGlvbihwb2ludCl7XG5cbiAgcmV0dXJuIE1hdGguYWJzKHRoaXMucDFbMF0gLSBwb2ludFswXSk7XG5cbn07XG5cbkxpbmUucHJvdG90eXBlLl9wZXJwZW5kaWN1bGFyRGlzdGFuY2VIYXNTbG9wZSA9IGZ1bmN0aW9uKHBvaW50KXtcbiAgdmFyIHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICB2YXIgeV9pbnRlcmNlcHQgPSB0aGlzLnlJbnRlcmNlcHQoKTtcblxuICByZXR1cm4gTWF0aC5hYnMoKHNsb3BlICogcG9pbnRbMF0pIC0gcG9pbnRbMV0gKyB5X2ludGVyY2VwdCkgLyBNYXRoLnNxcnQoKE1hdGgucG93KHNsb3BlLCAyKSkgKyAxKTtcblxufTtcblxuTGluZS5wcm90b3R5cGUucGVycGVuZGljdWxhckRpc3RhbmNlID0gZnVuY3Rpb24ocG9pbnQpe1xuICBpZiAodGhpcy5pc1ZlcnRpY2FsKCkpIHtcblxuICAgIHJldHVybiB0aGlzLl9wZXJwZW5kaWN1bGFyRGlzdGFuY2VWZXJ0aWNhbChwb2ludCk7XG5cbiAgfVxuXG4gIGVsc2UgaWYgKHRoaXMuaXNIb3Jpem9udGFsKCkpe1xuXG4gICAgcmV0dXJuIHRoaXMuX3BlcnBlbmRpY3VsYXJEaXN0YW5jZUhvcml6b250YWwocG9pbnQpO1xuXG4gIH1cblxuICBlbHNlIHtcblxuICAgIHJldHVybiB0aGlzLl9wZXJwZW5kaWN1bGFyRGlzdGFuY2VIYXNTbG9wZShwb2ludCk7XG5cbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc2ltcGxpZnktZ2VvbWV0cnkvbGliL2xpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///2\n");

/***/ })
/******/ ]);