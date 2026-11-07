import {
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  ClipboardList,
  Dumbbell,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "User Management",
    desc: "Role-based access for members, trainers, and admins with secure authentication",
  },
  {
    icon: CreditCard,
    title: "Membership Plans",
    desc: "Flexible subscription options with automatic renewal and expiry tracking",
  },
  {
    icon: Calendar,
    title: "Class Scheduling",
    desc: "Book classes, manage schedules, and track attendance seamlessly",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    desc: "BMI calculator, workout plans, and attendance history for members",
  },
  {
    icon: ClipboardList,
    title: "Payment System",
    desc: "Secure payment processing with receipt generation and history",
  },
  {
    icon: Dumbbell,
    title: "Workout Plans",
    desc: "Trainers can create personalized workout plans for members",
  },
];

function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-28">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 transition transform hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="text-orange-500 mb-4">
                <Icon size={32} />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Features;