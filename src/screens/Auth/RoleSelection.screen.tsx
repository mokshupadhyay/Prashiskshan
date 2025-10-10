import React, { FC } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrashiskhanLogo } from '../../assets/logo/VendorForge';

type RootStackParamList = {
    RoleSelection: undefined;
    StudentProfileSetup: undefined;
    MentorProfileSetup: undefined;
    RecruiterProfileSetup: undefined;
};

type RoleSelectionNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'RoleSelection'
>;

export type UserRole = 'student' | 'mentor' | 'recruiter';

interface RoleOption {
    id: UserRole;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    features: string[];
}

const roleOptions: RoleOption[] = [
    {
        id: 'student',
        title: '🧑‍🎓 Student',
        subtitle: 'Find Your Perfect Internship',
        description: 'Discover AI-recommended internships that match your skills and career goals.',
        icon: 'graduation-cap',
        color: '#3B82F6',
        features: [
            'AI-powered internship recommendations',
            'Skill-based matching',
            'Progress tracking & mentoring',
            'Academic credit integration'
        ]
    },
    {
        id: 'mentor',
        title: '🧑‍🏫 Mentor/Faculty',
        subtitle: 'Guide & Supervise Students',
        description: 'Support students through their internship journey and academic growth.',
        icon: 'user',
        color: '#10B981',
        features: [
            'Student progress monitoring',
            'Feedback & evaluation system',
            'Academic credit approval',
            'Mentorship dashboard'
        ]
    },
    {
        id: 'recruiter',
        title: '💼 Recruiter',
        subtitle: 'Find Top Talent',
        description: 'Connect with skilled students and interns for your organization.',
        icon: 'briefcase',
        color: '#8B5CF6',
        features: [
            'Access to student profiles',
            'Skill-based candidate filtering',
            'Interview & hiring tools',
            'Performance tracking'
        ]
    }
];

export const RoleSelection: FC = () => {
    const navigation = useNavigation<RoleSelectionNavigationProp>();

    const handleRoleSelect = (role: UserRole) => {
        switch (role) {
            case 'student':
                navigation.navigate('StudentProfileSetup');
                break;
            case 'mentor':
                navigation.navigate('MentorProfileSetup');
                break;
            case 'recruiter':
                navigation.navigate('RecruiterProfileSetup');
                break;
        }
    };

    const RoleCard = ({ role }: { role: RoleOption }) => (
        <TouchableOpacity
            style={[styles.roleCard, { borderColor: role.color }]}
            onPress={() => handleRoleSelect(role.id)}
            activeOpacity={0.7}
        >
            <View style={styles.roleHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${role.color}15` }]}>
                    <Icon name={role.icon} size={32} color={role.color} />
                </View>
                <View style={styles.roleInfo}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                </View>
            </View>

            <Text style={styles.roleDescription}>{role.description}</Text>

            <View style={styles.featuresContainer}>
                {role.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <Icon name="check" size={16} color={role.color} />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>

            <View style={[styles.selectButton, { backgroundColor: role.color }]}>
                <Text style={styles.selectButtonText}>Continue as {role.title.split(' ')[1]}</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <PrashiskhanLogo variant="default" size={48} />
                <Text style={styles.appTitle}>Prashiskshan</Text>
                <Text style={styles.tagline}>AI-driven Student Internship Portal</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Choose Your Role</Text>
                <Text style={styles.subtitle}>
                    Select how you'd like to use Prashiskshan to get started with your personalized experience.
                </Text>

                <View style={styles.rolesContainer}>
                    {roleOptions.map((role) => (
                        <RoleCard key={role.id} role={role} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    appTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e40af',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 32,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    rolesContainer: {
        gap: 20,
    },
    roleCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    roleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    roleInfo: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    roleSubtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    roleDescription: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 20,
    },
    featuresContainer: {
        gap: 12,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#475569',
        flex: 1,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
