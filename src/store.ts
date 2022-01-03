import { get, writable, Writable } from "svelte/store";
import type { Pair } from "./models";
import { train } from "./tf-model";

const wStorage = <T>(key: string, initValue: T): Writable<T> => {
    const storedValueStr = localStorage.getItem(key);
    const storedValue: T = JSON.parse(storedValueStr);

    const store = writable(storedValueStr != null ? storedValue : initValue);
    store.subscribe((val) => {
        localStorage.setItem(key, JSON.stringify(val));
    })
    return store;
}

export const pairs = createPairs();

function createPairs() {
    const store = wStorage<Pair[]>('pairs', []);
    let w: Worker;

    store.subscribe(val => {
        if(val.length % 5 == 0 && val.length > 0)
            train(val.slice(-100))
    });
    
    return {
        ...store,
        add: (pair: Pair) => {
            store.update(old => {
                return [...old, pair].slice(-1000);
            })
        }
    }
}

