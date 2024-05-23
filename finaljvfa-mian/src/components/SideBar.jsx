import { BookOpenText, Globe, Info, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, ButtonToolbar, Notification, useToaster } from "rsuite";
import { Dropdown, Avatar } from "rsuite";
import ModalInfoDetails from "./ModalInfoDetails";
import { useState } from "react";
const SideBar = ({ handleOpen, setMessages }) => {
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);
  const handleOpenModel = () => {
    setOpenModel(true);
  };
  const handleCloseModel = () => setOpenModel(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const currentLang = localStorage.getItem("i18nextLng");
  const toaster = useToaster();
  const message = (
    <Notification type="info">
      <p>{t("changeLangWarning.message")}</p>
      <hr />
      <ButtonToolbar>
        <Button
          style={{ backgroundColor: "#024A52", color: "#fff" }}
          onClick={() => {
            handleChange();
            toaster.clear();
          }}
        >
          {t("changeLangWarning.yes")}
        </Button>
        <Button appearance="default" onClick={() => toaster.clear()}>
          {t("changeLangWarning.no")}
        </Button>
      </ButtonToolbar>
    </Notification>
  );
  const handleChange = () => {
    if (currentLang === "ar") {
      i18n.changeLanguage("en");
      localStorage.setItem("i18nextLng", "en");
    } else {
      i18n.changeLanguage("ar");
      localStorage.setItem("i18nextLng", "ar");
    }
    localStorage.removeItem("chatMessages");
    setMessages([]);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("rcb-history");
    localStorage.removeItem("categories");
    localStorage.removeItem("amounts");
    navigate("/login");
  };
  const renderToggle = (props) => (
    <p
      className="bg-[#D3F4F1] text-[#024A52] rounded-full px-2.5 pb-1"
      {...props}
    >
      {JSON.parse(localStorage.getItem("user")).username.charAt(0)}
    </p>
  );
  return (
    <div className="w-[4%] bg-[#024A52] p-2">
      <div className="text-xl h-full font-bold flex flex-col justify-between items-center">
        <div className="flex flex-col items-center gap-8 mt-5">
          <Dropdown
            renderToggle={renderToggle}
            placement={isRtl ? "leftStart" : "rightStart"}
          >
            <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
              <span>{t("login.loginas")} </span>
              <span>{JSON.parse(localStorage.getItem("user")).username}</span>
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item onClick={handleLogout} className="text-center">
              {t("login.signout")}
            </Dropdown.Item>
          </Dropdown>
          <button onClick={() => handleOpen("xs")}>
            <Info color="#D3F4F1" size={30} />
          </button>
          <button onClick={handleOpenModel}>
            <BookOpenText color="#D3F4F1" size={30} />
          </button>
          <button
            className="flex flex-col items-center justify-center"
            onClick={() => toaster.push(message, "topCenter")}
          >
            <Globe color="#D3F4F1" />
            <p className="text-sm font-light text-[#D3F4F1]">
              {localStorage.getItem("i18nextLng") === "ar"
                ? "English"
                : "العربية"}
            </p>
          </button>
        </div>
      </div>
      <ModalInfoDetails
        open={openModel}
        setOpen={setOpenModel}
        handleClose={handleCloseModel}
      />
    </div>
  );
};

export default SideBar;