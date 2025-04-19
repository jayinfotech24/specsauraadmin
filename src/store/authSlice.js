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
export const AddProduct = createAsyncThunk("api/addProduct", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.addProduct}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})
export const GetCategory = createAsyncThunk("api/getCategory", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.addCategory}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})
export const AddPoster = createAsyncThunk("api/addPoster", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.wallpaper}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})
export const AddVideo = createAsyncThunk("api/addVideo", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.video}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})
export const CategoryDetail = createAsyncThunk(
    "api/productDetail",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.categoryDetail(id)}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
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
            .addCase(AddProduct.pending, (state) => {
                state.loading = true

            })
            .addCase(AddProduct.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(AddProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetCategory.pending, (state) => {
                state.loading = true

            })
            .addCase(GetCategory.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(GetCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddPoster.pending, (state) => {
                state.loading = true

            })
            .addCase(AddPoster.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(AddPoster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddVideo.pending, (state) => {
                state.loading = true

            })
            .addCase(AddVideo.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(AddVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(CategoryDetail.pending, (state) => {
                state.loading = true

            })
            .addCase(CategoryDetail.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(CategoryDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export default AuthSlice.reducer;