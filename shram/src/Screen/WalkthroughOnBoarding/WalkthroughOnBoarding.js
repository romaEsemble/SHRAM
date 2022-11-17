import Button from '@button/Button';
import BG from '@icons/mandaleydesign.svg';
import {NAVIGATION_LOGIN} from '@navigation/NavigationKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ONBOARDING_DATA} from '@resources/Constants';
import Text from '@textView/TextView';
import {withTheme} from '@theme/ThemeHelper';
import localStyles from '@walkthroughOnBoarding/WalkthroughOnBoardingStyles';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import {sendBtnClickToAnalytics} from '@utils/Util';
import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');

function WalkThroughOnBoarding({navigation}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [bgcolor, setBgcolor] = useState('#ffff');

  let corouselref = useRef();

  const renderItems = ({item}) => {
    const {TITLE, TEXT, IMAGE, BgColor} = item;
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            marginRight: -100,
          }}>
          {/* {activeSlide === 3 && <BG style={{position: 'absolute', top: 40}} />} */}
          <View
            style={{
              // backgroundColor: "#fff",
              // borderColor: BgColor,
              // // borderWidth: 25,
              marginBottom: 50,
              // borderRadius: height,
              // elevation: 8,
            }}>
            {/* {IMAGE} */}

            <View >
              <Swiper
                loop
                autoplay
                dot={
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: 'white',
                      borderRadius: 4,
                      margin: 5,
                      position: 'absolute',
                    }}></View>
                }
                activeDot={
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: 'white',
                      borderRadius: 5,
                      margin: 5,
                    }}></View>
                }
                style={styles.sp}>
                <Image
                  source={require('@icons/landing1.png')}
                  style={styles.image}
                />

                <Image
                  source={require('@icons/landing2.png')}
                  resizeMode="center"
                  style={styles.image}
                />

                <Image
                  source={require('@icons/landing3.png')}
                  resizeMode="center"
                  style={styles.image}
                />

                <Image
                  source={require('@icons/landing4.png')}
                  resizeMode="center"
                  style={styles.image}
                />
              </Swiper>
            </View>

            <View>
              <Image source={require('@icons/Group.png')} style={styles.back} />
            </View>

            <View>
              <Image source={require('@icons/KHOJ1.png')} style={styles.khoj} />
            </View>
          </View>

          {/* <Text bold style={{color: '#FFFFFF', fontSize: 50}}> */}
          {/* {TITLE} */}
          {/* </Text> */}
          {/* <Text style={{color: '#FFFFFF', textAlign: 'center'}}>{TEXT}</Text> */}
        </View>
       

        {/* <TouchableOpacity
          style={styles.user}
          onPress={async () => {
            AsyncStorage.setItem('FirstTime', 'No');
            navigation?.navigate(NAVIGATION_LOGIN);
          }}>
          <Text style={styles.userbtn}>Get Started</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  // const {flatView} = localStyles;
  return (
    <>
      {/* <StatusBar /> */}
      <View>
        {/* {activeSlide !== 3 && (
          <BG
            style={{
              position: 'absolute',
              top: activeSlide === 0 ? -120 : height / 2 - 200,
              left:
                activeSlide === 0 ? -120 : activeSlide === 1 ? -150 : undefined,
              right: activeSlide === 2 ? -150 : undefined,
            }}
          />
        )} */}
        <Carousel
          containerCustomStyle={
            {
              // flexGrow: 1,
              // height: '100%',
            }
          }
          onSnapToItem={(index) => {
            // setActiveSlide(index);
            // if (index === 0) setBgcolor('#ffff');
            // else if (index === 1) setBgcolor('#ffff');
            // else if (index === 2) setBgcolor('#ffff');
            // else setBgcolor('#ffff');
          }}
          ref={(c) => {
            corouselref = c;
          }}
          data={ONBOARDING_DATA}
          renderItem={(data) => renderItems(data)}
          sliderWidth={width * 1.21}
          sliderHeight={'100%'}
          itemHeight={height * 0.1}
          itemWidth={width * 0.97}
        />
        <FlatList
          keyExtractor={(item, index) => 'onboarding_' + index}
          data={ONBOARDING_DATA}
          horizontal
          // contentContainerStyle={flatView}
          renderItem={({index}) => (
            <View
              style={
                index === activeSlide
                  ? {
                      // alignSelf: 'center',
                      // width: 20,
                      // height: 8,
                      // borderRadius: 16,
                      // backgroundColor: '#F7FF00',
                      // marginHorizontal: 8,
                    }
                  : {
                      // width: 5,
                      // height: 5,
                      // borderRadius: 5,
                      // backgroundColor: 'white',
                      // marginHorizontal: 8,
                    }
              }
            />
          )}
        />
        {/* <View style={{marginBottom: 20}}>
          {activeSlide == 3 ? (
            <Button
              buttonStyle={{borderRadius: 8}}
              title={'GET STARTED'}
              onPress={async () => {
                AsyncStorage.setItem('FirstTime', 'No');
                navigation?.navigate(NAVIGATION_LOGIN);
              }}
              full
            />
          ) : (
            <TouchableOpacity
              onPress={async () => {
                AsyncStorage.setItem('FirstTime', 'No');
                navigation?.navigate(NAVIGATION_LOGIN);
                sendBtnClickToAnalytics('SKIP');
              }}>
              {/* <Text style={{alignSelf: 'center', color: '#FEFFFE'}}>
                {'SKIP'}
              </Text> */}
        {/* </TouchableOpacity> */}
        {/* )} */}
        {/* </View> */}

        <View style={{position: "absolute", marginLeft: 150, marginTop: 580}}>
       <Button
                buttonStyle={{borderRadius: 8,}}
                title={'GET STARTED'}
                onPress={async () => {
                  AsyncStorage.setItem('FirstTime', 'No');
                  navigation?.navigate(NAVIGATION_LOGIN);
                }}
              />
       </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#ffff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginTop: 0,
    // marginBottom: 140,
  },

  back: {
    width: 415,
    height: 290,
    // marginBottom: -300,
    marginTop: -150,
    marginRight:191,
    marginLeft: 5,
    justifyContent: 'center',
    borderRadius: 40,
    // resizeMode: 'contain',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 450,
    height: 300,
    marginTop: -70,
    resizeMode: 'cover',
    // marginBottom: 200,
  },

  userbtn: {
    backgroundColor: '#FF9900',
    padding: 10,
    borderRadius: 20,
    fontSize: 20,
    width: 250,
    textAlign: 'center',
    marginTop: -200,
    marginBottom: 100,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    flex: 1,
    marginBottom: -400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // btns:{
  //  marginTop: -620,
  //   justifyContent: "center",
  //   alignItems: "center"
  // }
  user: {
    marginBottom: -10,
    marginTop: -10,
    marginLeft: -90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  khoj: {
    position: 'absolute',
    width: 120,
    height: 200,
    justifyContent: 'center',
    marginTop: -855,
    marginLeft: 155,
  },
});
export default withTheme(WalkThroughOnBoarding);
