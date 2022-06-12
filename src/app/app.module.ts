import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS,HttpClient } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { ListModelComponent } from './modules/list-model/list-model.component';
import { ModalModule } from './_modal';
//import { SearchableListPipe } from './_pipe/searchable-list.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XtalkNotificationComponent} from '@/modules/xtalk-notification/xtalk-notification.component';
import { PipeModule } from '@/_pipe/pipe/pipe.module';
import { DefaultModule} from '@/layouts/default/default.module';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import { AuthModule } from './layouts/auth/auth.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LanguageResolver } from './shared/resolver';
import { BlankComponent } from './layouts/blank/blank.component';
import {environment} from '../environments/environment';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
export function createTranslateLoader(http: HttpClient) {

  return new TranslateHttpLoader(http, `${environment.apiUrl}/api/v1/i18n/`, '.json');
  // return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
@NgModule({
  declarations: [
    AppComponent,
    ListModelComponent,
    XtalkNotificationComponent,
    BlankComponent
  ],
  imports: [
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RoutingModule,
    ModalModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ImportsMaterialModule,
    SharedModule,
    PipeModule,
    DefaultModule,
    AuthModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    LanguageResolver

  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  chatName:string="Kim Amana";
}

