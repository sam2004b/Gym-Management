function DashboardCards() {
  return (

    <div className="grid grid-cols-4 gap-6 mt-6">

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Membership Status</p>
        <h2 className="text-2xl font-bold mt-2">Active</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Attendance</p>
        <h2 className="text-2xl font-bold mt-2">2</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Workout Plans</p>
        <h2 className="text-2xl font-bold mt-2">1</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Available Classes</p>
        <h2 className="text-2xl font-bold mt-2">5</h2>
      </div>

    </div>

  );
}

export default DashboardCards;