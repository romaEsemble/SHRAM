import {FEED_LOADING, FEED_SUCCESS, FEED_FAILURE, FEED_NEW} from '@redux/Types';

const initialState = {
  feedError: null,
  feedLoading: true,
  feedData: null,
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEED_LOADING:
      return {
        ...state,
        feedLoading: true,
      };

    case FEED_FAILURE:
      return {
        ...state,
        feedLoading: false,
        feedError: action.payload.data.message,
      };

    case FEED_SUCCESS:
      return {
        ...state,
        feedError: null,
        feedLoading: false,
        feedData: state.feedData
          ? [...state.feedData, ...action.payload.data.data]
          : action.payload.data.data,
      };
    case FEED_NEW:
      return {
        ...state,
        feedError: null,
        feedLoading: false,
        feedData: action.payload.data.data,
      };
    case 'updateFeedBookmarkLike':
      const feedLikeData = Array.from(state.feedData);
      console.warn('came inside reducer', feedLikeData);
      feedLikeData?.map((item) => {
        if (action.payload.data.cont_id === item.cont_id) {
          if (action.payload.data.type === 1) {
            item.bookmark = action.payload.data.status;
          } else {
            item.like = action.payload.data.status;
          }
        }
      });
      return {
        ...state,
        feedData: feedLikeData,
      };
    default:
      return state;
  }
};

export default FeedReducer;
