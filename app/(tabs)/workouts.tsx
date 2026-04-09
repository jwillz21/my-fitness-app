import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';


type Exercise = {
  id: number;
  name: string;
  muscles: { type: string; muscle: { id: number; name: string } }[];
  equipment: { equipment: { id: number; name: string } }[];
};

type WorkoutExercise = {
  id: number;
  orderIndex: number;
  exercise: Exercise;
};

type Workout = {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
};

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch('http://10.0.0.122:4000/workouts');
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to load workouts', err);
      }
    };

    fetchWorkouts();
  }, []);

  const openModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
    setModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Workouts</ThemedText>
        
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
            <ThemedText type="subtitle">{item.name}</ThemedText>
            <ThemedText type="default">Exercises: {item.exercises.length}</ThemedText>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <ThemedView style={styles.modalContainer}>
            <TouchableOpacity onPress={closeModal}>
                <Ionicons name="chevron-back" size={28} color="#f6f6f6" />
            </TouchableOpacity>
          <FlatList
            data={selectedWorkout?.exercises || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.exerciseRow}>
                <ThemedText type="subtitle">{item.exercise.name}</ThemedText>
                <ThemedText type="default">
                  Muscles: {item.exercise.muscles.map((m) => m.muscle.name).join(', ')}
                </ThemedText>
                <ThemedText type="default">
                  Equipment: {item.exercise.equipment.map((e) => e.equipment.name).join(', ')}
                </ThemedText>
              </View>
            )}
          />
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { paddingHorizontal: 16, marginBottom: 16 },
  cardsContainer: { paddingHorizontal: 16, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  modalContainer: { flex: 1, padding: 16, paddingTop: 40 },
  exerciseRow: { marginBottom: 12, padding: 8, borderRadius: 8 },
});