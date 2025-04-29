import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useBudget } from "../context/MonthlyBudgetContext";
import { useTransactions } from "../context/TransactionContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function getMonthNameTH(date) {
  const thMonths = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  return `${thMonths[date.getMonth()]} ${date.getFullYear()}`;
}

const HistoryScreen = () => {
  const { getBudget } = useBudget();
  const { getTransactionsByMonth } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());

  const months = Array.from({ length: 12 }, (_, i) => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { key: d.toISOString().slice(0, 7), label: getMonthNameTH(d) };
  });

  const budget = getBudget(selectedMonth);
  const transactions = getTransactionsByMonth(selectedMonth);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, cur) => acc + cur.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#2196F3", "#1976D2"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>ประวัติแต่ละเดือน</Text>
        <View style={styles.monthPickerRow}>
          <Icon
            name="calendar-today"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.monthPickerLabel}>เดือน:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.monthPickerScroll}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {months.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.monthButton,
                  m.key === selectedMonth && styles.monthButtonActive,
                ]}
                onPress={() => setSelectedMonth(m.key)}
              >
                <Text
                  style={[
                    styles.monthButtonText,
                    m.key === selectedMonth && styles.monthButtonTextActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Icon
            name="account-balance-wallet"
            size={24}
            color="#2196F3"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.summaryLabel}>งบประมาณ:</Text>
          <Text style={styles.summaryValue}>{budget.toLocaleString()} บาท</Text>
        </View>
        <View style={styles.summaryRow}>
          <Icon
            name="trending-down"
            size={24}
            color="#F44336"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.summaryLabel}>รายจ่าย:</Text>
          <Text style={[styles.summaryValue, { color: "#F44336" }]}>
            {totalExpense.toLocaleString()} บาท
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Icon
            name="trending-up"
            size={24}
            color="#4CAF50"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.summaryLabel}>รายรับ:</Text>
          <Text style={[styles.summaryValue, { color: "#4CAF50" }]}>
            {totalIncome.toLocaleString()} บาท
          </Text>
        </View>
      </View>
      <Text style={styles.listTitle}>รายการธุรกรรม</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <View
              style={[
                styles.circleIcon,
                {
                  backgroundColor:
                    item.type === "income" ? "#4CAF50" : "#F44336",
                },
              ]}
            />
            <View style={styles.transactionContent}>
              <View>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("th-TH")
                    : ""}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.type === "income" ? "#4CAF50" : "#F44336" },
                ]}
              >
                {item.type === "income" ? "+" : "-"}
                {item.amount.toLocaleString()} บาท
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.transactionList}
        ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีข้อมูล</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  monthPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  monthPickerLabel: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 8,
  },
  monthPickerScroll: {
    flexGrow: 0,
    marginLeft: 8,
    minHeight: 44,
  },
  monthButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 2,
    minWidth: 80,
    alignItems: "center",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  monthButtonActive: {
    backgroundColor: "#fff",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  monthButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  monthButtonTextActive: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 20,
    marginTop: -20,
    padding: 20,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "600",
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  transactionList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#757575",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 24,
    fontSize: 16,
  },
});

export default HistoryScreen;
