class PlayerUpgrades {

    private player: Player;
    private currentWeaponSet: Array<Weapon>;

    private plasmaUpgradeCount: number;
    private missileUpgradeCount: number;

    constructor(_player: Player) {
        this.player = _player;
        this.currentWeaponSet = new Array<Weapon>();
        this.plasmaUpgradeCount = 0;
        this.missileUpgradeCount = 0;
    }

    public nextPlasmaUpgrade(_plasmaUpgradeCount) {
        switch (_plasmaUpgradeCount) {
            case 1:
                return this.plasmaUpgradeOne();
            case 2:
                return this.plasmaUpgradeTwo();
            case 3:
                return this.plasmaUpgradeThree();
        }
    }

    public nextMissileUpgrade(_missileUpgradeCount) {
        switch (_missileUpgradeCount) {
            case 1:
                return this.missileUpgradeOne();
            case 2:
                return this.missileUpgradeTwo();
            case 3:
                return this.missileUpgradeThree();
        }
    }

    public plasmaUpgradeZero(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    public plasmaUpgradeOne(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(2);
        weaponSet[0] = new Weapon(new Vector2(-12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    public plasmaUpgradeTwo(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(3);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.1, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(-1, 0), this.player.vectorPosition, 0.15, -25, this.player.projectilePools[0], this.player.enemies);
        weaponSet[2] = new Weapon(new Vector2(1, 0), this.player.vectorPosition, 0.15, 25, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    public plasmaUpgradeThree(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(4);
        weaponSet[0] = new Weapon(new Vector2(-12, 0), this.player.vectorPosition, 0.1, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(12, 0), this.player.vectorPosition, 0.1, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[2] = new Weapon(new Vector2(-1, 0), this.player.vectorPosition, 0.15, -25, this.player.projectilePools[0], this.player.enemies);
        weaponSet[3] = new Weapon(new Vector2(1, 0), this.player.vectorPosition, 0.15, 25, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    public missileUpgradeOne(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.5, 0, this.player.projectilePools[1], this.player.enemies);
        return weaponSet;
    }
    public missileUpgradeTwo(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(2);
        weaponSet[0] = new Weapon(new Vector2(-30, 0), this.player.vectorPosition, 0.5, 0, this.player.projectilePools[1], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(30, 0), this.player.vectorPosition, 0.5, 0, this.player.projectilePools[1], this.player.enemies);
        return weaponSet;
    }
    public missileUpgradeThree(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.2, -30, this.player.projectilePools[1], this.player.enemies, function () {
            this.missileUpgradeThreeBehaviour(weaponSet[0]);
        }.bind(this));
        return weaponSet;
    }

    private angle: number = -30;
    private step: number = 1;
    private missileUpgradeThreeBehaviour(_missileWeapon: Weapon) {
        if (this.angle >= 30) {
            this.step = -1;
        } else if (this.angle <= -30) {
            this.step = 1;
        }
        this.angle += this.step;
        _missileWeapon.setAngle(this.angle);
    }
}