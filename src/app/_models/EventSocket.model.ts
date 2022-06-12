export enum EventSocket {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    NOTIFICATION = 'notification',
    MARK_READ_MESSAGE = 'mark-read-message',
    MODELONLINE = 'model:online',
    NEWREVIEW = 'reivew:new',
    NEWMESSAGE = 'message:new',
    MODELONFFLINE = 'model:offline',
    CALLEND = 'call:end',
    CALLSTART = 'call:start',
    JONT_ALL_ROOM='join:all'
}