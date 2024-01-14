type TempItem = {
    exp: string | Date,
    value: any
}

class LocalStorageError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
      Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class LocalStorage {
    static setTemporaryItem(key: string, value: any, minutesToExpire: number) {
        try {
            let exp = new Date();
            exp.setTime(exp.getTime() + (minutesToExpire * 60 * 1000));
            localStorage.setItem(
                key, 
                JSON.stringify({ exp, value })
            )
            return { exp, value };
        } catch(error) {
            throw new LocalStorageError("Unable to set temporary item to localStorage")
        }
    }

    static getTemporaryItem(key: string) {
        try {
            let item: string | object | null = localStorage.getItem(key);
            if (!item) return null;
            let itemObj: TempItem = JSON.parse(item);
            if (new Date() > new Date(itemObj.exp)) {
                return null;
            }
            return itemObj.value
        } catch(error) {
            throw new LocalStorageError("Unable to get temporary item from localStorage")
        }
    }

    static setItem(key: string, value: any) {
        try {
            localStorage.setItem(
                key, 
                JSON.stringify({ value })
            )
        } catch(error) {
            throw new LocalStorageError("Unable to set item to localStorage")
        }
    }

    static getItem(key: string) {
        try {
            let item: string | object | null = localStorage.getItem(key);
            if (!item) return null;
            let itemObj: TempItem = JSON.parse(item);
            return itemObj.value
        } catch(error) {
            throw new LocalStorageError("Unable to get item from localStorage")
        }
    }

    static removeItem(key: string) {
        try {
            localStorage.removeItem(key);
        } catch(error) {
            throw new LocalStorageError("Unable to remove item from localStorage")
        }
    }
}