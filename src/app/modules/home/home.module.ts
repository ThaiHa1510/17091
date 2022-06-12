import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {Routes, RouterModule} from '@angular/router';
import {SharedModule, ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
const routes: Routes = [{
  path: '',
  component: HomeComponent,
  pathMatch: 'full'
}];
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    PipeModule,
    SharedModule,
    ImportsMaterialModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ]
})
export class HomeModule {}
