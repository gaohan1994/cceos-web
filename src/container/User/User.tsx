import * as React from 'react';
import "./index.less";
import Swiper from '../../component/Dirty/UserComponent/Swiper';
import classnames from 'classnames';
import { Card, List } from 'antd';
import { getItemHelper } from './BindUser';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Api from '../../action/Api';
import { Toast } from 'antd-mobile';
import invariant from 'invariant';
import { saveWechatPersonal } from '../../action/reducer';
import { getWechatPersonal } from '../../store/store';
import { Store } from '../../store/index';
import { WechatPersonalInfo } from '../../types/type';

const BindUserPrefix = 'ct-bind-user';

function mapKeyToValue (key: string) {
  switch (key) {
    case 'name':
      return '姓名';
    case 'department':
      return '部门';
    case 'email':
      return '邮箱';
    case 'mobile':
      return '手机号';
    case 'workNumber':
      return '工号';
    case 'purchase':
      return '雨滴券';
    case 'cc':
      return '雨滴KCC';
    default:
      return '';
  }
}

export interface Props { 
  match: {
    params: {
      openId: string,
      params: any
    }
  };
  wechatPersonal: WechatPersonalInfo;
  fetchUserInfo: () => any;
}

class User extends React.Component<Props> {

  componentDidMount() {
    this.props.fetchUserInfo();
  }

  public render() {
    const { wechatPersonal } = this.props;
    const ListData: any[] = [];
    
    if (wechatPersonal.voucherInfo && typeof wechatPersonal.voucherInfo.purchase === 'number') {
      ListData.push({title: mapKeyToValue('purchase'), subTitle: wechatPersonal.voucherInfo.purchase});
    }

    if (wechatPersonal.cc) {
      ListData.push({title: mapKeyToValue('cc'), subTitle: wechatPersonal.cc});
    }

    if (wechatPersonal && wechatPersonal.basicInfo) {
      for (let key in wechatPersonal.basicInfo) {
        if (wechatPersonal.basicInfo[key]) {
          if (key === 'workNumber') {
            ListData.unshift({title: mapKeyToValue(`${key}`), subTitle: wechatPersonal.basicInfo[key]});
          } else {
            ListData.push({title: mapKeyToValue(`${key}`), subTitle: wechatPersonal.basicInfo[key]});
          }
        }
      }
    }

    return (
      <div className={`${BindUserPrefix}`}>
        <Swiper className={`${BindUserPrefix}-personal`}>
          <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}>
            <div 
              style={{backgroundImage: wechatPersonal.headImageUrl && typeof wechatPersonal.headImageUrl === 'string' 
                ? `url(${wechatPersonal.headImageUrl})`
                : `url(//net.huanmusic.com/cceos/pic_man.png)`}}
              className={classnames(`${BindUserPrefix}-bind-icon`)} 
            />
            <Card className={classnames(`${BindUserPrefix}-card`, `${BindUserPrefix}-card-pos`, `${BindUserPrefix}-card-personal`)}>
                <List
                  dataSource={ListData}
                  renderItem={(item: any) => {
                    return getItemHelper(item.title, item.subTitle, { icon: false, titleStyle: { color: '#666' } });
                  }}
                />
            </Card>
          </div>
        </Swiper>
      </div>
    );
  }
}

const mapState = (state: Store) => ({
  wechatPersonal: getWechatPersonal(state)
});

const mapDispatch = (dispatch: Dispatch, ownProps: Props) => {
  const { match } = ownProps;
  function fetchUserInfo (params: any) {
    return async (dispatch: Dispatch) => {
      try {
        const { params: { openId } } = match;
        const payload = { openId };
        Toast.loading('加载中...', 30);
        const { success, result } = await Api.wechatPersonal(payload);
        Toast.hide();
        invariant(success, result || ' ');
        saveWechatPersonal(dispatch, result);
      } catch (error) {
        Toast.fail(error.message);
      }
    };
  }

  return {
    fetchUserInfo: bindActionCreators(fetchUserInfo, dispatch),
  };
};

export default connect(mapState, mapDispatch)(User);