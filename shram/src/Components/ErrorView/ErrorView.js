import LocalStyles from '@errorView/ErrorViewStyle';
import ErrorSvg from '@icons/Error.svg';
import {ERROR_VIEW_TYPE} from '@resources/Constants';
import strings, {
  defaultErrorMsg,
  defaultNoDataMsg,
  retryText,
} from '@resources/Strings';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import PropTypes from 'deprecated-react-native-prop-types';
// import PropTypes from 'prop-types';
import React from 'react';
import {Image, View} from 'react-native';
import {sendBtnClickToAnalytics} from '@utils/Util';
// import ReusableImage from '@cardItem/ReusableImage';

export default function ErrorView(props) {
  let {defaultContainerStyle, defaultTextStyle} = LocalStyles;
  let {containerStyle, textStyle, text, type, imageStyle, retry} = props;
  return (
    <View style={[defaultContainerStyle, containerStyle]}>
      {/* <Nodata style={imageStyle} /> */}
      {type === ERROR_VIEW_TYPE.ERROR ? (
        <ErrorSvg height={100} width={100} style={imageStyle} />
      ) : (
        <Image
          style={{height: 200, width: 200}}
          source={require('@icons/nodata.png')}></Image>
      )}
      <Text style={[defaultTextStyle, textStyle]}>
        {text ||
          (type === ERROR_VIEW_TYPE.ERROR
            ? strings?.somethingWentWrong
            : strings?.noDataAvailable)}
      </Text>
      {retry ? (
        <TouchableOpacity
          onPress={() => {
            retry();
            sendBtnClickToAnalytics(strings?.retry);
          }}>
          <Text style={[defaultTextStyle, textStyle]}>{strings?.retry}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

ErrorView.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  text: PropTypes.string,
  type: PropTypes.oneOf(Object.values(ERROR_VIEW_TYPE)),
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  retry: PropTypes.func,
};
