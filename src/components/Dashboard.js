import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import axios from '../js/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PacmanLoader } from 'react-spinners';
import { Button } from 'react-bootstrap';
import useAuthNavigate from '../js/AuthNavigate';
import StudiesForm from './forms/StudiesForm';
import Pagination from './general/Pagination';

const Dashboard = ({ authState }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  useAuthNavigate(authState.isAuthenticated, true);

  const [showModal, setShowModal] = useState(false);

  const [pageDetails, setPageDetails] = useState({
    page: 1,
    pages: 0
  });

  const openModal = () => {
      setShowModal(true);
  };

  const closeModal = () => {
      setShowModal(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/studies", {
        params: {
          "page": pageDetails.page - 1
        }
      });
  
      const responseData = response.data;
      setData(responseData.data);
      setPageDetails({
        page: responseData.page + 1,
        pages: responseData.pages
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  
  useEffect(() => {
    fetchData();
  }, [navigate, pageDetails.page]);
  
  

  const handleOnClick = (item) => {
    navigate("/studies/" + item.id);
  }

  const handlePageChange = debounce((newPage) => {
    setPageDetails({
      ...pageDetails,
      page: newPage
    });
  }, 100);
  


  if (data === null) {
    return <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7" /></div>;
  }

  if (data.data === []) {
    return <div className='center-main'><div className='centered-element' />Brak danych</div>
  }

  return (
    <div className='content'>
      {authState.user.currentRoles.includes('ROLE_TEACHER') && <Button variant="primary" onClick={() => {openModal();}}>Dodaj</Button>}
      <StudiesForm authState={authState} isCreate={true} showModal={showModal} closeModal={closeModal}></StudiesForm>


      <div className='dashboard'>
        {data.map((item, index) => (
          <div className='dashboard_item' key={item.id} onClick={() => { handleOnClick(item) }}>
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>

      <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />
    </div>
  );
};

export default Dashboard;
