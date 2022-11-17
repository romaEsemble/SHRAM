import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import {PermissionsAndroid, Platform, Share} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';
import RNFetchBlob from 'rn-fetch-blob';
import strings from '@resources/Strings';
import analytics from '@react-native-firebase/analytics';

export let showSnackBar = (text, type) => {
  Snackbar.show({
    text: text,
    backgroundColor: type === 'success' ? '#00A444' : '#C3423F',
    // duration: Snackbar.LENGTH_INDEFINITE,
    duration: Snackbar.LENGTH_SHORT,
    // fontFamily: 'Roboto-Medium',
    // action: {
    //   text: 'OK',
    //   textColor: '#fff',
    // },
  });
};
let permissionObj = {
  location: {
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  },
};

export const logger = (type, data) => {};

export async function share(id, type) {
  const shareBaseUrl = await AsyncStorage.getItem('share_url');
  console.log('sharebase', shareBaseUrl, id, encodeURIComponent(id));
  try {
    const result = await Share.share({
      message: shareBaseUrl + type + encodeURIComponent(id),
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log('Shared success with Activity:', result.activityType);
      } else {
        // shared
        console.log('Shared success');
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      console.log('Shared dismissed');
    }
  } catch (error) {
    console.log('Share error', error.message);
  }
}

export function debounce(callback, wait = 500, context = this) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => callback.apply(context, callbackArgs);

  return function () {
    callbackArgs = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const checkPermission = async (permission, callback) => {
  try {
    let permissionType =
      Platform.OS === 'ios'
        ? permissionObj[permission].ios
        : permissionObj[permission].android;

    let permissionResult = await check(permissionType);
    console.log(permissionType);
    switch (permissionResult) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        await requestPermission(permissionType);
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        await requestPermission(permissionType);

        break;
    }

    callback && callback();
  } catch (error) {
    console.log(error);
  }
};

export async function requestPermission(permission) {
  const result = await request(permission);
  return result;
}

export function checkInternet() {
  const netInfo = useNetInfo();
  return netInfo.isInternetReachable;
}

export async function DownloadFile(link, name) {
  console.log(link, name, 'ddd');
  let granted = '';
  try {
    console.log('1');
    if (Platform.OS === 'ios') {
      granted = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (granted != RESULTS.GRANTED) {
        let requests = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        granted = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      }
    } else {
      console.log('2');

      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: strings?.shramNeedsYourPermissions,
          message: '',
          buttonNeutral: strings?.askMeLater,
          buttonNegative: strings?.cancel,
          buttonPositive: strings?.ok,
        },
      );
    }
    if (granted === RESULTS.GRANTED) {
      console.log('3');

      let DownloadDir = RNFetchBlob.fs.dirs.DownloadDir;
      RNFetchBlob.config({
        addAndroidDownloads: {
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: true,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          path: DownloadDir + '/' + name,
        },
      })
        .fetch('GET', link)
        .then((resp) => {
          // the path of downloaded file
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(
              RNFetchBlob.fs.dirs.DownloadDir,
              resp.data,
              'base64',
            );
            RNFetchBlob.ios.previewDocument(RNFetchBlob.fs.DownloadDir);
          }
          Snackbar.show({
            text: strings?.downloadedSuccessAt + ' ' + resp.path(),
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: '#5BC0EB',
          });
        });
      console.log('4');
    } else {
      // alert('File access permission denied');
      Snackbar.show({
        text: strings?.fileAccessPermissionRequired,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#E57373',
      });
      this.setState({loader: false});
    }
  } catch (err) {
    console.log(err);
  }
}
export const sendBtnClickToAnalytics = async (btnName, value = '') => {
  console.log('Clicked Util', btnName);
  await analytics().logEvent('clicked', {
    ['button_name']: btnName,
    ['value']: JSON.stringify(value),
  });
};
