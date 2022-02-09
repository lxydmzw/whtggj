export default class WebSocketBridge
{
    // 服务器信息
    static cdn = 'http://gserver.popapps.cn:15006';
    static wsServer = 'wss://gserver.popapps.cn:15008';
    // 控制端部署地址，通过基地址获取
    static contrller_url = '';
    static room = '';
    
    static bridge = null;
    static isConnect = false;

    static init(call = null)
    {
        WebSocketBridge.setCallFun(call);
        if(window["PlatformClass"] != null)
        {
            this.bridge = window["PlatformClass"].createClass("cn.popapps.ws.JWebSocketBridge");
        }
    }

    static setCallFun (call)
    {
        window["natvieCallJs"] = call;
    }

    static connect (ws)
    {
        if(this.bridge)
        {
            this.bridge.call("connect", ws);
        }
    }

    static send (msg)
    {
        if(this.bridge)
        {
            this.bridge.call("send", msg);
        }
    }

    static close ()
    {
        if(this.bridge)
        {
            this.bridge.call("close");
        }
    }

    static getBase (url, callback)
    {
        let xhr = new Laya.HttpRequest();
        xhr.http.timeout = 10000;
        xhr.once(Laya.Event.COMPLETE, this, function(event)
        {
            callback(event);
        });
        xhr.once(Laya.Event.ERROR, this, function(event)
        {
            callback("");
        });
        xhr.send(url, "", "get", "text");
    }

    static getQrCode (msg, size, callback, url = 'http://81.68.175.16:15006/qr/general')
    {
        let qr_url = url + '?msg='+ encodeURIComponent(msg) +'&size=' + size;
        // console.log(next_url);
        let xhr = new Laya.HttpRequest();                      
        xhr.http.timeout = 10000;

        xhr.once(Laya.Event.COMPLETE, this, function(event)
        {
            callback(event)
        });
        xhr.once(Laya.Event.ERROR, this, function(event)
        {
            callback("");
        });
        xhr.send(qr_url, "", "get", "text");
    }
}