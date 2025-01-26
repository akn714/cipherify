let PIN = null;
// let IV = crypto.getRandomValues(new Uint8Array(12)); // Generate a random initialization vector (IV)
// let IV = document.cookie.split(';')[2].trim().split('=')[1];

console.log('loaded secure.js')

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

async function encrypt(pin, inputString, iv) {
    const key = await deriveKey(pin);
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);
    // const iv = document.cookie.split(';')[2].trim().split('=')[1];

    // const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random initialization vector (IV)
    // const iv = "eZQY1CRM03rdGDht"; // Generate a random initialization vector (IV)
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        data
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Convert to Base64
}

async function decrypt(pin, encryptedData, iv) {
    const key = await deriveKey(pin);

    const decoder = new TextDecoder();
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBuffer,
        },
        key,
        encryptedBuffer
    );

    return decoder.decode(decrypted);
}

// Example usage:
// (async () => {
//     PIN = "123456";
//     const originalText = "Hello, Secure Worsd!";
    
//     // Encrypt
//     const { encrypted, iv } = await encrypt(PIN, originalText);
//     console.log("Encrypted:", encrypted);
//     console.log("IV:", iv);

//     // Decrypt
//     const decryptedText = await decrypt(PIN, encrypted, iv);
//     console.log("Decrypted:", decryptedText);
// })();
