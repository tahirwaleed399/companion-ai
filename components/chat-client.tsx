"use client"
import { Companion, Message } from '@prisma/client'
import React, { FormEvent, useState } from 'react'
import { ChatHeader } from './chat-header'
import { Button } from './ui/button';
import axios from 'axios';
import { useCompletion } from "ai/react";
import { useRouter } from 'next/navigation';
import {  ChatMessageProps } from './chat-message';
import { ChatMessages } from './chat-messages';
import { ChatForm } from './chat-form';

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    }
  };
};

const ChatClient = ({companion} : ChatClientProps) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
  const router = useRouter();
  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    api: `/api/chat/${companion.id}`,
    onFinish(_prompt, completion) {
      const systemMessage: ChatMessageProps = {
        role: "system",
        content: completion
      };

      setMessages((current) => [...current, systemMessage]);
      setInput("");

      router.refresh();
    },
  });
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
    <ChatHeader companion={companion} />
    <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
       <ChatForm
        isLoading={isLoading} 
        input={input} 
        handleInputChange={handleInputChange} 
        onSubmit={onSubmit} 
      />
</div>
  )
}

export default ChatClient