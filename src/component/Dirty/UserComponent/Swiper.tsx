import * as React from 'react';
import "./index.less";
import classnames from 'classnames';

const UserPrefix = 'user-swiper';

function getCardItemText (index: number) {
  switch (index) {
    case 1:
      return <div className={`${UserPrefix}-card-content-item-text`}>填写工号</div>;
    case 2:
      return <div className={`${UserPrefix}-card-content-item-text`}>确认资料</div>;
    case 3:
      return <div className={`${UserPrefix}-card-content-item-text`}>确认绑定</div>;
    default:
      return '';
  }
}

function getCardItem (index: number, active: boolean, onClick: any): JSX.Element {
  if (active === true) {
    return (
      <div onClick={() => onClick(index, active)} className={classnames(`${UserPrefix}-card-content-item`)}>
        <div className={classnames(`${UserPrefix}-card-content-dot`, `${UserPrefix}-card-content-dot-success`)} /> 
        {getCardItemText(index)}
      </div>
    );
  } else {
    return (
      <div onClick={() => onClick(index, active)} className={classnames(`${UserPrefix}-card-content-item`)}>
        <div className={classnames(`${UserPrefix}-card-content-dot`)}>{index}</div>
        {getCardItemText(index)}
      </div>
    );
  }
}

export type Props = { 
  currentPage: number;
  onChangePage?: (params: any) => void;
} & React.HTMLProps<HTMLDivElement>;

export default class Swiper extends React.Component<Props> {

  public onClick = (index: number) => {
    if (this.props.onChangePage) {
      this.props.onChangePage(index);
    }
  }

  public render() {
    return (
      <div className={UserPrefix}>
        {this.renderCard()}
        {this.props.children}
      </div>
    );
  }

  private renderCard = () => {
    const { currentPage, className } = this.props;
    return (
      <div className={classnames(className, `${UserPrefix}-card`)}>
        <div className={`${UserPrefix}-card-content`}>
          {getCardItem(1, currentPage >= 1, this.onClick)}
          <div className={`${UserPrefix}-card-content-line`} />
          {getCardItem(2, currentPage >= 2, this.onClick)}
          <div className={`${UserPrefix}-card-content-line`} />
          {getCardItem(3, currentPage >= 3, this.onClick)}
        </div>
      </div>
    );
  }
}
