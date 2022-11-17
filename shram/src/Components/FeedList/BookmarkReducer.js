import {
  BOOKMARK_LOADING,
  BOOKMARK_SUCCESS,
  BOOKMARK_FAILURE,
  BOOKMARK_NEW,
} from '@redux/Types';

const initialState = {
  bookmarkError: null,
  bookmarkLoading: true,
  bookmarkData: null,
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKMARK_LOADING:
      return {
        ...state,
        bookmarkLoading: true,
      };

    case BOOKMARK_FAILURE:
      return {
        ...state,
        bookmarkLoading: false,
        bookmarkError: action.payload.data.message,
      };

    case BOOKMARK_SUCCESS:
      return {
        ...state,
        bookmarkError: null,
        bookmarkLoading: false,
        bookmarkData: state.bookmarkData
          ? [...state.bookmarkData, ...action.payload.data.data]
          : action.payload.data.data,
      };
    case BOOKMARK_NEW:
      return {
        ...state,
        bookmarkError: null,
        bookmarkLoading: false,
        bookmarkData: action.payload.data.data,
      };
    case 'updateBookmarkLike':
      const bookmarkLikeData = Array.from(state.bookmarkData);
      bookmarkLikeData?.map((item) => {
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
        bookmarkData: bookmarkLikeData,
      };
    default:
      return state;
  }
};

export default FeedReducer;
