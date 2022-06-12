import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
@Injectable({providedIn: 'root'})
export class TopupService {
  backendUrl = environment.apiUrl + '/api/backend/payment-setting';
  fontendUrl = environment.apiUrl + '/api/v1/payment-setting';
  constructor(private http: HttpClient) {
    
  }

  claimFree(id, body = {}) {
    return this.http.post(`${this.fontendUrl}/claim-free/` + id, body);
  }

}