type TempItem = {
    exp: string | Date,
    value: any
}

export class LocalStorage {
    static setTemporaryItem(key: string, value: any, minutesToExpire: number) {
        let exp = new Date();
        exp.setTime(exp.getTime() + (minutesToExpire * 60 * 1000));
        localStorage.setItem(
            key, 
            JSON.stringify({ exp, value })
        )
    }

    static getTemporaryItem(key: string) {
        let item: string | object | null = localStorage.getItem(key);
        if (!item) return null;
        let itemObj: TempItem = JSON.parse(item);
        if (new Date() > new Date(itemObj.exp)) {
            localStorage.removeItem(key);
            return null;
        }
        return itemObj.value
    }

    static setItem(key: string, value: any) {
        localStorage.setItem(
            key, 
            JSON.stringify({ value })
        )
    }

    static getItem(key: string) {
        let item: string | object | null = localStorage.getItem(key);
        if (!item) return null;
        let itemObj: TempItem = JSON.parse(item);
        return itemObj.value
    }
}