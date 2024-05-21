import { FormEvent, useState } from "react";
import { UserCreated, ApiResponse } from "../resources/types";

interface Props {
  handleAuth: ({ userCreated }: { userCreated: UserCreated }) => void;
  handleError: (message: string) => void;
}

function Form({ handleAuth, handleError }: Props) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<null | string>(null);

  const [formType, setFormType] = useState(true);

  const handleFormError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (formType) {
        if (email == "" || pass == "" || email == " " || pass == " ") {
          handleFormError("All the fields are required");
        } else {
          const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: pass,
            }),
            headers: {
              "Content-type": "application/json",
            },
          });
          const data: ApiResponse = await res.json();
          if (!data.ok && data.error) {
            console.log(data);
            handleFormError(data.error);
          } else {
            if (!data.data) return;
            handleAuth({ userCreated: data.data });
          }
        }
      } else {
        if (email === "" || name === "" || pass === "" || confirmPass === "") {
          handleFormError("All the fields are required");
        } else if (pass !== confirmPass) {
          handleFormError("Passwords do not match");
        } else {
          const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              name: name,
              password: pass,
            }),
            headers: {
              "Content-type": "application/json",
            },
          });
          const data: ApiResponse = await res.json();
          if (!data.ok && data.error && data.data) {
            handleFormError(data.error);
          } else {
            if (!data.data) return;
            handleAuth({ userCreated: data.data });
          }
        }
      }
    } catch (e) {
      console.log(e);
      handleError("ERROR: Couldn't connect to server");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[90%] mt-20 max-w-[400px] flex flex-col items-center gap-6"
    >
      <h1 className="text-3xl font-thin mb-2">
        {!formType ? "Register" : "Login"}
      </h1>
      {!formType && (
        <input
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Username"
        />
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <input
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        type="password"
        maxLength={20}
        placeholder="Password"
      />
      {!formType && (
        <input
          maxLength={20}
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          type="password"
          placeholder="Confirm password"
        />
      )}

      <div className="flex w-full">
        <div className="grow">
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
        <button className="w-24 h-10 bg-gradient-to-tl from-[#4a52c7] to-[#af94e0] rounded text-[#e0d8f7] font-normal active:scale-95 transition-all pb-[2px]">
          {!formType ? "Sign up" : "Login"}
        </button>
      </div>
      <span className="text-center">
        {!formType ? "Already " : "Don't "}have an account?{" "}
        <strong
          className="font-normal text-[#9986DA] border-b border-transparent hover:border-[#9986DA] cursor-pointer transition-all"
          onClick={() => setFormType(!formType)}
        >
          {!formType ? "Login" : "Register"}
        </strong>
      </span>
    </form>
  );
}

export default Form;
