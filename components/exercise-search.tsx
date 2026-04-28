import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Exercise } from "./types";

type ExerciseProps = {
    selectedExercises: Exercise[];
    setSelectedExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
    exerciseInputs: Record<number, { sets: number; reps: number }>;
    setExerciseInputs: React.Dispatch<
        React.SetStateAction<Record<number, { sets: number; reps: number }>>
    >;
};

const SearchExercises = ({
    selectedExercises,
    setSelectedExercises,
    exerciseInputs,
    setExerciseInputs,
}: ExerciseProps) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Exercise[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchSuggestions = async (text: string) => {
        if (!text) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        const res = await fetch(`http://localhost:4000/exercises/search?query=${text}`);
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
    };

    const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

    const handleChange = (text: string) => {
        setQuery(text);
        debouncedFetch(text);
    };

    const handleSelectExercise = (item: Exercise) => {
        if (selectedExercises.some((ex) => ex.id === item.id)) return;
        setSelectedExercises([...selectedExercises, item]);
        setQuery("");
        setSuggestions([]);
        setShowDropdown(false);
    };

    const handleRemoveExercise = (exercise: Exercise) => {
        setSelectedExercises(selectedExercises.filter((ex) => ex.id !== exercise.id));
        setExerciseInputs((prev) => {
            const newInputs = { ...prev };
            delete newInputs[exercise.id];
            return newInputs;
        });
    };

    return (
        <View>
            <View style={{ position: "relative" }}>
                <TextInput
                    value={query}
                    onChangeText={handleChange}
                    placeholder="Search exercises..."
                    style={styles.exerciseSearchInput}
                />

                {showDropdown && suggestions.length > 0 && (
                    <View style={styles.exerciseInputDropDown}>
                        {suggestions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleSelectExercise(item)}
                                style={{ padding: 10 }}
                            >
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <ScrollView style={styles.exerciseScrollContainer}>
                {selectedExercises.length === 0 && (
                    <Text style={styles.primaryText}>No exercises selected</Text>
                )}

                {selectedExercises.map((exercise) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                        <View>
                            <Text style={styles.primaryText}>{exercise.name}</Text>
                            <View style={styles.exerciseMetaWrapper}>
                                <Text style={styles.primaryText}>Sets:</Text>
                                <TextInput
                                    placeholder="0"
                                    keyboardType="numeric"
                                    placeholderTextColor="#acacac"
                                    style={styles.smallNumericInput}
                                    onChangeText={(text) =>
                                        setExerciseInputs((prev) => ({
                                            ...prev,
                                            [exercise.id]: {
                                                ...prev[exercise.id],
                                                sets: Number(text),
                                            },
                                        }))
                                    }
                                />
                                <Text style={styles.primaryText}>Reps:</Text>
                                <TextInput
                                    placeholder="0"
                                    keyboardType="numeric"
                                    placeholderTextColor="#acacac"
                                    style={styles.smallNumericInput}
                                    onChangeText={(text) =>
                                        setExerciseInputs((prev) => ({
                                            ...prev,
                                            [exercise.id]: {
                                                ...prev[exercise.id],
                                                reps: Number(text),
                                            },
                                        }))
                                    }
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveExercise(exercise)}>
                            <Text style={styles.alertText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    smallNumericInput: {
        width: 25,
        color: "#fff",
        paddingLeft: 8,
        borderBottomWidth: 1,
        borderColor: "#acacac",
    },
    primaryText: {
        color: "#fff",
    },
    alertText: {
        color: "red",
    },
    exerciseMetaWrapper: {
        flexDirection: "row",
        gap: 8,
    },
    exerciseSearchInput: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    exerciseInputDropDown: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        zIndex: 10,
    },
    exerciseItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderColor: "#ccc",
        borderBottomWidth: 1,
    },
    exerciseScrollContainer: {
        marginTop: 20,
        padding: 10,
    },
});

export default SearchExercises;
