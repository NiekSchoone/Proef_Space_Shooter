class EnemyManager {
    constructor() {
        this.patterns = new MovementPatterns();
        this.enemys = new Array();
    }
    createEnemy(type, healthMod, speedMod) {
        let newEnemy = new Enemy(game, type, healthMod, speedMod, this.patterns.pattern01);
        this.enemys.push(newEnemy);
    }
    update() {
        for (let i = 0; i < this.enemys.length; i++) {
            this.enemys[i].update();
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
        return this.y;
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
class Pickup {
    constructor(_x, _y) {
        this.position = new Vector2(_x, _y);
    }
    onPickup() {
    }
}
class Ship extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0);
        this.game = game;
    }
    fire() {
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
class MovementPatterns {
    constructor() {
        this.pattern01 = new Array();
        let point0 = new Vector2(200, -20);
        this.pattern01.push(point0);
        let point1 = new Vector2(200, 0);
        this.pattern01.push(point1);
        let point2 = new Vector2(200, 200);
        this.pattern01.push(point2);
        let point3 = new Vector2(200, 400);
        this.pattern01.push(point3);
        let point4 = new Vector2(200, 600);
        this.pattern01.push(point4);
        let point5 = new Vector2(200, 1000);
        this.pattern01.push(point5);
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
        this.moveDir = new Vector2();
    }
    update() {
        if (this.game.input.mousePointer.isDown) {
            this.moveDir.X = (this.game.input.x - this.x) / 100;
            this.moveDir.Y = (this.game.input.y - this.y) / 100;
            this.x += this.moveDir.X * this.speed;
            this.y += this.moveDir.Y * this.speed;
        }
    }
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["FIGHTER"] = 0] = "FIGHTER";
    EnemyType[EnemyType["BOMBER"] = 1] = "BOMBER";
    EnemyType[EnemyType["BOSS"] = 2] = "BOSS";
})(EnemyType || (EnemyType = {}));
class Enemy extends Ship {
    constructor(game, type, healthMod, speedMod, pattern) {
        super(game);
        this.x = 200;
        this.y = -200;
        this.moveDir = new Vector2(0, 0);
        this.movementPattern = pattern;
        this.notdead = true;
        this.currentPosition = new Vector2(this.x, this.y);
        this.currentMove = 0;
        game.time.events.loop(Phaser.Timer.SECOND * this.fireCooldown, this.shoot, this);
        switch (type) {
            case EnemyType.FIGHTER:
                this.setStats(10 * healthMod, 5 * speedMod);
                this.loadTexture("tempship");
                break;
            case EnemyType.BOMBER:
                this.setStats(20 * healthMod, 2 * speedMod);
                this.loadTexture("tempship");
                break;
            case EnemyType.BOSS:
                this.setStats(100 * healthMod, 5 * speedMod);
                this.loadTexture("tempship");
                break;
        }
        this.game.add.existing(this);
        this.scale.set(0.25);
        this.anchor.set(0.5);
        this.angle = 180;
    }
    update() {
        if (this.notdead) {
            this.moveDir.X = (this.movementPattern[this.currentMove].X - this.x) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].Y - this.y) / 100;
            this.moveDir.normalize();
            this.x += this.moveDir.X * this.speed;
            this.y += this.moveDir.Y * this.speed;
            this.currentPosition.X = this.x;
            this.currentPosition.Y = this.y;
            if (Vector2.distance(this.currentPosition, this.movementPattern[this.currentMove]) < 1) {
                this.currentMove++;
                if (this.currentMove == this.movementPattern.length) {
                    this.die();
                }
            }
        }
    }
    shoot() {
        if (this.notdead) {
        }
    }
    setStats(health, speed) {
        this.health = health;
        this.speed = speed;
    }
    die() {
        this.notdead = false;
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
                let distance = Vector2.distance(this.position, this.targets[i].pos);
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
class GameState extends Phaser.State {
    create() {
        this.level = new Level('background');
        this.player = new Player(game);
        this.enemyManager = new EnemyManager();
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 1);
    }
    update() {
        this.enemyManager.update();
        this.level.update();
    }
}
class Preloader extends Phaser.State {
    preload() {
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("tempship", "assets/Images/Placeholders/alienspaceship.png");
    }
    create() {
        game.state.start("Game");
    }
}
class App {
    constructor() {
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }
    create() {
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        game.state.start("Preload");
    }
    initStates() {
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        game.state.start("Preload");
    }
}
window.onload = () => {
    var app = new App();
};
//# sourceMappingURL=app.js.map