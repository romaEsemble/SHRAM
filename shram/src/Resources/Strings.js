import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_APP_LANGUAGE} from '@resources/Constants';
import LocalizedStrings from 'react-native-localization';
import English from './English';
import Hinglish from './Hinglish';

//LoaderScreen
export const loadingData = 'Loading Data Please wait';

//Notification
export const todayTitle = 'Today';
export const earlierTitle = 'Yesterday';

//ErrorView
export const defaultErrorMsg = 'Something went Wrong';
export const defaultNoDataMsg = 'No Data Available';
export const retryText = 'Retry';

//Education
export const titleSpeak = 'SPEAK';
export const titleWrite = 'WRITE';
export const titleRead = 'READ';

//PersonalProfile
export const titleMobile = 'Mobile*';
export const titleFName = 'First Name*';
export const titleMName = 'Middle Name';
export const titleLName = 'Last Name*';
export const titleLastUpdate = 'Last Updated';
export const titleTakeFromCamera = 'TAKE FROM CAMERA';
export const titleSelectFromPhone = 'SELECT FROM PHONE';

//AddressDetail

//My Post
export const titleMyPost = 'My Post';
export const titlePublished = 'PUBLISHED';
export const titlePendingApproval = 'PENDING APPROVAL';
export const titleRejected = 'REJECTED';

let strings = new LocalizedStrings({
  en: English,
  HE: Hinglish,
});

// const defaultLanguage = async () => {
//   const appLanguage = await AsyncStorage.getItem(ASYNC_STORAGE_APP_LANGUAGE);
//   console.log('DEfault lnaguage called', appLanguage);
//   strings?.setLanguage(appLanguage);
// };

async function appLanaguageFromStorage() {
  const appLanguage = await AsyncStorage.getItem(ASYNC_STORAGE_APP_LANGUAGE);
  console.log('AS PER API RESPOSNE', appLanguage);
  if (appLanguage) {
    strings?.setLanguage(appLanguage);
  }
}
appLanaguageFromStorage();

export const setAppLanguage = (language) => {
  strings?.setLanguage(language);
  console.log(
    'Language ',
    language,
    strings?.firstName,
    strings?.loadingDataPleaseWait,
  );
};

export default strings;
