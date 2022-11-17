import React from 'react';
import {withTheme} from '@theme/ThemeHelper';
import {Overlay} from '@rneui/base';
import {Dimensions} from 'react-native';
import {TEXT_TYPE} from '@resources/Constants';
import {View, BackHandler} from 'react-native';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import Close from '@icons/close.svg';
import Logo from '@icons/Logo.svg';
function Model(props) {
  return (
    <Overlay
      width={Dimensions.get('window').width * 0.9}
      height="auto"
      {...props}
      overlayStyle={[
        props.overlayStyle,
        {
          width: Dimensions.get('window').width * 0.9,
          padding: 0,
        },
      ]}>
      {props.children}
    </Overlay>
  );
}

export default withTheme(Model);
