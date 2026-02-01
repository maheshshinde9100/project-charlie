import React, { useState } from 'react';
import {
    Box,
    VStack,
    Text,
    Input,
    InputField,
    InputSlot,
    InputIcon,
    Button,
    ButtonText,
    HStack,
    Pressable,
    Divider
} from '@gluestack-ui/themed';
import { Mail, Lock, Eye, EyeOff, Github, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <Box className="px-8 flex-1">
                <Pressable onPress={() => router.back()} className="mt-4 w-10 h-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800">
                    <ArrowLeft size={20} color="#64748b" />
                </Pressable>

                <VStack space="md" className="mt-10 mb-10">
                    <Text className="text-3xl font-bold dark:text-white">Welcome Back</Text>
                    <Text className="text-gray-500">Sign in to continue your automated payments</Text>
                </VStack>

                <VStack space="xl">
                    <VStack space="xs">
                        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</Text>
                        <Input className="h-14 rounded-2xl bg-gray-50 border-none dark:bg-slate-800">
                            <InputSlot className="pl-4">
                                <InputIcon as={Mail} color="#64748b" />
                            </InputSlot>
                            <InputField placeholder="hello@mahesh.com" />
                        </Input>
                    </VStack>

                    <VStack space="xs">
                        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</Text>
                        <Input className="h-14 rounded-2xl bg-gray-50 border-none dark:bg-slate-800">
                            <InputSlot className="pl-4">
                                <InputIcon as={Lock} color="#64748b" />
                            </InputSlot>
                            <InputField
                                type={showPassword ? 'text' : 'password'}
                                placeholder="********"
                            />
                            <InputSlot className="pr-4" onPress={() => setShowPassword(!showPassword)}>
                                <InputIcon as={showPassword ? EyeOff : Eye} color="#64748b" />
                            </InputSlot>
                        </Input>
                        <Pressable className="self-end mt-1">
                            <Text className="text-indigo-600 font-semibold text-xs">Forgot Password?</Text>
                        </Pressable>
                    </VStack>

                    <Button
                        className="h-14 rounded-2xl bg-indigo-600 mt-4 shadow-lg shadow-indigo-100"
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <ButtonText className="font-bold">Log In</ButtonText>
                    </Button>

                    <HStack alignItems="center" space="md" className="mt-4">
                        <Divider className="flex-1 bg-gray-100" />
                        <Text className="text-gray-400 text-xs font-medium">OR CONTINUE WITH</Text>
                        <Divider className="flex-1 bg-gray-100" />
                    </HStack>

                    <HStack space="md">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl border-gray-200 dark:border-slate-700">
                            <Box className="flex-row items-center space-x-2">
                                <Github size={20} color="#000" />
                                <ButtonText className="text-gray-700 dark:text-gray-200">Github</ButtonText>
                            </Box>
                        </Button>
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl border-gray-200 dark:border-slate-700">
                            <Box className="flex-row items-center space-x-2">
                                <Text className="font-bold text-lg">G</Text>
                                <ButtonText className="text-gray-700 dark:text-gray-200">Google</ButtonText>
                            </Box>
                        </Button>
                    </HStack>
                </VStack>

                <Box className="flex-1 justify-end pb-8">
                    <HStack justifyContent="center" alignItems="center" space="xs">
                        <Text className="text-gray-500 text-sm">Don't have an account?</Text>
                        <Pressable onPress={() => router.push('/register')}>
                            <Text className="text-indigo-600 font-bold text-sm">Register</Text>
                        </Pressable>
                    </HStack>
                </Box>
            </Box>
        </SafeAreaView>
    );
}
