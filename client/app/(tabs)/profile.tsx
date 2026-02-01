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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Box className="px-6 py-8 items-center">
                    <Avatar size="xl" className="mb-4 bg-indigo-100">
                        <AvatarFallbackText>Mahesh Shinde</AvatarFallbackText>
                        <AvatarImage
                            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }}
                        />
                    </Avatar>
                    <Text className="text-2xl font-bold dark:text-white">Mahesh Shinde</Text>
                    <Text className="text-gray-500 text-sm italic">Premium Wallet Member</Text>

                    <HStack className="mt-6 bg-indigo-600 rounded-2xl p-4 w-full shadow-lg" justifyContent="space-around">
                        <VStack alignItems="center">
                            <Text className="text-white font-bold text-lg">152</Text>
                            <Text className="text-indigo-200 text-[10px] uppercase">Payments</Text>
                        </VStack>
                        <Divider orientation="vertical" className="bg-indigo-400 h-8" />
                        <VStack alignItems="center">
                            <Text className="text-white font-bold text-lg">₹45k</Text>
                            <Text className="text-indigo-200 text-[10px] uppercase">Spent</Text>
                        </VStack>
                        <Divider orientation="vertical" className="bg-indigo-400 h-8" />
                        <VStack alignItems="center">
                            <Text className="text-white font-bold text-lg">12</Text>
                            <Text className="text-indigo-200 text-[10px] uppercase">Pending</Text>
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
                            <ProfileItem icon={Bell} label="Notifications" />
                            <Divider className="bg-gray-100 dark:bg-slate-700 mx-4" />
                            <ProfileItem icon={CircleHelp} label="Help & Support" />
                        </VStack>

                        <Pressable className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-4 items-center flex-row justify-center space-x-2 mt-4">
                            <LogOut size={20} color="#ef4444" />
                            <Text className="text-red-600 font-bold">Logout</Text>
                        </Pressable>
                    </VStack>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}

function ProfileItem({ icon: IconComponent, label }: any) {
    return (
        <Pressable>
            <HStack justifyContent="space-between" alignItems="center" className="px-5 py-4">
                <HStack space="md" alignItems="center">
                    <Box className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
                        <IconComponent size={20} color="#4f46e5" />
                    </Box>
                    <Text className="font-semibold dark:text-white">{label}</Text>
                </HStack>
                <ChevronRight size={18} color="#9ca3af" />
            </HStack>
        </Pressable>
    );
}
