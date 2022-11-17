import Header from '@header/Header';
import {useRoute} from '@react-navigation/native';
import {RESUME_SCREEN} from '@resources/Constants';
import Photo from '@resume/Photo';
import localStyles from '@resume/ResumeStyles';
import Verify from '@resume/Verify';
import Video from '@resume/Video';
import WorkProfile from '@resume/WorkProfile';
import SubHeader from '@subHeader/SubHeader';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useState, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Resume({navigation}) {
  const route = useRoute();
  const {profileData} = useSelector((state) => state.ProfileReducer);
  const [activeSlide, setActiveSlide] = useState(route?.params?.page || 0);

  useEffect(() => {
    console.log('Use resume', route?.params?.page);
    setActiveSlide(route?.params?.page);
    getScreenView(route?.params?.page);
    return () => {};
  }, [route?.params]);

  const goToNextPage = () => {
    activeSlide !== 3 && setActiveSlide(activeSlide + 1);
  };

  const getColor = () => {
    if (profileData?.resume_level?.toLowerCase() === 'gold') {
      return '#EBB000';
    } else if (profileData?.resume_level?.toLowerCase() === 'sliver') {
      return '#95928B';
    }
    return '#CD7F32';
  };

  const getScreenView = (Screen) => {
    switch (Screen) {
      case 0:
        return <Video goToNextPage={() => goToNextPage()} />;
      case 1:
        return <Photo goToNextPage={() => goToNextPage()} />;
      case 2:
        return <WorkProfile goToNextPage={() => goToNextPage()} />;
      case 3:
        return (
          <Verify navigation={navigation} goToNextPage={() => goToNextPage()} />
        );

      default:
        return false;
    }
  };

  const {flex1, optionView, optionTextStyle} = localStyles;
  return (
    <View style={flex1}>
      <Header showDrawer />
      <SubHeader title={'Rojgar'} navigation={navigation} />
      <View style={{...flex1, margin: 5}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <View style={{width: '20%'}}>
            <Text style={{color: '#2751A7', fontSize: 14}}>
              {strings?.resume}
            </Text>
            <Text style={{color: '#2751A7', fontSize: 16, fontWeight: 'bold'}}>
              {profileData?.resume_level}
            </Text>
          </View>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FlatList
              keyExtractor={(item, index) => 'resume' + index}
              data={RESUME_SCREEN}
              horizontal
              nestedScrollEnabled
              renderItem={({item, index}) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveSlide(index);
                      sendBtnClickToAnalytics(
                        'Resume Screen' + RESUME_SCREEN[index]?.NAME,
                      );
                    }}
                    style={{
                      ...optionView,
                      backgroundColor:
                        index === activeSlide ? '#4B79D8' : '#fff',
                    }}>
                    <Text
                      style={{
                        ...optionTextStyle,
                        color: index === activeSlide ? '#fff' : '#4B79D8',
                      }}>
                      {item.NAME}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
        {getScreenView(activeSlide)}
      </View>
    </View>
  );
}
