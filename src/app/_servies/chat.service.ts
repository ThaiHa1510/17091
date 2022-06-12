import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@/_servies/authentication.service';
import { User, Chat, EventSocket } from '@/_models';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';
import { ModelService } from './model.service';
import { SocketService } from '@/_servies/socket.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AlertService } from './alert.service';
import { Events } from '@/_servies/events.service';
import { first } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ChatService {
    // private socket;
    public inChatPage: boolean = false;
    private isJoinRoom: boolean = false;
    private listRoom: BehaviorSubject<[]>;
    public listRoom$: Observable<[]>;
    public currentRoom: BehaviorSubject<string | String> = new BehaviorSubject(null);
    public message: BehaviorSubject<Chat> = new BehaviorSubject(null);
    user: User;
    constructor(private events: Events, private alertService: AlertService, private http: HttpClient, private authentication: AuthenticationService, private modelService: ModelService, public socketService: SocketService) {
        this.listRoom = new BehaviorSubject([]);
        this.listRoom$ = this.listRoom.asObservable();
        this.authentication.isLoginSubject.subscribe(isLogin => {
            let data = this.authentication.currentUserValue;
            this.user = authentication.currentUserValue;
            if (isLogin) {
                this.onlineModel().subscribe(data => {
                    //this.modelService.setModelOn(data);                
                    let listRoomTemp: any[] = this.listRoom.value;
                    if (this.user.role == 'model') {

                        listRoomTemp.map((roomItem, index) => {
                            if (roomItem['userId'] && ('_id' in roomItem['userId']) && roomItem['userId']['_id'] == data) {
                                roomItem.userId.status = true;
                            }
                        })
                    }
                    if (this.user.role == 'member') {
                        listRoomTemp.map((roomItem, index) => {
                            if (roomItem['modelId'] && ('_id' in roomItem['modelId']) && roomItem['modelId']['_id'] == data) {
                                roomItem.modelId.status = true;
                            }
                        })
                    }
                })
                this.offlineModel().subscribe(data => {
                    //this.modelService.setModelOff(data);                
                    let listRoomTemp: any[] = this.listRoom.value;
                    if (this.user.role == 'model') {

                        listRoomTemp.map((roomItem, index) => {
                            if (roomItem['userId'] && ('_id' in roomItem['userId']) && roomItem['userId']['_id'] == data) {
                                roomItem.userId.status = false;
                            }
                        })
                    }
                    if (this.user.role == 'member') {
                        listRoomTemp.map((roomItem, index) => {
                            if (roomItem['modelId'] && ('_id' in roomItem['modelId']) && roomItem['modelId']['_id'] == data) {
                                roomItem.modelId.status = false;
                            }
                        })
                    }

                })
                this.newMessage().subscribe(data => {
                    this.message.next(new Chat().deserialize(data));
                    if (!this.inChatPage && data.from != this.user.id) {
                        this.modelService.getModelInfo(data.from).subscribe(data => {
                            if (data) {
                                let userInfo = data['data'];
                                this.alertService.newMessage(userInfo);
                                this.events.publish('chat:new-message-comming', 1);
                            }
                        })
                    }
                })
                this.loadAllRoom();
            }


        });

    }

    public sendMessage(message: Chat) {
        this.socketService.emitEvent(EventSocket.NEWMESSAGE, message);
    };

    public markReadMessage(data, callback = null) {
        this.socketService.emitEvent(EventSocket.MARK_READ_MESSAGE, data, callback);
    }

    public onlineModel = () => {
        return Observable.create((observer) => {
            this.socketService.onEvent(EventSocket.MODELONLINE).subscribe((data) => {
                observer.next(data);
            });
        });
    }

    public offlineModel() {
        return Observable.create((observer) => {
            this.socketService.onEvent(EventSocket.MODELONFFLINE).subscribe((data) => {
                observer.next(data);
            });
        });
    }

    public loadMessage() {
        return this.http.get<Chat[]>(environment.apiUrl + '/api/v1/chat/load');
    }

    public disconnection(message: Chat) {
        this.socketService.emitEvent('disconnection', message);

    };

    public joinRoom(message: Chat) {
        this.socketService.emitEvent('join-room', message);
    }

    public startChat(data) {

    }

    public countUnReadMessage() {
        return this.http.get(environment.socketUrl + '/api/v1/chat/count-unread');
    }
    public loadAllRoom() {
        this.http.get<[]>(environment.socketUrl + '/api/v1/chat/room/all').subscribe(data => {
            if (!this.isJoinRoom) {
                this.joinAllRoom(data['data']);
            }
            this.listRoom.next(data['data']);
            return this.listRoom.value;
        });

    }

    public joinAllRoom(list: any[]) {
        if (list.length > 0) {
            this.isJoinRoom = true;
            list.forEach(item => {
                let request = new Chat();
                request.roomId = item.id;
                request.from = this.user.id;
                this.joinRoom(request);
            })
        }
    }

    public loadMessageinRoom(roomId: String, skip: number = 0, length = 30) {

        return this.http.get<Chat[]>(environment.apiUrl + '/api/v1/chat/message/room/' + roomId + '?skip=' + skip + '&length=' + length);
    }


    public getUserInfo(userId: String) {
        return this.http.get<User>(environment.socketUrl + '/api/v1/user/info/' + userId);
    }

    public currentListRoom() {
        return this.listRoom.value;
    }

    public newMessage = () => {
        return Observable.create((observer) => {
            this.socketService.onEvent(EventSocket.NEWMESSAGE).subscribe((data) => {
                observer.next(data);
            });
        });
    }

    public setCurrentRoom(roomId: string | String | null) {
        this.currentRoom.next(roomId);
    }

    public getRomInfo(roomId: string | String) {
        return this.http.get<User>(environment.socketUrl + '/api/v1/chat/room/info/' + roomId).pipe(first());
    }
}