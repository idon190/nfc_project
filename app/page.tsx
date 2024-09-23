import { Attendance, Reason } from "@/components/attendance";
//import Reason from "@/components/reason";

export default function Home() {
  return (
    <div>
      <h1>출석 확인</h1>
      <Attendance />
      <Reason />
    </div>
  )
}