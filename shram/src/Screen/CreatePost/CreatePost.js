import Button from '@button/Button';
import localStyles from '@createPost/CreatePostStyles';
import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Header from '@header/Header';
import LibraryIcon from '@icons/AddVideoIcon';
import CircleFlower from '@icons/circleFlower';
import ClickCameraIcon from '@icons/ClickCameraIcon';
import DeleteIcon from '@icons/deleteIcon';
import AddVideoIcon from '@icons/YellowVideoicon';
import Model from '@model/Model';
import {NAVIGATION_ADHIKAR} from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {CREATE_POST} from '@redux/Types';
import {INPUT_TYPE_OTHER} from '@resources/Constants';
import {nonEmpty, postTextValidation} from '@resources/Validate';
import UpdateProfilePopup from '@rojgar/UpdateProfilePopup';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useState} from 'react';
import {Dimensions, Image, Keyboard, ScrollView, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
// import VideoPlayer from 'react-native-video-player';
import {useDispatch, useSelector} from 'react-redux';
import strings from '@resources/Strings';
import VideoPlayer from '@rojgar/VideoPlayer';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function CreatePost({navigation}) {
  const [newMediaPath, setNewMediaPath] = useState('');
  const [newMediaType, setNewMediaType] = useState('');
  const [postStatus, setPostStatus] = useState(false);
  const [updateItems, setUpdateItems] = useState([]);
  const [showUpdateProfile, setUpdateProfile] = useState(false);

  const {CreatePostLoading} = useSelector((state) => state.CreatePostReducer);
  const {profileData} = useSelector((state) => state.ProfileReducer);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   getPostData();
  // }, [PostData]);

  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);

  const {
    value: newPostTitle,
    bind: newPostTitleBind,
    setValue: setNewPostTitle,
    checkValidation: CheckNewPostTitleValidation,
  } = useInput('', INPUT_TYPE_OTHER, postTextValidation, strings?.invalid);
  const {
    value: newPostDescription,
    bind: newPostDescriptionBind,
    setValue: setNewPostDescription,
    setError: setNewPostDescriptionError,
    checkValidation: CheckNewPostDescriptionValidation,
  } = useInput(
    '',
    INPUT_TYPE_OTHER,
    postTextValidation,
    strings?.invalidDescription,
  );

  // const getPostData = () => {
  //   if (PostData) {
  //     setNewPostTitle(PostData?.title);
  //     setNewPostDescription(PostData?.des);
  //     setNewMediaPath(PostData?.mediaPath);
  //     setNewMediaType(PostData?.mediaType);
  //   }
  // };
  const createNewPost = () => {
    // console.log('newMe', newMediaPath);
    Keyboard.dismiss();
    if (CheckNewPostTitleValidation()) return false;
    else if (!newPostTitle) {
      showSnackBar(strings?.titleRequired, 'error');
      return false;
    }
    // else if (!newMediaPath || newMediaPath === ' ') {
    //   showSnackBar('Please Add Atleast One Photo/Video.', 'error');
    //   return false;
    // }
    else if (setNewPostDescriptionError) {
      setNewPostDescriptionError('');
    }

    let items = [];
    const {section_1, section_2} = profileData || {};
    if (parseInt(section_1 || 0, 10) !== 1) {
      items.push(strings?.personalDetails);
    }
    if (parseInt(section_2 || 0, 10) !== 1) {
      items.push('Address Details');
    }

    if (items?.length > 0) {
      setUpdateItems(items);
      setUpdateProfile(true);
    } else {
      let formData = new FormData();
      let imageName = newMediaPath.split('/');
      if (newMediaType?.includes('image') || newMediaType?.includes('video')) {
        formData.append('upl', {
          uri: newMediaPath,
          name: imageName[imageName.length - 1],
          type: newMediaType,
        });
      }

      formData.append('header', newPostTitle);
      formData.append('desc', newPostDescription);
      formData.append(
        'cont_file_type',
        newMediaType?.includes('image')
          ? 1
          : newMediaType?.includes('video')
          ? 2
          : 3,
      );
      //  alert('formData', JSON.stringify(formData));

      dispatch(
        callApi(
          CREATE_POST,
          URLs.CREATE_POST,
          formData,
          (data) => {
            setPostStatus(true);
            setNewMediaPath('');
            setNewMediaType('');
            setNewPostTitle('');
            setNewPostDescription('');
          },
          () => {},
        ),
      );
    }
  };
  const openCamera = () => {
    Keyboard.dismiss();

    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
      useFrontCamera: true,
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          showSnackBar(strings?.imageSizeLimit, 'error');
          return false;
        }
        setNewMediaPath(image.path);
        setNewMediaType(image.mime);
      })
      .catch((e) => {
        // console.log(JSON.stringify(e), 'error');
      });
  };

  const openVideo = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then((image) => {
        // console.log('Video Properties', image);
        if ((image.duration / 1000).toFixed(2) > 40) {
          showSnackBar(strings?.videoTimeLimit, 'error');
          return false;
        }
        if ((image.size / 1048576).toFixed(2) > 50) {
          showSnackBar(strings?.videoSizeLimit, 'error');
          return false;
        }
        setNewMediaPath(image.path);
        setNewMediaType(image.mime);
      })
      .catch((e) => {
        // console.log(JSON.stringify(e), 'error');
      });
  };
  const selectFromLibrary = () => {
    ImagePicker.openPicker({
      mediaType: 'mixed',
    })
      .then((image) => {
        console.log('Image', image);
        if (image.mime.includes('image')) {
          if ((image.size / 1048576).toFixed(2) > 5) {
            showSnackBar(strings?.imageSizeLimit, 'error');
            return false;
          }
        } else if (image.mime.includes('video')) {
          if ((image.size / 1048576).toFixed(2) > 50) {
            showSnackBar(strings?.videoSizeLimit, 'error');
            return false;
          }
        }
        setNewMediaPath(image.path);
        setNewMediaType(image.mime);
      })
      .catch((e) => {
        // console.log(JSON.stringify(e), 'error');
      });
  };
  const deleteMedia = () => {
    setNewMediaPath('');
    setNewMediaType('');
  };

  const renderGraphics = () => {
    if (newMediaType.includes('image')) {
      return (
        <View style={{flex: 1}}>
          <Image
            source={{uri: newMediaPath}}
            style={{
              width: '100%',
              height: screenHeight * 0.5,
              marginVertical: 5,
            }}
          />
        </View>
      );
    } else if (newMediaType.includes('video')) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <VideoPlayer
            toggleResizeModeOnFullscreen={true}
            // toggleResizeMode={false}
            // video={{
            //   uri: newMediaPath || uploadedVideoLink,
            //   }}
            onBackPress={navigation}
            url={{
              uri: newMediaPath,
            }}
            // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
            // autoplay
            pauseOnPress
            // onEnterFullscreen={onEnterFullscreen}
            // onExitFullscreen={onExitFullscreen}
            // fullScreenOnLongPress
            videoWidth={screenWidth * 0.9}
            videoHeight={screenHeight * 0.48}
            style={{
              height: screenHeight * 0.5,
              width: '100%',
              marginVertical: 5,
            }}
          />
        </View>
      );
    }
  };

  const {inputContainerStyle} = localStyles;
  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <Header showBack title={strings?.createNewPost} />
        <View style={{flex: 1, margin: 5}}>
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <Button
              titleStyle={{fontSize: 12}}
              buttonStyle={{borderRadius: 5, alignSelf: 'center'}}
              // half
              title={strings?.post}
              loading={CreatePostLoading}
              onPress={debounce(() => createNewPost())}
            />
          </View>
          <View
            style={{
              margin: 5,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: '#777171',
                }}>
                {strings?.title}
              </Text>
              <Input
                {...newPostTitleBind}
                inputContainerStyle={inputContainerStyle}
                maxLength={100}
                inputStyle={{
                  fontSize: 16,
                  marginHorizontal: 5,
                  color: '#3D3D3D',
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: '#777171',
                }}>
                {strings?.description}
              </Text>
              <Input
                {...newPostDescriptionBind}
                multiLine
                inputContainerStyle={inputContainerStyle}
                maxLength={250} //Sir told me to set max length "250" <--
                inputStyle={{
                  fontSize: 16,
                  marginHorizontal: 5,
                  color: '#3D3D3D',
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            {!newMediaPath ? (
              <>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      openVideo();
                      sendBtnClickToAnalytics('Record Video');
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
                    <AddVideoIcon width={20} height={20} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#777171',
                        marginHorizontal: 3,
                      }}>
                      {' ' + strings?.video}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: 5}}>
                  <TouchableOpacity
                    onPress={() => {
                      selectFromLibrary();
                      sendBtnClickToAnalytics('Select from Gallery');
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
                    <LibraryIcon width={20} height={20} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#777171',
                        // marginHorizontal: 3,
                      }}>
                      {strings?.selectFromPhone}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      openCamera();
                      sendBtnClickToAnalytics('Take Photo');
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
                    <ClickCameraIcon width={20} height={20} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#777171',
                        marginHorizontal: 3,
                      }}>
                      {' ' + strings?.photo}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => deleteMedia()}
                  style={{
                    borderWidth: 1,
                    borderColor: '#FFC003',
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                    // margin: 5,
                  }}>
                  <DeleteIcon width={20} height={20} />
                  <Text
                    style={{
                      fontSize: 14,
                      // margin: 5,
                      color: '#777171',
                    }}>
                    {strings?.delete}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {renderGraphics()}
        </View>
        <Model
          overlayStyle={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          isVisible={postStatus}
          onBackdropPress={() => setPostStatus(false)}>
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
              width={200}
              height={200}
            />
            <Text
              style={{
                color: '#707070',
                textAlign: 'center',
                fontSize: 20,
                margin: 10,
              }}>
              {strings?.postApprovalPending}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setPostStatus(false);
                // navigation.navigate(NAVIGATION_ADHIKAR);
              }}
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
                {strings?.ok}
              </Text>
            </TouchableOpacity>
          </View>
        </Model>

        {showUpdateProfile && (
          <UpdateProfilePopup
            item={updateItems}
            onClose={() => {
              setUpdateProfile(false);
            }}
            navigation={navigation}
          />
        )}
      </View>
    </ScrollView>
  );
}
