import React from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Details() {
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
