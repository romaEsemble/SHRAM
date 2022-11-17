import styles from '@button/ButtonStyle';
import {withTheme} from '@theme/ThemeHelper';
import {useNetInfo} from '@react-native-community/netinfo';
// import PropTypes from 'deprecated-react-native-prop-types';
import {PropTypes} from 'prop-types';
import * as React from 'react';
import {Button as ButtonView} from '@rneui/base';
import {sendBtnClickToAnalytics} from '@utils/Util';

function Button(props) {
  //TODO: check netconnection
  const netInfo = useNetInfo();
  const {
    full,
    half,
    quarter,
    buttonStyle,
    containerStyle,
    icon,
    iconContainerStyle,
    iconRight,
    loading,
    loadingProps,
    loadingStyle,
    onPress,
    title,
    titleStyle,
    disabled,
    backgroundColor,
    raised,
    theme,
  } = props;
  let defaultStyle = {};
  const {
    fullStyle,
    halfStyle,
    quarterStyle,
    defaultBtnStyle,
    defaultTitleStyle,
  } = styles;
  if (quarter) {
    defaultStyle = quarterStyle;
  } else if (half) {
    defaultStyle = halfStyle;
  } else if (full) {
    defaultStyle = fullStyle;
  }
  //
  let checkInternet = async () => {
    if (true) {
      onPress();
      sendBtnClickToAnalytics(title || '');
    } else {
      // TODO: change it later
      alert('No internet');
    }
  };

  return (
    <ButtonView
      buttonStyle={[
        defaultBtnStyle,
        defaultStyle,
        buttonStyle,
        backgroundColor
          ? {backgroundColor}
          : {backgroundColor: theme?.buttonColor},
      ]}
      containerStyle={containerStyle}
      icon={icon}
      raised={raised}
      disabled={disabled}
      iconContainerStyle={iconContainerStyle}
      iconRight={iconRight}
      loading={loading}
      loadingProps={loadingProps}
      loadingStyle={loadingStyle}
      onPress={checkInternet}
      title={title?.toUpperCase()}
      titleStyle={[
        {
          color: theme?.white,
          fontFamily: 'Montserrat-Bold',
          fontWeight: 'bold',
          fontSize: 18,
        },
        titleStyle,
      ]}
    />
  );
}

Button.propTypes = {
  onPress: PropTypes.func,
  full: PropTypes.bool,
  half: PropTypes.bool,
  quarter: PropTypes.bool,
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.PropTypes.element,
  iconContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconRight: PropTypes.PropTypes.element,
  loading: PropTypes.bool,
  loadingProps: PropTypes.object,
  loadingStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  raised: PropTypes.bool,
  theme: PropTypes.object,
};

export default withTheme(Button);
