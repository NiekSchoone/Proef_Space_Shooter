class Ship extends Phaser.Sprite {

    public vectorPosition: Vector2;
    public maxHP: number;
    public currentHP: number;
    public speed: number;
    public collisionRadius: number;
    public shooting: boolean;

    protected plasmaWeapons: Array<Weapon>;
    protected missileWeapons: Array<Weapon>;
    protected explosion: Phaser.Sprite;
    protected active: boolean;

    private weaponOffset: number;
    private weaponSlot: number;
    private weaponsMade: number;

    constructor(_collisionRadius: number, _maxHP: number) {
        super(game, 0, 0);
        this.game = game;
        this.collisionRadius = _collisionRadius;
        this.maxHP = _maxHP;
        this.plasmaWeapons = new Array<Weapon>();
        this.missileWeapons = new Array<Weapon>();
        this.vectorPosition = new Vector2();
        this.weaponOffset = 30;
        this.currentHP = this.maxHP;

        this.explosion = new Phaser.Sprite(game, 0, 0, "explosion", 24);
        this.explosion.animations.add("explode", Phaser.ArrayUtils.numberArray(0, 23), 24, false);
        this.explosion.anchor.set(0.5);

        this.active = true;
    }

    public onHit(_amount: number) {
        this.currentHP -= _amount;
    }

    //Add a weapon for this ship with cooldown
    public addWeapon(_weaponCooldown: number, _projectiles: ProjectilePool, _angle: number, _targets: Array<Ship>, _relativePosition: Vector2 = null) {
        let weapon = new Weapon(_relativePosition, this.vectorPosition,_weaponCooldown, _angle, _projectiles, _targets);
        this.weaponsMade++;
        this.plasmaWeapons.push(weapon);
    }

    /*public removeWeapon(_weapon: Weapon) {
        let id = this.weapons.indexOf(_weapon, _weapon.id);
        this.weapons.splice(id, 1);
        _weapon = null;
        this.resetWeaponPos();
    }

    private resetWeaponPos() {
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
    public update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        if (this.shooting) {
            for (let i = 0; i < this.plasmaWeapons.length; i++) {
                this.plasmaWeapons[i].update();
            }
            for (let i = 0; i < this.missileWeapons.length; i++) {
                this.missileWeapons[i].update();
            }
        }
        if (this.currentHP <= 0) {
            this.die();
        }
    }

    protected die() {
        this.active = false;
        this.explosion.position.set(this.vectorPosition.X, this.vectorPosition.Y);
        this.explosion.angle = Math.floor(Math.random() * (359) + 1);
        this.game.add.existing(this.explosion);
        this.explosion.animations.play("explode");
        ScreenShakeHandler.smallShake();
    }
}