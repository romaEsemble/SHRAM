// import BackIcon from '@assets/cross_icon.svg';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Overlay} from '@rneui/base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import PropTypes from 'prop-types';
import PropTypes from 'deprecated-react-native-prop-types';

function PopupModal(props) {
  const {
    children,
    Icon,
    IconSize = wp(20),
    showBack,
    buttonTitle,
    onButtonPress,
    title,
    message,
    onBackdropPress,
    outsideTouchClose,
    footerLayout,
    containerStyle,
  } = props;

  return (
    <View>
      <Overlay
        isVisible={true}
        onBackdropPress={onBackdropPress}
        overlayStyle={{
          padding: 0,
          borderRadius: wp(1),
          backgroundColor: 'transparent',
          elevation: 0,
        }}
        backdropStyle={{backgroundColor: '#00000070'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: wp(95),
          }}>
          {onBackdropPress && outsideTouchClose && (
            <TouchableOpacity
              style={{...StyleSheet.absoluteFill}}
              onPress={onBackdropPress}
            />
          )}

          <View
            style={{
              borderRadius: wp(1),
              // padding: wp(2),
              backgroundColor: '#EFEFEF',
            }}>
            {/* {showBack && (
              <TouchableOpacity useNativeTOP onPress={onBackdropPress}>
                <BackIcon width={wp(3)} height={wp(3)} />
              </TouchableOpacity>
            )} */}

            <View style={[{padding: hp(2)}, containerStyle]}>
              {Icon && (
                <View style={{height: wp(20)}}>
                  <Icon width={IconSize} height={IconSize} />
                </View>
              )}

              {title && (
                <Text
                  style={{
                    fontSize: 24,
                    color: '#584505',
                    marginTop: hp(2),
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  {title}
                </Text>
              )}

              {message && (
                <Text
                  style={{fontSize: 12, color: '#989383', marginTop: hp(2)}}>
                  {message}
                </Text>
              )}

              {children}

              {/* {buttonTitle && onButtonPress && (
                <Button
                  useNativeTOP
                  medium
                  title={buttonTitle}
                  style={{alignSelf: 'center', marginTop: hp(2)}}
                  onPress={onButtonPress}
                />
              )} */}
              {footerLayout}
            </View>
          </View>
        </View>
      </Overlay>
    </View>
  );
}

PopupModal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  Icon: PropTypes.object,
  IconSize: PropTypes.number,
  showBack: PropTypes.bool,
  buttonTitle: PropTypes.string,
  onButtonPress: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  onBackdropPress: PropTypes.func,
  outsideTouchClose: PropTypes.bool,
  footerLayout: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

PopupModal.defaultProps = {
  children: undefined,
  Icon: undefined,
  IconSize: undefined,
  showBack: true,
  buttonTitle: undefined,
  onButtonPress: undefined,
  title: undefined,
  message: undefined,
  onBackdropPress: undefined,
  outsideTouchClose: true,
  footerLayout: undefined,
  containerStyle: undefined,
};

export default PopupModal;
