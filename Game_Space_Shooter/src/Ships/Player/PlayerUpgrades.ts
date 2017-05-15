class PlayerUpgrades {

    private player: Player;
    private currentWeaponSet: Array<NewWeapon>;

    constructor(_player: Player) {
        this.player = _player;
        this.currentWeaponSet = new Array<NewWeapon>();
    }

    public plasmaUpgradeZero(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    public plasmaUpgradeOne(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(2);
        newWeaponSet[0] = new NewWeapon(new Vector2(-12, 0), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[1] = new NewWeapon(new Vector2(12, 0), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    public plasmaUpgradeTwo(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(3);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.3, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[1] = new NewWeapon(new Vector2(-1, 0), this.player.vectorPosition, 0.4, -25, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[2] = new NewWeapon(new Vector2(1, 0), this.player.vectorPosition, 0.4, 25, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }
    public plasmaUpgradeThree(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(4);
        newWeaponSet[0] = new NewWeapon(new Vector2(-12, 0), this.player.vectorPosition, 0.3, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[1] = new NewWeapon(new Vector2(12, 0), this.player.vectorPosition, 0.3, 0, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[2] = new NewWeapon(new Vector2(-1, 0), this.player.vectorPosition, 0.4, -25, this.player.projectilePools[0], this.player.enemies);
        newWeaponSet[3] = new NewWeapon(new Vector2(1, 0), this.player.vectorPosition, 0.4, 25, this.player.projectilePools[0], this.player.enemies);
        return newWeaponSet;
    }

    public missileUpgradeOne(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.4, 0, this.player.projectilePools[1], this.player.enemies);
        return newWeaponSet;
    }
    public missileUpgradeTwo(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(-10, 0), this.player.vectorPosition, 0.35, 0, this.player.projectilePools[1], this.player.enemies);
        newWeaponSet[0] = new NewWeapon(new Vector2(10, 0), this.player.vectorPosition, 0.35, 0, this.player.projectilePools[1], this.player.enemies);
        return newWeaponSet;
    }
    public missileUpgradeThree(): Array<NewWeapon> {
        let newWeaponSet = new Array<NewWeapon>(1);
        newWeaponSet[0] = new NewWeapon(new Vector2(), this.player.vectorPosition, 0.2, -30, this.player.projectilePools[1], this.player.enemies, function () {
            this.missileUpgradeThreeBehaviour(newWeaponSet[0]);
        }.bind(this));
        return newWeaponSet;
    }

    private angle: number = -30;
    private step: number = 1;
    private missileUpgradeThreeBehaviour(_missileWeapon: NewWeapon) {
        if (this.angle >= 30) {
            this.step = -1;
        } else if (this.angle <= -30) {
            this.step = 1;
        }
        this.angle += this.step;
        _missileWeapon.setAngle(this.angle);
    }
}