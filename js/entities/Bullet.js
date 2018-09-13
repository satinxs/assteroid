import PIXI from 'pixi.js/dist/pixi';
import Entity from './Entity';

const Speed = 8;

export default class Bullet extends Entity {
    constructor(rotation, accelx, accely, system) {
        super(game.resources.bullet.texture, system);

        this.rotation = rotation;
        this.acceleration = { x: accelx, y: accely };
    }

    create() {
        this.type = "Bullet";

        this.pivot.set(this.width / 2, 0);
        this.scale.set(0.8, 0.8);
        this.timeToDie = 100;

        this.hitArea = new PIXI.Circle(this.width / 2, this.width / 2, this.width / 2);

        super.create();
    }

    update(dt) {
        this.x += this.acceleration.x * Speed * dt;
        this.y += this.acceleration.y * Speed * dt;

        if (this.x < 0)
            this.x += game.app.screen.width;
        if (this.y < 0)
            this.y += game.app.screen.height;

        if (this.x > game.app.screen.width)
            this.x = 0;
        if (this.y > game.app.screen.height)
            this.y = 0;

        this.timeToDie -= dt;

        if (this.timeToDie < 0)
            this.destroy();
    }
}