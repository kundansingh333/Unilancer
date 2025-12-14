import StatCard from "./StatCard.jsx";

const OrderStatsBox = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <StatCard
        title="Client: Total Orders"
        value={stats.client.total}
        color="text-blue-400"
      />
      <StatCard
        title="Client: Pending"
        value={stats.client.pending}
        color="text-amber-400"
      />
      <StatCard
        title="Client: Completed"
        value={stats.client.completed}
        color="text-green-400"
      />
      <StatCard
        title="Client: Total Spent"
        value={`₹${stats.client.spent}`}
        color="text-purple-400"
      />

      <StatCard
        title="Freelancer: Total Orders"
        value={stats.freelancer.total}
        color="text-blue-400"
      />
      <StatCard
        title="Freelancer: Pending"
        value={stats.freelancer.pending}
        color="text-amber-400"
      />
      <StatCard
        title="Freelancer: Completed"
        value={stats.freelancer.completed}
        color="text-green-400"
      />
      <StatCard
        title="Freelancer: Total Earned"
        value={`₹${stats.freelancer.earned}`}
        color="text-purple-400"
      />
    </div>
  );
};

export default OrderStatsBox;
