import Header from '@header/Header';
import Back from '@icons/backArrow.svg';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import Next from '@icons/nextIcon.svg';
import TermCheck from '@icons/TermCheck';
import Loader from '@loader/Loader';
import {URLs} from '@networking/Urls';
import localStyles from '@profile/ProfileStyles';
import ProfileHerder from '@profileHerder/ProfileHerder';
import {callApi} from '@redux/CommonDispatch.js';
import {EDUCATION, PROFILE} from '@redux/Types';
import {PROFILE_SCREEN} from '@resources/Constants';
import strings from '@resources/Strings';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useEffect, useState} from 'react';
import {FlatList, InteractionManager, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {set} from 'lodash';

export default function EducationalDetail(props) {
  const [selectedEducation, setSelectedEducation] = useState(false);

  const {educationData, profileData, profileLoading, getDocumentsData} =
    useSelector((state) => state.ProfileReducer);
  // console.log('Educ cdata', educationData);
  const dispatch = useDispatch();

  const [langData, setLangData] = useState([
    {
      name: strings?.hindi,
      isReadChecked: false,
      isWriteChecked: false,
      isSpeakChecked: true,
    },
    {
      name: strings?.english,
      isReadChecked: false,
      isWriteChecked: false,
      isSpeakChecked: true,
    },
    {
      name: strings?.marathi,
      isReadChecked: false,
      isWriteChecked: false,
      isSpeakChecked: true,
    },
  ]);

  // useEffect(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(() => {
  //     getUserData();
  //   });
  //   return () => interactionPromise.cancel();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      // const interactionPromise = InteractionManager.runAfterInteractions(() => {
      console.log('Run');
      getUserData();
      // });
      // getUserData();
      console.log('is focused ED');
      return () => {
        // interactionPromise.cancel();
        console.log('Un focused EDuc');
      };
      // return () => console.log('Un focused');
    }, []),
    // React.useCallback(() => {
    //   getUserData();
    //   // console.log('Focued EDuc');
    //   return () => console.log('Un focused EDuc');
    // }, []),
  );

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      getEducationData();
      setLangFromApi();
      if (profileData?.education) {
        setSelectedEducation(profileData?.education);
      }
      console.log('Education in', profileData?.education);
    });
    return () => interactionPromise.cancel();
  }, [profileData]);

  const setLangFromApi = () => {
    if (profileData) {
      let tempLangData = [...langData];
      if (profileData.hindi) {
        let hindiArray = profileData.hindi.split('');
        tempLangData[0].isReadChecked = hindiArray[0] == 0 ? false : true;
        tempLangData[0].isSpeakChecked = hindiArray[1] == 0 ? false : true;
        tempLangData[0].isWriteChecked = hindiArray[2] == 0 ? false : true;
      }
      if (profileData.english) {
        let englishArray = profileData.english.split('');
        tempLangData[1].isReadChecked = englishArray[0] == 0 ? false : true;
        tempLangData[1].isSpeakChecked = englishArray[1] == 0 ? false : true;
        tempLangData[1].isWriteChecked = englishArray[2] == 0 ? false : true;
      }
      if (profileData.marathi) {
        let marathiArray = profileData.marathi.split('');
        tempLangData[2].isReadChecked = marathiArray[0] == 0 ? false : true;
        tempLangData[2].isSpeakChecked = marathiArray[1] == 0 ? false : true;
        tempLangData[2].isWriteChecked = marathiArray[2] == 0 ? false : true;
      }

      setLangData([...tempLangData]);
    }
  };

  const getEducationData = () => {
    dispatch(
      callApi(
        EDUCATION,
        URLs.PLT_COMMON_DATA,
        {
          comm_name: 'education',
          app_lang: strings?.getLanguage(),
        },
        (data) => {
          console.log(
            'DAta is',
            data,
            profileData?.education,
            profileData?.education == null,
          );
          if (profileData?.education == null) {
            setSelectedEducation(data?.data?.[0].plt_disp_val);
          }
        },
      ),
    );
  };
  const selectData = (index) => {
    console.log('Index', index);
    if (selectedEducation === index) {
    } else {
      setSelectedEducation(index);
    }
  };

  const languageCheckBox = (index, type) => {
    let temp = [...langData];
    if (type === 'read') {
      temp[index].isReadChecked = !temp[index].isReadChecked;
    } else if (type === 'write') {
      temp[index].isWriteChecked = !temp[index].isWriteChecked;
    } else if (type === 'speak') {
      temp[index].isSpeakChecked = !temp[index].isSpeakChecked;
    }
    setLangData([...temp]);
  };

  const saveEducationDetail = () => {
    let value = '';
    let isValid = false;
    let temp = [...langData];
    for (let i = 0; i < temp.length; i++) {
      value = value.concat(temp[i].isReadChecked === true ? '1' : '0');
      value = value.concat(temp[i].isSpeakChecked === true ? '1' : '0');
      value = value.concat(temp[i].isWriteChecked === true ? '1' : '0');
      temp[i].newValue = value;
      value = '';
      isValid =
        isValid ||
        temp[i].isReadChecked === true ||
        temp[i].isSpeakChecked === true ||
        temp[i].isWriteChecked === true;
    }
    // return false;

    // if (!isValid) {
    //   showSnackBar('Please select at least one Language', 'error');
    //   return false;
    // }

    // if (!selectedEducation) {
    //   showSnackBar('Please Select Education', 'error');
    //   return false;
    // }

    dispatch(
      callApi(
        PROFILE,
        URLs.EDUCATION_DETAIL,
        {
          education: selectedEducation,
          hindi: temp[0].newValue,
          english: temp[1].newValue,
          marathi: temp[2].newValue,
        },
        () => {
          // props._carousel_ref.snapToNext();
          // getUserData();
          // props.goToNextPage();
          props.navigation.navigate('HealthDetail');
        },
      ),
    );
  };

  const getUserData = () => {
    dispatch(
      callApi(PROFILE, URLs.GET_USER_DATA, {}, ({data}) => {
        // console.log('Datas', data);
        setSelectedEducation(data?.education);
      }),
    );
  };

  const keyExtractor = (item, index) => index.toString();
  const renderItemEducation = ({item, index}) => {
    // console.log('Item is ', item);
    return (
      <TouchableOpacity
        onPress={() => selectData(item.plt_disp_val)}
        style={{
          borderWidth: 1,
          borderColor: '#4B79D8',
          backgroundColor:
            selectedEducation === item.plt_disp_val ? '#4B79D8' : '#fff',
          padding: 10,
          margin: 3,
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontSize: 11,
            color: selectedEducation === item.plt_disp_val ? '#fff' : '#4B79D8',
          }}>
          {item.plt_disp_val}
        </Text>
      </TouchableOpacity>
    );
  };

  const keyExtractorProfile = (item, index) => 'onboarding_' + index;
  const renderItemProfile = ({index}) => (
    <View
      style={
        index === 5
          ? {
              width: 15,
              height: 15,
              borderRadius: 7,
              backgroundColor: '#FFC003',
              borderWidth: 1,
              borderColor: '#FFC003',
              marginHorizontal: 8,
            }
          : {
              width: 15,
              height: 15,
              borderRadius: 7,
              borderWidth: 1,
              borderColor: '#FFC003',
              backgroundColor: '#00000000',
              marginHorizontal: 8,
            }
      }
    />
  );

  const renderItemLanguage = ({item, index}) => {
    const {isReadChecked, isSpeakChecked, isWriteChecked} = item;
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          // onPress={() => {
          //   selectLanguageData(index);
          // }}
          activeOpacity={1}
          style={{
            width: '30%',
            borderWidth: 1,
            borderColor: '#4B79D8',
            backgroundColor:
              isReadChecked || isSpeakChecked || isWriteChecked
                ? '#4B79D8'
                : '#fff',
            padding: 10,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color:
                isReadChecked || isSpeakChecked || isWriteChecked
                  ? '#fff'
                  : '#4B79D8',
              textAlign: 'center',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>

        <View style={{width: '10%'}}>
          <TouchableOpacity
            // disabled={!item.selected}
            onPress={() => languageCheckBox(index, 'speak')}
            style={termsView}>
            {item.isSpeakChecked ? (
              <TermCheck height={20} width={20} />
            ) : (
              <View style={unCheckBox}></View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={{color: '#707070'}}>{strings?.speak}</Text>
        <View style={{width: '10%'}}>
          <TouchableOpacity
            // disabled={!item.selected}
            onPress={() => languageCheckBox(index, 'read')}
            style={termsView}>
            {item.isReadChecked ? (
              <TermCheck height={20} width={20} />
            ) : (
              <View style={unCheckBox}></View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={{color: '#707070'}}>{strings?.read}</Text>
        <View style={{width: '10%'}}>
          <TouchableOpacity
            // disabled={!item.selected}
            onPress={() => languageCheckBox(index, 'write')}
            style={termsView}>
            {item.isWriteChecked ? (
              <TermCheck height={20} width={20} />
            ) : (
              <View style={unCheckBox}></View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={{color: '#707070'}}>{strings?.write}</Text>
      </View>
    );
  };
  const {unCheckBox, termsView} = localStyles;
  return (
    <>
      <Header showDrawer />
      <View style={{backgroundColor: '#4B79D8', height: 40}}>
        <View
          style={{
            alignItems: 'center',
            marginTop: 5,
            flexDirection: 'row',
            marginHorizontal: 10,
          }}>
          <Text
            style={{
              width: '100%',
              position: 'absolute',
              alignSelf: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}>
            PROFILE
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('SkillDetail')}
            style={{padding: 5}}>
            <Back />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('HealthDetail')}
            style={{padding: 5}}>
            <Next />
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={profileLoading} />
      <ScrollView>
        <View style={{flex: 1, backgroundColor: '#00000000'}}>
          <ProfileHerder
            profileData={profileData}
            getDocumentsData={getDocumentsData}
            onPress={() => saveEducationDetail()}
          />
          <View style={{alignItems: 'flex-end'}}>
            <BackgroundFlowerIcon style={{position: 'absolute', zIndex: -9}} />
          </View>

          <View style={{margin: 10}}>
            <View style={{marginVertical: 5, padding: 5}}>
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 18}}>
                {strings?.education}
              </Text>
              <View>
                {educationData.length ? (
                  <View
                    style={{
                      backgroundColor: '#fff',
                      width: '100%',
                      padding: 5,
                    }}>
                    <FlatList
                      horizontal
                      data={educationData}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={keyExtractor}
                      // numColumns={educationData.length}
                      showsVerticalScrollIndicator={false}
                      renderItem={renderItemEducation}
                      // renderItem={({item, index}) => {
                      //   return (
                      //     <TouchableOpacity
                      //       onPress={() => selectData(item.plt_disp_val)}
                      //       style={{
                      //         borderWidth: 1,
                      //         borderColor: '#4B79D8',
                      //         backgroundColor:
                      //           selectedEducation === item.plt_disp_val
                      //             ? '#4B79D8'
                      //             : '#fff',
                      //         padding: 10,
                      //         margin: 3,
                      //         borderRadius: 5,
                      //       }}>
                      //       <Text
                      //         style={{
                      //           fontSize: 11,
                      //           color:
                      //             selectedEducation === item.plt_disp_val
                      //               ? '#fff'
                      //               : '#4B79D8',
                      //         }}>
                      //         {item.plt_disp_val}
                      //       </Text>
                      //     </TouchableOpacity>
                      //   );
                      // }}
                    />
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
              <View
                style={{
                  marginTop: 40,
                }}>
                <Text bold style={{margin: 5, color: '#2751A7', fontSize: 18}}>
                  {strings?.language}
                </Text>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    padding: 5,
                  }}>
                  <FlatList
                    keyExtractor={keyExtractor}
                    data={langData}
                    renderItem={renderItemLanguage}
                    // renderItem={({item, index}) => {
                    //   const {
                    //     isReadChecked,
                    //     isSpeakChecked,
                    //     isWriteChecked,
                    //   } = item;
                    //   return (
                    //     <View
                    //       style={{
                    //         flexDirection: 'row',
                    //         padding: 10,
                    //         alignItems: 'center',
                    //       }}>
                    //       <TouchableOpacity
                    //         // onPress={() => {
                    //         //   selectLanguageData(index);
                    //         // }}
                    //         activeOpacity={1}
                    //         style={{
                    //           width: '30%',
                    //           borderWidth: 1,
                    //           borderColor: '#4B79D8',
                    //           backgroundColor:
                    //             isReadChecked ||
                    //             isSpeakChecked ||
                    //             isWriteChecked
                    //               ? '#4B79D8'
                    //               : '#fff',
                    //           padding: 10,
                    //           borderRadius: 5,
                    //         }}>
                    //         <Text
                    //           style={{
                    //             color:
                    //               isReadChecked ||
                    //               isSpeakChecked ||
                    //               isWriteChecked
                    //                 ? '#fff'
                    //                 : '#4B79D8',
                    //             textAlign: 'center',
                    //           }}>
                    //           {item.name}
                    //         </Text>
                    //       </TouchableOpacity>

                    //       <View style={{width: '10%'}}>
                    //         <TouchableOpacity
                    //           // disabled={!item.selected}
                    //           onPress={() => languageCheckBox(index, 'speak')}
                    //           style={termsView}>
                    //           {item.isSpeakChecked ? (
                    //             <TermCheck height={20} width={20} />
                    //           ) : (
                    //             <View style={unCheckBox}></View>
                    //           )}
                    //         </TouchableOpacity>
                    //       </View>
                    //       <Text style={{ color: '#707070'}}>
                    //         {titleSpeak}
                    //       </Text>
                    //       <View style={{width: '10%'}}>
                    //         <TouchableOpacity
                    //           // disabled={!item.selected}
                    //           onPress={() => languageCheckBox(index, 'read')}
                    //           style={termsView}>
                    //           {item.isReadChecked ? (
                    //             <TermCheck height={20} width={20} />
                    //           ) : (
                    //             <View style={unCheckBox}></View>
                    //           )}
                    //         </TouchableOpacity>
                    //       </View>
                    //       <Text style={{width: '13%', color: '#707070'}}>
                    //         {titleRead}
                    //       </Text>
                    //       <View style={{width: '10%'}}>
                    //         <TouchableOpacity
                    //           // disabled={!item.selected}
                    //           onPress={() => languageCheckBox(index, 'write')}
                    //           style={termsView}>
                    //           {item.isWriteChecked ? (
                    //             <TermCheck height={20} width={20} />
                    //           ) : (
                    //             <View style={unCheckBox}></View>
                    //           )}
                    //         </TouchableOpacity>
                    //       </View>
                    //       <Text style={{width: '20%', color: '#707070'}}>
                    //         {titleWrite}
                    //       </Text>
                    //     </View>
                    //   );
                    // }}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* <View
          style={{
            margin: 10,
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <StartIcon />
          <Text
            style={{
              color: '#777171',
              fontSize: 11,
              textAlign: 'center',
              marginHorizontal: 5,
              paddingHorizontal: 5,
            }}>
            {`Add a star to your profile by updating this section. Become a 7 Star \n Shramik to improve chances for selection to applied jobs.`}
          </Text>
        </View> */}
        </View>
        <View style={{alignItems: 'center'}}>
          <FlatList
            keyExtractor={keyExtractorProfile}
            data={PROFILE_SCREEN}
            horizontal
            contentContainerStyle={{
              justifyContent: 'center',
              marginBottom: 10,
            }}
            renderItem={renderItemProfile}
            // renderItem={({index}) => (
            //   <View
            //     style={
            //       index === 5
            //         ? {
            //             width: 15,
            //             height: 15,
            //             borderRadius: 7,
            //             backgroundColor: '#FFC003',
            //             borderWidth: 1,
            //             borderColor: '#FFC003',
            //             marginHorizontal: 8,
            //           }
            //         : {
            //             width: 15,
            //             height: 15,
            //             borderRadius: 7,
            //             borderWidth: 1,
            //             borderColor: '#FFC003',
            //             backgroundColor: '#00000000',
            //             marginHorizontal: 8,
            //           }
            //     }
            //   />
            // )}
          />
        </View>
      </ScrollView>
    </>
  );
}
