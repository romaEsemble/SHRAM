import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Header from '@header/Header';
import Back from '@icons/backArrow.svg';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import DropDownIcon from '@icons/dropDownIcon';
import DeleteIcon from '@icons/redDelete';
import Loader from '@loader/Loader';
import Model from '@model/Model';
import ModelView from '@model/SuccessfullyModel';
import {
  NAVIGATION_HOME,
  NAVIGATION_PROFILE_STACK,
} from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import localStyles from '@profile/ProfileStyles';
import ProfileHerder from '@profileHerder/ProfileHerder';
import {useFocusEffect} from '@react-navigation/native';
import {callApi} from '@redux/CommonDispatch.js';
import {DOCUMENT_UPLOAD, GET_UPLOADED_DOCS, PROFILE} from '@redux/Types';
import {
  INPUT_TYPE_OTHER,
  KEYBOARD_TYPE_NUMERIC,
  PROFILE_SCREEN,
} from '@resources/Constants';
import strings from '@resources/Strings';
import {documentNumberValidation} from '@resources/Validate';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  InteractionManager,
  ScrollView,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {MenuOption} from 'react-native-popup-menu';
import {useDispatch, useSelector} from 'react-redux';
import ReusableImage from '@cardItem/ReusableImage';

export default function Documents(props) {
  const {navigation} = props;
  const [imagePath, setImagePath] = useState([]);
  const [documentsItems, setDocumentsItems] = useState('');
  const [toggleButton, setToggleButton] = useState(false);
  const [updateInputLength, setUpdateInputLength] = useState(0);
  const [updateInputType, setUpdateInputType] = useState('other');
  const [updateInputKeyboard, setUpdateInputKeyboard] = useState('none');
  const [isDisable, setIsDisable] = useState(false);

  const [show, setShow] = useState(false);

  const [photoUploadStatus, setPhotoUploadStatus] = useState(false);

  const {profileData, documentUploadLoading, profileLoading, getDocumentsData} =
    useSelector((state) => state.ProfileReducer);
  const dispatch = useDispatch();

  const {
    value: documentNumbers,
    setValue: setDocumentNumbers,
    bind: documentNumbersBind,
    setError: SetDocumentNumbersErr,
    checkValidation: CheckDocumentNumbersValidation,
  } = useInput(
    '',
    INPUT_TYPE_OTHER,
    documentNumberValidation,
    'Document Number',
  );

  const DOCUMENTS_DATA = [
    {
      documentName: 'Aadhar',
    },
    {
      documentName: 'PAN',
    },
    {
      documentName: 'Driving',
    },
    {
      documentName: 'Passport',
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
        console.log('Run');
        getUserData();
        getUserDocs();
      });
      console.log('is focused D');
      return () => {
        interactionPromise.cancel();
        console.log('Un focused Document');
      };
    }, []),
  );

  const getUserDocs = () => {
    dispatch(
      callApi(
        GET_UPLOADED_DOCS,
        URLs.GET_DOCS,
        {
          doc_type: 'other',
        },
        (data) => {
          if (data?.data && data?.data.length) {
            setImagePath(data?.data || []);
            setIsDisable(true);
            setDocumentsItems(data?.data[0]?.doc_type);
            setDocumentNumbers(data?.data[0]?.doc_no);
          }
        },
      ),
    );
  };

  const saveDocumentsDetail = () => {
    // if (!documentNumbers) {
    //   showSnackBar(strings?.documentNameRequired, 'error');
    //   return false;
    // } else if (CheckDocumentNumbersValidation()) {
    //   return false;
    // } else
    if (!documentsItems) {
      showSnackBar(strings?.documentTypeRequired, 'error');
      return false;
    } else if (imagePath?.length === 0) {
      showSnackBar(strings?.documentPhotoRequired, 'error');
      return false;
    }
    // This Code is commented after Document Number field is hided. Do not delete this .
    // switch (updateInputType) {
    //   case 'Aadhar':
    //     if (documentNumbers?.length != 12) {
    //       showSnackBar(strings?.invalidAadharNumber, 'error');
    //       return false;
    //     }
    //     break;
    //   case 'PAN':
    //     if (documentNumbers?.length != 10) {
    //       showSnackBar(strings?.invalidPan, 'error');
    //       return false;
    //     }
    //     break;
    //   case 'Driving':
    //     if (documentNumbers?.length != 15) {
    //       showSnackBar(strings?.invalidLicenseNumber, 'error');
    //       return false;
    //     }
    //     break;
    //   case 'Passport':
    //     if (documentNumbers?.length != 8) {
    //       showSnackBar(strings?.invalidPassportNumber, 'error');
    //       return false;
    //     }
    //     break;
    //   default:
    //     break;
    // }
    if (imagePath && imagePath?.length) {
      for (let i = 0; i < imagePath?.length; i++) {
        if (imagePath[i].notFromApi) {
          let formData = new FormData();
          formData.append('upl', {
            uri: imagePath[i].doc_name,
            name: 'docs.jpeg',
            type: 'image/jpeg',
          });
          formData.append('doc_type', documentsItems);
          formData.append('doc_no', documentNumbers);
          console.log('Upload doc', URLs.DOCUMENT_UPLOAD, formData);
          dispatch(
            callApi(DOCUMENT_UPLOAD, URLs.DOCUMENT_UPLOAD, formData, () => {
              setPhotoUploadStatus(true);
              getUserData();
              getUserDocs();
            }),
          );
        }
      }
    }
    return false;
  };
  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      // includeBase64: true,
      // includeExif: true,
      mediaType: 'photo',
    })
      .then((image) => {
        // if ((image.size / 1048576).toFixed(2) > 5) {
        //   throw Error('Image cannot be greater than 5 mb');
        // }
        if ((image.size / 1048576).toFixed(2) > 5) {
          showSnackBar(strings?.imageSizeLimit, 'error');
          return false;
        }
        let pathArray = [...imagePath];
        // pathArray.push(image.path);
        pathArray.push({
          doc_name: image.path,
          notFromApi: true,
        });
        setImagePath([...pathArray]);
        // console.log('pathArray', imagePath.length);
      })
      .catch((err) => {});
  };

  const checkInputLength = (document) => {
    if (document === 'Aadhar') {
      setUpdateInputLength(12);
      setUpdateInputType('Aadhar');
      setUpdateInputKeyboard('numeric');
    } else if (document === 'PAN') {
      setUpdateInputLength(10);
      setUpdateInputType('PAN');
      setUpdateInputKeyboard('none');
    } else if (document === 'Driving') {
      setUpdateInputLength(15);
      setUpdateInputType('Driving');
      setUpdateInputKeyboard('none');
    } else if (document === 'Passport') {
      setUpdateInputLength(8);
      setUpdateInputType('Passport');
      setUpdateInputKeyboard('none');
    }
  };
  // const imageDel = (index) => {
  //   let temp = {...imagePath};
  //   temp.path.splice(index, 1);
  //   setImagePath({...temp});
  // };

  const imageDel = (index) => {
    let temp = [...imagePath];
    temp.splice(index, 1);
    setImagePath([...temp]);
  };

  const documentsOption = (item) => {
    return (
      <MenuOption
        text={item.documentName}
        onSelect={() => {
          setDocumentsItems(item.documentName);
          checkInputLength(item.documentName);
          SetDocumentNumbersErr('');
        }}>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={{justifyContent: 'center'}}>
            <Text
              light
              style={{
                color: '#1A1A1A',
                textAlign: 'left',
                width: '100%',
              }}>
              {item.documentName}
            </Text>
          </View>
        </View>
      </MenuOption>
    );
  };

  const documentsListRenderer = (item, index) => {
    console.log('Iten is', item);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {item?.doc_name && (
          <ReusableImage
            style={{
              height: 100,
              width: 100,
              margin: 10,
            }}
            localImage={true}
            resizeMode="stretch"
            cont_link={item?.notFromApi ? item?.doc_name : `${item?.doc_name}`}
          />
        )}
        {/* {item?.doc_name && (
          <FastImage
            style={{
              height: 100,
              width: 100,
              margin: 10,
            }}
            resizeMode="stretch"
            source={{
              uri: item?.notFromApi ? item?.doc_name : `${item?.doc_name}`,
              priority: FastImage.priority.normal,
              // : `https://s3.ap-south-1.amazonaws.com/pics.test.mm/${item.doc_name}`,
            }}
          />
        )} */}
        <TouchableOpacity
          style={{marginVertical: 5}}
          onPress={() => {
            Alert.alert(
              'Alert!',
              'Are you sure you want to Delete Document?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    imageDel(index);
                  },
                },
              ],
              {cancelable: false},
            );
          }}>
          {isDisable ? null : (
            <DeleteIcon
              width={20}
              height={20}
              style={{
                top: -1,
                right: 10,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };
  const {inputContainerStyle, inputTextStyle, editPicText} = localStyles;
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
          {/*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */}
          <TouchableOpacity
            // onPress={() => {
            //   props.route.params?.sender == 'verify'
            //     ? navigation?.navigate(NAVIGATION_PROFILE_STACK, {
            //         screen: 'HealthDetail',
            //       })
            //     : navigation.navigate('HealthDetail');
            // }}
            onPress={() => {
              props.route.params?.sender == 'verify'
                ? navigation?.navigate(NAVIGATION_PROFILE_STACK, {
                    screen: 'ProfessionalDetail',
                  })
                : navigation.navigate('ProfessionalDetail');
            }}
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
        </View>
      </View>

      <Loader loading={documentUploadLoading || profileLoading} />
      {/* <ScrollView> */}
      {/* <ScrollView> */}
      <View style={{flex: 1, backgroundColor: '#00000000'}}>
        <ProfileHerder
          profileData={profileData}
          getDocumentsData={getDocumentsData}
          onPress={() => {
            isDisable
              ? setPhotoUploadStatus(true)
              : debounce(saveDocumentsDetail());
            // console.log('isDisable', isDisable);
          }}
          // editMode={toggleButton ? true : false}
        />
        <ScrollView>
          <View style={{alignItems: 'flex-end'}}>
            <BackgroundFlowerIcon style={{position: 'absolute', zIndex: -9}} />
          </View>

          <View style={{margin: 10}}>
            <View style={{marginVertical: 5, padding: 5}}>
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                {strings?.personalIDAccounts}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {imagePath.length === 2 || isDisable ? (
                <View></View>
              ) : (
                <TouchableOpacity onPress={() => debounce(openGallery())}>
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      backgroundColor: 'lightgrey',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 10,
                      padding: 10,
                    }}>
                    <View
                      style={{
                        height: 50,
                        width: 5,
                        borderRadius: 10,
                        backgroundColor: 'grey',
                      }}
                    />
                    <View
                      style={{
                        height: 5,
                        width: 50,
                        borderRadius: 10,
                        backgroundColor: 'grey',
                        position: 'absolute',
                        zIndex: 1,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <FlatList
                data={imagePath}
                numColumns={2}
                keyExtractor={(item, index) => index + '_' + item.type}
                renderItem={({item, index}) =>
                  documentsListRenderer(item, index)
                }
              />
            </View>
            <View style={{margin: 10}}>
              <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                DOCUMENT TYPE
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isDisable ? true : false}
                onPress={() => (show ? setShow(false) : setShow(true))}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 5,
                    borderColor: '#0000001A',
                    backgroundColor: '#0000001A',
                  }}>
                  {documentsItems ? (
                    <Text
                      light
                      style={{
                        color: '#707070',
                        textAlign: 'left',
                        width: '80%',
                      }}>
                      {documentsItems}
                    </Text>
                  ) : (
                    <Text
                      light
                      style={{
                        color: '#707070',
                        textAlign: 'left',
                        width: '80%',
                      }}>
                      Select Document Types
                    </Text>
                  )}
                  <DropDownIcon />
                </View>
              </TouchableOpacity>
              {show && (
                <FlatList
                  style={{
                    backgroundColor: '#fff',
                    elevation: 4,
                    zIndex: 9,
                  }}
                  keyExtractor={(item, index) => 'addressInfo'}
                  data={DOCUMENTS_DATA}
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
                            setDocumentsItems(item.documentName);
                            checkInputLength(item.documentName);
                            SetDocumentNumbersErr('');
                            setShow(false);
                            if (item?.documentName !== documentsItems) {
                              setDocumentNumbers('');
                            }
                          }}>
                          <Text style={editPicText}>{item.documentName}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              )}
              {/* This Code is commented after Document Number field is hided. Do not delete this . */}

              {/* <Text style={{margin: 5, color: '#9F9F9F', fontSize: 14}}>
                  DOCUMENT NUMBER
                </Text>
                <Input
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={inputTextStyle}
                  {...documentNumbersBind}
                  // keyboardType={updateInputKeyboard}
                  maxLength={updateInputLength ? updateInputLength : 12}
                  editable={!isDisable}
                  keyboardType={
                    documentsItems == 'Aadhar' ? KEYBOARD_TYPE_NUMERIC : null
                  }
                /> */}
            </View>
          </View>

          {/* <View
              style={{
                margin: 10,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StartIcon />
              <Text
                style={{
                  color: '#777171',
                  fontSize: 11,
                  textAlign: 'center',
                  marginHorizontal: 5,
                  paddingHorizontal: 5,
                }}>
                {`Add a star to your profile by updating this section. Become a 7 Star \n Shramik to improve chances for selection to applied jobs.`}
              </Text>
            </View> */}
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
                    // index === 6
                    index === 2
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
      </View>
      {/* </ScrollView> */}
      {/* </KeyboardAvoidingView> */}
      <Model
        isVisible={photoUploadStatus}
        onBackdropPress={() => setPhotoUploadStatus(false)}
        height={'50%'}>
        <ModelView
          heading={strings?.successfully}
          subHeading={strings?.profileUpdateSuccess}
          onPress={() => {
            setPhotoUploadStatus(false);
            // goToNextPage();
            getUserData();
            setTimeout(() => {
              navigation.navigate(NAVIGATION_HOME);
            }, 100);
          }}
        />
      </Model>

      {/* </ScrollView> */}
    </>
  );
}
