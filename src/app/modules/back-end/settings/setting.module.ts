import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CKEditorModule } from 'ngx-ckeditor';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';


import {SettingComponent} from './setting.component';
import {UpdateSettingComponent} from './update-setting/update-setting.component';
import {CreateSettingComponent} from './create-setting/create-setting.component';
import {SettingRoutingModule} from './setting-routing.module';
@NgModule({
  declarations: [SettingComponent, UpdateSettingComponent, CreateSettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MatMenuModule,
    MatInputModule,
    MatSidenavModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    CKEditorModule,
    FormsModule, 
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })
  ]
})
export class SettingModule {}
