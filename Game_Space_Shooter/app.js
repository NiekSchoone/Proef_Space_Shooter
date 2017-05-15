class App {
    constructor() {
        game = new Phaser.Game(512, 910, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }
    create() {
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.physics.startSystem(Phaser.Physics.ARCADE); // Start the arcade physics system
        // Add the various states the game goes through
        game.state.add("Preload", Preloader);
        game.state.add("Boot", BootState);
        game.state.add("Menu", MenuState);
        game.state.add("Game", GameState);
        // Start the preload state
        game.state.start("Preload");
    }
}
window.onload = () => {
    var app = new App();
};
class Level {
    constructor() {
        this.scrollSpeed = 20.0;
        this.scrollY = 0;
        this.backgroundGroup = game.add.group();
        this.backgroundGroup.createMultiple(1, 'game_background', [1, 2, 3, 4], true);
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
    constructor(_player, _x, _y, _type) {
        super(game, _x, _y);
        this.player = _player;
        this.vectorPosition = new Vector2(_x, _y);
        this.velocity = new Vector2(0, 1);
    }
    update() {
        this.vectorPosition.add(this.velocity);
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        this.checkCollision();
        this.checkBounds();
    }
    onHit() {
        this.player.handlePickup(this.pickupType);
        this.destroy();
    }
    checkBounds() {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.destroy();
        }
    }
    checkCollision() {
        let distance = Vector2.distance(this.vectorPosition, this.player.vectorPosition);
        if (distance < this.player.collisionRadius) {
            this.onHit();
        }
    }
}
var PickupType;
(function (PickupType) {
    PickupType[PickupType["REPAIR"] = 0] = "REPAIR";
    PickupType[PickupType["UPGRADEMISSILE"] = 1] = "UPGRADEMISSILE";
    PickupType[PickupType["UPGRADEPLASMA"] = 2] = "UPGRADEPLASMA";
})(PickupType || (PickupType = {}));
class Missile extends Projectile {
    constructor(_tex, _toPool, _hitAnim) {
        super(_tex, _toPool, _hitAnim);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 5;
        this.animations.add("missile");
    }
}
class PlasmaBullet extends Projectile {
    constructor(_tex, _toPool, _hitAnim) {
        super(_tex, _toPool, _hitAnim);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 1;
    }
}
class Projectile extends Phaser.Sprite {
    constructor(_tex, _toPool, _hitAnim) {
        super(game, -100, -100);
        this.vectorPosition = new Vector2(-100, -100);
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
        this.anchor.set(0.5);
        this.targets = new Array();
        if (_hitAnim != null) {
            this.hitAnimation = new Phaser.Sprite(game, -100, -100, _hitAnim);
            this.hitAnimation.animations.add("onHit");
            this.hitAnimation.anchor.set(0.5);
            game.add.existing(this.hitAnimation);
        }
    }
    update() {
        if (this.active) {
            this.vectorPosition.add(this.velocity);
            this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.checkCollision();
            this.checkBounds();
        }
    }
    // Fires a bullet from a given position and angle
    fire(_pos, _rotation) {
        this.angle = _rotation;
        let angleVelocity = game.physics.arcade.velocityFromAngle(this.angle - 90, this.speed);
        this.velocity = new Vector2(angleVelocity.x, angleVelocity.y);
        this.vectorPosition = _pos;
        this.active = true;
        if (this.animations != null) {
            this.animations.play(this.key);
        }
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
                if (distance <= this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    }
    // Check if the position of this projectile is out of the bounds of the level
    checkBounds() {
        if (this.vectorPosition.Y <= -20 || this.vectorPosition.Y >= game.height + 20 || this.vectorPosition.X >= game.width + 20 || this.vectorPosition.X <= -20) {
            this.returnToPool(this);
        }
    }
    // On hitting a target the projectile will return to the pool and apply damage on the target
    onHit(_target) {
        if (this.hitAnimation != null) {
            this.hitAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.hitAnimation.angle = Math.floor(Math.random() * (359) + 1);
            this.hitAnimation.play("onHit", 24, false);
        }
        _target.onHit(this.damageAmount);
        this.returnToPool(this);
    }
    // Reset the values of this projectile to their default values
    resetValues() {
        this.active = false;
        this.visible = false;
        this.targets = new Array();
        this.vectorPosition = new Vector2(-100, -100);
        this.velocity = new Vector2(0, 0);
        this.animations.stop();
        this.animations.frame = 0;
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
        if (!this.containsProjectileByIndex(projectile.projectileIndex, this.available)) {
            this.available.push(projectile); // Place the projectile back in the array of available projectiles
        }
    }
    // Adds a projectile to the pool ready for use
    addProjectile() {
        let newProjectile;
        // Check which type is defined for this pool and make a new projectile based on that type
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet('plasma_bullet', this.returnProjectile.bind(this), "bullet_hit");
        }
        else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile('missile', this.returnProjectile.bind(this), "missile_hit");
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
    containsProjectileByIndex(index, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].projectileIndex === index) {
                return true;
            }
        }
        return false;
    }
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["FIGHTER"] = 0] = "FIGHTER";
    EnemyType[EnemyType["BOMBER"] = 1] = "BOMBER";
    EnemyType[EnemyType["BOSS"] = 2] = "BOSS";
})(EnemyType || (EnemyType = {}));
class Enemy extends Ship {
    constructor(_type, _maxHP, _speed, _pattern, _collisionRadius, _killEnemy, _id) {
        super(_collisionRadius, _maxHP);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.enemyType = _type;
        this.killEnemy = _killEnemy;
        this.movementPattern = _pattern;
        this.vectorPosition.X = this.movementPattern[0].X;
        this.vectorPosition.Y = this.movementPattern[0].Y;
        this.currentMove = 1;
        this.speed = _speed;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "combo02");
        this.anchor.set(0.5);
        this.active = false;
        this.dead = true;
    }
    update() {
        if (this.active) {
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
        else if (this.dead) {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this);
            }
        }
    }
    spawn() {
        switch (this.enemyType) {
            case EnemyType.FIGHTER:
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOMBER:
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOSS:
                this.loadTexture("ship_enemy");
                break;
        }
        game.add.existing(this);
        this.active = true;
    }
    die() {
        this.dead = true;
        super.die();
        this.killEnemy(this);
    }
    toggleComboTarget() {
        this.addChild(this.comboSprite);
    }
}
class EnemyManager {
    constructor(_projectilePools) {
        this.patterns = new MovementPatterns();
        this.enemies = new Array();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0;
        this.timer = 0;
        this.currentWave = 0;
        this.nextUnit = 0;
        this.setWaves();
        this.spawning = true;
    }
    setWaves() {
        this.waves = [];
        this.waves[0] = [];
        let e1 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern01);
        let e2 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern02);
        let u1 = new EnemyUnit(100, [e1, e2]);
        this.waves[0][0] = u1;
        /*let e3 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern01);
        let e4 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern02);
        let u2 = new EnemyUnit(500, [e3, e4]);
        this.waves[0][1] = u2;
        let e5 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern01);
        let e6 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern02);
        let u3 = new EnemyUnit(1000, [e3, e4]);
        this.waves[1] = [];
        this.waves[1][0] = u3;*/
    }
    createEnemy(_type, _healthMod, _speedMod, _pattern) {
        let newEnemy = new Enemy(_type, _healthMod, _speedMod, _pattern, 40, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        this.enemies.push(newEnemy);
        return newEnemy;
    }
    update() {
        if (this.spawning) {
            this.timer += game.time.elapsedMS;
            if (this.timer <= this.waves[this.currentWave][this.nextUnit].time) {
                console.log("spawning" + this.currentWave + ":" + this.nextUnit);
                this.waves[this.currentWave][this.nextUnit].spawn();
                this.nextUnit++;
                if (this.nextUnit == this.waves[this.currentWave].length) {
                    this.currentWave++;
                    this.timer = 0;
                    this.nextUnit = 0;
                    if (this.currentWave == this.waves.length) {
                        this.spawning = false;
                    }
                }
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
class EnemyUnit {
    constructor(_time, _enemies) {
        this.time = _time;
        this.enemies = _enemies;
    }
    spawn() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].spawn();
        }
    }
}
class MovementPatterns {
    constructor() {
        this.pattern01 = new Array();
        let point0 = new Vector2(200, 200);
        this.pattern01.push(point0);
        let point1 = new Vector2(1000, 1000);
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
class NewWeapon {
    constructor(_position, _shipPosition, _cooldown, _angle, _projectilePool, _targets, _behaviour) {
        this.relativePosition = _position;
        this.shipPosition = _shipPosition;
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.fireAngle = _angle;
        this.projectilePool = _projectilePool;
        this.targets = _targets;
        this.behaviour = _behaviour;
        this.timer = _cooldown;
    }
    update() {
        this.timer -= game.time.elapsedMS;
        this.vectorPosition = Vector2.copy(this.shipPosition).add(this.relativePosition);
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
        if (this.behaviour != null) {
            this.behaviour();
        }
    }
    // Set the angle the projectiles will fire towards
    setAngle(_angle) {
        this.fireAngle = _angle;
    }
    setPosition(_relativePosition) {
        this.relativePosition = _relativePosition;
    }
}
class HealthIndicator extends Phaser.Sprite {
    constructor(_player) {
        super(game, 0, 0, "ui_overlay");
        this.player = _player;
        this.bars = 8;
        this.barSections = new Array();
        this.setSprites();
        game.add.existing(this);
        this.onHealthChange();
    }
    setSprites() {
        var angle = -0.95;
        var step = (Math.PI) / 7.15;
        for (var i = 0; i < this.bars; i++) {
            var x = 434 + (57.5 * Math.cos(angle));
            var y = 804 + (57.5 * Math.sin(angle));
            var bar = new Phaser.Sprite(game, x, y, "health_bar");
            bar.rotation = angle;
            bar.anchor.set(0.5);
            game.add.existing(bar);
            this.barSections.push(bar);
            angle += step;
        }
    }
    // Executed on a change in the players HP
    onHealthChange() {
        // Calculate the number of health blocks that will be set invisible;
        let sum = Math.ceil((this.player.currentHP / this.player.maxHP) * 8);
        let arrayBars = this.bars - 1;
        for (var i = 0; i < this.bars; i++) {
            if (i < sum) {
                this.barSections[arrayBars - i].visible = true;
            }
            else {
                this.barSections[arrayBars - i].visible = false;
            }
        }
    }
}
class Player extends Ship {
    constructor(_charNumber, _projectilePools, _maxHP, _collisionRadius) {
        super(_collisionRadius, _maxHP);
        this.comboMode = false;
        this.slowMo = true;
        this.projectilePools = _projectilePools;
        this.loadTexture("ships_player", _charNumber);
        this.speed = 10;
        this.anchor.set(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        this.targetEnemies = new Array();
        this.targetIDs = new Array();
        this.vectorPosition.X = 200;
        this.vectorPosition.Y = 500;
        this.exhaustAnimation = new Phaser.Sprite(game, this.vectorPosition.X, this.vectorPosition.Y, "player_exhaust");
        this.exhaustAnimation.anchor.set(0.5, -0.6);
        this.exhaustAnimation.animations.add("exhaust");
        game.add.existing(this.exhaustAnimation);
        this.exhaustAnimation.play("exhaust", 24, true);
        this.playerUpgrades = new PlayerUpgrades(this);
    }
    handlePickup(_pickupType) {
        if (_pickupType == PickupType.REPAIR) {
            if (this.maxHP <= 60) {
                this.currentHP += 20;
            }
            else {
                this.currentHP = this.maxHP;
            }
        }
        else if (_pickupType == PickupType.UPGRADEPLASMA) {
        }
    }
    checkCollision() {
        if (this.enemies != null) {
            for (let i = 0; i < this.enemies.length; i++) {
                let distance = Vector2.distance(new Vector2(game.input.mousePointer.position.x, game.input.mousePointer.position.y), this.enemies[i].vectorPosition);
                if (distance < this.enemies[i].collisionRadius) {
                    return this.enemies[i];
                }
            }
        }
    }
    update() {
        // If mouse goes down on top of an enemy
        if (this.checkCollision() != null && game.input.mousePointer.isDown) {
            // Check if there's already targets
            if (this.targetEnemies.length != 0) {
                let noDuplicate = true;
                // Loop through all target enemies and check if duplicate.
                for (var i = 0; i < this.targetEnemies.length; i++) {
                    if (this.checkCollision().id == this.targetEnemies[i].id) {
                        noDuplicate = false;
                    }
                }
                // If there's no duplicate add it to the target array. 
                if (noDuplicate == true) {
                    this.targetEnemies.push(this.checkCollision());
                    this.checkCollision().toggleComboTarget();
                }
            }
            else {
                // If it's the first target skip checking duplicates. 
                this.targetEnemies.push(this.checkCollision());
                this.checkCollision().toggleComboTarget();
                this.comboMode = true;
            }
        }
        if (game.input.mousePointer.isDown && this.comboMode == false) {
            this.reverseSlowmo();
        }
        else if (game.input.mousePointer.isDown == false) {
            this.smoothSlowmo();
        }
        // When button is released.
        if (this.comboMode == true && game.input.mousePointer.isDown == false) {
            this.comboMode = false;
            // Check if more than one enemy is selected. 
            if (this.targetEnemies.length > 1) {
                // Loop through the enemies and kill them
                for (var i = 0; i <= this.targetEnemies.length; i++) {
                    if (this.targetEnemies[i] != null) {
                        this.targetEnemies[i].onHit(666);
                        if (this.targetEnemies[i - 1] != null) {
                            this.graphics = game.add.graphics(this.targetEnemies[i - 1].vectorPosition.X, this.targetEnemies[i - 1].vectorPosition.Y);
                            this.graphics.lineStyle(15, 0xff0000, 0.6);
                            this.graphics.lineTo(this.targetEnemies[i].vectorPosition.X - this.targetEnemies[i - 1].vectorPosition.X, this.targetEnemies[i].vectorPosition.Y - this.targetEnemies[i - 1].vectorPosition.Y);
                            game.add.tween(this.graphics).to({ alpha: 0 }, 350, Phaser.Easing.Linear.None, true);
                        }
                    }
                }
            }
            // Empty the target array.
            for (var i = 0; i <= this.targetEnemies.length; i++) {
                this.targetEnemies.splice(i);
            }
        }
        // When a mouse pointer or touch pointer is down on the screen, get get the position and calculate a move direction
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown && this.comboMode == false) {
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        this.exhaustAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        super.update();
    }
    // Set targets that the player's weapon can hit
    setTargets(_targets) {
        this.enemies = _targets;
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeThree();
        this.missileWeapons = this.playerUpgrades.missileUpgradeThree();
    }
    smoothSlowmo() {
        if (game.time.desiredFps > 40) {
            game.time.desiredFps -= 1;
            game.time.events.add(30, this.smoothSlowmo, this);
        }
    }
    reverseSlowmo() {
        if (this.game.time.desiredFps < 60) {
            game.time.desiredFps += 1;
            game.time.events.add(200, this.reverseSlowmo, this);
        }
    }
}
class PlayerUpgrades {
    constructor(_player) {
        this.angle = -30;
        this.step = 1;
        this.player = _player;
        this.currentWeaponSet = new Array();
    }
    plasmaUpgradeZero() {
        let newWeaponSet = new Array(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    plasmaUpgradeOne() {
        let newWeaponSet = new Array(2);
        newWeaponSet[0] = new NewWeapon(new Vector2(-12, 0), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[1] = new NewWeapon(new Vector2(12, 0), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    plasmaUpgradeTwo() {
        let newWeaponSet = new Array(3);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.3, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[1] = new NewWeapon(new Vector2(-1, 0), this.player.vectorPosition, 0.4, -25, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[2] = new NewWeapon(new Vector2(1, 0), this.player.vectorPosition, 0.4, 25, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    plasmaUpgradeThree() {
        let newWeaponSet = new Array(4);
        newWeaponSet[0] = new NewWeapon(new Vector2(-12, 0), this.player.vectorPosition, 0.3, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[1] = new NewWeapon(new Vector2(12, 0), this.player.vectorPosition, 0.3, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[2] = new NewWeapon(new Vector2(-1, 0), this.player.vectorPosition, 0.4, -25, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[3] = new NewWeapon(new Vector2(1, 0), this.player.vectorPosition, 0.4, 25, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    missileUpgradeOne() {
        let newWeaponSet = new Array(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[1], this.player.enemies);
        return newWeaponSet;
    }
    missileUpgradeTwo() {
        let newWeaponSet = new Array(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(-10, 0), this.player.vectorPosition, 0.35, 0, this.player.projectilePools[1], this.player.enemies);
        newWeaponSet[0] = new NewWeapon(new Vector2(10, 0), this.player.vectorPosition, 0.35, 0, this.player.projectilePools[1], this.player.enemies);
        return newWeaponSet;
    }
    missileUpgradeThree() {
        let newWeaponSet = new Array(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.2, -30, this.player.projectilePools[1], this.player.enemies, function () {
            this.missileUpgradeThreeBehaviour(newWeaponSet[0]);
        }.bind(this));
        return newWeaponSet;
    }
    missileUpgradeThreeBehaviour(_missileWeapon) {
        if (this.angle >= 30) {
            this.step = -1;
        }
        else if (this.angle <= -30) {
            this.step = 1;
        }
        this.angle += this.step;
        _missileWeapon.setAngle(this.angle);
    }
}
class Ship extends Phaser.Sprite {
    constructor(_collisionRadius, _maxHP) {
        super(game, 0, 0);
        this.game = game;
        this.collisionRadius = _collisionRadius;
        this.plasmaWeapons = new Array();
        this.missileWeapons = new Array();
        this.vectorPosition = new Vector2();
        this.maxHP = _maxHP;
        this.currentHP = this.maxHP;
        this.explosion = new Phaser.Sprite(game, 0, 0, "explosion", 24);
        this.explosion.animations.add("explode", Phaser.ArrayUtils.numberArray(0, 23), 24, false);
        this.explosion.anchor.set(0.5);
        this.active = true;
    }
    onHit(_amount) {
        this.currentHP -= _amount;
        if (this.currentHP <= 0 && this.active) {
            this.die();
        }
    }
    // Add a weapon for this ship with cooldown 
    /*public addWeapon(_weaponCooldown: number, _projectiles: ProjectilePool, _targets: Array<Ship>, _relativePosition: Vector2 = null) {
        let fixedPosition: boolean = true;
        _relativePosition = new Vector2();
        if (_relativePosition == null) {
            _relativePosition = new Vector2();
            if (this.weaponSlot % 2 == 0) {
                _relativePosition.X = this.weaponOffset * -(this.weaponSlot - 1);
            }
            else {
                _relativePosition.X = this.weaponOffset * this.weaponSlot;
            }
            fixedPosition = false;
            this.weaponSlot++;
        }
        let weapon = new Weapon(_weaponCooldown, _projectiles, _targets, this.vectorPosition, _relativePosition, this.weaponsMade, this.removeWeapon, fixedPosition);
        this.weaponsMade++;
        weapon.setAngle(this.fireAngle);
        this.weapons.push(weapon);
    }*/
    /*public removeWeapon(_weapon: Weapon) {
        let id = this.weapons.indexOf(_weapon, _weapon.id);
        this.weapons.splice(id, 1);
        _weapon = null;
        this.resetWeaponPos();
    }*/
    /*private resetWeaponPos() {
         this.weaponSlot = 1;
         for (let i = 0; i < this.weapons.length; i++) {
             if (this.weapons[i].fixedPosition = false) {
                 let relativePosition = new Vector2();
                 if (this.weaponSlot % 2 == 0) {
                     relativePosition.X = this.weaponOffset * -(this.weaponSlot - 1);
                 }
                 else {
                     relativePosition.X = this.weaponOffset * this.weaponSlot;
                 }
                 this.weaponSlot++;
                 this.weapons[i].setPosition(relativePosition);
             }
         }
     }*/
    update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        for (let i = 0; i < this.plasmaWeapons.length; i++) {
            this.plasmaWeapons[i].update();
        }
        for (let i = 0; i < this.missileWeapons.length; i++) {
            this.missileWeapons[i].update();
        }
    }
    die() {
        this.active = false;
        this.explosion.position.set(this.vectorPosition.X, this.vectorPosition.Y);
        this.explosion.angle = Math.floor(Math.random() * (359) + 1);
        this.game.add.existing(this.explosion);
        this.explosion.animations.play("explode");
    }
}
class Weapon {
    constructor(_cooldown, _projectilePool, _targets, _ShipPosition, _relativePosition, _id, _removeWeapon, _fixedPosition = false) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.ShipPosition = _ShipPosition;
        this.relativePosition = _relativePosition;
        this.targets = _targets;
        this.id = _id;
        this.removeWeapon = _removeWeapon;
        this.fixedPosition = _fixedPosition;
    }
    setPosition(_relativePosition) {
        this.relativePosition = _relativePosition;
    }
    update() {
        this.fireTimer -= game.time.elapsedMS;
        this.vectorPosition = Vector2.copy(this.ShipPosition).add(this.relativePosition);
        if (this.fireTimer <= 0) {
            this.fireTimer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
    }
    destroyWeapon() {
        this.removeWeapon(this);
    }
    // Set the angle the projectiles will fire from
    setAngle(_angle) {
        this.fireAngle = _angle;
    }
}
class BootState extends Phaser.State {
    create() {
        this.background = new Phaser.Sprite(game, 0, 0, 'startscreen_background');
        this.title = new Phaser.Sprite(game, 0, -400, 'startscreen_title');
        this.insertCoin = new Phaser.Sprite(game, game.width / 2, 460, 'insert_coin_text');
        this.insertCoin.anchor.set(0.5);
        game.add.tween(this.title).to({ y: -60 }, 2400, Phaser.Easing.Bounce.Out, true);
        game.add.tween(this.insertCoin).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        this.game.add.existing(this.background);
        this.game.add.existing(this.title);
        this.game.add.existing(this.insertCoin);
    }
    update() {
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.startMenu();
        }
    }
    startMenu() {
        game.state.start("Menu", true, false);
    }
}
class GameState extends Phaser.State {
    constructor(...args) {
        super(...args);
        this.characterNumber = 0;
    }
    init(_characterNumber) {
        this.characterNumber = _characterNumber;
    }
    create() {
        this.level = new Level();
        this.projectilePools = new Array();
        // Create the various pools for different projectiles
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.projectilePools.push(this.plasmaBulletPool);
        this.projectilePools.push(this.missilePool);
        // Create a player
        this.player = new Player(this.characterNumber, this.projectilePools, 80, 50);
        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);
        this.player.setTargets(this.enemyManager.getEnemies());
        this.healthIndicator = new HealthIndicator(this.player);
        var style = { font: "normal 30px ocra", fill: "#b3ffe2", align: "center" };
        var text = game.add.text(20, 20, "10000", style);
    }
    update() {
        this.level.update();
        this.enemyManager.update();
    }
}
class MenuState extends Phaser.State {
    create() {
        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');
        this.startButton = new Phaser.Button(game, 0, 532, 'menu_button_start', function () { this.startGame(); }, this);
        this.previousButton = new Phaser.Button(game, 18, 542, 'menu_button_arrow', function () { this.changeCharacter(-1); }, this);
        this.nextButton = new Phaser.Button(game, 494, 542, 'menu_button_arrow', function () { this.changeCharacter(1); }, this);
        this.nextButton.scale.set(-1, 1);
        this.portraits = new Array();
        this.playerPortrait1 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_1');
        this.playerPortrait2 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_2');
        this.playerPortrait3 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_3');
        this.playerPortrait4 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_4');
        this.portraits.push(this.playerPortrait1);
        this.portraits.push(this.playerPortrait2);
        this.portraits.push(this.playerPortrait3);
        this.portraits.push(this.playerPortrait4);
        this.currentCharacterNumber = 0;
        this.currentPortrait = new Phaser.Sprite(game, 0, 0, this.portraits[this.currentCharacterNumber].texture);
        this.game.add.existing(this.background);
        this.game.add.existing(this.startButton);
        this.game.add.existing(this.previousButton);
        this.game.add.existing(this.nextButton);
        this.game.add.existing(this.currentPortrait);
    }
    changeCharacter(_changeFactor) {
        this.currentCharacterNumber += _changeFactor;
        if (this.currentCharacterNumber < 0) {
            this.currentCharacterNumber = this.portraits.length - 1;
        }
        else if (this.currentCharacterNumber > this.portraits.length - 1) {
            this.currentCharacterNumber = 0;
        }
        this.currentPortrait.loadTexture(this.portraits[this.currentCharacterNumber].texture);
    }
    startGame() {
        game.state.start("Game", true, false, this.currentCharacterNumber);
    }
}
class Preloader extends Phaser.State {
    // Preload all assets
    preload() {
        // Images menu
        game.load.image("startscreen_background", "assets/Images/Backgrounds/StartScreen/startscreen_background.jpg");
        game.load.image("startscreen_title", "assets/Images/Backgrounds/StartScreen/startscreen_title.png");
        game.load.image("insert_coin_text", "assets/Images/Backgrounds/StartScreen/startscreen_coin_text.png");
        game.load.image("menu_background", "assets/Images/Backgrounds/menu_background.jpg");
        game.load.image("menu_portrait_1", "assets/Images/UI/Portraits/portrait_1.png");
        game.load.image("menu_portrait_2", "assets/Images/UI/Portraits/portrait_2.png");
        game.load.image("menu_portrait_3", "assets/Images/UI/Portraits/portrait_3.png");
        game.load.image("menu_portrait_4", "assets/Images/UI/Portraits/portrait_4.png");
        game.load.image("menu_button_start", "assets/Images/UI/Buttons/button_start.png");
        game.load.image("menu_button_arrow", "assets/Images/UI/Buttons/button_arrow.png");
        // Images game
        game.load.image("plasma_bullet", "assets/Images/Projectiles/bullet_player.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");
        game.load.image("ui_overlay", "assets/Images/UI/ui_overlay.png");
        game.load.image("health_bar", "assets/Images/UI/Indicators/health_bar.png");
        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background.jpg", 512, 2048, 4);
        game.load.spritesheet("ships_player", "assets/SpriteSheets/player_ship_sheet.png", 128, 128, 4);
        game.load.spritesheet("missile", "assets/SpriteSheets/Animations/projectile_missile.png", 64, 64, 22);
        game.load.spritesheet("player_exhaust", "assets/SpriteSheets/Animations/player_exhaust.png", 32, 64, 5);
        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/Explosions/death_explosion.png", 256, 256, 24);
        game.load.spritesheet("missile_hit", "assets/SpriteSheets/Animations/Explosions/hit_missile_explosion.png", 128, 128, 13);
        game.load.spritesheet("bullet_hit", "assets/SpriteSheets/Animations/hit_bullet_blue.png", 64, 64, 5);
        game.load.spritesheet("combo02", "assets/SpriteSheets/Animations/combo02.png", 256, 192, 12);
        // Audio
    }
    // After the preload function is done, the create function is called which starts the GameState
    create() {
        game.state.start("Game");
    }
}
class AnimationHandler {
    static addAnimation(_anim) {
        this.animations.push(_anim);
    }
    static getAnimation() {
        return this.animations[0];
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
    mutliplyByNumber(magnitude) {
        this.x *= magnitude;
        this.y *= magnitude;
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
//# sourceMappingURL=app.js.map