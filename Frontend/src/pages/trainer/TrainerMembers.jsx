import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

export default function TrainerMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await apiGet("/classes/trainer/members");
      setMembers(data || []);
    } catch (err) {
      console.error("Members error:", err);
    }
  };

  return (
    <div>
   
      <h1 className="text-3xl font-bold mb-1">Members</h1>
      <p className="text-gray-500 mb-6">
        View all gym members and their de tails
      </p>


      <div className="grid grid-cols-2 gap-6">
        {members.length === 0 ? (
          <p className="text-gray-400">No members found</p>
        ) : (
          members.map((m) => <MemberCard key={m.id} member={m} />)
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{member.name}</h2>

        <span
          className={`px-3 py-1 text-sm rounded-full ${
            member.isActive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
          }`}
        >
          {member.isActive ? "Active" : "Inactive"}
        </span>
      </div>


      <p className="text-sm text-gray-500 mb-3">
        Member since —
      </p>


      <div className="space-y-2 text-sm text-gray-600">
        <p>📧 {member.email}</p>
        <p>📞 {member.phone}</p>
        <p>
          📅 {member.membershipType} -{" "}
          {member.expiryDate
            ? `Expires ${formatDate(member.expiryDate)}`
            : "No expiry"}
        </p>
      </div>
    </div>
  );
}


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}