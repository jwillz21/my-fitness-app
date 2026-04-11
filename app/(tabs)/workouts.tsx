import CreateWorkoutModal from "@/components/modals/create-workout";
import WorkoutModal from "@/components/modals/view-workout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Workout } from "@/components/types";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_HOST;

export default function WorkoutScreen() {
    const [modalCreateWorkoutVisible, setModalCreateWorkoutVisible] = useState(false);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
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
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Workouts</ThemedText>
                <Pressable
                    onPress={() => setModalCreateWorkoutVisible(true)}
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
                    <TouchableOpacity style={styles.card} onPress={() => openWorkoutModal(item)}>
                        <ThemedText type="subtitle">{item.name}</ThemedText>
                        <ThemedText type="default">Exercises: {item.exercises.length}</ThemedText>
                    </TouchableOpacity>
                )}
            />
            <WorkoutModal
                workout={selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
                onDelete={(workout) => {
                    if (!workout) return;
                    setWorkouts((prev) => prev.filter((w) => w.id !== workout.id));
                    setSelectedWorkout(null);
                }}
            />
            <CreateWorkoutModal
                visible={modalCreateWorkoutVisible}
                onClose={() => setModalCreateWorkoutVisible(false)}
                onCreate={(workout) => {
                    setWorkouts((prev) => [...prev, workout]);
                    setModalCreateWorkoutVisible(false);
                }}
            />
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
