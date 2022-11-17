import {
  PARIVAR_LOADING,
  PARIVAR_SUCCESS,
  PARIVAR_FAILURE,
  PARIVAR_NEW,
} from '@redux/Types';

const initialState = {
  parivarError: null,
  parivarLoading: true,
  parivarData: null,
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case PARIVAR_LOADING:
      return {
        ...state,
        parivarLoading: true,
      };

    case PARIVAR_FAILURE:
      return {
        ...state,
        parivarLoading: false,
        parivarError: action.payload.data.message,
      };

    case PARIVAR_SUCCESS:
      return {
        ...state,
        parivarError: null,
        parivarLoading: false,
        parivarData: state.parivarData
          ? [...state.parivarData, ...action.payload.data.data]
          : action.payload.data.data,
      };
    case PARIVAR_NEW:
      return {
        ...state,
        parivarError: null,
        parivarLoading: false,
        parivarData: action.payload.data.data,
      };
    case 'updateParivarBookmarkLike':
      const parivarLikeData = Array.from(state.parivarData);
      parivarLikeData?.map((item) => {
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
        parivarData: parivarLikeData,
      };
    default:
      return state;
  }
};

export default FeedReducer;
