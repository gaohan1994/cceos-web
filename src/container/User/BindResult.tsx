/**
 * @param {http://172.30.202.121:3000/binduser/ol2PCwVDf33PZrKpMUywszVpCXXk/type=bonus&bonusToken=5507ZR} 
 */
import * as React from 'react';
import { Button } from 'antd';
import "./index.less";
import Swiper from '../../component/Dirty/UserComponent/Swiper';
import classnames from 'classnames';
import { connect } from 'react-redux';
import history from '../../history';

const BindUserPrefix = 'ct-bind-user';

export interface Props {
  match: {
    params: {
      openId: string
    }
  };
}

export interface State {
}

class BindResult extends React.Component<Props, State> {

  public navigateToRecharge = () => {
    history.push(`/recharge/${this.props.match.params.openId}`);
  }

  public render() {
    return (
      <div className={BindUserPrefix}>
        <Swiper>
          <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}> 
            <div className={`${BindUserPrefix}-bind-icon`} />
            <div className={`${BindUserPrefix}-bind-success-text`} style={{fontSize: '15px'}}>个人信息已绑定，可以尽情充值了！</div>
            <Button
              size="large"
              block={true}
              shape="round"
              type="primary"
              onClick={this.navigateToRecharge}
              className={classnames(`${BindUserPrefix}-button`)}
            >
              确认
            </Button>
          </div>
        </Swiper>
      </div>
    );
  }
}

const mapState = (state: any) => ({ });

export default connect(mapState)(BindResult);