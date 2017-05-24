class ComboController {

    private targets: Array<Ship>;

    constructor(_targets: Array<Ship>) {
        this.targets = _targets;
    }

    private initComboMode() {

    }

    private indicateTargets() {

    }

    // Check's if the pointer is colliding with a target.
    private checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(new Vector2(game.input.mousePointer.position.x, game.input.mousePointer.position.y), this.targets[i].vectorPosition);

                if (distance < this.targets[i].collisionRadius + 25) {
                    return this.targets[i];
                }
            }
        }
    }

    private update() {
        
    }
}