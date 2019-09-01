/**
 * @Author: Ghan
 * @Date: 2019-08-13 11:40:44 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-13 15:00:09
 * @param {http://localhost:3000/result/openId=oTqXws3JjQdH_6G4rkru6Tfc0LUg&code=1&.....}
 */
import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { analysisUrl } from '../../common/request';

const payPrefix = 'cceos-pay';

export interface Props { 
  match: {
    params: {
      params: string
    }
  };
  urlParam: any;
}

class Result extends React.Component<Props> {
  
  constructor (props: Props) {
    super(props);
    console.log('props: ', props);
  }

  public render() {
    const { urlParam } = this.props;
    return (
      <div className={`${payPrefix}`}>
        <div className={`${payPrefix}-result`}>
          <div 
            className={classnames(`${payPrefix}-result-image`, {
              [`${payPrefix}-result-image-success`]: (urlParam.result === '1'),
              [`${payPrefix}-result-image-fail`]: !(urlParam.result === '1'),
            })} 
          />
          <div>{urlParam.message}</div>
          {urlParam.result === '1' && <div>在雨滴App内可以用雨滴券兑换CC</div>}
        </div>
      </div>
    );
  }
}

const mapState = (state: any, ownProps: Props) => {
  const { match: { params: { params } } } = ownProps;
  const urlParam = analysisUrl(params);
  return {
    urlParam
  };
};

export default connect(mapState)(Result);