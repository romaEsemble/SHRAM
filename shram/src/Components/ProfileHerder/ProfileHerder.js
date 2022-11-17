import Circle from '@circle/Circle';
import CircleFlower from '@icons/circleFlower';
import FillStarIcon from '@icons/fillStarIcon';
import SaveIcon from '@icons/SaveButton';
import StarIcon from '@icons/starIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Overlay} from '@rneui/base';
import strings from '@resources/Strings';
import {
  ASYNC_STORAGE_IMAGE,
  ASYNC_STORAGE_USER_NAME,
} from '@resources/Constants';
import {
  NAVIGATION_HOME,
  NAVIGATION_PROFILE_STACK,
} from '@navigation/NavigationKeys';
import Text from '@textView/TextView';
import {debounce} from '@utils/Util';
import TermCheck from '@icons/TermCheck';
// import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useEffect, useState} from 'react';
import {
  Image,
  InteractionManager,
  View,
  Button,
  TouchableOpacity as Touchable,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import moment from 'moment';
import {GetPhotoBaseURL} from '@networking/Urls';
import {sendBtnClickToAnalytics} from '@utils/Util';

const ProfileHerder = ({
  userName,
  userWorkType,
  onPress,
  imagePath,
  editMode,
  profileData,
  getDocumentsData,
}) => {
  console.log('Stars', profileData?.profile_star);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // const {profileData, getDocumentsData} = useSelector(
  //   (state) => state.ProfileReducer,
  // );

  if (profileData?.length == 0) {
    return false;
  }
  //   console.log(
  //   'Profile Data herder',
  //   profileData?.curr_pincode,
  //   getDocumentsData,
  // );

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      renderStar(),
    );
    return () => interactionPromise.cancel();
  }, [profileData]);

  const renderName = async () => {
    const user_name = await AsyncStorage.getItem(ASYNC_STORAGE_USER_NAME);
    return JSON.parse(user_name) || 'Welcome User';
  };

  const renderImage = async () => {
    const image = await AsyncStorage.getItem(ASYNC_STORAGE_IMAGE);
    return JSON.parse(image)
      ? {uri: JSON.parse(image)}
      : require('@icons/Image.png');
  };

  const renderStar = () => {
    {
      /*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */
    }
    // let star = [1, 2, 3, 4, 5, 6, 7].map((data) => {
    let star = [1, 2, 3].map((data) => {
      return (
        <>
          {data <= parseInt(profileData?.profile_star || 0) ? (
            <FillStarIcon
              width={20}
              height={20}
              style={{marginHorizontal: 3}}
            />
          ) : (
            <StarIcon width={20} height={20} style={{marginHorizontal: 3}} />
          )}
        </>
      );
    });
    return star;
  };
  const renderSingleView = (heading, value, shouldFlex = 0) => {
    return (
      <View style={{flex: shouldFlex ? 1 : 0, paddingRight: 2}}>
        <Text style={{fontWeight: 'bold', fontSize: 12}}>{heading}</Text>
        <Text>{value || '--'}</Text>
      </View>
    );
  };

  // Old ScrollView JSX
  // <ScrollView>
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>Personal Detail</Text>
  //                 </View>
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     justifyContent: 'space-between',
  //                     padding: 5,
  //                   }}>
  //                   {renderSingleView(strings?.firstName, profileData?.fname)}
  //                   {renderSingleView(strings?.middleName, profileData?.mname)}
  //                   {renderSingleView(strings?.lastName, profileData?.lname)}
  //                 </View>
  //                 <View
  //                   style={{
  //                     padding: 5,
  //                   }}>
  //                   {renderSingleView('Mobile Number', profileData?.mobile)}
  //                 </View>
  //                 {touchableNavigator('PersonalDetail')}
  //               </View>

  //               {/* AddressDetail */}
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>Address Detail</Text>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   <Text style={{fontWeight: 'bold'}}>
  //                     {strings?.currentAddress}
  //                   </Text>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.pincode,
  //                       profileData?.curr_pincode,
  //                     )}
  //                     {renderSingleView(strings?.city, profileData?.curr_city)}
  //                     {renderSingleView('State', profileData?.curr_state)}
  //                   </View>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   <Text style={{fontWeight: 'bold'}}>
  //                     {strings?.permanentAddress}
  //                   </Text>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.pincode,
  //                       profileData?.perm_pincode,
  //                     )}
  //                     {renderSingleView(strings?.city, profileData?.perm_city)}
  //                     {renderSingleView('State', profileData?.perm_state)}
  //                   </View>
  //                 </View>
  //                 {touchableNavigator('AddressDetail')}
  //               </View>

  //               {/* ProfessionalDetail */}
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>Professional Detail</Text>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                       marginBottom: 5,
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.industry,
  //                       profileData?.industry,
  //                     )}
  //                   </View>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                       marginBottom: 5,
  //                     }}>
  //                     {renderSingleView('Trade', profileData?.trade)}
  //                   </View>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.experience,
  //                       (profileData?.exp ? profileData?.exp : '--') + ' Years',
  //                       {
  //                         /* (profileData?.exp == '87'
  //                         ? '0-2'
  //                         : profileData?.exp == '88'
  //                         ? '2-5'
  //                         : profileData?.exp == '89'
  //                         ? '5-10'
  //                         : profileData?.exp == '90'
  //                         ? '10+'
  //                         : '--') + ' Years', */
  //                       },
  //                     )}
  //                   </View>
  //                 </View>

  //                 {touchableNavigator('ProfessionalDetail')}
  //               </View>

  //               {/* SkillDetail */}
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>Skill Detail</Text>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.industrySkills,
  //                       profileData?.skill,
  //                     )}

  //                     {/* {renderSingleView('Industry Skills', profileData?.skill)}
  //                     {renderSingleView(
  //                       strings?.computerSkills,
  //                       profileData?.computer_skill == 1 ? 'Yes' : 'No',
  //                     )} */}
  //                   </View>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.computerSkills,
  //                       profileData?.computer_skill == 1 ? 'Yes' : 'No',
  //                     )}

  //                     {/* {renderSingleView('Industry Skills', profileData?.skill)}
  //                     {renderSingleView(
  //                       strings?.computerSkills,
  //                       profileData?.computer_skill == 1 ? 'Yes' : 'No',
  //                     )} */}
  //                   </View>
  //                 </View>
  //                 {touchableNavigator('SkillDetail')}
  //               </View>

  //               {/* EducationalDetail */}
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>Educational Detail</Text>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                       marginBottom: 5,
  //                     }}>
  //                     {renderSingleView(
  //                       strings?.education,
  //                       profileData?.education,
  //                     )}
  //                   </View>
  //                   <Text style={{fontWeight: 'bold'}}>Language Detail</Text>
  //                   {languageRow(strings?.hindi, profileData?.hindi)}
  //                   {languageRow(strings?.english, profileData?.english)}
  //                   {languageRow(strings?.marathi, profileData?.marathi)}
  //                 </View>
  //                 {touchableNavigator('EducationalDetail')}
  //               </View>

  //               {/* HealthDetail */}
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>{strings?.healthDetail}</Text>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                       marginBottom: 5,
  //                     }}>
  //                     {renderSingleView(strings?.gender, profileData?.gender)}
  //                     {renderSingleView(
  //                       strings?.dob,
  //                       profileData?.dob
  //                         ? moment(profileData?.dob).format('DD-MM-YYYY')
  //                         : '--',
  //                     )}
  //                   </View>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     {renderSingleView(strings?.height, profileData?.height)}
  //                     {renderSingleView(strings?.weight, profileData?.weight)}
  //                     {renderSingleView(
  //                       strings?.bloodGroup,
  //                       profileData?.bgroup,
  //                     )}
  //                   </View>
  //                 </View>
  //                 {touchableNavigator('HealthDetail')}
  //               </View>

  //               {/* Documents */}
  //               <View
  //                 style={{
  //                   borderWidth: 1,
  //                   borderColor: '#6190F1',
  //                   borderRadius: 6,
  //                   marginVertical: 10,
  //                 }}>
  //                 <View style={{backgroundColor: '#6190F1', padding: 5}}>
  //                   <Text>Document Detail</Text>
  //                 </View>
  //                 <View style={{padding: 5}}>
  //                   {getDocumentsData?.length == 0 ? (
  //                     <View>
  //                       <Text>No Documents Uploaded</Text>
  //                     </View>
  //                   ) : (
  //                     <View
  //                       style={{
  //                         flexDirection: 'row',
  //                         justifyContent: 'space-between',
  //                       }}>
  //                       <Text>{1}</Text>
  //                       {renderSingleView(
  //                         strings?.documentType,
  //                         getDocumentsData?.[0].doc_type,
  //                       )}
  //                       {renderSingleView(
  //                         strings?.documentNumber,
  //                         getDocumentsData?.[0].doc_no,
  //                       )}
  //                     </View>
  //                   )}
  //                 </View>
  //                 {touchableNavigator('Documents')}
  //               </View>
  //             </ScrollView>
  const touchableNavigator = (navLink) => {
    return (
      <Touchable
        onPress={() => {
          navigation?.navigate(NAVIGATION_PROFILE_STACK, {
            screen: navLink,
          });
          // navigation.navigate(navLink);
          setVisible(false);
          sendBtnClickToAnalytics('Edit Details');
        }}
        style={{
          padding: 10,
          alignItems: 'flex-end',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 12}}>Edit Details</Text>
      </Touchable>
    );
  };

  const checkedView = (title) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TermCheck height={20} width={20} />
        <Text style={{fontSize: 12}}>{title}</Text>
      </View>
    );
  };
  const unCheckedView = (title) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            borderWidth: 1,
            height: 18,
            width: 18,
            borderColor: '#4B79D8',
            marginRight: 5,
          }}></View>
        <Text style={{fontSize: 12}}>{title}</Text>
      </View>
    );
  };

  const languageRow = (language, stringValue) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 2,
        }}>
        <Text style={{flex: 0.2, fontSize: 12, fontWeight: 'bold'}}>
          {language}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flex: 0.8,
          }}>
          <Text style={{fontWeight: 'bold'}}>
            {stringValue?.[1] == 1
              ? checkedView(strings?.speak)
              : unCheckedView(strings?.speak)}
          </Text>
          <Text style={{fontWeight: 'bold'}}>
            {stringValue?.[0] == 1
              ? checkedView(strings?.read)
              : unCheckedView(strings?.read)}
          </Text>
          <Text style={{fontWeight: 'bold'}}>
            {stringValue?.[2] == 1
              ? checkedView(strings?.write)
              : unCheckedView(strings?.write)}
            {/* {stringValue?.[2] == 1 ? 'strings?.write' : null} */}
          </Text>
        </View>
      </View>
    );
  };

  // const {
  //   fname,
  //   mname,
  //   lname,
  //   mobile,
  //   curr_pincode,
  //   curr_city,
  //   curr_state,
  //   perm_pincode,
  //   perm_city,
  //   perm_state,
  //   industry,
  //   trade,
  //   exp,
  //   computer_skill,
  //   gender,
  //   height,
  //   weight,
  //   bgroup,
  //   hindi,
  //   english,
  //   marathi,
  //   pic,
  //   dob,
  // } = profileData;

  return (
    <>
      <View style={{backgroundColor: '#4B79D8', paddingBottom: 3}}>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            margin: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CircleFlower
              style={{
                position: 'absolute',
              }}
              width={100}
              height={100}></CircleFlower>
            <Circle
              type={'ProfileCircle'}
              circleColor={'#FFC003'}
              svg={
                <FastImage
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginTop: 5,
                    alignItems: 'center',
                  }}
                  source={
                    profileData?.pic
                      ? {
                          uri: `${GetPhotoBaseURL()}${profileData?.pic}`,
                          priority: FastImage.priority.normal,
                        }
                      : require('@icons/Image.png')
                  }
                />
              }
            />
          </View>
          <View style={{marginHorizontal: 25}}>
            {/* {profileData?.fname === null &&
            profileData?.mname === null &&
            profileData?.lname === null  */}
            {profileData?.fname === null ? (
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                {!profileData ? '' : 'Welcome User'}
              </Text>
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {/*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */}
                {/* {!profileData
                  ? ''
                  : `${profileData?.fname || ''} ${profileData?.mname || ''} ${
                      profileData?.lname || ''
                    }`} */}
                {!profileData ? '' : `${profileData?.fname || ''}`}
              </Text>
            )}
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              {renderStar()}
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: -10,
            marginRight: 20,
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 20,
          }}>
          <View>
            <Button title={strings?.profileSummary} onPress={toggleOverlay} />
            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              overlayStyle={{
                height: 'auto',
                width: '90%',
                marginVertical: 70,
                borderRadius: 10,
              }}>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                  alignItems: 'center',
                }}>
                <View>
                  <Text>{strings?.profileSummary}</Text>
                  <View style={{flexDirection: 'row', marginVertical: 5}}>
                    {renderStar()}
                  </View>
                </View>
                <View>
                  <Button title={strings?.close} onPress={toggleOverlay} />
                </View>
              </View>
              <ScrollView>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#6190F1',
                    borderRadius: 6,
                    marginVertical: 10,
                  }}>
                  <View style={{backgroundColor: '#6190F1', padding: 5}}>
                    <Text>Personal Detail</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 5,
                    }}>
                    {renderSingleView(strings?.fullName, profileData?.fname, 1)}
                    {/* {renderSingleView(strings?.firstName, profileData?.fname, 1)}
                  {renderSingleView(strings?.middleName, profileData?.mname, 1)}
                  {renderSingleView(strings?.lastName, profileData?.lname, 1)} */}
                  </View>
                  <View
                    style={{
                      padding: 5,
                    }}>
                    {renderSingleView('Mobile Number', profileData?.mobile)}
                  </View>
                  {/* {touchableNavigator('PersonalDetail')} */}
                  {touchableNavigator('NewPersonalDetails')}
                </View>

                {/* HealthDetail */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#6190F1',
                    borderRadius: 6,
                    marginVertical: 10,
                  }}>
                  <View style={{backgroundColor: '#6190F1', padding: 5}}>
                    <Text>{strings?.healthDetail}</Text>
                  </View>
                  <View style={{padding: 5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}>
                      {renderSingleView(strings?.gender, profileData?.gender)}
                      {renderSingleView(
                        strings?.dob,
                        profileData?.dob
                          ? moment(profileData?.dob).format('DD-MM-YYYY')
                          : '--',
                      )}
                    </View>
                    {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(strings?.height, profileData?.height)}
                    {renderSingleView(strings?.weight, profileData?.weight)}
                    {renderSingleView(strings?.bloodGroup, profileData?.bgroup)}
                  </View> */}
                  </View>
                  {/* {touchableNavigator('HealthDetail')} */}
                  {touchableNavigator('NewPersonalDetails')}
                </View>

                {/* AddressDetail */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#6190F1',
                    borderRadius: 6,
                    marginVertical: 10,
                  }}>
                  <View style={{backgroundColor: '#6190F1', padding: 5}}>
                    <Text>Address Detail</Text>
                  </View>
                  <View style={{padding: 5}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {strings?.currentAddress}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {renderSingleView(
                        strings?.pincode,
                        profileData?.curr_pincode,
                      )}
                      {renderSingleView(strings?.city, profileData?.curr_city)}
                      {renderSingleView('State', profileData?.curr_state)}
                    </View>
                  </View>
                  {/* <View style={{padding: 5}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {strings?.permanentAddress}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.pincode,
                      profileData?.perm_pincode,
                    )}
                    {renderSingleView(strings?.city, profileData?.perm_city)}
                    {renderSingleView('State', profileData?.perm_state)}
                  </View>
                </View> */}
                  {/* {touchableNavigator('AddressDetail')} */}
                  {touchableNavigator('NewPersonalDetails')}
                </View>

                {/* ProfessionalDetail */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#6190F1',
                    borderRadius: 6,
                    marginVertical: 10,
                  }}>
                  <View style={{backgroundColor: '#6190F1', padding: 5}}>
                    <Text>Professional Detail</Text>
                  </View>
                  <View style={{padding: 5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}>
                      {renderSingleView(
                        strings?.industry,
                        profileData?.industry,
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}>
                      {renderSingleView('Trade', profileData?.trade)}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {renderSingleView(
                        strings?.experience,
                        (profileData?.exp ? profileData?.exp : '--') + ' Years',
                      )}
                    </View>
                  </View>

                  {touchableNavigator('ProfessionalDetail')}
                </View>

                {/* SkillDetail */}
                {/* <View
                style={{
                  borderWidth: 1,
                  borderColor: '#6190F1',
                  borderRadius: 6,
                  marginVertical: 10,
                }}>
                <View style={{backgroundColor: '#6190F1', padding: 5}}>
                  <Text>Skill Detail</Text>
                </View>
                <View style={{padding: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.industrySkills,
                      profileData?.skill,
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {renderSingleView(
                      strings?.computerSkills,
                      profileData?.computer_skill == 1 ? 'Yes' : 'No',
                    )}
                  </View>
                </View>
                {touchableNavigator('SkillDetail')}
              </View> */}

                {/* EducationalDetail */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#6190F1',
                    borderRadius: 6,
                    marginVertical: 10,
                  }}>
                  <View style={{backgroundColor: '#6190F1', padding: 5}}>
                    <Text>Educational Detail</Text>
                  </View>
                  <View style={{padding: 5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}>
                      {renderSingleView(
                        strings?.education,
                        profileData?.education,
                      )}
                    </View>
                    {/* <Text style={{fontWeight: 'bold'}}>Language Detail</Text>
                  {languageRow(strings?.hindi, profileData?.hindi)}
                  {languageRow(strings?.english, profileData?.english)}
                  {languageRow(strings?.marathi, profileData?.marathi)} */}
                  </View>
                  {/* {touchableNavigator('EducationalDetail')} */}
                  {touchableNavigator('NewPersonalDetails')}
                </View>

                {/* Documents */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#6190F1',
                    borderRadius: 6,
                    marginVertical: 10,
                  }}>
                  <View style={{backgroundColor: '#6190F1', padding: 5}}>
                    <Text>Document Detail</Text>
                  </View>
                  <View style={{padding: 5}}>
                    {getDocumentsData?.length == 0 ? (
                      <View>
                        <Text>No Documents Uploaded</Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text>{1}</Text>
                        {renderSingleView(
                          strings?.documentType,
                          getDocumentsData?.[0].doc_type,
                        )}
                        {renderSingleView(
                          strings?.documentNumber,
                          getDocumentsData?.[0].doc_no,
                        )}
                      </View>
                    )}
                  </View>
                  {touchableNavigator('Documents')}
                </View>
              </ScrollView>
            </Overlay>
          </View>
          <TouchableOpacity
            onPress={debounce(() => {
              onPress();
              sendBtnClickToAnalytics('Save & Next');
            })}>
            {/* <SaveIcon /> */}
            <Text
              style={{
                backgroundColor: '#ffc003',
                borderRadius: 2,
                padding: 10,
                paddingVertical: 8,
                color: '#FFF',
                fontWeight: 'bold',
              }}>
              Save & Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default React.memo(ProfileHerder);
