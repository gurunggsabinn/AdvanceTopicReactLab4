// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import EventListScreen from './screens/EventListScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import AddEditEventScreen from './screens/AddEditEventScreen';
import FavoriteEventsScreen from './screens/FavoriteEventsScreen';

const Stack = createStackNavigator();

function App() {
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Event Org">
              <Stack.Screen name="Event Org" component={AuthScreen} />
              <Stack.Screen name="EventList" component={EventListScreen} />
              <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
              <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} />
              <Stack.Screen name="FavoriteEvents" component={FavoriteEventsScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;