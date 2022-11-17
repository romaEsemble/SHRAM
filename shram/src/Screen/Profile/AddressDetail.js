import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Header from '@header/Header';
import Back from '@icons/backArrow.svg';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import Next from '@icons/nextIcon.svg';
import TermCheck from '@icons/TermCheck';
import Loader from '@loader/Loader';
import {URLs} from '@networking/Urls';
import {callPinApi} from '@profile/ProfileAction';
import localStyles from '@profile/ProfileStyles';
import ProfileHerder from '@profileHerder/ProfileHerder';
import {callApi} from '@redux/CommonDispatch.js';
import {PIN_CODE, PROFILE} from '@redux/Types';
import {
  INPUT_TYPE_OTHER,
  KEYBOARD_TYPE_NUMERIC,
  PROFILE_SCREEN,
} from '@resources/Constants';
import {addressWithSpaceValidate, NumberValidation} from '@resources/Validate';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import strings from '@resources/Strings';

export default function AddressDetail(props) {
  const [check, setCheck] = useState(false);
  const [show, setShow] = useState(false);
  const [showPer, setShowPer] = useState(false);
  const [addressFromApi, setAddressFromApi] = useState([]);
  const [perAddressFromApi, setPerAddressFromApi] = useState([]);
  const [editable, setEditable] = useState(false);
  const [rightLoaderCurrent, setRightLoaderCurrent] = useState(false);
  const [rightLoaderPermanent, setRightLoaderPermanent] = useState(false);

  const {profileData, profileLoading, getDocumentsData} = useSelector(
    (state) => state.ProfileReducer,
  );
  const dispatch = useDispatch();

  const useMount = (func) => useEffect(() => func(), []);

  // useMount(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(
  //     getUserData(),
  //   );
  //   return () => interactionPromise.cancel();
  // });
  useFocusEffect(
    React.useCallback(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
        console.log('Run', check);
        getUserData();
      });
      // getUserData();
      console.log('is focused AD');
      return () => {
        interactionPromise.cancel();
        console.log('Un focused Addreess');
      };
      // return () => console.log('Un focused');
    }, []),
    // React.useCallback(() => {
    //   getUserData();
    //   // console.log('Focued AD');
    //   return () => console.log('Un focused Addreess');
    // }, []),
  );

  // useEffect(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(() => {
  //     getUserData();
  //   });
  //   return () => interactionPromise.cancel();
  // }, []);

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (profileData) {
        setPin(profileData.curr_pincode);
        setCurrCity(profileData.curr_city);
        setCurrState(profileData.curr_state);
        setPermanentPin(profileData.perm_pincode);
        setPerCity(profileData.perm_city);
        setPerState(profileData.perm_state);
      }
      console.log(
        'Check out ',
        profileData?.curr_pincode,
        profileData?.perm_pincode,
        profileData?.curr_pincode == profileData?.perm_pincode,
      );
      if (profileData?.curr_pincode && profileData?.perm_pincode) {
        if (profileData?.curr_pincode == profileData?.perm_pincode) {
          console.log(
            'Check in',
            profileData?.curr_pincode,
            profileData?.perm_pincode,
          );
          setCheck(true);
          setEditable(false);
        }
      }
    });
    return () => interactionPromise.cancel();
  }, [profileData]);

  const {
    value: pinCode,
    setValue: setPin,
    bind: pinCodeBind,
    setError: SetPinErr,
    checkValidation: CheckPinCodeValidation,
  } = useInput('', INPUT_TYPE_OTHER, NumberValidation, 'PinCode');
  const {
    value: cityName,
    setValue: setCurrCity,
    bind: cityNameBind,
    setError: SetCityErr,
    checkValidation: CheckCityNameValidation,
  } = useInput('', INPUT_TYPE_OTHER, addressWithSpaceValidate, 'City Name');
  const {
    value: stateName,
    setValue: setCurrState,
    bind: stateNameBind,
    setError: SetStateErr,
    checkValidation: CheckStateNameValidation,
  } = useInput('', INPUT_TYPE_OTHER, addressWithSpaceValidate, 'State Name');

  const {
    value: permanentPinCode,
    setValue: setPermanentPin,
    bind: permanentPinCodeBind,
    setError: SetPermanentErr,
    checkValidation: CheckPermanentPinCodeValidation,
  } = useInput('', INPUT_TYPE_OTHER, NumberValidation, 'PinCode');
  const {
    value: permanentCityName,
    setValue: setPerCity,
    setError: SetPerCityErr,
    bind: permanentCityNameBind,
    checkValidation: CheckPermanentCityNameValidation,
  } = useInput('', INPUT_TYPE_OTHER, addressWithSpaceValidate, 'City Name');
  const {
    value: permanentStateName,
    setValue: setPerState,
    setError: SetPerStateErr,
    bind: permanentStateNameBind,
    checkValidation: CheckPermanentStateNameValidation,
  } = useInput('', INPUT_TYPE_OTHER, addressWithSpaceValidate, 'State Name');

  const getArea = async (pin, type = 1) => {
    Keyboard.dismiss();
    dispatch(
      callPinApi(
        PIN_CODE,
        pin,
        (data) => {
          if (data && data.length > 0) {
            if (data.length > 1) {
              if (type === 1) {
                setAddressFromApi(data);
                setShow(true);
              } else {
                setShowPer(true);
                setPerAddressFromApi(data);
              }
            } else {
              if (type === 1) {
                setCurrCity(data[0].District);
                setCurrState(data[0].State);
                setShow(false);
                SetCityErr('');
                SetStateErr('');
              } else {
                setPerCity(data[0].District);
                setPerState(data[0].State);
                setShowPer(false);
                SetPerCityErr('');
                SetPerStateErr('');
              }
            }
          } else {
            if (type === 1) {
              SetPinErr('Pin Code not found');
            } else {
              SetPermanentErr('Pin Code not found');
            }
          }
          type === 1
            ? setRightLoaderCurrent(false)
            : setRightLoaderPermanent(false);
        },
        (failData) => {
          if (type === 1) {
            SetPinErr('Pin Code not found');
            setRightLoaderCurrent(false);
          } else {
            SetPermanentErr('Pin Code not found');
            setRightLoaderPermanent(false);
          }
        },
      ),
    );
  };

  const submit = () => {
    if (!pinCode) {
      showSnackBar(strings?.pincodeRequired, 'error');
      return false;
    } else if (!cityName) {
      showSnackBar(strings?.cityRequired, 'error');
      return false;
    } else if (!stateName) {
      showSnackBar(strings?.stateRequired, 'error');
      return false;
    } else if (CheckPinCodeValidation()) return false;
    else if (CheckCityNameValidation()) return false;
    else if (CheckStateNameValidation()) return false;
    if (!check) {
      if (!permanentPinCode) {
        showSnackBar(strings?.permanentPincodeRequired, 'error');
        return false;
      } else if (!permanentCityName) {
        showSnackBar(strings?.permanentCityRequired, 'error');
        return false;
      } else if (!permanentStateName) {
        showSnackBar(strings?.permanentStateRequired, 'error');
        return false;
      } else if (CheckPermanentPinCodeValidation()) return false;
      else if (CheckPermanentCityNameValidation()) return false;
      else if (CheckPermanentStateNameValidation()) return false;
    }

    let reqData = {
      curr_pincode: pinCode,
      curr_city: cityName,
      curr_state: stateName,
      perm_pincode: pinCode,
      perm_city: cityName,
      perm_state: stateName,
    };
    if (!check) {
      console.warn('PPC', permanentPinCode);
      reqData.perm_pincode = permanentPinCode;
      reqData.perm_city = permanentCityName;
      reqData.perm_state = permanentStateName;
    }
    dispatch(
      callApi(PROFILE, URLs.ADDRESS_DETAIL, reqData, () => {
        // getUserData();
        props.navigation.navigate('ProfessionalDetail');
      }),
    );
  };

  const checkCurrAddAsPermanentAdd = () => {
    console.log('CHeck perma');
    if (check) {
      setCheck(false);
      setPermanentPin('');
      setPerCity('');
      setPerState('');
      setEditable(true);
    } else {
      setCheck(true);
      setPermanentPin(pinCode);
      setPerCity(cityName);
      setPerState(stateName);
      setEditable(false);
    }
  };

  const {
    inputContainerStyle,
    inputTextStyle,
    unCheckBox,
    editPicTouchable,
    editPicText,
    termsView,
    unCheckBoxAddress,
  } = localStyles;
  return (
    <>
      <Header showDrawer />
      <View style={{backgroundColor: '#4B79D8', height: 40}}>
        <View
          style={{
            alignItems: 'center',
            marginTop: 5,
            flexDirection: 'row',
            marginHorizontal: 10,
          }}>
          <Text
            style={{
              width: '100%',
              position: 'absolute',
              alignSelf: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}>
            PROFILE
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('PersonalDetail')}
            style={{padding: 5}}>
            <Back />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ProfessionalDetail')}
            style={{padding: 5}}>
            <Next />
          </TouchableOpacity>
        </View>
      </View>

      <Loader loading={profileLoading} />
      <ScrollView>
        <ProfileHerder
          profileData={profileData}
          getDocumentsData={getDocumentsData}
          onPress={() => submit()}
        />
        <View style={{alignItems: 'flex-end'}}>
          <BackgroundFlowerIcon style={{position: 'absolute', zIndex: -9}} />
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 1, backgroundColor: '#00000000'}}>
            <View style={{margin: 10}}>
              <Text bold style={{margin: 5, color: '#707070', fontSize: 18}}>
                {strings?.address}
              </Text>
              <Text style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                {strings?.currentAddress}
              </Text>
              <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                Pin Code*
              </Text>
              <Input
                inputContainerStyle={inputContainerStyle}
                inputStyle={inputTextStyle}
                rightIcon={
                  rightLoaderCurrent ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : undefined
                }
                // style={{borderWidth: 3}}
                keyboardType={KEYBOARD_TYPE_NUMERIC}
                maxLength={6}
                {...pinCodeBind}
                onChange={(val) => {
                  setPin(val);
                  setCurrCity('');
                  setCurrState('');
                  setCheck(false);
                  SetPinErr('');
                  setPermanentPin('');
                  setPerCity('');
                  setPerState('');
                  setEditable(true);
                  if (val.length === 6) {
                    setRightLoaderCurrent(true);
                    getArea(val);
                  }
                }}
              />

              {show ? (
                <FlatList
                  keyboardShouldPersistTaps="always"
                  style={{
                    marginTop: -25,
                    backgroundColor: '#fff',
                    elevation: 4,
                    zIndex: 9,
                  }}
                  keyExtractor={(item, index) => 'addressInfo' + item?.Pincode}
                  data={addressFromApi}
                  showsVerticalIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          borderBottom: 0.5,
                          padding: 10,
                        }}>
                        <TouchableOpacity
                          style={{}}
                          onPress={() => {
                            setCurrCity(item.District);
                            setCurrState(item.State);
                            setShow(false);
                            SetCityErr('');
                            SetStateErr('');
                          }}>
                          <Text style={editPicText}>
                            {`${item.Name}, ${item.District}, ${item.Pincode}`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              ) : (
                <View></View>
              )}

              <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                {strings?.city}*
              </Text>
              <Input
                inputContainerStyle={inputContainerStyle}
                inputStyle={inputTextStyle}
                {...cityNameBind}
                editable={false}
              />
              <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                {strings?.state}*
              </Text>
              <Input
                inputContainerStyle={inputContainerStyle}
                inputStyle={inputTextStyle}
                {...stateNameBind}
                editable={false}
              />
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                PERMANENT
              </Text>
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => checkCurrAddAsPermanentAdd()}>
                  <TouchableOpacity
                    style={termsView}
                    onPress={() => checkCurrAddAsPermanentAdd()}>
                    {check ? (
                      <TermCheck height={20} width={20} />
                    ) : (
                      <View style={unCheckBoxAddress}></View>
                    )}
                  </TouchableOpacity>
                  <Text style={{color: '#9F9F9F', fontSize: 12}}>
                    {strings?.permanentAddressSameAsAbove}
                  </Text>
                </TouchableOpacity>
              </View>

              <>
                <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                  Pin Code*
                </Text>
                <Input
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={inputTextStyle}
                  maxLength={6}
                  editable={editable}
                  rightIcon={
                    rightLoaderPermanent ? (
                      <ActivityIndicator color="#000" size="small" />
                    ) : undefined
                  }
                  keyboardType={KEYBOARD_TYPE_NUMERIC}
                  {...permanentPinCodeBind}
                  onChange={(val) => {
                    setPermanentPin(val);
                    setPerCity('');
                    setPerState('');
                    SetPermanentErr('');
                    if (editable) {
                      if (val.length === 6) {
                        setRightLoaderPermanent(true);
                        getArea(val, 2);
                      }
                    }
                  }}
                />
                {showPer ? (
                  <FlatList
                    keyboardShouldPersistTaps="always"
                    style={{
                      marginTop: -25,
                      backgroundColor: '#fff',
                      elevation: 4,
                      zIndex: 9,
                    }}
                    keyExtractor={(item, index) => 'pincodeList' + index}
                    data={perAddressFromApi}
                    showsVerticalIndicator={false}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          style={{
                            borderBottom: 0.5,
                            padding: 10,
                          }}>
                          <TouchableOpacity
                            style={{margin: 0}}
                            onPress={() => {
                              setPerCity(item.District);
                              setPerState(item.State);
                              setShowPer(false);
                              SetPerCityErr('');
                              SetPerStateErr('');
                            }}>
                            <Text style={editPicText}>
                              {`${item.Name}, ${item.District}, ${item.Pincode}`}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <View></View>
                )}

                <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                  {strings?.city}*
                </Text>
                <Input
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={inputTextStyle}
                  {...permanentCityNameBind}
                  editable={editable}
                />
                <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                  {strings?.state}*
                </Text>
                <Input
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={inputTextStyle}
                  {...permanentStateNameBind}
                  editable={editable}
                />
              </>
            </View>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <FlatList
            keyExtractor={(item, index) => 'onboarding_' + index}
            data={PROFILE_SCREEN}
            horizontal
            contentContainerStyle={{
              justifyContent: 'center',
              marginBottom: 10,
            }}
            renderItem={({index}) => (
              <View
                style={
                  index === 1
                    ? {
                        width: 15,
                        height: 15,
                        borderRadius: 7,
                        backgroundColor: '#FFC003',
                        borderWidth: 1,
                        borderColor: '#FFC003',
                        marginHorizontal: 8,
                      }
                    : {
                        width: 15,
                        height: 15,
                        borderRadius: 7,
                        borderWidth: 1,
                        borderColor: '#FFC003',
                        backgroundColor: '#00000000',
                        marginHorizontal: 8,
                      }
                }
              />
            )}
          />
        </View>
      </ScrollView>

      {/* </KeyboardAvoidingView> */}
    </>
  );
}
