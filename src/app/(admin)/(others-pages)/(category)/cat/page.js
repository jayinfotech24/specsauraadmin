"use client";
import Input from '@/components/form/input/InputField'
import React from 'react'
import styles from "../../../../../styles/category.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'
import TextArea from '@/components/form/input/TextArea'

import FileInput from '@/components/form/input/FileInput';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
export default function Index() {
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    const schema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
    });


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const submitHandler = (data) => {
        console.log(data);
    };
    return (
        <div className={styles.main}>
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
                            <TextArea rows={6} />
                        </div>

                        <div>
                            <Label>Upload file</Label>
                            <FileInput onChange={handleFileChange} className="custom-class" />
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
