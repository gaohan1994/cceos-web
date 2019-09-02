/**
 * @param {http://172.30.202.121:3000/binduser/ol2PCwVDf33PZrKpMUywszVpCXXk/type=bonus&bonusToken=5507ZR} 
 */
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { Input, Button, Card, List } from 'antd';
import "./index.less";
import invariant from 'invariant';
import { analysisUrl } from '../../common/request';
import Swiper from '../../component/Dirty/UserComponent/Swiper';
import SwiperView from 'react-swipeable-views';
import classnames from 'classnames';
import Api from '../../action/Api';
import { connect } from 'react-redux';
import { getBasicInfo } from '../../store/store';
import { BasicInfo } from '../../types/type';
import history from '../../history';

const { Item } = List;
// const { Search } = Input;

const BindUserPrefix = 'ct-bind-user';

export function getItemHelper (title: string, subTitle: string = '', config: any = {}) {
  const { icon = true, titleStyle = {}, SubTitleStyle = {} } = config;
  return (
    <Item>
      <div className={`${BindUserPrefix}-card-item`}>
        <div className={`${BindUserPrefix}-card-item-left`}>
          {
            icon === true ? (
              <div 
                className={`${BindUserPrefix}-card-item-left-img`} 
                style={{
                  backgroundImage: `url(${title === '姓名' 
                    ? '//net.huanmusic.com/cceos/web/icon_name.png' 
                    : '//net.huanmusic.com/cceos/web/icon_department.png'})`
                }}
              />
            ) : null
          }
          <div className={classnames(`${BindUserPrefix}-card-item-title`)} style={titleStyle}>{title}</div>
        </div>
        <div className={classnames(`${BindUserPrefix}-card-item-subtitle`)} style={SubTitleStyle}>{subTitle}</div>
      </div>
    </Item>
  );
}

export interface Props { 
  match: {
    params: {
      openId: string,
      params: any
    }
  };
  basicInfo: BasicInfo;
}

export interface State {
  index: number;
  phone: string;
  loading: boolean;
  vercode: string;
  time: number;
}

class BindUser extends React.Component<Props, State> {
  state = {
    index: 0,
    phone: '',
    vercode: '',
    loading: false,
    time: 0,
  };
  private timer: any;
  private vercodeRef: any;

  componentDidMount() {
    this.checkAuth();
  }
  
  public changePhone = ({ target: { value } }: any) => {
    this.setState({phone: value});
  }

  public changeVercode = ({ target: { value } }: any) => {
    this.setState({vercode: value});
  }

  public checkAuth = () => {
    console.log('checkAuth: ');
  }

  public setWaitTimer = (time: number) => {
    if (time < 0) {
      clearInterval(this.timer);
    } else {
      this.setState({ time });
    }
  }

  public getVercode = async () => {
    try {

      if (this.timer) {
        clearInterval(this.timer);
      }

      this.setLoading(true);
      invariant(this.state.phone && this.state.phone.length > 0, '请输入正确的手机号码');
      const payload = {
        openId: this.props.match.params.openId,
        phone: this.state.phone
      };
      const { success, result } = await Api.wechatValid(payload);
      this.setLoading(false);
      invariant(success, result || ' ');
      Toast.success('验证码已发送');

      this.setWaitTimer(60);
      this.timer = setInterval(() => {
        this.setWaitTimer(this.state.time - 1);
      }, 1000);
      
      this.vercodeRef.focus();
    } catch (error) {
      Toast.fail(error.message);
    }
  }

  public onPhoneConfirm = async () => {
    try {
      /**
       * [step1.输入工号，拿到工号请求回来的数据进行判断如果正确显示step2，如果失败留在原页面]
       */
      this.setLoading(true);
      invariant(this.state.phone && this.state.phone.length > 0, '请输入正确的手机号码');

      const payload = { phone: this.state.phone, validateCode: this.state.vercode };
      const { success, result } = await Api.wechatBasic(payload);
      
      this.setLoading(false);
      invariant(success, result || ' ');
      this.changeIndex(this.state.index + 1);
    } catch (error) {
      this.setLoading(false);
      Toast.fail(error.message);
    }
  }

  public onBindOver = () => {
    const { match: { params: { params, openId } } } = this.props;

    if (params) {
      const analysisParams = analysisUrl(params);
      // console.log('analysisParams: ', analysisParams);
      if (analysisParams && analysisParams.type) {
        switch (analysisParams.type) {
          case 'bonus':
            history.push(`/packet/${openId}/${analysisParams.bonusToken}`);
            return;
          default:
            history.push(`/user/${openId}`);
            return;
        }
      }
      history.push(`/user/${openId}`);
    }
  }

  public onConfirmBind = async () => {
    
    try {
      this.setLoading(true);
      const { match: { params: { openId } } } = this.props;
      invariant(openId && this.state.phone, '参数错误，请检查openid和手机号');
      
      const payload = { 
        openId,
        phone: this.state.phone,
        validateCode: this.state.vercode
      };
      const { success, result } = await Api.wechatBind(payload);

      this.setLoading(false);
      invariant(success, result || ' ');
      this.changeIndex(this.state.index + 1);
    } catch (error) {
      this.setLoading(false);
      Toast.fail(error.message);
    }
    
  }

  public changeIndex = (index: number) => {
    this.setState({ index });
  }

  public onSwiperChangePage = (index: number) => {
    const nextIndex = index - 1;
    /**
     * [如果要跳转的页面是后面的页面或者是当前页面，则不跳转]
     * [eg:1不能跳，2能跳1，3能跳1、2]
     */
    if (nextIndex >= this.state.index) {
      return;
    }
    this.changeIndex(nextIndex);
  }

  public setLoading = (loading: boolean) => {
    this.setState({ loading });
  }

  public render() {
    const { basicInfo } = this.props;
    const SwiperProps = {
      currentPage: this.state.index + 1,
      onChangePage: this.onSwiperChangePage
    };
    const ListData = [
      {title: '姓名', subTitle: basicInfo.name},
      {title: '部门', subTitle: basicInfo.department},
    ];

    return (
      <div className={BindUserPrefix}>
        <SwiperView 
          index={this.state.index}
          disabled={true}
        >
          <Swiper {...SwiperProps} >
            <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}>
              <div className={`${BindUserPrefix}-input-box`} >
                <Input
                  className={`${BindUserPrefix}-input`}
                  value={this.state.phone}
                  onChange={this.changePhone}
                  // onSearch={this.getVercode}
                  // enterButton="发送验证码"
                  placeholder="请填写您的手机号"
                  size="large"
                />
                <Button 
                  size="large"
                  type="primary"
                  loading={this.state.loading}
                  onClick={(this.state.phone && this.state.phone.length > 0) && this.state.time === 0 ? this.getVercode : () => {/** */}}
                  // disabled={!(this.state.phone && this.state.phone.length > 0) && this.state.time === 0}
                  className={classnames({
                    [`${BindUserPrefix}-button-disabled-active`]: 
                      (this.state.phone && this.state.phone.length > 0) && this.state.time === 0
                        ? false 
                        : true
                  })}
                >
                  {this.state.time === 0 ? '发送验证码' : `${this.state.time}秒后重新发送`}
                </Button>
              </div>
              <Input
                className={`${BindUserPrefix}-input`}
                style={{marginTop: '4vw'}}
                ref={(ref) => this.vercodeRef = ref}
                value={this.state.vercode}
                onChange={this.changeVercode}
                placeholder="请填写验证码"
                size="large"
              />
              <Button
                disabled={this.state.phone && this.state.phone.length > 0 ? false : true}
                loading={this.state.loading}
                size="large"
                block={true}
                shape="round"
                type="primary"
                onClick={this.onPhoneConfirm}
                className={classnames(`${BindUserPrefix}-button`, {
                  [`${BindUserPrefix}-button-disabled-active`]: (
                    this.state.phone && this.state.phone.length > 0 && this.state.vercode && this.state.vercode.length > 0
                  ) ? false : true
                })}
              >
                下一步
              </Button>
            </div>
          </Swiper>
          <Swiper {...SwiperProps} >
            <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}> 
              <Card className={`${BindUserPrefix}-card`}>
                <List
                  dataSource={ListData}
                  renderItem={(item: any) => {
                    return getItemHelper(item.title, item.subTitle);
                  }}
                />
              </Card>
              <Button
                size="large"
                block={true}
                shape="round"
                type="primary"
                loading={this.state.loading}
                onClick={this.onConfirmBind}
                className={classnames(`${BindUserPrefix}-button`)}
              >
                确认绑定
              </Button>
            </div>
          </Swiper>

          <Swiper {...SwiperProps} >
            <div className={classnames(`${BindUserPrefix}-swiper`, `${BindUserPrefix}-content`)}> 
              <div className={`${BindUserPrefix}-bind-icon`} />
              <div className={`${BindUserPrefix}-bind-success-text`}>恭喜您！绑定成功~</div>
              <Button
                size="large"
                block={true}
                shape="round"
                type="primary"
                loading={this.state.loading}
                onClick={this.onBindOver}
                className={classnames(`${BindUserPrefix}-button`)}
              >
                确认
              </Button>
            </div>
          </Swiper>
        </SwiperView>
      </div>
    );
  }
}

const mapState = (state: any) => ({
  basicInfo: getBasicInfo(state),
});

export default connect(mapState)(BindUser);