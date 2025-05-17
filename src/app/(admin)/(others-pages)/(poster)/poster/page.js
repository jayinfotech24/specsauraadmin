"use client";
import Input from '@/components/form/input/InputField'
import React, { useCallback, useEffect, useState } from 'react'
import styles from "../../../../../styles/poster.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import TextArea from '@/components/form/input/TextArea'
import Image from 'next/image';
import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddPoster, FileUpload, UpdatePoster, GetPosterDetail } from '@/store/authSlice';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Index() {
    const [FileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()
    const [IsLoading, setIsLoding] = useState(false)
    const [Url, setUrl] = useState(null)
    const router = useRouter()

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        console.log("File", file)

        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            // Create an image object to check dimensions
            const img = new window.Image();
            img.onload = function () {
                const width = this.width;
                const height = this.height;

                // Check minimum dimensions
                if (width < 1000 || height < 500) {
                    alert(`Image dimensions must be at least 1000x500 pixels. Current dimensions: ${width}x${height}`);
                    return;
                }

                // If validation passes, proceed with upload
                const formData = new FormData();
                const uniqueFilename = Date.now() + "-" + file.name;
                formData.append("file", file, uniqueFilename);

                dispatch(FileUpload(formData)).then((response) => {
                    console.log("Response", response.payload)
                    setFileUrl(response.payload.fileUrl)
                    setValue("file", file, { shouldValidate: true });
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

    const submitHandler = (data) => {
        setIsLoding(true)

        const jsonObject = {
            url: FileUrl || Url,
            title: data.title,
            description: data.description
        }

        if (id) {
            dispatch(UpdatePoster({ id, data: jsonObject })).then((response) => {
                console.log("ResU", response);
                if (response.payload.status === 200) {
                    router.push("/showposter");
                }
            });
        } else {
            dispatch(AddPoster(jsonObject)).then((response) => {
                console.log("Res", response)
                if (response.payload.status == 200) {
                    setTimeout(() => {
                        setIsLoding(false)
                    }, 2000)
                }
                setIsLoding(false)
            })
        }
    };

    const GetPosterById = useCallback((id) => {
        dispatch(GetPosterDetail(id)).then((response) => {
            console.log("Response", response)
            if (response.payload) {
                setValue("title", response.payload.title)
                setValue("description", response.payload.description)
                setUrl(response.payload.url)
            }
        })
    }, [dispatch, setValue])

    useEffect(() => {
        if (id) {
            GetPosterById(id)
        }
    }, [GetPosterById, id])

    return (
        <div className={styles.main}>
            {IsLoading && <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>}
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
                            <TextArea  {...register("description")}
                                error={!!errors.description}
                                hint={errors.description?.message} rows={6} />
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
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            {id ? "Update" : "Submit"}
                        </button>
                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
