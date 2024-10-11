import React, { useEffect } from 'react'
import { useUtil } from '../contexts/UtilContext';
import http from './http'
import { tokenValue, CURRENT_USER_TYPE, USER_TYPES_NAV } from '../constants';

function MyAssets() {
  const { setUserRoles, setCategoryList } = useUtil();

  if (CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
    useEffect(() => { // fetch user roles
      const fetchUserRoles = async () => {
        try {
          const res = await http.get("/StaffRole");
          setUserRoles(res.data);
        } catch (error) {
          console.error("Error fetching user roles:", error);
        }
      };

      fetchUserRoles();
    }, []);
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await http.get(`/ItemCategory`);
        setCategoryList(res.data)
      } catch (error) {
        console.error("Error fetching category list:", error);
      }
    }

    fetchCategory();
  }, [])

  console.log("Access Token:", tokenValue);

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>My Assets</h3>
      <p style={{ color: 'grey' }}>Below are items that have been tagged under you</p>
    </div>
  )
}

export default MyAssets