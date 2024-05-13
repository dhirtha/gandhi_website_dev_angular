import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {MasterProvider} from './MasterProvider';
import {AuthService} from './auth-service';
import {HttpClient} from '@angular/common/http';
import {Injector} from '@angular/core';

export class WebSocketAPI extends MasterProvider {
    topic: string = "/topic/";
    stompClient: any;
    appComponent: any;
    constructor(appComponent: any,public injector: Injector, public  http: HttpClient, public  authService: AuthService){
        super(injector, http, authService);
        this.appComponent = appComponent;
//        this._connect();
    }
    _connect(path:any) {
        console.log("Initialize WebSocket Connection");
        let ws = new WebSocket(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _thiss = this;
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjj");
        console.log(_thiss.topic+path);
        _thiss.stompClient.connect({}, function (frame) {
            _thiss.stompClient.subscribe(_thiss.topic+path, function (sdkEvent) {
                _thiss.onMessageReceived(sdkEvent);
            });
            _thiss._send("I Am Alive");
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
//        setTimeout(() => {
//            this._connect(Math.random());
//        }, 5000);
    }

    timer = ms => new Promise(res => setTimeout(res, ms))
    async isAlive(){
        for (let i = 1; i >= 0; i++) {
            console.log("iiiiiiiiiiii");
            this.stompClient.send("/app/hello", {}, JSON.stringify("I Am Alive"));
            await this.timer(30000); 
        }
    }
    
    _send(message) {
        this.isAlive();
    }

    onMessageReceived(message) {
        this.appComponent.handleMessage(JSON.stringify(message.body));
    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
}