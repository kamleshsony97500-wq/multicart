"use client";

import UseGetAllOrdersData from "./hooks/UseGetAllOrdersData";
import UseGetAllProductsData from "./hooks/UseGetAllProductsData";
import UseGetAllVendors from "./hooks/UseGetAllVendors";
import UseGetCurrentUser from "./hooks/UseGetCurrentUser";

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  UseGetAllProductsData()
  UseGetAllOrdersData()
  return null;
}

export default InitUser
