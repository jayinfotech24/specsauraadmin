"use client";
import Input from '@/components/form/input/InputField';
import React, { useState, useCallback, useEffect } from 'react';
import styles from "../../../../../styles/category.module.css";
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import TextArea from '@/components/form/input/TextArea';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import GlobalLoading from '@/components/common/GlobalLoading';
import toast from 'react-hot-toast';
import Image from 'next/image';
import FileInput from '@/components/form/input/FileInput';
import { FileUpload, AddBlog, GetBlogById, UpdateBlog } from '@/store/authSlice';

export default function BlogClientPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [url, setUrl] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const schema = Yup.object().shape({
        title: Yup.string()
            .required("Title is required")
            .min(3, "Title must be at least 3 characters"),
        description: Yup.string()
            .required("Description is required")
            .min(10, "Description must be at least 10 characters"),
        writerName: Yup.string()
            .required("Writer name is required"),

        file: Yup.mixed().when('$id', {
            is: (id) => !id,
            then: (schema) => schema.required("Please upload an image"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        context: { id: id }
    });

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setValue("file", file, { shouldValidate: true });
            const formData = new FormData();
            const uniqueFilename = Date.now() + "-" + file.name;
            formData.append("file", file, uniqueFilename);
            dispatch(FileUpload(formData)).then((response) => {
                if (response.payload && response.payload.fileUrl) {
                    setUrl(response.payload.fileUrl);
                    setFileUrl(response.payload.fileUrl);
                    toast.success('Image uploaded successfully!');
                }
            }).catch((error) => {
                toast.error('Failed to upload image. Please try again.', error);
            });
        }
    };

    const submitHandler = async (data) => {
        setIsLoading(true);
        try {
            const dataPayload = {
                title: data.title,
                description: data.description,
                writerName: data.writerName,
                url: fileUrl,

            }

            if (id) {
                dispatch(UpdateBlog({ id, data: dataPayload })).then((response) => {
                    console.log("response", response);
                    if (response.payload.status == 200) {
                        toast.success('Blog updated successfully!');
                        setTimeout(() => {
                            router.push("/showblog");
                        }, 1500);
                    }
                }).catch((error) => {
                    toast.error('Failed to update blog. Please try again.', error);
                    setIsLoading(false);
                });
            } else {
                dispatch(AddBlog(dataPayload)).then((res) => {
                    console.log("res", res);
                    if (res.payload.status == 200) {
                        toast.success('Blog created successfully!');
                        setTimeout(() => {
                            router.push("/showblog");
                        }, 1500);
                    }
                }).catch((error) => {
                    toast.error('Failed to create blog. Please try again.', error);
                });
            }
        } catch (error) {
            toast.error('Failed to process blog. Please try again.');
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetBlog = useCallback((id) => {
        dispatch(GetBlogById(id)).then((response) => {
            console.log("response", response);
            if (response.payload.status == 200) {
                setValue("title", response.payload.blog.title);
                setValue("description", response.payload.blog.description);
                setValue("writerName", response.payload.blog.writerName);
                setValue("url", response.payload.blog.url);
                setUrl(response.payload.blog.url);
            }
        }).catch((error) => {
            toast.error('Failed to load blog details. Please try again.', error);
        });
    }, [dispatch, setValue]);

    useEffect(() => {
        if (id) {
            GetBlog(id);
        }
    }, [GetBlog, id]);

    return (
        <div className={styles.main}>
            {isLoading && <GlobalLoading />}
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ComponentCard title={id ? "Update Blog" : "Create Blog"} className={styles.form}>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                {...register("title")}
                                error={!!errors.title}
                                hint={errors.title?.message}
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <TextArea
                                {...register("description")}
                                error={!!errors.description}
                                hint={errors.description?.message}
                                rows={6}
                            />
                        </div>

                        <div>
                            <Label>Writer Name</Label>
                            <Input
                                type="text"
                                {...register("writerName")}
                                error={!!errors.writerName}
                                hint={errors.writerName?.message}
                            />
                        </div>


                        <div>
                            <Label>Upload Image</Label>
                            <FileInput
                                onChange={handleFileChange}
                                className="custom-class"
                                error={!!errors.file}
                                hint={errors.file?.message}
                            />
                        </div>

                        {url && (
                            <div className={styles.imageContainer}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        alt="blog"
                                        src={url}
                                        width={200}
                                        height={200}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {id ? "Update" : "Create"} Blog
                        </button>
                    </ComponentCard>
                </form>
            </div>
        </div>
    );
} 