"use client";
import Input from '@/components/form/input/InputField'
import React, { useState } from 'react'
import styles from "../../../../../styles/poster.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import TextArea from '@/components/form/input/TextArea'

import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddPoster, FileUpload } from '@/store/authSlice';
export default function Index() {
    const [FileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()

    const [IsLoading, setIsLoding] = useState(false)
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        console.log("File", file)
        const formData = new FormData()
        if (file) {
            const uniqueFilename = Date.now() + "-" + file.name;
            formData.append("file", file, uniqueFilename);
            dispatch(FileUpload(formData)).then((response) => {
                console.log("Response", response.payload)
                setFileUrl(response.payload.fileUrl)
                setValue("file", file, { shouldValidate: true });
            })
        }
    };

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required").min(3, "Title  must be at least 3 characters"),
        description: Yup.string().required("Description is required"),
        file: Yup
            .mixed()
            .required("Please upload a images."),
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
        setIsLoding(true)

        const jsonObject = {
            url: FileUrl,
            title: data.title,
            description: data.description
        }

        dispatch(AddPoster(jsonObject)).then((response) => {
            console.log("Res", response)
            if (response.payload.status == 200) {
                setTimeout(() => {
                    setIsLoding(false)
                }, 2000)
            }
            setIsLoding(false)
        })
        setIsLoding(false)
    };
    return (
        <div className={styles.main}>
            {IsLoading && <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>}
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>


                    <ComponentCard title="Add Poster" className={styles.form}>

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
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Submit
                        </button>

                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
