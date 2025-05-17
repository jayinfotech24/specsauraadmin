const Appapis = {
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
    allPosters: "/wallpaper",
    updatePoster: (id) => `/wallpaper/${id}`,
    deletePoster: (id) => `/wallpaper/${id}`,
}

export default Appapis