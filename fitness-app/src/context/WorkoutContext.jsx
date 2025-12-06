import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const WorkoutContext = createContext();

/**
 * A WorkoutProvider komponens felelős az edzésadatok kezeléséért.
 * Javított verzió: Lazy Initialization használata a localStorage-hoz.
 */
export const WorkoutProvider = ({ children }) => {
  // JAVÍTÁS: Nem useEffect-ben töltünk be, hanem közvetlenül az állapot létrehozásakor.
  // Ez a függvény csak egyszer fut le, az oldal betöltésekor.
  const [workouts, setWorkouts] = useState(() => {
    try {
      const storedWorkouts = localStorage.getItem('fitness-app-data');
      return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    } catch (error) {
      console.error("Hiba az adatok inicializálásakor:", error);
      return [];
    }
  });

  // MENTÉS: Csak akkor mentünk, ha a workouts változik.
  // Mivel a betöltés már megtörtént a useState-ben, nem fogjuk felülírni üres tömbbel indításkor.
  useEffect(() => {
    localStorage.setItem('fitness-app-data', JSON.stringify(workouts));
  }, [workouts]);

  /**
   * Új edzés hozzáadása a listához.
   * @param {Object} workoutData - Az új edzés adatai
   */
  const addWorkout = (workoutData) => {
    const newWorkout = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      ...workoutData
    };
    setWorkouts((prevWorkouts) => [newWorkout, ...prevWorkouts]);
  };

  /**
   * Edzés törlése ID alapján.
   * @param {string} id - A törlendő edzés azonosítója
   */
  const deleteWorkout = (id) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
  };

  const value = {
    workouts,
    addWorkout,
    deleteWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

/**
 * Hook a Context eléréséhez.
 */
export const useWorkouts = () => {
  return useContext(WorkoutContext);
};