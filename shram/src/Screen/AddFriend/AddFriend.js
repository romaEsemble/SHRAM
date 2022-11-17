import localStyles from '@addFriend/AddFriendStyle';
import {showSnackBar} from '@utils/Util';
import Circle from '@circle/Circle';
import Header from '@header/Header';
import ChatIcon from '@icons/chatIcon.svg';
import CircleFlower from '@icons/circleFlower';
import Close from '@icons/close.svg';
import AddContact from '@icons/IconAddthis.svg';
import CircleContactIcon from '@icons/noContactIcon.svg';
import Checked from '@icons/PhotoTickIcon';
import UnChecked from '@icons/RadioUncheck.svg';
import Loader from '@loader/Loader';
import Model from '@model/Model';
import {
  NAVIGATION_FRIEND_CHAT,
  NAVIGATION_FRIEND_DETAIL,
} from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {
  CHANGE_REQUEST_STATUS,
  GET_CHAT_HEAD,
  GET_CONTACT_LIST_FROM_SERVER,
  DELETE_CHAT_HEAD,
  SEND_FRIEND_REQUEST,
} from '@redux/Types';
import SearchBar from '@searchBar/SearchBar';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
// import {showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  View,
  ActivityIndicator,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {useDispatch, useSelector} from 'react-redux';
import {filter} from 'lodash';
import strings from '@resources/Strings';
import {GetPhotoBaseURL} from '@networking/Urls';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function AddFriend({navigation, route}) {
  const [localContacts, setLocalContacts] = useState([]);
  const [shramikUsers, setShramikUsers] = useState([]);
  const [chatHead, setChatHead] = useState([]);
  const [contactsLoader, setContactsLoader] = useState(false);
  const [syncLoader, setSyncLoader] = useState(false);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchStringMsg, setSearchStringMsg] = useState('');
  const [contactSent, setContactSent] = useState(0);
  const [payloadLength, setPayloadLength] = useState(0);

  const [currentTab, setCurrentTab] = useState(
    route?.params?.type || 'contact',
  );
  const [friendReq, setFriendReq] = useState(false);
  const [refresh, setRefresh] = useState(false);
  var count = 0;
  const dispatch = useDispatch();
  const {getContactListData, shramikOnly, getContactListLoading} = useSelector(
    (state) => state.AddFriendReducer,
  );
  // console.log('Get contact list from server', getContactListData);
  useEffect(() => {
    // getContactList();
    hitApi();
    getContactListFromServer();
    return () => {
      setLocalContacts([]);
    };
  }, [currentTab, route?.params]);

  // When Navigating to This Page and Setting The Current tab as per type parameter
  useEffect(() => {
    setCurrentTab(route?.params?.type);
  }, [route?.params?.type]);

  const {innerImageView, circlePosition, imageCircleView, centerCircle} =
    localStyles;

  const customeLoader = () => {
    return (
      <>
        {syncLoader ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              elevation: 10,
              zIndex: 15,
              padding: 10,
              paddingHorizontal: 20,
              position: 'absolute',
              top: '32%',
              left: '27%',
              backgroundColor: '#fff',
              borderRadius: 6,
            }}>
            <View style={{}}>
              <ActivityIndicator size={30} color={'green'} />
              <View style={{margin: 5}}></View>
              <Text
                style={{fontWeight: 'bold'}}>{`Contacts are syncing...`}</Text>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>{`It may take 10 to 20 secs.`}</Text>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>{`Total Contacts: ${payloadLength}`}</Text>
            </View>
          </View>
        ) : null}
      </>
    );
  };

  const filterData = () => {
    const shramikOnly = localContacts.filter(
      (contact) => contact.is_shramik_user === 1,
    );
    // console.log('Shramiks only', shramikOnly);
    // setShramikUsers(shramikOnly);
    return shramikOnly;
  };
  // const hitApi = (searchStringMsg = '') => {
  const hitApi = (text = '') => {
    setContactsLoader(true);
    dispatch(
      callApi(
        GET_CHAT_HEAD,
        URLs.GET_CHAT_HEAD,
        // {name: searchStringMsg.trim()},
        {name: text.trim()},
        // {
        //   per_page: 10,
        //   page_no: 0,
        // },
        (data) => {
          console.log('Data for chat head', data?.data?.status);
          setChatHead(data?.data?.status);
          setContactsLoader(false);
        },
        (fail) => {
          setContactsLoader(false);
        },
      ),
    );
  };

  const changeRequestStatus = (frnd_status, cont_id, type) => {
    dispatch(
      callApi(
        CHANGE_REQUEST_STATUS,
        URLs.CHANGE_REQUEST_STATUS,
        {
          frnd_status,
          cont_id,
        },
        () => {
          getContactListFromServer();
          showSnackBar(`${strings?.friendRequest} ${type}`, 'success');
        },
      ),
    );
  };

  // const footer = () => {
  //   return localContacts.length > 0 ? (
  //     <View style={{flex: 1}}>
  //       <View
  //         style={{
  //           marginVertical: 5,
  //           marginHorizontal: 3,
  //           backgroundColor: '#4B79D820',
  //           paddingVertical: 10,
  //           alignItems: 'flex-start',
  //           // borderRadius: 6,
  //           paddingHorizontal: 10,
  //           // width: '100%',
  //         }}>
  //         <Text style={{fontSize: 16}}>Invite Friends</Text>
  //       </View>
  //       <FlatList
  //         data={localContacts}
  //         contentContainerStyle={{alignItems: 'center'}}
  //         refreshControl={
  //           <RefreshControl
  //             style={{marginTop: 10}}
  //             colors={['#9Bd35A', '#689F38']}
  //             // refreshing={}
  //             onRefresh={() => {
  //               getContactListFromServer();
  //             }}
  //           />
  //         }
  //         renderItem={({item}) =>
  //           item?.frnd_shramik_id === null ? (
  //             <TouchableOpacity
  //               // onPress={() => {
  //               //   console.log('See the things', item);
  //               //   if (!item?.frnd_shramik_id) {
  //               //     console.log('@@@Null');
  //               //   } else {
  //               //     navigation.navigate(NAVIGATION_FRIEND_DETAIL, {
  //               //       contactsItem: item,
  //               //     });
  //               //   }
  //               // }}
  //               style={{
  //                 flexDirection: 'row',
  //                 padding: 10,
  //                 margin: 5,
  //                 // width: '95%',
  //                 backgroundColor: '#fff',
  //                 alignItems: 'center',
  //                 elevation: 4,
  //                 borderRadius: 4,
  //               }}>
  //               <View style={{marginRight: 10}}>
  //                 {item.thumbnailPath ? (
  //                   <Image
  //                     source={{uri: item.thumbnailPath}}
  //                     style={innerImageView}
  //                   />
  //                 ) : (
  //                   <CircleContactIcon />
  //                 )}
  //               </View>
  //               <View style={{width: '70%'}}>
  //                 <Text
  //                   style={{
  //                     color: '#777171',
  //                     fontSize: 16,
  //                     fontWeight: 'bold',
  //                   }}>
  //                   {item?.cont_name}
  //                 </Text>
  //               </View>
  //               <View>
  //                 <TouchableOpacity
  //                   activeOpacity={0.7}
  //                   onPress={() => {
  //                     console.log('Presing...', item);
  //                     // share(content_share_link);
  //                     // navigation.navigate(NAVIGATION_FRIEND_CHAT, {
  //                     //   item: item,
  //                     // });
  //                   }}>
  //                   <ShareIcon width={wp(6)} height={wp(6)} />
  //                 </TouchableOpacity>
  //               </View>
  //             </TouchableOpacity>
  //           ) : null
  //         }
  //         numColumns={1}
  //         keyExtractor={(item, index) => index}
  //         ListEmptyComponent={
  //           <View
  //             style={{
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               flex: 1,
  //             }}>
  //             {contactsLoader ? (
  //               <Loader loading={contactsLoader} />
  //             ) : (
  //               <View style={{margin: 10, marginVertical: 0}}>
  //                 <Text
  //                   style={{
  //                     color: '#4B79D8',
  //                     textAlign: 'center',
  //                     fontSize: 18,
  //                     fontWeight: 'bold',
  //                   }}>
  //                   {`No Contact Found`}
  //                 </Text>
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     getContactList();
  //                   }}>
  //                   <Text
  //                     style={{
  //                       color: '#4B79D8',
  //                       textAlign: 'center',
  //                       fontSize: 18,
  //                       fontWeight: 'bold',
  //                     }}>
  //                     {strings?.pleaseSync}
  //                   </Text>
  //                 </TouchableOpacity>
  //               </View>
  //             )}
  //           </View>
  //         }
  //       />
  //     </View>
  //   ) : null;
  // };

  const onChangeValue = (itemSelected, index) => {
    const newData = chatHead.map((item) => {
      if (item.mobile == itemSelected.mobile) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {
        ...item,
        selected: item.selected,
      };
    });
    setChatHead(newData);
    // showAllList();
  };

  // const showAllList = () => {
  //   console.log(
  //     'All Selected',
  //     chatHead.filter((item) => item.selected == true),
  //   );
  // };

  const deleteHead = () => {
    const list = chatHead.filter((item) => item.selected == true);
    var listArr = list.map((a) => a.shramik_id);
    dispatch(
      callApi(
        DELETE_CHAT_HEAD,
        URLs.DELETE_CHAT_HEAD,
        {
          del_conv_with_shramik_id: listArr,
        },
        (data) => {
          hitApi();
        },
        (fail) => {},
      ),
    );
  };
  const getMessageTab = () => {
    return (
      <>
        <SearchBar
          placeholder={strings?.searchContactsHere}
          showMic
          searchValue={searchStringMsg}
          onClearText={() => {
            setSearchStringMsg('');
            hitApi();
          }}
          onChangeText={(text) => {
            setSearchStringMsg(text);
            if (text === '') {
              hitApi();
            }
            // this.setState({refresh: true});
          }}
          onSearchPress={(text) => hitApi(text)}
        />
        <FlatList
          ListHeaderComponent={
            selectionVisible ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{padding: 2}}
                  onPress={() => {
                    setSelectionVisible(false);
                    // clearSelection();
                  }}>
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
                      Cancel Selection
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: 2}}
                  onPress={() => {
                    setSelectionVisible(false);
                    deleteHead();
                    sendBtnClickToAnalytics('Delete Chat List');
                  }}>
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
                      Delete Selected
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null
          }
          data={chatHead}
          contentContainerStyle={{marginTop: 5, marginHorizontal: 3}}
          refresh={refresh}
          refreshControl={
            <RefreshControl
              style={{marginTop: 10}}
              colors={['#9Bd35A', '#689F38']}
              refreshing={contactsLoader}
              onRefresh={() => {
                // getContactListFromServer();
                hitApi();
                setSearchStringMsg('');
              }}
            />
          }
          renderItem={({item}) => (
            <TouchableOpacity
              onLongPress={() => setSelectionVisible(true)}
              onPress={() => {
                navigation.navigate(NAVIGATION_FRIEND_CHAT, {
                  item: item,
                });
              }}
              style={{
                flexDirection: 'row',
                padding: 10,
                margin: 5,
                width: '97%',
                backgroundColor: '#fff',
                alignItems: 'center',
                elevation: 10,
                borderRadius: 4,
              }}>
              <View
                style={{
                  marginRight: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {selectionVisible ? (
                  item?.selected ? (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                      }}
                      onPress={() => {
                        onChangeValue(item);
                      }}>
                      <Checked height={20} width={20} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                      }}
                      onPress={() => {
                        // item.selected = true;
                        // setRefresh(true);
                        onChangeValue(item);
                      }}>
                      <UnChecked height={20} width={20} />
                    </TouchableOpacity>
                  )
                ) : null}
                {item.thumbnailPath ? (
                  <Image
                    source={{uri: item.thumbnailPath}}
                    style={innerImageView}
                  />
                ) : (
                  <CircleContactIcon />
                )}
              </View>
              <View style={{width: '70%'}}>
                <Text
                  style={{color: '#777171', fontSize: 16, fontWeight: 'bold'}}>
                  {/* {item?.fname
                    ? `${item?.fname ? item?.fname : ''} ${
                        item?.mname ? item?.mname : ''
                      } ${item?.lname ? item?.lname : ''}`
                    : item?.mobile} */}
                  {item?.fname
                    ? `${item?.fname ? item?.fname : ''}`
                    : item?.mobile}
                </Text>
                {!item?.city && !item?.state ? null : (
                  <Text
                    style={{
                      color: '#9F9F9F',
                      fontSize: 16,
                    }}>
                    {item?.city ? item?.city + ', ' : ''}
                    {item?.state}
                  </Text>
                )}

                <Text
                  style={{
                    color: '#9F9F9F',
                    fontSize: 16,
                  }}>
                  {item?.msg}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={1}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              {contactsLoader || getContactListLoading ? (
                <Loader loading={contactsLoader || getContactListLoading} />
              ) : (
                <View>
                  <Text
                    style={{
                      color: '#4B79D8',
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {strings?.noContactsFound}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      getContactList();
                      sendBtnClickToAnalytics('Sync');
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      {strings?.pleaseSync}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
      </>
    );
  };

  const getContactsTab = () => {
    return (
      <>
        <SearchBar
          placeholder={strings?.searchContactsHere}
          showMic
          searchValue={searchString}
          onClearText={() => {
            setSearchString('');
            getContactListFromServer();
          }}
          onChangeText={(text) => {
            setSearchString(text);
            if (text === '') {
              getContactListFromServer();
            }
            // this.setState({refresh: true});
          }}
          onSearchPress={(text) => getContactListFromServer(text)}
        />
        {customeLoader()}
        {/* <TouchableOpacity
        onPress={() => getContactList()}
        style={{alignItems: 'flex-end'}}>
        <SyncIcon />
      </TouchableOpacity> */}
        <FlatList
          // ListFooterComponent={footer}
          // data={localContacts}
          // data={filterData()}
          data={shramikOnly}
          contentContainerStyle={{alignItems: 'center'}}
          refreshControl={
            <RefreshControl
              style={{marginTop: 10}}
              colors={['#9Bd35A', '#689F38']}
              refreshing={contactsLoader || getContactListLoading}
              onRefresh={() => {
                setSearchString('');
                setContactsLoader(true);
                getContactListFromServer();
              }}
            />
          }
          renderItem={({item}) =>
            item?.frnd_shramik_id !== null && item?.frnd_status !== 2 ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(NAVIGATION_FRIEND_DETAIL, {
                    contactsItem: item,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  margin: 5,
                  width: '92%',
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  elevation: 4,
                  borderRadius: 4,
                }}>
                <View style={{marginRight: 10}}>
                  {item.thumbnailPath ? (
                    <Image
                      source={{
                        uri: GetPhotoBaseURL() + item.pic,
                      }}
                      style={innerImageView}
                    />
                  ) : (
                    <CircleContactIcon />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#777171',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {item?.cont_name}
                  </Text>
                </View>
                <View>
                  {parseInt(item.frnd_status, 10) === 0 &&
                  item.frnd_req_date === null ? (
                    <TouchableOpacity
                      onPress={() => {
                        sendFriendRequest(item.frnd_shramik_id, item?.cont_id);
                        sendBtnClickToAnalytics('Send Friend Request');
                      }}>
                      <AddContact />
                    </TouchableOpacity>
                  ) : parseInt(item.frnd_status, 10) === 1 ? (
                    <TouchableOpacity
                      onPress={() => {
                        // console.log('Presing hard...', item);
                        navigation.navigate(NAVIGATION_FRIEND_CHAT, {
                          item: item,
                        });
                      }}>
                      <ChatIcon />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </TouchableOpacity>
            ) : item?.frnd_req_date !== null ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(NAVIGATION_FRIEND_DETAIL, {
                    contactsItem: item,
                  });
                }}
                style={{
                  padding: 10,
                  margin: 5,
                  width:
                    item?.friendRequestSender !== item?.shramik_id
                      ? '95%'
                      : '112%',
                  backgroundColor: '#fff',
                  elevation: 4,
                  borderRadius: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '95%',
                  }}>
                  <View style={{marginRight: 10}}>
                    {item.thumbnailPath ? (
                      <Image
                        source={{
                          uri: GetPhotoBaseURL() + item.pic,
                        }}
                        style={innerImageView}
                      />
                    ) : (
                      <CircleContactIcon />
                    )}
                  </View>
                  <View style={{width: '70%'}}>
                    <Text
                      style={{
                        color: '#777171',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {item?.cont_name}
                    </Text>
                  </View>
                </View>
                {item?.friendRequestSender !== item?.shramik_id ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '85%',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        changeRequestStatus(
                          1,
                          item?.cont_id,
                          strings?.friendRequestAccepted,
                        );
                        sendBtnClickToAnalytics('Accept Friend Request');
                      }}
                      style={{padding: 10}}>
                      <Text
                        style={{
                          color: 'green',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        Accept
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        changeRequestStatus(
                          3,
                          item?.cont_id,
                          strings?.friendRequestRejected,
                        );
                        sendBtnClickToAnalytics('Reject Friend Request');
                      }}
                      style={{padding: 10}}>
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        Reject
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </TouchableOpacity>
            ) : null
          }
          keyExtractor={(item, index) => index}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              {contactsLoader || getContactListLoading ? (
                <Loader loading={contactsLoader || getContactListLoading} />
              ) : (
                <View style={{margin: 10}}>
                  <Text
                    style={{
                      color: '#4B79D8',
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {strings?.noContactsFound}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      getContactList();
                      sendBtnClickToAnalytics(strings?.pleaseSync);
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      {strings?.pleaseSync}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
        <Model
          overlayStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
            padding: 10,
          }}
          isVisible={friendReq}
          onBackdropPress={() => setFriendReq(false)}>
          <View
            style={{
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{padding: 10, margin: 20}}>
              <View style={imageCircleView}>
                <View style={centerCircle}>
                  <CircleFlower
                    style={circlePosition}
                    width={180}
                    height={180}
                  />
                  <Circle
                    type={'large'}
                    circleColor={'#FFC003'}
                    svg={
                      <Image
                        source={
                          localContacts?.thumbnailPath
                            ? {uri: localContacts?.thumbnailPath}
                            : null
                        }
                        style={innerImageView}
                      />
                    }
                  />
                </View>
              </View>
            </View>
            <Text
              style={{
                color: '#777171',
                textAlign: 'center',
                fontSize: 20,
                marginTop: 5,
              }}>
              {strings?.friendRequestSent}
            </Text>
            <Text
              style={{
                color: '#777171',
                textAlign: 'center',
                fontSize: 16,
                margin: 10,
              }}>
              Request to add
              <Text
                style={{
                  color: '#4EAF47',
                  textAlign: 'center',
                  fontSize: 16,
                  margin: 10,
                  fontWeight: 'bold',
                }}>
                {' '}
                {localContacts?.name}{' '}
              </Text>
              as your friend has been sent.You can chat once the request is
              accepted
            </Text>
            <TouchableOpacity
              onPress={() => {
                setFriendReq(false);
              }}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 10,
                backgroundColor: '#FFC003',
                width: 150,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#777171',
                }}>
                {strings?.ok}
              </Text>
            </TouchableOpacity>
          </View>
        </Model>
      </>
    );
  };

  const getContactList = async () => {
    try {
      if (Platform.OS === 'ios') {
        Contacts.getAll()
          .then((contacts) => {
            // work with contacts
            // formContactData({contacts});
          })
          .catch((e) => {
            console.log('error');
          });
      } else if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
          },
        )
          .then(() => {
            Contacts.getAll()
              .then((contacts) => {
                // work with contacts
                // console.log('contacts', JSON.stringify(contacts));
                const payload = [];
                // console.log(
                //   'localContacts',
                //   contacts[100].phoneNumbers,
                //   // JSON.stringify(localContacts[0], null, 4),
                // );
                contacts?.map((item) => {
                  item?.phoneNumbers?.map((innerItem) => {
                    // localContacts.forEach((contact) => {
                    var number = innerItem.number;
                    // Contact Validation Pending
                    if (number.startsWith('+91')) {
                      // console.log('Contains +91', number);
                      number = number.slice(3);
                      // console.log('Not Contains +91', number);
                    } else if (number.startsWith('0')) {
                      number = number.slice(1);
                    }
                    if (number.length <= 13 && number.length >= 10) {
                      payload.push({
                        phone: number.replace(/[^A-Za-z0-9]/g, ''),
                        name: item.displayName,
                      });
                    }
                    // });
                  });
                });

                // Only Unique Contacts(Based on Mobile will be Sent.)
                var uniqueContacts = payload.filter(function (a) {
                  var key = a.phone;
                  if (!this[key]) {
                    this[key] = true;
                    return true;
                  }
                }, Object.create(null));
                console.log('Unique contacts', uniqueContacts);
                // setPayloadLength(payload.length);
                setPayloadLength(uniqueContacts.length);
                // console.log('Payload', payload.length);

                // Sending Contacts in Chunks(chunksize) and Contact length is Unique Contacts length
                const chunkSize = 100;
                const contactlength = uniqueContacts.length; // payload.length
                for (
                  let index = 0;
                  // index < payload.length;
                  index < contactlength;
                  index += chunkSize
                ) {
                  var start = index;
                  var end = index + chunkSize;
                  // console.log('In looop', contactlength, contactSent);
                  // if (end > payload.length) {
                  if (end > contactlength) {
                    end = contactlength;
                    // console.log('End loop', end);
                    // console.log('Slice', uniqueContacts.slice(start, end));
                    dispatch(
                      callApi(
                        GET_CONTACT_LIST_FROM_SERVER,
                        URLs.GET_CONTACT,
                        {
                          name: searchString,
                          contactAdd: uniqueContacts.slice(start, end),
                        },
                        (data) => {
                          setLocalContacts(data?.data);
                          setSyncLoader(false);
                          setContactSent(0);
                          // setContactSent(contactSent + 100);
                          // console.log('sync data', JSON.stringify(data));
                        },
                        (fail) => {
                          setSyncLoader(false);
                        },
                      ),
                    );
                  } else {
                    dispatch(
                      callApi(
                        GET_CONTACT_LIST_FROM_SERVER,
                        URLs.GET_CONTACT,
                        {
                          name: searchString,
                          contactAdd: uniqueContacts.slice(start, end),
                        },
                        (data) => {
                          // setSyncLoader(false);
                          // setContactSent(contactSent + 100);
                          setLocalContacts(data?.data);
                          setContactSent(contactlength);
                          // setSyncLoader(false);
                          // console.log('sync data', JSON.stringify(data));
                        },
                        (fail) => {
                          setSyncLoader(false);
                        },
                      ),
                    );
                  }
                }
              })
              .catch((e) => {
                setSyncLoader(false);
              });
          })
          .catch((error) => {
            setSyncLoader(false);

            // ADD THIS THROW error
            throw error;
          });
      }
    } catch (err) {
      // console.log('Contact Error', err);
    }
  };

  const formContactData = (data, serverDataFromRedux) => {
    console.log('1', serverDataFromRedux);
    let tempContact = [];
    for (let i = 0; i < data?.contacts?.length; i++) {
      console.log('2', data?.contacts?.length);

      for (let j = 0; j < data?.contacts[i].phoneNumbers.length; j++) {
        console.log('3', data?.contacts[i].phoneNumbers.length);

        let isUpdated = false;
        for (
          let serverData = 0;
          serverData < serverDataFromRedux.length;
          serverData++
        ) {
          if (
            data?.contacts[i].phoneNumbers[j].number ==
            serverDataFromRedux[serverData].phone
          ) {
            isUpdated = true;
            break;
          }
        }
        for (let a = 0; a < data?.contacts[i].postalAddresses.length; a++) {
          console.log('4', data?.contacts[i].postalAddresses.length);
          if (!isUpdated) {
            tempContact.push({
              name: data?.contacts[i].displayName,
              phone: data?.contacts[i].phoneNumbers[j].number,
              neighborhood: data?.contacts[i].postalAddresses[a].neighborhood,
              city: data?.contacts[i].postalAddresses[a].city,
              thumbnailPath: data?.contacts[i].thumbnailPath,
            });
          }
        }
      }
    }
    setLocalContacts(tempContact);
    setContactsLoader(false);
  };

  const getContactListFromServer = (text = '') => {
    // getContactList(serverDta);
    console.log('Serach api hitted Contact', text.trim());

    dispatch(
      callApi(
        GET_CONTACT_LIST_FROM_SERVER,
        URLs.GET_CONTACT,
        // {name: searchString.trim()},
        {name: text.trim()},
        (data) => {
          // filterData();
          setLocalContacts(data?.data);
          setContactsLoader(false);
          // console.log('sync data', JSON.stringify(data?.data));
        },
        (data) => {
          setContactsLoader(false);
        },
      ),
    );
  };

  // const sendContactsListToServer = (data) => {
  //   getContactList();
  //   dispatch(
  //     callApi(
  //       GET_CONTACT_LIST_FROM_SERVER,
  //       URLs.SEND_CONTACT,

  //       {data},
  //       (data) => {},
  //       () => {},
  //     ),
  //   );
  // };

  const sendFriendRequest = (shramik_id, contactId) => {
    dispatch(
      callApi(
        SEND_FRIEND_REQUEST,
        URLs.SEND_FRIEND_REQ,
        {
          frnd_shramik_id: shramik_id,
          cont_id: contactId,
        },
        () => {
          getContactListFromServer();
          showSnackBar(strings?.friendRequestSent, 'success');
        },
      ),
    );
  };
  return (
    <View style={{flex: 1}}>
      <Header showDrawer />
      <SubHeader title={strings?.connection} navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setCurrentTab('msg');
            sendBtnClickToAnalytics('Message Tab');
          }}
          style={{padding: 10, marginHorizontal: 10}}>
          <Text
            style={
              currentTab === 'msg'
                ? {color: '#EBB000', fontWeight: 'bold'}
                : {color: '#707070'}
            }>
            {strings?.messages}
          </Text>
          <View
            style={
              currentTab === 'msg'
                ? {
                    borderBottomColor: '#EBB000',
                    borderBottomWidth: 3,
                    margin: 2,
                  }
                : null
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCurrentTab('contact');
            sendBtnClickToAnalytics('Contact Tab');
          }}
          style={{padding: 10, marginHorizontal: 10}}>
          <Text
            style={
              currentTab === 'contact'
                ? {color: '#EBB000', fontWeight: 'bold'}
                : {color: '#707070'}
            }>
            {strings?.contacts}
          </Text>
          <View
            style={
              currentTab === 'contact'
                ? {
                    borderBottomColor: '#EBB000',
                    borderBottomWidth: 3,
                    margin: 2,
                  }
                : null
            }></View>
        </TouchableOpacity>

        {currentTab === 'contact' && (
          <TouchableOpacity
            onPress={() => {
              getContactList();
              setSyncLoader(true);
            }}
            style={{
              padding: 10,
              marginHorizontal: 10,
              backgroundColor: '#EBB000',
              position: 'absolute',
              right: 0,
              borderRadius: 10,
            }}>
            <Text style={{color: '#fff'}}>{strings?.sync}</Text>
          </TouchableOpacity>
        )}
      </View>
      {currentTab === 'contact' ? getContactsTab() : getMessageTab()}
    </View>
  );
}

// 23	syncContact	syncContact	{"name":"","contactAdd":[{"name": "New Krishn", "phone": "7654321890"}]}	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVc2VyXzEzOCIsInJvbGVJZCI6IjEiLCJyb2xlTmFtZSI6IlNocmFtaWsiLCJ1c2VyTW9iIjoiNzY1NDMyMTg5MCIsInVzZXJOYW1lIjoiS3Jpc2huYSIsImlhdCI6MTYxOTc3MzUxMCwiaXNzIjoibG9jYWhvc3QifQ.wSbNYyYzmtWvspzEnHjMMWOquOfFgyu1gdcHqy7td9M	"Im trying to sync this new contact(refer Request Body) but It is not getting added.
// Response is like:
// {
//     ""status"": 200,
//     ""message"": ""Success"",
//     ""data"": [
//       {},
//        ....,
//     ],
//     ""mobileExist"": []
// }"	Test		Krishna V
