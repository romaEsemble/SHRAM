import {
  applyBookmarkLike,
  updateBookmarkLike,
} from '@bottomBar/BottomBarActions';
import BookmarkFilled from '@icons/bookmark-filled.svg';
import BookmarkEmpty from '@icons/bookmark.svg';
import HeartEmpty from '@icons/heart-empty.svg';
import HeartFilled from '@icons/heart-filled.svg';
import ShareIcon from '@icons/share.svg';
import {URLs} from '@networking/Urls';
import {
  ADHIKAR,
  BOOKMARK,
  BOOKMARK_ADD,
  FEED,
  PARIVAR,
  SAMACHAR,
  SHIKSHA,
} from '@redux/Types';
import React, {Component} from 'react';
import {share, sendBtnClickToAnalytics} from '@utils/Util';
import {TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

class BottomBar extends Component {
  constructor(props) {
    super(props);

    const {isBookmarked, isLiked} = this.props;
    this.state = {
      isBookmarkChanged: isBookmarked || 0,
      isLikeChanged: isLiked || 0,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.isBookmarked !== nextProps.isBookmarked) {
      this.setState({
        isBookmarkChanged: nextProps.isBookmarked,
      });
    }
    if (this.props.isLiked !== nextProps.isLiked) {
      this.setState({
        isLikeChanged: nextProps.isLiked,
      });
    }
    return true;
  }

  bookmarkChange = () => {
    const {cont_id} = this.props;
    const changedValue = this.state.isBookmarkChanged === 0 ? 1 : 0;
    this.setState({
      isBookmarkChanged: changedValue,
    });
    const payload = {
      data: {
        type: 1,
        status: changedValue,
        cont_id,
      },
    };
    this.updateReducerBookmarkValue(payload);
    this.hitBookMarkApi(1, changedValue);
  };

  likeChange = () => {
    const {cont_id} = this.props;
    const changedValue = this.state.isLikeChanged === 0 ? 1 : 0;
    this.setState({isLikeChanged: changedValue});
    const payload = {
      data: {
        type: 2,
        status: changedValue,
        cont_id,
      },
    };
    this.updateReducerBookmarkValue(payload);
    this.hitBookMarkApi(2, changedValue);
  };

  updateReducerBookmarkValue = (payload) => {
    switch (this.props.action) {
      case FEED:
        return this.props.updateBookmarkLike('updateFeedBookmarkLike', payload);
      case PARIVAR:
        return this.props.updateBookmarkLike(
          'updateParivarBookmarkLike',
          payload,
        );
      case SAMACHAR:
        return this.props.updateBookmarkLike(
          'updateSamacharBookmarkLike',
          payload,
        );
      case ADHIKAR:
        return this.props.updateBookmarkLike(
          'updateAdhikarBookmarkLike',
          payload,
        );
      case SHIKSHA:
        return this.props.updateBookmarkLike(
          'updateShikshaBookmarkLike',
          payload,
        );
      case BOOKMARK:
        return this.props.updateBookmarkLike('updateBookmarkLike', payload);
    }
  };

  hitBookMarkApi = async (isBookmark, status) => {
    const {cont_id} = this.props;
    this.props.applyBookmarkLike(BOOKMARK_ADD, URLs.Bookmark, {
      type: isBookmark,
      status: status,
      cont_id,
    });
  };

  getBookmarkIcon = () => {
    if (this.state.isBookmarkChanged !== 1) {
      return (
        <BookmarkEmpty
          width={wp(4)}
          height={wp(5)}
          style={{
            marginRight: 10,
          }}
        />
      );
    }
    return (
      <BookmarkFilled width={wp(4)} height={wp(5)} style={{marginRight: 10}} />
    );
  };

  getHeartIcon = () => {
    if (this.state.isLikeChanged !== 1) {
      return <HeartEmpty width={wp(5)} height={wp(5)} />;
    }
    return <HeartFilled width={wp(5)} height={wp(5)} />;
  };

  render() {
    return (
      <>
        <View
          style={{
            marginHorizontal: '2%',
            marginTop: 10,
            flexDirection: 'row',
            // justifyContent: 'space-between',
            // paddingLeft: 15,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.likeChange();
              sendBtnClickToAnalytics('Like Icon');
            }}>
            {this.getHeartIcon()}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              share(this.props.content_share_link, 'shared-post-content?a=');
              sendBtnClickToAnalytics('Share Icon');
            }}>
            <ShareIcon
              width={wp(4.5)}
              height={wp(4.5)}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: '2%',
            marginTop: -20,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // paddingLeft: 15,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.bookmarkChange();
              sendBtnClickToAnalytics('Bookmark Icon');
            }}>
            {this.getBookmarkIcon()}
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    applyBookmarkLike: (type, url, payload) =>
      dispatch(applyBookmarkLike(type, url, payload)),
    updateBookmarkLike: (type, payload) =>
      dispatch(updateBookmarkLike(type, payload)),
  };
}

export default connect(null, mapDispatchToProps)(BottomBar);
