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
  optionsView: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#707070',
    marginHorizontal: 5,
  },
  WrongOptions: {
    borderWidth: 3,
    borderRadius: 5,
    borderColor: 'red',
    marginHorizontal: 5,
  },
  CorrectOptions: {
    borderWidth: 3,
    borderRadius: 5,
    borderColor: 'green',
    marginHorizontal: 5,
  },
});

export default localStyles;
