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

    // Get a projectile from the pool and return it
    public getProjectile(): Projectile {
        let projectile;
        if (this.available.length != 0) {
            projectile = this.available.pop();
        } else {
            projectile = this.addProjectile();
        }
        if (projectile != null) {
            this.inUse.push(projectile);
            projectile.visible = true;
            return projectile;
        }
    }

    // Returns a given projectile to the pool of available projectiles
    private returnProjectile(projectile: Projectile) {
        projectile.resetValues(); 
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex); // Find the projectile in the "inUse" array by the identifier it has
        this.inUse.splice(index, 1); // Splice the projectile out of the array
        this.available.push(projectile); // Place the projectile back in the array of available projectiles
    }

    // Adds a projectile to the pool ready for use
    private addProjectile(): Projectile {
        let newProjectile;
        // Check which type is defined for this pool and make a new projectile based on that type
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet('plasma_bullet', this.returnProjectile.bind(this));
        } else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile('missile', this.returnProjectile.bind(this));
        } else {
            throw "Incorrect type specified for object pool";
        }
        if (newProjectile != null) {
            newProjectile.projectileIndex = this.projectileCount;
            game.add.existing(newProjectile);
            this.projectileCount++;
            return newProjectile;
        }
    }
}
