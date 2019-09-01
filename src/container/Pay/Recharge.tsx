import * as React from 'react';
import Swiper from '../../component/Dirty/UserComponent/Swiper';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Api from '../../action/Api';
import { Toast } from 'antd-mobile';
import invariant from 'invariant';
import { saveWechatBalance } from '../../action/reducer';
import { getWechatBalance } from '../../store/store';
import { Store } from '../../store/index';
import classnames from 'classnames';
import { Input, Button } from 'antd';
import { mergeProps } from '../../AppBuild/config';
import { WechatBalance } from '../../types/type';
import "../User/index.less";
import "./index.less"; 
import history from '../../history';

const payPrefix = 'cceos-pay';
const BindUserPrefix = 'ct-bind-user';
export interface Props {
  match: {
    params: {
      openId: string
    }
  };
  wechatBalance: WechatBalance;
  fetchBalance: () => any;
  recharge: ({count}: {count: number}) => { payUrl: string };
}

type State = {
  value: string;
  loading: boolean;
};

class Recharge extends React.Component<Props, State> {
  readonly state = {
    value: '',
    loading: false,
  };

  componentDidMount() {
    this.props.fetchBalance();
  }

  public checkValue = (value: string): string => {
    // value.replace(/[^0-9]/g
    /**
     * [1.去掉所有非数字项]
     */
    const valueNumber = Number(value.replace(/[^0-9]/g, ""));
    if (valueNumber > 1000) {
      return '1000';
    }
    if (valueNumber < 0) {
      return '0';
    }
    return `${valueNumber}`;
  }

  public changeValue = ({ target: { value } }: any) => {
    this.setState({ value: this.checkValue(value) });
  }

  public onPayClickHandle = async () => {
    try {
      this.setState({loading: true});
      const value = Number(this.state.value.replace(/[^0-9]/g, ""));

      invariant(typeof value === 'number' && value > 0, '请输入要充值的金额');
      const result = await this.props.recharge({count: value});
      this.setState({loading: false});

      if (result.payUrl) {
        window.location.href = result.payUrl;
      }
    } catch (error) {
      this.setState({loading: false});
      Toast.fail(error.message);
    }
  }

  public navigateHistory = () => {
    history.push(`/history/${this.props.match.params.openId}`);
  }

  public render() {
    return (
      <div className={`${payPrefix}`}>
        <Swiper
          renderPage={(
            <div className={`${payPrefix}-pay-card`}>
              <div 
                className={`${payPrefix}-pay-card-history`}
                onClick={this.navigateHistory}
              >
                <span className={`${payPrefix}-pay-card-history-img`}/>
                <div className={`${payPrefix}-pay-card-history-title`}>历史记录</div>
              </div>
              <div className={classnames(`${payPrefix}-pay-card-text`, `${payPrefix}-pay-card-number`)} >
                {this.props.wechatBalance.balance || 0}
              </div>
              <div className={`${payPrefix}-pay-card-text`} >当前账户雨滴券</div>
            </div>
          )}
        >
          <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}>
            <div className={`${BindUserPrefix}-input`}>
              <Input
                className={`${BindUserPrefix}-input-content`}
                value={this.state.value}
                onChange={this.changeValue}
                placeholder="请输入充值数量"
                size="large"
              />  
            </div>
            <div className={`${payPrefix}-pay-tip`}>
              注：充值{this.props.wechatBalance.rate || 0}元可换购一张雨滴劵
            </div>
            <div className={`${payPrefix}-pay-tip`}>
              注：每月最多充值1000张雨滴券
            </div>
            <Button
              loading={this.state.loading}
              size="large"
              block={true}
              shape="round"
              type="primary"
              onClick={this.onPayClickHandle}
              className={classnames(`${BindUserPrefix}-button`, {
                [`${BindUserPrefix}-button-disabled-active`]: false
              })}
            >
              确认金额无误，请充值
            </Button>

            <div className={classnames(`${payPrefix}-pay-tip`, `${payPrefix}-pay-tip-middle`)}>
              {`当前充值所需金额：`}
              <span>{Number(this.state.value) * Number(this.props.wechatBalance.rate || 0)}</span> 
              {` 元`}
            </div>
          </div>
        </Swiper>
      </div>
    );
  }
}

const mapState = (state: Store) => ({
  wechatBalance: getWechatBalance(state),
});

const mapDispatch = (dispatch: Dispatch, ownProps: Props) => {
  function fetchBalance () {
    return async () => {
      try {
        const { match: { params: { openId } } } = ownProps;
        invariant(openId, '请输入openid');

        const { success, result } = await Api.wechatBalance({ openId });
        invariant(success, result || ' ');
        saveWechatBalance(dispatch, result);
      } catch (error) {
        Toast.fail(error.message);
      }
    };
  }

  function recharge (params: { count: number }) {
    return async () => {
      
      try {
        const { match: { params: { openId } } } = ownProps;
        invariant(openId && params.count, '请输入openId和要充值的金额');
        
        const payload = { count: params.count, openId, };
        const { success, result } = await Api.wechatVoucher(payload);
        
        invariant(success, result || ' ');
        return result;
      } catch (error) {
        Toast.fail(error.message);
        return { success: false, result: error.message};
      }
    };
  }

  return {
    fetchBalance: bindActionCreators(fetchBalance, dispatch),
    recharge: bindActionCreators(recharge, dispatch),
  };
};

export default connect(mapState, mapDispatch, mergeProps)(Recharge);
