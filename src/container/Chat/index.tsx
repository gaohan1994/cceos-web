/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-12-03 15:55:26 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-12-03 16:54:37
 * 
 * @todo 客服聊天记录页面
 */
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

const customerPwd = '12345';  // 客户的openfire登录密码
const socketIp = '121.37.239.209';

export default function () {

  const [webSocket, setWebSocket] = useState(null as WebSocket | null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([] as any);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotal, setMessagesTotal] = useState(-1);
  const [imgList, setImgList] = useState([] as any[]);
  const [bottomHeight, setBottomHeight] = useState(0);  // 底部容器的高度
  const [selectShow, setSelectShow] = useState(false);
  const [type, setType] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState({} as any);
  const [currentService, setCurrentService] = useState({} as any);
  const [reconnect, setReconnect] = useState(false);

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

  // 由于setTimeout中无法获取最新的messageList，使用ref来实现获取最新的messageList
  useEffect(() => {
    messageListRef.current = messageList;
  }, [messageList])

  // 页面加载时获取聊天记录的第一页
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

  // 获取智能分类聊天模版
  useEffect(() => {
    if (type !== 1) {
      Api.questionCategory({
        customer: customerId,
        deptId: deptId
      });
    }
  }, []);

  // 当地步高度发生变化时，改变底部容器的高度
  useEffect(() => {
    if (bottomRef && bottomRef.current && bottomRef.current.clientHeight) {
      setBottomHeight(bottomRef.current.clientHeight);
    }
  }, [bottomRef.current && bottomRef.current.clientHeight, selectShow]);

  // 当前messagelist列表发生更改的时候，设置当前图片列表，用以进行大图浏览的上一张下一张
  useEffect(() => {
    let list: any[] = [];
    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].type === 2) {
        list.push(messageList[i].content);
      }
    }
    setImgList(list);
  }, [messageList]);

  // 当前图片更改时，进行相应的大图显示
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

  /**
   * @todo 收到socket的消息进行解析
   * @param data 
   */
  const parseMessage = (data: any) => {
    let param = {};
    try {
      if (data.message) {
        let msg: any = data.message;
        // 如果msg包含level的信息，证明不是人工客服，是问题模版
        if (msg.level) {
          let body = msg.body;
          let str = '';
          let arr = [];
          // 如果body是对象，则是问题列表，进行相应的拼接
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
            // 否则已经是答案
            str = body.replace(/问题答案：/g, "");
          }

          param = {
            sender: msg?._from?.split('@')[0],
            senderNickName: msg._nickName,
            receiver: msg?._to?.split('@')[0],
            receiverNickName: customerNickName,
            content: str,
            type: 0,
          }
        } else {
          param = {
            sender: msg._from?.split('@')[0],
            senderNickName: msg._nickName,
            receiver: msg._to.split('@')[0],
            receiverNickName: customerNickName,
            content: msg.body || msg.img?._src,
            type: msg.img?._src ? 2 : msg._from.split('@')[0] === 'admin' ? 1 : 0,
          }
        }

        // 有收到message的id值，进行设置
        if (msg._keyNum) {
          param = {
            ...param,
            id: parseInt(msg._keyNum),
          }
        }

        // 有收到发送时间，进行设置
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

  /**
   * @todo socket监听消息
   * @param data 
   */
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
    if (typeof data.message._flag === 'string') {
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
      id: `${customerId}/${moment().valueOf()}`,
      ...parseMessage(data)
    });
    setMessageList(newMessageList);
    setTimeout(() => {
      if (cRef && cRef.current && cRef.current.scrollToEnd) {
        cRef.current.scrollToEnd();
      }
    }, 0);
  }

  /**
  * @todo 监听键盘的按键
  * @param e 
  */
  const onKeyDown = (e: any) => {
    // ctrl+enter、alt+enter、shift+enter实现换行
    if (e.keyCode == 13 && (e.ctrlKey || e.altKey || e.shiftKey)) {
      e.preventDefault();//禁止回车的默认换行
      const newMessage = message + '\n';
      setMessage(newMessage);
    } else if (e.keyCode == 13) {
      e.preventDefault();//禁止回车的默认换行
      onSend();
    }
  }

  /**
   * @todo 输入框内容改变调用
   * @param e 
   */
  const onChangeValue = (e: any) => {
    setMessage(e.target.value);
  }

  /**
   * @todo 显示表情符选择
   */
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

  /**
   * @todo 隐藏表情符选择
   */
  const hideEmojiSelect = () => {
    setSelectShow(false);
  }

  /**
   * @todo 聚焦时列表自动滑动到底部
   */
  const onFocus = () => {
    hideEmojiSelect();
    setTimeout(() => {
      if (cRef && cRef.current && cRef.current.scrollToEnd) {
        cRef.current.scrollToEnd();
      }
    }, 100);
  }

  /**
   * @todo 选中表情符调用
   * @param emoji 
   */
  const onSelectEmoji = (emoji: any) => {
    const newMessage = message + emoji.native;
    setMessage(newMessage);
  }

  /**
   * @todo 发送普通文字消息，msg与list在重新发送消息的时候使用
   * @param msg 要发送的消息内容
   * @param list 当前消息列表
   */
  const onSend = async (msg?: string, list?: any[]) => {
    if (message.trim().length === 0 && msg?.trim().length === 0) {
      return;
    }
    let trimMessage = message.trim(); // 去掉首尾空格符的内容
    if (msg && typeof msg === 'string' && msg.trim().length > 0) {
      trimMessage = msg.trim()
    }
    const messageList: any[] = list ? list : messageListRef.current || [];
    const flag = `${customerId}/${moment().valueOf()}`;
    const param = {
      id: flag,
      content: trimMessage,
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

    // 如果18秒后还没收到消息回执，则把消息设为发送失败
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

    // 如果type为1表示人工服务，使用socket发送消息
    if (type === 1) {
      var result = `<message 
        type='chat' 
        from='${customerId}@localhost/appClient' 
        to='${currentService.agentName}@${socketIp}/appClient'
        flag='${flag}'
        >
          <body>${trimMessage}</body>
        </message>`
      if (webSocket !== null) {
        webSocket.send(result);
      }
    } else {
      // 否则是智能服务，调用相应的获取问题/答案的接口
      const i = parseInt(trimMessage);
      let tag = false;
      // 如果输入的内容是数字，并且当前问题集的等级存在，才获取下一级问题/答案
      if (typeof i === 'number' && currentQuestions.level) {
        let res: any = {};
        // 如果输入的数字刚好是问题长度，表示返回上一级，获取上一级问题列表
        if (i === currentQuestions.arr.length) {
          let param = {
            customer: customerId,
            deptId: currentQuestions.parentsId || currentQuestions.parentId
          }
          if (currentQuestions.level === '2' || currentQuestions.level === 2) {
            tag = true;
            // 若当前处在第二级，获取第一级问题，调用问题分类接口
            res = await Api.questionCategory(param);
          } else if (currentQuestions.level === '3' || currentQuestions.level === 3) {
            // 若当前处在第三级，获取第二级问题，调用根据分类id查询具体问题接口
            tag = true;
            res = await Api.questionQuestion(param);
          }
        } else if (i < currentQuestions.arr.length && i >= 0) {
          // 否则获取下一季问题/答案
          let param = {
            customer: customerId,
            deptId: currentQuestions.arr[i].id
          }
          if (currentQuestions.level === '1' || currentQuestions.level === 1) {
            // 如果处在第一级，获取第二级问题，根据分类id查询具体问题
            tag = true;
            res = await Api.questionQuestion(param);
          } else if (currentQuestions.level === '2' || currentQuestions.level === 2) {
            // 如果处在第二级，获取第三级问题答案，根据问题id查询问题答案
            tag = true;
            res = await Api.questionAnswer(param);
          }
        }
        // 若获取成功，置空输入框，否则提示错误信息
        if (res.success) {
          setMessage('');
        } else if (res.success === false) {
          Toast.fail(res.result || '获取问题失败');
        }

        // 聊天记录活动到底部
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
            id: `${'admin'}/${moment().valueOf()}`,
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

  /**
    * @todo 发送图片
    * @param url 
    * @param list 
    */
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
      // 如果18秒后还没收到消息回执，则把消息设为发送失败
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

  /**
   * @todo 图片上传
   * @param event 
   */
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

  /**
   * @todo 切换人工服务/智能服务
   */
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
        <div className="container-center-bottom-bar">
          <TextArea
            ref={textareaRef}
            placeholder="请输入要发送的内容"
            autoSize={true}
            style={{ resize: 'none', flex: 1 }}
            onKeyDown={(e) => onKeyDown(e)}
            value={message}
            onChange={onChangeValue}
            onFocus={onFocus}
            maxLength={150}
          />
          {/** 只有人工服务的时候，才能发送图片和表情 */}
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