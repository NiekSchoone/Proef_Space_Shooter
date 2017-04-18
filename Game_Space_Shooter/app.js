class App {
    constructor() {
        game = new Phaser.Game(512, 910, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }
    create() {
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        game.state.start("Preload");
    }
}
window.onload = () => {
    var app = new App();
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
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.player = new Player(this.game);
        this.level = new Level('background');
    }
    update() {
        this.level.update();
    }
}
class Preloader extends Phaser.State {
    preload() {
        game.load.spritesheet('background', 'assets/Images/background_002.jpg', 512, 2048, 4);
        game.load.image("tempship", "assets/Images/Placeholders/alienspaceship.png");
    }
    create() {
        this.game.state.start("Game");
    }
}
class Level {
    constructor(bg) {
        this.background = bg;
        this.scrollSpeed = 15.0;
        this.backgroundGroup = game.add.group();
        this.backgroundGroup.createMultiple(1, this.background, [1, 2, 3, 4], true);
        this.backgroundGroup.align(1, 4, 512, 2048);
        this.backgroundGroup.y = -4096;
        this.scrollY = 0;
    }
    scrollBackground() {
        this.backgroundGroup.y += this.scrollSpeed;
        this.scrollY += this.scrollSpeed;
        if (this.scrollY > 2048) {
            this.backgroundGroup.previous();
            this.backgroundGroup.cursor.y -= 4 * 2048;
            this.scrollY -= 2048;
            this.backgroundGroup.cursor.frame = Math.floor(Math.random() * 4) + 1;
        }
    }
    update() {
        this.scrollBackground();
    }
}
class Pickup {
    constructor(_x, _y) {
        this.position = new Vector2(_x, _y);
    }
    onPickup() {
    }
}
class Missile extends Projectile {
    constructor(_pos, _vel, _toPool) {
        super(_pos, _vel, _toPool);
        this.projectileType = ProjectileType.MISSILE;
    }
}
class PlasmaBullet extends Projectile {
    constructor(_pos, _vel, _toPool) {
        super(_pos, _vel, _toPool);
        this.projectileType = ProjectileType.PLASMABULLET;
    }
}
class Projectile {
    constructor(_pos, _vel, _toPool) {
        this.position = _pos;
        this.velocity = _vel;
        this.returnToPool = _toPool;
    }
    update() {
        this.checkCollision();
    }
    checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(this.position, this.targets[i].position);
                if (distance < this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    }
    onHit(_target) {
        _target.onHit(this.projectileType);
        this.returnToPool(this);
    }
    setTarget(_targets) {
        for (let i = 0; i < _targets.length; i++) {
            this.targets.push(_targets[i]);
        }
    }
}
var ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["PLASMABULLET"] = 0] = "PLASMABULLET";
    ProjectileType[ProjectileType["MISSILE"] = 1] = "MISSILE";
})(ProjectileType || (ProjectileType = {}));
class ProjectilePool {
    constructor(_type) {
        this.poolType = _type;
        this.available = new Array();
        this.inUse = new Array();
        this.projectileCount = 0;
    }
    getProjectile() {
        let projectile;
        if (this.available.length != 0) {
            projectile = this.available.pop();
            this.inUse.push(projectile);
            return projectile;
        }
        else {
            projectile = this.addProjectile();
            this.inUse.push(projectile);
            return projectile;
        }
    }
    returnProjectile(projectile) {
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex);
        this.inUse.splice(index, 1);
        this.available.push(projectile);
    }
    addProjectile() {
        let newProjectile;
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet(new Vector2(0, 0), new Vector2(0, 0), this.returnProjectile);
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            return newProjectile;
        }
        else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile(new Vector2(0, 0), new Vector2(0, 0), this.returnProjectile);
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            return newProjectile;
        }
        else {
            throw "Incorrect type specified for object pool";
        }
    }
    compare(a, b) {
        if (a.projectileIndex < b.projectileIndex) {
            return -1;
        }
        else if (a.projectileIndex > b.projectileIndex) {
            return 1;
        }
        else {
            return 0;
        }
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
    static distance(a, b) {
        return Math.sqrt(this.squaredDistance(a, b));
    }
    static squaredDistance(a, b) {
        var x = b.x - a.x, y = b.y - a.y;
        return (x * x + y * y);
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