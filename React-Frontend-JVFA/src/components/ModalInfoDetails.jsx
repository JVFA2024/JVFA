import { useTranslation } from "react-i18next";
import { Modal, Button, Divider } from "rsuite";

const ModalInfoDetails = ({ open, handleClose }) => {
  const { t, i18n } = useTranslation();
  const data = [
    {
      q: t("modelQuestions.q1"),
      a: t("modelQuestions.a1"),
    },
    {
      q: t("modelQuestions.q2"),
      a: t("modelQuestions.a2"),
    },
    {
      q: t("modelQuestions.q3"),
      a: t("modelQuestions.a3"),
    },
    {
      q: t("modelQuestions.q4"),
      a: t("modelQuestions.a4"),
    },
    {
      q: t("modelQuestions.q5"),
      a: t("modelQuestions.a5"),
    },
    {
      q: t("modelQuestions.q6"),
      a: t("modelQuestions.a6"),
    },
  ];
  return (
    <Modal open={open} onClose={handleClose} dir={i18n.dir()}>
      <Modal.Body className="text-center text-xl flex justify-around">
        <div className="text-[#649da3]">
          <p>{t("modelQuestions.title")}</p>
          <p>{t("modelQuestions.subtitle")}</p>
        </div>
      </Modal.Body>

      <Modal.Body>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col mb-4">
            <p className="m-0 font-bold mb-2 text-[#649da3]">{item.q}</p>
            <p className="m-0 text-[#485677]">{item.a}</p>
            <Divider style={{ height: "3px" }} />
          </div>
        ))}
      </Modal.Body>

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

export default ModalInfoDetails;