import React, { createContext, useContext, useState, useEffect } from 'react';

const UtilContext = createContext();

export const UtilProvider = ({ children }) => {
    const [steps, setSteps] = useState(['Select your items to loan', 'Submitting your loan receipt'])
    const [userRoles, setUserRoles] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    return (
        <UtilContext.Provider value={{ steps, setSteps, userRoles, setUserRoles, categoryList, setCategoryList }}>
            {children}
        </UtilContext.Provider>
    );
}

export const useUtil = () => useContext(UtilContext);