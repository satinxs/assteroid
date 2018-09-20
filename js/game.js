import PIXI from 'pixi.js/dist/pixi.js';
import 'pixi-particles';
import './keydrown';
import { ready, scaleToWindow } from './utilities';
import SceneManager from './scenes/SceneManager';

import PlayScene from './scenes/PlayScene';
import GameScene from './scenes/GameScene';
import EndGameScene from './scenes/EndGameScene';

class Game {
    constructor(app) {
        this.app = app;
        // window.doDebug = true;
    }

    start() {
        this.sceneManager = new SceneManager(this);

        this.sceneManager.register('PlayScene', PlayScene);
        this.sceneManager.register('GameScene', GameScene);
        this.sceneManager.register('EndGameScene', EndGameScene);

        this.sceneManager.show('PlayScene');
    }

    get width() {
        return this.app.renderer.width;
    }

    get height() {
        return this.app.renderer.height;
    }
}

window.game = null;

ready(function () {
    let app = new PIXI.Application();

    document.body.appendChild(app.view);

    scaleToWindow(app.view);

    window.onresize = function () { scaleToWindow(app.view); };

    app.renderer.backgroundColor = 0x061639;

    game = new Game(app);

    PIXI.loader
        .add("spaceship", "resources/spaceship.png")
        .add("shuttle", "resources/shuttle.png")
        .add("asteroid", "resources/asteroidTexture.png")
        .add("asteroidParticle", "resources/asteroidParticle.png")
        .add("fire", "resources/Fire.png")
        .add("explosion", "resources/explosion.png")
        .add("bullet", "resources/bullet.png")
        .add("shield", "resources/shield2.png")
        .add("bubble", "resources/bubble.png")
        .load((_, resources) => {
            game.resources = resources;

            game.start();
        });
}); 