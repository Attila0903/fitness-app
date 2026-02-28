import { ISetDto, ExerciseSet } from "./ExerciseSet";

export interface IExerciseDto{
    id?: number;
    name: string;
    sets?: ISetDto[];
}

export class Exercise{
    id?: number | string;
    name: string;
    sets: ExerciseSet[];

    constructor(dto: Partial<IExerciseDto> = {}){
        this.id = dto.id;
        this.name = dto.name ||'';
        this.sets = dto.sets? dto.sets.map(s => new ExerciseSet(s)) : [];
    }

    dtoFormat(){
        return {
            name: this.name,
            sets: this.sets.map(set => set.dtoFormat())
        }
    }
}