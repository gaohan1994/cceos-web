import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { List } from 'antd-mobile';
import "./packet.less";
import classnames from 'classnames';
import { PacketModal } from '../../component';
import { Modal } from 'antd-mobile';
console.log('Modal: ', Modal);
console.log('PacketModal: ', PacketModal);

const PacketPrefix = 'ct-packet';
const ListItemClassName = `${PacketPrefix}-list-item`;
const { Item } = List;

type Props = {
  fetchData: (params?: any) => any;
};

type State = {
  visible: boolean;
};

class Packet extends Component<Props, State> {

  state = {
    visible: false
  };

  componentDidMount() {
    const { fetchData } = this.props;
    fetchData({name: 'Ghan'});
  }

  render() {

    const data = [1, 2, 3, 4];
    return (
      <div className={classnames(`${PacketPrefix}`)}>

        <Modal
          visible={this.state.visible}
          transparent={true}
          maskClosable={false}
          title="Title"
        >
          <div style={{ height: 100, overflow: 'scroll' }}>
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
          </div>
        </Modal>
        <div onClick={() => { this.setState({visible: true}); }}>click</div>
        {/* <PacketModal visible={this.state.visible} >
          <div>hello world</div>
        </PacketModal> */}
        <div className={classnames(`${PacketPrefix}-header`)}>
          <div className={`${PacketPrefix}-header-content`}>
            <img className={`${PacketPrefix}-header-content-img`} src="//net.huanmusic.com/cceos/pic_man.png" />
            <span className={classnames(`${PacketPrefix}-text`, `${PacketPrefix}-header-content-title`)} >升腾资讯</span>
          </div>
          <span className={classnames(`${PacketPrefix}-text`, `${PacketPrefix}-header-content-sub-title`)} >恭喜发财</span>
          <span className={classnames(`${PacketPrefix}-text`, `${PacketPrefix}-header-content-detail`)} >5000 CC</span>
        </div>
        <List className={classnames(`${PacketPrefix}-list`)}>
          <span className={`${ListItemClassName}-flag`} />
          {
            data.map((item: any, index: number) => {
              return (
                <Item 
                  key={index}
                  className={ListItemClassName}
                >
                  <div className={`${ListItemClassName}-line`}>
                    <div className={`${ListItemClassName}-title`} >
                      <img className={`${ListItemClassName}-img`} src="//net.huanmusic.com/cceos/pic_man.png" />
                      <div className={`${ListItemClassName}-content`}>
                        <span className={classnames(`${PacketPrefix}-title`, `${ListItemClassName}-name`)} >name</span>
                        <span className={classnames(`${PacketPrefix}-sub-title`, `${ListItemClassName}-detail`)} >2019-07-24  15:00:00</span>
                      </div>
                    </div>

                    <div className={classnames(`${ListItemClassName}-content`, `${ListItemClassName}-sub-content`)}>
                      <span className={classnames(`${PacketPrefix}-title`, `${ListItemClassName}-name`)} >name</span>
                      <span className={classnames(`${ListItemClassName}-best`)} />
                    </div>
                  </div>
                </Item>
              );
            })
          }
        </List>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {

  function fetchPacket (params: any) {
    return (dispatch: Dispatch) => {
      console.log('params: ', params);
    };
  }

  return {
    fetchData: bindActionCreators(fetchPacket, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Packet);