class ScreenShakeHandler {
    static smallShake() {
        game.camera.shake(0.005, 500);
    }
    static bigShake() {
        game.camera.shake(0.02, 1000);
    }
    static customShake(intensity: number, duration: number) {
        game.camera.shake(intensity, duration);
    }
}