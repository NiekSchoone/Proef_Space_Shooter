class EnemyWeapons {

    private projectilePools: ProjectilePool[];
    private player: Player;
    constructor(_projectiles: ProjectilePool[], _player: Player) {
        this.projectilePools = _projectiles;
        this.player = _player;

    }

    returnWeapons(_index: number, _shipPos: Vector2): Array<Weapon> {
        switch (_index) {
            case 0:
                
                return this.weaponSetOne(_shipPos);
                
        }
       
    }

    private weaponSetOne(_shipPos: Vector2): Array<Weapon> {
        let weaponset: Array<Weapon> = new Array<Weapon>();
        weaponset[0] = new Weapon(new Vector2(-15, 0), _shipPos, 2, 180, this.projectilePools[0], [this.player]);
        weaponset[1] = new Weapon(new Vector2(15, 0), _shipPos, 2, 180, this.projectilePools[0], [this.player]);
        return weaponset;

    }
}