class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private healthIndicator: HealthIndicator;
    private scoreIndicator: ScoreIndicator;
    private comboMeter: ComboMeter;
    private enemyManager: EnemyManager;
    private characterNumber: number = 0;

    private playerPlasmaBulletPool: ProjectilePool;
    private enemyPlasmaBulletPool: ProjectilePool;
    private missilePool: ProjectilePool;

    private shipGroup: Phaser.Group;
    private plasmaBulletGroup: Phaser.Group;
    private missileGroup: Phaser.Group;
    private uiGroup: Phaser.Group;

    init(_characterNumber) {
        this.characterNumber = _characterNumber;
    }

    create() {
        menuMusic.stop();
        //gameMusic.play();

        this.level = new Level();

        this.plasmaBulletGroup = new Phaser.Group(game);
        this.missileGroup = new Phaser.Group(game);
        this.shipGroup = new Phaser.Group(game);
        this.uiGroup = new Phaser.Group(game);

        // Create the various pools for different projectiles
        this.playerPlasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET, this.plasmaBulletGroup, "plasma_bullet_player", "bullet_hit_blue");
        this.enemyPlasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET, this.plasmaBulletGroup, "plasma_bullet_enemy", "bullet_hit_red");
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE, this.missileGroup);

        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager([this.enemyPlasmaBulletPool, this.missilePool], this.shipGroup);

        // Create a player
        this.player = new Player(this.characterNumber, [this.playerPlasmaBulletPool, this.missilePool], 80, 40, this.enemyManager.getEnemies());
        this.shipGroup.add(this.player);

        this.enemyManager.setPlayer(this.player);

        this.healthIndicator = new HealthIndicator(this.player);
        this.player.healthIndicator = this.healthIndicator;
        this.uiGroup.add(this.healthIndicator);

        this.scoreIndicator = new ScoreIndicator();
        this.enemyManager.scoreCounter = this.scoreIndicator;
        this.uiGroup.add(this.scoreIndicator);
    }

    update() {
        this.level.update();
        this.enemyManager.update();
    }
}