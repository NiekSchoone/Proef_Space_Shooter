/**
 * @description State that contains the game over screen
 */
class GameOver extends Phaser.State {

    private gameOverSprite: Phaser.Sprite;
    private insertCoinSprite: Phaser.Sprite;

    private entranceSound: Phaser.Sound;
    private exitSound: Phaser.Sound;

    /**
     * @description Executes on the creation of this state
     */
    create() {
        game.camera.flash(0x000000, 1000);

        this.entranceSound = new Phaser.Sound(game, "gameover_entry", 1, false);
        this.exitSound = new Phaser.Sound(game, "gameover_exit", 1, false);

        this.entranceSound.play();

        this.gameOverSprite = new Phaser.Sprite(game, 0, 0, "gameover_overlay");
        this.insertCoinSprite = new Phaser.Sprite(game, 0, 300, "gameover_insertcoin");

        game.add.existing(this.gameOverSprite);
        game.add.existing(this.insertCoinSprite);
        game.add.tween(this.insertCoinSprite).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
    /**
     * @description Executes every frame
     */
    update() {
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.changeState();
        }
    }
    /**
     * @description Starts the character selection menu
     */
    private changeState() {
        this.camera.onFadeComplete.add(function () {
            game.state.start("Menu", true);
        });
        game.camera.fade(0x000000, 1000);
        this.exitSound.play();
    }
}