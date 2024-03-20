import SideBar from "@/components/dashboard/SideBar"

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='container grid grid-cols-1 lg:gap-x-3 lg:grid-cols-[1fr_4fr]'>
            <div className="hidden lg:block">
                <SideBar />
            </div>
            <div className="h-screen lg:bg-gray-100">
                {children}
            </div>
        </main>
    )
}

export default DashboardLayout;