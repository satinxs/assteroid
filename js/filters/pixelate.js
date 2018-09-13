import vertex from './vertex';
import PIXI from 'pixi.js/dist/pixi';

const fragment = `
precision mediump float;

varying vec2 vTextureCoord;

uniform vec2 size;
uniform sampler2D uSampler;

uniform vec4 filterArea;

vec2 mapCoord( vec2 coord )
{
    coord *= filterArea.xy;
    coord += filterArea.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= filterArea.zw;
    coord /= filterArea.xy;

    return coord;
}

vec2 pixelate(vec2 coord, vec2 size)
{
	return floor( coord / size ) * size;
}

void main(void)
{
    vec2 coord = mapCoord(vTextureCoord);

    coord = pixelate(coord, size);

    coord = unmapCoord(coord);

    gl_FragColor = texture2D(uSampler, coord);
}`;

export default class PixelateFilter extends PIXI.Filter {

    constructor(size = 10) {
        super(vertex, fragment);
        this.size = size;
    }

    get size() {
        return this.uniforms.size;
    }
    set size(value) {
        if (typeof value === 'number') {
            value = [value, value];
        }
        this.uniforms.size = value;
    }
}
