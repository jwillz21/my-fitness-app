import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Exercise } from "./types";

type ExerciseProps = {
    selectedExercises: Exercise[];
    setSelectedExercises: (exercises: Exercise[]) => void;
};

// type Suggestion = {
//     id: number;
//     name: string;
// };

const SearchExercises = ({ selectedExercises, setSelectedExercises }: ExerciseProps) => {
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
        setSelectedExercises(selectedExercises.filter((ex) => ex !== exercise));
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
                    maxHeight: 400,
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
                        <Text style={{ color: "#fff" }}>{exercise.name}</Text>

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
