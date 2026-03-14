import { Exercise, IExerciseDto } from "./Exercise";

export interface IWorkoutDto{
    id ?: number;
    date : string | Date;
    name: string;
    exercises: IExerciseDto[]
    totalVolume?: number;
}

export class Workout{
    id ?: number;
    date: Date;
    name: string;
    exercises: Exercise[];
    totalVolume: number;

    constructor(dto: Partial<IWorkoutDto> = {}){
        this.id = dto.id;
        this.date = dto.date ? new Date(dto.date) : new Date();
        this.name = dto.name || '';
        this.exercises = dto.exercises? dto.exercises.map(e =>new Exercise(e)) : [];
        this.totalVolume = dto.totalVolume || 0;
    }

    //Dátum visszaadása "YYYY-MM-DD" formátumban
    getFormattedDate(): string{
        return `${this.date.getFullYear()}-${String(this.date.getMonth() + 1).padStart(2, '0')}-${String(this.date.getDate()).padStart(2, '0')}`;
    }

    dtoFormat(){
        return {
            date: this.getFormattedDate(),
            name:this.name,
            exercises: this.exercises.map(ex => ex.dtoFormat())
        }
    }

    isNameValid(){
        return this.name.trim().length >= 3;
    }
}
