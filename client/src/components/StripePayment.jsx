// UPDATED: Added support for Stripe Checkout Session instead of just redirect URL
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from "react-router-dom";
import { useEffect } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
import { useNavigate } from 'react-router-dom';

const StripePayment = ({ amount, addressId, cartItems }) => {
       const [searchParams] = useSearchParams();
       const navigate = useNavigate();


    useEffect(()=>{

     const sessionId = searchParams.get("session_id");

    console.log("session id is ",sessionId);
    if(sessionId){
      alert("working")
      navigate("/success")
    }

    },[searchParams])
 

  async function getPaymentStatus(){
    
    
  }

  const handleStripeCheckout = async () => {
    if (amount === 0) {
      alert('Please add some items first');
      return;
    }

    try {
      // ✅ UPDATED: Call backend to create Stripe Checkout session
      const response = await Axios({
        ...SummaryApi.stripe_create_intent,
        data: {
          amount,
          addressId,
          cartItems,
        },
      });

      const { data: resData } = response;

      console.log("response is ", response);

      // ✅ UPDATED: Instead of checking `url`, we now use Stripe's `redirectToCheckout`
      if (resData.id) {
      setTimeout(async()=>{
          const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: resData.id });
        const session = await resData.id;
        console.log(session);
      },1000)
      } else {
        console.error("No session ID received from backend");
      }
    } catch (error) {
      console.error(error);
    }


// get  payment status

    // try{
    //   const response = await Axios({
    //     ...SummaryApi.payment_status
    //   })

    //   console.log(response);
    //   let userID = response.data.userInfo.map((list)=>{
    //     // return list._id;

    //     if(list.payment_status === 'PAID'){
    //       console.log("payment successfull")
    //       navigate("/success")

    //     }
    //   })

    //   console.log(userID)

    //   let info = response.data.paymentStatus.map((status)=>{
    //     return status;
    //   })

    //   if(info ==="PAID"){
    //     console.log("Payment is PAID");
    //   }

    //   console.log(info)
    //   // console.log("payment status", response.data.paymentStatus);
    // }catch(error){
    //   console.error("error while getting paymet status",error);
    // }

  };

  return (
    <div className="mt-4">
      <button
        onClick={handleStripeCheckout}
        className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
      >
        Pay with Card
      </button>

      <button onClick={getPaymentStatus} >GET Payment Status</button>
    </div>
  );
};

export default StripePayment;
