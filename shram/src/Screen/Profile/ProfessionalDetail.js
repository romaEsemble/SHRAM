// import Input from '@editText/EditText';
// import {useInput} from '@editText/EditTextHook';
import Header from '@header/Header';
import Back from '@icons/backArrow.svg';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import Next from '@icons/nextIcon.svg';
import Loader from '@loader/Loader';
import {URLs} from '@networking/Urls';
import ProfileHerder from '@profileHerder/ProfileHerder';
import {useFocusEffect} from '@react-navigation/native';
import {callApi} from '@redux/CommonDispatch.js';
import {INDUSTRY, PROFILE, TRADE} from '@redux/Types';
import {PROFILE_SCREEN} from '@resources/Constants';
import strings from '@resources/Strings';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {showSnackBar} from '@utils/Util';
import React, {useState} from 'react';
import {FlatList, Keyboard, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export default function ProfessionalDetail(props) {
  const [industryLocalData, setIndustryLocalData] = useState([]);
  const [tradeLocalData, setTradeLocalData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState({});

  const {
    industryData,
    tradeData,
    profileData,
    profileLoading,
    getDocumentsData,
  } = useSelector((state) => state.ProfileReducer);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Run');
      getUserData();

      console.log('is focused Pro');
      return () => {
        console.log('Un focused Pro');
      };
    }, []),
  );

  const getUserData = () => {
    dispatch(
      callApi(PROFILE, URLs.GET_USER_DATA, {}, (data) => {
        console.log('##Data', data);
        getExperienceData(data?.data?.exp);
        getIndustryData(data?.data?.industry, data?.data?.trade);
      }),
    );
  };

  const getIndustryData = (industryValue = null, tradeValue = null) => {
    dispatch(
      callApi(
        INDUSTRY,
        URLs.PLT_COMMON_DATA,
        {
          comm_name: 'industry',
          app_lang: strings?.getLanguage(),
        },
        (data) => {
          try {
            console.log('IndustryValue', industryValue);
            if (data?.data?.length == 0) return;
            let plt_val = [];

            console.log('Industry data', data, profileData?.industry);
            // if (profileData && profileData.industry) {
            if (industryValue) {
              let IndustryFromApi = industryValue.split(',');
              for (let i = 0; i < data.data.length; i++) {
                if (IndustryFromApi.includes(data.data[i].plt_val)) {
                  data.data[i].selected = true;
                  plt_val.push('trade_' + data.data[i].plt_val);
                }
              }
            } else {
              data.data[0].selected = true;
              plt_val.push('trade_' + data?.data[0]?.plt_val);
            }
            setIndustryLocalData(data.data);
            getTradeData(plt_val, tradeValue);
          } catch (error) {}
        },
      ),
    );
  };

  const getTradeData = (industryVal, tradeValue) => {
    if (industryVal && industryVal.length) {
      dispatch(
        callApi(
          TRADE,
          URLs.PLT_COMMON_DATA,
          {
            comm_name: industryVal.toString(), //TODO: Need to discuss with API
            app_lang: strings?.getLanguage(),
          },
          (data) => {
            if (tradeValue) {
              console.log('Trade Value', tradeValue);
              let tradeFromApi = tradeValue.split(',');
              for (let i = 0; i < data.data.length; i++) {
                if (tradeFromApi.includes(data.data[i].plt_val)) {
                  data.data[i].selected = true;
                }
              }
            } else {
              data.data[0].selected = true;
            }
            setTradeLocalData(data.data);
          },
        ),
      );
    }
  };

  const getExperienceData = (experienceValue = null) => {
    dispatch(
      callApi(
        INDUSTRY,
        URLs.PLT_COMMON_DATA,
        {
          comm_name: 'experience',
          app_lang: strings?.getLanguage(),
        },
        (data) => {
          console.log('Exp Data', profileData?.exp, experienceValue, data);
          if (experienceValue) {
            for (let i = 0; i < data.data.length; i++) {
              if (
                // parseInt(experienceValue || 0, 10) ===
                experienceValue === data.data[i]?.plt_disp_val
              ) {
                setSelectedExperience(data.data[i]);
              }
            }
          } else {
            setSelectedExperience(data.data[0]);
          }
          setExperienceData(data.data);
        },
      ),
    );
  };

  const selectIndustryData = (index) => {
    let temp = [...industryLocalData];
    temp[index].selected = !temp[index].selected;
    let tradeArray = [];

    for (let t = 0; t < temp.length; t++) {
      if (temp[t].selected) {
        tradeArray.push('trade_' + temp[t].plt_val);
      }
    }

    let flag = false;

    if (temp[index].selected === false) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].selected) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setTradeLocalData([]);
      } else {
        getTradeData(tradeArray, profileData?.trade);
      }
    } else {
      getTradeData(tradeArray, profileData?.trade);
    }
    setIndustryLocalData([...temp]);
  };

  const selectTradeData = (index) => {
    let temp = [...tradeLocalData];
    temp[index].selected = !temp[index].selected;
    setTradeLocalData([...temp]);
  };

  const saveProfessionalDetail = () => {
    Keyboard.dismiss();

    let industryArray = [];
    let tradeArray = [];

    for (let i = 0; i < industryLocalData.length; i++) {
      if (industryLocalData[i].selected) {
        industryArray.push(industryLocalData[i].plt_val);
      }
    }
    for (let i = 0; i < tradeLocalData.length; i++) {
      if (tradeLocalData[i].selected) {
        tradeArray.push(tradeLocalData[i].plt_val);
      }
    }
    if (!industryArray.length) {
      showSnackBar(strings?.selectIndustry, 'error');
      return false;
    } else if (!tradeArray.length) {
      showSnackBar(strings?.selectTrade, 'error');
      return false;
    }
    dispatch(
      callApi(
        PROFILE,
        URLs.PROFESSIONAL_DETAIL,
        {
          exp: selectedExperience?.plt_disp_val,
          industry: industryArray.toString(),
          trade: tradeArray.toString(),
        },
        () => {
          // props.navigation.navigate('SkillDetail');
          props.navigation.navigate('Documents');
        },
      ),
    );
  };

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
          {/*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */}
          <TouchableOpacity
            // onPress={() => props.navigation.navigate('AddressDetail')}
            onPress={() => props.navigation.navigate('NewPersonalDetails')}
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
            // onPress={() => props.navigation.navigate('SkillDetail')}
            onPress={() => props.navigation.navigate('Documents')}
            style={{padding: 5}}>
            <Next />
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={profileLoading} />
      {/* <ScrollView> */}
      <View style={{flex: 1, backgroundColor: '#00000000'}}>
        <ProfileHerder
          profileData={profileData}
          getDocumentsData={getDocumentsData}
          onPress={() => saveProfessionalDetail()}
        />
        <ScrollView>
          <View style={{alignItems: 'flex-end'}}>
            <BackgroundFlowerIcon style={{position: 'absolute', zIndex: -9}} />
          </View>
          <View style={{margin: 10}}>
            <Text bold style={{margin: 5, color: '#707070', fontSize: 18}}>
              {strings?.professional}
            </Text>
            <View style={{marginVertical: 5, padding: 5}}>
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                {strings?.industry}*
              </Text>
              {industryLocalData.length ? (
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    // padding: 10,
                  }}>
                  <FlatList
                    data={industryLocalData}
                    // horizontal
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    numColumns={3}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => selectIndustryData(index)}
                          style={{
                            borderWidth: 1,
                            borderColor: '#4B79D8',
                            backgroundColor: item.selected ? '#4B79D8' : '#fff',
                            padding: 10,
                            margin: 5,
                            borderRadius: 5,
                          }}>
                          <Text
                            style={{
                              color: item.selected ? '#fff' : '#4B79D8',
                              fontSize: 12,
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
            <View style={{marginVertical: 10, padding: 5}}>
              {tradeLocalData?.length ? (
                <>
                  <Text
                    bold
                    style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                    {strings?.trade}*
                  </Text>
                  <View
                    style={{
                      // width: '100%',

                      // flex: 1,
                      backgroundColor: '#fff',
                      // padding: 10,
                    }}>
                    <FlatList
                      data={tradeData}
                      showsHorizontalScrollIndicator={false}
                      // horizontal
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={3}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        return (
                          <TouchableOpacity
                            onPress={() => selectTradeData(index)}
                            style={{
                              borderWidth: 1,
                              borderColor: '#4B79D8',
                              backgroundColor: item.selected
                                ? '#4B79D8'
                                : '#fff',
                              padding: 10,
                              borderRadius: 5,
                              margin: 5,
                              flex: 1,
                              // flexWrap: 'wrap',
                            }}>
                            <Text
                              style={{
                                color: item.selected ? '#fff' : '#4B79D8',
                                flexWrap: 'wrap',
                                fontSize: 12,
                              }}>
                              {item.plt_disp_val}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}></FlatList>
                  </View>
                </>
              ) : (
                <View></View>
              )}
            </View>
            {/*  This Code is Commented after adding NewPersonalDetails Screen. Don't Remove commented code written after this line */}
            <View style={{marginVertical: 10, padding: 5}}>
              {experienceData?.length ? (
                <>
                  <Text
                    bold
                    style={{margin: 5, color: '#2751A7', fontSize: 16}}>
                    {strings?.experience}
                  </Text>
                  <FlatList
                    data={experienceData}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={4}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setSelectedExperience(item)}
                          style={{
                            borderWidth: 1,
                            borderColor: '#4B79D8',
                            backgroundColor:
                              selectedExperience?.plt_disp_val ===
                              item.plt_disp_val
                                ? '#4B79D8'
                                : null,
                            padding: 10,
                            margin: 5,
                            borderRadius: 5,
                            width: '20%',
                          }}>
                          <Text
                            style={{
                              color:
                                selectedExperience?.plt_disp_val ===
                                item.plt_disp_val
                                  ? '#fff'
                                  : '#4B79D8',
                              textAlign: 'center',
                              fontSize: 12,
                            }}>
                            {item.plt_disp_val}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              ) : (
                <View></View>
              )}
            </View>
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
                    // index === 2
                    index === 1
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
      </View>
      {/* </ScrollView> */}
    </>
  );
}
