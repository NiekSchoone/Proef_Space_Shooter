class MenuState extends Phaser.State {

    private background: Phaser.Sprite;
    private welcomeSprite: Phaser.Sprite;
    private nameOverlay: Phaser.Sprite;
    private overlay: Phaser.Sprite;
    private animationSprite: Phaser.Sprite;

    private startButton: Phaser.Button;
    private previousButton: Phaser.Button;
    private nextButton: Phaser.Button;

    private portraits: Array<Phaser.Sprite>;
    private ships: Array<Phaser.Sprite>;
    private names: Array<Phaser.Text>;

    private currentPortrait: Phaser.Sprite;
    private currentShip: Phaser.Sprite;
    private currentName: Phaser.Text;
    private currentCharacterNumber: number;

    private buttonClickSound: Phaser.Sound;
    private selectSounds: Array<Phaser.Sound>;



    create() {
        gameMusic.stop();
        if (!menuMusic.isPlaying) {
            menuMusic.play();
        }

        game.camera.flash(0x000000, 1000);

        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');
        this.welcomeSprite = new Phaser.Sprite(game, 0, 820, 'menu_welcome_bar');
        this.nameOverlay = new Phaser.Sprite(game, 0, 0, 'menu_name_overlay');
        this.overlay = new Phaser.Sprite(game, -20, 170, "menu_selection_overlay");
        this.animationSprite = new Phaser.Sprite(game, 0, 600, "character_select_animation");

        this.buttonClickSound = new Phaser.Sound(game, "button_click", 1, false);
        let entranceSound = new Phaser.Sound(game, "menu_entry", 1, false);
        entranceSound.play();

        this.startButton = new Phaser.Button(game, 262, 665, 'menu_button_start', function () { this.startGame(); this.buttonClickSound.play(); }, this);
        this.previousButton = new Phaser.Button(game, 5, 640, 'menu_button_arrow', function () { this.changeCharacter(-1); this.buttonClickSound.play(); }, this);
        this.nextButton = new Phaser.Button(game, 507, 640, 'menu_button_arrow', function () { this.changeCharacter(1); this.buttonClickSound.play(); }, this);
        this.nextButton.scale.set(-1, 1);
        this.startButton.anchor.set(0.5);

        this.animationSprite.animations.add("anim");
        this.animationSprite.play("anim", 24, true);

        this.portraits = new Array<Phaser.Sprite>();
        this.ships = new Array<Phaser.Sprite>();
        this.names = new Array<Phaser.Text>();
        this.selectSounds = new Array<Phaser.Sound>();

        let playerPortrait1 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_1');
        let playerPortrait2 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_2');
        let playerPortrait3 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_3');
        let playerPortrait4 = new Phaser.Sprite(game, 0, 0, 'menu_portrait_4');

        let ship1 = new Phaser.Sprite(game, 0, 0, 'ships_player', 0);
        let ship2 = new Phaser.Sprite(game, 0, 0, 'ships_player', 1);
        let ship3 = new Phaser.Sprite(game, 0, 0, 'ships_player', 2);
        let ship4 = new Phaser.Sprite(game, 0, 0, 'ships_player', 3);

        let name1 = new Phaser.Text(game, 0, 0, "Hybrid Hyun");
        let name2 = new Phaser.Text(game, 0, 0, "Danger Dia");
        let name3 = new Phaser.Text(game, 0, 0, "Killer Kimmy");
        let name4 = new Phaser.Text(game, 0, 0, "Spacey Stacey");

        let select1 = new Phaser.Sound(game, "select_hyun", 1, false);
        let select2 = new Phaser.Sound(game, "select_dia", 1, false);
        let select3 = new Phaser.Sound(game, "select_kimmy", 1, false);
        let select4 = new Phaser.Sound(game, "select_stacey", 1, false);
        
        this.portraits.push(playerPortrait1);
        this.portraits.push(playerPortrait2);
        this.portraits.push(playerPortrait3);
        this.portraits.push(playerPortrait4);
        this.ships.push(ship1);
        this.ships.push(ship2);
        this.ships.push(ship3);
        this.ships.push(ship4);
        this.names.push(name1);
        this.names.push(name2);
        this.names.push(name3);
        this.names.push(name4);
        this.selectSounds.push(select1);
        this.selectSounds.push(select2);
        this.selectSounds.push(select3);
        this.selectSounds.push(select4);

        this.currentCharacterNumber = 0;
        this.currentPortrait = new Phaser.Sprite(game, 51, 170, this.portraits[this.currentCharacterNumber].texture);
        this.currentShip = new Phaser.Sprite(game, 27, 410, this.ships[this.currentCharacterNumber].texture);
        this.currentName = new Phaser.Text(game, 256, 56, this.names[this.currentCharacterNumber].text, { font: "normal 52px ocra", fill: "#b3ffe2", align: "center" });
        this.currentName.anchor.set(0.5);

        game.add.existing(this.background);
        game.add.existing(this.welcomeSprite);
        game.add.existing(this.animationSprite);
        game.add.existing(this.startButton);
        game.add.existing(this.previousButton);
        game.add.existing(this.nextButton);
        game.add.existing(this.currentPortrait);
        game.add.existing(this.currentShip);
        game.add.existing(this.overlay);
        game.add.existing(this.nameOverlay);
        game.add.existing(this.currentName);
    }

    private changeCharacter(_changeFactor: number) {
        this.currentCharacterNumber += _changeFactor;
        console.log(this.currentCharacterNumber);
        if (this.currentCharacterNumber < 0) {
            this.currentCharacterNumber = this.portraits.length - 1;
        } else if (this.currentCharacterNumber > this.portraits.length - 1) {
            this.currentCharacterNumber = 0;
        }
        this.currentPortrait.loadTexture(this.portraits[this.currentCharacterNumber].texture);
        this.currentShip.loadTexture(this.ships[this.currentCharacterNumber].texture);
        this.currentName.setText(this.names[this.currentCharacterNumber].text);
    }

    private startGame() {
        let _this = this;
        this.camera.onFadeComplete.add(function () {
            game.state.start("Game", true, false, _this.currentCharacterNumber);
        });
        game.camera.fade(0x000000, 1000);
        this.selectSounds[this.currentCharacterNumber].play();
    }
}