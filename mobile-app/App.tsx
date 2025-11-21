import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CardListScreen from './screens/CardListScreen';
import CardDetailScreen from './screens/CardDetailScreen';
import { Card } from './types';

export type RootStackParamList = {
  CardList: undefined;
  CardDetail: { card: Card };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CardList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0066cc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="CardList"
          component={CardListScreen}
          options={{ title: 'Gundam Cards' }}
        />
        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={{ title: 'Card Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
