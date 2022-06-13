import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalstorageService} from '@/_servies/localstorage.service';
import {AlertService} from '@/_servies/alert.service';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import {TopupService} from '@/_servies/topup.service';
import {UserService} from '@/_servies/user.service';
import {environment} from 'environments/environment';
import {User, Config} from '@/_models';
import {Subscription} from 'rxjs';
import {AppComponent} from '../../../app.component'
declare const $: any;
@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css']
})
export class TopUpComponent implements OnInit , OnDestroy{
  paymentSetting: any;
 // ccbillPath: String = environment.ccbill_endpoint;
  listTopup = [];
  user: User;
  subscriptions :Subscription= new Subscription();
  config: Config;
  //ccbill: String = "https://bill.ccbill.com/jpost/signup.cgi?clientAccnum=";
  constructor(private localStorage: LocalstorageService,
    private httpClient: HttpClient, private alertService: AlertService,
    private authentication: AuthenticationService,
    private topupService: TopupService,
    public pageConfig: PageconfigService) {
    this.subscriptions.add(
      this.pageConfig.currentConfig.subscribe(data => {
        if (data != undefined) {
          this.config = data;
        }
      })
    );
    this.subscriptions.add(
      this.httpClient.get<any>(`${environment.apiUrl}/api/v1/payment-setting/list/top-up`)
        .subscribe(
          data => {
            this.listTopup = data.data;
          },
          err => {
            this.alertService.error(err);
          }
        )
    );



  }

  ngOnInit() {
    this.user = new User();
    this.subscriptions.add(
      AppComponent.isBrowser.subscribe(isBowser => {
        if (isBowser) {
          this.user = new User().deserialize(JSON.parse(this.localStorage.getItem('currentUser')));
        }
      })
    );

  }
  clamFree(id) {
    this.subscriptions.add(
      this.topupService.claimFree(id).subscribe(data => {
        this.user.wasClaimFreeMin = true;
        this.authentication.setCurrentUserValue(this.user);
        AppComponent.isBrowser.subscribe(isBowser => {
          if (isBowser) {
            this.localStorage.setItem('currentUser', JSON.stringify(this.user));


            // this.user = new User().deserialize(JSON.parse(this.localStorage.getItem('currentUser')));
          }
        })
        this.alertService.success('Enjoy your free pack');
      }, err => {
        this.alertService.error(err);
      })
    );
  }

  getPrice(number) {
    return parseFloat(number).toFixed(2)
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }
}
