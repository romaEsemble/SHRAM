import {
  GET_FRIEND_DATA_LOADING,
  GET_FRIEND_DATA_SUCCESS,
  GET_FRIEND_DATA_FAILURE,
  GET_FRIEND_DATA,
} from '@redux/Types';

const initialState = {
  getFriendDetailsError: null,
  getFriendDetailsLoading: true,
  getFriendDetailsData: null,
};

const FriendDetailReducer = (state = initialState, action) => {
  // console.log('&&&&&&&reducer called');
  switch (action.type) {
    case GET_FRIEND_DATA_LOADING:
      // console.log('&&&&&&&reducer called', action.type);
      return {
        ...state,
        getFriendDetailsLoading: true,
      };
    case GET_FRIEND_DATA_FAILURE:
      // console.log('&&&&&&&reducer called', action.type);

      return {
        ...state,
        getFriendDetailsLoading: false,
        getFriendDetailsError: action.payload.data.message,
      };

    case GET_FRIEND_DATA_SUCCESS:
      // console.log('&&&&&&&reducer called', action.type, state);

      return {
        ...state,
        getFriendDetailsError: null,
        getFriendDetailsLoading: false,
        getFriendDetailsData: action.payload.data.data,
      };
    case GET_FRIEND_DATA:
      // console.log('&&&&&&&reducer called', action.type);

      // console.log('get data', state);
      return {
        ...state,
        getFriendDetailsError: null,
        getFriendDetailsLoading: false,
        getFriendDetailsData: action.payload.data.data,
      };

    default:
      // console.log('&&&&&&&reducer called', action.type);
      return state;
  }
};

export default FriendDetailReducer;
