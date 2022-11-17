import CardItem from '@cardItem/CardItem';
import Header from '@header/Header';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {
  ADHIKAR,
  BOOKMARK,
  FEED,
  PARIVAR,
  SAMACHAR,
  SHIKSHA,
} from '@redux/Types';
// import AdhikarBg from '@icons/AdhikarBg.svg';
// import ParivarBg from '@icons/ParivarBg.svg';
// import ShikshaBg from '@icons/ShikshaBg.svg';
import {BOOKMARK_SCREEN, SAMACHAR_SCREEN} from '@resources/Constants';
import SearchBar from '@searchBar/SearchBar';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  InteractionManager,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export default function FeedList({
  action,
  hideSearch,
  type,
  title,
  navigation,
  url,
  hideHeader,
  name,
  nestedScrollEnabled,
  pageNumber,
}) {
  const dispatch = useDispatch();
  let onEndReachedCalledDuringMomentum = false;
  const [activeSlide, setActiveSlide] = useState();
  const [finalType, setFinalType] = useState(type);
  const {feedData, feedLoading} = useSelector((state) => state.FeedReducer);
  const {adhikarData, adhikarLoading} = useSelector(
    (state) => state.AdhikarReducer,
  );
  const {parivarData, parivarLoading} = useSelector(
    (state) => state.ParivarReducer,
  );
  const {shikshaData, shikshaLoading} = useSelector(
    (state) => state.ShikshaReducer,
  );
  const {samacharData, samacharLoading} = useSelector(
    (state) => state.SamacharReducer,
  );
  const {bookmarkData, bookmarkLoading} = useSelector(
    (state) => state.BookmarkReducer,
  );
  const getData = (isLoader) => {
    switch (action) {
      case FEED:
        return isLoader ? feedLoading : feedData;
      case PARIVAR:
        return isLoader ? parivarLoading : parivarData;
      case SAMACHAR:
        return isLoader ? samacharLoading : samacharData;
      case ADHIKAR:
        return isLoader ? adhikarLoading : adhikarData;
      case SHIKSHA:
        return isLoader ? shikshaLoading : shikshaData;
      case BOOKMARK:
        return isLoader ? bookmarkLoading : bookmarkData;
    }
  };

  const [page, setPage] = useState(0);
  const [searchString, setSearchString] = useState(name || '');

  const fetchFeed = (pageNo) => {
    dispatch(
      callApi(action, url || URLs.FEED, {
        perpage: 30,
        pageno: pageNumber ? pageNumber : pageNo || 0,
        section: finalType?.length > 0 ? finalType : finalType?.toLowerCase(),
        searchTerm: searchString,
      }),
    );
  };

  React.useEffect(() => {
    // The screen is focused
    // Call any action
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getData()?.length < 1 && fetchFeed(0);
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      });
      return () => interactionPromise.cancel();
    }, [navigation]);
  });

  useEffect(
    (prevState) => {
      prevState?.finalType !== finalType && fetchFeed(0);
    },
    [finalType],
  );

  useEffect(
    (prevState) => {
      if (prevState?.searchString !== '' && searchString === '') {
        fetchFeed(0);
      }
    },
    [pageNumber, searchString],
  );

  const loadMore = () => {
    if (!onEndReachedCalledDuringMomentum) {
      if (getData()?.length > 0 && getData()?.length % 30 === 0) {
        setPage(page + 1);
        fetchFeed(page + 1);
      }
      onEndReachedCalledDuringMomentum = true;
    }
  };

  return (
    <View style={{flex: 1}}>
      {!hideHeader && (
        <>
          <Header showDrawer navigation={navigation} />
          <SubHeader title={title} navigation={navigation} />
        </>
      )}
      {action === SAMACHAR && (
        <View style={{flexDirection: 'row'}}>
          <FlatList
            contentContainerStyle={{
              flex: 1,
              marginTop: 10,
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            keyExtractor={(item, index) => 'resume' + index}
            data={SAMACHAR_SCREEN}
            horizontal
            onEndReached={() => loadMore()}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum = false;
            }}
            renderItem={({item, index}) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setActiveSlide(index);
                    setSearchString(item.NAME);
                  }}
                  style={{
                    borderWidth: 1,
                    borderRadius: 15,
                    borderColor: '#fff',
                    elevation: 6,
                    paddingHorizontal: 5,
                    marginHorizontal: 5,
                    backgroundColor: index === activeSlide ? '#4B79D8' : '#fff',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginHorizontal: 5,
                      color: index === activeSlide ? '#fff' : '#4B79D8',
                    }}>
                    {item.NAME}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      {action === BOOKMARK && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
          <View>
            <Text style={{color: 'grey', fontSize: 16}}>BOOK</Text>
            <Text style={{color: 'grey', fontSize: 16}}>MARKS</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <FlatList
              contentContainerStyle={{
                flex: 1,
                padding: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              keyExtractor={(item, index) => 'resume' + index}
              data={BOOKMARK_SCREEN}
              horizontal
              onEndReached={() => loadMore()}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum = false;
              }}
              renderItem={({item, index}) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveSlide(index);
                      setFinalType([
                        BOOKMARK_SCREEN[index].NAME?.toLowerCase(),
                      ]);
                    }}
                    style={{
                      borderWidth: 1,
                      borderRadius: 15,
                      borderColor: '#fff',
                      elevation: 6,
                      paddingHorizontal: 5,
                      marginHorizontal: 5,
                      backgroundColor:
                        index === activeSlide ? '#4B79D8' : '#fff',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginHorizontal: 5,
                        color: index === activeSlide ? '#fff' : '#4B79D8',
                      }}>
                      {item.NAME}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}

      {!hideSearch && (
        <SearchBar
          placeholder="Search"
          showMic
          searchValue={searchString}
          onChangeText={(text) => {
            setSearchString(text);
          }}
          onSearchPress={() => fetchFeed(0)}
        />
      )}

      <FlatList
        keyboardShouldPersistTaps="always"
        data={getData()}
        nestedScrollEnabled={nestedScrollEnabled}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => (
          <CardItem
            item={item}
            type={type}
            // AdhikarBg={AdhikarBg}
            // ParivarBg={ParivarBg}
            // ShikshaBg={ShikshaBg}
          />
        )}
        onEndReached={() => (pageNumber >= 0 ? undefined : loadMore())}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        ListEmptyComponent={
          !getData(true) ? (
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
              <Text style={{fontSize: 18}}>No Data Found</Text>
            </View>
          ) : (
            <View />
          )
        }
        refreshControl={
          action !== FEED ? (
            <RefreshControl
              style={{marginTop: 10}}
              colors={['#9Bd35A', '#689F38']}
              refreshing={getData(true)}
              onRefresh={() => {
                fetchFeed(0);
              }}
            />
          ) : undefined
        }
      />
    </View>
  );
}
