import {AlarmClockScreen} from './UI/AlarmClock';
import {HomeScreen} from './UI/Home';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
              
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'MyAlarm App'}}
        />
        <Stack.Screen name="AlarmClock" component={AlarmClockScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
