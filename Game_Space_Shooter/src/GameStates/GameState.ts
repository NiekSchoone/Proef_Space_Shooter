class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;

    private plasmaBulletPool: ProjectilePool;
    private missilePool: ProjectilePool;

    create() {
        this.level = new Level();
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.player = new Player(game);
    }

    update() {
        this.level.update();
    }
}