import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: "counter",
    initialState: {
        count: 10
    },
    reducers: {
        increment: (state) => {
            state.count++;
        }
    }
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;