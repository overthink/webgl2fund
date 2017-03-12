// Huge hack until a real type definition for this comes out (or I make one)
interface WebGLVertexArrayObject {}
interface WebGL2RenderingContext extends WebGLRenderingContext {
    createVertexArray(): WebGLVertexArrayObject;
    bindVertexArray(vao: WebGLVertexArrayObject): void;
}
