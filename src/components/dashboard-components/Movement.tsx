import { CreatedIncomeExpense } from "../../resources/types";
import { TrashIcon } from "../Icons";
import CategoriesIcons from "./CategoriesIcons";
import { useState } from "react";

interface Props {
  movement: CreatedIncomeExpense;
  handleDelete: (id: number, total: number) => void;
}

function Movement({ movement, handleDelete }: Props) {
  const [closing, setClosing] = useState(false);

  return (
    <div
      className={`w-32 p-2 py-4 flex flex-col items-center justify-center gap-2 rounded bg-gradient-to-tl from-[#ffffff0c] to-[#ffffff02] charge ${
        closing && "fadeOut"
      }`}
    >
      <div className="absolute text-[#6c63e64d] z-0">
        <CategoriesIcons id={movement.type} w={"90px"} h={"90px"} />
      </div>
      <h5 className="text-center z-10">{movement.title}</h5>
      <p className="z-10">
        ${new Intl.NumberFormat("en-IN").format(movement.total)}
      </p>
      <p className="z-10">
        {new Date(movement.createdAt).toLocaleDateString("en-IN")}
      </p>
      <button
        className=" z-10 transition-all hover:bg-[#ffffff31] p-2 rounded"
        onClick={() => {
          if (closing) return;
          setClosing(true);
          setTimeout(() => {
            handleDelete(movement.id, movement.total);
            setClosing(false);
          }, 490);
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default Movement;
