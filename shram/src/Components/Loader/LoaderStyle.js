import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100 %',
    width: '100%',
    position: 'absolute',
    elevation: 1,
    zIndex: 10,
  },
  textStyle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#707070',
  },
});

export default styles;
