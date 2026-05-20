import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';

export function ActivitiesScreen() {
  return (
    <View style={styles.container}>
      <Text>Activities (Atividades)</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background } });
