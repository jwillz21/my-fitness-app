import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';



export default function HistoryScreen() {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    return (
        <ScrollView style={styles.scrollView}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Workout</ThemedText>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 8,
    marginTop: 100,
    marginLeft: 20,
  },
  scrollView: {
    backgroundColor: '#121212',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});