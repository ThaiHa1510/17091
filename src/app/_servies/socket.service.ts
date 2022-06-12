import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { AuthenticationService } from '@/_servies/authentication.service';
import { Chat, EventSocket } from '@/_models';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';
import { LocalstorageService } from './localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  constructor(private authenticationService: AuthenticationService, private localstorageService: LocalstorageService) {
    this.authenticationService.isLoginSubject.subscribe(isLogin => {

      console.log('isLogin', isLogin);
      if (isLogin) {
        let userData = JSON.parse(this.localstorageService.getItem('currentUser'));
        this.socket = io(environment.socketUrl, { query: "token=" + userData.access_token });
      }
      else {
        if (this.socket) {
          this.socket.emit('user:disconnect');
        }
        this.socket = io(environment.socketUrl);
      }
    })
  }


  public onEvent(event: EventSocket): Observable<any> {
    return new Observable<EventSocket>(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }

  public emitEvent(event: string, data: any, callback = null) {
    this.socket.emit(event, data, callback);
  }
}
