import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import {SystemService} from '@/_servies/system.service';
@Injectable({ providedIn: 'root' })
export class LanguageResolver implements Resolve<Observable<any>> {
  constructor(private systemService: SystemService) {
  }

  resolve(): any {
     this.systemService.configs().subscribe(function(){
      
    })
    return 'fr';
     
  }
}
