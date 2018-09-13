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

        const style = new PIXI.TextStyle({
            fill: "white",
            fontSize: 28,
            strokeThickness: 2
        });

        const mensaje = new PIXI.Text(`Perdiste!`, style);

        mensaje.pivot.set(mensaje.width / 2, mensaje.height / 2);
        mensaje.x = x;
        mensaje.y = 200;

        const button = new Button(x, y, 240, 48);

        button.setText("Jugar de nuevo");

        button.clicked = () => game.sceneManager.show('GameScene');

        this.addChild(mensaje);
        this.addChild(button);
    }
}