import {Alert, Vibration} from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';

import {Audio} from 'expo-av';

const channelId = 'Default id';
const channelName = 'Default name';
const RadioUrls = {
  'Ретро FM': 'http://retroserver.streamr.ru:8043/retro256.mp3',
  'Русское Радио': 'https://str.pcradio.ru/russkoe_vk-hi',
  'Русский Рок': 'https://str.pcradio.ru/Russkij_Razmer-hi',
  'Record Chill-Out': 'https://str.pcradio.ru/record_chillout-hi',
  'Radio Monte Carlo': 'https://str.pcradio.ru/montecarlo_moscow-hi',
};
const playbackInstance = new Audio.Sound();

async function alarmClockNotification(type, detail) {
  const {notification, pressAction} = detail;

  const source = {uri: RadioUrls[notification.data.radioName]};
  if (type === EventType.DELIVERED) {
    console.log('начало вибрации');
    Vibration.vibrate(1000, true);
    console.log(notification);
    try {
      await playbackInstance.loadAsync(source);
      await playbackInstance.playAsync();
      Alert.alert(
        'AlarmClock',
        'Press STOP to stop Alarm',
        [
          {
            text: 'Stop',
            onPress: async () => {
              try {
                await playbackInstance.stopAsync();
                await playbackInstance.unloadAsync();
              } catch (err) {
                console.log(err);
              }
            },
            style: 'cancel',
          },
        ],
        {},
      );
    } catch (err) {
      console.log(err);
    }
  }
}

async function triggerNotification(
  AlarmClockID,
  description,
  radio,
  timering,
  onoff,
) {
  if (onoff) {
    timering = timering.setSeconds(0);
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: +timering,
      repeatFrequency: RepeatFrequency.DAILY,
    };
    const channelID = await notifee.createChannel({
      id: channelId,
      name: channelName,
      importance: AndroidImportance.HIGH,
      NotificationManager: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
    try {
      await notifee.createTriggerNotification(
        {
          id: AlarmClockID,
          title: 'Alarm Clock',
          data: {radioName: radio.toString()},
          body: description,
          badge: true,
          android: {
            channelId: channelID,
            importance: AndroidImportance.HIGH,
            NotificationManager: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            actions: [
              {
                title: 'Open',
                pressAction: {
                  id: 'open',
                  launchActivity: 'default',
                },
              },
            ],
          },
        },
        trigger,
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    Vibration.cancel();
    console.log('конец вибрации');
    try {
      await playbackInstance.stopAsync();
      await playbackInstance.unloadAsync();
    } catch (err) {
      console.log(err);
    }
    await notifee.cancelNotification(AlarmClockID);
  }
}

export {alarmClockNotification, triggerNotification};
