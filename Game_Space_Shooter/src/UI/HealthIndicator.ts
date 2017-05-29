/**
 * @description A sprite that indicates the amount of health the player has left
 */
class HealthIndicator extends Phaser.Sprite{

    private bars: number;
    private barSections: Array<Phaser.Sprite>;
    private player: Player;

    constructor(_player: Player) {
        super(game, 0, 0, "ui_overlay");

        this.player = _player;
        this.bars = 8;
        this.barSections = new Array<Phaser.Sprite>();
        this.setBarSprites();
        game.add.existing(this);
        this.onHealthChange();
    }
    /**
     * @description Create the visual representation of the health bars
     */
    private setBarSprites() {
        var angle = -0.95;
        var step = (Math.PI) / 7.15;
        for (var i = 0; i < this.bars; i++) {
            var x = 434 + (57.5 * Math.cos(angle));
            var y = 804 + (57.5 * Math.sin(angle));

            var bar = new Phaser.Sprite(game, x, y, "health_bar");
            bar.rotation = angle;
            bar.anchor.set(0.5);

            game.add.existing(bar);
            this.barSections.push(bar);

            angle += step;
        }
    }
    /**
     * @description Handles what happens on a change in the players health points
     */
    public onHealthChange() {
        let sum = Math.ceil((this.player.currentHP / this.player.maxHP) * 8); // Calculate the number of health blocks that will be set invisible
        let arrayBars = this.bars - 1;
        for (var i = 0; i < this.bars; i++) {
            if (i < sum) {
                this.barSections[arrayBars - i].visible = true;
            } else {
                this.barSections[arrayBars - i].visible = false;
            }
        }
    }
}