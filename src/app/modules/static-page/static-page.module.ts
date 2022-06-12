import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { StaticPageComponent } from './static-page.component';
import { StaticPageRoutingModule } from './static-page-routing.module';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { CKEditorModule } from 'ngx-ckeditor';
// Material Form Controls
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// Material Navigation
import { MatSidenavModule } from '@angular/material/sidenav';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Material Popups & Modals
import { MatDialogModule } from '@angular/material/dialog';
// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { ManagerStaticPageComponent } from './manager-static-page/manager-static-page.component';
@NgModule({
  declarations: [StaticPageComponent, ManagerStaticPageComponent],
  imports: [
    MatInputModule,
    MatSidenavModule,
    MatDialogModule, 
    MatDividerModule, 
    MatCardModule, 
    MatPaginatorModule, 
    MatTableModule ,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    CKEditorModule,
    CommonModule,
    StaticPageRoutingModule,
	  FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ],
   providers: [
    
  ],
  exports:[
    StaticPageRoutingModule
  ]
})
export class StaticPageModule {}
