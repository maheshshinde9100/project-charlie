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
    InputSlot
} from '@gluestack-ui/themed';
import {
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    Download
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const transactions = [
        { id: '1', title: 'John Doe', type: 'sent', amount: 500, date: 'Feb 01, 2025', time: '10:30 AM', category: 'Transfer' },
        { id: '2', title: 'Wallet Top-up', type: 'received', amount: 2000, date: 'Jan 28, 2025', time: '11:20 AM', category: 'Deposit' },
        { id: '3', title: 'Zomato Merchant', type: 'sent', amount: 450, date: 'Jan 27, 2025', time: '08:45 PM', category: 'Food' },
        { id: '4', title: 'Starbucks Coffee', type: 'sent', amount: 320, date: 'Jan 25, 2025', time: '09:15 AM', category: 'Beverage' },
        { id: '5', title: 'Netflix Subscription', type: 'sent', amount: 199, date: 'Jan 22, 2025', time: '04:00 PM', category: 'Entertainment' },
        { id: '6', title: 'Sarah Jenkins', type: 'received', amount: 1500, date: 'Jan 20, 2025', time: '02:30 PM', category: 'Transfer' },
        { id: '7', title: 'Uber Ride', type: 'sent', amount: 280, date: 'Jan 18, 2025', time: '06:20 PM', category: 'Transport' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <Box className="px-6 py-4">
                <HStack justifyContent="space-between" alignItems="center" className="mb-4">
                    <Text className="text-2xl font-bold dark:text-white">Activity</Text>
                    <Box className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full">
                        <Download size={20} color="#64748b" />
                    </Box>
                </HStack>

                <HStack space="sm" className="mb-6">
                    <Input className="flex-1 h-12 bg-gray-50 border-none dark:bg-slate-800 rounded-2xl">
                        <InputSlot className="pl-4">
                            <InputIcon as={Search} size="sm" color="#64748b" />
                        </InputSlot>
                        <InputField placeholder="Search transactions..." className="text-sm" />
                    </Input>
                    <Box className="bg-gray-100 dark:bg-slate-800 h-12 w-12 items-center justify-center rounded-2xl">
                        <Filter size={20} color="#64748b" />
                    </Box>
                </HStack>
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="lg" className="pb-10">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">February 2025</Text>
                    {transactions.filter(t => t.date.includes('Feb')).map((tx) => (
                        <TransactionItem key={tx.id} {...tx} />
                    ))}

                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">January 2025</Text>
                    {transactions.filter(t => t.date.includes('Jan')).map((tx) => (
                        <TransactionItem key={tx.id} {...tx} />
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
                <Box className={`w-12 h-12 rounded-2xl items-center justify-center ${type === 'received' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-slate-800'}`}>
                    {type === 'received' ? (
                        <ArrowDownLeft size={22} color="#16a34a" />
                    ) : (
                        <ArrowUpRight size={22} color="#64748b" />
                    )}
                </Box>
                <VStack>
                    <Text className="font-bold dark:text-white">{title}</Text>
                    <Text className="text-xs text-gray-400">{category} • {time}</Text>
                </VStack>
            </HStack>
            <VStack alignItems="flex-end">
                <Text className={`font-bold ${type === 'received' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {type === 'received' ? '+' : '-'}₹{amount}
                </Text>
                <Text className="text-[10px] text-gray-400">{date}</Text>
            </VStack>
        </HStack>
    );
}
