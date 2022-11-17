import Mic from '@icons/mic.svg';
import Cross from '@icons/Cross.svg';
import SearchIcon from '@icons/Search.svg';
import SearchWhiteIcon from '@icons/SearchWhite.svg';
import TouchableOpacity from '@touchable/TouchableOpacity';
// import PropTypes from 'prop-types';
import PropTypes from 'deprecated-react-native-prop-types';
import React, {Component} from 'react';
import {ActivityIndicator, TextInput, View, Keyboard} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import VoiceRecognitionPopup from '@searchBar/VoiceRecognitionPopup';
import {sendBtnClickToAnalytics} from '@utils/Util';

class SearchBars extends Component {
  constructor(props) {
    super(props);

    this.state = {showVoicePopup: false, searchText: ''};
    this.inputBox = React.createRef();
  }
  // componentDidMount() {
  //   this.inputBox.current.focus();
  // }
  onClearText = () => {
    this.inputBox.current && this.inputBox.current.clear();

    const {onChangeText, onClearText} = this.props;
    if (onChangeText) {
      onClearText && onClearText();
      onChangeText && onChangeText('');
      this.setState({searchText: ''});
    } else this.setState({searchText: ''});
  };

  onChangeText = (input) => {
    const {onChangeText} = this.props;
    console.log('INput is ', input);

    if (onChangeText) {
      onChangeText(input);
      this.setState({searchText: input});
    } else this.setState({searchText: ''});
  };

  onSearchPress = (text = null) => {
    Keyboard.dismiss();
    const {onSearchPress, searchValue} = this.props;
    if (onSearchPress) {
      if (text == null) {
        // console.log('In if search');
        onSearchPress(
          this.state.searchText !== '' ? this.state.searchText : searchValue,
        );
      } else {
        // console.log('In else search', text);
        onSearchPress(text);
      }
    }
    sendBtnClickToAnalytics(
      `Searching`,
      this.state.searchText !== '' ? this.state.searchText : searchValue,
    );
  };

  render() {
    const {
      placeholder,
      showSearchIcon,
      showMic,
      searchValue,
      showLoader,
      style,
    } = this.props;
    const {searchText} = this.state;
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
              borderRadius: 10,
              marginHorizontal: wp(2),
              marginTop: 5,
            },
            style,
          ]}>
          {showSearchIcon && (
            <View style={{paddingLeft: wp(2), paddingRight: wp(2)}}>
              <SearchIcon width={wp(5)} height={wp(5)} />
            </View>
          )}
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
            placeholder={placeholder}
            value={searchValue || searchText}
            onChangeText={this.onChangeText}
          />
          {showLoader && <ActivityIndicator size="small" />}
          {/* {showMic && (searchValue === '' || searchText === '') && ( */}
          <TouchableOpacity
            onPress={() => {
              this.setState({showVoicePopup: true});
              sendBtnClickToAnalytics('Mic Icon');
            }}
            style={{paddingHorizontal: wp(2)}}>
            <Mic width={wp(5)} height={wp(5)} />
          </TouchableOpacity>
          {/* )} */}
          {(searchValue !== '' || searchText !== '') && (
            <TouchableOpacity
              onPress={() => this.onClearText()}
              style={{paddingHorizontal: wp(2)}}>
              <Cross width={wp(5)} height={wp(5)} />
            </TouchableOpacity>
          )}
          {(searchValue !== '' || searchText !== '') && (
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
            onClose={() => {
              this.setState({showVoicePopup: false});
            }}
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

export default SearchBars;
