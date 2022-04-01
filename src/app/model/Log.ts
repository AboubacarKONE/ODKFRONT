import { User } from 'src/app/model/User';
export class Log{
    id?:number;
    action?:string;
    tableName?:string;
    createdBy?:User;
    createdDate?:Date;
    // ModifiedBy?:User;
    // ModifiedDate?:Date;
}