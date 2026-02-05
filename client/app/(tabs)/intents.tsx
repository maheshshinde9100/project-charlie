import React from 'react';
import { ScrollView, View } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Progress,
    ProgressFilledTrack,
    Badge,
    BadgeText,
    BadgeIcon,
    Button,
    ButtonText,
    Divider,
    Icon,
    Pressable
} from '@gluestack-ui/themed';
import {
    Clock,
    AlertCircle,
    CheckCircle2,
    Info,
    History,
    ArrowRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useState, useEffect } from 'react';
import { payments } from '../../services/api';

export default function IntentsScreen() {
    const router = useRouter();
    const [intents, setIntents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIntents();
    }, []);

    const fetchIntents = async () => {
        try {
            setLoading(true);
            const res = await payments.getIntents();
            setIntents(res.data);
        } catch (err) {
            console.error("Fetch intents error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4">
                <Text className="text-2xl font-bold dark:text-white mb-2">Payment Intents</Text>
                <Text className="text-gray-500 text-sm mb-6">Auto-trigger queue for insufficient balance payments.</Text>
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="xl" className="pb-10">
                    {intents.length === 0 ? (
                        <Box className="py-20 items-center">
                            <Text className="text-slate-400 text-sm italic">No active payment intents</Text>
                        </Box>
                    ) : intents.map((intent: any) => (
                        <Pressable
                            key={intent.id}
                            onPress={() => router.push({
                                pathname: "/intent/[id]",
                                params: { id: intent.id }
                            })}
                            className={`p-6 rounded-[32px] border ${intent.status === 'Completed' ? 'border-slate-200 bg-white dark:bg-slate-900/50 dark:border-slate-800' : 'border-orange-100 bg-orange-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'} shadow-sm`}
                        >
                            <HStack justifyContent="space-between" alignItems="flex-start" className="mb-4">
                                <VStack space="xs" className="flex-1">
                                    <Text className="font-bold text-lg dark:text-white uppercase tracking-tight">{intent.receiver}</Text>
                                    <Text className="text-xs text-gray-500">Auto-Queue ID: {intent.id}</Text>
                                </VStack>
                                <Badge
                                    action={intent.status === 'Completed' ? 'success' : intent.status === 'Partial' ? 'warning' : 'info'}
                                    variant="solid"
                                    className="rounded-full px-3"
                                >
                                    <BadgeText className="text-[10px] uppercase font-bold">{intent.status}</BadgeText>
                                </Badge>
                            </HStack>

                            <VStack space="sm" className="mb-4">
                                <HStack justifyContent="space-between" className="px-1">
                                    <Text className="text-xs text-gray-500">Settlement Progress</Text>
                                    <Text className="text-xs font-bold dark:text-white">
                                        ₹{parseFloat(intent.settled_amount).toLocaleString()} / ₹{parseFloat(intent.total_amount).toLocaleString()}
                                    </Text>
                                </HStack>
                                <Progress value={(parseFloat(intent.settled_amount) / parseFloat(intent.total_amount)) * 100} className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                                    <ProgressFilledTrack className="bg-orange-500 rounded-full" />
                                </Progress>
                            </VStack>

                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack space="xs" alignItems="center">
                                    <Clock size={14} color="#64748b" />
                                    <Text className="text-xs text-gray-400">{new Date(intent.created_at).toLocaleDateString()}</Text>
                                </HStack>
                                <Button variant="link" size="sm" className="p-0">
                                    <ButtonText className="text-brand-600 text-sm font-semibold">View Timeline</ButtonText>
                                    <Icon as={ArrowRight} className="ml-1" size="sm" color="#0ea5e9" />
                                </Button>
                            </HStack>
                        </Pressable>
                    ))}

                    <Box className="bg-brand-600 dark:bg-brand-900/40 p-5 rounded-[32px] flex-row space-x-4 items-start shadow-xl shadow-brand-200">
                        <Box className="bg-white/20 p-2 rounded-xl">
                            <Info size={20} color="white" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-sm font-black text-white">Smart Automation</Text>
                            <Text className="text-xs text-brand-100 leading-relaxed mt-1 font-medium">
                                When balance is low, intents are queued. Top up to trigger immediate settlement. Our system handles the rest!
                            </Text>
                        </VStack>
                    </Box>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
