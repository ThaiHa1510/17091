import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Subject,BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SystemService {
  public appConfig: any = null;
  apiUrl = environment.apiUrl + '/api/v1/';
  constructor(private http: HttpClient) {

  }
  
  
  public get getConfigValue() {
    return this.getConfig.value;
  }
  private isBrowser = new BehaviorSubject<boolean>(null);
  private getConfig: BehaviorSubject<any>=new BehaviorSubject<any>(null);
  setBrowser(data){
    this.isBrowser.next(data);
  }
  public get getBrowserValue() {
    return this.isBrowser.value;
  }
  configs() {

    if(this.appConfig){
       return this._getConfig.asObservable();
    }
    if (this.getConfigValue) {
      return this.getConfig.asObservable();
    }
    this.http.get(this.apiUrl + 'languages')
      .subscribe((resp: any) => {
        var subject = new Subject<string>();
        this.appConfig = resp.data;

        // load user lang here
        const userLang = localStorage.getItem('userLang') || resp.data.defaultLanguage || 'en';

        this.appConfig.userLang = userLang;
        this.getConfig.next(this.appConfig);
        this._getConfig.next(this.appConfig);
        return this.appConfig;
      });
    return this.getConfig.asObservable();

  }
  private _getConfig = new Subject<string>();

  setUserLang(lang: string) {
    localStorage.setItem('userLang', lang);
  }
}
