"use client"

import React, { useCallback, useEffect } from 'react'
import Input from '@/components/form/input/InputField'
import { useState } from 'react'
import styles from "../../../../../styles/product.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import TextArea from '@/components/form/input/TextArea'

import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddProduct, FileUpload, GetCategory, UpdateProductById } from '@/store/authSlice';

import Select from '@/components/form/Select'
import { ChevronDownIcon } from '@/icons'
import { ProductById } from "../../../../../store/authSlice"
import RadioButtons from '@/components/form/form-elements/RadioButtons'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export const FRAME_SHAPES = Object.freeze([
    "Round",
    "Oval",
    "Square",
    "Rectangle",
    "Cat Eye",
    "Geometric",
    "Hexagon",
    "Octagon",
    "Browline",
    "Butterfly",
    "Wraparound",
    "Shield",
    "Aviator",
    "Wayfarer",
    "Rimless",
    "Semi-Rimless",
    "Full Rim",
    "Heart",
    "Star",
    "Novelty"
]);

export default function Page() {
    const brandMap = [
        { img: "/Images/brand1.jpg", type: "Ascend Drip" },
        { img: "/Images/brand2.jpg", type: "Seraphic" },
        { img: "/Images/brand3.jpg", type: "PriumX" },
        { img: "/Images/brand4.jpg", type: "halospecs" }
    ];

    const schema = Yup.object().shape({
        name: Yup.string().required("Please enter product name."),

        price: Yup.number().typeError("Price must be a number").required("Please enter price."),
        totalItems: Yup.number().typeError("Total items must be a number").required("Please enter total items."),
        availableItems: Yup.number().typeError("Available items must be a number").required("Please enter available items."),
        description: Yup.string().required("Please enter description."),
        brandName: Yup.string().required("Please enter brand name."),
        modelNo: Yup.string().required("Please enter model number."),
        productID: Yup.string().required("Please enter product ID."),
        frameWidth: Yup.string().required("Please enter frame width."),
        category: Yup.string().required("Please select a category."),
        frameHeight: Yup.string().required("Please enter frame height."),
        frameDimention: Yup.string().required("Please enter frame dimension."),
        frameColor: Yup.string().required("Please enter frame color."),
        lensColor: Yup.string().required("Please enter lens color."),
        templeColor: Yup.string().required("Please enter temple color."),
        frameMaterial: Yup.string().required("Please enter frame material."),
        lens: Yup.string().required("Please enter lens type."),
        powerSunglasses: Yup.string().required("Please enter power sunglasses info."),
        gender: Yup.string().required("Please enter gender."),
        warranty: Yup.string().required("Please enter warranty information."),
        collection_type: Yup.string().required("Please select a collection type."),
        frameShape: Yup.string().required("Please select a frame shape."),
        file: Yup.mixed().when('$id', {
            is: (id) => !id, // When there is no id (creating new)
            then: (schema) => schema.required("Please upload product images"), // Apply validation
            otherwise: (schema) => schema.notRequired(), // No validation when updating
        }),
        image: Yup.mixed().when('$id', {
            is: (id) => !id, // When there is no id (creating new)
            then: (schema) => schema.required("Please upload a main product image"), // Apply validation
            otherwise: (schema) => schema.notRequired(), // No validation when updating
        }),
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedMainFile, setSelectedMainFile] = useState(null);
    const [FileUrls, setFileUrls] = useState([]);
    const [MainUrl, setMainUrl] = useState(null);
    const [localMainUrl, setLocalMainUrl] = useState(null);
    const [localFileUrls, setLocalFileUrls] = useState([]);

    const [OptionsList, setOptions] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const searchParams = useSearchParams();

    const id = searchParams.get('id'); // Safe to call directly
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,

    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            powerSunglasses: false, // or undefined, just a placeholder
            collection_type: '',
            frameShape: '',
        },
        context: { id } // Pass the id to the validation context
    });

    const handleFileChange = (event) => {
        const files = event.target.files;
        const localUrls = [];
        const selectedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload image files only', {
                    style: {
                        marginTop: '100px',
                        background: '#ff4d4f',
                        color: '#fff',
                    },
                });
                return;
            }

            // Create local URL for preview
            const localUrl = URL.createObjectURL(file);
            localUrls.push(localUrl);
            selectedFiles.push(file);
        }

        setLocalFileUrls(localUrls);
        setSelectedFiles(selectedFiles);
        setValue("file", selectedFiles, { shouldValidate: true });
    };

    const UploadSingleFile = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file', {
                    style: {
                        marginTop: '100px',
                        background: '#ff4d4f',
                        color: '#fff',
                    },
                });
                return;
            }

            // Create local URL for preview
            const localUrl = URL.createObjectURL(file);
            setLocalMainUrl(localUrl);
            setSelectedMainFile(file);
            setValue("image", file, { shouldValidate: true });
        }
    };

    // Clean up local URLs when component unmounts
    useEffect(() => {
        return () => {
            if (localMainUrl && localMainUrl.startsWith('blob:')) {
                URL.revokeObjectURL(localMainUrl);
            }
            localFileUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [localMainUrl, localFileUrls]);

    const GetProductById = useCallback(() => {
        dispatch(ProductById(id)).then((response) => {
            console.log("Response", response)
            if (response.payload) {

                const data = response.payload.product;

                setValue("name", data.name || "");

                setValue("price", data.price || 0);
                setValue("totalItems", data.totalItems || 0);
                setValue("availableItems", data.availableItems || 0);
                setValue("description", data.description || "");
                setValue("brandName", data.brandName || "");
                setValue("modelNo", data.modelNo || "");
                setValue("productID", data.productID || "");
                setValue("frameWidth", data.frameWidth || "");
                setValue("frameHeight", data.frameHeight || "");
                setValue("frameDimention", data.frameDimention || "");
                setValue("frameColor", data.frameColor || "");
                setValue("lensColor", data.lensColor || "");
                setValue("templeColor", data.templeColor || "");
                setValue("frameMaterial", data.frameMaterial || "");
                setValue("lens", data.lens || "");
                setValue("powerSunglasses", data.powerSunglasses
                    || false);
                setValue("gender", data.gender || "Unisex");
                setValue("warranty", data.warranty || "");
                setValue("collection_type", data.collection_type || '');
                setValue("frameShape", data.frameShape || '');
                setValue("discount", data.discount || 0)
                setFileUrls(data.images);

                // For category (pick _id)
                if (data.category?._id) {
                    setValue("category", data.category._id);
                }

                // For main image URL
                if (data.url) {
                    setMainUrl(data.url);
                }

                // For multiple images
                if (data.images && Array.isArray(data.images)) {
                    setFileUrls(data.images);
                }
            }
        });
    }, [dispatch, id, setValue]);

    useEffect(() => {
        if (id) {
            GetProductById()
        }

    }, [GetProductById, id])

    const GetCategoryList = useCallback(() => {
        dispatch(GetCategory()).then((response) => {
            console.log("ResponseCategory", response)
            if (response.payload.status == 200) {
                const itemList = response.payload.items
                const Options = itemList.map((item) => ({
                    value: item._id,
                    label: item.title
                }));

                setOptions(Options)
            }
        })
    }, [dispatch])

    useEffect(() => {
        GetCategoryList()
    }, [GetCategoryList])

    const handleSelectChange = (value) => {
        setValue("category", value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    console.log("EE", errors)

    useEffect(() => {
        console.log("Op", OptionsList)
    }, [OptionsList])

    const submitHandler = async (data) => {
        setIsLoading(true);
        try {
            let finalMainUrl = MainUrl;
            let finalFileUrls = FileUrls;

            // Upload main image if it's new
            if (selectedMainFile && (!id || selectedMainFile !== MainUrl)) {
                const formData = new FormData();
                const uniqueFilename = Date.now() + "-" + selectedMainFile.name;
                formData.append("file", selectedMainFile, uniqueFilename);

                const uploadResponse = await dispatch(FileUpload(formData)).unwrap();
                if (uploadResponse?.fileUrl) {
                    finalMainUrl = uploadResponse.fileUrl;
                    setMainUrl(uploadResponse.fileUrl);
                } else {
                    throw new Error('Failed to upload main image');
                }
            }

            // Upload multiple images if they're new
            if (selectedFiles.length > 0) {
                const uploadedUrls = [];
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    const uniqueFilename = Date.now() + "-" + file.name;
                    formData.append("file", file, uniqueFilename);

                    const uploadResponse = await dispatch(FileUpload(formData)).unwrap();
                    if (uploadResponse?.fileUrl) {
                        uploadedUrls.push(uploadResponse.fileUrl);
                    }
                }
                if (uploadedUrls.length > 0) {
                    finalFileUrls = uploadedUrls;
                    setFileUrls(uploadedUrls);
                }
            }

            const jsonObject = {
                name: data?.name,

                category: data.category,
                price: data.price,
                totalItems: data.totalItems,
                availableItems: data.availableItems,
                url: finalMainUrl,
                images: finalFileUrls,
                description: data.description,
                brandName: data.brandName,
                modelNo: data.modelNo,
                productID: data.productID,
                frameWidth: data.frameWidth,
                frameHeight: data.frameHeight,
                frameDimention: data.frameDimention,
                frameColor: data.frameColor,
                lensColor: data.lensColor,
                templeColor: data.templeColor,
                frameMaterial: data.frameMaterial,
                lens: data.lens,
                powerSunglasses: data.powerSunglasses,
                gender: data.gender,
                warranty: data.warranty,
                collection_type: data.collection_type,
                frameShape: data.frameShape,
                discount: data.discount,

                isAccessory: true

            };

            if (id) {
                const response = await dispatch(UpdateProductById({ id, data: jsonObject })).unwrap();
                console.log("UU", response)
                if (response.status == 200) {
                    toast.success('Product updated successfully!', {
                        style: {
                            marginTop: '100px',
                            background: '#52c41a',
                            color: '#fff',
                        },
                    });
                    router.push("/showcat");
                    setIsLoading(false);
                }
            } else {
                const response = await dispatch(AddProduct(jsonObject)).unwrap();
                if (response.status == 200) {
                    toast.success('Product added successfully!', {
                        style: {
                            marginTop: '100px',
                            background: '#52c41a',
                            color: '#fff',
                        },
                    });
                    router.push("/showcat");
                    setIsLoading(false);
                }
            }
        } catch (error) {
            toast.error('Failed to process product. Please try again.', {
                style: {
                    marginTop: '100px',
                    background: '#ff4d4f',
                    color: '#fff',
                },
            });
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        marginTop: '100px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 3000,
                    error: {
                        duration: 120000,
                        style: {
                            background: '#ff4d4f',
                            color: '#fff',
                            marginTop: '100px',
                        },
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#52c41a',
                            color: '#fff',
                            marginTop: '100px',
                        },
                    },
                }}
            />
            {IsLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="text-gray-700">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)} >

                    <ComponentCard title="Add Product" className={styles.form}>
                        <div className={styles.devide}>
                            <div className={styles.left}>
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text"
                                        {...register("name")}
                                        error={!!errors.name}
                                        hint={errors.name?.message}
                                    />
                                </div>

                                <div>
                                    <Label>Price</Label>
                                    <Input type="text"
                                        {...register("price")}
                                        error={!!errors.price}
                                        hint={errors.price?.message}
                                    />
                                </div>
                                <div>
                                    <Label>TotalItems</Label>
                                    <Input type="text"
                                        {...register("totalItems")}
                                        error={!!errors.totalItems}
                                        hint={errors.totalItems?.message}
                                    />
                                </div>
                                <div>
                                    <Label>availableItems</Label>
                                    <Input type="text"
                                        {...register("availableItems")}
                                        error={!!errors.availableItems}
                                        hint={errors.availableItems?.message}
                                    />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <TextArea  {...register("description")}
                                        error={!!errors.description}
                                        hint={errors.description?.message} rows={6} />
                                </div>

                                <div>
                                    <Label>modelNo</Label>
                                    <Input type="text"
                                        {...register("modelNo")}
                                        error={!!errors.modelNo}
                                        hint={errors.modelNo?.message}
                                    />
                                </div>
                                <div>
                                    <Label>productID</Label>
                                    <Input type="text"
                                        {...register("productID")}
                                        error={!!errors.productID}
                                        hint={errors.productID?.message}
                                    />
                                </div>
                                <div>
                                    <Label>brandName</Label>
                                    <Input type="text"
                                        {...register("brandName")}
                                        error={!!errors.brandName}
                                        hint={errors.brandName?.message}
                                    />
                                </div>
                                <div>
                                    <Label>Collection Type</Label>
                                    <Select
                                        {...register("collection_type")}
                                        options={brandMap.map(b => ({ value: b.type, label: b.type }))}
                                        placeholder="Select a collection type"
                                        error={!!errors.collection_type}
                                        hint={errors.collection_type?.message}
                                        value={watch("collection_type")}
                                        onChange={val => setValue("collection_type", val, { shouldValidate: true, shouldDirty: true })}
                                    />
                                </div>
                                <div>
                                    <RadioButtons
                                        title="Gender"
                                        name="gender"
                                        register={register("gender", { required: "Please select gender" })}
                                        error={!!errors.gender}
                                        hint={errors.gender?.message}
                                        options={[
                                            { value: "Male", label: "Male" },
                                            { value: "Female", label: "Female" },
                                            { value: "Unisex", label: "Unisex" },
                                        ]}
                                        value={watch("gender")}
                                        onChange={e => setValue("gender", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>frameWidth</Label>
                                    <Input type="text"
                                        {...register("frameWidth")}
                                        error={!!errors.frameWidth}
                                        hint={errors.frameWidth?.message}
                                    />
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <div className="relative">
                                        <Select
                                            {...register("category")}
                                            options={OptionsList}
                                            placeholder="Select an option"
                                            onChange={handleSelectChange}
                                            className="dark:bg-dark-900"
                                            error={!!errors.category}
                                            hint={errors.category?.message}
                                            value={watch("category")}
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <div>
                                    <Label>frameHeight</Label>
                                    <Input type="text"
                                        {...register("frameHeight")}
                                        error={!!errors.frameHeight}
                                        hint={errors.frameHeight?.message}
                                    />
                                </div>
                                <div>
                                    <Label>frameDimention</Label>
                                    <Input type="text"
                                        {...register("frameDimention")}
                                        error={!!errors.frameDimention}
                                        hint={errors.frameDimention?.message}
                                    />
                                </div>
                                <div>
                                    <Label>frameColor</Label>
                                    <Input type="text"
                                        {...register("frameColor")}
                                        error={!!errors.frameColor}
                                        hint={errors.frameColor?.message}
                                    />
                                </div>
                                <div>
                                    <Label>Discount</Label>
                                    <Input type="text"
                                        {...register("discount")}
                                        error={!!errors.discount}
                                        hint={errors.discount?.message}
                                    />
                                </div>
                                <div>
                                    <Label>lensColor</Label>
                                    <Input type="text"
                                        {...register("lensColor")}
                                        error={!!errors.lensColor}
                                        hint={errors.lensColor?.message}
                                    />
                                </div>
                                <div>
                                    <Label>templeColor</Label>
                                    <Input type="text"
                                        {...register("templeColor")}
                                        error={!!errors.templeColor}
                                        hint={errors.templeColor?.message}
                                    />
                                </div>
                                <div>
                                    <Label>frameMaterial</Label>
                                    <Input type="text"
                                        {...register("frameMaterial")}
                                        error={!!errors.frameMaterial}
                                        hint={errors.frameMaterial?.message}
                                    />
                                </div>
                                <div>
                                    <Label>Frame Shape</Label>
                                    <Select
                                        {...register("frameShape")}
                                        options={FRAME_SHAPES.map(shape => ({ value: shape, label: shape }))}
                                        placeholder="Select a frame shape"
                                        error={!!errors.frameShape}
                                        hint={errors.frameShape?.message}
                                        value={watch("frameShape")}
                                        onChange={val => setValue("frameShape", val, { shouldValidate: true, shouldDirty: true })}
                                    />
                                </div>
                                <div>
                                    <Label>lens</Label>
                                    <Input type="text"
                                        {...register("lens")}
                                        error={!!errors.lens}
                                        hint={errors.lens?.message}
                                    />
                                </div>
                                <div>
                                    <RadioButtons
                                        title="Power Sunglasses"
                                        name="powerSunglasses"
                                        register={register("powerSunglasses", { required: "Please select an option" })}
                                        error={!!errors.powerSunglasses}
                                        hint={errors.powerSunglasses?.message}
                                        options={[
                                            { value: true, label: "Yes" },
                                            { value: false, label: "No" },
                                        ]}
                                        value={watch("powerSunglasses")}
                                        onChange={e => setValue("powerSunglasses", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>warranty</Label>
                                    <TextArea  {...register("warranty")}
                                        error={!!errors.warranty}
                                        hint={errors.warranty?.message} rows={6} />
                                </div>
                                <div>
                                    <Label>Upload Product Image</Label>
                                    <FileInput
                                        onChange={UploadSingleFile}
                                        error={!!errors.image}
                                        hint={errors.image?.message}
                                    />
                                </div>
                                {localMainUrl && (
                                    <div className={styles.imageContainer}>
                                        <div className={styles.imageWrapper}>
                                            <Image
                                                alt="product"
                                                src={localMainUrl}
                                                width={200}
                                                height={200}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label>Upload Images</Label>
                                    <FileInput
                                        onChange={handleFileChange}
                                        error={!!errors.file}
                                        hint={errors.file?.message}
                                        multiple
                                    />
                                </div>
                                <div className={styles.containerWrapper}>
                                    {localFileUrls?.length > 0 &&
                                        localFileUrls?.map((item, index) => (
                                            <div key={index} className={styles.imageContainer}>
                                                <div className={styles.imageWrapper}>
                                                    <Image
                                                        alt="product"
                                                        src={item}
                                                        width={200}
                                                        height={200}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Submit
                        </button>
                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
