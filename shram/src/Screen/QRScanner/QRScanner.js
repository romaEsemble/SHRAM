import React, {Component} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {URLs} from '@networking/Urls';
import {FEED, QR_LINK, RECOMMEND_JOB} from '@redux/Types';
import {apiCall as api} from '@networking/withAPI';
import {showSnackBar} from '@utils/Util';
// import { useIsFocused } from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {
  NAVIGATION_ROJGAR_STACK,
  NAVIGATION_PROFILE_STACK,
  NAVIGATION_ROJGAR,
  NAVIGATION_HOME,
  NAVIGATION_FRIEND_DETAIL,
} from '@navigation/NavigationKeys';
import strings from '../../Resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default class ScanScreen extends Component {
  // shouldComponentUpdate = async (nextProps) => {
  //   console.log('Should');
  // };

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(prevProps) {
    this.scanner.reactivate(true);
    // console.log('updated', prevProps);
    // // if (prevProps.isFocused !== this.props.isFocused) {
    // //   // Use the `this.props.isFocused` boolean
    // //   // Call any action
    // // }
  }

  onSuccess = async (e) => {
    // Linking.openURL(e.data).catch((err) =>
    //   console.error('An error occured', err),
    // );
    try {
      // const CryptoJS = require('crypto-js');
      // var matches = str.match(/(\d+)/);
      sendBtnClickToAnalytics('QR scanned');
      const {apiSuccess, data} = await api(URLs.DECRYPTED_DATA, {
        profile_link: e?.data,
        type: '1',
      });
      console.log('React native', {
        profile_link: e?.data,
        type: '1',
      });
      if (data?.status == 502) {
        showSnackBar(data?.message, 'error');
        this.props.navigation.goBack();
        return;
      }
      var str = data?.data;
      var matches = str.match(/(\d+)/);

      if (data?.data?.includes('JOB')) {
        // if (e?.data?.includes('JOB')) {
        this.props?.navigation?.navigate(NAVIGATION_ROJGAR_STACK, {
          screen: NAVIGATION_ROJGAR,
          params: {job_id: matches[0], type: 'unecrypted'},
        });
      } else if (data?.data?.includes('PROFILE')) {
        // if (e?.data?.includes('JOB')) {
        // NAVIGATION_KEYS.NAVIGATION_FRIEND_DETAIL;
        this.props?.navigation?.navigate(NAVIGATION_FRIEND_DETAIL, {
          screen: NAVIGATION_FRIEND_DETAIL,
          params: {user_id: matches[0], type: 'unecrypted'},
        });
      }
      // else if (data?.data?.includes('CONTENT')) {
      //   // if (e?.data?.includes('JOB')) {
      //   this.props?.navigation?.navigate(NAVIGATION_HOME, {
      //     screen: NAVIGATION_HOME,
      //     params: {content_id: matches[0]},
      //   });
      // }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <QRCodeScanner
        ref={(node) => {
          this.scanner = node;
        }}
        onRead={this.onSuccess}
        topContent={
          <Text style={styles.centerText}>{strings?.scanQrCode}</Text>
        }
        bottomContent={
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={() => {
              this.props.navigation.goBack();
              // this.onSuccess();
            }}>
            <Text style={styles.buttonText}>{strings?.back}</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    marginTop: 15,
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    marginTop: 15,
    padding: 16,
  },
});
