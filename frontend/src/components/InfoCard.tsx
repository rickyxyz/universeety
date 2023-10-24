import { UniversityType } from "../Types";
import { addHttpsToURL } from "../utils";
import "./InfoCard.css";

interface InfoCardPropType {
  university: UniversityType;
  className?: string;
}

export function InfoCard({ university, className }: InfoCardPropType) {
  return (
    <div className={className}>
      <table className="infocard_table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{university.name}</td>
          </tr>
          <tr>
            <th>Abbreviation</th>
            <td>{university.abbreviation || "-"}</td>
          </tr>
          <tr>
            <th>Accreditation</th>
            <td>{university.accreditation || "-"}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${university.place_id}`}
                target="_new"
              >
                {university.address || "-"}
              </a>
            </td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>{university.phone || "-"}</td>
          </tr>
          <tr>
            <th>Website</th>
            <td>
              {(university.website && (
                <a href={addHttpsToURL(university.website)} target="_blank">
                  {university.website}
                </a>
              )) ||
                "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
