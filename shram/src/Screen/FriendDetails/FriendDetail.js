import Circle from '@circle/Circle';
import localStyles from '@friendDetail/FriendDetailsStyles';
import Back from '@icons/backArrow.svg';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import CircleFlower from '@icons/circleFlower';
import FillStarIcon from '@icons/fillStarIcon';
import AddContact from '@icons/IconAddthis.svg';
import QRCodeIcon from '@icons/IconQrcodeShare.svg';
import StarIcon from '@icons/starIcon';
import Loader from '@loader/Loader';
import Model from '@model/Model';
import {URLs} from '@networking/Urls';
import {apiCall as api} from '@networking/withAPI';
import {CommonActions, useRoute} from '@react-navigation/native';
import {callApi} from '@redux/CommonDispatch.js';
import {GET_OTHER_USER_PROFILE, SEND_FRIEND_REQUEST} from '@redux/Types';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NAVIGATION_ADD_FRIEND} from '@navigation/NavigationKeys';
import strings from '@resources/Strings';
import {GetPhotoBaseURL} from '@networking/Urls';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function FriendDetail({navigation}) {
  const route = useRoute();
  const [contactsDetail, setContactsDetail] = useState({});
  // const [contactsDetail, setContactsDetail] = useState(
  //   route?.params?.contactsItem || ""
  // );
  // console.log(
  //   'First time',
  //   contactsDetail?.frnd_status,
  //   contactsDetail?.frnd_status == 0,
  // );

  const [item, setItem] = useState(route?.params?.contactsItem);
  // console.log('@@Items', item);
  const [friendReq, setFriendReq] = useState(false);
  const [openQRCodeModel, setOpenQRCodeModel] = useState(false);

  const [mobile, setMobile] = useState({});
  const [contactsLoader, setContactsLoader] = useState(true);
  const [userData, setUserData] = useState(0);
  const [cont_name, setCont_name] = useState('');

  useEffect(() => {
    getUserDetails();
    // console.log('Params passed', item, JSON.stringify(route?.params, null, 4));
    // setCont_name(item?.cont_name);
  }, [
    route?.params?.contactsItem,
    route?.params?.a,
    route?.params?.params?.user_id,
  ]);

  const hitApi = (shramikId) => {
    dispatch(
      callApi(
        GET_OTHER_USER_PROFILE,
        URLs.GET_USER_DATA,
        {otherUserId: shramikId},
        (data) => {
          console.log('Data from', data);
          setContactsDetail(data?.data);
          setContactsLoader(false);
        },
      ),
    );
  };

  // Function Handles the
  const getUserDetails = async () => {
    // var unencrpted = 0;
    if ('a' in route?.params && route?.params?.a !== 0) {
      // need to decrypt call
      const unencrpted = await unencrypt(route?.params?.a.replace(' ', '+'));
      hitApi('User_' + unencrpted);
      navigation.dispatch(
        CommonActions.setParams({
          a: 0,
          contactsItem: {},
          params: {user_id: 0, type: ''},
        }),
      );
      // navigation.dispatch(
      //   CommonActions.setParams({user_id: 0, params: {user_id: 0, type: ''}}),
      // );

      // console.log('reseted route', route?.params);
    } else if (
      'params' in route?.params &&
      route?.params?.params?.type !== ''
    ) {
      // No need to  decrypt function
      const shramik_id = route?.params?.params?.user_id;
      hitApi('User_' + shramik_id);
      navigation.dispatch(
        CommonActions.setParams({
          a: 0,
          contactsItem: {},
          params: {user_id: 0, type: ''},
        }),
      );
    } else if (Object.keys(route?.params?.contactsItem).length !== 0) {
      const shramik_id = route?.params?.contactsItem?.frnd_shramik_id;
      setCont_name(route?.params?.contactsItem?.cont_name);
      hitApi(shramik_id);

      navigation.dispatch(
        CommonActions.setParams({
          a: 0,
          contactsItem: {},
          params: {user_id: 0, type: ''},
        }),
      );
      // setItem({});
    }

    // if (parseInt(unencrpted) !== 0) {
    //   console.log('called getUserData IFFF');
    //   const {apiSuccess, data} = await api(URLs.GET_FRIEND_DATA, {
    //     otherUserId: 'User_' + unencrpted,
    //   });

    //   setUserData(data);
    // } else {
    //   console.log('called getUserData Else');
    //   // const {apiSuccess, data} = await api(URLs.GET_FRIEND_DATA, {
    //   //   otherUserId: 'User_' + unencrpted,
    //   // });
    // }
    // dispatch(
    //   callApi(
    //     GET_OTHER_USER_PROFILE,
    //     URLs.GET_USER_DATA,
    //     {otherUserId: item?.shramikId},
    //     (data) => {
    //       setContactsDetail(data?.data);
    //       setContactsLoader(false);
    //       // console.log('sync data', JSON.stringify(data));
    //     },
    //   ),
    // );
    // navigation.dispatch(
    //   CommonActions.setParams({
    //     a: 0,
    //     contactsItem: {},
    //     params: {user_id: 0, type: ''},
    //   }),
    // );
    // setItem({});
  };

  const dispatch = useDispatch();
  const {getFriendDetailsData} = useSelector(
    (state) => state.FriendDetailReducer,
  );

  const renderStar = () => {
    let star = [1, 2, 3].map((data) => {
      return (
        <View>
          {data <= parseInt(contactsDetail?.profile_star || 0) ? (
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

  // const getFriedDetails = () => {
  //   dispatch(
  //     callApi(
  //       GET_FRIEND_DATA,
  //       URLs.GET_FRIEND_DATA,
  //       {contact_id: getFriendDetailsData?.contact_id},
  //       (data) => {},
  //       () => {},
  //     ),
  //   );
  // };

  const sendFriendRequest = (cont_id) => {
    dispatch(
      callApi(
        SEND_FRIEND_REQUEST,
        URLs.SEND_FRIEND_REQ,
        {
          frnd_shramik_id: contactsDetail?.shramik_id,
          cont_id,
        },
        () => setFriendReq(true),
      ),
    );
  };

  const unencrypt = async (encrypted) => {
    const {apiSuccess, data} = await api(URLs.DECRYPTED_DATA, {
      // profile_link: route?.params?.content_id,
      profile_link: encrypted,
      type: '1',
    });
    var str = data?.data;
    var matches = str.match(/(\d+)/);
    user_id = matches[0];

    return user_id;
  };

  const getUserData = async (user_id) => {
    var unencrpted = 0;
    if ('a' in route?.params && route?.params?.a !== 0) {
      unencrpted = await unencrypt(route?.params?.a.replace(' ', '+'));
      // navigation.dispatch(
      //   CommonActions.setParams({user_id: 0, params: {user_id: 0, type: ''}}),
      // );
    } else if (
      'params' in route?.params &&
      route?.params?.params?.type !== ''
    ) {
      // No need to  decrypt function
      unencrpted = route?.params?.params?.user_id;
    }

    if (parseInt(unencrpted) !== 0) {
      const {apiSuccess, data} = await api(URLs.GET_FRIEND_DATA, {
        otherUserId: 'User_' + unencrpted,
      });

      setUserData(data);
    } else {
      // const {apiSuccess, data} = await api(URLs.GET_FRIEND_DATA, {
      //   otherUserId: 'User_' + unencrpted,
      // });
    }
    navigation.dispatch(
      CommonActions.setParams({a: 0, params: {user_id: 0, type: ''}}),
    );
  };

  const {
    starsView,
    personalHeaderMainContainer,
    imageCircleView,
    centerCircle,
    circlePosition,
    innerImageView,
    backgroundFlowerContainer,
    backgroundFlowerPositions,
  } = localStyles;
  var user_id = route?.params?.a || route?.params?.params?.user_id;
  // var nameOnApp =
  //   contactsDetail?.fname !== null
  //     ? contactsDetail?.fname
  //     : '-' + contactsDetail?.mname !== null
  //     ? contactsDetail?.mname
  //     : '' + contactsDetail?.lname !== null
  //     ? contactsDetail?.lname
  //     : '';

  return (
    <>
      <View style={{flex: 1, marginTop: 20}}>
        <Loader loading={contactsLoader} />
        <View
          style={{
            backgroundColor: '#4B79D8',
            height: 40,
            paddingBottom: 15,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
              flexDirection: 'row',
              marginHorizontal: 10,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('addFriend', {sender: 'ME'})}
              style={{padding: 5}}>
              <Back />
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() => {
              // navigation.openDrawer();
              // navigation.goBack();
              navigation.navigate("addFriend");
              console.log("back is pressed", route?.params);
            }}
            style={{ padding: 5 }}
          >
            <Back />
          </TouchableOpacity> */}
            <Text
              style={{
                width: '60%',
                // position: 'absolute',
                alignSelf: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center',
              }}>
              Connection Details
            </Text>
            {/* {item?.frnd_shramik_id && contactsDetail?.frnd_status === 0} */}
            {contactsDetail?.frnd_status == 0 ? (
              <TouchableOpacity
                onPress={() => {
                  sendFriendRequest(contactsDetail?.cont_id);
                  sendBtnClickToAnalytics('Send Friend Request');
                }}
                style={{
                  alignItems: 'flex-end',
                  padding: 10,
                }}>
                <AddContact />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  opacity: 0,
                  alignItems: 'flex-end',
                  padding: 10,
                }}></View>
            )}
          </View>
        </View>

        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={personalHeaderMainContainer}>
              <View style={imageCircleView}>
                <View style={centerCircle}>
                  <CircleFlower
                    style={circlePosition}
                    width={160}
                    height={160}
                  />
                  <Circle
                    type={'large'}
                    circleColor={'#FFC003'}
                    svg={
                      <Image
                        source={
                          contactsDetail?.pic
                            ? GetPhotoBaseURL() + contactsDetail?.pic
                            : null
                        }
                        style={innerImageView}
                      />
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  marginTop: 15,
                  padding: 5,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '90%',
                    paddingHorizontal: 30,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={{}}>
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
                        marginLeft: 5,
                      }}>
                      :
                    </Text>
                    <View style={{flex: 1, marginLeft: 5}}>
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {`${cont_name}`}
                        {/* {route?.params?.cont_name} */}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        Name on app
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginLeft: 12,
                      }}>
                      :
                    </Text>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginLeft: 6,
                          flexWrap: 'wrap',
                          flex: 1,
                        }}>
                        {/* {`${
                          contactsDetail?.fname !== null
                            ? contactsDetail?.fname
                            : '-'
                        } ${
                          contactsDetail?.mname !== null
                            ? contactsDetail?.mname
                            : ''
                        } ${
                          contactsDetail?.lname !== null
                            ? contactsDetail?.lname
                            : ''
                        }`} */}
                        {`${
                          contactsDetail?.fname !== null
                            ? contactsDetail?.fname
                            : '-'
                        }`}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={starsView}>{renderStar()}</View>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => {
                    contactsDetail?.qr
                      ? setOpenQRCodeModel(true)
                      : showSnackBar(strings?.fetchQRFailed, 'error');
                    sendBtnClickToAnalytics('Show QR code');
                  }}>
                  <QRCodeIcon style={{marginTop: 5}} width={30} height={30} />
                  <Text style={{color: '#fff', fontSize: 14}}>SHARE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={backgroundFlowerContainer}>
            <BackgroundFlowerIcon
              width={200}
              height={200}
              style={backgroundFlowerPositions}
            />
          </View>
          <View
            style={{
              padding: 10,
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            <Text style={{color: '#9F9F9F', fontSize: 14}}>MOBILE NO.</Text>
            <Text style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
              {/* {item?.frnd_status === 0 ? '-' : contactsDetail?.mobile} */}
              {contactsDetail?.frnd_status === 1 ? contactsDetail?.mobile : '-'}

              {/* {mobile && ` XXXXXX ${mobile}`} */}
            </Text>
          </View>
          <View
            style={{
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Text style={{color: '#9F9F9F', fontSize: 14}}>CURRENT CITY</Text>
            {contactsDetail?.curr_city && contactsDetail?.curr_state ? (
              <Text
                style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
                {contactsDetail?.curr_city}, {contactsDetail?.curr_state}
              </Text>
            ) : (
              <Text
                style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
                -
              </Text>
            )}
          </View>
          {/* <View
            style={{
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Text style={{color: '#9F9F9F', fontSize: 14}}>HOME CITY</Text>
            {contactsDetail?.perm_city && contactsDetail?.perm_state ? (
              <Text
                style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
                {contactsDetail?.perm_city}, {contactsDetail?.perm_state}
              </Text>
            ) : (
              <Text
                style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
                -
              </Text>
            )}
          </View> */}
          <View
            style={{
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Text style={{color: '#9F9F9F', fontSize: 14}}>INDUSTRY</Text>
            <Text style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
              {contactsDetail?.industry || '-'}
            </Text>
          </View>
          <View
            style={{
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Text style={{color: '#9F9F9F', fontSize: 14}}>TRADE</Text>
            <Text style={{color: '#707070', fontSize: 14, fontWeight: 'bold'}}>
              {contactsDetail?.trade || '-'}
            </Text>
          </View>
        </ScrollView>

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
                          contactsDetail?.pic
                            ? {uri: contactsDetail?.pic}
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
                {/* {`${contactsDetail?.fname ? contactsDetail?.fname : ''} ${
                  contactsDetail?.mname ? contactsDetail?.mname : ''
                } ${contactsDetail?.lname ? contactsDetail?.lname : ''}`} */}
                {`${contactsDetail?.fname ? contactsDetail?.fname : ''}`}
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

        <Model
          overlayStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
            padding: 10,
          }}
          isVisible={openQRCodeModel}
          onBackdropPress={() => setOpenQRCodeModel(false)}>
          <Image
            style={{height: 250, width: 250}}
            source={contactsDetail?.qr ? {uri: contactsDetail?.qr} : null}
          />
        </Model>
      </View>

      <Loader loading={contactsLoader} />
    </>
  );
}
