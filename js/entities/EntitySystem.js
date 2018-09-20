import { testCollision } from '../utilities';

export default class EntitySystem {
    constructor() {
        this.entities = [];
        this.collisionCallbacks = [];
    }

    onCollision(fn) {
        this.collisionCallbacks.push(fn);
    }

    add(entity) {
        this.entities.push(entity);

        return this;
    }

    remove(entity) {
        this.entities = this.entities.filter(e => e !== entity);

        return this;
    }

    clear() {
        this.entities = [];
    }

    update(dt) {
        for (let i in this.entities) {
            let entity = this.entities[i];

            if (!entity || entity._destroyed)
                continue;

            if (typeof this.entities[i].update === "function")
                this.entities[i].update(dt);

            this.checkForCollisions();
        }

        this.entities = this.entities.filter(e => !e._destroyed);
    }

    checkForCollisions() {
        let queue = Array.from(this.entities.filter(e => !e._destroyed));

        while (queue.length > 1) {
            let entity = queue.pop();

            for (let i in queue) {
                if (entity._destroyed || queue[i]._destroyed)
                    continue;

                if (testCollision(entity, queue[i])) {
                    if (entity.collide) {
                        entity.collide(queue[i]);
                        this.collisionCallbacks.forEach(fn => fn(entity, queue[i]));
                    }
                    else if (queue[i].collide) {
                        queue[i].collide(entity);
                        this.collisionCallbacks.forEach(fn => fn(entity, queue[i]));
                    }
                }
            }
        }
    }
}