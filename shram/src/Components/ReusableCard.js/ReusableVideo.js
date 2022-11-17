//import liraries
import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
// import VideoPlayer from 'react-native-video-player';
import VideoPlayer from '@rojgar/VideoPlayer';

import {GetPhotoBaseURL} from '@networking/Urls';

const screenWidth = Math.round(Dimensions.get('window').width);

export default class ReusableVideo extends PureComponent {
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('blur', () => {
      // do something
      // console.log('On Pause called');
      // this.player.pause();
      // console.log('On Paused');
    });
  }

  componentWillUnmount() {
    this._unsubscribe && this._unsubscribe();
  }

  render() {
    const {cont_type, cont_link, navigation, thumbnail} = this.props;
    return (
      // <VideoPlayer
      //   ref={(ref) => {
      //     this.player = ref;
      //   }}
      //   onError={(error) => console.warn('Error in playing video', error)}
      //   video={{
      //     cache: 'only-if-cached',
      //     uri:
      //       cont_type === 1
      //         ? cont_link?.includes('amazonaws')
      //           ? cont_link
      //           : `https://s3.ap-south-1.amazonaws.com/pics.test.mm/${cont_link}`
      //         : cont_link,
      //   }}
      //   pauseOnPress
      //   controls={true}
      //   videoWidth={screenWidth * 0.96}
      //   videoHeight={150}
      //   style={styles.container}
      // />
      <VideoPlayer
        toggleResizeModeOnFullscreen={true}
        // toggleResizeMode={false}
        // video={{
        //   uri: newMediaPath || uploadedVideoLink,
        //   }}
        thumbnail={thumbnail}
        onBackPress={navigation}
        //       url={{
        //         uri: cont_link,
        // }}
        url={{
          uri:
            cont_type === 1
              ? cont_link?.includes('amazonaws')
                ? cont_link
                : GetPhotoBaseURL() + cont_link
              : cont_link,
        }}
        // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
        // autoplay
        pauseOnPress
        // fullScreenOnLongPress
        videoWidth={screenWidth * 0.93}
        videoHeight={150}
        style={styles.container}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {marginTop: 10, width: '100%', height: 150},
});
