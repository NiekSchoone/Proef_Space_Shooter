var Weapon = (function () {
    function Weapon(_cooldown, _projectilePool, _targets) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.targets = _targets;
    }
    Weapon.prototype.update = function () {
        this.fireTimer -= game.time.elapsedMS;
        if (this.fireTimer < 0) {
            this.fireTimer = this.cooldown;
            var newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
    };
    Weapon.prototype.setAngle = function (_angle) {
        this.fireAngle = _angle;
    };
    return Weapon;
}());
