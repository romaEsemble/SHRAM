import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const localStyles = StyleSheet.create({
  flex1: {flex: 1},
  inputContainerStyle: {
    height: 40,
    marginVertical: 0,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: -8,
  },
});

export default localStyles;
