"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { useDispatch } from 'react-redux';
import { GetDashboardData } from "@/store/authSlice";
import { store } from "@/store/store";
import { useState, useEffect, useCallback } from "react"

export default function Ecommerce() {
  const dispatch = useDispatch<typeof store.dispatch>();
  const [customerData, setCustomerData] = useState<number>(0);
  const [orderData, setOrderData] = useState<number>(0);

  const getDashboardData = useCallback(async () => {
    try {
      const response = await dispatch(GetDashboardData()).unwrap();
      if (response.status === 200) {
        setCustomerData(response.customers || 0);
        setOrderData(response.orders || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics customerData={customerData} orderData={orderData} />

        {/* <MonthlySalesChart /> */}
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12 xl:col-span-7">
        {/* <RecentOrders orders={orders} /> */}
      </div>
    </div>
  );
}
