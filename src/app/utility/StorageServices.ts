import {Injectable} from '@angular/core';
import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';
const SECRET_KEY = 'Sergh5423ugjbhjeyhrub564%^Y&%kj87687436';
//const SECRET_KEY = 'qwerty';

@Injectable({
    providedIn: 'root'
})

export class StorageService {
    
    constructor() {}
    
    public secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key): any {
//            console.log(key);
            key = CryptoJS.SHA256(key, SECRET_KEY);
//            console.log(key);
            return key.toString();
        },
        // Encrypt the localstorage data
        encrypt: function encrypt(data) {
//            console.log(data);
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);
            data = data.toString();
//            console.log(data);
            return data;
        },
        // Decrypt the encrypted data
        decrypt: function decrypt(data) {
//            console.log(data);
//            console.log(SECRET_KEY);
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);
            data = data.toString(CryptoJS.enc.Utf8);
//            console.log(data);
            return data;
        }
    });
}