class GameState extends Phaser.State
{
    private level: Level;
    private player: Player;
    private playerSprite: Phaser.Sprite;
    private plasmaBulletPool: ProjectilePool;
    private missilePool: ProjectilePool;

    create()
    {
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);

        this.player = new Player(this.game);
        this.level = new Level('background');
    }

    update() {
        this.level.update();
    }
}