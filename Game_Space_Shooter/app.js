class EnemyManager {
    constructor(_projectilePools) {
        this.patterns = new MovementPatterns();
        this.enemies = new Array();
        this.projectilePools = _projectilePools;
    }
    createEnemy(type, healthMod, speedMod) {
        let newEnemy = new Enemy(type, healthMod, speedMod, this.patterns.pattern01, 2);
        newEnemy.addWeapon(1, this.projectilePools[0], [this.player]);
        this.enemies.push(newEnemy);
    }
    update() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
    }
    setPlayer(_player) {
        this.player = _player;
    }
    getEnemies() {
        return this.enemies;
    }
}
class Weapon {
    constructor(_cooldown, _projectilePool, targets) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.targets = targets;
    }
    update() {
        this.fireTimer -= game.time.elapsedMS;
        if (this.fireTimer < 0) {
            this.fireTimer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.position, this.angle);
        }
    }
}
class Vector2 {
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
    constructor(_x = 0, _y = 0) {
        this.x = _x;
        this.y = _y;
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
class Ship extends Phaser.Sprite {
    constructor(_collisionRadius) {
        super(game, 0, 0);
        this.game = game;
        this.collisionRadius = _collisionRadius;
        this.weapons = new Array();
        this.vectorPosition = new Vector2(this.x, this.y);
    }
    onHit(_amount) {
        this.health -= _amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    addWeapon(cooldown, projectilePool, _targets) {
        let newWeapon = new Weapon(cooldown, projectilePool, _targets);
        this.weapons.push(newWeapon);
    }
    update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
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
    constructor(_projectilePools, _collisionRadius) {
        super(_collisionRadius);
        this.projectilePools = _projectilePools;
        this.loadTexture("ship_player");
        this.game.add.existing(this);
        this.speed = 10;
        this.anchor.set(0.5);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
    }
    update() {
        if (this.game.input.mousePointer.isDown) {
            this.moveDir.X = (this.game.input.x - this.x) / 100;
            this.moveDir.Y = (this.game.input.y - this.y) / 100;
            this.vectorPosition.X += this.moveDir.X * this.speed;
            this.vectorPosition.Y += this.moveDir.Y * this.speed;
        }
        super.update();
    }
    setTargets(_enemies) {
        this.enemies = _enemies;
    }
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["FIGHTER"] = 0] = "FIGHTER";
    EnemyType[EnemyType["BOMBER"] = 1] = "BOMBER";
    EnemyType[EnemyType["BOSS"] = 2] = "BOSS";
})(EnemyType || (EnemyType = {}));
class Enemy extends Ship {
    constructor(type, healthMod, speedMod, pattern, _collisionRadius) {
        super(_collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.movementPattern = pattern;
        this.vectorPosition.X = this.movementPattern[0].X;
        this.vectorPosition.Y = this.movementPattern[0].Y;
        this.notdead = true;
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
            this.vectorPosition.X += this.moveDir.X * this.speed;
            this.vectorPosition.Y += this.moveDir.Y * this.speed;
            if (Vector2.distance(this.vectorPosition, this.movementPattern[this.currentMove]) < 1) {
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
class Projectile extends Phaser.Sprite {
    constructor(_pos, _tex, _toPool) {
        super(game, _pos.X, _pos.Y);
        this.vectorPosition = _pos;
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
        this.targets = new Array();
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
                console.log("distance " + distance);
                console.log("player " + this.targets[i].vectorPosition.X + ":" + this.targets[i].vectorPosition.Y);
                console.log("bullet " + this.vectorPosition.X + ":" + this.vectorPosition.Y);
                if (distance < this.targets[i].collisionRadius) {
                    //console.log("player " + this.targets[i].vectorPosition.X + ":" + this.targets[i].vectorPosition.Y);  
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
class GameState extends Phaser.State {
    create() {
        this.level = new Level();
        this.projectilePools = new Array();
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.projectilePools.push(this.plasmaBulletPool);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.projectilePools.push(this.missilePool);
        this.player = new Player(this.projectilePools, 2);
        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);
        this.player.setTargets(this.enemyManager.getEnemies());
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 0.1);
        game.physics.startSystem(Phaser.Physics.ARCADE);
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
//# sourceMappingURL=app.js.map