"use client";
import Input from '@/components/form/input/InputField'
import React, { useEffect, useState } from 'react'
import styles from "../../../../../styles/category.module.css"
import Label from '@/components/form/Label'
import ComponentCard from '@/components/common/ComponentCard'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AddGstData, GetSingleGstRate, UpdateGst } from '@/store/authSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import GlobalLoading from '@/components/common/GlobalLoading';
import toast from 'react-hot-toast';

export default function AddGst() {



    const dispatch = useDispatch();
    const [IsLoading, setIsLoding] = useState(false);

    const [isNavigating, setIsNavigating] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    const id = searchParams.get('id');


    // Clean up local URL when component unmounts


    const schema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters"),
        rate: Yup.string().required("Rate is required"),

    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        context: { id: id } // Pass the id to the validation context
    });

    console.log("Errors", errors)

    const submitHandler = async (data) => {
        setIsLoding(true);
        try {


            const jsonObject = {
                gst: data.rate,
                name: data.name,

            };


            console.log("OO", jsonObject, id)
            if (id) {
                console.log("Id", id)
                const response = await dispatch(UpdateGst({ id, data: jsonObject })).unwrap();
                console.log("Response", response)
                if (response.status == 200) {
                    toast.success('Rate updated successfully!');
                    setIsNavigating(true);
                    router.push("/showgst");
                    setIsLoding(false);
                }
            } else {
                const response = await dispatch(AddGstData(jsonObject)).unwrap();
                console.log("Response", response)
                if (response.status == 201) {
                    toast.success('Rate added successfully!');
                    setIsNavigating(true);
                    router.push("/showgst");
                    setIsLoding(false);
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to process category. Please try again.');
            console.log("Error submitting form:", error);
        } finally {
            setIsLoding(false);
        }
    };
    useEffect(() => {
        const fetchCoatingData = async () => {
            const id = searchParams.get('id');


            if (id) {

                setIsLoding(true);
                try {
                    const response = await dispatch(GetSingleGstRate(id)).unwrap();
                    console.log("Gst Data", response);
                    if (response.status == 200) {
                        const rateitem = response.gstRate;
                        // Populate form with fetched data
                        setValue('name', rateitem?.name);
                        setValue('rate', rateitem?.gst);

                        // toast.success('Coating data loaded successfully!');
                    }
                } catch (error) {
                    console.error("Error fetching Gst:", error);
                    toast.error('Failed to load gst data');
                } finally {
                    setIsLoding(false);
                }
            }
        };

        fetchCoatingData();
    }, [dispatch, searchParams, setValue]);


    return (
        <div className={styles.main}>
            {
                (IsLoading || isNavigating) && <GlobalLoading />
            }
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>


                    <ComponentCard title={id ? "Update Rate" : "Add Rate"} className={styles.form}>

                        <div>
                            <Label>Type</Label>
                            <Input type="text"
                                {...register("name")}
                                error={!!errors.name}
                                hint={errors.name?.message}
                            />
                        </div>
                        <div>
                            <Label>Rate</Label>
                            <Input type="text"  {...register("rate")}
                                error={!!errors.rate}
                                hint={errors.rate?.message} />
                        </div>




                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            {id ? "Update" : "Submit"}
                        </button>

                    </ComponentCard>
                </form>
            </div>
        </div>
    )
}
