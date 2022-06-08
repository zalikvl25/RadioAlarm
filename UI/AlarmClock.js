import {Button, Switch, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {
  addAlarmClock,
  retriveNewAlarmClockID,
  updateAlarmClock,
} from '../components/storage';

import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {openDatabase} from 'react-native-sqlite-storage';
import {triggerNotification} from '../components/notifications';

const db = openDatabase({
  name: 'alarmClocks',
});

const AlarmClockScreen = navigation => {
  const [alarmClockID, alarmClockIDSet] = useState(0);
  const [description, descriptionSet] = React.useState('alarm');
  const [timering, timeringSet] = useState(new Date());
  const [alarmClockOnOff, alarmClockOnOffSet] = useState(true);
  const [alarmClockRadio, alarmClockRadioSet] = useState('Ретро FM');
  const [isUpdateRecord, isUpdateRecordSet] = useState(false);

  retriveNewAlarmClockID(db, alarmClockIDSet);

  if (navigation.route.params) {
    const item = navigation.route.params.item;
    alarmClockIDSet(item.id);
    descriptionSet(item.description);
    alarmClockRadioSet(item.music);
    alarmClockOnOffSet(Boolean(item.onoff));
    timeringSet(new Date(item.timering));
    isUpdateRecordSet(true);
    navigation.route.params = false;
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        padding: 5,
      }}>
      <View style={{alignItems: 'center'}}>
        <Text>Enter AlarmClock description (max 100 chars)</Text>
        <TextInput
          style={{padding: 10}}
          maxLength={100}
          onChangeText={text => descriptionSet(text)}
          value={description}></TextInput>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text>Select AlarmClock time notification</Text>
        <DatePicker
          style={{backgroundColor: 'transparent'}}
          date={timering}
          onDateChange={timeringSet}
          androidVariant="nativeAndroid"
          locale="ru"
          is24hourSource="locale"
          mode="time"
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text>Enable notification?</Text>
        <Switch
          trackColor={{false: '#767577', true: 'grey'}}
          thumbColor={alarmClockOnOff ? 'green' : '#f4f3f4'}
          value={alarmClockOnOff}
          onValueChange={alarmClockOnOffSet}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text>Pick a radio to notify</Text>
        <Picker
          selectedValue={alarmClockRadio}
          style={{width: '50%'}}
          onValueChange={(itemValue, itemIndex) =>
            alarmClockRadioSet(itemValue)
          }>
          <Picker.Item label="Ретро FM" value="Ретро FM" />
          <Picker.Item label="Русское Радио" value="Русское Радио" />
          <Picker.Item label="Русский Рок" value="Русское Рок" />
          <Picker.Item label="Record Chill-Out" value="Record Chill-Out" />
          <Picker.Item label="Radio Monte Carlo" value="Radio Monte Carlo" />
        </Picker>
      </View>

      <View>
        <Button
          title="Save alarm"
          onPress={() => {
            if (!isUpdateRecord) {
              addAlarmClock(
                db,
                +alarmClockID,
                description,
                +timering,
                +alarmClockOnOff,
                alarmClockRadio,
              );
            } else {
              updateAlarmClock(
                db,
                +alarmClockID,
                description,
                +alarmClockOnOff,
                +timering,
                alarmClockRadio,
              );
            }
            triggerNotification(
              alarmClockID.toString(),
              description,
              alarmClockRadio,
              timering,
              Boolean(alarmClockOnOff),
            );
            navigation.navigation.navigate('Home', {refresh: true});
          }}
        />
      </View>
    </View>
  );
};

export {AlarmClockScreen};
