const DetailLevel = {
    LOW: 0,
    HIGH: 1
}

class App {
    constructor() {

    }

    start() {
        // Get references to DOM elements
        this.canvas = document.querySelector("#glCanvas");

        this.mandelbrotOffset = [0, 0];
        this.mandelbrotZoom = 4.0;

        this.initWebGl();
        this.initEvents();

        this.resizeCanvas();

        this.render(DetailLevel.HIGH);
    }

    initWebGl() {
        this.gl = this.canvas.getContext("webgl");
        const gl = this.gl;

        // Only continue if WebGL is available and working
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        let shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                canvasResolutionPosition: gl.getUniformLocation(shaderProgram, 'uCanvasResolution'),
                canvasAspectRatioPosition: gl.getUniformLocation(shaderProgram, 'uCanvasAspectRatio'),
                mandelbrotOffsetPosition: gl.getUniformLocation(shaderProgram, 'uOffset'),
                mandelbrotZoomPosition: gl.getUniformLocation(shaderProgram, 'uZoom'),
                samplesPosition: gl.getUniformLocation(shaderProgram, 'uSamples'),
                iterationsPosition: gl.getUniformLocation(shaderProgram, 'uIterations'),
            }
        };

        // Init buffers
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        const positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW);
    }

    render(detailLevel) {
        const gl = this.gl;

        this.setDetailLevel(detailLevel);

        this.updateUniforms();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear colour and depth buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next

        const offset = 0;         // how many bytes inside the buffer to start from
        gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);

        gl.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexPosition);

        gl.useProgram(this.programInfo.program);

        // Render
        let t = Date.now();
        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }

        let timeTaken = (Date.now() - t);
        console.log("Finished in " + timeTaken + "ms");
    }

    updateUniforms() {
        const gl = this.gl;

        gl.useProgram(this.programInfo.program);

        gl.uniform2f(this.programInfo.uniformLocations.canvasResolutionPosition, this.canvasSize.width, this.canvasSize.height);
        gl.uniform1f(this.programInfo.uniformLocations.canvasAspectRatioPosition, this.canvasAspectRatio);

        gl.uniform2f(this.programInfo.uniformLocations.mandelbrotOffsetPosition, this.mandelbrotOffset[0], this.mandelbrotOffset[1]);
        gl.uniform1f(this.programInfo.uniformLocations.mandelbrotZoomPosition, this.mandelbrotZoom);

        gl.uniform1i(this.programInfo.uniformLocations.iterationsPosition, this.mandelbrotIterations);
        gl.uniform1i(this.programInfo.uniformLocations.samplesPosition, this.mandelbrotSamples);
    }

    resizeCanvas() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.canvasSize = { width: this.canvas.width, height: this.canvas.height };
        this.canvasAspectRatio = this.canvasSize.width / this.canvasSize.height;

        // Resize WebGL framebuffer
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvasSize.width, this.canvasSize.height);
    }

    initEvents() {
        window.addEventListener("resize", () => {
            this.resizeCanvas();
            this.render();
        });

        let oldMousePosX;
        let oldMousePosY;

        let moveSpeed = 0.001;
        let zoomSpeed = 0.01;

        let moveListener = (e) => {
            const newMousePosX = e.screenX;
            const newMousePosY = e.screenY;

            this.mandelbrotOffset[0] += (oldMousePosX - newMousePosX) * moveSpeed;
            this.mandelbrotOffset[1] += (oldMousePosY - newMousePosY) * moveSpeed;

            oldMousePosX = newMousePosX;
            oldMousePosY = newMousePosY;

            this.render(DetailLevel.LOW);
        };

        let upListener = () => {
            window.removeEventListener("mousemove", moveListener, false);
            window.removeEventListener("mouseup", upListener, false);
            this.render(DetailLevel.HIGH);
        };

        window.addEventListener("mousedown", (e) => {
            oldMousePosX = e.screenX;
            oldMousePosY = e.screenY;

            window.addEventListener("mousemove", moveListener);
            window.addEventListener("mouseup", upListener);
        });

        window.addEventListener("wheel", (e) => {
            let scrollAmount = e.deltaY;
            this.mandelbrotZoom += scrollAmount * zoomSpeed;
            this.render(DetailLevel.LOW);
        });
    }

    setDetailLevel(detailLevel) {
        switch (detailLevel) {
            case DetailLevel.LOW:
                this.mandelbrotIterations = 256;
                this.mandelbrotSamples = 1;
                break;
            case DetailLevel.HIGH:
                this.mandelbrotIterations = 1024;
                this.mandelbrotSamples = 2;
                break;
        }
    }
}

const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = aVertexPosition;
    }
`;

const fsSource = `
    precision mediump float;

    uniform int uSamples;
    uniform int uIterations;

    uniform vec2 uCanvasResolution;
    uniform float uCanvasAspectRatio;

    uniform vec2 uOffset;
    uniform float uZoom;

    vec2 ss_to_uv(vec2 pos) {
        return ((pos.xy * vec2(uCanvasAspectRatio,1)) / uCanvasResolution) - vec2(0.5, 0.5);
    }

    void main() {
        const int max_iterations = 1024;
        const int max_samples = 2;

        int s = 0;
        bool complete = false;

        int sampleAcc = 0;

        for(int x = 0; x < max_samples; x++) {
            if(x >= uSamples) {
                break;
            }

            for(int y = 0; y < max_samples; y++) {
                if(y >= uSamples) {
                    break;
                }

                s = 0;
                vec2 spos = vec2(gl_FragCoord.x + float(x), gl_FragCoord.y + float(y));
                vec2 cpos = (vec2(uOffset.x, -uOffset.y) + ss_to_uv(spos)) * uZoom;
                vec2 opos = cpos;

                for(int i = 0; i < max_iterations + 1; i++) {
                    if(!(cpos.x * cpos.x + cpos.y * cpos.y < 2.0 * 2.0)) {
                        break;
                    }
        
                    float xtemp = cpos.x * cpos.x - cpos.y * cpos.y + opos.x;
                    cpos.y = 2.0 * cpos.x * cpos.y + opos.y;
                    cpos.x = xtemp;
        
                    s += 1;
                    if (s > uIterations) {
                        s = 0;
                        break;
                    }
                }
                sampleAcc += s;
            }
        }

        float m = (float(sampleAcc) / float(uSamples * uSamples)) / float(uIterations);

        gl_FragColor = vec4(m, m, m, 1.0);
    }
`;

/**
 * Initialises the given shader program
 * 
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 * 
 * @param {*} gl 
 * @param {*} vsSource 
 * @param {*} fsSource 
 */
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

/**
 * Load the given shader
 * 
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 * 
 * @param {*} gl 
 * @param {*} type 
 * @param {*} source 
 */
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

module.exports = App;