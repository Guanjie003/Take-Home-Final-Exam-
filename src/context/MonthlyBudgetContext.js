// src/context/MonthlyBudgetContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const BudgetContext = createContext();

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7); // YYYY-MM
}

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState({}); // { '2024-06': 5000, ... }
  const [currentMonth, setCurrentMonth] = useState(getMonthKey());

  useEffect(() => {
    const loadBudget = async () => {
      const monthKey = getMonthKey();
      const docRef = doc(db, 'settings', `budget-${monthKey}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBudgets(prev => ({ ...prev, [monthKey]: docSnap.data().amount }));
      }
    };
    loadBudget();
  }, []);

  const getBudget = (month = currentMonth) => budgets[month] || 0;

  const updateBudget = async (newAmount, month = currentMonth) => {
    setBudgets(prev => ({ ...prev, [month]: newAmount }));
    await setDoc(doc(db, 'settings', `budget-${month}`), { amount: newAmount });
  };

  return (
    <BudgetContext.Provider value={{
      getBudget,
      updateBudget,
      currentMonth,
      setCurrentMonth,
      budgets
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);