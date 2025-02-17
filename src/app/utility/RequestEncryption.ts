import { OnInit, Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
    providedIn:"root"
})

export class RequestEncryption implements OnInit {

    constructor() 
    {
    }
    
    ngOnInit() {
        
    }
     _keySize = 256;
    _ivSize = 128;
    _iterationCount = 1989;
    
    generateKey(salt, passPhrase) {
        return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
            keySize: this._keySize / 32,
            iterations: this._iterationCount
        });
    }

    encryptWithIvSalt(salt, iv, passPhrase, plainText) {
        let key = this.generateKey(salt, passPhrase);
        let encrypted = CryptoJS.AES.encrypt(plainText, key, {iv: CryptoJS.enc.Hex.parse(iv)});
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }

    decryptWithIvSalt(salt, iv, passPhrase, cipherText) {
        let key = this.generateKey(salt, passPhrase);
        let cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(cipherText)
        });
        let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {iv: CryptoJS.enc.Hex.parse(iv)});
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    encrypt(passPhrase, plainText) {
        let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
        let salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(CryptoJS.enc.Hex);
        let cipherText = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
        return salt + iv + cipherText;
    }

    decrypt(passPhrase, cipherText) {
        let ivLength = this._ivSize / 4;
        let saltLength = this._keySize / 4;
        let salt = cipherText.substr(0, saltLength);
        let iv = cipherText.substr(saltLength, ivLength);
        let encrypted = cipherText.substring(ivLength + saltLength);
        let decrypted = this.decryptWithIvSalt(salt, iv, passPhrase, encrypted);
        return decrypted;
    }

}