const Appapis = {
    // Basurl: "https://api.specsaura.com/api",
    Basurl: "https://specsauradataplazma.vercel.app/api",
    signIn: "/admin/login",
    addCategory: "/category",
    fileUpload: "/upload",
    addProduct: "/product",
    wallpaper: "/wallpaper",
    video: "/video",
    allProduct: "/products/all",
    categoryDetail: (id) => `/category/${id}`,
    productDetail: (id) => `/product/${id}`,
    updateCategory: (id) => `/category/${id}`,
    updateProductDetail: (id) => `/product/${id}`,
    deleteCategory: (id) => `/category/${id}`,
    deleteProduct: (id) => `/product/${id}`,
    deleteWallpaper: (id) => `/wallpaper/${id}`,
    deleteVideo: (id) => `/video/${id}`,
    allOrders: "/order/all",
    updateOrderStatus: (id) => `/order/${id}/`,
    allPosters: "/wallpaper",
    updatePoster: (id) => `/wallpaper/${id}`,
    deletePoster: (id) => `/wallpaper/${id}`,
    getPosterById: (id) => `/wallpaper/${id}`,
    getAllVideos: "/video",
    getVideoById: (id) => `/video/${id}`,
    getDashboardData: "/dashboard",
    updateVideo: (id) => `/video/${id}`,
    deleteVideo: (id) => `/video/${id}`,
    bloglist: "/blog",
    addBlog: "/blog",
    updateBlog: (id) => `/blog/${id}`,
    deleteBlog: (id) => `/blog/${id}`,
    getBlogById: (id) => `/blog/${id}`,
    createLens: `/lens`,
    getLens: `/lens`,
    getSingleLens: (id) => `/lens/single/${id}`,
    deleteLense: (id) => `/lens/${id}`,
    getCoating: `/coating`,
    addCoating: `/coating`,
    getSingleCoating: (id) => `/coating/single/${id}`,
    updateCoating: (id) => `/coating/${id}`,
    deleteCoating: (id) => `/coating/${id}`,
    updateLense: (id) => `/lens/${id}`
}

export default Appapis