import React, {Component} from 'react';
import Button from '@button/Button';
import CloseIcon from '@icons/closeColor.svg';
import {URLs} from '@networking/Urls';
import PopupModal from '@popupModal/PopupModal';
import {OFFER_ACCEPT, OFFER_REJECT} from '@redux/Types';
import {TEXT_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import {debounce} from '@utils/Util';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {offerAccept, offerReject} from '@rojgar/RojgarActions';
import moment from 'moment';
import strings from '@resources/Strings';

class OfferPopup extends Component {
  AcceptOffer = (status) => {
    const {item, onClose, onCallBack} = this.props;
    const {job_user_id} = item;
    const payload = {
      status,
      job_user_id: [job_user_id],
    };
    this.props.offerAccept(
      OFFER_ACCEPT,
      URLs.CHANGE_JOB_STATUS,
      payload,
      () => {
        onClose();
        onCallBack(0);
      },
    );
  };

  RejectOffer = (status) => {
    const {item, onClose, onCallBack} = this.props;
    const {job_user_id} = item;
    const payload = {
      status,
      job_user_id: [job_user_id],
    };
    this.props.offerReject(
      OFFER_REJECT,
      URLs.CHANGE_JOB_STATUS,
      payload,
      () => {
        onClose();
        onCallBack(0);
      },
    );
  };

  render() {
    const {item, onClose, offerAcceptLoading, offerRejectLoading} = this.props;
    const {
      job_title,
      company,
      location,
      job_type,
      job_period,
      job_period_uom,
      shift,
      jd_details,
      job_from,
      pay_offer,
      offer_pay_rate,
    } = item;
    console.log('Item is', item);
    return (
      <PopupModal onBackdropPress={onClose}>
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
          <ScrollView>
            <>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, color: 'grey'}}>
                  {strings?.company} :
                </Text>
                <Text
                  bold
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, marginLeft: 10}}>
                  {company}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, color: 'grey'}}>
                  {strings?.location} :
                </Text>
                <Text
                  bold
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, marginLeft: 10}}>
                  {location}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  {parseInt(job_type || 0, 10) === 1
                    ? 'Contract'
                    : parseInt(job_type || 0, 10) === 2
                    ? 'Permanent'
                    : '-'}
                </Text>
              </View>
              {parseInt(job_type || 0, 10) === 1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    light
                    type={TEXT_TYPE.EXTRA_SMALL}
                    style={{marginTop: 5, color: 'grey'}}>
                    Job Period :
                  </Text>
                  <Text
                    light
                    type={TEXT_TYPE.SMALL}
                    style={{marginTop: 5, marginLeft: 10}}>
                    {job_period}{' '}
                    {parseInt(job_period_uom || 0, 10) === 1
                      ? 'Day'
                      : parseInt(job_period_uom || 0, 10) === 2
                      ? 'Months'
                      : parseInt(job_period_uom || 0, 10) === 3
                      ? 'Years'
                      : 'Weeks'}
                  </Text>
                </View>
              )}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  {job_from ? moment(job_from).format('DD MMM YYYY') : '-'}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, color: 'grey'}}>
                  Offered Pay :
                </Text>
                <Text
                  bold
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, marginLeft: 10}}>
                  {pay_offer || '-'}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, color: 'grey'}}>
                  Offered Pay Rate :
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, marginLeft: 10}}>
                  {parseInt(offer_pay_rate || 0, 10) === 1
                    ? 'Daily'
                    : parseInt(offer_pay_rate || 0, 10) === 2
                    ? 'Monthly'
                    : parseInt(offer_pay_rate || 0, 10) === 3
                    ? 'Yearly'
                    : 'Weekly'}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, color: 'grey'}}>
                  {strings?.shiftTiming} :
                </Text>
                <Text
                  light
                  type={TEXT_TYPE.SMALL}
                  style={{marginTop: 5, marginLeft: 10}}>
                  {parseInt(shift || 0, 10) === 1
                    ? 'Morning'
                    : parseInt(shift || 0, 10) === 2
                    ? 'Evening'
                    : parseInt(shift || 0, 10) === 3
                    ? 'Night'
                    : '-'}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
            </>
          </ScrollView>
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
              onPress={debounce(() => this.RejectOffer('4'))}
            />
            <Button
              buttonStyle={{borderRadius: 5, marginVertical: 10}}
              title={'Accept'}
              backgroundColor={'green'}
              loading={offerAcceptLoading}
              onPress={debounce(() => this.AcceptOffer('5'))}
            />
          </View>
        </View>
      </PopupModal>
    );
  }
}

function mapStateToProps(state) {
  return {
    offerAcceptLoading: state.RojgarReducer.offerAcceptLoading,
    offerRejectLoading: state.RojgarReducer.offerRejectLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    offerAccept: (type, url, payload, callbackFunc) =>
      dispatch(offerAccept(type, url, payload, callbackFunc)),
    offerReject: (type, url, payload, callbackFunc) =>
      dispatch(offerReject(type, url, payload, callbackFunc)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferPopup);
