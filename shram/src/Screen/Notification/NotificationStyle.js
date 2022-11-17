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
  notiView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('2%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {width: 1, height: 5},
    elevation: 5,
    backgroundColor: '#fff',
    margin: 10,
  },
  notiHeader: {
    marginLeft: wp('1%'),
    marginBottom: hp('2%'),
    marginTop: hp('2%'),
    fontSize: 22,
    width: '90%',
    color: '#6F6F6F',
  },
  notimsg: {
    fontSize: 16,
    color: '#6F6F6F',
    width: '65%',
  },
  notiRaised: {width: '90%', fontSize: 14, color: '#989898'},
  sideDots: {
    marginTop: hp('1%'),
    backgroundColor: '#6F6F6F',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  sideDotsPlacement: {width: '17%', alignItems: 'center'},
  headerView: {
    flexDirection: 'row',
    width: wp('100%'),
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default localStyles;
