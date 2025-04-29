import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Animated, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTransactions } from '../context/TransactionContext';

const SavingsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [depositingId, setDepositingId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const { addTransaction } = useTransactions();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [goals]);

  const addGoal = () => {
    if (!goalName || !goalAmount || isNaN(goalAmount)) return;
    const newGoal = {
      id: Date.now().toString(),
      name: goalName,
      amount: parseFloat(goalAmount),
      deposited: 0,
      progress: 0,
      createdAt: new Date(),
    };
    setGoals(prev => [...prev, newGoal]);
    setGoalName('');
    setGoalAmount('');
  };

  const handleDeposit = (goalId) => {
    setDepositingId(goalId);
    setDepositAmount('');
  };

  const confirmDeposit = (goalId) => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) return;
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newDeposited = (goal.deposited || 0) + parseFloat(depositAmount);
        const progress = Math.min(Math.round((newDeposited / goal.amount) * 100), 100);
        return { ...goal, deposited: newDeposited, progress };
      }
      return goal;
    }));
    const goal = goals.find(g => g.id === goalId);
    addTransaction({
      title: `ฝากเข้าเป้าหมาย: ${goal ? goal.name : ''}`,
      amount: parseFloat(depositAmount),
      type: 'expense',
      createdAt: new Date()
    });
    setDepositingId(null);
    setDepositAmount('');
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
      marginBottom: 20,
    }}>
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Icon name="savings" size={28} color="#2196F3" style={styles.goalIcon} />
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{item.name}</Text>
            <Text style={styles.goalDate}>สร้างเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <LinearGradient colors={["#21CBF3", "#2196F3"]} style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.progress}%` }
              ]} 
            />
          </LinearGradient>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.goalAmount}>{item.amount.toLocaleString()} บาท</Text>
          <Text style={styles.remainingAmount}>เหลืออีก {(item.amount - (item.deposited || 0)).toLocaleString()} บาท</Text>
        </View>
        <View style={styles.depositRow}>
          <Text style={styles.depositedText}>ฝากแล้ว: {(item.deposited || 0).toLocaleString()} บาท</Text>
          <TouchableOpacity style={styles.depositButton} onPress={() => handleDeposit(item.id)}>
            <Icon name="account-balance-wallet" size={20} color="#2196F3" />
            <Text style={styles.depositButtonText}>ฝากเงิน</Text>
          </TouchableOpacity>
        </View>
        {depositingId === item.id && (
          <View style={styles.depositInputRow}>
            <TextInput
              style={styles.depositInput}
              placeholder="จำนวนเงินที่ฝาก"
              placeholderTextColor="#9bb8d3"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.depositConfirmButton} onPress={() => confirmDeposit(item.id)}>
              <Icon name="check-circle" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.depositCancelButton} onPress={() => setDepositingId(null)}>
              <Icon name="close" size={22} color="#F44336" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.headerGradient}
      >
        <Icon name="emoji-events" size={44} color="#fff" style={{ alignSelf: 'center', marginBottom: 8 }} />
        <Text style={styles.headerTitle}>เป้าหมายการออม</Text>
        <Text style={styles.headerSubtitle}>ตั้งเป้าหมายและติดตามความคืบหน้า
เพื่ออนาคตที่มั่นคงของคุณ</Text>
      </LinearGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีเป้าหมาย</Text>}
          ListHeaderComponent={
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginTop: 24,
              marginHorizontal: 10,
              backgroundColor: '#fff',
              borderRadius: 18,
              padding: 24,
              shadowColor: '#2196F3',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.10,
              shadowRadius: 12,
              elevation: 5,
              marginBottom: 24,
            }}>
              <View style={styles.inputWrapper}>
                <Icon name="title" size={24} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ชื่อเป้าหมาย"
                  placeholderTextColor="#9bb8d3"
                  value={goalName}
                  onChangeText={setGoalName}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Icon name="attach-money" size={24} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="จำนวนเงินที่ต้องการ (บาท)"
                  placeholderTextColor="#9bb8d3"
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addGoal}
                activeOpacity={0.85}
              >
                <LinearGradient colors={["#2196F3", "#21CBF3"]} style={styles.addButtonGradient}>
                  <Icon name="add" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.addButtonText}>เพิ่มเป้าหมาย</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          }
        />
      </KeyboardAvoidingView>
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 16,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  addButton: {
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    padding: 10,
    paddingTop: 0,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  goalDate: {
    fontSize: 12,
    color: '#757575',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#21CBF3',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  remainingAmount: {
    fontSize: 14,
    color: '#757575',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 24,
    fontSize: 16,
  },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 2,
  },
  depositedText: {
    fontSize: 15,
    color: '#2196F3',
    fontWeight: '600',
  },
  depositButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  depositButtonText: {
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 15,
  },
  depositInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  depositInput: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#B3E5FC',
    marginRight: 8,
  },
  depositConfirmButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 8,
    marginRight: 4,
  },
  depositCancelButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
});

export default SavingsScreen;
