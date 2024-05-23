import { BookOpenText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "rsuite";
import ModalInfoDetails from "./ModalInfoDetails";
const ModalInfo = ({ open, handleClose }) => {
  const { t, i18n } = useTranslation();

  return (
    <Modal open={open} onClose={handleClose} dir={i18n.dir()}>
      <Modal.Body className="text-center text-xl flex justify-around">
        {t("modal.title")}
      </Modal.Body>

      <Modal.Body className="text-center">{t("modal.title2")}</Modal.Body>

      <Modal.Footer className="flex items-center justify-center gap-4">
        <Button
          onClick={handleClose}
          className="hover:bg-[#32686e] hover:text-white"
          style={{ backgroundColor: "#024A52", color: "#fff" }}
        >
          {t("modal.ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalInfo;