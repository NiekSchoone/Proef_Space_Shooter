class App {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { create: this.create });
        this.game.stage = new Phaser.Stage(this.game);
    }
    create() {
        //this.initStates();
        this.game.state.add("Preload", Preloader);
        this.game.state.add("Game", GameState);
        this.game.state.start("Preload");
        //this.game.state.add("Game", GameState);
    }
    initStates() {
    }
}
window.onload = () => {
    var greeter = new App();
};
var EnemyType;
(function (EnemyType) {
})(EnemyType || (EnemyType = {}));
class Enemy extends Ship {
    constructor(game, healthMod, speedMod) {
        super(game);
    }
}
class MovementPattern {
}
class GameState extends Phaser.State {
    create() {
        this.player = new Player(this.game);
    }
}
class Preloader extends Phaser.State {
    preload() {
        this.game.load.image("tempship", "assets/Images/Placeholders/alienspaceship.png");
    }
    create() {
        this.game.state.start("Game");
    }
}
class Ship extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0);
        this.game = game;
    }
    onHit(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    die() {
        //this.destroy();
    }
}
/// <reference path="../Ship.ts"/>
class Player extends Ship {
    constructor(game) {
        super(game);
        this.loadTexture("tempship");
        this.game.add.existing(this);
        this.speed = 10;
        this.scale.set(0.25);
        this.anchor.set(0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
    }
    update() {
        if (this.game.input.mousePointer.isDown) {
            var dirx = (this.game.input.x - this.x) / 100;
            var diry = (this.game.input.y - this.y) / 100;
            this.x += dirx * this.speed;
            this.y += diry * this.speed;
        }
    }
}
class Vector2 {
    constructor(_x = 0, _y = 0) {
        this.x = _x;
        this.y = _y;
    }
    get X() {
        return this.x;
    }
    get Y() {
        return this.x;
    }
    set X(value) {
        this.x = value;
    }
    set Y(value) {
        this.y = value;
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
    length() {
        return Math.sqrt(this.squaredLength());
    }
    squaredLength() {
        var x = this.x, y = this.y;
        return (x * x + y * y);
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }
    normalize(dest = null) {
        if (!dest)
            dest = this;
        var length = this.length();
        if (length === 1) {
            return this;
        }
        if (length === 0) {
            dest.x = 0;
            dest.y = 0;
            return dest;
        }
        length = 1.0 / length;
        dest.x *= length;
        dest.y *= length;
        return dest;
    }
    static direction(vector, vector2, dest = null) {
        if (!dest)
            dest = new Vector2();
        var x = vector.x - vector2.x, y = vector.y - vector2.y;
        var length = Math.sqrt(x * x + y * y);
        if (length === 0) {
            dest.x = 0;
            dest.y = 0;
            return dest;
        }
        length = 1 / length;
        dest.x = x * length;
        dest.y = y * length;
        return dest;
    }
    static sum(vector, vector2, dest = null) {
        if (!dest)
            dest = new Vector2();
        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;
        return dest;
    }
    static difference(vector, vector2, dest = null) {
        if (!dest)
            dest = new Vector2();
        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;
        return dest;
    }
}
//# sourceMappingURL=app.js.map