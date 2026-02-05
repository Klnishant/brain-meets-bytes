// components/MembershipCard.tsx
"use client";

type Plan = {
    name: string;
    price: string;
    priceId: string;
};

type PlanCardProps = {
    plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const handlePayNow = async () => {
    const res = await fetch("/api/stripe/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: plan?.priceId,
      }),
    });

    const data = await res.json();

    console.log("Payment:",data);
    
    

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="border p-6 rounded-xl">
      <h2 className="text-xl text-[#1E293B] font-bold">{plan?.name}</h2>
      <h3 className="text-lg text-[#1E293B] font-bold">Benefits:</h3>
      <p className="text-[#D62828]">Early Access to Content</p>
      <p className="text-gray-500">{plan?.price}</p>

      <button
        onClick={handlePayNow}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
}

export default PlanCard;