import { University } from "../pages/Result";

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
