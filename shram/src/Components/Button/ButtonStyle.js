import {StyleSheet} from 'react-native';

const defaultColor = '#FFFFFF';
const primaryColor = '#ff4400';

export default StyleSheet.create({
  fullStyle: {width: '80%'},
  halfStyle: {width: '45%'},
  quarterStyle: {width: '25%'},
  defaultBtnStyle: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  defaultTitleStyle: {color: defaultColor, fontFamily: 'Montserrat-Regular'},
});
