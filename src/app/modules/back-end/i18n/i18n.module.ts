import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LanguagesComponent, NewLanguageModalComponent} from './components/languages/languages.component';
import {LanguageService} from '@/_servies/admin/language.service';
import {TextService} from '@/_servies/admin/text.service';
import {TranslationService} from '@/_servies/admin/translation.service';
import {TextComponent} from './components/text/text.component';
import {NewItemModalComponent, TranslationComponent} from './components/translation/translation.component';
import {SharedModule, ImportsMaterialModule} from '@/shared/shared.module';
const routes: Routes = [
  {
    path: '',
    component: LanguagesComponent,
    data: {
      title: 'Manage languages',
      urls: [{title: 'Languages', url: '/i18n'}, {title: 'Listing'}]
    }
  },
  {
    path: 'translations/:lang',
    component: TranslationComponent,
    data: {
      title: 'Manage text',
      urls: [{title: 'Translations'}, {title: 'Listing'}]
    }
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule, ImportsMaterialModule],
  declarations: [LanguagesComponent, NewLanguageModalComponent, TextComponent, TranslationComponent,NewItemModalComponent],
  providers: [LanguageService, TextService, TranslationService],
  exports: [],
  entryComponents: [NewLanguageModalComponent,NewItemModalComponent]
})
export class I18nModule {}
