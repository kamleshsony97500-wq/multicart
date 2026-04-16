import { auth } from "@/auth";
import AdminDashboard from "@/component/Admin/AdminDashboard";
import EditRoleandPhone from "@/component/EditRoleandPhone";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import UserDashboard from "@/component/User/UserDashboard";
import EditVendorDetails from "@/component/Vendor/EditVendorDetails";
import VendorPage from "@/component/Vendor/VendorPage";
import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { redirect } from "next/navigation";



export default async function Home() {
  await connectDB();
  const session = await auth()
  const user = await userModel.findById(session?.user?.id);
  if (!user) {
    redirect("/login")
  }

  const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user");
  if (inComplete) {
    return <EditRoleandPhone />
  }

  if (user?.role == "vendor") {
    const isCompleteDetails = !user.shopName || !user.shopAddress || !user.gstNumber
    if (isCompleteDetails) {
      return <EditVendorDetails />
    }
  }


  const planUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 flex-col font-sans">
      <Navbar user={planUser} />

      {user?.role == "user" ? (<UserDashboard />) : user?.role == "vendor" ? (<VendorPage user={planUser} />) : (<AdminDashboard />)}

      <Footer user={planUser} />
    </div>
  );
}
