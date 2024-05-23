import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Notification, toaster } from "rsuite";
import { http } from "../http";
const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const placement = "topCenter";
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };
  const successMessage = (
    <Notification
      type={"success"}
      header={`${t("login.success")}!`}
      closable
      dir={i18n.dir()}
    ></Notification>
  );
  const errMessage = (
    <Notification
      type={"error"}
      header={`${t("login.error")}!`}
      closable
      dir={i18n.dir()}
    ></Notification>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to "/login" endpoint with the username and password
      const res = await http.post("/login", { username, password });

      // Stores the user data and token from the response in the local storage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // Display a success message
      toaster.push(successMessage, { placement });

       // Clear state for the username and password
      setUsername("");
      setPassword("");

      // Navigate to the home page
      navigate("/");

      // Reload the page to apply changes after 500ms
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      // If there's an error, Display an error message
      toaster.push(errMessage, { placement });
    }
  };
  return (
    <div className="w-full md:w-[70%] lg:w-[50%] mt-10">
      <form onSubmit={handleSubmit} dir={i18n.dir()}>
        <div className="flex flex-col items-start gap-3">
          <label htmlFor="username" className="text-lg">
            {t("login.username")}
          </label>
          <input
            className="bg-inherit border border-[#024A52] text-gray-900 text-sm rounded-full focus:border-[#024A52] focus:outline-none w-full p-2"
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col items-start gap-3 mt-2">
          <label htmlFor="password" className="text-lg">
            {t("login.password")}
          </label>
          <input
            className="bg-inherit border border-[#024A52] text-gray-900 text-sm rounded-full focus:border-[#024A52] focus:outline-none w-full p-2"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className="flex w-full rounded-full text-center mt-9 items-center justify-center text-white py-1.5 gap-3  bg-[#024A52] hover:bg-[#32686e]"
          type="submit"
        >
          {t("login.submit")}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;