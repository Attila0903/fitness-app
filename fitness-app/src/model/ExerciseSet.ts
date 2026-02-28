export interface ISetDto{
    id?: number;
    weight: number;
    reps: number;
}

export class ExerciseSet{
    id?: number | string;
    weight: number;
    reps: number;

    constructor(dto: Partial<ISetDto> = {}){
        this.id = dto.id;
        this.weight = dto.weight || 0;
        this.reps = dto.reps || 0;
    }

    dtoFormat(){
        return{
            weight: this.weight,
            reps: this.reps
        }
    }
}