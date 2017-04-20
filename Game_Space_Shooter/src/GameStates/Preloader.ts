class Preloader extends Phaser.State {
    preload() {
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("plasma_bullet", "assets/Images/Placeholders/bullet.png");
        game.load.image("ship_player", "assets/Images/Placeholders/ship_player.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");
    }

    create()
    {
        game.state.start("Game");
    }
}