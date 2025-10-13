import React, { FC, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type BrowseNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Browse'>;

interface InternshipListing {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'remote' | 'onsite' | 'hybrid';
    duration: string;
    stipend: string;
    skills: string[];
    postedDate: string;
    applicants: number;
    isBookmarked: boolean;
    matchScore: number; // AI-powered match score
}

const mockInternships: InternshipListing[] = [
    {
        id: '1',
        title: 'Software Development Intern',
        company: 'Google',
        location: 'Bangalore, India',
        type: 'hybrid',
        duration: '3 months',
        stipend: '₹50,000/month',
        skills: ['React', 'Node.js', 'Python'],
        postedDate: '1 day ago',
        applicants: 156,
        isBookmarked: false,
        matchScore: 95
    },
    {
        id: '2',
        title: 'Data Science Intern',
        company: 'Microsoft',
        location: 'Hyderabad, India',
        type: 'onsite',
        duration: '6 months',
        stipend: '₹45,000/month',
        skills: ['Python', 'Machine Learning', 'SQL'],
        postedDate: '2 days ago',
        applicants: 89,
        isBookmarked: true,
        matchScore: 88
    },
    {
        id: '3',
        title: 'UI/UX Design Intern',
        company: 'Adobe',
        location: 'Remote',
        type: 'remote',
        duration: '4 months',
        stipend: '₹35,000/month',
        skills: ['Figma', 'Adobe XD', 'Prototyping'],
        postedDate: '3 days ago',
        applicants: 67,
        isBookmarked: false,
        matchScore: 82
    },
    {
        id: '4',
        title: 'Marketing Intern',
        company: 'Flipkart',
        location: 'Mumbai, India',
        type: 'hybrid',
        duration: '3 months',
        stipend: '₹25,000/month',
        skills: ['Digital Marketing', 'Analytics', 'Content Creation'],
        postedDate: '1 week ago',
        applicants: 234,
        isBookmarked: false,
        matchScore: 79
    }
];

export const Browse: FC = () => {
    const navigation = useNavigation<BrowseNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [internships, setInternships] = useState<InternshipListing[]>(mockInternships);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'remote' | 'onsite' | 'hybrid'>('all');

    const toggleBookmark = (internshipId: string) => {
        setInternships(prev => prev.map(internship =>
            internship.id === internshipId
                ? { ...internship, isBookmarked: !internship.isBookmarked }
                : internship
        ));
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
            case 'onsite': return 'building';
            case 'hybrid': return 'briefcase';
            default: return 'briefcase';
        }
    };

    const filteredInternships = internships.filter(internship => {
        const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || internship.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const InternshipCard = ({ internship }: { internship: InternshipListing }) => (
        <TouchableOpacity style={styles.internshipCard} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.companyInfo}>
                    <Text style={styles.internshipTitle}>{internship.title}</Text>
                    <Text style={styles.companyName}>{internship.company}</Text>
                </View>
                <View style={styles.cardActions}>
                    <View style={[styles.matchScore, { backgroundColor: `${getMatchScoreColor(internship.matchScore)}15` }]}>
                        <Icon name="magic" size={12} color={getMatchScoreColor(internship.matchScore)} />
                        <Text style={[styles.matchScoreText, { color: getMatchScoreColor(internship.matchScore) }]}>
                            {internship.matchScore}% Match
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.bookmarkButton}
                        onPress={() => toggleBookmark(internship.id)}
                    >
                        <Icon
                            name={internship.isBookmarked ? 'bookmark' : 'bookmark-o'}
                            size={20}
                            color={internship.isBookmarked ? '#f59e0b' : '#9ca3af'}
                        />
                    </TouchableOpacity>
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
        </TouchableOpacity>
    );

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
                <Text style={styles.title}>Browse Internships</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="sliders" size={20} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* AI Match Score USP Banner */}
            <View style={styles.uspBanner}>
                <View style={styles.uspContent}>
                    <Icon name="magic" size={24} color="#fff" />
                    <Text style={styles.uspTitle}>AI-Powered Matching</Text>
                </View>
                <Text style={styles.uspSubtitle}>
                    Our smart algorithm finds internships that perfectly match your skills and preferences
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={16} color="#9ca3af" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search internships, companies..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['all', 'remote', 'onsite', 'hybrid'].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterTab,
                                selectedFilter === filter && styles.activeFilterTab
                            ]}
                            onPress={() => setSelectedFilter(filter as any)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                selectedFilter === filter && styles.activeFilterTabText
                            ]}>
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredInternships.length} internships found
                </Text>
            </View>

            {/* Internships List */}
            <ScrollView style={styles.internshipsList} showsVerticalScrollIndicator={false}>
                {filteredInternships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
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
    filterButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
    },
    filterTabs: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    activeFilterTab: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    activeFilterTabText: {
        color: '#fff',
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    resultsCount: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
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
        fontWeight: '500',
    },
    cardActions: {
        alignItems: 'flex-end',
        gap: 8,
    },
    matchScore: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 4,
    },
    matchScoreText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bookmarkButton: {
        padding: 4,
    },
    internshipDetails: {
        marginBottom: 16,
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
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    bottomPadding: {
        height: 20,
    },
    uspBanner: {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: '#8b5cf6',
        marginHorizontal: 20,
        marginVertical: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    uspContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    uspTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    uspSubtitle: {
        fontSize: 14,
        color: '#e0e7ff',
        lineHeight: 20,
    },
});
