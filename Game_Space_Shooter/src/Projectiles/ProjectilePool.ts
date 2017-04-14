class ProjectilePool {

    private available: Projectile[];
    private inUse: Projectile[];

    constructor() {
        
    }

    public getProjectile(): Projectile {
        if (this.available.length > 0) {
            let projectile = this.available[0];

            return projectile;
        } else {
            return this.available[0] as Missile;
        }
    }

    public returnProjectile() {

    }

    public addProjectile() {
        let newProjectile = new Projectile(new Vector2(0, 0), new Vector2(0, 0));
        this.available.push(newProjectile);
    }
}
