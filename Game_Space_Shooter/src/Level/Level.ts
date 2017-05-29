/**
 * @description Class containing the background of the game
 */
class Level {

    private scrollSpeed: number;
    private scrollY: number;

    private backgroundGroup: Phaser.Group;
    private bgTileSprite: Phaser.TileSprite;

    constructor() {
        this.scrollSpeed = 20.0;
        this.scrollY = 0;

        this.backgroundGroup = game.add.group();
        this.backgroundGroup.createMultiple(1, 'game_background', [1, 2, 3, 4], true);
        this.backgroundGroup.align(1, 4, 512, 2048);
        this.backgroundGroup.y = -4096;
    }
    /**
     * @description Scrolls and displays random chunks of the background
     */
    private scrollBackground() {
        this.backgroundGroup.y += this.scrollSpeed;
        this.scrollY += this.scrollSpeed;
        if (this.scrollY > 2048) {
            this.backgroundGroup.previous();
            this.backgroundGroup.cursor.y -= 4 * 2048;
            this.scrollY -= 2048;
            this.backgroundGroup.cursor.frame = Math.floor(Math.random() * 4) + 1;
        }
    }
    /**
     * @description Executes every frame
     */
    public update() {
        this.scrollBackground();
    }
}