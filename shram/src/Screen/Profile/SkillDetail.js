import Header from '@header/Header';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import TermCheck from '@icons/TermCheck';
import Loader from '@loader/Loader';
import Back from '@icons/backArrow.svg';
import Next from '@icons/nextIcon.svg';
import {URLs} from '@networking/Urls';
import localStyles from '@profile/ProfileStyles';
import ProfileHerder from '@profileHerder/ProfileHerder';
import {callApi} from '@redux/CommonDispatch.js';
import {PROFILE, SKILL} from '@redux/Types';
import {PROFILE_SCREEN} from '@resources/Constants';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, View, InteractionManager} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import strings from '@resources/Strings';

export default function SkillsDetail(props) {
  // const [selectedIndustrySkill, setSelectedIndustrySkill] = useState(false);
  // const [selectedTrade, setSelectedTrade] = useState(false);

  const {
    skillData,
    skillLoading,
    profileData,
    profileLoading,
    getDocumentsData,
  } = useSelector((state) => state.ProfileReducer);
  const [check, setCheck] = useState(
    parseInt(profileData?.computer_skill || 0, 10) === 1,
  );

  const [industrySkillData, setIndustrySkillData] = useState([]);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(() => {
  //     getUserData();
  //   });
  //   return () => interactionPromise.cancel();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
        console.log('Run');
        getUserData();
      });
      // getUserData();
      console.log('is focused SD');
      return () => {
        interactionPromise.cancel();
        console.log('Un focused SKill');
      };
      // return () => console.log('Un focused');
    }, []),
    // React.useCallback(() => {
    //   getUserData();

    //   // console.log('Focued Skill');
    //   return () => console.log('Un focused SKill');
    // }, []),
  );

  useEffect(() => {
    let skillValue = [];
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (profileData?.trade) {
        let tradeData = profileData?.trade.split(',');
        for (let i = 0; i < tradeData.length; i++) {
          skillValue.push('skill_' + tradeData[i]);
        }
      }
      if (skillValue.length) getSkillData(skillValue);
    });
    setCheck(parseInt(profileData?.computer_skill || 0, 10) === 1);
    return () => interactionPromise.cancel();
  }, [profileData]);

  const getSkillData = (skillValue) => {
    if (skillValue && skillValue.length) {
      dispatch(
        callApi(
          SKILL,
          URLs.PLT_COMMON_DATA,
          {
            comm_name: skillValue.toString(),
            app_lang: strings?.getLanguage(),
          },
          (data) => {
            console.log('Data for skills', data);
            if (data?.data?.length == 0) return;
            if (profileData && profileData.skill) {
              let skillFromApi = profileData.skill.split(',');
              for (let i = 0; i < data.data.length; i++) {
                if (skillFromApi.includes(data.data[i].plt_val)) {
                  data.data[i].selected = true;
                }
              }
            } else {
              data.data[0].selected = true;
            }
            setIndustrySkillData(data.data);
          },
        ),
      );
    }
  };
  const selectData = (index) => {
    let temp = [...industrySkillData];
    temp[index].selected = !temp[index].selected;
    setIndustrySkillData([...temp]);
  };
  const checkSkill = () => {
    if (check) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  };

  const saveSkillDetail = () => {
    let skillArray = [];

    for (let i = 0; i < industrySkillData.length; i++) {
      if (industrySkillData[i].selected) {
        skillArray.push(industrySkillData[i].plt_val);
      }
    }
    if (!skillArray.length) {
      showSnackBar(strings?.skillRequired, 'error');
      return false;
    }

    dispatch(
      callApi(
        PROFILE,
        URLs.SKILL_DETAIL,
        {skill: skillArray.toString(), computer_skill: check ? '1' : '0'},
        () => {
          // props._carousel_ref.snapToNext();
          // getUserData();
          // props.goToNextPage();
          props.navigation.navigate('EducationalDetail');
        },
      ),
    );
  };

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
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
            onPress={() => props.navigation.navigate('ProfessionalDetail')}
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
            onPress={() => props.navigation.navigate('EducationalDetail')}
            style={{padding: 5}}>
            <Next />
          </TouchableOpacity>
        </View>
      </View>

      <Loader loading={profileLoading || skillLoading} />
      <ScrollView>
        <View style={{flexGrow: 1, backgroundColor: '#00000000'}}>
          <ProfileHerder
            profileData={profileData}
            getDocumentsData={getDocumentsData}
            onPress={() => saveSkillDetail()}
          />
          <View style={{alignItems: 'flex-end'}}>
            <BackgroundFlowerIcon style={{position: 'absolute', zIndex: -9}} />
          </View>
          <View style={{margin: 10}}>
            <Text bold style={{margin: 5, color: '#707070', fontSize: 18}}>
              {strings?.skills}
            </Text>

            <View style={{marginVertical: 5, padding: 5}}>
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                {strings?.industrySkills}*
              </Text>
              <View style={{flex: 0.4}}>
                {industrySkillData.length ? (
                  <View
                    style={{
                      backgroundColor: '#fff',
                      width: '100%',
                      // padding: 10,
                    }}>
                    <FlatList
                      data={industrySkillData}
                      numColumns={3}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        return (
                          <TouchableOpacity
                            onPress={() => selectData(index)}
                            style={{
                              borderWidth: 1,
                              borderColor: '#4B79D8',
                              backgroundColor: item.selected
                                ? '#4B79D8'
                                : '#fff',
                              padding: 10,
                              margin: 3,
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{
                                color: item.selected ? '#fff' : '#4B79D8',
                              }}>
                              {item.plt_disp_val}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}></FlatList>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>

              <View
                style={{
                  marginTop: 40,
                  backgroundColor: '#fff',
                  width: '100%',
                  padding: 10,
                }}>
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Text style={{width: '60%', color: '#707070'}}>
                    COMPUTER SKILL
                  </Text>
                  <View style={{width: '30%'}}>
                    <TouchableOpacity
                      onPress={() => checkSkill()}
                      style={termsView}>
                      {check ? (
                        <TermCheck height={20} width={20} />
                      ) : (
                        <View style={unCheckBox}></View>
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={{width: '10%', color: '#707070'}}>Yes</Text>
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
            keyExtractor={(item, index) => 'onboarding_' + index}
            data={PROFILE_SCREEN}
            horizontal
            contentContainerStyle={{
              justifyContent: 'center',
              marginBottom: 10,
            }}
            renderItem={({index}) => (
              <View
                style={
                  index === 3
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
            )}
          />
        </View>
      </ScrollView>
    </>
  );
}
