import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from 'environments/environment'
import { UserService } from '@/_servies/user.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { AlertService } from '@/_servies/alert.service';
import { ModalService } from '@/_modal';
import { ReCaptcha2Component } from 'ngx-captcha';
import { IpServiceService } from '@/_servies/ip-service.service';
import { TranslateService } from '@ngx-translate/core';
import { passwordMatch } from '@/_validator/form-validators';
import { MESSAGE } from '@/app.config';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  VM = MESSAGE.VALIDATION;

  registerForm: FormGroup;
  loading = false;
  passwordMinLength = environment.minLengthPass;
  siteKey = environment.reCaptchaSiteKey;
  translateData = {
    passwordMinLength: environment.minLengthPass
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private ipServiceService: IpServiceService,
    private translateService: TranslateService
  ) {
    if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.access_token) {
      this.router.navigate(['/']);
    }
    this.initilizeForm();
  }

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'fr';
  public type: 'image' | 'audio';

  ngOnInit() { }

  openContact() {
    this.modalService.open('ticket-modal');
  }

  onSubmitForm() {
    if (!this.registerForm.valid) {
      this.validateForm(this.registerForm);
    } else {
      if (!this.terms.value) {
        this.alertService.error(this.translateService.instant(MESSAGE.TERM_CONDITION));
        return;
      }
      this.loading = true;
      this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == '200') {
            this.loading = false;
           // const confirmMessage = MESSAGE.CONFIRM_REGISTERATION.replace('{email}', this.email.value);
            const confirmMessage =this.translateService.instant(MESSAGE.CONFIRM_REGISTERATION) + " "+this.email.value;
            this.alertService.success(this.translateService.instant(confirmMessage), true, false, 15000);
            this.router.navigate(['/login']);
          }
          else {
            this.loading = false;
            this.alertService.error(data.msg);
            this.loading = false;
          }
        },
          error => {
            this.loading = false;
            this.alertService.error(error.message);
            this.loading = false;
          })
    }
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }
  get ipAddress() { return this.registerForm.get('ipAddress'); }

  private initilizeForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      ipAddress: '',
      terms: [false, Validators.required]
    }, { validator: passwordMatch('password', 'confirmPassword') });

    this.getIpAddress();
  }

  private validateForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(filed => {
      const control = formGroup.get(filed);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  private getIpAddress() {
    this.ipServiceService.getIPAddress().subscribe((res: any) => {
      if (res && res.ip) {
        this.ipAddress.setValue(res.ip);
      }
    });
  }

}

