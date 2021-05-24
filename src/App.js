import axios from 'axios';
import React from 'react';
import './styles.css';

const Session = (props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid pink' }}>
      <div className="ms-2" style={{ width: 200 }}>
        <span class="badge rounded-pill bg-primary">{props.vaccine}</span>
      </div>

      {/* <div className="ms-2">Available: {props.available_capacity}</div> */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', margin: 10 }}>
          <div style={{ width: 100 }}>
            Dose 1 <br />
            {props.available_capacity_dose1}
          </div>
          <div style={{ width: 100, borderLeft: '1px solid #ccc' }}>
            Dose 2
            <br /> {props.available_capacity_dose2}
          </div>
        </div>
        <div className="ms-2">
          <b>{props.min_age_limit} years</b>
        </div>
      </div>
      <div>
        <div>Available Date</div>
        <br />
        {props.date}
      </div>
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
  let [ageLimit, setAgeLimit] = React.useState('18');
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
      setLoading(false);
    };

    fetchAllHospitalDetails();
  }, [ageLimit]);

  return (
    <div className="container">
      <div className="App">
        {loading ? (
          <h2>Loading Hospital details...</h2>
        ) : (
          <div className="container">
            <h2>Hospital Details</h2>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
              <input
                onClick={(e) => {
                  console.log('18', e.target.name);
                  setAgeLimit(e.target.name);
                }}
                type="radio"
                class="btn-check"
                name="18"
                id="btnradio1"
                autocomplete="off"
                checked={ageLimit === '18'}
              />
              <label class="btn btn-outline-primary" for="btnradio1">
                18+ Years
              </label>

              <input
                type="radio"
                class="btn-check"
                name="45"
                id="btnradio2"
                autocomplete="off"
                onClick={(e) => {
                  console.log('45', e.target.name);
                  setAgeLimit(e.target.name);
                }}
                checked={ageLimit === '45'}
              />
              <label class="btn btn-outline-primary" for="btnradio2">
                45+ Years
              </label>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '16.66%' }}>
                    Hospital Name
                  </th>
                  <th scope="col" style={{ width: '18.66%' }}>
                    Address
                  </th>
                  <th>Session</th>
                </tr>
              </thead>
              <tbody>
                {hdata.map((item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>
                      {item.sessions.map((ctx) => (
                        <Session ageLimit={ageLimit} {...ctx} />
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
