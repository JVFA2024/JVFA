import { http } from "../http";

// Function to fetch User Balance
export const fetchUserBalance = async (t, setMessages, setIsLoading) => {
  setIsLoading(true);
  try {
    // Send a GET request to retrieve the user's balance
    const res = await http.get("/userbalance");
    const data = res.data;

     // Check if the response status was successful
    if (res.status === 200) {

      // If successful, Format the balance
      const formattedBalance = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      }).format(data.accountBalance);

      // Update messages with the formatted balance
      setMessages((messages) => [
        ...messages,
        {
          text: `${t("api-answers.balance")}${formattedBalance} ${t(
            "currency.SAR"
          )} `,
          sender: "bot",
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
      // If the response status is not successful, throw an error
      throw new Error(data.error || "Failed to fetch balance");
    }
  } catch (error) {
    // Handle errors and update messages with the error message
    console.error("Fetch error:", error);
    setMessages((messages) => [
      ...messages,
      {
        text: error.message,
        sender: "bot",
        time: new Date().toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }
  setIsLoading(false);
};

// Function to fetch recent transactions
export const fetch_recent_transactions = async (setMessages, setIsLoading) => {
  setIsLoading(true);
  try {
    // Send a GET request to retrieve recent transactions
    const res = await http.get("/recent_transactions");
    const data = res.data;

    // Check if the response status was successful
    if (res.status === 200) {

      // If successful, Check if transactions are found
      if (data.transactions && data.transactions.length > 0) {

        // Group transactions by date
        const grouped = data.transactions.reduce((acc, transaction) => {
          const date = new Date(transaction.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(transaction);
          return acc;
        }, {});

        // Create an array of transactions sorted by date
        const transactionArray = Object.entries(grouped)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .flatMap(([date, transactions]) =>
            transactions.map((tr) => ({
              tr,
              amountFormatted: new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(tr.amount),
              date,
            }))
          );

        // Update messages with the formatted transactions
        setMessages((messages) => [
          ...messages,
          {
            transactions: transactionArray,
            sender: "bot",
            time: new Date().toLocaleString([], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {

        // Update messages if no transactions are found
        setMessages((messages) => [
          ...messages,
          {
            text: "No recent transactions found.",
            sender: "bot",
            time: new Date().toLocaleString([], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } else {
      // If the response status is not successful, throw an error
      throw new Error(data.error || "Failed to fetch recent transactions");
    }
  } catch (error) {
    // Handle errors and update messages with the error message
    console.error("Fetch error:", error);
    setMessages((messages) => [
      ...messages,
      {
        text: error.message,
        sender: "bot",
        time: new Date().toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }
  setIsLoading(false);
};

// Function to fetch Spendings
export const fetch_Spendings = async (
  t,
  setMessages,
  setAmounts,
  setCategories,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    // Send a GET request to retrieve user spendings
    const response = await http.get("/user_spendings");
    const data = await response.data;

    // Check if the response status was successful
    if (response.status === 200) {
      // If successful, Check if the spendings are found 
      if (data.spendings && data.spendings.length > 0) {

        // Reduce spendings to get amounts grouped by month
        const amountsObj = data.spendings.reduce((acc, spending) => {

          // Format the spending date to get the month name
          const date = new Date(spending.date).toLocaleDateString("en-US", {
            month: "long",
          });
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += spending.amount;
          return acc;
        }, {});

        // Get the total amounts spent each month 
        const amounts = Object.values(amountsObj);

        // Get months from the spendings 
        const categoriesSet = new Set(
          data.spendings.map((spending) =>
            new Date(spending.date).toLocaleDateString("en-US", {
              month: "long",
            })
          )
        );
        const categories = Array.from(categoriesSet);

        // Update state with the amounts and categories
        setAmounts(amounts);
        setCategories(categories.reverse());

        // Store amounts and categories in local storage
        localStorage.setItem("amounts", JSON.stringify(amounts));
        localStorage.setItem("categories", JSON.stringify(categories));

        // Calculate the total amount spent
        const totalSpent = Object.values(amountsObj).reduce(
          (acc, amount) => acc + amount,
          0
        );

        // Format the total spent message
        const totalSpentMessage = `${t("totalSpent")} ${new Intl.NumberFormat(
          "en-US",
          { minimumFractionDigits: 2 }
        ).format(totalSpent)} ${t("currency.SAR")}`;

        // Update messages with the total spent and choices of months
        setMessages((messages) => [
          ...messages,
          {
            text: totalSpentMessage,
            sender: "bot",
          },
          {
            text: `${t("api-answers.chooseMonth")}`,
            sender: "bot",
            choices: categories.map((category) => ({
              text: category,
              value: category,
            })),
            time: new Date().toLocaleString([], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        // Update messages if no spendings are found
        setMessages((messages) => [
          ...messages,
          {
            text: "No spendings found.",
            sender: "bot",
            time: new Date().toLocaleString([], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } else {
      // If the response status is not successful, throw an error
      throw new Error(data.error || "Failed to fetch user spendings");
    }
  } catch (error) {
    // Handle errors and update messages with the error message
    console.error("Fetch error:", error);
    setMessages((messages) => [
      ...messages,
      {
        text: error.message,
        sender: "bot",
        time: new Date().toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }
  setIsLoading(false);
};
// Function to fetch api
export const callAiApi = async (
  prompt,
  messages,
  setMessages,
  setIsLoading
) => {
  setIsLoading(true);
  try {
     // Send a POST request to "/api/general_query" endpoint with the provided prompt
    const res = await http.post("/api/general_query", { prompt });
    const data = res.data.data.result;

    // Check if the result includes alternative questions
    if (data.includes("Alternative questions:")) {
      const resultParts = data.split("\n");

      // Filter and format alternative questions
      const alternativeQuestions = resultParts
        .filter((part) => /^\d+\./.test(part))
        .map((question) => question.split(".").slice(1).join(".").trim());

        // Extract the main response text (without alternative questions)
      const rest = data
        .split("\n")
        .filter((line) => !/^\d+\./.test(line.trim()))
        .join("\n");

        // Update messages with the user prompt and AI response including choices
      setMessages([
        ...messages,
        {
          sender: "user",
          text: prompt,
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          sender: "bot",
          text: rest,
          choices: alternativeQuestions.map((question) => ({
            text: question,
            value: "api-question",
          })),
          aiApiCall: true,
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
       // Update messages with the AI response if there are no alternative questions
      setMessages((messages) => [
        ...messages,
        {
          text: data,
          sender: "bot",
          time: new Date().toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  } catch (error) {
    // Handle errors and update messages with the error message
    console.error("Fetch error:", error);
    setMessages((messages) => [
      ...messages,
      {
        text: error.message,
        sender: "bot",
        time: new Date().toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }
  setIsLoading(false);
};

export const callCustomerService = (text, messages, setMessages, t) => {
  setMessages([
    ...messages,
    {
      text,
      sender: "user",
      time: new Date().toLocaleString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      text: t("customerService.title"),
      aiApiCall: true,
      sender: "bot",
      time: new Date().toLocaleString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
};