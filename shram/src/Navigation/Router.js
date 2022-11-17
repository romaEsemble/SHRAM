import AddFriend from '@addFriend/AddFriend';
import Adhikar from '@adhikar/Adhikar';
import Assessment from '@assessment/Assessment';
import Bookmark from '@bookmark/Bookmarks';
import Chat from '@chat/Chat';
import AddPost from '@createPost/AddPost';
import CreatePost from '@createPost/CreatePost';
import Drawer from '@drawer/Drawer';
import Home from '@home/Home';
import AddIcon from '@icons/addIcon.svg';
import Home_light from '@icons/Home_light.svg';
import Home_solid from '@icons/Home_solid.svg';
import JobLight from '@icons/JobLight.svg';
import JobSolid from '@icons/JobSolid.svg';
import UserProfileLight from '@icons/userProfileLight.svg';
import UserProfileSolid from '@icons/userProfileSolid.svg';
import PostAddLight from '@icons/postAddLight.svg';
import PostAddSolid from '@icons/postAddSolid.svg';
import AdhikarIcon from '@icons/AdhikarNav.svg';
import ParivarIcon from '@icons/ParivarIcon.svg';
import RojgarIcon from '@icons/RojgarIcon.svg';
import ShikshaIcon from '@icons/ShikshaIcon.svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import LoaderScreen from '@loaderScreen/LoaderScreen';
import CongratulationScreen from '@login/CongratulationScreen';
import Login from '@login/Login';
import MyPost from '@myPost/MyPost';
import * as NAVIGATION_KEYS from '@navigation/NavigationKeys';
import Notification from '@notification/Notification';
import Parivar from '@parivar/Parivar';
import AddressDetail from '@profile/AddressDetail';
import Documents from '@profile/Documents';
import EducationalDetail from '@profile/EducationalDetail';
import HealthDetail from '@profile/HealthDetail';
import NewPersonalDetails from '@profile/NewPersonalDetails';
import PersonalDetail from '@profile/PersonalDetail';
import ProfessionalDetail from '@profile/ProfessionalDetail';
import SkillDetail from '@profile/SkillDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Photo from '@resume/Photo';
import Resume from '@resume/Resume';
import Video from '@resume/Video';
import Rojgar from '@rojgar/Rojgar';
import VideoPage from '@rojgar/VideoPage';
import Samachar from '@samachar/Samachar';
import QRScanner from '@scanner/QRScanner';
import SelectProfile from '@selectProfile/SelectProfile';
import Shiksha from '@shiksha/Shiksha';
import Signup from '@signup/Signup';
import WalkThroughOnBoarding from '@walkthroughOnBoarding/WalkthroughOnBoarding';
import WebLogin from '@webLogin/WebLogin';
import React, {useEffect, useState, useRef} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import FriendDetail from '@friendDetail/FriendDetail';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import strings from '@resources/Strings';
// import linking from '../linking.js';
import {ASYNC_STORAGE_TOKEN, TEXT_TYPE} from '@resources/Constants';
import {showSnackBar} from '@utils/Util';
import analytics from '@react-native-firebase/analytics';
import {sendBtnClickToAnalytics} from '@utils/Util';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const AdhikarStack = createStackNavigator();
const ShikshaStack = createStackNavigator();
const RojgarStack = createStackNavigator();

const ParivarStack = createStackNavigator();
const DrawerStack = createDrawerNavigator();
const ProfileStack = createStackNavigator();
const ResumeStack = createStackNavigator();
const MainStack = createStackNavigator();

function MyTabBar({state, descriptors, navigation}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#E9F0FF',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;
        const icons = (name, isFocused) => {
          // if (name == NAVIGATION_KEYS.NAVIGATION_HOME) {
          if (name == NAVIGATION_KEYS.NAVIGATION_HOME) {
            return isFocused ? (
              <Home_solid stoke={isFocused ? '#4B79D8' : '#828282'} />
            ) : (
              <Home_light stoke={isFocused ? '#4B79D8' : '#828282'} />
            );
            {
              /* <AdhikarIcon stoke={isFocused ? '#4B79D8' : '#828282'} />; */
            }
          } else if (name == NAVIGATION_KEYS.NAVIGATION_SHIKSHA) {
            return isFocused ? (
              <Home_solid stoke={isFocused ? '#4B79D8' : '#828282'} />
            ) : (
              <Home_light stoke={isFocused ? '#4B79D8' : '#828282'} />
            );
            /* <ShikshaIcon stoke={isFocused ? '#4B79D8' : '#828282'} />; */
          } else if (name == NAVIGATION_KEYS.NAVIGATION_ROJGAR_STACK) {
            return <RojgarIcon stoke={isFocused ? '#4B79D8' : '#828282'} />;
          } else if (name == NAVIGATION_KEYS.NAVIGATION_PROFILE) {
            return isFocused ? (
              <UserProfileSolid stoke={isFocused ? '#4B79D8' : '#828282'} />
            ) : (
              <UserProfileLight stoke={isFocused ? '#4B79D8' : '#828282'} />
            );
          } else if (name == NAVIGATION_KEYS.NAVIGATION_CREATE_POST) {
            return isFocused ? (
              <PostAddSolid size={24} />  
            ) : (
              <PostAddLight />
            );
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        {
          if (route.name === NAVIGATION_KEYS.NAVIGATION_HOME) return;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopColor: '#4B79D8',
                borderTopWidth: isFocused ? 1 : 0,
              }}>
              <View
                style={{
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                {icons(route.name, isFocused)}
              </View>
              {route.name !== NAVIGATION_KEYS.NAVIGATION_ADD &&
                (route.name !== NAVIGATION_KEYS.NAVIGATION_ROJGAR_STACK ? (
                  <Text
                    style={{
                      color: isFocused ? '#4B79D8' : '#333',
                      fontSize: 12,
                    }}>
                    {route.name}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: isFocused ? '#4B79D8' : '#333',
                      fontSize: 13,
                    }}>
                    {strings?.rojgar}
                  </Text>
                ))}
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
}
const AppStackNavigator = () => {
  return (
    <DrawerStack.Navigator
      drawerContent={(props) => <Drawer {...props} />}
      initialRouteName={NAVIGATION_KEYS.NAVIGATION_DRAWER}>
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_DRAWER}
        component={MainScreen}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_PROFILE_STACK}
        component={ProfileScreens}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_SAMACHAR}
        component={Samachar}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_BOOKMARK}
        component={Bookmark}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_NOTIFICATION}
        component={Notification}
        options={{headerShown: false}}
      />

      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_CREATE_POST}
        component={CreatePost}
        options={{headerShown: false}}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_ADD_POST}
        component={AddPost}
        options={{headerShown: false}}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_MY_POST}
        component={MyPost}
        options={{headerShown: false}}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_SCANNER}
        component={QRScanner}
        options={{headerShown: false}}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_RESUME_STACK}
        options={{headerShown: false}}
        component={ResumeScreens}
      />
      <DrawerStack.Screen
        name={'addFriend'}
        component={AddFriend}
        options={{headerShown: false}}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_FRIEND_DETAIL}
        component={FriendDetail}
        options={{headerShown: false}}
      />
      <DrawerStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_FRIEND_CHAT}
        options={{headerShown: false}}
        component={Chat}
      />
      <DrawerStack.Screen
        name={'VideoPage'}
        options={{headerShown: false}}
        component={VideoPage}
      />
    </DrawerStack.Navigator>
  );
};

const MainScreen = () => {
  return (
    <AppStack.Navigator initialRouteName="Tab">
      <AppStack.Screen
        name="Tab"
        options={{headerShown: false}}
        component={MyTabs}
      />
    </AppStack.Navigator>
  );
};
const AdhikarScreens = () => {
  return (
    <AdhikarStack.Navigator initialRouteName="Adhikar">
      <AdhikarStack.Screen
        name="Adhikar"
        options={{headerShown: false}}
        component={Adhikar}
      />
    </AdhikarStack.Navigator>
  );
};
const ShikshaScreens = () => {
  return (
    <ShikshaStack.Navigator initialRouteName="Shiksha">
      <ShikshaStack.Screen
        name="Shiksha"
        options={{headerShown: false}}
        component={Shiksha}
      />
    </ShikshaStack.Navigator>
  );
};
const RojgarScreens = () => {
  return (
    <RojgarStack.Navigator initialRouteName={NAVIGATION_KEYS.NAVIGATION_ROJGAR}>
      <RojgarStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_ROJGAR}
        options={{headerShown: false}}
        component={Rojgar}
      />
    </RojgarStack.Navigator>
  );
};
const ParivarScreens = () => {
  return (
    <ParivarStack.Navigator initialRouteName="Parivar">
      <ParivarStack.Screen
        name="Parivar"
        options={{headerShown: false}}
        component={Parivar}
      />
    </ParivarStack.Navigator>
  );
};
{
  /*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */
}
const ProfileScreens = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName={NAVIGATION_KEYS.NAVIGATION_PROFILE}
      >
      <ProfileStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_PROFILE}
        options={{headerShown: false}}
        component={NewPersonalDetails}
      />
      <ProfileStack.Screen
        name="NewPersonalDetails"
        options={{headerShown: false}}
        component={NewPersonalDetails}
      />
      {/* <ProfileStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_PROFILE}
        options={{headerShown: false}}
        component={PersonalDetail}
      />
      <ProfileStack.Screen
        name="PersonalDetail"
        options={{headerShown: false}}
        component={PersonalDetail}
      /> */}
      {/* <ProfileStack.Screen
        name="AddressDetail"
        options={{headerShown: false}}
        component={AddressDetail}
      /> */}
      <ProfileStack.Screen
        name="ProfessionalDetail"
        options={{headerShown: false}}
        component={ProfessionalDetail}
      />
      {/* <ProfileStack.Screen
        name="SkillDetail"
        options={{headerShown: false}}
        component={SkillDetail}
      /> */}
      {/* <ProfileStack.Screen
        name="EducationalDetail"
        options={{headerShown: false}}
        component={EducationalDetail}
      /> */}
      {/* <ProfileStack.Screen
        name="HealthDetail"
        options={{headerShown: false}}
        component={HealthDetail}
      /> */}
      <ProfileStack.Screen
        name="Documents"
        options={{headerShown: false}}
        component={Documents}
      />
    </ProfileStack.Navigator>
  );
};

const ResumeScreens = () => {
  return (
    <ResumeStack.Navigator initialRouteName={NAVIGATION_KEYS.NAVIGATION_RESUME}>
      <ResumeStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_RESUME}
        options={{headerShown: false}}
        component={Resume}
      />
      <ResumeStack.Screen
        name="Video"
        options={{headerShown: false}}
        component={Video}
      />
      <ResumeStack.Screen
        name="Photo"
        options={{headerShown: false}}
        component={Photo}
      />
      <ResumeStack.Screen
        name="Assessment"
        options={{headerShown: false}}
        component={Assessment}
      />

      <ResumeStack.Screen
        name="Documents"
        options={{headerShown: false}}
        component={Documents}
      />
      <ResumeStack.Screen
        name={'VideoPage'}
        options={{headerShown: false}}
        component={VideoPage}
      />
    </ResumeStack.Navigator>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      lazy={true}
      optimizationsEnabled={true}
      tabBar={(props) => (
        <>
          <MyTabBar {...props} />
        </>
      )}
      tabBarOptions={{
        showLabel:false
      }}>
      <Tab.Screen
        name={NAVIGATION_KEYS.NAVIGATION_HOME}
        component={Home}
        options={{headerShown: false}}
      />
      <Tab.Screen name={strings?.samajhdar} component={AdhikarScreens} />
      <Tab.Screen
        name={NAVIGATION_KEYS.NAVIGATION_SHIKSHA}
        component={ShikshaScreens}
      />
      <Tab.Screen
        name={NAVIGATION_KEYS.NAVIGATION_CREATE_POST}
        component={CreatePost}
      />
      <Tab.Screen
        name={NAVIGATION_KEYS.NAVIGATION_ROJGAR_STACK}
        component={RojgarScreens}
      />
      <Tab.Screen
        name={NAVIGATION_KEYS.NAVIGATION_PROFILE}
        // component={ParivarScreens}
        component={ProfileScreens}
      />
    </Tab.Navigator>
  );
}

const authNavigator = (currRoute) => {
  return (
    <AuthStack.Navigator initialRouteName={currRoute}>
      <AuthStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_WALK_THROUGH_ONBOARDING}
        options={{headerShown: false}}
        component={WalkThroughOnBoarding}
      />
      <AuthStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_SELECT_PROFILE}
        component={SelectProfile}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_WEB_LOGIN}
        component={WebLogin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_SIGNUP}
        component={Signup}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={NAVIGATION_KEYS.NAVIGATION_CONGRATULATION_SCREEN}
        component={CongratulationScreen}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
};

const config = {
  screens: {
    Drawer: {
      screens: {
        Tab: {
          screens: {
            Rojgar_Stack: {
              screens: {
                // Rojgar: 'rojgar/:job_id',
                Rojgar: 'shared-job-post',
                parse: {
                  a: (a) => `${a}`,
                },
                exact: true,
              },
            },
            Home: {
              screens: {
                Home: 'shared-post-content',
                parse: {
                  a: (a) => `${a}`,
                },
                exact: true,
              },
            },
          },
        },
      },
    },
    FriendDetail: 'shared-profile',
    // FriendDetail: 'shared-profile/:user_id',
    parse: {
      a: (a) => `${a}`,
    },
    exact: true,
    NotFound: '*',
  },
};

// NAVIGATION_KEYS.NAVIGATION_DRAWER
// Tab
// NAVIGATION_KEYS.NAVIGATION_ROJGAR_STACK
// NAVIGATION_KEYS.NAVIGATION_ROJGAR

const linking = {
  // https://shram.com/'
  // prefixes: ['https://shram.com/'],
  prefixes: ['http://www.khojtalent.com/'],
  config,
};

function Navigator() {
  const [currRoute, setCurrRoute] = useState(false);
  const [token, setToken] = useState(null);

  const states = useSelector((state) => state.CommonReducer);
  const {initialLoading, userToken} = states;
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  useEffect(() => {
    (async () => {
      const firstTime = await AsyncStorage.getItem('FirstTime');
      const tokenFromAsync = await AsyncStorage.getItem(ASYNC_STORAGE_TOKEN);
      setToken(tokenFromAsync);
      console.log(
        'They are token',
        firstTime,
        userToken,
        initialLoading,
        currRoute,
      );
      console.log('ISTRUE', currRoute === true, !initialLoading === true);
      firstTime === 'No'
        ? setCurrRoute(NAVIGATION_KEYS.NAVIGATION_LOGIN)
        : setCurrRoute(NAVIGATION_KEYS.NAVIGATION_WALK_THROUGH_ONBOARDING);
    })();
  }, [token, userToken]);
  return (
    <NavigationContainer
      ref={navigationRef}
      // onReady={() => {
      //   routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      // }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        console.log(
          '#############Changed####################',
          currentRouteName,
          previousRouteName,
        );
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      linking={linking}
      fallback={<Text>Loading...</Text>}>
      {/* {currRoute && !initialLoading ? ( */}
      {currRoute && !initialLoading ? (
        token || userToken ? (
          AppStackNavigator()
        ) : (
          authNavigator(currRoute)
        )
      ) : (
        <LoaderScreen />
      )}
    </NavigationContainer>
  );
}
export default Navigator;
