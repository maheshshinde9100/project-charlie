import React from 'react';
import { ScrollView, View } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Divider,
    Icon,
    Input,
    InputField,
    InputIcon,
    InputSlot,
    Pressable
} from '@gluestack-ui/themed';
import {
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    Download
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useState, useEffect } from 'react';
import { payments } from '../../services/api';

export default function HistoryScreen() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await payments.getHistory();
            setTransactions(res.data);
        } catch (err) {
            console.error("Fetch history error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4">
                <HStack justifyContent="space-between" alignItems="center" className="mb-4">
                    <Text className="text-2xl font-bold dark:text-white">Activity</Text>
                    <Box className="bg-brand-100 dark:bg-brand-900/30 p-2.5 rounded-2xl shadow-sm">
                        <Download size={20} color="#0ea5e9" />
                    </Box>
                </HStack>

                <HStack space="sm" className="mb-6">
                    <Input className="flex-1 h-12 bg-gray-50 border-none dark:bg-slate-800 rounded-2xl">
                        <InputSlot className="pl-4">
                            <InputIcon as={Search} size="sm" color="#64748b" />
                        </InputSlot>
                        <InputField placeholder="Search transactions..." className="text-sm" />
                    </Input>
                    <Box className="bg-white dark:bg-slate-800 h-12 w-12 items-center justify-center rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <Filter size={20} color="#0ea5e9" />
                    </Box>
                </HStack>
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="lg" className="pb-10">
                    {transactions.length === 0 ? (
                        <Box className="py-20 items-center">
                            <Text className="text-slate-400 text-sm italic">No activity recorded</Text>
                        </Box>
                    ) : transactions.map((tx: any) => (
                        <Pressable key={tx.id} onPress={() => router.push({
                            pathname: "/transaction/[id]",
                            params: { id: tx.id }
                        })}>
                            <TransactionItem
                                title={tx.receiver}
                                type={tx.type === 'credit' ? 'received' : 'sent'}
                                amount={parseFloat(tx.amount)}
                                date={new Date(tx.created_at).toLocaleDateString()}
                                time={new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                category={tx.note || 'Transfer'}
                            />
                        </Pressable>
                    ))}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

function TransactionItem({ title, type, amount, date, time, category }: any) {
    return (
        <HStack justifyContent="space-between" alignItems="center" className="py-2">
            <HStack space="md" alignItems="center">
                <Box className={`w-14 h-14 rounded-[20px] items-center justify-center shadow-sm ${type === 'received' ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {type === 'received' ? (
                        <ArrowDownLeft size={24} color="#10b981" />
                    ) : (
                        <ArrowUpRight size={24} color="#64748b" />
                    )}
                </Box>
                <VStack>
                    <Text className="font-bold dark:text-white">{title}</Text>
                    <Text className="text-xs text-gray-400">{category} • {time}</Text>
                </VStack>
            </HStack>
            <VStack alignItems="flex-end">
                <Text className={`font-black text-lg ${type === 'received' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {type === 'received' ? '+' : '-'}₹{amount}
                </Text>
                <Text className="text-[10px] text-gray-400">{date}</Text>
            </VStack>
        </HStack>
    );
}
