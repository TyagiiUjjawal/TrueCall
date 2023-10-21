import React, {useState} from 'react';
import {
  View,
  Button,
  PermissionsAndroid,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import CallLogs from 'react-native-call-log';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const MakePhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const makePhoneCall = async () => {
    const permissionStatus = await request(PERMISSIONS.ANDROID.CALL_PHONE);

    if (permissionStatus === RESULTS.GRANTED) {
      SendIntentAndroid.sendPhoneCall(phoneNumber);
    } else {
      console.error('Permission denied for making phone calls');
    }
  };

  const checkCallHistory = async () => {
    const permissionStatus = await request(PERMISSIONS.ANDROID.READ_CALL_LOG);

    if (permissionStatus === RESULTS.GRANTED) {
      CallLogs.load(5) // Load the last 5 call logs
        .then(callLogs => {
          console.log('Call History:', callLogs);
        })
        .catch(error => {
          console.error('Error loading call history:', error);
        });
    } else {
      console.error('Permission denied for reading call logs');
    }
  };

  const handleButtonPress = number => {
    setPhoneNumber(phoneNumber + number);
  };

  const renderDialpadButton = number => (
    <TouchableOpacity
      style={styles.dialpadButton}
      onPress={() => handleButtonPress(number)}>
      <Text>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        style={styles.phoneNumberInput}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      <View style={styles.dialpad}>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('1')}
          {renderDialpadButton('2')}
          {renderDialpadButton('3')}
        </View>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('4')}
          {renderDialpadButton('5')}
          {renderDialpadButton('6')}
        </View>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('7')}
          {renderDialpadButton('8')}
          {renderDialpadButton('9')}
        </View>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('*')}
          {renderDialpadButton('0')}
          {renderDialpadButton('#')}
        </View>
      </View>
      <Button title="Make Phone Call" onPress={makePhoneCall} />
      <Button title="Check Call History" onPress={checkCallHistory} />
    </View>
  );
};

const styles = StyleSheet.create({
  phoneNumberInput: {
    borderWidth: 1,
    color: 'black',
    marginBottom: 10,
    padding: 8,
  },
  dialpad: {
    flexDirection: 'column',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialpadButton: {
    width: 60,
    height: 60,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default MakePhone;
