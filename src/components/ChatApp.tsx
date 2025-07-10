import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Zap, Users, X, UserPlus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VipUpgradeModal } from "./VipUpgradeModal";

interface Message {
  id: string;
  text: string;
  sender: "user" | "partner";
  username: string;
  timestamp: Date;
}

type ChatState = "login" | "waiting" | "searching" | "connected";

export function ChatApp() {
  const [chatState, setChatState] = useState<ChatState>("login");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [partnerUsername, setPartnerUsername] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [searchingDots, setSearchingDots] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipTimer, setVipTimer] = useState<NodeJS.Timeout | null>(null);
  const [chatCount, setChatCount] = useState(0);
  const [gender, setGender] = useState<'' | 'male' | 'female' | 'other'>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Increment chat count
  const incrementChatCount = () => {
    setChatCount(prev => {
      const newCount = prev + 1;
      // Save to localStorage to persist across page refreshes
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatCount', newCount.toString());
      }
      return newCount;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animated dots for searching state
  useEffect(() => {
    if (chatState === "searching") {
      const interval = setInterval(() => {
        setSearchingDots(prev => {
          if (prev === "...") return "";
          return prev + ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [chatState]);

  // Timeout for searching state (30 seconds)
  useEffect(() => {
    if (chatState === "searching") {
      const timeout = setTimeout(() => {
        toast({
          title: "No users found",
          description: "Would you like to try connecting again?",
          variant: "destructive",
        });
        handleStopSearching();
      }, 30000); // 30 seconds timeout

      setSearchTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    } else {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
    }
  }, [chatState]);

  // Set up realtime subscriptions for user session changes
  useEffect(() => {
    if ((chatState === "searching" || chatState === "waiting") && sessionId) {
      // Subscribe to changes in user sessions to detect when we get matched
      const userSessionChannel = supabase
        .channel('user-session-channel')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_sessions',
            filter: `session_id=eq.${sessionId}`
          },
          async (payload) => {
            if (payload.new.status === 'matched') {
              // Clear search timeout if it exists
              if (searchTimeout) {
                clearTimeout(searchTimeout);
                setSearchTimeout(null);
              }

              // Find our chat room
              const { data: rooms } = await supabase
                .from('chat_rooms')
                .select('*')
                .or(`user1_session_id.eq.${sessionId},user2_session_id.eq.${sessionId}`)
                .is('ended_at', null)
                .limit(1);

              if (rooms && rooms.length > 0) {
                const room = rooms[0];
                const partnerSessionId = room.user1_session_id === sessionId 
                  ? room.user2_session_id 
                  : room.user1_session_id;

                // Get partner username
                const { data: partnerData } = await supabase
                  .from('user_sessions')
                  .select('username')
                  .eq('session_id', partnerSessionId)
                  .single();

                setRoomId(room.id);
                setPartnerUsername(partnerData?.username || "Unknown");
                setChatState("connected");
                setMessages([]);
                
                toast({
                  title: "Connected!",
                  description: `${partnerData?.username || "Someone"} joined the chat`,
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(userSessionChannel);
      };
    }
  }, [chatState, sessionId, searchTimeout]);

  // Set up realtime subscriptions when connected
  useEffect(() => {
    if (chatState === "connected" && roomId) {
      // Subscribe to new messages
      const messagesChannel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`
          },
          async (payload) => {
            const newMessage = payload.new;
            
            // Only add partner messages (not our own)
            if (newMessage.sender_session_id !== sessionId) {
              // Get sender username
              const { data: senderData } = await supabase
                .from('user_sessions')
                .select('username')
                .eq('session_id', newMessage.sender_session_id)
                .single();

              const partnerMessage: Message = {
                id: newMessage.id,
                text: newMessage.message_text,
                sender: "partner",
                username: senderData?.username || "Unknown",
                timestamp: new Date(newMessage.created_at),
              };
              
              setMessages(prev => [...prev, partnerMessage]);
            }
          }
        )
        .subscribe();

      // Subscribe to room updates (for disconnections)
      const roomChannel = supabase
        .channel('room-channel')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_rooms',
            filter: `id=eq.${roomId}`
          },
          async (payload) => {
            if (payload.new.ended_at) {
              try {
                // Get the room data to find the other user's session ID
                const { data: roomData, error: roomError } = await supabase
                  .from('chat_rooms')
                  .select('user1_session_id, user2_session_id')
                  .eq('id', roomId)
                  .single();

                if (roomError) throw roomError;
                if (!roomData) return;

                const otherUserSessionId = roomData.user1_session_id === sessionId 
                  ? roomData.user2_session_id 
                  : roomData.user1_session_id;

                // Update both users' statuses to waiting
                const updates = [
                  supabase
                    .from('user_sessions')
                    .update({ 
                      status: 'waiting',
                      updated_at: new Date().toISOString()
                    })
                    .eq('session_id', sessionId)
                ];

                if (otherUserSessionId) {
                  updates.push(
                    supabase
                      .from('user_sessions')
                      .update({ 
                        status: 'waiting',
                        updated_at: new Date().toISOString()
                      })
                      .eq('session_id', otherUserSessionId)
                  );
                }

                await Promise.all(updates);

                // Reset UI state
                setChatState("waiting");
                setPartnerUsername("");
                setMessages([]);
                setRoomId("");
                
                toast({
                  title: "Chat ended",
                  description: "The chat has been ended by the other user",
                  variant: "destructive",
                });
              } catch (error) {
                console.error('Error handling room update:', error);
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(roomChannel);
      };
    }
  }, [chatState, roomId, sessionId, partnerUsername]);

  // Load chat count from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChatCount = localStorage.getItem('chatCount');
      if (savedChatCount) {
        setChatCount(parseInt(savedChatCount, 10));
      }
    }
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      if (vipTimer) {
        clearTimeout(vipTimer);
      }
    };
  }, [searchTimeout, vipTimer]);

  // Track chat count and show VIP popup
  useEffect(() => {
    if (chatState === 'connected') {
      clearVipTimer();
    } else if (chatState === 'waiting') {
      // Show VIP popup after every 10 chats
      if (chatCount > 0 && chatCount % 10 === 0) {
        setShowVipModal(true);
      }
      startVipTimer();
    }
    return () => clearVipTimer();
  }, [chatState, chatCount]);

  const handleLogin = async () => {
    if (username.trim().length >= 2 && gender) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Create user session in database
      const { error } = await supabase
        .from('user_sessions')
        .insert([
          { 
            session_id: newSessionId, 
            username: username.trim(),
            gender: gender,
            status: 'waiting',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_vip: false
          }
        ]);

      if (error) {
        toast({
          title: "Connection Error",
          description: "Failed to connect to server",
          variant: "destructive",
        });
        return;
      }

      setChatState("waiting");
      toast({
        title: "Welcome to TextBuddies!",
        description: `Logged in as ${username}`,
      });
    } else {
      toast({
        title: "Invalid username",
        description: "Username must be at least 2 characters long",
        variant: "destructive",
      });
    }
  };

  // Function to clean up old chat rooms
  const cleanupOldChats = async () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    await supabase
      .from('chat_rooms')
      .update({ 
        ended_at: new Date().toISOString() 
      })
      .lt('created_at', oneDayAgo.toISOString())
      .is('ended_at', null);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setChatState("searching");
    
    try {
      // First, clean up any old chats
      await cleanupOldChats();
      
      // End any existing active rooms for this user
      await supabase
        .from('chat_rooms')
        .update({ 
          ended_at: new Date().toISOString() 
        })
        .or(`user1_session_id.eq.${sessionId},user2_session_id.eq.${sessionId}`)
        .is('ended_at', null);
      
      // Update user status to connecting
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ 
          status: 'connecting',
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (updateError) throw updateError;

      // First, try to find an opposite gender match
      const { data: oppositeGenderUsers, error: oppositeGenderError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('status', 'connecting')
        .neq('session_id', sessionId)
        .neq('gender', gender) // Look for opposite gender
        .order('updated_at', { ascending: true })
        .limit(1);

      // If no opposite gender found, look for any available user
      const searchQuery = oppositeGenderUsers?.length 
        ? oppositeGenderUsers 
        : await supabase
            .from('user_sessions')
            .select('*')
            .eq('status', 'connecting')
            .neq('session_id', sessionId)
            .order('updated_at', { ascending: true })
            .limit(1);

      const searchingUsers = oppositeGenderUsers?.length 
        ? oppositeGenderUsers 
        : searchQuery.data;
      const searchError = oppositeGenderError || searchQuery.error;

      if (searchError) throw searchError;

      if (searchingUsers && searchingUsers.length > 0) {
        const partner = searchingUsers[0];
        
        try {
          // First, try to update the partner's status to matched
          const { error: updatePartnerError } = await supabase
            .from('user_sessions')
            .update({ 
              status: 'matched',
              updated_at: new Date().toISOString()
            })
            .eq('session_id', partner.session_id)
            .eq('status', 'connecting'); // Ensure they're still connecting

          // If we couldn't update the partner, they might have already been matched
          if (updatePartnerError) throw updatePartnerError;
          
          // Update our own status
          await supabase
            .from('user_sessions')
            .update({ 
              status: 'matched',
              updated_at: new Date().toISOString()
            })
            .eq('session_id', sessionId);

          // Create a new chat room
          const { data: room, error: roomError } = await supabase
            .from('chat_rooms')
            .insert({
              user1_session_id: sessionId < partner.session_id ? sessionId : partner.session_id,
              user2_session_id: sessionId < partner.session_id ? partner.session_id : sessionId,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (roomError) throw roomError;

          // Set up the chat room
          setRoomId(room.id);
          setPartnerUsername(partner.username);
          setChatState("connected");
          setMessages([]);
          
          toast({
            title: "Match found!",
            description: `You're now chatting with ${partner.username}`,
          });
          
          // Clear any existing search timeout
          if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(null);
          }
        } catch (error) {
          console.error('Error creating chat:', error);
          // If there was an error, try connecting again
          return handleConnect();
        }
      } else {
        // No one is searching, so we become the searcher
        await supabase
          .from('user_sessions')
          .update({ 
            status: 'connecting',
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);

        // Set a timeout to stop searching after 30 seconds
        const timeoutId = setTimeout(async () => {
          const { data: currentUser } = await supabase
            .from('user_sessions')
            .select('status')
            .eq('session_id', sessionId)
            .single();

          if (currentUser?.status === 'connecting') {
            await supabase
              .from('user_sessions')
              .update({ 
                status: 'waiting',
                updated_at: new Date().toISOString()
              })
              .eq('session_id', sessionId);

            setChatState("waiting");
            
            toast({
              title: "No one available",
              description: "Couldn't find anyone to connect with. Please try again later.",
              variant: "destructive",
            });
          }
        }, 30000);

        // Clear previous timeout if it exists
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        setSearchTimeout(timeoutId);

        toast({
          title: "Looking for someone...",
          description: "Waiting for another user to connect",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      // Reset status back to waiting on error
      await supabase
        .from('user_sessions')
        .update({ status: 'waiting' })
        .eq('session_id', sessionId);
        
      toast({
        title: "Connection failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
    
    setIsConnecting(false);
  };

  // Handle disconnection when user clicks the stop button
  // Show VIP upgrade modal after 5 minutes
  const startVipTimer = () => {
    // Clear any existing timer
    if (vipTimer) {
      clearTimeout(vipTimer);
    }
    
    // Set new timer for 5 minutes
    const timer = setTimeout(() => {
      setShowVipModal(true);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    setVipTimer(timer);
  };

  // Clear VIP timer when component unmounts or when starting a new chat
  const clearVipTimer = () => {
    if (vipTimer) {
      clearTimeout(vipTimer);
      setVipTimer(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Increment chat count when chat ends
      incrementChatCount();
      // Start the VIP timer when chat ends
      startVipTimer();
      const roomIdToEnd = roomId;
      if (!roomIdToEnd) {
        // If no room ID, just reset the UI
        setChatState("waiting");
        setPartnerUsername("");
        setMessages([]);
        return;
      }
      
      // Get the room data to find the partner's session ID
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .select('user1_session_id, user2_session_id, ended_at')
        .eq('id', roomIdToEnd)
        .single();

      if (roomError) throw roomError;

      // Only proceed if the room exists and isn't already ended
      if (roomData && !roomData.ended_at) {
        // Determine partner's session ID
        const partnerSessionId = roomData.user1_session_id === sessionId 
          ? roomData.user2_session_id 
          : roomData.user1_session_id;

        // Update the chat room to mark it as ended
        const { error: updateRoomError } = await supabase
          .from('chat_rooms')
          .update({ 
            ended_at: new Date().toISOString()
          })
          .eq('id', roomIdToEnd);

        if (updateRoomError) throw updateRoomError;

        // Update both users' statuses in a single transaction
        const updates = [
          supabase
            .from('user_sessions')
            .update({ 
              status: 'waiting',
              updated_at: new Date().toISOString()
            })
            .eq('session_id', sessionId),
        ];

        if (partnerSessionId) {
          updates.push(
            supabase
              .from('user_sessions')
              .update({ 
                status: 'waiting',
                updated_at: new Date().toISOString()
              })
              .eq('session_id', partnerSessionId)
          );
        }

        // Execute all updates
        await Promise.all(updates);
      }

      // Reset UI state
      setChatState("waiting");
      setPartnerUsername("");
      setMessages([]);
      setRoomId("");
      
      toast({
        title: "Chat ended",
        description: "You've left the chat",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      // Even if there's an error, make sure we reset the UI state
      setChatState("waiting");
      setPartnerUsername("");
      setMessages([]);
      setRoomId("");
      
      toast({
        title: "Error",
        description: "There was an issue disconnecting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopSearching = async () => {
    try {
      // Clear timeout if it exists
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }

      // Reset status back to waiting
      await supabase
        .from('user_sessions')
        .update({ status: 'waiting' })
        .eq('session_id', sessionId);
      
      setChatState("waiting");
      toast({
        title: "Search stopped",
        description: "You can try connecting again anytime",
      });
    } catch (error) {
      console.error('Error stopping search:', error);
    }
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() && chatState === "connected" && roomId) {
      try {
        // Save message to database
        const { error } = await supabase
          .from('messages')
          .insert({
            room_id: roomId,
            sender_session_id: sessionId,
            message_text: currentMessage.trim()
          });

        if (error) throw error;

        // Add message to local state immediately
        const newMessage: Message = {
          id: Date.now().toString(),
          text: currentMessage.trim(),
          sender: "user",
          username,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
        setCurrentMessage("");
      } catch (error) {
        toast({
          title: "Failed to send message",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatState === "connected") {
        handleSendMessage();
      } else if (chatState === "waiting") {
        handleConnect();
      }
    }
  };

  if (chatState === "login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">TextBuddies</h1>
          <p className="text-muted-foreground mb-8">
            Connect with random people for instant text chats
          </p>
          <div className="space-y-4">
            <Input
              placeholder="Enter a username (2+ characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="text-center"
              maxLength={20}
            />
            <div className="mb-4">
              <label className="block mb-2">I am a:</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`flex items-center p-3 border rounded-lg ${gender === 'male' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input
                    type="radio"
                    id="male-radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="male-radio" className="ml-2 cursor-pointer">
                    <div className="font-medium">Male</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Connect with anyone</div>
                  </label>
                </div>
                <div className={`flex items-center p-3 border rounded-lg ${gender === 'female' ? 'border-pink-500' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input
                    type="radio"
                    id="female-radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="female-radio" className="ml-2 cursor-pointer">
                    <div className="font-medium">Female</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Connect with anyone</div>
                  </label>
                </div>
                <div className={`flex items-center p-3 border rounded-lg ${gender === 'other' ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input
                    type="radio"
                    id="other-radio"
                    name="gender"
                    value="other"
                    checked={gender === 'other'}
                    onChange={() => setGender('other')}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="other-radio" className="ml-2 cursor-pointer">
                    <div className="font-medium">Other</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Connect with anyone</div>
                  </label>
                </div>
                <div 
                  className="p-3 border border-yellow-400 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors"
                  onClick={() => setShowVipModal(true)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                      <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                    </svg>
                    <div>
                      <div className="font-medium text-yellow-700 dark:text-yellow-300">VIP: Connect with Girls</div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">Upgrade to VIP to connect only with girls</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full mb-3" 
              size="lg"
              disabled={username.trim().length < 2 || !gender}
            >
              Start Private Chat
            </Button>
            <Button 
              variant="outline"
              className="w-full" 
              size="lg"
              asChild
            >
              <a 
                href="https://indianchatrooms.freshcart.fun/public-rooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Enter Public Chat Rooms
              </a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-chat-background flex flex-col overflow-hidden">
      {/* Chat Header - Fixed position */}
      <div className="bg-background border-b p-3 md:p-4 flex items-center justify-between flex-shrink-0 fixed top-0 left-0 right-0 z-50 h-16 md:h-auto md:relative">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="h-8 w-8 md:h-10 md:w-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm md:text-base truncate">
              {chatState === "connected" ? `Chat with ${partnerUsername}` : `Welcome, ${username}!`}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground truncate">
              {chatState === "connected" && "Connected • Online"}
              {chatState === "waiting" && "Ready to connect"}
              {chatState === "searching" && `Looking for someone${searchingDots}`}
            </p>
          </div>
        </div>
        <div className="flex gap-1 md:gap-2 flex-shrink-0">
          {(chatState === "waiting" || chatState === "searching") && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowVipModal(true)}
              className="text-xs md:text-sm bg-yellow-500 hover:bg-yellow-600 text-white border-0"
            >
              <Zap className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              VIP
            </Button>
          )}
          {chatState === "connected" && (
            <Button variant="stop" size="sm" onClick={handleDisconnect} className="text-xs md:text-sm">
              <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Stop
            </Button>
          )}
          {chatState === "searching" && (
            <Button variant="outline" size="sm" onClick={handleStopSearching} className="text-xs md:text-sm">
              <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Messages - Adjusted for fixed header */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 pt-20 md:pt-4 pb-20 md:pb-4">
        {chatState === "waiting" && (
          <div className="text-center py-8">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Ready to Connect</h3>
            <p className="text-muted-foreground mb-6">
              Click the connect button below to find someone to chat with
            </p>
          </div>
        )}

        {chatState === "searching" && (
          <div className="text-center py-8">
            <div className="h-16 w-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Finding someone{searchingDots}</h3>
            <p className="text-muted-foreground mb-4">
              Please wait while we connect you with another user
            </p>
            <p className="text-xs text-muted-foreground">
              We'll match you with the next person who clicks connect
            </p>
            <p className="text-xs text-muted-foreground mt-2 opacity-75">
              Search will timeout in 30 seconds if no one is available
            </p>
          </div>
        )}

        {chatState === "connected" && messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Say hello to start the conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              message.sender === "user" 
                ? "bg-chat-bubble-user text-primary-foreground" 
                : "bg-chat-bubble-partner text-foreground"
            }`}>
              <p className="text-xs opacity-70 mb-1">{message.username}</p>
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed position */}
      <div className="bg-background border-t p-3 md:p-4 flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 md:relative">
        <div className="flex gap-2 max-w-4xl mx-auto">
          {chatState === "connected" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              className="flex-shrink-0 text-xs md:text-sm"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          )}
          
          {chatState === "waiting" ? (
            <Button 
              onClick={handleConnect} 
              variant="connect"
              size="xl"
              className="w-full text-sm md:text-base"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  Finding someone...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Connect
                </>
              )}
            </Button>
          ) : chatState === "searching" ? (
            <Button 
              variant="outline"
              size="xl"
              className="w-full text-sm md:text-base"
              disabled
            >
              <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
              Searching{searchingDots}
            </Button>
          ) : (
            <>
              <Input
                placeholder="Type your message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm md:text-base"
                maxLength={500}
              />
              <Button 
                onClick={handleSendMessage}
                variant="chat"
                disabled={!currentMessage.trim()}
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {chatState === "waiting" && "Press Enter or click Connect to find someone to chat with"}
          {chatState === "searching" && "Searching for available users... Click Cancel to stop"}
          {chatState === "connected" && "Press Enter to send • Maximum 500 characters"}
        </p>
      </div>
      
      {/* VIP Upgrade Modal */}
      {showVipModal && (
        <VipUpgradeModal onClose={() => setShowVipModal(false)} />
      )}
    </div>
  );
}