export default class GameUI extends PIXI.Container {

    constructor(createAsteroids) {
        super();
        this.level = 0;

        this.createAsteroids = createAsteroids;

        this.initialize();
    }

    initialize() {
        this.levelCounter = new PIXI.Text("Nivel 1", {
            "fill": "white",
            "fontFamily": "Impact",
            "fontSize": 30,
            "strokeThickness": 2
        });

        this.addChild(this.levelCounter);

        this.levelCounter.x = game.app.screen.width / 2 - this.levelCounter.width / 2;
        this.levelCounter.y = 0;
    }

    update(spaceship, entitySystem) {
        if (entitySystem.entities.filter(e => e.type === "Asteroid").length === 0) {
            this.level++;
            this.levelCounter.text = `Nivel ${this.level}`;

            entitySystem.entities.forEach(e => {
                if (e.type === 'Bullet')
                    e.destroy();
            });

            spaceship.x = game.app.screen.width / 2;
            spaceship.y = game.app.screen.height / 2;
            spaceship.rotation = 0;
            spaceship.acceleration = { x: 0, y: 0 };
            this.createAsteroids(this.level);
        }
    }
}