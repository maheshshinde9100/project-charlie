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
        <Box className="flex-1 bg-white dark:bg-slate-900">
            <VStack className="flex-1">
                {/* Top Visual Section */}
                <Box
                    className="h-[55%] w-full bg-indigo-600 rounded-b-[40px] items-center justify-center overflow-hidden"
                >
                    {/* Subtle background decoration */}
                    <Box className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-indigo-500 rounded-full opacity-50" />
                    <Box className="absolute bottom-[-100px] right-[-50px] w-80 h-80 bg-indigo-400 rounded-full opacity-30" />

                    <VStack space="md" alignItems="center">
                        <Box className="bg-white/20 p-6 rounded-[30px] backdrop-blur-md">
                            <Zap size={60} color="white" fill="white" />
                        </Box>
                        <Text className="text-white text-4xl font-black mt-4 tracking-tighter">AutoPay</Text>
                        <Text className="text-indigo-100 text-lg font-medium opacity-80">Smart. Seamless. Automated.</Text>
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
                            className="bg-indigo-600 h-16 rounded-2xl shadow-indigo-200"
                            onPress={() => router.push('/register')}
                        >
                            <ButtonText className="font-bold text-lg">Get Started</ButtonText>
                            <Icon as={ArrowRight} className="ml-2" color="white" />
                        </Button>

                        <HStack justifyContent="center" alignItems="center" space="xs">
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">Already have an account?</Text>
                            <Button variant="link" onPress={() => router.push('/login')}>
                                <ButtonText className="text-indigo-600 font-bold text-sm">Log In</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
}
