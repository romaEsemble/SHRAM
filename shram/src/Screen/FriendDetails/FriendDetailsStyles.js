import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const localStyles = StyleSheet.create({
  starsView: {flexDirection: 'row', padding: 5, marginTop: 5},
  personalHeaderMainContainer: {
    // height: 280,
    backgroundColor: '#4B79D8',
    width: '100%',
    justifyContent: 'center',
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
  circlePosition: {
    position: 'absolute',
  },
  innerImageView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
  },
  backgroundFlowerContainer: {alignItems: 'flex-end'},
  backgroundFlowerPositions: {position: 'absolute', zIndex: -9},
});

export default localStyles;
