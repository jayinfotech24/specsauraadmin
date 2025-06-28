"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import styles from "../../../../../styles/category.module.css";
import { useDispatch } from 'react-redux';
import { AddCoatings, GetAllLens, GetSingleCoating, UpdateCoating } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AddCoating() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [lenses, setLenses] = useState([]);
    const [coatingId, setCoatingId] = useState(null);
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter()

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        lens: Yup.string().required("Lens selection is required"),
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

    // Fetch lenses for dropdown
    useEffect(() => {
        const fetchLenses = async () => {
            try {
                const response = await dispatch(GetAllLens()).unwrap();
                console.log("res", response)
                if (response.status == 200) {
                    setLenses(response.items);
                }
            } catch (error) {
                console.error("Error fetching lenses:", error);
                toast.error('Failed to load lenses');
            }
        };

        fetchLenses();
    }, [dispatch]);

    // Fetch coating data if editing
    useEffect(() => {
        const fetchCoatingData = async () => {
            const id = searchParams.get('id');
            const title = searchParams.get('title');

            if (id && title) {
                setIsEditing(true);
                setCoatingId(id);
                setIsLoading(true);
                try {
                    const response = await dispatch(GetSingleCoating(id)).unwrap();
                    console.log("Coating Data", response);
                    if (response.status == 200) {
                        const coatingData = response.coating;
                        // Populate form with fetched data
                        setValue('title', coatingData.title);
                        setValue('description', coatingData.description);
                        setValue('lens', coatingData.lens?._id || coatingData.lens);
                        setValue('price', coatingData.price);
                        toast.success('Coating data loaded successfully!');
                    }
                } catch (error) {
                    console.error("Error fetching coating:", error);
                    toast.error('Failed to load coating data');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCoatingData();
    }, [dispatch, searchParams, setValue]);

    const submitHandler = async (data) => {
        setIsLoading(true);
        try {
            const dataJson = {
                title: data.title,
                description: data.description,
                lens: data.lens,
                price: data.price
            };

            let response;
            if (isEditing && coatingId) {
                // Update existing coating
                response = await dispatch(UpdateCoating({ id: coatingId, data: dataJson })).unwrap();
                console.log("Resposne", response)

            } else {
                // Add new coating
                response = await dispatch(AddCoatings(dataJson)).unwrap();
            }
            console.log("Resposne", response)
            if (response.status == 201) {
                toast.success(response.message || (isEditing ? 'Coating updated successfully!' : 'Coating added successfully!'));
                router.push("/showcoating")
                if (!isEditing) {
                    reset(); // Reset form only for new additions
                }
            }
        } catch (error) {
            toast.error(isEditing ? 'Error updating coating' : 'Error adding coating');
            console.error("Error submitting coating:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.inner}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ComponentCard title={isEditing ? "Edit Coating" : "Add Coating"} className={styles.form}>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                {...register("title")}
                                error={!!errors.title}
                                hint={errors.title?.message}
                                placeholder="Enter coating title"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <TextArea
                                {...register("description")}
                                error={!!errors.description}
                                hint={errors.description?.message}
                                rows={4}
                                placeholder="Enter coating description"
                            />
                        </div>
                        <div>
                            <Label>Select Lens</Label>
                            <Select
                                options={lenses.map((lens) => ({
                                    value: lens._id,
                                    label: `${lens.name} - ${lens.lensMainType}`
                                }))}
                                placeholder="Select a lens"
                                onChange={(value) => setValue('lens', value)}
                                error={!!errors.lens}
                                hint={errors.lens?.message}
                                name="lens"
                            />
                        </div>
                        <div>
                            <Label>Price (₹)</Label>
                            <Input
                                type="number"
                                {...register("price")}
                                error={!!errors.price}
                                hint={errors.price?.message}
                                placeholder="Enter price"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : (isEditing ? 'Update Coating' : 'Add Coating')}
                        </button>
                    </ComponentCard>
                </form>
            </div>
        </div>
    );
}
