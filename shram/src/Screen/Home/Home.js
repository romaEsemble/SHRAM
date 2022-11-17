import FlatList from '@flatList/FlatList';
import Close from '@icons/close.svg';
import localStyles from '@home/HomeStyles';
import {
  NAVIGATION_ROJGAR,
  NAVIGATION_ROJGAR_STACK,
  NAVIGATION_MY_POST,
  NAVIGATION_FRIEND_CHAT,
} from '@navigation/NavigationKeys';
import {CURRENT_API_ENVIRONMENT, URLs, ENV_STAGING} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {apiCall as api} from '@networking/withAPI';
import {FEED, PROFILE, GET_UPLOADED_DOCS, RECOMMEND_JOB} from '@redux/Types';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useRoute, CommonActions} from '@react-navigation/native';
import {
  FlatList as FeedList,
  Image,
  InteractionManager,
  View,
  Button,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Home({navigation}) {
  var contentId = 0;
  var apiRes;
  var cou = 0;
  const route = useRoute();
  const [content_id, setContentId] = useState(0);
  // const {content_id} = route?.params;
  try {
    const contentId = route?.params?.params?.a || 0;
    // content_id = contentId || 10;
    if (contentId !== 0 && content_id !== route?.params?.params?.a) {
      setContentId(contentId);
      navigation.dispatch(CommonActions.setParams({params: {a: 0}}));
    }
  } catch (error) {
    contentId = 0;
  }

  const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log('Exec');
  //   async function name(params) {
  //     await analytics().logScreenView({
  //       screen_name: 'Home',
  //       screen_class: 'Home',
  //     });
  //   }
  //   name('KV');
  // }, []);
  useEffect(() => {
    sendAppData();
  }, []);
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      getRecommendJobList();
      getUserData();
      getUserDocs();
    });
    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    return () => {
      OneSignal.removeEventListener('received', onReceived);
      OneSignal.removeEventListener('opened', onOpened);
      interactionPromise.cancel();
    };
  }, [route?.params?.params?.a]);

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA));
  };

  const sendAppData = async () => {
    // ExtraDetails to be sent with app login
    let appVersion = DeviceInfo.getVersion();
    let brand = DeviceInfo.getBrand();
    let systemVersion = DeviceInfo.getSystemVersion();
    let systemName = DeviceInfo.getSystemName();
    let ram = null;
    await DeviceInfo.getTotalMemory().then((totalMemory) => {
      console.log('#mem', totalMemory);
      ram = (totalMemory / 1073741824).toFixed(2);
    });
    let batteryPercentage = null;
    await DeviceInfo.getBatteryLevel().then((batteryLevel) => {
      batteryPercentage = batteryLevel * 100;
    });
    let freeStorage = null;
    await DeviceInfo.getFreeDiskStorage().then((freeDiskStorage) => {
      freeStorage = (freeDiskStorage / 1073741824).toFixed(2);
    });
    console.log('Detail', appVersion, brand, systemVersion, {
      envinfo:
        CURRENT_API_ENVIRONMENT === ENV_STAGING ? 'TEST#KHOJ' : 'PROD#KHOJ',
      versioninfo: `APP#${appVersion}`,
      otherinfo: JSON.stringify({
        brand,
        systemVersion,
        systemName,
        ram,
        batteryPercentage,
        freeStorage,
      }),
    });
    let {apiSuccess, data} = await api(URLs.SET_USERINFO, {
      envinfo:
        CURRENT_API_ENVIRONMENT === ENV_STAGING ? 'TEST#KHOJ' : 'PROD#KHOJ',
      versioninfo: `APP#${appVersion}`,
      otherinfo: JSON.stringify({
        brand,
        systemVersion,
        systemName,
        ram,
        batteryPercentage,
        freeStorage,
      }),
    });
    console.log('Api success', apiSuccess);

    // dispatch(
    //   callApi('Userinfo', URLs.SET_USERINFO, {
    //     envinfo:
    //       CURRENT_ENVIRONMENT === 'Testing Server'
    //         ? 'TEST#KHOJ'
    //         : 'PROD#KHOJ',
    //     versioninfo: `APP#${appVersion}`,
    //     otherinfo: {
    //       brand,
    //       systemVersion,
    //       systemName,
    //       ram,
    //       batteryPercentage,
    //       freeStorage,
    //     },
    //   }),
    // );
  };

  const replaceKey = (o, old_key, new_key) => {
    if (old_key !== new_key) {
      Object.defineProperty(
        o,
        new_key,
        Object.getOwnPropertyDescriptor(o, old_key),
      );
      delete o[old_key];
      return o;
      // console.log('Object', o);
    }
  };

  let onReceived = (message) => {
    console.log('recieved', message);
  };
  var onOpened = (openResult) => {
    var data = JSON.parse(openResult.notification.payload.rawPayload);
    const str = JSON.parse(openResult.notification.payload.rawPayload);
    const msg = openResult?.notification?.payload?.body;

    const finalData = JSON.parse(str.custom);
    const jobStatus = finalData?.a?.status;

    console.log('Push Notifcaion Home');
    console.log(finalData);

    switch (finalData?.a?.module) {
      case 'message':
        var obj = replaceKey(finalData?.a, 'to_shramik_id', 'shramik_id');
        obj = replaceKey(obj, 'from_shramik_id', 'frnd_shramik_id');
        console.log('new Object', obj);
        navigation.navigate(NAVIGATION_FRIEND_CHAT, {
          item: obj,
        });
        // navigation.navigate(NAVIGATION_FRIEND_CHAT, {
        //   item: {frnd_shramik_id: finalData?.a?.from_shramik_id},
        // });
        break;

      case 'friend_list':
        navigation.navigate('addFriend', {type: 'contact'});
        break;

      case 'job_post':
        navigation.navigate(NAVIGATION_ROJGAR_STACK, {
          screen: NAVIGATION_ROJGAR,
          params: {jobStatus: jobStatus},
        });
        break;

      case 'job_offer':
        navigation.navigate(NAVIGATION_ROJGAR_STACK, {
          screen: NAVIGATION_ROJGAR,
          params: {jobStatus: jobStatus},
        });
        break;

      case 'post_list':
        navigation?.navigate(NAVIGATION_MY_POST, {
          status: msg,
        });
        break;

      default:
        break;
    }
  };

  const getUserDocs = () => {
    dispatch(
      callApi(
        GET_UPLOADED_DOCS,
        URLs.GET_DOCS,
        {
          doc_type: 'other',
        },
        (data) => {},
      ),
    );
  };

  const getRecommendJobList = () => {
    dispatch(callApi(RECOMMEND_JOB, URLs.RECOMMEND_JOB, {}));
  };

  const flatListHeader = () => {
    return (
      <>
      
        {/* {route?.params?.params?.a !== 0 &&
        route?.params?.params?.a !== undefined ? (
          <View style={{flexDirection: 'row', marginHorizontal: 5}}>
            <View
              style={{
                borderRadius: 15,
                elevation: 6,
                paddingHorizontal: 5,
                paddingVertical: 5,
                marginTop: 5,
                marginHorizontal: 5,
                backgroundColor: '#4B79D8',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  marginHorizontal: 5,
                  color: '#fff',
                }}>
                Job Id: {content_id}
              </Text>
              <TouchableOpacity
                style={{padding: 2}}
                onPress={() => {
                  console.log('pressed out');
                  navigation.dispatch(CommonActions.setParams({content_id: 0}));
                  if (content_id !== 0) {
                    console.log('pressed', content_id, route);
                    setContentId(0);
                  }
                  // this.setState({refresh: true});
                }}>
                <Close height={18} width={18} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null} */}
        {recommendJobData?.length > 0 && (
          <View
            style={{
              padding: 10,
              margin: 6,
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 5,
              shadowColor: '#fff',
              shadowOffset: {width: 1, height: 5},
              elevation: 5,
              backgroundColor: '#fff',
            }}>
            <Text style={{color: '#2751A7', fontSize: 20}}>
              RECOMMENDED JOBS
            </Text>
            <FeedList
              data={recommendJobData}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={({item, index}) => {
                const {
                  job_id,
                  job_title,
                  noofposition,
                  job_type,
                  job_from,
                  location,
                } = item;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(NAVIGATION_ROJGAR_STACK, {
                        screen: NAVIGATION_ROJGAR,
                        params: {job_id},
                      });
                      sendBtnClickToAnalytics('Job Recommend Card');
                    }}>
                    <View
                      style={{
                        width: 250,
                        marginRight: 5,
                        backgroundColor: '#D5E0F6',
                        borderWidth: 1,
                        borderColor: '#D5E0F6',
                        borderRadius: 10,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={require('@icons/recommendJobFlower.png')}
                          style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            top: 0,
                            bottom: 0,
                          }}
                        />
                      </View>
                      <View style={textStyle}>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            flex: 1,
                          }}>
                          Job Title
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            fontWeight: 'bold',
                            flex: 1,
                          }}>
                          {job_title}
                        </Text>
                      </View>
                      <View style={textStyle}>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            flex: 1,
                          }}>
                          No.of Position
                        </Text>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            fontWeight: 'bold',
                            flex: 1,
                          }}>
                          {noofposition}
                        </Text>
                      </View>
                      <View style={textStyle}>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            flex: 1,
                          }}>
                          Type
                        </Text>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            fontWeight: 'bold',
                            flex: 1,
                          }}>
                          {parseInt(job_type || 0, 10) === 1
                            ? 'Contract'
                            : parseInt(job_type || 0, 10) === 2
                            ? 'Permanent'
                            : '-'}
                        </Text>
                      </View>
                      <View style={textStyle}>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            flex: 1,
                          }}>
                          Start Date
                        </Text>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            fontWeight: 'bold',
                            flex: 1,
                          }}>
                          {job_from
                            ? moment(job_from).format('DD MMM YYYY')
                            : null}
                        </Text>
                      </View>
                      <View style={textStyle}>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            flex: 1,
                          }}>
                          Location
                        </Text>
                        <Text
                          style={{
                            color: '#676666',
                            fontSize: 12,
                            fontWeight: 'bold',
                            flex: 1,
                          }}>
                          {location}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </>
    );
  };

  const resetit = (params) => {
    navigation.dispatch(CommonActions.setParams({params: {a: 0}}));
  };

  const {textStyle} = localStyles;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0000001A',
      }}>
      <FlatList
        action={FEED}
        navigation={navigation}
        type="home"
        title="Homes"
        contentId={
          route?.params?.params?.a !== 0
            ? route?.params?.params?.a?.replace(' ', '+')
            : 0
        }
        // resetit={resetit}
      />
      {/* <Button
        title="Click Me"
        onPress={async () => {
          console.log('Clicked');
          sendBtnClickToAnalytics('Parivar');
        }}
      /> */}
    </View>
  );
}
