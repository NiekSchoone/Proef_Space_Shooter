class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;

    private projPool: ProjectilePool;

    create() {
        this.level = new Level('background');
        this.player = new Player(game);
        this.projPool = new ProjectilePool(ProjectileType.PLASMABULLET);
    }

    update() {
        this.level.update();
    }
}