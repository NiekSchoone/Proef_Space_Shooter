class ProjectilePool {

    private available: Array<Projectile>;
    private inUse: Array<Projectile>;
    private poolType: ProjectileType;

    private projectileCount: number;

    constructor(_type: ProjectileType) {
        this.poolType = _type;
        this.available = new Array<Projectile>();
        this.inUse = new Array<Projectile>();
        this.projectileCount = 0;
    }

    public getProjectile(): Projectile {
        let projectile;
        if (this.available.length != 0) {
            projectile = this.available.pop();
            this.inUse.push(projectile);
            return projectile;
        } else {
            projectile = this.addProjectile();
            this.inUse.push(projectile);
            return projectile;
        }
    }

    public returnProjectile(projectile: Projectile) {
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex);
        this.inUse.splice(index, 1);
        this.available.push(projectile);
    }

    public addProjectile(): Projectile {
        let newProjectile;
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet(new Vector2(0, 0), new Vector2(0, 0), this.returnProjectile);
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            return newProjectile;
        } else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile(new Vector2(0, 0), new Vector2(0, 0), this.returnProjectile);
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            return newProjectile;
        } else {
            throw "Incorrect type specified for object pool";
        }
    }

    private compare(a, b) {
        if (a.projectileIndex < b.projectileIndex) {
            return -1;
        } else if (a.projectileIndex > b.projectileIndex) {
            return 1;
        } else {
            return 0;
        }
    }
}
