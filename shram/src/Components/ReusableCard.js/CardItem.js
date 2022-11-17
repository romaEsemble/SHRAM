import BottomBar from '@bottomBar/BottomBar';
import ReusableImage from '@cardItem/ReusableImage';
import ReusableVideo from '@cardItem/ReusableVideo';
import AdhikarIcon from '@icons/AdhikarIcon.svg';
import AnnouncementIcon from '@icons/announcement.svg';
import ShikshaIcon from '@icons/shikshaFeed.svg';
import {TEXT_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import moment from 'moment';
// import PropTypes from 'prop-types';
import PropTypes from 'deprecated-react-native-prop-types';
import React from 'react';
import {ActivityIndicator, View, Image, Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ReusableYoutubePlayer from '@cardItem/ReusableYoutubePlayer';
import VideoPlayer from '@rojgar/VideoPlayer';
import {GetPhotoBaseURL} from '@networking/Urls';

// import Orientation from 'react-native-orientation-locker';

export default class CardItem extends React.Component {
  constructor(props) {
    super(props);
    this.pageStatus = null;
  }
  // componentDidMount() {
  //   // console.log('##MOunted');
  //   this.pageStatus = 'mounted';
  // }
  // componentWillUnmount() {
  //   // console.log('###Unmounted');
  //   this.pageStatus = 'unmounted';
  // }

  render() {
    const {
      item,
      // currentVisibleIndex,
      // currentIndex,
      showLoader,
      style,
    } = this.props;
    // console.log('Item is', item);
    const {
      cont_id,
      section,
      header,
      descri,
      tags,
      cont_type,
      cont_file_type,
      cont_link,
      sch_date,
      bookmark,
      like,
      content_share_link,
    } = item?.item;
    // console.log('ITem to be shown', item?.item);
    return (
      <View
        style={[
          {
            // paddingHorizontal: wp(2),
            backgroundColor: '#fff',
            // elevation: 8,
            // marginHorizontal: wp(2),
            // marginTop: 5,
            // marginBottom: 5,
          },
          style,
        ]}>
        {/* {section?.toLowerCase() === 'samajhdar' ? (
          <Image
            source={require('@icons/AdhikarBg.png')}
            style={{position: 'absolute', top: 0, right: 0}}
          />
        ) : section?.toLowerCase() === 'shiksha' ? (
          <Image
            source={require('@icons/ShikshaBg.png')}
            style={{position: 'absolute', top: 0, right: 0}}
          />
        ) : section?.toLowerCase() === 'parivar' ? (
          <Image
            source={require('@icons/ParivarBg.png')}
            style={{position: 'absolute', top: 0, right: 0}}
          />
        ) : null} */}

        {/* {section?.toLowerCase() !== 'samachar' && ( */}
        <View
          style={[
            {
              flexDirection: 'row',
              padding: 10,
            },
          ]}>
          <View
            style={{
              height: 45,
              width: 45,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                section?.toLowerCase() === 'samajhdar'
                  ? '#FFC003'
                  : section?.toLowerCase() === 'shiksha'
                  ? '#4EAF47'
                  : '#DF3E3E',
              padding: 10,
              borderRadius: 50,
            }}>
            {section?.toLowerCase() === 'samajhdar' ? (
              <AdhikarIcon width={wp(10)} height={wp(10)} />
            ) : section?.toLowerCase() === 'shiksha' ? (
              <ShikshaIcon width={wp(6)} height={wp(6)} />
            ) : (
              <AnnouncementIcon width={wp(5)} height={wp(5)} />
            )}
          </View>
          <View style={{marginLeft: 10}}>
            <Text bold type={TEXT_TYPE.SMALL}>
              {header}
            </Text>
            {/* <Text light type={TEXT_TYPE.EXTRA_SMALL} style={{marginTop: 5}}>
              {section}
            </Text> */}
            {sch_date && (
              <Text light type={TEXT_TYPE.TINY} style={{marginTop: 1}}>
                {moment(sch_date).format('DD/MM/YYYY hh:mm')}
              </Text>
            )}
          </View>
        </View>
        {/* )} */}

        {cont_file_type === 1 && (
          <ReusableImage cont_link={cont_link} cont_type={cont_type} />
        )}
        {cont_file_type === 2 && (
          <VideoPlayer
            toggleResizeModeOnFullscreen={true}
            // toggleResizeMode={false}
            // video={{
            //   uri: newMediaPath || uploadedVideoLink,
            //   }}
            thumbnail={item?.item?.video_thumb}
            onBackPress={this.props.navigation}
            //       url={{
            //         uri: cont_link,
            // }}
            url={{
              uri:
                cont_type === 1
                  ? cont_link?.includes('amazonaws')
                    ? cont_link
                    : GetPhotoBaseURL() + cont_link
                  : cont_link,
            }}
            // source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
            // autoplay
            pauseOnPress
            // fullScreenOnLongPress
            videoWidth={Math.round(Dimensions.get('window').width) * 0.92}
            videoHeight={250}
            style={{marginTop: 10, width: '100%', height: 250}}
          />
        )}
        {cont_type === 2 &&
        cont_file_type === 3 &&
        cont_link?.includes('youtube') ? (
          <ReusableYoutubePlayer
            pageStatus={this.pageStatus}
            cont_link={cont_link}
          />
        ) : null}
        {/* <ReusableYoutubePlayer cont_link={cont_link} /> */}
        <BottomBar
          cont_id={cont_id}
          isBookmarked={bookmark}
          isLiked={like}
          action={this.props.action}
          content_share_link={content_share_link}
        />
        {descri ? (
          <View style={{marginHorizontal: '2%', marginTop: 5, marginLeft: 10}}>
            <Text light type={TEXT_TYPE.EXTRA_SMALL}>
              {descri}
            </Text>
          </View>
        ) : null}
        {tags ? (
          <View style={{marginHorizontal: '2%'}}>
            <Text light type={TEXT_TYPE.EXTRA_SMALL} style={{marginTop: 5}}>
              {tags}
            </Text>
          </View>
        ) : null}

        {showLoader && <ActivityIndicator size="small" />}
      </View>
    );
  }
}

CardItem.propTypes = {
  placeholder: PropTypes.string,
  showSearchIcon: PropTypes.bool,
  showCross: PropTypes.bool,
  searchValue: PropTypes.string,
  showLoader: PropTypes.bool,
  style: PropTypes.object,
};

CardItem.defaultProps = {
  placeholder: undefined,
  showSearchIcon: true,
  showCross: true,
  searchValue: '',
  showLoader: true,
  style: {},
};

// <ReusableVideo
// navigation={this.props.navigation}
// cont_link={cont_link}
// cont_type={cont_type}
// // paused={currentIndex !== currentVisibleIndex}
// />
