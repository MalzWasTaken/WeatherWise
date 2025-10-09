import { useState, ChangeEvent, FormEvent } from "react";
import validator from "validator";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | "">("");

  const changeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameMessage(value ? `You have typed ${value.length} characters` : "");
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

  const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMessage(value ? `Password length: ${value.length}` : "");
  };

  const resetFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setUsernameMessage("");
    setEmailMessage("");
    setPasswordMessage("");
    setIsEmailValid("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const entries = Object.fromEntries(data.entries());
    console.log(entries);
    resetFields();
    toast.success("Form has been submitted successfully!");
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-center mb-6 text-black">Register</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {}
        <label className="block">
          <span className="text-gray-700">Username:</span>
          {usernameMessage && (
            <span className="text-green-700 ml-2 text-sm">({usernameMessage})</span>
          )}
          <input
            type="text"
            name="username"
            value={username}
            onChange={changeUsername}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </label>

        {}
        <label className="block">
          <span className="text-gray-700">Email:</span>
          {emailMessage && (
            <span
              className={`ml-2 text-sm ${isEmailValid ? "text-green-700" : "text-red-600"}`}
            >
              ({emailMessage})
            </span>
          )}
          <input
            type="text"
            name="email"
            value={email}
            onChange={changeEmail}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </label>

        {}
        <label className="block">
          <span className="text-gray-700">Password:</span>
          {passwordMessage && (
            <span className="text-green-700 ml-2 text-sm">({passwordMessage})</span>
          )}
          <input
            type="password"
            name="password"
            value={password}
            onChange={changePassword}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-gray-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;