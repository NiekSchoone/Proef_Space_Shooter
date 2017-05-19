class MenuState extends Phaser.State {

    private background: Phaser.Sprite;
    private welcomeSprite: Phaser.Sprite;
    private overlay: Phaser.Sprite;
    private animationSprite: Phaser.Sprite;

    private startButton: Phaser.Button;
    private previousButton: Phaser.Button;
    private nextButton: Phaser.Button;

    private portraits: Array<Phaser.Sprite>;
    private ships: Array<Phaser.Sprite>;

    private currentPortrait: Phaser.Sprite;
    private currentShip: Phaser.Sprite;
    private currentCharacterNumber: number;

    create() {
        //gameMusic.stop();

        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');
        this.welcomeSprite = new Phaser.Sprite(game, 0, 0, 'menu_welcome_bar'); 
        this.overlay = new Phaser.Sprite(game, -20, 170, "menu_selection_overlay");
        this.animationSprite = new Phaser.Sprite(game, 0, 600, "character_select_animation");

        this.startButton = new Phaser.Button(game, 262, 665, 'menu_button_start', function () { this.startGame(); }, this);
        this.previousButton = new Phaser.Button(game, 5, 640, 'menu_button_arrow', function () { this.changeCharacter(-1); }, this);
        this.nextButton = new Phaser.Button(game, 507, 640, 'menu_button_arrow', function () { this.changeCharacter(1); }, this);
        this.nextButton.scale.set(-1, 1);
        this.startButton.anchor.set(0.5);

        this.animationSprite.animations.add("anim");
        this.animationSprite.play("anim", 24, true);

        this.portraits = new Array<Phaser.Sprite>();
        this.ships = new Array<Phaser.Sprite>();

        let playerPortrait1 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_1');
        let playerPortrait2 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_2');
        let playerPortrait3 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_3');
        let playerPortrait4 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_4');

        let ship1 = new Phaser.Sprite(game, 0, 0, 'ships_player', 0);
        let ship2 = new Phaser.Sprite(game, 0, 0, 'ships_player', 1);
        let ship3 = new Phaser.Sprite(game, 0, 0, 'ships_player', 2);
        let ship4 = new Phaser.Sprite(game, 0, 0, 'ships_player', 3);

        this.portraits.push(playerPortrait1);
        this.portraits.push(playerPortrait2);
        this.portraits.push(playerPortrait3);
        this.portraits.push(playerPortrait4);
        this.ships.push(ship1);
        this.ships.push(ship2);
        this.ships.push(ship3);
        this.ships.push(ship4);

        this.currentCharacterNumber = 0;
        this.currentPortrait = new Phaser.Sprite(game, 135, 165, this.portraits[this.currentCharacterNumber].texture);
        this.currentPortrait.scale.set(0.7);
        this.currentShip = new Phaser.Sprite(game, 27, 410, this.ships[this.currentCharacterNumber].texture);

        game.add.existing(this.background);
        game.add.existing(this.welcomeSprite);
        game.add.existing(this.overlay);
        game.add.existing(this.animationSprite);
        game.add.existing(this.startButton);
        game.add.existing(this.previousButton);
        game.add.existing(this.nextButton);
        game.add.existing(this.currentPortrait);
        game.add.existing(this.currentShip);
    }

    private changeCharacter(_changeFactor: number) {
        this.currentCharacterNumber += _changeFactor;
        if (this.currentCharacterNumber < 0) {
            this.currentCharacterNumber = this.portraits.length - 1;
        } else if (this.currentCharacterNumber > this.portraits.length - 1) {
            this.currentCharacterNumber = 0;
        }
        this.currentPortrait.loadTexture(this.portraits[this.currentCharacterNumber].texture);
        this.currentShip.loadTexture(this.ships[this.currentCharacterNumber].texture);
    }

    private startGame() {
        game.state.start("Game", true, false, this.currentCharacterNumber);
    }
}