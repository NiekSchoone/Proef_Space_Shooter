class Player extends Ship {
    private moveDir: Vector2;
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
    private onHealAnimation: Phaser.Sprite;
    private onPowerupAnimation: Phaser.Sprite;
    private comboController: ComboController;
    private comboMeter: ComboMeter;

    public moving: boolean;
    public projectilePools: Array<ProjectilePool>;
    public enemies: Array<Enemy>;
    public healthIndicator: HealthIndicator;

    constructor(_charNumber: number, _projectilePools: ProjectilePool[], _maxHP: number, _collisionRadius: number, _targets: Array<Enemy>, _group: Phaser.Group, _comboMeter: ComboMeter) {
        super(_collisionRadius, _maxHP);
        game.physics.arcade.enable(this);

        this.projectilePools = _projectilePools;
        this.loadTexture("ships_player", _charNumber);
        this.setDeathSound("enemy_death_small");
        this.speed = 20;
        this.anchor.set(0.5);
        this.spriteGroup = _group;
        this.comboMeter = _comboMeter;
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

        this.onPowerupAnimation = new Phaser.Sprite(game, 0, 0, "player_powerup");
        this.onPowerupAnimation.anchor.set(0.5);
        this.onPowerupAnimation.animations.add("powerup");
        this.onPowerupAnimation.visible = false;

        this.powerupSound = new Phaser.Sound(game, "pickup_sound", 1, false);

        game.add.existing(this);
        game.add.existing(this.exhaustAnimation);
        game.add.existing(this.onHitSprite);
        game.add.existing(this.onHealAnimation);
        game.add.existing(this.onPowerupAnimation);

        this.spriteGroup.addMultiple([this, this.exhaustAnimation, this.onHitSprite, this.onHealAnimation, this.onPowerupAnimation]);

        this.enemies = _targets;
        this.moveDir = new Vector2();
        this.vectorPosition.X = 200;
        this.vectorPosition.Y = 500;

        this.playerUpgrades = new PlayerUpgrades(this);
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeZero();

        this.comboController = new ComboController(this, this.enemies, this.comboMeter);

        this.plasmaUpgradeCount = 0;
        this.missileUpgradeCount = 0;
    }

    public onHit(_amount: number) {
        super.onHit(_amount);
        this.healthIndicator.onHealthChange();
        this.onHitTween.start();
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
            this.onPowerupAnimation.visible = true;
            this.onPowerupAnimation.play("powerup", 24);
            this.plasmaUpgradeCount++;
            if (this.plasmaUpgradeCount <= 3) {
                this.plasmaWeapons = this.playerUpgrades.nextPlasmaUpgrade(this.plasmaUpgradeCount);
            }
        } else if (_pickupType == PickupType.UPGRADEMISSILE) {
            this.onPowerupAnimation.visible = true;
            this.onPowerupAnimation.play("powerup", 24);
            this.missileUpgradeCount++;
            if (this.missileUpgradeCount <= 3) {
                this.missileWeapons = this.playerUpgrades.nextMissileUpgrade(this.missileUpgradeCount);
            }
        }
        this.powerupSound.play();
    }

    public update() {
        for (let i = 0; i < this.plasmaWeapons.length; i++) {
            this.plasmaWeapons[i].update();
        }
        for (let i = 0; i < this.missileWeapons.length; i++) {
            this.missileWeapons[i].update();
        }

        if (this.comboMeter.ComboReady) {
            this.comboController.update();
        }

        // When a mouse pointer or touch pointer is down on the screen, get get the position and calculate a move direction
        if (game.input.activePointer.isDown && !this.comboController.comboInitiated) {
            this.comboController.indicateTargets(false);
            this.moving = true;
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        } else if (!game.input.activePointer.isDown && !this.comboController.comboInitiated) {
            if (this.comboMeter.ComboReady) { this.comboController.indicateTargets(true); }
            this.moving = false;
        }else if (this.comboController.comboInitiated == true && !game.input.activePointer.isDown) {
            this.comboController.executeCombo();
        }

        this.onHealAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        this.onPowerupAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        this.exhaustAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        super.update();
    }

    // Set targets that the player's weapon can hit
    public setTargets(_targets: Array<Enemy>) {
        this.enemies = _targets;
        this.plasmaWeapons = this.playerUpgrades.plasmaUpgradeZero();
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
