import { Attendance } from "@/components/attendance";
import { Reason } from "@/components/reason";

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <Attendance />
      <Reason />
    </div>
  )
}
