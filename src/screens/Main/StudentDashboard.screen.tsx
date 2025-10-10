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

interface InternshipMatch {
    id: string;
    title: string;
    company: string;
    location: string;
    duration: string;
    stipend: string;
    matchScore: number;
    skills: string[];
    description: string;
    postedDate: string;
    applicants: number;
    type: 'remote' | 'onsite' | 'hybrid';
}

// Mock data for demonstration
const mockInternships: InternshipMatch[] = [
    {
        id: '1',
        title: 'Frontend Developer Intern',
        company: 'TechStart Solutions',
        location: 'Mumbai, India',
        duration: '3 months',
        stipend: '₹15,000/month',
        matchScore: 95,
        skills: ['React', 'JavaScript', 'HTML/CSS'],
        description: 'Work on cutting-edge web applications using modern React framework...',
        postedDate: '2 days ago',
        applicants: 23,
        type: 'hybrid'
    },
    {
        id: '2',
        title: 'Data Science Intern',
        company: 'DataCorp Analytics',
        location: 'Bangalore, India',
        duration: '6 months',
        stipend: '₹20,000/month',
        matchScore: 88,
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
        description: 'Analyze large datasets and build predictive models...',
        postedDate: '1 week ago',
        applicants: 45,
        type: 'onsite'
    },
    {
        id: '3',
        title: 'UI/UX Design Intern',
        company: 'Creative Minds Studio',
        location: 'Delhi, India',
        duration: '4 months',
        stipend: '₹12,000/month',
        matchScore: 82,
        skills: ['UI/UX Design', 'Figma', 'User Research'],
        description: 'Design intuitive user interfaces for mobile and web applications...',
        postedDate: '3 days ago',
        applicants: 18,
        type: 'remote'
    },
    {
        id: '4',
        title: 'Mobile App Developer',
        company: 'AppVenture Inc',
        location: 'Pune, India',
        duration: '5 months',
        stipend: '₹18,000/month',
        matchScore: 79,
        skills: ['React Native', 'JavaScript', 'Mobile Development'],
        description: 'Develop cross-platform mobile applications...',
        postedDate: '5 days ago',
        applicants: 31,
        type: 'hybrid'
    }
];

export const StudentDashboard: FC = () => {
    const { user, logout } = useAuth();
    const [internships, setInternships] = useState<InternshipMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [aiMatching, setAiMatching] = useState(false);

    useEffect(() => {
        loadInternships();
    }, []);

    const loadInternships = async (showAiAnimation = true) => {
        if (showAiAnimation) {
            setAiMatching(true);
            // Show AI matching animation
            await new Promise(resolve => setTimeout(resolve, 2000));
            setAiMatching(false);
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setInternships(mockInternships);
        } catch (error) {
            console.error('Error loading internships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadInternships(false).finally(() => setRefreshing(false));
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 90) return '#10b981';
        if (score >= 80) return '#f59e0b';
        if (score >= 70) return '#ef4444';
        return '#6b7280';
    };

    const getTypeIcon = (type: 'remote' | 'onsite' | 'hybrid') => {
        switch (type) {
            case 'remote': return 'home';
            case 'onsite': return 'map-marker';
            case 'hybrid': return 'briefcase';
            default: return 'briefcase';
        }
    };

    const InternshipCard = ({ internship }: { internship: InternshipMatch }) => (
        <TouchableOpacity style={styles.internshipCard} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.companyInfo}>
                    <Text style={styles.internshipTitle}>{internship.title}</Text>
                    <Text style={styles.companyName}>{internship.company}</Text>
                </View>
                <View style={[styles.matchScore, { backgroundColor: `${getMatchScoreColor(internship.matchScore)}15` }]}>
                    <Text style={[styles.matchScoreText, { color: getMatchScoreColor(internship.matchScore) }]}>
                        {internship.matchScore}% Match
                    </Text>
                </View>
            </View>

            <View style={styles.internshipDetails}>
                <View style={styles.detailRow}>
                    <Icon name={getTypeIcon(internship.type)} size={16} color="#64748b" />
                    <Text style={styles.detailText}>{internship.location}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="clock-o" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{internship.duration}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="money" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{internship.stipend}</Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {internship.description}
            </Text>

            <View style={styles.skillsContainer}>
                {internship.skills.slice(0, 3).map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                    </View>
                ))}
                {internship.skills.length > 3 && (
                    <Text style={styles.moreSkills}>+{internship.skills.length - 3} more</Text>
                )}
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.postedDate}>{internship.postedDate}</Text>
                <View style={styles.applicantsInfo}>
                    <Icon name="users" size={14} color="#64748b" />
                    <Text style={styles.applicantsText}>{internship.applicants} applicants</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
                <Icon name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const AIMatchingLoader = () => (
        <View style={styles.aiMatchingContainer}>
            <View style={styles.aiMatchingContent}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.aiMatchingTitle}>AI Matching in Progress</Text>
                <Text style={styles.aiMatchingSubtitle}>
                    Finding the perfect internships based on your skills and preferences...
                </Text>
                <View style={styles.matchingSteps}>
                    <Text style={styles.matchingStep}>🔍 Analyzing your profile</Text>
                    <Text style={styles.matchingStep}>🎯 Matching with opportunities</Text>
                    <Text style={styles.matchingStep}>📊 Calculating compatibility scores</Text>
                </View>
            </View>
        </View>
    );

    if (aiMatching) {
        return <AIMatchingLoader />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.firstName}! 👋</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={logout}>
                    <Icon name="user-circle" size={32} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}


                >
                    <View style={styles.statCard}>
                        <Icon name="briefcase" size={24} color="#3b82f6" />
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Applications</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="clock-o" size={24} color="#10b981" />
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Interviews</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="star" size={24} color="#f59e0b" />
                        <Text style={styles.statNumber}>8.5</Text>
                        <Text style={styles.statLabel}>Profile Score</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="line-chart" size={24} color="#8b5cf6" />
                        <Text style={styles.statNumber}>95%</Text>
                        <Text style={styles.statLabel}>Match Rate</Text>
                    </View>
                </ScrollView>
            </View>

            {/* Recommended Internships */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended for You</Text>
                <TouchableOpacity onPress={() => loadInternships(true)}>
                    <Icon name="refresh" size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.internshipsList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text style={styles.loadingText}>Loading internships...</Text>
                    </View>
                ) : (
                    internships.map((internship) => (
                        <InternshipCard key={internship.id} internship={internship} />
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
    internshipsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    internshipCard: {
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
        marginBottom: 12,
    },
    companyInfo: {
        flex: 1,
    },
    internshipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
        color: '#64748b',
    },
    matchScore: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    matchScoreText: {
        fontSize: 12,
        fontWeight: '600',
    },
    internshipDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 8,
    },
    description: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 16,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    skillTag: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    skillText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
    moreSkills: {
        fontSize: 12,
        color: '#64748b',
        alignSelf: 'center',
        marginLeft: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    postedDate: {
        fontSize: 12,
        color: '#64748b',
    },
    applicantsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    applicantsText: {
        fontSize: 12,
        color: '#64748b',
        marginLeft: 4,
    },
    applyButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
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
    aiMatchingContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    aiMatchingContent: {
        alignItems: 'center',
    },
    aiMatchingTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 24,
        textAlign: 'center',
    },
    aiMatchingSubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
    },
    matchingSteps: {
        marginTop: 32,
        alignItems: 'flex-start',
    },
    matchingStep: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 12,
        textAlign: 'left',
    },
    bottomPadding: {
        height: 20,
    },
});