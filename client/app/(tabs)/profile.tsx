import React from 'react';
import { ScrollView, Switch } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    Divider,
    Pressable,
    Icon
} from '@gluestack-ui/themed';
import {
    User,
    Settings,
    ShieldCheck,
    Bell,
    CircleHelp,
    LogOut,
    ChevronRight,
    Wallet,
    CreditCard
} from 'lucide-react-native';
import { auth } from '../../services/api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await auth.getCurrentUser();
        if (userData) setUser(userData);
    };

    const handleLogout = async () => {
        await auth.logout();
        router.replace('/welcome');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Box className="px-6 py-8 items-center">
                    <Avatar size="xl" className="mb-4 bg-brand-100">
                        <AvatarFallbackText>{user?.name || 'User'}</AvatarFallbackText>
                        <AvatarImage
                            source={{ uri: user?.avatar || 'https://avatars.githubusercontent.com/u/120265441' }}
                        />
                    </Avatar>
                    <Text className="text-2xl font-black dark:text-white">{user?.name || 'Loading...'}</Text>
                    <Text className="text-gray-500 font-medium mb-1">{user?.email || '...'}</Text>
                    <Box className="bg-brand-100 dark:bg-brand-900/30 px-3 py-1 rounded-full mt-1">
                        <Text className="text-brand-700 dark:text-brand-300 text-[10px] font-bold uppercase tracking-widest">Premium Member</Text>
                    </Box>

                    <HStack className="mt-8 bg-brand-600 dark:bg-brand-700 rounded-[32px] p-6 w-full shadow-2xl relative overflow-hidden" justifyContent="space-around">
                        <Box className="absolute top-[-20] right-[-20] w-32 h-32 bg-white/5 rounded-full" />
                        <VStack alignItems="center">
                            <Text className="text-white font-black text-xl">152</Text>
                            <Text className="text-brand-100 text-[9px] font-bold uppercase tracking-tighter">Payments</Text>
                        </VStack>
                        <Divider orientation="vertical" className="bg-white/20 h-10" />
                        <VStack alignItems="center">
                            <Text className="text-white font-black text-xl">₹45k</Text>
                            <Text className="text-brand-100 text-[9px] font-bold uppercase tracking-tighter">Spent</Text>
                        </VStack>
                        <Divider orientation="vertical" className="bg-white/20 h-10" />
                        <VStack alignItems="center">
                            <Text className="text-white font-black text-xl">12</Text>
                            <Text className="text-brand-100 text-[9px] font-bold uppercase tracking-tighter">Pending</Text>
                        </VStack>
                    </HStack>
                </Box>

                <Box className="px-6 mb-10">
                    <VStack space="lg">
                        <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Wallet Settings</Text>
                        <VStack className="bg-gray-50 dark:bg-slate-800 rounded-3xl overflow-hidden">
                            <ProfileItem icon={Wallet} label="Manage Wallet" />
                            <Divider className="bg-gray-100 dark:bg-slate-700 mx-4" />
                            <ProfileItem icon={CreditCard} label="Linked Bank Accounts" />
                            <Divider className="bg-gray-100 dark:bg-slate-700 mx-4" />
                            <HStack justifyContent="space-between" alignItems="center" className="px-5 py-4">
                                <HStack space="md" alignItems="center">
                                    <Box className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
                                        <ShieldCheck size={20} color="#4f46e5" />
                                    </Box>
                                    <Text className="font-semibold dark:text-white">Auto-Settlement Enabled</Text>
                                </HStack>
                                <Switch
                                    trackColor={{ false: "#d1d5db", true: "#4f46e5" }}
                                    thumbColor="white"
                                    value={true}
                                />
                            </HStack>
                        </VStack>

                        <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1 mt-4">Security & Support</Text>
                        <VStack className="bg-gray-50 dark:bg-slate-800 rounded-3xl overflow-hidden">
                            <ProfileItem icon={Settings} label="Account Settings" />
                            <Divider className="bg-gray-100 dark:bg-slate-700 mx-4" />
                            <ProfileItem icon={Bell} label="Notifications" onPress={() => router.push('/notifications')} />
                            <Divider className="bg-gray-100 dark:bg-slate-700 mx-4" />
                            <ProfileItem icon={CircleHelp} label="Help & Support" />
                        </VStack>

                        <Pressable
                            onPress={handleLogout}
                            className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-4 items-center flex-row justify-center space-x-2 mt-4"
                        >
                            <LogOut size={20} color="#ef4444" />
                            <Text className="text-red-600 font-bold">Logout</Text>
                        </Pressable>
                    </VStack>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}

function ProfileItem({ icon: IconComponent, label, onPress }: any) {
    return (
        <Pressable onPress={onPress}>
            <HStack justifyContent="space-between" alignItems="center" className="px-5 py-4">
                <HStack space="md" alignItems="center">
                    <Box className="bg-brand-50 dark:bg-brand-900/20 p-2.5 rounded-2xl shadow-sm">
                        <IconComponent size={20} color="#0ea5e9" />
                    </Box>
                    <Text className="font-bold text-[15px] dark:text-slate-200">{label}</Text>
                </HStack>
                <ChevronRight size={18} color="#9ca3af" />
            </HStack>
        </Pressable>
    );
}
