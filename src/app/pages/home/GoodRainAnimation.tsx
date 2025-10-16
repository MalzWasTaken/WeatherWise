import React, { useEffect, useState, CSSProperties } from "react";

interface RainSet {
  drops: JSX.Element[];
  backDrops: JSX.Element[];
}

interface GoodRainAnimationProps {
  type?: "rain" | "thunderstorm";
}

const GoodRainAnimation: React.FC<GoodRainAnimationProps> = ({ type = "rain" }) => {
  const [rain, setRain] = useState<RainSet>({ drops: [], backDrops: [] });

  const makeItRain = (): RainSet => {
    const drops: JSX.Element[] = [];
    const backDrops: JSX.Element[] = [];

    //  More drops for thunderstorm
    const rainDensity = type === "thunderstorm" ? 300 : 200;

    let increment = 0;
    while (increment < rainDensity) {
      const randoHundo = Math.floor(Math.random() * 98) + 1;
      const randoFiver = Math.floor(Math.random() * 4) + 2;
      increment += randoFiver;

      //  Faster + heavier rain in thunderstorm
      const durationBase = type === "thunderstorm" ? 0.2 : 0.4;

      const dropStyle: CSSProperties = {
        left: `${(increment / rainDensity) * 100}%`,
        bottom: `${randoFiver * 2 - 1 + 100}%`,
        animationDelay: `0.${randoHundo}s`,
        animationDuration: `${durationBase + randoHundo / 100}s`,
      };

      const drop = (
        <div
          key={`drop-${increment}`}
          className="absolute bottom-full w-[15px] h-[120px] pointer-events-none animate-[drop_0.5s_linear_infinite]"
          style={dropStyle}
        >
          {/* Visible rain stem */}
          <div
            className={`w-px h-[60%] ml-[7px] bg-gradient-to-b from-transparent ${
              type === "thunderstorm" ? "to-white/70" : "to-white/40"
            } animate-[stem_0.5s_linear_infinite]`}
            style={{
              animationDelay: `0.${randoHundo}s`,
              animationDuration: `${durationBase + randoHundo / 100}s`,
            }}
          ></div>

          {/* Small splat */}
          <div
            className={`w-[15px] h-[10px] border-t-2 border-dotted ${
              type === "thunderstorm" ? "border-white/50" : "border-white/30"
            } rounded-full opacity-0 animate-[splat_0.5s_linear_infinite]`}
            style={{
              animationDelay: `0.${randoHundo}s`,
              animationDuration: `${durationBase + randoHundo / 100}s`,
            }}
          ></div>
        </div>
      );

      drops.push(drop);
      backDrops.push(React.cloneElement(drop, { key: `back-${increment}` }));
    }

    return { drops, backDrops };
  };

  useEffect(() => {
    setRain(makeItRain());
  }, [type]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-0 w-full h-full z-[2]">{rain.drops}</div>
      <div className="absolute left-0 w-full h-full z-[1] bottom-[60px] opacity-40">
        {rain.backDrops}
      </div>

      <style>{`
        @keyframes drop {
          0% { transform: translateY(0vh); opacity: 0.5; }
          75% { transform: translateY(90vh); opacity: 1; }
          100% { transform: translateY(90vh); opacity: 0; }
        }
        @keyframes stem {
          0%, 65% { opacity: 0.4; }
          75%, 100% { opacity: 0; }
        }
        @keyframes splat {
          0%, 80% { opacity: 0; transform: scale(0); }
          90% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default GoodRainAnimation;
