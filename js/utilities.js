import RandomJs from 'random-js';

Math.radians = degrees => degrees * Math.PI / 180;
Math.degrees = radians => radians * 180 / Math.PI;

export function testCollision(entity1, entity2) {
    let h1 = entity1.toGlobal(entity1.pivot);
    let h2 = entity2.toGlobal(entity2.pivot);

    if (!entity1.hitArea || !entity2.hitArea)
        return false;

    let radiuses = entity1.hitArea.radius + entity2.hitArea.radius;
    let x = h1.x - h2.x;
    let y = h1.y - h2.y;

    var distance = Math.sqrt(x * x + y * y);

    if (distance < radiuses) {
        return true;
    }

    return false;
}


export const Random = new RandomJs(RandomJs.engines.mt19937().autoSeed());

export function ready(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}

export function scaleToWindow(canvas, backgroundColor) {
    var scaleX, scaleY, scale, center;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
            center = "horizontally";
        } else {
            center = "vertically";
        }
    } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
            center = "vertically";
        } else {
            center = "horizontally";
        }
    }

    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases) 
    if (center === "vertically") {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";

    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;

    //5. Return the `scale` value. This is important, because you'll nee this value 
    //for correct hit testing between the pointer and sprites
    return scale;
}

export function randomBool() {
    return Math.floor(random(0, 1)) === 1;
}

export function average() {
    let sum = 0;
    let count = 0;
    for (let i in arguments) {
        if (typeof arguments[i] === 'number') {
            sum += arguments[i];
            count++;
        } else if (Array.isArray(arguments[i])) {
            sum += arguments[i].reduce((p, c) => p + c, 0);
            count += arguments[i].length;
        }
    }

    return sum / count;
}

export function random(min, max) {
    return Math.random() * (max - (min - 1)) + min;
}

export function boxesIntersect(a, b) {
    return (
        a.x + a.width > b.x &&
        a.x < b.x + b.width &&
        a.y + a.height > b.y &&
        a.y < b.y + b.height
    );
}

export class Button extends PIXI.Sprite {

    constructor(x, y, width, height) {
        super();
        this.create(x, y, width, height);
    }

    createGraphics(width, height) {
        let gfx = new PIXI.Graphics();
        gfx.beginFill(0xffffff, 1);
        gfx.drawRoundedRect(0, 0, width, height, height / 5);
        gfx.endFill();
        this.texture = gfx.generateCanvasTexture();
    }

    create(x, y, width, height) {

        let gfx = this.createGraphics(width, height);

        // set the x, y and anchor
        this.x = x;
        this.y = y;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        // create the text object
        this._text = new PIXI.Text("", 'arial');
        this._text.anchor = new PIXI.Point(0.5, 0.5);
        this.addChild(this._text);

        // set the interactivity to true and assign callback functions
        this.interactive = true;
        this.buttonMode = true;

        this.on("mousedown", () => { this.onDown(); }, this);

        this.on("mouseup", () => { this.onUp(); }, this);

        this.on("mouseover", () => { this.onHover(); }, this);

        this.on("mouseout", () => { this.onOut(); }, this);
    }

    setText(val, style) {
        // Set text to be the value passed as a parameter
        this._text.text = val;
        // Set style of text to the style passed as a parameter
        this._text.style = style;
    }

    onDown() {
        this.y += 5;
        this.tint = 0xffffff;
    }

    onUp() {
        if (typeof (this._cb) === 'function') {
            this._cb();
        }
        this.y -= 5;
        this.tint = 0xEEEEEE;
    }

    onHover() {
        this.tint = 0xEEEEEE;
        this.scale.x = 1.1;
        this.scale.y = 1.1;
    }

    onOut() {
        this.tint = 0xffffff;
        this.scale.x = 1;
        this.scale.y = 1;
    }

    get clicked() {
        return this._cb;
    }

    set clicked(cb) {
        this._cb = cb;
    }
}

export function getPointByAngle(center, radius, angle) {
    angle = Math.radians(angle);

    let x = center.x + radius * Math.cos(angle);
    let y = center.y + radius * Math.sin(angle);
    return new PIXI.Point(x, y);
}

export function createRandomPoly(x, y, radius, sides) {
    let center = { x, y };

    let poly = [];

    let restAngle = -180;
    sides = sides || Math.floor(random(4, 7));

    let angleStep = Math.floor(360 / sides);

    poly[0] = getPointByAngle(center, radius, -180);

    let side = 1;

    while (restAngle < 180) {
        let rndAngle = Math.floor(random(30, angleStep));
        restAngle += rndAngle;
        restAngle = Math.min(180, restAngle);

        poly[side++] = getPointByAngle(center, radius, restAngle);
    }

    let graphics = new PIXI.Graphics();

    graphics.beginFill();

    graphics.moveTo(poly[0].x, poly[0].y);

    for (let i = 1; i < poly.length; i++)
        graphics.lineTo(poly[i].x, poly[i].y);

    graphics.lineTo(poly[0].x, poly[0].y);

    graphics.endFill();

    return graphics;
}