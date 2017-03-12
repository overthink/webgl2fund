// https://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
export function resize(canvas: HTMLCanvasElement): void {
    const cssToRealPixels = window.devicePixelRatio || 1;

    // find the size at which the browser is displaying the canvas
    const displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    const displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

    // If the canvas' internal drawingbuffer size does not match the display
    // size, update it the drawingbuffer size.
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

/** Returns a WebGL2RenderingContext or throws if not possible. */
export function getWebGL2Context(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("couldn't get WebGL2RenderingContext");
    }
    return gl as WebGL2RenderingContext;
}

export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
        throw Error(`createShader failed for type ${type}`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw Error("Could not create shader");
    }
    return shader;
}

/** Greates a GLSL program from two shaders. */
export function createProgram(
        gl: WebGL2RenderingContext,
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (!program) {
        throw Error("Failed to create WebGL program");
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw Error("Failed to link WebGL program");
    }
    return program;
}
