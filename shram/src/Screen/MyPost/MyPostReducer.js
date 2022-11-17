import {
  JOB_POST_LIST_LOADING,
  JOB_POST_LIST_SUCCESS,
  JOB_POST_LIST_FAILURE,
} from '@redux/Types';

const initialState = {
  myPostError: null,
  myPostLoading: true,
  myPostData: null,
};

const MyPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOB_POST_LIST_LOADING:
      return {
        ...state,
        myPostLoading: true,
      };
    case JOB_POST_LIST_FAILURE:
      return {
        ...state,
        myPostLoading: false,
        myPostError: action.payload.data.message,
      };
    case JOB_POST_LIST_SUCCESS:
      return {
        ...state,
        myPostError: null,
        myPostLoading: false,
        myPostData: action.payload.data.data,
      };

    default:
      return state;
  }
};

export default MyPostReducer;
