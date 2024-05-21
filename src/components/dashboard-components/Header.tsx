import { LogOutIcon } from "../Icons";

interface Props {
  handleSignOut: () => void;
  userName: string;
}

function Header({ handleSignOut, userName }: Props) {
  return (
    <header className="w-full px-[3vw] flex h-16 gap-3 items-center fixed">
      <h1 className="grow text-xl font-bold">{userName}</h1>

      <button
        className="rounded p-2 px-3 text-[#e0d8f7] font-medium flex items-center gap-2 active:scale-95 transition-all hover:bg-[#e0d8f742]"
        onClick={handleSignOut}
      >
        Logout
        <LogOutIcon />
      </button>
    </header>
  );
}

export default Header;
