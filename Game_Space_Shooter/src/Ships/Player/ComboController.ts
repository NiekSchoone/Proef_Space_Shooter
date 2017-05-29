/**
 * @description Class containing the combo functionality for the player
 */
class ComboController {
    private player: Player;
    private targets: Array<Enemy>;
    private comboMeter: ComboMeter;
    private selectedTargets: Array<Enemy>;
    private graphics: Phaser.Graphics;
    private currentTargetColor: number;
    private currentPointerTarget: Enemy;

    public comboInitiated: boolean;

    constructor(_player: Player, _targets: Array<Enemy>, _comboMeter: ComboMeter) {
        this.player = _player;
        this.targets = _targets;
        this.comboMeter = _comboMeter;
        this.selectedTargets = new Array<Enemy>();
    }
    /**
     * @description Checks if the pointer is colliding with a target
     */
    private checkPointerCollision(): Enemy {
        for (let i = 0; i < this.targets.length; i++) {
            let distance = Vector2.distance(new Vector2(game.input.activePointer.position.x, game.input.activePointer.position.y), this.targets[i].vectorPosition);

            if (distance < this.targets[i].collisionRadius + 25) {
                return this.targets[i];
            }
        } return null;
    }
    /**
     * @description Executes every frame
     */
    public update() {
        this.currentPointerTarget = this.checkPointerCollision();
        // If mouse goes down on top of an enemy
        if (this.currentPointerTarget != null && game.input.activePointer.isDown && this.player.moving == false) {
            // Check if there's already targets
            if (this.selectedTargets.length > 0) {
                // Loop through all target enemies and check if duplicate.
                if (!ArrayMethods.containsObject(this.selectedTargets, this.currentPointerTarget) && this.currentPointerTarget.color == this.currentTargetColor) {
                    this.selectedTargets.push(this.currentPointerTarget);
                    this.currentPointerTarget.toggleComboTarget(true);
                }
            } else {
                // If it's the first target, skip checking duplicates.
                this.currentTargetColor = this.currentPointerTarget.color;
                this.selectedTargets.push(this.currentPointerTarget);
                this.currentPointerTarget.toggleComboTarget(true);
                this.comboInitiated = true;
            }
        }
    }
    /**
     * @description Executes the current initiated combo
     */
    public executeCombo() {
        this.comboInitiated = false;
        let selectedAmount = this.selectedTargets.length;
        // Check if more than one enemy is selected.
        if (selectedAmount > 1) {
            for (var i = 0; i <= selectedAmount; i++) {
                if (this.selectedTargets[i] != null) {
                    let currentTarget = this.selectedTargets[i];
                    let previousTarget = this.selectedTargets[i - 1];
                    currentTarget.onHit(100);

                    if (previousTarget != null) {
                        this.graphics = game.add.graphics(previousTarget.vectorPosition.X, previousTarget.vectorPosition.Y);
                        this.graphics.lineStyle(15, 0xff0000, 0.6);
                        this.graphics.lineTo(currentTarget.vectorPosition.X - previousTarget.vectorPosition.X, currentTarget.vectorPosition.Y - previousTarget.vectorPosition.Y);
                        game.add.tween(this.graphics).to({ alpha: 0 }, 350, Phaser.Easing.Linear.None, true);
                    }
                }
                this.comboMeter.onMeterChange(-20);
            }
        } else if (selectedAmount <= 1 && selectedAmount != 0) {
            this.selectedTargets[0].toggleComboTarget(false);
        }
        // Empty the target array.
        for (var i = 0; i <= this.selectedTargets.length; i++) {
            this.selectedTargets.splice(i);
        }
    }
    /**
     * @description Tells all targets to indicate that they are a combo target
     * @param _active
     */
    public indicateTargets(_active: boolean) {
        for (var i = 0; i < this.targets.length; i++) {
            if (_active) {
                this.targets[i].indicateIn();
            } else {
                this.targets[i].indicateOut();
            }
        }
    }
}