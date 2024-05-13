//import {Injectable} from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
//@Injectable()
//
//
//export class ResourceBundle{
//    
//    constructor(public translate:TranslateService)
//    {
//
//    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS','hi']);
//        this.translate.setDefaultLang('en');
//        const browserLang = this.translate.getBrowserLang();
//        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi/) ? browserLang : 'en');
//       
//    }
//    
//    
//    changeLang(language: string) {
//        this.translate.use(language);
//    }
//    
//    
//}