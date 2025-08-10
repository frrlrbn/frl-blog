"use client";
import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};

export default function BlurAvatar({ className = "", onLoad, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className={`${className} transition-[filter,transform,opacity] duration-500 ease-out ${
        loaded ? "blur-0 opacity-100 scale-100" : "blur-sm opacity-80 scale-[1.02]"
      }`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      alt={props.alt}
    />
  );
}
