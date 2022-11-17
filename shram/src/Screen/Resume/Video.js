import Button from '@button/Button';
import LibraryIcon from '@icons/AddVideoIcon';
import CircleFlower from '@icons/circleFlower';
import DeleteIcon from '@icons/deleteIcon';
import AddVideoIcon from '@icons/YellowVideoicon';
import Model from '@model/Model';
import {GetPhotoBaseURL, URLs} from '@networking/Urls';
import {useNavigation} from '@react-navigation/native';
import {callApi} from '@redux/CommonDispatch.js';
import {PROFILE, VIDEO_UPLOAD} from '@redux/Types';
import strings from '@resources/Strings';
import localStyles from '@resume/ResumeStyles';
// import VideoPlayer from 'react-native-video-controls';
// import VideoPlayer from 'react-native-video-player';
import VideoPlayer from '@rojgar/VideoPlayer';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation';
import {useDispatch, useSelector} from 'react-redux';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Video(props) {
  const navigation = useNavigation();

  // console.log('Props for', props);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(false);

  const [newMediaPath, setNewMediaPath] = useState('');
  const [newMediaType, setNewMediaType] = useState('');
  const [uploadedVideoLink, setUploadedVideoLink] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const [currentOrientation, setCurrentOrientation] = useState('');
  const [dimesions, setDimensions] = useState({
    height: windowWidth,
    width: windowWidth,
  });

  const [videoUploadStatus, setVideoUploadStatus] = useState(false);
  const screenHeight = Math.round(Dimensions.get('window').height);
  const screenWidth = Math.round(Dimensions.get('window').width);
  const dispatch = useDispatch();
  const {profileData, profileLoading} = useSelector(
    (state) => state.ProfileReducer,
  );
  const {videoUploadLoading} = useSelector((state) => state.ResumeReducer);
  useEffect(() => {
    console.log('Video Path', profileData, profileData?.resume_link != null);
    if (profileData?.resume_link != null) {
      setUploadedVideoLink(GetPhotoBaseURL() + profileData?.resume_link);
    }
  }, [profileData]);

  useEffect(() => {
    // Getting initial Orientation
    const initial = Orientation.getInitialOrientation();
    setCurrentOrientation(initial);

    // Listner for orientation change LANDSCAPE / PORTRAIT
    Orientation.addOrientationListener(orientationChange);

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', orientationChange);

    // onLayout();

    return () => {
      // Remember to remove listener
      Orientation.removeOrientationListener(orientationChange);
      Dimensions.removeEventListener('change', () => {
        console.log('removed');
      });
    };
  }, []);

  // Detect Orientation Change
  const orientationChange = (orientation) => {
    setCurrentOrientation(orientation);
  };

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };

  const openVideo = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then((image) => {
        if ((image.duration / 1000).toFixed(2) > 40) {
          showSnackBar(strings?.videoTimeLimit, 'error');
          return false;
        }
        if ((image.size / 1048576).toFixed(2) > 50) {
          showSnackBar(strings?.videoSizeLimit, 'error');
          return false;
        }
        setIsVideoLoading(true);

        setNewMediaPath(image.path);
        setNewMediaType(image.mime);
        setIsVideoLoading(false);
      })
      .catch((e) => {
        // showSnackBar(JSON.stringify(e), 'error');
      });
  };
  const selectFromLibrary = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 50) {
          showSnackBar(strings?.videoSizeLimit, 'error');
          return false;
        }
        setIsVideoLoading(true);
        setNewMediaPath(image.path);
        setNewMediaType(image.mime);
        setIsVideoLoading(false);
      })
      .catch((e) => {
        // showSnackBar(JSON.stringify(e, null, 2), 'error');
      });
  };
  const deleteMedia = () => {
    setNewMediaPath('');
    setNewMediaType('');
    if (profileData?.resume_link != null) {
      deleteVideoApi();
    }
  };

  const deleteVideoApi = () => {
    dispatch(
      callApi(PROFILE, URLs.PERSONAL_DETAIL, {deleteResume: 1}, () => {
        setUploadedVideoLink('');
        getUserData();
      }),
    );
  };
  const UploadVideo = () => {
    if (!newMediaPath) {
      showSnackBar(strings?.recordVideoOrPhoto, 'error');
      return false;
    }
    let formData = new FormData();
    formData.append('upl', {
      uri: newMediaPath,
      name: `Video.${newMediaType}`,
      type: newMediaType,
    });
    dispatch(
      callApi(
        VIDEO_UPLOAD,
        URLs.UPLOAD_VIDEO,
        formData,
        (data) => {
          // console.warn(data);
          setVideoUploadStatus(true);
          console.log('Data from video Upload', data);
          getUserData();
        },
        () => {},
      ),
    );
  };

  const onEnterFullscreen = () => {
    // console.log('ENtering fullscreen');
    Orientation.lockToLandscape();
    // setTimeout(() => {
    setModalVisible(true);
  };
  const onExitFullscreen = () => {
    // console.log('ENtering fullscreen');
    Orientation.lockToPortrait();
    // setTimeout(() => {
    setModalVisible(false);
  };

  const renderGraphics = (Video) => {
    console.log(
      'Newpath vs videoink',
      newMediaPath,
      !uploadedVideoLink.includes('null'),
    );
    try {
      if (newMediaType.includes('video') || uploadedVideoLink) {
        if (newMediaPath || !uploadedVideoLink.includes('null')) {
          return (
            <View
              style={{
                // borderWidth: 2,
                height: screenHeight * 0.48 + 4,
                // borderColor: '#4B79D8',
                width: screenWidth * 0.9 + 4,
                alignSelf: 'center',
                // flex: 1,
                // justifyContent: 'center',
                // backgroundColor: 'black',
              }}>
              {isVideoLoading ? (
                <ActivityIndicator size={'small'} color={'#C3423F'} />
              ) : (
                <VideoPlayer
                  toggleResizeModeOnFullscreen={true}
                  // toggleResizeMode={false}
                  // video={{
                  //   uri: newMediaPath || uploadedVideoLink,
                  //   }}
                  thumbnail={profileData?.video_thumb}
                  onBackPress={navigation}
                  url={{
                    uri: newMediaPath || uploadedVideoLink,
                  }}
                  // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
                  // autoplay
                  pauseOnPress
                  onEnterFullscreen={onEnterFullscreen}
                  onExitFullscreen={onExitFullscreen}
                  // fullScreenOnLongPress
                  videoWidth={screenWidth * 0.9}
                  videoHeight={screenHeight * 0.48}
                  style={{
                    alignSelf: 'center',
                    width: screenWidth,
                    height: screenHeight,
                  }}
                />
              )}
            </View>
          );
        }
      } else if (newMediaType.includes('image')) {
        return (
          <View style={{flex: 0.5, justifyContent: 'center'}}>
            <View
              style={{
                justifyContent: 'center',
                padding: 10,
                alignItems: 'center',
              }}>
              <Image
                source={{uri: newMediaPath}}
                style={{
                  width: 300,
                  height: 300,
                  margin: 10,
                  // borderWidth: 1,
                }}
              />
            </View>
          </View>
        );
      } else {
        return (
          <View
            style={{
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={{color: '#4B79D8', textAlign: 'center'}}>
              {strings?.noResumeFound}
            </Text>
          </View>
        );
      }
    } catch (e) {
      showSnackBar(e.message, 'error');
    }
  };

  // const myModal = () => {
  //   // Modal For Full Screen Graph
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: 'center',
  //         alignItems: 'center',

  //         // marginTop: 22,
  //       }}>
  //       <Modal
  //         animationType="fade"
  //         // borderWidth: 5,
  //         // borderColor: 'green',
  //         presentationStyle="fullScreen"
  //         transparent={false}
  //         visible={modalVisible}
  //         onRequestClose={() => {
  //           // Alert.alert('Modal has been closed.');
  //           // setGraphLength(8);
  //           Orientation.lockToPortrait();
  //           setModalVisible(!modalVisible);
  //         }}>
  //         {/* // Modal Parent View */}
  //         <View
  //           style={{
  //             flex: 1,
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             width: '100%',
  //             // borderWidth: 5,
  //             // borderColor: 'green',
  //             // marginTop: 22,
  //           }}>
  //           <View
  //             style={{
  //               // margin: 20,
  //               backgroundColor: 'white',
  //               borderRadius: 20,
  //               // padding: 35,
  //               alignItems: 'center',
  //               shadowColor: '#000',
  //               shadowOffset: {
  //                 width: 0,
  //                 height: 2,
  //               },
  //               shadowOpacity: 0.25,
  //               shadowRadius: 4,
  //               elevation: 5,
  //               flex: 1,
  //               width: '100%',
  //             }}>
  //             <VideoPlayer
  //               toggleResizeModeOnFullscreen={true}
  //               // toggleResizeMode={false}
  //               // video={{
  //               //   uri: newMediaPath || uploadedVideoLink,
  //               //   }}
  //               url={{
  //                 uri: newMediaPath || uploadedVideoLink,
  //               }}
  //               // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
  //               // autoplay
  //               pauseOnPress
  //               onEnterFullscreen={onEnterFullscreen}
  //               onExitFullscreen={onExitFullscreen}
  //               // fullScreenOnLongPress
  //               videoWidth={screenWidth}
  //               videoHeight={screenHeight}
  //               style={{
  //                 alignSelf: 'center',
  //                 width: screenWidth,
  //                 height: screenHeight,
  //                 flex: 1,
  //                 position: 'absolute',
  //                 top: 0,
  //                 bottom: 0,
  //                 left: 0,
  //                 right: 0,
  //               }}
  //             />
  //             {/* <VideoPlayer
  //               toggleResizeModeOnFullscreen={false}
  //               // toggleResizeMode={false}
  //               // video={{
  //               //   uri: newMediaPath || uploadedVideoLink,
  //               //   }}
  //               source={{
  //                 uri: newMediaPath || uploadedVideoLink,
  //               }} // autoplay
  //               pauseOnPress
  //               onEnterFullscreen={onEnterFullscreen}
  //               onExitFullscreen={onExitFullscreen}
  //               // fullScreenOnLongPress
  //               videoWidth={screenWidth * 0.9}
  //               videoHeight={screenHeight * 0.48}
  //               style={{
  //                 alignSelf: 'center',
  //                 width: screenWidth,
  //                 height: screenHeight,
  //                 flex: 1,
  //                 position: 'absolute',
  //                 top: 0,
  //                 bottom: 0,
  //                 left: 0,
  //                 right: 0,
  //               }}
  //             /> */}
  //             {/* {renderGraphics()} */}
  //             {/* <LinearGradient
  //               style={{flex: 1, width: '100%'}}
  //               start={{x: 1, y: 1}}
  //               end={{x: 0, y: 0}}
  //               colors={['#005277D6', '#2C0144', '#521C53']}>
  //               {barChatView()}
  //             </LinearGradient> */}

  //             {/* <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
  //               <Text>Hide Modal</Text>
  //             </TouchableOpacity> */}
  //           </View>
  //         </View>
  //       </Modal>
  //       {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
  //         <Text>Show Modal</Text>
  //       </TouchableOpacity> */}
  //     </View>
  //   );
  // };

  const {flex1} = localStyles;
  return (
    <View style={flex1}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
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
            }}>
            <AddVideoIcon width={20} height={20} />
            <Text
              style={{
                fontSize: 14,
                color: '#777171',
              }}>
              {' Video'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: 5}}>
          <TouchableOpacity
            onPress={() => {
              selectFromLibrary();
              sendBtnClickToAnalytics('Open From Gallery');
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
              }}>
              {/* {' Add'} */}
              {' Gallery'}
            </Text>
          </TouchableOpacity>
        </View>

        {newMediaPath || profileData?.resume_link ? (
          <>
            <View>
              <TouchableOpacity
                onPress={() => {
                  deleteMedia();
                  sendBtnClickToAnalytics('Delete Resume Video');
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
                <DeleteIcon width={18} height={18} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#777171',
                  }}>
                  {strings?.delete}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '25%'}}>
              {/* <TouchableOpacity onPress={() => UploadVideo()}>
                <AddIcon />
              </TouchableOpacity> */}
              <Button
                title={strings?.upload}
                full
                titleStyle={{fontSize: 12}}
                buttonStyle={{marginVertical: 5, borderRadius: 5}}
                onPress={() => debounce(UploadVideo())}
                loading={videoUploadLoading || profileLoading}
              />
            </View>
          </>
        ) : null}
      </View>
      {/* <VideoPlayer
        // video={{
        //   uri: newMediaPath || uploadedVideoLink,
        //   }}
        source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
        // navigator={navigation.goBack()}
        // autoplay
        pauseOnPress
        onEnterFullscreen={onEnterFullscreen}
        // fullScreenOnLongPress
        videoWidth={screenWidth * 0.9}
        videoHeight={screenHeight * 0.48}
        style={{
          alignSelf: 'center',
          width: screenWidth,
          height: screenHeight,
          flex: 1,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      /> */}
      {/* <View style={{ alignItems: 'center' }}> */}
      {renderGraphics(newMediaPath)}
      {/* </View> */}
      <Model
        isVisible={videoUploadStatus}
        onBackdropPress={() => setVideoUploadStatus(false)}
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
            {strings?.videoAddSuccess}
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.goToNextPage();
              setVideoUploadStatus(false);
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
              {strings?.done}
            </Text>
          </TouchableOpacity>
        </View>
      </Model>
      {/* {myModal()} */}
    </View>
  );
}
