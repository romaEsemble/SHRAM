import Header from '@header/Header';
import Loader from '@loader/Loader';
import MyPostItem from '@myPost/MyPostItem';
import localStyles from '@myPost/MyPostStyles';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {JOB_POST_LIST} from '@redux/Types';
import {MY_POST_STATUS} from '@resources/Constants';
import strings from '@resources/Strings';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useEffect, useState} from 'react';
import {Image, InteractionManager, RefreshControl, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function MyPost(props) {
  const {navigation} = props;
  const {myPostData, myPostLoading} = useSelector(
    (state) => state.MyPostReducer,
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [localMyPostData, setLocalMyPostData] = useState([]);

  const dispatch = useDispatch();
  const useMount = (func) => useEffect(() => func(), []);

  // useMount(() => {
  //   console.log('MOunt');
  //   const interactionPromise = InteractionManager.runAfterInteractions(() =>
  //     dispatch(
  //       callApi(JOB_POST_LIST, URLs.MY_POST, {
  //         type: MY_POST_STATUS[activeSlide].TYPE,
  //       }),
  //     ),
  //   );
  //   return () => interactionPromise.cancel();
  // });

  const getData = () => {
    dispatch(
      callApi(
        JOB_POST_LIST,
        URLs.MY_POST,
        {
          type: MY_POST_STATUS[activeSlide].TYPE,
        },
        (data) => {
          // console.log('fd', data);
        },
      ),
    );
  };

  useEffect(() => {
    setLocalMyPostData(myPostData);
  }, [myPostData]);

  useEffect(() => {
    console.log('USeeffect called after params changed');
    const msg = props?.route?.params?.status;
    if (msg == 'Post Rejected') {
      setActiveSlide(2);
    } else if (msg == 'Post Approved') {
      setActiveSlide(1);
    }
    // getData();
    return () => {};
  }, [props?.route?.params]);

  useEffect(() => {
    console.log('USeeffect called after slide changed');
    getData();
    return () => {};
  }, [activeSlide]);

  const {flex1, optionsContainer, flatListContainerStyle, optionView} =
    localStyles;

  return (
    <View style={flex1}>
      <Header showNotification showCall showDrawer />
      <SubHeader title={strings?.myPost} navigation={navigation} />
      <View style={optionsContainer}>
        <FlatList
          contentContainerStyle={flatListContainerStyle}
          keyExtractor={(item, index) => 'resume' + index}
          showsHorizontalScrollIndicator={false}
          data={MY_POST_STATUS}
          horizontal
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                setActiveSlide(index);
                sendBtnClickToAnalytics(`${strings?.myPost} Tab ${item.NAME}`);
                // dispatch(
                //   callApi(JOB_POST_LIST, URLs.MY_POST, {
                //     type: MY_POST_STATUS[index].TYPE,
                //   }),
                // );
              }}
              style={[
                optionView,
                {
                  backgroundColor: index === activeSlide ? '#4B79D8' : '#fff',
                },
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  marginHorizontal: 5,
                  color: index === activeSlide ? '#fff' : '#4B79D8',
                }}>
                {item.NAME}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {myPostLoading ? (
        <Loader loading />
      ) : myPostData && myPostData.length > 0 ? (
        <FlatList
          keyExtractor={(item, index) => 'list' + index}
          contentContainerStyle={{paddingBottom: 10}}
          data={localMyPostData}
          refreshControl={
            <RefreshControl
              style={{marginTop: 10}}
              colors={['#9Bd35A', '#689F38']}
              refreshing={myPostLoading}
              onRefresh={() => {
                getData(0);
              }}
            />
          }
          renderItem={(item) => MyPostItem(item, navigation)}
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={require('@icons/nodata.png')}
            style={{
              margin: 10,
              height: 200,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
          />
          <Text style={{fontSize: 18}}>{strings?.noDataFound}</Text>
        </View>
      )}
    </View>
  );
}
