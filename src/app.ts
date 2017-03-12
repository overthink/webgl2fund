import * as util from "./util";

function fuchsiaTriangle(gl: WebGL2RenderingContext): void {
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

    const vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = util.createProgram(gl, vertexShader, fragmentShader);

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

    util.resize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function rectangles(gl: WebGL2RenderingContext): void {
    const vertexShaderSource = `#version 300 es
// An attribute is an input (in) to a vertex shader. It will receive data from
// a buffer.
in vec2 a_position;
uniform vec2 u_resolution;
out vec4 v_color;

// All shaders have a main function
void main() {
  // convert from pixel space to [0.0 .. 1.0]
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clip space)
  vec2 clipSpace = zeroToTwo - 1.0;

  // flip y coordinate so 0,0 is the top-left of the canvas, like tradition dictates
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_color = gl_Position * 0.5 + 0.5;
}
`;

    const fragmentShaderSource = `#version 300 es
// Fragment shaders don't have a default precision so we need to pick one.
// mediump is a good default. It means "medium precision"
precision mediump float;

uniform vec4 u_color;

// Declare an outuput for the fragment shader.
out vec4 outColor;
in vec4 v_color;

void main() {
  outColor = v_color;
  outColor = u_color;
}
`;

    function randomInt(range: number): number {
        return Math.floor(Math.random() * range);
    }

    function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void {
        const x1 = x;
        const x2 = x + width;
        const y1 = y;
        const y2 = y + height;

        // assuming we're only using one buffer, gl.ARRAY_BUFFER
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]), gl.STATIC_DRAW);
    }

    const vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = util.createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // create a buffer and put three 2d clip space points into it
    const positionBuffer = gl.createBuffer();

    // bind buffer to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // coordinates in pixel space
    const positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30
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

    util.resize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorLocation = gl.getUniformLocation(program, "u_color");

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    for (let i = 0; i < 100; ++i) {
        setRectangle(
            gl,
            randomInt(gl.canvas.width),
            randomInt(gl.canvas.height),
            randomInt(gl.canvas.width / 2),
            randomInt(gl.canvas.height / 2));
        // set a random color for rectangle.
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        // draw the rectangle
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

function main(): void {
    console.log("starting main");
    const canvas = document.querySelector("canvas");
    if (!canvas) {
        throw new Error("couldn't find canvas element");
    }
    const gl = util.getWebGL2Context(canvas);
    //fuchsiaTriangle(gl);
    rectangles(gl);
    console.log("ending main");
}

main();
