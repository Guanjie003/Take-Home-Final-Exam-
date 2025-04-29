import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Animated, ScrollView } from 'react-native';
import { useTransactions } from '../context/TransactionContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddTransactionScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const { addTransaction } = useTransactions();

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#2196F3',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
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
  }, [navigation]);

  const handleAdd = () => {
    if (!title || !amount) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    const newTransaction = {
      title,
      amount: parseFloat(amount),
      type,
      createdAt: new Date()
    };
    addTransaction(newTransaction);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.headerGradient}
      >
        <Icon name="playlist_add" size={44} color="#fff" style={{ alignSelf: 'center', marginBottom: 8 }} />
        <Text style={styles.headerTitle}>เพิ่มรายการใหม่</Text>
        <Text style={styles.headerSubtitle}>กรอกข้อมูลรายการของคุณ</Text>
      </LinearGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
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
          }}>
            <View style={styles.inputWrapper}>
              <Icon name="title" size={24} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="ชื่อรายการ"
                placeholderTextColor="#9bb8d3"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon name="attach-money" size={24} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="จำนวนเงิน"
                placeholderTextColor="#9bb8d3"
              />
            </View>
            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>ประเภทรายการ</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'expense' ? styles.typeButtonActiveExpense : styles.typeButtonInactive,
                  ]}
                  onPress={() => setType('expense')}
                  activeOpacity={0.85}
                >
                  <Icon 
                    name="money-off" 
                    size={24} 
                    color={type === 'expense' ? '#FFFFFF' : '#F44336'} 
                    style={styles.typeIcon}
                  />
                  <Text style={[
                    styles.typeButtonText,
                    type === 'expense' ? styles.typeButtonTextActiveExpense : styles.typeButtonTextInactive,
                  ]}>รายจ่าย</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'income' ? styles.typeButtonActiveIncome : styles.typeButtonInactive,
                  ]}
                  onPress={() => setType('income')}
                  activeOpacity={0.85}
                >
                  <Icon 
                    name="add-business" 
                    size={24} 
                    color={type === 'income' ? '#FFFFFF' : '#4CAF50'} 
                    style={styles.typeIcon}
                  />
                  <Text style={[
                    styles.typeButtonText,
                    type === 'income' ? styles.typeButtonTextActiveIncome : styles.typeButtonTextInactive,
                  ]}>รายรับ</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.buttonContainer} 
              onPress={handleAdd}
              activeOpacity={0.85}
            >
              <LinearGradient colors={["#2196F3", "#21CBF3"]} style={styles.buttonGradient}>
                <Icon name="check" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>บันทึกรายการ</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  typeContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 12,
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    marginHorizontal: 8,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  typeButtonActiveExpense: {
    backgroundColor: '#F44336',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#4CAF50',
  },
  typeButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeIcon: {
    marginRight: 8,
  },
  typeButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  typeButtonTextActiveExpense: {
    color: '#FFFFFF',
  },
  typeButtonTextActiveIncome: {
    color: '#FFFFFF',
  },
  typeButtonTextInactive: {
    color: '#757575',
  },
  buttonContainer: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AddTransactionScreen;