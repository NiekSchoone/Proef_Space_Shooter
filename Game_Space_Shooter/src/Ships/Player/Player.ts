class Player extends Ship {
    private mouseDown: boolean;
    private moveDir: Vector2;
    private comboMode: boolean = false;
    private moving: boolean = false;
    private targetEnemies: Enemy[];
    private targetIDs: Array<number>;
    private graphics: Phaser.Graphics;
    private slowMo: boolean = false;
    private exhaustAnimation: Phaser.Sprite;
    private playerUpgrades: PlayerUpgrades;
    private plasmaWeapons: Array<Weapon>;
    private missileWeapons: Array<Weapon>;
    private plasmaUpgradeCount: number;
    private missileUpgradeCount: number;
    private onHitSprite: Phaser.Sprite;
    private onHitTween: Phaser.Tween;
    private spriteGroup: Phaser.Group;
    private powerupSound: Phaser.Sound;
    private onHitSound: Phaser.Sound;
    private onHealAnimation: Phaser.Sprite;

    public projectilePools: Array<ProjectilePool>;
    public enemies: Array<Enemy>;
    public healthIndicator: HealthIndicator;

    private targetColor: number;

    constructor(_charNumber: number, _projectilePools: ProjectilePool[], _maxHP: number, _collisionRadius: number, _targets: Array<Enemy>, _group: Phaser.Group) {
        super(_collisionRadius, _maxHP);
        game.physics.arcade.enable(this);

        this.projectilePools = _projectilePools;
        this.loadTexture("ships_player", _charNumber);
        this.setDeathSound("enemy_death_small");
        this.speed = 20;
        this.anchor.set(0.5);
        this.spriteGroup = _group;

        this.plasmaWeapons = new Array<Weapon>();
        this.missileWeapons = new Array<Weapon>();

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
        this.targetEnemies = new Array<Enemy>();
        this.targetIDs = new Array<number>();
        this.vectorPosition.X = 200;
        this.vectorPosition.Y = 500;

        this.playerUpgrades = new PlayerUpgrades(this);
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeZero();

        this.plasmaUpgradeCount = 0;
        this.missileUpgradeCount = 0;
    }

    public onHit(_amount: number) {
        super.onHit(_amount);
        this.healthIndicator.onHealthChange();
        this.onHitTween.start();
        if (this.currentHP >= 0) {
            this.onHitSound.play();
        }
    }

    public handlePickup(_pickupType: PickupType) {
        if (_pickupType == PickupType.REPAIR) {
            this.onHealAnimation.visible = true;
            this.onHealAnimation.play("heal", 24);
            if (this.currentHP <= (this.maxHP-20)) {
                this.currentHP += 20;
            } else {
                this.currentHP = this.maxHP;
            }
            this.healthIndicator.onHealthChange();
        } else if (_pickupType == PickupType.UPGRADEPLASMA) {
            this.plasmaUpgradeCount++;
            if (this.plasmaUpgradeCount <= 3) {
                this.plasmaWeapons = this.playerUpgrades.nextPlasmaUpgrade(this.plasmaUpgradeCount);
            }
        } else if (_pickupType == PickupType.UPGRADEMISSILE) {
            this.missileUpgradeCount++;
            if (this.missileUpgradeCount <= 3) {
                this.missileWeapons = this.playerUpgrades.nextMissileUpgrade(this.missileUpgradeCount);
            }
        }
        this.powerupSound.play();
    }

    // Check's if the pointer is colliding with an enemy.
    private checkCollision() {
        if (this.enemies != null) {
            for (let i = 0; i < this.enemies.length; i++) {
                let distance = Vector2.distance(new Vector2(game.input.mousePointer.position.x, game.input.mousePointer.position.y), this.enemies[i].vectorPosition);

                if (distance < this.enemies[i].collisionRadius + 25) {
                    return this.enemies[i];
                }
            }
        }
    }

    public update() {
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
                let noDuplicate: boolean = true;

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
        } else if ((game.input.pointer1.isDown == false || game.input.mousePointer.isDown == false) && this.comboMode == false) {
            this.moving = false;
        }
        this.exhaustAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        super.update();
    }

    // Set targets that the player's weapon can hit
    public setTargets(_targets: Array<Enemy>) {
        this.enemies = _targets;
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeZero();
    }

    private indicateEnemies() {
        if (this.enemies.length != 0) {
            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies[i].indicateTarget();
            }
        }
    }

    protected die() {
        super.die();
        this.destroy(true);
        this.exhaustAnimation.destroy(true);
        game.camera.onFadeComplete.add(function () {
            game.state.start("GameOver");
        });
        game.camera.fade(0x000000, 1000);
    }
}
