class Ship extends Phaser.Sprite {
    public maxHP: number;
    public currentHP: number;
    public speed: number;
    public vectorPosition: Vector2;
    public collisionRadius: number;

    protected plasmaWeapons: Array<NewWeapon>;
    protected missileWeapons: Array<NewWeapon>;
    protected active: boolean;
    protected explosion: Phaser.Sprite;
    private weaponOffset: number;
    private weaponSlot: number;
    private weaponsMade: number;
    public shooting: boolean;

    constructor(_collisionRadius: number, _maxHP: number) {
        super(game, 0, 0);
        this.game = game;
        this.collisionRadius = _collisionRadius;
        this.plasmaWeapons = new Array<NewWeapon>();
        this.missileWeapons = new Array<NewWeapon>();
        this.vectorPosition = new Vector2();
        this.weaponOffset = 30;
        this.maxHP = _maxHP;
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
        let fixedPosition: boolean = true;
        let weapon = new NewWeapon(_relativePosition, this.vectorPosition,_weaponCooldown,_angle, _projectiles, _targets);
        this.weaponsMade++;
        this.plasmaWeapons.push(weapon);
    }

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
        game.camera.shake(0.005, 500);
    }
}