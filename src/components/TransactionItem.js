import React from 'react';
import { View, Text } from 'react-native';

const TransactionItem = ({ transaction }) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text>{transaction.title}</Text>
      <Text style={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
        {transaction.type === 'income' ? '+' : '-'}{transaction.amount} บาท
      </Text>
    </View>
  );
};

export default TransactionItem;