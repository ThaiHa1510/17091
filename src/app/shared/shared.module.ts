import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterDashboardComponent } from './components/footer-dashboard/footer-dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { AlertComponent }  from './components/alert/alert.component';
import { TopUpComponent} from './components/top-up/top-up.component';
import { ModelOfWeekComponent} from './components/model-of-week/model-of-week.component' ;
import { NavigationComponent} from './components/navigation/navigation.component';
import { XtalkRatingComponent} from './components/xtalk-rating/xtalk-rating.component';
import { BecomeModelComponent} from './components/become-model/become-model.component';
import { BannerComponent } from './components/banner/banner.component';
import { ConfirmModalComponent } from './widgets/confirm-modal/confirm-modal.component';
import { EditUserModalComponent } from './widgets/edit-user-modal/edit-user-modal.component';
import { EditPackagesComponent } from './widgets/edit-packages/edit-packages.component';
import { ChangePasswordComponent } from './widgets/change-password/change-password.component';
import { ListModelComponent} from './components/list-model/list-model.component';
import { UploadAudioComponent } from './widgets/upload-audio/upload-audio.component';
import { RatingCallComponent } from './widgets/rating-call/rating-call.component';
import { AddUserComponent } from './widgets/add-user/add-user.component';
import { AddPackageComponent } from './widgets/add-package/add-package.component';
import { EditAdsComponent } from './widgets/edit-ads/edit-ads.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogPolicyComponent} from './widgets/dialog-policy/dialog-policy.component';
import { DebounceClickDirective } from './directive/debounceclick.directive';
import { MobileSidebarComponent} from './components/mobile-sidebar/mobile-sidebar.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ModelCardComponent } from './components/model-card/model-card.component';
import { MessagesChatComponent } from './components/messages-chat/messages-chat.component';
import { FrontEndComponent } from '@/layouts/front-end/front-end.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import {CdkTableModule} from '@angular/cdk/table';
import {A11yModule} from '@angular/cdk/a11y';
import {NgbModule,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS,HttpClient } from '@angular/common/http';
//import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PhotoSwipeModule} from '@/modules/photo-swipe/photo-swipe.module';
import {environment} from '../../environments/environment';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslateLoader} from '@ngx-translate/core';
export function createTranslateLoader(http: HttpClient) {

  return new TranslateHttpLoader(http, `${environment.apiUrl}/api/v1/i18n/`, '.json');
  // return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
// Material Form Controls
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
// Material Popups & Modals
//import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { EditOptionsComponent } from './widgets/edit-options/edit-options.component';
import { NewMessageAlertComponent } from './components/custom-alert/new-message-alert/new-message-alert.component';
import { LoginAlertComponent } from './components/custom-alert/login/login-alert.component';
@NgModule({
  exports: [
    A11yModule,
    //ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
   // MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
   // MatOptionModule,
    MatListModule,
    
  ],
  declarations: [FrontEndComponent],
  imports: [],
})
export class ImportsMaterialModule {}
@NgModule({
  declarations: [
    FooterComponent,
    DialogPolicyComponent,
    HeaderComponent,
    FooterDashboardComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    AlertComponent,
    TopUpComponent,
    ModelOfWeekComponent,
    NavigationComponent,
    XtalkRatingComponent,
    BecomeModelComponent,
    BannerComponent,
    ConfirmModalComponent,
    EditUserModalComponent,
    EditPackagesComponent,
    ChangePasswordComponent,
    ListModelComponent,
    UploadAudioComponent,
    RatingCallComponent,
    AddUserComponent,
    AddPackageComponent,
    EditAdsComponent,
    DebounceClickDirective,   
    MobileSidebarComponent, 
    ModelCardComponent,
    EditOptionsComponent,
    MessagesChatComponent,
    NewMessageAlertComponent,
    LoginAlertComponent
  ],
  imports: [
    CommonModule,
    ImportsMaterialModule,
    PipeModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ImageCropperModule,
    NgxIntlTelInputModule,
    NgxCaptchaModule,
    PhotoSwipeModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

  ],
  exports: [
    HeaderComponent,
    NgxIntlTelInputModule,
    FooterComponent,
    DialogPolicyComponent,
    FooterDashboardComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    AlertComponent,
    TopUpComponent,
    ModelOfWeekComponent,
    NavigationComponent,
    XtalkRatingComponent,
    BecomeModelComponent,
    BannerComponent,
    ConfirmModalComponent,
    EditPackagesComponent,
    ListModelComponent,
    DebounceClickDirective,
    ModelCardComponent,
    MessagesChatComponent,
    EditOptionsComponent,
    MobileSidebarComponent,
    UploadAudioComponent,
    ImageCropperModule,
    PhotoSwipeModule,
    NgbModule,
    FlexLayoutModule,
    NewMessageAlertComponent,
    TranslateModule
  ],
  entryComponents:[
    NewMessageAlertComponent,
    LoginAlertComponent,
    LoginAlertComponent,
    ConfirmModalComponent,
    EditUserModalComponent,
    EditPackagesComponent,
    ChangePasswordComponent,
    UploadAudioComponent,
    RatingCallComponent,
    AddUserComponent,
    DialogPolicyComponent,
    EditOptionsComponent,
    EditAdsComponent,
        
  ]
})
export class SharedModule { }
