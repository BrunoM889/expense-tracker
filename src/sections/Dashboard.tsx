import { useState, useEffect } from "react";
import { CreatedIncomeExpense, UserCreated } from "../resources/types";
import { apiUrl } from "../resources/variables";
import { PlusIcon } from "../components/Icons";

import {
  Movement,
  ChangeSectionButton,
  CreateModal,
  Header,
} from "../components/dashboard-components/index";

interface Props {
  handleSignOut: () => void;
  userId: number;
  handleError: (message: string) => void;
  userData: UserCreated | null;
}

function Dashboard({ handleSignOut, userId, handleError, userData }: Props) {
  const [user, setUser] = useState<UserCreated | null>(userData);
  const [incomes, setIncomes] = useState<CreatedIncomeExpense[]>([]);
  const [expenses, setExpenses] = useState<CreatedIncomeExpense[]>([]);
  const [balance, setBalance] = useState<number | undefined>(userData?.balance);

  const [typeOfMovements, setTypeOfMovements] = useState<
    "expenses" | "incomes"
  >("incomes");
  const [modalState, setModalState] = useState(false);

  const appendMovement = (
    type: "expenses" | "incomes",
    mov: CreatedIncomeExpense
  ) => {
    if (balance === undefined) return;
    if (type === "incomes") {
      let aux = [...incomes];
      aux.push(mov);
      setIncomes(aux);
    } else {
      let aux = [...expenses];
      aux.push(mov);
      setExpenses(aux);
    }
    if (balance === undefined) return;
    setBalance(type === "incomes" ? balance + mov.total : balance - mov.total);
  };

  const getMovements = async (type: "expenses" | "incomes") => {
    try {
      const res = await fetch(`${apiUrl}/${userId}/${type}`);
      const data: CreatedIncomeExpense[] = await res.json();
      type === "incomes" ? setIncomes(data) : setExpenses(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      handleError("ERROR: Couldn't load data");
    }
  };

  const handleDelete = async (id: number, total: number) => {
    if (balance === undefined) return;

    try {
      await fetch(`${apiUrl}/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          id: id,
          balance:
            typeOfMovements === "incomes" ? balance - total : balance + total,
          userId: userId,
          type: typeOfMovements,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (typeOfMovements === "incomes") {
        const aux = [...incomes];
        setIncomes(aux.filter((i) => i.id !== id));
        setBalance(balance - total);
      } else {
        const aux = [...expenses];
        setExpenses(aux.filter((i) => i.id !== id));
        setBalance(balance + total);
      }
    } catch (error) {
      console.log(error);
      handleError("ERROR: Couldn't delete data");
    }
  };

  const getUserData = async () => {
    if (!user) {
      const res = await fetch(`${apiUrl}/${userId}`);
      const data = await res.json();
      setUser(data);
      setBalance(data.balance);
    }
    getMovements("expenses");
    getMovements("incomes");
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="w-full flex justify-center">
      {balance !== undefined && user && (
        <div className="w-full flex flex-col items-center h-full">
          {/*-->HEADER SECTION<--*/}
          <Header userName={user.name} handleSignOut={handleSignOut} />
          {/*-->MAIN SECTION<--*/}
          <div className="px-[3vw] w-full flex flex-col mt-24">
            <CreateModal
              balance={balance}
              setModalState={setModalState}
              handleError={handleError}
              modalState={modalState}
              appendMovement={appendMovement}
              type={typeOfMovements}
              userId={userId}
            />
            <h2 className="font-light text-xl mb-6">
              Balance: ${new Intl.NumberFormat("en-IN").format(balance)}
            </h2>
            <div className="flex gap-4 mb-6">
              <ChangeSectionButton
                typeOfMovements={typeOfMovements}
                setTypeOfMovements={setTypeOfMovements}
                type="Incomes"
              />
              <ChangeSectionButton
                typeOfMovements={typeOfMovements}
                setTypeOfMovements={setTypeOfMovements}
                type="Expenses"
              />
            </div>
            <div className="w-full flex flex-wrap max-[650px]:flex-col mt-6">
              {/*-->CHARTS SECTION<--*/}

              {/*-->MOVEMENTS SECTION<--*/}
              <div className="w-1/2 max-[650px]:w-full flex flex-col items-center">
                <button
                  className="h-11 px-6 pl-7 rounded text-[#e0d8f7] bg-[#ffffff1e] font-normal transition-all flex items-center gap-2 hover:bg-[#ffffff31] active:scale-95 outline-none"
                  onClick={() => {
                    document.body.style.overflow = "hidden";
                    setModalState(true);
                  }}
                >
                  New {typeOfMovements === "incomes" ? "Income" : "Expense"}
                  <PlusIcon />
                </button>
                <div className="flex flex-wrap gap-4 mt-6">
                  {typeOfMovements === "incomes"
                    ? incomes.map((income, i) => {
                        return (
                          <Movement
                            key={i}
                            movement={income}
                            handleDelete={handleDelete}
                          />
                        );
                      })
                    : expenses.map((expense, i) => {
                        return (
                          <Movement
                            key={i}
                            movement={expense}
                            handleDelete={handleDelete}
                          />
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
