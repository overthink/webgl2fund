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

function main(): void {
    console.log("starting main");
    const canvas = document.querySelector("canvas");
    if (!canvas) {
        throw new Error("couldn't find canvas element");
    }
    const gl = util.getWebGL2Context(canvas);
    fuchsiaTriangle(gl);
    console.log("ending main");
}

main();
