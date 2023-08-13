import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const infographSlice = createSlice({
  name: "infoGraph",
  initialState,
  reducers: {
    setInfoGraphData: (state, action) => {
      state.data = action.payload;
    },
    updateInfoGraphData: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    clearData: (state) => {
      state.data = null;
    },
  },
});

export const { setInfoGraphData, updateInfoGraphData, clearData } =
  infographSlice.actions;
export default infographSlice.reducer;
