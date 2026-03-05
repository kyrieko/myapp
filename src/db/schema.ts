import { pgTable, serial, text, integer, numeric, timestamp, date } from 'drizzle-orm/pg-core';

// 운동 종목 카탈로그
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 운동 세션
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  date: date('date').defaultNow(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
});

// 운동 세션 내 종목 (junction 테이블)
export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().references(() => workouts.id),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  order: integer('order'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 각 종목의 세트
export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id').notNull().references(() => workoutExercises.id),
  setNumber: integer('set_number'),
  reps: integer('reps'),
  weight: numeric('weight', { precision: 6, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 타입 추론
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;
