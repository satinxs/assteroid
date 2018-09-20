import PIXI from 'pixi.js/dist/pixi';

export default class Shield extends PIXI.Sprite {
    constructor() {
        super();
        this.texture = game.resources.shield.texture;

        this.pivot.set(this.width / 2, this.height / 2);
    }

    update(dt) {
        this.rotation += dt * .5;
    }
}