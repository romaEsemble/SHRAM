import {
  GET_CHAT_HISTORY_LOADING,
  GET_CHAT_HISTORY_SUCCESS,
  GET_CHAT_HISTORY_FAILURE,
  GET_CHAT_HISTORY,
  UPDATE_CHAT_HISTORY,
  SELECT_CHATS,
  UNSELECT_CHATS,
  DELETE_CHAT_HISTORY,
  READ_MESSAGE,
} from '@redux/Types';

const initialState = {
  getChatHistoryError: null,
  getChatHistoryLoading: true,
  getChatHistoryData: null,
  chatsSelected: [],
  isSelected: false,
};

const ChatHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_HISTORY_LOADING:
      // console.log('&&&&&&&reducer called', action.type);
      return {
        ...state,
        getChatHistoryLoading: true,
      };
    case GET_CHAT_HISTORY_FAILURE:
      // console.log('&&&&&&&reducer called', action.type);

      return {
        ...state,
        getChatHistoryLoading: false,
        getChatHistoryError: action.payload.data.message,
      };

    case GET_CHAT_HISTORY_SUCCESS:
      if (state?.getChatHistoryData?.items?.length > 0) {
        var oldChats = state?.getChatHistoryData?.items;
        oldChats.push(...action.payload.data.data.items);
        // console.log(
        //   '####Chats',
        //   JSON.stringify(action.payload.data.data.items, null, 4),
        // );
        return {
          ...state,
          getChatHistoryError: null,
          getChatHistoryLoading: false,
          getChatHistoryData: {items: oldChats},
        };
      } else {
        return {
          ...state,
          getChatHistoryError: null,
          getChatHistoryLoading: false,
          getChatHistoryData: action.payload.data.data,
        };
      }

    case GET_CHAT_HISTORY:
      // if (state?.getChatHistoryData?.items?.length > 0) {
      //   var oldChats = state?.getChatHistoryData?.items;
      //   oldChats.push(action.payload.data.data);
      //   console.log(
      //     '####Chats',
      //     JSON.stringify(action.payload.data.data, null, 4),
      //   );
      // }

      return {
        ...state,
        getChatHistoryError: null,
        getChatHistoryLoading: false,
        getChatHistoryData: action.payload.data.data,
        // getChatHistoryData: {items: oldChats},
      };
    case UPDATE_CHAT_HISTORY:
      var oldChats = state?.getChatHistoryData?.items;
      oldChats.unshift(action.payload);

      //  Expected { "items": [] }
      // console.log('New cahts', oldChats);
      // console.log('Chats', JSON.stringify(state.getChatHistoryData, null, 4));

      return {
        ...state,
        getChatHistoryError: null,
        getChatHistoryLoading: false,
        getChatHistoryData: {items: oldChats},
      };
    case SELECT_CHATS:
      const itemSelected = action.payload;
      var allChats = state?.getChatHistoryData?.items;
      const newData = allChats.map((item) => {
        if (item.chat_id == itemSelected.chat_id) {
          return {
            ...item,
            selected: !item.selected,
          };
        }
        return {
          ...item,
          selected: item.selected,
        };
      });
      const selectedChat = newData.filter((item) => item.selected == true);
      const isSelectedChats = selectedChat.length > 0 ? true : false;
      return {
        ...state,
        getChatHistoryError: null,
        getChatHistoryLoading: false,
        getChatHistoryData: {items: newData},
        chatsSelected: selectedChat,
        isSelected: isSelectedChats,
      };
    case UNSELECT_CHATS:
      var allChats = state?.getChatHistoryData?.items;
      // console.log('Allc hats', allChats);
      const data = allChats.map((item) => {
        if (item?.selected == true) {
          return {
            ...item,
            selected: false,
          };
        }
        return {
          ...item,
          selected: false,
        };
      });

      return {
        ...state,
        getChatHistoryError: null,
        getChatHistoryLoading: false,
        getChatHistoryData: {items: data},
        isSelected: false,
      };
    case DELETE_CHAT_HISTORY:
      return {
        ...state,
        getChatHistoryError: null,
        getChatHistoryLoading: false,
        getChatHistoryData: null,
      };
    case READ_MESSAGE:

    default:
      return state;
  }
};

export default ChatHistoryReducer;
