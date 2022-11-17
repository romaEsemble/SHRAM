import Header from '@header/Header';
import Close from '@icons/close.svg';
import FilterIcon from '@icons/filter_alt.svg';
import * as NAVIGATION_KEYS from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import {APPLY_JOB, JOB_BOOKMARK, ROJGAR, PLT_COMMON} from '@redux/Types';
import {RESUME_SCREEN} from '@resources/Constants';
import DetailsPopup from '@rojgar/DetailsPopup';
import FilterPopup from '@rojgar/FilterPopup';
import OfferPopup from '@rojgar/OfferPopup';
import {
  applyJob,
  fetchFeedData,
  jobBookmark,
  pltCommonData,
} from '@rojgar/RojgarActions';
import UpdateProfilePopup from '@rojgar/UpdateProfilePopup';
import SearchBar from '@rojgar/rojgarSearchBar';
// import SearchBar from '@searchBar/SearchBar';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import React, {Component} from 'react';
import {apiCall as api} from '@networking/withAPI';
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRoute, CommonActions} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import RojgarItem from './RojgarItem';
import strings from '@resources/Strings';
import {showSnackBar} from '@utils/Util';
import {sendBtnClickToAnalytics} from '@utils/Util';

class Rojgar extends Component {
  constructor(props) {
    super(props);
    this.oldParams = null;
    this.navigation = this.props.navigation;
    this.page = 0;
    this.searchString = '';
    this.localBookmark = 0;
    this.loading = false;
    this.showFilterPopup = false;
    this.showDetails = false;
    this.showUpdateProfile = false;
    this.showOfferPopup = false;
    this.offerItem = {};
    this.filterData = {};
    this.detailItem = {};
    this.activeSlide;
    this.isSelected = 0;
    this.notificationJobID = null;
    this.updateItems = [];
    this.onEndReachedCalledDuringMomentum = false;
    this.savedCount = this.props.rojgarData?.overall_data?.saved_job || 0;

    this.state = {
      refresh: false,
      jobValue: 0,
      searchKey: null,
      // updated: 0,
    };
  }

  componentDidMount() {
    // this.fetchFeed(0);
    // console.log('Did Mount', this.props?.route?.params);
    this.hitApi(this.props?.route?.params);
    this.hitAPiForPLt();
  }

  shouldComponentUpdate = async (nextProps) => {
    console.log(
      'Did Update',
      this.props?.route?.params,
      nextProps?.route?.params,
    );
    const jobStatus = nextProps?.route?.params?.jobStatus;
    if (nextProps?.route?.params?.jobUserId != 0) {
      this.notificationJobID = nextProps?.route?.params?.jobUserId;
    }
    console.log(
      'Job user ffrom notification',
      this.notificationJobID,
      nextProps?.route?.params?.jobUserId,
    );
    const jobId = nextProps?.route?.params?.job_id;
    if (jobId != 0) {
      this.isSelected = 0;
      // this.fetchFeed(0);
      // return;
    }

    if (jobStatus == 7 || jobStatus == 2) {
      this.searchString = '';
      this.isSelected = 3;
      this.fetchFeed(0);
      return;
    } else if (jobStatus == 3) {
      this.searchString = '';
      this.isSelected = 4;
      this.fetchFeed(0);
      return;
    }
    this.hitApi(nextProps?.route?.params);
    // console.log('pLt common data', this.props.pltData);
  };

  hitApi = async (allParams) => {
    try {
      // var type = this.props?.route?.params?.type;
      var type = allParams?.type;
      if (allParams) {
        if ('type' in allParams) {
          if (type === '') {
            if (allParams?.job_id !== 0) {
              // Decrypted
              this.fetchFeed(0, allParams?.job_id);
            } else if (allParams?.a !== 0) {
              // hit decrypt api
              const unEncrypted = await this.unencrypt(
                allParams?.a.replace(' ', '+'),
              );
              this.fetchFeed(0, unEncrypted);
            }
          } else {
            // Already decrypted
            this.fetchFeed(0, allParams?.job_id);
          }
        } else {
          if ('job_id' in allParams && allParams?.job_id !== 0) {
            // Decrypted
            this.fetchFeed(0, allParams?.job_id);
          } else if (allParams?.a !== 0 || allParams?.a !== '') {
            const unEncrypted = await this.unencrypt(
              allParams?.a.replace(' ', '+'),
            );
            this.fetchFeed(0, unEncrypted);
          }
        }
      } else {
        this.fetchFeed(0);
      }
    } catch (error) {}
  };

  hitAPiForPLt = async () => {
    this.props.pltCommonData(PLT_COMMON, URLs.PLT_COMMON_DATA, {
      comm_name: 'industry',
      app_lang: strings?.getLanguage(),
    });
  };

  fetchFeed = (pageNo, value = 0) => {
    try {
      console.log('Pga enumber', pageNo);
      if (pageNo == 0) {
        console.log('Page num is', pageNo);
        this.page = 0;
      }
      // console.log('This fileterdata', this.filterData);
      this.setState({jobValue: value});
      const payload = {
        perpage: 20,
        pageno: pageNo || 0,
        name: this.searchString,
        job_id: value || undefined,
        ...this.filterData,
        bookmark: this.isSelected === 1 ? 1 : undefined,
        status:
          this.isSelected === 2
            ? [1]
            : this.isSelected === 3
            ? [2, 7]
            : this.isSelected === 4
            ? [3, 4, 5, 6]
            : undefined,
      };
      this.props.fetchFeedData(
        ROJGAR,
        this.props.url || URLs.JOB_LIST,
        payload,
      );
      this.navigation.dispatch(
        CommonActions.setParams({
          type: '',
          job_id: 0,
          a: 0,
          jobStatus: 0,
          jobUserId: 0,
        }),
      );
    } catch (error) {
      console.log('errro', error);
    }
  };

  refresh = (callback) => {
    this.setState(
      {
        refresh: !this.state.refresh,
      },
      () => callback && callback(),
    );
  };

  unencrypt = async (encrypted) => {
    if (parseInt(encrypted) !== 0) {
      const {apiSuccess, data} = await api(URLs.DECRYPTED_DATA, {
        // profile_link: route?.params?.content_id,
        profile_link: encrypted,
        type: '1',
      });
      var str = data?.data;
      var matches = str.match(/(\d+)/);
      // this.fetchFeed(0);

      return matches[0];
    } else {
      return 0;
    }
  };

  loadMore = () => {
    // console.log('Items more', this.page);
    if (!this.onEndReachedCalledDuringMomentum) {
      if (this.props.rojgarData?.data?.length % 10 === 0) {
        this.page = this.page + 1;
        this.fetchFeed(this.page);
      }
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  appliedClicked = (jobID) => {
    console.log('Job id is', jobID);
    // this.props.applyJobLocal('Applied', {job_id: jobID});

    // this.setState({refresh: true});
    this.fetchFeed(0);
  };

  setIsSelected = (value) => {
    this.isSelected = value;
    this.setState({refresh: true});
  };

  setDetailsItem = (value) => {
    this.detailItem = value;
    if (
      this.savedCount != this.props.rojgarData?.overall_data?.saved_job &&
      this.savedCount == 0
    ) {
      this.savedCount = this.props.rojgarData?.overall_data?.saved_job || 0;
    }
    if (value?.bookmark == 1) {
      this.savedCount = this.savedCount + 1;
    } else if (value?.bookmark == 0) {
      this.savedCount = this.savedCount - 1;
    }
    this.setState({refresh: true});
  };

  setOfferItem = (value) => {
    this.offerItem = value;
    this.setState({refresh: true});
  };

  setShowOfferPopup = (value) => {
    this.showOfferPopup = value;
    this.setState({refresh: true});
  };

  setUpdateProfile = (value) => {
    this.showUpdateProfile = value;
    this.setState({refresh: true});
  };

  setUpdateItems = (value) => {
    this.updateItems = value;
    this.setState({refresh: true});
  };

  setLoading = (value) => {
    this.loading = value;
    this.setState({refresh: true});
  };

  renderItem = ({item, index}) => {
    // {
    //   console.log('render rojgar card', index);
    // }
    return (
      <TouchableOpacity
        key={item?.job_id.toString()}
        activeOpacity={0.8}
        onPress={() => {
          if (item.application_status === 2) {
            this.offerItem = item;
            this.showOfferPopup = true;
            this.setState({refresh: true});
          } else {
            this.detailItem = item;
            this.showDetails = true;
            this.setState({refresh: true});
          }
        }}>
        <RojgarItem
          item={item}
          currentTab={this.isSelected}
          index={index}
          updateApply={this.appliedClicked}
          setIsSelected={this.setIsSelected}
          setDetailsItem={this.setDetailsItem}
          setOfferItem={this.setOfferItem}
          setShowOfferPopup={this.setShowOfferPopup}
          setUpdateProfile={this.setUpdateProfile}
          setUpdateItems={this.setUpdateItems}
        />
      </TouchableOpacity>
    );
  };

  onApplyJob = (item, callBackFunction) => {
    console.log('Items', item);
    const {job_id} = item;
    // return false;

    const {
      section_1,
      section_2,
      section_3,
      section_4,
      // section_5,
      section_6,
      // section_7,
    } = this.props.profileData || {};
    let items = [];
    if (section_1 !== 1) {
      items.push('Contact Details');
    }
    if (section_2 !== 1) {
      items.push('Address Details');
    }
    if (section_3 !== 1) {
      items.push('Professional Details');
    }
    if (section_4 !== 1) {
      items.push('Skill Details');
    }
    if (section_6 !== 1) {
      items.push('Personal Details');
    }
    // if (section_5 !== 1) {
    //   items.push('Education Details');
    // }
    // if (section_7 !== 1) {
    //   items.push('Personal ID Details');
    // }
    if (items?.length === 0) {
      const payload = {job_id, type: 1};
      this.props.applyJob(APPLY_JOB, URLs.APPLY_JOB, payload, () => {
        callBackFunction();
        setTimeout(() => {
          this.fetchFeed(0);
        }, 100);
      });
    } else {
      this.updateItems = items;
      this.showUpdateProfile = true;
      this.setState({refresh: true});
    }
  };

  bookmarkLike = (status, cont_id) => {
    const payload = {
      job_id: cont_id,
      type: status === 0 ? 1 : 0,
    };
    this.props.jobBookmark(JOB_BOOKMARK, URLs.JobBookmark, payload);
    this.localBookmark = status === 0 ? 1 : 0;
    this.setState({refresh: true});
  };

  flatlistHeaderComponent = () => {
    const {navigation} = this.props;
    return (
      <>
        <View
          style={{marginTop: 10, marginHorizontal: 5, alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '20%'}}>
              <Text style={{color: '#2751A7', fontSize: 14}}>
                {strings?.resume}
              </Text>
              <Text style={{color: '#2751A7', fontSize: 16}}>
                {this.props.profileData?.resume_level}
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
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(
                          NAVIGATION_KEYS.NAVIGATION_RESUME_STACK,
                          {
                            screen: NAVIGATION_KEYS.NAVIGATION_RESUME,
                            params: {page: index},
                          },
                        );
                        sendBtnClickToAnalytics('Resume Screen' + item.NAME);
                      }}
                      style={{
                        borderWidth: 1,
                        borderRadius: 15,
                        borderColor: '#fff',
                        elevation: 6,
                        paddingHorizontal: 5,
                        marginHorizontal: 5,
                        backgroundColor:
                          index === this.activeSlide ? '#4B79D8' : '#fff',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginHorizontal: 5,
                          color:
                            index === this.activeSlide ? '#fff' : '#4B79D8',
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
          {/* <Text>Hello Unknown {this.props?.route?.params?.a}</Text> */}
          <View style={{flex: 1}}>
            <SearchBar
              onSearchPress={(text) => {
                this.searchString = text;
                console.log('Value is', text);
                this.fetchFeed(0);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.showFilterPopup = true;
              this.setState({refresh: true});
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
            style={{flex: 1}}
            activeOpacity={0.7}
            onPress={() => {
              if (this.isSelected !== 0) {
                this.isSelected = 0;
                this.fetchFeed(0);
                // this.setState({refresh: true});
              }
              sendBtnClickToAnalytics(strings?.all);
            }}>
            <View
              style={{
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: this.isSelected === 0 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  height: '90%',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10,
                  color: this.isSelected === 0 ? '#fff' : '#4B79D8',
                }}>
                {strings?.all}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => {
              if (this.isSelected !== 1) {
                this.isSelected = 1;
                this.fetchFeed(0);
                // this.setState({refresh: true});
              }
              sendBtnClickToAnalytics(strings?.saved);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: this.isSelected === 1 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 1 ? '#fff' : '#4B79D8',
                }}>
                {strings?.saved}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 1 ? '#fff' : '#4B79D8',
                }}>
                {this.savedCount == 0
                  ? this.props.rojgarData?.overall_data?.saved_job || 0
                  : this.savedCount}
                {/* {this.props.rojgarData?.overall_data?.saved_job || 0} */}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => {
              if (this.isSelected !== 2) {
                this.isSelected = 2;
                this.fetchFeed(0);
                // this.setState({refresh: true});
              }
              sendBtnClickToAnalytics(strings?.applied);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: this.isSelected === 2 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 2 ? '#fff' : '#4B79D8',
                }}>
                {strings?.applied}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 2 ? '#fff' : '#4B79D8',
                }}>
                {this.props.rojgarData?.overall_data?.applied_job || 0}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => {
              if (this.isSelected !== 3) {
                this.isSelected = 3;
                this.fetchFeed(0);
                // this.setState({refresh: true});
              }
              sendBtnClickToAnalytics(strings?.offered);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: this.isSelected === 3 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 3 ? '#fff' : '#4B79D8',
                }}>
                {strings?.offered}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 3 ? '#fff' : '#4B79D8',
                }}>
                {this.props.rojgarData?.overall_data?.job_offer || 0}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            activeOpacity={0.7}
            onPress={() => {
              if (this.isSelected !== 4) {
                this.isSelected = 4;
                this.fetchFeed(0);
                // this.setState({refresh: true});
              }
              sendBtnClickToAnalytics(strings?.closed);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#4B79D8',
                borderRadius: 5,
                paddingVertical: 8,
                backgroundColor: this.isSelected === 4 ? '#4B79D8' : null,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 4 ? '#fff' : '#4B79D8',
                }}>
                {strings?.closed}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: this.isSelected === 4 ? '#fff' : '#4B79D8',
                }}>
                {this.props.rojgarData?.overall_data?.closed || 0}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.state.jobValue ? (
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
                Job Id: {this.state.jobValue}
              </Text>
              <TouchableOpacity
                style={{padding: 2}}
                onPress={() => {
                  this.fetchFeed(0);
                  this.setState({jobValue: 0});
                }}>
                <Close height={18} width={18} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </>
    );
  };

  render() {
    console.log('Render issue');
    const {navigation, route} = this.props;
    // console.log('Nav params', route, route?.params?.job_id || route?.params?.a);
    // if ('type' in this.props.route.params) {
    //   console.log('type exitss', this.props.route.params.type);
    // } else {
    //   console.log('type not exitss');
    // }
    // console.log('Rendering rojgar', this.props.rojgarData?.data);

    let data = [];
    try {
      if (this.detailItem) {
        data = this.props.rojgarData?.data.map((x) => {
          if (x.job_id === this.detailItem.job_id) {
            return {...x, bookmark: this.detailItem.bookmark};
          } else if (!x.bookmark) {
            return {...x, bookmark: 0};
          }
          return x;
        });
      } else data = this.props.rojgarData?.data;
      console.log(
        '@@Im triggered',
        data?.length,
        this.notificationJobID,
        data?.some((value) => value.job_user_id == this.notificationJobID),
      );
      if (this.notificationJobID) {
        if (
          !data?.some((value) => value.job_user_id == this.notificationJobID)
        ) {
          /* vendors contains the element we're looking for */
          setTimeout(() => {
            console.log('Value not exits');
            showSnackBar(strings?.noDataAfterRedirect, 'error');
          }, 2000);
          this.notificationJobID = 0;
        }
      }
    } catch (error) {
      console.log('error is render', error);
    }

    return (
      <View style={{flex: 1}}>
        <Header showDrawer navigation={navigation} />
        <SubHeader title={'Rojgar'} navigation={navigation} />
        {!this.loading ? (
          <FlatList
            // inverted
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            ListHeaderComponent={() => this.flatlistHeaderComponent()}
            contentContainerStyle={{paddingBottom: 10}}
            data={data}
            extraData={this.detailItem}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyboardShouldPersistTaps="always"
            // keyExtractor={(item, index) => 'rojgarList' + index}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
            maxToRenderPerBatch={60}
            windowSize={30}
            // maxToRenderPerBatch={10}
            // onEndReachedThreshold={2} // multiples of length
            // scrollEventThrottle={50}
            // updateCellsBatchingPeriod={50}
            // windowSize={5} // multiples of length
            refreshControl={
              <RefreshControl
                style={{marginTop: 10}}
                colors={['#9Bd35A', '#689F38']}
                refreshing={this.props.rojgarLoading || this.loading}
                onRefresh={() => {
                  this.fetchFeed(0);
                }}
              />
            }
            onEndReached={() => this.loadMore()}
            onEndReachedThreshold={0.5}
            // removeClippedSubviews={false}
            ListEmptyComponent={
              !this.props.rojgarLoading ? (
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
              ) : (
                <View />
              )
            }
          />
        ) : null}
        {this.showFilterPopup && (
          <FilterPopup
            pltData={this.props.pltData}
            selectedFilter={this.filterData}
            onClose={() => {
              this.showFilterPopup = false;
              this.setState({refresh: true});
            }}
            onSuccess={(respData) => {
              this.filterData = respData;
              this.showFilterPopup = false;
              this.fetchFeed(0);
            }}
          />
        )}
        {this.showDetails && (
          <DetailsPopup
            applicationStatus={this.detailItem?.job_post_status}
            currentTab={this.isSelected}
            item={this.detailItem}
            onClose={() => {
              this.showDetails = false;
              this.setState({refresh: true});
            }}
            onBookmarkPress={this.bookmarkLike}
            localBookmark={this.localBookmark}
            onApplyJob={this.onApplyJob}
            setDetailsItem={this.setDetailsItem}
            setLoading={this.setLoading}
            resumePercentage={this.props.rojgarData?.overall_data?.resume_per}
          />
        )}
        {this.showOfferPopup && (
          <OfferPopup
            item={this.offerItem}
            onClose={() => {
              this.showOfferPopup = false;
              this.setState({refresh: true});
            }}
            onCallBack={this.fetchFeed}
          />
        )}
        {this.showUpdateProfile && (
          <UpdateProfilePopup
            item={this.updateItems}
            onClose={() => {
              this.showUpdateProfile = false;
              this.setState({refresh: true});
            }}
            navigation={navigation}
          />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    profileData: state.ProfileReducer.profileData,
    rojgarData: state.RojgarReducer.rojgarData,
    pltData: state.RojgarReducer.pltData,
    rojgarLoading: state.RojgarReducer.rojgarLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFeedData: (type, url, payload) =>
      dispatch(fetchFeedData(type, url, payload)),
    applyJob: (type, url, payload, callbackFunc) =>
      dispatch(applyJob(type, url, payload, callbackFunc)),
    jobBookmark: (type, url, payload) =>
      dispatch(jobBookmark(type, url, payload)),
    pltCommonData: (type, url, payload) =>
      dispatch(pltCommonData(type, url, payload)),
    applyJobLocal: (type, payload) => dispatch({type: type, payload: payload}),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rojgar);
