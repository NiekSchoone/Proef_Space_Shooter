class ArrayMethods {

    static containsObject(list: any, obj: any): boolean {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }

    static removeObject(list: any, obj: any) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                list.splice(i, 1);
            }
        }
    }
}