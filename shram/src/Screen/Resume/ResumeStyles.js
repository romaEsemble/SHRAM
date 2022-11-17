import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const localStyles = StyleSheet.create({
  flex1: {flex: 1},
  optionView: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#fff',
    elevation: 6,
    paddingHorizontal: 5,
    margin: 5,
  },
  optionTextStyle: {textAlign: 'center', color: '#4B79D8', marginHorizontal: 5},

  inputContainerStyle: {
    height: 40,
    marginVertical: 0,
    // borderWidth: 1,
    // borderRadius: 5,
    // marginHorizontal: -10,
    // alignItems: 'center',
  },
});

export default localStyles;
