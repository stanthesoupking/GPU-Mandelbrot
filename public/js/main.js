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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar DetailLevel = {\n  LOW: 0,\n  HIGH: 1\n};\n\nvar App = /*#__PURE__*/function () {\n  function App() {\n    _classCallCheck(this, App);\n  }\n\n  _createClass(App, [{\n    key: \"start\",\n    value: function start() {\n      // Get references to DOM elements\n      this.canvas = document.querySelector(\"#glCanvas\");\n      this.mandelbrotOffset = [0, 0];\n      this.mandelbrotZoom = 4.0;\n      this.initWebGl();\n      this.initEvents();\n      this.resizeCanvas();\n      this.render(DetailLevel.HIGH);\n    }\n  }, {\n    key: \"initWebGl\",\n    value: function initWebGl() {\n      this.gl = this.canvas.getContext(\"webgl\");\n      var gl = this.gl; // Only continue if WebGL is available and working\n\n      if (gl === null) {\n        alert(\"Unable to initialize WebGL. Your browser or machine may not support it.\");\n        return;\n      }\n\n      var shaderProgram = initShaderProgram(gl, vsSource, fsSource);\n      this.programInfo = {\n        program: shaderProgram,\n        attribLocations: {\n          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')\n        },\n        uniformLocations: {\n          canvasResolutionPosition: gl.getUniformLocation(shaderProgram, 'uCanvasResolution'),\n          canvasAspectRatioPosition: gl.getUniformLocation(shaderProgram, 'uCanvasAspectRatio'),\n          mandelbrotOffsetPosition: gl.getUniformLocation(shaderProgram, 'uOffset'),\n          mandelbrotZoomPosition: gl.getUniformLocation(shaderProgram, 'uZoom'),\n          samplesPosition: gl.getUniformLocation(shaderProgram, 'uSamples'),\n          iterationsPosition: gl.getUniformLocation(shaderProgram, 'uIterations')\n        }\n      }; // Init buffers\n\n      this.positionBuffer = gl.createBuffer();\n      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);\n      var positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];\n      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);\n    }\n  }, {\n    key: \"render\",\n    value: function render(detailLevel) {\n      var gl = this.gl;\n      this.setDetailLevel(detailLevel);\n      this.updateUniforms();\n      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque\n\n      gl.clearDepth(1.0); // Clear everything\n\n      gl.enable(gl.DEPTH_TEST); // Enable depth testing\n\n      gl.depthFunc(gl.LEQUAL); // Near things obscure far things\n      // Clear colour and depth buffers\n\n      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);\n      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);\n      var numComponents = 2; // pull out 2 values per iteration\n\n      var type = gl.FLOAT; // the data in the buffer is 32bit floats\n\n      var normalize = false; // don't normalize\n\n      var stride = 0; // how many bytes to get from one set of values to the next\n\n      var offset = 0; // how many bytes inside the buffer to start from\n\n      gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);\n      gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);\n      gl.useProgram(this.programInfo.program); // Render\n\n      var t = Date.now();\n      {\n        var _offset = 0;\n        var vertexCount = 4;\n        gl.drawArrays(gl.TRIANGLE_STRIP, _offset, vertexCount);\n      }\n      var timeTaken = Date.now() - t;\n      console.log(\"Finished in \" + timeTaken + \"ms\");\n    }\n  }, {\n    key: \"updateUniforms\",\n    value: function updateUniforms() {\n      var gl = this.gl;\n      gl.useProgram(this.programInfo.program);\n      gl.uniform2f(this.programInfo.uniformLocations.canvasResolutionPosition, this.canvasSize.width, this.canvasSize.height);\n      gl.uniform1f(this.programInfo.uniformLocations.canvasAspectRatioPosition, this.canvasAspectRatio);\n      gl.uniform2f(this.programInfo.uniformLocations.mandelbrotOffsetPosition, this.mandelbrotOffset[0], this.mandelbrotOffset[1]);\n      gl.uniform1f(this.programInfo.uniformLocations.mandelbrotZoomPosition, this.mandelbrotZoom);\n      gl.uniform1i(this.programInfo.uniformLocations.iterationsPosition, this.mandelbrotIterations);\n      gl.uniform1i(this.programInfo.uniformLocations.samplesPosition, this.mandelbrotSamples);\n    }\n  }, {\n    key: \"resizeCanvas\",\n    value: function resizeCanvas() {\n      this.canvas.width = document.body.clientWidth;\n      this.canvas.height = document.body.clientHeight;\n      this.canvasSize = {\n        width: this.canvas.width,\n        height: this.canvas.height\n      };\n      this.canvasAspectRatio = this.canvasSize.width / this.canvasSize.height; // Resize WebGL framebuffer\n\n      var gl = this.gl;\n      gl.bindFramebuffer(gl.FRAMEBUFFER, null);\n      gl.viewport(0, 0, this.canvasSize.width, this.canvasSize.height);\n    }\n  }, {\n    key: \"initEvents\",\n    value: function initEvents() {\n      var _this = this;\n\n      window.addEventListener(\"resize\", function () {\n        _this.resizeCanvas();\n\n        _this.render();\n      });\n      var oldMousePosX;\n      var oldMousePosY;\n      var moveSpeed = 0.001;\n      var zoomSpeed = 0.01;\n\n      var moveListener = function moveListener(e) {\n        var newMousePosX = e.screenX;\n        var newMousePosY = e.screenY;\n        _this.mandelbrotOffset[0] += (oldMousePosX - newMousePosX) * moveSpeed;\n        _this.mandelbrotOffset[1] += (oldMousePosY - newMousePosY) * moveSpeed;\n        oldMousePosX = newMousePosX;\n        oldMousePosY = newMousePosY;\n\n        _this.render(DetailLevel.LOW);\n      };\n\n      var upListener = function upListener() {\n        window.removeEventListener(\"mousemove\", moveListener, false);\n        window.removeEventListener(\"mouseup\", upListener, false);\n\n        _this.render(DetailLevel.HIGH);\n      };\n\n      window.addEventListener(\"mousedown\", function (e) {\n        oldMousePosX = e.screenX;\n        oldMousePosY = e.screenY;\n        window.addEventListener(\"mousemove\", moveListener);\n        window.addEventListener(\"mouseup\", upListener);\n      });\n      window.addEventListener(\"wheel\", function (e) {\n        var scrollAmount = e.deltaY;\n        _this.mandelbrotZoom += scrollAmount * zoomSpeed;\n\n        _this.render(DetailLevel.LOW);\n      });\n    }\n  }, {\n    key: \"setDetailLevel\",\n    value: function setDetailLevel(detailLevel) {\n      switch (detailLevel) {\n        case DetailLevel.LOW:\n          this.mandelbrotIterations = 256;\n          this.mandelbrotSamples = 1;\n          break;\n\n        case DetailLevel.HIGH:\n          this.mandelbrotIterations = 1024;\n          this.mandelbrotSamples = 2;\n          break;\n      }\n    }\n  }]);\n\n  return App;\n}();\n\nvar vsSource = \"\\n    attribute vec4 aVertexPosition;\\n\\n    uniform mat4 uModelViewMatrix;\\n    uniform mat4 uProjectionMatrix;\\n\\n    void main() {\\n        gl_Position = aVertexPosition;\\n    }\\n\";\nvar fsSource = \"\\n    precision mediump float;\\n\\n    uniform int uSamples;\\n    uniform int uIterations;\\n\\n    uniform vec2 uCanvasResolution;\\n    uniform float uCanvasAspectRatio;\\n\\n    uniform vec2 uOffset;\\n    uniform float uZoom;\\n\\n    vec2 ss_to_uv(vec2 pos) {\\n        return ((pos.xy * vec2(uCanvasAspectRatio,1)) / uCanvasResolution) - vec2(0.5, 0.5);\\n    }\\n\\n    void main() {\\n        const int max_iterations = 1024;\\n        const int max_samples = 2;\\n\\n        int s = 0;\\n        bool complete = false;\\n\\n        int sampleAcc = 0;\\n\\n        for(int x = 0; x < max_samples; x++) {\\n            if(x >= uSamples) {\\n                break;\\n            }\\n\\n            for(int y = 0; y < max_samples; y++) {\\n                if(y >= uSamples) {\\n                    break;\\n                }\\n\\n                s = 0;\\n                vec2 spos = vec2(gl_FragCoord.x + float(x), gl_FragCoord.y + float(y));\\n                vec2 cpos = (vec2(uOffset.x, -uOffset.y) + ss_to_uv(spos)) * uZoom;\\n                vec2 opos = cpos;\\n\\n                for(int i = 0; i < max_iterations + 1; i++) {\\n                    if(!(cpos.x * cpos.x + cpos.y * cpos.y < 2.0 * 2.0)) {\\n                        break;\\n                    }\\n        \\n                    float xtemp = cpos.x * cpos.x - cpos.y * cpos.y + opos.x;\\n                    cpos.y = 2.0 * cpos.x * cpos.y + opos.y;\\n                    cpos.x = xtemp;\\n        \\n                    s += 1;\\n                    if (s > uIterations) {\\n                        s = 0;\\n                        break;\\n                    }\\n                }\\n                sampleAcc += s;\\n            }\\n        }\\n\\n        float m = (float(sampleAcc) / float(uSamples * uSamples)) / float(uIterations);\\n\\n        gl_FragColor = vec4(m, m, m, 1.0);\\n    }\\n\";\n/**\n * Initialises the given shader program\n * \n * Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context\n * \n * @param {*} gl \n * @param {*} vsSource \n * @param {*} fsSource \n */\n\nfunction initShaderProgram(gl, vsSource, fsSource) {\n  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);\n  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource); // Create the shader program\n\n  var shaderProgram = gl.createProgram();\n  gl.attachShader(shaderProgram, vertexShader);\n  gl.attachShader(shaderProgram, fragmentShader);\n  gl.linkProgram(shaderProgram); // If creating the shader program failed, alert\n\n  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {\n    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));\n    return null;\n  }\n\n  return shaderProgram;\n}\n/**\n * Load the given shader\n * \n * Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context\n * \n * @param {*} gl \n * @param {*} type \n * @param {*} source \n */\n\n\nfunction loadShader(gl, type, source) {\n  var shader = gl.createShader(type); // Send the source to the shader object\n\n  gl.shaderSource(shader, source); // Compile the shader program\n\n  gl.compileShader(shader); // See if it compiled successfully\n\n  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\n    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));\n    gl.deleteShader(shader);\n    return null;\n  }\n\n  return shader;\n}\n\nmodule.exports = App;\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var App = __webpack_require__(/*! ./App */ \"./src/App.js\");\n\nfunction main() {\n  var app = new App();\n  app.start();\n}\n\nwindow.onload = main;\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });