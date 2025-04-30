import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TransactionProvider } from './src/context/TransactionContext';
import { BudgetProvider } from './src/context/MonthlyBudgetContext';
import DashboardScreen from './src/screens/DashboardScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import SavingsScreen from './src/screens/SavingsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import * as Notifications from 'expo-notifications';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <TransactionProvider>
      <BudgetProvider>
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerStyle: { 
                backgroundColor: '#2196F3',
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              },
              drawerStyle: {
                backgroundColor: '#FFFFFF',
                width: 280,
              },
              drawerActiveTintColor: '#2196F3',
              drawerInactiveTintColor: '#757575',
              drawerLabelStyle: { 
                fontSize: 16,
                fontWeight: '500',
                marginLeft: 12,
              },
              drawerItemStyle: {
                marginVertical: 4,
                borderRadius: 8,
                marginHorizontal: 12,
                paddingLeft: 8,
              },
              drawerActiveBackgroundColor: '#E3F2FD',
              drawerContentContainerStyle: {
                paddingTop: 70,
              },
              drawerIconContainerStyle: {
                marginRight: 0,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}
          >
            <Drawer.Screen 
              name="หน้าหลัก" 
              component={DashboardScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="dashboard" size={28} color={color} style={{ marginRight: -8 }} />
                ),
              }}
            />
            <Drawer.Screen 
              name="เพิ่มรายการ" 
              component={AddTransactionScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="add-circle" size={28} color={color} style={{ marginRight: -8 }} />
                ),
              }}
            />
            <Drawer.Screen 
              name="เป้าหมายการออม" 
              component={SavingsScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="savings" size={28} color={color} style={{ marginRight: -8 }} />
                ),
              }}
            />
            <Drawer.Screen 
              name="วิเคราะห์รายรับรายจ่าย" 
              component={AnalyticsScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="analytics" size={28} color={color} style={{ marginRight: -8 }} />
                ),
              }}
            />
            <Drawer.Screen 
              name="ตั้งงบประมาณ" 
              component={BudgetScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="account-balance-wallet" size={28} color={color} style={{ marginRight: -8 }} />
                ),
              }}
            />
            <Drawer.Screen 
              name="ประวัติแต่ละเดือน" 
              component={HistoryScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="history" size={28} color={color} style={{ marginRight: -8 }} />
                ),
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </BudgetProvider>
    </TransactionProvider>
  );
}