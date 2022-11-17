// import PropTypes from 'prop-types';
import PropTypes from 'deprecated-react-native-prop-types';
import {withTheme} from '@theme/ThemeHelper';
import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import styles from '@loader/LoaderStyle';
import {
  LOADER_ACTIVITY_INDICATOR_SIZE,
  DEFAULT_LOADER_TEXT,
} from '@resources/Constants';
function Loader(props) {
  let {loading, text, theme} = props;
  let {overlayStyle, textStyle} = styles;
  return (
    <>
      {loading ? (
        <View style={overlayStyle}>
          <ActivityIndicator
            size={LOADER_ACTIVITY_INDICATOR_SIZE}
            color={theme ? theme.red : '#C3423F'}
          />
          <Text style={textStyle}>{text}</Text>
        </View>
      ) : null}
    </>
  );
}

Loader.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.string,
  theme: PropTypes.object,
};

Loader.defaultProps = {
  text: DEFAULT_LOADER_TEXT,
  loading: false,
};

export default withTheme(Loader);
