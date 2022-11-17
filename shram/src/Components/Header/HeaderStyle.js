import {StyleSheet} from 'react-native';

const defaultColor = '#fff';
const primaryColor = '#333333';

export default StyleSheet.create({
  parentview: {height: '10%', backgroundColor: '#fff'},
  childview: {
    flex: 0.6,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
  backview: {
    marginLeft: 20,
    flex: 0.9,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  serchview: {
    flexDirection: 'row-reverse',
    alignContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginLeft: 20,
  },
  backtextstyle: {fontSize: 15, color: '#E54200'},
  titleStyle: {
    color: '#21AAE4',
  },
  secoundchildview: {flex: 1},
  borderlineview: {
    height: 0.5,
    backgroundColor: '#707070',
    marginLeft: 20,
    marginRight: 20,
  },
  textstyle: {fontSize: 20},
  viewnormal: {justifyContent: 'center', marginTop: 10, marginLeft: 30},
  viewnormal2: {padding: 2},
  inputstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
    marginLeft: 20,
  },
  placeholderstyle: {
    borderWidth: 1,
    borderColor: '#FBCD01',
  },
  defaultHeaderColor: {
    backgroundColor: '#fff',
    marginBottom: -1,
  },
  showShadow: {
    // elevation: 6,
    backgroundColor: '#4B79D8',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: {width: 1, height: 5},
    borderColor: '#4B79D8',
  },
});
