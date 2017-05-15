class AnimationHandler {
    private static position: Vector2;
    private static animations: Array<Phaser.Sprite>;

    static addAnimation(_anim: Phaser.Sprite) {
        this.animations.push(_anim);
    }

    static getAnimation() {
        return this.animations[0];
    }
}