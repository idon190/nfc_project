import { Attendance } from "@/components/attendance";
import { Reason } from "@/components/reason";
import { useSearchParams } from "next/navigation";

export default function Home() {
  return (
    <div>
      <Attendance />
      <Reason />
    </div>
  )
}