import React, { FC, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

interface Student {
    id: string;
    name: string;
    email: string;
    college: string;
    course: string;
    year: string;
    profilePicture?: string;
    internship: {
        title: string;
        company: string;
        startDate: string;
        duration: string;
        progress: number;
    };
    performance: {
        attendance: number;
        tasksCompleted: number;
        totalTasks: number;
        rating: number;
    };
    lastActivity: string;
    status: 'active' | 'pending_review' | 'completed';
}

// Mock data for demonstration
const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@college.edu',
        college: 'IIT Delhi',
        course: 'Computer Science',
        year: '3rd Year',
        internship: {
            title: 'Frontend Developer Intern',
            company: 'TechStart Solutions',
            startDate: '2024-01-15',
            duration: '3 months',
            progress: 75
        },
        performance: {
            attendance: 95,
            tasksCompleted: 12,
            totalTasks: 15,
            rating: 4.5
        },
        lastActivity: '2 hours ago',
        status: 'active'
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@college.edu',
        college: 'BITS Pilani',
        course: 'Information Technology',
        year: '4th Year',
        internship: {
            title: 'Data Science Intern',
            company: 'DataCorp Analytics',
            startDate: '2024-02-01',
            duration: '6 months',
            progress: 60
        },
        performance: {
            attendance: 88,
            tasksCompleted: 8,
            totalTasks: 12,
            rating: 4.2
        },
        lastActivity: '1 day ago',
        status: 'pending_review'
    },
    {
        id: '3',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@college.edu',
        college: 'NIT Trichy',
        course: 'Electronics Engineering',
        year: '3rd Year',
        internship: {
            title: 'Mobile App Developer',
            company: 'AppVenture Inc',
            startDate: '2023-11-15',
            duration: '4 months',
            progress: 100
        },
        performance: {
            attendance: 92,
            tasksCompleted: 20,
            totalTasks: 20,
            rating: 4.8
        },
        lastActivity: '1 week ago',
        status: 'completed'
    }
];

export const MentorDashboard: FC = () => {
    const { user, logout } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStudents(mockStudents);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadStudents().finally(() => setRefreshing(false));
    };

    const getStatusColor = (status: Student['status']) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'pending_review': return '#f59e0b';
            case 'completed': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status: Student['status']) => {
        switch (status) {
            case 'active': return 'Active';
            case 'pending_review': return 'Needs Review';
            case 'completed': return 'Completed';
            default: return 'Unknown';
        }
    };

    const StudentCard = ({ student }: { student: Student }) => (
        <TouchableOpacity style={styles.studentCard} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.studentInfo}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </View>
                    <View style={styles.basicInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentDetails}>
                            {student.course} • {student.year}
                        </Text>
                        <Text style={styles.college}>{student.college}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(student.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(student.status) }]}>
                        {getStatusText(student.status)}
                    </Text>
                </View>
            </View>

            <View style={styles.internshipInfo}>
                <Text style={styles.internshipTitle}>{student.internship.title}</Text>
                <Text style={styles.companyName}>{student.internship.company}</Text>
                <View style={styles.internshipDetails}>
                    <Text style={styles.detailText}>
                        Started: {new Date(student.internship.startDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.detailText}>Duration: {student.internship.duration}</Text>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPercentage}>{student.internship.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${student.internship.progress}%` }
                        ]}
                    />
                </View>
            </View>

            <View style={styles.performanceMetrics}>
                <View style={styles.metric}>
                    <Icon name="calendar-check-o" size={16} color="#10b981" />
                    <Text style={styles.metricValue}>{student.performance.attendance}%</Text>
                    <Text style={styles.metricLabel}>Attendance</Text>
                </View>
                <View style={styles.metric}>
                    <Icon name="check-square-o" size={16} color="#3b82f6" />
                    <Text style={styles.metricValue}>
                        {student.performance.tasksCompleted}/{student.performance.totalTasks}
                    </Text>
                    <Text style={styles.metricLabel}>Tasks</Text>
                </View>
                <View style={styles.metric}>
                    <Icon name="star" size={16} color="#f59e0b" />
                    <Text style={styles.metricValue}>{student.performance.rating}</Text>
                    <Text style={styles.metricLabel}>Rating</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.lastActivity}>Last active: {student.lastActivity}</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="comments-o" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="bar-chart" size={16} color="#10b981" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="ellipsis-v" size={16} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const activeStudents = students.filter(s => s.status === 'active').length;
    const pendingReviews = students.filter(s => s.status === 'pending_review').length;
    const completedInternships = students.filter(s => s.status === 'completed').length;
    const averageRating = students.length > 0
        ? (students.reduce((sum, s) => sum + s.performance.rating, 0) / students.length).toFixed(1)
        : '0.0';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>Prof. {user?.firstName}! 👨‍🏫</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={logout}>
                    <Icon name="user-circle" size={32} color="#10b981" />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}


                >
                    <View style={styles.statCard}>
                        <Icon name="users" size={24} color="#10b981" />
                        <Text style={styles.statNumber}>{activeStudents}</Text>
                        <Text style={styles.statLabel}>Active Students</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="clock-o" size={24} color="#f59e0b" />
                        <Text style={styles.statNumber}>{pendingReviews}</Text>
                        <Text style={styles.statLabel}>Pending Reviews</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="check-circle" size={24} color="#6b7280" />
                        <Text style={styles.statNumber}>{completedInternships}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="star" size={24} color="#f59e0b" />
                        <Text style={styles.statNumber}>{averageRating}</Text>
                        <Text style={styles.statLabel}>Avg Rating</Text>
                    </View>
                </ScrollView>
            </View>

            {/* Students List */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Students</Text>
                <TouchableOpacity>
                    <Icon name="filter" size={24} color="#10b981" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.studentsList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text style={styles.loadingText}>Loading students...</Text>
                    </View>
                ) : (
                    students.map((student) => (
                        <StudentCard key={student.id} student={student} />
                    ))
                )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    welcomeText: {
        fontSize: 16,
        color: '#64748b',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 4,
    },
    profileButton: {
        padding: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginRight: 8,
        marginLeft: 8,
        marginVertical: 4,
        alignItems: 'center',
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
    },
    studentsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    studentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    basicInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    studentDetails: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    college: {
        fontSize: 12,
        color: '#9ca3af',
    },
    statusBadge: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    internshipInfo: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    internshipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    internshipDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    progressSection: {
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10b981',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 4,
    },
    performanceMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    metric: {
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginTop: 4,
    },
    metricLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastActivity: {
        fontSize: 12,
        color: '#9ca3af',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 12,
    },
    bottomPadding: {
        height: 20,
    },
});
