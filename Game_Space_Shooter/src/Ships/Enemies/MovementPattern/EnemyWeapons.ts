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
                return this.setZero(_shipPos);
            case 1:
                return this.setOne(_shipPos);
            case 2:
                return this.setTwo(_shipPos);
            case 3:
                return this.setThree(_shipPos);
            case 4:
                return this.setFour(_shipPos);
        }
    }

    private setZero(_shipPos: Vector2): Array<Weapon> {
        let weaponset: Array<Weapon> = new Array<Weapon>();
        weaponset[0] = new Weapon(new Vector2(), _shipPos, 1.5, 180, this.projectilePools[0], [this.player]);
        return weaponset;
    }
    private setOne(_shipPos: Vector2): Array<Weapon> {
        let weaponset: Array<Weapon> = new Array<Weapon>();
        weaponset[0] = new Weapon(new Vector2(), _shipPos, 2.5, 180, this.projectilePools[1], [this.player]);
        return weaponset;
    }

    private setTwo(_shipPos: Vector2): Array<Weapon> {
        let weaponset: Array<Weapon> = new Array<Weapon>();
        weaponset[0] = new Weapon(new Vector2(-10, 0), _shipPos, 1, 180, this.projectilePools[0], [this.player]);
        weaponset[1] = new Weapon(new Vector2(10, 0), _shipPos, 1, 180, this.projectilePools[0], [this.player]);
        return weaponset;
    }
    private setThree(_shipPos: Vector2): Array<Weapon> {
        let weaponset: Array<Weapon> = new Array<Weapon>();
        weaponset[0] = new Weapon(new Vector2(-20, 0), _shipPos, .7, 290, this.projectilePools[0], [this.player], function () {this.spinBehaviour(weaponset[0]); }.bind(this));
        weaponset[1] = new Weapon(new Vector2(-20, 0), _shipPos, .7, 270, this.projectilePools[0], [this.player], function () { this.spinBehaviour(weaponset[1]); }.bind(this));
        weaponset[2] = new Weapon(new Vector2(-20, 0), _shipPos, .7, 250, this.projectilePools[0], [this.player], function () { this.spinBehaviour(weaponset[2]); }.bind(this));
        return weaponset;
    }
    private setFour(_shipPos: Vector2): Array<Weapon> {
        let weaponset: Array<Weapon> = new Array<Weapon>();
        weaponset[0] = new Weapon(new Vector2(-5, 0), _shipPos, 1.5, 160, this.projectilePools[0], [this.player]);
        weaponset[1] = new Weapon(new Vector2(0, 0), _shipPos, 1.5, 180, this.projectilePools[0], [this.player]);
        weaponset[2] = new Weapon(new Vector2(5, 0), _shipPos, 1.5, 200, this.projectilePools[0], [this.player]);
        return weaponset;
    }
    private spinBehaviour(_Weapon: Weapon) {
        let angle = _Weapon.getAngle();
        angle += 1;
        _Weapon.setAngle(angle);
    }
}