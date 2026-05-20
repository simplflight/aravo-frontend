import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { TopBar } from '../../../components/Header/TopBar';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <TopBar />
      <Text>Home (Resumo Diário)</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background } });
