import {
  CREATE_POST_LOADING,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  SAVE_POST_DATA,
} from '@redux/Types';

const initialState = {
  CreatePostError: null,
  CreatePostLoading: false,
  CreatePostData: [],

  PostData: {},
};

const CreatePostReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST_LOADING:
      return {
        ...state,
        CreatePostLoading: true,
      };
    case CREATE_POST_FAILURE:
      return {
        ...state,
        CreatePostLoading: false,
        CreatePostError: action.payload.data.message,
      };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        CreatePostError: null,
        CreatePostLoading: false,
        CreatePostData: action.payload.data.data,
      };

    case SAVE_POST_DATA:
      return {
        ...state,
        PostData: action.payload.data,
        // PostData: {...state.PostDataData, ...action.payload} || {},
      };
    default:
      return state;
  }
};

export default CreatePostReducer;
