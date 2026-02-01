import React from 'react';
import { ImageBackground, Dimensions } from 'react-native';
import {
    Box,
    VStack,
    Text,
    Button,
    ButtonText,
    HStack,
    Icon
} from '@gluestack-ui/themed';
import { ArrowRight, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <Box className="flex-1 bg-slate-50 dark:bg-slate-950">
            <VStack className="flex-1">
                {/* Top Visual Section */}
                <Box
                    className="h-[55%] w-full bg-slate-900 dark:bg-brand-950 rounded-b-[48px] items-center justify-center overflow-hidden"
                >
                    {/* Subtle background decoration */}
                    <Box className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-brand-500 rounded-full opacity-20" />
                    <Box className="absolute bottom-[-100px] right-[-50px] w-80 h-80 bg-brand-400 rounded-full opacity-10" />

                    <VStack space="md" alignItems="center">
                        <Box className="bg-white/10 p-6 rounded-[32px] backdrop-blur-xl border border-white/10">
                            <Zap size={60} color="#0ea5e9" fill="#0ea5e9" />
                        </Box>
                        <Text className="text-white text-4xl font-black mt-4 tracking-tighter">AutoPay</Text>
                        <Text className="text-brand-300 text-lg font-bold opacity-90 uppercase tracking-[4px] text-[10px]">Financial Intelligence</Text>
                    </VStack>
                </Box>

                {/* Text Content Section */}
                <VStack className="flex-1 px-8 pt-10 pb-12 justify-between">
                    <VStack space="sm">
                        <Text className="text-3xl font-bold dark:text-white leading-tight">
                            Never miss a payment due to low balance.
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Our unique Auto-Trigger system queues your payments and settles them automatically as soon as funds arrive. Experience the next level of fintech automation.
                        </Text>
                    </VStack>

                    <VStack space="md">
                        <Button
                            size="xl"
                            className="bg-brand-600 h-16 rounded-2xl shadow-xl shadow-brand-200"
                            onPress={() => router.push('/register')}
                        >
                            <ButtonText className="font-bold text-lg">Initialize Setup</ButtonText>
                            <Icon as={ArrowRight} className="ml-2" color="white" />
                        </Button>

                        <HStack justifyContent="center" alignItems="center" space="xs">
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">Already have an account?</Text>
                            <Button variant="link" onPress={() => router.push('/login')}>
                                <ButtonText className="text-brand-600 font-bold text-sm uppercase">Enter Account</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
}
