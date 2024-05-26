import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { http } from "../http";

import { BotMessages } from "./BotMessages";
import SubmitForm from "./SubmitForm";
import { UserMessages } from "./UserMessages";
import {
  callAiApi,
  callCustomerService,
  fetchUserBalance,
  fetch_Spendings,
  fetch_recent_transactions,
} from "../utils";
const ChatBox = ({ messages, setMessages }) => {
  const { t, i18n } = useTranslation();
  const [amounts, setAmounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const isRTL = i18n.dir() === "rtl";

  const fetch_Month_Spendings = async (selectedMonth) => {
    setIsLoading(true);
    try {
      const response = await http.get("/user_spendings");
      const data = await response.data;
      if (response.status === 200) {
        if (data.spendings && data.spendings.length > 0) {
          const filteredSpendings = data.spendings.filter((spending) => {
            const date = new Date(spending.date);
            const monthString = date.toLocaleString("default", {
              month: "long",
            });
            return monthString === selectedMonth;
          });

          if (filteredSpendings.length > 0) {
            const amountsObj = filteredSpendings.reduce((acc, spending) => {
              const category = spending.category;
              const date = new Date(spending.date).toLocaleDateString("en-US");
              if (!acc[category]) {
                acc[category] = {
                  amount: 0,
                  dates: [],
                };
              }
              acc[category].amount += spending.amount;
              acc[category].dates.push(date);
              return acc;
            }, {});

            const amounts = Object.values(amountsObj).map(
              (item) => item.amount
            );
            const categories = Object.keys(amountsObj);

            const datesObj = Object.fromEntries(
              Object.entries(amountsObj).map(([key, value]) => [
                key,
                value.dates,
              ])
            );

            const dates = Object.values(datesObj).flat();

            const totalSpent = Object.values(amountsObj).reduce(
              (acc, item) => acc + item.amount,
              0
            );
            const dateObjects = dates.map((dateString) => new Date(dateString));

            dateObjects.sort((a, b) => a - b);

            const sortedDates = dateObjects.map((date) => {
              const month = date.toLocaleString("default", {
                month: "2-digit",
              });
              const day = date.getDate();
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            });
            const totalSpentMessage = `${t(
              "totalSpentInMonth"
            )} ${new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
            }).format(totalSpent)} ${t("currency.SAR")}`;
            setMessages((messages) => [
              ...messages,
              {
                text: totalSpentMessage,
                sender: "bot",
                monthAmounts: amounts,
                monthDates: sortedDates,
              },
              {
                text: `${t("api-answers.categoriesSummary")}`,
                sender: "bot",
                monthCategories: categories,
                monthAmounts: amounts,
                time: new Date().toLocaleString([], {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          } else {
            console.log("No spendings found for selected month.");
          }
        } else {
          console.log("No spendings found.");
        }
      } else {
        throw new Error(data.error || "Failed to fetch user spendings");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setIsLoading(false);
  };

  const handleChoiceClick = (choice) => {
    setMessages([
      ...messages,
      {
        text: choice.text,
        sender: "user",
        time: new Date().toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    switch (choice.value) {
      case "current_balance":
        fetchUserBalance(t, setMessages, setIsLoading);
        break;

      case "recent_transactions":
        fetch_recent_transactions(setMessages, setIsLoading);
        break;
      case "book_appointment":
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

        break;
      case "spent_with_account":
        fetch_Spendings(
          t,
          setMessages,
          setAmounts,
          setCategories,
          setIsLoading
        );
        break;
      case "January":
        fetch_Month_Spendings(choice.value);
        break;
      case "February":
        fetch_Month_Spendings(choice.value);
        break;
      case "March":
        fetch_Month_Spendings(choice.value);
        break;
      case "April":
        fetch_Month_Spendings(choice.value);
        break;
      case "May":
        fetch_Month_Spendings(choice.value);
        break;
      case "June":
        fetch_Month_Spendings(choice.value);
        break;
      case "July":
        fetch_Month_Spendings(choice.value);
        break;
      case "August":
        fetch_Month_Spendings(choice.value);
        break;
      case "September":
        fetch_Month_Spendings(choice.value);
        break;
      case "October":
        fetch_Month_Spendings(choice.value);
        break;
      case "November":
        fetch_Month_Spendings(choice.value);
        break;
      case "December":
        fetch_Month_Spendings(choice.value);
        break;
      case "api-question":
        callAiApi(choice.text, messages, setMessages, setIsLoading);
        break;
      case "customer_service":
        callCustomerService(choice.text, messages, setMessages, t);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          choices: [
            {
              text: t("basicQuestions.q1"),
              value: "current_balance",
            },
            {
              text: t("basicQuestions.q2"),
              value: "spent_with_account",
            },
            {
              text: t("basicQuestions.q3"),
              value: "book_appointment",
            },
            {
              text: t("basicQuestions.q4"),
              value: "recent_transactions",
            },
            {
              text: t("basicQuestions.q5"),
              value: "customer_service",
            },
          ],
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [t, messages.length]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="w-[75%] p-4 m-auto h-[90%]">
      <div className="h-[90%] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-6 mr-4">
            <div
              className={`flex gap-4 ${
                message.sender === "user" && isRTL
                  ? "justify-start"
                  : message.sender === "user" && !isRTL
                  ? "justify-end"
                  : message.sender === "bot" && isRTL
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender === "user" ? (
                <UserMessages isRTL={isRTL} message={message} />
              ) : (
                <BotMessages
                  isRTL={isRTL}
                  message={message}
                  handleChoiceClick={handleChoiceClick}
                  amounts={amounts}
                  categories={categories}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef}></div>
      </div>
      <SubmitForm
        setMessages={setMessages}
        messages={messages}
        setAmounts={setAmounts}
        setCategories={setCategories}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default ChatBox;