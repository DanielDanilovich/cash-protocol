import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [balance] = useState(0.0);
  const [address] = useState('CASH_...');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CASH</Text>
      <Text style={styles.balance}>{balance.toFixed(6)} CASH</Text>
      <Text style={styles.address}>{address}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.btnText}>Receive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 48, fontWeight: '900', letterSpacing: 8, marginBottom: 24 },
  balance: { fontSize: 42, fontWeight: '700', marginBottom: 12 },
  address: { fontSize: 12, fontFamily: 'monospace', marginBottom: 32 },
  actions: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#F6EE25', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 100 },
  btnText: { color: '#464650', fontWeight: '700' },
});
