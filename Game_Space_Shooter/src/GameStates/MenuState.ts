class MenuState extends Phaser.State {

    private background: Phaser.Sprite;

    private startButton: Phaser.Button;
    private previousButton: Phaser.Button;
    private nextButton: Phaser.Button;

    private portraits: Array<Phaser.Sprite>;

    private playerPortrait1: Phaser.Sprite;
    private playerPortrait2: Phaser.Sprite;
    private playerPortrait3: Phaser.Sprite;
    private playerPortrait4: Phaser.Sprite;

    private currentPortrait: Phaser.Sprite;
    private currentCharacterNumber: number;

    create() {
        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');

        this.startButton = new Phaser.Button(game, 0, 532, 'menu_button_start', function () { this.startGame(); }, this);
        this.previousButton = new Phaser.Button(game, 18, 542, 'menu_button_arrow', function () { this.changeCharacter(-1); }, this);
        this.nextButton = new Phaser.Button(game, 494, 542, 'menu_button_arrow', function () { this.changeCharacter(1); }, this);
        this.nextButton.scale.set(-1, 1);

        this.portraits = new Array<Phaser.Sprite>();

        this.playerPortrait1 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_1');
        this.playerPortrait2 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_2');
        this.playerPortrait3 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_3');
        this.playerPortrait4 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_4');

        this.portraits.push(this.playerPortrait1);
        this.portraits.push(this.playerPortrait2);
        this.portraits.push(this.playerPortrait3);
        this.portraits.push(this.playerPortrait4);

        this.currentCharacterNumber = 0;
        this.currentPortrait = new Phaser.Sprite(game, 0, 0, this.portraits[this.currentCharacterNumber].texture);

        this.game.add.existing(this.background);
        this.game.add.existing(this.startButton);
        this.game.add.existing(this.previousButton);
        this.game.add.existing(this.nextButton);
        this.game.add.existing(this.currentPortrait);
    }

    private changeCharacter(_changeFactor: number) {
        this.currentCharacterNumber += _changeFactor;
        if (this.currentCharacterNumber < 0) {
            this.currentCharacterNumber = this.portraits.length - 1;
        } else if (this.currentCharacterNumber > this.portraits.length - 1) {
            this.currentCharacterNumber = 0;
        }
        this.currentPortrait.loadTexture(this.portraits[this.currentCharacterNumber].texture);
    }

    private startGame() {
        game.state.start("Game", true, false, this.currentCharacterNumber);
    }
}