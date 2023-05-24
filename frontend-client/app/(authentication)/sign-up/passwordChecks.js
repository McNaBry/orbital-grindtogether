export function checkPassword(password, confirmPassword) {
    return password === confirmPassword;
}

export function atLeast8Char(password) {
    return password.length >= 8;
}

export function atLeastOneCap(password) {
    return /[A-Z]/.test(password);
}

export function atLeastOneLower(password) {
    return /[a-z]/.test(password);
}

export function atLeastOneNumber(password) {
    return /[0-9]/.test(password);
}

export function atLeastOneSpecial(password) {
    return /(?=[^!@#$%^&*]*[!@#$%^&*])/.test(password);
}
