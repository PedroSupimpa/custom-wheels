import { spinRoulette } from "@/service/roulette";
import { Option } from "@/types/rouletteslug.type";
import { useRef, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";
import { Button } from "./ui/button";
import { WinModal } from "./winModal";

interface RouletteProps {
  slug: string;
  data: Option[];
  spinButton: {
    textColor: string;
    background: string;
    text: string;
  };
}

export function Roulette({ slug, data, spinButton }: RouletteProps) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const dataOptions: WheelData[] = data.map((item) => ({
    option: item.text,
  }));

  const handleSpinClick = () => {
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 600);

    spinRoulette(slug).then((response) => {
      setPrizeNumber(response.data.result);
      setMustSpin(true);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <audio ref={audioRef} src="spin-sound-effect.mp3" />
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={dataOptions}
        backgroundColors={data.map((item) => item.background)}
        textColors={["#ffffff"]}
        onStopSpinning={() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setMustSpin(false);
          setShowModal(true);
        }}
        outerBorderColor={"#ccc"}
        outerBorderWidth={7}
        innerBorderColor={"#f2f2f2"}
        radiusLineColor={"transparent"}
        radiusLineWidth={1}
        textDistance={55}
        fontSize={16}
        spinDuration={0.5}
        disableInitialAnimation={true}
      />
      <Button
        className="rounded-full mt-4"
        onClick={handleSpinClick}
        style={{
          backgroundColor: spinButton.background,
          color: spinButton.textColor,
        }}
      >
        {spinButton.text}
      </Button>

      {showModal && (
        <WinModal
          onClose={() => {
            setShowModal(false);
            // No redirect after winning, just close the modal
          }}
          prize={data[prizeNumber].text}
          open={showModal}
          modalData={data[prizeNumber].confirmationDialog}
        />
      )}
    </div>
  );
}
