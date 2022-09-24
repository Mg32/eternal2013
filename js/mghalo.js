
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertShader, fragShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
}

function setCanvasSize(gl) {
    const factor = 0.5;  // 解像度を少し落とす
    const scale = (window.devicePixelRatio || 1) * factor;
    gl.canvas.width = window.innerWidth * scale;
    gl.canvas.height = window.innerHeight * scale;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

const vertCode = "attribute vec4 position; void main() { gl_Position = position; }";
const fragCode = `
precision mediump float;
uniform float time;
uniform vec2 resolution;
vec2 rotate2d(vec2 xy, float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * xy;
}
vec3 random_color(float x, float v) {
    vec3 c = vec3(1.0);
    c += 0.4 * sin(vec3(4.00, 5.00, 6.00) * x + v);
    c += 0.6 * sin(vec3(14.0, 15.0, 16.0) * x + v);
    return c / 2.0;
}
vec3 gg(vec2 pos, float radius, float thinness, vec3 c_ring, vec3 c_fill, float taper) {
    float d = length(pos) / radius;

    vec3 circle = vec3(0.0);
    if (d < 1.0) {
        float slope = -2.0 * radius * thinness * (d - 1.0);
        float ringslope = slope - 1.0;
        float ring = max(1.0 - ringslope * ringslope, 0.0);

        circle += c_ring * ring;
        circle += c_fill * clamp(slope, 0.0, 1.0);
        circle -= taper * (0.5 + 0.5 * cos(d * 3.141592));
        circle = max(circle, 0.0);
    }
    return circle;
}
void main() {
    vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float radius = length(pos);
    float center = 1.0 / (1.0 + 12.0 * radius);
    vec3 glare = 2.2 * vec3(1.0, 1.0, 2.0) * center;

    float theta = atan(pos.y, pos.x) / 3.141592;
    float a = 15.0 * theta;
    float b = (fract(a) - 0.5) * 2.0;
    float strength = 0.5 + 0.5 * cos(17.0 * floor(a) + 2.0 * 3.141592 * fract(time * 0.1));
    float taper = exp(1.0 - 0.8 * radius);
    float ray = strength * taper * clamp(1.0 - b * b, 0.0, 1.0);
    vec3 raycolor = 0.3 + 0.7 * random_color(strength, time * 0.2);
    vec3 flare = 0.05 * vec3(0.8, 0.7, 1.4) * (vec3(ray * ray) * raycolor);

    //vec2 axis = rotate2d(pos, time) - vec2(1.2, 0.0);
    //vec3 ghost = gg(axis, 0.5, 32.0, 0.8 * vec3(1.0), 0.2 * vec3(1.0), 0.2);
    vec3 ghost = vec3(0.0);

    gl_FragColor = vec4(glare + flare + ghost, 1.0);
}
`;

$(() => {
    var canvas = document.querySelector("#canvas-halo");
    var gl = canvas.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) { return; }

    setCanvasSize(gl);
    $(window).resize(() => { setCanvasSize(gl); render(); });

    // シェーダ読み込み
    var vertShader = createShader(gl, gl.VERTEX_SHADER, vertCode);
    var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragCode);
    var program = createProgram(gl, vertShader, fragShader);
    gl.useProgram(program);

    // 頂点データ
    var position = [-1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1];
    var vPosition = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    // シェーダとやりとりするデータ
    var uTimeLocation = gl.getUniformLocation(program, "time");
    var uResolutionLocation = gl.getUniformLocation(program, "resolution");
    var aLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(aLocation);
    gl.vertexAttribPointer(aLocation, 2, gl.FLOAT, false, 0, 0);

    // 描画初期設定
    gl.clearColor(0, 0, 0, 1);

    // 定期的に描画
    var beginTime = new Date().getTime();
    var offsetTime = Math.random() * 10.0;
    function render() {
        var time = (new Date().getTime() - beginTime) * 0.001 + offsetTime;
        var resolution = [gl.canvas.width, gl.canvas.height];
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTimeLocation, time);
        gl.uniform2fv(uResolutionLocation, resolution);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.flush();
    }
    setInterval(render, 80.0);
});
