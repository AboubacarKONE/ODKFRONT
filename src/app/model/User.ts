import { Audit } from "./abstract";

export class User {
    public id?:number;
    public userId:string;
    public nom:string;
    public prenom:string;
    public login:string;
    public email:string;
    public adresse:string;
    public telephone:string;
    public profileImageUrl:string;
    public lastLoginDate:Date;
    public lastLoginDateDisplay:Date;
    public joinDate:Date;
    public role:string;
    public authorities:[];
    public active:boolean;
    public nonLocked:boolean;
    public profession:string
    constructor(){
        this.userId = '';
        this.prenom ='';
        this.nom ='';
        this.login ='';
        this.email ='';
        this.adresse = '';
        this.telephone ='';
        this.profileImageUrl='';
        this.lastLoginDate=null;
        this.lastLoginDateDisplay=null;
        this.joinDate=null;
        this.role = '';
        this.authorities = [];
        this.active =false;
        this.nonLocked =false;       
        this.profession ='';
    }
    
}