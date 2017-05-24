class ProjectilePool {

    private available: Array<Projectile>;
    private inUse: Array<Projectile>;
    private poolType: ProjectileType;
    private projectileCount: number;
    private spriteGroup: Phaser.Group;

    private texture: string;
    private hitTexture: string;

    constructor(_type: ProjectileType, _group: Phaser.Group, _tex: string, _hitTex: string) {
        this.poolType = _type;
        this.available = new Array<Projectile>();
        this.inUse = new Array<Projectile>();
        this.projectileCount = 0;
        this.spriteGroup = _group;
        
        this.texture = _tex;
        this.hitTexture = _hitTex;
    }

    // Get a projectile from the pool and return it
    public getProjectile(): Projectile {
        let projectile;
        if (this.available.length != 0) {
            projectile = this.available.pop(); // If there are any previously created projectiles available pop the last one and assign it to "projectile"
        } else {
            projectile = this.addProjectile(); // If there are no available projectiles, make a new one
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
        ArrayMethods.removeObject(this.inUse, projectile); // Remove the projectile from the "inUse" array.
        if (!ArrayMethods.containsObject(this.available, projectile)) {
            this.available.push(projectile); // Place the projectile back in the array of available projectiles
        }
    }

    // Adds a projectile to the pool ready for use
    private addProjectile(): Projectile {
        let newProjectile;
        // Check which type is defined for this pool and make a new projectile based on that type
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet(this.returnProjectile.bind(this), this.texture, this.hitTexture);
        } else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile(this.returnProjectile.bind(this), this.texture, this.hitTexture);
        } else {
            throw "Incorrect type specified for object pool";
        }
        if (newProjectile != null) {
            game.add.existing(newProjectile); // Add the projectile to the game
            this.spriteGroup.add(newProjectile);
            this.projectileCount++;
            return newProjectile;
        }
    }
}
