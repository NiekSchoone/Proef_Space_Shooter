class Vector2 {

    private x: number;
    private y: number;

    get X(): number {
        return this.x;
    }
    get Y(): number {
        return this.y;
    }

    set X(value: number) {
        this.x = value;
    }
    set Y(value: number) {
        this.y = value;
    }

    constructor(_x:number = 0, _y: number = 0) {
        this.x = _x;
        this.y = _y;
    }

    reset(): void {
        this.x = 0;
        this.y = 0;
    }

    length(): number {
        return Math.sqrt(this.squaredLength());
    }

    squaredLength(): number {
        var x = this.x,
            y = this.y;

        return (x * x + y * y);
    }

    add(vector: Vector2): Vector2 {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    subtract(vector: Vector2): Vector2 {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    multiply(vector: Vector2): Vector2 {
        this.x *= vector.x;
        this.y *= vector.y;

        return this;
    }

    divide(vector: Vector2): Vector2 {
        this.x /= vector.x;
        this.y /= vector.y;

        return this;
    }

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

    static sum(vector: Vector2, vector2: Vector2, dest: Vector2 = null): Vector2 {
        if (!dest) dest = new Vector2();

        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;

        return dest;
    }

    static difference(vector: Vector2, vector2: Vector2, dest: Vector2 = null): Vector2 {
        if (!dest) dest = new Vector2();

        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;

        return dest;
    }
}