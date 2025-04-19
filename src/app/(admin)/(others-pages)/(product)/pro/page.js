"use client"

import React, { useEffect } from 'react'
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
import { AddCategory, AddProduct, FileUpload, GetCategory } from '@/store/authSlice';
import SelectInputs from '@/components/form/form-elements/SelectInputs'
import Select from '@/components/form/Select'
import { ChevronDownIcon } from '@/icons'
import Checkbox from '@/components/form/input/Checkbox'
import RadioButtons from '@/components/form/form-elements/RadioButtons'
export default function page() {
    const schema = Yup.object().shape({
        name: Yup.string().required("Please enter product name."),
        color: Yup.string().required("Please enter color."),
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
        file: Yup
            .mixed()
            .required("Please upload a images."),
        image: Yup
            .mixed()
            .required("Please upload a image."),
    });



    const [FileUrls, setFileUrls] = useState([]);
    const [MainUrl, setMainUrl] = useState(null)
    const [OptionsList, setOptions] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const handleFileChange = async (event) => {
        const files = event.target.files;
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            const uniqueFilename = `${Date.now()}-${file.name}`;
            formData.append("file", file, uniqueFilename);

            try {
                // Use await here to wait for the file upload response before moving to the next one
                const response = await dispatch(FileUpload(formData)).unwrap();

                if (response?.fileUrl) {
                    uploadedUrls.push(response.fileUrl);
                }
            } catch (error) {
                console.error("File upload failed:", error);
            }
        }

        // After all uploads are complete, log the uploaded URLs
        console.log("Upload", uploadedUrls);

        // Save all URLs in state and update the form
        setFileUrls(uploadedUrls);
        setValue("file", uploadedUrls, { shouldValidate: true });
    };

    const UploadSingleFile = async (event) => {
        const file = event.target.files?.[0];

        const formData = new FormData()
        if (file) {
            const uniqueFilename = Date.now() + "-" + file.name;
            formData.append("file", file, uniqueFilename);
            dispatch(FileUpload(formData)).then((response) => {
                console.log("Response", response.payload)
                setMainUrl(response.payload.fileUrl)
                setValue("image", file, { shouldValidate: true });
            })
        }
    }




    const GetCategoryList = () => {
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
    }


    useEffect(() => {
        GetCategoryList()
    }, [])
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });
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
        setIsLoading(true)
        const jsonObject = {
            name: data.name,
            color: data.color,
            category: data.category,
            price: data.price,
            totalItems: data.totalItems,
            availableItems: data.availableItems,
            url: MainUrl,
            images: FileUrls,
            description: data.description,
            brandName: data.brandName,
            modelNo: data.modelNo,     // instead of hardcoded, use from form if needed
            productID: data.productID, // same here
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
            warranty: data.warranty
        };


        dispatch(AddProduct(jsonObject)).then((response) => {
            console.log("res", response)
            setIsLoading(false)
        }).catch((error) => {
            console.log("EE", error)
            setIsLoading(false)
        })
    }


    return (
        <div className={styles.main}>
            {IsLoading && <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>}


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
                                    <Label>Color</Label>
                                    <Input type="text"
                                        {...register("color")}
                                        error={!!errors.color}
                                        hint={errors.color?.message}
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
                                        multiple
                                    />
                                </div>

                                <div>
                                    <Label>Upload Images</Label>
                                    <FileInput
                                        onChange={handleFileChange}
                                        error={!!errors.file}
                                        hint={errors.file?.message}
                                        multiple
                                    />
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
