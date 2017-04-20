﻿class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;
    private projPool: ProjectilePool;
    private enemyManager: EnemyManager;

    create() {
        this.level = new Level('background');
        this.player = new Player(game);
        this.projPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.enemyManager = new EnemyManager(this.projPool);
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 0.1);
    }

    update() {
        this.enemyManager.update();
        this.level.update();
    }
}