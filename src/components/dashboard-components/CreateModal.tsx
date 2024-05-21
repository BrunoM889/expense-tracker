import { useState, FormEvent } from "react";
import { apiUrl, categories } from "../../resources/variables";
import { CreatedIncomeExpense } from "../../resources/types";
import CategoriesIcons from "./CategoriesIcons";
import { CrossIcon } from "../Icons";

interface Props {
  handleError: (message: string) => void;
  modalState: boolean;
  type: "expenses" | "incomes";
  userId: number;
  appendMovement: (
    type: "expenses" | "incomes",
    movement: CreatedIncomeExpense
  ) => void;
  setModalState: (state: boolean) => void;
  balance: number;
}

function CreateModal({
  handleError,
  modalState,
  type,
  userId,
  appendMovement,
  setModalState,
  balance,
}: Props) {
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [category, setCategory] = useState<number>(0);
  const [closing, setClosing] = useState(false);

  const createMovement = async () => {
    if (total == "") return;

    try {
      const newMovement = {
        userId: userId,
        title: title,
        total: Number(total),
        type: category,
      };

      console.log(newMovement);

      const res = await fetch(`${apiUrl}/create`, {
        method: "POST",
        body: JSON.stringify({
          mov: newMovement,
          type: type,
          balance:
            type === "incomes"
              ? balance + newMovement.total
              : balance - newMovement.total,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: CreatedIncomeExpense = await res.json();
      appendMovement(type, {
        ...newMovement,
        id: data.id,
        createdAt: new Date().toISOString(),
      });
      setModalState(false);
      setTitle("");
      setTotal("");
      setCategory(0);
    } catch (error) {
      console.log(error);
      handleError("ERROR: Couldn't create data");
    }
  };

  const isNumber = (value: string) => {
    return !isNaN(Number(value)) && value !== " ";
  };

  return (
    <form
      className={`${modalState ? "flex" : "hidden"} ${
        closing && "fadeOut"
      } px-6 py-10 flex flex-col gap-4 absolute pt-[5vh] top-0 bottom-0 left-0 right-0 m-auto w-[95%] max-w-[700px] bg-gradient-to-tl from-[#ffffff0c] to-[#ffffff02] charge backdrop-blur-xl rounded h-[90vh] max-h-[650px] overflow-auto max-[460px]:pb-6 overflow-x-hidden z-20 charge`}
    >
      <div className="flex mb-2">
        <h2 className="ml-1 text-2xl font-medium grow">New {type}</h2>

        <button
          className="self-end"
          onClick={() => {
            setClosing(true);
            setTimeout(() => {
              setModalState(false);
              setClosing(false);
              document.body.style.overflow = "auto";
            }, 470);
          }}
          type="button"
        >
          <CrossIcon />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap mb-4 justify-center">
        <input
          value={title}
          type="text"
          maxLength={20}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-[49%] min-w-[150px] max-[470px]:w-full"
        />
        <input
          value={total}
          type="text"
          maxLength={15}
          placeholder="Total"
          className="w-[49%] min-w-[150px] max-[470px]:w-full"
          onChange={(e) => isNumber(e.target.value) && setTotal(e.target.value)}
        />
      </div>
      <div className="w-[400px] min-h-[150px] mx-auto flex flex-wrap gap-2 px-5 overflow-auto mb-4 max-[460px]:w-[260px] max-[310px]:justify-center max-[310px]:px-0 max-[310px]:w-full">
        {categories.map((c) => (
          <button
            onClick={() => setCategory(c.id)}
            key={c.id}
            type="button"
            className={`w-16 h-16 text-sm flex flex-col items-center justify-center font-semibold gap-2  rounded bg-gradient-to-tl transition-all ${
              category === c.id
                ? "from-[#ffffff0c] to-[#ffffff1e]"
                : "from-[#ffffff0c] to-[#ffffff02]"
            }`}
          >
            <CategoriesIcons id={c.id} w={"25px"} h={"25px"} />
          </button>
        ))}
      </div>
      <button
        className="w-24 min-h-10 bg-gradient-to-tl from-[#4a52c7] to-[#af94e0] rounded text-[#e0d8f7] font-normal self-center active:scale-95 transition-all pb-[2px]"
        onClick={(e: FormEvent) => {
          e.preventDefault();
          createMovement();
        }}
      >
        Create
      </button>
    </form>
  );
}

export default CreateModal;
