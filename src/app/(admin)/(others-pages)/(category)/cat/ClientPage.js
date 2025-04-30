"use client";
import Input from '@/components/form/input/InputField'
import React, { useCallback, useEffect, useState } from 'react'
import styles from "../../../../../styles/category.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import TextArea from '@/components/form/input/TextArea'
import Image from 'next/image';
import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddCategory, CategoryDetail, FileUpload, UpdateCategoryId } from '@/store/authSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Index() {

    const [FileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()
    const [IsLoading, setIsLoding] = useState(false)
    const [Url, setUrl] = useState(null)
    const router = useRouter()

    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // Safe to call directly
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("file", file, { shouldValidate: true });
            const formData = new FormData();
            const uniqueFilename = Date.now() + "-" + file.name;
            formData.append("file", file, uniqueFilename);
            dispatch(FileUpload(formData)).then((response) => {
                if (response.payload && response.payload.fileUrl) {
                    setUrl(response.payload.fileUrl);
                    setFileUrl(response.payload.fileUrl);
                }
            });
        }
    };


    const schema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters"),
        description: Yup.string().required("Description is required"),
        file: Yup.mixed().when('$id', {
            is: (id) => !id, // When there is no id (creating new)
            then: (schema) => schema.required("Please upload an image"), // Apply validation
            otherwise: (schema) => schema.notRequired(), // No validation when updating
        }),
    });






    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        context: { id: id } // Pass the id to the validation context
    });


    console.log("Errors", errors)

    const submitHandler = (data) => {
        setIsLoding(true)

        const jsonObject = {
            url: FileUrl,
            title: data.name,
            description: data.description
        }
        console.log("Object", jsonObject)
        if (id) {
            if (id) {
                dispatch(UpdateCategoryId({ id, data: jsonObject })).then((response) => {
                    console.log("ResU", response);
                    if (response.payload.status === 200) {
                        router.push("/showcat");
                    }
                });
            }

        } else {
            dispatch(AddCategory(jsonObject)).then((response) => {
                console.log("Res", response)
                if (response.payload.status == 200) {
                    setIsLoding(false)

                }
                setIsLoding(false)
            })
        }


    };


    const GetCategoryById = useCallback((id) => {
        dispatch(CategoryDetail(id)).then((response) => {
            console.log("Responsonse", response)
            if (response.payload) {
                setValue("name", response.payload.title)

                setValue("description", response.payload.description)
                setUrl(response.payload.url)
            }
        })
    }, [dispatch, setValue])

    useEffect(() => {
        if (id) {
            GetCategoryById(id)
        }
    }, [GetCategoryById, id])
    return (
        <div className={styles.main}>
            {IsLoading && <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>}
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>


                    <ComponentCard title="Add Category" className={styles.form}>

                        <div>
                            <Label>Name</Label>
                            <Input type="text"
                                {...register("name")}
                                error={!!errors.name}
                                hint={errors.name?.message}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <TextArea  {...register("description")}
                                error={!!errors.description}
                                hint={errors.description?.message} rows={6} />
                        </div>

                        <div>
                            <Label>Upload file</Label>
                            <FileInput
                                onChange={handleFileChange}
                                className="custom-class"
                                // {...register("file")}
                                error={!!errors.file}
                                hint={errors.file?.message}
                            />
                        </div>

                        {
                            Url != null && (
                                <div className={styles.imageContainer}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            alt="category"
                                            src={Url}
                                            width={200}
                                            height={200}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Submit
                        </button>

                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
