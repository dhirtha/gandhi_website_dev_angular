export class ROLE_MST {
    key: any;
    DEFUNCT: boolean = false;
    ROLE_MODULE_NAME: string;
    PAGE_LIST: PAGE_MST[] = [];
    ROLE_LABEL: string;
    CR_DT: Date;
    CR_BY: string;
    MD_DT: Date;
    MD_BY: string;
    MD_COUNTER: number = 0;

    public clearObject() {
        this.key = '';
        this.DEFUNCT = false;
        this.ROLE_MODULE_NAME = "";
        this.PAGE_LIST = [];
        this.ROLE_LABEL = "";
        this.CR_DT = null
        this.CR_BY = null
        this.MD_DT = null
        this.MD_BY = null;
        this.MD_COUNTER = 0;
    }

}

export class PAGE_MST {
    key: string;
    PAGE_NAME: string;
    PAGE_ICON: string;
    MODULE_NAME: string;
    ICON: string;
    CREATE: boolean;
    UPDATE: boolean;
    VIEW: boolean;
    DELETE: boolean;
    DEFUNCT: boolean;
    alot: any;
}