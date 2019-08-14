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

  private inputRef: any;

  componentDidMount() {
    this.props.fetchBalance();
    this.inputRef.focus();
  }

  public changeValue = ({ target: { value } }: any) => {
    this.setState({ value: value.replace(/[^0-9]/g, "") });
  }

  public onPayClickHandle = async () => {
    try {
      this.setState({loading: true});
      const value = Number(this.state.value.replace(/[^0-9]/g, ""));

      invariant(typeof value === 'number' && value > 0, '请传入要充值的金额');
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

  public render() {
    return (
      <div className={`${payPrefix}`}>
        <Swiper
          renderPage={(
            <div className={`${payPrefix}-pay-card`}>
              <div className={classnames(`${payPrefix}-pay-card-text`, `${payPrefix}-pay-card-number`)} >
                {this.props.wechatBalance.balance}
              </div>
              <div className={`${payPrefix}-pay-card-text`} >当前账户雨滴券</div>
            </div>
          )}
        >
          <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}>
            <Input
              autoFocus={true}
              ref={(inputRef => this.inputRef = inputRef)}
              className={`${BindUserPrefix}-input`}
              value={this.state.value}
              onChange={this.changeValue}
              placeholder="请输入充值金额"
              size="large"
            />
            <div className={`${payPrefix}-pay-tip`}>注：充值{this.props.wechatBalance.rate || 0}元可换购一张雨滴劵</div>

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
        invariant(openId, '请传入openid');

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
        invariant(openId && params.count, '请传入openId和要充值的金额');
        
        const payload = { count: params.count, openId, };
        const { success, result } = await Api.wechatVoucher(payload);
        
        invariant(success, result || ' ');
        return result;
      } catch (error) {
        Toast.fail(error.message);
      }
    };
  }

  return {
    fetchBalance: bindActionCreators(fetchBalance, dispatch),
    recharge: bindActionCreators(recharge, dispatch),
  };
};

export default connect(mapState, mapDispatch, mergeProps)(Recharge);
