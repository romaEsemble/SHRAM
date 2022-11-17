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
import {PROFILE, PROFILE_IMAGE} from '@redux/Types';
import {INPUT_TYPE_OTHER, PROFILE_SCREEN} from '@resources/Constants';
import strings from '@resources/Strings';
import {nameValidate} from '@resources/Validate';
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

export default function PersonalDetail(props) {
  const [imagePath, setImagePath] = useState('');
  const [visible, setVisible] = useState(false);

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
  // useEffect(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(() => {
  //     getUserData();
  //   });
  //   return () => interactionPromise.cancel();
  // }, []);

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
      // return () => console.log('Un focused');
    }, []),
  );

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (profileData) {
      setFName(profileData.fname);
      setMName(profileData.mname);
      setLName(profileData.lname);
    }
  }, [profileData]);

  const {
    value: fName,
    bind: fNameBind,
    checkValidation: CheckFNameValidation,
    setValue: setFName,
    setError: errorFName,
  } = useInput('', INPUT_TYPE_OTHER, nameValidate, strings?.firstName);
  const {
    value: mName,
    bind: mNameBind,
    checkValidation: CheckMNameValidation,
    setValue: setMName,
    setError: errorMName,
  } = useInput('', INPUT_TYPE_OTHER, nameValidate, strings?.middleName);
  const {
    value: lName,
    bind: lNameBind,
    checkValidation: CheckLNameValidation,
    setValue: setLName,
    setError: errorLName,
  } = useInput('', INPUT_TYPE_OTHER, nameValidate, strings?.lastName);

  const renderName = async () => {
    const user_name = await AsyncStorage.getItem(ASYNC_STORAGE_USER_NAME);
    return JSON.parse(user_name) || 'Welcome User';
  };

  const renderImage = async () => {
    const image = await AsyncStorage.getItem(ASYNC_STORAGE_IMAGE);
    return JSON.parse(image)
      ? {uri: JSON.parse(image)}
      : require('@icons/Image.png');
  };

  const renderSingleView = (heading, value) => {
    return (
      <View>
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
                  {renderSingleView(strings?.firstName, profileData?.fname)}
                  {renderSingleView(strings?.middleName, profileData?.mname)}
                  {renderSingleView(strings?.lastName, profileData?.lname)}
                </View>
                <View
                  style={{
                    padding: 5,
                  }}>
                  {renderSingleView('Mobile Number', profileData?.mobile)}
                </View>
                {touchableNavigator('PersonalDetail')}
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
                <View style={{padding: 5}}>
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
                </View>
                {touchableNavigator('AddressDetail')}
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
              <View
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

                    {/* {renderSingleView('Industry Skills', profileData?.skill)}
                      {renderSingleView(
                        strings?.computerSkills,
                        profileData?.computer_skill == 1 ? 'Yes' : 'No',
                      )} */}
                  </View>
                </View>
                {touchableNavigator('SkillDetail')}
              </View>

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
                  <Text style={{fontWeight: 'bold'}}>Language Detail</Text>
                  {languageRow(strings?.hindi, profileData?.hindi)}
                  {languageRow(strings?.english, profileData?.english)}
                  {languageRow(strings?.marathi, profileData?.marathi)}
                </View>
                {touchableNavigator('EducationalDetail')}
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(strings?.height, profileData?.height)}
                    {renderSingleView(strings?.weight, profileData?.weight)}
                    {renderSingleView(strings?.bloodGroup, profileData?.bgroup)}
                  </View>
                </View>
                {touchableNavigator('HealthDetail')}
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
    } else if (!fName) {
      showSnackBar(strings?.firstNameRequired, 'error');
      return false;
    } else if (mName && CheckMNameValidation()) {
      return false;
    }
    // else if (!mName) {
    //   showSnackBar('Middle Name Required.', 'error');
    // }
    else if (CheckLNameValidation()) {
      return false;
    } else if (!lName) {
      showSnackBar(strings?.lastNameRequired, 'error');
    } else {
      dispatch(
        callApi(
          PROFILE,
          URLs.PERSONAL_DETAIL,
          {
            fname: fName,
            lname: lName,
            mname: mName,
          },
          () => {
            props.navigation.navigate('AddressDetail');
            // getUserData();
          },
        ),
      );
    }
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
        setImagePath(image.path);
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
        setImagePath(image.path);
        uploadProfileImage(image.path);
      })
      .catch((err) => {});
  };

  const renderStar = () => {
    let star = [1, 2, 3, 4, 5, 6, 7].map((data, index) => {
      return (
        <View>
          {data <= parseInt(profileData?.profile_star || 0) ? (
            <FillStarIcon
              key={index}
              width={25}
              height={25}
              style={{marginHorizontal: 5}}
            />
          ) : (
            <StarIcon
              key={index}
              width={25}
              height={25}
              style={{marginHorizontal: 5}}
            />
          )}
        </View>
      );
    });
    return star;
  };

  let fNameRef = null;
  let mNameRef = null;
  let lNameRef = null;

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
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AddressDetail')}
            style={{padding: 5}}>
            <Next />
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={profileLoading} />
      <ScrollView>
        <View style={personalHeaderMainContainer}>
          <View>
            <Menu>
              <MenuTrigger style={menuTigerView}>
                <View style={imageCircleView}>
                  <View style={centerCircle}>
                    <CircleFlower
                      style={circlePosition}
                      width={170}
                      height={170}
                    />
                    <Circle
                      type={'large'}
                      circleColor={'#FFC003'}
                      svg={
                        <FastImage
                          style={innerImageView}
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
            {!(profileData?.fname && profileData?.lname) ? (
              <Text style={userNameText}>{`Welcome User`}</Text>
            ) : (
              <Text style={userNameText}>{`Welcome ${
                profileData?.fname || ''
              } ${profileData?.mname || ''} ${profileData?.lname || ''}`}</Text>
            )}

            <View style={starsView}>{renderStar()}</View>
          </View>
          {overlayForProfile()}
        </View>

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
            <Text style={labelTextStyles}>{strings?.firstName}</Text>
            <Input
              inputContainerStyle={inputContainerStyle}
              inputStyle={inputTextStyle}
              maxLength={15}
              {...fNameBind}
              onSubmitEditing={() => fNameRef?.focus()}
            />
            <Text style={labelTextStyles}>{strings?.middleName}</Text>
            <Input
              inputContainerStyle={inputContainerStyle}
              inputStyle={inputTextStyle}
              maxLength={15}
              {...mNameBind}
              onSubmitEditing={() => mNameRef?.focus()}
              inputRef={(ref) => (fNameRef = ref)}
            />
            <Text style={labelTextStyles}>{strings?.lastName}</Text>
            <Input
              inputContainerStyle={inputContainerStyle}
              inputStyle={inputTextStyle}
              maxLength={15}
              {...lNameBind}
              onSubmitEditing={() => debounce(savePersonalDetail())}
              inputRef={(ref) => (mNameRef = ref)}
            />
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
}
