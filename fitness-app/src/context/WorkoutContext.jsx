import React, { createContext, useState, useEffect, useContext } from 'react';

const WorkoutContext = createContext();

/**
 * A WorkoutProvider komponens felelős az edzésadatok kezeléséért.
 */
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true)

  useEffect(()=>
  {
    const loadWorkouts = async () => {
      try{
        const response = await fetch('http://localhost:5202/api/workout');
        if(!response.ok) throw new Error('Hiba a szerver elérésekor');
        const data = await response.json();
        console.log(data)
        setWorkouts(data);
      }catch(error){
        console.error("Hiba:",error);
      }finally{
        setIsLoadingWorkout(false);
      }
    };
    loadWorkouts();
}, []);

  /**
   * Új edzés hozzáadása a listához.
   * @param {Object} workoutData - Az új edzés adatai
   */
  const addWorkout = async (workoutData) => {
    const newWorkout = {
      date: new Date().toISOString().split('T')[0],      
      ...workoutData
    };
    const workoutToSave = {
    ...newWorkout,
    exercises: newWorkout.exercises.map(({ id, ...rest }) => ({
      ...rest, 
      sets: rest.sets.map(({ id, ...setRest }) => setRest)
    }))
  };
    try{
      const response = await fetch('http://localhost:5202/api/workout',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(workoutToSave)
      });
      if(response.ok){
        const responseWorkout = await response.json();
        setWorkouts((prevWorkouts) => [...prevWorkouts, responseWorkout]);
      }
    }catch(error){
      console.error("Hiba a mentés során:", error);
    }    
  };

  /**
   * Edzés törlése ID alapján.
   * @param {string} id - A törlendő edzés azonosítója
   */
  //API hívás lesz
  const deleteWorkout = (id) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
  };

  const value = {
    workouts,
    isLoadingWorkout,
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