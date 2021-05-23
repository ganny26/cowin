import axios from 'axios';
import React from 'react';
import './styles.css';

const Session = (props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="ms-2">
        <span class="badge rounded-pill bg-primary">{props.vaccine}</span>
      </div>
      <div className="ms-2">{props.min_age_limit} years</div>
      {/* <div className="ms-2">Available: {props.available_capacity}</div> */}
      <div className="ms-2">Dose1: {props.available_capacity_dose1}</div>
      <div className="ms-2">Dose2: {props.available_capacity_dose2}</div>
    </div>
  );
};
const getCurrentDate = () => {
  let todaysDate = new Date();
  var month = todaysDate.toLocaleDateString('en-US', {
    // you can use undefined as first argument
    month: '2-digit',
  });
  return `${todaysDate.getDate()}-${month}-${todaysDate.getFullYear()}`;
};
const COWIN_API_URL = (districtId, date) =>
  `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`;
export default function App() {
  let [loading, setLoading] = React.useState(true);
  let [hdata, setData] = React.useState([]);
  let districtList = [
    {
      name: 'chennai',
      id: '571',
    },
    {
      name: 'tiruvallur',
      id: '572',
    },
    {
      name: 'kanchipuram',
      id: '557',
    },
  ];

  React.useEffect(() => {
    let fetchHospitalDetails = async (id) => {
      let apiUrl = COWIN_API_URL(id, getCurrentDate());
      //console.log('apiUrl', apiUrl);
      let result = await axios.get(apiUrl);
      return result.data.centers;
    };

    let fetchAllHospitalDetails = async () => {
      let result = await Promise.all(districtList.map((item) => fetchHospitalDetails(item.id)));
      console.log(result[0]);
      let data1 = [...result[0], ...result[1], ...result[2]];
      console.log('data1', data1.length);

      let apolloList = data1.filter((item) => item.name.toLowerCase().includes('apollo'));
      console.log('apolloList', apolloList);
      setData(apolloList);
    };

    fetchAllHospitalDetails();
    setLoading(false);
  }, []);

  return (
    <div className="container">
      <div className="App">
        {loading ? (
          <h2>Loading Hospital details...</h2>
        ) : (
          <div className="container">
            <h2>Hospital Details</h2>

            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Hospital Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Session</th>
                </tr>
              </thead>
              <tbody>
                {hdata.map((item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>
                      {item.sessions.map((ctx) => (
                        <Session {...ctx} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul></ul>
          </div>
        )}
      </div>
    </div>
  );
}
