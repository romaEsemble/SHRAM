import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const localStyles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  optionsContainer: {
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
  flatListContainerStyle: {
    paddingVertical: hp(2),
  },
  optionView: {
    borderRadius: wp(4),
    elevation: 6,
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    marginHorizontal: wp(1),
  },
  optionViewBig: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#fff',
    backgroundColor: '#fff',
    elevation: 6,
    marginHorizontal: 5,
    width: '40%',
  },
  optionTextStyle: {textAlign: 'center', color: '#4B79D8'},
  backgroundFlowerContainer: {alignItems: 'flex-end', top: -13, left: 10},
  backgroundFlowerPositions: {position: 'absolute', zIndex: -9},
  innerImageView: {
    alignItems: 'center',
    width: '100%',
    height: 200,
    borderWidth: 0.5,
    borderColor: '#4B79D8',
    borderRadius: 10,
  },
});

export default localStyles;
