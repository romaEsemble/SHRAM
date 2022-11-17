import localStyles from '@assessment/AssessmentStyles';
import Button from '@button/Button';
import Loader from '@loader/Loader';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {
  ASSESSMENT_LIST,
  COMPUTER_ASSESSMENT,
  SKILL_ASSESSMENT,
  TRADE_ASSESSMENT,
} from '@redux/Types';
import {NAVIGATION_PROFILE_STACK} from '@navigation/NavigationKeys';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {debounce, showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  InteractionManager,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import VerifyItem from './VerifyItem';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function Verify({navigation}) {
  const [updateScreen, modifyUpdateScreen] = useState(false);
  const [isSelected, setIsSelected] = useState(0);
  const [submitAnswerLoader, setSubmitAnswer] = useState(false);

  const AssessmentTypes = [
    {assessmentName: 'INDUSTRY', isEnable: true, key: 'industry'},
    {assessmentName: 'TRADE', isEnable: false, key: 'trade'},
    {assessmentName: 'TRADE SKILL', isEnable: false, key: 'skill'},
    {assessmentName: 'COMPUTER', isEnable: false, key: 'computer'},
    {assessmentName: 'PROFILE', isEnable: false, key: 'profile'},
  ];

  const {
    assessmentListLoading,
    assessmentListData,
    industryAssessmentTaken,
    tradeListLoading,
    tradeListData,
    tradeAssessmentTaken,
    skillListLoading,
    skillListData,
    skillAssessmentTaken,
    computerListLoading,
    computerListData,
    computerAssessmentTaken,
  } = useSelector((state) => state.ResumeReducer);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   getAssessmentList(AssessmentTypes[0]?.key);
  // }, []);

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      getAssessmentList(AssessmentTypes[isSelected]?.key),
    );
    return () => interactionPromise.cancel();
  }, [isSelected]);

  const getData = (type) => {
    switch (type) {
      case 'industry':
        return assessmentListData;
      case 'trade':
        return tradeListData;
      case 'skill':
        return skillListData;
      case 'computer':
        return computerListData;
    }
  };

  const getAssessmentTaken = (type) => {
    switch (type) {
      case 'industry':
        return industryAssessmentTaken;
      case 'trade':
        return tradeAssessmentTaken;
      case 'skill':
        return skillAssessmentTaken;
      case 'computer':
        return computerAssessmentTaken;
    }
  };

  const getAssessmentList = (type) => {
    // console.warn('Called', type);
    let actionType = '';
    let data = '';
    switch (type) {
      case 'industry':
        actionType = ASSESSMENT_LIST;
        data = assessmentListData;
        break;
      case 'trade':
        actionType = TRADE_ASSESSMENT;
        data = tradeListData;
        break;
      case 'skill':
        actionType = SKILL_ASSESSMENT;
        data = skillListData;
        break;
      case 'computer':
        actionType = COMPUTER_ASSESSMENT;
        data = computerListData;
        break;
    }
    // data?.length === 0 &&
    dispatch(
      callApi(actionType, URLs.ASSESSMENT_LIST, {
        category: type,
      }),
    );
  };

  const checkAnswer = () => {
    const payload = [];
    setSubmitAnswer(true);
    let noAnswerSelected = true;
    getData(AssessmentTypes[isSelected]?.key).forEach((item, index) => {
      const {assessment_id, category, sub_category} = item;
      const answer_status = item.answer_status;
      const userAns = item.localAnswer.join(', ');
      if (userAns !== '0, 0, 0, 0') {
        noAnswerSelected = false;
      }
      payload.push({
        is_ans_correct: answer_status.trim() === userAns.trim() ? 1 : 2,
        your_ans: userAns,
        assessment_id,
        category,
        sub_category,
      });
    });

    if (noAnswerSelected) {
      setSubmitAnswer(false);
      showSnackBar(strings?.selectAtleastOneAnswer, 'error');
    } else {
      // send data to Server
      payload.forEach((item) => {
        // console.log('payload item', item);
        dispatch(callApi('SubmitAnswers', URLs.POST_ASSESSMENT_ANS, item));
      });

      getAssessmentList(AssessmentTypes[isSelected]?.key);
      modifyUpdateScreen(!updateScreen);
    }
    setTimeout(() => {
      setSubmitAnswer(false);
    }, 500);
  };

  const getFlatList = (data, loading, type, isAssessmentTaken) => {
    // console.log('get flatlist came');
    return (
      <FlatList
        data={data}
        refreshing={submitAnswerLoader}
        extraData={updateScreen}
        contentContainerStyle={{paddingBottom: 10}}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => 'assessment' + type + index}
        renderItem={(item, index) => (
          <VerifyItem
            item={item}
            index={index}
            type={AssessmentTypes[isSelected]?.key}
            isAssessmentTaken={isAssessmentTaken}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>No Record Found</Text>
            </View>
          )
        }
      />
    );
  };

  const navigate = () => {
    navigation.navigate('Documents', {sender: 'verify'});
  };

  const renderAssessmentType = (item, index) => {
    // console.log('index', index);
    return (
      <TouchableOpacity
        onPress={() => {
          console.warn('index', AssessmentTypes[index]?.key === 'profile');
          AssessmentTypes[index]?.key === 'profile'
            ? navigate()
            : setIsSelected(index);
          sendBtnClickToAnalytics(AssessmentTypes[index]?.assessmentName);
        }}
        style={{
          borderWidth: 1,
          borderColor: '#FFC003',
          borderRadius: 5,
          padding: 8,
          marginHorizontal: 3,
          backgroundColor: isSelected === index ? '#FFC003' : null,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#777171',
          }}>
          {item.assessmentName}
        </Text>
      </TouchableOpacity>
    );
  };

  const {flex1} = localStyles;
  return (
    <SafeAreaView style={[flex1]}>
      <Loader loading={submitAnswerLoader} />
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={['#9Bd35A', '#689F38']}
            refreshing={
              isSelected === 0
                ? assessmentListLoading
                : isSelected === 1
                ? tradeListLoading
                : isSelected === 2
                ? skillListLoading
                : computerListLoading
            }
            onRefresh={(item, index) => {
              getAssessmentList(AssessmentTypes[isSelected]?.key);
            }}
          />
        }>
        <Text style={{color: '#2751A7', fontWeight: 'bold', fontSize: 14}}>
          {strings?.assessment}
        </Text>
        <View style={{marginVertical: 5, flexDirection: 'row'}}>
          <FlatList
            keyExtractor={(item, index) => 'ass' + index}
            data={AssessmentTypes}
            // numColumns={6}
            horizontal
            renderItem={({item, index}) => renderAssessmentType(item, index)}
            ListEmptyComponent={
              !assessmentListLoading && (
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('@icons/nodata.png')}
                    style={{
                      margin: 10,
                      height: 200,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                  <Text style={{fontSize: 18}}>No Data Found</Text>
                </View>
              )
            }
          />
        </View>
        <>
          {isSelected === 0 && (
            <View style={{margin: 5}}>
              {getFlatList(
                assessmentListData,
                assessmentListLoading,
                TRADE_ASSESSMENT,
                industryAssessmentTaken,
              )}
            </View>
          )}
          {isSelected === 1 && (
            <View style={{margin: 5}}>
              {getFlatList(
                tradeListData,
                tradeListLoading,
                TRADE_ASSESSMENT,
                tradeAssessmentTaken,
              )}
            </View>
          )}
          {isSelected === 2 && (
            <View style={{margin: 5}}>
              {getFlatList(
                skillListData,
                skillListLoading,
                TRADE_ASSESSMENT,
                skillAssessmentTaken,
              )}
            </View>
          )}
          {isSelected === 3 && (
            <View style={{margin: 5}}>
              {getFlatList(
                computerListData,
                computerListLoading,
                TRADE_ASSESSMENT,
                computerAssessmentTaken,
              )}
            </View>
          )}
        </>

        {/* {getData(AssessmentTypes[isSelected]?.key)?.length > 0 && (
          <Button
            full
            disabled={getAssessmentTaken(AssessmentTypes[isSelected]?.key)}
            onPress={() => debounce(checkAnswer())}
            title={strings?.submit}
            loading={submitAnswerLoader}
          />
        )} */}
      </ScrollView>
    </SafeAreaView>
  );
}
