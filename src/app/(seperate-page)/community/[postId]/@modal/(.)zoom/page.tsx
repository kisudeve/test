import { ImageModal } from "@/components/common/ImageModal";
import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ image_url: string }>;
}) {
  const { image_url } = await searchParams;
  return (
    <>
      <ImageModal className="p-0 border-0 min-w-0">
        <Image
          src={image_url}
          alt={"확대 이미지"}
          width={800}
          height={800}
          className="w-full h-full object-contain"
        />
      </ImageModal>
    </>
  );
}
