import axiosInstance from "./axiosInstance";
import Appapis from "./apiEndpoints";
import fileInstance from "./fileInstance"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
    count: 0,
    loading: false,
    error: null

};

export const Login = createAsyncThunk("api/login", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.signIn}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})


export const AddCategory = createAsyncThunk("api/addcategory", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.addCategory}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})

export const FileUpload = createAsyncThunk("api/upload", async (credentials, { rejectWithValue }) => {

    try {
        const response = await fileInstance.post(`${Appapis.Basurl}${Appapis.fileUpload}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong", error);
    }

})
const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(Login.pending, (state) => {
                state.loading = true

            })
            .addCase(Login.fulfilled, (state) => {
                state.loading = false;

            })
            .addCase(Login.rejected, (state) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddCategory.pending, (state) => {
                state.loading = true

            })
            .addCase(AddCategory.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(AddCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(FileUpload.pending, (state) => {
                state.loading = true

            })
            .addCase(FileUpload.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(FileUpload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export default AuthSlice.reducer;