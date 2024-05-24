// src/app/loading/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../context/DataContext";
import { CircularProgress } from "@nextui-org/react";
import styles from './LoadingPage.module.css'; 

export default function LoadingPage() {
  const router = useRouter();
  const { setData } = useData();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
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

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:22222/ws/progress");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.progress !== undefined) {
        setProgress(message.progress);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingText((prev) => {
        switch (prev) {
          case "Loading":
            return "Loading.";
          case "Loading.":
            return "Loading..";
          case "Loading..":
            return "Loading...";
          case "Loading...":
          default:
            return "Loading";
        }
      });
    }, 500);

    return () => clearInterval(loadingInterval); // Cleanup interval on unmount
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen py-2 ${styles.animatedBackground}`}>
      <h1>{loadingText}</h1>
      <CircularProgress
        aria-label="Loading..."
        size="lg"
        value={progress}
        color="warning"
        showValueLabel={true}
      />
    </div>
  );
}
