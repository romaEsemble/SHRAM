import React from 'react';
import {withTheme} from '@theme/ThemeHelper';
import {Text} from 'react-native';
import localStyles from '@textView/TextViewStyles';

function TextView(props) {
  const {
    type,
    underline,
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    bold,
    light,
    regular,
  } = props;
  const {
    tinyStyle,
    extraSmallStyle,
    smallStyle,
    mediumStyle,
    largeStyle,
    extraLargeStyle,
    headerStyle,
  } = localStyles;

  let getSize = () => {
    if (!type) {
      return {};
    }
    switch (type) {
      case 'tiny':
        return tinyStyle;
      case 'EXTRA_SMALL':
        return extraSmallStyle;
      case 'small':
        return smallStyle;
      case 'medium':
        return mediumStyle;
      case 'large':
        return largeStyle;
      case 'EXTRA_LARGE':
        return extraLargeStyle;
      case 'header':
        return headerStyle;
    }
  };

  let getWeight = () => {
    if (bold) {
      return {
        fontFamily: 'Roboto-Bold',
        fontWeight: '900',
      };
    } else if (light) {
      return {
        fontFamily: 'Roboto-Light',
        fontWeight: '100',
      };
    } else if (regular) {
      return {
        fontFamily: 'Roboto-Regular',
        fontWeight: '300',
      };
    } else {
      return {
        fontFamily: 'Roboto-Medium',
        fontWeight: '600',
      };
    }
  };

  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[
        getSize(),
        getWeight(),
        {
          textDecorationLine: underline ? 'underline' : undefined,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export default withTheme(TextView);
