class MenuState extends Phaser.State {

    private background: Phaser.Sprite;

    private startButton: Phaser.Button;
    private rightButton: Phaser.Button;
    private leftButton: Phaser.Button;

    private portraits: Array<Phaser.Sprite>;

    private playerPortrait1: Phaser.Sprite;
    private playerPortrait2: Phaser.Sprite;
    private playerPortrait3: Phaser.Sprite;
    private playerPortrait4: Phaser.Sprite;

    private currentPortrait: Phaser.Sprite;

    create() {
        this.background.loadTexture('menu_background');

        this.startButton.loadTexture('button_start');
        this.rightButton.loadTexture('button_right');
        this.leftButton.loadTexture('button_left');

        this.portraits = new Array<Phaser.Sprite>();

        this.playerPortrait1.loadTexture('portrait_1');
        this.playerPortrait1.loadTexture('portrait_2');
        this.playerPortrait1.loadTexture('portrait_3');
        this.playerPortrait1.loadTexture('portrait_4');

        this.portraits.push(this.playerPortrait1);
        this.portraits.push(this.playerPortrait2);
        this.portraits.push(this.playerPortrait3);
        this.portraits.push(this.playerPortrait4);
    }
}