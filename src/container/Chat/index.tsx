import { Button, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { ConversationList } from '../../component/Conversation';
import { OpenfireWebSocket } from '../../component/socket';
import './index.less';
import serviceAvatar from '../../image/avatar_service.png';
import emojiIcon from '../../image/icon_emoji.png';
import plusIcon from '../../image/icon_plus.png';
import serviceIcon from '../../image/icon_service.png';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { i18n } from '../../image/emoji.i18n';
import Api from '../../action/Api';
import { Modal, Toast } from 'antd-mobile';
import { useQueryParam } from '../../common/util';
// @ts-ignore
import RcViewer from '@hanyk/rc-viewer'
import { useSelector } from 'react-redux';
import moment from 'moment';

const { TextArea } = Input;

const customerPwd = '12345';
const socketIp = '121.37.239.209';

export default function () {

  const [webSocket, setWebSocket] = useState(null as WebSocket | null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([] as any);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotal, setMessagesTotal] = useState(-1);
  const [imgList, setImgList] = useState([] as any[]);
  const [bottomHeight, setBottomHeight] = useState(0);
  const [selectShow, setSelectShow] = useState(false);
  const [type, setType] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState({} as any);
  const [currentService, setCurrentService] = useState({} as any);
  const [reconnect, setReconnect] = useState(false);
  // const [currentService, setCurrentService] = useState('');

  const messageListRef = useRef([]);
  const textareaRef: any = useRef(null);
  const bottomRef: any = useRef(null);
  const cRef: any = useRef(null);
  const viewerRef: any = useRef(null);

  const currentImg = useSelector((state: any) => state.store.currentImg);
  const viewerFlag = useSelector((state: any) => state.store.viewerFlag);
  const customerId = useQueryParam('id');
  const deptId = useQueryParam('deptId');
  const customerNickName = useQueryParam('nickname');


  useEffect(() => {
    messageListRef.current = messageList;
  }, [messageList])

  useEffect(() => {
    setMessageList([]);
    setMessagesPage(1);
    setMessagesTotal(-1);
    const params = {
      pageNum: messagesPage,
      pageSize: 20,
      ownName: customerId,
      orderByColumn: 'create_time desc'
    }
    Api.chatLogHistory(params, (result: any) => {
      if (result.success) {
        const data = result.result;
        setMessagesPage(messagesPage + 1);
        setMessageList(data.rows.reverse());
        setMessagesTotal(data.total);
      } else {
        if (result && result.result !== false) {
          Toast.fail(result?.result || '');
        }
      }
    });
  }, []);

  useEffect(() => {
    if (type !== 1) {
      Api.questionCategory({
        customer: customerId,
        deptId: deptId
      });
    }
  }, []);

  useEffect(() => {
    if (bottomRef && bottomRef.current && bottomRef.current.clientHeight) {
      setBottomHeight(bottomRef.current.clientHeight);
    }
  }, [bottomRef.current && bottomRef.current.clientHeight, selectShow]);

  useEffect(() => {
    let list: any[] = [];
    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].type === 2) {
        list.push(messageList[i].content);
      }
    }
    setImgList(list);
  }, [messageList]);

  useEffect(() => {
    if (currentImg.length > 0 && viewerRef.current && viewerRef.current.viewer) {
      let flag = 0;
      for (let i = 0; i < imgList.length; i++) {
        if (imgList[i] === currentImg) {
          flag = i;
          break;
        }
      }
      viewerRef.current.viewer.view(flag);
    }
  }, [currentImg, viewerFlag])

  const parseMessage = (data: any) => {
    let param = {};
    try {
      if (data.message) {
        let msg: any = data.message;
        if (msg.level) {
          let body = msg.body;
          let str = '';
          let arr = [];
          if (typeof body === 'object') {
            if (!Array.isArray(body)) {
              body = [body];
            }
            str += '您可能关注以下问题，请回复序号进行提问\n';
            for (let i = 0; i < body.length; i++) {
              let id = body[i]['_xml:lang'];
              let text = body[i]['__text'];
              if (text.split('-').length > 1) {
                text = text.split('-')[1];
              }
              arr.push({ id, text });
              str += `[${i}]${text}\n`;
            }
            if (parseInt(msg.level) > 1) {
              str += `[${body.length}]返回上一级\n`;
            }
            setCurrentQuestions({ arr, level: msg.level, parentId: msg.parentId, parentsId: msg.parentsId });
          } else {
            str = body.replace(/问题答案：/g, "");
          }

          param = {
            sender: msg._from.split('@')[0],
            senderNickName: msg._nickName,
            receiver: msg._to.split('@')[0],
            receiverNickName: customerNickName,
            content: str,
            type: 0,
          }
        } else {
          param = {
            sender: data.message._from.split('@')[0],
            senderNickName: msg._nickName,
            receiver: data.message._to.split('@')[0],
            receiverNickName: customerNickName,
            content: data.message.body || data.message.img._src,
            type: data.message?.img?._src ? 2 : data.message._from.split('@')[0] === 'admin' ? 1 : 0,
          }
        }

        if (msg._keyNum) {
          param = {
            ...param,
            id: parseInt(msg._keyNum),
          }
        }

        if (msg._sendTime) {
          param = {
            ...param,
            createTime: msg._sendTime
          }
        }
      }

    } catch (e) {
      Toast.fail(e.message);
    }
    return param;
  }

  const onMessage = (data: any) => {
    if (data.failure) {
      Modal.alert('提示', '连接失败，请点击重新连接！', [
        {
          text: '确定', onPress: () =>
            new Promise(async (resolve) => {
              setReconnect(!reconnect);
              resolve();
            }),
        },
      ]);
      return;
    }
    if (!data.message) {
      return;
    }
    if (data.message.error) {
      return;
    }
    if (data.message._flag) {
      const newMessageList = [...messageList];
      for (let i = 0; i < messageList.length; i++) {
        if (data.message._flag === messageList[i].flag) {
          let newItem = { ...messageList[i], loading: false, id: parseInt(data.message._keyNum) };
          newMessageList[i] = newItem;
          break;
        }
      }
      setMessageList(newMessageList);
    }
    if (!data.message._from) {
      return;
    }
    const newMessageList = messageList.concat({
      id: messageList.length + 1,
      ...parseMessage(data)
    });
    setMessageList(newMessageList);
    setTimeout(() => {
      if (cRef && cRef.current && cRef.current.scrollToEnd) {
        cRef.current.scrollToEnd();
      }
    }, 0);
  }

  const onKeyDown = (e: any) => {
    if (e.keyCode == 13 && (e.ctrlKey || e.altKey || e.shiftKey)) {
      e.preventDefault();//禁止回车的默认换行
      const newMessage = message + '\n';
      setMessage(newMessage);
    } else if (e.keyCode == 13) {
      e.preventDefault();//禁止回车的默认换行
      onSend();
    }
  }

  const onChangeValue = (e: any) => {
    console.log('e: ', e);
    setMessage(e.target.value);
  }

  const showEmojiSelect = () => {
    setTimeout(() => {
      setSelectShow(true);
      setTimeout(() => {
        if (cRef && cRef.current && cRef.current.scrollToEnd) {
          cRef.current.scrollToEnd();
        }
      }, 10);
    }, 0);
  }

  const hideEmojiSelect = () => {
    setSelectShow(false);
  }

  const onFocus = () => {
    hideEmojiSelect();
    setTimeout(() => {
      if (cRef && cRef.current && cRef.current.scrollToEnd) {
        cRef.current.scrollToEnd();
      }
    }, 100);
  }

  const onSelectEmoji = (emoji: any) => {
    const newMessage = message + emoji.native;
    setMessage(newMessage);
  }

  const onSend = async (msg?: string, list?: any[]) => {
    if (message.trim().length === 0 && msg?.trim().length === 0) {
      return;
    }
    let realMessage = message.trim();
    if (msg && typeof msg === 'string' && msg.trim().length > 0) {
      realMessage = msg.trim()
    }
    const messageList: any[] = list ? list : messageListRef.current || [];
    const flag = `${customerId}/${moment().valueOf()}`;
    const param = {
      id: messageList.length + 1,
      content: realMessage.trim(),
      sender: customerId,
      senderNickName: customerNickName,
      receiver: currentService.agentName,
      receiverNickName: currentService.nickName,
      type: 0,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      flag: flag,
      loading: true,
    }
    const newMessageList = messageList.concat(param);
    setMessageList(newMessageList);
    setMessage('');
    setTimeout(() => {
      if (cRef && cRef.current && cRef.current.scrollToEnd) {
        cRef.current.scrollToEnd();
      }
    }, 0);

    setTimeout(() => {
      const list: any[] = messageListRef.current;
      const newList = [...list];
      for (let i = 0; i < list.length; i++) {
        if (param.flag === list[i].flag) {
          if (list[i].loading) {
            let newItem = { ...list[i], loading: false, error: true };
            newList[i] = newItem;
          }
          break;
        }
      }
      setMessageList(newList);
    }, 18000);

    if (type === 1) {
      var result = `<message 
        type='chat' 
        from='${customerId}@localhost/appClient' 
        to='${currentService.agentName}@${socketIp}/appClient'
        flag='${flag}'
        >
          <body>${realMessage}</body>
        </message>`
      if (webSocket !== null) {
        webSocket.send(result);
      }
    } else {
      const i = parseInt(realMessage);
      let tag = false;
      if (typeof i === 'number' && currentQuestions.level) {
        let res: any = {};
        if (i === currentQuestions.arr.length) {
          let param = {
            customer: customerId,
            deptId: currentQuestions.parentsId || currentQuestions.parentId
          }
          if (currentQuestions.level === '2' || currentQuestions.level === 2) {
            tag = true;
            res = await Api.questionCategory(param);
          } else if (currentQuestions.level === '3' || currentQuestions.level === 3) {
            tag = true;
            res = await Api.questionQuestion(param);
          }
        } else if (i < currentQuestions.arr.length && i >= 0) {
          let param = {
            customer: customerId,
            deptId: currentQuestions.arr[i].id
          }
          if (currentQuestions.level === '1' || currentQuestions.level === 1) {
            tag = true;
            res = await Api.questionQuestion(param);
          } else if (currentQuestions.level === '2' || currentQuestions.level === 2) {
            tag = true;
            res = await Api.questionAnswer(param);
          }
        }

        if (res.success) {
          setMessage('');
        } else if (res.success === false) {
          Toast.fail(res.result || '获取问题失败');
        }

        setTimeout(() => {
          const list: any[] = messageListRef.current;
          const newList = [...list];
          let error = false;
          if (tag && !res.success) {
            error = true;
          }
          for (let i = 0; i < list.length; i++) {
            if (param.flag === list[i].flag) {
              let newItem = { ...list[i], loading: false, error: error };
              newList[i] = newItem;
              break;
            }
          }
          setMessageList(newList);
        }, 0);
      }

      if (!tag) {
        setTimeout(() => {
          const list: any[] = messageListRef.current;
          const param = {
            id: list.length + 1,
            content: '请输入相应的序号',
            sender: 'admin',
            receive: customerId,
            type: 0,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          }
          let newList = [...list];
          newList = newList.concat(param);
          for (let i = 0; i < list.length; i++) {
            if (flag === list[i].flag) {
              let newItem = { ...list[i], loading: false, error: false };
              newList[i] = newItem;
              break;
            }
          }
          setMessageList(newList);
          setMessage('');
          setTimeout(() => {
            if (cRef && cRef.current && cRef.current.scrollToEnd) {
              cRef.current.scrollToEnd();
            }
          }, 0);
        }, 100);
      }
    }
  }

  const onSendImg = (url: any, list?: any[]) => {
    const flag = `${customerId}/${moment().valueOf()}`;
    var result = `<message type='chat' from='${customerId}@localhost/appClient' to='${currentService.agentName}@${socketIp}/appClient' flag='${flag}'>
    <img xmlns="icss:img" src="${url}" mediaId="null" original=""></img>
    </message>`

    const messageList: any[] = list ? list : messageListRef.current || [];
    if (webSocket !== null) {
      webSocket.send(result);
      const param = {
        id: messageList.length + 1,
        content: url,
        sender: customerId,
        senderNickName: customerNickName,
        receiver: currentService.agentName,
        receiverNickName: currentService.nickName,
        type: 2,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        flag: flag,
        loading: true,
      }
      const newMessageList = messageList.concat(param);
      setMessageList(newMessageList);
      setMessage('');
      setTimeout(() => {
        if (cRef && cRef.current && cRef.current.scrollToEnd) {
          cRef.current.scrollToEnd();
        }
      }, 0);

      setTimeout(() => {
        const list: any[] = messageListRef.current;
        const newList = [...list];
        for (let i = 0; i < list.length; i++) {
          if (param.flag === list[i].flag) {
            if (list[i].loading) {
              let newItem = { ...list[i], loading: false, error: true };
              newList[i] = newItem;
            }
            break;
          }
        }
        setMessageList(newList);
      }, 18000);
    }
  }

  const onImageChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = async (e: any) => {
        const base64 = e.target.result;
        if (typeof base64 === 'string' && base64.split('base64,').length > 0) {
          const params = {
            deptId: 100,
            imgStr: base64.split('base64,')[1]
          }
          Toast.loading('图片上传中...');
          const res = await Api.chatImgUpload(params);
          Toast.hide();
          if (res.success) {
            onSendImg(res.result);
          } else if (res.result !== false) {
            Toast.fail(res.result || '上传图片失败');
          }
        } else {
          Toast.fail('解析文件失败');
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  const onTransferToType = async () => {
    if (type !== 1) {
      Toast.loading('加载中...');
      const res = await Api.agentIdle({
        deptId: 100,
        customerName: customerId
      });
      Toast.hide();
      if (res.success) {
        setType(1);
        const data = res.result;
        setCurrentService(data);
        if (data && (data.nickName || data.agentName)) {
          Toast.success(`已连接客服${data.nickName || data.agentName}`);
        }
      } else {
        Toast.fail(res.result || '获取空闲客服失败！');
      }
    } else {
      Toast.loading('加载中...');
      const res = await Api.questionCategory({
        customer: customerId,
        deptId: deptId
      });
      Toast.hide();
      if (res.success) {
        setType(0);
      } else {
        Toast.show(res.result || '切换失败，请重试！')
      }
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>

      <OpenfireWebSocket
        url="ws://121.37.239.209:7070/ws/"
        socketIp={socketIp}
        id={customerId}
        pwd={customerPwd}
        setWebSocket={setWebSocket}
        onMessage={onMessage}
        reconnect={reconnect}
      />

      <div className="container-center-top" onClick={hideEmojiSelect}>
        <div>
          <img src={serviceAvatar} className="container-left-top-avatar" />
          <div className="container-left-top-user">
            <div className="container-left-top-user-name">智能客服</div>
            {/* <div className="container-left-top-user-role">超级管理员</div> */}
          </div>
        </div>

        <div style={{ position: 'absolute', right: 10, display: 'flex', flexDirection: 'column' }} onClick={onTransferToType}>
          <img src={serviceIcon} width={25} />
          <div style={{ fontSize: 12 }}>{type !== 1 ? '转人工' : '转智能'}</div>
        </div>
      </div>
      <div className="container-center-center" style={{ height: `calc(100% - 50px - ${bottomHeight}px` }} onClick={hideEmojiSelect}>
        <ConversationList
          cRef={cRef}
          list={messageList}
          setList={setMessageList}
          pageNum={messagesPage}
          setPageNum={setMessagesPage}
          total={messagesTotal}
          setTotal={setMessagesTotal}
          pageSize={20}
          onResend={onSend}
          onResendImg={onSendImg}
        />
      </div>
      <div ref={bottomRef} className="container-center-bottom">
        {/* <input type="file" multiple accept='image/*' /> */}
        <div className="container-center-bottom-bar">
          <TextArea
            ref={textareaRef}
            placeholder="请输入要发送的内容"
            autoSize={true}
            // bordered={false}
            style={{ resize: 'none', flex: 1 }}
            onKeyDown={(e) => onKeyDown(e)}
            value={message}
            onChange={onChangeValue}
            onFocus={onFocus}
            maxLength={150}
          />
          {
            type === 1 ? (
              <>
                <img className="container-center-bottom-icon" src={emojiIcon} onClick={showEmojiSelect} />
                {
                  message.trim().length > 0 ? (
                    <Button type="primary" onClick={() => onSend()} style={{ marginLeft: 10 }}>
                      发送
                    </Button>
                  ) : (
                      <div style={{ position: 'relative' }}>
                        <img className="container-center-bottom-icon" src={plusIcon} />
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, opacity: 0, overflow: 'hidden' }}>
                          <input type="file" accept='image/*' onChange={onImageChange} />
                        </div>
                      </div>
                    )
                }
              </>
            ) : (
                <>
                  {
                    message.trim().length > 0 && (
                      <Button type="primary" onClick={() => onSend()} style={{ marginLeft: 10 }}>
                        发送
                      </Button>
                    )
                  }
                </>
              )
          }

        </div>
        {
          selectShow && (
            <div>
              <Picker
                title='请选择表情'
                i18n={i18n}
                onSelect={onSelectEmoji}
                showPreview={false}
                showSkinTones={false}
                emojiTooltip={true}
                style={{ width: '100%' }}
              // native={true}
              />
            </div>
          )
        }
      </div>
      <RcViewer ref={viewerRef} options={{ loop: false }}>
        <ul id="images">
          {
            Array.isArray(imgList) && imgList.length > 0 && imgList.map((item, index) => {
              return (
                <li key={index}><img style={{ display: 'none' }} src={item} alt="" /></li>
              )
            })
          }
        </ul>
      </RcViewer>
    </div >
  );
}