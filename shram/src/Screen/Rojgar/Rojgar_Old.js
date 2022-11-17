import Header from '@header/Header';
import Close from '@icons/close.svg';
import FilterIcon from '@icons/filter_alt.svg';
import * as NAVIGATION_KEYS from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {APPLY_JOB, JOB_BOOKMARK, ROJGAR} from '@redux/Types';
import {RESUME_SCREEN} from '@resources/Constants';
import DetailsPopup from '@rojgar/DetailsPopup';
import FilterPopup from '@rojgar/FilterPopup';
import OfferPopup from '@rojgar/OfferPopup';
import UpdateProfilePopup from '@rojgar/UpdateProfilePopup';
import SearchBar from '@searchBar/SearchBar';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import React, {useEffect, useState, useReducer} from 'react';
import {
  FlatList,
  Image,
  InteractionManager,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import RojgarItem from './RojgarItem';

export default function FeedList({navigation, url, route}) {
  const dispatch = useDispatch();

  const {profileData} = useSelector((state) => state.ProfileReducer);
  const {rojgarData, rojgarLoading} = useSelector(
    (state) => state.RojgarReducer,
  );

  const [page, setPage] = useState(0);
  const [jobId, setJobId] = useState(route?.params?.job_id || 0);
  const [searchString, setSearchString] = useState('');
  const [localBookmark, setLocalBookmark] = useState(0);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [loading, setLoading] = useState(false);
  const [showFilterPopup, setFilterPopup] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateProfile, setUpdateProfile] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [offerItem, setOfferItem] = useState({});
  const [filterData, setFilterData] = useState({});
  const [detailItem, setDetailsItem] = useState({});
  const [activeSlide, setActiveSlide] = useState();
  const [isSelected, setIsSelected] = useState(0);
  const [updateItems, setUpdateItems] = useState([]);

  const onApplyJob = (item, callBackFunction) => {
    const {job_id} = item;

    const {
      section_1,
      section_2,
      section_3,
      section_4,
      section_5,
      section_6,
      section_7,
    } = profileData || {};
    let items = [];
    if (section_1 !== 1) {
      items.push('Personal Details');
    }
    if (section_2 !== 1) {
      items.push('Address Details');
    }
    if (section_3 !== 1) {
      items.push('Address Details');
    }
    if (section_4 !== 1) {
      items.push('Address Details');
    }
    if (section_5 !== 1) {
      items.push('Address Details');
    }
    if (section_6 !== 1) {
      items.push('Address Details');
    }
    if (section_7 !== 1) {
      items.push('Address Details');
    }
    if (items?.length === 0) {
      dispatch(
        callApi(APPLY_JOB, URLs.APPLY_JOB, {job_id, type: 1}, () => {
          callBackFunction();
          setTimeout(() => {
            fetchFeed(0);
          }, 100);
        }),
      );
    } else {
      setUpdateItems(items);
      setUpdateProfile(true);
    }
  };

  const fetchFeed = (pageNo) => {
    dispatch(
      callApi(ROJGAR, url || URLs.JOB_LIST, {
        perpage: 10,
        pageno: pageNo || 0,
        name: searchString,
        job_id: jobId || undefined,
        ...filterData,
        bookmark: isSelected === 1 ? 1 : undefined,
        status: isSelected === 2 ? [1] : isSelected === 3 ? [2] : undefined,
      }),
    );
  };

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      fetchFeed(0);
    });
    return () => interactionPromise.cancel();
  }, [isSelected, jobId]);

  useEffect(() => {}, [detailItem]);

  const _handleLoadMore = () => {
    if (rojgarData?.length % 10 === 0) {
      setPage(page + 1);
      fetchFeed(page + 1);
    }
  };

  const bookmarkLike = (status, cont_id) => {
    dispatch(
      callApi(JOB_BOOKMARK, URLs.JobBookmark, {
        job_id: cont_id,
        type: status === 0 ? 1 : 0,
      }),
    );
    setLocalBookmark(status === 0 ? 1 : 0);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index?.toString()}
        onPress={() => {
          if (item.application_status === 2) {
            setOfferItem(item);
            setShowOfferPopup(true);
          } else {
            setDetailsItem(item);
            setShowDetails(true);
          }
        }}>
        <RojgarItem
          item={item}
          index={index}
          setIsSelected={setIsSelected}
          setDetailsItem={setDetailsItem}
          setOfferItem={setOfferItem}
          setShowOfferPopup={setShowOfferPopup}
          setUpdateProfile={setUpdateProfile}
          setUpdateItems={setUpdateItems}
        />
      </TouchableOpacity>
    );
  };

  let data = [];
  if (detailItem) {
    data = rojgarData?.data.map((x) => {
      if (x.job_id === detailItem.job_id) {
        console.warn('matched', {...x, bookmark: detailItem.bookmark});
        return {...x, bookmark: detailItem.bookmark};
      }
      return x;
    });
  } else data = rojgarData?.data;
  return (
    <View style={{flex: 1}}>
      <Header showDrawer navigation={navigation} />
      <SubHeader title={'Rojgar'} navigation={navigation} />
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            _handleLoadMore();
          }
        }}
        refreshControl={
          <RefreshControl
            style={{marginTop: 10}}
            colors={['#9Bd35A', '#689F38']}
            refreshing={rojgarLoading}
            onRefresh={() => {
              fetchFeed(0);
            }}
          />
        }>
        <View
          style={{marginTop: 10, marginHorizontal: 5, alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '20%'}}>
              <Text style={{color: '#2751A7', fontSize: 14}}>RESUME</Text>
              <Text style={{color: '#EBB000', fontSize: 16}}>
                {profileData?.resume_level}
              </Text>
            </View>
            <View
              style={{
                width: '80%',
                alignItems: 'center',
              }}>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                keyExtractor={(item, index) => 'resume' + index}
                data={RESUME_SCREEN}
                horizontal
                renderItem={({item, index}) => (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(
                          NAVIGATION_KEYS.NAVIGATION_RESUME_STACK,
                          {
                            screen: NAVIGATION_KEYS.NAVIGATION_RESUME,
                            params: {page: index},
                          },
                        )
                      }
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
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SearchBar
            placeholder="Search"
            showMic
            searchValue={searchString}
            onChangeText={(text) => {
              setSearchString(text);
            }}
            onSearchPress={() => fetchFeed(0)}
            style={{flex: 1}}
          />
          <TouchableOpacity
            onPress={() => {
              setFilterPopup(true);
            }}>
            <FilterIcon
              width={wp(8)}
              height={wp(8)}
              fill="#ffc003"
              style={{marginHorizontal: wp(2)}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 10,
            marginHorizontal: 10,
          }}>
          <TouchableOpacity
            style={{flex: 1.5}}
            activeOpacity={0.7}
            onPress={() => isSelected !== 0 && setIsSelected(0)}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: isSelected === 0 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 0 ? '#fff' : '#4B79D8',
                }}>
                My Resume
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 0 ? '#fff' : '#4B79D8',
                }}>
                {rojgarData?.overall_data?.resume_per}%
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => {
              isSelected !== 1 && setIsSelected(1);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: isSelected === 1 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 1 ? '#fff' : '#4B79D8',
                }}>
                Saved Jobs
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 1 ? '#fff' : '#4B79D8',
                }}>
                {rojgarData?.overall_data?.saved_job || 0}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => isSelected !== 2 && setIsSelected(2)}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: isSelected === 2 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 2 ? '#fff' : '#4B79D8',
                }}>
                Applied Jobs
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 2 ? '#fff' : '#4B79D8',
                }}>
                {rojgarData?.overall_data?.applied_job || 0}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => isSelected !== 3 && setIsSelected(3)}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: isSelected === 3 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 3 ? '#fff' : '#4B79D8',
                }}>
                Job Offers
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: isSelected === 3 ? '#fff' : '#4B79D8',
                }}>
                {rojgarData?.overall_data?.job_offer || 0}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {jobId ? (
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
                Job Id: {jobId}
              </Text>
              <TouchableOpacity
                style={{padding: 2}}
                onPress={() => {
                  setJobId(0);
                }}>
                <Close height={18} width={18} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {!loading ? (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{paddingBottom: 10}}
            data={data}
            extraData={detailItem}
            showsVerticalScrollIndicator={false}
            renderItem={(item, index) => renderItem(item, index)}
            keyboardShouldPersistTaps="always"
            refreshControl={
              <RefreshControl
                style={{marginTop: 10}}
                colors={['#9Bd35A', '#689F38']}
                refreshing={loading}
                onRefresh={() => {
                  forceUpdate();
                }}
              />
            }
            removeClippedSubviews={false}
            ListEmptyComponent={
              !rojgarLoading ? (
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
          />
        ) : null}
        {showFilterPopup && (
          <FilterPopup
            selectedFilter={filterData}
            onClose={() => {
              setFilterPopup(false);
            }}
            onSuccess={(respData) => {
              setFilterData(respData);
              setFilterPopup(false);
              fetchFeed(0);
            }}
          />
        )}
        {showDetails && (
          <DetailsPopup
            item={detailItem}
            onClose={() => {
              setShowDetails(false);
            }}
            onBookmarkPress={bookmarkLike}
            localBookmark={localBookmark}
            onApplyJob={onApplyJob}
            setDetailsItem={setDetailsItem}
            setLoading={setLoading}
            resumePercentage={rojgarData?.overall_data?.resume_per}
          />
        )}
        {showOfferPopup && (
          <OfferPopup
            item={offerItem}
            onClose={() => {
              setShowOfferPopup(false);
            }}
            onCallBack={fetchFeed}
          />
        )}
        {showUpdateProfile && (
          <UpdateProfilePopup
            item={updateItems}
            onClose={() => {
              setUpdateProfile(false);
            }}
            navigation={navigation}
          />
        )}
      </ScrollView>
    </View>
  );
}
