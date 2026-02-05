import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    Icon,
    Pressable,
    Divider,
} from '@gluestack-ui/themed';
import {
    X,
    CreditCard,
    Building,
    Smartphone,
    ShieldCheck,
    Zap
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { wallet } from '../services/api';
import { Alert } from 'react-native';

export default function TopUpScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingSettlements, setPendingSettlements] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await wallet.getBalance();
            setPendingSettlements(res.data.pendingSettlements);
        } catch (err) {
            console.error("Fetch balance error:", err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4 flex-row justify-between items-center">
                <Pressable onPress={() => router.back()}>
                    <X size={24} color="#64748b" />
                </Pressable>
                <Text className="text-lg font-bold dark:text-white">Top Up Wallet</Text>
                <Box className="w-6" />
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="xl" className="mt-8 pb-10">
                    <Text className="text-sm font-medium text-gray-400 text-center uppercase tracking-widest">Amount to Add</Text>
                    <HStack className="justify-center items-center py-6" space="xs">
                        <Text className="text-4xl font-bold dark:text-white">₹</Text>
                        <Input variant="underlined" className="border-none h-20 w-48 items-center justify-center">
                            <InputField
                                className="text-5xl font-bold text-center dark:text-white"
                                placeholder="0"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                autoFocus
                            />
                        </Input>
                    </HStack>

                    {/* Quick Amounts */}
                    <HStack space="sm" justifyContent="center">
                        {['500', '1000', '2000', '5000'].map(val => (
                            <Pressable
                                key={val}
                                className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
                                onPress={() => setAmount(val)}
                            >
                                <Text className="font-bold text-slate-600 dark:text-slate-300">₹{val}</Text>
                            </Pressable>
                        ))}
                    </HStack>

                    {/* Auto-Trigger Notice */}
                    {pendingSettlements > 0 && (
                        <Box className="bg-brand-50 dark:bg-brand-950/20 p-5 rounded-3xl border border-brand-100 dark:border-brand-900/40 mt-4">
                            <HStack space="md" alignItems="flex-start">
                                <Zap size={24} color="#0ea5e9" fill="#0ea5e9" />
                                <VStack className="flex-1">
                                    <Text className="text-brand-900 dark:text-brand-300 font-bold text-sm">Auto-Settlement Trigger</Text>
                                    <Text className="text-brand-700 dark:text-brand-400 text-xs mt-1 leading-relaxed">
                                        You have <Text className="font-black">₹{pendingSettlements}</Text> in pending payment intents. Adding funds will automatically trigger these transfers for you.
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>
                    )}

                    <VStack space="md" className="mt-6">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Payment Method</Text>

                        <PaymentMethodItem icon={Smartphone} title="UPI Apps" subtitle="GPay, PhonePe, Paytm" />
                        <PaymentMethodItem icon={CreditCard} title="Debit / Credit Card" subtitle="Visa, Mastercard, RuPay" />
                        <PaymentMethodItem icon={Building} title="Net Banking" subtitle="All major Indian banks" />
                    </VStack>

                    <Button
                        size="xl"
                        className="rounded-2xl h-16 bg-brand-600 mt-6 shadow-xl shadow-brand-200"
                        onPress={async () => {
                            if (!amount || isNaN(parseFloat(amount))) return;
                            setLoading(true);
                            try {
                                await wallet.topUp(parseFloat(amount), 'upi');
                                Alert.alert("Success", `Added ₹${amount} successfully. Auto-trigger service is processing your pending intents!`);
                                router.replace('/(tabs)');
                            } catch (err: any) {
                                Alert.alert("Error", err.response?.data?.message || "Top up failed");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        isDisabled={loading}
                    >
                        <ButtonText className="font-bold">{loading ? 'Processing...' : 'Add Funds & Settle'}</ButtonText>
                    </Button>

                    <HStack space="xs" justifyContent="center" alignItems="center" className="mt-4">
                        <ShieldCheck size={16} color="#16a34a" />
                        <Text className="text-[10px] text-gray-500 font-medium">100% Secure PCI-DSS Compliant Payments</Text>
                    </HStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

function PaymentMethodItem({ icon: IconComp, title, subtitle }: any) {
    return (
        <Pressable className={`bg-white dark:bg-slate-800 p-4 rounded-2xl flex-row items-center justify-between border border-slate-100 dark:border-slate-800 shadow-sm`}>
            <HStack space="md" alignItems="center">
                <Box className="bg-brand-50 dark:bg-slate-700 p-2.5 rounded-xl">
                    <IconComp size={20} color="#0ea5e9" />
                </Box>
                <VStack>
                    <Text className="font-bold dark:text-white text-slate-700">{title}</Text>
                    <Text className="text-[10px] text-slate-400 font-medium">{subtitle}</Text>
                </VStack>
            </HStack>
            <Box className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-500" />
        </Pressable>
    );
}
