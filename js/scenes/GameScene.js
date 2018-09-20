import PIXI from 'pixi.js/dist/pixi';
import Spaceship from '../entities/spaceship';
import StarField from '../starsBackground';
import Asteroid from '../entities/asteroid';
import EntitySystem from '../entities/EntitySystem';
import GameUI from '../entities/GameUI';
import { Random } from '../utilities';

export default class GameScene extends PIXI.Container {
    constructor() {
        super();

        this.create();
    }

    create() {
        game.app.renderer.backgroundColor = 0x000;

        let starsContainer = new PIXI.Container();
        this.addChild(starsContainer);

        this.starField = new StarField(starsContainer, 0.1);

        this.gameUI = new GameUI(level => this.createAsteroids(level));

        this.addChild(this.gameUI);

        this.entitySystem = new EntitySystem();

        this.spaceship = new Spaceship(this);
        this.addChild(this.spaceship);

        this.entitySystem.add(this.spaceship);
        this.entitySystem.onCollision(() => this.gameUI.update(this.spaceship, this.entitySystem));

        const ticker = new PIXI.ticker.Ticker();
        ticker.add(dt => {
            KeyDrown.tick();
            this.update(dt);
        }).start();

        this.gameUI.update(this.spaceship, this.entitySystem);
        window.GameScene = this;
    }

    update(dt) {
        if (this.pause)
            return;

        this.starField.updateStars();

        this.entitySystem.update(dt);
    }

    createAsteroids(level) {

        let newAsteroid = (fn) => {
            let asteroid;
            if (fn)
                asteroid = fn();
            else
                asteroid = new Asteroid(this.entitySystem);

            this.addChild(asteroid);
            this.entitySystem.add(asteroid);
        }

        if (level > 1) {
            newAsteroid(() => {
                let asteroid = new Asteroid(this.entitySystem);
                asteroid.hasShield = true;
                return asteroid;
            });

            level--;
        }

        let checkGiantAsteroid = () => {
            if (level > 2) {

                newAsteroid(() => {
                    let size = 3;

                    let radius = Random.integer(size * 20, size * 35);

                    let sides = Random.integer(size * 4, size * 6);

                    let asteroid = new Asteroid(this.entitySystem, radius, sides, size);

                    return asteroid;
                });

                level--;
            }
        }

        checkGiantAsteroid();
        checkGiantAsteroid();

        for (let i = 0; i < level + 2; i++) {
            newAsteroid();
        }
    }
}