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

export const GetBlogList = createAsyncThunk("api/GetBlogList", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.bloglist}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})


export const AddBlog = createAsyncThunk("api/AddBlog", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.addBlog}`, credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const UpdateBlog = createAsyncThunk("api/UpdateBlog", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateBlog(id)}`, data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const DeleteBlog = createAsyncThunk("api/DeleteBlog", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteBlog(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetBlogById = createAsyncThunk("api/GetBlogById", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getBlogById(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const AddLensType = createAsyncThunk("api/Addlens", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.createLens}`, credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetAllLens = createAsyncThunk("api/GetLens", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getLens}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetSingleLense = createAsyncThunk("api/getSingleLens", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getSingleLens(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const DeleteLens = createAsyncThunk("api/deletelens", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteLense(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetCoating = createAsyncThunk("api/getCoating", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getCoating}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const AddCoatings = createAsyncThunk("api/addCoating", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.addCoating}`, credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetSingleCoating = createAsyncThunk("api/getSingleCoating", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getSingleCoating(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const UpdateCoating = createAsyncThunk("api/updateCoating", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateCoating(id)}`, data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const DeleteCoating = createAsyncThunk("api/deleteCoating", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteCoating(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const UpdateLense = createAsyncThunk("api/updateLense", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateLense(id)}`, data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const AddGstData = createAsyncThunk("api/addGset", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`${Appapis.Basurl}${Appapis.createGst}`, credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const UpdateGst = createAsyncThunk("api/updategst", async ({ id, data }, { rejectWithValue }) => {
    try {
        console.log("DDD", id, data)
        const response = await axiosInstance.patch(`${Appapis.Basurl}${Appapis.updateGst(id)}`, data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const DeleteGst = createAsyncThunk("api/deleteGst", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`${Appapis.Basurl}${Appapis.deleteGst(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetSingleGstRate = createAsyncThunk("api/getsinglegst", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getSingleGst(id)}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})
export const GetAllGst = createAsyncThunk("api/getallgst", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${Appapis.Basurl}${Appapis.getGst}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})



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
        // Common function to handle async thunk states
        const handleAsyncThunk = (thunk, builder) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(thunk.fulfilled, (state) => {
                    state.loading = false;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        };

        // Handle Login with special case for fulfilled
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
            });

        // Handle all other async thunks using the common function
        const asyncThunks = [
            AddCategory, FileUpload, AddProduct, GetCategory, AddPoster, AddVideo,
            CategoryDetail, GetProductDetail, ProductById, UpdateCategoryId, UpdateProductById,
            DeleteCategory, DeleteProduct, GetAllOrders, GetAllPosters, UpdatePoster,
            DeletePoster, GetPosterById, GetAllVideos, GetVideoById, GetDashboardData,
            UpdateVideo, DeleteVideo, UpdateOrderStatus, GetBlogList, AddBlog,
            UpdateBlog, DeleteBlog, GetBlogById, AddLensType, GetAllLens,
            GetSingleLense, DeleteLens, GetCoating, AddCoatings, GetSingleCoating,
            UpdateCoating, DeleteCoating, UpdateLense, AddGstData, UpdateGst, DeleteGst, GetAllGst

        ];

        asyncThunks.forEach(thunk => handleAsyncThunk(thunk, builder));
    }
});

export const { logout, clearError } = AuthSlice.actions;
export default AuthSlice.reducer;