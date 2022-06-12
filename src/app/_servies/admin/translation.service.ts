import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
@Injectable()
export class TranslationService {

  constructor(private http: HttpClient) {}
  apiUrl = environment.apiUrl + '/api/backend';

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl+'/translations', data);
  }

  update(lang,textId, data: any): Observable<any> {
    return this.http.put(this.apiUrl+'/translations/'+lang+'/update/'+textId, data);
  }

  search(lang,params: any): Observable<any> {
    return this.http.get(this.apiUrl+'/translations/'+lang, {params: params});
  }

  remove(id): Observable<any> {
    return this.http.get(this.apiUrl+'/translations', id);
  }

  pull(lang: string): Observable<any> {
    return this.http.post(this.apiUrl+'/translations/'+ lang+'/pull',{});
  }
}
