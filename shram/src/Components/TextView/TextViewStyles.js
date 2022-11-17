import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  tinyStyle: {
    fontSize: hp(1.5),
  },
  extraSmallStyle: {fontSize: hp(2)},
  smallStyle: {
    fontSize: hp(2.5),
  },
  mediumStyle: {
    fontSize: hp(3),
  },
  largeStyle: {
    fontSize: hp(3.5),
  },
  extraLargeStyle: {
    fontSize: hp(4),
  },
  headerStyle: {
    fontSize: hp(4.5),
  },
});

export default styles;
