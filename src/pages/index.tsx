import MainLayout from "@/components/Layouts/MainLayout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <MainLayout>
      <h1>dupa</h1>
      <h2>{session?.user?.name}</h2>
    </MainLayout>
  );
}
