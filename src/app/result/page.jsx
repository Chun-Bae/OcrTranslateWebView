"use client";

import { useEffect, useState, useRef } from "react";
import { useData } from "../../context/DataContext";
import { useRouter } from "next/navigation";
import { Chip } from "@nextui-org/chip";
import { Image as NextImage } from "@nextui-org/react";
import { Card, CardBody, Input } from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon.jsx";
import styles from './LoadingPage.module.css'; 

export default function ResultPage() {
  const { data } = useData();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const cardRefs = useRef([]);

  useEffect(() => {
    if (!data) {
      // 데이터가 없으면 로딩 페이지로 돌아가기
      router.push("/loading");
    } else {
      // 데이터를 서버로 전송하여 이미지를 저장
      saveImages(data);
    }
  }, [data, router]);

  useEffect(() => {
    const handleScroll = () => {
      const centerY = window.innerHeight / 2;

      cardRefs.current.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const distanceFromCenter = Math.abs(centerY - cardCenterY);
        const scale = Math.max(1 - distanceFromCenter / centerY, 0.8); // Adjust scale factor as needed

        card.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const index = parseInt(searchValue, 10);
    if (!isNaN(index) && cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [searchValue]);

  const saveImages = async (data) => {
    try {
      const response = await fetch("/api/save-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save images");
      }

      const result = await response.json();
      console.log("Images saved successfully:", result);

      // 이미지를 저장한 후 이미지 로드 함수 호출
      loadImages();
    } catch (error) {
      console.error("Error saving images:", error);
    }
  };

  const loadImages = async () => {
    const originalImage = new Image();
    const detectImage = new Image();
    const cropImages = data.crop.map((_, index) => {
      const img = new Image();
      img.src = `/images/crop/crop_${String(index).padStart(3, "0")}.jpg`;
      return img;
    });

    originalImage.src = "/images/original.jpg";
    detectImage.src = "/images/detect.jpg";

    const allImages = [originalImage, detectImage, ...cropImages];

    await Promise.all(
      allImages.map(
        (img) =>
          new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          })
      )
    );

    setImages(allImages);
    setLoading(false);
  };

  if (loading) {
    return <div className={`flex flex-col items-center justify-center min-h-screen py-2 ${styles.animatedBackground}`}>Thank you for your patience</div>;
  }

  return (
    <div>
      <Navbar isBordered classNames="justify-end">
        <NavbarContent justify="end" className="justify-end">
          <Input
            
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search index..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </NavbarContent>
      </Navbar>

      <div className="flex flex-col items-center justify-center min-h-screen py-1">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-0 text-center">
          <NextImage
            style={{
              zIndex: 4,
            }}
            src="/images/original.jpg"
            alt="Original"
            width={400}
            height={300}
            className="max-w-full h-auto"
          />
          <NextImage
            style={{
              zIndex: 4,
            }}
            src="/images/detect.jpg"
            alt="Detect"
            width={400}
            height={300}
            className="max-w-full h-auto"
          />
          <div className="flex flex-col items-center justify-center min-h-screen -z-5 py-2">
            <div className="grid grid-cols-1 gap-4">
              {data.crop.map((_, index) => (
                <Card
                  key={index}
                  className="max-w-md mx-auto flex flex-row transition-transform duration-300 ease-in-out transform hover:scale-110"
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <div className="w-2/5 flex items-center justify-center p-2">
                    <NextImage
                      src={`/images/crop/crop_${String(index).padStart(
                        3,
                        "0"
                      )}.jpg`}
                      alt={`Crop ${index}`}
                      width={200}
                      height={150}
                      className="object-cover mx-auto"
                    />
                  </div>
                  <CardBody className="w-3/5 flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <Chip radius="full" color="warning" variant="faded">
                        {index}
                      </Chip>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-bold font-medium text-gray-900">
                        {data.data[index]?.ko}
                      </p>
                      <p className="text-sm font-bold text-gray-600">
                        {data.data[index]?.prediction}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
