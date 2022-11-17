import Button from '@button/Button';
import Input from '@editText/EditText';
import CalendarIcon from '@icons/CalendarIcon.svg';
import CircleFlower from '@icons/circleFlower';
import AddPhotoIcon from '@icons/ClickCameraIcon';
import EditIcon from '@icons/EditIcon';
import Checked from '@icons/PhotoTickIcon';
import UnChecked from '@icons/RadioUncheck.svg';
import CrossIcon from '@icons/redDelete';
import Next from '@icons/resumeBack';
import Back from '@icons/ResumebackArrow';
import LoaderScreen from '@loader/Loader';
import Model from '@model/Model';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {
  GET_UPLOADED_DOCS,
  GET_UPLOADED_DOCS_SUCCESS,
  PHOTO_UPLOAD,
} from '@redux/Types';
import localStyles from '@resume/ResumeStyles';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
const {width, height} = Dimensions.get('window');
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Photo(props) {
  const [newMediaPath, setNewMediaPath] = useState('');
  const [newMediaType, setNewMediaType] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const [showServerCheck, setShowServerCheck] = useState(false);
  const [currentPic, setCurrentPic] = useState(-1);
  const [multiplePhoto, setMultiplePhoto] = useState([]);
  const [serverPhoto, setServerPhoto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [photoUploadStatus, setPhotoUploadStatus] = useState(false);
  const [photoDetailStatus, setPhotoDetailStatus] = useState(false);

  const [showPhotoDetail, setShowPhotoDetail] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const screenHeight = Math.round(Dimensions.get('window').height);
  const screenWidth = Math.round(Dimensions.get('window').width);
  const [fromDate, setFromDate] = useState('');
  const [fromDateTimePickerVisible, setFromDateTimePickerVisible] =
    useState(false);
  const {photoUploadLoading} = useSelector((state) => state.ResumeReducer);
  const {getDocumentsData, getDocumentsLoading} = useSelector(
    (state) => state.ProfileReducer,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      getUserDocs(),
    );
    return () => interactionPromise.cancel();
  }, []);

  // const {
  //   value: photoDetail,
  //   bind: photoDetailBind,
  //   setValue: setPhotoDetail,
  //   checkValidation: CheckPhotoDetailValidation,
  // } = useInput('');
  // const {
  //   value: location,
  //   bind: locationBind,
  //   setValue: setLocation,
  //   checkValidation: CheckLocationValidation,
  // } = useInput('');
  // const {
  //   value: month,
  //   bind: monthBind,
  //   setValue: setMonth,
  //   checkValidation: CheckMonthValidation,
  // } = useInput('');
  // const {
  //   value: year,
  //   bind: yearBind,
  //   setValue: setYear,
  //   checkValidation: CheckYearValidation,
  // } = useInput('');

  const handleFromDatePicked = (date) => {
    try {
      setFromDateTimePickerVisible(false);
      setFromDate(date);
      let temp = [...multiplePhoto];
      temp[currentPic].yearValue = date;
      temp[currentPic].monthValue = date;
      setMultiplePhoto([...temp]);
    } catch (err) {
      showSnackBar(e, 'error');
    }
  };

  const handleServerFromDatePicked = (date) => {
    try {
      setFromDateTimePickerVisible(false);
      setFromDate(date);
      let temp = [...serverPhoto];
      temp[currentPic].yearValue = fromDate;
      temp[currentPic].monthValue = fromDate;
      setServerPhoto([...temp]);
    } catch (err) {
      showSnackBar(e, 'error');
    }
  };

  const getUserDocs = () => {
    dispatch(
      callApi(
        GET_UPLOADED_DOCS,
        URLs.GET_DOCS,
        {
          doc_type: 'photo',
        },
        (data) => {
          setServerPhoto(data?.data);
        },
      ),
    );
  };

  const UploadPhoto = () => {
    // console.warn(multiplePhoto?.length);
    if (multiplePhoto && multiplePhoto.length > 0) {
      for (let i = 0; i < multiplePhoto.length; i++) {
        console.warn(multiplePhoto[i]);
        console.warn('came');
        let imageName = multiplePhoto[i].path.split('/');
        let formData = new FormData();
        formData.append('upl', {
          uri: multiplePhoto[i].path,
          name: imageName[imageName.length - 1],
          type: multiplePhoto[i].mime,
        });
        formData.append('doc_type', 'photo');
        formData.append('location', multiplePhoto[i].location);
        if (multiplePhoto[i].monthValue)
          formData.append(
            'pic_date',
            moment(multiplePhoto[i].monthValue).format(),
          );
        formData.append('detail', multiplePhoto[i].detail);
        dispatch(
          callApi(
            PHOTO_UPLOAD,
            URLs.DOCUMENT_UPLOAD,
            formData,
            (dataRes) => {
              if (i === multiplePhoto.length - 1) {
                setPhotoUploadStatus(true);
                setMultiplePhoto([]);
              }
            },
            (dataError) => {},
          ),
        );
      }
    }
  };

  const UploadServerPhoto = () => {
    if (serverPhoto && serverPhoto.length > 0) {
      for (let i = 0; i < serverPhoto.length; i++) {
        let formData = new FormData();
        formData.append('doc_type', 'photo');
        formData.append('doc_id', serverPhoto[i]?.doc_id);
        formData.append('location', serverPhoto[i].location);
        if (serverPhoto[i].monthValue)
          formData.append(
            'pic_date',
            moment(serverPhoto[i].monthValue).format(),
          );
        formData.append('detail', serverPhoto[i].detail);
        dispatch(
          callApi(
            PHOTO_UPLOAD,
            URLs.DOCUMENT_UPLOAD,
            formData,
            (dataRes) => {
              if (i === serverPhoto.length - 1) {
                setPhotoUploadStatus(true);
                setMultiplePhoto([]);
              }
            },
            (dataError) => {},
          ),
        );
      }
    }
  };

  const setCurrentPicfunc = () => {
    for (let i = currentPic + 1; i < multiplePhoto.length; i++) {
      if (multiplePhoto[i].check) {
        setCurrentPic(i);
        return null;
      }
    }
  };

  const setPreviousPicfunc = () => {
    for (let i = currentPic - 1; i < currentPic && i > -1; i--) {
      if (multiplePhoto[i].check) {
        setCurrentPic(i);
        return null;
      }
    }
  };

  const setServerCurrentPicfunc = () => {
    for (let i = currentPic + 1; i < serverPhoto.length; i++) {
      if (serverPhoto[i].check) {
        setCurrentPic(i);
        return null;
      }
    }
  };

  const setServerPreviousPicfunc = () => {
    for (let i = currentPic - 1; i < currentPic && i > -1; i--) {
      if (serverPhoto[i].check) {
        setCurrentPic(i);
        return null;
      }
    }
  };

  const setCheckBox = (index) => {
    let temp = [...multiplePhoto];
    temp[index].check = !temp[index].check;
    setMultiplePhoto([...temp]);
  };

  const setServerCheckBox = (index) => {
    let temp = [...serverPhoto];
    temp[index].check = !temp[index].check;
    setServerPhoto([...temp]);
  };

  const imageDel = (index) => {
    let temp = [...multiplePhoto];
    temp.splice(index, 1);
    setMultiplePhoto([...temp]);
  };

  const serverImageDel = (index) => {
    setLoader(true);
    let doc_id = serverPhoto[index]?.doc_id;
    let formData = new FormData();
    formData.append('doc_id', doc_id);
    formData.append('is_active', 0);
    dispatch(
      callApi(
        PHOTO_UPLOAD,
        URLs.DOCUMENT_UPLOAD,
        formData,
        () => {
          let temp = [...serverPhoto];
          temp[index].is_active = 0;
          const i = temp.indexOf(temp[index]);
          if (i > -1) {
            temp.splice(i, 1);
          }

          setServerPhoto([...temp]);
          dispatch({type: GET_UPLOADED_DOCS_SUCCESS, payload: {data: temp}});
          setLoader(false);
        },
        (dataError) => {
          setLoader(false);
          showSnackBar(dataError.message);
        },
      ),
    );
  };

  const getCurrentView = () => {
    if (showCheck) {
      return (
        <Button
          title={'NEXT'}
          full
          titleStyle={{fontSize: 14}}
          buttonStyle={{borderRadius: 5}}
          onPress={debounce(() => {
            setCurrentPicfunc();
            setShowDetail(true);
          })}
          loading={photoUploadLoading}
        />
      );
    }
    return (
      <View style={{alignItems: 'flex-end'}}>
        <Button
          title={strings?.upload}
          titleStyle={{fontSize: 14, textAlign: 'center'}}
          buttonStyle={{borderRadius: 5, alignItems: 'center'}}
          onPress={debounce(() => UploadPhoto())}
          loading={photoUploadLoading}
        />
      </View>
    );
  };

  const getServerCurrentView = () => {
    if (showServerCheck) {
      return (
        <TouchableOpacity
          onPress={() => {
            setServerCurrentPicfunc();
            setShowDetail(true);
            // setShowServerCheck(false);
          }}>
          <Text style={{color: '#FFC003', fontSize: 20}}>{'NEXT'}</Text>
        </TouchableOpacity>
      );
    }
    return;
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          showSnackBar(strings?.imageSizeLimit, 'error');
          return false;
        }
        // setNewMediaPath(image.path);
        // setNewMediaType(image.mime);
        image.detail = '';
        image.location = '';
        image.monthValue = '';
        image.yearValue = '';
        image.notFromApi = true;
        setMultiplePhoto([...multiplePhoto, image]);
      })
      .catch((e) => {
        console.log('User Cancelled Image Selection', e.message);
      });
  };
  const selectFromLibrary = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          showSnackBar(strings?.imageSizeLimit, 'error');
          return false;
        }
        // setNewMediaPath(image.path);
        // setNewMediaType(image.mime);
        image.detail = '';
        image.location = '';
        image.monthValue = '';
        image.yearValue = '';
        image.notFromApi = true;

        setMultiplePhoto([...multiplePhoto, image]);
      })
      .catch((e) => {
        console.log('User Cancelled Image Selection', e.message);
      });
  };
  const editPhoto = (isCheck) => {
    if (!showDetail && isCheck) setShowCheck(true);
    else setShowCheck(false);
    setNewMediaPath('');
    setNewMediaType('');
  };

  const editServerPhoto = () => {
    if (showServerCheck !== true && !showDetail) setShowServerCheck(true);
    else setShowServerCheck(false);
  };

  const renderServerPhotos = () => {
    // if (multiplePhoto.length) {
    return (
      <ScrollView>
        <View style={{margin: 10, backgroundColor: '#f0f0f0', padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text>{strings?.uploadPhotos}</Text>

            {/* {serverPhoto.length > 0 ? (
              <>
                <View>
                  <TouchableOpacity
                    onPress={() => editServerPhoto()}
                    style={{
                      borderWidth: 1,
                      borderColor: '#FFC003',
                      borderRadius: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      margin: 5,
                    }}>
                    <EditIcon
                      width={20}
                      height={20}
                      style={{
                        marginVertical: 10,
                        marginHorizontal: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        marginRight: 5,
                        color: '#777171',
                      }}>
                      {showServerCheck ? 'Cancel Edit' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {getServerCurrentView()}
              </>
            ) : null} */}
          </View>
          <FlatList
            keyExtractor={(item, index) => 'photo' + index}
            data={serverPhoto?.filter((item) => item.is_active !== 0)}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            renderItem={({item, index}) => {
              return (
                <>
                  <View
                    style={{
                      margin: 5,
                    }}>
                    <Image
                      source={{
                        // uri: `https://s3.ap-south-1.amazonaws.com/pics.test.mm/${item.doc_name}`,
                        uri: `${item.doc_name}`,
                      }}
                      style={{
                        width: (width - 50) / 3.5,
                        height: 90,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        alignItems: 'center',
                        zIndex: 9,
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        {showServerCheck && item.check && (
                          <TouchableOpacity
                            onPress={() => {
                              setServerCheckBox(index);
                              sendBtnClickToAnalytics('Unselect Photos');
                            }}>
                            <Checked height={20} width={20} />
                          </TouchableOpacity>
                        )}
                        {showServerCheck && !item.check && (
                          <TouchableOpacity
                            onPress={() => {
                              setServerCheckBox(index);
                              sendBtnClickToAnalytics('Select Photos');
                            }}>
                            <UnChecked height={20} width={20} />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              'Alert!',
                              'Are you sure you want to Delete Photo?',
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'OK',
                                  onPress: () => {
                                    serverImageDel(index);
                                    sendBtnClickToAnalytics(
                                      'Delete Photos from Server',
                                    );
                                  },
                                },
                              ],
                              {cancelable: false},
                            );
                          }}>
                          <CrossIcon width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      {item.detail ||
                      item.location ||
                      item.monthValue ||
                      item.yearValue ? (
                        <View
                          style={{
                            padding: 3,
                          }}>
                          {item.detail !== 'undefined' && (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  flex: 1,
                                  flexWrap: 'wrap',
                                  fontSize: 14,
                                  color: 'gray',
                                  fontWeight: 'bold',
                                }}>
                                {item.detail || ''}
                              </Text>
                            </View>
                          )}
                          {item.location !== 'undefined' && (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  flex: 1,
                                  flexWrap: 'wrap',
                                  fontSize: 14,
                                  color: '#707070',
                                }}>
                                {item.location ? item.location : null}
                              </Text>
                            </View>
                          )}
                          {item.monthValue !== 'undefined' ? (
                            <Text style={{fontSize: 14, color: '#707070'}}>
                              {moment(item.monthValue).format('MM/YYYY')}
                            </Text>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  </View>
                </>
              );
            }}
          />
        </View>
      </ScrollView>
    );
    // } else {
    //   return (
    //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //       <Text style={{color: '#4B79D8'}}>Kindly Add Photo</Text>
    //     </View>
    //   );
    // }
  };

  const renderPhotos = () => {
    // if (multiplePhoto.length) {
    return (
      <ScrollView>
        <View style={{margin: 10, backgroundColor: '#f0f0f0', padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text>New Photos</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              {multiplePhoto.length > 0 ? (
                <>
                  <View>
                    <TouchableOpacity
                      onPress={() => editPhoto(showCheck ? false : true)}
                      style={{
                        borderWidth: 1,
                        borderColor: '#FFC003',
                        borderRadius: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 5,
                      }}>
                      <EditIcon
                        width={20}
                        height={20}
                        style={{
                          marginVertical: 10,
                          marginHorizontal: 10,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          marginRight: 5,
                          color: '#777171',
                        }}>
                        {showCheck ? 'Cancel Edit' : 'Edit'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {getCurrentView('New')}
                </>
              ) : null}
            </View>
          </View>
          <FlatList
            keyExtractor={(item, index) => 'photo' + index}
            data={multiplePhoto}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            // contentContainerStyle={{flexDirection: 'row'}}
            renderItem={({item, index}) => {
              return (
                <>
                  <View
                    style={{
                      marginVertical: 5,
                      marginRight: 5,
                      // flex: 1,
                      // margin: 5,
                      // padding: showCheck && item.check ? 5 : 0,
                    }}>
                    <Image
                      source={{uri: item.path}}
                      style={{
                        width: (width - 50) / 3.5,
                        height: 90,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        justifyContent: 'space-between',
                      }}>
                      {showCheck && item.check && (
                        <TouchableOpacity onPress={() => setCheckBox(index)}>
                          <Checked height={20} width={20} />
                        </TouchableOpacity>
                      )}
                      {showCheck && !item.check && (
                        <TouchableOpacity onPress={() => setCheckBox(index)}>
                          <UnChecked height={20} width={20} />
                        </TouchableOpacity>
                      )}
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              'Alert!',
                              'Are you sure you want to Delete Photo?',
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
                          <CrossIcon width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      {item.detail ||
                      item.location ||
                      item.monthValue ||
                      item.yearValue ? (
                        <View
                          style={{
                            padding: 3,
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                flex: 1,
                                flexWrap: 'wrap',
                                fontSize: 14,
                                color: 'gray',
                                fontWeight: 'bold',
                              }}>
                              {item.detail || ''}
                            </Text>
                          </View>
                          {item.location !== 'undefined' && (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  flex: 1,
                                  flexWrap: 'wrap',
                                  fontSize: 14,
                                  color: '#707070',
                                }}>
                                {item.location ? item.location : null}
                              </Text>
                            </View>
                          )}
                          {item.monthValue !== 'undefined' ? (
                            <Text style={{fontSize: 14, color: '#707070'}}>
                              {moment(item.monthValue).format('MM/YYYY')}
                            </Text>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  </View>
                </>
              );
            }}
          />
        </View>
      </ScrollView>
    );
    // } else {
    //   return (
    //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //       <Text style={{color: '#4B79D8'}}>Kindly Add Photo</Text>
    //     </View>
    //   );
    // }
  };
  const detailView = (type) => {
    if (type === 'server') {
      return (
        <KeyboardAvoidingView style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowDetail(false);
                setCurrentPic(-1);
                setShowCheck(false);
                setShowServerCheck(false);
              }}>
              <Text style={{color: 'gray', fontSize: 14, padding: 5}}>
                {'Cancle'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowDetail(false);
                setCurrentPic(-1);
                setShowCheck(false);
                setShowServerCheck(false);
                UploadServerPhoto();
                sendBtnClickToAnalytics('Save Edited Photo');
              }}>
              <Text style={{color: '#FFC003', fontSize: 14, padding: 5}}>
                {'Save'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
            }}>
            <View
              style={{
                borderWidth: 0.5,
                paddingBottom: 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  margin: 10,
                  paddingHorizontal: 5,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{flex: 1, padding: 5}}
                  onPress={() => setServerPreviousPicfunc()}>
                  <Back />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setServerCurrentPicfunc()}>
                  <Next />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  padding: 5,
                  alignItems: 'center',
                }}>
                {/* {console.warn('Server Photo', serverPhoto[currentPic])} */}
                <Image
                  source={{uri: serverPhoto[currentPic].doc_name}}
                  style={{
                    width: (width - 40) / 4,
                    height: height / 4,
                    margin: 5,
                    borderWidth: 1,
                  }}
                />
              </View>
              <View style={{width: '85%'}}>
                <Input
                  text={'Detail'}
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={{
                    fontSize: 16,
                    marginHorizontal: 5,
                    color: '#3D3D3D',
                  }}
                  value={
                    serverPhoto[currentPic].detail == 'undefined'
                      ? ''
                      : serverPhoto[currentPic].detail
                  }
                  onChange={(val) => {
                    let temp = [...serverPhoto];
                    temp[currentPic].detail = val;
                    setServerPhoto([...temp]);
                  }}
                  onSubmitEditing={() => detailRef?.focus()}
                />
              </View>
              <View style={{width: '85%'}}>
                <Input
                  text={'Location'}
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={{
                    fontSize: 16,
                    marginHorizontal: 5,
                    color: '#3D3D3D',
                  }}
                  value={serverPhoto[currentPic].location}
                  onChange={(val) => {
                    let temp = [...serverPhoto];
                    temp[currentPic].location = val;
                    setServerPhoto([...temp]);
                  }}
                  onSubmitEditing={() => locationRef?.focus()}
                  inputRef={(ref) => (detailRef = ref)}
                />
              </View>
              <View
                style={{
                  width: '85%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '30%',
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      color: 'grey',
                      padding: 5,
                      fontSize: 14,
                    }}>
                    {serverPhoto[currentPic].monthValue
                      ? moment(serverPhoto[currentPic].monthValue).format('MM')
                      : 'Month'}
                  </Text>
                </View>
                <View
                  style={{
                    width: '30%',
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                    borderBottomColor: 'grey',
                  }}>
                  <Text
                    style={{
                      color: 'grey',
                      padding: 5,
                      fontSize: 14,
                    }}>
                    {serverPhoto[currentPic].yearValue
                      ? moment(serverPhoto[currentPic].yearValue).format('YYYY')
                      : 'Year'}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setFromDateTimePickerVisible(true);
                  }}
                  style={{
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // padding: 5,
                    borderRadius: 2,
                    borderColor: '#4B79D8',
                    backgroundColor: '#4B79D8',
                    height: 20,
                    width: 20,
                  }}>
                  <CalendarIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              setShowDetail(false);
              setCurrentPic(-1);
            }}>
            <Text style={{color: 'gray', fontSize: 14, padding: 5}}>
              {strings?.cancel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowDetail(false);
              setCurrentPic(-1);
              UploadPhoto();
            }}>
            <Text style={{color: '#FFC003', fontSize: 14, padding: 5}}>
              {'Save'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              margin: 10,
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{flex: 1, padding: 5}}
              onPress={() => setPreviousPicfunc()}>
              <Back />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentPicfunc()}>
              <Next />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              padding: 5,
              alignItems: 'center',
            }}>
            <Image
              source={{uri: multiplePhoto[currentPic].path}}
              style={{
                width: (width - 40) / 4,
                height: height / 4,
                margin: 5,
                borderWidth: 1,
              }}
            />
          </View>
          <View style={{width: '85%'}}>
            <Input
              text={'Detail'}
              inputContainerStyle={inputContainerStyle}
              inputStyle={{
                fontSize: 16,
                marginHorizontal: 5,
                color: '#3D3D3D',
              }}
              value={multiplePhoto[currentPic].detail}
              onChange={(val) => {
                let temp = [...multiplePhoto];
                temp[currentPic].detail = val;
                setMultiplePhoto([...temp]);
              }}
              onSubmitEditing={() => detailRef?.focus()}
            />
          </View>
          <View style={{width: '85%'}}>
            <Input
              text={'Location'}
              inputContainerStyle={inputContainerStyle}
              inputStyle={{
                fontSize: 16,
                marginHorizontal: 5,
                color: '#3D3D3D',
              }}
              value={multiplePhoto[currentPic].location}
              onChange={(val) => {
                let temp = [...multiplePhoto];
                temp[currentPic].location = val;
                setMultiplePhoto([...temp]);
              }}
              onSubmitEditing={() => locationRef?.focus()}
              inputRef={(ref) => (detailRef = ref)}
            />
          </View>
          <View
            style={{
              width: '85%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '30%',
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  color: 'grey',
                  padding: 5,
                  fontSize: 14,
                }}>
                {multiplePhoto[currentPic].monthValue
                  ? moment(multiplePhoto[currentPic].monthValue).format('MM')
                  : 'Month'}
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                borderBottomWidth: 1,
                marginHorizontal: 10,
                borderBottomColor: 'grey',
              }}>
              <Text
                style={{
                  color: 'grey',
                  padding: 5,
                  fontSize: 14,
                }}>
                {multiplePhoto[currentPic].yearValue
                  ? moment(multiplePhoto[currentPic].yearValue).format('YYYY')
                  : 'Year'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setFromDateTimePickerVisible(true);
              }}
              style={{
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 5,
                borderRadius: 2,
                borderColor: '#4B79D8',
                backgroundColor: '#4B79D8',
                height: 20,
                width: 20,
              }}>
              <CalendarIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  const {flex1, inputContainerStyle} = localStyles;
  let detailRef = null;
  let locationRef = null;
  return (
    // <SafeAreaView>
    <>
      <LoaderScreen loading={getDocumentsLoading || loader} />
      <ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <TouchableOpacity
              onPress={() => {
                openCamera();
                sendBtnClickToAnalytics('Capture Photots');
              }}
              style={{
                // margin: 5,
                borderWidth: 1,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AddPhotoIcon width={20} height={20} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#777171',
                  // margin: 5,
                }}>
                {' ' + strings?.create}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginHorizontal: 5}}>
            <TouchableOpacity
              onPress={() => {
                selectFromLibrary();
                sendBtnClickToAnalytics('Select From Gallery');
              }}
              style={{
                // margin: 5,
                borderWidth: 1,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AddPhotoIcon width={20} height={20} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#777171',
                  // margin: 5,
                }}>
                {/* {' Add'} */}
                {' Gallery'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* {multiplePhoto.length ? (
            <>
              <View style={{width: '20%'}}>
                <TouchableOpacity
                  onPress={() => editPhoto()}
                  style={{
                    borderWidth: 1,
                    borderColor: '#FFC003',
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                    margin: 5,
                  }}>
                  <EditIcon width={20} height={20} />
                  <Text
                    style={{
                      fontSize: 14,
                      margin: 5,
                      color: '#777171',
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '20%', alignItems: 'flex-end'}}>
                {getCurrentView()}
              </View>
            </>
          ) : null} */}
        </View>

        {showDetail ? (
          (multiplePhoto?.length > 0 || serverPhoto?.length > 0) &&
          currentPic != -1 ? (
            detailView(showServerCheck ? 'server' : 'new')
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text>{'Please Select At Least 1 Photo'}</Text>
                <TouchableOpacity onPress={() => setShowDetail(false)}>
                  <Text style={{color: 'blue'}}>{' Select Photo'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        ) : multiplePhoto.length > 0 || serverPhoto.length > 0 ? (
          <>
            {multiplePhoto.length > 0 && <View>{renderPhotos()}</View>}
            {serverPhoto.length > 0 && <View>{renderServerPhotos()}</View>}
          </>
        ) : (
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              marginTop: 10,
              color: '#4B79D8',
            }}>
            {strings?.noPhotosFound}
          </Text>
        )}
        <Model
          isVisible={photoUploadStatus}
          onBackdropPress={() => setPhotoUploadStatus(false)}
          overlayStyle={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CircleFlower
              style={{
                position: 'absolute',
              }}
              width={300}
              height={300}
            />
            <Text
              style={{
                color: '#707070',
                textAlign: 'center',
                fontSize: 20,
                margin: 10,
              }}>
              {strings?.photoAddSuccess}
            </Text>
            <TouchableOpacity
              onPress={() => props.goToNextPage()}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 10,
                backgroundColor: '#FFC003',
                width: 100,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#777171',
                }}>
                {strings?.done}
              </Text>
            </TouchableOpacity>
          </View>
        </Model>

        <DateTimePicker
          isVisible={fromDateTimePickerVisible}
          onConfirm={handleFromDatePicked}
          maximumDate={new Date()}
          onCancel={() => {
            setFromDateTimePickerVisible(false);
          }}
        />
        <Model
          isVisible={photoDetailStatus}
          onBackdropPress={() => setPhotoDetailStatus(false)}
          overlayStyle={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CircleFlower
              style={{
                position: 'absolute',
              }}
              width={300}
              height={300}
            />
            <Text
              style={{
                color: '#707070',
                textAlign: 'center',
                fontSize: 20,
                margin: 10,
              }}>
              {strings?.photoDeatilAddedSuccess}
            </Text>
            <TouchableOpacity
              onPress={() => setPhotoDetailStatus(false)}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 10,
                backgroundColor: '#FFC003',
                width: 100,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#777171',
                }}>
                {strings?.done}
              </Text>
            </TouchableOpacity>
          </View>
        </Model>
      </ScrollView>
    </>
    // </SafeAreaView>
  );
}
