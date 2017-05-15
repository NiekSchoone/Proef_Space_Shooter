class HealthIndicator extends Phaser.Sprite {
    constructor(_player) {
        super(game, 446, 828, "health_circle");
        this.player = _player;
        this.maxHp = this.player.maxHealth;
        this.bars = 8;
        this.barSections = new Array();
        this.setSprites();
        this.anchor.set(0.5);
        game.add.existing(this);
        this.onHealthChange();
    }
    setSprites() {
        var angle = -0.95;
        var step = (Math.PI) / 7.15;
        for (var i = 0; i < this.bars; i++) {
            var x = this.x - 13.5 + 57.5 * Math.cos(angle);
            var y = this.y - 1.5 + 57.5 * Math.sin(angle);
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
        let sum = 8; //Math.ceil((this.currentHp / this.maxHp) * 8);
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
class EnemyManager {
    constructor(_projectilePools) {
        this.patterns = new MovementPatterns();
        this.enemies = new Array();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0;
        this.timer = 3000;
        this.activeLevel = false;
        this.currentWave = 0;
        this.nextUnit = 0;
        this.spawning = true;
        this.waves = new Array();
        this.wave = 0;
        this.level = 0;
        this.waves.push(game.add.tilemap("wave01"));
        /*this.waves.push(game.add.tilemap("wave02"));
        this.waves.push(game.add.tilemap("wave03"));
        this.waves.push(game.add.tilemap("wave04"));
        this.waves.push(game.add.tilemap("wave05"));
        this.waves.push(game.add.tilemap("wave06"));
        this.waves.push(game.add.tilemap("wave07"));
        this.waves.push(game.add.tilemap("wave08"));
        this.waves.push(game.add.tilemap("wave09"));
        this.waves.push(game.add.tilemap("wave10"));*/
    }
    createEnemy(type, healthMod, speedMod, start) {
        let newEnemy = new Enemy(type, healthMod, speedMod, start, 20, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        this.enemies.push(newEnemy);
        return newEnemy;
    }
    update() {
        if (this.activeLevel == false) {
            this.timer -= game.time.elapsedMS;
            if (this.timer <= 0) {
                this.timer = 3000;
                this.activeLevel = true;
            }
        }
        else {
            let enemiesInScreen = true;
            for (let e = 0; e < this.enemies.length; e++) {
                enemiesInScreen = (enemiesInScreen == true && this.enemies[e].shooting == true);
            }
            if (enemiesInScreen == true || this.enemies.length == 0) {
                this.wave++;
                this.spawnWave();
                if (this.wave == 5) {
                    this.wave = 0;
                    this.activeLevel = false;
                    this.level++;
                }
            }
        }
    }
    spawnWave() {
        let waveToSpawn = 0; //Math.floor(Math.random() * 9);
        for (let i = 0; i < this.waves[waveToSpawn].objects["Ships"].length; i++) {
            switch (this.waves[waveToSpawn].objects["Ships"][i].type) {
                case "fighter":
                    let EnemyF = this.createEnemy(EnemyType.FIGHTER, 20, 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y));
                    EnemyF.addWeapon(1, this.projectilePools[0], [this.player]);
                    EnemyF.addWeapon(1, this.projectilePools[0], [this.player]);
                    break;
                case "bomber":
                    let EnemyB = this.createEnemy(EnemyType.FIGHTER, 20, 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y));
                    EnemyB.addWeapon(2, this.projectilePools[1], [this.player]);
                    EnemyB.addWeapon(2, this.projectilePools[1], [this.player]);
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
class Ship extends Phaser.Sprite {
    constructor(_collisionRadius) {
        super(game, 0, 0);
        this.game = game;
        this.weaponOffset = 10;
        this.collisionRadius = _collisionRadius;
        this.weapons = new Array();
        this.vectorPosition = new Vector2();
        this.explosion = new Phaser.Sprite(game, 0, 0, "explosion", 24);
        this.explosion.animations.add("explode", Phaser.ArrayUtils.numberArray(0, 23), 24, false);
        this.explosion.anchor.set(0.5);
        this.weaponSlot = 1;
        this.active = true;
    }
    onHit(_amount) {
        this.health -= _amount;
        if (this.health <= 0 && this.active) {
            this.die();
        }
    }
    // Add a weapon for this ship with cooldown 
    addWeapon(_weaponCooldown, _projectiles, _targets, _relativePosition = null) {
        let fixedPosition = true;
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
    }
    removeWeapon(_weapon) {
        let id = this.weapons.indexOf(_weapon, _weapon.id);
        this.weapons.splice(id, 1);
        _weapon = null;
        this.resetWeaponPos();
    }
    resetWeaponPos() {
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
    }
    update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        if (this.shooting) {
            for (let i = 0; i < this.weapons.length; i++) {
                this.weapons[i].update();
            }
        }
    }
    die() {
        this.active = false;
        this.explosion.position.set(this.vectorPosition.X, this.vectorPosition.Y);
        this.game.add.existing(this.explosion);
        this.explosion.animations.play("explode");
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
class Player extends Ship {
    constructor(_projectilePools, _collisionRadius) {
        super(_collisionRadius);
        this.comboMode = false;
        this.slowMo = false;
        this.projectilePools = _projectilePools;
        this.loadTexture("ships_player", 3);
        this.speed = 10;
        this.anchor.set(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        this.enemies = new Array();
        this.targetEnemies = new Array();
        this.targetIDs = new Array();
        this.fireAngle = 0;
        this.vectorPosition.X = 200;
        this.vectorPosition.Y = 500;
        this.shooting = true;
    }
    handlePickup(type) {
    }
    // Check's if the pointer is colliding with an enemy. 
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
        // Handle slowmotion inputs.
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
        super.update();
    }
    // Set targets that the player's weapon can hit
    setTargets(_targets) {
        this.enemies = _targets;
        this.addWeapon(0.80, this.projectilePools[1], this.enemies);
    }
    // Smoothly slowdown time. 
    smoothSlowmo() {
        if (this.slowMo == false) {
            if (game.time.slowMotion < 1.5) {
                game.time.slowMotion += 0.0125;
                game.time.events.add(200, this.smoothSlowmo, this);
            }
            else if (game.time.slowMotion > 1.5) {
                game.time.slowMotion = 1.5;
                this.slowMo = true;
            }
        }
    }
    // Smoothly reverts time back to normal.
    reverseSlowmo() {
        if (this.slowMo == true) {
            if (this.game.time.slowMotion > 1.0) {
                game.time.slowMotion -= 0.05;
                game.time.events.add(200, this.reverseSlowmo, this);
            }
            else if (game.time.slowMotion < 1.0) {
                game.time.slowMotion = 1.0;
                this.slowMo = false;
            }
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
    constructor(type, health, speed, start, _collisionRadius, _killEnemy, _id) {
        super(_collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.killEnemy = _killEnemy;
        this.vectorPosition.X = start.X;
        this.vectorPosition.Y = start.Y;
        this.currentMove = 1;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");
        this.speed = speed;
        this.enemyType = type;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "combo02");
        this.anchor.set(0.5);
        this.fireAngle = 180;
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
        this.shooting = false;
    }
    update() {
        if (this.active) {
            this.moveDir.X = 0;
            this.moveDir.Y = 1;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
            super.update();
            if (this.shooting == false) {
                this.shooting = (this.vectorPosition.Y > 0);
            }
        }
        else {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this);
            }
        }
    }
    spawn() {
    }
    die() {
        super.die();
        this.killEnemy(this);
    }
    toggleComboTarget() {
        this.comboSprite.anchor.setTo(0.5);
        let anim = this.comboSprite.animations.add("indicated", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 24, false);
        anim.play();
        this.addChild(this.comboSprite);
    }
}
class Level {
    constructor() {
        this.scrollSpeed = 15.0;
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
        this.animations.stop();
        this.animations.frame = 0;
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
        this.animations.add("missile");
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
        this.player = new Player(this.projectilePools, 50);
        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);
        this.player.setTargets(this.enemyManager.getEnemies());
        //this.healthIndicator = new HealthIndicator();
    }
    update() {
        this.level.update();
        this.enemyManager.update();
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
        game.load.image("plasma_bullet", "assets/Images/Projectiles/bullet.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");
        game.load.image("health_circle", "assets/Images/UI/Indicators/health_circle.png");
        game.load.image("health_bar", "assets/Images/UI/Indicators/health_bar.png");
        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background_001.png", 512, 2048, 4);
        game.load.spritesheet("ships_player", "assets/SpriteSheets/player_ship_sheet.png", 128, 128, 4);
        game.load.spritesheet("missile", "assets/SpriteSheets/Animations/projectile_missile.png", 64, 64, 22);
        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/Explosions/death_explosion.png", 256, 256, 24);
        game.load.spritesheet("missile_hit", "assets/SpriteSheets/Animations/Explosions/hit_missile_explosion.png", 128, 128, 12);
        game.load.spritesheet("combo02", "assets/SpriteSheets/Animations/combo02.png", 256, 192, 12);
        game.load.spritesheet("indicator", "assets/SpriteSheets/Animations/Indicator.png", 256, 256);
        // Audio
        // EnemyWaves
        game.load.tilemap("wave01", "assets/WaveData/wave01.json", null, Phaser.Tilemap.TILED_JSON);
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
//# sourceMappingURL=app.js.map