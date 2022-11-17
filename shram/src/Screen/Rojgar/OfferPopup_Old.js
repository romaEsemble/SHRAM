import Button from '@button/Button';
import CloseIcon from '@icons/closeColor.svg';
import {URLs} from '@networking/Urls';
import PopupModal from '@popupModal/PopupModal';
import {callApi} from '@redux/CommonDispatch.js';
import {OFFER_ACCEPT, OFFER_REJECT} from '@redux/Types';
import {TEXT_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import {debounce} from '@utils/Util';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

export default function OfferPopup(props) {
  const {offerRejectLoading, offerAcceptLoading} = useSelector(
    (state) => state.RojgarReducer,
  );
  const dispatch = useDispatch();

  const {
    item,
    onClose,
    localBookmark,
    onBookmarkPress,
    onCallBack,
    offerReject,
    profileData,
  } = props;
  const {
    job_title,
    company,
    location,
    job_type,
    job_period,
    shift,
    trade,
    jd_details,
    job_user_id,
  } = item;

  const AcceptOffer = (status) => {
    dispatch(
      callApi(
        OFFER_ACCEPT,
        URLs.CHANGE_JOB_STATUS,
        {
          status,
          job_user_id: [job_user_id],
        },
        () => {
          onClose();
          onCallBack(0);
        },
      ),
    );
  };

  const RejectOffer = (status) => {
    dispatch(
      callApi(
        OFFER_REJECT,
        URLs.CHANGE_JOB_STATUS,
        {
          status,
          job_user_id: [job_user_id],
        },
        () => {
          onClose();
          onCallBack(0);
        },
      ),
    );
  };

  return (
    <PopupModal onBackdropPress={onClose}>
      <ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            light
            type={TEXT_TYPE.LARGE}
            style={{marginTop: 5, flex: 1, color: 'grey'}}>
            OFFER
          </Text>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon width={wp(6)} height={wp(6)} />
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: '2%', marginVertical: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Job Title :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {job_title}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Company :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {company}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Location :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {location}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Job Type :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {job_type}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Job Period :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {job_period}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Start Date :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {''}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Shift Timing :
            </Text>
            <Text
              bold
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, marginLeft: 10}}>
              {shift}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              light
              type={TEXT_TYPE.SMALL}
              style={{marginTop: 5, color: 'grey'}}>
              Job Description :
            </Text>
          </View>
          <Text bold type={TEXT_TYPE.SMALL} style={{marginTop: 5}}>
            {jd_details}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 5,
            }}>
            <Button
              buttonStyle={{borderRadius: 5, marginVertical: 10}}
              title={'Reject'}
              backgroundColor={'red'}
              loading={offerRejectLoading}
              onPress={debounce(() => RejectOffer('4'))}
            />
            <Button
              buttonStyle={{borderRadius: 5, marginVertical: 10}}
              title={'Accept'}
              backgroundColor={'green'}
              loading={offerAcceptLoading}
              onPress={debounce(() => AcceptOffer('5'))}
            />
          </View>
        </View>
      </ScrollView>
    </PopupModal>
  );
}
