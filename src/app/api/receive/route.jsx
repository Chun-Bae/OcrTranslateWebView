import { NextResponse } from "next/server";
import { readdir, unlink } from "fs/promises";
import path from "path";

let receivedData = null;

export async function POST(req) {
  try {
    const body = await req.json();
    receivedData = body;
    // console.log("Data received:", receivedData);
    return NextResponse.json({ message: "Data received" });
  } catch (error) {
    console.error("Error receiving data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (receivedData) {
      // 5초 후에 receivedData 초기화 및 images 디렉토리의 이미지 삭제
      setTimeout(async () => {
        receivedData = null;
        console.log("Data has been cleared after 5 seconds");

        // 이미지 파일을 저장할 디렉토리 경로 설정
        const imagesDir = path.join(process.cwd(), "public", "images");
        const cropDir = path.join(imagesDir, "crop");

        const deleteFiles = async (dir) => {
          const files = await readdir(dir);
          const deletePromises = files.map((file) =>
            unlink(path.join(dir, file))
          );
          await Promise.all(deletePromises);
        };

        try {
          await deleteFiles(cropDir);
          await deleteFiles(imagesDir);
        } catch (deleteError) {
          console.error("Error deleting images:", deleteError);
        }
      }, 600000000000);

      //   console.log("Sending received data:", receivedData);
      return NextResponse.json({ status: "completed", data: receivedData });
    } else {
      return NextResponse.json({ status: "pending" });
    }
  } catch (error) {
    console.error("Error sending data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
