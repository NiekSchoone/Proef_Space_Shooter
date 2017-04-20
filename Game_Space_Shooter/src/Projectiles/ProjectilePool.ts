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
            projectile.visible = true;
            return projectile;
        } else {
            projectile = this.addProjectile();
            this.inUse.push(projectile);
            projectile.visible = true;
            return projectile;
        }
    }

    private returnProjectile(projectile: Projectile) {
        console.log(this.inUse);
        let index = this.inUse.indexOf(projectile, projectile.projectileIndex);
        this.inUse.splice(index, 1);
        this.available.push(projectile);
        projectile.resetValues();
    }

    private addProjectile(): Projectile {
        console.log("adding projectile")
        let newProjectile;
        if (this.poolType == ProjectileType.PLASMABULLET) {
            newProjectile = new PlasmaBullet(new Vector2(0, 0), 'plasma_bullet', this.returnProjectile.bind(this));
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            game.add.existing(newProjectile);
            return newProjectile;
        } else if (this.poolType == ProjectileType.MISSILE) {
            newProjectile = new Missile(new Vector2(0, 0), 'missile', this.returnProjectile.bind(this));
            newProjectile.projectileIndex = this.projectileCount;
            this.projectileCount++;
            game.add.existing(newProjectile);
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
