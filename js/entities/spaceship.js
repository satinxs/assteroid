import PIXI from 'pixi.js/dist/pixi';
import { Fire, Explosion } from './particles';
import Bullet from './Bullet';
import Entity from './Entity';
import { average } from '../utilities';

const SpeedLimiter = 0.05;

export default class Spaceship extends Entity {
    constructor(gameScene) {
        super(game.resources.shuttle.texture, gameScene.entitySystem);

        this.gameScene = gameScene;

        window.spaceship = this;
    }

    create() {
        this.type = "Spaceship";

        this.lastShot = +new Date;

        this.pivot.set(this.width / 2, this.height / 2);
        this.x = game.app.screen.width / 2;
        this.y = game.app.screen.height / 2;
        // this.scale.set(0.6, 0.6);

        this.acceleration = { x: 0, y: 0 };

        this.thrusterEmitterA = new PIXI.particles.Emitter(this, game.resources.fire.texture, Fire);
        this.thrusterEmitterA.emit = false;
        this.thrusterEmitterA.updateOwnerPos(15, 48)
        this.thrusterEmitterB = new PIXI.particles.Emitter(this, game.resources.fire.texture, Fire);
        this.thrusterEmitterB.emit = false;
        this.thrusterEmitterB.updateOwnerPos(37, 48);

        this.bulletXOffset = 21;
        this.bulletYOffset = -30;

        let hitRadius = average(this.width, this.height, Math.max(this.width, this.height)) / 2 * 0.9;

        this.hitArea = new PIXI.Circle(this.pivot.x, this.pivot.y, hitRadius);

        super.create();
    }

    update(dt) {
        this.thrusterEmitterA.update(dt);
        this.thrusterEmitterB.update(dt);
        this.thrusterEmitterA.emit = this.thrusterEmitterB.emit = false;

        if (KeyDrown.LEFT.isDown()) {
            this.rotation -= 0.08;
        }
        if (KeyDrown.RIGHT.isDown()) {
            this.rotation += 0.08;
        }
        if (KeyDrown.UP.isDown()) {
            this.acceleration.x += Math.sin(this.rotation) * SpeedLimiter;
            this.acceleration.y += -1 * Math.cos(this.rotation) * SpeedLimiter;

            this.thrusterEmitterA.emit = this.thrusterEmitterB.emit = true;
        }

        if (KeyDrown.SPACE.isDown()) {
            this.shootBullet();
        }

        this.x += this.acceleration.x;
        this.y += this.acceleration.y;

        if (this.x < 0)
            this.x += game.app.screen.width;
        if (this.y < 0)
            this.y += game.app.screen.height;

        if (this.x > game.app.screen.width)
            this.x = 0;
        if (this.y > game.app.screen.height)
            this.y = 0;
    }

    shootBullet() {
        let now = +new Date;

        let delta = now - this.lastShot;

        if (delta < 250)
            return;

        this.lastShot = now;

        let bullet = new Bullet(
            this.rotation,
            Math.sin(this.rotation), -1 * Math.cos(this.rotation),
            this.system
        );
        this.gameScene.addChild(bullet);
        this.system.add(bullet);

        let point = this.toGlobal({ x: this.bulletXOffset, y: this.bulletYOffset });

        bullet.x = point.x;
        bullet.y = point.y;
    }

    collide(object) {
        if (this._destroyed)
            return;

        let explosionEmitter = new PIXI.particles.Emitter(this.parent, game.resources.explosion.texture, Explosion);

        explosionEmitter.updateSpawnPos(this.x, this.y)

        this.destroy();
        object.destroy();

        explosionEmitter.playOnceAndDestroy(() => game.sceneManager.showModal('EndGameScene'));
    }
}