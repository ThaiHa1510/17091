import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@/_servies/alert.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { CallService } from '@/_servies/call.service';
import { MESSAGE } from '@/app.config';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

    VM = MESSAGE.VALIDATION;
    loginForm: FormGroup;
    loading = false;
    returnUrl: string;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private callService: CallService
    ) {
        this.initilizeForm();
        this.route.queryParams.subscribe(params => {
            if (params['returnUrl']) {
                this.returnUrl = params['returnUrl'];
            }
        });
        this.alertService.clear();
    }

    ngOnInit() {
        if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.access_token) {
            this.router.navigate(['/']);
        }
    }
    onSubmit() {
        if (!this.loginForm.valid) {
            this.validateForm(this.loginForm);
        } else {
            this.loading = true;
            this.authenticationService.login(this.email.value, this.password.value)
                .pipe(first())
                .subscribe(
                    (data: any) => {
                        if (data && data.status == true) {
                            this.callService.reloadTwilio();
                            this.returnUrl = this.returnUrl ? this.returnUrl : '/';
                            this.router.navigate([this.returnUrl]);
                        }
                        else {
                            this.alertService.error(data.msg);
                        }
                        this.loading = false;
                    },
                    (error: any) => {
                        this.alertService.error('Invalid email or Password', false);
                        this.loading = false;
                    }
                );
        }
    }

    get email() { return this.loginForm.get('email') }
    get password() { return this.loginForm.get('password') }

    initilizeForm() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    private validateForm(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(filed => {
            const control = formGroup.get(filed);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }
}
