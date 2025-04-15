"use client";
import Input from '@/components/form/input/InputField'
import React, { useState } from 'react'
import styles from "../../../../../styles/login.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
export default function index() {
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    const schema = Yup.object().shape({
        email: Yup.string().email("Please enter valid email.").required("Please enter your email."),
        password: Yup.string().required("Please enter your password.")
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


                    <ComponentCard title="Admin Login" className={styles.form}>

                        <div>
                            <Label>Email</Label>
                            <Input type="text"
                                {...register("email")}
                                error={!!errors.email}
                                hint={errors.email?.message}
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="text"
                                {...register("password")}
                                error={!!errors.password}
                                hint={errors.password?.message}
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
