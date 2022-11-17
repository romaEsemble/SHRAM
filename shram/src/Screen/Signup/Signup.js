import Button from '@button/Button';
import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Bg from '@icons/mandaleydesign.svg';
import GreenBg from '@icons/mandela_green.svg';
import TermCheck from '@icons/TermCheck';
import localStyles from '@login/LoginStyles';
import {
  NAVIGATION_CONGRATULATION_SCREEN,
  NAVIGATION_LOGIN,
} from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {callApi} from '@redux/CommonDispatch.js';
import {LOGIN, OTP} from '@redux/Types';
import {
  ASYNC_STORAGE_FCM_TOKEN,
  ASYNC_STORAGE_TOKEN,
  ASYNC_STORAGE_USER_ID,
  FCM_TOKEN_ERROR_MSG,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_OTHER,
  TEXT_TYPE,
} from '@resources/Constants';
import {Input as Inputs} from '@rneui/base';
import {
  otpValidation,
  nonEmpty,
  referralCodeValidations,
} from '@resources/Validate';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Login({navigation}) {
  const [check, setCheck] = useState(true);
  const [timer, setTimer] = useState(-1);
  const [isSendVisible, setIsSendVisible] = useState(true);
  const [isReferralVisible, setIsReferralVisible] = useState(false);
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(false);
  const [referralCodeLoading, setReferralCodeLoading] = useState(false);
  const {loginLoading} = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();

  const {
    value: mobile,
    setValue: setMobile,
    bind: mobileBind,
    checkValidation: CheckMobileValidation,
  } = useInput('', INPUT_TYPE_NUMBER);
  const {
    value: referralCode,
    bind: referralCodeBind,
    checkValidation: referralCodeValidation,
  } = useInput(null, INPUT_TYPE_OTHER, referralCodeValidations);
  const {
    value: otp,
    bind: otpBind,
    checkValidation: CheckOtpValidation,
  } = useInput('', INPUT_TYPE_OTHER, otpValidation);

  const termsAndConditions = () => {
    if (check) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  };

  useEffect(() => {
    // console.warn('Timer Value', timer);
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  let getOtp = () => {
    Keyboard.dismiss();

    if (CheckMobileValidation()) {
      return false;
    } else if (!check) {
      showSnackBar(strings?.selectCheckBox, 'error');
      return;
    } else {
      dispatch(
        callApi(
          OTP,
          URLs.SIGN_UP,
          {
            mobile: mobile,
            ref_code: isReferralCodeValid ? referralCode?.toUpperCase() : null,
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

  let getResendOtp = () => {
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
          },
          () => {
            showSnackBar(strings?.otpSent, 'success');
            setTimer(60);
          },
        ),
      );
    }
  };

  const referralCodeValidateApi = async () => {
    Keyboard.dismiss();
    sendBtnClickToAnalytics('Referral Code Applied');
    if (!check) {
      showSnackBar(strings?.selectCheckBox, 'error');
      return;
    }
    if (referralCodeValidation()) {
      return false;
    } else {
      // setReferralCodeLoading(true);
      console.log('Validation', referralCode);
      dispatch(
        callApi(
          'Referral',
          URLs.VALIDATE_REFFERAL_CODE,
          {
            ref_code: referralCode ? referralCode?.toUpperCase() : referralCode,
          },
          async (response) => {
            setIsReferralCodeValid(true);
            showSnackBar(response?.message, 'success');
            console.log('Response', response);
          },
          async (error) => {
            console.log('Error', error);
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
    if (!check) {
      showSnackBar(strings?.selectCheckBox, 'error');
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
            console.warn('Sign up token', data?.token);
            await AsyncStorage.multiSet([
              [ASYNC_STORAGE_TOKEN, data?.token || ''],
              [ASYNC_STORAGE_USER_ID, data?.user_id?.toString() || ''],
            ]);
            navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN);
          },
        ),
      );
    }
  };
  const {unCheckBox, termsView} = localStyles;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{flexGrow: 1}}
        style={styles.scrollView}>
        <View
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: '#fff',
          }}>
          <GreenBg style={{position: 'absolute', top: 15, right: -100}} />
          <Bg
            preserveAspectRatio="none"
            width="100%"
            style={{position: 'absolute', bottom: -300}}
          />

          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={{justifyContent: 'center', flex: 1}}>
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  marginTop: 10,
                }}>
                <Text
                  bold
                  type={TEXT_TYPE.EXTRA_LARGE}
                  style={{color: '#4B79D8'}}>
                  {strings?.register}
                </Text>
              </View>
              <View style={{padding: 10, marginHorizontal: 10}}>
                <Input
                  authInput
                  placeholderTextColor={'#00000029'}
                  text={strings?.mobile}
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
                  onSubmitEditing={debounce(() => getOtp())}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={[
                        termsView,
                        {
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                      onPress={() => termsAndConditions()}>
                      {check ? (
                        <TermCheck height={20} width={20} />
                      ) : (
                        <View style={unCheckBox}></View>
                      )}
                    </TouchableOpacity>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{color: '#3D3D3D', fontSize: 12}}>
                        I am above 18 Year of age
                      </Text>
                    </View>
                  </View>
                  {!isReferralCodeValid && isSendVisible && (
                    <TouchableOpacity
                      style={{marginLeft: 15, justifyContent: 'center'}}
                      onPress={() => setIsReferralVisible(!isReferralVisible)}>
                      {isReferralVisible ? (
                        <Text style={{color: '#4B79D8'}}>
                          Don't have referral code?
                        </Text>
                      ) : (
                        <Text style={{color: '#4B79D8'}}>
                          Have referral code?
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    flex: 0.8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {/* {!isSendVisible && ( */}

                  <View style={{width: '100%'}}>
                    {isReferralVisible && (
                      <View
                        style={{
                          // padding: 10,
                          // marginHorizontal: 20,
                          flexDirection: 'row',
                          // borderWidth: 1,
                          // width: '100%',
                          flex: 1,
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            // alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 25,
                          }}>
                          <Input
                            authInput
                            placeholderTextColor={'#00000029'}
                            text={'Referral Code'}
                            inputStyle={{
                              fontSize: 16,
                              marginHorizontal: 5,
                              color: '#3D3D3D',
                              // flex: 1,
                            }}
                            // onChange={console.log('value', value)}
                            // inputContainerStyle={{
                            //   width: '100%',
                            // }}
                            autoCapitalize={'characters'}
                            editable={isReferralCodeValid ? false : true}
                            maxLength={20}
                            {...referralCodeBind}
                            // keyboardType={'numeric'}
                            secureTextEntry={false}
                            onSubmitEditing={debounce(() =>
                              referralCodeValidateApi(),
                            )}
                          />
                        </View>
                        <Button
                          buttonStyle={{
                            borderRadius: 10,
                            paddingVertical: 10,
                            height: 45,
                          }}
                          full
                          title={'Verify'}
                          loading={referralCodeLoading}
                          disabled={isReferralCodeValid ? true : false}
                          // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
                          onPress={debounce(() => referralCodeValidateApi())}
                        />
                      </View>
                    )}
                  </View>
                </View>
                {isSendVisible && (
                  <View>
                    <Button
                      buttonStyle={{
                        borderRadius: 10,
                        marginTop: 10,
                        alignItems: 'center',
                        height: 45,
                      }}
                      half
                      title={'Send OTP'}
                      loading={loginLoading}
                      disabled={
                        isReferralVisible && !isReferralCodeValid ? true : false
                      }
                      // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
                      onPress={debounce(() => getOtp())}
                    />
                  </View>
                )}

                {timer > 0 ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#3D3D3D',
                      fontSize: 12,
                    }}>
                    You can resend the OTP in {timer} seconds
                  </Text>
                ) : timer === 0 ? (
                  <TouchableOpacity
                    onPress={debounce(() => {
                      getResendOtp();
                      sendBtnClickToAnalytics('RESEND OTP Signup');
                    })}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#4EAF47',
                        fontSize: 12,
                        marginTop: 10,
                        textDecorationLine: 'underline',
                      }}>
                      RESEND OTP
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {/* {!isSendVisible && (
                  <View style={{marginTop: 5, alignItems: 'center'}}>
                    <Text
                      style={{
                        // textAlign: 'center',
                        color: '#3D3D3D',
                        fontSize: 12,
                      }}>
                      Please enter 4 digit OTP received in SMS
                    </Text>
                    <Text
                      style={{
                        // textAlign: 'center',
                        color: '#3D3D3D',
                        fontSize: 12,
                      }}>
                      on above Mobile No.
                    </Text>
                  </View>
                )} */}

                {!isSendVisible && (
                  <View style={{paddingTop: 10}}>
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
                      onSubmitEditing={debounce(() => login())}
                    />
                    {!isSendVisible && (
                      <View style={{paddingBottom: 10, alignItems: 'center'}}>
                        <Text
                          style={{
                            // textAlign: 'center',
                            color: '#3D3D3D',
                            fontSize: 12,
                          }}>
                          Please enter 4 digit OTP received in SMS
                        </Text>
                        <Text
                          style={{
                            // textAlign: 'center',
                            color: '#3D3D3D',
                            fontSize: 12,
                          }}>
                          on above Mobile No.
                        </Text>
                      </View>
                    )}
                    <Button
                      buttonStyle={{borderRadius: 10}}
                      full
                      title={'Proceed'}
                      loading={loginLoading}
                      // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
                      onPress={debounce(() => login())}
                    />
                  </View>
                )}
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
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation?.navigate(NAVIGATION_LOGIN)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#8761F4',
                      fontSize: 14,
                      marginTop: 10,
                    }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // return (
  //   <View style={{flexGrow: 1}}>
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#fff',
  //       }}>
  //       <GreenBg style={{position: 'absolute', top: 15, right: -100}} />
  //       <Bg
  //         preserveAspectRatio="none"
  //         width="100%"
  //         style={{position: 'absolute', bottom: -300}}
  //       />

  //       <KeyboardAvoidingView
  //         style={{flex: 1}}
  //         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
  //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  //         <ScrollView
  //           contentContainerStyle={{
  //             flexGrow: 1,
  //             justifyContent: 'center',
  //           }}
  //           keyboardShouldPersistTaps="always">
  //           <View style={{justifyContent: 'center', flex: 1}}>
  //             <View>
  //               <View
  //                 style={{
  //                   justifyContent: 'center',
  //                   alignItems: 'center',
  //                   paddingVertical: 10,
  //                   marginTop: 10,
  //                 }}>
  //                 <Text
  //                   bold
  //                   type={TEXT_TYPE.EXTRA_LARGE}
  //                   style={{color: '#4B79D8'}}>
  //                   {strings?.register}
  //                 </Text>
  //               </View>
  //               <View style={{padding: 10, marginHorizontal: 10}}>
  //                 <Input
  //                   authInput
  //                   placeholderTextColor={'#00000029'}
  //                   text={strings?.mobile}
  //                   inputStyle={{
  //                     fontSize: 16,
  //                     marginHorizontal: 5,
  //                     color: '#3D3D3D',
  //                   }}
  //                   {...mobileBind}
  //                   onChange={(val) => {
  //                     setMobile(val);
  //                     if (!isSendVisible) {
  //                       setIsSendVisible(true);
  //                     }
  //                     if (timer > -1) {
  //                       setTimer(-1);
  //                     }
  //                   }}
  //                   onSubmitEditing={debounce(() => getOtp())}
  //                 />
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                   }}>
  //                   <View style={{flexDirection: 'row'}}>
  //                     <TouchableOpacity
  //                       style={termsView}
  //                       onPress={() => termsAndConditions()}>
  //                       {check ? (
  //                         <TermCheck height={20} width={20} />
  //                       ) : (
  //                         <View style={unCheckBox}></View>
  //                       )}
  //                     </TouchableOpacity>
  //                     <View style={{alignItems: 'center'}}>
  //                       <Text style={{color: '#3D3D3D', fontSize: 12}}>
  //                         I am above 18 Year of age
  //                       </Text>
  //                     </View>
  //                   </View>
  //                   {!isReferralCodeValid && isSendVisible && (
  //                     <TouchableOpacity
  //                       style={{marginLeft: 15}}
  //                       onPress={() =>
  //                         setIsReferralVisible(!isReferralVisible)
  //                       }>
  //                       {isReferralVisible ? (
  //                         <Text style={{color: '#4B79D8'}}>
  //                           Don't have referral code?
  //                         </Text>
  //                       ) : (
  //                         <Text style={{color: '#4B79D8'}}>
  //                           Have referral code?
  //                         </Text>
  //                       )}
  //                     </TouchableOpacity>
  //                   )}
  //                 </View>
  //                 <View
  //                   style={{
  //                     flex: 0.8,
  //                     justifyContent: 'center',
  //                     alignItems: 'center',
  //                   }}>
  //                   {/* {!isSendVisible && ( */}

  //                   <View style={{width: '100%'}}>
  //                     {isReferralVisible && (
  //                       <View
  //                         style={{
  //                           // padding: 10,
  //                           // marginHorizontal: 20,
  //                           flexDirection: 'row',
  //                           // borderWidth: 1,
  //                           // width: '100%',
  //                           flex: 1,
  //                           justifyContent: 'space-evenly',
  //                           alignItems: 'center',
  //                         }}>
  //                         <View
  //                           style={{
  //                             flex: 1,
  //                             // alignItems: 'center',
  //                             justifyContent: 'center',
  //                             marginTop: 25,
  //                           }}>
  // <Input
  //   authInput
  //   placeholderTextColor={'#00000029'}
  //   text={'Referral Code'}
  //   inputStyle={{
  //     fontSize: 16,
  //     marginHorizontal: 5,
  //     color: '#3D3D3D',
  //     // flex: 1,
  //   }}
  //   // inputContainerStyle={{
  //   //   width: '100%',
  //   // }}
  //   editable={isReferralCodeValid ? false : true}
  //   maxLength={20}
  //   {...referralCodeBind}
  //   // keyboardType={'numeric'}
  //   secureTextEntry={false}
  //   onSubmitEditing={debounce(() =>
  //     referralCodeValidateApi(),
  //   )}
  // />
  //                         </View>
  //                         <Button
  //                           buttonStyle={{
  //                             borderRadius: 10,
  //                             paddingVertical: 10,
  //                             height: 45,
  //                           }}
  //                           full
  //                           title={'Verify'}
  //                           loading={referralCodeLoading}
  //                           disabled={isReferralCodeValid ? true : false}
  //                           // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
  //                           onPress={debounce(() => referralCodeValidateApi())}
  //                         />
  //                       </View>
  //                     )}
  //                   </View>
  //                 </View>
  //                 {isSendVisible && (
  //                   <View>
  //                     <Button
  //                       buttonStyle={{
  //                         borderRadius: 10,
  //                         marginTop: 10,
  //                         alignItems: 'center',
  //                         height: 45,
  //                       }}
  //                       half
  //                       title={'Send OTP'}
  //                       loading={loginLoading}
  //                       disabled={
  //                         isReferralVisible && !isReferralCodeValid
  //                           ? true
  //                           : false
  //                       }
  //                       // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
  //                       onPress={debounce(() => getOtp())}
  //                     />
  //                   </View>
  //                 )}

  //                 {timer > 0 ? (
  //                   <Text
  //                     style={{
  //                       textAlign: 'center',
  //                       color: '#3D3D3D',
  //                       fontSize: 12,
  //                     }}>
  //                     You can resend the OTP in {timer} seconds
  //                   </Text>
  //                 ) : timer === 0 ? (
  //                   <TouchableOpacity onPress={debounce(() => getResendOtp())}>
  //                     <Text
  //                       style={{
  //                         textAlign: 'center',
  //                         color: '#4EAF47',
  //                         fontSize: 12,
  //                         marginTop: 10,
  //                         textDecorationLine: 'underline',
  //                       }}>
  //                       RESEND OTP
  //                     </Text>
  //                   </TouchableOpacity>
  //                 ) : null}

  //                 {!isSendVisible && (
  //                   <View style={{marginTop: 5, alignItems: 'center'}}>
  //                     <Text
  //                       style={{
  //                         // textAlign: 'center',
  //                         color: '#3D3D3D',
  //                         fontSize: 12,
  //                       }}>
  //                       Please enter 4 digit OTP received in SMS
  //                     </Text>
  //                     <Text
  //                       style={{
  //                         // textAlign: 'center',
  //                         color: '#3D3D3D',
  //                         fontSize: 12,
  //                       }}>
  //                       on above Mobile No.
  //                     </Text>
  //                   </View>
  //                 )}

  //                 {!isSendVisible && (
  //                   <View style={{padding: 10, marginHorizontal: 10}}>
  //                     <Input
  //                       authInput
  //                       placeholderTextColor={'#00000029'}
  //                       text={'OTP'}
  //                       inputStyle={{
  //                         fontSize: 16,
  //                         marginHorizontal: 5,
  //                         color: '#3D3D3D',
  //                       }}
  //                       maxLength={4}
  //                       {...otpBind}
  //                       keyboardType={'numeric'}
  //                       secureTextEntry={true}
  //                       onSubmitEditing={debounce(() => login())}
  //                     />
  //                     <Button
  //                       buttonStyle={{borderRadius: 10}}
  //                       full
  //                       title={'Proceed'}
  //                       loading={loginLoading}
  //                       // onPress={() => navigation?.navigate(NAVIGATION_CONGRATULATION_SCREEN)}
  //                       onPress={debounce(() => login())}
  //                     />
  //                   </View>
  //                 )}
  //               </View>

  //               <View
  //                 style={{
  //                   flexDirection: 'row',
  //                   alignItems: 'center',
  //                   justifyContent: 'center',
  //                 }}>
  //                 <Text
  //                   style={{
  //                     textAlign: 'center',
  //                     marginTop: 10,
  //                     color: '#3D3D3D',
  //                     fontSize: 14,
  //                   }}>
  //                   Already have an account?{' '}
  //                 </Text>
  //                 <TouchableOpacity
  //                   onPress={() => navigation?.navigate(NAVIGATION_LOGIN)}>
  //                   <Text
  //                     style={{
  //                       textAlign: 'center',
  //                       color: '#8761F4',
  //                       fontSize: 14,
  //                       marginTop: 10,
  //                     }}>
  //                     Sign In
  //                   </Text>
  //                 </TouchableOpacity>
  //               </View>
  //             </View>
  //           </View>
  //         </ScrollView>
  //       </KeyboardAvoidingView>
  //     </View>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {},
  text: {
    fontSize: 42,
  },
});
