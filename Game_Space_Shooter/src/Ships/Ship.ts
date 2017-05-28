class Ship extends Phaser.Sprite {

    public vectorPosition: Vector2;
    public maxHP: number;
    public currentHP: number;
    public speed: number;
    public collisionRadius: number;

    protected active: boolean;
    protected explosion: Phaser.Sprite;
    protected deathSound: Phaser.Sound;
    protected hitTween: Phaser.Tween;

    constructor(_collisionRadius: number, _maxHP: number) {
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

    public onHit(_amount: number) {
        this.currentHP -= _amount;
        this.hitTween.start();
    }

    public update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        if (this.currentHP <= 0) {
            this.die();
        }
    }

    protected setDeathSound(_sound: string) {
        this.deathSound = new Phaser.Sound(game, _sound, 1, false);
    }

    protected die() {
        this.active = false;
        this.explosion.position.set(this.vectorPosition.X, this.vectorPosition.Y);
        this.explosion.angle = Math.floor(Math.random() * (359) + 1);
        game.add.existing(this.explosion);
        this.explosion.animations.play("explode");

        this.deathSound.play();

        ScreenShakeHandler.smallShake();
    }
}