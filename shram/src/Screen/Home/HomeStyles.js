import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const localStyles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textStyle: {
    flexDirection: 'row',
    width: '100%',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default localStyles;
