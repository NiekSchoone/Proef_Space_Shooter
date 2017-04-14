class Level {

    private background: string;
    private scrollSpeed: number;
    private scrollY: number;

    private backgroundGroup: Phaser.Group;
    private bgTileSprite: Phaser.TileSprite;

    constructor(bg: string) {
        this.background = bg;
        this.scrollSpeed = 15.0;

        this.backgroundGroup = game.add.group();
        this.backgroundGroup.createMultiple(1, this.background, [1, 2, 3, 4], true);
        this.backgroundGroup.align(1, 4, 512, 2048);
        this.backgroundGroup.y = -4096;
        this.scrollY = 0;
    }

    private scrollBackground() {
        this.backgroundGroup.y += this.scrollSpeed;
        this.scrollY += this.scrollSpeed;
        if (this.scrollY > 2048) {
            this.backgroundGroup.previous();
            this.backgroundGroup.cursor.y -= 4*2048;
            this.scrollY -= 2048;
            this.backgroundGroup.cursor.frame = Math.floor(Math.random() * 4) + 1;
        }
    }

    public update() {
        this.scrollBackground();
    }
}