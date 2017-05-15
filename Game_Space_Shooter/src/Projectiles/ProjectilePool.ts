﻿class ProjectilePool {

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
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex); // Find the projectile in the "inUse" array by the identifier it has
        this.inUse.splice(index, 1); // Splice the projectile out of the array
        if (!this.containsProjectileByIndex(projectile.projectileIndex, this.available)) {
            this.available.push(projectile); // Place the projectile back in the array of available projectiles
        }
    }

    // Adds a projectile to the pool ready for use
    private addProjectile(): Projectile {
        let newProjectile;
        // Check which type is defined for this pool and make a new projectile based on that type
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet('plasma_bullet', this.returnProjectile.bind(this), "bullet_hit");
        } else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile('missile', this.returnProjectile.bind(this), "missile_hit");
        } else {
            throw "Incorrect type specified for object pool";
        }
        if (newProjectile != null) {
            newProjectile.projectileIndex = this.projectileCount; // Give the projectile an index number to find it in the array
            game.add.existing(newProjectile); // Add the projectile to the game
            this.projectileCount++;
            return newProjectile;
        }
    }

    private containsProjectileByIndex(index, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].projectileIndex === index) {
                return true;
            }
        }
        return false;
    }
}
