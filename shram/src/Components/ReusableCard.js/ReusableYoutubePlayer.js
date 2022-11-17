import React, {useCallback, useState, useEffect} from 'react';
import {Button, View, AppState, Text} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useFocusEffect} from '@react-navigation/native';

export default function ReusableYoutubePlayer(props) {
  // console.log('Props', props);
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // console.log('In focus');
      return () => {
        setPlaying(false);
        setIsReady(false);
      };
    }, []),
  );

  // useEffect(() => {
  //   AppState.addEventListener('change', handleAppStateChange);
  //   console.log('Mount');

  //   // console.log('Params changed');
  //   return () => {
  //     console.log('Un mount');
  //     AppState.addEventListener('change', handleAppStateChange);
  //   };
  // }, [props]);

  // const handleAppStateChange = (appState) => {
  //   if (appState == 'background') {
  //     console.log('Background');
  //     // setIsPausedNormal(true);
  //     // videoInstanceNormal.current.pause();
  //   }
  //   if (appState === 'active') {
  //     // Do something here on app active foreground mode.
  //     console.log('App is in Active Foreground Mode.');
  //   }

  //   if (appState === 'inactive') {
  //     // Do something here on app inactive mode.
  //     console.log('App is in inactive Mode.');
  //   }
  // };

  // const onStateChange = useCallback((state) => {
  //   if (state === 'ended') {
  //     setPlaying(false);
  //     // Alert.alert("video has finished playing!");
  //   }
  // }, []);
  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      // Alert.alert('video has finished playing!');
    }
    // console.log('State is ', state);
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  // const togglePlaying = useCallback(() => {
  //   setPlaying((prev) => !prev);
  // }, []);
  // console.log(
  //   'Value',
  //   props?.cont_link?.substring(props?.cont_link?.indexOf('=') + 1),
  // );

  return (
    <View style={{backgroundColor: isReady ? null : 'black'}}>
      <YoutubePlayer
        height={210}
        play={playing}
        // play={true}
        modestbranding
        // videoId={'LhSDxp0oQK8'}
        origin={'https://www.youtube.com'}
        preventFullScreen={true}
        videoId={props?.cont_link?.substring(
          props?.cont_link?.indexOf('=') + 1,
        )}
        onChangeState={onStateChange}
        useLocalHTML={true}
        onReady={(ready) => setIsReady(true)}
        onError={(event) => console.log('Youtube Error', event)}
        onFullScreenChange={(event) => console.log('Youtube', event)}
      />
      {/* <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} /> */}
    </View>
  );
}
