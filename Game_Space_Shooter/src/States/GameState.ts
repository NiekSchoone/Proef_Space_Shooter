class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private healthIndicator: HealthIndicator;

    private plasmaBulletPool: ProjectilePool;
    private missilePool: ProjectilePool;
    private projectilePools: ProjectilePool[];

    private enemyManager: EnemyManager;

    private characterNumber: number;

    init(_characterNumber) {
        this.characterNumber = _characterNumber;
    }

    create() {
        this.level = new Level();
        this.projectilePools = new Array<ProjectilePool>();

        // Create the various pools for different projectiles
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.projectilePools.push(this.plasmaBulletPool);
        this.projectilePools.push(this.missilePool);

        // Create a player
        this.player = new Player(this.projectilePools, 50);

        // Create the manager that keeps track of all the enemies in the game
        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);

        this.player.setTargets(this.enemyManager.getEnemies());

        //this.healthIndicator = new HealthIndicator();
    }

    update() {
        this.level.update();
        this.enemyManager.update();
    }
}