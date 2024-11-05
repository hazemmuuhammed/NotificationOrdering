import React from 'react';
import {View, Button} from 'react-native';
import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation<any>();

  async function onDisplayNotification() {
    try {
      // Request permissions (required for iOS)
      const permissionStatus = await notifee.requestPermission();
      console.log('Permission status:', permissionStatus);

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      console.log('Channel created with ID:', channelId);

      // Display a notification
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId,
          smallIcon: 'ic_launcher', // Ensure this icon exists in your res/drawable directory
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
      });
      console.log('Notification displayed');
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        title="Display Notification"
        onPress={() => onDisplayNotification()}
      />
    </View>
  );
}
