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
    Checkbox,
    CheckboxIndicator,
    CheckboxIcon,
    CheckIcon,
    CheckboxLabel
} from '@gluestack-ui/themed';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Box className="px-8 flex-1">
                <Pressable onPress={() => router.back()} className="mt-4 w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
                    <ArrowLeft size={20} color="#64748b" />
                </Pressable>

                <VStack space="md" className="mt-8 mb-8">
                    <Text className="text-3xl font-bold dark:text-white">Create Account</Text>
                    <Text className="text-gray-500">Join thousands of users automating their wallet</Text>
                </VStack>

                <VStack space="lg" className="flex-1">
                    <VStack space="xs">
                        <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</Text>
                        <Input className="h-16 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:border-brand-500">
                            <InputSlot className="pl-4">
                                <InputIcon as={User} color="#64748b" />
                            </InputSlot>
                            <InputField placeholder="Mahesh Shinde" />
                        </Input>
                    </VStack>

                    <VStack space="xs">
                        <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</Text>
                        <Input className="h-16 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:border-brand-500">
                            <InputSlot className="pl-4">
                                <InputIcon as={Mail} color="#64748b" />
                            </InputSlot>
                            <InputField placeholder="hello@mahesh.com" />
                        </Input>
                    </VStack>

                    <VStack space="xs">
                        <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</Text>
                        <Input className="h-16 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:border-brand-500">
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
                    </VStack>

                    <Box className="mt-2">
                        <Checkbox aria-label="Terms and Conditions" value="terms">
                            <CheckboxIndicator className="rounded-md border-gray-200">
                                <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                            <CheckboxLabel className="text-xs text-gray-500 ml-2">
                                I agree to the <Text className="text-brand-600 font-bold text-xs uppercase">Terms of Service</Text> and <Text className="text-brand-600 font-bold text-xs uppercase">Privacy Policy</Text>
                            </CheckboxLabel>
                        </Checkbox>
                    </Box>

                    <Button
                        className="h-16 rounded-2xl bg-brand-600 mt-6 shadow-xl shadow-brand-200"
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <ButtonText className="font-bold">Register Now</ButtonText>
                    </Button>

                    <HStack justifyContent="center" alignItems="center" space="xs" className="mt-2">
                        <Text className="text-gray-500 text-sm">Already have an account?</Text>
                        <Pressable onPress={() => router.push('/login')}>
                            <Text className="text-brand-600 font-bold text-sm">Log In</Text>
                        </Pressable>
                    </HStack>
                </VStack>
            </Box>
        </SafeAreaView>
    );
}
