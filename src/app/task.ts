import { Work } from "./work";

export interface Task {
    id: number,
    name: string,
    taskStart: Date,
    taskEnd: Date,
    active: boolean,
    status: number,
    timeWorking: number,
    lastStatus?: Date | null,
    work: Work[],
}
