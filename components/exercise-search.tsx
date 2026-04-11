import React from "react";
import { TextInput } from "react-native-gesture-handler";

type exerciseProps = {
    selectedExercise: string;
    setSelectedExercise: (exercise: string) => void;
};

const SearchExercises = ({ selectedExercise, setSelectedExercise }: exerciseProps) => {
    return (
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
    );
};

export default SearchExercises;
