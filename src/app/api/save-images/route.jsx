import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';



export async function POST(req) {
  try {
    const { original, detect, crop, data } = await req.json();

    // 이미지 파일을 저장할 디렉토리 경로 설정
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const cropDir = path.join(imagesDir, 'crop');

    // 디렉토리가 없으면 생성
    await mkdir(imagesDir, { recursive: true });
    await mkdir(cropDir, { recursive: true });

    // Base64 데이터를 디코딩하여 파일로 저장
    const originalBuffer = Buffer.from(original, 'base64');
    const detectBuffer = Buffer.from(detect, 'base64');

    await writeFile(path.join(imagesDir, 'original.jpg'), originalBuffer);
    await writeFile(path.join(imagesDir, 'detect.jpg'), detectBuffer);

    // Crop 이미지들도 저장
    for (let i = 0; i < crop.length; i++) {
      const cropBuffer = Buffer.from(crop[i], 'base64');
      const cropPath = path.join(cropDir, `crop_${String(i).padStart(3, '0')}.jpg`);
      await writeFile(cropPath, cropBuffer);
    }

    // 데이터를 함께 반환
    return NextResponse.json({ message: 'Images saved successfully', data });
  } catch (error) {
    console.error('Error saving images:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
