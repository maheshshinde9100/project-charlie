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
import { useState, useEffect } from 'react';
import { notifications as notifApi } from '../services/api';

const getNotifIcon = (type: string) => {
    switch (type) {
        case 'AUTO_SETTLE': return Zap;
        case 'TOPUP': return CheckCircle2;
        case 'INTENT_CREATED': return Clock;
        case 'PAYMENT': return ArrowLeft;
        default: return Bell;
    }
};

const getNotifColor = (type: string) => {
    switch (type) {
        case 'AUTO_SETTLE': return '#0ea5e9';
        case 'TOPUP': return '#16a34a';
        case 'INTENT_CREATED': return '#ea580c';
        case 'PAYMENT': return '#4b5563';
        default: return '#6366f1';
    }
};

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifs, setNotifs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifs();
    }, []);

    const fetchNotifs = async () => {
        try {
            setLoading(true);
            const res = await notifApi.getNotifications();
            setNotifs(res.data);
        } catch (err) {
            console.error("Fetch notifications error:", err);
        } finally {
            setLoading(false);
        }
    };

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
                    {notifs.length === 0 ? (
                        <Box className="py-20 items-center">
                            <Text className="text-slate-400 text-sm italic">No notifications yet</Text>
                        </Box>
                    ) : notifs.map((notif: any) => {
                        const IconComp = getNotifIcon(notif.type);
                        const color = getNotifColor(notif.type);
                        return (
                            <Pressable key={notif.id} className={`px-6 py-5 flex-row space-x-4 ${notif.is_new ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                                <Box className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <IconComp size={22} color={color} />
                                </Box>
                                <VStack className="flex-1" space="xs">
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <Text className={`font-bold text-sm dark:text-white ${notif.is_new ? 'text-brand-900' : 'text-slate-900'}`}>{notif.title}</Text>
                                        {notif.is_new && <Box className="w-2 h-2 rounded-full bg-brand-600" />}
                                    </HStack>
                                    <Text className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{notif.message}</Text>
                                    <Text className="text-[10px] text-gray-400 font-medium mt-1">{new Date(notif.created_at).toLocaleString()}</Text>
                                </VStack>
                            </Pressable>
                        );
                    })}
                </VStack>

                <Box className="px-6 py-10 items-center">
                    <Text className="text-gray-400 text-xs font-semibold">End of notifications</Text>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}
