/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import {Injectable} from '@angular/core';
import {Injector} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {LoginRequest} from '../../request/LoginRequest';

@Injectable()

export class ChangePasswordProvider extends MasterProvider{
    
    loginApi: string="/api/auth/signin";
    

    public save(obj: any) {
    }
    public update(obj: any) {
    }
    public findById(objId: any) {
    }
    public findAll() {
    }
    public deleteById(obj: any) {
    }
    public defunctById(obj: any) {
    }
    
//    constructor(public injector: Injector, public http: HttpClient)
    constructor(public injector: Injector, public http: HttpClient,public authService:AuthService)
    {
        super(injector, http, authService);
    }
  
    
    getListOfOPR()
    {
//        return this.serviceFirestore.getListFromFireStore(this.serviceFirestore.firestore.collection("ORG_MST").doc(this.serviceFirestore.ORG_ID).collection("OPR_LIST"))
    }
    
    getOPRUser(uid: any)
    {
//        return this.serviceFirestore.getListFromFireStore(this.serviceFirestore.firestore.collection("ORG_MST").doc(this.serviceFirestore.ORG_ID).collection("OPR_LIST").doc(this.serviceFirestore.OPR_ID).collection("USER_MST", ref => ref
//            .where("key", "==", uid)
//        ))
    }
    
    getORGUser(uid: any)
    {
//        return this.serviceFirestore.getListFromFireStore(this.serviceFirestore.firestore.collection("ORG_MST").doc(this.serviceFirestore.ORG_ID).collection("USER_MST", ref => ref
//            .where("uid", "==", uid)
//        ))
    }
    
    doLogin(userCredentials:LoginRequest)
    {
        return this.doHttpPost(this.loginApi, userCredentials,false);
    }
    
 
    
    
}