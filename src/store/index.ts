import { configureStore } from '@reduxjs/toolkit';
import repositoryReducer from './repository-slice';
import appReducer from './app-slice';



const store =  configureStore({
    reducer: {
        repositories: repositoryReducer,
        app: appReducer,
    }
});


export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;