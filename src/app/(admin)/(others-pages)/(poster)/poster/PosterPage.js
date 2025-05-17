"use client";

import React, { useState } from 'react'
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
import { AddPoster, FileUpload } from '@/store/authSlice';
import { useSearchParams } from 'next/navigation';

import styles from "../../../../../styles/poster.module.css"

export default function PosterForm() {
    const [FileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()
    const [IsLoading, setIsLoading] = useState(false)
    const [Url, setUrl] = useState(null)

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        console.log("File", file)

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            const img = new window.Image();
            img.onload = function () {
                const width = this.width;
                const height = this.height;

                if (width < 1000 || height < 500) {
                    alert(`Image dimensions must be at least 1000x500 pixels. Current dimensions: ${width}x${height}`);
                    return;
                }

                const formData = new FormData();
                const uniqueFilename = Date.now() + "-" + file.name;
                formData.append("file", file, uniqueFilename);

                dispatch(FileUpload(formData)).then((response) => {
                    console.log("Response", response.payload)
                    setFileUrl(response.payload.fileUrl)
                    setUrl(response.payload.fileUrl)
                    setValue("file", file, { shouldValidate: true });
                });
            };

            img.src = URL.createObjectURL(file);
        }
    };

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
        description: Yup.string().required("Description is required"),
        // file: Yup.mixed().when('$id', {
        //     is: (id) => !id,
        //     then: (schema) => schema.required("Please upload an image"),
        //     otherwise: (schema) => schema.notRequired(),
        // }),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),

    });

    const submitHandler = (data) => {
        setIsLoading(true)

        const jsonObject = {
            url: FileUrl || Url,
            title: data.title,
            description: data.description
        }


        dispatch(AddPoster(jsonObject)).then((response) => {
            console.log("Res", response)
            if (response.payload.status == 200) {
                setTimeout(() => {
                    setIsLoading(false)
                }, 2000)
            }
            setIsLoading(false)
        })

    };




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

                        <button type="submit" className={styles.submitButton}>
                            {id ? "Update" : "Submit"}
                        </button>
                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
