class HealthIndicator extends Phaser.Sprite{

    private bars: number;
    private barSections: Array<Phaser.Sprite>;
    private player: Player;

    private maxHp: number;

    constructor(_player: Player) {
        super(game, 446, 828, "health_circle");

        this.player = _player;
        this.maxHp = this.player.maxHealth;
        this.bars = 8;
        this.barSections = new Array<Phaser.Sprite>();
        this.setSprites();
        this.anchor.set(0.5);
        game.add.existing(this);

        this.onHealthChange();
    }

    private setSprites() {
        var angle = -0.95;
        var step = (Math.PI) / 7.15;
        for (var i = 0; i < this.bars; i++) {
            var x = this.x-13.5 + 57.5 * Math.cos(angle);
            var y = this.y-1.5 + 57.5 * Math.sin(angle);

            var bar = new Phaser.Sprite(game, x, y, "health_bar");
            bar.rotation = angle;
            bar.anchor.set(0.5);

            game.add.existing(bar);
            this.barSections.push(bar);

            angle += step;
        }
    }

    // Executed on a change in the players HP
    public onHealthChange() {
        // Calculate the number of health blocks that will be set invisible;
        let sum = Math.ceil((this.currentHp / this.maxHp) * 8);
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