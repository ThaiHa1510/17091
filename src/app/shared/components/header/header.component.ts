import { Component, OnInit, Inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { PageconfigService } from '@/_servies/pageconfig.service';
import { AuthenticationService } from '@/_servies/authentication.service';
//import {WindowRef} from '@/_servies/windowref.service';
import { User, Config } from '@/_models/';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '@/shared/widgets/change-password/change-password.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit ,OnDestroy,AfterViewInit {
  user: User;
  pageConfig: Config;
  subcriptions:Subscription = new Subscription();
  constructor(
    private dialog: MatDialog,
    private pageconfigService: PageconfigService,
    private changeDectorRef:ChangeDetectorRef,
    private authentication: AuthenticationService) {

    this.subcriptions.add(
      this.authentication.currentAmin.subscribe((data) => {
        if (data) {
          this.user = data;
          this.changeDectorRef.markForCheck();
        }
      })
    );
    this.subcriptions.add(
      this.pageconfigService.currentConfig.subscribe(data => {
        if (data != null) {
          this.pageConfig = data;
        }
        else {
          this.pageConfig = new Config();
        }
        this.changeDectorRef.markForCheck();
      })
    );
  }

  ngOnInit() { }



  logout() {
    this.authentication.logoutAdmin();
  }

  changePassword() {
    const dialoagRef = this.dialog.open(ChangePasswordComponent, {
      width: "500px",
      data: this.user.id
    })
  }

  help() {
    //this.windowRef.nativeWindow.open("https://adent.io/products/xtalk/",'_blank');
    window.open("https://adent.io/products/xtalk/", '_blank');
  }

  ngOnDestroy(): void {
    this.subcriptions.unsubscribe();
  }

  ngAfterViewInit(){
    this.changeDectorRef.detach();
  }
}
