import PIXI from 'pixi.js/dist/pixi';
import Spaceship from '../entities/spaceship';
import StarField from '../starsBackground';
import Asteroid from '../entities/asteroid';
import EntitySystem from '../entities/EntitySystem';

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

        this.entitySystem = new EntitySystem();

        this.spaceship = new Spaceship(this);

        this.addChild(this.spaceship);
        this.entitySystem.add(this.spaceship);

        this.createAsteroids();

        const ticker = new PIXI.ticker.Ticker();
        ticker.add(dt => {
            KeyDrown.tick();
            this.update(dt);
        }).start();

        window.GameScene = this;
    }

    update(dt) {
        if (this.pause)
            return;

        this.starField.updateStars();

        this.entitySystem.update(dt);
    }

    createAsteroids() {
        for (let i = 0; i < 3; i++) {
            let asteroid = new Asteroid(this.entitySystem);

            this.addChild(asteroid);
            this.entitySystem.add(asteroid);
        }
    }
}