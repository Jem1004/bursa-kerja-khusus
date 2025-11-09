import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is on login page
  const isLoginPage = false; // This will be handled by middleware

  // Redirect to login if not authenticated (except on login page)
  if (!session && !isLoginPage) {
    redirect("/admin/login");
  }

  // If on login page and authenticated, don't show sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-poppins font-bold text-neutral-900 ml-12 lg:ml-0">
              Dashboard Admin
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 hidden sm:block">
                Halo, <span className="font-medium">{session?.user?.name}</span>
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
