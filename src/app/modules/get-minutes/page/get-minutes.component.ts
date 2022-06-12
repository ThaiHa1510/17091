import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {  AlertService} from '@/_servies/alert.service';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { environment } from 'environments/environment'
import { User, Config } from '@/_models';
import {SettingService} from '@/_servies/setting.service';
import {SystemService} from '@/_servies/system.service'
import {TopupService} from '@/_servies/topup.service';
import {LocalstorageService} from '@/_servies/localstorage.service';
@Component({
  selector: 'app-get-minutes',
  templateUrl: './get-minutes.component.html',
  styleUrls: ['./get-minutes.component.css']
})
export class GetMinutesComponent implements OnInit {
  paymentSetting: any;
  listTopup = [];
  title=environment.appTitle;
  homeUrl=environment.baseUrl;
  pageConfig: Config;
  user: User;
  ccbillPath: String = environment.ccbill_endpoint;
  ccbill: String = "https://bill.ccbill.com/jpost/signup.cgi?clientAccnum=";
  whyChoseUseContent = '';
  privacyContent = '';
  constructor(private httpClient: HttpClient, private alertService: AlertService,
    private route: ActivatedRoute,
    private systemService:SystemService,
    private topupService:TopupService,
    private settingService: SettingService,
    private localstorageService:LocalstorageService,
    private pagconfigService: PageconfigService, private authentication: AuthenticationService) {
    this.httpClient.get<any>(`${environment.apiUrl}/api/v1/payment-setting/list/top-up`)
      .subscribe(
        data => {
          this.listTopup = data.data;
        },
        err => {
          this.alertService.error(err);
        }
      );
    this.pagconfigService.currentConfig.subscribe(data => {
      if (data != null) {
        this.pageConfig = data;
      }
      else {
        this.pageConfig = new Config();
      }
    });
  }
  ngOnInit() 
  {
    this.route.queryParams.subscribe(params => {
      if(this.authentication.currentUserValue )
      {
        if (params['message']) {
          switch (params['msgType']) {
            case 'success':
              this.alertService.success(params['message']);
              break;
            case 'error':
              this.alertService.error(params['message']);
              break;
            default:
              this.alertService.success(params['message']);
              return;
          }
        }
        if (params['reload']) {
          this.authentication.reload();
        }
      }
    });
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
  
   clamFree(id) {
    this.topupService.claimFree(id).subscribe(data => {
      this.user.wasClaimFreeMin = true;
      this.authentication.setCurrentUserValue(this.user);
      let isBowser = this.systemService.getBrowserValue;
      if (isBowser) {
        this.localstorageService.setItem('currentUser', JSON.stringify(this.user));


         // this.user = new User().deserialize(JSON.parse(this.localStorage.getItem('currentUser')));
        }
    
      this.alertService.success('Enjoy your free pack');
    }, err => {
      this.alertService.error(err);
    })
  }


  public getMinutes(token, price) {
    return Math.floor(token / price);
  }
  getPrice(number) {
    return parseFloat(number).toFixed(2)
  }
}
