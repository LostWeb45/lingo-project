import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer
      className={cn(
        "flex flex-col h-[320px] items-center justify-center bg-[#F2F7FA] relative mt-[30px]",
        className
      )}
    >
      {/* <div className="absolute text-[100px] left-0 rotate-90 [font-family:var(--font-montserrat)]">
        LinGo
      </div> */}
      <div className="flex gap-[150px]">
        <div className="flex flex-col gap-[12px]">
          <div className="text-[19px] text-[#333333] font-bold">Помощь</div>
          <div className="text-[16px] text-[#333333] font-medium">
            konstintin@gmail.com
          </div>
          <div className="text-[16px] text-[#333333] font-medium">
            kostik052005@gmail.com
          </div>
        </div>
        <div>
          <div className="text-[19px] text-[#333333] font-medium">
            О компании
          </div>
          <div>Пользовательское соглашение</div>
        </div>
        <div>
          <div className="text-[19px] text-[#333333] font-medium">
            Наши контакты
          </div>
          <div>konstintin@gmail.com</div>
          <div>г. Санкт-Петербург</div>
        </div>
      </div>
      <div className="absolute bottom-3">© ООО «Lingo» 2025</div>
    </footer>
  );
};
