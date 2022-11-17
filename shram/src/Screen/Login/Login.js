import Button from '@button/Button';
import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Bg from '@icons/mandaleydesign.svg';
import GreenBg from '@icons/mandela_green.svg';
import {NAVIGATION_SIGNUP} from '@navigation/NavigationKeys';
import {CURRENT_API_ENVIRONMENT, URLs, ENV_STAGING} from '@networking/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {callApi} from '@redux/CommonDispatch.js';
import {LOGIN, OTP} from '@redux/Types';
import {
  ASYNC_STORAGE_FCM_TOKEN,
  ASYNC_STORAGE_TOKEN,
  ASYNC_STORAGE_USER_ID,
  ASYNC_STORAGE_APP_LANGUAGE,
  FCM_TOKEN_ERROR_MSG,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_OTHER,
  TEXT_TYPE,
} from '@resources/Constants';
import {otpValidation} from '@resources/Validate';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Login({navigation}) {
  // ExtraDetails to be sent with app login
  let appVersion = DeviceInfo.getVersion();
  let brand = DeviceInfo.getBrand();
  let systemVersion = DeviceInfo.getSystemVersion();
  let systemName = DeviceInfo.getSystemName();
  let ram = null;
  DeviceInfo.getTotalMemory().then((totalMemory) => {
    ram = (totalMemory / 1073741824).toFixed(2);
  });
  let batteryPercentage = null;
  DeviceInfo.getBatteryLevel().then((batteryLevel) => {
    batteryPercentage = batteryLevel * 100;
  });
  let freeStorage = null;
  DeviceInfo.getFreeDiskStorage().then((freeDiskStorage) => {
    freeStorage = (freeDiskStorage / 1073741824).toFixed(2);
  });
  // console.log('Detail', appVersion, brand, systemVersion);

  const [timer, setTimer] = useState(-1);
  const [isSendVisible, setIsSendVisible] = useState(true);
  const {loginLoading} = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();

  const {
    value: mobile,
    setValue: setMobile,
    bind: mobileBind,
    checkValidation: CheckMobileValidation,
  } = useInput('', INPUT_TYPE_NUMBER);

  const {
    value: otp,
    bind: otpBind,
    checkValidation: CheckOtpValidation,
  } = useInput('', INPUT_TYPE_OTHER, otpValidation);

  useEffect(() => {
    // console.warn('Timer Value', timer);
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  let getOtp = () => {
    console.log('Data is', {
      envinfo:
        CURRENT_API_ENVIRONMENT === ENV_STAGING ? 'TEST#KHOJ' : 'PROD#KHOJ',
      versioninfo: `APP#${appVersion}`,
      otherinfo: {
        brand,
        systemVersion,
        systemName,
        ram,
        batteryPercentage,
        freeStorage,
      },
    });
    Keyboard.dismiss();
    if (CheckMobileValidation()) {
      return false;
    } else {
      dispatch(
        callApi(
          OTP,
          URLs.FORGOT_PWD,
          {
            mobile: mobile,
            envinfo:
              CURRENT_API_ENVIRONMENT === ENV_STAGING
                ? 'TEST#KHOJ'
                : 'PROD#KHOJ',
            versioninfo: `APP#${appVersion}`,
            otherinfo: JSON.stringify({
              brand,
              systemVersion,
              systemName,
              ram,
              batteryPercentage,
              freeStorage,
            }),
          },
          () => {
            showSnackBar(strings?.otpSent, 'success');
            setIsSendVisible(false);
            setTimer(60);
          },
        ),
      );
    }
  };

  const login = async () => {
    Keyboard.dismiss();
    if (timer < 0) {
      showSnackBar(strings?.requestOtpFirst, 'error');
      return;
    }
    if (CheckMobileValidation() || CheckOtpValidation()) {
      return false;
    } else {
      let fcm_token = await AsyncStorage.getItem(ASYNC_STORAGE_FCM_TOKEN);
      dispatch(
        callApi(
          LOGIN,
          URLs.LOGIN_USER,
          {
            mobile,
            pin: otp,
            fcm_token: fcm_token || FCM_TOKEN_ERROR_MSG,
          },
          async (response) => {
            const {data} = response;
            console.log('default app language', data?.app_lang);
            await AsyncStorage.multiSet([
              [ASYNC_STORAGE_TOKEN, data?.token || ''],
              [ASYNC_STORAGE_USER_ID, data?.user_id?.toString() || ''],
              [ASYNC_STORAGE_APP_LANGUAGE, data?.app_lang || ''],
            ]);
            console.warn('SetToken', data?.token);
            dispatch({
              type: 'SetToken',
              payload: {
                token: data?.token,
              },
            });
          },
        ),
      );
    }
  };

  return (
    <>
      <View
        style={{
          flexGrow: 1,
          backgroundColor: '#fff',
        }}>
        <GreenBg style={{position: 'absolute', top: 15, right: -100}} />
        <Bg
          preserveAspectRatio="none"
          width="100%"
          style={{position: 'absolute', bottom: -300}}
        />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="always">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                // alignItems: 'center',
              }}>
              <View
                style={{
                  // flex: 1,
                  justifyContent: 'center',
                  // alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 5,
                    marginTop: 10,
                  }}>
                  <Text
                    bold
                    type={TEXT_TYPE.EXTRA_LARGE}
                    style={{color: '#4B79D8'}}>
                    LOGIN
                  </Text>
                </View>
                <View style={{flex: 1, marginVertical: 10}}>
                  {/* <ScrollView> */}
                  <View style={{padding: 10, marginHorizontal: 10}}>
                    <Input
                      authInput
                      placeholderTextColor={'#00000029'}
                      text={strings?.mobile}
                      onSubmitEditing={debounce(() => getOtp())}
                      inputStyle={{
                        fontSize: 16,
                        marginHorizontal: 5,
                        color: '#3D3D3D',
                      }}
                      {...mobileBind}
                      onChange={(val) => {
                        setMobile(val);
                        if (!isSendVisible) {
                          setIsSendVisible(true);
                        }
                        if (timer > -1) {
                          setTimer(-1);
                        }
                      }}
                    />
                    {isSendVisible && (
                      <Button
                        buttonStyle={{borderRadius: 10}}
                        half
                        title={'Send OTP'}
                        loading={loginLoading}
                        // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
                        onPress={debounce(() => getOtp())}
                      />
                    )}
                  </View>
                  {timer > 0 ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#3D3D3D',
                        fontSize: 12,
                        marginBottom: 10,
                      }}>
                      You can resend the OTP in {timer} seconds
                    </Text>
                  ) : timer === 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        getOtp();
                        sendBtnClickToAnalytics('Resend Otp');
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#4EAF47',
                          fontSize: 12,
                          marginTop: 10,
                          textDecorationLine: 'underline',
                          marginBottom: 5,
                        }}>
                        RESEND OTP
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <View
                    style={{
                      flex: 0.8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* {!isSendVisible && (
                      <>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#3D3D3D',
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          Please enter 4 digit OTP received in SMS
                        </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#3D3D3D',
                            fontSize: 12,
                          }}>
                          on above Mobile No.
                        </Text>
                      </>
                    )} */}
                    {!isSendVisible ? (
                      <View style={{padding: 10, marginHorizontal: 10}}>
                        <Input
                          authInput
                          placeholderTextColor={'#00000029'}
                          text={'OTP'}
                          inputStyle={{
                            fontSize: 16,
                            marginHorizontal: 5,
                            color: '#3D3D3D',
                          }}
                          maxLength={4}
                          {...otpBind}
                          keyboardType={'numeric'}
                          secureTextEntry={true}
                          disabled={isSendVisible}
                          onSubmitEditing={debounce(() => login())}
                        />
                        {!isSendVisible && (
                          <View style={{marginBottom: 10}}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: '#3D3D3D',
                                fontSize: 12,
                                marginTop: 5,
                              }}>
                              Please enter 4 digit OTP received in SMS
                            </Text>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: '#3D3D3D',
                                fontSize: 12,
                              }}>
                              on above Mobile No.
                            </Text>
                          </View>
                        )}
                        {/* </KeyboardAvoidingView> */}
                        <Button
                          buttonStyle={{borderRadius: 10}}
                          full
                          title={'Proceed'}
                          loading={loginLoading}
                          // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
                          onPress={debounce(() => login())}
                        />
                      </View>
                    ) : null}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginTop: 10,
                        color: '#3D3D3D',
                        fontSize: 14,
                      }}>
                      Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation?.navigate(NAVIGATION_SIGNUP);
                        sendBtnClickToAnalytics(
                          `Don't have an account? Sign up`,
                        );
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#8761F4',
                          fontSize: 14,
                          marginTop: 10,
                        }}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* </KeyboardAvoidingView> */}
                  {/* </ScrollView> */}
                </View>
              </View>

              <View
                style={{
                  // position: 'absolute',
                  // left: 5,
                  // right: 5,
                  // bottom: 5,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignItems: 'flex-end',
                    textAlign: 'center',
                    marginTop: 10,
                    color: '#3D3D3D',
                    fontSize: 14,
                  }}>
                  Version {DeviceInfo.getVersion()}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
