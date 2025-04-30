import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../context/TransactionContext';
import TransactionItem from '../components/TransactionItem';
import * as Notifications from 'expo-notifications';
import { useBudget } from '../context/MonthlyBudgetContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardScreen = ({ navigation }) => {
  const { transactions } = useTransactions();
  const { getBudget, currentMonth } = useBudget();

  const balanceAnim = useRef(new Animated.Value(0)).current;
  const budgetAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#f0f4f8',
      },
      headerTintColor: '#007AFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, []);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(balanceAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(budgetAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const total = transactions.reduce((acc, cur) => {
    return cur.type === 'income' ? acc + cur.amount : acc - cur.amount;
  }, 0);

  // แจ้งเตือนถ้าใช้เงินเกินงบ
  useEffect(() => {
    const budget = getBudget ? getBudget(currentMonth) : 0;
    const checkSpendingAndNotify = async () => {
      if (budget > 0 && totalExpense > budget) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'คุณใช้เงินเกินงบ!',
            body: `ตอนนี้คุณใช้ไป ${totalExpense} จากงบ ${budget} บาทแล้ว!`,
          },
          trigger: null,
        });
      }
    };
    checkSpendingAndNotify();
  }, [transactions, getBudget, currentMonth, totalExpense]);

  const budget = getBudget ? getBudget(currentMonth) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>ยินดีต้อนรับ</Text>
        <Text style={styles.headerSubtitle}>จัดการการเงินของคุณอย่างชาญฉลาด</Text>
      </LinearGradient>

      <Animated.View style={[styles.card, {
        opacity: balanceAnim,
        transform: [{ translateY: balanceAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }]
      }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon name="account-balance" size={24} color="#2196F3" />
          </View>
          <Text style={styles.balanceLabel}>ยอดคงเหลือ</Text>
        </View>
        <Text style={styles.balanceAmount}>{total.toLocaleString()} บาท</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>อัพเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.budgetCard, {
        opacity: budgetAnim,
        transform: [{ translateY: budgetAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }]
      }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Icon name="account-balance-wallet" size={24} color="#FF9800" />
          </View>
          <Text style={styles.budgetLabel}>งบประมาณคงเหลือ</Text>
        </View>
        <Text style={styles.budgetAmount}>{(budget - totalExpense).toLocaleString()} บาท</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: budget > 0 ? `${Math.min((totalExpense / budget) * 100, 100)}%` : '0%',
                backgroundColor: totalExpense > budget ? '#F44336' : '#4CAF50'
              }
            ]} 
          />
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>ใช้ไปแล้ว {totalExpense.toLocaleString()} จาก {budget.toLocaleString()} บาท</Text>
        </View>
      </Animated.View>

      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>รายการล่าสุด</Text>
        <TouchableOpacity 
          style={styles.addButtonSmall}
          onPress={() => navigation.navigate('เพิ่มรายการ')}
        >
          <Icon name="add-circle" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <View style={[styles.circleIcon, { backgroundColor: item.type === 'income' ? '#4CAF50' : '#F44336' }]} />
            <View style={styles.transactionContent}>
              <View>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: item.type === 'income' ? '#4CAF50' : '#F44336' }]}>
                {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} บาท
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.transactionList}
        style={{
          opacity: listAnim,
          transform: [{ translateY: listAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
        }}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('เพิ่มรายการ')}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>เพิ่มรายการ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  budgetAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    marginTop: 8,
  },
  cardFooterText: {
    fontSize: 12,
    color: '#757575',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButtonSmall: {
    padding: 8,
  },
  transactionList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  circleIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#757575',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DashboardScreen;