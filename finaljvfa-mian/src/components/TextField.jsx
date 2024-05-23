import { Form } from "rsuite";

const TextField = ({ name, label, placeholder, accepter, ...rest }) => (
  <Form.Group controlId={name}>
    <div className="flex flex-col">
      <Form.ControlLabel className="text-2xl text-black ">
        {label}
      </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </div>
  </Form.Group>
);
export default TextField;
