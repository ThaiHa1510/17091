import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Alert, AlertType, User } from '@/_models';
import { AlertComponent } from '@/shared/components/alert/alert.component';
import { NewMessageAlertComponent } from '@/shared/components/custom-alert/new-message-alert/new-message-alert.component';
import { LoginAlertComponent } from '@/shared/components/custom-alert/login/login-alert.component';
import { TranslateService } from '@ngx-translate/core';

import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;
    private defaultId = "default-id";
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(private router: Router, private _snackBar: MatSnackBar, private translateService: TranslateService) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }

    // enable subscribing to alert
    onAlert(id = this.defaultId) {
        return this.subject.asObservable().pipe(filter(x => x.id == id && x.message != null));
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false, autoClose = true, duration = 3500) {

        this.openSnackBar(message, AlertType.Success, duration)
    }

    error(message: string, keepAfterRouteChange = false, autoClose = true) {
        this.openSnackBar(message, AlertType.Error);
        // this.alert(new Alert({ keepAfterRouteChange:keepAfterRouteChange,autoClose:autoClose,type: AlertType.Error, message: message }));

    }

    info(message: string, keepAfterRouteChange = false, autoClose = true) {
        this.openSnackBar(message, AlertType.Info);
        //   this.alert(new Alert({ keepAfterRouteChange:keepAfterRouteChange,autoClose:autoClose,type: AlertType.Info, message: message }));

    }

    warning(message: string, keepAfterRouteChange = false, autoClose = true) {
        this.openSnackBar(message, AlertType.Warning);
        //this.alert(new Alert({ keepAfterRouteChange:keepAfterRouteChange,autoClose:autoClose,type: AlertType.Warning, message: message }));

    }

    clear(id: string = this.defaultId) {
        // clear by calling subject.next() without parameters
        id ? this.subject.next(new Alert({ id })) : this.subject.next(null);

    }

    private alert(alert: Alert) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    openSnackBar(message, type: AlertType, duration = 2000) {
        let translateMessage = message;
        if(typeof translateMessage == "undefined"){
            message="Server Error";
        }
        this.translateService.get(message).subscribe((res: string) => {
            translateMessage = res;
            //=> 'hello world'
        });

        const alertTypeClass = {
            [AlertType.Success]: ['alert', 'alert-success'],
            [AlertType.Error]: ['alert', 'alert-danger'],
            [AlertType.Info]: ['alert', 'alert-info'],
            [AlertType.Warning]: ['alert', 'alert-warning']
        };
        const alertTypeAction = {
            [AlertType.Success]: 'Success',
            [AlertType.Error]: 'Error',
            [AlertType.Info]: 'Info',
            [AlertType.Warning]: 'Warning'
        };

        this.translateService.get(alertTypeAction[type]).subscribe((text: string) => {
            this._snackBar.open(translateMessage,text, {
                duration: duration,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                panelClass: alertTypeClass[type]
            });
        })
            
    
    }


    newMessage(user: User) {
        this._snackBar.openFromComponent(NewMessageAlertComponent,
            {
                duration: 10000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                panelClass: ['mat-elevation-z3', 'alert', 'alert-info'],
                data: user
            });
    }

    loginAlert(){
        this._snackBar.openFromComponent(LoginAlertComponent,
            {
                duration: 10000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                panelClass: ['mat-elevation-z3', 'alert', 'alert-danger']
            });
    }
}
