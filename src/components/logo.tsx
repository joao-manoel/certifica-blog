"use client";
import { Anton } from "next/font/google";
import Image from "next/image";
const _anton = Anton({ subsets: ["latin"], weight: "400" });

interface LogoProps {
  logoWidth?: "sm" | "md" | "lg";
}

export default function Logo({ logoWidth = "md" }: LogoProps) {
  return (
    <>
      <div
        className={`${
          logoWidth === "lg"
            ? "w-12 h-12"
            : logoWidth === "md"
            ? "w-10 h-10"
            : "w-8 h-8"
        } flex items-center justify-center -mt-2`}
      >
        <Image
          src="/images/certifica-icon-verde.png"
          alt="Certifica"
          width={20}
          height={20}
          className={`${
            logoWidth === "lg"
              ? "w-12 h-12"
              : logoWidth === "md"
              ? "w-10 h-10"
              : "w-8 h-8"
          }`}
          priority
        />
      </div>
      <div className="flex flex-col leading-tight text-[#406054]">
        <span
          className={`${
            logoWidth === "lg"
              ? "text-7xl"
              : logoWidth === "md"
              ? "text-4xl"
              : "text-3xl"
          } font-bold uppercase ${_anton.className}`}
        >
          Certifica
        </span>
        <span
          className={`uppercase ${
            logoWidth === "lg"
              ? "text-[14px]"
              : logoWidth === "md"
              ? "text-[10px]"
              : "text-[8px]"
          }`}
        >
          Engenharia e Avaliações
        </span>
      </div>
    </>
  );
}
