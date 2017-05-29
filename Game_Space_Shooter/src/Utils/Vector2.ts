/**
 * @description Vector2 class
 */
class Vector2 {

    private x: number;
    private y: number;

    constructor(_x: number = 0, _y: number = 0) {
        this.x = _x;
        this.y = _y;
    }

    get X(): number {
        return this.x;
    }
    set X(value: number) {
        this.x = value;
    }
    get Y(): number {
        return this.y;
    }
    set Y(value: number) {
        this.y = value;
    }

    /**
     * @description Reset this vector's values to 0
     */
    reset(): void {
        this.x = 0;
        this.y = 0;
    }
    /**
     * @description Get the length of this vector
     */
    length(): number {
        return Math.sqrt(this.squaredLength());
    }
    /**
     * @description Get the squared length of this vector
     */
    squaredLength(): number {
        var x = this.x,
            y = this.y;

        return (x * x + y * y);
    }
    /**
     * @description Add a given vector to this vector
     * @param vector
     */
    add(vector: Vector2): Vector2 {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }
    /**
     * @description Subtract a given vector off this vector
     * @param vector
     */
    subtract(vector: Vector2): Vector2 {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }
    /**
     * @description Multiply this vector by a given vector
     * @param vector
     */
    multiply(vector: Vector2): Vector2 {
        this.x *= vector.x;
        this.y *= vector.y;

        return this;
    }
    /**
     * @description Multiply this vector by a given magnitude
     * @param magnitude
     */
    mutliplyByNumber(magnitude: number): Vector2 {
        this.x *= magnitude;
        this.y *= magnitude;
        return this;
    }
    /**
     * @description Divide this vector by a given vector
     * @param vector
     */
    divide(vector: Vector2): Vector2 {
        this.x /= vector.x;
        this.y /= vector.y;

        return this;
    }
    /**
     * @description Normalize this vector
     * @param dest
     */
    normalize(dest: Vector2 = null): Vector2 {
        if (!dest) dest = this;

        var length = this.length();

        if (length === 1) {
            return this;
        }

        if (length === 0) {
            dest.x = 0;
            dest.y = 0;

            return dest;
        }

        length = 1.0 / length;

        dest.x *= length;
        dest.y *= length;

        return dest;
    }
    /**
     * @description Get the distance between 2 vectors
     * @param a
     * @param b
     */
    static distance(a: Vector2, b: Vector2): number {
        return Math.sqrt(this.squaredDistance(a, b));
    }
    /**
     * @description Get the squared distance between 2 vectors
     * @param a
     * @param b
     */
    static squaredDistance(a: Vector2, b: Vector2): number {
        var x = b.x - a.x,
            y = b.y - a.y;

        return (x * x + y * y);
    }
    /**
     * @description Get the average direction of 2 vectors
     * @param vector
     * @param vector2
     * @param dest
     */
    static direction(vector: Vector2, vector2: Vector2, dest: Vector2 = null): Vector2 {
        if (!dest) dest = new Vector2();

        var x = vector.x - vector2.x,
            y = vector.y - vector2.y;

        var length = Math.sqrt(x * x + y * y);

        if (length === 0) {
            dest.x = 0;
            dest.y = 0;

            return dest;
        }

        length = 1 / length;

        dest.x = x * length;
        dest.y = y * length;

        return dest;
    }
    /**
     * @description Get the sum of 2 vectors
     * @param vector
     * @param vector2
     * @param dest
     */
    static sum(vector: Vector2, vector2: Vector2, dest: Vector2 = null): Vector2 {
        if (!dest) dest = new Vector2();

        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;

        return dest;
    }
    /**
     * @description Get the difference between 2 vectors
     * @param vector
     * @param vector2
     * @param dest
     */
    static difference(vector: Vector2, vector2: Vector2, dest: Vector2 = null): Vector2 {
        if (!dest) dest = new Vector2();

        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;

        return dest;
    }
    /**
     * @description Copy the values of a given vector
     * @param vector
     */
    static copy(vector: Vector2) {
        return new Vector2(vector.X, vector.Y);
    }
}