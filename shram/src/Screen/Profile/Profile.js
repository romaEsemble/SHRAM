import Header from '@header/Header';
import Back from '@icons/backArrow.svg';
import Next from '@icons/nextIcon.svg';
import {URLs} from '@networking/Urls';
import AddressDetail from '@profile/AddressDetail';
import Documents from '@profile/Documents';
import EducationalDetail from '@profile/EducationalDetail';
import HealthDetail from '@profile/HealthDetail';
import PersonalDetail from '@profile/PersonalDetail';
import ProfessionalDetail from '@profile/ProfessionalDetail';
import SkillDetail from '@profile/SkillDetail';
import {callApi} from '@redux/CommonDispatch.js';
import {PROFILE} from '@redux/Types';
import {PROFILE_SCREEN} from '@resources/Constants';
import Text from '@textView/TextView';
import {withTheme} from '@theme/ThemeHelper';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  InteractionManager,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';

function Profile({navigation, route}) {
  const [activeSlide, setActiveSlide] = useState(route?.params?.page || 0);
  const dispatch = useDispatch();

  const useMount = (func) => useEffect(() => func(), []);

  useMount(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      getUserData(),
    );
    return () => interactionPromise.cancel();
  });

  const getUserData = () => {
    dispatch(callApi(PROFILE, URLs.GET_USER_DATA, {}));
  };

  const navigateToPage = (type) => {
    if (type) {
      activeSlide !== 0 && setActiveSlide(activeSlide - 1);
    } else {
      activeSlide !== 6 && setActiveSlide(activeSlide + 1);
      activeSlide === 6 && setActiveSlide(0);
    }
  };

  const getScreenView = (Screen) => {
    switch (Screen) {
      case 0:
        return <PersonalDetail goToNextPage={navigateToPage} />;
      case 1:
        return <AddressDetail goToNextPage={navigateToPage} />;
      case 2:
        return <ProfessionalDetail goToNextPage={navigateToPage} />;
      case 3:
        return <SkillDetail goToNextPage={navigateToPage} />;
      case 4:
        return <EducationalDetail goToNextPage={navigateToPage} />;
      case 5:
        return <HealthDetail goToNextPage={navigateToPage} />;
      case 6:
        return (
          <Documents navigation={navigation} goToNextPage={navigateToPage} />
        );

      default:
        return false;
    }
  };

  return (
    <ScrollView>
      <SafeAreaView>
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
              onPress={() => navigateToPage(1)}
              style={{padding: 5}}>
              {activeSlide !== 0 && <Back />}
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center',
              }}></Text>
            {activeSlide !== 6 && (
              <TouchableOpacity
                onPress={() => navigateToPage()}
                style={{padding: 5}}>
                <Next />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {getScreenView(activeSlide)}
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
                  index === activeSlide
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
      </SafeAreaView>
    </ScrollView>
  );
}

export default withTheme(Profile);
