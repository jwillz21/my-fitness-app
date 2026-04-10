export type Workout = {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  id: number;
  orderIndex: number;
  exercise: Exercise;
};

export type Exercise = {
  id: number;
  name: string;
  muscles: { type: string; muscle: { id: number; name: string } }[];
  equipment: { equipment: { id: number; name: string } }[];
};

export type CreateWorkout = {
  name: string;
  userId: number;
  exercises: { exerciseId: number; orderIndex: number }[];
};
