import Form from "./sections/Form";
import { UserCreated } from "./resources/types";
import { useState } from "react";
import Dashboard from "./sections/Dashboard";

function App() {
  const [userId, setUserId] = useState<number | null>(
    Number(sessionStorage.getItem("userID"))
  );
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState<UserCreated | null>(null);

  const handleAuth = ({ userCreated }: { userCreated: UserCreated }) => {
    setUserData(userCreated);
    sessionStorage.setItem("userID", userCreated.id.toString());
    setUserId(Number(sessionStorage.getItem("userID")));
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("userID");
    setUserId(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <main
      className={`min-h-screen w-full flex flex-col items-center bg-gradient-to-br text-[#e0d8f7] from-[#070416] to-[#18162b] pb-6`}
    >
      {error && (
        <div
          className={`${
            error ? "fixed flex" : "hidden"
          } left-4 bottom-4 w-fit p-4 bg-[#e0d8f7] text-[#070416] rounded`}
        >
          {error}
        </div>
      )}
      {userId ? (
        <Dashboard
          handleError={handleError}
          handleSignOut={handleSignOut}
          userId={userId}
          userData={userData}
        />
      ) : (
        <Form handleAuth={handleAuth} handleError={handleError} />
      )}
    </main>
  );
}

export default App;
