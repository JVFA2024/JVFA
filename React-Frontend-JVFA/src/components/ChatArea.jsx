import { useState } from "react";

import ChatBox from "./ChatBox";
import ModalInfo from "./ModalInfo";
import SideBar from "./SideBar";
import { useTranslation } from "react-i18next";

const ChatArea = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <div className={`flex h-screen ${isRtl ? "flex-row-reverse" : ""}`}>
      <SideBar handleOpen={handleOpen} setMessages={setMessages} />
      <ChatBox messages={messages} setMessages={setMessages} />
      <ModalInfo
        open={open}
        setOpen={setOpen}
        size={size}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ChatArea;
