import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
//import {auth} from 'firebase';
//import {NotifyService} from './NotifyService';

import {Observable, of} from 'rxjs';
import {switchMap, startWith, tap, filter} from 'rxjs/operators';
import {USER_MST} from '../pojos/USER_MST';
import { CookieService } from 'ngx-cookie';
export interface User {
    uid: string;
    email?: string | null;
    photoURL?: string;
    displayName?: string;
    isLoggedin?: boolean;
    ORG_ID: string;
    OPR_ID: string;
    User_Role: string;
    token:any;
    token_Type:string;
    id_mongo:string;    ////mongo database id 
    app_role_id:string;
}

@Injectable()
export class AuthService {
    user: Observable<User | null>;

    constructor(
        private router: Router,
//        private notify: NotifyService,
        private setCookies:CookieService
    ) {
    }

    ////// OAuth Methods /////
    googleLogin() {
//        const provider = new auth.GoogleAuthProvider();
//        return this.oAuthLogin(provider);
    }

    githubLogin() {
//        const provider = new auth.GithubAuthProvider();
//        return this.oAuthLogin(provider);
    }

    facebookLogin() {
//        const provider = new auth.FacebookAuthProvider();
//        return this.oAuthLogin(provider);
    }

    twitterLogin() {
//        const provider = new auth.TwitterAuthProvider();
//        return this.oAuthLogin(provider);
    }


    //// Anonymous Auth ////

    //// Email/Password Auth ////


    // Sends email allowing user to reset password
    resetPassword(email: string) {
//        const fbAuth = auth();
//        return new Promise((resolve, reject) =>
//        {
//            fbAuth
//                .sendPasswordResetEmail(email)
//                .then(() => {
//                    resolve("Password update email sent")
//                })
//                .catch(error => {
//                    reject(error);
//                })
//        })
    }


    // If error, console log and notify user
    private handleError(error: Error) {
        console.error(error);

//        this.notify.update(error.message, 'error');
        return error;
    }

    // Sets user data to firestore after succesful login
    
    // Sets user data in session after succesful login
    public setUserDataToSession(user: USER_MST) {
        const data: User = {
            uid: user.key,
            email: user.USER_EMAIL || null,
            displayName: user.USER_FIRST_NAME || null,
            ORG_ID: user.ORG_KEY || "",
            OPR_ID: user.OPR_KEY || "",
            User_Role: user.ROLE,
            token:"",
            token_Type:"",
            id_mongo:" ",
            app_role_id:" "
            

        };
        this.setSession(data);
        return this.getSession();
    }
    public setUserDataToSessionNew(user: User) {
       
       
        this.setSession(user);
        return this.getSession();
    }

    private setSession(session: any) {
        let CookieOptions = {
//            path: "",
//            domain: "https://aaryancards.com",
//            expires: "2",
            secure: true,
//            sameSite: ("Lax"),
//            httpOnly: true,
//            storeUnencoded: false
        }
        this.setCookies.putObject('sessionUser', session, CookieOptions);
        
//        this.setCookies.putObject('JSESSIONID', this.setCookies.getObject('JSESSIONID'), CookieOptions);
        
//        localStorage.setItem('sessionUser', JSON.stringify(session));
    }
    public removeSession() {
        console.log("removed");
        this.setCookies.remove('sessionUser');
//        this.setCookies.removeAll();
//        localStorage.setItem('sessionUser', JSON.stringify(session));
    }

    public getSession(): User {
//        console.log(this.setCookies.getObject('sessionUser') as User);
      return this.setCookies.getObject('sessionUser') as User;
//        return JSON.parse(localStorage.getItem('sessionUser'))as User;
    }
    
    
    //check weather email is resgistered allready or not

    
    
}
