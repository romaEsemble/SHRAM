import Circle from '@circle/Circle';
import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Header from '@header/Header';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import CameraIcon from '@icons/camera';
import CircleFlower from '@icons/circleFlower';
import FillStarIcon from '@icons/fillStarIcon';
import MobileValid from '@icons/mobileValid';
import Next from '@icons/nextIcon.svg';
import StarIcon from '@icons/starIcon';
// import TouchableOpacity from '@touchable/TouchableOpacity';
import TermCheck from '@icons/TermCheck';
import Loader from '@loader/Loader';
import {GetPhotoBaseURL, URLs} from '@networking/Urls';
import localStyles from '@profile/ProfileStyles';
import {useFocusEffect} from '@react-navigation/native';
import {callApi} from '@redux/CommonDispatch.js';
import {PROFILE, PROFILE_IMAGE, PIN_CODE, EDUCATION} from '@redux/Types';
import {
  INPUT_TYPE_OTHER,
  PROFILE_SCREEN,
  KEYBOARD_TYPE_NUMERIC,
} from '@resources/Constants';
import strings from '@resources/Strings';
import {
  nameValidate,
  fullNameValidate,
  addressWithSpaceValidate,
  NumberValidation,
} from '@resources/Validate';
import Text from '@textView/TextView';
import {debounce, showSnackBar} from '@utils/Util';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Button,
  InteractionManager,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Overlay } from '@rneui/base';
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CalendarIcon from '@icons/CalendarIcon.svg';
import {callPinApi} from '@profile/ProfileAction';


{
  /*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */
}
const NewPersonalDetails = (props) => {
  const [visible, setVisible] = useState(false);
  const [gender, setGender] = useState('male');
  const [fromDateTimePickerVisible, setFromDateTimePickerVisible] =
    useState(false);
  const [fromDate, setFromDate] = useState('');

  const [show, setShow] = useState(false);
  const [addressFromApi, setAddressFromApi] = useState([]);
  const [rightLoaderCurrent, setRightLoaderCurrent] = useState(false);

  const [selectedEducation, setSelectedEducation] = useState(false);

  const [isUnsavedData, setIsUnsavedData] = useState(false);

  const {educationData, profileData, profileLoading, getDocumentsData} =
    useSelector((state) => state.ProfileReducer);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
        console.log('Run');
        getUserData();
      });
      // getUserData();
      console.log('is focused PD');
      return () => {
        interactionPromise.cancel();
        console.log('Un focused');
      };
    }, []),
  );

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };
  const getEducationData = async () => {
    await dispatch(
      callApi(
        EDUCATION,
        URLs.PLT_COMMON_DATA,
        {
          comm_name: 'education',
          app_lang: strings?.getLanguage(),
        },
        (data) => {
          console.log(
            'DAta is',
            data,
            profileData?.education,
            profileData?.education == null,
          );
          if (profileData?.education == null) {
            setSelectedEducation(data?.data?.[0].plt_disp_val);
          }
        },
      ),
    );
  };
  const keyExtractor = (item, index) => index.toString();
  const renderItemEducation = ({item, index}) => {
    // console.log('Item is ', item);
    return (
      <TouchableOpacity
        onPress={() => selectData(item.plt_disp_val)}
        style={{
          borderWidth: 1,
          borderColor: '#4B79D8',
          backgroundColor:
            selectedEducation === item.plt_disp_val ? '#4B79D8' : '#fff',
          padding: 10,
          margin: 3,
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontSize: 11,
            color: selectedEducation === item.plt_disp_val ? '#fff' : '#4B79D8',
          }}>
          {item.plt_disp_val}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectData = (index) => {
    console.log('Index', index);
    if (selectedEducation === index) {
    } else {
      setSelectedEducation(index);
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (!isUnsavedData) {
      if (profileData) {
        setFName(profileData.fname);

        if (profileData.dob) {
          setFromDate(profileData.dob);
        }
        if (profileData.gender) setGender(profileData.gender.toLowerCase());

        setPin(profileData.curr_pincode);
        setCurrCity(profileData.curr_city);
        setCurrState(profileData.curr_state);

        getEducationData();
        if (profileData?.education) {
          setSelectedEducation(profileData?.education);
        }
      }
    }
  }, [profileData]);

  useEffect(() => {
    setIsUnsavedData(true);
  }, [
    fName,
    gender,
    fromDate,
    pinCode,
    cityName,
    stateName,
    selectedEducation,
  ]);

  const handleFromDatePicked = (date) => {
    setFromDateTimePickerVisible(false);
    setFromDate(date);
  };

  const {
    value: fName,
    bind: fNameBind,
    checkValidation: CheckFNameValidation,
    setValue: setFName,
    setError: errorFName,
  } = useInput('', INPUT_TYPE_OTHER, fullNameValidate, strings?.fullName);

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

  const renderSingleView = (heading, value, shouldFlex = 0) => {
    return (
      <View style={{flex: shouldFlex ? 1 : 0, paddingRight: 2}}>
        <Text style={{fontWeight: 'bold', fontSize: 12}}>{heading}</Text>
        <Text>{value || '--'}</Text>
      </View>
    );
  };

  const touchableNavigator = (navLink) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate(navLink);
          setVisible(false);
        }}
        style={{
          padding: 10,
          alignItems: 'flex-end',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 12}}>Edit Details</Text>
      </TouchableOpacity>
    );
  };

  const checkedView = (title) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TermCheck height={20} width={20} />
        <Text style={{fontSize: 12}}>{title}</Text>
      </View>
    );
  };
  const unCheckedView = (title) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            borderWidth: 1,
            height: 18,
            width: 18,
            borderColor: '#4B79D8',
            marginRight: 5,
          }}></View>
        <Text style={{fontSize: 12}}>{title}</Text>
      </View>
    );
  };

  const languageRow = (language, stringValue) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 2,
          alignItems: 'center',
        }}>
        <Text style={{flex: 0.2, fontSize: 12, fontWeight: 'bold'}}>
          {language}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flex: 0.8,
          }}>
          <Text style={{fontWeight: 'bold'}}>
            {stringValue?.[0] == 1
              ? checkedView(strings?.speak)
              : unCheckedView(strings?.speak)}
          </Text>
          <Text style={{fontWeight: 'bold'}}>
            {stringValue?.[1] == 1
              ? checkedView(strings?.read)
              : unCheckedView(strings?.read)}

            {/* {stringValue?.[1] == 1 ? strings?.read : null} */}
          </Text>
          <Text style={{fontWeight: 'bold'}}>
            {stringValue?.[2] == 1
              ? checkedView(strings?.write)
              : unCheckedView(strings?.write)}

            {/* {stringValue?.[2] == 1 ? strings?.write : null} */}
          </Text>
        </View>
      </View>
    );
  };

  const overlayForProfile = () => {
    return (
      <View
        style={{
          // marginTop: -10,
          marginRight: 20,
          alignItems: 'flex-end',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 20,
          marginBottom: 3,
        }}>
        <View>
          <Button title={strings?.profileSummary} onPress={toggleOverlay} />
          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            overlayStyle={{
              height: 'auto',
              width: '90%',
              marginVertical: 70,
              borderRadius: 10,
            }}>
            <View
              style={{
                marginVertical: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
              <View>
                <Text>{strings?.profileSummary}</Text>
                <View style={{flexDirection: 'row', marginVertical: 5}}>
                  {renderStar()}
                </View>
              </View>
              <View>
                <Button title={strings?.close} onPress={toggleOverlay} />
              </View>
            </View>
            <ScrollView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Personal Detail</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 5,
                  }}>
                  {renderSingleView(strings?.fullName, profileData?.fname, 1)}
                  {/* {renderSingleView(strings?.firstName, profileData?.fname, 1)}
                  {renderSingleView(strings?.middleName, profileData?.mname, 1)}
                  {renderSingleView(strings?.lastName, profileData?.lname, 1)} */}
                </View>
                <View
                  style={{
                    padding: 5,
                  }}>
                  {renderSingleView('Mobile Number', profileData?.mobile)}
                </View>
                {/* {touchableNavigator('PersonalDetail')} */}
                {touchableNavigator('NewPersonalDetails')}
              </View>

              {/* HealthDetail */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>{strings?.healthDetail}</Text>
                </View>
                <View style={{padding: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}>
                    {renderSingleView(strings?.gender, profileData?.gender)}
                    {renderSingleView(
                      strings?.dob,
                      profileData?.dob
                        ? moment(profileData?.dob).format('DD-MM-YYYY')
                        : '--',
                    )}
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(strings?.height, profileData?.height)}
                    {renderSingleView(strings?.weight, profileData?.weight)}
                    {renderSingleView(strings?.bloodGroup, profileData?.bgroup)}
                  </View> */}
                </View>
                {/* {touchableNavigator('HealthDetail')} */}
                {touchableNavigator('NewPersonalDetails')}
              </View>

              {/* AddressDetail */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Address Detail</Text>
                </View>
                <View style={{padding: 5}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {strings?.currentAddress}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.pincode,
                      profileData?.curr_pincode,
                    )}
                    {renderSingleView(strings?.city, profileData?.curr_city)}
                    {renderSingleView('State', profileData?.curr_state)}
                  </View>
                </View>
                {/* <View style={{padding: 5}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {strings?.permanentAddress}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.pincode,
                      profileData?.perm_pincode,
                    )}
                    {renderSingleView(strings?.city, profileData?.perm_city)}
                    {renderSingleView('State', profileData?.perm_state)}
                  </View>
                </View> */}
                {/* {touchableNavigator('AddressDetail')} */}
                {touchableNavigator('NewPersonalDetails')}
              </View>

              {/* ProfessionalDetail */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Professional Detail</Text>
                </View>
                <View style={{padding: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}>
                    {renderSingleView(strings?.industry, profileData?.industry)}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}>
                    {renderSingleView('Trade', profileData?.trade)}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.experience,
                      (profileData?.exp ? profileData?.exp : '--') + ' Years',
                    )}
                  </View>
                </View>

                {touchableNavigator('ProfessionalDetail')}
              </View>

              {/* SkillDetail */}
              {/* <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Skill Detail</Text>
                </View>
                <View style={{padding: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.industrySkills,
                      profileData?.skill,
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.computerSkills,
                      profileData?.computer_skill == 1 ? 'Yes' : 'No',
                    )}
                  </View>
                </View>
                {touchableNavigator('SkillDetail')}
              </View> */}

              {/* EducationalDetail */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Educational Detail</Text>
                </View>
                <View style={{padding: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}>
                    {renderSingleView(
                      strings?.education,
                      profileData?.education,
                    )}
                  </View>
                  {/* <Text style={{fontWeight: 'bold'}}>Language Detail</Text>
                  {languageRow(strings?.hindi, profileData?.hindi)}
                  {languageRow(strings?.english, profileData?.english)}
                  {languageRow(strings?.marathi, profileData?.marathi)} */}
                </View>
                {/* {touchableNavigator('EducationalDetail')} */}
                {touchableNavigator('NewPersonalDetails')}
              </View>

              {/* Documents */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Document Detail</Text>
                </View>
                <View style={{padding: 5}}>
                  {getDocumentsData?.length == 0 ? (
                    <View>
                      <Text>No Documents Uploaded</Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>{1}</Text>
                      {renderSingleView(
                        strings?.documentType,
                        getDocumentsData?.[0].doc_type,
                      )}
                      {renderSingleView(
                        strings?.documentNumber,
                        getDocumentsData?.[0].doc_no,
                      )}
                    </View>
                  )}
                </View>
                {touchableNavigator('Documents')}
              </View>
            </ScrollView>
          </Overlay>
        </View>
        <TouchableOpacity onPress={debounce(() => savePersonalDetail())}>
          {/* <SaveIcon /> */}
          <Text
            style={{
              backgroundColor: '#ffc003',
              borderRadius: 2,
              padding: 10,
              paddingVertical: 8,
              color: '#FFF',
              fontWeight: 'bold',
            }}>
            Save & Next
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const savePersonalDetail = () => {
    Keyboard.dismiss();
    if (CheckFNameValidation()) {
      return false;
    }
    if (!fName) {
      showSnackBar(strings?.fullNameRequired, 'error');
      return false;
    }
    if (!fromDate) {
      showSnackBar(strings?.addDOB, 'error');
      return false;
    }
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

    console.log('Heloo', {
      fname: fName?.trim(),
      gender: gender,
      dob: fromDate,
      curr_pincode: pinCode,
      curr_city: cityName,
      curr_state: stateName,
      education: selectedEducation,
    });
    // return;
    dispatch(
      callApi(
        PROFILE,
        URLs.NEW_PERSONAL_DETAIL,
        {
          fullname: fName?.trim(),
          gender: gender,
          dob: fromDate,
          curr_pincode: pinCode,
          curr_city: cityName,
          curr_state: stateName,
          education: selectedEducation,
        },
        () => {
          //   props.navigation.navigate('AddressDetail');
          props.navigation.navigate('ProfessionalDetail');
          // getUserData();
        },
      ),
    );
  };

  const uploadProfileImage = (path) => {
    let formData = new FormData();
    formData.append('upl', {
      uri: path,
      name: 'ProfileImage',
      type: 'image/jpeg',
    });
    dispatch(
      callApi(
        PROFILE_IMAGE,
        URLs.UPLOAD_PROFILE_IMG,
        formData,
        () => {
          getUserData();
        },
        () => {},
      ),
    );
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
      useFrontCamera: true,
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          throw Error('Image cannot be greater than 5 mb');
        }
        uploadProfileImage(image.path);
      })
      .catch((err) => {});
  };
  const openGallery = () => {
    ImagePicker.openPicker({
      includeBase64: true,
      includeExif: true,
      mediaType: 'photo',
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          throw Error('Image cannot be greater than 5 mb');
        }
        uploadProfileImage(image.path);
      })
      .catch((err) => {});
  };

  const renderStar = () => {
    {
      /*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */
    }

    let star = [1, 2, 3].map((data, index) => {
      return (
        <View>
          {data <= parseInt(profileData?.profile_star || 0) ? (
            <FillStarIcon
              key={index}
              width={20}
              height={20}
              style={{marginHorizontal: 3}}
            />
          ) : (
            <StarIcon
              key={index}
              width={20}
              height={20}
              style={{marginHorizontal: 3}}
            />
          )}
        </View>
      );
    });
    return star;
  };

  const getArea = async (pin, type = 1) => {
    Keyboard.dismiss();
    dispatch(
      callPinApi(
        PIN_CODE,
        pin,
        (data) => {
          if (data && data.length > 0) {
            if (data.length > 1) {
              setAddressFromApi(data);
              setShow(true);
            } else {
              setCurrCity(data[0].District);
              setCurrState(data[0].State);
              setShow(false);
              SetCityErr('');
              SetStateErr('');
            }
          } else {
            SetPinErr('Pin Code not found');
          }
          setRightLoaderCurrent(false);
        },
        (failData) => {
          SetPinErr('Pin Code not found');
          setRightLoaderCurrent(false);
        },
      ),
    );
  };

  let fNameRef = null;

  const {
    flex1,
    inputContainerStyle,
    inputTextStyle,
    editPicTouchable,
    editPicText,
    personalHeaderMainContainer,
    menuTigerView,
    imageCircleView,
    centerCircle,
    circlePosition,
    innerImageView,
    cameraPosition,
    cameraOptionsView,
    optionsView,
    personalHeaderTextContainer,
    starsView,
    btnView,
    btnIconView,
    personalInputContainer,
    innerContainerMargin,
    backgroundFlowerContainer,
    backgroundFlowerPositions,
    labelTextStyles,
    lastUpdateText,
    userNameText,
    userWorkingText,
  } = localStyles;
  return (
    <MenuProvider>
      {/* <KeyboardAvoidingView
          keyboardVerticalOffset={20}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
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
          <Text
            style={{
              flex: 1,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}
          />
          {/*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */}
          <TouchableOpacity
            // onPress={() => props.navigation.navigate('AddressDetail')}
            onPress={() => props.navigation.navigate('ProfessionalDetail')}
            style={{padding: 5}}>
            <Next />
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={profileLoading} />
      {/* <ScrollView> */}
      <View style={[personalHeaderMainContainer]}>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-around',
            paddingHorizontal: 15,
          }}>
          <View style={{marginRight: 20, paddingTop: 10}}>
            <Menu>
              <MenuTrigger style={menuTigerView}>
                <View style={imageCircleView}>
                  <View style={centerCircle}>
                    <CircleFlower
                      style={circlePosition}
                      width={100}
                      height={100}
                    />
                    <Circle
                      type={'ProfileCircle'}
                      circleColor={'#FFC003'}
                      svg={
                        <FastImage
                          style={[
                            innerImageView,
                            {
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              marginTop: 5,
                              alignItems: 'center',
                            },
                          ]}
                          source={
                            profileData?.pic
                              ? {
                                  uri: GetPhotoBaseURL() + profileData?.pic,
                                  priority: FastImage.priority.normal,
                                }
                              : require('@icons/Image.png')
                          }
                        />
                      }
                    />
                  </View>
                  <CameraIcon style={cameraPosition} width={25} height={25} />
                </View>
              </MenuTrigger>

              <MenuOptions optionsContainerStyle={cameraOptionsView}>
                <MenuOption
                  optionsContainerStyle={optionsView}
                  onSelect={() => openCamera()}>
                  <View style={editPicTouchable}>
                    <Text style={editPicText}>{strings?.takeFromCamera}</Text>
                  </View>
                </MenuOption>
                <MenuOption
                  optionsContainerStyle={optionsView}
                  onSelect={() => openGallery()}>
                  <View style={editPicTouchable}>
                    <Text style={editPicText}>{strings?.selectFromPhone}</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View style={personalHeaderTextContainer}>
            <Text style={lastUpdateText}>
              {strings?.lastUpdated}{' '}
              {moment(profileData?.updatedAt).format('DD-MM-YYYY') || '-'}
            </Text>
            {/* {!(profileData?.fname && profileData?.lname) ? ( */}
            {!profileData?.fname ? (
              <Text style={userNameText}>{`Welcome User`}</Text>
            ) : (
              <Text style={userNameText}>
                {/* {`Welcome ${
                profileData?.fname || ''
              } ${profileData?.mname || ''} ${profileData?.lname || ''}`} */}
                {`Welcome ${profileData?.fname || ''}`}
              </Text>
            )}
            <View style={[starsView, {paddingHorizontal: 0}]}>
              {renderStar()}
            </View>
          </View>
        </View>
        {overlayForProfile()}
      </View>
      <ScrollView>
        <View style={personalInputContainer}>
          <View style={innerContainerMargin}>
            <View style={backgroundFlowerContainer}>
              <BackgroundFlowerIcon style={backgroundFlowerPositions} />
            </View>

            <Text style={labelTextStyles}>{strings?.mobile}</Text>
            <Input
              inputContainerStyle={inputContainerStyle}
              inputStyle={inputTextStyle}
              value={profileData?.mobile}
              editable={false}
              rightIcon={<MobileValid style={innerContainerMargin} />}
            />
            <Text style={labelTextStyles}>{strings?.fullName}</Text>
            <Input
              inputContainerStyle={inputContainerStyle}
              inputStyle={inputTextStyle}
              maxLength={50}
              {...fNameBind}
              onSubmitEditing={() => fNameRef?.focus()}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    // marginVertical: 5,
                    padding: 5,
                    paddingLeft: 0,
                    alignItems: 'center',
                    width: '20%',
                  }}>
                  <Text
                    style={{
                      color: '#707070',
                      fontSize: 14,
                    }}>
                    {strings?.gender}*
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setGender('male')}
                  style={{
                    marginHorizontal: 5,
                    borderWidth: 1,
                    borderColor: '#4B79D8',
                    padding: 10,
                    margin: 3,
                    borderRadius: 5,
                    backgroundColor: gender === 'male' ? '#4B79D8' : null,
                  }}>
                  <Text
                    style={{
                      color: gender === 'male' ? '#fff' : '#4B79D8',
                      textAlign: 'center',
                    }}>
                    {'Male'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('female')}
                  style={{
                    marginHorizontal: 5,
                    backgroundColor: gender === 'female' ? '#4B79D8' : null,
                    borderWidth: 1,
                    borderColor: '#4B79D8',
                    padding: 10,
                    margin: 3,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: gender === 'female' ? '#fff' : '#4B79D8',
                      textAlign: 'center',
                    }}>
                    {'Female'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('other')}
                  style={{
                    marginHorizontal: 5,
                    backgroundColor: gender === 'other' ? '#4B79D8' : null,
                    borderWidth: 1,
                    borderColor: '#4B79D8',
                    padding: 10,
                    margin: 3,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: gender === 'other' ? '#fff' : '#4B79D8',
                      textAlign: 'center',
                    }}>
                    {'Other'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginVertical: 5,
                padding: 5,
              }}>
              <View
                style={{
                  marginVertical: 5,
                  padding: 5,
                  paddingLeft: 0,
                  width: '20%',
                }}>
                <Text style={{color: '#707070', fontSize: 14}}>
                  {strings?.dob}*
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 10,
                      borderColor: '#4B79D8',
                      marginRight: 10,
                      height: 50,
                      width: 60,
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {fromDate ? moment(fromDate).format('DD') : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 10,
                      borderColor: '#4B79D8',
                      marginRight: 10,
                      height: 50,
                      width: 60,
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {fromDate ? moment(fromDate).format('MM') : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 10,
                      borderColor: '#4B79D8',
                      marginRight: 10,
                      height: 50,
                      width: 60,
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {fromDate ? moment(fromDate).format('YYYY') : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <DateTimePicker
                isVisible={fromDateTimePickerVisible}
                onConfirm={handleFromDatePicked}
                maximumDate={new Date(moment().subtract(18, 'years'))}
                onCancel={() => {
                  setFromDateTimePickerVisible(false);
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  setFromDateTimePickerVisible(true);
                }}
                style={{
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 10,
                  borderColor: '#4B79D8',
                  backgroundColor: '#4B79D8',
                  marginRight: 10,
                  height: 50,
                  width: 60,
                }}>
                <CalendarIcon
                  width={25}
                  height={25}
                  style={{alignSelf: 'center'}}
                  fill={'#fff'}
                />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, backgroundColor: '#00000000'}}>
              <View style={{}}>
                <Text bold style={{margin: 5, color: '#707070', fontSize: 18}}>
                  {strings?.address}
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
                    SetPinErr('');
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
                    keyExtractor={(item, index) =>
                      'addressInfo' + item?.Pincode
                    }
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
              </View>
            </View>
            <Text bold style={{margin: 5, color: '#707070', fontSize: 18}}>
              {strings?.education}
            </Text>
            <View>
              {educationData.length ? (
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    padding: 5,
                  }}>
                  <FlatList
                    horizontal
                    data={educationData}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                    // numColumns={educationData.length}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItemEducation}
                  />
                </View>
              ) : (
                <View></View>
              )}
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
              borderWidth: 2,
            }}
            renderItem={({index}) => (
              <View
                style={
                  index === 0
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
    </MenuProvider>
  );
};

export default NewPersonalDetails;
