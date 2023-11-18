import { SearchInput } from '@/components/common/search-input';
import { ModeToggle } from '@/components/common/toggle'
import { UserButton } from "@clerk/nextjs";
import Image from 'next/image'

export default function Home() {
  return (
   <main className="h-full p-4 space-y-2">
      <SearchInput />
   </main>
  )
}
