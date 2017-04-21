﻿class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;
    public vectorPosition: Vector2;
    public collisionRadius: number;
    protected weapons: Array<Weapon>;
    protected fireAngle: number;

    constructor(_collisionRadius: number)
    {
        super(game, 0, 0);
        this.game = game;
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
            this.weapons[i].vectorPosition = Vector2.copy(this.vectorPosition);
            this.weapons[i].update();
        }
    }

    protected die() {
        //this.destroy();
    }
}