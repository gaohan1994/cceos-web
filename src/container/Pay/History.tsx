import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Api from '../../action/Api';
import { Toast } from 'antd-mobile';
import invariant from 'invariant';
import { saveWechatRecords } from '../../action/reducer';
import { getWechatRecord } from '../../store/store';

const historyPrefix = 'cceos-pay-history';

export interface Props { 
  match: {
    params: {
      workNumber: string
    }
  };
  wechatRecord: any;
  fetchWechatRecords: () => any;
}

class History extends React.Component<Props> {

  componentDidMount() {
    this.props.fetchWechatRecords();
  }
  
  public render() {
    console.log('wechatRecord: ', this.props);
    return (
      <div className={`${historyPrefix}`} >
        History
      </div>
    );
  }
}

const mapState = (state: any) => ({
  wechatRecord: getWechatRecord(state),
});

const mapDispatch = (dispatch: Dispatch, ownProps: Props) => {

  function fetchWechatRecords (params: any) {
    return async (dispatch: Dispatch) => {
      try {
        invariant(ownProps.match.params && ownProps.match.params.workNumber, '请传入要查询的员工号');

        const payload = { workNumber: ownProps.match.params.workNumber };
        const { success, result } = await Api.wechatRecords(payload); 

        invariant(success, result || ' ');
        saveWechatRecords(dispatch, result);
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