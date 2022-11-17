import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import Header from '@header/Header';
import CircleContactIcon from '@icons/noContactIcon.svg';
import {INPUT_TYPE_OTHER} from '@resources/Constants';
import {postTextValidation} from '@resources/Validate';
import Text from '@textView/TextView';
import React, {useState, useEffect} from 'react';
import Next from '@icons/nextIcon.svg';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useBackHandler} from '@react-native-community/hooks';

import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
  ToastAndroid,
  Platform,
  AlertIOS,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
window.navigator.userAgent = 'react-native';
// ES6 import
import io from 'socket.io-client';
import {URLs, GetBaseURL} from '@networking/Urls';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {
  GET_CHAT_HISTORY,
  UPDATE_CHAT_HISTORY,
  DELETE_CHAT_HISTORY,
  READ_MESSAGE,
  SELECT_CHATS,
  UNSELECT_CHATS,
} from '@redux/Types';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {callApi} from '@redux/CommonDispatch.js';
import {useNavigation} from '@react-navigation/native';
import {sendBtnClickToAnalytics} from '@utils/Util';
import {filter} from 'lodash';
var Token = null;

export default function Chat({route}) {
  const {item} = route?.params;
  // console.log('Item is', item);
  const navigation = useNavigation();

  // Handling Navigation from Diffrent pages
  const friendShramikId =
    'city' in item ? item?.shramik_id : item?.frnd_shramik_id; //

  const [chatHistory, setChatHistory] = useState([]);
  const [contactsLoader, setContactsLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const dispatch = useDispatch();

  const {isSelected, chatsSelected, getChatHistoryLoading, getChatHistoryData} =
    useSelector((state) => state.ChatHistoryReducer);

  const {profileData, profileLoading} = useSelector(
    (state) => state.ProfileReducer,
  );

  var my_shramik_id = 'city' in item ? 0 : item?.shramik_id;
  {
    /*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */
  }
  // var myName = `${profileData?.fname} ${profileData?.mname} ${profileData?.lname}`;
  var myName = `${profileData?.fname}`;
  // const friendName = item?.fname
  //   ? `${item?.fname ? item?.fname : ''} ${item.mname ? item.mname : ''} ${
  //       item.lname ? item.lname : ''
  //     }`
  //   : item?.mobile;
  const friendName = item?.fname
    ? `${item?.fname ? item?.fname : ''}`
    : item?.mobile;

  const city = `${
    item?.city || item?.curr_city ? item?.city || item?.curr_city + ',' : ''
  } ${item?.state || item?.curr_state ? item?.state || item?.curr_state : ''}`;

  if (getChatHistoryData?.items?.length > 0) {
    my_shramik_id =
      friendShramikId === getChatHistoryData?.items[0].from_shramik_id
        ? getChatHistoryData?.items[0].to_shramik_id
        : getChatHistoryData?.items[0].from_shramik_id;
  }

  // console.log('Getchat history', getChatHistoryData);
  // console.log('My id', my_shramik_id, friendShramikId);

  useEffect(() => {
    deleteChat();
    hitApi(friendShramikId);
    token();

    return () => {
      // console.log('LEavin goage');
      // socket.disconnect('', () => {
      //   // console.log('Disconnected');
      // });
    };
  }, [route?.params]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // const unsubscribe = API.subscribe(userId, user => setUser(user));

  //     return () => {
  //       console.log('leaving');
  //       socket.emit('forceDisconnect');
  //       // socket.disconnect();
  //     };
  //   }, []),
  // );

  const disconnectSocket = async () => {
    // console.log('LEave that discoonec');
    try {
      await socket.emit('forceDisconnect');
      setRefresh(true);
    } catch (err) {
      console.log('catch is', err);
    }

    // navigation.goBack();
    return false;
  };

  const onBackPress = () => {
    // console.log('leaving');
    // disconnectSocket();
    setNoMoreData(false);
    // navigation.goBack();
    // Return true to stop default back navigaton
    // Return false to keep default back navigaton
    return true;
  };
  useBackHandler(() => {
    // console.log('Back hanlder');
    disconnectSocket();
    return false;
  });

  // useFocusEffect get called each time when screen comes in focus
  useFocusEffect(
    React.useCallback(() => {
      // console.log('Focus');
      socket.on('connect', function () {
        console.log(socket.connected);
      });
      // console.log('Focused', GetBaseURL().slice(0, -1));

      return () => {
        // Once the Screen gets blur Remove Event Listener
        // console.log('Unfocused');
        setNoMoreData(false);
        // setPage(0);
        // disconnectSocket();
      };
    }, []),
  );

  const token = async () => {
    Token = await AsyncStorage.getItem('token');
    // console.log('Tokens', Token);
  };

  const {
    value: newPostTitle,
    bind: newPostTitleBind,
    setValue: setNewPostTitle,
  } = useInput('', INPUT_TYPE_OTHER, postTextValidation, '');

  // Socket Logic

  const socket = io(GetBaseURL().slice(0, -1), {
    transports: ['websocket'],
    query: {
      'access-token': Token,
    },
  });

  const sendMessage = (msg) => {
    // disconnectSocket();
    const id = uuidv4();
    if (newPostTitle !== '') {
      const newMessage = {
        chat_id: id,
        msg: newPostTitle,
        to_shramik_id: friendShramikId,
      };

      socket.emit('sendMessage', newMessage, function (confirmation) {
        // console.log('Im NEW MEssage', newMessage);
      });

      const dateTime = moment().format();
      // console.log('Im New message Sent', {
      //   ...newMessage,
      //   chat_time: dateTime,
      //   from_shramik_id: my_shramik_id,
      // });
      // Update The reducer
      updateChat({
        ...newMessage,
        chat_time: dateTime,
        from_shramik_id: my_shramik_id,
      });
      setNewPostTitle('');
    }
  };

  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };

  socket.on('errMessage', function (error) {
    console.log(
      'Sorry, there seems to be an issue with the connection!',
      error,
    );
  });

  socket.on('connect_error', function (err) {
    console.log('connect failed' + err);
  });

  socket.on('messageReaded', function (msg) {
    // console.log('Connected to WS server');
    // console.log('messageReaded', msg);
  });

  socket.on('errMessage', function (msg) {
    // console.log('Connected to WS server');
    // console.log('errMessage', msg);
  });

  socket.on('newMessage', function (msg) {
    // console.log('Connected to WS server');
    // console.log('newMessage', msg);
    // Update The reducer
    // console.log('Im New message');
    updateChat(msg?.data);
    // Set Message As readed
    var msgs = [];
    // var object = {"name":"KV"};
    msgs.push(msg?.data);
    // console.log(msgs);
    msgRead(msgs);
  });
  //   "{
  //     chat_id,
  //     msg,
  //     to_shramik_id,
  //     chat_time (not required)
  // }"

  socket.emit('messageReaded', {
    chat_id: uuidv4(),
  });

  const writeToClipboard = async (text) => {
    await Clipboard.setString(text);
    // alert('Copied');
    ToastAndroid.showWithGravity(
      'Copied!',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      25,
      50,
    );
    // notifyMessage('Copied!');
  };

  const hitApi = (shramik_id, page_no = 0) => {
    dispatch(
      callApi(
        GET_CHAT_HISTORY,
        URLs.GET_CHAT_HISTORY,
        {
          user_id: shramik_id,
          per_page: 20,
          page_no: page_no,
        },
        (data) => {
          setChatHistory(data?.data?.items);
          setContactsLoader(false);
          msgRead(getChatHistoryData?.items);
          // console.log('Messges more', data);
          if (data?.data?.items.length == 0) {
            setNoMoreData(true);
            // console.log('No data available', data?.data?.items);
          } else {
            if (page_no == 0) {
              setPage(1);
              // console.log('Data available', data?.data?.items);
            }
          }
        },
      ),
    );
  };

  const loadMore = () => {
    // console.log('Load more hitted', page);
    if (noMoreData) return null;
    if (getChatHistoryData?.items?.length >= 20) {
      setContactsLoader(true);
      setPage(page + 1);
      hitApi(friendShramikId, page);
    }
  };

  const updateChat = (newMessage) => {
    dispatch({type: UPDATE_CHAT_HISTORY, payload: newMessage});
  };

  const selectChats = (itemSelected) => {
    dispatch({type: SELECT_CHATS, payload: itemSelected});
  };
  const unSelectChats = () => {
    dispatch({type: UNSELECT_CHATS, payload: {}});
  };
  const deleteChat = () => {
    dispatch({type: DELETE_CHAT_HISTORY, payload: {}});
  };

  // Multi Chat selection
  const onChangeValue = (itemSelected, index) => {
    // Dispatch here
    selectChats(itemSelected);
  };

  // Copying selected Chats text and formatting them
  const showAllList = () => {
    const friendNameDisplay = item?.fname ? friendName : item?.cont_mobile;
    const myNameDisplay = profileData?.fname ? myName : profileData?.mobile;

    const newObject = [];
    const selected = getChatHistoryData?.items.filter(
      (item) => item.selected == true,
    );
    selected.forEach((element) => {
      var picked = (({from_shramik_id, chat_time, msg}) => ({
        from_shramik_id,
        chat_time,
        msg,
      }))(element);
      newObject.push(picked);
    });
    newObject.sort(function (x, y) {
      return moment(x.chat_time).toDate() - moment(y.chat_time).toDate();
    });

    var str = '';
    newObject.forEach((obj, index) => {
      if (index != newObject.length - 1) {
        str += `[${moment(obj.chat_time).format('DD/MM, h:mm a')}] ${
          obj.from_shramik_id === friendShramikId
            ? friendNameDisplay
            : myNameDisplay
        }: ${obj.msg} \n`;
      } else {
        str += `[${moment(obj.chat_time).format('DD/MM, h:mm a')}] ${
          obj.from_shramik_id === friendShramikId
            ? friendNameDisplay
            : myNameDisplay
        }: ${obj.msg}`;
      }
    });
    writeToClipboard(str);
    unSelectChats();
  };

  const hitApiMsgRead = (apiBody) => {
    dispatch(
      callApi(READ_MESSAGE, URLs.MSG_READED, apiBody, (data) => {
        setContactsLoader(false);
      }),
    );
  };
  // Message readed
  const msgRead = (allMessages) => {
    if (allMessages?.length > 0) {
      const msgNotReaded = allMessages.filter(
        (msg) => msg.from_shramik_id !== my_shramik_id && msg.is_read === 0,
      );

      // If Not Readed is greater than 0
      if (msgNotReaded?.length > 0) {
        let chatIds = msgNotReaded.map((msgs) => msgs.chat_id);
        let apiBody = {
          chat_ids: chatIds,
          from_shramik_id: msgNotReaded[0]?.from_shramik_id,
        };

        hitApiMsgRead(apiBody);
      }
    }
  };

  const chatLook = (item) => {
    const position =
      item?.from_shramik_id === my_shramik_id ? 'flex-end' : 'flex-start';
    const chatStyleSender = {
      borderRadius: 6,
      borderTopRightRadius: 0,
      // backgroundColor: '#4B79D8',
      padding: 5,
      alignItems: position,
    };
    const chatStyleReceiever = {
      borderRadius: 6,
      borderTopLeftRadius: 0,
      // backgroundColor: '#4B79D8',
      padding: 5,
      alignItems: position,
    };
    const marginStyle =
      position === 'flex-end' ? {marginLeft: '25%'} : {marginRight: '25%'};
    return (
      <View
        style={{
          // borderWidth: 3,
          backgroundColor: item.selected ? 'rgba(113, 212, 245,0.5)' : null,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            onChangeValue(item);
          }}
          style={marginStyle}>
          <View
            style={[
              position === 'flex-end' ? chatStyleSender : chatStyleReceiever,
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <View
                style={[
                  {backgroundColor: '#4B79D8'},
                  position === 'flex-end'
                    ? chatStyleSender
                    : chatStyleReceiever,
                ]}>
                <Text style={{color: '#fff', fontSize: 16}}>{item?.msg}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{alignItems: position}}>
          <Text
            style={{
              color: 'black',
              fontSize: 8,
            }}>
            {moment(item?.chat_time).format(' Do MMMM YYYY, h:mm a')}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <Header showBack chatClosed chatClose={disconnectSocket} />
        {!isSelected ? (
          <View style={{width: '100%', backgroundColor: '#ffbb00'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <View>
                <CircleContactIcon style={{marginRight: 15}} />
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  // width: '100%',
                  flex: 1,
                  paddingVertical: 'city' in item ? 7 : 0,
                }}>
                {'city' in item || item?.chat_id ? null : (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.7}}>
                        <Text
                          style={{
                            color: '#FFF',
                            fontSize: 16,
                            fontWeight: 'bold',
                          }}>
                          Contact Name
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        :
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          marginHorizontal: 5,
                        }}>
                        <Text
                          style={{
                            color: '#FFF',
                            fontSize: 16,
                            fontWeight: 'bold',
                            flex: 1,
                            flexWrap: 'wrap',
                          }}>
                          {item?.cont_name}
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.7}}>
                    <Text
                      style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
                      Name on app
                    </Text>
                  </View>
                  <Text
                    style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
                    :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      marginHorizontal: 5,
                    }}>
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 16,
                        fontWeight: 'bold',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}>
                      {friendName}
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.7}}>
                    <Text
                      style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
                      City
                    </Text>
                  </View>
                  <Text
                    style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
                    :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      marginHorizontal: 5,
                    }}>
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 16,
                        fontWeight: 'bold',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}>
                      {city}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#ffbb00',
              paddingHorizontal: 10,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{marginHorizontal: 10, marginVertical: 13}}
              onPress={() => {
                showAllList();
                sendBtnClickToAnalytics('Chat Copy');
              }}>
              <Icon name="clone" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginHorizontal: 10,
                marginVertical: 13,
                backgroundColor: '#4B79D8',
                padding: 5,
                borderRadius: 6,
              }}
              onPress={() => unSelectChats()}>
              <Text style={{color: '#FFF'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{flex: 1}}>
          <View
            style={{
              padding: 10,
              borderRadius: 4,
              flex: 1,
            }}>
            <FlatList
              inverted
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 0.5,
                    width: '100%',
                    marginVertical: 5,
                    // backgroundColor: '##5ff5cd',
                  }}
                />
              )}
              ListFooterComponent={() => {
                return (
                  getChatHistoryLoading && (
                    <View style={{marginVertical: 10}}>
                      <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                  )
                );
              }}
              onEndReachedThreshold={0.01}
              keyExtractor={(item, index) => item?.chat_id}
              onEndReached={loadMore}
              // data={chatHistory}
              data={getChatHistoryData?.items}
              contentContainerStyle={{
                marginTop: 5,
                marginHorizontal: 3,
              }}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      flex: 1,
                    }}>
                    {chatLook(item)}
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              // position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 5,
              justifyContent: 'center',
            }}>
            <View
              style={{
                // width: '88%',
                flex: 1,
                borderRadius: 6,
              }}>
              <Input
                {...newPostTitleBind}
                inputContainerStyle={{
                  height: 40,
                  width: '100%',
                  marginTop: 10,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginHorizontal: -8,
                }}
                maxLength={500}
                inputStyle={{
                  fontSize: 16,
                  marginHorizontal: 5,
                  color: '#3D3D3D',
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                padding: 5,
                borderRadius: 50,
                marginTop: -10,
                backgroundColor: '#ffbb00',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                sendMessage();
                sendBtnClickToAnalytics('Send Message');
              }}>
              <Next />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
