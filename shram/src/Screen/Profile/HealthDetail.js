import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import BackgroundFlowerIcon from '@icons/backgroundFlower';
import CalendarIcon from '@icons/CalendarIcon.svg';
import Header from '@header/Header';
import Back from '@icons/backArrow.svg';
import Next from '@icons/nextIcon.svg';
import Loader from '@loader/Loader';
import {URLs} from '@networking/Urls';
import localStyles from '@profile/ProfileStyles';
import ProfileHerder from '@profileHerder/ProfileHerder';
import {callApi} from '@redux/CommonDispatch.js';
import {PROFILE} from '@redux/Types';
import {INPUT_TYPE_OTHER, PROFILE_SCREEN} from '@resources/Constants';
import {healthValidation} from '@resources/Validate';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {showSnackBar} from '@utils/Util';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, View, InteractionManager} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import strings from '@resources/Strings';

export default function HealthDetail(props) {
  const [fromDateTimePickerVisible, setFromDateTimePickerVisible] = useState(
    false,
  );
  const [fromDate, setFromDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('male');

  const {profileData, profileLoading, getDocumentsData} = useSelector(
    (state) => state.ProfileReducer,
  );

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
      console.log('is focused HD');
      return () => {
        interactionPromise.cancel();
        console.log('Un focused Health');
      };
      // return () => console.log('Un focused');
    }, []),
    // React.useCallback(() => {
    //   getUserData();
    //   // console.log('Focued Health');
    //   return () => console.log('Un focused Health');
    // }, []),
  );

  const dispatch = useDispatch();
  const BLOOD_GROUP_DATA = [
    {
      name: 'A +ve',
    },
    {
      name: 'A -ve',
    },
    {
      name: 'B +ve',
    },
    {
      name: 'B -ve',
    },
    {
      name: 'O +ve',
    },
    {
      name: 'O -ve',
    },
    {
      name: 'AB +ve',
    },

    {
      name: 'AB -ve',
    },
  ];
  const {
    value: heightFeet,
    setValue: setHeightFeet,
    bind: heightFeetBind,
    checkValidation: CheckHeightFeetValidation,
  } = useInput('', INPUT_TYPE_OTHER, healthValidation, 'Feet');
  const {
    value: heightInch,
    setValue: setHeightInch,
    bind: heightInchBind,
    checkValidation: CheckHeightInchValidation,
  } = useInput('', INPUT_TYPE_OTHER, healthValidation, 'Inch');
  const {
    value: weightKgs,
    setValue: setWeight,
    bind: weightKgsBind,
    checkValidation: CheckWeightKgsValidation,
  } = useInput('', INPUT_TYPE_OTHER, healthValidation, 'Weight');

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (profileData) {
        if (profileData.dob) {
          setFromDate(profileData.dob);
        }
        if (profileData.gender) setGender(profileData.gender.toLowerCase());

        if (profileData.height) {
          setHeightFeet(profileData.height.toString().split('.')[0]);
          setHeightInch(profileData.height.toString().split('.')[1]);
        }
        if (profileData.weight) setWeight(profileData.weight.toString());

        if (profileData.bgroup) setBloodGroup(profileData.bgroup);
      }
    });
    return () => interactionPromise.cancel();
  }, [profileData]);

  const handleFromDatePicked = (date) => {
    setFromDateTimePickerVisible(false);
    setFromDate(date);
  };

  const selectData = (index, type) => {
    setBloodGroup(BLOOD_GROUP_DATA[index].name);
  };

  const saveHealthDetail = () => {
    if (heightFeet !== '' && CheckHeightFeetValidation()) return false;
    else if (!fromDate) {
      showSnackBar(strings?.addDOB, 'error');
      return false;
    }
    // else if (!heightFeet || heightFeet === ' ' || heightFeet < 0) {
    //   showSnackBar('Feet is Not Valid', 'error');
    //   return false;
    // } else if (!heightInch || heightInch === ' ' || heightInch < 0) {
    //   showSnackBar('Inch is Not Valid', 'error');
    //   return false;
    // } else if (!weightKgs || weightKgs === ' ' || weightKgs < 0) {
    //   showSnackBar('Weight is Not Valid', 'error');
    //   return false;
    // }
    else if (heightInch !== '' && CheckHeightInchValidation()) return false;
    else if (weightKgs !== '' && CheckWeightKgsValidation()) return false;
    // else if (bloodGroup?.length === 0) {
    //   showSnackBar('Please Select Blood Group.', 'error');
    //   return false;
    // }
    else if (weightKgs > 200) {
      showSnackBar(strings?.weightNotMoreThan, 'error');
      return false;
    } else if (heightInch > 12) {
      showSnackBar(strings?.inchNotMoreThan, 'error');
      return false;
    }

    dispatch(
      callApi(
        PROFILE,
        URLs.HEALTH_DETAIL,
        {
          gender: gender,
          dob: fromDate,
          height: `${heightFeet || 0}.${heightInch || 0}`,
          weight: weightKgs || 0,
          bgroup: bloodGroup,
        },
        () => {
          // props._carousel_ref.snapToNext();
          // getUserData();
          // props.goToNextPage();
          props.navigation.navigate('Documents');
        },
      ),
    );
  };

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };

  let heightRef = null;
  let inchRef = null;
  let weightRef = null;
  const {inputTextStyle, inputHealthContainerStyle} = localStyles;
  const keyExtractor = (item, index) => index.toString();
  const renderItemBloodGroup = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => selectData(index)}
        style={{
          borderWidth: 1,
          borderColor: '#4B79D8',
          backgroundColor: bloodGroup === item.name ? '#4B79D8' : null,
          padding: 10,
          margin: 5,
          borderRadius: 5,
          width: '20%',
        }}>
        <Text
          style={{
            color: bloodGroup === item.name ? '#fff' : '#4B79D8',
            textAlign: 'center',
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => props.navigation.navigate('EducationalDetail')}
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
            onPress={() => props.navigation.navigate('Documents')}
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
            onPress={() => saveHealthDetail()}
          />
          <View style={{alignItems: 'flex-end'}}>
            <BackgroundFlowerIcon style={{position: 'absolute', zIndex: -9}} />
          </View>

          <View style={{margin: 10}}>
            <View style={{marginVertical: 5, padding: 5}}>
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 18}}>
                {strings?.personalDetails}
              </Text>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      // marginVertical: 5,
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#707070',
                        fontSize: 14,
                      }}>
                      {strings?.gender}*
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setGender('male')}
                    style={{
                      marginHorizontal: 5,
                      borderWidth: 1,
                      borderColor: '#4B79D8',
                      padding: 10,
                      margin: 3,
                      borderRadius: 5,
                      backgroundColor: gender === 'male' ? '#4B79D8' : null,
                    }}>
                    <Text
                      style={{
                        color: gender === 'male' ? '#fff' : '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {'Male'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGender('female')}
                    style={{
                      marginHorizontal: 5,
                      backgroundColor: gender === 'female' ? '#4B79D8' : null,
                      borderWidth: 1,
                      borderColor: '#4B79D8',
                      padding: 10,
                      margin: 3,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: gender === 'female' ? '#fff' : '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {'Female'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGender('other')}
                    style={{
                      marginHorizontal: 5,
                      backgroundColor: gender === 'other' ? '#4B79D8' : null,
                      borderWidth: 1,
                      borderColor: '#4B79D8',
                      padding: 10,
                      margin: 3,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: gender === 'other' ? '#fff' : '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {'Other'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginVertical: 5,
                padding: 5,
              }}>
              <View style={{marginVertical: 5, padding: 5, width: '20%'}}>
                <Text style={{color: '#707070', fontSize: 14}}>
                  {strings?.dob}*
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 10,
                      borderColor: '#4B79D8',
                      marginRight: 10,
                      height: 50,
                      width: 60,
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {fromDate ? moment(fromDate).format('DD') : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 10,
                      borderColor: '#4B79D8',
                      marginRight: 10,
                      height: 50,
                      width: 60,
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {fromDate ? moment(fromDate).format('MM') : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 10,
                      borderColor: '#4B79D8',
                      marginRight: 10,
                      height: 50,
                      width: 60,
                    }}>
                    <Text
                      style={{
                        color: '#4B79D8',
                        textAlign: 'center',
                      }}>
                      {fromDate ? moment(fromDate).format('YYYY') : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <DateTimePicker
                isVisible={fromDateTimePickerVisible}
                onConfirm={handleFromDatePicked}
                maximumDate={new Date(moment().subtract(18, 'years'))}
                onCancel={() => {
                  setFromDateTimePickerVisible(false);
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  setFromDateTimePickerVisible(true);
                }}
                style={{
                  // flexDirection: 'row',
                  // justifyContent: 'space-between',
                  // // borderWidth: 1,
                  // alignItems: 'center',
                  // padding: 10,
                  // borderRadius: 5,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 10,
                  borderColor: '#4B79D8',
                  backgroundColor: '#4B79D8',
                  marginRight: 10,
                  height: 50,
                  width: 60,
                }}>
                <CalendarIcon
                  width={25}
                  height={25}
                  style={{alignSelf: 'center'}}
                  fill={'#fff'}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 5, padding: 5}}>
              <Text bold style={{margin: 5, color: '#2751A7', fontSize: 18}}>
                {strings?.healthMedical}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 5,
                alignItems: 'center',
              }}>
              <View style={{marginVertical: 5, padding: 5, width: '20%'}}>
                <Text style={{color: '#707070', fontSize: 14}}>
                  {strings?.height}
                </Text>
              </View>

              <Input
                inputContainerStyle={inputHealthContainerStyle}
                inputStyle={inputTextStyle}
                style={{
                  width: '20%',
                  marginTop: 20,
                }}
                {...heightFeetBind}
                keyboardType={'numeric'}
                maxLength={1}
                onSubmitEditing={() => heightRef?.focus()}
              />
              <Text
                style={{
                  color: '#9F9F9F',
                  alignSelf: 'center',
                  fontSize: 14,
                  marginHorizontal: 5,
                  width: '10%',
                }}>
                {' '}
                Feet
              </Text>
              <Input
                inputContainerStyle={inputHealthContainerStyle}
                inputStyle={inputTextStyle}
                style={{
                  width: '20%',
                  marginTop: 20,
                }}
                {...heightInchBind}
                maxLength={2}
                keyboardType={'numeric'}
                onSubmitEditing={() => inchRef?.focus()}
                inputRef={(ref) => (heightRef = ref)}
              />
              <Text
                style={{
                  color: '#9F9F9F',
                  alignSelf: 'center',
                  width: '10%',
                  marginHorizontal: 5,
                  fontSize: 14,
                }}>
                {' '}
                Inch
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 5,
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 5,
                  width: '20%',
                }}>
                <Text style={{color: '#707070', fontSize: 14}}>
                  {strings?.weight}
                </Text>
              </View>
              <Input
                inputContainerStyle={inputHealthContainerStyle}
                inputStyle={inputTextStyle}
                style={{width: '20%', marginTop: 10}}
                {...weightKgsBind}
                maxLength={3}
                keyboardType={'numeric'}
                onSubmitEditing={() => weightRef?.focus()}
                inputRef={(ref) => (inchRef = ref)}
              />
              <Text
                style={{
                  color: '#9F9F9F',
                  fontSize: 14,
                  alignSelf: 'center',
                  width: '10%',
                  marginHorizontal: 5,
                  marginBottom: 10,
                }}>
                {' '}
                Kgs
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                padding: 5,
              }}>
              <View style={{marginVertical: 5, padding: 5}}>
                <Text style={{color: '#707070', fontSize: 14}}>
                  {strings?.bloodGroup}
                </Text>
              </View>
            </View>
            <FlatList
              data={BLOOD_GROUP_DATA}
              showsHorizontalScrollIndicator={false}
              numColumns={BLOOD_GROUP_DATA.length / 2}
              keyExtractor={keyExtractor}
              renderItem={renderItemBloodGroup}
              // renderItem={({item, index}) => {
              //   return (
              //     <TouchableOpacity
              //       onPress={() => selectData(index)}
              //       style={{
              //         borderWidth: 1,
              //         borderColor: '#4B79D8',
              //         backgroundColor:
              //           bloodGroup === item.name ? '#4B79D8' : null,
              //         padding: 10,
              //         margin: 5,
              //         borderRadius: 5,
              //         width: '20%',
              //       }}>
              //       <Text
              //         style={{
              //           color: bloodGroup === item.name ? '#fff' : '#4B79D8',
              //           textAlign: 'center',
              //         }}>
              //         {item.name}
              //       </Text>
              //     </TouchableOpacity>
              //   );
              // }}
            />
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
                  index === 4
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
