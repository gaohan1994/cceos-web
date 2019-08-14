import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Api from '../../action/Api';
import { Toast, ListView } from 'antd-mobile';
import invariant from 'invariant';
import { saveWechatRecords } from '../../action/reducer';
import { getWechatRecord, getFetchRecordsToken } from '../../store/store';
import { FetchListField } from '../../types/type';
import { Store } from '../../store/index';
import "./index.less";

const historyPrefix = 'cceos-pay';

export interface Props { 
  match: {
    params: {
      openId: string;
      workNumber: string;
    }
  };
  state: Store;
  wechatRecord: any;
  fetchWechatRecords: (params: FetchListField) => any;
}

interface State { 
  dataSource: any;
}

let pageNum: number = 1;
let pageSize: number = 20;

class History extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2
      })
    };
  }

  public componentWillReceiveProps = (nextProps: Props) => {
    const { wechatRecord } = nextProps;
    if (wechatRecord !== this.props.wechatRecord) {
      this.state.dataSource.cloneWithRows(wechatRecord);
    }
  }

  componentDidMount() {
    this.props.fetchWechatRecords({pageNum: pageNum++, pageSize: pageSize++});
  }

  public fetchData = async () => {
    try {
      const token = getFetchRecordsToken(this.props.state, pageNum);
      if (token === true) {
        await this.props.fetchWechatRecords({pageNum: pageNum++, pageSize: pageSize++});  
      }
    } catch (error) {
      Toast.fail(error.message);
    }
  }
  
  public render() {
    console.log(this.state);
    return (
      <div className={`${historyPrefix}`} >
        
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </div>
    );
  }

  private renderRow = (rowData: any, sectionId: string, rowId: string) => {
    return (
      <div key={`${sectionId}${rowId}`}>
        renderRow
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
        invariant(ownProps.match.params && ownProps.match.params.workNumber, '请传入要查询的员工号');
        const payload = { ...params, workNumber: ownProps.match.params.workNumber };
        const { success, result } = await Api.wechatRecords(payload); 

        invariant(success, result || ' ');
        return saveWechatRecords(dispatch, result);
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