import React, { useEffect, useState } from "react";

const API = "http://localhost:5136/api";

function MemberClasses() {

  const [classes, setClasses] = useState([]);
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchMyClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API}/classes`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchMyClasses = async () => {
    try {
      const res = await fetch(`${API}/classes/my-classes`);
      const data = await res.json();
      setMyClasses(data);
    } catch (error) {
      console.error("Error fetching my classes:", error);
    }
  };

  const bookClass = async (id) => {
    try {
      await fetch(`${API}/classes/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ classId: id })
      });

      fetchClasses();
      fetchMyClasses();
    } catch (error) {
      console.error("Error booking class:", error);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await fetch(`${API}/classes/delete/${id}`, {
        method: "DELETE"
      });

      fetchClasses();
      fetchMyClasses();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const isBooked = (id) => {
    return myClasses.some((c) => c.id === id);
  };

  const groupedClasses = classes.reduce((acc, c) => {
    if (!acc[c.day]) acc[c.day] = [];
    acc[c.day].push(c);
    return acc;
  }, {});

  return (
    <div>

      <h1 className="text-3xl font-bold mb-1">
        Class Schedule
      </h1>

      <p className="text-gray-500 mb-6">
        Browse and book available classes
      </p>

      <div className="bg-white border rounded-xl p-6 mb-8">

        <h2 className="text-lg font-semibold">
          My Booked Classes
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          Classes you have registered for
        </p>

        {myClasses.length === 0 ? (
          <p className="text-gray-400">
            No booked classes yet
          </p>
        ) : (
          myClasses.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center border-t pt-3 mt-3"
            >
              <div>
                <p className="font-medium">{c.className}</p>
                <p className="text-gray-500 text-sm">
                  {c.day} at {c.time}
                </p>
              </div>

              <button
                onClick={() => cancelBooking(c.id)}
                className="border text-red-500 px-4 py-1 rounded-lg"
              >
                Cancel
              </button>

            </div>
          ))
        )}

      </div>

      {Object.keys(groupedClasses).map((day) => (

        <div key={day} className="mb-10">

          <h2 className="text-xl font-semibold mb-4">
            {day}
          </h2>

          <div className="grid grid-cols-2 gap-6">

            {groupedClasses[day].map((c) => {

              const booked = isBooked(c.id);
              const available = c.capacity - c.filled;

              return (

                <div
                  key={c.id}
                  className="bg-white border rounded-xl p-6 relative"
                >

                  {booked && (
                    <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 text-xs rounded-full">
                      Booked
                    </span>
                  )}

                  <h3 className="text-lg font-semibold">
                    {c.className}
                  </h3>

                  <p className="text-sm mb-1">
                    ⏰ {c.time}
                  </p>

                  <p className="text-sm mb-1">
                    {c.filled}/{c.capacity} spots filled
                  </p>

                  {!booked && (
                    <p className="text-green-600 text-sm mb-3">
                      {available} spots available
                    </p>
                  )}

                  {booked ? (
                    <button
                      onClick={() => cancelBooking(c.id)}
                      className="w-full bg-red-500 text-white py-2 rounded-lg"
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <button
                      onClick={() => bookClass(c.id)}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg"
                    >
                      Book Class
                    </button>
                  )}

                </div>

              );

            })}

          </div>

        </div>

      ))}

    </div>
  );
}

export default MemberClasses;