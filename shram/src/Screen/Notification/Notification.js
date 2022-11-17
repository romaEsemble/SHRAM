import Header from '@header/Header';
import MsgIcons from '@icons/iconMsg.svg';
import NotificationIcon from '@icons/NotificationIcon.svg';
import ReplyIcons from '@icons/replyIcon.svg';
import {URLs} from '@networking/Urls';
import localStyles from '@notification/NotificationStyle';
import {callApi} from '@redux/CommonDispatch.js';
import {NOTIFICATION} from '@redux/Types';
import strings, {earlierTitle, todayTitle} from '@resources/Strings';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  NAVIGATION_FRIEND_CHAT,
  NAVIGATION_ROJGAR_STACK,
  NAVIGATION_MY_POST,
  NAVIGATION_ROJGAR,
} from '@navigation/NavigationKeys';
import moment from 'moment';
import {sendBtnClickToAnalytics} from '@utils/Util';

function Notification(props) {
  const {todayNoti, earlierNoti, loading, errorMessage} = useSelector(
    (state) => state.NotificationReducer,
  );
  console.log('today Notifcation', todayNoti);
  // console.log('early Notifcation', earlierNoti);
  const [showToday, setShowToday] = useState(true);
  const [showEarlier, setShowEarlier] = useState(false);

  const {navigation} = props;
  const dispatch = useDispatch();
  // useEffect(() => {
  //   getData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();

      return () => console.log('Leaved Noti');
    }, []),
  );

  const getData = () => {
    dispatch(callApi(NOTIFICATION, URLs.NOTIFICATION, {}));
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
  const onPress = (user_id, noti_type, item) => {
    sendBtnClickToAnalytics('Clicked In-app Notification');
    const dataForNavigation = JSON.parse(item?.data);
    const msg = item?.msg;
    const jobStatus = dataForNavigation?.status;
    const jobUserId = dataForNavigation?.job_user_id;
    console.log(
      'Noti type is',
      noti_type,
      dataForNavigation?.status,
      item,
      jobUserId,
    );
    // return false;

    switch (noti_type) {
      case 'message':
        var obj = replaceKey(dataForNavigation, 'to_shramik_id', 'shramik_id');
        obj = replaceKey(obj, 'from_shramik_id', 'frnd_shramik_id');
        console.log('new Object', obj);
        navigation.navigate(NAVIGATION_FRIEND_CHAT, {
          item: obj,
        });
        break;

      case 'friend_list':
        navigation.navigate('addFriend', {type: 'contact'});
        break;

      case 'job_post':
        navigation.navigate(NAVIGATION_ROJGAR_STACK, {
          screen: NAVIGATION_ROJGAR,
          params: {jobStatus: jobStatus, jobUserId: jobUserId},
        });
        break;

      case 'job_offer':
        navigation.navigate(NAVIGATION_ROJGAR_STACK, {
          screen: NAVIGATION_ROJGAR,
          params: {jobStatus: jobStatus, jobUserId: jobUserId},
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
  const todayClickHandler = () => {
    if (showToday) {
      setShowToday(false);
    } else {
      setShowToday(true);
      setShowEarlier(false);
    }
  };

  const earlierClickHandler = () => {
    if (showEarlier) {
      setShowEarlier(false);
    } else {
      setShowToday(false);
      setShowEarlier(true);
    }
  };

  const notidata = (data) => {
    const {
      flex1,
      notimsg,
      notiRaised,
      sideDots,
      sideDotsPlacement,
      notiView,
      flex2,
    } = localStyles;
    if (!loading && (errorMessage || !data?.length)) {
      return (
        <Text style={{textAlign: 'center'}}>{strings?.noNotifications}</Text>
      );
    }

    return (
      <View>
        <FlatList
          keyExtractor={(item, index) => 'noti_' + index}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({item, index}) => {
            // console.log(
            //   'Prev date',
            //   moment(data[index == 0 ? 0 : index - 1]?.createdAt).format(
            //     'DD-MM-YYYY',
            //   ),
            //   index,
            // );

            // console.log(
            //   'Curr date',
            //   moment(item?.createdAt).format('DD-MM-YYYY'),
            // );

            const prevDate = moment(
              data[index == 0 ? 0 : index - 1]?.createdAt,
            ).format('DD-MM-YYYY');

            var a = moment(
              moment(data[index == 0 ? 0 : index - 1]?.createdAt),
            ).format('DD-MM-YYYY');
            var b = moment(moment(item?.createdAt)).format('DD-MM-YYYY');
            // var difference = a.diff(b, 'days'); // 1
            // console.log('Diff', a, b, a == b);
            return (
              <View>
                {item?.today == 0 && (a != b || index == 0) && (
                  <TouchableOpacity
                    style={headerView}
                    //   onPress={() => earlierClickHandler()}
                  >
                    <Text bold style={notiHeader}>
                      {moment(item?.createdAt).format('DD-MM-YYYY')}
                    </Text>
                    {/* {showEarlier ? (
            <DownArrow height={25} width={25} fill={'#000'} />
          ) : (
            <SideArrow height={25} width={25} fill={'#000'} />
          )} */}
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => onPress(item?.user_id, item?.noti_type, item)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 5,
                    shadowColor: '#fff',
                    shadowOffset: {width: 1, height: 5},
                    elevation: 5,
                    backgroundColor: '#fff',
                    margin: 10,
                    padding: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View>
                      {item.noti_type === 'reply' ? (
                        <MsgIcons width={50} height={50} />
                      ) : (
                        <NotificationIcon width={50} height={50} />
                      )}
                    </View>

                    <View
                      style={{
                        //   flexDirection: 'row',
                        width: '100%',
                        //   justifyContent: 'space-between',
                        paddingHorizontal: 10,
                      }}>
                      <View
                        style={{
                          //   flexDirection: 'row',
                          width: '100%',
                          flexDirection: 'row',
                        }}>
                        <Text style={notimsg}>{item.msg}</Text>
                        <Text
                          style={{
                            width: '30%',
                            fontSize: 14,
                            color: '#6F6F6F',
                          }}>
                          {moment(item?.createdAt).format('hh:mm A')}
                          {/* {item.raised} */}
                        </Text>
                      </View>
                      {/* <Text light style={notiRaised}>
                      {
                        'Your job application has been received and short listed for the job '
                      }
                    </Text> */}
                    </View>
                  </View>
                  {/* {item.noti_type === 'reply' ? (
                  <TouchableOpacity>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: '#DFE0EB',
                        marginTop: 5,
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <ReplyIcons width={25} height={25} />
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#EBB000',
                          marginHorizontal: 5,
                        }}>
                        REPLY
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null} */}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  };
  const {notiHeader, headerView, flex1} = localStyles;
  return (
    <>
      <Header showNotification showCall showDrawer />

      <ScrollView style={flex1}>
        <View>
          <TouchableOpacity
            style={headerView}
            //   onPress={debounce(() => todayClickHandler())}
          >
            <Text bold style={notiHeader}>
              {strings?.today}
            </Text>
            {/* {showToday ? (
            <DownArrow height={25} width={25} fill={'#000'} />
          ) : (
            <SideArrow height={25} width={25} fill={'#000'} />
          )} */}
          </TouchableOpacity>
          {notidata(todayNoti)}
        </View>
        <View style={[flex1]}>
          <TouchableOpacity
            style={headerView}
            //   onPress={debounce(() => todayClickHandler())}
          >
            <Text bold style={notiHeader}>
              {strings?.pastNotification}
            </Text>
            {/* {showToday ? (
            <DownArrow height={25} width={25} fill={'#000'} />
          ) : (
            <SideArrow height={25} width={25} fill={'#000'} />
          )} */}
          </TouchableOpacity>
          {notidata(earlierNoti)}
        </View>
      </ScrollView>
    </>
  );
}
export default Notification;
