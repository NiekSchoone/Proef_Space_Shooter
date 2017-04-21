var Vector2 = (function () {
    function Vector2(_x, _y) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        this.x = _x;
        this.y = _y;
    }
    Object.defineProperty(Vector2.prototype, "X", {
        get: function () {
            return this.x;
        },
        set: function (value) {
            this.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "Y", {
        get: function () {
            return this.y;
        },
        set: function (value) {
            this.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.reset = function () {
        this.x = 0;
        this.y = 0;
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.squaredLength());
    };
    Vector2.prototype.squaredLength = function () {
        var x = this.x, y = this.y;
        return (x * x + y * y);
    };
    Vector2.prototype.add = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    };
    Vector2.prototype.subtract = function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    };
    Vector2.prototype.multiply = function (vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    };
    Vector2.prototype.divide = function (vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    };
    Vector2.prototype.normalize = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = this;
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
    };
    Vector2.distance = function (a, b) {
        return Math.sqrt(this.squaredDistance(a, b));
    };
    Vector2.squaredDistance = function (a, b) {
        var x = b.x - a.x, y = b.y - a.y;
        return (x * x + y * y);
    };
    Vector2.direction = function (vector, vector2, dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new Vector2();
        var x = vector.x - vector2.x, y = vector.y - vector2.y;
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
    };
    Vector2.sum = function (vector, vector2, dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new Vector2();
        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;
        return dest;
    };
    Vector2.difference = function (vector, vector2, dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new Vector2();
        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;
        return dest;
    };
    Vector2.copy = function (vector) {
        return new Vector2(vector.X, vector.Y);
    };
    return Vector2;
}());
