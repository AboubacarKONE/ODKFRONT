import { quizForum } from 'src/app/model/quiz';
import { User } from './User';
export interface responseForum {
    id?: number;
    description?: string;
    photoUrl?: string;
    user?: User;
    quizForum?: quizForum;
}