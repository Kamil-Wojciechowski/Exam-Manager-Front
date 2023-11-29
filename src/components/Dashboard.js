import React, { useEffect, useState } from 'react';
import axios from '../js/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PacmanLoader } from 'react-spinners';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/studies");
        // Assuming the data is in response.data.data
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleOnClick = (item) => {
    navigate("/" + item.id);
  }

  if (data === null) {
    return <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7" /></div>;
  }

  if (data.data == []) {
    return <div className='center-main'><div className='centered-element'/>Brak danych</div>
  }
  
  return (
    <div className='dashboard'>
      {data.map((item, index) => (
        <div className='dashboard_item' key={item.id} onClick={() => {handleOnClick(item)}}>
          <h2>{item.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
