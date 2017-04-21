class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;

    private plasmaBulletPool: ProjectilePool;
    private missilePool: ProjectilePool;
    private projectilePools: ProjectilePool[];

    private enemyManager: EnemyManager;

    create() {
        this.level = new Level();
        this.projectilePools = new Array<ProjectilePool>();
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.projectilePools.push(this.plasmaBulletPool);

        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.projectilePools.push(this.missilePool);

        this.player = new Player(this.projectilePools, 80);

        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 0.5);

        this.player.setTargets(this.enemyManager.getEnemies());

        game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    update() {
        this.level.update();
    }
}