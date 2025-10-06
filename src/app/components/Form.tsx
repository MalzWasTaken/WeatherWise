import { useState, ChangeEvent, FormEvent } from "react";
import validator from "validator";
import { toast } from "react-toastify";

const Form = () => {
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstMessage, setFirstMessage] = useState<string>("");
  const [lastMessage, setLastMessage] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | "">("");

  const changeFirstname = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);

    if (value.length > 0) {
      setFirstMessage(`You have typed ${value.length} characters`);
    } else {
      setFirstMessage("");
    }
  };

  const changeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);

    if (value.length > 0) {
      setLastMessage(`You have typed ${value.length} characters`);
    } else {
      setLastMessage("");
    }
  };

  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value.length > 0) {
      if (validator.isEmail(value)) {
        setEmailMessage("Valid Email");
        setIsEmailValid(true);
      } else {
        setEmailMessage("Invalid Email");
        setIsEmailValid(false);
      }
    } else {
      setEmailMessage("");
      setIsEmailValid("");
    }
  };

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setFirstMessage("");
    setLastMessage("");
    setEmailMessage("");
    setIsEmailValid("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const entries = Object.fromEntries(data.entries());
    console.log(entries);
    resetFields();
    toast.success("Form has been submitted sucessfully!");
  };

  return (
    <div className="form-box">
      <h3 className="form-title">Subscribe to Our Newsletter</h3>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          {firstMessage && <span className="first-message"> ({firstMessage})</span>}
          <input type="text" name="firstname" value={firstname} onChange={changeFirstname} />
        </label>

        <label>
          Surname:
          {lastMessage && <span className="last-message"> ({lastMessage})</span>}
          <input type="text" name="lastname" value={lastname} onChange={changeLastName} />
        </label>

        <label>
          Email:
          {emailMessage && (
            <span className={`email-message ${isEmailValid ? "valid" : "invalid"}`}>
              ({emailMessage})
            </span>
          )}
          <input type="text" name="email" value={email} onChange={changeEmail} />
        </label>

        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default Form;