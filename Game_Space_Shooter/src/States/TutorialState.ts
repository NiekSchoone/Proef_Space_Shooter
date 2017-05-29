/**
 * @description State that holds the tutorial screen
 */
class TuorialState extends Phaser.State {

    private background: Phaser.Sprite;
    private tutorials: Array<Phaser.Sprite>;
    private dots: Phaser.Sprite;
    private clicks: number;
    private clicked: boolean;
    private clickSound: Phaser.Sound;

    /**
     * @description Executes on the creation of this state
     */
    create() {
        this.clicked = false;
        this.clicks = 0;
        this.background = new Phaser.Sprite(game, 0, 0, 'menu_background');
        let chat: Phaser.Sprite = new Phaser.Sprite(game, 0, 0, 'chat_logo');
        this.dots = new Phaser.Sprite(game, 400, 300, 'tutorial_dots');
        game.add.existing(this.background);
        game.add.existing(chat);
        game.add.existing(this.dots);

        this.clickSound = new Phaser.Sound(game, "button_click", 1, false);

        this.tutorials = new Array<Phaser.Sprite>();
        this.tutorials[0] = new Phaser.Sprite(game, 256, 100, 'tutorial_1');
        this.tutorials[0].anchor.x = .5;
        game.add.existing(this.tutorials[0]);
        this.tutorials[1] = new Phaser.Sprite(game, 256, 300, 'tutorial_2');
        this.tutorials[1].anchor.x = .5;
        this.tutorials[2] = new Phaser.Sprite(game, 256, 500, 'tutorial_3');
        this.tutorials[2].anchor.x = .5;

        game.camera.flash(0x000000, 1000);
    }
    /**
     * @description Executes every frame
     */
    update() {
        if (this.clicked == false && game.input.activePointer.isDown) {
            this.clicked = true;
            this.nextTutorial();
        }
        else if (this.clicked == true && game.input.activePointer.isDown == false) {
            this.clicked = false;
        }
    }
    /**
     * @description Displays the next tutorial screen and switches to the Menu state
     */
    private nextTutorial() {
        this.clickSound.play();
        this.clicks++
        if (this.clicks < this.tutorials.length) {
            game.add.existing(this.tutorials[this.clicks]);
            this.dots.y += 200;
        } else {
            this.camera.onFadeComplete.add(function () {
                game.state.start("Menu", true, false);
            });
            game.camera.fade(0x000000, 1000);
        }
    }
}