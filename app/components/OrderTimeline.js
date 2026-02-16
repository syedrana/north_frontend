export default function OrderTimeline({ status }) {

  const steps = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex justify-between mt-6">

      {steps.map((step, index) => {

        const active = index <= currentIndex;

        return (
          <div key={step} className="flex-1 text-center">

            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center
              ${active ? "bg-black text-white" : "bg-gray-200"}`}
            >
              ✓
            </div>

            <p className="text-xs mt-2 capitalize">
              {step}
            </p>

          </div>
        );
      })}

    </div>
  );
}
