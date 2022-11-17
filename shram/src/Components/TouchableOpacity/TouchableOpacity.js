import {withTheme} from '@theme/ThemeHelper';
import PropTypes from 'prop-types';
// import PropTypes from 'deprecated-react-native-prop-types';
import React from 'react';
import {TouchableOpacity as Top, View} from 'react-native';
import {checkInternet} from '@utils/Util';
let internet = '';
function TouchableOpacity(props) {
  const {children} = props;
  function onPressFunc(props) {
    const {onPress} = props;
    if (onPress) {
      //TODO:check for internet
      if (true) {
        onPress();
      } else {
        // TODO: show this in snakbar
        alert('No Internet', 'You do not have active internet connection');
      }
    }
  }
  return (
    <Top {...props} activeOpacity={0.7} onPress={() => onPressFunc(props)}>
      {children}
    </Top>
  );
}

TouchableOpacity.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

TouchableOpacity.defaultProps = {
  children: <View />,
  onPress: () => {},
};

export default withTheme(TouchableOpacity);
