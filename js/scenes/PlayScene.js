import PIXI from 'pixi.js/dist/pixi';
import { Button } from '../utilities';
import GameScene from './GameScene';

export default class PlayScene extends PIXI.Container {
    constructor() {
        super();

        this.create();
    }

    create() {
        let x = game.width / 2;
        let y = game.height / 2;

        const button = new Button(x, y, 120, 48);

        button.setText("Jugar!");

        button.clicked = () => {
            game.sceneManager.show('GameScene');
        };

        this.addChild(button);
    }
}