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
    StudentProfileSetup: undefined;
};

type StudentProfileSetupNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'StudentProfileSetup'
>;

interface SkillItem {
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const predefinedSkills = [
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
    // Web Development
    'React', 'Angular', 'Vue.js', 'Node.js', 'HTML/CSS', 'Bootstrap', 'Tailwind CSS', 'jQuery', 'Express.js',
    // Mobile Development
    'React Native', 'Flutter', 'Android Development', 'iOS Development', 'Xamarin',
    // Data Science & AI
    'Machine Learning', 'Deep Learning', 'Data Analysis', 'Data Visualization', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    // Database
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Firebase',
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux',
    // Design
    'UI/UX Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'Canva', 'Graphic Design',
    // Business & Marketing
    'Digital Marketing', 'Content Writing', 'SEO', 'Social Media Marketing', 'Project Management', 'Business Analysis',
    // Other
    'Video Editing', 'Photography', 'Public Speaking', 'Research', 'Technical Writing', 'Customer Service'
];

const academicYears = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year',
    'Final Year',
    'Post Graduate',
    'PhD'
];

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const careerGoals = [
    'Software Development',
    'Data Science',
    'Product Management',
    'UI/UX Design',
    'Digital Marketing',
    'Content Creation',
    'Business Analysis',
    'Consulting',
    'Research & Development',
    'Entrepreneurship'
];

export const StudentProfileSetup: FC = () => {
    const navigation = useNavigation<StudentProfileSetupNavigationProp>();
    const { user, updateUser } = useAuth();

    // Form state - Pre-fill with user data
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [college, setCollege] = useState('');
    const [year, setYear] = useState('');
    const [course, setCourse] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [location, setLocation] = useState('');
    const [skills, setSkills] = useState<SkillItem[]>([]);
    const [selectedCareerGoals, setSelectedCareerGoals] = useState<string[]>([]);
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [yearSearchText, setYearSearchText] = useState('');
    const [locationSearchText, setLocationSearchText] = useState('');
    const [skillSearchText, setSkillSearchText] = useState('');

    // Refs
    const collegeRef = useRef<TextInput>(null);
    const courseRef = useRef<TextInput>(null);
    const cgpaRef = useRef<TextInput>(null);
    const bioRef = useRef<TextInput>(null);

    const addSkill = (skillName: string) => {
        if (skills.find(s => s.name === skillName)) return;

        const newSkill: SkillItem = {
            id: Date.now().toString(),
            name: skillName,
            level: 'Beginner'
        };
        setSkills([...skills, newSkill]);
    };

    const removeSkill = (skillId: string) => {
        setSkills(skills.filter(s => s.id !== skillId));
    };

    const updateSkillLevel = (skillId: string, level: SkillItem['level']) => {
        setSkills(skills.map(s => s.id === skillId ? { ...s, level } : s));
    };

    const toggleCareerGoal = (goal: string) => {
        if (selectedCareerGoals.includes(goal)) {
            setSelectedCareerGoals(selectedCareerGoals.filter(g => g !== goal));
        } else {
            setSelectedCareerGoals([...selectedCareerGoals, goal]);
        }
    };

    // Filter functions for search
    const filteredYears = academicYears.filter(year =>
        year.toLowerCase().includes(yearSearchText.toLowerCase())
    );

    const filteredStates = indianStates.filter(state =>
        state.toLowerCase().includes(locationSearchText.toLowerCase())
    );

    const filteredSkills = predefinedSkills.filter(skill =>
        skill.toLowerCase().includes(skillSearchText.toLowerCase())
    );

    const validateForm = () => {
        if (!firstName.trim()) return 'First name is required';
        if (!lastName.trim()) return 'Last name is required';
        if (!email.trim()) return 'Email is required';
        if (!college.trim()) return 'College/University name is required';
        if (!year.trim()) return 'Academic year is required';
        if (!course.trim()) return 'Course/Program is required';
        if (!location.trim()) return 'Location is required';
        if (cgpa.trim() && (isNaN(Number(cgpa)) || Number(cgpa) < 0 || Number(cgpa) > 10)) {
            return 'CGPA must be a valid number between 0 and 10';
        }
        if (skills.length === 0) return 'Please add at least one skill';
        if (selectedCareerGoals.length === 0) return 'Please select at least one career goal';
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

            // Update user with student profile data
            await updateUser({
                role: 'student',
                profileCompleted: true,
                // Additional student-specific data would be stored here
                // In a real app, this would be sent to backend
            });

            Alert.alert(
                'Profile Complete!',
                'Welcome to Prashiskshan! Your student profile has been created successfully.',
                [{
                    text: 'Continue', onPress: () => {
                        // Navigation will be handled by AuthContext change
                    }
                }]
            );

        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const SkillLevelButton = ({ level, isSelected, onPress }: {
        level: SkillItem['level'];
        isSelected: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={[
                styles.levelButton,
                isSelected && styles.levelButtonSelected
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.levelButtonText,
                isSelected && styles.levelButtonTextSelected
            ]}>
                {level}
            </Text>
        </TouchableOpacity>
    );

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
                    <Text style={styles.title}>Student Profile Setup</Text>
                    <Text style={styles.subtitle}>
                        Tell us about your academic background and career aspirations
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

                    {/* Academic Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Academic Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>College/University *</Text>
                            <StyledInput
                                ref={collegeRef}
                                placeholder="Enter your college or university name"
                                value={college}
                                onChangeText={setCollege}
                                variant="white"
                                fullWidth
                                returnKeyType="next"
                                onSubmitEditing={() => courseRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Academic Year *</Text>
                                <TouchableOpacity
                                    style={styles.picker}
                                    onPress={() => setShowYearPicker(!showYearPicker)}
                                >
                                    <Text style={year ? styles.pickerText : styles.pickerPlaceholder}>
                                        {year || 'Select Year'}
                                    </Text>
                                    <Icon name={showYearPicker ? "chevron-up" : "chevron-down"} size={16} color="#64748b" />
                                </TouchableOpacity>
                                {showYearPicker && (
                                    <View style={styles.optionsContainer}>
                                        <View style={styles.searchContainer}>
                                            <StyledInput
                                                placeholder="Search academic year..."
                                                value={yearSearchText}
                                                onChangeText={setYearSearchText}
                                                variant="white"
                                                fullWidth
                                            />
                                        </View>
                                        <ScrollView style={styles.optionsList} nestedScrollEnabled>
                                            {filteredYears.map((yearOption) => (
                                                <TouchableOpacity
                                                    key={yearOption}
                                                    style={styles.optionItem}
                                                    onPress={() => {
                                                        setYear(yearOption);
                                                        setShowYearPicker(false);
                                                        setYearSearchText('');
                                                    }}
                                                >
                                                    <Text style={styles.optionText}>{yearOption}</Text>
                                                </TouchableOpacity>
                                            ))}
                                            {filteredYears.length === 0 && (
                                                <View style={styles.noResultsContainer}>
                                                    <Text style={styles.noResultsText}>No results found</Text>
                                                </View>
                                            )}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                <Text style={styles.label}>CGPA (Optional)</Text>
                                <StyledInput
                                    ref={cgpaRef}
                                    placeholder="e.g., 8.5"
                                    value={cgpa}
                                    onChangeText={setCgpa}
                                    variant="white"
                                    fullWidth
                                    keyboardType="decimal-pad"
                                    returnKeyType="next"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Course/Program *</Text>
                            <StyledInput
                                ref={courseRef}
                                placeholder="e.g., Computer Science Engineering"
                                value={course}
                                onChangeText={setCourse}
                                variant="white"
                                fullWidth
                                returnKeyType="next"
                                onSubmitEditing={() => bioRef.current?.focus()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location *</Text>
                            <TouchableOpacity
                                style={styles.picker}
                                onPress={() => setShowLocationPicker(!showLocationPicker)}
                            >
                                <Text style={location ? styles.pickerText : styles.pickerPlaceholder}>
                                    {location || 'Select State'}
                                </Text>
                                <Icon name={showLocationPicker ? "chevron-up" : "chevron-down"} size={16} color="#64748b" />
                            </TouchableOpacity>
                            {showLocationPicker && (
                                <View style={styles.optionsContainer}>
                                    <View style={styles.searchContainer}>
                                        <StyledInput
                                            placeholder="Search state..."
                                            value={locationSearchText}
                                            onChangeText={setLocationSearchText}
                                            variant="white"
                                            fullWidth
                                        />
                                    </View>
                                    <ScrollView style={styles.optionsList} nestedScrollEnabled>
                                        {filteredStates.map((state) => (
                                            <TouchableOpacity
                                                key={state}
                                                style={styles.optionItem}
                                                onPress={() => {
                                                    setLocation(state);
                                                    setShowLocationPicker(false);
                                                    setLocationSearchText('');
                                                }}
                                            >
                                                <Text style={styles.optionText}>{state}</Text>
                                            </TouchableOpacity>
                                        ))}
                                        {filteredStates.length === 0 && (
                                            <View style={styles.noResultsContainer}>
                                                <Text style={styles.noResultsText}>No results found</Text>
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Skills Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills & Expertise</Text>
                        <Text style={styles.sectionSubtitle}>
                            Search and add your technical and soft skills
                        </Text>

                        <View style={styles.searchContainer}>
                            <StyledInput
                                placeholder="Search skills (e.g., JavaScript, Python, Design)..."
                                value={skillSearchText}
                                onChangeText={setSkillSearchText}
                                variant="white"
                                fullWidth
                            />
                        </View>

                        <View style={styles.skillsContainer}>
                            {filteredSkills.map((skill) => (
                                <TouchableOpacity
                                    key={skill}
                                    style={[
                                        styles.skillChip,
                                        skills.find(s => s.name === skill) && styles.skillChipSelected
                                    ]}
                                    onPress={() => addSkill(skill)}
                                >
                                    <Text style={[
                                        styles.skillChipText,
                                        skills.find(s => s.name === skill) && styles.skillChipTextSelected
                                    ]}>
                                        {skill}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {filteredSkills.length === 0 && skillSearchText.length > 0 && (
                                <View style={styles.noResultsContainer}>
                                    <Text style={styles.noResultsText}>No skills found matching "{skillSearchText}"</Text>
                                    <TouchableOpacity
                                        style={styles.addCustomSkillButton}
                                        onPress={() => {
                                            if (skillSearchText.trim()) {
                                                addSkill(skillSearchText.trim());
                                                setSkillSearchText('');
                                            }
                                        }}
                                    >
                                        <Text style={styles.addCustomSkillText}>Add "{skillSearchText}" as custom skill</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Selected Skills with Level */}
                        {skills.length > 0 && (
                            <View style={styles.selectedSkillsContainer}>
                                <Text style={styles.selectedSkillsTitle}>Your Skills:</Text>
                                {skills.map((skill) => (
                                    <View key={skill.id} style={styles.selectedSkillItem}>
                                        <View style={styles.skillHeader}>
                                            <Text style={styles.skillName}>{skill.name}</Text>
                                            <TouchableOpacity
                                                onPress={() => removeSkill(skill.id)}
                                                style={styles.removeSkillButton}
                                            >
                                                <Icon name="close" size={16} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.levelButtons}>
                                            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                                                <SkillLevelButton
                                                    key={level}
                                                    level={level}
                                                    isSelected={skill.level === level}
                                                    onPress={() => updateSkillLevel(skill.id, level)}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Career Goals */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Career Goals</Text>
                        <Text style={styles.sectionSubtitle}>
                            Select your career interests (you can choose multiple)
                        </Text>

                        <View style={styles.goalsContainer}>
                            {careerGoals.map((goal) => (
                                <TouchableOpacity
                                    key={goal}
                                    style={[
                                        styles.goalChip,
                                        selectedCareerGoals.includes(goal) && styles.goalChipSelected
                                    ]}
                                    onPress={() => toggleCareerGoal(goal)}
                                >
                                    <Text style={[
                                        styles.goalChipText,
                                        selectedCareerGoals.includes(goal) && styles.goalChipTextSelected
                                    ]}>
                                        {goal}
                                    </Text>
                                    {selectedCareerGoals.includes(goal) && (
                                        <Icon name="check" size={16} color="#fff" style={styles.goalCheckIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Bio Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About You (Optional)</Text>
                        <Text style={styles.sectionSubtitle}>
                            Tell us a bit about yourself, your interests, and what you're looking for
                        </Text>

                        <TextInput
                            ref={bioRef}
                            style={styles.bioInput}
                            placeholder="Write a brief introduction about yourself..."
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                        <Text style={styles.characterCount}>{bio.length}/500</Text>
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
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 50,
    },
    pickerText: {
        fontSize: 16,
        color: '#1f2937',
    },
    pickerPlaceholder: {
        fontSize: 16,
        color: '#9ca3af',
    },
    optionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        maxHeight: 200,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    optionsList: {
        maxHeight: 200,
    },
    optionItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    optionText: {
        fontSize: 16,
        color: '#1f2937',
    },
    searchContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
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
    addCustomSkillButton: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
    },
    addCustomSkillText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 8,
    },
    skillChipSelected: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    skillChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    skillChipTextSelected: {
        color: '#fff',
    },
    selectedSkillsContainer: {
        marginTop: 24,
    },
    selectedSkillsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
    },
    selectedSkillItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    skillHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    skillName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1e293b',
    },
    removeSkillButton: {
        padding: 4,
    },
    levelButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    levelButton: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    levelButtonSelected: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    levelButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
    },
    levelButtonTextSelected: {
        color: '#fff',
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    goalChip: {
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
    goalChipSelected: {
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
    },
    goalChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    goalChipTextSelected: {
        color: '#fff',
    },
    goalCheckIcon: {
        marginLeft: 6,
    },
    bioInput: {
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
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
});
