import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const { transactions } = useTransactions();
  const dataByCategory = {};

  transactions.forEach((item) => {
    if (item.type === 'expense') {
      if (!dataByCategory[item.title]) dataByCategory[item.title] = 0;
      dataByCategory[item.title] += item.amount;
    }
  });

  const chartData = Object.entries(dataByCategory).map(([key, value], index) => ({
    name: key,
    amount: value,
    color: `hsl(${index * 50}, 70%, 60%)`,
    legendFontColor: '#333',
    legendFontSize: 14
  }));

  const incomeByCategory = {};
  transactions.forEach((item) => {
    if (item.type === 'income') {
      if (!incomeByCategory[item.title]) incomeByCategory[item.title] = 0;
      incomeByCategory[item.title] += item.amount;
    }
  });

  const incomeChartData = Object.entries(incomeByCategory).map(([key, value], index) => ({
    name: key,
    amount: value,
    color: `hsl(${index * 70 + 180}, 60%, 60%)`,
    legendFontColor: '#333',
    legendFontSize: 14
  }));

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(40)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(fadeAnim1, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim1, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(fadeAnim2, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim2, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>วิเคราะห์รายรับรายจ่าย</Text>
        <Text style={styles.headerSubtitle}>ดูข้อมูลการใช้เงินของคุณ</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, {
          opacity: fadeAnim1,
          transform: [{ translateY: slideAnim1 }],
          marginTop: 20,
          marginBottom: 40,
        }]}> 
          <View style={styles.cardHeader}>
            <Icon name="money-off" size={24} color="#F44336" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>รายจ่ายตามหมวดหมู่</Text>
          </View>
          <PieChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => `#000`
            }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </Animated.View>
        <Animated.View style={[styles.card, {
          opacity: fadeAnim2,
          transform: [{ translateY: slideAnim2 }],
          marginBottom: 40,
        }]}> 
          <View style={styles.cardHeader}>
            <Icon name="add-business" size={24} color="#4CAF50" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>รายรับตามหมวดหมู่</Text>
          </View>
          <PieChart
            data={incomeChartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => `#000`
            }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </Animated.View>
      </ScrollView>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});

export default AnalyticsScreen;