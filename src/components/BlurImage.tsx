"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  className?: string;
};

export default function BlurImage({ className = "", onLoad, onLoadingComplete, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={
        `${className} transition-[filter,transform,opacity] duration-700 ease-out ` +
        (loaded ? "blur-0 opacity-100 scale-100" : "blur-sm opacity-80 scale-[1.02]")
      }
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onLoadingComplete={(img) => {
        setLoaded(true);
        onLoadingComplete?.(img);
      }}
    />
  );
}
