import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const localStyles = StyleSheet.create({
  flex1: {
    flex: 1,
    padding: hp('2%'),
    backgroundColor: '#fff',
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: hp('2%'),
    alignSelf: 'center',
    paddingHorizontal: wp('2%'),
    color: '#21AAE4',
  },
  renderView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnView: {flex: 0.3, justifyContent: 'center'},
  btnStyle: {marginVertical: hp('2%')},
  subTextStyle: {textAlign: 'center'},
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  imgContainer: {
    // marginTop: 10,
    height: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerView: {
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    flex: 0.1,
    flexDirection: 'row',
  },
  flatView: {
    justifyContent: 'center',
    width: '100%',
    marginBottom: hp('2%'),
  },
});

export default localStyles;
