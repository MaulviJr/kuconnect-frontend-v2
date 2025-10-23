import React, { useRef, useEffect, useState } from "react";
import { FaArrowUp, FaSquare } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

function ChatBot({ isOpen, onToggle }) {
  const chatContainerRef = useRef(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;


  // Dummy messages
  const [messages, setMessages] = useState([]);

  // Dummy input
  const [sendMsgField, setSendMsgField] = useState("");

  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [fetchController, setFetchController] = useState(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessageTime = (msgDate) => {
    const date = new Date(msgDate);
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSendMsgFormSubmit = async (e) => {
    e.preventDefault();
    if (!sendMsgField.trim()) return;

    const userQuestion = sendMsgField;
    const newMsg = {
      message: sendMsgField,
      isSent: true,
      createdAt: new Date().toISOString(),
      senderId: { username: "Me" },
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setSendMsgField("");
    setIsFetchingResponse(true);

    const controller = new AbortController();
    setFetchController(controller);

    try {
      const res = await fetch(`${baseURL}/rag/get-llm-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({
          userQuestion,
        }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        const llmMsg = {
          message: data.data.response,
          isSent: false,
          createdAt: new Date().toISOString(),
          senderId: { username: "Me" },
        };
        setMessages((prevMessages) => [...prevMessages, llmMsg]);
      }else{
        throw new Error (data.message)
      }
    } catch (error) {
    console.log("heyheyhey")
        const llmMsg = {
            message: `Failed to get response\nIssue:${error.message}`,
            isSent: false,
            createdAt: new Date().toISOString(),
            senderId: { username: "Me" },
          };
          setMessages((prevMessages) => [...prevMessages, llmMsg]);

      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error(error);
      }
    } finally {
      setIsFetchingResponse(false);
      setFetchController(null);
    }
  };

  const handleSendMsgFieldChange = (e) => {
    setSendMsgField(e.target.value);
  };

  const handleSendOrCancel = async (e) => {
    if (isFetchingResponse) {
      // Cancel the ongoing fetch
      if (fetchController) {
        fetchController.abort();
        setFetchController(null);
      }
      setIsFetchingResponse(false);
    }
    // Otherwise, let the form submit handle sending
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Minimized State - Green Circle */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="minimized"
            initial={{ scale: 0.3, opacity: 0, }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onToggle}
            className="w-14 h-14 fixed bottom-6 right-6 z-50 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="text-white" size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded State - Full Chatbot */}
      <AnimatePresence mode="wait">
        {isOpen && (
         <motion.div
         key="expanded"
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 0, opacity: 0 }}
         transition={{ duration: 0.3, ease: "easeInOut" }}
         style={{ transformOrigin: "bottom right" }} // 👈 this is the magic
         className="chats-container max-w-full w-screen sm:w-96 aspect-[10/16] rounded-md overflow-hidden flex flex-col shadow-2xl bg-gray-100 fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 h-screen sm:h-auto"
       >
            <div
              className="px-4 py-2 bg-green-500"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              <div className="pfp-por">
                <img />
              </div>
              <div className="username-por">
                <p className="font-poppins font-semibold text-2xl">KU Bot</p>
              </div>
              <div className="navigation-por" style={{ marginLeft: "auto" }}>
                <button 
                  onClick={onToggle} 
                  className="hover:bg-green-600 rounded p-1 transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            </div>

            <div
              className="flex flex-col flex-1 mb-2 gap-y-6 pt-4 pb-2 px-2.5 overflow-auto bg-gray-100"
              ref={chatContainerRef}
            >
              {messages?.map((value, index) => (
                <p
                  key={index}
                  className={`inline-block rounded-lg mx-1.5 max-w-3/4 px-4 py-2.5 leading-5 font-light text-gray-800 text-[15px] text-start font-jost ${
                    value.isSent ? "self-end bg-green-300" : "self-start bg-gray-200"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-6" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-6" {...props} />
                      ),
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    }}
                  >
                    {value.message}
                  </ReactMarkdown>

                  <p
                    className="text-start"
                    style={{ fontSize: "10px", margin: 0 }}
                  >
                    {getMessageTime(value.createdAt)}
                  </p>
                </p>
              ))}
              {isFetchingResponse && (
                <p
                  className={
                    "inline-block rounded-lg mx-1.5 max-w-3/4 px-4 py-2.5 leading-5 font-light text-gray-600 text-sm self-start bg-gray-200 text-start"
                  }
                >
                  <Spinner variant="ellipsis" className="mx-auto" />
                </p>
              )}
            </div>

            <form
              className="mx-2 mb-2 flex gap-2"
              onSubmit={handleSendMsgFormSubmit}
            >
              <input
                id="send-msg-input"
                type="text"
                placeholder="Type a message"
                value={sendMsgField}
                onChange={handleSendMsgFieldChange}
                className="flex-1 px-3.5 py-2 rounded-md bg-gray-200"
              />
              <button
                id="send-msg-btn"
                type="submit"
                className="p-3 bg-green-500 rounded-lg"
                onClick={handleSendOrCancel}
              >
                {!isFetchingResponse ? (
                  <FaArrowUp className="text-gray-200" />
                ) : (
                  <FaSquare className="text-gray-200 animate-pulse" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot;