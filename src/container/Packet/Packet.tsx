import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import "./packet.less";
import classnames from 'classnames';
import { Spin } from 'antd';
import { Toast, List } from 'antd-mobile';
import Api from 'src/action/Api';
import invariant from 'invariant';
import { saveBonusDetail } from '../../action/reducer';
import { Store } from '../../store/index';
import { getBonusDetail } from '../../store/store';
import { BonusDetail, Receiver } from '../../types/type';

export function checkUserInReceiverList (user: Receiver | string, receiverList: Receiver[]): number {
  if (typeof user === 'string') {
    /**
     * @param {user = openid}
     */
    return receiverList.findIndex(r => r.openId === user);
  } else {
    /**
     * @param {user = Receiver}
     */
    return receiverList.findIndex(r => r.openId === user.openId);
  }
}

const PacketPrefix = 'ct-packet';
const ListItemClassName = `${PacketPrefix}-list-item`;
const { Item } = List;

type BonusWithReceiver = BonusDetail & { receiverList: Receiver[] };

type Props = {
  fetchData: (params?: any) => any;
  packetGrab: (bonusToken: string, openId: string) => any;
  bonusDetail: BonusWithReceiver;
  match: {
    params: {
      openId: string;
      bonusToken: string
    }
  };
};

type State = {
  visible: boolean;
  loading: boolean;
};

class Packet extends Component<Props, State> {

  state = {
    visible: false,
    loading: false,
  };

  public componentDidMount = async () => {
    
    const { fetchData, packetGrab, match } = this.props;
    /**
     * [判断红包状态1.是否已领完2.是否已过期]
     * [2.判断当前用户是否已经领取过]
     * [如果领取过则显示详情]
     * [如果没有领取过则不显示详情并请求抢红包接口]
     */
    try {
      this.changeLoading(true);
      invariant(match.params.bonusToken && typeof match.params.bonusToken === 'string', '请输入红包口令');
      const { bonusDetailVO, receiverList } = await fetchData(match.params.bonusToken);

      invariant(bonusDetailVO.status !== 2, '红包已过期');
      invariant(match.params.bonusToken && match.params.openId, '请输入红包口令和微信id');

      if (checkUserInReceiverList(match.params.openId, receiverList) === -1) {
        /**
         * [没有领取过且红包是领完状态的再显示红包已领完]
         * [说明没有抢过红包则抢红包，抢完之后再次请求详情接口]
         */
        invariant(bonusDetailVO.status !== 1, '红包已领完');
        await packetGrab(match.params.bonusToken, match.params.openId);
        await fetchData(match.params.bonusToken);
        this.changeLoading(false);
        return;
      }
      this.changeLoading(false);
    } catch (error) {
      this.changeLoading(false);
      Toast.fail(error.message);
    }
  }

  public changeLoading = (loading: boolean) => {
    this.setState({ loading });
  }

  render() {
    const { bonusDetail } = this.props;
    return (
      <Spin size="large" spinning={this.state.loading}>
        <div className={classnames(`${PacketPrefix}`)}>
          <div className={classnames(`${PacketPrefix}-header`)}>
            <div className={`${PacketPrefix}-header-content`}>
              <img 
                className={`${PacketPrefix}-header-content-img`}
                src={bonusDetail.sex === 0 ? "//net.huanmusic.com/cceos/pic_man.png" : "//net.huanmusic.com/cceos/pic_women.png"} 
              />
              <span className={classnames(`${PacketPrefix}-text`, `${PacketPrefix}-header-content-title`)} >{bonusDetail.sender}的红包</span>
            </div>
            <span className={classnames(`${PacketPrefix}-text`, `${PacketPrefix}-header-content-sub-title`)} >{bonusDetail.comment}</span>
            {/* 如果当前用户有抢到红包则显示当前用户抢到的钱，如果没有抢到红包则不显示金额 */}
            {(bonusDetail.receiverList && checkUserInReceiverList(this.props.match.params.openId, bonusDetail.receiverList) !== -1) && (
              <span className={classnames(`${PacketPrefix}-text`, `${PacketPrefix}-header-content-detail`)} >
                {`${bonusDetail.receiverList[checkUserInReceiverList(this.props.match.params.openId, bonusDetail.receiverList)].amount} KCC`}
              </span>
            )}
          </div>
          <List className={classnames(`${PacketPrefix}-list`)}>
            <div className={`${PacketPrefix}-list-item-flag`}>
              已领取 {bonusDetail.recvNum} / {bonusDetail.number} 个{bonusDetail.openId === this.props.match.params.openId && `，共 ${bonusDetail.amount} KCC`}
            </div>
            {
              bonusDetail && bonusDetail.receiverList && bonusDetail.receiverList.map((item: Receiver, index: number) => {
                return (
                  <Item 
                    key={index}
                    className={ListItemClassName}
                  >
                    <div className={`${ListItemClassName}-line`}>
                      <div className={`${ListItemClassName}-title`} >
                        <img
                          className={`${ListItemClassName}-img`} 
                          src={item.sex === 0 ? "//net.huanmusic.com/cceos/pic_man.png" : "//net.huanmusic.com/cceos/pic_women.png"} 
                        />
                        <div className={`${ListItemClassName}-content`}>
                          <span className={classnames(`${PacketPrefix}-title`, `${ListItemClassName}-name`)} >{item.receiver}</span>
                          <span className={classnames(`${PacketPrefix}-sub-title`, `${ListItemClassName}-detail`)} >{item.recvTime}</span>
                        </div>
                      </div>

                      <div className={classnames(`${ListItemClassName}-content`, `${ListItemClassName}-sub-content`)}>
                        <span className={classnames(`${PacketPrefix}-title`, `${ListItemClassName}-name`)} >{`${item.amount} KCC`}</span>
                        {item.bestLuck === 1 && (<span className={classnames(`${ListItemClassName}-best`)} />)}
                      </div>
                    </div>
                  </Item>
                );
              })
            }
          </List>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    bonusDetail: getBonusDetail(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: Props) => {
  function fetchPacket (bonusToken: string) {
    return async (dispatch: Dispatch): Promise<any> => {
      try {
        invariant(bonusToken, '请输入红包口令');
        const { success, result } = await Api.bonusDetail(bonusToken);
        invariant(success, result || ' ');
        saveBonusDetail(dispatch, {receiverList: result.receiverList, bonusDetail: result.bonusDetailVO});
        return result;
      } catch (error) {
        Toast.fail(error.message);
      }
    };
  }

  function packetGrab (bonusToken: string, openId: string) {
    return async (dispatch: Dispatch): Promise<any> => {
      try {
        invariant(bonusToken && openId, '请输入红包口令和微信openid');
        const { success, result } = await Api.bonusGrab({bonusToken, openid: openId});  
        invariant(success, result || ' ');
        return result;
      } catch (error) {
        Toast.fail(error.message);
      }
    };
  }

  return {
    fetchData: bindActionCreators(fetchPacket, dispatch),
    packetGrab: bindActionCreators(packetGrab, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Packet);