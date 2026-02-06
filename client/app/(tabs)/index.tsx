import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider,
  Pressable
} from '@gluestack-ui/themed';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Clock,
  Wallet,
  ChevronRight,
  Bell
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { wallet, payments, auth } from '../../services/api';

export default function DashboardScreen() {
  const router = useRouter();
  const [balanceData, setBalanceData] = useState({ balance: 0, pendingSettlements: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activeIntents, setActiveIntents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState<{ received: any[], sent: any[] }>({ received: [], sent: [] });
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balRes, historyRes, intentsRes, requestsRes, user] = await Promise.all([
        wallet.getBalance(),
        payments.getHistory(),
        payments.getIntents(),
        payments.getRequests(),
        auth.getCurrentUser()
      ]);

      setBalanceData(balRes.data);
      setRecentTransactions(historyRes.data.slice(0, 5)); // Only show top 5
      setActiveIntents(intentsRes.data);
      setPendingRequests(requestsRes.data);
      setUserData(user);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box className="px-6 py-4">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center" className="mb-6">
            <VStack>
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Welcome back,</Text>
              <Text className="text-2xl font-bold dark:text-white">{userData?.name || 'User'}</Text>
            </VStack>
            <HStack space="md" alignItems="center">
              <Pressable
                onPress={() => router.push('/notifications')}
                className="w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm"
              >
                <Bell size={20} color="#64748b" />
                <Box className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Pressable>
              <Avatar size="md">
                <AvatarFallbackText>{userData?.name || 'User'}</AvatarFallbackText>
                <AvatarImage
                  source={{ uri: userData?.avatar || 'https://avatars.githubusercontent.com/u/120265441' }}
                />
              </Avatar>
            </HStack>
          </HStack>

          {/* Balance Card */}
          <Box
            className="bg-brand-600 dark:bg-brand-700 rounded-[32px] p-7 shadow-2xl mb-8 overflow-hidden"
            style={{ elevation: 12 }}
          >
            {/* Background pattern/decoration */}
            <Box className="absolute top-[-40] right-[-40] w-40 h-40 bg-white/10 rounded-full" />
            <Box className="absolute bottom-[-20] left-[-20] w-24 h-24 bg-brand-400/20 rounded-full" />
            <VStack space="lg" className="relative z-10">
              <HStack justifyContent="space-between" alignItems="center">
                <Text className="text-brand-100 font-semibold tracking-wide uppercase text-[10px]">Total Balance</Text>
                <Box className="bg-white/20 p-2 rounded-full">
                  <Wallet color="white" size={16} />
                </Box>
              </HStack>
              <Text className="text-4xl font-extrabold text-white tracking-tight">₹ {balanceData.balance.toLocaleString()}</Text>
              <HStack space="sm" className="bg-brand-500/40 self-start px-4 py-1.5 rounded-full items-center backdrop-blur-md">
                <Clock color="#bae6fd" size={14} />
                <Text className="text-brand-50 text-[11px] font-bold">
                  Queued: ₹ {balanceData.pendingSettlements.toLocaleString()}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Quick Actions */}
          <HStack space="md" className="mb-8">
            <ActionBtn
              icon={ArrowUpRight}
              label="Send"
              color="#0ea5e9"
              bgColor="bg-sky-50 dark:bg-sky-900/10"
              onPress={() => router.push('/send')}
            />
            <ActionBtn
              icon={ArrowDownLeft}
              label="Request"
              color="#ea580c"
              bgColor="bg-orange-50 dark:bg-orange-900/10"
              onPress={() => router.push('/request')}
            />
            <ActionBtn
              icon={Plus}
              label="Top Up"
              color="#10b981"
              bgColor="bg-emerald-50 dark:bg-emerald-900/10"
              onPress={() => router.push('/topup')}
            />
            <ActionBtn
              icon={Clock}
              label="History"
              color="#8b5cf6"
              bgColor="bg-violet-50 dark:bg-violet-900/10"
              onPress={() => router.push('/history')}
            />
          </HStack>

          {/* Pending Requests Section */}
          {(pendingRequests.received.length > 0) && (
            <VStack space="md" className="mb-8">
              <Text className="text-lg font-bold dark:text-white">Pending Requests</Text>
              {pendingRequests.received.map((req: any) => (
                <Box key={req.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack space="md" alignItems="center">
                      <Avatar size="sm" className="bg-indigo-100">
                        <AvatarFallbackText>{req.requester_name}</AvatarFallbackText>
                      </Avatar>
                      <VStack>
                        <Text className="font-bold dark:text-white">{req.requester_name}</Text>
                        <Text className="text-xs text-gray-500">Requested ₹{parseFloat(req.amount).toLocaleString()}</Text>
                      </VStack>
                    </HStack>
                    <Button size="xs" className="bg-brand-600 rounded-full" onPress={() => router.push({ pathname: '/send', params: { amount: req.amount, receiver: req.requester_name } })}>
                      <ButtonText>Pay</ButtonText>
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}

          {/* Pending Auto-Settle Section */}
          <VStack space="md" className="mb-8">
            <HStack justifyContent="space-between" alignItems="center">
              <Text className="text-lg font-bold dark:text-white">Active Payment Intents</Text>
              <Pressable onPress={() => router.push('/intents')}>
                <Text className="text-indigo-600 font-semibold text-sm underline">View All</Text>
              </Pressable>
            </HStack>

            {activeIntents.length === 0 ? (
              <Box className="bg-slate-100 dark:bg-slate-800/40 rounded-2xl p-6 items-center">
                <Text className="text-slate-400 text-sm">No active payment intents</Text>
              </Box>
            ) : activeIntents.map((intent: any) => (
              <Pressable
                key={intent.id}
                onPress={() => router.push({
                  pathname: "/intent/[id]",
                  params: { id: intent.id }
                })}
              >
                <Box
                  className="bg-orange-50 dark:bg-slate-800/50 border border-orange-100 dark:border-slate-700 rounded-2xl p-4"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack space="xs">
                      <Text className="font-bold dark:text-white uppercase text-xs tracking-tight">{intent.receiver}</Text>
                      <Text className="text-xs text-gray-500">Remaining: <Text className="font-bold text-orange-600">₹ {parseFloat(intent.remaining_amount).toLocaleString()}</Text> of ₹ {parseFloat(intent.total_amount).toLocaleString()}</Text>
                    </VStack>
                    <Box className="bg-orange-100 px-3 py-1 rounded-full">
                      <Text className="text-orange-700 text-[10px] font-bold uppercase">{intent.status}</Text>
                    </Box>
                  </HStack>
                  <Box className="mt-3 bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <Box
                      className="bg-orange-500 h-full"
                      style={{ width: `${(parseFloat(intent.settled_amount) / parseFloat(intent.total_amount)) * 100}%` }}
                    />
                  </Box>
                </Box>
              </Pressable>
            ))}
          </VStack>

          {/* Recent Transactions */}
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Text className="text-lg font-bold dark:text-white">Recent Transactions</Text>
              <Pressable onPress={() => router.push('/history')}>
                <ChevronRight color="#4b5563" size={20} />
              </Pressable>
            </HStack>

            <VStack space="sm">
              {recentTransactions.length === 0 ? (
                <Box className="py-8 items-center">
                  <Text className="text-slate-400 text-sm italic">No recent transactions</Text>
                </Box>
              ) : recentTransactions.map((tx: any, index) => (
                <Pressable
                  key={tx.id}
                  onPress={() => router.push({
                    pathname: "/transaction/[id]",
                    params: { id: tx.id }
                  })}
                >
                  <HStack justifyContent="space-between" alignItems="center" className="py-2">
                    <HStack space="md" alignItems="center">
                      <Box className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-green-100' : 'bg-gray-100 dark:bg-slate-800'}`}>
                        {tx.type === 'credit' ? <Plus color="#16a34a" size={18} /> : <ArrowUpRight color="#4b5563" size={18} />}
                      </Box>
                      <VStack>
                        <Text className="font-semibold dark:text-white uppercase text-xs">{tx.receiver}</Text>
                        <Text className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</Text>
                      </VStack>
                    </HStack>
                    <VStack alignItems="flex-end">
                      <Text className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹ {parseFloat(tx.amount).toLocaleString()}
                      </Text>
                      <Text className="text-[10px] text-gray-400">{tx.status}</Text>
                    </VStack>
                  </HStack>
                  {index < recentTransactions.length - 1 && <Divider className="bg-gray-100 dark:bg-slate-800" />}
                </Pressable>
              ))}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionBtn({ icon: IconComp, label, color, bgColor, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 ${bgColor} rounded-3xl h-28 items-center justify-center shadow-sm border border-transparent active:border-brand-200`}
    >
      <VStack alignItems="center" space="xs">
        <Box className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">
          <IconComp color={color} size={24} />
        </Box>
        <Text className="text-gray-700 dark:text-slate-300 text-xs font-bold mt-1">{label}</Text>
      </VStack>
    </Pressable>
  );
}
