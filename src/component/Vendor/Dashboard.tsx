"use client";

import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { RootState } from "@/redux/store";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";


const Dashboard = () => {
  UseGetAllOrdersData();
  UseGetAllProductsData();
  UseGetCurrentUser()

  const { allProductsData } = useSelector((state: RootState) => state.vendor);
  const { allOrdersData, userData } = useSelector((state: RootState) => state.user)

  const vendorOrders = allOrdersData.filter(
    (o: any) =>
      String(o.productVendor?._id || o.productVendor) ===
      String(userData?._id)
  );

  const vendorProducts = allProductsData.filter(
    (p: any) =>
      String(p.vendor?._id || p.vendor) ===
      String(userData?._id)
  );

  const validOrders = vendorOrders.filter(
    (o: any) =>
      o.orderStatus !== "cancelled" &&
      o.orderStatus !== "returned"
  );

  let totalSales = 0;
  const customers = new Set<string>();
  validOrders.forEach((o: any) => {
    totalSales += o.totalAmount;
    customers.add(String(o.buyer?._id || o.buyer));
  });



  // for statusbox ke liye data //
  // for pichart data //
  const deliveredOrders = vendorOrders.filter(
    (o: any) => o.orderStatus === "delivered"
  )

  const cancelledOrders = vendorOrders.filter(
    (o: any) => o.orderStatus === "cancelled"
  )

  const returnedOrders = vendorOrders.filter(
    (o: any) => o.orderStatus === "returned"
  )

  const remainingOrders = vendorOrders.filter(
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


  // for graph ke liye //
  const ordersDateMap: Record<string, number> = {};
  validOrders.map((o: any) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN")
    ordersDateMap[d] = (ordersDateMap[d] || 0) + 1;
  });

  const orderByDate = Object.keys(ordersDateMap).map((d) => ({
    date: d,
    orders: ordersDateMap[d]
  }));

  // product sales ke liye //
  // for graph ke liye //
  const productSalesMap: Record<string, number> = {};
  validOrders.forEach((o: any) =>
    o.products.forEach((p: any) => {
      const t = p.product?.title || "unknown";
      productSalesMap[t] = (productSalesMap[t] || 0) + p.quantity;

    })
  )

  const productSales = Object.keys(productSalesMap).map((t) => ({
    product: t.length > 12 ? t.slice(0, 12) + "...." : t,
    sold: productSalesMap[t]
  }));


  return (
    <div className='w-full min-h-screen px-4 sm:px-6 py-6 text-white'>
      <div className="max-h-full mx-auto space-y-8">

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            {userData?.shopName}
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 break-all">
            {userData?.email}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-3">
          <Statebox title="Customers" value={customers.size} />
          <Statebox title="Products" value={vendorProducts.length} />
          <Statebox title="Orders" value={validOrders.length} />
          <Statebox title="Sales" value={`₹ ${totalSales}`} />
        </div>


        {/* charts in value show */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-70 sm:h-95">
            <h2 className="mb-2 text-lg font-semibold">Orders by Date</h2>

            <ReactApexChart
              type="line"
              width="100%"
              height={300}
              series={[
                {
                  name: "Orders",
                  data: orderByDate.map((d) => d.orders),
                },
              ]}
              options={{
                chart: {
                  toolbar: { show: false },
                  zoom: { enabled: false },
                  background: "transparent",
                },
                theme: { mode: "dark" },
                stroke: {
                  curve: "smooth",
                  width: 3,
                },
                xaxis: {
                  categories: orderByDate.map((d) => d.date),
                  labels: {
                    rotate: -45,
                    trim: true,   // ✅ IMPORTANT
                    style: { fontSize: "10px" },
                  },
                },
                yaxis: {
                  labels: { style: { fontSize: "10px" } },
                },
                grid: {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                tooltip: {
                  theme: "dark",
                },
              }}
            />
          </div>

          {/* one more chart add here */}
          <div className="bg-white/5 border mb-6 border-white/10 p-4 rounded-xl">
            <h2 className="mb-2 text-lg font-semibold">
              Orders Status Distribution
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatusBox label="Delivered" value={deliveredOrders.length} color="text-green-400" />
              <StatusBox label="Pending" value={remainingOrders.length} color="text-blue-400" />
              <StatusBox label="Cancelled" value={cancelledOrders.length} color="text-red-400" />
              <StatusBox label="Returned" value={returnedOrders.length} color="text-orange-400" />
            </div>

            {/* pie chart show here */}
            <div className="h-75 sm:h-65">
              <ReactApexChart
                type="pie"
                width="100%"
                height={300}
                series={orderPrgress.map((item) => item.value)}
                options={{
                  labels: orderPrgress.map((item) => item.name),
                  colors: COLORS,
                  legend: {
                    position: "bottom",
                    labels: {
                      colors: "#fff",
                    },
                  },
                  dataLabels: {
                    enabled: true,
                  },
                  tooltip: {
                    theme: "dark",
                  },
                }}
              />
            </div>
          </div>




          {/* products show which one more sales  */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <h2 className="mb-3 text-sm font-semibold">Product Sales</h2>

            <div className="w-full h-75 overflow-hidden">
              <ReactApexChart
                type="line"
                width="100%"
                height={300}
                series={[
                  {
                    name: "Sold",
                    data: productSales.map((p) => p.sold),
                  },
                ]}
                options={{
                  chart: {
                    toolbar: { show: false },
                    background: "transparent",
                  },
                  theme: { mode: "dark" },
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  xaxis: {
                    categories: productSales.map((p) => p.product),
                    labels: {
                      rotate: -45,
                      trim: true,
                      hideOverlappingLabels: true,
                      style: { fontSize: "10px" },
                    },
                  },
                  yaxis: {
                    labels: { style: { fontSize: "10px" } },
                  },
                  grid: {
                    borderColor: "rgba(255,255,255,0.1)",
                  },
                  tooltip: {
                    theme: "dark",
                  },
                }}
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
