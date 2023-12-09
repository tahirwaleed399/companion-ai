import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/common/search-input";
import { ModeToggle } from "@/components/common/toggle";
import { Companions } from "@/components/companions";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

export default async function Home({ searchParams }: RootPageProps) {
  const categories = await prismadb.category.findMany();
  const companions = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        contains: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc"
    },
  });
  console.log(companions);
  return (
    <main className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={companions} />
    </main>
  );
}
