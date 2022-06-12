import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent} from './setting.component';
import { UpdateSettingComponent} from './update-setting/update-setting.component';
import { CreateSettingComponent} from './create-setting/create-setting.component';
const routes: Routes = [
  { 
	path: '',
	component: SettingComponent,
  },
  { 
	path: 'create',
	component: CreateSettingComponent,
  },
   { 
	path: ':id',
	component: UpdateSettingComponent,
  }
  
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule{ }
