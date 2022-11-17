import CardItem from '@cardItem/CardItem';
import {fetchFeedData} from '@flatList/FlatListActions';
import Header from '@header/Header';
import localStyles from '@home/HomeStyles';
import {
  NAVIGATION_ROJGAR,
  NAVIGATION_PARIVAR,
  NAVIGATION_SHIKSHA,
  NAVIGATION_ADHIKAR,
} from '@navigation/NavigationKeys';
import {URLs} from '@networking/Urls';
import {
  ADHIKAR,
  BOOKMARK,
  FEED,
  PARIVAR,
  SAMACHAR,
  SHIKSHA,
} from '@redux/Types';
import {BOOKMARK_SCREEN, SAMACHAR_SCREEN} from '@resources/Constants';
import SearchBar from '@searchBar/SearchBar';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import moment from 'moment';
import React, {Component} from 'react';
import Close from '@icons/close.svg';
import {
  FlatList,
  Image,
  InteractionManager,
  RefreshControl,
  TouchableOpacity,
  View,
  StyleSheet,
  Touchable,
} from 'react-native';
import {connect} from 'react-redux';
import {apiCall as api} from '@networking/withAPI';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';
import { Card } from 'react-native-paper';
import GridFlatList from 'grid-flatlist-react-native';
import Shiksha from '@shiksha/Shiksha';

class FeedListNew extends Component {
  constructor(props) {
    super(props);
    this.action = this.props?.action;
    this.hideSearch = this.props?.hideSearch;
    this.type = this.props?.type;
    this.finalType = this.props?.type;
    this.title = this.props?.title;
    this.url = this.props?.url;
    this.hideHeader = this.props?.hideHeader;
    this.ListHeaderComponent = this.props?.ListHeaderComponent;
    this.name = this.props?.name;
    this.nestedScrollEnabled = this.props?.nestedScrollEnabled;
    this.pageNumber = this.props?.pageNumber;
    this.activeSlide =
      this.action === SAMACHAR || this.action === BOOKMARK ? 0 : -1;
    this.page = 0;
    this.searchString = this.props?.name || '';
    this.content_id = this.props.contentId || 0;
    // this.resetit = this.props.resetit;
    // this.onEndReachedCalledDuringMomentum = false;
    this.post_cat;
    this.encryptedId = 0;
    this.state = {
      refresh: false,
      contentIdValue: 0,
    };
  }

  shouldComponentUpdate = async (nextProps) => {
    // console.log(
    //   'should compor udate',
    //   JSON.stringify(nextProps.contentId, null, 4),
    // );
    console.log('@@@@@Should Compo');
    if (nextProps.ListHeaderComponent !== this.props.ListHeaderComponent) {
      this.ListHeaderComponent = this.props.ListHeaderComponent;
      this.setState({refresh: true});
    }
    this.content_id = this.props.contentId;
    if (
      nextProps.contentId !== this.content_id &&
      // this.content_id !== undefined
      nextProps.contentId !== undefined
    ) {
      if (parseInt(nextProps.contentId) !== 0) {
        this.contentId = nextProps.contentId;
        const {apiSuccess, data} = await api(URLs.DECRYPTED_DATA, {
          // profile_link: route?.params?.content_id,
          // profile_link: 'twu+O2oOBtyikD8oEkxoIN9OzIcbZcKLGgShrME9ZlA=',
          profile_link: nextProps.contentId,
          type: '1',
        });
        var str = data?.data;
        var matches = str.match(/(\d+)/);

        // this.resetit();
        this.encryptedId = matches[0];
        this.fetchFeed(0, nextProps.contentId);
        this.setState({refresh: true});
      } else {
        this.encryptedId = 0;
        this.fetchFeed(0, nextProps.contentId);
        // this.setState({refresh: true});
      }
    }
    return true;
  };

  refresh = (callback) => {
    this.setState(
      {
        refresh: !this.state.refresh,
      },
      () => callback && callback(),
    );
  };

  componentDidMount = async (nextProps) => {
    if (
      // nextProps.contentId !== this.props.contentId &&
      this.props.contentId !== undefined &&
      this.type === 'home'
    ) {
      this.contentId = parseInt(this.props.contentId);
      if (this.contentId !== 0) {
        const {apiSuccess, data} = await api(URLs.DECRYPTED_DATA, {
          // profile_link: route?.params?.content_id,
          profile_link: this.props.contentId,
          type: '1',
        });
        var str = data?.data;
        var matches = str.match(/(\d+)/);

        this.encryptedId = matches[0];
      } else {
        this.encryptedId = 0;
      }
      this.setState({refresh: true});
    }
    // console.log('==>> Content id', this.content_id);
    InteractionManager.runAfterInteractions(() => {
      this.fetchFeed(0);
      // this.unsubscribe = this.props.navigation.addListener('focus', () => {
      //   this.getData()?.length < 1 && this.fetchFeed(0);
      // });
    });
  };

  // componentWillUnmount() {
  //   this.unsubscribe && this.unsubscribe();
  // }

  fetchFeed = (pageNo, contentId = 0) => {
    // console.log(
    //   '==>> fetch feed is called',
    //   this.encryptedId,
    //   typeof this.props.contentId,
    // );
    console.log('this.pageNumber', this.pageNumber);
    if (parseInt(contentId) === 0) {
      this.encryptedId = 0;
    } else {
      console.log('== NOt 0', contentId);
    }

    this.props.fetchFeedData(this.action, this.url || URLs.FEED, {
      perpage: 30,
      pageno: this.pageNumber ? this.pageNumber : pageNo || 0,
      section:
        this.finalType?.length > 0
          ? this.finalType
          : this.finalType?.toLowerCase(),
      searchTerm: this.searchString,
      cont_id: this.encryptedId,
      post_cat: this.post_cat,
    });
    this.setState({contentIdValue: this.encryptedId});
    this.content_id = 0;
  };

  getData = (isLoader) => {
    const {
      feedData,
      parivarData,
      samacharData,
      adhikarData,
      shikshaData,
      bookmarkData,
      feedLoading,
      parivarLoading,
      samacharLoading,
      adhikarLoading,
      shikshaLoading,
      bookmarkLoading,
    } = this.props;
    switch (this.action) {
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

  loadMore = () => {
    // if (!this.onEndReachedCalledDuringMomentum) {
    if (this.getData()?.length > 0 && this.getData()?.length % 30 === 0) {
      this.page = this.page + 1;
      this.fetchFeed(this.page);
    }
    // this.onEndReachedCalledDuringMomentum = true;
    // }
  };

  // onViewableItemsChanged = ({viewableItems, changed}) => {
  //   if (viewableItems && viewableItems.length > 0) {
  //     this.setState({currentVisibleIndex: viewableItems[0].index});
  //   }
  // };

  flatListHeader = () => {
    const {textStyle} = localStyles;

    // const cats = new Array(4).fill({
    //   name: 'cat',
    //   image: 'https://cdn2.thecatapi.com/images/cbt.jpg',
    // });
    const cats = [
      {
          name: "Samajhdar",
          image: require('../../Assest/images/samajdar.png'),
          screen: NAVIGATION_ADHIKAR
      },
      {
          name: "Shiksha",
          image: require('../../Assest/images/shiksha.png'),
          screen: NAVIGATION_SHIKSHA
      },
      {
          name: "Rojgar",
          image: require('../../Assest/images/rojgar.png'),
          screen: NAVIGATION_ROJGAR
      },
      {
          name: "Parivaar",
          image: require('../../Assest/images/parivar.png'),
          screen: NAVIGATION_PARIVAR
      }
  ]

    const renderItem = (item, index) => (
      
        <Card style={styles.cardGrid}>
        <TouchableOpacity onPress={()=> {
                    this.props.navigation.navigate(`${item.screen}`)
        }}>
          <Image source={item.image} style={styles.imageGrid} />
          <Text style={styles.nameGrid}>{`${item.name} `}</Text>
        </TouchableOpacity>
        </Card>
      
    );

    return (
      this.props.recommendJobData?.length > 0 && (
        <View
          style={{
            flex: 1,
            padding: 10,
            // margin: 6,
            // borderWidth: 1,
            // borderColor: '#fff',
            // borderRadius: 5,
            // shadowColor: '#fff',
            // shadowOffset: {width: 1, height: 5},
            // elevation: 5,
            backgroundColor: '#fff',
          }}>
          
          {/* grid view */}
          <GridFlatList
            data={cats}
            renderItem={renderItem}
            gap={10}
            paddingTop={20}
            paddingHorizontal={10}
          />

          <Text
            style={{
              color: '#000',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Recommended Jobs
          </Text>
          <FlatList
            data={this.props.recommendJobData}
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
                  activeOpacity={0.7}
                  onPress={() => {
                    this.props.navigation.navigate(NAVIGATION_ROJGAR_STACK, {
                      screen: NAVIGATION_ROJGAR,
                      params: {job_id},
                    });
                    sendBtnClickToAnalytics('Job Recommend Card');
                  }}>
                  <View style={styles.card}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('@icons/recommendJob.png')}
                        style={{
                          position: 'absolute',
                          alignSelf: 'center',
                          width: '100%',
                          top: 0,
                          bottom: 0,
                          borderRadius: 10,
                        }}
                      />
                    </View>
                    <View style={textStyle}>
                      <Text style={styles.cardTextStyle}>Job Title</Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="clip"
                        style={styles.cardText}>
                        {job_title}
                      </Text>
                    </View>
                    <View style={textStyle}>
                      <Text style={styles.cardTextStyle}>Position</Text>
                      <Text style={styles.cardText}>{noofposition}</Text>
                    </View>
                    <View style={textStyle}>
                      <Text style={styles.cardTextStyle}>Type</Text>
                      <Text style={styles.cardText}>
                        {parseInt(job_type || 0, 10) === 1
                          ? 'Contract'
                          : parseInt(job_type || 0, 10) === 2
                          ? 'Permanent'
                          : '-'}
                      </Text>
                    </View>
                    <View style={textStyle}>
                      <Text style={styles.cardTextStyle}>Start Date</Text>
                      <Text style={styles.cardText}>
                        {job_from
                          ? moment(job_from).format('DD MMM YYYY')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={textStyle}>
                      <Text style={styles.cardTextStyle}>Location</Text>
                      <Text style={styles.cardText}>{location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {!this.hideHeader && (
          <>
            <Header showDrawer navigation={this.props.navigation} />
            {/* <SubHeader title={this.title} navigation={this.props.navigation} /> */}
            
          </>
        )}
        {this.action === SAMACHAR && (
          <View style={{flexDirection: 'row'}}>
            <FlatList
              contentContainerStyle={{
                // flex: 1,
                marginTop: 5,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              keyExtractor={(item, index) => 'resume' + index}
              data={SAMACHAR_SCREEN}
              horizontal
              // onMomentumScrollBegin={() => {
              //   this.onEndReachedCalledDuringMomentum = false;
              // }}
              renderItem={({item, index}) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.activeSlide = index;
                      if (index !== 0) {
                        this.post_cat = item.NAME;
                        this.fetchFeed(0);
                      } else {
                        this.post_cat = undefined;
                        this.fetchFeed(0);
                      }
                      sendBtnClickToAnalytics(`${this.action} Screen`);
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
                        color: index === this.activeSlide ? '#fff' : '#4B79D8',
                      }}>
                      {item.NAME}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
        {this.action === BOOKMARK && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 5,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginTop: 5,
              }}>
              <FlatList
                contentContainerStyle={{
                  // flex: 1,
                  padding: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                keyExtractor={(item, index) => 'resume' + index}
                data={BOOKMARK_SCREEN}
                horizontal
                showsHorizontalScrollIndicator={false}
                // onMomentumScrollBegin={() => {
                //   this.onEndReachedCalledDuringMomentum = false;
                // }}
                renderItem={({item, index}) => (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        if (this.activeSlide !== index) {
                          this.activeSlide = index;
                          if (index === 0) {
                            this.finalType = [
                              BOOKMARK_SCREEN[1].NAME?.toLowerCase(),
                              BOOKMARK_SCREEN[2].NAME?.toLowerCase(),
                              BOOKMARK_SCREEN[3].NAME?.toLowerCase(),
                              BOOKMARK_SCREEN[4].NAME?.toLowerCase(),
                            ];
                          } else {
                            this.finalType = [
                              BOOKMARK_SCREEN[index].NAME?.toLowerCase(),
                            ];
                          }
                          this.fetchFeed(0);
                        }
                        sendBtnClickToAnalytics(`${this.action} Screen`);
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
        )}

        {/* search box */}
        {/* {!this.hideSearch && (
          <SearchBar
            placeholder={strings?.search}
            showMic
            searchValue={this.searchString}
            onClearText={() => {
              this.searchString = '';
              this.fetchFeed(0);
            }}
            onChangeText={(text) => {
              this.searchString = text;
              this.refresh();
            }}
            onSearchPress={() => this.fetchFeed(0)}
          />
        )} */}
        {this.state.contentIdValue ? (
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
                Content Id: {this.state.contentIdValue}
              </Text>
              <TouchableOpacity
                style={{padding: 2}}
                onPress={() => {
                  this.fetchFeed(0);
                  this.setState({contentIdValue: 0});
                  sendBtnClickToAnalytics(`Job Filter Cross Button`);
                }}>
                <Close height={18} width={18} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <FlatList
          ListHeaderComponent={
            this.action === FEED
              ? this.flatListHeader()
              : this.ListHeaderComponent
          }
          keyboardShouldPersistTaps="always"
          data={this.getData()}
          nestedScrollEnabled={this.nestedScrollEnabled}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => this.action + index}
          renderItem={(item, index) => {
            return (
              <CardItem
                currentVisibleIndex={this.state.currentVisibleIndex}
                currentIndex={index}
                navigation={this.props.navigation}
                item={item}
                type={this.type}
                action={this.action}
                // onViewableItemsChanged={this.onViewableItemsChanged}
                // viewabilityConfig={{
                //   viewAreaCoveragePercentThreshold: 90,
                // }}
              />
            );
          }}
          onEndReached={() =>
            this.pageNumber >= 0 ? undefined : this.loadMore()
          }
          // windowSize={10}
          onEndReachedThreshold={0.5}
          // onMomentumScrollBegin={() => {
          //   this.onEndReachedCalledDuringMomentum = false;
          // }}
          ListEmptyComponent={
            !this.getData(true) ? (
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
          refreshControl={
            <RefreshControl
              style={{marginTop: 10}}
              colors={['#9Bd35A', '#689F38']}
              refreshing={this.getData(true)}
              onRefresh={() => {
                this.encryptedId = 0;
                this.fetchFeed(0);
                this.page = 0;
              }}
            />
          }
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    feedData: state.FeedReducer.feedData,
    feedLoading: state.FeedReducer.feedLoading,
    adhikarData: state.AdhikarReducer.adhikarData,
    adhikarLoading: state.AdhikarReducer.adhikarLoading,
    parivarData: state.ParivarReducer.parivarData,
    parivarLoading: state.ParivarReducer.parivarLoading,
    shikshaData: state.ShikshaReducer.shikshaData,
    shikshaLoading: state.ShikshaReducer.shikshaLoading,
    samacharData: state.SamacharReducer.samacharData,
    samacharLoading: state.SamacharReducer.samacharLoading,
    bookmarkData: state.BookmarkReducer.bookmarkData,
    bookmarkLoading: state.BookmarkReducer.bookmarkLoading,
    recommendJobData: state.HomeReducer.recommendJobData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFeedData: (type, url, payload, successCallback, failCallback) =>
      dispatch(
        fetchFeedData(type, url, payload, successCallback, failCallback),
      ),
  };
}

const styles = StyleSheet.create({
  card: {
    width: 310,
    height: 170,
    margin: 10,
    shadowColor: '#52006A',
    elevation: 5,
    opacity: 0.8,
    // backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#000',
    // paddingBottom: 10,
  },
  cardTextStyle: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    marginLeft: 10,
  },
  cardText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    marginRight: '33%',
  },


  // grid css

  cardGrid: {
    height: 170,
    overflow: 'hidden',
    elevation: 5,
    borderRadius: 10
  },
  imageGrid: {
    height: 120,
   width:'100%'
  },
  nameGrid: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center'
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(FeedListNew);
