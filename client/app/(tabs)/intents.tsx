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

export default function IntentsScreen() {
    const router = useRouter();
    const intents = [
        {
            id: '1',
            title: 'Monthly Rent Payment',
            receiver: 'Mahesh Shinde',
            totalAmount: 12000,
            settledAmount: 4000,
            status: 'Partial',
            date: 'Feb 01, 2026',
            priority: 'High'
        },
        {
            id: '2',
            title: 'Electricity Bill',
            receiver: 'MSEB',
            totalAmount: 4500,
            settledAmount: 0,
            status: 'Pending',
            date: 'Jan 30, 2026',
            priority: 'Medium'
        },
        {
            id: '3',
            title: 'Laptop Installment',
            receiver: 'Amazon Pay',
            totalAmount: 5000,
            settledAmount: 5000,
            status: 'Completed',
            date: 'Jan 15, 2026',
            priority: 'Routine'
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4">
                <Text className="text-2xl font-bold dark:text-white mb-2">Payment Intents</Text>
                <Text className="text-gray-500 text-sm mb-6">Auto-trigger queue for insufficient balance payments.</Text>
            </Box>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <VStack space="xl" className="pb-10">
                    {intents.map((intent) => (
                        <Pressable
                            key={intent.id}
                            onPress={() => router.push({
                                pathname: "/intent/[id]",
                                params: { id: intent.id }
                            })}
                            className={`p-6 rounded-[32px] border ${intent.status === 'Completed' ? 'border-slate-100 bg-white dark:bg-slate-900/50 dark:border-slate-800' : 'border-amber-100 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'} shadow-sm`}
                        >
                            <HStack justifyContent="space-between" alignItems="flex-start" className="mb-4">
                                <VStack space="xs" className="flex-1">
                                    <Text className="font-bold text-lg dark:text-white">{intent.title}</Text>
                                    <Text className="text-xs text-gray-500">To: {intent.receiver}</Text>
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
                                    <Text className="text-xs text-gray-500">Progress</Text>
                                    <Text className="text-xs font-bold dark:text-white">
                                        ₹{intent.settledAmount} / ₹{intent.totalAmount}
                                    </Text>
                                </HStack>
                                <Progress value={(intent.settledAmount / intent.totalAmount) * 100} className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                                    <ProgressFilledTrack className="bg-amber-500 rounded-full" />
                                </Progress>
                            </VStack>

                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack space="xs" alignItems="center">
                                    <Clock size={14} color="#64748b" />
                                    <Text className="text-xs text-gray-400">{intent.date}</Text>
                                </HStack>
                                <Button variant="link" size="sm" className="p-0">
                                    <ButtonText className="text-brand-600 text-sm font-semibold">Details</ButtonText>
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
