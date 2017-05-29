/**
 * @description Text object that contains the score of the game
 */
class ScoreIndicator extends Phaser.Text {

    private style: Phaser.PhaserTextStyle;
    private currentScore: number;

    constructor() {
        super(game, 20, 20, "0");
        this.style = { font: "normal 30px ocra", fill: "#b3ffe2", align: "center" };
        this.setStyle(this.style);
        this.currentScore = 0;
        game.add.existing(this);
    }
    /**
     * @description Adds a given amount of points to the players current score
     * @param _amount
     */
    public onScoreChange(_amount: number) {
        this.currentScore += _amount;
        this.setText(this.currentScore.toString());
    }
}