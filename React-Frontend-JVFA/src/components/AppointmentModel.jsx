import { Modal, SelectPicker } from "rsuite";
import bgImg from "../assets/bg.jpg";
import { Form, DatePicker, toaster, Notification } from "rsuite";
import TextField from "../components/TextField";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { http } from "../http";
export const AppointmentModel = ({ open, setOpen }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const [isOthers, setIsOthers] = useState(false);
  const [formValue, setFormValue] = useState({
    fullname: "",
    nationalID: "",
    appointmentDate: "",
    serviceType: "",
  });
  const selectData = [
    t("appointment.service.account"),
    t("appointment.service.loan"),
    t("appointment.service.investments"),
    t("appointment.service.others"),
  ].map((item) => ({ label: item, value: item }));

  const handleDateChange = (appointmentDate) => {
    setFormValue((prev) => ({ ...prev, appointmentDate }));
  };

  const message = (
    <Notification
      type={"error"}
      header={`${t("appointment.error")}!`}
      closable
      dir={i18n.dir()}
    >
      <p>{t("appointment.errorFill")}</p>
    </Notification>
  );
  const checkOthers = (value) => {
    if (value === t("appointment.service.others")) setIsOthers(true);
    else setIsOthers(false);
  };
  const handleSubmit = async () => {
    const placement = "topCenter";
    if (
      !formValue.fullname ||
      !formValue.nationalID ||
      !formValue.appointmentDate ||
      !formValue.serviceType
    ) {
      toaster.push(message, { placement });
      return;
    }
    console.log("Submitted");

    formValue.accountNumber = JSON.parse(
      localStorage.getItem("user")
    ).accountNumber;

    console.log(formValue, "Form Value");

    // send a POST request to the "/appointments" endpoint with formValue
    const res = await http.post("/appointments", formValue);

    // Check if the response status was successful
    if (res.status == 201) {

       // If successful, display a success notification 
      toaster.push(
        <Notification type={"success"} closable dir={i18n.dir()}>
          <p>{t("appointment.success")}</p>
        </Notification>,
        { placement }
      );
      setOpen(false);
    } else {

      // If not successful, display an error notification
      toaster.push(
        <Notification type={"error"} closable dir={i18n.dir()}>
          <p>{t("appointment.error")}</p>
        </Notification>,
        { placement }
      );
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      size={"lg"}
      backdrop={"static"}
      keyboard={false}
      open={open}
      onClose={handleClose}
    >
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "inherit",
        }}
      >
        <Modal.Header>
          <Modal.Title>
            <div>
              <h1
                className={`text-2xl lg:text-4xl p-4 pb-6 ${
                  isRtl ? "text-center pr-[150px]" : ""
                } `}
              >
                {t("appointment.title")}
              </h1>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mt-2">
            <Form
              formValue={formValue}
              onChange={setFormValue}
              dir={i18n.dir()}
              className={`flex flex-col items-start justify-around gap-4 w-full md:w-[70%] lg:w-[50%] mt-10`}
            >
              <div>
                <TextField name="fullname" label={t("appointment.name")} />
                <TextField name="nationalID" label={t("appointment.id")} />
                <Form.ControlLabel className="text-2xl text-black">
                  {t("appointment.date")}
                </Form.ControlLabel>
                <DatePicker
                  className="w-full mt-2 mb-6 "
                  onChange={handleDateChange}
                  value={formValue.appointmentDate}
                />
                <div className="flex flex-col">
                  <Form.Group controlId="selectPicker">
                    <Form.ControlLabel>
                      {t("appointment.service.title")}
                    </Form.ControlLabel>
                    <Form.Control
                      placeholder={t("appointment.service.title")}
                      name="serviceType"
                      searchable={false}
                      onChange={checkOthers}
                      value={formValue.serviceType}
                      accepter={SelectPicker}
                      data={selectData}
                      style={{ width: "100%" }}
                    />
                  </Form.Group>
                  {isOthers && (
                    <TextField
                      name="serviceType"
                      label={t("appointment.service.others")}
                    />
                  )}
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-[#024A52] rounded-full text-white px-16 py-2 w-full hover:bg-[#32686e] "
              >
                {t("appointment.submit")}
              </button>
            </Form>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};
