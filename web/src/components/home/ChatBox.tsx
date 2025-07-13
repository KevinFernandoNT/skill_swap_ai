import React from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "mentor";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  isTyping?: boolean;
}

export function ChatBox() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      sender: "user",
      text: "Hi there! I'm interested in learning web development. I have some basic HTML knowledge but I'm struggling with JavaScript.",
      time: "10:03 AM",
      status: "read"
    },
    {
      id: 2,
      sender: "mentor",
      text: "Hello! I'd be happy to help you with JavaScript. I've been a frontend developer for 5 years. What specific concepts are you finding difficult?",
      time: "10:05 AM",
      status: "read"
    },
    {
      id: 3,
      sender: "user",
      text: "Thanks! I'm having trouble understanding async/await and promises. Could we have a session on that?",
      time: "10:07 AM",
      status: "read"
    },
    {
      id: 4,
      sender: "mentor",
      text: "Absolutely! Those concepts can be tricky at first. I can schedule a session this week where we can work through some examples together.",
      time: "10:08 AM",
      status: "delivered"
    },
    {
      id: 5,
      sender: "mentor",
      isTyping: true,
      text: "",
      time: "10:09 AM"
    }
  ]);

  return (
    <div className="border rounded-xl shadow-lg bg-white dark:bg-gray-900 overflow-hidden flex flex-col max-w-md w-full mx-auto md:mx-0 h-[500px] transform transition-all hover:shadow-xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">JD</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-black">Jhon Doe</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
          >
            {message.sender === "mentor" && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium mr-2 flex-shrink-0 self-end">
                JS
              </div>
            )}
            <div>
              {message.isTyping ? (
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-none py-2 px-4 max-w-xs">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "py-2 px-4 rounded-2xl max-w-xs",
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-gray-800 dark:bg-gray-700 text-white rounded-bl-none"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 ml-1">{message.time}</p>
            </div>
       
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3  bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-black">
            Type your message...
          </div>
          <button className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}