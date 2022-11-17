import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Modal,
  StatusBar,
  TouchableOpacity,
  View,
  BackHandler,
  Text,
  AppState,
} from 'react-native';
import Orientation from 'react-native-orientation';
import VideoPlayer from 'react-native-video-controls';
// import VideoPlayer from 'react-native-video-player';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';

// import Video from 'react-native-af-video-player';

const screenWidth = Math.round(Dimensions.get('window').width);

// import Video from 'react-native-af-video-player';

export default function VideoPage(props) {
  const navigation = useNavigation();
  // console.log('Props from OPage', props?.route?.params?.videoUrl);
  const windowWidth = Dimensions.get('window').width;

  const [isPausedNormal, setIsPausedNormal] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoDefaultOrientation, setVideoDefaultOrientation] = useState(0);
  const [currentOrientation, setCurrentOrientation] = useState('PORTRAIT');
  const [isFocus, setIsFocus] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    url,
    // onEnterFullscreen,
    // onExitFullscreen,
    videoHeight,
    videoWidth,
    onBackPress,
  } = props;
  // console.log('Props', url, props);
  const videoInstanceNormal = useRef();

  function handleBackButtonClick() {
    // onExitFullscreen();
    return false;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.addEventListener('change', handleAppStateChange);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  // useFocusEffect get called each time when screen comes in focus
  useFocusEffect(
    React.useCallback(() => {
      setIsFocus(true);
      // console.log('Focused issue', isError);
      const onBackPress = () => {
        // Return true to stop default back navigaton
        // Return false to keep default back navigaton
        // console.log('Is Back press', isFullscreen, currentOrientation);
        // currentOrientation == 'LANDSCAPE'
        isFullscreen || hidden ? onExitFullscreen() : navigation.goBack();
        return true;
      };

      // Add Event Listener for hardwareBackPress
      // BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // console.log('UnFocused');
        setIsFocus(false);
        setIsPausedNormal(false);
        setVideoDefaultOrientation(0);
        onExitFullscreen();
        setIsError(false);
        // Once the Screen gets blur Remove Event Listener
        // BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  useEffect(() => {
    // Getting initial Orientation
    const initial = Orientation.getInitialOrientation();
    // setCurrentOrientation(initial);

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

  const handleAppStateChange = (appState) => {
    if (appState == 'background') {
      // console.log('Background');
      setIsPausedNormal(true);
      // videoInstanceNormal.current.pause();
    }
    if (appState === 'active') {
      // Do something here on app active foreground mode.
      // console.log('App is in Active Foreground Mode.');
    }

    if (appState === 'inactive') {
      // Do something here on app inactive mode.
      // console.log('App is in inactive Mode.');
    }
  };
  // Detect Orientation Change
  const orientationChange = (orientation) => {
    console.log('Orientation change', orientation, currentOrientation);
    setCurrentOrientation(orientation);
  };

  const onEnterFullscreen = () => {
    // console.log('ENtering fullscreen', currentOrientation);
    Orientation.lockToLandscape();
    setHidden(true);
    setIsFullscreen(true);
  };
  const onExitFullscreen = () => {
    console.log('Exit fullscreen', isFullscreen, currentOrientation);
    // if (!isFullscreen) {
    //   navigation.goBack();
    //   return;
    // }
    Orientation.lockToPortrait();
    //   setIsPausedFullScreen(true);
    setIsFullscreen(false);
    setHidden(false);
  };

  const onEnd = () => {
    // console.log('On end ');
    videoInstanceNormal.current.player.ref.seek(0);
    setIsPausedNormal(true);
    // videoInstance.current.player.ref.pause();
  };

  const pageView = () => {
    const stringIs = props?.route?.params?.videoUrl?.uri;
    // console.log('Video url is', props?.route?.params?.videoUrl, stringIs);
    var isUrlValid = stringIs.split('/');
    isUrlValid = isUrlValid[isUrlValid?.length - 1] ? true : false;
    // const canNotPlay =
    //   stringIs.includes('jpeg') ||
    //   stringIs.includes('png') ||
    //   stringIs.includes('null');

    const canNotPlay =
      stringIs.includes('jpeg') ||
      stringIs.includes('png') ||
      stringIs.includes('null') ||
      stringIs.includes('gif') ||
      stringIs.includes('webp') ||
      !isUrlValid;
    // console.log(
    //   'Issue is',
    //   stringIs.includes('jpeg'),
    //   stringIs.includes('png'),
    //   stringIs.includes('null'),
    //   canNotPlay,
    // );
    if (isFocus && !canNotPlay && !isError) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingTop: isFullscreen ? 0 : StatusBar.currentHeight,
          }}>
          <StatusBar hidden={hidden} />
          <View
            style={{
              width: '100%',
              height: '100%',
            }}>
            <VideoPlayer
              toggleResizeModeOnFullscreen={true}
              playInBackground={false}
              playWhenInactive={false}
              // toggleResizeMode={false}
              //   video={{
              //     uri: props?.route?.params?.videoUrl,
              //   }}
              onBack={() => {
                navigation.goBack();
              }}
              //   source={url}
              source={props?.route?.params?.videoUrl}
              //   source={{uri: 'https://www.w3schools.com/html/mov_bbb.mp4'}}
              autoplay
              ref={videoInstanceNormal}
              pauseOnPress
              disableBack={isFullscreen ? true : false}
              onEnd={onEnd}
              onEnterFullscreen={onEnterFullscreen}
              onExitFullscreen={onExitFullscreen}
              disableVolume
              onError={(error) => {
                console.log('video err', error);
                setIsError(true);
              }}
              paused={isPausedNormal}
              onPlay={() => setIsPausedNormal(false)}
              onLoad={(status) => {
                console.log('Video', status);
                // portrait==1, landscape =0
                if (status?.naturalSize?.orientation == 'portrait') {
                  setVideoDefaultOrientation(1);
                }
              }}
              disableFullscreen={videoDefaultOrientation == 1 ? true : false}
              minLoadRetryCount={2}
              // fullScreenOnLongPress
              videoWidth={'100%'}
              videoHeight={'100%'}
              style={{
                alignSelf: 'center',
                width: '100%',
                resizeMode: 'cover',
                // flex: 1,
                // height: 500,
              }}
            />
          </View>
        </View>
      );
    } else if (isError) {
      return (
        <View
          style={{
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text style={{color: 'red'}}>This Video is Broken</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}></View>
      );
    }
  };

  return pageView();
}
