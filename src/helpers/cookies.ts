export function getCookie(name: string) {
    const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log("getting cookie " + name)
    console.log(cookieValue)
    return cookieValue ? cookieValue[2] : null;
}

export function setCookie(name: string, value: any, minutesToExpire?: number) {
    // console.log("setting cookie " + name)
    // console.log(value)
    if (minutesToExpire){
        let expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (minutesToExpire * 60 * 1000));
        const expires = "expires=" + expirationDate.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + "; path=/";
    } else {
        document.cookie = name + "=" + value + "; path=/";
    }
}