import { UniversityType } from "../Types";
import "./InfoCard.css";

interface InfoCardPropType {
  university: UniversityType;
  className?: string;
}

function addHttpsToURL(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.trim();
  }
  return `https://${url.trim()}`;
}

export function InfoCard({ university, className }: InfoCardPropType) {
  return (
    <div className={className}>
      <table>
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
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  university.name
                )}`}
                target="_new"
              >
                {university.address1} {university.address2}
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
              {university.website && (
                <a href={addHttpsToURL(university.website)} target="_blank">
                  {university.website}
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
