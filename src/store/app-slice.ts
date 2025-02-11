import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type appState = {
    isMouseEnter: boolean;
    currentRepositoryId: string | null | undefined; 
}

const initialState: appState = {
    isMouseEnter: false,
    currentRepositoryId: null
}


const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
          doMouseEnterTrue(state) {
            state.isMouseEnter = true;
          },
          doMouseEnterFalse(state) {
            state.isMouseEnter = false;
          },
          addCurrentRepositoryId(state, action: PayloadAction<string | null | undefined>){
            state.currentRepositoryId = action.payload;
          }
    },
  });






export const { doMouseEnterTrue, doMouseEnterFalse, addCurrentRepositoryId } = appSlice.actions;

export default appSlice.reducer;