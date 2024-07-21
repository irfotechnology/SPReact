import { IAppInfo } from "../Models/IAppInfo";
import { INote } from "../Models/INote";


export interface ISPListProvider {
    getUserProfile(): Promise<{ name: string; email: string; }>;
    getAppInfo(): Promise<IAppInfo>;
    getNotes(): Promise<INote[]>;
    addNote(note: INote): Promise<number>;
    updateNote(note: INote): Promise<boolean>;
    deleteNote(Id: number): Promise<boolean>;
    getNoteById(id: number): Promise<INote | null>;
}