import PopupModal from '@popupModal/PopupModal';
import Voice from '@react-native-community/voice';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import strings from '@resources/Strings';
import {sendBtnClickToAnalytics} from '@utils/Util';

export default function TextToSpeech({onClose, onDone}) {
  const [started, setStarted] = useState('');
  const [results, setResults] = useState('');
  const [partialResults, setPartialResults] = useState('');

  useEffect(() => {
    function onSpeechStart(e) {
      setStarted('√');
    }
    function onSpeechEnd(e) {
      setStarted('X');
    }
    function onSpeechError(e) {
      setStarted('--');
    }
    function onSpeechResults(e) {
      setResults(e.value);
      if (e.value?.length > 0) {
        onDone(e.value[0]);
      } else {
        onClose();
      }
    }
    function onSpeechPartialResults(e) {
      console.log('onSpeechPartialResults: ', e);
      setPartialResults(e.value);
    }
    console.log('Start Prop up');
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    async function start() {
      await _startRecognizing();
    }

    start();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const _startRecognizing = async () => {
    setStarted('');
    setResults([]);
    setPartialResults([]);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setStarted('');
    setResults([]);
    setPartialResults([]);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <PopupModal onBackdropPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.instructions}>{strings?.startRecognition}</Text>
          <Text style={styles.instructions}>{started}</Text>
          <TouchableHighlight
            onPress={() => {
              _startRecognizing();
              sendBtnClickToAnalytics('Start Listening Mic');
            }}
            style={{marginVertical: 20}}>
            <Image
              style={styles.button}
              source={{
                uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png',
              }}
            />
          </TouchableHighlight>
          <Text
            style={{
              textAlign: 'center',
              color: '#B0171F',
              marginBottom: 10,
              fontWeight: '700',
            }}>
            {strings?.results}
          </Text>
          {/* {partialResults?.length > 0 && (
            <Text
              style={{
                textAlign: 'center',
                color: '#B0171F',
                marginBottom: 10,
                fontWeight: '700',
              }}>
              {partialResults[partialResults.length - 1]}
            </Text>
          )} */}
          {results?.length > 0 && (
            <Text
              style={{
                textAlign: 'center',
                color: '#B0171F',
                marginBottom: 10,
                fontWeight: '700',
              }}>
              {results[0]}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'space-between',
            }}>
            <TouchableHighlight
              onPress={() => {
                // if (partialResults?.length > 0) {
                //   onDone(partialResults[partialResults?.length - 1]);
                // } else {
                //   onClose();
                // }
                if (results?.length > 0) {
                  onDone(results[0]);
                } else {
                  onClose();
                }
                sendBtnClickToAnalytics('Done Listening Mic');
              }}
              style={{flex: 1, backgroundColor: 'green'}}>
              <Text style={styles.action}>{strings?.done}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                _cancelRecognizing();
                onClose();
                sendBtnClickToAnalytics('Cancel Listening Mic');
              }}
              style={{flex: 1, backgroundColor: 'red'}}>
              <Text style={styles.action}>{strings?.cancel}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </PopupModal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    marginTop: 30,
  },
});
