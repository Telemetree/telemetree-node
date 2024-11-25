const NodeRSA = require("node-rsa");
const crypto = require("crypto");

class EncryptionService {
  constructor(publicKey) {
    console.log("Received public key:", publicKey);
    this.publicKey = new NodeRSA({ environment: "node" });
    // Clean the key and ensure proper PEM format
    const cleanKey = publicKey.replace(/-----[^-]+-----/g, "").trim();
    const formattedKey = `-----BEGIN RSA PUBLIC KEY-----\n${cleanKey}\n-----END RSA PUBLIC KEY-----`;
    console.log("Formatted key:", formattedKey);
    this.publicKey.importKey(formattedKey, "pkcs1-public-pem");
  }

  rsaEncrypt(data) {
    try {
      // Convert to hex string first
      const hexStr = Buffer.isBuffer(data)
        ? data.toString("hex")
        : Buffer.from(data).toString("hex");
      // Encrypt the hex string using base64 encoding for RSA
      const encrypted = this.publicKey.encrypt(hexStr, "base64", "utf8");
      return encrypted;
    } catch (error) {
      console.error("RSA encryption error:", error);
      throw error;
    }
  }

  generateAesKeyAndIv() {
    const key = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);
    return [key, iv];
  }

  addPKCS7Padding(data) {
    const blockSize = 16;
    const padding = blockSize - (data.length % blockSize);
    const paddingBuffer = Buffer.alloc(padding, padding);
    return Buffer.concat([data, paddingBuffer]);
  }

  encryptWithAes(key, iv, message) {
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(false);

    const messageBuffer = Buffer.from(message, "utf8");
    const paddedMessage = this.addPKCS7Padding(messageBuffer);

    const encrypted = Buffer.concat([
      cipher.update(paddedMessage),
      cipher.final()
    ]);

    return encrypted;
  }

  encrypt(message) {
    try {
      console.log("Input message type:", typeof message);
      console.log("Input message:", message);

      // Ensure message is a string
      const messageStr =
        typeof message === "object" ? JSON.stringify(message) : String(message);
      console.log("Normalized message:", messageStr);

      // Generate key and IV
      const [aesKey, iv] = this.generateAesKeyAndIv();
      console.log("AES Key (hex):", aesKey.toString("hex"));
      console.log("IV (hex):", iv.toString("hex"));
      console.log("Raw AES Key:", aesKey.toString("hex"));
      console.log("Raw IV:", iv.toString("hex"));
      console.log("Generated AES Key length:", aesKey.length);
      console.log("Generated IV length:", iv.length);

      const encryptedMessage = this.encryptWithAes(aesKey, iv, message);
      console.log("Encrypted message (hex):", encryptedMessage.toString("hex"));
      console.log("Encrypted message length:", encryptedMessage.length);

      const encryptedKey = this.rsaEncrypt(aesKey);
      const encryptedIv = this.rsaEncrypt(iv);

      console.log("Encrypted key (hex):", encryptedKey.toString("hex"));
      console.log("Encrypted IV (hex):", encryptedIv.toString("hex"));
      console.log("Encrypted key length:", encryptedKey.length);
      console.log("Encrypted IV length:", encryptedIv.length);

      const result = {
        body: encryptedMessage.toString("base64"),
        key: encryptedKey, // Already base64 from rsaEncrypt
        iv: encryptedIv // Already base64 from rsaEncrypt
      };

      console.log("Final payload structure:", {
        body_length: result.body.length,
        key_length: result.key.length,
        iv_length: result.iv.length
      });

      // Validate the payload
      if (
        typeof result.body !== "string" ||
        typeof result.key !== "string" ||
        typeof result.iv !== "string"
      ) {
        throw new Error(
          "Encryption failed: payload contains non-string values"
        );
      }

      console.log("Payload validation passed - all fields are strings");

      return result;
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }
}

module.exports = EncryptionService;
