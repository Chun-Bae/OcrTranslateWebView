"use client";

import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      // 데이터가 없으면 로딩 페이지로 돌아가기
      router.push("/loading");
    }
  }, [data, router]);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <img src="/images/original.jpg" alt="Original" />
        <img src="/images/detect.jpg" alt="Detect" />
        <div className="grid grid-cols-1 gap-4">
          <div className="text-left">
            <h2 className="font-bold">Original Text</h2>
            <p>This is the original text.</p>
          </div>
          <div className="text-left">
            <h2 className="font-bold">Predict Text</h2>
            <p>This is another translated text.</p>
          </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </main>
    </div>
  );
}
