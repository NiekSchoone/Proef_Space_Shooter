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
class GameState extends Phaser.State {
    create() {
        this.level = new Level();
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.player = new Player(game);
        this.enemyManager = new EnemyManager(this.plasmaBulletPool);
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 0.1);
    }
    update() {
        this.enemyManager.update();
        this.level.update();
    }
}
class Preloader extends Phaser.State {
    preload() {
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("plasma_bullet", "assets/Images/Placeholders/bullet.png");
        game.load.image("ship_player", "assets/Images/Placeholders/ship_player.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");
    }
    create() {
        game.state.start("Game");
    }
}
class Level {
    constructor() {
        this.scrollSpeed = 15.0;
        this.scrollY = 0;
        this.backgroundGroup = game.add.group();
        this.backgroundGroup.createMultiple(1, 'background', [1, 2, 3, 4], true);
        this.backgroundGroup.align(1, 4, 512, 2048);
        this.backgroundGroup.y = -4096;
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
class Pickup extends Phaser.Sprite {
    constructor(_x, _y, _type) {
        super(game, _x, _y);
        this.vectorPosition = new Vector2(_x, _y);
    }
    onPickup() {
    }
}
var PickupType;
(function (PickupType) {
    PickupType[PickupType["REPAIR"] = 0] = "REPAIR";
    PickupType[PickupType["UPGRADEMISSILE"] = 1] = "UPGRADEMISSILE";
    PickupType[PickupType["UPGRADEPLASMA"] = 2] = "UPGRADEPLASMA";
})(PickupType || (PickupType = {}));
class Missile extends Projectile {
    constructor(_pos, _tex, _toPool) {
        super(_pos, _tex, _toPool);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
    }
}
class PlasmaBullet extends Projectile {
    constructor(_pos, _tex, _toPool) {
        super(_pos, _tex, _toPool);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
    }
}
class Projectile extends Phaser.Sprite {
    constructor(_pos, _tex, _toPool) {
        super(game, _pos.X, _pos.Y);
        this.vectorPosition = _pos;
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
    }
    update() {
        if (this.active) {
            this.vectorPosition.add(this.velocity);
        }
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        this.checkCollision();
        this.checkBounds();
    }
    fire(_pos, _rotation) {
        let angleVelocity = game.physics.arcade.velocityFromAngle(this.angle - 90, this.speed);
        this.velocity = new Vector2(angleVelocity.x, angleVelocity.y);
        this.vectorPosition = _pos;
        this.angle = _rotation;
        this.active = true;
    }
    setTarget(_targets) {
        for (let i = 0; i < _targets.length; i++) {
            this.targets.push(_targets[i]);
        }
    }
    checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(this.vectorPosition, this.targets[i].vectorPosition);
                if (distance < this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    }
    checkBounds() {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.returnToPool(this);
        }
    }
    onHit(_target) {
        _target.onHit(this.projectileType);
        this.returnToPool(this);
    }
    resetValues() {
        this.active = false;
        this.vectorPosition = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.visible = false;
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
            projectile.visible = true;
            return projectile;
        }
        else {
            projectile = this.addProjectile();
            this.inUse.push(projectile);
            projectile.visible = true;
            return projectile;
        }
    }
    returnProjectile(projectile) {
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex);
        this.inUse.splice(index, 1);
        this.available.push(projectile);
        projectile.resetValues();
    }
    addProjectile() {
        let newProjectile;
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet(new Vector2(0, 0), 'plasma_bullet', this.returnProjectile.bind(this));
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            game.add.existing(newProjectile);
            return newProjectile;
        }
        else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile(new Vector2(0, 0), 'missile', this.returnProjectile.bind(this));
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            game.add.existing(newProjectile);
            return newProjectile;
        }
        else {
            throw "Incorrect type specified for object pool";
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
        this.moveDir = new Vector2(0, 0);
        this.movementPattern = pattern;
        this.x = this.movementPattern[0].X;
        this.y = this.movementPattern[0].Y;
        this.notdead = true;
        this.currentPosition = new Vector2(this.x, this.y);
        this.currentMove = 1;
        switch (type) {
            case EnemyType.FIGHTER:
                this.setStats(10 * healthMod, 5 * speedMod);
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOMBER:
                this.setStats(20 * healthMod, 2 * speedMod);
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOSS:
                this.setStats(100 * healthMod, 5 * speedMod);
                this.loadTexture("ship_enemy");
                break;
        }
        this.game.add.existing(this);
        this.anchor.set(0.5);
    }
    update() {
        super.update();
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
    setStats(health, speed) {
        this.health = health;
        this.speed = speed;
    }
    die() {
        this.notdead = false;
    }
}
class EnemyManager {
    constructor(pool) {
        this.patterns = new MovementPatterns();
        this.enemys = new Array();
        this.pool = pool;
    }
    createEnemy(type, healthMod, speedMod) {
        let newEnemy = new Enemy(game, type, healthMod, speedMod, this.patterns.pattern01);
        let newWeapon = new Weapon(200, this.pool);
        newEnemy.addWeapon(newWeapon);
        this.enemys.push(newEnemy);
    }
    update() {
        for (let i = 0; i < this.enemys.length; i++) {
            this.enemys[i].update();
        }
    }
}
class MovementPatterns {
    constructor() {
        this.pattern01 = new Array();
        let point0 = new Vector2(200, -20);
        this.pattern01.push(point0);
        let point1 = new Vector2(200, 1000);
        this.pattern01.push(point1);
    }
}
class Player extends Ship {
    constructor(game) {
        super(game);
        this.loadTexture("ship_player");
        this.game.add.existing(this);
        this.speed = 10;
        this.anchor.set(0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
    }
    update() {
        super.update();
        if (this.game.input.mousePointer.isDown) {
            this.moveDir.X = (this.game.input.x - this.x) / 100;
            this.moveDir.Y = (this.game.input.y - this.y) / 100;
            this.x += this.moveDir.X * this.speed;
            this.y += this.moveDir.Y * this.speed;
        }
    }
}
class Ship extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0);
        this.game = game;
        this.weapons = new Array();
    }
    onHit(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    addWeapon(weapon) {
        this.weapons.push(weapon);
    }
    update() {
        for (let i = 0; i < this.weapons.length; i++) {
            let currentPosition = new Vector2(this.x, this.y);
            this.weapons[i].position = currentPosition;
            this.weapons[i].angle = this.angle;
            this.weapons[i].update();
        }
    }
    die() {
        //this.destroy();
    }
}
class Weapon {
    constructor(_cooldown, _projectilePool) {
        this.cooldown = _cooldown;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
    }
    update() {
        this.fireTimer -= game.time.elapsedMS;
        if (this.fireTimer < 0) {
            this.fireTimer = this.cooldown;
            this.projectilePool.getProjectile().fire(this.position, this.angle);
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
//# sourceMappingURL=app.js.map