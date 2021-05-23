import axios from "axios";
import React from "react";
import "./styles.css";

const getCurrentDate = () => {
  let todaysDate = new Date();
  return `${todaysDate.getDate()}-${todaysDate.getMonth()}-${todaysDate.getFullYear()}`;
};
const COWIN_API_URL = (districtId, date) =>
  `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`;
export default function App() {
  let [loading, setLoading] = React.useState(true);
  let [hdata, setData] = React.useState([]);
  let districtList = [
    {
      name: "chennai",
      id: "571"
    },
    {
      name: "tiruvallur",
      id: "572"
    },
    {
      name: "kanchipuram",
      id: "557"
    }
  ];

  React.useEffect(() => {
    let fetchHospitalDetails = async (id) => {
      let result = await axios.get(COWIN_API_URL(id, getCurrentDate()));
      return result.data.centers;
    };

    let fetchAllHospitalDetails = async () => {
      let result = await Promise.all(
        districtList.map((item) => fetchHospitalDetails(item.id))
      );
      console.log(result[0]);
      let data = [...result[0], ...result[1], ...result[2]];

      let apolloList = result[0].centers.filter((item) =>
        item.name.toLowerCase().includes("apollo")
      );
      console.log("apolloList", apolloList);
      setData(apolloList);
    };

    fetchAllHospitalDetails();
    setLoading(false);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <h2>Loading Hospital details...</h2>
      ) : (
        <div>
          <h2>Hospital Details</h2>
        </div>
      )}
    </div>
  );
}
