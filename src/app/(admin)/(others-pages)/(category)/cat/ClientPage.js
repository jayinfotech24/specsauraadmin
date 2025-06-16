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
import GlobalLoading from '@/components/common/GlobalLoading';
import toast from 'react-hot-toast';

export default function Index() {

    const [selectedFile, setSelectedFile] = useState(null);

    const dispatch = useDispatch();
    const [IsLoading, setIsLoding] = useState(false);
    const [Url, setUrl] = useState(null);
    const router = useRouter();

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Create local URL for preview
            const localUrl = URL.createObjectURL(file);
            setUrl(localUrl); // Set local URL for preview
            setSelectedFile(file);
            setValue("file", file, { shouldValidate: true });
        }
    };

    // Clean up local URL when component unmounts
    useEffect(() => {
        return () => {
            if (Url && Url.startsWith('blob:')) {
                URL.revokeObjectURL(Url);
            }
        };
    }, [Url]);

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

    const submitHandler = async (data) => {
        setIsLoding(true);
        try {
            let finalUrl = Url; // Use existing URL if updating

            // Only upload file if it's a new file or new category
            if (selectedFile && (!id || selectedFile !== Url)) {
                const formData = new FormData();
                const uniqueFilename = Date.now() + "-" + selectedFile.name;
                formData.append("file", selectedFile, uniqueFilename);

                const uploadResponse = await dispatch(FileUpload(formData)).unwrap();
                if (uploadResponse?.fileUrl) {
                    finalUrl = uploadResponse.fileUrl;

                    setUrl(uploadResponse.fileUrl);
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            const jsonObject = {
                url: finalUrl,
                title: data.name,
                description: data.description
            };

            if (id) {
                const response = await dispatch(UpdateCategoryId({ id, data: jsonObject })).unwrap();
                console.log("Response", response)
                if (response.status == 200) {
                    toast.success('Category updated successfully!');

                    router.push("/showcat");
                    setIsLoding(false);
                }
            } else {
                const response = await dispatch(AddCategory(jsonObject)).unwrap();
                console.log("Response", response)
                if (response.status == 200) {
                    toast.success('Category added successfully!');

                    router.push("/showcat");
                    setIsLoding(false);
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to process category. Please try again.');
            console.error("Error submitting form:", error);
        } finally {
            setIsLoding(false);
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
        }).catch((error) => {
            toast.error('Failed to load category details. Please try again.', error);
        });
    }, [dispatch, setValue])

    useEffect(() => {
        if (id) {
            GetCategoryById(id)
        }
    }, [GetCategoryById, id])
    return (
        <div className={styles.main}>
            {IsLoading && <GlobalLoading />
            }
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>


                    <ComponentCard title={id ? "Update Category" : "Add Category"} className={styles.form}>

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
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            {id ? "Update" : "Submit"}
                        </button>

                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
