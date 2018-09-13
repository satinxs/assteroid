import PIXI from 'pixi.js/dist/pixi';

export default class Entity extends PIXI.Sprite {
    constructor(texture, system) {
        super();

        this.system = system;

        this.texture = texture;
        this.isEntity = true;

        this.create();
    }

    addDebugCollisionShape() {
        let hitBox = new PIXI.Graphics();

        hitBox.lineStyle(2, 0x91CF46, 1);

        hitBox.drawCircle(this.hitArea.x, this.hitArea.y, this.hitArea.radius);

        hitBox.scale.set(1);

        this.addChild(hitBox);
    }

    create() {
        if (window.doDebug) {
            this.addDebugCollisionShape();
        }
    }

    destroy() {
        this.system.remove(this);

        super.destroy();
    }
}