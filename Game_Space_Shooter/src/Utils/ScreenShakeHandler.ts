class ScreenShakeHandler {

    /**
     * @description Executes a light camera shake used on small explosions
     */
    static smallShake() {
        game.camera.shake(0.005, 500);
    }

    /**
     * @description Executes a heavy camera shake used on big explosions
     */
    static bigShake() {
        game.camera.shake(0.02, 1000);
    }

    /**
     * @description Executes a camera shake with given values
     * @param intensity
     * @param duration
     */
    static customShake(intensity: number, duration: number) {
        game.camera.shake(intensity, duration);
    }
}