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
            .addCase(GetBlogList.pending, (state) => {
                state.loading = true
            })
            .addCase(GetBlogList.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetBlogList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddBlog.pending, (state) => {
                state.loading = true
            })
            .addCase(AddBlog.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(AddBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateBlog.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdateBlog.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(UpdateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteBlog.pending, (state) => {
                state.loading = true
            })
            .addCase(DeleteBlog.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(DeleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetBlogById.pending, (state) => {
                state.loading = true
            })
            .addCase(GetBlogById.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddLensType.pending, (state) => {
                state.loading = true
            })
            .addCase(AddLensType.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(AddLensType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetAllLens.pending, (state) => {
                state.loading = true
            })
            .addCase(GetAllLens.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetAllLens.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetSingleLense.pending, (state) => {
                state.loading = true
            })
            .addCase(GetSingleLense.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetSingleLense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteLens.pending, (state) => {
                state.loading = true
            })
            .addCase(DeleteLens.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(DeleteLens.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetCoating.pending, (state) => {
                state.loading = true
            })
            .addCase(GetCoating.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetCoating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddCoatings.pending, (state) => {
                state.loading = true
            })
            .addCase(AddCoatings.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(AddCoatings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetSingleCoating.pending, (state) => {
                state.loading = true
            })
            .addCase(GetSingleCoating.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(GetSingleCoating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateCoating.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdateCoating.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(UpdateCoating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteCoating.pending, (state) => {
                state.loading = true
            })
            .addCase(DeleteCoating.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(DeleteCoating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateLense.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdateLense.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(UpdateLense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    }
})

export const { logout, clearError } = AuthSlice.actions;
export default AuthSlice.reducer;