import { Container, Filters, Title } from "@/components/shared/";
import { Button } from "@/components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { prisma } from "@/prisma/prisma-client";
import { hash } from "bcryptjs";

export default async function Home() {
  return (
    <>
      <Container>
        <div className="flex justify-between gap-[30px]">
          <div className="flex w-[74%] py-[30px] px-[57px] gap-[30px] flex-col bg-[url('/images/block-back.png')] bg-cover bg-center">
            <div className="text-black text-[48px] leading-11 [font-family:var(--font-montserrat)] font-bold">
              LinGo — это <br /> сервис для организации <br />и поиска досуга
              вместе
            </div>
            <div className="text-[#333333] text-[24px] leading-7">
              Планируйте события,
              <br /> находите единомышленников и открывайте новые <br />
              возможности для интересного <br />
              времяпрепровождения!
            </div>
            <Button className="w-[180px] h-[50px]">Найти</Button>
          </div>
          <div className="flex w-[26%]  gap-[13px] flex-col">
            <p className="text-[20px] font-medium [font-family:var(--font-montserrat)]">
              Наши преимущества
            </p>
            <Accordion
              type="single"
              defaultValue="item-1"
              className="flex flex-col px-5  bg-[#fafcfe] [font-family:var(--font-montserrat)]"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="group flex justify-between items-center  text-[17px] font-bold text-[#1D3C6A] transition-colors hover:text-[#3A5F9D] no-underline">
                  Быстрый доступ к мероприятиям
                </AccordionTrigger>
                <AccordionContent className="text-[#333] text-[14px] leading-[20px] pb-2">
                  Платформа показывает актуальные события рядом с вами — не
                  нужно тратить время на поиски в соцсетях или переписках.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="group flex justify-between items-center py-3 text-[17px] font-bold text-[#1D3C6A] transition-colors hover:text-[#3A5F9D] no-underline">
                  Удобное вступление и напоминания
                </AccordionTrigger>
                <AccordionContent className="text-[#333] text-[14px] leading-[20px] pb-2">
                  Вы можете вступать в события в один клик, получать напоминания
                  и быть уверенным, что не пропустите ничего важного.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="group flex justify-between items-center py-3 text-[17px] font-bold text-[#1D3C6A] transition-colors hover:text-[#3A5F9D] no-underline">
                  Общение и новые знакомства
                </AccordionTrigger>
                <AccordionContent className="text-[#333] text-[14px] leading-[20px] pb-2">
                  После вступления в событие можно общаться с другими
                  участниками — находите единомышленников ещё до начала
                  мероприятия.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Все события */}
        <Title text="Все события" size="lg" url="./" />
        <Filters />
      </Container>
    </>
  );
}
