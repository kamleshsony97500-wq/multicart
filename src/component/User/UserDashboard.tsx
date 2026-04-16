"use client";

import Slider from './Slider'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'
import ShopPage from '@/app/shop/page';

const UserDashboard = () => {
  return (
    <div className="w-full flex items-center justify-center bg-linear-to-br from-gray-900
     via-black to-gray-900 p-6 flex-col font-sans">
      <Slider />
      <CategorySlider />
      <ProductCardPage />
      <ShopPage />
    </div>
  )
}

export default UserDashboard
