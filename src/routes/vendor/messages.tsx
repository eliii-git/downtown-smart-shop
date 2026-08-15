"use client";
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, Send, User, Truck, Search, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/messages")({
  component: VendorMessages,
});

type Conversation = {
  id: string;
  name: string;
  role: "customer" | "transport";
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar: string;
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "John D.",
    role: "customer",
    lastMessage: "When will my order be delivered?",
    time: "2 min ago",
    unread: true,
    avatar: "JD",
  },
  {
    id: "2",
    name: "Sarah Transport",
    role: "transport",
    lastMessage: "I'm at the shop, ready to pick up the package",
    time: "15 min ago",
    unread: true,
    avatar: "ST",
  },
  {
    id: "3",
    name: "Mike K.",
    role: "customer",
    lastMessage: "Thanks for the quick delivery!",
    time: "1 hour ago",
    unread: false,
    avatar: "MK",
  },
  {
    id: "4",
    name: "Farasi Delivery",
    role: "transport",
    lastMessage: "Package delivered successfully",
    time: "3 hours ago",
    unread: false,
    avatar: "FD",
  },
];

const mockMessages: Record<string, { sender: string; text: string; time: string }[]> = {
  "1": [
    { sender: "customer", text: "Hi, I placed an order yesterday", time: "10:30 AM" },
    { sender: "vendor", text: "Hello! Yes, order ORD-501. It's being packed now.", time: "10:32 AM" },
    { sender: "customer", text: "Great, when will it be delivered?", time: "10:35 AM" },
    { sender: "vendor", text: "The delivery team will pick it up within the hour.", time: "10:36 AM" },
    { sender: "customer", text: "When will my order be delivered?", time: "10:38 AM" },
  ],
  "2": [
    { sender: "transport", text: "Hello, I'm assigned to pick up your package", time: "9:00 AM" },
    { sender: "vendor", text: "Great! It's ready at the counter.", time: "9:05 AM" },
    { sender: "transport", text: "I'm at the shop, ready to pick up the package", time: "9:15 AM" },
  ],
};

function VendorMessages() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; time: string }[]>>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      navigate({ to: "/auth/signin", replace: true });
    }
  }, [isAuthenticated, isLoading, user?.role, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const currentMessages = selectedId ? messages[selectedId] || [] : [];

  const handleSend = () => {
    if (!message.trim() || !selectedId) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { sender: "vendor", text: message.trim(), time }],
    }));
    setMessage("");
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user || user.role !== "vendor") {
    return null;
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/vendor/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-sm text-muted-foreground">Chat with customers and transporters</p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid h-[600px] md:grid-cols-[320px_1fr]">
            <div className="border-r border-border">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-9" />
                </div>
              </div>
              <div className="divide-y divide-border overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-secondary ${
                      selectedId === conv.id ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {conv.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {conv.role === "transport" ? (
                          <Truck className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <User className="h-3 w-3 text-muted-foreground" />
                        )}
                        <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
                      </div>
                    </div>
                    {conv.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {selectedConversation.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedConversation.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{selectedConversation.role}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {currentMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === "vendor" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                              msg.sender === "vendor"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`mt-1 text-xs ${msg.sender === "vendor" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                      <Button onClick={handleSend} disabled={!message.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <Send className="h-5 w-5" />
                    </div>
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
