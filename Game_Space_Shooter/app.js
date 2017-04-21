class MenuState extends Phaser.State {
    create() {
        this.background.loadTexture('menu_background');
        this.startButton.loadTexture('button_start');
        this.rightButton.loadTexture('button_right');
        this.leftButton.loadTexture('button_left');
        this.portraits = new Array();
        this.playerPortrait1.loadTexture('portrait_1');
        this.playerPortrait1.loadTexture('portrait_2');
        this.playerPortrait1.loadTexture('portrait_3');
        this.playerPortrait1.loadTexture('portrait_4');
        this.portraits.push(this.playerPortrait1);
        this.portraits.push(this.playerPortrait2);
        this.portraits.push(this.playerPortrait3);
        this.portraits.push(this.playerPortrait4);
    }
}
class EnemyManager {
    constructor(_projectilePools) {
        this.patterns = new MovementPatterns();
        this.enemies = new Array();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0;
        this.timer = 2 * Phaser.Timer.SECOND;
    }
    createEnemy(type, healthMod, speedMod, pattern) {
        let newEnemy = new Enemy(type, healthMod, speedMod, pattern, 70, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        newEnemy.addWeapon(0.5, this.projectilePools[0], [this.player]);
        this.enemies.push(newEnemy);
    }
    update() {
        this.timer -= game.time.elapsedMS;
        if (this.timer < 0) {
            this.timer = 2 * Phaser.Timer.SECOND;
            switch (this.enemiesMade) {
                case 0:
                    this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern01);
                    break;
                case 1:
                    this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern02);
                    break;
                case 2:
                    this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern03);
                    break;
                case 3:
                    this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern04);
                    break;
                case 4:
                    this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern05);
                    break;
            }
        }
    }
    setPlayer(_player) {
        this.player = _player;
    }
    killEnemy(_enemy) {
        let index = this.enemies.indexOf(_enemy, _enemy.id);
        this.enemies.splice(index, 1);
        _enemy.destroy();
    }
    getEnemies() {
        return this.enemies;
    }
}
class Weapon {
    constructor(_cooldown, _projectilePool, _targets) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.targets = _targets;
    }
    update() {
        this.fireTimer -= game.time.elapsedMS;
        // Fire a projectile when the fire timer lands at 0
        if (this.fireTimer <= 0) {
            this.fireTimer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
    }
    // Set the angle the projectiles will fire from
    setAngle(_angle) {
        this.fireAngle = _angle;
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
    static copy(vector) {
        return new Vector2(vector.X, vector.Y);
    }
}
class Pickup extends Phaser.Sprite {
    constructor(_x, _y, _type) {
        super(game, _x, _y);
        this.vectorPosition = new Vector2(_x, _y);
    }
    onPickup() {
    }
    update() {
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
        this.vectorPosition = new Vector2();
    }
    onHit(_amount) {
        this.health -= _amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    // Add a weapon for this ship with cooldown 
    addWeapon(cooldown, projectilePool, _targets) {
        let newWeapon = new Weapon(cooldown, projectilePool, _targets);
        newWeapon.setAngle(this.fireAngle);
        this.weapons.push(newWeapon);
    }
    update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        for (let i = 0; i < this.weapons.length; i++) {
            this.weapons[i].vectorPosition = Vector2.copy(this.vectorPosition);
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
        let point0 = new Vector2(100, -20);
        this.pattern01.push(point0);
        let point1 = new Vector2(150, 1000);
        this.pattern01.push(point1);
        this.pattern02 = new Array();
        let point2 = new Vector2(400, -20);
        this.pattern02.push(point2);
        let point3 = new Vector2(400, 1000);
        this.pattern02.push(point3);
        this.pattern03 = new Array();
        let point4 = new Vector2(200, -20);
        this.pattern03.push(point4);
        let point5 = new Vector2(300, 1000);
        this.pattern03.push(point5);
        this.pattern04 = new Array();
        let point6 = new Vector2(300, -20);
        this.pattern04.push(point6);
        let point7 = new Vector2(300, 1000);
        this.pattern04.push(point7);
        this.pattern05 = new Array();
        let point8 = new Vector2(200, -20);
        this.pattern05.push(point8);
        let point9 = new Vector2(250, 1000);
        this.pattern05.push(point9);
    }
}
class Player extends Ship {
    constructor(_projectilePools, _collisionRadius) {
        super(_collisionRadius);
        this.projectilePools = _projectilePools;
        this.loadTexture("ships_player", 3);
        this.speed = 10;
        this.anchor.set(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        this.enemies = new Array();
        this.fireAngle = 0;
    }
    update() {
        // When a mouse pointer or touch pointer is down on the screen, get get the position and calculate a move direction
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        super.update();
    }
    // Set targets that the player's weapon can hit
    setTargets(_targets) {
        this.enemies = _targets;
        this.addWeapon(0.35, this.projectilePools[0], this.enemies); // Create a weapon for the player
    }
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["FIGHTER"] = 0] = "FIGHTER";
    EnemyType[EnemyType["BOMBER"] = 1] = "BOMBER";
    EnemyType[EnemyType["BOSS"] = 2] = "BOSS";
})(EnemyType || (EnemyType = {}));
class Enemy extends Ship {
    constructor(type, healthMod, speedMod, pattern, _collisionRadius, _killEnemy, _id) {
        super(_collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.killEnemy = _killEnemy;
        this.movementPattern = pattern;
        this.vectorPosition.X = this.movementPattern[0].X;
        this.vectorPosition.Y = this.movementPattern[0].Y;
        this.notdead = true;
        this.currentMove = 1;
        switch (type) {
            case EnemyType.FIGHTER:
                this.setStats(2 * healthMod, 5 * speedMod);
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
        game.add.existing(this);
        this.anchor.set(0.5);
        this.fireAngle = 180;
    }
    update() {
        if (this.notdead) {
            this.moveDir.X = (this.movementPattern[this.currentMove].X - this.vectorPosition.X) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].Y - this.vectorPosition.Y) / 100;
            this.moveDir.normalize();
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
            if (Vector2.distance(this.vectorPosition, this.movementPattern[this.currentMove]) < 1) {
                this.currentMove++;
                if (this.currentMove == this.movementPattern.length) {
                    this.die();
                }
            }
            super.update();
        }
    }
    setStats(_health, _speed) {
        this.health = _health;
        this.speed = _speed;
    }
    die() {
        this.notdead = false;
        this.killEnemy(this);
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
    constructor(_tex, _toPool) {
        super(game, 0, 0);
        this.vectorPosition = new Vector2(0, 0);
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
        this.anchor.set(0.5);
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
    // Fires a bullet from a given position and angle
    fire(_pos, _rotation) {
        this.angle = _rotation;
        let angleVelocity = game.physics.arcade.velocityFromAngle(this.angle - 90, this.speed);
        this.velocity = new Vector2(angleVelocity.x, angleVelocity.y);
        this.vectorPosition = _pos;
        this.active = true;
    }
    // Set targets this projectile can hit
    setTarget(_targets) {
        this.targets = _targets;
    }
    // Checks each posible hit target
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
    // Check if the position of this projectile is out of the bounds of the level
    checkBounds() {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.returnToPool(this);
        }
    }
    // On hitting a target the projectile will return to the pool and apply damage on the target
    onHit(_target) {
        _target.onHit(this.damageAmount);
        this.returnToPool(this);
    }
    // Reset the values of this projectile to their default values
    resetValues() {
        this.visible = false;
        this.active = false;
        this.targets = new Array();
        this.vectorPosition = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
    }
}
var ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["PLASMABULLET"] = 0] = "PLASMABULLET";
    ProjectileType[ProjectileType["MISSILE"] = 1] = "MISSILE";
})(ProjectileType || (ProjectileType = {}));
class Missile extends Projectile {
    constructor(_tex, _toPool) {
        super(_tex, _toPool);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 5;
    }
}
class PlasmaBullet extends Projectile {
    constructor(_tex, _toPool) {
        super(_tex, _toPool);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 1;
    }
}
class ProjectilePool {
    constructor(_type) {
        this.poolType = _type;
        this.available = new Array();
        this.inUse = new Array();
        this.projectileCount = 0;
    }
    // Get a projectile from the pool and return it
    getProjectile() {
        let projectile;
        if (this.available.length != 0) {
            projectile = this.available.pop(); // If there are any previously created projectiles available pop the last one and assign it to "projectile"
        }
        else {
            projectile = this.addProjectile(); // If there are no available projectiles, make a new one
        }
        if (projectile != null) {
            this.inUse.push(projectile);
            projectile.visible = true;
            return projectile;
        }
    }
    // Returns a given projectile to the pool of available projectiles
    returnProjectile(projectile) {
        projectile.resetValues();
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex); // Find the projectile in the "inUse" array by the identifier it has
        this.inUse.splice(index, 1); // Splice the projectile out of the array
        this.available.push(projectile); // Place the projectile back in the array of available projectiles
    }
    // Adds a projectile to the pool ready for use
    addProjectile() {
        let newProjectile;
        // Check which type is defined for this pool and make a new projectile based on that type
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet('plasma_bullet', this.returnProjectile.bind(this));
        }
        else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile('missile', this.returnProjectile.bind(this));
        }
        else {
            throw "Incorrect type specified for object pool";
        }
        if (newProjectile != null) {
            newProjectile.projectileIndex = this.projectileCount; // Give the projectile an index number to find it in the array
            game.add.existing(newProjectile); // Add the projectile to the game
            this.projectileCount++;
            return newProjectile;
        }
    }
}
class GameState extends Phaser.State {
    create() {
        this.level = new Level();
        this.projectilePools = new Array();
        // Create the various pools for different projectiles
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.projectilePools.push(this.plasmaBulletPool);
        this.projectilePools.push(this.missilePool);
        // Create a player
        this.player = new Player(this.projectilePools, 50);
        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);
        this.player.setTargets(this.enemyManager.getEnemies());
    }
    update() {
        this.level.update();
        this.enemyManager.update();
    }
}
class Preloader extends Phaser.State {
    // Preload all assets
    preload() {
        // Images
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("plasma_bullet", "assets/Images/Placeholders/bullet.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");
        // Spritesheets
        game.load.spritesheet("ships_player", "assets/SpriteSheets/player_ship_sheet.png", 128, 128, 4);
        // Audio
    }
    // After the preload function is done, the create function is called which starts the GameState
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
        game.physics.startSystem(Phaser.Physics.ARCADE); // Start the arcade physics system
        // Add the various states the game goes through
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        // Start the preload state
        game.state.start("Preload");
    }
}
window.onload = () => {
    var app = new App();
};
//# sourceMappingURL=app.js.map