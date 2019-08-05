
const AnimateUtil = {
  isAppearSupported: (props: any) => {
    return props.transitionName && props.transitionAppearToken;
  },
  isEnterSupported: (props: any) => {
    return props.transitionName && props.transitionEnterToken;
  },
  isLeaveSupported: (props: any) => {
    return props.transitionName && props.transitionLeaveToken;
  },
};

export default AnimateUtil;