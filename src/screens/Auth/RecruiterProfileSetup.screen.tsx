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
    RecruiterProfileSetup: undefined;
};

type RecruiterProfileSetupNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'RecruiterProfileSetup'
>;

const companyTypes = [
    'Startup',
    'Small Business',
    'Mid-size Company',
    'Large Enterprise',
    'Non-profit',
    'Government',
    'Educational Institution',
    'Consulting Firm'
];

const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media & Entertainment',
    'Real Estate',
    'Automotive',
    'Energy',
    'Telecommunications',
    'Food & Beverage',
    'Travel & Tourism',
    'Other'
];

const internshipTypes = [
    'Software Development',
    'Data Science',
    'Digital Marketing',
    'Business Development',
    'UI/UX Design',
    'Content Writing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Research',
    'Product Management'
];

export const RecruiterProfileSetup: FC = () => {
    const navigation = useNavigation<RecruiterProfileSetupNavigationProp>();
    const { user, updateUser } = useAuth();

    // Form state - Pre-fill with user data
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [industry, setIndustry] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [selectedInternshipTypes, setSelectedInternshipTypes] = useState<string[]>([]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [internshipSearchText, setInternshipSearchText] = useState('');

    // Refs
    const companyNameRef = useRef<TextInput>(null);
    const companySizeRef = useRef<TextInput>(null);
    const websiteRef = useRef<TextInput>(null);
    const locationRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const contactEmailRef = useRef<TextInput>(null);
    const contactPhoneRef = useRef<TextInput>(null);

    const toggleInternshipType = (type: string) => {
        if (selectedInternshipTypes.includes(type)) {
            setSelectedInternshipTypes(selectedInternshipTypes.filter(t => t !== type));
        } else {
            setSelectedInternshipTypes([...selectedInternshipTypes, type]);
        }
    };

    // Filter function for internship types search
    const filteredInternshipTypes = internshipTypes.filter(type =>
        type.toLowerCase().includes(internshipSearchText.toLowerCase())
    );

    const validateForm = () => {
        if (!companyName.trim()) return 'Company name is required';
        if (!companyType) return 'Company type is required';
        if (!industry) return 'Industry is required';
        if (!companySize.trim()) return 'Company size is required';
        if (!location.trim()) return 'Location is required';
        if (!description.trim()) return 'Company description is required';
        if (selectedInternshipTypes.length === 0) return 'Please select at least one internship type you offer';
        if (!contactEmail.trim()) return 'Contact email is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail.trim())) return 'Please enter a valid email address';

        // Website validation (if provided)
        if (website.trim() && !website.includes('.')) {
            return 'Please enter a valid website URL';
        }

        // Phone validation (if provided)
        if (contactPhone.trim() && !/^\+?\d{10,15}$/.test(contactPhone.trim())) {
            return 'Please enter a valid phone number';
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

            // Update user with recruiter profile data
            await updateUser({
                role: 'recruiter',
                profileCompleted: true,
                // Additional recruiter-specific data would be stored here
            });

            Alert.alert(
                'Profile Complete!',
                'Welcome to Prashiskshan! Your recruiter profile has been created successfully.',
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
                    <Text style={styles.title}>Recruiter Profile Setup</Text>
                    <Text style={styles.subtitle}>
                        Tell us about your company and the internship opportunities you offer
                    </Text>
                </View>

                <View style={styles.content}>
                    {/* Company Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Company Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Name *</Text>
                            <StyledInput
                                ref={companyNameRef}
                                placeholder="Enter your company name"
                                value={companyName}
                                onChangeText={setCompanyName}
                                variant="white"
                                fullWidth
                                returnKeyType="next"
                                onSubmitEditing={() => companySizeRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Type *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
                                {companyTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.typeChip,
                                            companyType === type && styles.typeChipSelected
                                        ]}
                                        onPress={() => setCompanyType(type)}
                                    >
                                        <Text style={[
                                            styles.typeChipText,
                                            companyType === type && styles.typeChipTextSelected
                                        ]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Industry *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.industryContainer}>
                                {industries.map((ind) => (
                                    <TouchableOpacity
                                        key={ind}
                                        style={[
                                            styles.industryChip,
                                            industry === ind && styles.industryChipSelected
                                        ]}
                                        onPress={() => setIndustry(ind)}
                                    >
                                        <Text style={[
                                            styles.industryChipText,
                                            industry === ind && styles.industryChipTextSelected
                                        ]}>
                                            {ind}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Company Size *</Text>
                                <StyledInput
                                    ref={companySizeRef}
                                    placeholder="e.g., 50-100 employees"
                                    value={companySize}
                                    onChangeText={setCompanySize}
                                    variant="white"
                                    fullWidth
                                    returnKeyType="next"
                                    onSubmitEditing={() => websiteRef.current?.focus()}
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                <Text style={styles.label}>Website (Optional)</Text>
                                <StyledInput
                                    ref={websiteRef}
                                    placeholder="www.company.com"
                                    value={website}
                                    onChangeText={setWebsite}
                                    variant="white"
                                    fullWidth
                                    keyboardType="url"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => locationRef.current?.focus()}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location *</Text>
                            <StyledInput
                                ref={locationRef}
                                placeholder="e.g., Mumbai, India"
                                value={location}
                                onChangeText={setLocation}
                                variant="white"
                                fullWidth
                                returnKeyType="next"
                                onSubmitEditing={() => descriptionRef.current?.focus()}
                            />
                        </View>
                    </View>

                    {/* Company Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Company Description *</Text>
                        <Text style={styles.sectionSubtitle}>
                            Tell students about your company, culture, and mission
                        </Text>

                        <TextInput
                            ref={descriptionRef}
                            style={styles.descriptionInput}
                            placeholder="Describe your company, what you do, your values, and what makes it a great place for interns..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            maxLength={1000}
                        />
                        <Text style={styles.characterCount}>{description.length}/1000</Text>
                    </View>

                    {/* Internship Types */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Internship Opportunities</Text>
                        <Text style={styles.sectionSubtitle}>
                            Select the types of internships your company typically offers
                        </Text>

                        <View style={styles.internshipContainer}>
                            {internshipTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.internshipChip,
                                        selectedInternshipTypes.includes(type) && styles.internshipChipSelected
                                    ]}
                                    onPress={() => toggleInternshipType(type)}
                                >
                                    <Text style={[
                                        styles.internshipChipText,
                                        selectedInternshipTypes.includes(type) && styles.internshipChipTextSelected
                                    ]}>
                                        {type}
                                    </Text>
                                    {selectedInternshipTypes.includes(type) && (
                                        <Icon name="check" size={16} color="#fff" style={styles.checkIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Contact Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contact Email *</Text>
                            <StyledInput
                                ref={contactEmailRef}
                                placeholder="hr@company.com"
                                value={contactEmail}
                                onChangeText={setContactEmail}
                                variant="white"
                                fullWidth
                                keyboardType="email-address"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onSubmitEditing={() => contactPhoneRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contact Phone (Optional)</Text>
                            <StyledInput
                                ref={contactPhoneRef}
                                placeholder="+91 9876543210"
                                value={contactPhone}
                                onChangeText={setContactPhone}
                                variant="white"
                                fullWidth
                                keyboardType="phone-pad"
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
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    typeContainer: {
        flexDirection: 'row',
    },
    typeChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
    },
    typeChipSelected: {
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
    },
    typeChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    typeChipTextSelected: {
        color: '#fff',
    },
    industryContainer: {
        flexDirection: 'row',
    },
    industryChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
    },
    industryChipSelected: {
        backgroundColor: '#f59e0b',
        borderColor: '#f59e0b',
    },
    industryChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    industryChipTextSelected: {
        color: '#fff',
    },
    descriptionInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
        minHeight: 150,
    },
    characterCount: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'right',
        marginTop: 8,
    },
    internshipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    internshipChip: {
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
    internshipChipSelected: {
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
    },
    internshipChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    internshipChipTextSelected: {
        color: '#fff',
    },
    checkIcon: {
        marginLeft: 6,
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
        backgroundColor: '#8b5cf6',
        paddingVertical: 16,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
});
