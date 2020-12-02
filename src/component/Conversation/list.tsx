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
  // hasMore: boolean;
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

  // useEffect(() => {
  //   if (total > -1 && list.length > 0 && total <= list.length) {
  //     setHasMore(false);
  //   } else {
  //     setHasMore(true);
  //   }
  // }, [list, total]);

  const onResend = (item: any) => {
    const newList: any = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id !== item.id) {
        newList.push(list[i]);
      }
    }
    // props.setList(newList);
    if (props.onResend && item.type === 0) {
      props.onResend(item.content, newList);
    } else if (props.onResendImg && item.type === 2) {
      props.onResendImg(item.content, newList)
    } 
  }

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

  const scrollToEnd = () => {
    if (listRef.current && listContentRef.current.clientHeight && list.length > 0) {
      console.log('height:', listRef.current.clientHeight);
      if (listRef.current.clientHeight < listContentRef.current.clientHeight) {
        listRef.current?.scrollTo(0, listContentRef.current.clientHeight);
        setClientHeight(listContentRef.current.clientHeight);
      }
    }
  }

  const onScroll = (e: any) => {
    // console.log('clientHeight: ', listRef.current.scrollTop)
  }

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
        const realList = removeRepeat('id', list, data.rows);
        if (Array.isArray(data.rows) && data.rows.length === 0) {
          setHasMore(false);
        }
        newList.unshift(...realList.reverse());
        setList(newList);
        setTotal(data.total);
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
    <div className="con-list" ref={listRef} onScroll={onScroll}>
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