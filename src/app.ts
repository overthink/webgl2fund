// Huge hack until a real type definition for this comes out (or I make one)
interface WebGLVertexArrayObject {}
interface WebGL2RenderingContext extends WebGLRenderingContext {
    createVertexArray(): WebGLVertexArrayObject;
    bindVertexArray(vao: WebGLVertexArrayObject): void;
}

// https://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resize(canvas: HTMLCanvasElement): void {
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
function getWebGL2Context(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("couldn't get WebGL2RenderingContext");
    }
    return gl as WebGL2RenderingContext;
}

function drawLoop(gl: WebGL2RenderingContext, now: number = performance.now()): void {
    resize(gl.canvas);
    requestAnimationFrame(t => drawLoop(gl, t));
}

const vertexShaderSource = `#version 300 es
// An attribute is an input (in) to a vertex shader. It will receive data from
// a buffer.
in vec4 a_position;

// All shaders have a main function
void main() {
  // gl_Position is a special variable a vertex shader is responsible for
  // setting.
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
// Fragment shaders don't have a default precision so we need to pick one.
// mediump is a good default. It means "medium precision"
precision mediump float;

// Declare an outuput for the fragment shader.
out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple.
  outColor = vec4(1, 0, 0.5, 1);
}
`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
        throw Error(`createShader failed for type ${type}`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw Error("Could not create shader");
}

function createProgram(
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
  if (success) {
      return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  throw Error("Failed to link WebGL program");
}

function main(): void {
    console.log("starting main");

    const canvas = document.querySelector("canvas");
    if (!canvas) {
        throw new Error("couldn't find canvas element");
    }

    const gl = getWebGL2Context(canvas);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // create a buffer and put three 2d clip space points into it
    const positionBuffer = gl.createBuffer();

    // bind buffer to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.5, -0.5,
        -0.1, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // create a vertex array object (attribute state)
    const vao = gl.createVertexArray();
    // make it the one we're currently working with
    gl.bindVertexArray(vao);
    // turn on attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (i.e. ARRAY_BUFFER)
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset);

    resize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // drawLoop(gl);
    console.log("ending main");
}

main();
