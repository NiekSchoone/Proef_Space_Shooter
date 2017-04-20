﻿class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;

    private plasmaBulletPool: ProjectilePool;
    private missilePool: ProjectilePool;

    private enemyManager: EnemyManager;

    create() {
        this.level = new Level();
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.player = new Player(game);
        this.enemyManager = new EnemyManager(this.plasmaBulletPool);
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 0.1);
    }

    update() {
        this.enemyManager.update();
        this.level.update();
    }
}