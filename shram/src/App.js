import Bugsnag from '@bugsnag/react-native';
// import Navigator from '@navigation/Router';
import {URLs} from '@networking/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {callApi} from '@redux/CommonDispatch.js';
import {SHARE_BASE_URL} from '@redux/Types';
import strings from '@resources/Strings';
import Text from '@textView/TextView';
import {sendBtnClickToAnalytics} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import {Overlay} from 'react-native-elements';
import { Overlay } from '@rneui/base';
import ErrorBoundary from 'react-native-error-boundary';
import 'react-native-gesture-handler';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';

function App(props) {
  // const navigation = useNavigation();
  const VersionInfo = DeviceInfo.getVersion();
  console.log('App props', props);
  const [initialised, setInitialised] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  try {
    // OneSignal.init('1ef4861e-4e9b-4104-a437-9aed7f0c4bdb', {
    OneSignal.init('5ba54ee4-17b2-4312-9535-b18b3e9741c7', {
    //  OneSignal.init('95cff369-b531-4e6e-8918-eb905fbfdddd', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2);
  } catch (error) {
    // logger(LOGGER_TYPE.ERROR, error);
  }

  OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);
  let onIds = async (device) => {
    AsyncStorage.setItem('fcmToken', device.userId);
    console.log('device.userId', device.userId);
  };

  const getShareBaseUrl = () => {
    dispatch(
      callApi(
        SHARE_BASE_URL,
        URLs.PLT_COMMON_DATA,
        {
          comm_name: 'share_base_url',
          app_lang: strings?.getLanguage(),
        },
        async (data) => {
          console.log('Data for utl', data);
          await AsyncStorage.setItem('share_url', data?.data[0].plt_val);
        },
      ),
    );
  };

  useEffect(() => {
    checkVersion();
    AppState.addEventListener('change', _handleAppStateChange);
    Linking.addEventListener('url', (event) => {});
    OneSignal.addEventListener('ids', onIds);
    // OneSignal.addEventListener('received', onReceived);
    // OneSignal.addEventListener('opened', onOpened);

    SplashScreen.hide();
    Bugsnag.start();

    getShareBaseUrl();
    return () => {
      // OneSignal.removeEventListener('received', onReceived);
      // OneSignal.removeEventListener('opened', onOpened);
      OneSignal.removeEventListener('ids', onIds);
      AppState.removeEventListener('change', _handleAppStateChange);
      Linking.removeEventListener('url');
    };
  }, []);

  let _handleAppStateChange = async (nextAppState) => {
    const url = await Linking.getInitialURL();
    if (url !== null && !initialised) {
      setInitialised(true);
      // console.log('deep link from init app', url);
      const supportedURL =
        'https://shram.com/shared-content?a=1Bbyn67H9vhEqeilEl%2B4Yw%3D%3D';
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        // await Linking.openURL(url);
        // console.log('~~~~~~Tried to check if url can be opened');
      }
    }
  };

  let CustomFallback = ({error, resetError}) => {
    Bugsnag.notify(error);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{marginHorizontal: 20, textAlign: 'center'}}>
          There has been an error in the app we wil fix it soon please restart
          the app.
        </Text>
      </View>
    );
  };

  const checkVersion = async () => {
    console.log('Called ');

    dispatch(
      callApi(
        'FORCEUPDATE',
        URLs.FORCE_UPDATE,
        {
          comm_name: 'ShramikApp',
        },
        (data) => {
          console.log('Verions', data);
          try {
            const value = data.data[0]?.plt_val?.split('#');

            const current_db_version = value[0];
            const allowed_version = value[1];
            //Testing Values
            // const current_db_version = 2;
            // const allowed_version = 2;
            // console.log(
            //   'Version ifn',
            //   current_db_version,
            //   allowed_version,
            //   VersionInfo,
            // );
            if (
              parseFloat(current_db_version || 0, 10) >
              parseFloat(VersionInfo || 0, 10)
            ) {
              if (
                parseFloat(VersionInfo || 0, 10) <
                parseFloat(allowed_version || 0, 10)
              ) {
                setIsMandatory(true);
              }
              setShowPopup(true);
            }
          } catch (err) {
            console.log('Erri s', err);
          }
        },
      ),
    );
  };

  return (
    <>
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <StatusBar
          translucent={false}
          backgroundColor="#4B79D8"
          barStyle="light-content"
        />
        {/* <Navigator /> */}
      </ErrorBoundary>
      {showPopup && (
        <Overlay
          isVisible={showPopup}
          // height={'25%'}
          onBackdropPress={() =>
            isMandatory ? undefined : setShowPopup(false)
          }>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{padding: 10, textAlign: 'center'}}>
              {`${
                !isMandatory
                  ? 'App Update is Available'
                  : "Mandatory App Update is Available. You can't use the app unless you update it."
              }`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'http://play.google.com/store/apps/details?id=com.shram',
                );
                sendBtnClickToAnalytics('Update App');
              }} //Sir told me to write links like this
              activeOpacity={0.7}
              style={{
                padding: 10,
                backgroundColor: '#4B79D8',
                margin: 10,
                alignSelf: 'center',
              }}>
              <Text style={{color: 'white'}}>Update App</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
      )}
    </>
  );
}
function myiOSPromptCallback(permission) {}

export default App;
