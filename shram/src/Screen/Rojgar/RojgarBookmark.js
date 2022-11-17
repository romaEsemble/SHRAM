import React, {Component} from 'react';
import BookmarkFilled from '@icons/bookmark-filled.svg';
import BookmarkEmpty from '@icons/bookmark.svg';
import ShareIcon from '@icons/share.svg';
import {URLs} from '@networking/Urls';
import {JOB_BOOKMARK, UPDATE_BOOKMARK_ROJGAR} from '@redux/Types';
import {debounce, showSnackBar} from '@utils/Util';
import {share} from '@utils/Util';
import {Linking, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {updateBookmark, jobBookmark} from '@rojgar/RojgarActions';
import {sendBtnClickToAnalytics} from '@utils/Util';

class RojgarBookmark extends Component {
  bookmarkLike = async (cont_id, status) => {
    const {job_id} = this.props;

    const bookmarkValue = status === 0 ? 1 : 0;
    const payload = {
      data: {
        bookmark: bookmarkValue,
        job_id: job_id,
      },
    };
    this.props.updateBookmark(UPDATE_BOOKMARK_ROJGAR, payload);

    const payloadTwo = {
      job_id: cont_id,
      type: bookmarkValue,
    };
    this.props.jobBookmark(JOB_BOOKMARK, URLs.JobBookmark, payloadTwo);
    this.props.rojgarItemCallback(bookmarkValue);
  };

  getBookmarkIcon = () => {
    const {isBookmarked} = this.props;
    if (!isBookmarked) {
      return (
        <BookmarkEmpty width={wp(6)} height={wp(6)} style={{marginRight: 10}} />
      );
    }
    return (
      <BookmarkFilled width={wp(6)} height={wp(6)} style={{marginRight: 10}} />
    );
  };

  onPressForBookmark = (
    job_id,
    isBookmarked,
    applicationStatus,
    currentTab,
  ) => {
    if (currentTab != 0 && applicationStatus != 2) return;
    debounce(this.bookmarkLike(job_id, isBookmarked));
  };
  onPressForShare = (job_link, applicationStatus, currentTab) => {
    if (currentTab != 0 && applicationStatus != 2) return;
    share(job_link, 'shared-job-post?a=');
  };

  render() {
    const {job_id, job_link, isBookmarked, applicationStatus, currentTab} =
      this.props;
    const opacity = currentTab != 0 && applicationStatus != 2 ? 0.3 : 0.7;
    return (
      <View
        style={{
          marginHorizontal: '2%',
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={{opacity: opacity}}
          onPress={() => {
            this.onPressForBookmark(
              job_id,
              isBookmarked,
              applicationStatus,
              currentTab,
            );
            sendBtnClickToAnalytics('Bookmark Rojgar');
          }}>
          {this.getBookmarkIcon()}
        </TouchableOpacity>
        <TouchableOpacity
          style={{opacity: opacity}}
          // activeOpacity={0.7}
          onPress={() => {
            this.onPressForShare(job_link, applicationStatus, currentTab);
            sendBtnClickToAnalytics('Share Rojgar');
          }}>
          <ShareIcon width={wp(6)} height={wp(6)} />
        </TouchableOpacity>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    jobBookmark: (type, url, payload) =>
      dispatch(jobBookmark(type, url, payload)),
    updateBookmark: (type, payload) => dispatch(updateBookmark(type, payload)),
  };
}

export default connect(null, mapDispatchToProps)(RojgarBookmark);
