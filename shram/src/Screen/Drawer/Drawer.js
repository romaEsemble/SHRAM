import Circle from '@circle/Circle';
import localStyles from '@drawer/DrawerStyles';
import CallIcon from '@icons/callIcon.svg';
import FillStarIcon from '@icons/fillStarIcon';
import HomeIcon from '@icons/HomeIcon.svg';
import IndustryDrawer from '@icons/Industry_Drawer.svg';
import Logout from '@icons/Logout.svg';
import QRIcon from '@icons/qr_code.svg';
import StarIcon from '@icons/starIcon';
import {ASYNC_STORAGE_APP_LANGUAGE} from '@resources/Constants';
import UserIcon from '@icons/userIcon.svg';
import FastImage from 'react-native-fast-image';
import {
  NAVIGATION_HOME,
  NAVIGATION_MY_POST,
  NAVIGATION_PROFILE_STACK,
  NAVIGATION_SCANNER,
  NAVIGATION_RESUME,
  NAVIGATION_RESUME_STACK,
} from '@navigation/NavigationKeys';
import SwitchSelector from 'react-native-switch-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_TOKEN, TEXT_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useState, useEffect} from 'react';
import {Alert, Image, Linking, View, ScrollView, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {CommonActions} from '@react-navigation/native';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import strings, {setAppLanguage} from '@resources/Strings';
import {GetPhotoBaseURL} from '@networking/Urls';
import {sendBtnClickToAnalytics} from '@utils/Util';

const handleSignOutNavigation = async (navigation) => {
  await navigation.navigate(NAVIGATION_HOME);
  // navigation.reset({
  //   index: 0,
  //   routes: [{name: 'Home'}],
  // });
};

export default function Drawer({navigation}) {
  const [languages, setLanguages] = useState(strings?.getLanguage());

  // useEffect(() => {
  //   async function appLanaguageFromStorage() {
  //     const appLanguage = await AsyncStorage.getItem(
  //       ASYNC_STORAGE_APP_LANGUAGE,
  //     );
  //     console.log('DEfault lnaguage called', appLanguage);
  //     setLanguages(appLanguage);
  //   }
  //   appLanaguageFromStorage();
  //   return () => console.log('Langugae Set from storage');
  // }, []);

  const BasicExample = () => (
    <MenuProvider style={{paddingHorizontal: 30, flex: 1}}>
      <View
        style={{
          borderRadius: 6,
        }}>
        <Text
          bold
          type={TEXT_TYPE.SMALL}
          style={{color: '#fff', marginVertical: 5}}>
          {languages}
        </Text>
      </View>
      <Menu
        onSelect={(value) => {
          alert(`Selected Language: ${value}`);
          setAppLanguage(value);
          setLanguages(value);
          handleSignOutNavigation(navigation);
          sendBtnClickToAnalytics('Changed App Language', value);
        }}>
        <MenuTrigger
          style={{
            marginTop: 5,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          text="Select Your Language"
        />
        <MenuOptions
          optionsContainerStyle={{
            padding: 10,
            margin: 10,
          }}>
          <ScrollView>
            <MenuOption
              optionsContainerStyle={{padding: 0}}
              value={'it'}
              text="Italian"
            />
            <MenuOption
              optionsContainerStyle={{padding: 0}}
              value={'en'}
              text="English"
            />
            <MenuOption
              optionsContainerStyle={{padding: 0}}
              value={'Hinglish'}
              text="Hinglish"
            />
            <MenuOption
              optionsContainerStyle={{padding: 0}}
              value={'en-US'}
              text="Hinglish"
            />
          </ScrollView>
        </MenuOptions>
      </Menu>
    </MenuProvider>
  );

  const {profileData} = useSelector((state) => state.ProfileReducer);
  // console.log('Profile data', profileData);
  const dispatch = useDispatch();

  const renderStar = () => {
    // let star = [1, 2, 3, 4, 5, 6, 7].map((data) => {
    let star = [1, 2, 3].map((data) => {
      return (
        <View key={`tab_${data}`}>
          {data <= parseInt(profileData?.profile_star || 0) ? (
            <FillStarIcon
              width={20}
              height={20}
              style={{marginHorizontal: 5}}
            />
          ) : (
            <StarIcon width={20} height={20} style={{marginHorizontal: 5}} />
          )}
        </View>
      );
    });
    return star;
  };

  const logout = async () => {
    await handleSignOutNavigation(navigation);
    console.log('Done navigation');

    // dispatch({
    //   type: 'SetToken',
    //   payload: {
    //     token: '',
    //   },
    // });
    await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN);
    console.log('Removed token');
    dispatch({
      type: 'Logout',
    });
  };

  const changeLanguageApi = (appLanguage) => {
    dispatch(
      callApi(
        'Language',
        URLs.CHANGE_APP_LANGUAGE,
        {
          app_lang: appLanguage,
        },
        async (response) => {
          console.log('APP lang changed to server', response.status);
          await AsyncStorage.multiSet([
            [ASYNC_STORAGE_APP_LANGUAGE, appLanguage],
          ]);
        },
      ),
    );
  };
  const {starsView} = localStyles;

  return (
    // <KeyboardAvoidingView behavior={ 'padding'} style={{{
    //   flex: 1,
    //   justifyContent: 'center',
    //   paddingHorizontal: 20,
    //   paddingTop: 20,
    // }}}>
    <ScrollView style={{backgroundColor: '#4B79D8', flexGrow: 1}}>
      <View style={{flexGrow: 1, backgroundColor: '#4B79D8', paddingTop: 10}}>
        <View style={{backgroundColor: '#2751A7'}}>
          <View
            style={{
              paddingTop: 10,
              paddingHorizontal: 10,
              width: '100%',
              flexDirection: 'row',
              marginVertical: 15,
            }}>
            <View style={{alignSelf: 'center'}}>
              <Circle
                type={'ProfileCircle'}
                circleColor={'#fff'}
                svg={
                  <FastImage
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      marginTop: 5,
                      alignItems: 'center',
                    }}
                    source={
                      profileData?.pic
                        ? {
                            uri: GetPhotoBaseURL() + profileData?.pic,
                            priority: FastImage.priority.normal,
                          }
                        : require('@icons/Image.png')
                    }
                  />
                }
              />
            </View>
            <View style={{flex: 1, marginLeft: 10, alignSelf: 'center'}}>
              <Text
                bold
                type={TEXT_TYPE.SMALL}
                style={{color: '#FFC003', marginVertical: 5}}>
                {/* {profileData?.fname || profileData?.lname
                  ? `${profileData?.fname} ${profileData?.lname}`
                  : 'Welcome User'} */}
                {profileData?.fname ? `${profileData?.fname}` : 'Welcome User'}
              </Text>
              <Text
                bold
                type={TEXT_TYPE.EXTRA_SMALL}
                style={{color: '#FFC003'}}>
                {profileData?.curr_city || profileData?.curr_state
                  ? `${profileData?.curr_city}, ${profileData?.curr_state}`
                  : 'Location Unavailable'}
              </Text>
              <View
                style={{
                  // paddingHorizontal: 10,
                  marginBottom: 5,

                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // borderWidth: 1,
                }}>
                <View style={starsView}>{renderStar()}</View>
              </View>
            </View>
          </View>
          {/* <View
            style={{
              paddingHorizontal: 10,
              marginBottom: 5,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
            }}>
            <View style={starsView}>{renderStar()}</View>
          </View> */}
        </View>
        <View style={{flex: 0.8}}>
          <TouchableOpacity
            onPress={() => navigation?.navigate(NAVIGATION_HOME)}
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 20}}>
              <HomeIcon />
            </View>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{color: '#fff', marginVertical: 5}}>
              {strings?.home}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation?.navigate(NAVIGATION_PROFILE_STACK)}
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 20}}>
              <UserIcon />
            </View>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{color: '#fff', marginVertical: 5}}>
              {strings?.myProfile}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NAVIGATION_RESUME_STACK, {
                screen: NAVIGATION_RESUME,
                params: {page: 0},
              })
            }
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 20}}>
              {/* <IndustryDrawer /> */}
              <Image
                source={require('@icons/Video.png')}
                resizeMode={'contain'}
                style={{height: 30, width: 25, tintColor: '#FFF'}}
              />
            </View>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{color: '#fff', marginVertical: 5}}>
              {strings?.videoResume}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation?.navigate(NAVIGATION_MY_POST)}
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 20}}>
              <IndustryDrawer />
            </View>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{color: '#fff', marginVertical: 5}}>
              {strings?.myPost}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
          style={{
            padding: 20,
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{marginRight: 20}}>
            <SettingsIcon />
          </View>
          <Text
            bold
            type={TEXT_TYPE.SMALL}
            style={{color: '#fff', marginVertical: 5}}>
            SETTING
          </Text>
        </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate(NAVIGATION_SCANNER, {time: '1230'});
              sendBtnClickToAnalytics('Scan Qr Code');
            }}
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 20}}>
              <QRIcon />
            </View>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{color: '#fff', marginVertical: 5}}>
              {strings?.qrScanner}
            </Text>
          </TouchableOpacity>
          <View
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '60%'}}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${1800222786}`);
                  sendBtnClickToAnalytics(`Sahyog Number Dial`);
                }}
                style={{
                  padding: 20,
                  marginHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{marginRight: 20}}>
                  <CallIcon />
                </View>
                <Text bold type={TEXT_TYPE.SMALL} style={{color: '#fff'}}>
                  {strings?.sahyog}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${1800222786}`)}
              style={{flex: 1, marginLeft: 10, alignSelf: 'center'}}>
              <Text bold type={TEXT_TYPE.TINY} style={{color: '#fff'}}>
                1800-222-786
              </Text>
              {/* <Text bold type={TEXT_TYPE.TINY} style={{color: '#fff'}}>
                Call from Phone
              </Text> */}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Alert!',
                'Are you sure you want to logout?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      logout();
                      sendBtnClickToAnalytics('Log out');
                    },
                  },
                ],
                {cancelable: false},
              );
            }}
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 20}}>
              <Logout />
            </View>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{color: '#fff', marginVertical: 5}}>
              {strings?.logout}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              padding: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}> */}
          {/* <View style={{marginRight: 20}}>
              <Logout />
            </View> */}

          <View style={{marginHorizontal: 25}}>
            <SwitchSelector
              options={[
                {label: 'English', value: 'en'},
                {label: 'Hinglish', value: 'HE'},
              ]}
              textColor={'black'} //'#7a44cf'
              selectedColor={'#FFF'}
              buttonColor={'#6190F1'}
              borderColor={'#6190F1'}
              // initial={0}
              initial={languages == 'HE' ? 1 : 0}
              onPress={(value) => {
                console.log(
                  `Call onPress with value: ${value}`,
                  languages,
                  languages == value,
                );
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
                setLanguages(value);
                setAppLanguage(value);
                changeLanguageApi(value);
              }}
            />
            {/* </TouchableOpacity> */}
          </View>
        </View>
      </View>
      <Text
        bold
        type={TEXT_TYPE.EXTRA_SMALL}
        style={{
          color: '#FFF',
          textAlign: 'center',
          marginBottom: 5,
          marginTop: 10,
        }}>
        Version {DeviceInfo.getVersion()}
      </Text>
    </ScrollView>
  );
}
