function checkPassword(password, confirmPassword) {
    return password === confirmPassword;
}

function atLeast8Char(password) {
    return password.length >= 8;
}

function atLeastOneCap(password) {
    return /[A-Z]/.test(password);
}

function atLeastOneLower(password) {
    return /[a-z]/.test(password);
}

function atLeastOneNumber(password) {
    return /[0-9]/.test(password);
}

function atLeastOneSpecial(password) {
    return /(?=[^!@#$%^&*]*[!@#$%^&*])/.test(password);
}

function checkValidEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
    checkPassword,
    atLeast8Char,
    atLeastOneCap,
    atLeastOneLower,
    atLeastOneNumber,
    atLeastOneSpecial,
    checkValidEmailFormat
};