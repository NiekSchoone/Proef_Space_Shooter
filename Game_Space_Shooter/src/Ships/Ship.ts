﻿class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;
    public vectorPosition: Vector2;
    public collisionRadius: number;
    protected weapons: Array<Weapon>;
    protected fireAngle: number;
    private weaponOffset: number;
    private weaponSlot: number;
    private weaponsMade: number;
    constructor(_collisionRadius: number)
    {
        super(game, 0, 0);
        this.game = game;
        this.weaponOffset = 10;
        this.collisionRadius = _collisionRadius;
        this.weapons = new Array<Weapon>();
        this.vectorPosition = new Vector2();
        this.weaponSlot = 1;
    }

    public onHit(_amount: number) {
        this.health -= _amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    // Add a weapon for this ship with cooldown 
    public addWeapon(cooldown: number, projectilePool: ProjectilePool, _targets: Array<Ship>, _relativePosition: Vector2 = null) {
        let fixedPosition: boolean = true;
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
        let newWeapon = new Weapon(cooldown, projectilePool, _targets, this.vectorPosition, _relativePosition, this.weaponsMade, this.removeWeapon, fixedPosition);
        this.weaponsMade++;
        newWeapon.setAngle(this.fireAngle);
        this.weapons.push(newWeapon);
    }
    public removeWeapon(_weapon: Weapon) {
        let id = this.weapons.indexOf(_weapon, _weapon.id);
        this.weapons.splice(id, 1);
        _weapon = null;
        this.resetWeaponPos();
    }
    private resetWeaponPos() {
        this.weaponSlot = 1;
        for (let i = 0; i < this.weapons.length; i++) {
            if (this.weapons[i].fixedPosition = false)
            {
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
    public update() {

        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        for (let i = 0; i < this.weapons.length; i++) {
            this.weapons[i].update();
        }
    }

    protected die() {
        //this.destroy();
    }
}