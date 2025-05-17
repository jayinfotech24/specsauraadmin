"use client";
import Input from '@/components/form/input/InputField'
import React, { useState } from 'react'
import styles from "../../../../../styles/poster.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'


import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddVideo, FileUpload } from '@/store/authSlice';
export default function Index() {
    const [FileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()

    const [IsLoading, setIsLoding] = useState(false)
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        console.log("File", file)

        if (file) {
            // Check if file is a video
            if (!file.type.startsWith('video/')) {
                alert('Please upload a video file');
                return;
            }

            // Check file size (e.g., max 100MB)
            const maxSize = 100 * 1024 * 1024; // 100MB in bytes
            if (file.size > maxSize) {
                alert('Video file size should not exceed 100MB');
                return;
            }

            const formData = new FormData();
            const uniqueFilename = Date.now() + "-" + file.name;
            formData.append("file", file, uniqueFilename);

            // Create a serializable object for the file
            const fileInfo = {
                name: file.name,
                size: file.size,
                type: file.type
            };

            dispatch(FileUpload(formData)).then((response) => {
                console.log("Response", response.payload)
                if (response.payload?.fileUrl) {
                    setFileUrl(response.payload.fileUrl);
                    setValue("file", fileInfo, { shouldValidate: true });
                }
            }).catch(error => {
                console.error("Upload error:", error);
                alert("Error uploading file. Please try again.");
            });
        }
    };

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required").min(3, "Title  must be at least 3 characters"),
        file: Yup
            .mixed()
            .required("Please upload a video file.")
            .test('fileType', 'Only video files are allowed', (value) => {
                if (!value) return false;
                return value.type.startsWith('video/');
            })
            .test('fileSize', 'File size is too large', (value) => {
                if (!value) return false;
                return value.size <= 100 * 1024 * 1024; // 100MB
            }),
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
        if (!FileUrl) {
            alert("Please upload a video file first");
            return;
        }

        setIsLoding(true);
        const jsonObject = {
            url: FileUrl,
            title: data.title,
        };

        dispatch(AddVideo(jsonObject))
            .then((response) => {
                console.log("Res", response);
                if (response.payload?.status === 200) {
                    // Reset form after successful submission
                    setFileUrl(null);
                    setValue("file", null);
                    setValue("title", "");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error adding video. Please try again.");
            })
            .finally(() => {
                setIsLoding(false);
            });
    };
    return (
        <div className={styles.main}>
            {IsLoading && <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>}
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>


                    <ComponentCard title="Add Video" className={styles.form}>

                        <div>
                            <Label>Title</Label>
                            <Input type="text"
                                {...register("title")}
                                error={!!errors.title}
                                hint={errors.title?.message}
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
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Submit
                        </button>

                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
