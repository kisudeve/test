import Image from "next/image";
import UP from "@/assets/write/up.svg";
import DOWN from "@/assets/write/down.svg";
import HOLD from "@/assets/write/hold.svg";
import uploadPicture from "@/assets/write/uploadPicture.svg";

const happys = ["기쁨", "설렘", "감사", "만족", "통쾌", "안도", "자신감", "편안", "감탄", "열정"];

export default function WriteDetail() {
  return (
    <>
      <div className="flex justify-center items-center flex-col w-[1440px] h-[960px] bg-amber-300">
        <div className="flex items-center flex-col w-[752px] h-[928px] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white">
          <p className="pt-10 text-[24px] text-[#1A2035]">오늘의 감정 기록</p>

          <div className="flex justify-start items-center flex-col  text-base  ">
            <p className="text-[#4B5563] mr-auto ml-1 pb-4 mt-10">오늘의 감정은 어떠신가요?</p>
            <div className="flex justify-between items-center w-[700px] flex-row  text-base  ">
              <button className="flex justify-center items-center flex-col border border-[#E5E7EB] w-[216px] h-[91px] rounded-xl cursor-pointer focus:border-2 focus:border-[#FF6467] hover:bg-[#E5E7EB] text-[#FF6467] hover:scale-102 transform transition-transform duration-200 focus:scale-102">
                <Image src={UP} alt="UP" />
                UP
              </button>
              <button className="flex justify-center items-center flex-col border border-[#E5E7EB] w-[216px] h-[91px] rounded-xl cursor-pointer focus:border-2 focus:border-[#51A2FF] hover:bg-[#E5E7EB] text-[#51A2FF] hover:scale-102 transform transition-transform duration-200 focus:scale-102">
                <Image src={DOWN} alt="DOWN" />
                DOWN
              </button>
              <button className="flex justify-center items-center flex-col border border-[#E5E7EB] w-[216px] h-[91px] rounded-xl cursor-pointer focus:border-2 focus:border-[#99A1AF] hover:bg-[#E5E7EB] text-[#99A1AF] hover:scale-102 transform transition-transform duration-200 focus:scale-102">
                <Image src={HOLD} alt="HOLD" />
                HOLD
              </button>
            </div>
          </div>
          <div>
            <div className="w-[700px] h-[30px] mt-10">슬라이더</div>
            <div className="pl-3 w-[688px] flex flex-row justify-between text-[#4A5565]">
              {happys.map((happy) => (
                <button
                  key={happy}
                  className="cursor-pointer w-[53px] h-7 text-[12px]  border border-[#E5E7EB] rounded-[9999px] hover:text-black hover:bg-black/5 focus:bg-[#FF6467] focus:text-white"
                >
                  #{happy}
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="bg-[#F9FAFB] border rounded-xl border-[#E5E7EB] w-[688px] h-[380px] mt-7 resize-none outline-none focus:scale-102 transform transition-transform duration-200"
            placeholder="오늘의 메모를 남겨보세요..."
          ></textarea>
          <Image
            src={uploadPicture}
            alt="uploadPicture"
            className="mt-7 cursor-pointer hover:scale-102 transform transition-transform duration-200"
          />
          <button className="mt-7 flex justify-center items-center text-[#ffffff] w-[688px] h-[42px] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] rounded-xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] cursor-pointer hover:scale-102 transform transition-transform duration-200">
            기록 완료
          </button>
        </div>
      </div>
    </>
  );
}

/* body */

/* bg-gradation */
// background: linear-gradient(45deg, #F5F7FA 50%, #C3CFE2 120.71%);
/* div */

/* Auto layout */
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// padding: 32px;
// gap: 20px;
// isolation: isolate;

// width: 752px;
// height: 928px;

// background: #FFFFFF;
// box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
// border-radius: 16px;

// /* Inside auto layout */
// flex: none;
// order: 0;
// align-self: stretch;
// flex-grow: 1;
