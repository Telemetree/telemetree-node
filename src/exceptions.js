class WrongIdentityKeys extends Error {
    constructor(message) {
        super(message);
        this.name = 'WrongIdentityKeys';
    }
}

class CustomEventNotSupported extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomEventNotSupported';
    }
}

module.exports = {
    WrongIdentityKeys,
    CustomEventNotSupported
};
