import PIXI from 'pixi.js/dist/pixi';
import { testCollision, random, randomBool, Random, average, createRandomPoly } from '../utilities';
import Entity from './Entity';
import { AsteroidExplosion } from './particles';
import ShieldItem from './shieldItem';

export default class Asteroid extends Entity {
    constructor(system, radius, sides, size) {
        this.size = size || 2;
        this.radius = radius || Random.integer(30, 40);
        this.sides = sides || Random.integer(5, 8);
        super(game.resources.asteroid.texture, system);
    }

    create() {
        this.type = "Asteroid";

        this.acceleration = { x: Random.real(0, 1) - .5, y: Random.real(0, 1) - .5 };

        let isVertical = randomBool();
        let x = 0,
            y = 0;

        if (isVertical) {
            y = random(0, game.app.screen.height);
            if (this.acceleration.x < 0) x = game.app.screen.width;
        } else {
            x = random(0, game.app.screen.width);
            if (this.acceleration.y < 0) y = game.app.screen.height;
        }

        this.x = x;
        this.y = y;

        let gfx = createRandomPoly(this.width / 2, this.height / 2, this.radius, this.sides);

        this.mask = gfx;
        this.addChild(gfx);

        this.rotationSpeed = Random.real(0.01, 0.2);

        this.pivot.set(this.width / 2, this.height / 2);

        this.hitArea = new PIXI.Circle(this.pivot.x, this.pivot.y, this.radius * 0.9);

        super.create();
    }

    collide(entity) {
        if (entity.type === "Spaceship")
            return entity.collide(this);

        if (entity.type === "Asteroid") {
            this.bounceOff();
            entity.bounceOff();
        }

        if (entity.type === "Bullet") {
            entity.destroy();
            this.breakDown();
        }
    }

    breakDown() {
        if (this.hasShield) {
            let shieldItem = new ShieldItem(this.system);

            shieldItem.x = this.x;
            shieldItem.y = this.y;
            this.system.add(shieldItem);
            this.parent.addChild(shieldItem);
        }

        if (this.size > 1) {
            this.size--;

            let sides = Math.floor(this.sides / 2);

            let asteroid1 = new Asteroid(this.system, Random.integer(this.size * 15, this.size * 20), sides);
            let asteroid2 = new Asteroid(this.system, Random.integer(this.size * 15, this.size * 20), sides);

            asteroid1.size = this.size;
            asteroid2.size = this.size;

            asteroid1.acceleration = { x: asteroid2.acceleration.x, y: asteroid2.acceleration.y };
            asteroid2.bounceOff();

            asteroid1.x = asteroid2.x = this.x;
            asteroid1.y = asteroid2.y = this.y;

            while (testCollision(asteroid1, asteroid2)) {
                asteroid1.x += asteroid1.acceleration.x * 10;
                asteroid1.y += asteroid1.acceleration.y * 10;
                asteroid2.x += asteroid2.acceleration.x * 10;
                asteroid2.y += asteroid2.acceleration.y * 10;
            }

            asteroid1.update();
            asteroid2.update();

            this.system.add(asteroid1);
            this.system.add(asteroid2);

            this.parent.addChild(asteroid1);
            this.parent.addChild(asteroid2);
        }

        let emitter = new PIXI.particles.Emitter(this.parent, game.resources.asteroidParticle.texture, AsteroidExplosion);
        emitter.emit = true;
        emitter.updateSpawnPos(this.x, this.y)
        emitter.playOnceAndDestroy();
        this.destroy();
    }

    bounceOff() {
        this.acceleration.x *= -1;
        this.acceleration.y *= -1;
    }

    update() {
        this.x += this.acceleration.x;
        this.y += this.acceleration.y;
        this.rotation += this.rotationSpeed;

        if (this.x < 0)
            this.x += game.app.screen.width;
        if (this.y < 0)
            this.y += game.app.screen.height;

        if (this.x > game.app.screen.width)
            this.x = 0;
        if (this.y > game.app.screen.height)
            this.y = 0;
    }
}