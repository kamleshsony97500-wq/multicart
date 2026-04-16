"use client";

import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { IUser } from "@/model/user.model";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";


const Dashboard = () => {
  UseGetAllOrdersData();
  UseGetAllProductsData();
  UseGetAllVendors();

  const { allVendorsData, allProductsData } = useSelector((state: RootState) => state.vendor);
  const { allOrdersData } = useSelector((state: RootState) => state.user)

  const vendors = allVendorsData || [];
  const pendingVendors = allVendorsData.filter((v) => v.verificationStatus === "pending")
  const products = allProductsData || [];
  const pendingProducts = allProductsData.filter((p) => p.verificationStatus === "pending")
  const orders = allOrdersData || [];


  const deliveredOrders = allOrdersData.filter((o) => o.orderStatus === "delivered")
  let totalEarning = 0;
  deliveredOrders.forEach((o) => {
    if (o.isPaid) {
      totalEarning += o.totalAmount
    }
  });


  // add for graph chat ke liye \\
  const vendorOderGraph: { vendor: string; orders: number }[] = [];


  // har order ek ek kar dekho //
  for (let i = 0; i < allOrdersData.length; i++) {
    const order = allOrdersData[i];

    // vendor ka name likho //
    let vendorName = order.productVendor?.shopName || "unknown";

    if (vendorName.length > 14) {
      vendorName = vendorName.slice(0, 14) + "...";
    }

    // check karo: vendor pahile se array hai aay nahi //
    let found = false;

    for (let j = 0; j < vendorOderGraph.length; j++) {
      if (vendorOderGraph[j].vendor === vendorName) {
        vendorOderGraph[j].orders = vendorOderGraph[j].orders + 1;
        found = true;
        break;
      }

    }


    // agar vendor nahi mila to naya add karo //
    if (!found) {
      vendorOderGraph.push({
        vendor: vendorName,
        orders: 1
      })
    }
  }

  // for statusbox ke liye data //
  const cancelledOrders = allOrdersData.filter(
    (o: any) => o.orderStatus === "cancelled"
  )

  const returnedOrders = allOrdersData.filter(
    (o: any) => o.orderStatus === "returned"
  )

  const remainingOrders = allOrdersData.filter(
    (o: any) =>
      !["delivered", "cancelled", "returned"].includes(o.orderStatus)
  )

  // for pichart data //
  const orderPrgress = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnedOrders.length }
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f97316"];


  const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  return (
    <div className='w-full min-h-screen px-4 sm:px-6 py-6 text-white'>
      <div className="max-h-full mx-auto space-y-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Statebox title="Total Vendors" value={vendors.length} />
          <Statebox title="Pending Vendors" value={pendingVendors.length} />
          <Statebox title="Total Products" value={products.length} />
          <Statebox title="Pending Products" value={pendingProducts.length} />
          <Statebox title="Total Orders" value={orders.length} />
          <Statebox title="Total Earnings" value={`₹ ${totalEarning}`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            vendors.map((vendor: IUser, i: number) => {

              const vendorProducts = allProductsData.filter(
                (p: any) =>
                  String(p.vendor?._id || p.vendor) ===
                  String(vendor._id)
              );

              const vendorOrders = allOrdersData.filter(
                (o: any) =>
                  String(o.productVendor?._id || o.productVendor) ===
                  String(vendor._id)
              );

              const cancelled = vendorOrders.filter(
                (o: any) => o.orderStatus === "cancelled"
              ).length;

              const returned = vendorOrders.filter(
                (o: any) => o.orderStatus === "returned"
              ).length;

              const delivered = vendorOrders.filter(
                (o: any) => o.orderStatus === "delivered"
              ).length;

              let vendorEarning = 0;
              vendorOrders.forEach((o: any) => {
                if (o.orderStatus === "delivered" && o.isPaid) {
                  vendorEarning += o.totalAmount
                }
              })


              return (
                <div key={i} className="bg-white/5 mt-4 border border-white/10 p-4 rounded-xl">
                  <h2 className="text-base font-semibold truncate">
                    {vendor.shopName}
                  </h2>
                  <p className="text-xs text-gray-400 mb-2">
                    Status:{" "}<span className={`capitalize ${vendor.verificationStatus === "approved"
                      ? "text-green-400"
                      : "text-yellow-400"
                      }`}>
                      {vendor.verificationStatus}
                    </span>
                  </p>

                  <div className="text-sm space-y-1">
                    <p>Products: {vendorProducts.length}</p>
                    <p>Orders: {vendorOrders.length}</p>

                    <p className="text-green-400">
                      Delivered: {delivered}
                    </p>

                    <p className="text-red-400">
                      Cancelled: {cancelled}
                    </p>
                    <p className="text-orange-400">
                      Returned: {returned}
                    </p>

                    <p className="text-green-400 font-semibold">
                      Earnings: ₹ {vendorEarning}
                    </p>
                  </div>
                </div>
              )
            })
          }
        </div>


        {/* charts in value show */}
         <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6 mt-4">

          {/* ================= VENDOR CHART ================= */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-113 flex flex-col">

            <h2 className="mb-4 text-lg font-semibold">
              Vendor-wise Orders
            </h2>

            <div className="flex-1 w-full">
              <Chart
                type="bar"
                height={350}
                width="100%"
                series={[
                  {
                    name: "Orders",
                    data: vendorOderGraph.map((item) => item.orders),
                  },
                ]}
                options={{
                  chart: {
                    toolbar: { show: false },
                    animations: {
                      enabled: true,
                      speed: 800,
                    },
                  },

                  xaxis: {
                    categories: vendorOderGraph.map((item) => item.vendor),
                    labels: {
                      rotate: -20,
                      style: {
                        fontSize: "10px",
                      },
                    },
                  },

                  yaxis: {
                    labels: {
                      style: {
                        fontSize: "10px",
                      },
                    },
                  },

                  colors: ["#3b82f6"],

                  plotOptions: {
                    bar: {
                      borderRadius: 6,
                      columnWidth: "50%",
                    },
                  },

                  dataLabels: {
                    enabled: false,
                  },

                  grid: {
                    strokeDashArray: 3,
                    borderColor: "#ffffff20",
                  },

                  tooltip: {
                    theme: "dark",
                  },
                }}
              />
            </div>
          </div>

          {/* ================= PIE CHART ================= */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-113 flex flex-col">

            <h2 className="mb-2 text-lg font-semibold">
              Orders Status Distribution
            </h2>

            {/* STATUS BOXES */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatusBox
                label="Delivered"
                value={deliveredOrders.length}
                color="text-green-400"
              />
              <StatusBox
                label="Pending"
                value={remainingOrders.length}
                color="text-blue-400"
              />
              <StatusBox
                label="Cancelled"
                value={cancelledOrders.length}
                color="text-red-400"
              />
              <StatusBox
                label="Returned"
                value={returnedOrders.length}
                color="text-orange-400"
              />
            </div>

            {/* PIE CHART */}
            <div className="flex-1 w-full flex items-center justify-center">
              <ReactApexChart
                options={{
                  chart: {
                    type: "pie",
                  },
                  labels: orderPrgress.map((item) => item.name),
                  colors: COLORS,
                  dataLabels: {
                    enabled: true,
                  },
                  tooltip: {
                    theme: "dark",
                  },
                  legend: {
                    show: false,
                  },
                }}
                series={orderPrgress.map((item) => item.value)}
                type="pie"
                height={200}
              />
            </div>

          </div>

        </div>


      </div>
    </div>
  )
}

export default Dashboard




function Statebox({ title, value }: { title: String, value: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-xs uppercase text-gray-400">{title}</p>
      <p className="text-lg sm:text-2xl mt-1 font-bold">{value}</p>

    </div>
  )
}

// statusbox //
function StatusBox({
  label,
  value,
  color,

}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
