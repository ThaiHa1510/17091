import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ListModelComponent} from '../modules/list-model/list-model.component';
import {HomeComponent} from '../modules/home/home.component';
import {XtalkNotificationComponent} from '@/modules/xtalk-notification/xtalk-notification.component';
import {RegisterModelComponent} from '@/modules/register-model/page/register-model.component';
import {UserGuard, ModelGuard, AdminGuard} from '@/_middleware';
import {NotloginGuard} from '@/_middleware/notlogin.guard';
import {NotModelGuard} from '@/_middleware/not-model.guard';
import {DashboardComponent} from '@/modules/dashboard/dashboard.component';
import {AuthComponent} from '@/layouts/auth/auth.component';
import {DefaultComponent} from '@/layouts/default/default.component';
import {LanguageResolver} from '../shared/resolver/index';
import {BlankComponent} from '@/layouts/blank/blank.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: DefaultComponent, canActivate: [AdminGuard],
    children: [{
      path: '',
      component: DashboardComponent
    }, {
      path: 'reviews',
      loadChildren: () => import('../modules/review-manager/reivew-manager.module').then(m => m.ReivewManager)
    },
    {
      path: 'manager-user',
      loadChildren: () => import('../modules/manager-user/manager-user.module').then(m => m.ManagerUserModule)
    },
    {
      path: 'manager-model',
      loadChildren: () => import('../modules/manager-model/manager-model.module').then(m => m.ManagerModelModule)
    },
    {
      path: 'settings',
      loadChildren: () => import('../modules/back-end/settings/setting.module').then(m => m.SettingModule)
    },
    {
      path: 'i18n',
      loadChildren: () => import('../modules/back-end/i18n/i18n.module').then(m => m.I18nModule)
    },
    // {
    //   path: 'payment-settings',
    //   component: PaymentSettingsComponent
    // },
    {
      path: 'packages',
      loadChildren: () => import('../modules/packages/packages.module').then(m => m.PackagesModule)
    },
    {
      path: 'options',
      loadChildren: () => import('../modules/commission/commission.module').then(m => m.CommissionModule)
    },
    {
      path: 'page-config',
      loadChildren: () => import('../modules/page-config/page-config.module').then(m => m.PageConfigModule)
    },
    {
      path: "manager-withdraw",
      loadChildren: () => import('../modules/manager-withdraw/manager-withdraw.module').then(m => m.ManagerWithdrawModule)
    },
    {
      path: 'static-page',
      //loadChildren: () => import('./modules/static-page/').then(m => m.BecomevipModule)
      loadChildren: () => import('../modules/static-page/static-page.module').then(m => m.StaticPageModule)
    },
    {
      path: 'order-manager',
      loadChildren: () => import('@/modules/order-manager/order-manager.module').then(m => m.OrderManagerModule),
    },
    {
      path: 'ads',
      loadChildren: () => import('../modules/ads-manager/ads-manager.module').then(m => m.AdsManagerModule)
    },
    {
      path: 'payout',
      loadChildren: () => import('../modules/payouts/payouts.module').then(m => m.PayoutsModule)
    },
    {
      path: 'seo',
      loadChildren: () => import('../modules/seo-config/seo-config.module').then(m => m.SeoConfigModule)
    }
    ]
  },
  {
    path: 'auth', component: AuthComponent, canActivate: [UserGuard],
    resolve: {
      language: LanguageResolver
    },
    children: [{
      path: '',
      loadChildren: () => import('../modules/change-password/change-password.module').then(m => m.ChangePasswordModule)
    }, {
      path: 'send-withdraw',
      canActivate: [ModelGuard],
      loadChildren: () => import('../modules/send-withdraws/send-withdraws.module').then(m => m.SendWithdrawsModule)
    },
    {
      path: 'bank-account',
      canActivate: [ModelGuard],
      loadChildren: () => import('../modules/bank-account/bank-account.module').then(m => m.BankAccountModule)
    }

    ]
  },
  {
    path: '',
    component: BlankComponent,
    resolve: {
      language: LanguageResolver
    },
    children: [{
      path: '',
      loadChildren: () => import('@/modules/home/home.module').then(m => m.HomeModule),
    }, {
        path: "my-gallery",
        canActivate: [ModelGuard],
        loadChildren: () => import('@/modules/my-gallery/my-gallery.module').then(m => m.MyGalleryModule),
      },
      {
        path: 'profils',
        component: ListModelComponent
      },
      {
        path: 'accueil',loadChildren: () => import('@/modules/home/home.module').then(m => m.HomeModule),
    },
    {

      path: 'model-detail/:id',
      loadChildren: () => import('../modules/model-detail/model-detail.module').then(m => m.ModelDetailModule)
    },
    {
      path: 'login',
      loadChildren: () => import('../modules/login/login.module').then(m => m.LoginModule),
      canActivate: [NotloginGuard],
    },
    {
      path: 'inscrivez-vous',
      loadChildren: () => import('../modules/signup/signup.module').then(m => m.SignupModule)
    },
    {
      path: 'register',
      loadChildren: () => import('../modules/signup/signup.module').then(m => m.SignupModule)
    },
    {
      path: 'model/all-review/:id',
      loadChildren: () => import('@/modules/all-review/all-review.module').then(m => m.AllReviewModule)
    },
    {
      path: 'talk-history',
      loadChildren: () => import('../modules/talk-history/talk-history.module').then(m => m.TalkHistoryModule),
      canActivate: [UserGuard]
    },
    {
      path: 'profile',
      loadChildren: () => import('../modules/edit-profile/edit-profile.module').then(m => m.EditProfileModule),
      canActivate: [UserGuard]
    },
    {
      path: 'notification',
      component: XtalkNotificationComponent,
      canActivate: [UserGuard]
    },
    {
      path: 'message',
      loadChildren: () => import('@/modules/chat/chat.module').then(m => m.ChatModule),
      canActivate: [UserGuard]
    },
    {
      path: 'register-model',
      loadChildren: () => import('../modules/register-model/register-model.module').then(m => m.RegisterModelModule),
      canActivate: [NotloginGuard]
    },
    {
      path: 'message/:id',
      loadChildren: () => import('@/modules/chat/chat.module').then(m => m.ChatModule),
      canActivate: [UserGuard]
    },
    {
      path: 'page',
      loadChildren: () => import('@/modules/page/page.module').then(m => m.PageModule)
    },
    {
      path: 'recharger-mon-compte',
      loadChildren: () => import('@/modules/get-minutes/get-minutes.module').then(m => m.GetMinutesModule),
      canActivate: [UserGuard]
    },
    {
      path: 'comment-ça-marche',
      loadChildren: () => import('@/modules/how-to-call/how-to-call.module').then(m => m.HowToCallModule),
    },
    {
      path: 'forgot-password',
      loadChildren: '../_page/forget-password/forget-password.module#ForgetPasswordModule'
    },
    {
      path: 'response-reset',
      loadChildren: () => import('@/modules/response-reset-password/response-reset-password.module').then(m => m.ResponseResetPasswordModule)
    },
    {
      path: 'login/dashboard',
      loadChildren: () => import('@/modules/login-dashboard/login-dashboard.module').then(m => m.LoginDashboardModule)
    }
    ]
  },
  
  {
    path: '**',
    redirectTo: '/'
  },


];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule {}