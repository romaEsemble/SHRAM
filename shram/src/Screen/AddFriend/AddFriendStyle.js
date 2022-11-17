import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const localStyles = StyleSheet.create({
  innerImageView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
  },
  circlePosition: {
    position: 'absolute',
  },
  imageCircleView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  centerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default localStyles;
