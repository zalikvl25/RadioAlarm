import {Alert, FlatList, Pressable, Switch, Text, View} from 'react-native';
import {
  createAlarmsTable,
  deleteAlarmClock,
  retrieveAlarmsClocks,
  updateAlarmClock,
} from '../components/storage';
import {useEffect, useState} from 'react';

import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {alarmClockNotification} from '../components/notifications';
import notifee from '@notifee/react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {triggerNotification} from '../components/notifications';

const db = openDatabase({
  name: 'alarmClocks',
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  alarmClockNotification(type, detail);
});

notifee.onForegroundEvent(async ({type, detail}) => {
  alarmClockNotification(type, detail);
});

const HomeScreen = ({navigation, route}) => {
  const [alarmClocks, setAlarmClocks] = useState([]);
  
  function loadAlarmClocks(db, setAlarmClocks) {
    createAlarmsTable(db);
    retrieveAlarmsClocks(db, setAlarmClocks);
  }
  useEffect(() => {
    loadAlarmClocks(db, setAlarmClocks);
  }, []);
  if (route.params) {
    if (route.params.refresh) {
      loadAlarmClocks(db, setAlarmClocks);
      route.params.refresh = false;
    }
  }
  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('AlarmClock', {item: item})}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: 'black',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'column',
              padding: 5,
              alignContent: 'center',
              minWidth: 170,
            }}>
            <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>
              {new Date(item.timering).toLocaleTimeString().substr(0, 5)}
            </Text>
            <Text style={{color: 'black', fontSize: 20}}>{item.music}</Text>
          </View>

          <Switch
            trackColor={{false: '#767577', true: 'grey'}}
            thumbColor={item.onoff ? 'green' : '#f4f3f4'}
            value={item.onoff !== 0}
            onChange={() => {
              updateAlarmClock(
                db,
                item.id,
                item.description,
                !item.onoff,
                item.timering,
                item.music,
              );
              triggerNotification(
                item.id.toString(),
                item.description,
                item.music,
                new Date(item.timering),
                !Boolean(item.onoff),
              );
            }}
            onValueChange={() => retrieveAlarmsClocks(db, setAlarmClocks)}
          />
          <Pressable
            style={{justifyContent: 'center'}}
            onPress={() => {
              Alert.alert('Delete alarm', 'Are you shure?', [
                {
                  key: 'Yes',
                  text: 'Yes',
                  onPress: () => {
                    deleteAlarmClock(db, item.id, setAlarmClocks);
                    triggerNotification(
                      item.id.toString(),
                      item.description,
                      item.music,
                      new Date(item.timering),
                      false,
                    );
                  }
                },
                {
                  key: 'No',
                  text: 'Cancel',
                  onPress: () => console.log('Cancel button'),
                },
              ]);
            }}>
            <Ionicons name="close" size={40} color="red" />
          </Pressable>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <Pressable
        style={{
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('AlarmClock')}>
        <Ionicons name="add-circle-outline" size={40} color="red" />
      </Pressable>
      <FlatList data={alarmClocks} renderItem={renderItem} key={a => a.id} />
    </View>
  );
};

export {HomeScreen, db};
