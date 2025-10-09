import { useMemo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const RainAnimation = () => {
  const rain = useMemo(() => (
    <DotLottieReact
      src="https://lottie.host/8f241ec2-b9a7-48d4-999a-0964fe33eac5/n206S1yhSM.lottie"
      loop
      autoplay
    />
  ), []);

  return (
    <div >
     {rain}
    </div>
     
   
  );
};

export default RainAnimation;
