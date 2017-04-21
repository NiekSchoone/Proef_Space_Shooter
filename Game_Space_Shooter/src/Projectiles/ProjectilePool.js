var ProjectilePool = (function () {
    function ProjectilePool(_type) {
        this.poolType = _type;
        this.available = new Array();
        this.inUse = new Array();
        this.projectileCount = 0;
    }
    ProjectilePool.prototype.getProjectile = function () {
        var projectile;
        if (this.available.length != 0) {
            projectile = this.available.pop();
        }
        else {
            projectile = this.addProjectile();
        }
        if (projectile != null) {
            this.inUse.push(projectile);
            projectile.visible = true;
            return projectile;
        }
    };
    ProjectilePool.prototype.returnProjectile = function (projectile) {
        projectile.resetValues();
        var index = this.inUse.indexOf(projectile, projectile.projectileIndex);
        this.inUse.splice(index, 1);
        this.available.push(projectile);
    };
    ProjectilePool.prototype.addProjectile = function () {
        var newProjectile;
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet('plasma_bullet', this.returnProjectile.bind(this));
        }
        else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile('missile', this.returnProjectile.bind(this));
        }
        else {
            throw "Incorrect type specified for object pool";
        }
        if (newProjectile != null) {
            newProjectile.projectileIndex = this.projectileCount;
            game.add.existing(newProjectile);
            this.projectileCount++;
            return newProjectile;
        }
    };
    return ProjectilePool;
}());
