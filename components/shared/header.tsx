import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const linkClass =
    "text-[#333333] text-[20px] transition-colors duration-200 hover:text-[#3A5F9D]";

  return (
    <>
      <header className={cn("", className)}>
        <div className="flex justify-between items-center m-[18px]">
          <div className="flex items-center gap-2">
            <span className="text-[30px] [font-family:var(--font-montserrat)] font-semibold">
              LinGo
            </span>
            <span className="text-[#1D3C6A] text-[20px] ">Санкт-Петербург</span>
          </div>
          <div className="flex justify-center items-center relative gap-3">
            {/* Имя пользователя */}
            <p className="text-[#2E1A1A] text-[20px]">Константин</p>
            <Image
              className="cursor-pointer"
              src="/images/no-avatar.svg"
              width={50}
              height={50}
              alt="avatar"
            />
            <svg
              className="absolute top-8 right-0 w-[20px] h-[20px] cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <rect width="21" height="21" rx="10.5" fill="#3A5F9D" />
              <path
                d="M6.375 12.9063V14.625H8.09375L13.1629 9.55583L11.4442 7.83708L6.375 12.9063ZM14.4921 8.22667C14.6708 8.04792 14.6708 7.75917 14.4921 7.58042L13.4196 6.50792C13.2408 6.32917 12.9521 6.32917 12.7733 6.50792L11.9346 7.34667L13.6533 9.06542L14.4921 8.22667Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </header>
      <Container className="flex justify-between px-[81px] py-[10px] sticky top-0 bg-[#F5F6FA] z-30">
        <Link className={linkClass} href={"/"}>
          Главная
        </Link>
        <Link className={linkClass} href={"/events"}>
          Все события
        </Link>
        <Link className={linkClass} href={"/"}>
          Категории
        </Link>
        <Link className={linkClass} href={"/"}>
          События с вами
        </Link>
      </Container>
    </>
  );
};
