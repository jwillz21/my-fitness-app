import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Workout } from "@/components/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type WorkoutModalProps = {
    workout: Workout | null;
    onClose: () => void;
    onDelete: (workout: Workout | null) => void;
};

const WorkoutModal = ({ workout, onClose, onDelete }: WorkoutModalProps) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_HOST;

    const deleteWorkout = async (id: number) => {
        try {
            await fetch(`${apiUrl}/workouts/${id}`, { method: "DELETE" });
            onDelete(workout);
            onClose();
        } catch (err) {
            console.error("Failed to delete workout", err);
        }
    };

    return (
        <Modal visible={workout !== null} animationType="slide" onRequestClose={onClose}>
            <ThemedView style={styles.modalContainer}>
                <TouchableOpacity onPress={onClose} style={{ marginBottom: 16 }}>
                    <Ionicons name="chevron-back" size={28} color="#f6f6f6" />
                </TouchableOpacity>

                {workout && (
                    <>
                        <ScrollView style={{ flex: 1 }}>
                            {workout.exercises.map((item) => (
                                <View key={item.id} style={styles.exerciseRow}>
                                    <ThemedText type="subtitle">{item.exercise.name}</ThemedText>
                                    <ThemedText type="default">
                                        Muscles:{" "}
                                        {item.exercise.muscles.map((m) => m.muscle.name).join(", ")}
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
                            onPress={() => deleteWorkout(workout.id)}
                            style={styles.deleteButton}
                        >
                            <ThemedText style={{ color: "#fff", textAlign: "center" }}>
                                Delete Workout
                            </ThemedText>
                        </Pressable>
                    </>
                )}
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
    deleteButton: {
        backgroundColor: "#ff4444",
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
});

export default WorkoutModal;
