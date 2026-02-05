import React from 'react';
import { ScrollView } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Pressable,
    Icon,
    Divider,
    Progress,
    ProgressFilledTrack,
    Badge,
    BadgeText,
    Button,
    ButtonText
} from '@gluestack-ui/themed';
import {
    ArrowLeft,
    Zap,
    Clock,
    CheckCircle2,
    ChevronRight,
    Info,
    CalendarDays
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useState, useEffect } from 'react';
import { payments } from '../../services/api';

export default function IntentDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [intent, setIntent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchIntent();
    }, [id]);

    const fetchIntent = async () => {
        try {
            setLoading(true);
            const res = await payments.getIntentDetails(id as string);
            setIntent(res.data);
        } catch (err) {
            console.error("Fetch intent error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Text className="text-slate-500">Loading timeline...</Text>
        </SafeAreaView>
    );

    if (!intent) return (
        <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Text className="text-red-500">Intent not found</Text>
        </SafeAreaView>
    );

    const progress = (parseFloat(intent.settled_amount) / parseFloat(intent.total_amount)) * 100;

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4 flex-row items-center border-b border-transparent">
                <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 mr-4">
                    <ArrowLeft size={20} color="#64748b" />
                </Pressable>
                <Text className="text-xl font-bold dark:text-white flex-1">Intent Timeline</Text>
            </Box>

            <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {/* Summary Card */}
                <Box className="bg-brand-600 rounded-[32px] p-8 mt-6 shadow-xl shadow-brand-200">
                    <VStack space="md">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text className="text-brand-100 font-bold uppercase tracking-widest text-xs">Total Amount</Text>
                            <Badge action="warning" variant="solid" className="bg-brand-400/30 rounded-full border-none px-3">
                                <BadgeText className="text-[10px] text-white">AUTO-TRIGGER ACTIVE</BadgeText>
                            </Badge>
                        </HStack>
                        <Text className="text-4xl font-black text-white">₹ {parseFloat(intent.total_amount).toLocaleString()}</Text>

                        <VStack space="xs" className="mt-4">
                            <HStack justifyContent="space-between">
                                <Text className="text-brand-100 text-xs">Settled so far</Text>
                                <Text className="text-white text-xs font-bold">{progress.toFixed(0)}%</Text>
                            </HStack>
                            <Progress value={progress} className="h-2 bg-brand-500/50 rounded-full">
                                <ProgressFilledTrack className="bg-white" />
                            </Progress>
                        </VStack>

                        <HStack className="mt-4 bg-white/10 p-4 rounded-2xl" justifyContent="space-around">
                            <VStack alignItems="center">
                                <Text className="text-white font-bold">₹ {parseFloat(intent.settled_amount).toLocaleString()}</Text>
                                <Text className="text-indigo-200 text-[10px]">PAID</Text>
                            </VStack>
                            <Divider orientation="vertical" className="bg-white/20 h-6" />
                            <VStack alignItems="center">
                                <Text className="text-white font-bold">₹ {parseFloat(intent.remaining_amount).toLocaleString()}</Text>
                                <Text className="text-indigo-200 text-[10px]">PENDING</Text>
                            </VStack>
                        </HStack>
                    </VStack>
                </Box>

                {/* Info Box */}
                <Box className="mt-6 bg-brand-50 dark:bg-brand-950/20 p-5 rounded-[24px] flex-row space-x-4 items-start border border-brand-100 dark:border-brand-900/40">
                    <Zap size={22} color="#0ea5e9" fill="#0ea5e9" style={{ marginTop: 2 }} />
                    <VStack className="flex-1">
                        <Text className="text-sm font-bold text-brand-900 dark:text-brand-200">Auto-Settle Logic</Text>
                        <Text className="text-[11px] text-brand-700 dark:text-brand-400 leading-relaxed mt-1">
                            Every time you add money to your wallet, our engine pulls the maximum possible amount from your balance to settle this intent. No manual intervention needed.
                        </Text>
                    </VStack>
                </Box>

                {/* History Timeline */}
                <VStack space="lg" className="mt-10 mb-10">
                    <HStack space="sm" alignItems="center">
                        <CalendarDays size={20} color="#64748b" />
                        <Text className="text-lg font-bold dark:text-white">Settlement History</Text>
                    </HStack>

                    {intent.history && intent.history.length > 0 ? intent.history.map((item: any, index: number) => (
                        <HStack key={item.id} space="md" className="relative pb-8">
                            {/* Visual Timeline line */}
                            {index < intent.history.length - 1 && (
                                <Box className="absolute left-[11px] top-[24px] bottom-0 w-[2px] bg-gray-100 dark:bg-slate-800" />
                            )}

                            <Box className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 items-center justify-center z-10">
                                <CheckCircle2 size={12} color="#16a34a" />
                            </Box>

                            <VStack className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text className="font-bold dark:text-white uppercase text-[10px] tracking-tight">₹ {parseFloat(item.amount).toLocaleString()}</Text>
                                    <Text className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</Text>
                                </HStack>
                                <Text className="text-[10px] text-slate-400 mt-1">Settlement triggered at {new Date(item.created_at).toLocaleTimeString()}</Text>
                            </VStack>
                        </HStack>
                    )) : (
                        <Text className="text-center text-slate-400 text-xs italic py-4">No settlements recorded yet.</Text>
                    )}

                    <Box className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl items-center border border-dashed border-gray-300 dark:border-slate-600">
                        <Text className="text-xs text-gray-400 font-semibold italic">Waiting for next wallet top-up...</Text>
                    </Box>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
