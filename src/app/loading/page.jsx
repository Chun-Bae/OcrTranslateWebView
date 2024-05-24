"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../context/DataContext";

export default function LoadingPage() {
  const router = useRouter();
  const { setData } = useData();

  useEffect(() => {
    // Polling to check if data is available
    const interval = setInterval(async () => {
      const res = await fetch("/api/receive");
      const data = await res.json();

      if (data.status === "completed") {
        clearInterval(interval); // Stop polling once data is received

        // 데이터 저장
        console.log("Data to be set:", data.data); // 데이터 설정 전에 확인
        setData(data.data);
        console.log("Data has been set"); // 데이터 설정 후 확인

        // 결과 페이지로 이동
        router.push("/result");
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [router, setData]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
