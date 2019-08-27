import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Api from '../../action/Api';
import { Toast, PullToRefresh } from 'antd-mobile';
import invariant from 'invariant';
import { saveWechatRecords } from '../../action/reducer';
import { getWechatRecord, getFetchRecordsToken } from '../../store/store';
import { FetchListField } from '../../types/type';
import { Store } from '../../store/index';
import "./index.less";
import classnames from 'classnames';

const historyPrefix = 'cceos-pay';

export interface Props { 
  match: {
    params: {
      openId: string;
    }
  };
  state: Store;
  wechatRecord: any;
  fetchWechatRecords: (params: FetchListField) => any;
}

interface State { 
  refreshing: boolean;
}

let pageNum: number = 1;
let pageSize: number = 20;

class History extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    this.props.fetchWechatRecords({pageNum: pageNum++, pageSize: pageSize++});
  }

  public fetchData = async () => {
    try {
      const token = getFetchRecordsToken(this.props.state, pageNum);
      if (token === true || pageNum === 1) {
        await this.props.fetchWechatRecords({pageNum: pageNum++, pageSize: pageSize++});  
      }
    } catch (error) {
      Toast.fail(error.message);
    }
  }
  
  public render() {
    const { wechatRecord } = this.props;
    return (
      <div className={historyPrefix}>
        <PullToRefresh
          damping={60}
          direction={'up'}
          distanceToRefresh={25}
          indicator={{
            activate: '加载更多',
            deactivate: '加载更多',
            release: '正在加载中',
            finish: '加载完毕'
          }}
          refreshing={this.state.refreshing}
          style={{height: '100vh', overflow: 'auto'}}
          onRefresh={() => {
            this.setState({ refreshing: true });
            setTimeout(() => {
              this.setState({ refreshing: false });
            }, 1000);
            this.fetchData();
          }}
        >
          {
            wechatRecord && wechatRecord.length > 0 && wechatRecord.map((rowData: any, index: number) => {
              return (
                <div 
                  key={`${index}`}
                  className={classnames(`${historyPrefix}-list-item`, `${historyPrefix}-list-item-border`)}
                >
                  <div className={classnames(`${historyPrefix}-list-item-dot`)}/>
                  <div className={classnames(`${historyPrefix}-list-item-content`)}>
                    <div>
                      <div className={`${historyPrefix}-list-item-title`}>{rowData.name}</div>
                      <div className={`${historyPrefix}-list-item-subtitle`}>{rowData.time}</div>
                    </div>
                    <div className={`${historyPrefix}-list-item-detail`}>{rowData.amount}</div>
                  </div>
                </div>
              );
            })
          }
        </PullToRefresh>
      </div>
    );
  }
}

const mapState = (state: Store) => ({
  state,
  wechatRecord: getWechatRecord(state),
});

const mapDispatch = (dispatch: Dispatch, ownProps: Props) => {

  function fetchWechatRecords (params: FetchListField) {
    return async (dispatch: Dispatch): Promise<any> => {
      try {
        invariant(ownProps.match.params && ownProps.match.params.openId, '请输入要查询的员工号');
        const payload = { ...params, openId: ownProps.match.params.openId };
        const { success, result } = await Api.wechatRecords(payload); 

        invariant(success, result || ' ');
        return saveWechatRecords(dispatch, {...result, pageNum: params.pageNum});
      } catch (error) {
        Toast.fail(error.message);
      }
    };
  }

  return {
    fetchWechatRecords: bindActionCreators(fetchWechatRecords, dispatch)
  };
};

export default connect(mapState, mapDispatch)(History);