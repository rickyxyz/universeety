import { University } from "../App";

interface CardParam {
  university: University;
  className: string;
}

export function Card({ university, className }: CardParam) {
  const { name } = university;
  return (
    <div className={className}>
      <div>
        <a href="/">{name}</a>
      </div>
    </div>
  );
}
