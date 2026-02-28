import React, { createContext, useState, useEffect, useContext } from "react";
import {Workout}  from "./model/Workout";

const WorkoutContext = createContext();

/**
 * A WorkoutProvider komponens felelős az edzésadatok kezeléséért.
 */
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetch(`/api/workout`);
        if (!response.ok) throw new Error("Hiba a szerver elérésekor");
        const data = await response.json();
        console.log(data);
        const loadedWorkouts = data.map((dto) => new Workout(dto));
        setWorkouts(loadedWorkouts);
      } catch (error) {
        console.error("Hiba:", error);
      } finally {
        setIsLoadingWorkout(false);
      }
    };
    loadWorkouts();
  }, []);

  /**
   * Új edzés hozzáadása a listához.
   * @param {Object} workoutData - Az új edzés adatai
   */
  const addWorkout = async (workoutToAdd) => {    
    try {
      const response = await fetch(`/api/workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutToAdd),
      });
      if (response.ok) {
        const responseWorkout = await response.json();
        const addedWorkout = new Workout(responseWorkout)
        setWorkouts((prevWorkouts) => [...prevWorkouts, addedWorkout]);
      }
    } catch (error) {
      console.error("Hiba a mentés során:", error);
    }
  };

  /**
   * Edzés törlése ID alapján.
   * @param {string} id - A törlendő edzés azonosítója
   */
  //API hívás lesz
  const deleteWorkout = async (id) => {
    try {
      const response = await fetch(`/api/workout/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Sikeres törlés adatbázisból");
        setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== id),
      );
      } else {
        console.error("Hiba történt a szerveren. Státuszkód:", response.status);
      }      
    } catch (error) {
      console.error("Hiba a törlés során", error);
    }
  };

  const value = {
    workouts,
    isLoadingWorkout,
    addWorkout,
    deleteWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};

/**
 * Hook a Context eléréséhez.
 */
export const useWorkouts = () => {
  return useContext(WorkoutContext);
};
