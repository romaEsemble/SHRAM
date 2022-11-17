//import liraries
import CloseIcon from '@icons/closeColor.svg';
import {GetPhotoBaseURL} from '@networking/Urls';
import PopupModal from '@popupModal/PopupModal';
import {sendBtnClickToAnalytics} from '@utils/Util';
import React, {useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
const screenWidth = Math.round(Dimensions.get('window').width);

// create a component
const MyComponent = React.memo(
  ({cont_type, cont_link, style, localImage = false}) => {
    const [state, setState] = useState({
      isDetailImageVisible: false,
    });
    // console.log('Click image');
    return (
      <>
        {cont_link && (
          <TouchableOpacity
            onPress={() => {
              setState({isDetailImageVisible: true});
              sendBtnClickToAnalytics('Image Clicked in card to Open in popup');
            }}>
            <FastImage
              style={style ? style : styles.container}
              source={{
                uri: localImage
                  ? cont_link
                  : cont_link?.includes('amazonaws')
                  ? cont_link
                  : GetPhotoBaseURL() + cont_link,
                // uri: cont_type === 1 ? GetPhotoBaseURL() + cont_link : cont_link,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        )}
        {state.isDetailImageVisible && (
          <PopupModal
            onBackdropPress={() => {
              setState({isDetailImageVisible: false});
            }}>
            <View style={{alignItems: 'center'}}>
              {cont_link && (
                <FastImage
                  style={{
                    alignSelf: 'center',
                    width: screenWidth * 0.9,
                    height: '99%',
                  }}
                  source={{
                    uri: localImage
                      ? cont_link
                      : cont_link?.includes('amazonaws')
                      ? cont_link
                      : GetPhotoBaseURL() + cont_link,
                    // uri: cont_type === 1 ? GetPhotoBaseURL() + cont_link : cont_link,
                    // headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              <TouchableOpacity
                style={{position: 'absolute', alignSelf: 'flex-end'}}
                onPress={() => setState({isDetailImageVisible: false})}>
                <CloseIcon width={wp(6)} height={wp(6)} />
              </TouchableOpacity>
            </View>
          </PopupModal>
        )}
      </>
    );
  },
);
{
  /* <Image
      source={{
        cache: 'only-if-cached',
        uri: null,
        // cont_type === 1
        //   ? `https://s3.ap-south-1.amazonaws.com/pics.test.mm/${cont_link}`
        //   : cont_link,
      }}
      style={styles.container}
    /> */
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    // marginHorizontal: '2%',
    // borderRadius: 10,
    // marginTop: 10,
  },
});

//make this component available to the app
export default MyComponent;
