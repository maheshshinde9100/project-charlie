import React from 'react';
import { ScrollView } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Pressable,
    Icon,
    Divider
} from '@gluestack-ui/themed';
import {
    Bell,
    ArrowLeft,
    Zap,
    CheckCircle2,
    AlertCircle,
    Clock,
    MoreHorizontal
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const router = useRouter();

    const notifications = [
        {
            id: '1',
            type: 'AUTO_SETTLE',
            title: 'Auto-Settlement Successful',
            message: '₹1,500 was automatically transferred to Mahesh Shinde for "Monthly Rent".',
            time: '2 mins ago',
            icon: Zap,
            iconColor: '#0ea5e9',
            isNew: true
        },
        {
            id: '2',
            type: 'WALLET',
            title: 'Wallet Top-up',
            message: '₹5,000 has been credited to your wallet via UPI.',
            time: '1 hour ago',
            icon: CheckCircle2,
            iconColor: '#16a34a',
            isNew: true
        },
        {
            id: '3',
            type: 'INTENT',
            title: 'New Payment Intent Created',
            message: 'Insufficient balance for "Zomato". A pending intent has been created.',
            time: 'Yesterday',
            icon: Clock,
            iconColor: '#ea580c',
            isNew: false
        },
        {
            id: '4',
            type: 'SECURITY',
            title: 'Security Alert',
            message: 'A new login was detected from a Linux device in Pune, India.',
            time: '2 days ago',
            icon: AlertCircle,
            iconColor: '#ef4444',
            isNew: false
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <ArrowLeft size={20} color="#64748b" />
                </Pressable>
                <Text className="text-lg font-bold dark:text-white">Notifications</Text>
                <Box className="w-10" />
            </Box>

            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack className="py-2">
                    {notifications.map((notif) => (
                        <Pressable key={notif.id} className={`px-6 py-5 flex-row space-x-4 ${notif.isNew ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                            <Box className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
                                <notif.icon size={22} color={notif.iconColor} />
                            </Box>
                            <VStack className="flex-1" space="xs">
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text className={`font-bold text-sm dark:text-white ${notif.isNew ? 'text-brand-900' : 'text-slate-900'}`}>{notif.title}</Text>
                                    {notif.isNew && <Box className="w-2 h-2 rounded-full bg-brand-600" />}
                                </HStack>
                                <Text className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{notif.message}</Text>
                                <Text className="text-[10px] text-gray-400 font-medium mt-1">{notif.time}</Text>
                            </VStack>
                        </Pressable>
                    ))}
                </VStack>

                <Box className="px-6 py-10 items-center">
                    <Text className="text-gray-400 text-xs font-semibold">End of notifications</Text>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}
