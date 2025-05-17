"use client";

import React, { useCallback, useEffect, useState } from 'react'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import TextArea from '@/components/form/input/TextArea'
import Image from 'next/image';
import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddPoster, FileUpload, UpdatePoster, GetPosterById } from '@/store/authSlice';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';

import styles from "../../../../../styles/poster.module.css"
import GlobalLoading from '../../../../../components/common/GlobalLoading';

export default function PosterForm() {
    const [FileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()
    const [IsLoading, setIsLoading] = useState(false)
    const [Url, setUrl] = useState(null)
    const router = useRouter()

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            const img = new window.Image();
            img.onload = function () {
                const width = this.width;
                const height = this.height;

                if (width < 1000 || height < 500) {
                    toast.error(`Image dimensions must be at least 1000x500 pixels. Current dimensions: ${width}x${height}`);
                    return;
                }

                const formData = new FormData();
                const uniqueFilename = Date.now() + "-" + file.name;
                formData.append("file", file, uniqueFilename);

                dispatch(FileUpload(formData)).then((response) => {
                    if (response.payload?.fileUrl) {
                        setFileUrl(response.payload.fileUrl);
                        setUrl(response.payload.fileUrl);
                        setValue("file", file, { shouldValidate: true });
                        toast.success('Image uploaded successfully!');
                    }
                }).catch((error) => {
                    toast.error('Failed to upload image. Please try again.', error);
                });
            };

            img.src = URL.createObjectURL(file);
        }
    };

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
        description: Yup.string().required("Description is required"),
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

    const fetchPosterById = useCallback(async (id) => {
        try {
            const response = await dispatch(GetPosterById(id)).unwrap();
            if (response.status === 200) {
                setValue("title", response.items[0].title);
                setValue("description", response.items[0].description);
                setUrl(response.items[0].url);
                toast.success('Poster details loaded successfully!');
            }
        } catch (error) {
            toast.error('Failed to load poster details');
            console.error('Error loading poster:', error);
        }
    }, [dispatch, setValue]);

    useEffect(() => {
        if (id) {
            fetchPosterById(id);
        }
    }, [id, fetchPosterById]);

    const submitHandler = async (data) => {
        setIsLoading(true);
        try {
            const jsonObject = {
                url: FileUrl || Url,
                title: data.title,
                description: data.description
            };

            if (id) {
                const response = await dispatch(UpdatePoster({ id, data: jsonObject })).unwrap();
                if (response.status === 200) {
                    toast.success('Poster updated successfully!');
                    setTimeout(() => {
                        router.push('/showposter');
                    }, 1500);
                }
            } else {
                const response = await dispatch(AddPoster(jsonObject)).unwrap();
                if (response.status === 200) {
                    toast.success('Poster added successfully!');
                    setTimeout(() => {
                        router.push('/showposter');
                    }, 1500);
                }
            }
        } catch (error) {
            toast.error(id ? 'Failed to update poster' : 'Failed to add poster');
            console.error('Error saving poster:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            {IsLoading && <GlobalLoading />}
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ComponentCard title={id ? "Update Poster" : "Add Poster"} className={styles.form}>
                        <div>
                            <Label>Title</Label>
                            <Input type="text"
                                {...register("title")}
                                error={!!errors.title}
                                hint={errors.title?.message}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <TextArea {...register("description")}
                                error={!!errors.description}
                                hint={errors.description?.message}
                                rows={6}
                            />
                        </div>

                        <div>
                            <Label>Upload file</Label>
                            <FileInput
                                onChange={handleFileChange}
                                error={!!errors.file}
                                hint={errors.file?.message}
                            />
                        </div>

                        {Url && (
                            <div className={styles.imageContainer}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        alt="poster"
                                        src={Url}
                                        width={200}
                                        height={200}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                variant="secondary"
                                onClick={() => router.push('/showposter')}
                                disabled={IsLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                type="submit"
                                disabled={IsLoading}
                            >
                                {IsLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        {id ? 'Updating...' : 'Submitting...'}
                                    </div>
                                ) : (
                                    id ? 'Update Poster' : 'Add Poster'
                                )}
                            </Button>
                        </div>
                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
