import { Container, Filters, Title } from "@/components/shared/";
import { Button } from "@/components/ui";

export default async function Home() {
  return (
    <>
      <Container>
        <div className="flex justify-between ">
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
            <Button className="w-[180px] h-[50px]">Кнопка</Button>
          </div>
        </div>

        {/* Все события */}
        <Title text="Все события" size="lg" url="./" />
        <Filters />
      </Container>
    </>
  );
}
