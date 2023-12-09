import React from 'react'
import { CldImage, CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
  }
  
const ImageUpload = ({
    value,
    onChange,
    disabled,
  }: ImageUploadProps) => {
    
  return (
    <div>
      <CldUploadButton options={{ maxFiles: 1 }} onUpload={(result: any) => onChange(result.info.secure_url)} uploadPreset="zgntud7m">

      <div 
          className="
            p-4 
            border-4 
            border-dashed
            border-primary/10 
            rounded-lg 
            hover:opacity-75 
            transition 
            flex 
            flex-col 
            space-y-2 
            items-center 
            justify-center
          "
        >
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="Upload"
              src={value || "/placeholder.svg"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>

      </CldUploadButton>

    </div>
  )
}

export default ImageUpload