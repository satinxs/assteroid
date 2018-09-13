import PIXI from 'pixi.js/dist/pixi';
import vertex from './vertex';

const fragment = `precision mediump float; 
    varying vec2 vTextureCoord;
    varying vec4 vColor;

    uniform vec4 filterArea;
    uniform sampler2D uSampler;

    uniform float angle;
    uniform float scale;

    float pattern()
    {
        float s = sin(angle), c = cos(angle);
        vec2 tex = vTextureCoord * filterArea.xy;
        vec2 point = vec2(
            c * tex.x - s * tex.y,
            s * tex.x + c * tex.y
        ) * scale;
        return (sin(point.x) * sin(point.y)) * 4.0;
    }

    void main()
    {
        vec4 color = texture2D(uSampler, vTextureCoord);
        float average = (color.r + color.g + color.b) / 3.0;
        gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);
    }`;

export default class DotFilter extends PIXI.Filter {
    constructor(scale = 1, angle = 5) {
        super(vertex, fragment);
        this.scale = scale;
        this.angle = angle;
    }

    get scale() {
        return this.uniforms.scale;
    }

    set scale(value) {
        this.uniforms.scale = value;
    }

    get angle() {
        return this.uniforms.angle;
    }

    set angle(value) {
        this.uniforms.angle = value;
    }
}