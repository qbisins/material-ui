import transitions from '../styles/transitions';
import React, {Component, PropTypes} from 'react';
import propTypes from '../utils/propTypes';
import Paper from '../Paper';

function getStyles(props, context, state) {
  const {targetOrigin} = props;
  const {muiTheme} = context;
  const horizontal = targetOrigin.horizontal.replace('middle', 'vertical');

  return {
    root: {
      opacity: 0,
      transform: 'scale(0, 0)',
      transformOrigin: `${horizontal} ${targetOrigin.vertical}`,
      position: 'fixed',
      zIndex: muiTheme.zIndex.popover,
      transition: transitions.easeOut('250ms', ['transform', 'opacity']),
      maxHeight: '100%',
    },
    horizontal: {
      maxHeight: '100%',
      overflowY: 'auto',
      transform: 'scaleX(0)',
      opacity: 0,
      transformOrigin: `${horizontal} ${targetOrigin.vertical}`,
      transition: transitions.easeOut('250ms', ['transform', 'opacity']),
    },
    vertical: {
      opacity: 0,
      transform: 'scaleY(0)',
      transformOrigin: `${horizontal} ${targetOrigin.vertical}`,
      transition: transitions.easeOut('500ms', ['transform', 'opacity']),
    },
  };
}

function getOpenStyles(props, context, state) {
  const {targetOrigin} = props;
  const {muiTheme} = context;
  const horizontal = targetOrigin.horizontal.replace('middle', 'vertical');

  return {
    root: {
      opacity: 1,
      transform: 'scale(1, 1)',
    },
    horizontal: {
      opacity: 1,
      transform: 'scaleX(1)',
    },
    vertical: {
      opacity: 1,
      transform: 'scaleY(1)',
    },
  };
}

class PopoverAnimationDefault extends Component {
  static propTypes = {
    children: PropTypes.node,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    open: PropTypes.bool.isRequired,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    targetOrigin: propTypes.origin.isRequired,
    zDepth: propTypes.zDepth,
  };

  static defaultProps = {
    style: {},
    zDepth: 1,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    open: false,
  };

  componentDidMount() {
    this.setState({open: true}); // eslint-disable-line react/no-did-mount-set-state
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
    });
  }

  render() {
    const {
      className,
      style,
      zDepth,
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    let openStyles = {root: {}, horizontal: {}, vertical: {}};
    if (this.state.open)
      openStyles = getOpenStyles(this.props, this.context, this.state);

    return (
      <Paper
        style={Object.assign(styles.root, style, openStyles.root)}
        zDepth={zDepth}
        className={className}
      >
        <div style={prepareStyles(styles.horizontal, openStyles.horizontal)}>
          <div style={prepareStyles(styles.vertical, openStyles.vertical)}>
            {this.props.children}
          </div>
        </div>
      </Paper>
    );
  }
}

export default PopoverAnimationDefault;
