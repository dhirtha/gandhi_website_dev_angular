import {Injectable} from '@angular/core';
import {StorageService} from './StorageServices';

@Injectable({
    providedIn: 'root'
})

export class LocalService {
    constructor(public storageService: StorageService) {}
    // Set the json data to local storage
    setJsonValue(key: string, value: any) {
        try{
            this.storageService.secureStorage.setItem(key, value);
        }catch(Error){
            this.clearToken();
        }
    }
    // Get the json value from local storage
    getJsonValue(key: string) {
        try{
            return this.storageService.secureStorage.getItem(key);
        }catch(Error){
            this.clearToken();
        }
    }
    // Clear the local storage
    clearToken() {
        return this.storageService.secureStorage.clear();
    }
    clearTokenByKey(key: string) {
        return this.storageService.secureStorage.removeItem(key);
    }
}