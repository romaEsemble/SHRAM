import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text, Modal} from 'react-native';
// import VideoPlayer from 'react-native-video-player';
import {useSelector} from 'react-redux';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import {useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {GetPhotoBaseURL} from '@networking/Urls';
import {useFocusEffect} from '@react-navigation/native';
import {sendBtnClickToAnalytics} from '@utils/Util';

// import Video from 'react-native-af-video-player';

const screenWidth = Math.round(Dimensions.get('window').width);

export default function VideoPlayerContainer(props) {
  const navigation = useNavigation();
  const {isMuted} = useSelector((state) => state.RojgarReducer);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(false);
  const [isPausedNormal, setIsPausedNormal] = useState(true);
  const [isPausedFullScreen, setIsPausedFullScreen] = useState(false);

  const [newMediaPath, setNewMediaPath] = useState('');
  const [newMediaType, setNewMediaType] = useState('');
  const [uploadedVideoLink, setUploadedVideoLink] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const [currentOrientation, setCurrentOrientation] = useState('');
  const [dimesions, setDimensions] = useState({
    height: windowWidth,
    width: windowWidth,
  });

  const [isFocus, setIsFocus] = useState(false);

  const screenHeight = Math.round(Dimensions.get('window').height);
  const screenWidth = Math.round(Dimensions.get('window').width);
  const {
    url,
    // onEnterFullscreen,
    // onExitFullscreen,
    videoHeight,
    videoWidth,
    onBackPress,
    thumbnail,
  } = props;
  // console.log('Props', url, props);
  const videoInstanceNormal = useRef();
  const videoInstanceFullScreen = useRef();

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

  useFocusEffect(
    React.useCallback(() => {
      setIsFocus(true);
      // console.log('Focused');
      return () => {
        // console.log('UnFocused');
        setIsFocus(false);

        // Once the Screen gets blur Remove Event Listener
        // BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );
  // Detect Orientation Change
  const orientationChange = (orientation) => {
    // console.log('Orientation', orientation);
    setCurrentOrientation(orientation);
  };

  const onEnterFullscreen = () => {
    // console.log('ENtering fullscreen', currentOrientation);
    Orientation.lockToLandscape();
    // setTimeout(() => {
    setModalVisible(true);
  };
  const onExitFullscreen = () => {
    // console.log('ENtering fullscreen');
    Orientation.lockToPortrait();
    setIsPausedFullScreen(true);
    // setIsPausedNormal(true);
    // setTimeout(() => {
    setModalVisible(false);
  };

  const myModal = () => {
    // Modal For Full Screen Graph
    if (!modalVisible) return null;
    if (currentOrientation == 'PORTRAIT') {
      return null;
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',

          // marginTop: 22,
        }}>
        <Modal
          animationType="fade"
          // borderWidth: 5,
          // borderColor: 'green',
          presentationStyle="fullScreen"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            // setGraphLength(8);
            Orientation.lockToPortrait();
            setModalVisible(!modalVisible);
          }}>
          {/* // Modal Parent View */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              // borderWidth: 5,
              // borderColor: 'green',
              // marginTop: 22,
            }}>
            <View
              style={{
                // margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                // padding: 35,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                flex: 1,
                width: '100%',
              }}>
              <VideoPlayer
                toggleResizeModeOnFullscreen={true}
                // toggleResizeMode={false}
                // video={{
                //   uri: newMediaPath || uploadedVideoLink,
                //   }}
                onBack={onExitFullscreen}
                source={url}
                // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
                autoplay={false}
                pauseOnPress
                disableVolume
                onEnterFullscreen={onEnterFullscreen}
                onExitFullscreen={onExitFullscreen}
                // fullScreenOnLongPress
                paused={isPausedFullScreen}
                onPlay={() => setIsPausedFullScreen(false)}
                videoWidth={screenWidth}
                ref={videoInstanceFullScreen}
                videoHeight={screenHeight}
                onEnd={onEndFullScreen}
                style={{
                  alignSelf: 'center',
                  width: screenWidth,
                  height: screenHeight - 30,
                  // flex: 1,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              />

              {/* <VideoPlayer
                toggleResizeModeOnFullscreen={false}
                // toggleResizeMode={false}
                // video={{
                //   uri: newMediaPath || uploadedVideoLink,
                //   }}
                source={{
                  uri: newMediaPath || uploadedVideoLink,
                }} // autoplay
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
                  flex: 1,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              /> */}
              {/* {renderGraphics()} */}
              {/* <LinearGradient
                style={{flex: 1, width: '100%'}}
                start={{x: 1, y: 1}}
                end={{x: 0, y: 0}}
                colors={['#005277D6', '#2C0144', '#521C53']}>
                {barChatView()}
              </LinearGradient> */}

              {/* <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Text>Hide Modal</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
        {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>Show Modal</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  const onEnd = () => {
    console.log('On end ');
    videoInstanceNormal.current.player.ref.seek(0);
    setIsPausedNormal(true);
    // videoInstance.current.player.ref.pause();
  };
  const onEndFullScreen = () => {
    console.log('On end ');
    videoInstanceFullScreen.current.player.ref.seek(0);
  };

  const stringIs = url?.uri;
  // console.log('Strings is', url, stringIs.includes('file://'));
  var isUrlValid = stringIs.split('/');
  isUrlValid = isUrlValid[isUrlValid?.length - 1] ? true : false;
  const canNotPlay =
    stringIs.includes('jpeg') ||
    stringIs.includes('png') ||
    stringIs.includes('null') ||
    stringIs.includes('gif') ||
    stringIs.includes('webp') ||
    !isUrlValid;
  const thumnailImage = GetPhotoBaseURL() + thumbnail;
  // console.log('Thumnail is', thumnailImage);
  // console.log('Issue is', canNotPlay, stringIs.split('/'), isUrlValid);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        !canNotPlay
          ? navigation.navigate('VideoPage', {
              videoUrl: url,
            })
          : null;
        sendBtnClickToAnalytics('Video Thumbnail Clicked');
      }}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: videoWidth,
        height: videoHeight,
        backgroundColor: 'black',
        borderRadius: 10,
      }}>
      {thumbnail && !canNotPlay && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            // borderWidth: 1,
            flex: 1,
            height: '100%',
            borderRadius: 10,
            // borderWidth: 3,
            // borderColor: 'red',
          }}>
          <FastImage
            style={{
              // position: 'absolute',
              // flex: 1,
              height: '100%',
              width: '100%',
              borderRadius: 10,
              // height: 150,
              // width: 150,
            }}
            resizeMode={'cover'}
            source={{
              uri: thumnailImage,
              priority: FastImage.priority.normal,
            }}
            // source={{
            //   uri:
            //     'file:///data/user/0/com.shram/cache/react-native-image-crop-picker/VID-20210730-WA0000.mp4',
            // }}
            // Can be a URL or a local file.
            paused={true}
            controls={false}
          />
        </View>
      )}
      {stringIs.includes('file://') && isFocus && (
        <Video
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            alignItems: 'stretch',
            bottom: 0,
            right: 0,
          }}
          resizeMode={'cover'}
          source={url}
          // source={{
          //   uri:
          //     'file:///data/user/0/com.shram/cache/react-native-image-crop-picker/VID-20210730-WA0000.mp4',
          // }}
          // Can be a URL or a local file.
          paused={true}
          controls={false}
        />
      )}
      <Image
        style={{
          width: 50,
          height: 50,
          tintColor: canNotPlay ? 'red' : '#6190F1',
        }}
        source={
          canNotPlay
            ? require('@icons/PlayIcon.png')
            : require('@icons/PlayIcon.png')
        }
        // source={{
        //   uri:
        //     'https://s3.ap-south-1.amazonaws.com/pics.test.mm/1626750193447___mp4',
        // }}
      />
      {canNotPlay && <Text style={{color: 'red'}}>Video Not Playable</Text>}
      {/* <VideoPlayer
        toggleResizeModeOnFullscreen={true}
        // toggleResizeMode={false}
        // video={{
        //   uri: newMediaPath || uploadedVideoLink,
        //   }}
        onBack={() => onBackPress.goBack()}
        source={url}
        // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
        autoplay={false}
        ref={videoInstanceNormal}
        pauseOnPress
        disableBack
        onEnd={onEnd}
        onEnterFullscreen={onEnterFullscreen}
        onExitFullscreen={onExitFullscreen}
        disableVolume
        paused={isPausedNormal}
        onPlay={() => setIsPausedNormal(false)}
        // fullScreenOnLongPress
        videoWidth={videoWidth}
        videoHeight={videoHeight}
        style={{
          alignSelf: 'center',
          width: videoWidth,
          height: videoHeight,
        }}
      />
      {myModal()}  */}
    </TouchableOpacity>
  );
}
