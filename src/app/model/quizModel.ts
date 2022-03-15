import { User } from './User';
import { categoryForum } from './category';
export class quizModel {
    id?: number;
    description?: string;
    photoUrl?: string;
    categoryForum?: categoryForum;
    user?: User;
}