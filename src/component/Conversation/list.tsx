/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-12-03 16:54:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-12-03 17:07:24
 * 
 * @todo 聊天记录页面
 */
import { Spin } from 'antd';
import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import Api from '../../action/Api';
// @ts-ignore
import { ConversationItem } from '.';
import './index.less';
import { Toast } from 'antd-mobile';
import { removeRepeat, useQueryParam } from '../../common/util';

interface Props {
  list: any[];
  setList: any;
  pageNum: number;
  setPageNum: any;
  pageSize: number;
  total: number;
  setTotal: any;
  cRef: any;
  onResend?: any;
  onResendImg?: any;
}

export default function ConversationList(props: Props) {
  const { list, setList, pageNum, setPageNum, pageSize, setTotal } = props;
  const listRef: any = useRef(null);
  const listContentRef: any = useRef(null);
  const [isInit, setIsInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clientHieght, setClientHeight] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const customerId = useQueryParam('id');

  // 判断是否是初次打开页面，如果是将列表滑动到最下面
  useEffect(() => {
    if (listRef.current && listContentRef.current.clientHeight && list.length > 0 && isInit) {
      console.log('height:', listRef.current.clientHeight);
      if (listRef.current.clientHeight < listContentRef.current.clientHeight) {
        listRef.current?.scrollTo(0, listContentRef.current.clientHeight);
        setClientHeight(listContentRef.current.clientHeight);
      }
      setIsInit(false);
    }
  }, [listRef.current, listContentRef.current, list]);

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    scrollToEnd: scrollToEnd,
  }));

  /**
   * @todo 消息重发
   * @param item 
   */
  const onResend = (item: any) => {
    const newList: any = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id !== item.id) {
        newList.push(list[i]);
      }
    }
    if (props.onResend && item.type === 0) {
      props.onResend(item.content, newList);
    } else if (props.onResendImg && item.type === 2) {
      props.onResendImg(item.content, newList)
    }
  }

  /**
   * @todo 列表滑动到底部
   */
  const scrollToEnd = () => {
    if (listRef.current && listContentRef.current.clientHeight && list.length > 0) {
      console.log('height:', listRef.current.clientHeight);
      if (listRef.current.clientHeight < listContentRef.current.clientHeight) {
        listRef.current?.scrollTo(0, listContentRef.current.clientHeight);
        setClientHeight(listContentRef.current.clientHeight);
      }
    }
  }

  /**
   * @todo 加载更多调用
   */
  const onLoadMore = () => {
    const params = {
      pageNum: pageNum,
      pageSize: pageSize,
      ownName: customerId,
      orderByColumn: 'create_time desc'
    }
    setLoading(true);
    Api.chatLogHistory(params, (result: any) => {
      setLoading(false);
      if (result && result.success) {
        const data = result.result;
        setPageNum(pageNum + 1);
        const newList = [...list];
        // 去重
        const realList = removeRepeat('id', list, data.rows);
        // 获取到下一页数据为空的情况，表示没有下一页数据了
        if (Array.isArray(data.rows) && data.rows.length === 0) {
          setHasMore(false);
        }
        // 由于列表是根据创建时间倒叙获取的，所以在拼入列表头部的时候需要进行反向
        newList.unshift(...realList.reverse());
        setList(newList);
        setTotal(data.total);
         // 由于直接设置列表会直接在列表的顶部，而不会在加载的那个位置
          // 希望获取列表后还在当前那个位置，就需要获取列表前后的差值进行滑动
        if (listRef.current && listContentRef.current.clientHeight && list.length > 0) {
          console.log('height:', listRef.current.clientHeight);
          if (listRef.current.clientHeight < listContentRef.current.clientHeight) {
            const diff = listContentRef.current.clientHeight - clientHieght;
            listRef.current?.scrollTo(0, diff);
            setClientHeight(listContentRef.current.clientHeight);
          }
          setIsInit(false);
        }
      } else {
        if (result && result.result !== false) {
          Toast.fail(result?.result || '');
        }
      }
    });
  }

  return (
    <div className="con-list" ref={listRef} >
      {
        list && list.length > 0 && (
          <div className="con-list-more">
            {
              loading ? (
                <Spin spinning={true}>

                </Spin>
              ) : hasMore ? (
                <a onClick={onLoadMore}>
                  <div className="con-list-more">点击加载更多</div>
                </a>
              ) : (
                    <div className="con-list-more">没有更多记录了～</div>
                  )
            }
          </div>
        )
      }
      <div ref={listContentRef}>
        {
          list && list.length > 0 && list.map((item) => {
            return (
              <ConversationItem data={item} key={item.id} onResend={onResend} />
            )
          })
        }
      </div>
    </div>
  )
}