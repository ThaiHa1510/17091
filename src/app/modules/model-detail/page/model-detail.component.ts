import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { ModalService } from '../../../_modal';
import { ModelService, MyGalleryService, AlertService } from '@/_servies';
import { ReviewService } from '@/_servies/review.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { CallService } from '@/_servies/call.service';
import { SettingService } from '@/_servies/setting.service';
import { first } from 'rxjs/operators';
import { Model, Review, User, Gallery } from '@/_models';
import { environment } from 'environments/environment';
import { TimeHelper } from '@/_helpers';
import { PhotoSwipeComponent } from '@/modules/photo-swipe/photo-swipe/photo-swipe.component'
import { NgbModal, ModalDismissReasons, NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@twilio/voice-sdk';
@Component({
  selector: 'app-model-detail',
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.css'],
  providers: [NgbCarouselConfig]
})
export class ModelDetailComponent implements OnInit, OnDestroy {
  @Input()
  id: String;
  currentGallery: Gallery;
  getModelInter: any;
  closeResult = '';
  Twilio: any;
  reviewConfig: any = {
    reviewLength: 3,
    reviewSort: 'DESC',
    reviewSortBy: 'rating',
    reviewPage: 1
  };
  title = environment.appTitle;
  homeUrl = environment.baseUrl;
  host = environment.apiUrl + '/';
  listGallery: Gallery[] = [];
  timeHelper: TimeHelper;
  now = new Date();
  readonly: boolean = true;
  twilioToken: string;
  private sub: any;
  model: Model = new Model();
  user: User;
  listReviews: Review[] = [];
  availableModel: Model[] = [];
  whyChoseUseContent = '';
  privacyContent = '';
  device:any;
  loginErrorMessage = 'You must be logged in to contact this profile';
  @ViewChild('myCarousel', { static: true }) myCarousel: NgbCarousel;
  @ViewChild('photoSwipe', { static: false }) photoSwipe: PhotoSwipeComponent;
  constructor(private modalService: ModalService,
    private router: ActivatedRoute,
    private modelService: ModelService,
    private alertService: AlertService,
    private reviewService: ReviewService,
    private callService: CallService,
    private toasty: AlertService,
    private route: Router, private config: NgbCarouselConfig,
    private ngbModalService: NgbModal,
    private galleryService: MyGalleryService,
    private authentication: AuthenticationService,
    private translateService: TranslateService,
    private settingService: SettingService) {
    this.config.interval = 1000000;
    this.config.wrap = false;
    this.config.keyboard = false;
    if(!this.user){
      this.translateService.setDefaultLang('fr');
      this.translateService.use('fr');
    }
    this.timeHelper = new TimeHelper(this.translateService);
    this.sub = this.router.params.subscribe(params => {
      this.id = params['id'];
      this.boostrap(this.id);
    });

  }

  ngOnInit() {
    var bodyEle = document.getElementsByTagName('body')[0];
    // bodyEle.scrollIntoView();  
    this.user = this.authentication.currentUserValue;
    this.settingService.getBySlug('why-choose-us,your-privacy-is-important').subscribe((resp: any) => {
      if (resp.data) {
        resp.data.forEach((item) => {
          if (item.slug == 'why-choose-us') {
            this.whyChoseUseContent = item.value;

          }
          if (item.slug == 'your-privacy-is-important') {
            this.privacyContent = item.value;
          }
        });
      }
    });
  }


  boostrap(id: String) {
    this.loadModelInfo(id);
    this.loadReviewOfModel(id);
    this.loadListModel(4);
    this.loadListGallery(id)
    // this.getTwilioToken();
  }

  private loadModelInfo(id: String) {
    this.modelService.getModelInfo(id).pipe(first()).subscribe(data => {
      this.model = new Model().deserialize(data['data']);
      this.modelService.updateCurrentModel(this.model);
      this.modelService.currentModel$.subscribe(data => {
        this.model = data;
      })
    })
  }


  private loadListGallery(id: String) {
    this.listGallery = [];
    this.galleryService.getGallery(id).subscribe(
      data => {
        data['data'].map(item => {
          this.listGallery.push(new Gallery().deserialize(item));
        });
      },
      error => {
        this.alertService.error(error.msg);
      }
    )
  }

  private loadReviewOfModel(id: String) {

    this.listReviews = [];
    this.reviewService.getReviewOfUser(id).pipe(first()).subscribe(
      data => {
        const rep = data.data;

        rep.forEach(element => {
          this.listReviews.push(new Review().deserialize(element).setUser(element.reviewerId));
        });
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

  private loadListModel(length: Number) {
    this.availableModel = [];
    this.modelService.getListModel(length)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status === true) {
          const modelList: any[] = [];
          data.data = this.shuffle(data.data);
          for (const item of data.data) {
            if (this.id !== item.id) {
              modelList.push(new Model().deserialize(item));
            }
          }

          if (modelList.length > 3) {
            for (let i = 0; i < modelList.length; i++) {
              if (i <= 2) {
                this.availableModel.push(modelList[i]);
              }
            }
          } else {
            this.availableModel = modelList;
          }
          this.availableModel.sort((x, y) => {
            return (x.status === y.status) ? 0 : x.status ? -1 : 1;
          })
        }
      },
        error => {
          this.alertService.error(error);
        });
  }

  private getTwilioToken() {
    this.modelService.getTwilioToken().pipe(first())
      .subscribe(
        data => {
          let s = JSON.stringify(data['token']);
          this.twilioToken = s.slice(1, s.length - 1);
          const deviceOptions = { 
            edge: ['frankfurt', 'sydney'],
            maxCallSignalingTimeoutMs: 30000,
            codecPreferences: ['opus', 'pcmu'] 
          }
          this.device = new Device(this.twilioToken);
          this.device.updateOptions(deviceOptions);
          this.device.ready(function (device) {
          });

          this.device.on('incoming',function (conn) {
            var archEnemyPhoneNumber = '+12099517118';
            if (conn.parameters.From === archEnemyPhoneNumber) {
              conn.reject();
              console.log('It\'s your nemesis. Rejected call.');
            } else {
              // accept the incoming connection and start two-way audio
              conn.accept();
            }
          }
          )
        }
        ,
        error => {
          this.alertService.error(error);
        });
  }

  public call() {
    if (!this.authentication.currentUserValue) {
      this.alertService.info('Please login to use this service');
      this.route.navigate(['/'], { queryParams: { returnUrl: this.route.getCurrentNavigation() } });
      return;
    }
    if (this.model.doNotDisturb || this.model.isCalling) {
      this.alertService.error("Model can't receive call, please call later");
      return;
    }
    else {
      this.callService.call(this.model);
    }
  }
  ngOnDestroy() {
    clearInterval(this.getModelInter);
  }
  openModal = async (content, index) => {

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getImageUrl(fileBaseUrl: string) {
    return this.host + fileBaseUrl;
  }
  viewImage = (index) => {
    let images = this.listGallery;
    this.photoSwipe.openGallery(images, true, index);
  }

  shuffle(arr: any[]) {
    let rand: any, temp: any, i: any;
    for (i = arr.length - 1; i > 0; i -= 1) {
      rand = Math.floor((i + 1) * Math.random());
      temp = arr[rand];
      arr[rand] = arr[i];
      arr[i] = temp;
    }
    return [...arr];
  }

  onClickSendMessage(user: any) {
    if (user && user.role === 'member') {
      this.onNavigateTo('/message', this.model.id);
    } else {
      // this.translateService.get(this.loginErrorMessage).subscribe((text: string) => {
      //   this.toasty.error(text);
      // });
      this.toasty.loginAlert();
    }
  }

  onClickCall(user: any) {
    if (!user || !user.access_token ) {
      this.toasty.loginAlert();
    } else {
      if(user.role == 'member'){
          this.call();
      }
      else{
        this.toasty.error('forbidden');
      }
    }
  }

  onNavigateTo(path: string, param?: any) {
    if (param) {
      this.route.navigate([path, param]);
    } else {
      this.route.navigate([path]);
    }
  }
}