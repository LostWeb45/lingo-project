import { Container, Filters, Title } from "@/components/shared/";

export default async function Home() {
  return (
    <>
      <Container>
        <Title text="Все события" size="lg" url="./" />
        <div className="h-[30000px]"></div>
        <Filters />
      </Container>
    </>
  );
}
