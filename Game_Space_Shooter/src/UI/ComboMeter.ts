/**
 * @description Handles the visual representation of when a combo is ready to be executed
 */
class ComboMeter {
    private maxComboFuel: number;
    private currentComboFuel: number;
    private bars: number;
    private barSections: Array<Phaser.Sprite>;
    private comboReady: boolean;
    private spriteGroup: Phaser.Group;

    constructor(_group: Phaser.Group) {
        this.maxComboFuel = 100;
        this.currentComboFuel = 0;
        this.bars = 8;
        this.barSections = new Array<Phaser.Sprite>();
        this.comboReady = false;
        this.spriteGroup = _group;
        this.setBarSprites();

        this.onMeterChange(0);
    }
    /**
     * @description Create the visual representation of the combo meter
     */
    private setBarSprites() {
        var step = 20;
        for (var i = 0; i < this.bars; i++) {
            var x = 34;
            var y = 740 + step * i;

            let bar;
            if (i == 0) {
                bar = new Phaser.Sprite(game, x, y-7, "combo_section_end");
                bar.scale.set(1, -1);
            } else if (i == this.bars-1) {
                bar = new Phaser.Sprite(game, x, y, "combo_section_end");
            } else {
                bar = new Phaser.Sprite(game, x, y, "combo_section_middle");
            }
            bar.anchor.set(0.5);

            this.spriteGroup.add(bar);
            game.add.existing(bar);
            this.barSections.push(bar);
        }
    }
    /**
     * @description Applies a given value to the current amount of combo fuel
     * @param _amount
     */
    public onMeterChange(_amount: number) {
        this.currentComboFuel += _amount;

        if (this.currentComboFuel < 0) {
            this.currentComboFuel = 0;
        }
        if (this.currentComboFuel >= this.maxComboFuel) {
            this.currentComboFuel = this.maxComboFuel;
            this.comboReady = true;
        } else {
            this.comboReady = false;
        }
        let sum = Math.ceil((this.currentComboFuel / this.maxComboFuel) * 8); // Calculate the number of combo sprites that will be set to a lower alpha value.
        let arrayBars = this.bars - 1;
        for (var i = 0; i < this.bars; i++) {
            if (i < sum) {
                this.barSections[arrayBars - i].alpha = 1;
            } else {
                this.barSections[arrayBars - i].alpha = 0.5;
            }
        }
    }

    get ComboReady(): boolean{
        return this.comboReady;
    }
}