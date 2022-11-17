import localStyles from '@assessment/AssessmentStyles';
import ErrorView from '@errorView/ErrorView';
import Header from '@header/Header';
// import Option2 from '@icons/option2';
// import Option3 from '@icons/option3';
// import Option4 from '@icons/option4';
import {URLs} from '@networking/Urls';
import {callApi} from '@redux/CommonDispatch.js';
import {INDUSTRY_ASSESSMENT, TRADE_ASSESSMENT} from '@redux/Types';
import {ERROR_VIEW_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import React, {useState} from 'react';
import {FlatList, Image, View} from 'react-native';
import CommonImage from '@cardItem/CommonImage';
import {useDispatch, useSelector} from 'react-redux';

export default function Assessment() {
  const AssessmentTypes = [
    {assessmentName: 'INDUSTRY', isEnable: true},
    {assessmentName: 'TRADE', isEnable: false},
    {assessmentName: 'TRADE SKILL', isEnable: false},
    {assessmentName: 'COMPUTER', isEnable: false},
    {assessmentName: 'PROFILE', isEnable: false},
  ];
  const [dataLength, setDataLength] = useState(0);
  const [Assessment, setAssessment] = useState([
    {
      text: '1 Identify Pipe Wrench',
      correct: '1',
      option1: '1',
      option2: '2',
      option3: '3',
      option4: '4',
      answered: '0',
    },
    {
      text: '2 Identify Pipe Wrench',
      correct: '4',
      option1: '1',
      option2: '2',
      option3: '3',
      option4: '4',
      answered: '0',
    },
    {
      text: '3 Identify Pipe Wrench',
      correct: '2',
      option1: '1',
      option2: '2',
      option3: '3',
      option4: '4',
      answered: '0',
    },
  ]);
  const {
    industryAssessmentData,
    industryAssessmentError,
    industryAssessmentLoading,
    tradeAssessmentData,
    tradeAssessmentError,
    tradeAssessmentLoading,
  } = useSelector((state) => state.AssessmentReducer);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   getAssessmentList(INDUSTRY_ASSESSMENT);
  // }, []);

  const getAssessmentList = (type) => {
    let actionType = '';
    switch (type) {
      case INDUSTRY_ASSESSMENT:
        actionType = INDUSTRY_ASSESSMENT;
        break;
      case TRADE_ASSESSMENT:
        actionType = TRADE_ASSESSMENT;
        break;
    }
    dispatch(
      callApi(actionType, URLs.ASSESSMENT_LIST, {
        type,
      }),
    );
  };
  const checkAnswer = (selectedOption, index) => {
    let temp = [...Assessment];
    // if (selectedOption === temp[index].correct) {
    temp[index].greenColor = selectedOption;
    //   // temp[index].disableCart = true;
    //   // setDataLength(-1);
    //   // if (dataLength - 1 == 0) {
    //   //call api
    //   // }
    // }
    setAssessment([...temp]);
  };

  const renderAssessmentList = (item, index) => {
    const {optionsView, WrongOptions, CorrectOptions} = localStyles;
    const images = item?.answer_img?.split(',')?.trim();
    console.log('Image link', item?.imglink, images[0]);
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
            }}>
            {item.text}
          </Text>

          {/* <CorrectIcon width={25} height={25} /> */}

          {/* <IncorrectIcon width={25} height={25} /> */}
        </View>
        <View
          style={{
            padding: 15,
            flexDirection: 'row',
          }}>
          {/* <Text>{item.correct + item.option1}</Text> */}
          <TouchableOpacity
            style={{
              borderWidth: item.greenColor ? 4 : 1,
              borderRadius: 5,
              borderColor: 'blue',
              marginHorizontal: 5,
            }}
            onPress={() => checkAnswer(item.option1, index)}>
            <Image
              source={{uri: item?.imglink + images[0]}}
              style={{
                width: 50,
                height: 50,
                marginHorizontal: '2%',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
            {/* <CommonImage
          style={{height: 200, width: 200}}
          type={0} //means local
          source={require('@icons/nodata.png')}></CommonImage> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: item.greenColor ? 4 : 1,
              borderRadius: 5,
              borderColor: 'blue',
              marginHorizontal: 5,
            }}
            onPress={() => checkAnswer(item.option2, index)}>
            <Option2 />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: item.greenColor ? 4 : 1,
              borderRadius: 5,
              borderColor: 'blue',
              marginHorizontal: 5,
            }}
            onPress={() => checkAnswer(item.option3, index)}>
            <Option3 />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: item.greenColor ? 4 : 1,
              borderRadius: 5,
              borderColor: 'blue',
              marginHorizontal: 5,
            }}
            onPress={() => checkAnswer(item.option4, index)}>
            <Option4 />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const getFlatList = (data, loading, error, type) => {
    return (
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => 'assessment' + type + index}
        renderItem={({item, index}) => {
          return renderAssessmentList(item, index);
        }}
        // refreshControl={
        //   <RefreshControl
        //     colors={['#9Bd35A', '#689F38']}
        //     refreshing={loading}
        //     onRefresh={() => {
        //       getAssessmentList(type);
        //     }}
        //   />
        // }
        ListEmptyComponent={
          loading ? null : (
            <ErrorView
              type={error ? ERROR_VIEW_TYPE.ERROR : ERROR_VIEW_TYPE.NODATA}
              text={error}
            />
          )
        }
      />
    );
  };
  const renderAssessmentType = (item) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#FFC003',
          borderRadius: 5,
          padding: 8,
          marginHorizontal: 3,
          backgroundColor: item.isEnable ? '#FFC003' : null,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#777171',
          }}>
          {item.assessmentName}
        </Text>
      </View>
    );
  };
  const {flex1} = localStyles;
  return (
    <View style={flex1}>
      <Header showCall showNotification />
      <View style={{margin: 10}}>
        <Text style={{color: '#2751A7', fontWeight: 'bold', fontSize: 14}}>
          ASSESSMENT
        </Text>
        <View style={{marginVertical: 5}}>
          <FlatList
            data={AssessmentTypes}
            horizontal
            renderItem={({item}) => {
              return renderAssessmentType(item);
            }}
          />
        </View>
        <View style={{margin: 5}}>
          {getFlatList(
            Assessment,
            industryAssessmentError,
            industryAssessmentLoading,
            INDUSTRY_ASSESSMENT,
          )}
        </View>
      </View>
    </View>
  );
}
