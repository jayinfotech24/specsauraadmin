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
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            const img = new window.Image();
            img.onload = function () {


                // Validate image dimensions
                // if (width < 800 || height < 400) {
                //     toast.error(`Image dimensions must be at least 800x400 pixels. Current dimensions: ${width}x${height}`);
                //     return;
                // }

                // Create local URL for preview
                const localUrl = URL.createObjectURL(file);
                setUrl(localUrl); // Set local URL for preview
                setSelectedFile(file);
                setValue("file", file, { shouldValidate: true });
            };

            img.onerror = () => {
                toast.error('Invalid image file. Please try again.');
            };

            img.src = URL.createObjectURL(file);
        }
    };

    // Clean up local URL when component unmounts
    useEffect(() => {
        return () => {
            if (url && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        };
    }, [url]);

    const submitHandler = async (data) => {
        setIsLoading(true);
        if (!selectedFile && !id) {
            toast.error('Please upload an image');
            return;
        }


        try {
            let finalUrl = url; // Use existing URL if updating

            // Only upload file if it's a new file or new blog
            if (selectedFile && (!id || selectedFile !== url)) {
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

            const dataPayload = {
                title: data.title,
                description: data.description,
                writerName: data.writerName,
                url: finalUrl,
            };

            if (id) {
                const response = await dispatch(UpdateBlog({ id, data: dataPayload })).unwrap();
                console.log("Response", response);
                if (response.status == 200) {

                    toast.success('Blog updated successfully!');

                    router.push("/showblog");
                    setIsLoading(false);

                }
            } else {
                const response = await dispatch(AddBlog(dataPayload)).unwrap();
                console.log("Response", response);
                if (response.status == 200) {

                    toast.success('Blog created successfully!');

                    router.push("/showblog");
                    setIsLoading(false);

                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to process blog. Please try again.');
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