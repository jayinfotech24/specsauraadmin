const Appapis = {
    Basurl: "https://specsauradataplazma.vercel.app/api",
    signIn: "/admin/login",
    addCategory: "/category",
    fileUpload: "/upload",
    addProduct: "/product",
    wallpaper: "/wallpaper",
    video: "/video",
    categoryDetail: (id) => `/category/${id}`
}

export default Appapis