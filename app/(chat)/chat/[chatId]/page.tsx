import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import ChatClient from "@/components/chat-client";
import prismadb from "@/lib/prismadb";
import { Companion, Message } from "@prisma/client";

// import { ChatClient } from "./components/client";

interface ChatIdPageProps {
  params: {
    chatId: string;
  }
}


interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    }
  };
};

const ChatIdPage = async ({
  params
}: ChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }
  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc"
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        }
      }
    }
  });
  



  if (!companion) {
    return redirect("/");
  }

  return (
    <>
 
    <ChatClient companion={companion as any} />
    </>
  );
}
 
export default ChatIdPage;