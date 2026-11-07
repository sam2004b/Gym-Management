import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51T50Xi5RfvNNfzJxJxLcsuNyJ6LfTGf5XIoB0OuZI4aR3uNxbxrQA4MPlLxY93wOwA98BPv43eDi31vNUO9RsanZ006TKvUdgR"
);

export default function StripeProvider({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}