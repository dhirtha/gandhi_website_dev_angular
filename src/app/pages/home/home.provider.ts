import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Injector} from "@angular/core";
import {MasterProvider} from "../../utility/MasterProvider";
import {AuthService} from "../../utility/auth-service";
import {PaperMst} from "../../pojos/paper";

@Injectable()
export class HomeProvider extends MasterProvider {
     API_PAPER_SAVE: string = "/api/paperRate/save";
     API_PAPER_UPDATE: string = "/api/paperRate/update";
     API_PAPER_DELETE: string = "/api/paperRate/deleteById";
    Api_of_all_List:string="/api/adGeneralDtl/getAdGeneralDtlLstByCode/";
    constructor(public injector: Injector, public http: HttpClient,public authService:AuthService){
        super(injector, http, authService);
    }
    
     savePaper(Obj:PaperMst)
    {
        return this.save(Obj);
    }
    
      updatePaper(Obj: PaperMst)
    {
        return this.update(Obj);
    }
    
    deletePaper(Obj: PaperMst)
    {
        return this.deleteById(Obj);
    }
    
    public save(obj: any) {
        return this.doHttpPost(this.API_PAPER_SAVE, obj,false);
    }
    public update(obj: any) {
        return this.doHttpPost(this.API_PAPER_UPDATE, obj,false);
    }
    public findById(objId: any) {
        throw new Error("Method not implemented.");
    }
    public findAll() {
        throw new Error("Method not implemented.");
    }
    public deleteById(obj: any) {
        return this.doHttpPost(this.API_PAPER_DELETE + "/" + obj.id, obj,false);
    }
    public defunctById(obj: any) {
        throw new Error("Method not implemented.");
    }
    
//    getList(data){
//        console.log(data);
//        return this.doHttpGet(this.Api_of_all_List,false,data);
//    }
}

