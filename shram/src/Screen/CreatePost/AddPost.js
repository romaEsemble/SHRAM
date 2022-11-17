import localStyles from '@createPost/CreatePostStyles';
import Input from '@editText/EditText';
import {useInput} from '@editText/EditTextHook';
import LibraryIcon from '@icons/AddVideoIcon';
import ClickCameraIcon from '@icons/ClickCameraIcon';
import PhotoIcon from '@icons/PhotoIcon';
import TypeIcon from '@icons/TypeIcon';
import VideoIcon from '@icons/VideoIcon';
import AddVideoIcon from '@icons/YellowVideoicon';
import Model from '@model/Model';
import {NAVIGATION_CREATE_POST} from '@navigation/NavigationKeys';
import {SAVE_POST_DATA} from '@redux/Types';
import {INPUT_TYPE_OTHER} from '@resources/Constants';
import {nonEmpty} from '@resources/Validate';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import {showSnackBar} from '@utils/Util';
import React, {useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import strings from '@resources/Strings';

export default function AddPost({navigation}) {
  const [modelView, setModelView] = useState(true);
  const [mediaPath, setMediaPath] = useState('');
  const [mediaType, setMediaType] = useState('');

  const dispatch = useDispatch();

  const {PostData} = useSelector((state) => state.CreatePostReducer);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setModelView(true);
    });
  }, [navigation]);

  const {
    value: postTitle,
    bind: postTitleBind,
    checkValidation: CheckPostTitleValidation,
  } = useInput('', INPUT_TYPE_OTHER, nonEmpty, strings?.invalid);
  const {
    value: postDescription,
    bind: postDescriptionBind,
    checkValidation: CheckPostDescriptionValidation,
  } = useInput('', INPUT_TYPE_OTHER, nonEmpty, strings?.invalidDescription);

  const setPostData = () => {
    Keyboard.dismiss();
    if (CheckPostTitleValidation()) return false;
    else if (mediaPath === null) {
      showSnackBar(strings?.takePhotoVideo, error);
    }
    let data = {
      title: postTitle,
      des: postDescription,
      mediaType,
      mediaPath,
    };
    dispatch({type: SAVE_POST_DATA, payload: {data}});
    setModelView(false);
    navigation.navigate(NAVIGATION_CREATE_POST);
  };
  const openCamera = () => {
    Keyboard.dismiss();

    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
      useFrontCamera: true,
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          throw Error(strings?.imageSizeLimit);
        }
        setMediaPath(image.path);
        setMediaType(image.mime);
      })
      .catch((e) => {
        showSnackBar(e, 'error');
      });
  };

  const openVideo = () => {
    Keyboard.dismiss();

    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          throw Error('Image cannot be greater than 5 mb');
        }
        setMediaPath(image.path);
        setMediaType(image.mime);
      })
      .catch((e) => {
        showSnackBar(e.message, 'error');
      });
  };

  const selectFromLibrary = () => {
    Keyboard.dismiss();

    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then((image) => {
        if ((image.size / 1048576).toFixed(2) > 5) {
          throw Error('Image cannot be greater than 5 mb');
        }
        // console.log('Media Type Path', image);
        setMediaPath(image.path);
        setMediaType(image.mime);
      })
      .catch((e) => {
        showSnackBar(e.message, 'error');
      });
  };
  const {inputContainerStyle} = localStyles;
  return (
    <View style={{flex: 1}}>
      <Model
        isVisible={modelView}
        onBackdropPress={() => {
          setModelView(false);
          navigation.goBack();
          // navigation.navigate(NAVIGATION_ADHIKAR);
        }}
        overlayStyle={{minHeight: 500}}>
        <View style={{borderRadius: 5, flex: 1, margin: 10}}>
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => setPostData()}
              style={{
                margin: 5,
                borderWidth: 1,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 5,
                backgroundColor: '#FFC003',
                width: 100,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: '#777171',
                }}>
                {strings?.post}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              margin: 5,
              width: '100%',
            }}>
            <View
              style={{
                width: '20%',
                padding: 10,
                alignItems: 'center',
              }}>
              <TypeIcon />
            </View>
            <View style={{width: '70%', marginHorizontal: 5}}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#777171',
                    marginBottom: 5,
                  }}>
                  Title
                </Text>
                <Input
                  {...postTitleBind}
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={{
                    fontSize: 16,
                    marginHorizontal: 5,
                    color: '#3D3D3D',
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#777171',
                    marginBottom: 5,
                  }}>
                  {strings?.description}
                </Text>
                <Input
                  {...postDescriptionBind}
                  multiLine
                  inputContainerStyle={inputContainerStyle}
                  inputStyle={{
                    fontSize: 16,
                    marginHorizontal: 5,
                    color: '#3D3D3D',
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              margin: 5,
              width: '100%',
            }}>
            <View
              style={{
                width: '20%',
                padding: 10,
                alignItems: 'center',
              }}>
              <PhotoIcon />
            </View>
            <TouchableOpacity
              onPress={() => openCamera()}
              style={{
                width: '40%',
                margin: 5,
                borderWidth: 3,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ClickCameraIcon width={30} height={30} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#777171',
                  margin: 5,
                }}>
                {strings?.createNew}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              margin: 5,
              width: '100%',
            }}>
            <View
              style={{
                width: '20%',
                padding: 10,
                alignItems: 'center',
              }}>
              <VideoIcon width={45} height={45} />
            </View>
            <TouchableOpacity
              onPress={() => openVideo()}
              style={{
                width: '30%',
                margin: 5,
                borderWidth: 3,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AddVideoIcon width={40} height={40} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#777171',
                  margin: 5,
                }}>
                {strings?.create}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectFromLibrary()}
              style={{
                width: '40%',
                margin: 5,
                borderWidth: 3,
                borderColor: '#FFC003',
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: '30%'}}>
                <LibraryIcon width={40} height={40} />
              </View>
              <View style={{width: '70%'}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#777171',
                    margin: 5,
                  }}>
                  Add From Library
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {mediaPath ? (
            <Text
              style={{
                fontSize: 14,
                color: '#777171',
                margin: 5,
                alignSelf: 'center',
              }}>
              One Video Selected
            </Text>
          ) : null}
        </View>
      </Model>
    </View>
  );
}
