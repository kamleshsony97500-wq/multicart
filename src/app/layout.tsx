
import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Multicart",
  description: "Multi-Vendor e-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body>
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>
        </Provider>
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
