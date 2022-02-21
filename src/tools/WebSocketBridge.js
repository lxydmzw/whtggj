export default class WebSocketBridge 
{
    constructor() 
    { 
        // 服务器信息
        this.cdn = 'http://gserver.popapps.cn:15006';
        this.wsServer = 'wss://gserver.popapps.cn:15008';
        this.base = '/base/tgty'
        // 控制端部署地址，通过基地址获取
        this.contrller_url = '';
        this.room = '';

        this.bridge = null;
        this.socket = null;
        this.isDebug = false;
        this.isBase = false;
        this.isConnect = false;
        this.isConnecting = false;
        this.isAndroid = false;
        this.isReconnect = false;

        this.onOpenHandler = null;
        this.onMessageHandler = null;
        this.onCloseHandler = null;
        this.onErrorHandler = null;
    }

    /**
    * 启动连接
    * @param isReconnect 是否断开重连
    * @param time 重连间隔
    * @return
    */
    startConnect (isReconnect = false, time = 5000)
    {
        let m_this = this;
        if(m_this.isConnect)
        {
            return;
        }

        m_this.isReconnect = isReconnect;
        if(m_this.isReconnect)
        {
            Laya.timer.loop(time, m_this, m_this.reconnect);
        }
        else
        {
            m_this.connect();
        }
    }

    /**
    * 关闭连接
    * @return
    */
    stopConnect ()
    {
        let m_this = this;
        m_this.isReconnect = false;
        Laya.timer.clear(m_this, m_this.reconnect);

        m_this.close();
    }

    reconnect ()
    {
        let m_this = this;
        if(!m_this.isConnect)
        {
            m_this.connect();
        }
    }

    /**
    * 初始化
    * @param callback 回调,false为失败，true为成功
    * @param debug 是否是测试,默认为正式
    * @return
    */
    init (callback, debug = false)
    {
        let m_this = this;
        m_this.isDebug = debug;
        let url = m_this.cdn + m_this.base;
        let xhr = new Laya.HttpRequest();
        xhr.http.timeout = 10000;
        xhr.once(Laya.Event.COMPLETE, m_this, function(event)
        {
            // callback(event);
            let obj = JSON.parse(event);

			// 手机端链接获取
            if(debug)
            {
                m_this.contrller_url = obj.data.ceshi;
            }
            else
            {
                m_this.contrller_url = obj.data.url;
            }
			// 游戏服务器地址
			m_this.wsServer = obj.data.ws;

            if(m_this.isAndroid)
            {
                if(window["PlatformClass"] != null)
                {
                    m_this.bridge = window["PlatformClass"].createClass("cn.popapps.ws.JWebSocketBridge");
                }

                window["natvieCallJs"] = function(msg)
                {
                    switch(msg.tag)
                    {
                        case 'onOpen':
                            // 处理服务器链接成功
                            m_this.onOpen(msg.data);
                            break;
                        case 'onMessage':
                            // 处理接收的消息
                            m_this.onMessage(msg.data);
                            break;
                        case 'onClose':
                            // 处理断开服务器事件
                            m_this.onClose(msg.data);
                            break;
                        case 'onError':
                            // 处理错误事件
                            m_this.onError(msg.data);
                            break;
                    }
                }
            }
            else
            {
                m_this.socket = new Laya.Socket();
                // 处理服务器链接成功
                m_this.socket.on(Laya.Event.OPEN, this, function(event)
                {
                    m_this.onOpen(event);
                });

                // 处理接收的消息
                m_this.socket.on(Laya.Event.MESSAGE, this, function(msg)
                {
                    m_this.onMessage(msg);
                });

                // 处理断开服务器事件
                m_this.socket.on(Laya.Event.CLOSE, this, function(event)
                {
                    m_this.onClose(event);
                });

                // 处理错误事件
                m_this.socket.on(Laya.Event.ERROR, this, function(event)
                {
                    m_this.onError(event);
                });
            }

            m_this.isBase = true;
            console.log('初始化完成');
            if(callback)
            {
                callback(m_this.isBase);
            }
        });
        xhr.once(Laya.Event.ERROR, this, function(event)
        {
            console.log('初始化失败，请查看网路是否已连接');
            if(callback)
            {
                callback(m_this.isBase);
            }
        });
        xhr.send(url, "", "get", "text");
    }

    /**
    * 连接服务器
    * @return
    */
    connect ()
    {
        let m_this = this;
        let wsUrl =  m_this.wsServer + '/ws?type=0';

        if(m_this.isConnect || m_this.isConnecting)
        {
            m_this.isConnecting = false;
            console.log('服务器已连接,不能重复连接');
            return;
        }

        m_this.isConnecting = true;
        if(m_this.isBase)
        {
            if(m_this.isAndroid)
            {
                console.log('连接中...');
                if(m_this.bridge)
                {
                    m_this.bridge.call("connect", wsUrl);
                }
                else
                {
                    m_this.isConnecting = false;
                    console.log('连接失败，请查看是否是安卓平台');
                }
            }
            else
            {
                if(m_this.socket)
                {
                    m_this.socket.connectByUrl(wsUrl);
                }
                else
                {
                    m_this.isConnecting = false;
                    console.log('连接失败，请查看是否是其他平台');
                }
            }
        }
        else
        {
            m_this.init(function(ok)
            {
                if(ok)
                {
                    m_this.connect();
                }
                else
                {
                    m_this.isConnecting = false;
                    console.log('连接失败，请查看网路是否已连接');
                }
            }, m_this.isDebug);
        }
    }

    /**
    * 发送消息
    * @param msg 发送的消息
    * @return
    */
    send (msg)
    {
        let m_this = this;
        if(m_this.isConnect)
        {
            if(m_this.isAndroid)
            {
                if(m_this.bridge)
                {
                    m_this.bridge.call("send", msg);
                }
            }
            else
            {
                if(m_this.socket)
                {
                    m_this.socket.send(msg);
                }
            }
        }
        else
        {
            console.log('服务器wei未连接,无法发送消息');
        }
    }

    /**
    * 断开服务器
    * @return
    */
    close ()
    {
        let m_this = this;
        if(m_this.isConnect)
        {
            if(m_this.isAndroid)
            {
                if(m_this.bridge)
                {
                    m_this.bridge.call("close");
                }
            }
            else
            {
                if(m_this.socket)
                {
                    m_this.socket.close();
                }
            }
        }
    }

    onOpen (event)
    {
        let m_this = this;
        m_this.isConnect = true;
        m_this.isConnecting = false;
        console.log('连接成功');
        if(m_this.onOpenHandler)
        {
            m_this.onOpenHandler(event);
        }
    }

    onMessage (msg)
    {
        let m_this = this;

        let obj = JSON.parse(msg);
        m_this.room = obj.room;

        if(m_this.onMessageHandler)
        {
            m_this.onMessageHandler(msg);
        }
    }

    onClose (event)
    {
        let m_this = this;
        m_this.isConnect = false;
        m_this.isConnecting = false;
        console.log('连接关闭');
        if(m_this.onCloseHandler)
        {
            m_this.onCloseHandler(event);
        }
    }

    onError (event)
    {
        let m_this = this;
        m_this.isConnect = false;
        m_this.isConnecting = false;
        console.log('连接错误');
        if(m_this.onErrorHandler)
        {
            m_this.onErrorHandler(event);
        }
    }

    /**
    * 设置Open回调
    * @param callback 回调函数
    * @return
    */
    setOpen (callback)
    {
        let m_this = this;
        m_this.onOpenHandler = callback;
    }

    /**
    * 设置Message回调
    * @param callback 回调函数
    * @return
    */
    setMessage (callback)
    {
        let m_this = this;
        m_this.onMessageHandler = callback;
    }

    /**
    * 设置Close回调
    * @param callback 回调函数
    * @return
    */
    setClose (callback)
    {
        let m_this = this;
        m_this.onCloseHandler = callback;
    }

    /**
    * 设置Error回调
    * @param callback 回调函数
    * @return
    */
    setError (callback)
    {
        let m_this = this;
        m_this.onErrorHandler = callback;
    }

    /**
    * 获取二维码
    * @param msg 二维码的内容
    * @param size 二维码的尺寸
    * @param callback 回调函数
    * @param url 服务器地址，默认不用填
    * @return
    */
    getQrCode (msg, size, callback, param = null, url = this.cdn + '/qr/general')
    {
        let qr_url = url + '?msg='+ encodeURIComponent(msg) +'&size=' + size;
        if(param)
        {
            let params = '';
            for(var key in param)
            {
                params += '&' + key + '=' + param[key];
            }

            qr_url += params;
        }
        
        let xhr = new Laya.HttpRequest();                      
        xhr.http.timeout = 10000;

        xhr.once(Laya.Event.COMPLETE, this, function(event)
        {
            console.log(event);
            if(callback)
            {
                callback(event);
            }
        });
        xhr.once(Laya.Event.ERROR, this, function(event)
        {
            if(callback)
            {
                callback(null);
            }
        });
        xhr.send(qr_url, "", "get", "text");
    }
}