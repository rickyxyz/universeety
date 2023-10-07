import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { UniversityType } from "../Types";

export function University() {
  const { code } = useParams();
  const [university, setUniversity] = useState<UniversityType>();

  useEffect(() => {
    axios.get(`/api/university/${code}`).then(async (res) => {
      setUniversity(res.data);
    });
  }, [code]);

  const renderUniversity = useMemo(() => {
    if (university) {
      return (
        <div>
          <h2>
            {university.name} ({university.abbreviation})
          </h2>
          {university.accreditation}
          {university.address1}
          {university.address2}
          {university.website}
          {university.phone}
        </div>
      );
    }
    return <div>Loading</div>;
  }, [university]);

  return <>{renderUniversity}</>;
}
