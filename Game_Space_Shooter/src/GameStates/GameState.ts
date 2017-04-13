class GameState extends Phaser.State {

    private level: Level;

    create() {
        this.level = new Level('background');
    }

    update() {
        this.level.update();
    }
}