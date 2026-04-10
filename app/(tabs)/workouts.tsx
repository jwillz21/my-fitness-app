import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

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

type NewWorkout = {
  name: string;
  userId: number;
  exercises: { exerciseId: number; orderIndex: number }[];
};

const apiUrl = process.env.EXPO_PUBLIC_API_HOST;

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    userId: 1, //TODO: get user id from auth once feature is implemented
    exercises: [],
  });
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [modalWorkoutVisible, setModalWorkoutVisible] = useState(false);
  const [modalNewWorkoutVisible, setModalNewWorkoutVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${apiUrl}/workouts?userId=1`); // TODO: get userId from auth once feature is implemented
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts", err);
      }
    };

    fetchWorkouts();
  }, []);

  const openWorkoutModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModalWorkoutVisible(true);
  };

  const closeModal = () => {
    if (modalNewWorkoutVisible == true) {
      setModalNewWorkoutVisible(false);
    }
    if (modalWorkoutVisible == true) {
      setSelectedWorkout(null);
      setModalWorkoutVisible(false);
    }
  };

  const createWorkout = async () => {
    // parse IDs when saving
    const ids = selectedExercise
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    const workoutToSave: NewWorkout = {
      ...newWorkout,
      exercises: ids.map((id, index) => ({
        exerciseId: id,
        orderIndex: index,
      })),
    };
    try {
      const res = await fetch(`${apiUrl}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutToSave),
      });

      const savedWorkout = await res.json();
      setNewWorkout({ name: "", userId: 1, exercises: [] });
      setSelectedExercise("");
      setModalNewWorkoutVisible(false);

      // optionally update workouts list
      setWorkouts((prev) => [...prev, savedWorkout]);
    } catch (err) {
      console.error("Failed to create workout", err);
    }
  };

  const deleteWorkout = async (id: number) => {
    try {
      await fetch(`${apiUrl}/workouts/${id}`, { method: "DELETE" });
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      closeModal();
    } catch (err) {
      console.error("Failed to delete workout", err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Workouts</ThemedText>
        <Pressable
          onPress={() => setModalNewWorkoutVisible(true)}
          style={{ padding: 8, borderRadius: 8 }}
        >
          <ThemedText>+</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openWorkoutModal(item)}
          >
            <ThemedText type="subtitle">{item.name}</ThemedText>
            <ThemedText type="default">
              Exercises: {item.exercises.length}
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalWorkoutVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <ThemedView style={styles.modalContainer}>
          {/* Back button */}
          <TouchableOpacity onPress={closeModal} style={{ marginBottom: 16 }}>
            <Ionicons name="chevron-back" size={28} color="#f6f6f6" />
          </TouchableOpacity>

          {selectedWorkout && (
            <>
              <ScrollView
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ flex: 1 }}
              >
                {selectedWorkout.exercises.map((item) => (
                  <View key={item.id} style={styles.exerciseRow}>
                    <ThemedText type="subtitle">
                      {item.exercise.name}
                    </ThemedText>
                    <ThemedText type="default">
                      Muscles:{" "}
                      {item.exercise.muscles
                        .map((m) => m.muscle.name)
                        .join(", ")}
                    </ThemedText>
                    <ThemedText type="default">
                      Equipment:{" "}
                      {item.exercise.equipment
                        .map((e) => e.equipment.name)
                        .join(", ")}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>

              <Pressable
                onPress={() => deleteWorkout(selectedWorkout.id)}
                style={{
                  padding: 12,
                  backgroundColor: "#FF3B30",
                  borderRadius: 8,
                  marginTop: 16,
                  marginBottom: 32,
                }}
              >
                <ThemedText style={{ color: "#fff", textAlign: "center" }}>
                  Delete Workout
                </ThemedText>
              </Pressable>
            </>
          )}
        </ThemedView>
      </Modal>

      <Modal
        visible={modalNewWorkoutVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <ThemedView style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal}>
            <Ionicons name="chevron-back" size={28} color="#f6f6f6" />
          </TouchableOpacity>
          <ThemedText type="title">Workout Details</ThemedText>
          <TextInput
            placeholder="Workout Name"
            value={newWorkout.name}
            onChangeText={(text) =>
              setNewWorkout((prev) => ({ ...prev, name: text }))
            }
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#fff",
              marginBottom: 16,
            }}
          />
          <TextInput
            placeholder="Exercise IDs (comma separated)"
            value={selectedExercise}
            onChangeText={setSelectedExercise}
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#fff",
              marginBottom: 16,
            }}
          />
          <Pressable
            onPress={createWorkout}
            style={{
              padding: 12,
              backgroundColor: "#007AFF",
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <ThemedText style={{ color: "#fff" }}>Save Workout</ThemedText>
          </Pressable>
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
    width: "100%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  modalContainer: { flex: 1, padding: 16, paddingTop: 40 },
  exerciseRow: { marginBottom: 12, padding: 8, borderRadius: 8 },
});
