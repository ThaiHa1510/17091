import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
@Injectable({providedIn: 'root'})
export class SettingService {
  backendUrl = environment.apiUrl + '/api/backend/settings';
  fontendUrl = environment.apiUrl + '/api/v1/settings';
  constructor(private http: HttpClient) {
    
  }

  getAll(params) {
 
    return this.http.get(`${this.backendUrl}/`, {params: params});
  }
  update(id, body) {
    return this.http.post(`${this.backendUrl}/` + id, body);
  }
  create(body) {
    return this.http.post(`${this.backendUrl}`, body);
  }

  detail(id) {
    return this.http.get(`${this.backendUrl}/` + id);
  }
  
  
  getBySlug(slug){
    return this.http.get(`${this.fontendUrl}/` + slug);
  }
}