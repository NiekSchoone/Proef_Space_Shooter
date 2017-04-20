class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;
    private enemyManager: EnemyManager;
    create() {
        this.level = new Level('background');
        this.player = new Player(game);
        this.enemyManager = new EnemyManager();
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 1);
    }

    update() {
        this.enemyManager.update();
        this.level.update();
    }
}