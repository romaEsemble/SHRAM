import {
  GET_CONTACT_LIST_FROM_SERVER_LOADING,
  GET_CONTACT_LIST_FROM_SERVER_SUCCESS,
  GET_CONTACT_LIST_FROM_SERVER_FAILURE,
  SEND_FRIEND_REQUEST_LOADING,
  SEND_FRIEND_REQUEST_SUCCESS,
  SEND_FRIEND_REQUEST_FAILURE,
} from '@redux/Types';

const initialState = {
  getContactListError: null,
  getContactListLoading: true,
  getContactListData: null,
  shramikOnly: null,
  sendContactListError: null,
  sendContactListLoading: true,
  sendContactListData: null,
  sendFriendReqError: null,
  sendFriendReqLoading: true,
  sendFriendReqData: null,
};

const AddFriendReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACT_LIST_FROM_SERVER_LOADING:
      return {
        ...state,
        getContactListLoading: true,
      };
    case GET_CONTACT_LIST_FROM_SERVER_FAILURE:
      return {
        ...state,
        getContactListLoading: false,
        getContactListError: action.payload.data.message,
      };
    case GET_CONTACT_LIST_FROM_SERVER_SUCCESS:
      const shramik = action.payload.data?.data?.filter(
        (contact) => contact.is_shramik_user === 1,
      );
      return {
        ...state,
        getContactListError: null,
        getContactListLoading: false,
        getContactListData: action.payload.data.data,
        shramikOnly: shramik,
      };

    case SEND_FRIEND_REQUEST_LOADING:
      return {
        ...state,
        sendFriendReqLoading: true,
      };
    case SEND_FRIEND_REQUEST_FAILURE:
      return {
        ...state,
        sendFriendReqLoading: false,
        sendFriendReqError: action.payload.data.message,
      };
    case SEND_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        sendFriendReqError: null,
        sendFriendReqLoading: false,
        sendFriendReqData: action.payload.data.data,
      };

    default:
      return state;
  }
};

export default AddFriendReducer;
