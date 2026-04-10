import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CreateWorkout, Workout } from "@/components/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const apiUrl = process.env.EXPO_PUBLIC_API_HOST;

type CreateWorkoutModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (workout: Workout) => void;
};

const CreateWorkoutModal = ({
  visible,
  onClose,
  onCreate,
}: CreateWorkoutModalProps) => {
  const [createdWorkout, setCreatedWorkout] = useState({
    name: "",
    userId: 1, //TODO: get user id from auth once feature is implemented
    exercises: [],
  });
  const [selectedExercise, setSelectedExercise] = useState("");

  const createWorkout = async () => {
    const ids = selectedExercise
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    const workoutToSave: CreateWorkout = {
      ...createdWorkout,
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
      setCreatedWorkout({ name: "", userId: 1, exercises: [] });
      setSelectedExercise("");
      onCreate(savedWorkout);
    } catch (err) {
      console.error("Failed to create workout", err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-back" size={28} color="#f6f6f6" />
        </TouchableOpacity>
        <ThemedText type="title">Workout Details</ThemedText>
        <TextInput
          placeholder="Workout Name"
          value={createdWorkout.name}
          onChangeText={(text) =>
            setCreatedWorkout((prev) => ({ ...prev, name: text }))
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
  );
};

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

export default CreateWorkoutModal;
