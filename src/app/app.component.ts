import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ModalService } from '@/_modal';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '@/_servies/alert.service';
import { PageconfigService } from '@/_servies/pageconfig.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { AcceptCallService } from '@/_servies/acceptCall.service';
import { SeoConfigService } from '@/_servies/seoconfig.service';
import { LoadingServiceService } from '@/_servies/loading-service.service';
import { CallService } from '@/_servies/call.service';
import { ChatService } from '@/_servies/chat.service';
import { Config, User, Model, Ads, Ticket } from './_models';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RatingCallComponent } from '@/shared/widgets/rating-call/rating-call.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ContentObserver } from '@angular/cdk/observers';
import { Title, Meta } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SystemService } from '@/_servies/system.service';
import { Observable } from 'rxjs';
declare const Twilio;
declare let ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loading: boolean = false;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  canSubmit: boolean = true;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'fr';
  public type: 'image' | 'audio';
  formBuilder: FormBuilder;
  chatName: string = "Kim Amana";
  hiddenAnswer: boolean = false;
  pageConfig: Config;
  idCallModel: string = "reviced-call";
  currentModel: Model;
  user: User;
  ads: Ads;
  timer: number;
  startInterval;
  tokenInterVal;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  ticketForm: FormGroup;
  callDuration: any = {
    hours: 0,
    minitutes: 0,
    seconds: 0,
    total: 0,
  }
  ticket: Ticket;
  static isBrowser = new BehaviorSubject<boolean>(null);
  constructor(private modalService: ModalService, public callService: CallService,
    private translate: TranslateService,
    private systemService: SystemService,
    private acceptService: AcceptCallService, 
    private authentication: AuthenticationService,
    private chatService: ChatService, 
    private titleService: Title,
    public dialog: MatDialog, private seoService: SeoConfigService,
    private alertService: AlertService, private router: Router,
    private httpClient: HttpClient, private _loading: LoadingServiceService,
    private route: ActivatedRoute, private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private pageConfigService: PageconfigService) 
    {
    this.systemService.setBrowser(platformId);
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    this.listenToLoading();
    this.formBuilder = new FormBuilder();
    this.user = this.authentication.currentUserValue;
    this.ticket = new Ticket();
    this.ticketForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      subject: ['', Validators.required],
      phone: ['', Validators.required],
      description: ['', [Validators.required]],
    });
    this.seoService.currentSeo.subscribe(data => {
      if (data) {
        this.setTitle(data.title);
        this.setDescription(data.description);
        this.setKeyWord(data.keyword);
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.user) {
          this.authentication.reload();
        }
      }
    });
  }

  handelMessageRouter() {
    let messageCode = this.route.snapshot.queryParamMap.get('messageCode');
    if (messageCode) {
      switch (messageCode) {
        case 'VerifySuccess':
          this.alertService.success("Your account is activated.Please login to use our service", true, false);
          break;
        case 'VerifyExpired':
          this.alertService.error("Your code is invalid or has expired.");
          break;
        case 'VerifyError':
          this.alertService.error("Something went wrong, please try again.");
          break;
        case 'paymentSuccess':
            console.log("run alert payment success");
            this.alertService.success("Success_Payment_Alert");
            break;
        default:
          // this.alertService.success(params['message'], true, false);
          return;
      }
    }

  }
  getTranslation(lang: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + `/api/v1/i18n/${lang}.json`)

  }

  ngOnInit() {
    if (localStorage.getItem('twilioToken')) {
      this.callService.twilioTokenSubject.next(localStorage.getItem('twilioToken'));
    }
    this.callService.remainingTime$.subscribe(data => {
      this.timer = data;
    }, err => {
      this.timer = 0;
    });
    this.pageConfigService.getAds();

    this.callService.otherPerson$.subscribe(data => {
      this.currentModel = data;
      if (data != null && data.id) {
        this.modalService.open('call-modal');
      } else {
        this.hiddenAnswer = false;
      }

    });
    this.authentication.currentUser.subscribe(data => {
      this.user = data;
    });

    this.callService.resetCallDuration$.subscribe(data => {
      if (data['action'] == 'reset_call_duration') {
        this.resetCallDuration();

      }
    });
    const defaultLang = 'fr';



    this.systemService.configs().subscribe(resp => {
      if (resp) {
        this.translate.setDefaultLang(resp.defaultLanguage);
        this.translate.use(resp.userLang);
        this.getTranslation(resp.userLang).subscribe(() => {
          this.handelMessageRouter();
        });
      } else {
        this.translate.setDefaultLang('fr');
        this.translate.use('Fr');
      }
    });
    //    setTimeout(()=>{
    //      this.translate.setDefaultLang('ca');
    //
    //        this.translate.use('ca');
    //    },10000);
    //    this.systemService.configs().subscribe(resp =>{
    //       this.translate.setDefaultLang(resp.data.defaultLanguage);
    //       this.translate.use(resp.data.userLang);
    //    });


    this.route.queryParams.subscribe(params => {
      if (params['reload']) {
        this.authentication.reload();
      }
    });

    this.callService._EndCall$.subscribe(data => {
      this.hiddenAnswer = false;
      //  this.openRatingDialog();
    })
    this.callService._StartCall$.subscribe(data => {
      if (data) {
        this.startCallDuration();
      }
    })
    this.hiddenAnswer = false;
    this.pageConfigService.currentConfig.subscribe(data => {
      if (data) {
        this.pageConfig = data;
        if (this.pageConfig && this.pageConfig.faviconLink) {
          this.favIcon.href = this.pageConfig.faviconLink;
        }
        if (this.pageConfig && this.pageConfig.googleCode) {
          ga('create', this.pageConfig.googleCode, 'auto');
          ga('send', 'pageview');
        }
      }
    })

    this.ads = this.pageConfigService.currentAdsValue;
  }
  listenToLoading() {
    this._loading.loadingSub.pipe(delay(0)).subscribe(loading => {
      this.loading = loading;
    });
  }
  //tra loi cuoc goi
  acceptCall() {
    this.hiddenAnswer = true;
    this.callService.acceptCall();
    this.startCallDuration();
  }

  //gac may
  hangup() {
    this.callService.endCall();
    this.hiddenAnswer = false;
    //this.resetCallDuration();

  }

  private resetCallDuration() {
    clearInterval(this.startInterval);
    clearInterval(this.tokenInterVal);
    this.callDuration.hours = 0;
    this.callDuration.minitutes = 0;
    this.callDuration.seconds = 0;
  }

  public startCallDuration() {
    this.startInterval = setInterval(() => {
      this.callDuration.total++;
      if (this.callDuration.seconds == 59) {
        this.callDuration.seconds = 0;
        if (this.callDuration.minitutes == 59) {
          this.callDuration.minitutes = 0;
          this.callDuration.hours++;
        }
        else {
          this.callDuration.minitutes++;
        }
        if (this.pageConfigService.currentConfigValue) {
          if (this.callService.isCaller && this.user.role == "member") {
            this.callService.updateTimer();
          }
          else {
            this.callService.availMin = this.callService.availMin - 1;
          }
        }
      }
      else {
        this.callDuration.seconds++;
      }

    }, 1000);
    this.tokenInterVal = setInterval(() => {
      this.user.token = this.user.token - 10;
    }, 60000);
  }

  private openRatingDialog() {
    if (this.callService.type == 'outbound') {
      this.callService.getCallInfo().subscribe(data => {
        const response = data['data'];
        if (response && response.callStatus == 'completed') {
          const dialoagRef = this.dialog.open(RatingCallComponent, {
            width: "500px",
            data: {
              callId: this.callService.callId,
              me: this.user,
              id: response._id,
            }
          });
        }
      }, error => console.log(error))

    }
  }

  submitContact() {
    if (this.ticketForm.invalid) {
      return;
    }

    this.httpClient.put<any>(`${environment.apiUrl}/api/v1/ticket/`, this.ticket).subscribe(data => {
      this.modalService.closeAll();
      this.alertService.success("Success");
    },
      err => {
        this.alertService.error("Failed");
      })
  }
  handleSuccess(e) {
    this.canSubmit = true;
  }
  close() {
    this.modalService.closeAll();
  }

  getTimerCall() {
    if (this.user && this.user.id) {
      var price = this.pageConfigService.currentConfigValue.price;
      var token = this.user.token;
      this.timer = Math.floor(token / price);
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public setDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description })
  }
  public setKeyWord(keyword: string) {
    this.meta.updateTag({ name: 'keyword', content: keyword })
  }
}

