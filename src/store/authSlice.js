import axiosInstance from "./axiosInstance";
import Appapis from "./apiEndpoints";
import fileInstance from "./fileInstance"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helper function to safely access localStorage
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("authToken");
    }
    return null;
};

const initialState = {
    user: null,
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
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
    "api/categoryDetail",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.categoryDetail(id)}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const GetProductDetail = createAsyncThunk("api/getProductDetail", async (credentials, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.allProduct}`, credentials)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})
export const ProductById = createAsyncThunk(
    "api/productById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.productDetail(id)}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const UpdateCategoryId = createAsyncThunk(
    "api/UpdateCatById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateCategory(id)}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const UpdateProductById = createAsyncThunk(
    "api/UpdateProductById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateProductDetail(id)}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const DeleteCategory = createAsyncThunk("api/DeleteCategory", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteCategory(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const DeleteProduct = createAsyncThunk("api/DeleteProduct", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteProduct(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetAllOrders = createAsyncThunk("api/GetAllOrders", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.allOrders}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetAllPosters = createAsyncThunk("api/GetAllPosters", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.allPosters}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const UpdatePoster = createAsyncThunk(
    "api/UpdatePoster",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updatePoster(id)}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const DeletePoster = createAsyncThunk("api/DeletePoster", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deletePoster(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetPosterById = createAsyncThunk("api/GetPosterById", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getPosterById(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetAllVideos = createAsyncThunk("api/GetAllVideos", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getAllVideos}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetVideoById = createAsyncThunk("api/GetVideoById", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getVideoById(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetDashboardData = createAsyncThunk("api/GetDashboardData", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getDashboardData}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const UpdateVideo = createAsyncThunk("api/UpdateVideo", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateVideo(id)}`, credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const DeleteVideo = createAsyncThunk("api/DeleteVideo", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteVideo(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }

})

export const UpdateOrderStatus = createAsyncThunk(
    "api/UpdateOrderStatus",
    async ({ order, newStatus }, { rejectWithValue }) => {
        try {
            const updatedOrderData = {
                ...order,
                status: newStatus,
                // paymentStatus: newStatus === 'Delivered' ? 'Paid' : 'Pending'
            };
            const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateOrderStatus(order._id)}`, updatedOrderData);
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
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem("authToken");
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(Login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(Login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                if (typeof window !== 'undefined') {
                    localStorage.setItem("authToken", action.payload.token);
                }
            })
            .addCase(Login.rejected, (state, action) => {
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
            .addCase(GetProductDetail.pending, (state) => {
                state.loading = true

            })
            .addCase(GetProductDetail.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(GetProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ProductById.pending, (state) => {
                state.loading = true

            })
            .addCase(ProductById.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(ProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateCategoryId.pending, (state) => {
                state.loading = true

            })
            .addCase(UpdateCategoryId.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(UpdateCategoryId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateProductById.pending, (state) => {
                state.loading = true

            })
            .addCase(UpdateProductById.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(UpdateProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteCategory.pending, (state) => {
                state.loading = true

            })
            .addCase(DeleteCategory.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(DeleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteProduct.pending, (state) => {
                state.loading = true

            })
            .addCase(DeleteProduct.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(DeleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetAllOrders.pending, (state) => {
                state.loading = true

            })
            .addCase(GetAllOrders.fulfilled, (state,) => {
                state.loading = false;

            })
            .addCase(GetAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetAllPosters.pending, (state) => {
                state.loading = true

            })
            .addCase(GetAllPosters.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetAllPosters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdatePoster.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdatePoster.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(UpdatePoster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeletePoster.pending, (state) => {
                state.loading = true
            })
            .addCase(DeletePoster.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(DeletePoster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetPosterById.pending, (state) => {
                state.loading = true
            })
            .addCase(GetPosterById.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetPosterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetAllVideos.pending, (state) => {
                state.loading = true
            })
            .addCase(GetAllVideos.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetAllVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetVideoById.pending, (state) => {
                state.loading = true
            })
            .addCase(GetVideoById.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetVideoById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetDashboardData.pending, (state) => {
                state.loading = true
            })
            .addCase(GetDashboardData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(GetDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateVideo.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdateVideo.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(UpdateVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteVideo.pending, (state) => {
                state.loading = true
            })
            .addCase(DeleteVideo.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(DeleteVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateOrderStatus.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdateOrderStatus.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(UpdateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { logout, clearError } = AuthSlice.actions;
export default AuthSlice.reducer;