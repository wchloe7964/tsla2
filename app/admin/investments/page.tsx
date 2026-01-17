import React from "react";
import { Users, DollarSign, Activity } from "lucide-react";
import CreatePlanForm from "@/components/admin/CreatePlanForm";

// Next.js 16: You can fetch data directly in the Server Component
async function getAdminData() {
  const [statsRes, mediaRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/investments`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/media`, {
      cache: "no-store",
    }),
  ]);

  const statsData = await statsRes.json();
  const mediaData = await mediaRes.json();

  return {
    stats: statsData.stats || {
      totalUsers: 0,
      activeInvestmentsCount: 0,
      platformLiquidity: 0,
    },
    images: mediaData.images || [],
  };
}

export default async function AdminInvestmentsPage() {
  const { stats, images } = await getAdminData();

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <header className="mb-12">
        <h1 className="text-4xl font-tesla uppercase tracking-widest text-white">
          Investment <span className="text-blue-600">Command</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Manage global growth plans and monitor node liquidity.
        </p>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="text-blue-500"
        />
        <StatCard
          title="Active Plans"
          value={stats.activeInvestmentsCount}
          icon={<Activity className="w-6 h-6" />}
          color="text-green-500"
        />
        <StatCard
          title="System Liquidity"
          value={`$${stats.platformLiquidity.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="text-yellow-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* FORM SECTION: Create New Plan */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-tesla mb-6 uppercase tracking-wider text-gray-300">
            Deploy New Node
          </h2>
          <CreatePlanForm cloudinaryImages={images} />
        </div>

        {/* SIDEBAR: System Status */}
        <div className="space-y-6">
          <h2 className="text-xl font-tesla mb-6 uppercase tracking-wider text-gray-300">
            Live Status
          </h2>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-gray-500">
                Cloudinary Sync
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            </div>
            <p className="text-sm text-gray-300">
              {images.length} assets detected in your vehicle media folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.07] transition-all">
      <div className={`${color} mb-4`}>{icon}</div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
        {title}
      </p>
      <p className="text-3xl font-light tracking-tighter">{value}</p>
    </div>
  );
}
