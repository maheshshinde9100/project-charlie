import React from 'react';
import { ScrollView, Share } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Pressable,
    Icon,
    Divider,
    Button,
    ButtonText,
    Avatar,
    AvatarFallbackText
} from '@gluestack-ui/themed';
import {
    ArrowLeft,
    Download,
    Share2,
    CheckCircle2,
    ExternalLink,
    Copy,
    Receipt
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarImage } from '@gluestack-ui/config/build/theme/AvatarImage';

import { useState, useEffect } from 'react';
import { payments } from '../../services/api';

export default function TransactionDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [tx, setTx] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchTx();
    }, [id]);

    const fetchTx = async () => {
        try {
            setLoading(true);
            const res = await payments.getTransactionDetails(id as string);
            setTx(res.data);
        } catch (err) {
            console.error("Fetch transaction error:", err);
        } finally {
            setLoading(false);
        }
    };

    const onShare = async () => {
        if (!tx) return;
        try {
            await Share.share({
                message: `Payment of ₹ ${tx.amount} to ${tx.receiver} was successful. Transaction ID: ${tx.transaction_ref || tx.id}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) return (
        <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Text className="text-slate-500">Loading receipt...</Text>
        </SafeAreaView>
    );

    if (!tx) return (
        <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Text className="text-red-500">Transaction not found</Text>
        </SafeAreaView>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-6 py-4 flex-row justify-between items-center">
                <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
                    <ArrowLeft size={20} color="#64748b" />
                </Pressable>
                <Text className="text-lg font-bold dark:text-white">Receipt</Text>
                <Pressable onPress={onShare} className="w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <Share2 size={20} color="#64748b" />
                </Pressable>
            </Box>

            <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {/* Receipt Concept Card */}
                <Box className="bg-white dark:bg-slate-800 rounded-[32px] p-8 mt-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <VStack alignItems="center" space="md">
                        <Box className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                            <CheckCircle2 size={40} color="#16a34a" />
                        </Box>
                        <VStack alignItems="center" space="xs">
                            <Text className="text-green-600 font-bold uppercase tracking-wider text-xs">Payment Successful</Text>
                            <Text className="text-4xl font-black dark:text-white">₹ {parseFloat(tx.amount).toLocaleString()}</Text>
                        </VStack>

                        <Divider className="my-4 bg-gray-100 dark:bg-slate-700" />

                        <HStack space="md" alignItems="center" className="w-full">
                            <Avatar size="md" className="bg-brand-100">
                                <AvatarFallbackText>{tx.receiver}</AvatarFallbackText>
                                <AvatarImage source={{ uri: 'https://avatars.githubusercontent.com/u/120265441' }} />
                            </Avatar>
                            <VStack className="flex-1">
                                <Text className="font-bold text-lg dark:text-white uppercase text-xs">{tx.receiver}</Text>
                                <Text className="text-xs text-gray-500">{tx.note || 'Transfer'}</Text>
                            </VStack>
                        </HStack>
                    </VStack>

                    <VStack space="lg" className="mt-8">
                        <DetailRow label="Date & Time" value={new Date(tx.created_at).toLocaleString()} />
                        <DetailRow label="Type" value={tx.type.toUpperCase()} />
                        <DetailRow label="Status" value={tx.status} />
                        <DetailRow
                            label="Transaction ID"
                            value={tx.transaction_ref || tx.id}
                            isCopyable
                            onCopy={() => { }}
                        />
                    </VStack>

                    <Box className="mt-10 bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl flex-row items-center space-x-3">
                        <Receipt size={20} color="#64748b" />
                        <Text className="text-gray-500 text-xs flex-1">This payment was processed securely. No extra fees were charged.</Text>
                    </Box>
                </Box>

                <VStack space="md" className="mt-8 mb-10">
                    <Button size="xl" className="bg-brand-600 rounded-2xl h-16 shadow-xl shadow-brand-200">
                        <Icon as={Download} size="md" className="mr-2" color="white" />
                        <ButtonText className="font-bold">Download PDF Receipt</ButtonText>
                    </Button>
                    <Button variant="outline" size="xl" className="border-gray-200 dark:border-slate-700 rounded-2xl h-16">
                        <ButtonText className="text-gray-700 dark:text-gray-200 font-bold">Report an Issue</ButtonText>
                    </Button>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailRow({ label, value, isCopyable, onCopy }: any) {
    return (
        <HStack justifyContent="space-between" alignItems="center">
            <Text className="text-gray-400 text-sm">{label}</Text>
            <HStack space="xs" alignItems="center">
                <Text className="font-semibold text-sm dark:text-white">{value}</Text>
                {isCopyable && (
                    <Pressable onPress={onCopy}>
                        <Copy size={14} color="#4f46e5" />
                    </Pressable>
                )}
            </HStack>
        </HStack>
    );
}
