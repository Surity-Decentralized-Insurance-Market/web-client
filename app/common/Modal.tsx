import useModal from "../hooks/useModal";
import { twMerge } from "tailwind-merge";

export default function Modal() {
  const modal = useModal();

  return (
    <article
      className={twMerge(
        "fixed left-0 top-0 z-[1001] flex h-full w-full items-center justify-center bg-black bg-opacity-80 duration-300",
        modal.element ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className={twMerge("duration-inherit ease-out")}>
        {modal.element}
      </div>
    </article>
  );
}
