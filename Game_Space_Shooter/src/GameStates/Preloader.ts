﻿class Preloader extends Phaser.State {
    preload() {
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("tempship", "assets/Images/Placeholders/alienspaceship.png");
        game.load.image("plasma_bullet", "assets/Images/Placeholder/bullet.png");
    }

    create()
    {
        game.state.start("Game");
    }
}