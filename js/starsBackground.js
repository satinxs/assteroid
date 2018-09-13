import PIXI from 'pixi.js/dist/pixi';
import { random, randomBool, boxesIntersect } from './utilities';

function MakeStarTexture() {
    let graphic = new PIXI.Graphics();

    graphic.beginFill();
    graphic.fillColor = 0xffffff;
    graphic.fillAlpha = 0.5;

    graphic.drawStar(0, 0, 8, 2, 1, 0);
    // graphic.drawCircle(0, 0, 1);

    graphic.endFill();

    return game.app.renderer.generateTexture(graphic);
}

let screen = null;

export default class StarField {
    constructor(container, density) {
        screen = { x: 0, y: 0, width: game.width, height: game.height };

        this.container = container;
        this.starTexture = MakeStarTexture();
        this.stars = [];
        this.xacceleration = random(-1, 1);
        this.yacceleration = random(-1, 1);
        this.layers = [random(0.1, 2), random(0.1, 2)];

        this.initializeStarField(density || 0.5);
    }

    initializeStarField(density) {

        let starCount = screen.width * screen.height * density / 100;

        for (let i = 0; i < starCount; i++) {
            let star = new PIXI.Sprite(this.starTexture);

            star.x = random(0, screen.width);
            star.y = random(0, screen.height);

            this.rescale(star);

            star.layer = Math.floor(random(0, this.layers.length - 1));

            this.stars[i] = star;

            this.container.addChild(star);
        }
    }

    rescale(star) {
        let scale = random(0.1, 1.5);
        star.scale.set(scale, scale);
    }

    updateStars() {
        for (let i = 0; i < this.stars.length; i++) {
            let star = this.stars[i];

            let scale = this.layers[star.layer];

            star.x += scale * this.xacceleration;
            star.y += scale * this.yacceleration;

            if (!boxesIntersect(star, screen)) {
                this.refurbish(star);
            }
        }
    }

    refurbish(star) {
        let isVertical = randomBool();
        let x = 0,
            y = 0;

        if (isVertical) {
            y = random(0, screen.height);
            if (this.xacceleration < 0) x = screen.width;
        } else {
            x = random(0, screen.width);
            if (this.yacceleration < 0) y = screen.height;
        }

        star.x = x;
        star.y = y;

        this.rescale(star);
    }
}