import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
@Injectable()
export class TextService {

  constructor(private http: HttpClient) {}
  apiUrl = environment.apiUrl + '/api/backend';
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl+'/i18n/text', data);
  }

  update(id, data: any): Observable<any> {
    return this.http.put(this.apiUrl+'/i18n/text/' + id, data);
  }

  search(params: any): Observable<any> {
    return this.http.get(this.apiUrl+'/i18n/text', {params: params});
  }

  remove(id): Observable<any> {
    return this.http.delete(this.apiUrl+'/i18n/text/' + id);
  }
}
