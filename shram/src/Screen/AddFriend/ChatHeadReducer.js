import {
  GET_CHAT_HEAD_LOADING,
  GET_CHAT_HEAD_SUCCESS,
  GET_CHAT_HEAD_FAILURE,
  GET_CHAT_HEAD,
  DELETE_CHAT_HEAD,
} from '@redux/Types';

const initialState = {
  getChatHeadError: null,
  getChatHeadLoading: true,
  getChatHeadData: null,
};

const ChatHeadReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_HEAD_LOADING:
      // console.log('&&&&&&&reducer called', action.type);
      return {
        ...state,
        getChatHeadLoading: true,
      };
    case GET_CHAT_HEAD_FAILURE:
      // console.log('&&&&&&&reducer called', action.type);

      return {
        ...state,
        getChatHeadLoading: false,
        getChatHeadError: action.payload.data.message,
      };

    case GET_CHAT_HEAD_SUCCESS:
      return {
        ...state,
        getChatHeadError: null,
        getChatHeadLoading: false,
        getChatHeadData: action.payload.data.data,
      };
    case GET_CHAT_HEAD:
      return {
        ...state,
        getChatHeadError: null,
        getChatHeadLoading: false,
        getChatHeadData: action.payload.data.data,
      };

    default:
      // console.log('&&&&&&&reducer called', action.type);
      return state;
  }
};

export default ChatHeadReducer;
