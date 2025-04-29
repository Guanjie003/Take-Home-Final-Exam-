import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ToastAndroid,
  Alert,
  Animated,
  ScrollView
} from 'react-native';
import { useBudget } from '../context/MonthlyBudgetContext';
import { useTransactions } from '../context/TransactionContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function getMonthNameTH(date) {
  const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${thMonths[date.getMonth()]} ${date.getFullYear()}`;
}

const BudgetScreen = () => {
  const { getBudget, updateBudget, currentMonth, setCurrentMonth } = useBudget();
  const { getTransactionsByMonth } = useTransactions();
  const [input, setInput] = useState(getBudget(currentMonth).toString());
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(40)).current;

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
  }, [currentMonth]);

  const handleSave = () => {
    updateBudget(parseFloat(input), currentMonth);
    if (Platform.OS === 'android') {
      ToastAndroid.show('บันทึกงบประมาณสำเร็จ!', ToastAndroid.SHORT);
    } else {
      Alert.alert('สำเร็จ', 'บันทึกงบประมาณสำเร็จ!');
    }
  };

  // คำนวณยอดใช้จ่ายจริงของเดือนปัจจุบัน
  const transactions = getTransactionsByMonth(currentMonth);
  const used = transactions
    ? transactions.filter(t => t.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0)
    : 0;
  const budget = getBudget(currentMonth);
  const percent = budget > 0 ? Math.min(used / budget, 1) : 0;

  // เลือกเดือน (ย้อนหลัง 12 เดือน)
  const months = Array.from({ length: 12 }, (_, i) => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { key: d.toISOString().slice(0, 7), label: getMonthNameTH(d) };
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.headerGradient}
      >
        <Icon name="pie-chart" size={48} color="#fff" style={{ alignSelf: 'center', marginBottom: 8 }} />
        <Text style={styles.headerTitle}>ตั้งงบรายเดือน</Text>
        <Text style={styles.headerSubtitle}>กำหนดงบประมาณและควบคุมการใช้จ่ายของคุณ</Text>
        <View style={styles.monthPickerRow}>
          <Icon name="calendar-today" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.monthPickerLabel}>เดือน:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthPickerScroll} contentContainerStyle={{alignItems:'center'}}>
            {months.map(m => (
              <TouchableOpacity
                key={m.key}
                style={[styles.monthButton, m.key === currentMonth && styles.monthButtonActive]}
                onPress={() => setCurrentMonth(m.key)}
              >
                <Text style={[styles.monthButtonText, m.key === currentMonth && styles.monthButtonTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>  
          <Text style={styles.cardLabel}>งบประมาณของเดือน {currentMonth}</Text>
          <View style={styles.budgetRow}>
            <Icon name="account-balance-wallet" size={32} color="#2196F3" style={{ marginRight: 10 }} />
            <Text style={styles.budgetText}>{budget.toLocaleString()} บาท</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percent * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>ใช้ไป {used.toLocaleString()} บาท ({Math.round(percent * 100)}%)</Text>
        </Animated.View>
        <Animated.View style={[styles.inputCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>  
          <View style={styles.inputWrapper}>
            <Icon name="edit" size={22} color="#2196F3" style={styles.inputIcon} />
            <TextInput
              keyboardType="numeric"
              value={input}
              onChangeText={setInput}
              style={styles.input}
              placeholder="ใส่จำนวนเงินใหม่ (บาท)"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <LinearGradient colors={["#2196F3", "#21CBF3"]} style={styles.buttonGradient}>
              <Icon name="check-circle" size={22} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>บันทึก</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    padding: 28,
    paddingTop: 44,
    paddingBottom: 36,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: -36,
    padding: 24,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
    marginBottom: 8,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#21CBF3',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#1976D2',
    marginTop: 2,
    marginBottom: 2,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 24,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ccd6e0',
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#333',
    paddingVertical: 12,
  },
  button: {
    marginTop: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  monthPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  monthPickerLabel: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  monthPickerScroll: {
    flexGrow: 0,
    marginLeft: 8,
    minHeight: 44,
  },
  monthButton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 2,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  monthButtonActive: {
    backgroundColor: '#fff',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  monthButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  monthButtonTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default BudgetScreen;