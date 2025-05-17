"use client";
import Input from '@/components/form/input/InputField'
import React, { useState, useEffect } from 'react'
import styles from "../../../../../styles/poster.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddVideo, FileUpload, GetVideoById, UpdateVideo } from '@/store/authSlice';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';

export default function Index() {
    const [FileUrl, setFileUrl] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoId = searchParams.get('id');
    const [IsLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
        file: Yup
            .mixed()
            .test('fileType', 'Only video files are allowed', (value) => {
                if (!value) return true; // Skip validation if no file is selected
                return value.type.startsWith('video/');
            })
            .test('fileSize', 'File size is too large', (value) => {
                if (!value) return true; // Skip validation if no file is selected
                return value.size <= 100 * 1024 * 1024; // 100MB
            }),
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchVideoDetails = async () => {
            setIsLoading(true);
            try {
                const response = await dispatch(GetVideoById(videoId)).unwrap();
                console.log("Response", response)
                if (response.status === 200) {
                    const videoData = response.items[0];
                    setValue("title", videoData.title);
                    setFileUrl(videoData.url);
                    toast.success('Video details loaded successfully!');
                }
            } catch (error) {
                console.error("Error fetching video details:", error);
                toast.error('Failed to load video details');
            }
            setIsLoading(false);
        };

        if (videoId) {
            fetchVideoDetails();
        }
    }, [videoId, dispatch, setValue]);


    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check if file is a video
            if (!file.type.startsWith('video/')) {
                toast.error('Please upload a video file');
                return;
            }

            // Check file size (e.g., max 100MB)
            const maxSize = 100 * 1024 * 1024; // 100MB in bytes
            if (file.size > maxSize) {
                toast.error('Video file size should not exceed 100MB');
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

            setIsLoading(true);
            dispatch(FileUpload(formData))
                .then((response) => {
                    if (response.payload?.fileUrl) {
                        setFileUrl(response.payload.fileUrl);
                        setValue("file", fileInfo, { shouldValidate: true });
                        toast.success('Video uploaded successfully!');
                    }
                })
                .catch(error => {
                    console.error("Upload error:", error);
                    toast.error("Error uploading file. Please try again.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const submitHandler = async (data) => {
        if (!FileUrl) {
            toast.error("Please upload a video file first");
            return;
        }

        setIsSubmitting(true);
        const jsonObject = {
            url: FileUrl,
            title: data.title,
        };

        try {
            if (videoId) {
                // Update existing video
                const response = await dispatch(UpdateVideo({ id: videoId, ...jsonObject })).unwrap();
                if (response.status === 200) {
                    toast.success('Video updated successfully!');
                    setTimeout(() => {
                        router.push('/showvideo');
                    }, 1500);
                }
            } else {
                // Add new video
                const response = await dispatch(AddVideo(jsonObject)).unwrap();
                if (response.status === 200) {
                    toast.success('Video added successfully!');
                    // Reset form after successful submission
                    setFileUrl(null);
                    reset();
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(videoId ? "Error updating video" : "Error adding video");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.main}>
            {IsLoading && <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>}
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ComponentCard title={videoId ? "Update Video" : "Add Video"} className={styles.form}>
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
                            <Label>Upload file</Label>
                            <FileInput
                                onChange={handleFileChange}
                                error={!!errors.file}
                                hint={errors.file?.message}
                            />
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        {videoId ? 'Updating...' : 'Submitting...'}
                                    </div>
                                ) : (
                                    videoId ? 'Update Video' : 'Add Video'
                                )}
                            </Button>
                            {videoId && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => router.push('/showvideo')}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </ComponentCard>
                </form>
            </div>
        </div>
    );
}
