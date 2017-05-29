/**
 * @description Class containing methods to upgrade the player's weapons
 */
class PlayerUpgrades {

    private player: Player;
    private currentWeaponSet: Array<Weapon>;

    constructor(_player: Player) {
        this.player = _player;
        this.currentWeaponSet = new Array<Weapon>();
    }
    /**
     * @description Returns the next set of plasma weapons
     * @param _plasmaUpgradeCount
     */
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
    /**
     * @description Returns the next set of missile weapons
     * @param _missileUpgradeCount
     */
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
    /**
     * @description Returns the plasma weapon system that the player should start with
     */
    public plasmaUpgradeZero(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    /**
     * @description Returns the plasma weapon system that the player gets after picking up the first plasma upgrade
     */
    public plasmaUpgradeOne(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(2);
        weaponSet[0] = new Weapon(new Vector2(-12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    /**
     * @description Returns the plasma weapon system that the player gets after picking up the second plasma upgrade
     */
    public plasmaUpgradeTwo(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(3);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(-1, 0), this.player.vectorPosition, 0.2, -25, this.player.projectilePools[0], this.player.enemies);
        weaponSet[2] = new Weapon(new Vector2(1, 0), this.player.vectorPosition, 0.2, 25, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    /**
     * @description Returns the plasma weapon system that the player gets after picking up the third plasma upgrade
     */
    public plasmaUpgradeThree(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(4);
        weaponSet[0] = new Weapon(new Vector2(-12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(12, 0), this.player.vectorPosition, 0.15, 0, this.player.projectilePools[0], this.player.enemies);
        weaponSet[2] = new Weapon(new Vector2(-1, 0), this.player.vectorPosition, 0.2, -25, this.player.projectilePools[0], this.player.enemies);
        weaponSet[3] = new Weapon(new Vector2(1, 0), this.player.vectorPosition, 0.2, 25, this.player.projectilePools[0], this.player.enemies);
        return weaponSet;
    }
    /**
     * @description Returns the missile weapon system that the player gets after picking up the first missile upgrade
     */
    public missileUpgradeOne(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.9, 0, this.player.projectilePools[1], this.player.enemies);
        return weaponSet;
    }
    /**
     * @description Returns the missile weapon system that the player gets after picking up the second missile upgrade
     */
    public missileUpgradeTwo(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(2);
        weaponSet[0] = new Weapon(new Vector2(-30, 0), this.player.vectorPosition, 0.85, 0, this.player.projectilePools[1], this.player.enemies);
        weaponSet[1] = new Weapon(new Vector2(30, 0), this.player.vectorPosition, 0.85, 0, this.player.projectilePools[1], this.player.enemies);
        return weaponSet;
    }
    /**
     * @description Returns the missile weapon system that the player gets after picking up the third missile upgrade
     */
    public missileUpgradeThree(): Array<Weapon> {
        let weaponSet = new Array<Weapon>(1);
        weaponSet[0] = new Weapon(new Vector2(), this.player.vectorPosition, 0.35, -30, this.player.projectilePools[1], this.player.enemies, function () {
            this.missileUpgradeThreeBehaviour(weaponSet[0]);
        }.bind(this));
        return weaponSet;
    }

    private step: number = 1;
    /**
     * @description A behaviour defined for the third missile upgrade
     * @param _missileWeapon
     */
    private missileUpgradeThreeBehaviour(_missileWeapon: Weapon) {
        let angle = _missileWeapon.getAngle();
        if (angle >= 30) {
            this.step = -1;
        } else if (angle <= -30) {
            this.step = 1;
        }
        angle += this.step;
        _missileWeapon.setAngle(angle);
    }
}