import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Linking,
  PermissionsAndroid,
  PushNotificationIOS,
  Vibration,
} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import Sound from 'react-native-sound';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './feature/screens/Home';
import Details from './feature/screens/DetailsScreen';
import PushNotification from 'react-native-push-notification';

const Stack = createNativeStackNavigator();
const NAVIGATION_IDS = ['Home', 'Details'];

// Sound instance
let sound: Sound | null = null;

// Stop sound and vibration
const stopSoundAndVibration = () => {
  if (sound) {
    sound.stop();
    sound.release();
    sound = null; // Reset sound instance
  }
  Vibration.cancel(); // Stop vibration
};

// Create notification channel (Android)
const createNotificationChannel = async () => {
  PushNotification.createChannel(
    {
      channelId: 'my_channel_id', // Must match the ID defined in the native code
      channelName: 'My Notification Channel',
      channelDescription: 'Channel for app notifications',
      soundName: 'custom_notification_sound.mp3', // File name without path
      importance: 4, // HIGH
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`), // Log to check channel creation
  );
};

// Handle notification: Play sound, vibrate, and show alert if in the foreground
const handleNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  // Custom sound
  sound = new Sound('linging_phone.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.error('Failed to load sound:', error);
      return;
    }
    sound?.setNumberOfLoops(0); // Play once
    sound?.play(success => {
      if (!success) {
        console.error('Sound playback failed');
      }
    });
  });

  // Vibrate pattern
  Vibration.vibrate([500, 500], true);

  // Show alert if in foreground
  if (remoteMessage.notification) {
    Alert.alert(
      remoteMessage.notification.title || 'No Title',
      remoteMessage.notification.body || 'No Body',
      [
        {
          text: 'Stop',
          onPress: () => stopSoundAndVibration(),
        },
      ],
    );
  }
};

// Function to handle deep links
const buildDeepLinkFromNotificationData = ({data}: any) => {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  return navigationId === 'Home' ? 'myapp://home' : 'myapp://details';
};

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'Home',
      Details: 'Details',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') return url;

    const message = await messaging().getInitialNotification();
    return buildDeepLinkFromNotificationData(message?.data) || null;
  },
  subscribe({listener}: any) {
    const onReceiveURL = ({url}: any) => listener(url);
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received!', remoteMessage);
      handleNotification(remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received!', remoteMessage);
      handleNotification(remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          sound: 'linging_phone',
        },
      });
    });

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (url) {
        stopSoundAndVibration();
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
};

export default function App() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, stop sound and vibration
        stopSoundAndVibration();
      }
      appState.current = nextAppState;
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    const requestUserPermission = async () => {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM token:', token);
      }
    };

    requestUserPermission();
    createNotificationChannel();

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator animating />}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
