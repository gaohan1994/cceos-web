/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-12-03 17:07:27 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-12-03 17:13:35
 * 
 * @todo 聊天记录项
 */
import React from 'react';
import avatar from '../../image/pic_man.png';
import serviceAvatar from '../../image/avatar_service.png';
import errorIcon from '../../image/icon_error.png';
import './index.less';
import { useQueryParam } from '../../common/util';
import { AppStore } from '../../AppBuild/App';
import { RECEIVE_CURRENT_IMAGE } from '../../types/constant';
import ReactLoading from 'react-loading';

interface Props {
  data: any;
  onResend?: any;
}

export default function ConversationItem(props: Props) {
  const { data } = props;
  const customerId = useQueryParam('id');

  /**
   * @todo 大图浏览图片
   * @param url 
   */
  const showPic = (url: string) => {
    AppStore.dispatch({
      type: RECEIVE_CURRENT_IMAGE,
      payload: { currentImg: url }
    });
  }

  /**
   * @todo 消息重发
   */
  const onResend = () => {
    if (props.onResend) {
      props.onResend(data);
    }
  }

  /**
   * @todo type为1表示系统消息
   */
  if (data.type === 1) {
    return (
      <div className="con-item-system">
        <div className="con-item-system-box">
          {data.content}
        </div>
      </div>
    )
  }
  return (
    <>
      {
        data.sender !== customerId ? (
           /** 发送者为自己 */
          <div className="con-item">
            <img src={serviceAvatar} className="con-item-avatar" />
            <div className="con-item-right">
              <div>{data.senderNickName || data.sender}</div>
              <div className="con-item-right-box">
                {/** 普通文字消息 */}
                {
                  data.type === 0 && (
                    <div className="con-item-right-content">{data.content}</div>
                  )
                }
                {/** 图片消息 */}
                {
                  data.type === 2 && (
                    <div className="con-item-right-content" onClick={() => { showPic(data.content) }}>
                      <img src={data.content} />
                    </div>
                  )
                }
              </div>
              {
                data.createTime && data.createTime.length > 0 && (
                  <div className="con-item-right-time" style={{ textAlign: 'left' }}>
                    {data.createTime}
                  </div>
                )
              }
            </div>
          </div>
        )
          : (
            /** 自己是接收者 */
            <div className="con-item">
              <div className="con-item-right">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{data.senderNickName || data.sender}</div>
                <div className="con-item-right-box" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {/** 加载组件 */}
                  {
                    data.loading && (
                      <div style={{ marginRight: 10 }}>
                        <ReactLoading type={'spokes'} color='grey' height={25} width={25} />
                      </div>
                    )
                  }
                  {/** 发送失败组件 */}
                  {
                    data.error && (
                      <div style={{ marginRight: 10, cursor: 'pointer' }} onClick={onResend}>
                        <img src={errorIcon} width={25} height={25} />
                      </div>
                    )
                  }
                  {/** 普通文字消息 */}
                  {
                    data.type === 0 && (
                      <div className="con-item-right-content" style={{ backgroundColor: '#c8e7ff' }}>{data.content}</div>
                    )
                  }
                  {/** 图片消息 */}
                  {
                    data.type === 2 && (
                      <div className="con-item-right-content" style={{ backgroundColor: '#c8e7ff' }} onClick={() => { showPic(data.content) }}>
                        <img src={data.content} />
                      </div>
                    )
                  }
                </div>
                {
                  data.createTime && data.createTime.length > 0 && (
                    <div className="con-item-right-time">
                      {data.createTime}
                    </div>
                  )
                }
              </div>
              <img src={avatar} className="con-item-avatar" />
            </div>
          )
      }
    </>
  )
}