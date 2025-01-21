let ROLES = {
    USER: "user",
    ADMIN: "admin"
}

let USER_KEYS = {
    NAME: "name",
    EMAIL: "email",
    PASSWORD: 'password',
    CONFIRM_PASSWORD: 'confirmPassword',
    IV: 'iv',
    PROFILE_IMAGE: "profileImage",
}

let COOKIES = {
    LOGIN: "login",
    ROLE: "role",
    IV: 'iv'
}

let MESSAGE = {
    UserNotFound: 'User Not Found!'
    // adding more messages
}

// ES module syntax of module.exports
module.exports = {
    ROLES: ROLES,
    USER_KEYS: USER_KEYS,
    COOKIES: COOKIES,
    MESSAGE: MESSAGE
}


