class Ship extends Phaser.Sprite {

    public vectorPosition: Vector2;
    public maxHP: number;
    public currentHP: number;
    public speed: number;
    public collisionRadius: number;

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

    public update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
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