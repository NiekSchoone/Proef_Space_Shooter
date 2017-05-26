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
        game.state.add("Start", StartState);
        game.state.add("Tutorial", TuorialState);
        game.state.add("Menu", MenuState);
        game.state.add("Game", GameState);
        game.state.add("GameOver", GameOver);
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
    constructor(_player, _position, _type) {
        super(game, _position.X, _position.Y);
        this.player = _player;
        this.vectorPosition = _position;
        this.velocity = new Vector2(0, 1);
        this.speed = 0;
        this.pickupType = _type;
        this.anchor.set(0.5);
        switch (_type) {
            case PickupType.REPAIR:
                this.loadTexture("pickup_repair");
                break;
            case PickupType.UPGRADEPLASMA:
                this.loadTexture("pickup_plasma");
                break;
            case PickupType.UPGRADEMISSILE:
                this.loadTexture("pickup_missile");
                break;
        }
    }
    update() {
        if (this.speed < 5) {
            this.speed += 0.04;
        }
        this.vectorPosition.add(new Vector2(this.velocity.X * this.speed, this.velocity.Y * this.speed));
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
    constructor(_toPool, _tex, _hitAnim) {
        super(_toPool, _tex, _hitAnim, false);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 10;
        this.animations.add("missile");
    }
}
class PlasmaBullet extends Projectile {
    constructor(_toPool, _tex, _hitAnim) {
        super(_toPool, _tex, _hitAnim, true);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 4;
    }
}
class Projectile extends Phaser.Sprite {
    constructor(_toPool, _tex, _hitAnim, _randomHitRotation) {
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
            this.randomHitRotation = _randomHitRotation;
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
            if (this.randomHitRotation) {
                this.hitAnimation.angle = Math.floor(Math.random() * (359) + 1);
            }
            else {
                this.hitAnimation.angle = this.angle;
            }
            this.hitAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.hitAnimation.play("onHit", 24, false);
        }
        _target.onHit(this.damageAmount);
        this.returnToPool(this);
    }
    // Reset the values of this projectile to their default values
    resetValues() {
        this.active = false;
        this.visible = false;
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
    constructor(_type, _group, _tex, _hitTex) {
        this.poolType = _type;
        this.available = new Array();
        this.inUse = new Array();
        this.projectileCount = 0;
        this.spriteGroup = _group;
        if (this.poolType == ProjectileType.PLASMABULLET) {
            if (_tex != null && _hitTex != null) {
                this.plasmaTexture = _tex;
                this.plasmaHitTexture = _hitTex;
            }
            else {
                throw "No texture specified for plasma bullets.";
            }
        }
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
        ArrayMethods.removeObject(this.inUse, projectile); // Remove the projectile from the "inUse" array.
        if (!ArrayMethods.containsObject(this.available, projectile)) {
            this.available.push(projectile); // Place the projectile back in the array of available projectiles
        }
    }
    // Adds a projectile to the pool ready for use
    addProjectile() {
        let newProjectile;
        // Check which type is defined for this pool and make a new projectile based on that type
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet(this.returnProjectile.bind(this), this.plasmaTexture, this.plasmaHitTexture);
        }
        else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile(this.returnProjectile.bind(this), 'missile', "missile_hit");
        }
        else {
            throw "Incorrect type specified for object pool";
        }
        if (newProjectile != null) {
            game.add.existing(newProjectile); // Add the projectile to the game
            this.spriteGroup.add(newProjectile);
            this.projectileCount++;
            return newProjectile;
        }
    }
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["FIGHTER"] = 0] = "FIGHTER";
    EnemyType[EnemyType["BOMBER"] = 1] = "BOMBER";
    EnemyType[EnemyType["SCOUT"] = 2] = "SCOUT";
})(EnemyType || (EnemyType = {}));
class Enemy extends Ship {
    constructor(_type, _color, _maxHP, _speed, _start, _collisionRadius, _killEnemy, _movementPattern) {
        super(_collisionRadius, _maxHP);
        this.killEnemy = _killEnemy;
        this.active = true;
        this.speed = _speed;
        this.moveDir = new Vector2(0, 1);
        this.vectorPosition.X = _start.X;
        this.vectorPosition.Y = _start.Y;
        this.currentMove = 0;
        if (_movementPattern == null) {
            this.movementPattern = [new EnemyPosition(new Vector2(this.vectorPosition.X, 1000), 0)];
        }
        else {
            this.movementPattern = _movementPattern;
        }
        this.angle = this.movementPattern[this.currentMove].rotation;
        this.inBounds = false;
        this.hasPickup = false;
        this.score = 10;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");
        this.indicator = new Phaser.Sprite(game, 0, 0, "target_indicator");
        this.comboSprite.anchor.setTo(0.5);
        this.indicator.anchor.setTo(0.5);
        this.indicator.scale.setTo(1.5);
        this.indicator.angle = 45;
        this.anim = this.comboSprite.animations.add("indicator", Phaser.ArrayUtils.numberArray(0, 19), 24, false);
        this.anim.setFrame(19);
        this.anchor.set(0.5);
        this.addChild(this.indicator);
        this.color = _color;
        this.enemyType = _type;
        switch (this.color) {
            case 0:
                this.loadTexture("ships_enemy_orange", this.enemyType);
                break;
            case 1:
                this.loadTexture("ships_enemy_blue", this.enemyType);
                break;
            case 2:
                this.loadTexture("ships_enemy_pink", this.enemyType);
                break;
        }
        game.add.existing(this);
    }
    setWeapons(_weapons) {
        this.weapons = _weapons;
    }
    update() {
        if (this.active) {
            this.moveDir.X = (this.movementPattern[this.currentMove].point.X - this.vectorPosition.X) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].point.Y - this.vectorPosition.Y) / 100;
            this.moveDir.normalize();
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
            if (Vector2.distance(this.vectorPosition, this.movementPattern[this.currentMove].point) < 1.5) {
                this.currentMove++;
                if (this.currentMove >= this.movementPattern.length) {
                    this.killEnemy(this, 0);
                }
                else {
                    this.angle = this.movementPattern[this.currentMove].rotation;
                }
            }
            if (this.inBounds) {
                if (this.weapons != null) {
                    for (let i = 0; i < this.weapons.length; i++) {
                        this.weapons[i].update();
                    }
                }
            }
            else if (this.checkBounds()) {
                this.inBounds = true;
            }
            super.update();
        }
        else {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this, this.score);
            }
        }
    }
    checkBounds() {
        return (this.vectorPosition.Y > -64 && this.vectorPosition.Y < 1000 && this.vectorPosition.X > -64 && this.vectorPosition.X < 576);
    }
    toggleComboTarget(activate) {
        if (activate == true && this.anim.isFinished == false) {
            this.anim.play();
            this.addChild(this.comboSprite);
        }
        else {
            this.removeChild(this.comboSprite);
        }
    }
    indicateTarget() {
        this.indicator.alpha = 1;
        game.add.tween(this.indicator).to({ alpha: 0 }, 350, "Linear", true, 0, 0);
    }
}
class EnemyManager {
    constructor(_projectilePools, _group) {
        this.movenments = new EnemyMovements();
        this.enemies = new Array();
        this.projectilePools = _projectilePools;
        this.timer = 1000;
        this.activeLevel = false;
        this.spawning = true;
        this.waves = new Array();
        this.wave = 0;
        this.level = 0;
        this.spriteGroup = _group;
        this.waves.push(game.add.tilemap("wave01"));
        this.waves.push(game.add.tilemap("wave02"));
        this.waves.push(game.add.tilemap("wave03"));
        this.waves.push(game.add.tilemap("wave04"));
        this.waves.push(game.add.tilemap("wave05"));
        this.waves.push(game.add.tilemap("wave06"));
        this.waves.push(game.add.tilemap("wave07"));
    }
    update() {
        if (this.activeLevel == false) {
            this.timer -= game.time.physicsElapsedMS;
            if (this.timer <= 0) {
                this.activeLevel = true;
            }
        }
        else {
            let enemiesInScreen = true;
            for (let e = 0; e < this.enemies.length; e++) {
                enemiesInScreen = (enemiesInScreen == true && this.enemies[e].inBounds == true);
            }
            if (enemiesInScreen == true || this.enemies.length == 0) {
                this.timer -= game.time.physicsElapsedMS;
                if (this.timer <= 0) {
                    this.wave++;
                    this.timer = 1500;
                    this.spawnWave();
                    if (this.wave == 5) {
                        this.wave = 0;
                        this.timer = 7000;
                        this.activeLevel = false;
                        this.level++;
                    }
                }
            }
        }
    }
    spawnWave() {
        let waveToSpawn = Math.floor(Math.random() * 6);
        let enemytoPickup = Math.floor(Math.random() * this.waves[waveToSpawn].objects["Ships"].length);
        ;
        for (let i = 0; i < this.waves[waveToSpawn].objects["Ships"].length; i++) {
            let newEnemy;
            let movement = null;
            let moveIndex = this.waves[waveToSpawn].objects["Ships"][i].properties.movement;
            if (moveIndex != 0) {
                movement = this.movenments.returnMovement(moveIndex);
            }
            switch (this.waves[waveToSpawn].objects["Ships"][i].type) {
                case "fighter":
                    newEnemy = new Enemy(EnemyType.FIGHTER, this.waves[waveToSpawn].objects["Ships"][i].properties.color, 30 + (2 * this.level), 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y + 910), 50, this.killEnemy.bind(this), movement);
                    newEnemy.setDeathSound("enemy_death_big");
                    break;
                case "bomber":
                    newEnemy = new Enemy(EnemyType.BOMBER, this.waves[waveToSpawn].objects["Ships"][i].properties.color, 40 + (2 * this.level), 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y + 910), 50, this.killEnemy.bind(this), movement);
                    newEnemy.setDeathSound("enemy_death_big");
                    break;
                case "scout":
                    newEnemy = new Enemy(EnemyType.SCOUT, this.waves[waveToSpawn].objects["Ships"][i].properties.color, 6 + (1.5 * this.level), 2.5, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y + 910), 20, this.killEnemy.bind(this), movement);
                    newEnemy.setDeathSound("enemy_death_small");
                    break;
            }
            if (i == enemytoPickup) {
                let droprate = Math.random();
                if (droprate <= 0.5) {
                    newEnemy.hasPickup = true;
                }
            }
            newEnemy.setWeapons(this.weapons.returnWeapons(this.waves[waveToSpawn].objects["Ships"][i].properties.weapons, newEnemy.vectorPosition));
            this.enemies.push(newEnemy);
            this.spriteGroup.add(newEnemy);
        }
    }
    setPlayer(_player) {
        this.player = _player;
        this.weapons = new EnemyWeapons(this.projectilePools, this.player);
    }
    killEnemy(_enemy, score) {
        this.scoreCounter.onScoreChange(score);
        if (_enemy.hasPickup == true) {
            let pickup = new Pickup(this.player, _enemy.vectorPosition, Math.floor(Math.random() * 3));
            game.add.existing(pickup);
        }
        ArrayMethods.removeObject(this.enemies, _enemy);
        _enemy.destroy();
    }
    getEnemies() {
        return this.enemies;
    }
}
class EnemyPosition {
    constructor(_point, _rotiation) {
        this.point = _point;
        this.rotation = _rotiation;
    }
}
class EnemyMovements {
    returnMovement(_index) {
        switch (_index) {
            case 1:
                return this.setOne();
            case 2:
                return this.setTwo();
            case 3:
                return this.setThree();
            case 4:
                return this.setFour();
            case 5:
                return this.setFive();
            case 6:
                return this.setSix();
            case 7:
                return this.setSeven();
            case 8:
                return this.setEight();
            case 9:
                return this.setNine();
            case 10:
                return this.setTen();
        }
    }
    setOne() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(382, 10), 0);
        movement[1] = new EnemyPosition(new Vector2(64, 454), 0);
        movement[2] = new EnemyPosition(new Vector2(448, 682), 0);
        movement[3] = new EnemyPosition(new Vector2(-52, 1000), 0);
        return movement;
    }
    setTwo() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(128, 10), 0);
        movement[1] = new EnemyPosition(new Vector2(448, 454), 0);
        movement[2] = new EnemyPosition(new Vector2(64, 682), 0);
        movement[3] = new EnemyPosition(new Vector2(500, 1000), 0);
        return movement;
    }
    setThree() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(448, 10), 0);
        movement[1] = new EnemyPosition(new Vector2(64, 303), 0);
        movement[2] = new EnemyPosition(new Vector2(448, 606), 0);
        movement[3] = new EnemyPosition(new Vector2(0, 1000), 0);
        return movement;
    }
    setFour() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(-68, 626), 270);
        movement[1] = new EnemyPosition(new Vector2(572, 626), 270);
        return movement;
    }
    setFive() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(572, 160), 90);
        movement[1] = new EnemyPosition(new Vector2(-68, 160), 90);
        return movement;
    }
    setSix() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(192, 0), 0);
        movement[1] = new EnemyPosition(new Vector2(192, 450), 0);
        movement[2] = new EnemyPosition(new Vector2(64, 160), 0);
        movement[3] = new EnemyPosition(new Vector2(64, 1000), 0);
        return movement;
    }
    setSeven() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(320, 0), 0);
        movement[1] = new EnemyPosition(new Vector2(320, 450), 0);
        movement[2] = new EnemyPosition(new Vector2(448, 160), 0);
        movement[3] = new EnemyPosition(new Vector2(448, 1000), 0);
        return movement;
    }
    setEight() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(-68, 160), 270);
        movement[1] = new EnemyPosition(new Vector2(572, 160), 270);
        return movement;
    }
    setNine() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(64, -64), 0);
        movement[1] = new EnemyPosition(new Vector2(448, 1000), 0);
        return movement;
    }
    setTen() {
        let movement = new Array();
        movement[0] = new EnemyPosition(new Vector2(448, -64), 0);
        movement[1] = new EnemyPosition(new Vector2(64, 1000), 0);
        return movement;
    }
}
class EnemyWeapons {
    constructor(_projectiles, _player) {
        this.projectilePools = _projectiles;
        this.player = _player;
    }
    returnWeapons(_index, _shipPos) {
        switch (_index) {
            case 0:
                return this.setZero(_shipPos);
            case 1:
                return this.setOne(_shipPos);
            case 2:
                return this.setTwo(_shipPos);
            case 3:
                return this.setThree(_shipPos);
            case 4:
                return this.setFour(_shipPos);
        }
    }
    setZero(_shipPos) {
        let weaponset = new Array();
        weaponset[0] = new Weapon(new Vector2(), _shipPos, 1.5, 180, this.projectilePools[0], [this.player]);
        return weaponset;
    }
    setOne(_shipPos) {
        let weaponset = new Array();
        weaponset[0] = new Weapon(new Vector2(), _shipPos, 2.5, 180, this.projectilePools[1], [this.player]);
        return weaponset;
    }
    setTwo(_shipPos) {
        let weaponset = new Array();
        weaponset[0] = new Weapon(new Vector2(-10, 0), _shipPos, 1, 180, this.projectilePools[0], [this.player]);
        weaponset[1] = new Weapon(new Vector2(10, 0), _shipPos, 1, 180, this.projectilePools[0], [this.player]);
        return weaponset;
    }
    setThree(_shipPos) {
        let weaponset = new Array();
        weaponset[0] = new Weapon(new Vector2(-20, 0), _shipPos, .7, 290, this.projectilePools[0], [this.player], function () { this.spinBehaviour(weaponset[0]); }.bind(this));
        weaponset[1] = new Weapon(new Vector2(-20, 0), _shipPos, .7, 270, this.projectilePools[0], [this.player], function () { this.spinBehaviour(weaponset[1]); }.bind(this));
        weaponset[2] = new Weapon(new Vector2(-20, 0), _shipPos, .7, 250, this.projectilePools[0], [this.player], function () { this.spinBehaviour(weaponset[2]); }.bind(this));
        return weaponset;
    }
    setFour(_shipPos) {
        let weaponset = new Array();
        weaponset[0] = new Weapon(new Vector2(-5, 0), _shipPos, 1.5, 160, this.projectilePools[0], [this.player]);
        weaponset[1] = new Weapon(new Vector2(0, 0), _shipPos, 1.5, 180, this.projectilePools[0], [this.player]);
        weaponset[2] = new Weapon(new Vector2(5, 0), _shipPos, 1.5, 200, this.projectilePools[0], [this.player]);
        return weaponset;
    }
    spinBehaviour(_Weapon) {
        let angle = _Weapon.getAngle();
        angle += 1;
        _Weapon.setAngle(angle);
    }
}
class ComboController {
    constructor(_targets) {
        this.targets = _targets;
    }
    initComboMode() {
    }
    indicateTargets() {
    }
    // Check's if the pointer is colliding with a target.
    checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(new Vector2(game.input.mousePointer.position.x, game.input.mousePointer.position.y), this.targets[i].vectorPosition);
                if (distance < this.targets[i].collisionRadius + 25) {
                    return this.targets[i];
                }
            }
        }
    }
    update() {
    }
}
class Player extends Ship {
    constructor(_charNumber, _projectilePools, _maxHP, _collisionRadius, _targets, _group) {
        super(_collisionRadius, _maxHP);
        this.comboMode = false;
        this.moving = false;
        this.slowMo = false;
        game.physics.arcade.enable(this);
        this.projectilePools = _projectilePools;
        this.loadTexture("ships_player", _charNumber);
        this.setDeathSound("enemy_death_small");
        this.speed = 20;
        this.anchor.set(0.5);
        this.spriteGroup = _group;
        this.plasmaWeapons = new Array();
        this.missileWeapons = new Array();
        this.exhaustAnimation = new Phaser.Sprite(game, this.vectorPosition.X, this.vectorPosition.Y, "player_exhaust");
        this.exhaustAnimation.anchor.set(0.5, -0.8);
        this.exhaustAnimation.animations.add("exhaust");
        this.exhaustAnimation.play("exhaust", 24, true);
        this.onHitSprite = new Phaser.Sprite(game, 0, 0, "player_hit_overlay");
        this.onHitSprite.alpha = 0;
        this.onHitTween = game.add.tween(this.onHitSprite).to({ alpha: 1 }, 400, "Linear", false, 0, 0).to({ alpha: 0 }, 600, "Linear", false, 0, 0);
        this.onHealAnimation = new Phaser.Sprite(game, 0, 0, "player_healing");
        this.onHealAnimation.anchor.set(0.5);
        this.onHealAnimation.animations.add("heal");
        this.onHealAnimation.visible = false;
        this.powerupSound = new Phaser.Sound(game, "pickup_sound", 1, false);
        this.onHitSound = new Phaser.Sound(game, "metal_hit", 1, false);
        game.add.existing(this);
        game.add.existing(this.exhaustAnimation);
        game.add.existing(this.onHitSprite);
        game.add.existing(this.onHealAnimation);
        this.spriteGroup.addMultiple([this, this.exhaustAnimation, this.onHitSprite]);
        this.enemies = _targets;
        this.moveDir = new Vector2();
        this.targetEnemies = new Array();
        this.targetIDs = new Array();
        this.vectorPosition.X = 200;
        this.vectorPosition.Y = 500;
        this.playerUpgrades = new PlayerUpgrades(this);
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeZero();
        this.plasmaUpgradeCount = 0;
        this.missileUpgradeCount = 0;
    }
    onHit(_amount) {
        super.onHit(_amount);
        this.healthIndicator.onHealthChange();
        this.onHitTween.start();
        if (this.currentHP >= 0) {
            this.onHitSound.play();
        }
    }
    handlePickup(_pickupType) {
        if (_pickupType == PickupType.REPAIR) {
            this.onHealAnimation.visible = true;
            this.onHealAnimation.play("heal", 24);
            if (this.currentHP <= (this.maxHP - 20)) {
                this.currentHP += 20;
            }
            else {
                this.currentHP = this.maxHP;
            }
            this.healthIndicator.onHealthChange();
        }
        else if (_pickupType == PickupType.UPGRADEPLASMA) {
            this.plasmaUpgradeCount++;
            if (this.plasmaUpgradeCount <= 3) {
                this.plasmaWeapons = this.playerUpgrades.nextPlasmaUpgrade(this.plasmaUpgradeCount);
            }
        }
        else if (_pickupType == PickupType.UPGRADEMISSILE) {
            this.missileUpgradeCount++;
            if (this.missileUpgradeCount <= 3) {
                this.missileWeapons = this.playerUpgrades.nextMissileUpgrade(this.missileUpgradeCount);
            }
        }
        this.powerupSound.play();
    }
    // Check's if the pointer is colliding with an enemy.
    checkCollision() {
        if (this.enemies != null) {
            for (let i = 0; i < this.enemies.length; i++) {
                let distance = Vector2.distance(new Vector2(game.input.mousePointer.position.x, game.input.mousePointer.position.y), this.enemies[i].vectorPosition);
                if (distance < this.enemies[i].collisionRadius + 25) {
                    return this.enemies[i];
                }
            }
        }
    }
    update() {
        for (let i = 0; i < this.plasmaWeapons.length; i++) {
            this.plasmaWeapons[i].update();
        }
        for (let i = 0; i < this.missileWeapons.length; i++) {
            this.missileWeapons[i].update();
        }
        // If mouse goes down on top of an enemy
        if (this.checkCollision() != null && (game.input.mousePointer.isDown || game.input.pointer1.isDown) && this.moving == false) {
            // Check if there's already targets
            if (this.targetEnemies.length != 0) {
                let noDuplicate = true;
                // Loop through all target enemies and check if duplicate.
                if (ArrayMethods.containsObject(this.targetEnemies, this.checkCollision())) {
                    noDuplicate = false;
                }
                // If there's no duplicate add it to the target array. 
                if (noDuplicate == true) {
                    if (this.checkCollision().color == this.targetColor) {
                        this.targetEnemies.push(this.checkCollision());
                        this.checkCollision().toggleComboTarget(true);
                    }
                }
            }
            else {
                // If it's the first target, skip checking duplicates. 
                this.targetColor = this.checkCollision().color;
                this.targetEnemies.push(this.checkCollision());
                this.checkCollision().toggleComboTarget(true);
                this.comboMode = true;
            }
        }
        this.onHealAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        // When button is released.
        if (this.comboMode == true && (game.input.mousePointer.isDown == false || game.input.pointer1.isDown)) {
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
            else if (this.targetEnemies.length <= 1) {
                if (this.targetEnemies.length != 0) {
                    this.targetEnemies[0].toggleComboTarget(false);
                }
            }
            // Empty the target array.
            for (var i = 0; i <= this.targetEnemies.length; i++) {
                this.targetEnemies.splice(i);
            }
        }
        // Indicate enemies for combo mode.
        if (game.input.mousePointer.isDown == false && this.comboMode == false) {
            this.indicateEnemies();
        }
        // When a mouse pointer or touch pointer is down on the screen, get get the position and calculate a move direction
        if ((game.input.pointer1.isDown || game.input.mousePointer.isDown) && this.comboMode == false) {
            this.moving = true;
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        else if ((game.input.pointer1.isDown == false || game.input.mousePointer.isDown == false) && this.comboMode == false) {
            this.moving = false;
        }
        this.exhaustAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        super.update();
    }
    // Set targets that the player's weapon can hit
    setTargets(_targets) {
        this.enemies = _targets;
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeZero();
    }
    indicateEnemies() {
        if (this.enemies.length != 0) {
            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies[i].indicateTarget();
            }
        }
    }
    die() {
        super.die();
        this.destroy(true);
        this.exhaustAnimation.destroy(true);
        game.camera.onFadeComplete.add(function () {
            game.state.start("GameOver");
        });
        game.camera.fade(0x000000, 1000);
    }
}
class PlayerUpgrades {
    constructor(_player) {
        this.angle = -30;
        this.step = 1;
        this.player = _player;
        this.currentWeaponSet = new Array();
        this.plasmaUpgradeCount = 0;
        this.missileUpgradeCount = 0;
    }
    nextPlasmaUpgrade(_plasmaUpgradeCount) {
        switch (_plasmaUpgradeCount) {
            case 1:
                return this.plasmaUpgradeOne();
            case 2:
                return this.plasmaUpgradeTwo();
            case 3:
                return this.plasmaUpgradeThree();
        }
    }
    nextMissileUpgrade(_missileUpgradeCount) {
        switch (_missileUpgradeCount) {
            case 1:
                return this.missileUpgradeOne();
            case 2:
                return this.missileUpgradeTwo();
            case 3:
                return this.missileUpgradeThree();
        }
    }
    plasmaUpgradeZero() {
        let weaponSet = new Array(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    plasmaUpgradeOne() {
        let weaponSet = new Array(2);
        weaponSet[0] = new Weapon(new Vector2(-12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    plasmaUpgradeTwo() {
        let weaponSet = new Array(3);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.1, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(-1, 0), this.player.vectorPosition, 0.15, -25, this.player.projectilePools[0], this.player.enemies);
        weaponSet[2] = new Weapon(new Vector2(1, 0), this.player.vectorPosition, 0.15, 25, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    plasmaUpgradeThree() {
        let weaponSet = new Array(4);
        weaponSet[0] = new Weapon(new Vector2(-12, 0), this.player.vectorPosition, 0.1, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(12, 0), this.player.vectorPosition, 0.1, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[2] = new Weapon(new Vector2(-1, 0), this.player.vectorPosition, 0.15, -25, this.player.projectilePools[0], this.player.enemies);
        weaponSet[3] = new Weapon(new Vector2(1, 0), this.player.vectorPosition, 0.15, 25, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    missileUpgradeOne() {
        let weaponSet = new Array(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.7, 0, this.player.projectilePools[1], this.player.enemies);
        return weaponSet;
    }
    missileUpgradeTwo() {
        let weaponSet = new Array(2);
        weaponSet[0] = new Weapon(new Vector2(-30, 0), this.player.vectorPosition, 0.7, 0, this.player.projectilePools[1], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(30, 0), this.player.vectorPosition, 0.7, 0, this.player.projectilePools[1], this.player.enemies);
        return weaponSet;
    }
    missileUpgradeThree() {
        let weaponSet = new Array(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.3, -30, this.player.projectilePools[1], this.player.enemies, function () {
            this.missileUpgradeThreeBehaviour(weaponSet[0]);
        }.bind(this));
        return weaponSet;
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
        this.collisionRadius = _collisionRadius;
        this.maxHP = _maxHP;
        this.vectorPosition = new Vector2();
        this.currentHP = this.maxHP;
        this.explosion = new Phaser.Sprite(game, 0, 0, "explosion", 24);
        this.explosion.animations.add("explode", Phaser.ArrayUtils.numberArray(0, 23), 24, false);
        this.explosion.anchor.set(0.5);
        this.hitTween = game.add.tween(this).to({ tint: 0xff0000, alpha: 0.6 }, 90, "Linear", false, 0, 0, true);
        this.active = true;
    }
    onHit(_amount) {
        this.currentHP -= _amount;
        this.hitTween.start();
    }
    update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        if (this.currentHP <= 0) {
            this.die();
        }
    }
    setDeathSound(_sound) {
        this.deathSound = new Phaser.Sound(game, _sound, 1, false);
    }
    die() {
        this.active = false;
        this.explosion.position.set(this.vectorPosition.X, this.vectorPosition.Y);
        this.explosion.angle = Math.floor(Math.random() * (359) + 1);
        game.add.existing(this.explosion);
        this.explosion.animations.play("explode");
        this.deathSound.play();
        ScreenShakeHandler.smallShake();
    }
}
class Weapon {
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
        if (this.cooldown > 0) {
            this.timer -= game.time.physicsElapsedMS;
            if (this.timer <= 0) {
                this.timer = this.cooldown;
                this.fire();
            }
        }
        if (this.behaviour != null) {
            this.behaviour();
        }
    }
    fire() {
        this.vectorPosition = Vector2.copy(this.shipPosition).add(this.relativePosition);
        let newProj = this.projectilePool.getProjectile();
        newProj.setTarget(this.targets);
        newProj.fire(this.vectorPosition, this.fireAngle);
    }
    // Set the angle the projectiles will fire towards
    setAngle(_angle) {
        this.fireAngle = _angle;
    }
    getAngle() {
        return this.fireAngle;
    }
    setPosition(_relativePosition) {
        this.relativePosition = _relativePosition;
    }
}
class GameOver extends Phaser.State {
    create() {
        this.game.camera.flash(0x000000, 1000);
        this.entranceSound = new Phaser.Sound(game, "gameover_entry", 1, false);
        this.exitSound = new Phaser.Sound(game, "gameover_exit", 1, false);
        this.entranceSound.play();
        this.gameOverSprite = new Phaser.Sprite(game, 0, 0, "gameover_overlay");
        this.insertCoinSprite = new Phaser.Sprite(game, 0, 300, "gameover_insertcoin");
        game.add.existing(this.gameOverSprite);
        game.add.existing(this.insertCoinSprite);
        game.add.tween(this.insertCoinSprite).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
    update() {
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.changeState();
        }
    }
    changeState() {
        this.camera.onFadeComplete.add(function () {
            game.state.start("Menu", true);
        });
        game.camera.fade(0x000000, 1000);
        this.exitSound.play();
    }
}
class GameState extends Phaser.State {
    init(_characterNumber) {
        this.characterNumber = _characterNumber;
    }
    create() {
        menuMusic.stop();
        gameMusic.play();
        game.camera.flash(0x000000, 1000);
        this.level = new Level();
        this.plasmaBulletGroup = new Phaser.Group(game);
        this.missileGroup = new Phaser.Group(game);
        this.shipGroup = new Phaser.Group(game);
        this.uiGroup = new Phaser.Group(game);
        // Create the various pools for different projectiles
        this.playerPlasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET, this.plasmaBulletGroup, "plasma_bullet_player", "bullet_hit_blue");
        this.enemyPlasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET, this.plasmaBulletGroup, "plasma_bullet_enemy", "bullet_hit_red");
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE, this.missileGroup);
        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager([this.enemyPlasmaBulletPool, this.missilePool], this.shipGroup);
        // Create a player
        this.player = new Player(this.characterNumber, [this.playerPlasmaBulletPool, this.missilePool], 80, 40, this.enemyManager.getEnemies(), this.shipGroup);
        this.enemyManager.setPlayer(this.player);
        this.healthIndicator = new HealthIndicator(this.player);
        this.player.healthIndicator = this.healthIndicator;
        this.uiGroup.add(this.healthIndicator);
        this.comboMeter = new ComboMeter(this.uiGroup);
        this.scoreIndicator = new ScoreIndicator();
        this.enemyManager.scoreCounter = this.scoreIndicator;
        this.uiGroup.add(this.scoreIndicator);
    }
    update() {
        this.level.update();
        this.enemyManager.update();
    }
}
class MenuState extends Phaser.State {
    create() {
        gameMusic.stop();
        if (!menuMusic.isPlaying) {
            menuMusic.play();
        }
        game.camera.flash(0x000000, 1000);
        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');
        this.welcomeSprite = new Phaser.Sprite(game, 0, 820, 'menu_welcome_bar');
        this.nameOverlay = new Phaser.Sprite(game, 0, 0, 'menu_name_overlay');
        this.overlay = new Phaser.Sprite(game, -20, 170, "menu_selection_overlay");
        this.animationSprite = new Phaser.Sprite(game, 0, 600, "character_select_animation");
        this.buttonClickSound = new Phaser.Sound(game, "button_click", 1, false);
        let entranceSound = new Phaser.Sound(game, "menu_entry", 1, false);
        entranceSound.play();
        this.startButton = new Phaser.Button(game, 262, 665, 'menu_button_start', function () { this.startGame(); this.buttonClickSound.play(); }, this);
        this.previousButton = new Phaser.Button(game, 5, 640, 'menu_button_arrow', function () { this.changeCharacter(-1); this.buttonClickSound.play(); }, this);
        this.nextButton = new Phaser.Button(game, 507, 640, 'menu_button_arrow', function () { this.changeCharacter(1); this.buttonClickSound.play(); }, this);
        this.nextButton.scale.set(-1, 1);
        this.startButton.anchor.set(0.5);
        this.animationSprite.animations.add("anim");
        this.animationSprite.play("anim", 24, true);
        this.portraits = new Array();
        this.ships = new Array();
        this.names = new Array();
        this.selectSounds = new Array();
        let playerPortrait1 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_1');
        let playerPortrait2 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_2');
        let playerPortrait3 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_3');
        let playerPortrait4 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_4');
        let ship1 = new Phaser.Sprite(game, 0, 0, 'ships_player', 0);
        let ship2 = new Phaser.Sprite(game, 0, 0, 'ships_player', 1);
        let ship3 = new Phaser.Sprite(game, 0, 0, 'ships_player', 2);
        let ship4 = new Phaser.Sprite(game, 0, 0, 'ships_player', 3);
        let name1 = new Phaser.Text(game, 0, 0, "Hybrid Hyun");
        let name2 = new Phaser.Text(game, 0, 0, "Danger Dia");
        let name3 = new Phaser.Text(game, 0, 0, "Killer Kimmy");
        let name4 = new Phaser.Text(game, 0, 0, "Spacey Stacey");
        let select1 = new Phaser.Sound(game, "select_hyun", 1, false);
        let select2 = new Phaser.Sound(game, "select_dia", 1, false);
        let select3 = new Phaser.Sound(game, "select_kimmy", 1, false);
        let select4 = new Phaser.Sound(game, "select_stacey", 1, false);
        this.portraits.push(playerPortrait1);
        this.portraits.push(playerPortrait2);
        this.portraits.push(playerPortrait3);
        this.portraits.push(playerPortrait4);
        this.ships.push(ship1);
        this.ships.push(ship2);
        this.ships.push(ship3);
        this.ships.push(ship4);
        this.names.push(name1);
        this.names.push(name2);
        this.names.push(name3);
        this.names.push(name4);
        this.selectSounds.push(select1);
        this.selectSounds.push(select2);
        this.selectSounds.push(select3);
        this.selectSounds.push(select4);
        this.currentCharacterNumber = 0;
        this.currentPortrait = new Phaser.Sprite(game, 51, 170, this.portraits[this.currentCharacterNumber].texture);
        this.currentShip = new Phaser.Sprite(game, 27, 410, this.ships[this.currentCharacterNumber].texture);
        this.currentName = new Phaser.Text(game, 256, 56, this.names[this.currentCharacterNumber].text, { font: "normal 52px ocra", fill: "#b3ffe2", align: "center" });
        this.currentName.anchor.set(0.5);
        game.add.existing(this.background);
        game.add.existing(this.welcomeSprite);
        game.add.existing(this.animationSprite);
        game.add.existing(this.startButton);
        game.add.existing(this.previousButton);
        game.add.existing(this.nextButton);
        game.add.existing(this.currentPortrait);
        game.add.existing(this.currentShip);
        game.add.existing(this.overlay);
        game.add.existing(this.nameOverlay);
        game.add.existing(this.currentName);
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
        this.currentShip.loadTexture(this.ships[this.currentCharacterNumber].texture);
        this.currentName.setText(this.names[this.currentCharacterNumber].text);
    }
    startGame() {
        let _this = this;
        this.camera.onFadeComplete.add(function () {
            game.state.start("Game", true, false, _this.currentCharacterNumber);
        });
        game.camera.fade(0x000000, 1000);
        this.selectSounds[this.currentCharacterNumber].play();
    }
}
class Preloader extends Phaser.State {
    // Preload all assets
    preload() {
        // Images menu
        game.load.image("startscreen_background", "assets/Images/Backgrounds/StartScreen/startscreen_background.jpg");
        game.load.image("startscreen_title", "assets/Images/Backgrounds/StartScreen/startscreen_title.png");
        game.load.image("insert_coin_text", "assets/Images/Backgrounds/StartScreen/startscreen_coin_text.png");
        game.load.image("menu_background", "assets/Images/Backgrounds/background_characterselect.jpg");
        game.load.image("menu_portrait_1", "assets/Images/UI/CharacterSelect/Portraits/portrait_1.png");
        game.load.image("menu_portrait_2", "assets/Images/UI/CharacterSelect/Portraits/portrait_2.png");
        game.load.image("menu_portrait_3", "assets/Images/UI/CharacterSelect/Portraits/portrait_3.png");
        game.load.image("menu_portrait_4", "assets/Images/UI/CharacterSelect/Portraits/portrait_4.png");
        game.load.image("menu_button_start", "assets/Images/UI/CharacterSelect/button_select.png");
        game.load.image("menu_button_arrow", "assets/Images/UI/CharacterSelect/button_arrow.png");
        game.load.image("menu_selection_overlay", "assets/Images/UI/CharacterSelect/selection_overlay.png");
        game.load.image("menu_welcome_bar", "assets/Images/UI/CharacterSelect/welcome_bar.png");
        game.load.image("menu_name_overlay", "assets/Images/UI/CharacterSelect/name_overlay.png");
        // images tutorial
        game.load.image("tutorial_1", "assets/Images/UI/Tutorial/Tutorial1.png");
        game.load.image("tutorial_2", "assets/Images/UI/Tutorial/Tutorial2.png");
        game.load.image("tutorial_3", "assets/Images/UI/Tutorial/Tutorial3.png");
        game.load.image("tutorial_dots", "assets/Images/UI/Tutorial/Dots.png");
        game.load.image("chat_logo", "assets/Images/UI/Tutorial/Chats.png");
        // Images game
        game.load.image("plasma_bullet_player", "assets/Images/Projectiles/bullet_player.png");
        game.load.image("plasma_bullet_enemy", "assets/Images/Projectiles/bullet_enemy.png");
        game.load.image("ui_overlay", "assets/Images/UI/ui_overlay.png");
        game.load.image("pause_button", "assets/Images/UI/button_pause.png");
        game.load.image("health_bar", "assets/Images/UI/Indicators/health_bar.png");
        game.load.image("target_indicator", "assets/Images/UI/Indicators/crosshair.png");
        game.load.image("combo_section_middle", "assets/Images/UI/Indicators/combo_bar.png");
        game.load.image("combo_section_end", "assets/Images/UI/Indicators/combo_bar_end.png");
        game.load.image("player_hit_overlay", "assets/Images/player_hit_overlay.png");
        game.load.image("gameover_overlay", "assets/Images/UI/GameOver/gameover_overlay.png");
        game.load.image("gameover_insertcoin", "assets/Images/UI/GameOver/gameover_insertcoin.png");
        game.load.image("pickup_repair", "assets/Images/Pickups/pickup_health.png");
        game.load.image("pickup_plasma", "assets/Images/Pickups/pickup_plasma.png");
        game.load.image("pickup_missile", "assets/Images/Pickups/pickup_missile.png");
        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background.jpg", 512, 2048, 4);
        game.load.spritesheet("ships_player", "assets/SpriteSheets/Ships/player_ship_sheet.png", 128, 128, 4);
        game.load.spritesheet("ships_enemy_orange", "assets/SpriteSheets/Ships/enemy_ship_sheet_orange.png", 128, 128, 3);
        game.load.spritesheet("ships_enemy_blue", "assets/SpriteSheets/Ships/enemy_ship_sheet_blue.png", 128, 128, 3);
        game.load.spritesheet("ships_enemy_pink", "assets/SpriteSheets/Ships/enemy_ship_sheet_pink.png", 128, 128, 3);
        game.load.spritesheet("missile", "assets/SpriteSheets/Animations/projectile_missile.png", 64, 64, 22);
        game.load.spritesheet("missile_hit", "assets/SpriteSheets/Animations/Explosions/hit_missile_explosion.png", 128, 128, 13);
        game.load.spritesheet("player_exhaust", "assets/SpriteSheets/Animations/player_exhaust.png", 32, 64, 5);
        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/Explosions/death_explosion.png", 256, 256, 24);
        game.load.spritesheet("player_healing", "assets/SpriteSheets/Animations/player_healing.png", 256, 256, 15);
        game.load.spritesheet("character_select_animation", "assets/SpriteSheets/Animations/character_select_animation.png", 512, 256, 30);
        game.load.spritesheet("bullet_hit_blue", "assets/SpriteSheets/Animations/hit_bullet_blue.png", 64, 64, 5);
        game.load.spritesheet("bullet_hit_red", "assets/SpriteSheets/Animations/hit_bullet_red.png", 64, 64, 5);
        game.load.spritesheet("combo_small", "assets/SpriteSheets/Animations/combo_small.png", 256, 192, 12);
        game.load.spritesheet("combo_big", "assets/SpriteSheets/Animations/combo_big.png", 256, 192, 12);
        game.load.spritesheet("indicator", "assets/SpriteSheets/Animations/indicator.png", 256, 256);
        // Audio Music
        game.load.audio("music_menu", "assets/Audio/Music/music_menu.mp3");
        game.load.audio("music_game", "assets/Audio/Music/music_game.mp3");
        // Audio SFX
        game.load.audio("button_click", "assets/Audio/SFX/button_click_1.mp3");
        game.load.audio("startscreen_entry", "assets/Audio/SFX/startscreen_entry.mp3");
        game.load.audio("menu_entry", "assets/Audio/SFX/menu_entry.mp3");
        game.load.audio("gameover_entry", "assets/Audio/SFX/gameover_entry.mp3");
        game.load.audio("gameover_exit", "assets/Audio/SFX/gameover_exit.mp3");
        game.load.audio("player_death", "assets/Audio/SFX/ship_explosion_big.mp3");
        game.load.audio("enemy_death_small", "assets/Audio/SFX/electric_explosion_small.mp3");
        game.load.audio("enemy_death_big", "assets/Audio/SFX/electric_explosion_big.mp3");
        game.load.audio("pickup_sound", "assets/Audio/SFX/player_powerup.mp3");
        game.load.audio("metal_hit", "assets/Audio/SFX/metal_hit.mp3");
        game.load.audio("select_dia", "assets/Audio/SFX/character_select_dia.mp3");
        game.load.audio("select_hyun", "assets/Audio/SFX/character_select_hyun.mp3");
        game.load.audio("select_kimmy", "assets/Audio/SFX/character_select_kimmy.mp3");
        game.load.audio("select_stacey", "assets/Audio/SFX/character_select_stacey.mp3");
        // JSON
        game.load.tilemap("wave01", "assets/WaveData/wave01.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave02", "assets/WaveData/wave02.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave03", "assets/WaveData/wave03.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave04", "assets/WaveData/wave04.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave05", "assets/WaveData/wave05.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave06", "assets/WaveData/wave06.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave07", "assets/WaveData/wave07.json", null, Phaser.Tilemap.TILED_JSON);
    }
    // After the preload function is done, the create function is called which starts the GameState
    create() {
        menuMusic = game.add.audio("music_menu", 1, true);
        gameMusic = game.add.audio("music_game", 1, true);
        game.state.start("Start");
    }
}
class StartState extends Phaser.State {
    create() {
        this.background = new Phaser.Sprite(game, 0, 0, 'startscreen_background');
        this.title = new Phaser.Sprite(game, 0, -400, 'startscreen_title');
        this.insertCoin = new Phaser.Sprite(game, game.width / 2, 460, 'insert_coin_text');
        this.insertCoin.anchor.set(0.5);
        this.entrySound = new Phaser.Sound(game, "startscreen_entry", 1, false);
        this.exitSound = new Phaser.Sound(game, "gameover_exit", 1, false);
        this.entrySound.play();
        game.add.tween(this.title).to({ y: -60 }, 2400, Phaser.Easing.Bounce.Out, true);
        game.add.tween(this.insertCoin).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        game.add.existing(this.background);
        game.add.existing(this.title);
        game.add.existing(this.insertCoin);
        menuMusic.play();
    }
    update() {
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.startMenu();
        }
    }
    startMenu() {
        this.exitSound.play();
        this.camera.onFadeComplete.add(function () {
            game.state.start("Tutorial", true, false);
        });
        game.camera.fade(0x000000, 1000);
    }
}
class TuorialState extends Phaser.State {
    create() {
        this.clicked = false;
        this.clicks = 0;
        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');
        let chat = new Phaser.Sprite(game, 0, 0, 'chat_logo');
        this.dots = new Phaser.Sprite(game, 400, 300, 'tutorial_dots');
        game.add.existing(this.background);
        game.add.existing(chat);
        game.add.existing(this.dots);
        this.tutorials = new Array();
        this.tutorials[0] = new Phaser.Sprite(game, 256, 100, 'tutorial_1');
        this.tutorials[0].anchor.x = .5;
        game.add.existing(this.tutorials[0]);
        this.tutorials[1] = new Phaser.Sprite(game, 256, 300, 'tutorial_2');
        this.tutorials[1].anchor.x = .5;
        this.tutorials[2] = new Phaser.Sprite(game, 256, 500, 'tutorial_3');
        this.tutorials[2].anchor.x = .5;
        game.camera.flash(0x000000, 1000);
    }
    update() {
        if (this.clicked == false && game.input.activePointer.isDown) {
            this.clicked = true;
            this.nextTutorial();
        }
        else if (this.clicked == true && game.input.activePointer.isDown == false) {
            this.clicked = false;
        }
    }
    nextTutorial() {
        this.clicks++;
        if (this.clicks < this.tutorials.length) {
            game.add.existing(this.tutorials[this.clicks]);
            this.dots.y += 200;
        }
        else {
            this.camera.onFadeComplete.add(function () {
                game.state.start("Menu", true, false);
            });
            game.camera.fade(0x000000, 1000);
        }
    }
}
class ComboMeter {
    constructor(_group) {
        this.maxComboFuel = 100;
        this.currentComboFuel = 0;
        this.bars = 8;
        this.barSections = new Array();
        this.comboReady = false;
        this.spriteGroup = _group;
        this.setBarSprites();
        this.onMeterChange(0);
    }
    setBarSprites() {
        var step = 20;
        for (var i = 0; i < this.bars; i++) {
            var x = 34;
            var y = 740 + step * i;
            let bar;
            if (i == 0) {
                bar = new Phaser.Sprite(game, x, y - 7, "combo_section_end");
                bar.scale.set(1, -1);
            }
            else if (i == this.bars - 1) {
                bar = new Phaser.Sprite(game, x, y, "combo_section_end");
            }
            else {
                bar = new Phaser.Sprite(game, x, y, "combo_section_middle");
            }
            bar.anchor.set(0.5);
            this.spriteGroup.add(bar);
            game.add.existing(bar);
            this.barSections.push(bar);
        }
    }
    // Execute on a change in the amount of charge in the combo meter.
    onMeterChange(_amount) {
        if (this.currentComboFuel < this.maxComboFuel) {
            this.currentComboFuel += _amount;
        }
        if (this.currentComboFuel >= this.maxComboFuel) {
            this.currentComboFuel = this.maxComboFuel;
            this.comboReady = true;
        }
        // Calculate the number of combo sprites that will be set to a lower alpha value.
        let sum = Math.ceil((this.currentComboFuel / this.maxComboFuel) * 10);
        let arrayBars = this.bars - 1;
        for (var i = 0; i < this.bars; i++) {
            if (i < sum) {
                this.barSections[arrayBars - i].alpha = 1;
            }
            else {
                this.barSections[arrayBars - i].alpha = 0.5;
            }
        }
    }
    get ComboReady() {
        return this.comboReady;
    }
}
class HealthIndicator extends Phaser.Sprite {
    constructor(_player) {
        super(game, 0, 0, "ui_overlay");
        this.player = _player;
        this.bars = 8;
        this.barSections = new Array();
        this.setBarSprites();
        game.add.existing(this);
        this.onHealthChange();
    }
    setBarSprites() {
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
class ScoreIndicator extends Phaser.Text {
    constructor() {
        super(game, 20, 20, "0");
        this.style = { font: "normal 30px ocra", fill: "#b3ffe2", align: "center" };
        this.setStyle(this.style);
        this.currentScore = 0;
        game.add.existing(this);
    }
    onScoreChange(_amount) {
        this.currentScore += _amount;
        this.setText(this.currentScore.toString());
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
class ArrayMethods {
    static containsObject(list, obj) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }
    static removeObject(list, obj) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                list.splice(i, 1);
            }
        }
    }
}
class ScreenShakeHandler {
    static smallShake() {
        game.camera.shake(0.005, 500);
    }
    static bigShake() {
        game.camera.shake(0.02, 1000);
    }
    static customShake(intensity, duration) {
        game.camera.shake(intensity, duration);
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