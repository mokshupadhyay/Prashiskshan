import React, { FC } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type MessagesNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Messages'>;

interface Message {
    id: string;
    senderName: string;
    senderRole: 'recruiter' | 'mentor' | 'student';
    message: string;
    timestamp: string;
    isRead: boolean;
    avatar?: string;
}

const mockMessages: Message[] = [
    {
        id: '1',
        senderName: 'Sarah Johnson',
        senderRole: 'recruiter',
        message: 'Hi! I reviewed your application for the Frontend Developer position. Would you be available for an interview next week?',
        timestamp: '2 hours ago',
        isRead: false
    },
    {
        id: '2',
        senderName: 'Prof. Rajesh Kumar',
        senderRole: 'mentor',
        message: 'Great work on your project submission! I\'ve awarded you the academic credits. Keep up the excellent work.',
        timestamp: '1 day ago',
        isRead: true
    },
    {
        id: '3',
        senderName: 'TechStart Solutions',
        senderRole: 'recruiter',
        message: 'Congratulations! You have been selected for the internship. Please check your email for next steps.',
        timestamp: '2 days ago',
        isRead: false
    },
    {
        id: '4',
        senderName: 'Dr. Priya Sharma',
        senderRole: 'mentor',
        message: 'Please submit your weekly progress report by Friday. Let me know if you need any assistance.',
        timestamp: '3 days ago',
        isRead: true
    }
];

export const Messages: FC = () => {
    const navigation = useNavigation<MessagesNavigationProp>();

    const getRoleIcon = (role: 'recruiter' | 'mentor' | 'student') => {
        switch (role) {
            case 'recruiter': return 'briefcase';
            case 'mentor': return 'graduation-cap';
            case 'student': return 'user';
            default: return 'user';
        }
    };

    const getRoleColor = (role: 'recruiter' | 'mentor' | 'student') => {
        switch (role) {
            case 'recruiter': return '#8b5cf6';
            case 'mentor': return '#10b981';
            case 'student': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const MessageCard = ({ message }: { message: Message }) => (
        <TouchableOpacity style={[styles.messageCard, !message.isRead && styles.unreadMessage]} activeOpacity={0.7}>
            <View style={styles.messageHeader}>
                <View style={styles.senderInfo}>
                    <View style={[styles.avatarContainer, { backgroundColor: `${getRoleColor(message.senderRole)}15` }]}>
                        <Icon name={getRoleIcon(message.senderRole)} size={20} color={getRoleColor(message.senderRole)} />
                    </View>
                    <View style={styles.senderDetails}>
                        <Text style={styles.senderName}>{message.senderName}</Text>
                        <Text style={styles.senderRole}>
                            {message.senderRole.charAt(0).toUpperCase() + message.senderRole.slice(1)}
                        </Text>
                    </View>
                </View>
                <View style={styles.messageTime}>
                    <Text style={styles.timestamp}>{message.timestamp}</Text>
                    {!message.isRead && <View style={styles.unreadDot} />}
                </View>
            </View>
            <Text style={styles.messageText} numberOfLines={2}>
                {message.message}
            </Text>
        </TouchableOpacity>
    );

    const unreadCount = mockMessages.filter(msg => !msg.isRead).length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#1e293b" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>Messages</Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.composeButton}>
                    <Icon name="edit" size={20} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionButton}>
                    <Icon name="inbox" size={16} color="#3b82f6" />
                    <Text style={styles.quickActionText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                    <Icon name="circle" size={12} color="#ef4444" />
                    <Text style={styles.quickActionText}>Unread ({unreadCount})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                    <Icon name="star-o" size={16} color="#f59e0b" />
                    <Text style={styles.quickActionText}>Important</Text>
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
                {mockMessages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                ))}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        padding: 8,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
    },
    unreadBadge: {
        backgroundColor: '#ef4444',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    unreadBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    composeButton: {
        padding: 8,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        gap: 16,
    },
    quickActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        gap: 6,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
    },
    messagesList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    messageCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    unreadMessage: {
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    senderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    senderDetails: {
        flex: 1,
    },
    senderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    senderRole: {
        fontSize: 12,
        color: '#64748b',
        textTransform: 'capitalize',
    },
    messageTime: {
        alignItems: 'flex-end',
    },
    timestamp: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 4,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
    },
    messageText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    bottomPadding: {
        height: 20,
    },
});
