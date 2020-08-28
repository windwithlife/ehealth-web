import { useStaticRendering } from 'mobx-react';
import TestStore from "./TestStore";

const isServer = typeof window === 'undefined';
useStaticRendering(isServer)


export default function initializeStore(initialData = {}){
    if (isServer) {
        return {
            testStore: new TestStore(initialData?.testStore || {}),
        }
    }else{
        const mobxStore = {
            testStore: new TestStore(initialData?.testStore || {}),
        }
        const __NEXT_MOBX_STORE__ = '__NEXT_MOBX_STORE__'
        if (!window[__NEXT_MOBX_STORE__]) window[__NEXT_MOBX_STORE__] = mobxStore;
        return mobxStore;
    }
}

