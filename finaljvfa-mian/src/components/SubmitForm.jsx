import { useState } from "react";
import { useTranslation } from "react-i18next";
import botImg from "../assets/rounded-bot.png";
import { SendHorizontal } from "lucide-react";
import { http } from "../http";
import {
  callAiApi,
  callCustomerService,
  fetchUserBalance,
  fetch_Spendings,
  fetch_recent_transactions,
} from "../utils";
const SubmitForm = ({
  setMessages,
  messages,
  setAmounts,
  setCategories,

  setIsLoading,
}) => {
  const [inputValue, setInputValue] = useState("");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    console.log(inputValue);
    setMessages([
      ...messages,
      {
        text: inputValue,
        sender: "user",
        time: new Date().toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    if (inputValue === t("basicQuestions.q1")) {
      fetchUserBalance(t, setMessages, setIsLoading);
    } else if (inputValue === t("basicQuestions.q2")) {
      fetch_Spendings(t, setMessages, setAmounts, setCategories, setIsLoading);
    } else if (inputValue === t("basicQuestions.q4")) {
      fetch_recent_transactions(setMessages, setIsLoading);
    } else if (inputValue === t("basicQuestions.q3")) {
      setMessages((messages) => [
        ...messages,
        {
          text: `${t("api-answers.appointment")}`,
          sender: "bot",
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else if (inputValue === "account balance" || inputValue === "رصيدي") {
      fetchUserBalance(t, setMessages, setIsLoading);
    } else if (
      inputValue === "spend" ||
      inputValue === "انفقت" ||
      inputValue === "أنفقت"
    ) {
      fetch_Spendings(t, setMessages, setAmounts, setCategories, setIsLoading);
    } else if (
      inputValue === "recent transactions" ||
      inputValue === "عملياتي"
    ) {
      fetch_recent_transactions(setMessages, setIsLoading);
    } else if (inputValue === "appointment" || inputValue === "موعد") {
      setMessages((messages) => [
        ...messages,
        {
          text: `${t("api-answers.appointment")}`,
          sender: "bot",
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else if (inputValue === "customer service" || inputValue === "التواصل") {
      callCustomerService(inputValue, messages, setMessages, t);
    } else {
      callAiApi(inputValue, messages, setMessages, setIsLoading);
    }

    setInputValue("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed flex items-center justify-center gap-2 bottom-0 right-40 w-[75%] bg-white p-4 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      <div>
        <img src={botImg} alt="bot" className="max-w-14" />
      </div>
      <div className="relative w-full ">
        <input
          dir={isRTL ? "rtl" : "ltr"}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t("chatbot.placeholder")}
          className="w-full bg-[#F2F2F3] focus:border-[#505eff] focus:outline-none rounded-md px-3 py-4 "
        />
        <button
          type="submit"
          className={`absolute bg-[#024A52] hover:bg-[#32686e] ${
            isRTL ? "left-0" : "right-0"
          } top-[0] h-full rounded-md`}
        >
          <SendHorizontal
            size={20}
            fill="#fff"
            color="#fff"
            className={` ${isRTL ? "rotate-180" : ""} w-24`}
          />
        </button>
      </div>
    </form>
  );
};

export default SubmitForm;