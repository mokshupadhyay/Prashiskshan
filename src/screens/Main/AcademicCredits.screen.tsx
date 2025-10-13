import React, { FC, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';

interface CreditAssignment {
    id: string;
    studentId: string;
    studentName: string;
    internshipTitle: string;
    credits: number;
    maxCredits: number;
    criteria: {
        attendance: { score: number; maxScore: number; weight: number };
        performance: { score: number; maxScore: number; weight: number };
        projectWork: { score: number; maxScore: number; weight: number };
        professionalism: { score: number; maxScore: number; weight: number };
    };
    finalGrade: string;
    comments: string;
    status: 'pending' | 'awarded' | 'draft';
    submittedDate?: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    college: string;
    course: string;
    year: string;
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
}

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
            progress: 95
        },
        performance: {
            attendance: 95,
            tasksCompleted: 14,
            totalTasks: 15,
            rating: 4.5
        }
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@college.edu',
        college: 'IIT Delhi',
        course: 'Information Technology',
        year: '4th Year',
        internship: {
            title: 'Data Science Intern',
            company: 'DataCorp Analytics',
            startDate: '2024-02-01',
            duration: '6 months',
            progress: 80
        },
        performance: {
            attendance: 88,
            tasksCompleted: 10,
            totalTasks: 12,
            rating: 4.2
        }
    },
    {
        id: '3',
        name: 'Sneha Gupta',
        email: 'sneha.gupta@college.edu',
        college: 'IIT Delhi',
        course: 'Mechanical Engineering',
        year: '2nd Year',
        internship: {
            title: 'Design Engineer Intern',
            company: 'AutoTech Corp',
            startDate: '2024-01-20',
            duration: '4 months',
            progress: 70
        },
        performance: {
            attendance: 90,
            tasksCompleted: 7,
            totalTasks: 10,
            rating: 4.0
        }
    }
];

export const AcademicCredits: FC = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [creditAssignments, setCreditAssignments] = useState<CreditAssignment[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [currentAssignment, setCurrentAssignment] = useState<CreditAssignment | null>(null);

    useEffect(() => {
        loadStudents();
        loadCreditAssignments();
    }, []);

    const loadStudents = async () => {
        // Filter students from same college as mentor
        const collegeStudents = mockStudents.filter(student => student.college === (user?.college || 'IIT Delhi'));
        setStudents(collegeStudents);
    };

    const loadCreditAssignments = async () => {
        // In a real app, this would fetch from API
        const assignments: CreditAssignment[] = [];
        setCreditAssignments(assignments);
    };

    const calculateGrade = (totalScore: number, maxScore: number): string => {
        const percentage = (totalScore / maxScore) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        return 'F';
    };

    const calculateCredits = (totalScore: number, maxScore: number, maxCredits: number): number => {
        const percentage = (totalScore / maxScore) * 100;
        if (percentage >= 90) return maxCredits;
        if (percentage >= 80) return Math.floor(maxCredits * 0.9);
        if (percentage >= 70) return Math.floor(maxCredits * 0.8);
        if (percentage >= 60) return Math.floor(maxCredits * 0.7);
        if (percentage >= 50) return Math.floor(maxCredits * 0.6);
        return 0;
    };

    const openCreditAssignmentModal = (student: Student) => {
        setSelectedStudent(student);

        // Check if assignment already exists
        const existingAssignment = creditAssignments.find(assignment => assignment.studentId === student.id);

        if (existingAssignment) {
            setCurrentAssignment(existingAssignment);
        } else {
            // Create new assignment with auto-calculated scores
            const attendanceScore = Math.round((student.performance.attendance / 100) * 25);
            const performanceScore = Math.round((student.performance.rating / 5) * 25);
            const projectScore = Math.round((student.performance.tasksCompleted / student.performance.totalTasks) * 25);
            const professionalismScore = Math.round((student.internship.progress / 100) * 25);

            const totalScore = attendanceScore + performanceScore + projectScore + professionalismScore;
            const maxScore = 100;
            const maxCredits = 6; // Standard internship credits

            const newAssignment: CreditAssignment = {
                id: `assignment-${student.id}`,
                studentId: student.id,
                studentName: student.name,
                internshipTitle: student.internship.title,
                credits: calculateCredits(totalScore, maxScore, maxCredits),
                maxCredits,
                criteria: {
                    attendance: { score: attendanceScore, maxScore: 25, weight: 25 },
                    performance: { score: performanceScore, maxScore: 25, weight: 25 },
                    projectWork: { score: projectScore, maxScore: 25, weight: 25 },
                    professionalism: { score: professionalismScore, maxScore: 25, weight: 25 },
                },
                finalGrade: calculateGrade(totalScore, maxScore),
                comments: '',
                status: 'draft'
            };

            setCurrentAssignment(newAssignment);
        }

        setModalVisible(true);
    };

    const updateCriteriaScore = (criteria: keyof CreditAssignment['criteria'], score: number) => {
        if (!currentAssignment) return;

        const updatedAssignment = {
            ...currentAssignment,
            criteria: {
                ...currentAssignment.criteria,
                [criteria]: {
                    ...currentAssignment.criteria[criteria],
                    score: Math.max(0, Math.min(score, currentAssignment.criteria[criteria].maxScore))
                }
            }
        };

        // Recalculate total score, credits, and grade
        const totalScore = Object.values(updatedAssignment.criteria).reduce((sum, criterion) => sum + criterion.score, 0);
        const maxScore = Object.values(updatedAssignment.criteria).reduce((sum, criterion) => sum + criterion.maxScore, 0);

        updatedAssignment.credits = calculateCredits(totalScore, maxScore, updatedAssignment.maxCredits);
        updatedAssignment.finalGrade = calculateGrade(totalScore, maxScore);

        setCurrentAssignment(updatedAssignment);
    };

    const saveCreditAssignment = async (status: 'draft' | 'awarded') => {
        if (!currentAssignment) return;

        try {
            const updatedAssignment = {
                ...currentAssignment,
                status,
                submittedDate: status === 'awarded' ? new Date().toISOString() : undefined
            };

            // Update or add assignment
            setCreditAssignments(prev => {
                const existingIndex = prev.findIndex(assignment => assignment.studentId === currentAssignment.studentId);
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = updatedAssignment;
                    return updated;
                } else {
                    return [...prev, updatedAssignment];
                }
            });

            setModalVisible(false);
            setSelectedStudent(null);
            setCurrentAssignment(null);

            Alert.alert(
                'Success',
                status === 'awarded'
                    ? `Academic credits have been awarded to ${selectedStudent?.name}`
                    : 'Credit assignment saved as draft',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error saving credit assignment:', error);
            Alert.alert('Error', 'Failed to save credit assignment. Please try again.');
        }
    };

    const getAssignmentForStudent = (studentId: string) => {
        return creditAssignments.find(assignment => assignment.studentId === studentId);
    };

    const getStatusColor = (status: 'pending' | 'awarded' | 'draft') => {
        switch (status) {
            case 'awarded': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'draft': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const StudentCreditCard = ({ student }: { student: Student }) => {
        const assignment = getAssignmentForStudent(student.id);

        return (
            <View style={styles.studentCard}>
                <View style={styles.studentHeader}>
                    <View style={styles.studentInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                        <View style={styles.studentDetails}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.internshipTitle}>{student.internship.title}</Text>
                            <Text style={styles.courseInfo}>{student.course} • {student.year}</Text>
                        </View>
                    </View>

                    {assignment && (
                        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(assignment.status)}15` }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(assignment.status) }]}>
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.performanceMetrics}>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Attendance</Text>
                        <Text style={styles.metricValue}>{student.performance.attendance}%</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Tasks</Text>
                        <Text style={styles.metricValue}>
                            {student.performance.tasksCompleted}/{student.performance.totalTasks}
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Rating</Text>
                        <Text style={styles.metricValue}>{student.performance.rating}/5</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Progress</Text>
                        <Text style={styles.metricValue}>{student.internship.progress}%</Text>
                    </View>
                </View>

                {assignment && (
                    <View style={styles.creditInfo}>
                        <View style={styles.creditSummary}>
                            <Text style={styles.creditsText}>
                                Credits: {assignment.credits}/{assignment.maxCredits}
                            </Text>
                            <Text style={styles.gradeText}>Grade: {assignment.finalGrade}</Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.assignCreditsButton}
                    onPress={() => openCreditAssignmentModal(student)}
                >
                    <Icon name="graduation-cap" size={16} color="#fff" />
                    <Text style={styles.assignCreditsText}>
                        {assignment ? 'Edit Credits' : 'Assign Credits'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const totalStudents = students.length;
    const awardedCount = creditAssignments.filter(assignment => assignment.status === 'awarded').length;
    const pendingCount = creditAssignments.filter(assignment => assignment.status === 'pending').length;
    const draftCount = creditAssignments.filter(assignment => assignment.status === 'draft').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Academic Credits</Text>
                <Text style={styles.subtitle}>Award academic credits based on internship performance</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                    <Text style={styles.statNumber}>{awardedCount}</Text>
                    <Text style={styles.statLabel}>Awarded</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                    <Text style={styles.statNumber}>{pendingCount}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#6b7280' }]}>
                    <Text style={styles.statNumber}>{draftCount}</Text>
                    <Text style={styles.statLabel}>Drafts</Text>
                </View>
            </View>

            {/* Students List */}
            <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
                {students.map((student) => (
                    <StudentCreditCard key={student.id} student={student} />
                ))}
            </ScrollView>

            {/* Credit Assignment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    Assign Credits - {selectedStudent?.name}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="times" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            {currentAssignment && (
                                <>
                                    <Text style={styles.internshipInfo}>
                                        {currentAssignment.internshipTitle}
                                    </Text>

                                    {/* Criteria Scoring */}
                                    <View style={styles.criteriaSection}>
                                        <Text style={styles.sectionTitle}>Assessment Criteria</Text>

                                        {Object.entries(currentAssignment.criteria).map(([key, criterion]) => (
                                            <View key={key} style={styles.criteriaItem}>
                                                <View style={styles.criteriaHeader}>
                                                    <Text style={styles.criteriaLabel}>
                                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                    </Text>
                                                    <Text style={styles.criteriaScore}>
                                                        {criterion.score}/{criterion.maxScore}
                                                    </Text>
                                                </View>
                                                <View style={styles.scoreControls}>
                                                    <TouchableOpacity
                                                        style={styles.scoreButton}
                                                        onPress={() => updateCriteriaScore(key as keyof CreditAssignment['criteria'], criterion.score - 1)}
                                                    >
                                                        <Icon name="minus" size={16} color="#6b7280" />
                                                    </TouchableOpacity>
                                                    <View style={styles.scoreBar}>
                                                        <View
                                                            style={[
                                                                styles.scoreProgress,
                                                                { width: `${(criterion.score / criterion.maxScore) * 100}%` }
                                                            ]}
                                                        />
                                                    </View>
                                                    <TouchableOpacity
                                                        style={styles.scoreButton}
                                                        onPress={() => updateCriteriaScore(key as keyof CreditAssignment['criteria'], criterion.score + 1)}
                                                    >
                                                        <Icon name="plus" size={16} color="#6b7280" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>

                                    {/* Summary */}
                                    <View style={styles.summarySection}>
                                        <Text style={styles.sectionTitle}>Summary</Text>
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Final Grade:</Text>
                                            <Text style={[styles.summaryValue, styles.gradeValue]}>
                                                {currentAssignment.finalGrade}
                                            </Text>
                                        </View>
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Credits Awarded:</Text>
                                            <Text style={[styles.summaryValue, styles.creditsValue]}>
                                                {currentAssignment.credits}/{currentAssignment.maxCredits}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Comments */}
                                    <View style={styles.commentsSection}>
                                        <Text style={styles.sectionTitle}>Comments</Text>
                                        <TextInput
                                            style={styles.commentsInput}
                                            placeholder="Add comments about the student's performance..."
                                            value={currentAssignment.comments}
                                            onChangeText={(text) => setCurrentAssignment(prev => prev ? { ...prev, comments: text } : null)}
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                        />
                                    </View>

                                    {/* Actions */}
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.draftButton]}
                                            onPress={() => saveCreditAssignment('draft')}
                                        >
                                            <Text style={styles.draftButtonText}>Save Draft</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.awardButton]}
                                            onPress={() => saveCreditAssignment('awarded')}
                                        >
                                            <Text style={styles.awardButtonText}>Award Credits</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
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
        borderLeftWidth: 4,
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
        fontSize: 14,
        color: '#64748b',
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
    studentHeader: {
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
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    internshipTitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    courseInfo: {
        fontSize: 12,
        color: '#9ca3af',
    },
    statusBadge: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
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
    metricLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    creditInfo: {
        marginBottom: 16,
    },
    creditSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    creditsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10b981',
    },
    gradeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8b5cf6',
    },
    assignCreditsButton: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    assignCreditsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        marginRight: 16,
    },
    internshipInfo: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 24,
        textAlign: 'center',
    },
    criteriaSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    criteriaItem: {
        marginBottom: 20,
    },
    criteriaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    criteriaLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    criteriaScore: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10b981',
    },
    scoreControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    scoreButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreProgress: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 4,
    },
    summarySection: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#64748b',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    gradeValue: {
        color: '#8b5cf6',
    },
    creditsValue: {
        color: '#10b981',
    },
    commentsSection: {
        marginBottom: 24,
    },
    commentsInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
        minHeight: 100,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    draftButton: {
        backgroundColor: '#f3f4f6',
    },
    awardButton: {
        backgroundColor: '#10b981',
    },
    draftButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
    },
    awardButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
