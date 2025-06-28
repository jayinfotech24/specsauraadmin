"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import TextArea from '@/components/form/input/TextArea';
import styles from "../../../../../styles/category.module.css";
import { useDispatch } from 'react-redux';
import { AddLensType, GetSingleLense, UpdateLense } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AddLens() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [lensId, setLensId] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter()
    const searchParams = useSearchParams();

    const schema = Yup.object().shape({
        lensMainType: Yup.string().required("Lens main type is required"),
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        warranty: Yup.number().typeError("Warranty must be a number").required("Warranty is required"),
        price: Yup.number().typeError("Price must be a number").required("Price is required"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    // Fetch lens data if editing
    useEffect(() => {
        const fetchLensData = async () => {
            const id = searchParams.get('id');
            if (id) {
                setIsEditing(true);
                setLensId(id);
                setIsLoading(true);
                try {
                    const response = await dispatch(GetSingleLense(id)).unwrap();
                    console.log("Res", response.lensType)
                    if (response.status == 200 && response.lensType) {
                        const lensData = response.lensType;
                        setValue('lensMainType', lensData.lensMainType);
                        setValue('name', lensData.name);
                        setValue('description', lensData.description);
                        setValue('warranty', lensData.warranty);
                        setValue('price', lensData.price);
                        toast.success('Lens data loaded successfully!');
                    }
                } catch (error) {
                    console.error("Error fetching lens:", error);
                    toast.error('Failed to load lens data');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchLensData();
    }, [dispatch, searchParams, setValue]);

    const submitHandler = async (data) => {
        setIsLoading(true);
        try {
            const dataJson = {
                lensMainType: data.lensMainType,
                name: data.name,
                description: data.description,
                warranty: data.warranty,
                price: data.price
            };
            let response;
            if (isEditing && lensId) {
                response = await dispatch(UpdateLense({ id: lensId, data: dataJson })).unwrap();
            } else {
                response = await dispatch(AddLensType(dataJson)).unwrap();
            }
            if (response.status === 200) {
                toast.success(response.message || (isEditing ? 'Lens updated successfully!' : 'Lens added successfully!'));
                router.push("/showlens")
                if (!isEditing) {
                    reset();
                }
            }
        } catch (error) {
            toast.error(isEditing ? 'Error updating lens' : 'Error adding lens');
            console.error("Error submitting lens:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ComponentCard title={isEditing ? "Edit Lens" : "Add Lens"} className={styles.form}>
                        <div>
                            <Label>Lens Main Type</Label>
                            <Input
                                type="text"
                                {...register("lensMainType")}
                                error={!!errors.lensMainType}
                                hint={errors.lensMainType?.message}
                            />
                        </div>
                        <div>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                {...register("name")}
                                error={!!errors.name}
                                hint={errors.name?.message}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <TextArea
                                {...register("description")}
                                error={!!errors.description}
                                hint={errors.description?.message}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label>Warranty (months)</Label>
                            <Input
                                type="number"
                                {...register("warranty")}
                                error={!!errors.warranty}
                                hint={errors.warranty?.message}
                            />
                        </div>
                        <div>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                {...register("price")}
                                error={!!errors.price}
                                hint={errors.price?.message}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : (isEditing ? 'Update Lens' : 'Add Lens')}
                        </button>
                    </ComponentCard>
                </form>
            </div>
        </div>
    );
}
