import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Model, CallHistory, EventSocket } from '@/_models';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, first, finalize } from 'rxjs/operators';
import { AcceptCallService, } from '@/_servies/acceptCall.service';
import { SocketService } from './socket.service';
import { AlertService } from './alert.service';
import { PageconfigService } from './pageconfig.service';
import { ModelService } from './model.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { ModalService } from '@/_modal/modal.service';
import { environment } from '../../environments/environment';
import { LocalstorageService } from './localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { RatingCallComponent } from '@/shared/widgets/rating-call/rating-call.component';
import { Device } from '@twilio/voice-sdk';
@Injectable({
  providedIn: 'root'
})
export class CallService {
  public twilioTokenSubject: BehaviorSubject<string>;
  public currentTwilioToken: Observable<string>;
  private otherPerson: BehaviorSubject<Model>;
  public otherPerson$: Observable<Model>;
  public fromName: String;
  public isCaller: boolean = true;
  public availMin: number;
  public dialogRef: any;
  private _EndCall = new Subject();
  _EndCall$ = this._EndCall.asObservable();
  private _AcceptCall = new Subject();
  _AcceptCall$ = this._AcceptCall.asObservable();
  private remainingTime: BehaviorSubject<number>;
  public remainingTime$: Observable<number>;
  private resetCallDuration: BehaviorSubject<any>;
  public resetCallDuration$: Observable<Model>;
  private user: User;
  public type: string;
  public callId;
  private params: any;
  private device:any;
  private _StartCall = new Subject();
  _StartCall$ = this._StartCall.asObservable();

  constructor(private http: HttpClient, private modelService: ModelService,
    private alertService: AlertService, private modalService: ModalService,
    private localStorage: LocalstorageService, public dialog: MatDialog,
    private pageConfigService: PageconfigService, private socketServivce: SocketService,
    private acceptCallService: AcceptCallService, private authentication: AuthenticationService
    ) {
    this.remainingTime = new BehaviorSubject<number>(0);
    this.remainingTime$ = this.remainingTime.asObservable();
    this.otherPerson = new BehaviorSubject<Model>(new Model());
    this.otherPerson$ = this.otherPerson.asObservable();
    this.twilioTokenSubject = new BehaviorSubject<string>(null);
    this.currentTwilioToken = this.twilioTokenSubject.asObservable();
    this.user = this.authentication.currentUserValue;
    this.resetCallDuration = new BehaviorSubject<any>({});
    this.resetCallDuration$ = this.resetCallDuration.asObservable();
    this.authentication.currentUser.subscribe(data => {
      this.user = data;
      if (this.user) {
        this.pageConfigService.currentConfig.subscribe(data => {
          if (data) {
            this.remainingTime.next(Math.floor(this.user.token));

          }
        })
      }
      });
      this.currentTwilioToken.subscribe(data => {
        this.initalTwilioSetup();
      });
      this.getTimmer();
      this.setUpSocketEvent();
  }
  getAllHistory() {
    return this.http.get<CallHistory[]>(`${environment.apiUrl}/api/v1/call/history`);
  }

  getAllHistoryofModel() {
    return this.http.get<CallHistory[]>(`${environment.apiUrl}/api/v1/call/model/history`);
  }

  public initalTwilioSetup() {
    if (this.twilioTokenSubject.value != null) {
      this.setupTwilio();
    }
  }

  private setupTwilio() {
    const deviceOptions = {
      edge: 'frankfurt',
      maxCallSignalingTimeoutMs: 30000,
      codecPreferences: ['opus', 'pcmu'] 
    }
    this.device = new Device(this.twilioTokenSubject.value);
    this.device.updateOptions(deviceOptions);
    this.device.on('offline', (device) => {
      if (this.user != null) {
        this.reloadTwilio();
      }
    })
    this.device.on('error', (twilioError, call) => {
      //console.log('An error has occurred: ', twilioError);
    });
    this.device.on('registered', this.handleSuccessfulRegistration);

    this.device.register();

    this.device.on('disconnect', (conn) => {
      console.log('device disconnect');
      conn.reject(() => { });
      if (this.callId != conn.parameters.CallSid) {
        this._EndCall.next({
          lastCallId: this.callId,
          currentCallId: conn.parameters.CallSid,
        });
      }
      this.callId = conn.parameters.CallSid;
      this.otherPerson.next(null);
      this.modalService.closeAll();
      this.resetCallDuration.next({ action: 'reset_call_duration' });
      if (this.user.role === 'member') {
        this.socketServivce.emitEvent(EventSocket.CALLEND, {
          From: this.user.id,
          To: conn.message.To,
        });
        this.openRatingDialog();
      }
      setTimeout(() => {
        this.authentication.reload();
      }, 1000);

    });

    this.device.on('incoming', (conn) => {
      this.modalService.open('reviced-call');
      conn.accept(function () {
      });
      this._AcceptCall$.subscribe(() => {
        this.type = "inbound";
        this.callId = conn.parameters.CallSid;
        conn.accept();
      }
      );
      this.fromName = conn.message.fromName;
      this.availMin = conn.message.availMin;
      this.otherPerson.next(conn.parameters);
      this._EndCall$.subscribe(data => {
        conn.reject();
        //conn.disconnect();
        conn.disconnect();
      });
    });

    this.device.on('cancel', (connection) => {
      console.log('run device cancael');
      this.otherPerson.next(null);
      this.modalService.closeAll();
      this.device.activeConnection();
    })

    this.device.on('tokenWillExpire', () => {
      this.reloadTwilio();
    });
    
    this.reUpdateTwilioToken();

  }

  private handleSuccessfulRegistration = () => {
    console.log('The device is ready to receive incoming calls.')
  }

  private openRatingDialog() {
    if (this.type == 'outbound') {
      this.getCallInfo().subscribe(data => {
        const response = data['data'];
        if (response && response.callStatus == 'completed') {
          this.dialogRef = this.dialog.open(RatingCallComponent, {
            width: "500px",
            data: {
              callId: this.callId,
              me: this.user,
              id: response._id,
            }
          });
          this.dialogRef.afterClosed().pipe(
            finalize(() => this.dialogRef = undefined)
          );
        }
      }, error => console.log(error))

    }
  }

  public updateTwilioToken(token: string) {
    this.twilioTokenSubject.next(token);
  }


  public reUpdateTwilioToken() {
    const TTL = 600000;
    const REFRESH_TIMER = TTL - 30000;
    const interval = setInterval(async () => {
    this.modelService.getTwilioToken()
      .subscribe(
        data => {
          let s = JSON.stringify(data['token']);
          const twilioToken = s.slice(1, s.length - 1);
          this.localStorage.setItem('twilioToken', twilioToken);
          this.twilioTokenSubject.next(twilioToken);
          this.device.updateToken(twilioToken);
        },
        error => {
          this.alertService.error("Invalid security token; please reload the page and try again");
        });
    },REFRESH_TIMER);
  }
  
  public reloadTwilio() {
    this.modelService.getTwilioToken()
      .subscribe(
        data => {
          let s = JSON.stringify(data['token']);
          const twilioToken = s.slice(1, s.length - 1);
          this.localStorage.setItem('twilioToken', twilioToken);
          this.twilioTokenSubject.next(twilioToken);
          this.device.updateToken(twilioToken);
        },
        error => {
           this.alertService.error("Invalid security token; please reload the page and try again");
        });
  }

  public getTwilioToken(): string {
    return this.twilioTokenSubject.value;
  }

  public acceptCall() {
    this._AcceptCall.next();
  }

  public call(to: Model) {
    if (this.user != null && to != null) {
      if (to.id != this.user.id) {
        this.otherPerson.next(to);
        let params = {
          To: to.id,
          From: this.user.id
        };
        this.makeCall(params);
      }
      else {
        this.alertService.error("You cannot make outgoing calls  to yourself.");
      }
    }
    else {
      this.alertService.error("Signup/Login to call the model");
    }

  }

  private async makeCall(params: any) {
    this.type = "outbound";
    this.params = params;
    const call= await this.device.connect({params});
    if(call){
      this.setUpTwilioConnect(call);
      this.socketServivce.emitEvent(EventSocket.CALLSTART, params);
    }
  }

  public endCall() {
    this._EndCall.next(null);
    this.modalService.closeAll();
    this.device.disconnectAll();
  }


  public setUpTwilioConnect(conn) {
    conn.on('cancel', () => {
      console.log('cancel event');
      this.modalService.closeAll();
      this._EndCall.next(null);
    })

    conn.on('disconnect', () => {
      console.log('disconnect event');
      console.log(conn.customParameters.get('To'));
      this.socketServivce.emitEvent(EventSocket.CALLEND, {
        From: this.user.id,
        To: conn.customParameters.get("To"),
      });
      this._EndCall.next(null);
    })

    conn.on('error', (error) => {
      console.log('error event');
      this._EndCall.next(null);
      this.alertService.error(error.message, false, true);
    })

    conn.on('accept', (connection) => {
      console.log('disconnect event');
      this._StartCall.next(true);
    })

    conn.on('reject', (connection) => {
      console.log('reject event');
      this._StartCall.next(true);
    })
  }

  get getType() {
    return this.type;
  }

  public getCallInfo() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/v1/call/info?callId=${this.callId}&from=${this.params.From}&to=${this.params.To}`);
  }

  public updateTimer() {
    if (this.pageConfigService && this.pageConfigService.currentConfigValue) {
      if (this.remainingTime.value <= 0) {
        this.remainingTime.next(0);
      }
      else {
        this.remainingTime.next(this.remainingTime.value - 1);
      }
    }
  }
  private getTimmer() {
    return this.remainingTime.value;
  }

  private setUpSocketEvent() {
    this.socketServivce.onEvent(EventSocket.CALLSTART).subscribe(data => {
      this.modelService.modelIsCalling(data);
    })
    this.socketServivce.onEvent(EventSocket.CALLEND).subscribe(data => {
      this.modelService.modelIsCallingOff(data);
    })
  }


}



