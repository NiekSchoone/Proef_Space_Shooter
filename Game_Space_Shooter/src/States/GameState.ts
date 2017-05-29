/**
 * @description State that contains the game screen
 */
class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private healthIndicator: HealthIndicator;
    private scoreIndicator: ScoreIndicator;
    private comboMeter: ComboMeter;
    private enemyManager: EnemyManager;
    private characterNumber: number;

    private playerPlasmaBulletPool: ProjectilePool;
    private enemyPlasmaBulletPool: ProjectilePool;
    private playerMissilePool: ProjectilePool;
    private enemyMissilePool: ProjectilePool;

    private shipGroup: Phaser.Group;
    private plasmaBulletGroup: Phaser.Group;
    private missileGroup: Phaser.Group;
    private uiGroup: Phaser.Group;

    /**
     * @description Execute initiation logic
     * @param _characterNumber
     */
    init(_characterNumber) {
        this.characterNumber = _characterNumber;
    }
    /**
     * @description Executes on the creation of this state
     */
    create() {
        menuMusic.stop();
        gameMusic.play();

        game.camera.flash(0x000000, 1000);

        this.level = new Level();

        this.plasmaBulletGroup = new Phaser.Group(game);
        this.missileGroup = new Phaser.Group(game);
        this.shipGroup = new Phaser.Group(game);
        this.uiGroup = new Phaser.Group(game);

        this.comboMeter = new ComboMeter(this.uiGroup);

        // Create the various pools for different projectiles
        this.playerPlasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET, this.plasmaBulletGroup, "plasma_bullet_player", "bullet_hit_blue");
        this.enemyPlasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET, this.plasmaBulletGroup, "plasma_bullet_enemy", "bullet_hit_red");
        this.playerMissilePool = new ProjectilePool(ProjectileType.MISSILE, this.missileGroup, "missile_player", "missile_hit");
        this.enemyMissilePool = new ProjectilePool(ProjectileType.MISSILE, this.missileGroup, "missile_enemy", "missile_hit");

        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager([this.enemyPlasmaBulletPool, this.enemyMissilePool], this.shipGroup, this.comboMeter);

        // Create a player
        this.player = new Player(this.characterNumber, [this.playerPlasmaBulletPool, this.playerMissilePool], 80, 40, this.enemyManager.getEnemies(), this.shipGroup, this.comboMeter);

        this.enemyManager.setTarget(this.player); // Set the target for the enemies

        this.healthIndicator = new HealthIndicator(this.player);
        this.player.healthIndicator = this.healthIndicator;
        this.uiGroup.add(this.healthIndicator);

        this.scoreIndicator = new ScoreIndicator();
        this.enemyManager.scoreCounter = this.scoreIndicator;
        this.uiGroup.add(this.scoreIndicator);

        let pauseButton = new Phaser.Button(game, 460, 7, "pause_button");
        pauseButton.onInputDown.add(function () { if (!game.paused) { game.paused = true; } });
        game.input.onDown.add(function () { if (game.paused) { game.paused = false; } }, this);
        game.add.existing(pauseButton);
    }
    /**
     * @description Executes every frame
     */
    update() {
        this.level.update();
        this.enemyManager.update();
    }
}