class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;
    public vectorPosition: Vector2;
    public collisionRadius: number;
    protected weapons: Array<Weapon>;
    protected fireAngle: number;
    protected active: boolean;
    protected explosion: Phaser.Sprite;
    private weaponOffset: number;

    constructor(_collisionRadius: number)
    {
        super(game, 0, 0);
        this.game = game;
        this.weaponOffset = 10;
        this.collisionRadius = _collisionRadius;
        this.weapons = new Array<Weapon>();
        this.vectorPosition = new Vector2();

        this.active = true;

        this.explosion = new Phaser.Sprite(game, 0, 0, "explosion", 24);
        this.explosion.animations.add("explode", Phaser.ArrayUtils.numberArray(0, 23), 24, false);
        this.explosion.anchor.set(0.5);
    }

    public onHit(_amount: number) {
        this.health -= _amount;
        if (this.health <= 0 && this.active) {
            this.die();
        }
    }

    // Add a weapon for this ship with cooldown 
    public addWeapon(cooldown: number, projectilePool: ProjectilePool, _targets: Array<Ship>) {
        let newWeapon = new Weapon(cooldown, projectilePool, _targets);
        newWeapon.setAngle(this.fireAngle);
        this.weapons.push(newWeapon);
    }

    public update() {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        for (let i = 0; i < this.weapons.length; i++) {
            let relativePositionX: number;
            let weaponSlot: number = i + 1;
            if (weaponSlot % 2 == 0 ) {
                relativePositionX = this.weaponOffset * -(weaponSlot - 1);
            }
            else {
                relativePositionX = this.weaponOffset * weaponSlot;
            }
            this.weapons[i].vectorPosition = Vector2.copy(this.vectorPosition);
            this.weapons[i].vectorPosition.X += relativePositionX;
            this.weapons[i].update();
        }
    }

    protected die() {
        this.active = false;
        this.explosion.position.set(this.vectorPosition.X, this.vectorPosition.Y);
        this.game.add.existing(this.explosion);
        this.explosion.animations.play("explode");
        //this.destroy();
    }
}