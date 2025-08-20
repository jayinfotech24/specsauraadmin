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
import { AddAccessory, FileUpload, GetaccessoryById, GetCategory, UpdateAccessory } from '@/store/authSlice';


import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation'

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

    const schema = Yup.object().shape({
        name: Yup.string().required("Please enter accessory name."),

        price: Yup.number().typeError("Price must be a number").required("Please enter price."),
        totalItems: Yup.number().typeError("Total items must be a number").required("Please enter total items."),
        availableItems: Yup.number().typeError("Available items must be a number").required("Please enter available items."),
        description: Yup.string().required("Please enter description."),
        brandName: Yup.string().required("Please enter brand name."),
        modelNo: Yup.string().required("Please enter model number."),
        productID: Yup.string().required("Please enter product ID."),


        warranty: Yup.string().required("Please enter warranty information."),

        file: Yup.mixed().when('$id', {
            is: (id) => !id, // When there is no id (creating new)
            then: (schema) => schema.required("Please upload accessory images"), // Apply validation
            otherwise: (schema) => schema.notRequired(), // No validation when updating
        }),
        image: Yup.mixed().when('$id', {
            is: (id) => !id, // When there is no id (creating new)
            then: (schema) => schema.required("Please upload a main accessory image"), // Apply validation
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
    const router = useRouter();

    const id = searchParams.get('id'); // Safe to call directly
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },


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

    const GetAccessoryById = useCallback(() => {
        dispatch(GetaccessoryById(id)).then((response) => {
            console.log("Response", response)
            if (response.payload) {

                const data = response.payload.accessory || response.payload.data;

                setValue("name", data.name || "");

                setValue("price", data.price || 0);
                setValue("totalItems", data.totalItems || 0);
                setValue("availableItems", data.availableItems || 0);
                setValue("description", data.description || "");
                setValue("brandName", data.brandName || "");
                setValue("modelNo", data.modelNo || "");
                setValue("productID", data.productID || "");

                setValue("warranty", data.warranty || "");

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
            GetAccessoryById()
        }

    }, [GetAccessoryById, id])

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

                category: "680fb9063dbd062321772ec6",
                price: data.price,
                totalItems: data.totalItems,
                availableItems: data.availableItems,
                url: finalMainUrl,
                images: finalFileUrls,
                description: data.description,
                brandName: data.brandName,
                modelNo: data.modelNo,
                productID: data.productID,

                warranty: data.warranty,

                discount: data.discount,

                isAccessory: true,


            };

            if (id) {
                const response = await dispatch(UpdateAccessory({ id, data: jsonObject })).unwrap();
                console.log("UU", response)
                if (response.status == 200) {
                    toast.success('Accessory updated successfully!', {
                        style: {
                            marginTop: '100px',
                            background: '#52c41a',
                            color: '#fff',
                        },
                    });
                    router.push("/showaccessory");
                    setIsLoading(false);
                }
            } else {
                const response = await dispatch(AddAccessory(jsonObject)).unwrap();
                if (response.status == 200) {
                    toast.success('Accessory added successfully!', {
                        style: {
                            marginTop: '100px',
                            background: '#52c41a',
                            color: '#fff',
                        },
                    });
                    router.push("/showaccessory");
                    setIsLoading(false);
                }
            }
        } catch (error) {
            toast.error('Failed to process accessory. Please try again.', {
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

                    <ComponentCard title="Add Accessory" className={styles.form}>
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




                            </div>
                            <div className={styles.right}>

                                <div>
                                    <Label>Discount</Label>
                                    <Input type="text"
                                        {...register("discount")}
                                        error={!!errors.discount}
                                        hint={errors.discount?.message}
                                    />
                                </div>



                                <div>
                                    <Label>warranty</Label>
                                    <TextArea  {...register("warranty")}
                                        error={!!errors.warranty}
                                        hint={errors.warranty?.message} rows={6} />
                                </div>
                                <div>
                                    <Label>Upload Accessory Image</Label>
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
                                                alt="accessory"
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
                                                        alt="accessory"
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
