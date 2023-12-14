"use client";

// component react
import { Menu } from "@headlessui/react";

// css
import "./button-update-movie.module.css";
// ---------------------------------------------

interface MovieUpdateProps {
  movie: object;
  setDataMovie: React.Dispatch<React.SetStateAction<object>>;
  setModalUpdateMovie: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonUpdateMovie({
  movie,
  setDataMovie,
  setModalUpdateMovie,
}: MovieUpdateProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={classNames(
            active
              ? "text-[#D2D2D2] bg-[#0D0D0D] hover:bg-[#212121]"
              : "text-[#D2D2D2]",
            "w-full text-left block px-4 py-2 text-sm"
          )}
          onClick={() => {
            setModalUpdateMovie(true);
            setDataMovie(movie);
          }}
        >
          Update Movie
        </button>
      )}
    </Menu.Item>
  );
}
