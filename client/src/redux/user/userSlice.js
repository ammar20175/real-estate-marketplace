import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
		},
		updateUserSuccess: (state, action) => {
			state.currentUser = action.payload;
		},
		deletUserSuccess: (state, action) => {
			state.currentUser = null;
		},
		signOutSuccess: (state, action) => {
			state.currentUser = null;
		},
	},
});

export const {
	signInSuccess,
	updateUserSuccess,
	deletUserSuccess,
	signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
