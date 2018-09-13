import vertex from './vertex';
import PIXI from 'pixi.js/dist/pixi';

const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform vec2 center;

uniform float amplitude;
uniform float wavelength;
// uniform float power;
uniform float brightness;
uniform float speed;
uniform float radius;

uniform float time;

const float PI = 3.14159;

void main()
{
    float halfWavelength = wavelength * 0.5 / filterArea.x;
    float maxRadius = radius / filterArea.x;
    float currentRadius = time * speed / filterArea.x;

    float fade = 1.0;

    if (maxRadius > 0.0) {
        if (currentRadius > maxRadius) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        }
        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);
    }

    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);
    dir.y *= filterArea.y / filterArea.x;
    float dist = length(dir);

    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    vec2 diffUV = normalize(dir);

    float diff = (dist - currentRadius) / halfWavelength;

    float p = 1.0 - pow(abs(diff), 2.0);

    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );
    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );

    vec2 offset = diffUV * powDiff / filterArea.xy;

    // Do clamp :
    vec2 coord = vTextureCoord + offset;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    // No clamp :
    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);

    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;

    gl_FragColor = color;
}`;

export default class ShockwaveFilter extends PIXI.Filter {

    constructor(center = [0.0, 0.0], options = {}, time = 0) {
        super(vertex, fragment);

        this.center = center;

        if (Array.isArray(options)) {
            // eslint-disable-next-line no-console
            console.warn('Deprecated Warning: ShockwaveFilter params Array has been changed to options Object.');
            options = {};
        }

        options = Object.assign({
            amplitude: 30.0,
            wavelength: 160.0,
            brightness: 1.0,
            speed: 500.0,
            radius: -1.0,
        }, options);

        this.amplitude = options.amplitude;

        this.wavelength = options.wavelength;

        this.brightness = options.brightness;

        this.speed = options.speed;

        this.radius = options.radius;

        /**
         * Sets the elapsed time of the shockwave.
         * It could control the current size of shockwave.
         *
         * @member {number}
         */
        this.time = time;
    }

    apply(filterManager, input, output, clear) {
        /**
         * There is no set/get of `time`, for performance.
         * Because in the most real cases, `time` will be changed in ever game tick.
         * Use set/get will take more function-call.
         */
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the center of the shockwave in normalized screen coords. That is
     * (0,0) is the top-left and (1,1) is the bottom right.
     *
     * @member {PIXI.Point|number[]}
     */
    get center() {
        return this.uniforms.center;
    }
    set center(value) {
        this.uniforms.center = value;
    }

    /**
     * The amplitude of the shockwave.
     *
     * @member {number}
     */
    get amplitude() {
        return this.uniforms.amplitude;
    }
    set amplitude(value) {
        this.uniforms.amplitude = value;
    }

    /**
     * The wavelength of the shockwave.
     *
     * @member {number}
     */
    get wavelength() {
        return this.uniforms.wavelength;
    }
    set wavelength(value) {
        this.uniforms.wavelength = value;
    }

    /**
     * The brightness of the shockwave.
     *
     * @member {number}
     */
    get brightness() {
        return this.uniforms.brightness;
    }
    set brightness(value) {
        this.uniforms.brightness = value;
    }

    /**
     * The speed about the shockwave ripples out.
     * The unit is `pixel/second`
     *
     * @member {number}
     */
    get speed() {
        return this.uniforms.speed;
    }
    set speed(value) {
        this.uniforms.speed = value;
    }

    /**
     * The maximum radius of shockwave.
     * `< 0.0` means it's infinity.
     *
     * @member {number}
     */
    get radius() {
        return this.uniforms.radius;
    }
    set radius(value) {
        this.uniforms.radius = value;
    }
}