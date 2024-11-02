// import React from 'react';
// import { Text, View } from 'react-native';

// interface Props {}

// interface State {}

// class TriggerNotification extends React.Component<Props, State> {
//   render() {
//     return (
//       <View>
//         <Text> textInComponent </Text>
//       </View>
//     );
//   }
// }

// export default TriggerNotification;

import React from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation<any>();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{fontSize: 24}}
        onPress={() => navigation.navigate('Details')}>
        textInComponent{' '}
      </Text>
    </View>
  );
}
