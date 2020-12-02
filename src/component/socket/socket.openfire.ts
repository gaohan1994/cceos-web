/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-11-12 10:33:51 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-11-17 15:51:24
 * 
 * @todo 封装的openfire相关的socket
 */
import { Modal } from 'antd-mobile';
import React from 'react';
import X2JS from 'x2js';

let x2jsObj = new X2JS();

type Props = {
  reconnect?: boolean;
  url: string;
  socketIp: string;
  // customerId: string;
  // customerPwd: string;
  id: string;
  pwd: string;
  setWebSocket: any;
  onClose?: (data: any) => void;
  onError?: (data: any) => void;
  onMessage?: (data: any) => void;
  onOpen?: (data: any) => void;
};

type State = {
  ws?: WebSocket;
};

class WS extends React.Component<Props, State> {

  static defaultProps = {
    reconnect: false
  };

  // private reconnect: boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      ws: undefined,
    };
    // this.reconnect = false;
  }

  public send = (data: string) => {
    console.log('[socket data]: ', data);

    if (this.state.ws && this.state.ws.readyState === WebSocket.OPEN) {
      if (typeof data === 'string') {
        this.state.ws.send(data);
      } else {
        this.state.ws.send(JSON.stringify(data));
      }
    }
  }

  componentDidMount() {
    // this.reconnect = !!this.props.reconnect;
    this._handleWebSocketSetup();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.reconnect !== this.props.reconnect) {
      this._handleWebSocketSetup();
    }
  }

  componentWillUnmount() {
    // this.reconnect = false;

    if (this.state.ws) {
      this.state.ws.close();
    }
  }

  render() {
    return null;
  }

  _handleWebSocketSetup = () => {
    const ws = new WebSocket(this.props.url, "xmpp");
    ws.onopen = (data: any) => {
      if (this.props.onOpen) {
        this.props.onOpen(data);
      }
      this.sendOpenClient(ws);
      this.authClient(ws);
      this.handleSuccessClient(ws);
      this.sendPresenceClient(ws);
    };
    ws.onmessage = (event) => {
      let data = event.data;
      var jsonObj: any = x2jsObj.xml2js(data);
      console.log('客户端收到消息', data, jsonObj);
      if (this.props.onMessage) {
        this.props.onMessage(jsonObj);
      }
    };
    ws.onerror = (error) => {
      if (this.props.onError) {
        this.props.onError(error);
      }
    };
    ws.onclose = (data) => {
      // this.reconnect ? this._handleWebSocketSetup() : (this.props.onClose && this.props.onClose(data));
      this.props.onClose && this.props.onClose(data);
      Modal.alert('提示', '连接关闭，请点击重新连接！', [
        {
          text: '确定', onPress: () =>
            new Promise(async (resolve) => {
              this._handleWebSocketSetup();
              resolve();
            }),
        },
      ]);
      console.log("websocket关闭");
    };
    this.setState({ ws });
    this.props.setWebSocket(ws);
  }

  // 步骤1：发送建立流请求
  sendOpenClient = (ws: any) => {
    var message = `<open to='121.37.239.209' from='${this.props.id}@localhost' xmlns='urn:ietf:params:xml:ns:xmpp-framing' xml:lang='zh' version='1.0'/>`;
    console.log("客服端发起建立流请求：" + message);
    ws?.send(message);
  }

  // 步骤2：登录
  authClient = (ws: any) => {
    var username = this.props.id;
    var password = this.props.pwd;
    var token = window.btoa(username + '@' + this.props.socketIp + '\0' + password);
    var message = "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + token + "</auth>";
    console.log("客服端登录报文：" + message);
    ws?.send(message);
  }

  // 步骤5：获取session 步骤6：上线
  sendPresenceClient = (ws: any) => {
    // 步骤5
    var msg = `<iq xmlns='jabber:client' id='21hl0x3z91' type='set'><session xmlns='urn:ietf:params:xml:ns:xmpp-session' /></iq>`;
    console.log("客服端获取session：" + msg);
    ws?.send(msg);
    // 步骤6
    var message = `<presence id='21hl0x3z91'><status>online</status><priority>1</priority></presence>`;
    console.log("客服端上线：" + message);
    ws?.send(message);
  }

  // 步骤3：发起新的流     步骤4：绑定操作

  handleSuccessClient = (ws: any) => {
    // 步骤3
    var msg = `<open xmlns='jabber:client' to='${this.props.socketIp}' 
    version='1.0' from='${this.props.id}@localhost' id='21hl0x3z91' xml:lang='zh' />`;
    console.log("客服端发起新的流：" + msg);
    ws?.send(msg);
    // 步骤4
    var message = `<iq  type='set' id='21hl0x3z91'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'><resource>appClient</resource></bind></iq>`;
    console.log("客服端绑定操作：" + message);
    ws?.send(message);
  }
}

export default WS;