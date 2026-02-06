import React, { useState } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    Icon,
    Pressable,
    Toast,
    ToastTitle,
    useToast,
    Divider
} from '@gluestack-ui/themed';
import {
    X,
    User,
    ChevronRight,
    Info,
    History,
    AlertTriangle
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { wallet, payments } from '../services/api';

export default function SendMoneyScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [receiver, setReceiver] = useState('John Doe'); // Default for demo
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.amount) setAmount(params.amount.toString());
        if (params.receiver) setReceiver(params.receiver.toString());
        fetchBalance();
    }, [params]);

    const fetchBalance = async () => {
        try {
            const res = await wallet.getBalance();
            setBalance(res.data.balance);
        } catch (err) {
            console.error("Fetch balance error:", err);
        }
    };

    const isInsufficient = parseFloat(amount) > balance;

    const handleSend = async () => {
        if (!amount || isNaN(parseFloat(amount))) return;

        setLoading(true);
        try {
            const res = await payments.initiatePayment(receiver, amount, "Sent via app");
            if (res.data.intent) {
                Alert.alert(
                    "Balance Low: Intent Created",
                    `A payment intent for ₹${amount} has been queued. It will be settled automatically when you top up.`
                );
            } else {
                Alert.alert("Success", `Payment of ₹${amount} sent to ${receiver}!`);
            }
            router.replace('/(tabs)');
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4 flex-row justify-between items-center">
                <Pressable onPress={() => router.back()}>
                    <X size={24} color="#64748b" />
                </Pressable>
                <Text className="text-lg font-bold dark:text-white">Send Money</Text>
                <Box className="w-6" />
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="xl" className="mt-8">
                    {/* Receiver Selection */}
                    <VStack space="xs">
                        <Text className="text-xs font-bold text-gray-400 p-1 uppercase">To</Text>
                        <HStack className="bg-white dark:bg-slate-800 p-4 rounded-3xl items-center justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
                            <HStack space="md" alignItems="center">
                                <Avatar size="md" className="bg-brand-100">
                                    <AvatarFallbackText>{receiver}</AvatarFallbackText>
                                    <AvatarImage source={{ uri: 'https://avatars.githubusercontent.com/u/120265441' }} />
                                </Avatar>
                                <VStack>
                                    <Text className="font-bold dark:text-white">{receiver}</Text>
                                    <Text className="text-xs text-gray-500">mahesh.shinde@bank</Text>
                                </VStack>
                            </HStack>
                            <Pressable>
                                <Text className="text-brand-600 font-bold text-sm">Change</Text>
                            </Pressable>
                        </HStack>
                    </VStack>

                    {/* Amount Input */}
                    <VStack space="xs" className="items-center py-10">
                        <Text className="text-gray-400 text-sm font-medium">Enter Amount</Text>
                        <HStack alignItems="center" space="xs">
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
                        <Text className={`text-sm mt-4 ${isInsufficient ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                            Available: ₹{balance.toLocaleString()}
                        </Text>
                    </VStack>

                    {/* Insufficient Balance Info */}
                    {isInsufficient && (
                        <Box className="bg-amber-50 dark:bg-amber-950/20 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/40">
                            <HStack space="md" alignItems="flex-start">
                                <AlertTriangle size={24} color="#f59e0b" />
                                <VStack className="flex-1">
                                    <Text className="text-amber-900 dark:text-amber-300 font-bold text-sm">Create Auto-Trigger Intent?</Text>
                                    <Text className="text-orange-700 dark:text-orange-400 text-xs mt-1 leading-relaxed">
                                        You don't have enough balance. If you proceed, we will record this as a "Pending Intent" and pay {receiver} automatically as soon as you add funds to your wallet.
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>
                    )}

                    {/* Keypad simulation or other triggers */}
                    <VStack space="md" className="mt-4 pb-10">
                        <Button
                            size="xl"
                            className={`rounded-2xl h-16 shadow-xl ${isInsufficient ? 'bg-amber-600 shadow-amber-200' : 'bg-brand-600 shadow-brand-200'}`}
                            onPress={handleSend}
                            isDisabled={loading}
                        >
                            <ButtonText className="font-bold">
                                {loading ? 'Processing...' : (isInsufficient ? 'Establish Auto-Payment' : `Send ₹${amount || '0'}`)}
                            </ButtonText>
                        </Button>
                        <Text className="text-center text-xs text-gray-500">
                            Secure payment processed by Auto-Trigger Services
                        </Text>
                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
