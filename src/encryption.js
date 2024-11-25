const NodeRSA = require('node-rsa');
const crypto = require('crypto');

class EncryptionService {
    constructor(publicKey) {
        this.publicKey = new NodeRSA();
        this.publicKey.importKey(publicKey, 'public');
    }

    rsaEncrypt(message) {
        return this.publicKey.encrypt(message, 'base64');
    }

    generateAesKeyAndIv() {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        return [key, iv];
    }

    encryptWithAes(key, iv, message) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(message, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    encrypt(message) {
        const [aesKey, iv] = this.generateAesKeyAndIv();
        const encryptedMessage = this.encryptWithAes(aesKey, iv, message);
        const encryptedKey = this.rsaEncrypt(aesKey.toString('base64'));
        const encryptedIv = this.rsaEncrypt(iv.toString('base64'));

        return {
            encrypted_message: encryptedMessage,
            encrypted_key: encryptedKey,
            encrypted_iv: encryptedIv
        };
    }
}

module.exports = EncryptionService;
