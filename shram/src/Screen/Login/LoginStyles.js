import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const localStyles = StyleSheet.create({
  termsView: {
    flexDirection: 'row',
    // marginBottom: 10,
    // alignSelf: 'center',
    // paddingTop: hp('2%'),
    paddingHorizontal: wp('3%'),
    alignItems: 'center',
  },
  unCheckBox: {
    borderWidth: 1,
    height: 18,
    width: 18,
  },
});

export default localStyles;
