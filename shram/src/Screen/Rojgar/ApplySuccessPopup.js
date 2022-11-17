import Button from '@button/Button';
import CircleFlower from '@icons/circleFlower.svg';
import PopupModal from '@popupModal/PopupModal';
import {TEXT_TYPE} from '@resources/Constants';
import strings from '@resources/Strings';
import Text from '@textView/TextView';
import React, {Component} from 'react';
import {View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class UpdateProfilePopup extends Component {
  render() {
    const {onClose, fetchFeed} = this.props;

    return (
      <PopupModal onBackdropPress={onClose}>
        <View style={{alignItems: 'center'}}>
          <CircleFlower style={{position: 'absolute'}} />

          <View style={{alignItems: 'center', marginTop: hp(1)}}>
            <Text bold type={TEXT_TYPE.MEDIUM} style={{textAlign: 'center'}}>
              Congratulations!
            </Text>
          </View>

          <Text
            light
            type={TEXT_TYPE.SMALL}
            style={{marginTop: hp(2), textAlign: 'center'}}>
            {strings?.jobApplySuccess}
          </Text>

          <Button
            containerStyle={{
              marginTop: hp(4),
              marginBottom: hp(2),
            }}
            onPress={() => {
              onClose();
            }}
            title={'Ok'}
            titleStyle={{paddingHorizontal: 10}}
          />
        </View>
      </PopupModal>
    );
  }
}
