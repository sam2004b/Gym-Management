const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="text-2xl font-semibold mt-2">{value}</p>

      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
};

export default StatCard;