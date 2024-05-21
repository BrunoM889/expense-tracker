interface Props {
  typeOfMovements: "incomes" | "expenses";
  setTypeOfMovements: (type: "incomes" | "expenses") => void;
  type: "Incomes" | "Expenses";
}

function ChangeSectionButton({
  typeOfMovements,
  setTypeOfMovements,
  type,
}: Props) {
  return (
    <button
      onClick={() =>
        setTypeOfMovements(
          typeOfMovements === "incomes" ? "expenses" : "incomes"
        )
      }
      className={`w-24 h-10 bg-gradient-to-tl ${
        typeOfMovements === type.toLowerCase()
          ? "from-[#4a52c7] to-[#af94e0]"
          : "from-[#4a52c73a] to-[#af94e034]"
      } rounded text-[#e0d8f7] font-normal transition-all pb-[2px]`}
    >
      {type}
    </button>
  );
}

export default ChangeSectionButton;
