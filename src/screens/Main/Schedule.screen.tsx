import React, { FC, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import { useAuth } from '../../context/AuthContext';

type ScheduleNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Schedule'>;

interface ScheduleEvent {
    id: string;
    title: string;
    type: 'interview' | 'deadline' | 'meeting' | 'class';
    date: string;
    time: string;
    duration: string;
    description: string;
    location?: string;
    isOnline?: boolean;
}

const mockEvents: ScheduleEvent[] = [
    {
        id: '1',
        title: 'Technical Interview - Google',
        type: 'interview',
        date: '2024-01-25',
        time: '10:00 AM',
        duration: '1 hour',
        description: 'Technical interview for Software Development Intern position',
        isOnline: true
    },
    {
        id: '2',
        title: 'Project Submission Deadline',
        type: 'deadline',
        date: '2024-01-26',
        time: '11:59 PM',
        duration: '',
        description: 'Final project submission for Data Structures course'
    },
    {
        id: '3',
        title: 'Mentor Meeting',
        type: 'meeting',
        date: '2024-01-27',
        time: '2:00 PM',
        duration: '30 mins',
        description: 'Weekly progress review with Prof. Rajesh Kumar',
        location: 'Room 301, CS Department'
    },
    {
        id: '4',
        title: 'Algorithm Design Class',
        type: 'class',
        date: '2024-01-28',
        time: '9:00 AM',
        duration: '2 hours',
        description: 'Advanced Algorithm Design and Analysis',
        location: 'Lecture Hall 2'
    },
    {
        id: '5',
        title: 'HR Interview - Microsoft',
        type: 'interview',
        date: '2024-01-29',
        time: '3:00 PM',
        duration: '45 mins',
        description: 'HR round for Data Science Intern position',
        isOnline: true
    }
];

export const Schedule: FC = () => {
    const navigation = useNavigation<ScheduleNavigationProp>();
    const { user } = useAuth();
    const [events, setEvents] = useState<ScheduleEvent[]>(mockEvents);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const getEventTypeColor = (type: ScheduleEvent['type']) => {
        switch (type) {
            case 'interview': return '#8b5cf6';
            case 'deadline': return '#ef4444';
            case 'meeting': return '#10b981';
            case 'class': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const getEventTypeIcon = (type: ScheduleEvent['type']) => {
        switch (type) {
            case 'interview': return 'users';
            case 'deadline': return 'exclamation-triangle';
            case 'meeting': return 'handshake-o';
            case 'class': return 'book';
            default: return 'calendar';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const handleAddEvent = () => {
        Alert.alert(
            'Add Event',
            'What type of event would you like to add?',
            [
                { text: 'Interview', onPress: () => Alert.alert('Success', 'Interview added to schedule!') },
                { text: 'Meeting', onPress: () => Alert.alert('Success', 'Meeting added to schedule!') },
                { text: 'Deadline', onPress: () => Alert.alert('Success', 'Deadline added to schedule!') },
                { text: 'Class', onPress: () => Alert.alert('Success', 'Class added to schedule!') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const EventCard = ({ event }: { event: ScheduleEvent }) => (
        <TouchableOpacity style={styles.eventCard} activeOpacity={0.7}>
            <View style={styles.eventHeader}>
                <View style={[styles.eventTypeIndicator, { backgroundColor: getEventTypeColor(event.type) }]}>
                    <Icon name={getEventTypeIcon(event.type)} size={16} color="#fff" />
                </View>
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
                <Text style={styles.eventTime}>{event.time}</Text>
            </View>

            <View style={styles.eventDetails}>
                {event.duration && (
                    <View style={styles.eventDetailItem}>
                        <Icon name="clock-o" size={12} color="#64748b" />
                        <Text style={styles.eventDetailText}>{event.duration}</Text>
                    </View>
                )}
                {event.location && (
                    <View style={styles.eventDetailItem}>
                        <Icon name="map-marker" size={12} color="#64748b" />
                        <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
                )}
                {event.isOnline && (
                    <View style={styles.eventDetailItem}>
                        <Icon name="video-camera" size={12} color="#64748b" />
                        <Text style={styles.eventDetailText}>Online</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    // Group events by date
    const groupedEvents = events.reduce((groups, event) => {
        const date = event.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {} as Record<string, ScheduleEvent[]>);

    const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
    const todayEvents = events.filter(event => event.date === new Date().toISOString().split('T')[0]);

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
                <Text style={styles.title}>My Schedule</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddEvent}
                >
                    <Icon name="plus" size={20} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{todayEvents.length}</Text>
                    <Text style={styles.statLabel}>Today</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
                    <Text style={styles.statLabel}>Upcoming</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{events.filter(e => e.type === 'interview').length}</Text>
                    <Text style={styles.statLabel}>Interviews</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{events.filter(e => e.type === 'deadline').length}</Text>
                    <Text style={styles.statLabel}>Deadlines</Text>
                </View>
            </View>

            {/* Events List */}
            <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
                {Object.entries(groupedEvents)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .map(([date, dateEvents]) => (
                        <View key={date} style={styles.dateGroup}>
                            <Text style={styles.dateHeader}>{formatDate(date)}</Text>
                            {dateEvents
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                        </View>
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
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
    },
    addButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    eventsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    dateGroup: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    eventTypeIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
        marginRight: 12,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    eventDescription: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    eventTime: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3b82f6',
    },
    eventDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    eventDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    eventDetailText: {
        fontSize: 12,
        color: '#64748b',
    },
    bottomPadding: {
        height: 20,
    },
});
