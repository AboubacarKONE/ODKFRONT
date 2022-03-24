import { CustomHttpRespone } from './../../model/custom-http-response';
import { quizModel } from './../../model/quizModel';
import { responseForum } from './../../model/response';
import { ResponseService } from './../../service/response.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from './../../enum/notification-type.enum';
import { NotificationService } from './../../service/notification.service';
import { CategoryForumService } from './../../service/category-forum.service';
import { Subscription } from 'rxjs';
import { User } from './../../model/User';
import { AuthenticationService } from './../../service/authentication.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { categoryForum } from 'src/app/model/category';
import { QuizServiceService } from 'src/app/service/quiz-service.service';
import { quizForum } from 'src/app/model/quiz';
import { responseModel } from 'src/app/model/responseModel';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {
  // @Input()
  public refreshing:boolean;
  public responselenght: number;
  public idCat: number;
  public idQuiz: number;
  pageQuiz: number = 1;
  pageResponse: number = 1;
  pageCategory: number = 1;
  public user: User;
  public editQuiz = new quizModel;
  public editResponse = new responseModel;
  public cateForum: categoryForum[];
  public quizForum: quizForum[];
  public responseForum: responseForum[];
  private subscriptions: Subscription[] = [];
  public fileName: string;
  public profileImage: File;
  public isAdmin: boolean;
  public isFormateur: boolean;
  public isSuperAdmin: boolean;
  constructor(private authenticationService: AuthenticationService, private catForumService: CategoryForumService,
    private notificationService: NotificationService, private quizService: QuizServiceService,
    private responseService: ResponseService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getCategoryForums();
    this.getQuizForums();
    this.isAdmin = this.authenticationService.isAdmin;
    this.isFormateur = this.authenticationService.isFormateur;
    this.isSuperAdmin = this.authenticationService.isSuperAdmin;
    // console.log(this.quizForum);
  }
  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.profileImage = profileImage;
    // console.log(fileName, profileImage);
  }
  onNewCatForum(catForm: NgForm) {
    this.refreshing=true;
    const formData = new FormData();
    formData.append('libelle', catForm.value.libelle);
    formData.append('id', JSON.stringify(this.user.id));
    formData.append('categoryImage', this.profileImage)
    this.subscriptions.push(
      this.catForumService.addNewCatForum(formData).subscribe(
        (response: categoryForum) => {
          this.clickButton('new-user-close');
          this.fileName = null;
          this.profileImage = null;
          catForm.reset();
          this.refreshing = false;
          this.sendNotification(NotificationType.SUCCESS, `categorie de forum ajoutée effectuer avec succès`)
          this.getCategoryForums();
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing =false;
          this.profileImage = null;
        }
      )
    )

  }
  public getCategoryForums() {
    this.subscriptions.push(
      this.catForumService.getAllCategoryForum().subscribe(
        (response: categoryForum[]) => {
          this.cateForum = response;
          // console.log(this.cateForum);          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public saveNewCatForum(): void {
    this.clickButton('new-catForum-save');
  }
  public saveNewQuizForm() {
    this.clickButton('new-quiz-save');
  }
  public saveNewResponseForm() {
    this.clickButton('new-response-save');
  }
  public onAddQuizForum(quizForm: NgForm) {
    if (this.idCat != null) {
      this.refreshing=true;
      const formData = new FormData();
      formData.append('description', quizForm.value.description);
      formData.append('idUser', JSON.stringify(this.user.id));
      formData.append('idCat', JSON.stringify(this.idCat));
      formData.append('quizImage', this.profileImage);
      this.subscriptions.push(
        this.quizService.addNewQuizForum(formData).subscribe(
          (response: quizForum) => {
            this.clickButton('new-quiz-close');
            this.fileName = null;
            this.profileImage = null;
            quizForm.reset();
            this.refreshing=false;
            this.sendNotification(NotificationType.SUCCESS, `QUESTION POSEZ AVEC SUCCES`)
            this.getAllQuizByCatForum(this.idCat);
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.profileImage = null;
            this.refreshing=false;
          }
        )
      )
    } else {
      this.sendNotification(NotificationType.ERROR, `VUEILLEZ SELECTIONNER UNE CATEGORIE POUR POSEZ VOTRE QUESTION`)
    }
  }
  public onAddResponseForum(responseForum: NgForm) {
    this.refreshing=true;
    const formData = new FormData();
    formData.append('description', responseForum.value.description);
    formData.append('idUser', JSON.stringify(this.user.id));
    formData.append('idQuiz', JSON.stringify(this.idQuiz));
    formData.append('responseImage', this.profileImage);
    console.log(formData);
    this.subscriptions.push(
      this.responseService.addNewResponseForum(formData).subscribe(
        (response: responseForum) => {
          this.clickButton('new-response-close');
          this.fileName = null;
          this.profileImage = null;
          responseForum.reset();
          this.refreshing=false;
          this.sendNotification(NotificationType.SUCCESS, `VOUS AVEZ REPONDU A LA QUESTION`)
          // this.getAllQuizByCatForum(this.idCat);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
          this.refreshing=false;
        }
      )
    )
  }
  public onGetQuizId(idQuiz: number) {
    this.idQuiz = idQuiz;
    // console.log(this.idQuiz);    
  }
  public getQuizForums() {
    this.subscriptions.push(
      this.quizService.getAllQuizForum().subscribe(
        (response: quizForum[]) => {
          this.quizForum = response;
          // console.log(this.quizForum);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  public getAllQuizByCatForum(id: number) {
    this.idCat = id;
    console.log(this.idCat);
    this.subscriptions.push(
      this.quizService.findAllQuizByCategorie(id).subscribe(
        (response: categoryForum[]) => {
          this.quizForum = response;
          // console.log(this.quizForum);          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  public getAllResponseByQuiz(id: number) {
    this.subscriptions.push(
      this.responseService.findAllresponseByQuiz(id).subscribe(
        (response: responseForum[]) => {
          this.responseForum = response;
          // this.responselenght = response.length
          // console.log(this.responseForum);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  public onEditQuiz(quiz: quizForum) {
    this.editQuiz = quiz;
    this.clickButton('openQuizEdit');
  }
  public onEditResponse(response:responseForum){
    this.editResponse = response;
    this.clickButton('openResponseEdit');
  }
  public onUpdateQuiz() {
    this.refreshing=true;
    const formData = new FormData();
    formData.append('idQuiz', JSON.stringify(this.editQuiz.id));
    formData.append('description', this.editQuiz.description);
    formData.append('quizImage', this.profileImage);
    this.subscriptions.push(
      this.quizService.updateQuiz(formData).subscribe(
        (response: quizForum) => {
          this.clickButton('closeEditQuizModalButton');
          this.fileName = null;
          this.profileImage = null;
          this.refreshing=false;
          this.sendNotification(NotificationType.SUCCESS, `QUESTION MODIFIEZ AVEC SUCCES`)
          this.getAllQuizByCatForum(this.editQuiz.categoryForum.id);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
          this.refreshing=false;
        }
      )
    )
  }
  public onUpdateResponse(){
    this.refreshing=true;
    const formData = new FormData();
    formData.append('idResponse', JSON.stringify(this.editResponse.id));
    formData.append('description', this.editResponse.description);
    formData.append('responseImage', this.profileImage);
    this.subscriptions.push(
      this.responseService.updateResponse(formData).subscribe(
        (response: responseForum) => {
          this.clickButton('closeEditResponseModalButton');
          this.fileName = null;
          this.profileImage = null;
          this.refreshing=false;
          this.sendNotification(NotificationType.SUCCESS, `REPONSE MODIFIEZ AVEC SUCCES`)
          this.getAllQuizByCatForum(this.editQuiz.categoryForum.id);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
          this.refreshing=false;
        }
      )
    )
  }
  onDeleteCatForum(Idcat: number) {
    this.subscriptions.push(
      this.catForumService.deleteCatForm(Idcat).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getCategoryForums();
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  onDeleteQuizForum(IdQuiz: number) {
    this.subscriptions.push(
      this.quizService.deleteQuizForm(IdQuiz).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getCategoryForums();
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  onDeleteResponseForum(IdResponse: number) {
    this.subscriptions.push(
      this.responseService.deleteResponseForm(IdResponse).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getCategoryForums();
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
 
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur s\'est produite. Please try again.');
    }
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click()
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
