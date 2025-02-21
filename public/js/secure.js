PIN = null;

// Use a static IV (highly discouraged unless you fully understand the risks).

console.log('loaded secure.js');

async function deriveKey(pin) {
    if (!/^\d{6}$/.test(pin)) {
        throw new Error("PIN must be a 6-digit integer.");
    }

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(pin), // Use the PIN as the base key material
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("unique-salt"), // A static salt, replace with a better one for stronger security
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encrypt(pin, inputString, IV) {
    const key = await deriveKey(pin);
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: IV, // Use the static IV
        },
        key,
        data
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Convert to Base64;
}

    async function decrypt(pin, encryptedData, IV) {
        const key = await deriveKey(pin);
        const decoder = new TextDecoder();
        const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: IV
            },
            key,
            encryptedBuffer
        );

        return decoder.decode(decrypted);
    }

// Example usage:
// let IV = crypto.getRandomValues(new Uint8Array(12));
// (async () => {
//     PIN = "123456";
//     // const IV = new Uint8Array([123, 234, 56, 78, 90, 12, 34, 56, 78, 90, 123, 234]); // Example static IV (12 bytes).
//     const originalText = "Hello, Secure World!";

//     console.log('IV', btoa(String.fromCharCode(...IV)));
//     // Encrypt
//     const encrypted = await encrypt(PIN, originalText, IV);
//     console.log("Encrypted:", encrypted);

//     // Decrypt
//     const decryptedText = await decrypt(PIN, encrypted, IV);
//     console.log("Decrypted:", decryptedText);
// })();
