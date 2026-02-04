import StripeProvider from '@/components/stripe/StripeProvider';
import CheckoutForm from '@/components/stripe/CheckOutForm';

import { stripe } from '@/lib/stripe';

async function getClientSecret() {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 250,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent.client_secret!;
}


export default async function CheckoutPage() {
  const clientSecret = await getClientSecret();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1E293B]">
          Payment to Join Membership
        </h1>

        <StripeProvider clientSecret={clientSecret}>
          <CheckoutForm />
        </StripeProvider>
      </div>
    </div>
  );
}
