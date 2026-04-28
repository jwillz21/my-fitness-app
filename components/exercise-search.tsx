import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        marginBottom: 16,
                    }}
                />

                {showDropdown && suggestions.length > 0 && (
                    <View
                        style={{
                            position: "absolute",
                            top: 50,
                            left: 0,
                            right: 0,
                            backgroundColor: "white",
                            borderWidth: 1,
                            zIndex: 10,
                        }}
                    >
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
            <ScrollView
                style={{
                    marginTop: 20,
                    padding: 10,
                }}
            >
                {selectedExercises.length === 0 && (
                    <Text style={{ color: "#fff" }}>No exercises selected</Text>
                )}

                {selectedExercises.map((exercise) => (
                    <View
                        key={exercise.id}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 8,
                            borderColor: "#ccc",
                            borderBottomWidth: 1,
                        }}
                    >
                        <View>
                            <Text style={{ color: "#fff" }}>{exercise.name}</Text>
                            <View style={{ flexDirection: "row", gap: 8 }}>
                                <Text style={{ color: "#fff" }}>Sets:</Text>
                                <TextInput
                                    placeholder="0"
                                    keyboardType="numeric"
                                    placeholderTextColor="#acacac"
                                    style={{
                                        width: 25,
                                        color: "#fff",
                                        paddingLeft: 8,
                                        borderBottomWidth: 1,
                                        borderColor: "#acacac",
                                    }}
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
                                <Text style={{ color: "#fff" }}>Reps:</Text>
                                <TextInput
                                    placeholder="0"
                                    keyboardType="numeric"
                                    placeholderTextColor="#acacac"
                                    style={{
                                        width: 25,
                                        color: "#fff",
                                        paddingLeft: 8,
                                        borderBottomWidth: 1,
                                        borderColor: "#acacac",
                                    }}
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
                            <Text style={{ color: "red" }}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default SearchExercises;
