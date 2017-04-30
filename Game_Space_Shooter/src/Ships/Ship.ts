class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;
    public vectorPosition: Vector2;
    public collisionRadius: number;
    protected weapons: Array<Weapon>;
    protected fireAngle: number;
    private weaponOffset: number;
    constructor(_collisionRadius: number)
    {
        
        super(game, 0, 0);
        this.game = game;
        this.weaponOffset = 10;
        this.collisionRadius = _collisionRadius;
        this.weapons = new Array<Weapon>();
        this.vectorPosition = new Vector2();
    }

    public onHit(_amount: number) {
        this.health -= _amount;
        if (this.health <= 0) {
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
        //this.destroy();
    }
}