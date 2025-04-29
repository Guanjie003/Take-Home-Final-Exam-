import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const TransactionContext = createContext();

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7); // YYYY-MM
}

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'transactions'), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(data);
    });

    return () => unsub();
  }, []);

  const addTransaction = async (transaction) => {
    const monthKey = getMonthKey(transaction.createdAt ? new Date(transaction.createdAt) : new Date());
    await addDoc(collection(db, 'transactions'), { ...transaction, monthKey });
  };

  const getTransactionsByMonth = (month = getMonthKey()) => {
    return transactions.filter(t => t.monthKey === month);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      getTransactionsByMonth
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);