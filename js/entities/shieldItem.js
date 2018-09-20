import PIXI from 'pixi.js/dist/pixi';
import Entity from './Entity';

export default class ShieldItem extends Entity {
    constructor(system) {
        super(game.resources.shield.texture, system);
    }

    create() {
        this.type = "Item";

        this.pivot.set(this.width / 2, this.height / 2);
        this.scale.set(0.5, 0.5);

        this.hitArea = new PIXI.Circle(this.width / 2, this.width / 2, this.width / 2);

        super.create();
    }
}