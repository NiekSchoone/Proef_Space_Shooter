class ComboMeter extends Phaser.Sprite {

    private maxComboFuel: number;
    private currentComboFuel: number;
    private bars: number;
    private barSections: Array<Phaser.Sprite>;

    private comboReady: boolean;

    constructor() {
        super(game, 0, 0);

        this.maxComboFuel = 100;
        this.currentComboFuel = 100;
        this.bars = 8;
        this.barSections = new Array<Phaser.Sprite>();
        this.comboReady = false;

        this.setBarSprites();
        game.add.existing(this);

        this.onMeterChange(this.currentComboFuel);
    }

    private setBarSprites() {
        var step = 10;
        for (var i = 0; i < this.bars; i++) {
            var x = 20;
            var y = 600 + step * i;

            var bar = new Phaser.Sprite(game, x, y, "health_bar");
            bar.anchor.set(0.5);

            game.add.existing(bar);
            this.barSections.push(bar);
        }
    }

    // Executed on a change in the players HP
    public onMeterChange(_amount: number) {
        // Calculate the number of health blocks that will be set invisible;
        if (this.currentComboFuel < this.maxComboFuel) {
            this.currentComboFuel += _amount;

        }
        if (this.currentComboFuel >= this.maxComboFuel) {
            this.currentComboFuel = this.maxComboFuel;
            this.comboReady = true;
        }
        let sum = Math.ceil((this.currentComboFuel / this.maxComboFuel) * 10);
        let arrayBars = this.bars - 1;
        for (var i = 0; i < this.bars; i++) {
            if (i < sum) {
                this.barSections[arrayBars - i].visible = true;
            } else {
                this.barSections[arrayBars - i].visible = false;
            }
        }
    }

    get ComboReady(): boolean{
        return this.comboReady;
    }
}