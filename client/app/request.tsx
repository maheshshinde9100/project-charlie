import React, { useState } from 'react';
import { ScrollView } from 'react-native';
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
    Pressable,
    useToast
} from '@gluestack-ui/themed';
import {
    X,
    QrCode,
    AlertTriangle,
    ArrowDownLeft
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { payments } from '../services/api';

export default function RequestMoneyScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [sender, setSender] = useState('John Doe'); // Default mock
    const [senderId, setSenderId] = useState('1'); // Mock ID, in real app, select from contacts
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        if (!amount || isNaN(parseFloat(amount))) return;

        setLoading(true);
        try {
            await payments.requestMoney(senderId, amount, note || "Please pay me back");
            Alert.alert("Success", `Request for ₹${amount} sent to ${sender}!`);
            router.replace('/(tabs)');
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || "Request failed");
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
                <Text className="text-lg font-bold dark:text-white">Request Money</Text>
                <Box className="w-6" />
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="xl" className="mt-8">
                    {/* Receiver Selection */}
                    <VStack space="xs">
                        <Text className="text-xs font-bold text-gray-400 p-1 uppercase">Request From</Text>
                        <HStack className="bg-white dark:bg-slate-800 p-4 rounded-3xl items-center justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
                            <HStack space="md" alignItems="center">
                                <Avatar size="md" className="bg-indigo-100">
                                    <AvatarFallbackText>{sender}</AvatarFallbackText>
                                    <AvatarImage source={{ uri: 'https://avatars.githubusercontent.com/u/1' }} />
                                </Avatar>
                                <VStack>
                                    <Text className="font-bold dark:text-white">{sender}</Text>
                                    <Text className="text-xs text-gray-500">Selected Contact</Text>
                                </VStack>
                            </HStack>
                            <Pressable>
                                <Text className="text-indigo-600 font-bold text-sm">Change</Text>
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
                    </VStack>

                    {/* Note Input */}
                    <VStack space="xs">
                        <Text className="text-xs font-bold text-gray-400 p-1 uppercase">Add a Note</Text>
                        <Input className="h-14 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                            <InputField
                                placeholder="e.g. Dinner bill split"
                                value={note}
                                onChangeText={setNote}
                            />
                        </Input>
                    </VStack>

                    <VStack space="md" className="mt-8 pb-10">
                        <Button
                            size="xl"
                            className={`rounded-2xl h-16 shadow-xl bg-indigo-600 shadow-indigo-200`}
                            onPress={handleRequest}
                            isDisabled={loading}
                        >
                            <ButtonText className="font-bold">
                                {loading ? 'Sending Request...' : `Request ₹${amount || '0'}`}
                            </ButtonText>
                        </Button>

                        <HStack justifyContent="center" alignItems="center" space="xs">
                            <QrCode size={16} color="#64748b" />
                            <Text className="text-center text-xs text-gray-500">
                                Or show QR code to receive payment
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
