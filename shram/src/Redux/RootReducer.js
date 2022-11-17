import {combineReducers} from 'redux';
import CommonReducer from '@redux/CommonReducer';
import LoginReducer from '@login/LoginReducer';
import ProfileReducer from '@profile/ProfileReducer';
import NotificationReducer from '@notification/NotificationReducer';
import HomeReducer from '@home/HomeReducer';
import MyPostReducer from '@myPost/MyPostReducer';
import FeedReducer from '@flatList/FeedReducer';
import AdhikarReducer from '@flatList/AdhikarReducer';
import BookmarkReducer from '@flatList/BookmarkReducer';
import ParivarReducer from '@flatList/ParivarReducer';
import SamacharReducer from '@flatList/SamacharReducer';
import ShikshaReducer from '@flatList/ShikshaReducer';
import AssessmentReducer from '@assessment/AssessmentReducer';
import RojgarReducer from '@rojgar/RojgarReducer';
import CreatePostReducer from '@createPost/CreatePostReducer';
import ResumeReducer from '@resume/ResumeReducer';
import AddFriendReducer from '@addFriend/AddFriendReducer';
import FriendDetailReducer from '@friendDetail/FriendDetailReducer';
import ChatHeadReducer from '@addFriend/ChatHeadReducer';
import ChatHistoryReducer from '@chat/ChatHistoryReducer';

// Combine all reducers.

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.

  if (action.type === 'Logout') state = undefined;

  return appReducer(state, action);
};

const appReducer = combineReducers({
  CommonReducer,
  LoginReducer,
  ProfileReducer,
  NotificationReducer,
  HomeReducer,
  MyPostReducer,
  FeedReducer,
  AssessmentReducer,
  RojgarReducer,
  CreatePostReducer,
  ResumeReducer,
  AdhikarReducer,
  ParivarReducer,
  ShikshaReducer,
  SamacharReducer,
  BookmarkReducer,
  AddFriendReducer,
  FriendDetailReducer,
  ChatHeadReducer,
  ChatHistoryReducer,
});

export default rootReducer;
