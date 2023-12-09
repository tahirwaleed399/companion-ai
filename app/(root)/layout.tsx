import Navbar from "@/components/common/navbar";
import { Sidebar } from "@/components/common/sidebar";

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const isPro = false;
    return (
        <>
        <Navbar  />
        <div className="hidden md:flex mt-16 h-full w-20 flex-col fixed inset-y-0">
          <Sidebar isPro={isPro} />
        </div>
             
              <main className="md:pl-20 pt-16 h-full">{children}</main>
  
        </>
             
       
    );
  }
  