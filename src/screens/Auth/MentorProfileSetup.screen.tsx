import React, { FC, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { StyledInput } from '../../components/StyledInput/StyledInput';
import { StyledButton } from '../../components/StyledButton/StyledButton';

type RootStackParamList = {
    MentorProfileSetup: undefined;
};

type MentorProfileSetupNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'MentorProfileSetup'
>;

const expertiseAreas = [
    'Computer Science',
    'Information Technology',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Marketing',
    'Finance',
    'Data Science',
    'Artificial Intelligence',
    'Digital Marketing',
    'Product Management',
    'UI/UX Design',
    'Software Development',
    'Research & Development',
    'Project Management'
];

const experienceLevels = [
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10-15 years',
    '15+ years'
];

export const MentorProfileSetup: FC = () => {
    const navigation = useNavigation<MentorProfileSetupNavigationProp>();
    const { user, updateUser } = useAuth();

    // Form state - Pre-fill with user data
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [designation, setDesignation] = useState('');
    const [organization, setOrganization] = useState('');
    const [experience, setExperience] = useState('');
    const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
    const [bio, setBio] = useState('');
    const [achievements, setAchievements] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [availableHours, setAvailableHours] = useState('');
    const [loading, setLoading] = useState(false);
    const [expertiseSearchText, setExpertiseSearchText] = useState('');

    // Refs
    const designationRef = useRef<TextInput>(null);
    const organizationRef = useRef<TextInput>(null);
    const bioRef = useRef<TextInput>(null);
    const achievementsRef = useRef<TextInput>(null);
    const linkedInRef = useRef<TextInput>(null);
    const availableHoursRef = useRef<TextInput>(null);

    const toggleExpertise = (area: string) => {
        if (selectedExpertise.includes(area)) {
            setSelectedExpertise(selectedExpertise.filter(e => e !== area));
        } else {
            setSelectedExpertise([...selectedExpertise, area]);
        }
    };

    // Filter function for expertise search
    const filteredExpertise = expertiseAreas.filter(area =>
        area.toLowerCase().includes(expertiseSearchText.toLowerCase())
    );

    const validateForm = () => {
        if (!firstName.trim()) return 'First name is required';
        if (!lastName.trim()) return 'Last name is required';
        if (!email.trim()) return 'Email is required';
        if (!designation.trim()) return 'Designation is required';
        if (!organization.trim()) return 'Organization is required';
        if (!experience) return 'Experience level is required';
        if (selectedExpertise.length === 0) return 'Please select at least one area of expertise';
        if (!bio.trim()) return 'Bio is required';
        if (linkedIn.trim() && !linkedIn.includes('linkedin.com')) {
            return 'Please enter a valid LinkedIn profile URL';
        }
        if (availableHours.trim() && (isNaN(Number(availableHours)) || Number(availableHours) <= 0)) {
            return 'Available hours must be a positive number';
        }
        return null;
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            Alert.alert('Validation Error', error);
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update user with mentor profile data
            await updateUser({
                role: 'mentor',
                profileCompleted: true,
                // Additional mentor-specific data would be stored here
            });

            Alert.alert(
                'Profile Complete!',
                'Welcome to Prashiskshan! Your mentor profile has been created successfully.',
                [{ text: 'Continue' }]
            );

        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Mentor Profile Setup</Text>
                    <Text style={styles.subtitle}>
                        Share your expertise and help guide the next generation of professionals
                    </Text>
                </View>

                <View style={styles.content}>
                    {/* Personal Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>First Name *</Text>
                                <StyledInput
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    variant="white"
                                    fullWidth
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                <Text style={styles.label}>Last Name *</Text>
                                <StyledInput
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    variant="white"
                                    fullWidth
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email *</Text>
                            <StyledInput
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                variant="white"
                                fullWidth
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone {phone ? '*' : '(Optional)'}</Text>
                            <StyledInput
                                placeholder="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                variant="white"
                                fullWidth
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Professional Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Designation/Title *</Text>
                            <StyledInput
                                ref={designationRef}
                                placeholder="e.g., Senior Software Engineer, Professor"
                                value={designation}
                                onChangeText={setDesignation}
                                variant="white"
                                fullWidth
                                returnKeyType="next"
                                onSubmitEditing={() => organizationRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Organization *</Text>
                            <StyledInput
                                ref={organizationRef}
                                placeholder="e.g., Google, IIT Delhi, Microsoft"
                                value={organization}
                                onChangeText={setOrganization}
                                variant="white"
                                fullWidth
                                returnKeyType="next"
                                onSubmitEditing={() => bioRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Experience Level *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.experienceContainer}>
                                {experienceLevels.map((level) => (
                                    <TouchableOpacity
                                        key={level}
                                        style={[
                                            styles.experienceChip,
                                            experience === level && styles.experienceChipSelected
                                        ]}
                                        onPress={() => setExperience(level)}
                                    >
                                        <Text style={[
                                            styles.experienceChipText,
                                            experience === level && styles.experienceChipTextSelected
                                        ]}>
                                            {level}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Expertise Areas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Areas of Expertise</Text>
                        <Text style={styles.sectionSubtitle}>
                            Search and select your areas of expertise
                        </Text>

                        <View style={styles.searchContainer}>
                            <StyledInput
                                placeholder="Search expertise areas..."
                                value={expertiseSearchText}
                                onChangeText={setExpertiseSearchText}
                                variant="white"
                                fullWidth
                            />
                        </View>

                        <View style={styles.expertiseContainer}>
                            {filteredExpertise.map((area) => (
                                <TouchableOpacity
                                    key={area}
                                    style={[
                                        styles.expertiseChip,
                                        selectedExpertise.includes(area) && styles.expertiseChipSelected
                                    ]}
                                    onPress={() => toggleExpertise(area)}
                                >
                                    <Text style={[
                                        styles.expertiseChipText,
                                        selectedExpertise.includes(area) && styles.expertiseChipTextSelected
                                    ]}>
                                        {area}
                                    </Text>
                                    {selectedExpertise.includes(area) && (
                                        <Icon name="check" size={16} color="#fff" style={styles.checkIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                            {filteredExpertise.length === 0 && expertiseSearchText.length > 0 && (
                                <View style={styles.noResultsContainer}>
                                    <Text style={styles.noResultsText}>No expertise areas found matching "{expertiseSearchText}"</Text>
                                    <TouchableOpacity
                                        style={styles.addCustomButton}
                                        onPress={() => {
                                            if (expertiseSearchText.trim()) {
                                                toggleExpertise(expertiseSearchText.trim());
                                                setExpertiseSearchText('');
                                            }
                                        }}
                                    >
                                        <Text style={styles.addCustomText}>Add "{expertiseSearchText}" as custom expertise</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Bio Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Bio *</Text>
                        <Text style={styles.sectionSubtitle}>
                            Tell students about your background, experience, and mentoring philosophy
                        </Text>

                        <TextInput
                            ref={bioRef}
                            style={styles.bioInput}
                            placeholder="Share your professional journey, expertise, and what you're passionate about mentoring..."
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            maxLength={1000}
                        />
                        <Text style={styles.characterCount}>{bio.length}/1000</Text>
                    </View>

                    {/* Achievements Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Key Achievements (Optional)</Text>
                        <Text style={styles.sectionSubtitle}>
                            Highlight your notable achievements, awards, or recognitions
                        </Text>

                        <TextInput
                            ref={achievementsRef}
                            style={styles.achievementsInput}
                            placeholder="e.g., Published 10+ research papers, Led team of 50+ engineers, Won Innovation Award..."
                            value={achievements}
                            onChangeText={setAchievements}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                        <Text style={styles.characterCount}>{achievements.length}/500</Text>
                    </View>

                    {/* Contact & Availability */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact & Availability</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>LinkedIn Profile (Optional)</Text>
                            <StyledInput
                                ref={linkedInRef}
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={linkedIn}
                                onChangeText={setLinkedIn}
                                variant="white"
                                fullWidth
                                keyboardType="url"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onSubmitEditing={() => availableHoursRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Available Hours per Week (Optional)</Text>
                            <StyledInput
                                ref={availableHoursRef}
                                placeholder="e.g., 5"
                                value={availableHours}
                                onChangeText={setAvailableHours}
                                variant="white"
                                fullWidth
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <StyledButton
                    title={loading ? "Creating Profile..." : "Complete Profile"}
                    onPress={handleSubmit}
                    disabled={loading}
                    buttonStyle={[
                        styles.submitButton,
                        loading && styles.submitButtonDisabled
                    ]}
                    fullWidth
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 22,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    experienceContainer: {
        flexDirection: 'row',
    },
    experienceChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
    },
    experienceChipSelected: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    experienceChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    experienceChipTextSelected: {
        color: '#fff',
    },
    expertiseContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    expertiseChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    expertiseChipSelected: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    expertiseChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    expertiseChipTextSelected: {
        color: '#fff',
    },
    checkIcon: {
        marginLeft: 6,
    },
    searchContainer: {
        marginBottom: 16,
    },
    noResultsContainer: {
        padding: 16,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
    addCustomButton: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#10b981',
        borderRadius: 8,
    },
    addCustomText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bioInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
        minHeight: 150,
    },
    achievementsInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
        minHeight: 100,
    },
    characterCount: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'right',
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    submitButton: {
        backgroundColor: '#10b981',
        paddingVertical: 16,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
});
