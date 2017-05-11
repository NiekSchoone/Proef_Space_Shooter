class BootState extends Phaser.State {

    private background: Phaser.Sprite;
    private title: Phaser.Sprite;
    private insertCoin: Phaser.Sprite;

    create() {
        this.background = new Phaser.Sprite(game, 0, 0, 'startscreen_background');
        this.title = new Phaser.Sprite(game, 0, -400, 'startscreen_title');
        this.insertCoin = new Phaser.Sprite(game, game.width/2, 460, 'insert_coin_text');

        this.insertCoin.anchor.set(0.5);

        game.add.tween(this.title).to({ y: -60 }, 2400, Phaser.Easing.Bounce.Out, true);
        game.add.tween(this.insertCoin).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        this.game.add.existing(this.background);
        this.game.add.existing(this.title);
        this.game.add.existing(this.insertCoin);
    }

    update() {
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.startMenu();
        }
    }

    private startMenu() {
        game.state.start("Menu", true, false);
    }
}