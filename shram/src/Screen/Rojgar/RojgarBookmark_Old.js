import BookmarkFilled from '@icons/bookmark-filled.svg';
import BookmarkEmpty from '@icons/bookmark.svg';
import ShareIcon from '@icons/share.svg';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {JOB_BOOKMARK, UPDATE_BOOKMARK_ROJGAR} from '@redux/Types';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

export default function RojgarBookmark({
  job_id,
  isBookmarked,
  job_link,
  rojgarItemCallback,
}) {
  const dispatch = useDispatch();
  // const {rojgarData} = useSelector((state) => state.RojgarReducer);
  const [localBookmark, setLocalBookmark] = useState(isBookmarked || 0);
  // console.log('isBookmarked', isBookmarked);
  const bookmarkLike = async (cont_id, status) => {
    setLocalBookmark(status === 0 ? 1 : 0);
    // rojgarItemCallback(status === 0 ? 1 : 0);
    let bookmarkValue = status === 0 ? 1 : 0;
    dispatch({
      type: UPDATE_BOOKMARK_ROJGAR,
      payload: {
        data: {
          bookmark: bookmarkValue,
          job_id: job_id,
        },
      },
    });
    dispatch(
      callApi(JOB_BOOKMARK, URLs.JobBookmark, {
        job_id: cont_id,
        type: status === 0 ? 1 : 0,
      }),
    );
    rojgarItemCallback(status === 0 ? 1 : 0);
  };

  const getBookmarkIcon = () => {
    // parseInt(localBookmark || 0, 10)
    console.warn('local bookmark', localBookmark);
    if (localBookmark !== 1) {
      return (
        <BookmarkEmpty width={wp(6)} height={wp(6)} style={{marginRight: 10}} />
      );
    }
    return (
      <BookmarkFilled width={wp(6)} height={wp(6)} style={{marginRight: 10}} />
    );
  };

  return (
    <View
      style={{
        marginHorizontal: '2%',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        onPress={() => {
          debounce(bookmarkLike(job_id, localBookmark));
        }}>
        {getBookmarkIcon()}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (job_link) {
            Linking.openURL(job_link);
          } else {
            showSnackBar('Link not present', 'error');
          }
        }}>
        <ShareIcon width={wp(6)} height={wp(6)} />
      </TouchableOpacity>
    </View>
  );
}
