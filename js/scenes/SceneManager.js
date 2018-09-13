import PIXI from 'pixi.js/dist/pixi'

export default class SceneManager extends PIXI.Container {
    constructor(game) {
        this.game = game;

        this.registered = {};

        //This is for when we want to 'stack' scenes. E.g pause menu
        this.scenes = [];

        this.currentScene = null;
    }

    register(name, Scene) {
        this.registered[name] = Scene;
    }

    show(name) {
        if (this.currentScene)
            this.removeAllScenes();

        this.setCurrentScene(name);
    }

    removeAllScenes() {
        this.scenes.forEach(sc => sc.destroy());

        this.removeCurrentScene();
    }

    setCurrentScene(name) {
        let Scene = this.registered[name];

        this.currentScene = new Scene();

        this.game.app.stage.addChild(this.currentScene);
    }

    removeCurrentScene() {
        this.currentScene.destroy();

        if (this.scenes.length > 0)
            this.currentScene = this.scenes.pop();
    }

    showModal(name) {
        if (this.currentScene)
            this.scenes.push(this.currentScene);

        this.setCurrentScene(name);
    }
}