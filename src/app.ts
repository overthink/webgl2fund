// Huge hack until a real type definition for this comes out (or I make one)
interface WebGL2RenderingContext extends WebGLRenderingContext {}

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

function main(): void {
    console.log("starting main");

    const canvas = document.querySelector("canvas");
    if (!canvas) {
        throw new Error("couldn't find canvas element");
    }

    const gl = getWebGL2Context(canvas);
    drawLoop(gl);

    console.log("ending main");
}

main();
