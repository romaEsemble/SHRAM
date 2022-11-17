import Cross from '@icons/Cross.svg';
import Mic from '@icons/mic.svg';
import SearchIcon from '@icons/Search.svg';
import SearchWhiteIcon from '@icons/SearchWhite.svg';
import VoiceRecognitionPopup from '@searchBar/VoiceRecognitionPopup';
import TouchableOpacity from '@touchable/TouchableOpacity';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Keyboard, TextInput, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

class SearchBars extends Component {
  constructor(props) {
    super(props);
    this.state = {showVoicePopup: false};
    this.inputBox = React.createRef();
  }
  // componentDidMount() {
  //   this.inputBox.current.focus();
  // }

  onClearText = () => {
    this.inputBox.current && this.inputBox.current.clear();
    this.props.updateSearchValue('Search', {clear: true});
    const {onSearchPress} = this.props;
    if (onSearchPress) {
      onSearchPress('');
    }
  };

  onChangeText = (input) => {
    this.props.updateSearchValue('Search', {value: input});
  };

  onSearchPress = (serachTextFromVoice = null) => {
    Keyboard.dismiss();
    console.log('Serach value', this.props.searchValue, serachTextFromVoice);
    const {onSearchPress} = this.props;
    if (onSearchPress && this.props.searchValue != '') {
      onSearchPress(this.props.searchValue);
      sendBtnClickToAnalytics(`Searching`, this.props.searchValue);
    }
    if (serachTextFromVoice) {
      onSearchPress(serachTextFromVoice);
      sendBtnClickToAnalytics(`Searching`, serachTextFromVoice);
    }
  };

  render() {
    return (
      <>
        <View
          style={[
            {
              height: hp(7),
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              elevation: 8,
              borderRadius: 4,
              marginHorizontal: wp(2),
              marginTop: 5,
            },
          ]}>
          {/* </TouchableOpacity> */}
          <TextInput
            ref={this.inputBox}
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: '600',
              color: '#000',
              marginLeft: wp(2),
            }}
            placeholder={strings?.search}
            value={this.props.searchValue}
            onChangeText={this.onChangeText}
          />
          {/* {showMic && (searchValue === '' || searchText === '') && ( */}
          <TouchableOpacity
            onPress={() => this.setState({showVoicePopup: true})}
            style={{paddingHorizontal: wp(2)}}>
            <Mic width={wp(5)} height={wp(5)} />
          </TouchableOpacity>
          {/* )} */}
          {this.props?.searchValue !== '' && (
            <TouchableOpacity
              onPress={() => this.onClearText()}
              style={{paddingHorizontal: wp(2)}}>
              <Cross width={wp(5)} height={wp(5)} />
            </TouchableOpacity>
          )}
          {this.props?.searchValue !== '' && (
            <TouchableOpacity
              onPress={() => this.onSearchPress()}
              style={{
                height: '100%',
                paddingHorizontal: wp(2),
                backgroundColor: '#4B79D8',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
              }}>
              <View style={{paddingHorizontal: wp(2)}}>
                <SearchWhiteIcon width={wp(5)} height={wp(5)} fill="#fff" />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {this.state.showVoicePopup && (
          <VoiceRecognitionPopup
            onDone={(convertedText) => {
              convertedText &&
                this.setState({showVoicePopup: false}, () => {
                  this.onChangeText(convertedText);
                  // console.log('Serach start');
                  this.onSearchPress(convertedText);
                });
            }}
            // onClose={() => {
            //   this.setState({showVoicePopup: false});
            // }}
          />
        )}
      </>
    );
  }
}

SearchBars.propTypes = {
  placeholder: PropTypes.string,
  showSearchIcon: PropTypes.bool,
  showCross: PropTypes.bool,
  searchValue: PropTypes.string,
  showLoader: PropTypes.bool,
  style: PropTypes.object,
};

SearchBars.defaultProps = {
  placeholder: undefined,
  showSearchIcon: false,
  showCross: true,
  searchValue: '',
  showLoader: true,
  style: {},
};

function mapDispatchToProps(dispatch) {
  return {
    updateSearchValue: (type, payload) =>
      dispatch({type: type, payload: payload}),
  };
}

function mapStateToProps(state) {
  return {
    searchValue: state.RojgarReducer.searchValue,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBars);

// export default SearchBars;
