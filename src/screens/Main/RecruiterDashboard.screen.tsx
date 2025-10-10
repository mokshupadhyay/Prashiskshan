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

interface CandidateMatch {
    id: string;
    name: string;
    email: string;
    college: string;
    course: string;
    year: string;
    cgpa: number;
    skills: string[];
    experience: string[];
    matchScore: number;
    appliedFor: string;
    applicationDate: string;
    status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
    profileStrength: number;
    location: string;
    availability: string;
}

// Mock data for demonstration
const mockCandidates: CandidateMatch[] = [
    {
        id: '1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@college.edu',
        college: 'IIT Delhi',
        course: 'Computer Science Engineering',
        year: '3rd Year',
        cgpa: 8.7,
        skills: ['React', 'JavaScript', 'Node.js', 'Python', 'MongoDB'],
        experience: ['Built 3 full-stack web apps', 'Hackathon winner 2023'],
        matchScore: 95,
        appliedFor: 'Frontend Developer Intern',
        applicationDate: '2024-01-15',
        status: 'new',
        profileStrength: 92,
        location: 'Delhi, India',
        availability: 'Immediate'
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@college.edu',
        college: 'BITS Pilani',
        course: 'Information Technology',
        year: '4th Year',
        cgpa: 9.1,
        skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow'],
        experience: ['ML research project', 'Data science internship at startup'],
        matchScore: 88,
        appliedFor: 'Data Science Intern',
        applicationDate: '2024-01-12',
        status: 'shortlisted',
        profileStrength: 89,
        location: 'Mumbai, India',
        availability: 'From March 2024'
    },
    {
        id: '3',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@college.edu',
        college: 'NIT Trichy',
        course: 'Electronics Engineering',
        year: '3rd Year',
        cgpa: 8.2,
        skills: ['React Native', 'Flutter', 'JavaScript', 'Firebase', 'UI/UX'],
        experience: ['Published 2 apps on Play Store', 'Freelance mobile developer'],
        matchScore: 82,
        appliedFor: 'Mobile App Developer',
        applicationDate: '2024-01-10',
        status: 'interviewed',
        profileStrength: 85,
        location: 'Chennai, India',
        availability: 'From February 2024'
    },
    {
        id: '4',
        name: 'Sneha Gupta',
        email: 'sneha.gupta@college.edu',
        college: 'Delhi University',
        course: 'Business Administration',
        year: '2nd Year',
        cgpa: 8.9,
        skills: ['Digital Marketing', 'Content Writing', 'SEO', 'Analytics', 'Social Media'],
        experience: ['Marketing intern at e-commerce startup', 'Content creator with 10K followers'],
        matchScore: 79,
        appliedFor: 'Digital Marketing Intern',
        applicationDate: '2024-01-08',
        status: 'reviewed',
        profileStrength: 81,
        location: 'Delhi, India',
        availability: 'Flexible'
    }
];

export const RecruiterDashboard: FC = () => {
    const { user, logout } = useAuth();
    const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [aiMatching, setAiMatching] = useState(false);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async (showAiAnimation = false) => {
        if (showAiAnimation) {
            setAiMatching(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setAiMatching(false);
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCandidates(mockCandidates);
        } catch (error) {
            console.error('Error loading candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadCandidates().finally(() => setRefreshing(false));
    };

    const getStatusColor = (status: CandidateMatch['status']) => {
        switch (status) {
            case 'new': return '#3b82f6';
            case 'reviewed': return '#f59e0b';
            case 'shortlisted': return '#10b981';
            case 'interviewed': return '#8b5cf6';
            case 'hired': return '#059669';
            case 'rejected': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status: CandidateMatch['status']) => {
        switch (status) {
            case 'new': return 'New';
            case 'reviewed': return 'Reviewed';
            case 'shortlisted': return 'Shortlisted';
            case 'interviewed': return 'Interviewed';
            case 'hired': return 'Hired';
            case 'rejected': return 'Rejected';
            default: return 'Unknown';
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 90) return '#10b981';
        if (score >= 80) return '#f59e0b';
        if (score >= 70) return '#ef4444';
        return '#6b7280';
    };

    const CandidateCard = ({ candidate }: { candidate: CandidateMatch }) => (
        <TouchableOpacity style={styles.candidateCard} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.candidateInfo}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </View>
                    <View style={styles.basicInfo}>
                        <Text style={styles.candidateName}>{candidate.name}</Text>
                        <Text style={styles.candidateDetails}>
                            {candidate.course} • {candidate.year}
                        </Text>
                        <Text style={styles.college}>{candidate.college}</Text>
                    </View>
                </View>
                <View style={styles.scores}>
                    <View style={[styles.matchScore, { backgroundColor: `${getMatchScoreColor(candidate.matchScore)}15` }]}>
                        <Text style={[styles.matchScoreText, { color: getMatchScoreColor(candidate.matchScore) }]}>
                            {candidate.matchScore}% Match
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(candidate.status)}15` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(candidate.status) }]}>
                            {getStatusText(candidate.status)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.applicationInfo}>
                <Text style={styles.appliedFor}>Applied for: {candidate.appliedFor}</Text>
                <Text style={styles.applicationDate}>
                    Applied on: {new Date(candidate.applicationDate).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.candidateDetails}>
                <View style={styles.detailRow}>
                    <Icon name="graduation-cap" size={16} color="#64748b" />
                    <Text style={styles.detailText}>CGPA: {candidate.cgpa}/10</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="map-marker" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{candidate.location}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="clock-o" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{candidate.availability}</Text>
                </View>
            </View>

            <View style={styles.skillsContainer}>
                {candidate.skills.slice(0, 4).map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                    </View>
                ))}
                {candidate.skills.length > 4 && (
                    <Text style={styles.moreSkills}>+{candidate.skills.length - 4} more</Text>
                )}
            </View>

            <View style={styles.experienceSection}>
                <Text style={styles.experienceTitle}>Key Experience:</Text>
                {candidate.experience.slice(0, 2).map((exp, index) => (
                    <Text key={index} style={styles.experienceItem}>• {exp}</Text>
                ))}
            </View>

            <View style={styles.profileStrength}>
                <View style={styles.strengthHeader}>
                    <Text style={styles.strengthLabel}>Profile Strength</Text>
                    <Text style={styles.strengthPercentage}>{candidate.profileStrength}%</Text>
                </View>
                <View style={styles.strengthBar}>
                    <View
                        style={[
                            styles.strengthFill,
                            { width: `${candidate.profileStrength}%` }
                        ]}
                    />
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                    <Icon name="times" size={16} color="#ef4444" />
                    <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.shortlistButton]}>
                    <Icon name="star" size={16} color="#fff" />
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>Shortlist</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const AIMatchingLoader = () => (
        <View style={styles.aiMatchingContainer}>
            <View style={styles.aiMatchingContent}>
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text style={styles.aiMatchingTitle}>AI Candidate Matching</Text>
                <Text style={styles.aiMatchingSubtitle}>
                    Analyzing candidate profiles and matching with your requirements...
                </Text>
                <View style={styles.matchingSteps}>
                    <Text style={styles.matchingStep}>🔍 Scanning candidate profiles</Text>
                    <Text style={styles.matchingStep}>🎯 Matching skills & experience</Text>
                    <Text style={styles.matchingStep}>📊 Calculating compatibility scores</Text>
                </View>
            </View>
        </View>
    );

    const newApplications = candidates.filter(c => c.status === 'new').length;
    const shortlistedCandidates = candidates.filter(c => c.status === 'shortlisted').length;
    const interviewsScheduled = candidates.filter(c => c.status === 'interviewed').length;
    const averageMatchScore = candidates.length > 0
        ? Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)
        : 0;

    if (aiMatching) {
        return <AIMatchingLoader />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.firstName}! 💼</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={logout}>
                    <Icon name="user-circle" size={32} color="#8b5cf6" />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.statCard}>
                        <Icon name="plus-circle" size={24} color="#3b82f6" />
                        <Text style={styles.statNumber}>{newApplications}</Text>
                        <Text style={styles.statLabel}>New Applications</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="star" size={24} color="#10b981" />
                        <Text style={styles.statNumber}>{shortlistedCandidates}</Text>
                        <Text style={styles.statLabel}>Shortlisted</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="calendar" size={24} color="#8b5cf6" />
                        <Text style={styles.statNumber}>{interviewsScheduled}</Text>
                        <Text style={styles.statLabel}>Interviews</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="line-chart" size={24} color="#f59e0b" />
                        <Text style={styles.statNumber}>{averageMatchScore}%</Text>
                        <Text style={styles.statLabel}>Avg Match</Text>
                    </View>
                </ScrollView>
            </View>

            {/* Candidates List */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Matched Candidates</Text>
                <TouchableOpacity onPress={() => loadCandidates(true)}>
                    <Icon name="refresh" size={24} color="#8b5cf6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.candidatesList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8b5cf6" />
                        <Text style={styles.loadingText}>Loading candidates...</Text>
                    </View>
                ) : (
                    candidates.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
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
    candidatesList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    candidateCard: {
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
    candidateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#8b5cf6',
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
    candidateName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    candidateDetails: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    college: {
        fontSize: 12,
        color: '#9ca3af',
    },
    scores: {
        alignItems: 'flex-end',
        gap: 8,
    },
    matchScore: {
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    matchScoreText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadge: {
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    applicationInfo: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    appliedFor: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    applicationDate: {
        fontSize: 12,
        color: '#9ca3af',
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
    experienceSection: {
        marginBottom: 16,
    },
    experienceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    experienceItem: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 4,
        lineHeight: 18,
    },
    profileStrength: {
        marginBottom: 16,
    },
    strengthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    strengthLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    strengthPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8b5cf6',
    },
    strengthBar: {
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        backgroundColor: '#8b5cf6',
        borderRadius: 3,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    rejectButton: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    shortlistButton: {
        backgroundColor: '#8b5cf6',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
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
