﻿/**
 * @description Class that fires projectiles
 */
class Weapon {
    private cooldown: number;
    private timer: number;
    private projectilePool: ProjectilePool;
    private targets: Array<Ship>;
    private vectorPosition: Vector2;
    private shipPosition: Vector2;
    private relativePosition: Vector2;
    private fireAngle: number;
    private behaviour: Function;

    constructor(_position: Vector2, _shipPosition: Vector2, _cooldown: number, _angle: number, _projectilePool: ProjectilePool, _targets: Array<Ship>, _behaviour?: Function) {
        this.relativePosition = _position;
        this.shipPosition = _shipPosition;
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.fireAngle = _angle;
        this.projectilePool = _projectilePool;
        this.targets = _targets;
        this.behaviour = _behaviour;
        this.timer = _cooldown;
    }
    /**
     * @description Executes every frame
     */
    public update() {
        if (this.cooldown > 0) {
            this.timer -= game.time.physicsElapsedMS;
            if (this.timer <= 0) {
                this.timer = this.cooldown;
                this.fire();
            }
        }
        if (this.behaviour != null) {
            this.behaviour();
        }
    }
    /**
     * @description Get a projectile from the projectile pool and fire it
     */
    public fire() {
        this.vectorPosition = Vector2.copy(this.shipPosition).add(this.relativePosition);
        let newProj = this.projectilePool.getProjectile();
        newProj.setTarget(this.targets);
        newProj.fire(this.vectorPosition, this.fireAngle);
    }
    /**
     * @description Set the angle at which projectiles fire out of this weapon
     * @param _angle
     */
    public setAngle(_angle: number) {
        this.fireAngle = _angle;
    }
    /**
     * @description Get the angle at which the projectiles fire out of this weapon
     */
    public getAngle(): number {
        return this.fireAngle;
    }
    /**
     * @description Set the position of this weapon relative to the position of the ship that owns it
     * @param _relativePosition
     */
    public setPosition(_relativePosition: Vector2) {
        this.relativePosition = _relativePosition;
    }
}