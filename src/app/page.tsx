"use client";

"use client";

import { JSX, useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Send,
  Menu,
  X,
  Star,
  Clock,
  ChevronRight,
  FileText,
  RefreshCcw,
  SquarePlay,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

// Helper function to apply syntax highlighting
const applySyntaxHighlighting = (code: string, language: string) => {
  if (!language) return code;

  const tokenize = (code: string): JSX.Element[] => {
    // Basic syntax highlighting patterns
    const patterns = {
      // Keywords
      keywords: {
        pattern:
          /\b(function|return|if|for|while|class|const|let|var|import|from|export|default|async|await)\b/g,
        color: "text-[#C586C0]", // Pink for keywords
      },
      // Strings
      strings: {
        pattern: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
        color: "text-[#CE9178]", // Orange for strings
      },
      // Numbers
      numbers: {
        pattern: /\b\d+\.?\d*\b/g,
        color: "text-[#B5CEA8]", // Light green for numbers
      },
      // Comments
      comments: {
        pattern: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
        color: "text-[#6A9955]", // Green for comments
      },
      // Functions
      functions: {
        pattern: /\b\w+(?=\()/g,
        color: "text-[#DCDCAA]", // Yellow for function names
      },
      // Types
      types: {
        pattern: /\b(string|number|boolean|void|any|Promise)\b/g,
        color: "text-[#4EC9B0]", // Teal for types
      },
      // Variables and properties
      variables: {
        pattern: /\b[A-Za-z_]\w*\b(?!\()/g,
        color: "text-[#9CDCFE]", // Light blue for variables
      },
    };

    let result: JSX.Element[] = [];
    let lastIndex = 0;
    let match;

    // Process each pattern
    Object.entries(patterns).forEach(([type, { pattern, color }]) => {
      while ((match = pattern.exec(code)) !== null) {
        const start = match.index;
        const end = start + match[0].length;

        // Add plain text before the match
        if (start > lastIndex) {
          result.push(
            <span
              key={`plain-${lastIndex}-${start}`}
              className="text-[#D4D4D4]"
            >
              {code.slice(lastIndex, start)}
            </span>
          );
        }

        // Add the highlighted token
        result.push(
          <span key={`${type}-${start}-${end}`} className={color}>
            {match[0]}
          </span>
        );

        lastIndex = end;
      }
      pattern.lastIndex = 0; // Reset regex
    });

    // Add any remaining plain text
    if (lastIndex < code.length) {
      result.push(
        <span key={`plain-${lastIndex}-end`} className="text-[#D4D4D4]">
          {code.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return <>{tokenize(code)}</>;
};

const SuggestedPrompts = ({ onPromptClick, questions }: any) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {questions.map((prompt: string, index: number) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="bg-[#2C2C2C] hover:bg-[#363636] text-sm text-gray-300 px-4 py-2 rounded-full transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [currentSession, setCurrentSession] = useState<string>("1");
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Add this ref for scrolling

  // Add this scroll helper function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const botResponse: Message = {
        id: Date.now().toString(),
        content: event.data,
        role: "assistant",
        timestamp: new Date(),
      };

      

      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSession
            ? {
                ...session,
                messages: [...session.messages, botResponse],
              }
            : session
        )
      );

      setIsBotResponding(false);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentSession]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!input.trim() || !wsRef.current || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSession
          ? {
              ...session,
              messages: [...session.messages, newMessage],
            }
          : session
      )
    );

    wsRef.current.send(input);
    setInput("");
    setIsBotResponding(true);
  };

  const sendBot = (prompt: string) => {
    if (!wsRef.current || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: "user",
      timestamp: new Date(),
    };

    console.log(currentSession)

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSession
          ? {
              ...session,
              messages: [...session.messages, newMessage],
            }
          : session
      )
    );

    // Send message through WebSocket
    wsRef.current.send(prompt);

    setIsBotResponding(true);
  };

  const currentChat = sessions.find((s) => s.id === currentSession);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession.id);
  };

  const formatMessage = (
    content: string,
    isLastMessage: boolean,
    messageIndex: number
  ) => {
    let response;
    let parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g) as string[];
    try {
      console.log(content);
      const json = JSON.parse(content);
      response = json;
      console.log(response);
      parts = response.response.split(/(```[\s\S]*?```|`[^`]+`)/g) as string[];
    } catch (error) {}

    return (
      <div>
        {parts.map((part, index) => {
          // Handle multiline code blocks
          if (part.startsWith("```")) {
            const lines = part.split("\n");
            const language = lines[0].slice(3).trim();
            const code = lines.slice(1, -1).join("\n");

            return (
              <pre
                key={index}
                className="bg-[#1E1E1E] rounded-md p-3 my-2 overflow-x-auto"
              >
                {language && (
                  <div className="text-xs text-gray-400 mb-2 font-mono">
                    {language}
                  </div>
                )}
                <code className="font-mono text-sm">
                  {applySyntaxHighlighting(code, language)}
                </code>
              </pre>
            );
          }

          // Handle inline code snippets
          if (part.startsWith("`") && part.endsWith("`")) {
            const code = part.slice(1, -1);
            return (
              <code
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 font-mono text-sm inline"
              >
                {code}
              </code>
            );
          }

          // Handle regular text
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part.split("\n").map((line, i) => (
                <p key={i} className="mb-2 last:mb-0 inline">
                  {line}
                </p>
              ))}
            </span>
          );
        })}
        {isLastMessage &&
          currentChat &&
          messageIndex === currentChat?.messages.length - 1 && (
            <SuggestedPrompts
              questions={response?.questions || []}
              onPromptClick={(prompt: any) => {
                sendBot(prompt);
                setTimeout(() => handleSubmit(), 100);
              }}
            />
          )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#1A1A1A] text-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-10 w-[260px] h-full bg-[#1A1A1A] border-r border-[#2A2A2A] transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b border-[#2A2A2A]">
          <button
            onClick={createNewChat}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2C2C2C] rounded-md hover:bg-[#363636] flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Start new chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              <span>Recent</span>
            </div>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setCurrentSession(session.id);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-[#2C2C2C] rounded-md text-sm ${
                  session.id === currentSession ? "bg-[#2C2C2C]" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="truncate text-gray-300">
                    {session.messages.length > 0
                      ? session.messages[0].content.substring(0, 30) + "..."
                      : "New chat"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-2 p-2 hover:bg-[#2C2C2C] rounded-md cursor-pointer">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm">AZ</span>
            </div>
            <span className="text-sm flex-1">user@example.com</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[100%] flex flex-col h-full relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-[#2C2C2C] rounded-md"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Welcome Message */}
        {!currentChat?.messages.length && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Image
                src="https://mmsn7692iu.ufs.sh/f/0NwYfOQDdha1LJYTrNdi8d93fOMcjlCVYGPksB1Zg4qNWLye"
                className="w-24 h-24 mx-auto rounded-full "
                width={96}
                height={96}
                alt="Assistant"
              />

              <h1 className="text-4xl font-light mb-6">Good afternoon</h1>
              <div className="max-w-xl mx-auto">
                <p className="text-gray-300">How can I help you today?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <button
                    onClick={() => {
                      sendBot("How do I create a smart contract?");
                    }}
                    className="p-4 bg-[#2C2C2C] rounded-lg hover:bg-[#363636] text-left"
                  >
                    <FileText className="w-5 h-5 mb-2" />
                    <p className="text-sm">How do I create a smart contract?</p>
                  </button>
                  <button
                    onClick={() => {
                      sendBot("How do I get started with Aptos?");
                    }}
                    className="p-4 bg-[#2C2C2C] rounded-lg hover:bg-[#363636] text-left"
                  >
                    <SquarePlay className="w-5 h-5 mb-2" />
                    <p className="text-sm">How do I get started with Aptos?</p>
                  </button>
                  <button
                    onClick={() => {
                      sendBot("What is the lifecycle of a Aptos transaction?");
                    }}
                    className="p-4 bg-[#2C2C2C] rounded-lg hover:bg-[#363636] text-left"
                  >
                    <RefreshCcw className="w-5 h-5 mb-2" />
                    <p className="text-sm">
                      What is the lifecycle of a Aptos transaction?
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}

        <div className="flex-1 max-width-[80%] overflow-y-auto p-4 space-y-4">
          {currentChat && currentChat.messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[60%] rounded-lg p-4 ${
                      message.role === "user" ? "bg-[#2C2C2C]" : "bg-[#363636]"
                    }`}
                  >
                    {formatMessage(
                      message.content,
                      message.role === "assistant",
                      index
                    )}
                  </div>
                </div>
              ))}
              {isBotResponding && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-[#363636]">
                    <LoadingSpinner />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-[#2A2A2A] bg-[#1A1A1A] p-4">
          {!isBotResponding && (
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="w-full px-4 py-3 bg-[#2C2C2C] rounded-lg pr-24 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="p-2 hover:bg-[#363636] rounded-md"
                  disabled={!input.trim()}
                >
                  <Send className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
