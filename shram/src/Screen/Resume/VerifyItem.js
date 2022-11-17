import CorrectIcon from '@icons/answer_correct';
import IncorrectIcon from '@icons/answer_incorrect';
import {logAnswers} from '@resume/VerifyDispatch.js';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useState, useEffect} from 'react';
import {Image, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function VerifyItem({item, index, type, isAssessmentTaken}) {
  const dispatch = useDispatch();
  const [localAnswer, setLocalAnswer] = useState(
    item?.item?.localAnswer || [0, 0, 0, 0],
  );

  useEffect(() => {
    console.log('Called me', isAssessmentTaken);
    if (!isAssessmentTaken) {
      setLocalAnswer([0, 0, 0, 0]);
    } else {
      setLocalAnswer(item?.item?.localAnswer);
    }
  }, [type]);
  useEffect(() => {
    setLocalAnswer(item?.item?.localAnswer);
  }, []);

  // console.log('Type', type);
  const answerItemClick = (itemIndex, ansIndex, assessment_id) => {
    // console.log('Item clciked', ansIndex);
    const temp = localAnswer;
    temp[ansIndex] = temp[ansIndex] === 0 ? 1 : 0;
    for (let index = 0; index < localAnswer.length; index++) {
      if (ansIndex != index) {
        temp[index] = 0;
      }
    }
    // temp[0] = temp[ansIndex] === 0 ? 1 : 0;
    // console.log('We are doing', temp, localAnswer, ansIndex);
    setLocalAnswer([...temp]);
    // console.warn('Answer', temp);
    dispatch(logAnswers(temp, assessment_id, type));
    sendBtnClickToAnalytics('Selecting Answer from Assessment');
  };

  const getQuestion = (questionIndex) => {
    const {assessment_id, imglink, answer_img, answer_status} =
      item?.item || {};
    // console.log(
    //   'Item?.item',
    //   item?.item,
    //   answer_status,
    //   questionIndex,
    //   localAnswer,
    //   ['1', '0', '0', '0'][0],
    //   parseInt(localAnswer[questionIndex] || 0, 10) == 1,
    // );
    // console.log('WEhy not blue', localAnswer);
    // parseInt(localAnswer[questionIndex] || 0, 10) ||
    // parseInt(localAnswer[questionIndex] || 0, 10) === 1 ||

    return (
      <TouchableOpacity
        style={{
          borderWidth: parseInt(item?.item?.localAnswer[questionIndex] || 0, 10)
            ? 4
            : 1,
          borderRadius: 5,
          borderColor:
            parseInt(item?.item?.localAnswer[questionIndex] || 0, 10) == 1
              ? 'blue'
              : 'grey',
          marginHorizontal: 5,
        }}
        onPress={() => {
          isAssessmentTaken
            ? undefined
            : answerItemClick(index, questionIndex, assessment_id);
        }}>
        <Image
          source={{
            uri: imglink + answer_img?.split(',')[questionIndex]?.trim(),
          }}
          style={{
            width: 60,
            height: 60,
            borderWidth: 1,
            aspectRatio: 1,
          }}
        />
      </TouchableOpacity>
    );
  };

  const {question, is_ans_correct} = item?.item || {};
  // console.log('Ques is', question, is_ans_correct, item?.item?.localAnswer);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
        elevation: 1,
        marginVertical: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          margin: 5,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: '#777171',
            flex: 1,
            paddingRight: 5,
          }}>
          {question}
        </Text>

        {isAssessmentTaken ? (
          parseInt(is_ans_correct || 0, 10) === 1 ? (
            <CorrectIcon width={25} height={25} />
          ) : (
            <IncorrectIcon width={25} height={25} />
          )
        ) : null}
      </View>
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
        }}>
        {getQuestion(0)}
        {getQuestion(1)}
        {getQuestion(2)}
        {getQuestion(3)}
      </View>
    </View>
  );
}
