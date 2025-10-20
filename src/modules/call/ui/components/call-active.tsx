import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

import Link from "next/link";
import Image from "next/image";

interface Props {
    meetingName: string;
    onLeave: () => void
}


export const CallActive = ({ meetingName, onLeave }: Props) => {
  console.log("SpeakerLayout:", SpeakerLayout); // 你已經有了，觀察輸出
    return (
        
        <div className="flex flex-col justify-between p-4 h-full text-white">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
                <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                    <Image src="/logo.svg" width={22} height={22} alt="Logo" />
                </Link>
                <h4 className="text-base">
                    {meetingName}
                </h4>
            </div>
            <div className="flex-1 min-h-0">
                
                <SpeakerLayout />
            </div>            
            <div className="bg-[#101213] rounded-full px-4">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    )
}
