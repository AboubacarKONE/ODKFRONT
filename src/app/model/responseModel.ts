import { quizForum } from 'src/app/model/quiz';
import { User } from './User';
export class responseModel {
    id?: number;
    description?: string;
    photoUrl?: string;
    user?: User;
    quizForum?: quizForum;
}