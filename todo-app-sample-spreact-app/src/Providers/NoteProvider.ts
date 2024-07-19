import { INote } from "../Models/INote";
import { sp } from '@pnp/sp/presets/all'

//const _notes = Notes;

export interface IAppInfo {
    id: string;
    name: string;
    description: string;
    version: string;
    publisher: string;
}

interface INoteProvider {
    getNotes(): Promise<INote[]>;
    addNote(note: INote): Promise<number>;
    updateNote(note: INote): Promise<boolean>;
    deleteNote(Id: number): Promise<boolean>;
    getNoteById(id: number): Promise<INote | null>;
    //getAppInfo(): Promise<IAppInfo>;
}

class NoteProvider implements INoteProvider {

    public static getUserProfile(): Promise<{ name: string; email: string; }> {
        return new Promise<{ name: string; email: string; }>((resolve, reject) => {
            sp.web.currentUser().then((__user) => {
                resolve({ name: __user.Title, email: __user.Email });
            }).catch((e) => {
                reject(e);
            })
        });
    }

    public static getAppInfo(): Promise<IAppInfo> {
        return new Promise<IAppInfo>((resolve, reject) => {
            sp.web.lists.getByTitle('SPReact AppConfig').items.select('AppID', 'AppTitle', 'AppVersion', 'Description', 'Publisher').top(1).get().then((items) => {
                const appinfo = {
                    id: items[0].AppID,
                    name: items[0].AppTitle,
                    description: items[0].Description,
                    version: items[0].AppVersion,
                    publisher: items[0].Publisher
                } as IAppInfo;
                resolve(appinfo);
            }).catch((er) => {
                reject(er);
            })
        })
    }

    private provisionList(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            sp.web.lists.add('My Notes').then(async (list) => {
                sp.web.lists.getByTitle('My Notes').fields.addText('Title').then((v => {
                    sp.web.lists.getByTitle('My Notes').fields.addMultilineText('Content').then((x) => {
                        resolve(true);
                    })
                }));
            }).catch((er) => {
                reject(er);
            });
        });
    }

    public getNotes(): Promise<INote[]> {
        return new Promise<INote[]>((resolve, reject) => {
            sp.web.lists.getByTitle('My Notes').items.select('ID', 'Title', 'Content').getAll().then((n) => {
                const __notes = n.map((item) => {
                    return {
                        title: item.Title,
                        content: item.Content,
                        id: item.ID
                    } as INote
                });
                resolve(__notes);
            }).catch((err) => {
                this.provisionList();
                resolve([]);
            });
        });
    }

    public getNoteById(id: number): Promise<INote | null> {
        return new Promise<INote | null>((resolve, reject) => {
            sp.web.lists.getByTitle('My Notes').items.getById(id).get().then((v) => {
                const textContent = (v.Content + '').substring((v.Content + '').indexOf('>')+1).replace('</div>','');
                resolve({ id: v.ID, title: v.Title, content: textContent} as INote);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    public addNote(note: INote): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            sp.web.lists.getByTitle('My Notes').items.add({
                'Title': note.title,
                'Content': note.content
            }).then((a) => {
                resolve(a.data.Id);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public updateNote(note: INote): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            sp.web.lists.getByTitle('My Notes').items.getById(note.id).update({
                'Title': note.title,
                'Content': note.content
            }).then((a) => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public deleteNote(Id: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            sp.web.lists.getByTitle('My Notes').items.getById(Id).recycle().then((a) => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

}

export default NoteProvider;