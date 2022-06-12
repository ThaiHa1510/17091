import {
    Component,
    OnInit,
    ElementRef,
    Input,
    ViewChild,
    OnDestroy,
} from "@angular/core";
import { ChatService } from "@/_servies/chat.service";
import { AlertService } from "@/_servies/alert.service";
import { AuthenticationService } from "@/_servies/authentication.service";
import { ImageHelper } from "@/_helpers/image";
import { SocketService } from "@/_servies/socket.service";
import { ActivatedRoute } from "@angular/router";
import { User, Chat, EventSocket, Model } from "@/_models";
import { ModelService } from "@/_servies/model.service";
import { Router } from "@angular/router";
import { CallService } from "@/_servies/call.service";
import { first } from "rxjs/operators";
import { Events } from "@/_servies/events.service";
import * as moment from 'moment';

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, OnDestroy {
    isNewConv: boolean = false;
    toogleChatClicked: boolean = false;
    currentTotalMessage: number = 0;
    canLoadMessage: boolean = true;
    reqId: String;
    to: User = new User();
    listRoom = [];
    roomId: String;
    listFriend: User[];
    user: User = new User();;
    queryString: any;
    isScroll: Boolean = false;
    message: String = "";
    messages: Chat[] = [];
    listMessages = new Map();
    loadedMessage = new Map();
    imageHelper: ImageHelper = new ImageHelper();
    searchableRoom = ["firstName", "lastName"];
    @ViewChild("listChat", { static: false }) listChat: ElementRef;
    @ViewChild("imgupload", { static: false }) imgupload: ElementRef;
    @ViewChild("toogleChat", { static: true }) toogleChat: ElementRef;
    @ViewChild("chatMain", { static: true }) chatMain: ElementRef;
    @Input() name: string = 'test';
    constructor(
        private chatService: ChatService,
        private authentication: AuthenticationService,
        private events: Events,
        private alertService: AlertService,
        private route: Router,
        private socketService: SocketService,
        private router: ActivatedRoute,
        private callService: CallService,
        private modelService: ModelService
    ) {
        this.user = this.authentication.currentUserValue;
        this.chatService.currentRoom.subscribe((data) => {
            // this.roomId = data;
        });
        this.router.params.subscribe((params: any) => {
            if (params && params.id) {
                this.reqId = params.id;
                if(this.user.role == "member"){
                    this.roomId = `room-${this.user.id}-${this.reqId}`;
                }
                this.to = new User().deserialize(this.reqId);
                setTimeout(() => {
                    this.beginRoom(this.roomId, this.to)
                }, 500);
                // this.chatService.setCurrentRoom(this.roomId);
            }
        });
    }

    ngOnInit() {
        // reset list messages
        this.listMessages = new Map();
        this.chatService.loadAllRoom();
        this.getListRoom();
        this.countUnreadMessage();
        this.chatService.inChatPage = true;
        //Event revice msg from socket
        this.chatService.socketService.onEvent(EventSocket.NEWMESSAGE).subscribe(
            (msg) => {
                msg = new Chat().deserialize(msg);
                if (msg && msg.from) {
                    var msgRevice = msg;
                    if (msgRevice.from != this.user.id) {
                        if (msgRevice.roomId == this.roomId) {
                            this.chatService.markReadMessage({ roomId: msgRevice.roomId });
                            this.messages.push(msgRevice);
                        } else {
                            this.totalUnreadMessage++;
                            var messageTmp = this.listMessages.get(msgRevice.roomId)
                                ? this.listMessages.get(msgRevice.roomId)
                                : [];
                            msgRevice['readFlag'] = false;
                            messageTmp.push(msgRevice);
                            if (this.listMessages.has(msgRevice.roomId)) {
                                this.listMessages.set(msgRevice.roomId, messageTmp);
                                this.countUnreadMessage();
                            }
                            else {
                                this.chatService.getRomInfo(msgRevice.roomId).subscribe((data) => {
                                    this.listRoom.push(data['data']);
                                })
                                this.listMessages.set(msgRevice.roomId, messageTmp);
                                this.loadedMessage.set(msgRevice.roomId, false);
                                this.countUnreadMessage();
                            }
                        }
                    }
                }
            },
            (error) => {
                this.alertService.error("Failed");
            }
        );
    }
    totalUnreadMessage = 0;
    public countUnreadMessage() {
        this.chatService.countUnReadMessage().subscribe(
            (resp: any) => {
                this.totalUnreadMessage = resp.data.total;
                this.events.publish("chat:updated", resp.data.total);
            },
            (error) => {
                this.alertService.error(error.msg);
            }
        );
    }
    public sendMessage() {
        this.message = this.message.trim()
        // this.message = this.message.substring(0, this.message.length - 1);
        if (this.message === "" || this.message.length == 0) {
            return;
        } else {
            if (this.to.id) {
                var msgSend = new Chat();
                msgSend.text = this.message;
                // msgSend.to['_id']=this.to.id;
                msgSend.type = "text";
                msgSend.user = this.user;
                msgSend.createdAt = new Date();
                msgSend.roomId = this.roomId;
                msgSend.to = this.to;
                msgSend.from = this.user;
                msgSend.isNew = true;
                this.messages.push(msgSend);
                this.listMessages.set(this.roomId, this.messages);
                this.chatService.sendMessage(msgSend);
                this.message = "";
            }
        }
    }

    public startChat(toId) {
        this.to.id = toId;
        this.chatService.startChat({
            to: this.to,
            text: "text send messge",
            roomId: this.roomId,
            user: this.user,
        });
    }

    public getListRoom() {
        this.chatService.listRoom$.subscribe((data: any[]) => {
            if (data.length > 0 && !this.roomId) {
                this.roomId = data[0]['id'];
            }
            if (data) {
                this.listRoom = [];
                var list: String[] = [];
                if (this.roomId) {
                    this.isNewConv = this.user.role == "model"?false:true;
                    data.forEach((roomItem) => {
                        if (this.roomId == roomItem["id"]) {
                            this.isNewConv = false;
                            if (this.user.role == "model" && roomItem["userId"]) {
                                this.to = new User().deserialize(roomItem["userId"]);
                            }
                            if (this.user.role == "member" && roomItem["modelId"]) {
                                this.to = new User().deserialize(roomItem["modelId"]);
                            }
                        }
                        if (this.user.role == "model") {
                            if (roomItem["userId"]) {
                                this.listRoom.push(roomItem);
                                list.push(roomItem["id"]);
                                if (roomItem['lastMessage']) {
                                    this.listMessages.set(roomItem["id"], new Array<Chat>(new Chat().deserialize(roomItem['lastMessage'])))
                                }
                                else {
                                    this.listMessages.set(roomItem["id"], new Array<Chat>(new Chat()));
                                }
                            }
                        }
                        if (this.user.role == "member") {
                            if (roomItem["modelId"]) {
                                this.listRoom.push(roomItem);
                                list.push(roomItem["id"]);
                                if (roomItem['lastMessage']) {
                                    this.listMessages.set(roomItem["id"], new Array<Chat>(new Chat().deserialize(roomItem['lastMessage'])));
                                }
                                else {
                                    this.listMessages.set(roomItem["id"], new Array<Chat>(new Chat()));
                                }
                            }
                        }
                    });
                    this.listRoom = this.listRoom.slice().sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())
                    setTimeout(() => {
                        this.setTo();
                    }, 300);
                } else {
                    this.isNewConv = false;
                    data.forEach((roomItem) => {
                        if (this.user.role == "model") {
                            if (roomItem["userId"]) {
                                this.listRoom.push(roomItem);
                                list.push(roomItem["id"]);
                                this.listMessages.set(roomItem["id"], new Array<Chat>(new Chat().deserialize(roomItem['lastMessage'])));
                            }
                        }
                        if (this.user.role == "member") {
                            if (roomItem["modelId"]) {
                                this.listRoom.push(roomItem);
                                list.push(roomItem["id"]);
                                this.listMessages.set(roomItem["id"], new Array<Chat>(new Chat().deserialize(roomItem['lastMessage'])));
                            }
                        }
                    });
                    this.sortChatRoom();
                    this.setTo();
                }
            } else {
                this.canLoadMessage = false;
            }
        },
            (error) => {
                this.alertService.error(error.msg);
            }
        );
    }

    sortChatRoom() {
        this.listRoom = this.listRoom.slice().sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())
    }

    public beginRoom(roomId: String, userId: User) {
        // this.roomId = roomId;
        this.toogleChatClicked = false;
        if (!roomId) {
            if (this.user.role == "model") {
                roomId = "room-" + userId + "-" + this.user.id;
            } else {
                roomId = "room-" + this.user.id + "-" + userId;
            }
        } else {
            this.to = userId;
            this.chatService.setCurrentRoom(roomId);
            this.roomId = roomId;
            var request = new Chat();
            request.roomId = this.roomId;
            request.from = this.user.id;
            this.chatService.joinRoom(request);
            let messageList: any[] = this.listMessages.get(this.roomId);
            if (messageList.length > 0) {
                messageList[messageList.length - 1]['readFlag'] = true;
            }
            this.chatService.markReadMessage({ roomId: this.roomId }, (res: any) => {
                this.loadedMessageInCurrentRoom();
            });
            this.canLoadMessage = true;
        }
        // this.scrollToBottom();
    }

    public setTo() {
        if (this.isNewConv) {
            this.canLoadMessage = false;
            this.chatService.getUserInfo(this.reqId).subscribe(
                (user) => {
                    this.to = new User().deserialize(user["data"]);
                    if (this.to.role == "model" && this.user.role == "model") {
                        this.route.navigate(["/accueil"]);
                    }
                },
                (err) => {
                    if (err.msg) {
                        this.alertService.error(err.msg);
                    } else {
                        this.alertService.error(err);
                    }
                }
            );
        } else {
            if (this.listRoom.length) {
                this.chatService.setCurrentRoom(
                    this.listRoom[this.listRoom.length - 1].id
                );
                if(!this.reqId){
                    if (this.user.role == "model") {
                    this.to = this.listRoom[this.listRoom.length - 1].userId;
                    } else {
                        this.to = this.to = this.listRoom[this.listRoom.length - 1].modelId;
                    }
                }
                this.beginRoom(this.roomId, this.to);
            }
        }

        //this.scrollToLAstMsg();
    }

    getTextDate(date) {
        if (!moment.isMoment(date)) {
            date = moment(date); // ok for js date, milliseconds or string in ISO format
        }
        if (date.isSame(moment(), 'day')) {
            return date.format('hh:mm a');
        } else if (date.isSame(moment().subtract(1, 'd'), 'day')) {
            return 'Yesterday';
        } else if (date.isSame(moment(), 'week')) {
            return date.format('dddd');
        } else {
            return date.format('DD/MM/YYYY');
        }
    }

    public loadMoreMessage() {
        if (this.roomId) {
            let skip = this.listMessages.get(this.roomId).length;
            this.loadedMessageInCurrentRoom(skip);
        }
    }

    private loadedMessageInCurrentRoom(skip: number = 0) {
        this.chatService
            .loadMessageinRoom(
                this.roomId,
                this.listMessages.get(this.roomId).length,
                30
            )
            .subscribe((data) => {
                var messageInRoom = this.listMessages.get(this.roomId);
                var unreadMesg: Chat[] = [];
                data["data"].forEach((mes) => {
                    unreadMesg.push(mes);
                });
                unreadMesg.reverse();
                messageInRoom = [...unreadMesg, ...messageInRoom];
                if (data["total"] && messageInRoom.length >= data["total"]) {
                    this.canLoadMessage = false;
                }
                this.listMessages.set(this.roomId, new Array<Chat>())
                this.listMessages.set(this.roomId, messageInRoom);
                this.messages = this.listMessages.get(this.roomId)
                    ? this.listMessages.get(this.roomId)
                    : [];
                //  this.messages.reverse();
                this.loadedMessage.set(this.roomId, true);
                this.countUnreadMessage();
            });
    }

    public attachMessage() {
        this.imgupload.nativeElement.click();
    }

    public attachImg($e) {
        if (this.to.id) {
            let file = <File>$e.target.files[0];
            var msgSend = new Chat();
            // msgSend.text = this.message;
            // // msgSend.to['_id']=this.to.id;
            msgSend.type = "image";
            msgSend.user = this.user;
            msgSend.createdAt = new Date();
            msgSend.roomId = this.roomId;
            msgSend.to = this.to;
            msgSend.isNew = true;
            msgSend.file = { data: file, inProgress: false, progress: 0 };
            msgSend.from = this.user;
            this.messages.push(msgSend);
            // this.preview(msgSend.data,this.messages.length-1);
            this.listMessages.set(this.roomId, this.messages);
            this.message = "";
        }
    }

    ngOnDestroy() {
        console.log("run ng on destroy");
        this.chatService.inChatPage = false;
        //this.chatService.currentRoom.unsubscribe();
    }


    public call() {
        if (!this.authentication.currentUserValue) {
            this.alertService.info("Please login to use this service");
            this.route.navigate(["/"], {
                queryParams: { returnUrl: this.route.getCurrentNavigation() },
            });
            return;
        }
        if (this.to.role != "model") {
            this.alertService.error("Member can't receive call, please call later");
            return;
        }
        if (this.to.doNotDisturb || this.to.isCalling) {
            this.alertService.error("Model can't receive call, please call later");
            return;
        }
        let model = new Model();
        this.modelService
            .getModelInfo(this.to.id)
            .pipe(first())
            .subscribe((resp: any) => {
                model = resp["data"];
                this.callService.call(model);
            });
    }

    getShortText(text: string) {
        return (text && text.length > 15) ? text.substring(0, 15) + '...' : text;
    }

    public getChatClass(msg: Chat){
        if(msg.from &&  msg.from['id'] == this.user.id){
            return 'chat-2 chat';
        } 
        return 'chat-1 chat';
    }
}
