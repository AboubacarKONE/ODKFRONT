import { quizForum } from 'src/app/model/quiz';
import { Audit } from './abstract';
import { User } from './User';
export interface responseForum {
    id?: number;
    description?: string;
    photoUrl?: string;
    user?: User;
    quizForum?: quizForum;
}