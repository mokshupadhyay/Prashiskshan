import React, { FC, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

interface AttendanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    checkInTime?: string;
    notes?: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    internshipTitle: string;
    profilePicture?: string;
}

interface CalendarDay {
    date: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    attendanceStatus?: 'present' | 'absent' | 'late';
}

const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@college.edu',
        internshipTitle: 'Frontend Developer Intern',
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@college.edu',
        internshipTitle: 'Data Science Intern',
    },
    {
        id: '3',
        name: 'Sneha Gupta',
        email: 'sneha.gupta@college.edu',
        internshipTitle: 'Digital Marketing Intern',
    },
];

export const AttendanceTracking: FC = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [notes, setNotes] = useState('');

    // Generate comprehensive mock attendance data for all students
    const generateMockAttendanceData = (): AttendanceRecord[] => {
        const allRecords: AttendanceRecord[] = [];

        // For current user if they're a student
        if (user?.role === 'student') {
            const studentRecords = Array.from({ length: 30 }, (_, index) => ({
                id: `student-${user.id}-${index}`,
                studentId: user.id || '1',
                studentName: `${user.firstName} ${user.lastName}` || 'Student Name',
                date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
                status: Math.random() > 0.85 ? 'absent' : Math.random() > 0.25 ? 'present' : 'late' as 'present' | 'absent' | 'late',
                checkInTime: Math.random() > 0.85 ? undefined : `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`,
                notes: Math.random() > 0.8 ? ['Good work', 'Traffic delay', 'Doctor appointment', 'Family emergency', 'Excellent participation'][Math.floor(Math.random() * 5)] : ''
            }));
            allRecords.push(...studentRecords);
        }

        // For all mock students (for mentor/recruiter views)
        mockStudents.forEach(student => {
            const studentRecords = Array.from({ length: 30 }, (_, index) => ({
                id: `${student.id}-${index}`,
                studentId: student.id,
                studentName: student.name,
                date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
                status: Math.random() > 0.8 ? 'absent' : Math.random() > 0.3 ? 'present' : 'late' as 'present' | 'absent' | 'late',
                checkInTime: Math.random() > 0.8 ? undefined : `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`,
                notes: Math.random() > 0.7 ? ['Good performance', 'Late due to transport', 'Medical appointment', 'Family function', 'Project work'][Math.floor(Math.random() * 5)] : ''
            }));
            allRecords.push(...studentRecords);
        });

        return allRecords;
    };

    // Generate calendar days for current month
    const generateCalendarDays = (date: Date, studentId?: string): CalendarDay[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days: CalendarDay[] = [];
        const today = new Date().toISOString().split('T')[0];

        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dateString = currentDate.toISOString().split('T')[0];
            const targetStudentId = studentId || user?.id;
            const attendanceForDate = attendanceRecords.find(record =>
                record.date === dateString && record.studentId === targetStudentId
            );

            days.push({
                date: dateString,
                day: currentDate.getDate(),
                isCurrentMonth: currentDate.getMonth() === month,
                isToday: dateString === today,
                attendanceStatus: attendanceForDate?.status
            });
        }

        return days;
    };

    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
    const [selectedStudentForMentor, setSelectedStudentForMentor] = useState<Student | null>(null);
    const [showStudentList, setShowStudentList] = useState(true);

    useEffect(() => {
        // Load students for mentor/recruiter
        if (user?.role === 'mentor' || user?.role === 'recruiter') {
            loadStudents();
        }

        // Load comprehensive attendance data
        const allAttendanceData = generateMockAttendanceData();
        setAttendanceRecords(allAttendanceData);
    }, [user?.role]);

    useEffect(() => {
        if (user?.role === 'student') {
            setCalendarDays(generateCalendarDays(currentMonth));
        } else if (user?.role === 'mentor' && selectedStudentForMentor) {
            setCalendarDays(generateCalendarDays(currentMonth, selectedStudentForMentor.id));
        }
    }, [currentMonth, attendanceRecords, selectedStudentForMentor]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const selectDate = (date: string) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };

    const loadStudents = async () => {
        // In a real app, this would fetch students assigned to this recruiter
        setStudents(mockStudents);
    };

    const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
        const currentTime = new Date().toLocaleTimeString();
        setAttendanceRecords(prev => prev.map(record =>
            record.studentId === studentId && record.date === selectedDate
                ? {
                    ...record,
                    status,
                    checkInTime: status === 'present' || status === 'late' ? currentTime : undefined
                }
                : record
        ));
    };

    const openNotesModal = (student: Student) => {
        setSelectedStudent(student);
        const existingRecord = attendanceRecords.find(
            record => record.studentId === student.id && record.date === selectedDate
        );
        setNotes(existingRecord?.notes || '');
        setModalVisible(true);
    };

    const saveNotes = () => {
        if (selectedStudent) {
            setAttendanceRecords(prev => prev.map(record =>
                record.studentId === selectedStudent.id && record.date === selectedDate
                    ? { ...record, notes }
                    : record
            ));
        }
        setModalVisible(false);
        setSelectedStudent(null);
        setNotes('');
    };

    const getAttendanceForStudent = (studentId: string) => {
        return attendanceRecords.find(
            record => record.studentId === studentId && record.date === selectedDate
        );
    };

    const getStatusColor = (status: 'present' | 'absent' | 'late') => {
        switch (status) {
            case 'present': return '#10b981';
            case 'absent': return '#ef4444';
            case 'late': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status: 'present' | 'absent' | 'late') => {
        switch (status) {
            case 'present': return 'check-circle';
            case 'absent': return 'times-circle';
            case 'late': return 'clock-o';
            default: return 'question-circle';
        }
    };

    const getAttendanceStats = (studentId?: string) => {
        const targetStudentId = studentId || user?.id;
        const studentRecords = attendanceRecords.filter(record => record.studentId === targetStudentId);

        const presentCount = studentRecords.filter(record => record.status === 'present').length;
        const lateCount = studentRecords.filter(record => record.status === 'late').length;
        const absentCount = studentRecords.filter(record => record.status === 'absent').length;
        const totalDays = presentCount + lateCount + absentCount;
        const attendanceRate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

        return { presentCount, lateCount, absentCount, attendanceRate };
    };

    const StudentAttendanceCard = ({ student }: { student: Student }) => {
        const attendance = getAttendanceForStudent(student.id);
        const isRecruiter = user?.role === 'recruiter';

        return (
            <View style={styles.studentCard}>
                <View style={styles.studentInfo}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </View>
                    <View style={styles.studentDetails}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.internshipTitle}>{student.internshipTitle}</Text>
                        {attendance?.checkInTime && (
                            <Text style={styles.checkInTime}>
                                Check-in: {attendance.checkInTime}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Only show attendance marking controls for recruiters */}
                {isRecruiter ? (
                    <View style={styles.attendanceActions}>
                        <View style={styles.statusButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    styles.presentButton,
                                    attendance?.status === 'present' && styles.activeButton
                                ]}
                                onPress={() => markAttendance(student.id, 'present')}
                            >
                                <Icon name="check" size={16} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    styles.lateButton,
                                    attendance?.status === 'late' && styles.activeButton
                                ]}
                                onPress={() => markAttendance(student.id, 'late')}
                            >
                                <Icon name="clock-o" size={16} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    styles.absentButton,
                                    attendance?.status === 'absent' && styles.activeButton
                                ]}
                                onPress={() => markAttendance(student.id, 'absent')}
                            >
                                <Icon name="times" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.notesButton}
                            onPress={() => openNotesModal(student)}
                        >
                            <Icon
                                name="sticky-note-o"
                                size={20}
                                color={attendance?.notes ? '#8b5cf6' : '#9ca3af'}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Read-only view for mentors
                    <View style={styles.readOnlyAttendanceInfo}>
                        {attendance && attendance.status !== 'absent' && (
                            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(attendance.status) }]}>
                                <Icon name={getStatusIcon(attendance.status)} size={16} color="#fff" />
                                <Text style={styles.statusText}>
                                    {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                </Text>
                            </View>
                        )}
                        {attendance?.notes && (
                            <View style={styles.readOnlyNotes}>
                                <Icon name="sticky-note-o" size={16} color="#64748b" />
                                <Text style={styles.readOnlyNotesText}>{attendance.notes}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Show status indicator for recruiter view when attendance is marked */}
                {isRecruiter && attendance && attendance.status !== 'absent' && (
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(attendance.status) }]}>
                        <Icon name={getStatusIcon(attendance.status)} size={16} color="#fff" />
                        <Text style={styles.statusText}>
                            {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    // Student's own attendance view with calendar
    const StudentAttendanceHistoryCard = ({ record }: { record: AttendanceRecord }) => (
        <View style={styles.attendanceHistoryCard}>
            <View style={styles.attendanceHistoryHeader}>
                <Text style={styles.attendanceDate}>
                    {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                    <Icon name={getStatusIcon(record.status)} size={14} color="#fff" />
                    <Text style={styles.statusBadgeText}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Text>
                </View>
            </View>

            {record.checkInTime && (
                <View style={styles.attendanceDetail}>
                    <Icon name="clock-o" size={14} color="#64748b" />
                    <Text style={styles.attendanceDetailText}>Check-in: {record.checkInTime}</Text>
                </View>
            )}

            {record.notes && (
                <View style={styles.attendanceDetail}>
                    <Icon name="sticky-note-o" size={14} color="#64748b" />
                    <Text style={styles.attendanceDetailText}>{record.notes}</Text>
                </View>
            )}
        </View>
    );

    // Calendar Day Component
    const CalendarDayComponent = ({ day }: { day: CalendarDay }) => {
        const getCalendarDayStyle = () => {
            let style = [styles.calendarDay];

            if (!day.isCurrentMonth) {
                style.push(styles.calendarDayInactive);
            }

            if (day.isToday) {
                style.push(styles.calendarDayToday);
            }

            if (day.attendanceStatus) {
                switch (day.attendanceStatus) {
                    case 'present':
                        style.push(styles.calendarDayPresent);
                        break;
                    case 'late':
                        style.push(styles.calendarDayLate);
                        break;
                    case 'absent':
                        style.push(styles.calendarDayAbsent);
                        break;
                }
            }

            return style;
        };

        return (
            <TouchableOpacity
                style={getCalendarDayStyle()}
                onPress={() => selectDate(day.date)}
                disabled={!day.isCurrentMonth}
            >
                <Text style={[
                    styles.calendarDayText,
                    !day.isCurrentMonth && styles.calendarDayTextInactive,
                    day.isToday && styles.calendarDayTextToday,
                    day.attendanceStatus && styles.calendarDayTextWithStatus
                ]}>
                    {day.day}
                </Text>
                {day.attendanceStatus && (
                    <View style={[styles.calendarStatusDot, { backgroundColor: getStatusColor(day.attendanceStatus) }]} />
                )}
            </TouchableOpacity>
        );
    };

    // Student List Component for Mentor
    const StudentListForMentor = () => (
        <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Select a Student to View Attendance</Text>
            {students.map((student) => (
                <TouchableOpacity
                    key={student.id}
                    style={styles.mentorStudentCard}
                    onPress={() => {
                        setSelectedStudentForMentor(student);
                        setShowStudentList(false);
                    }}
                >
                    <View style={styles.studentInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                        <View style={styles.studentDetails}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.internshipTitle}>{student.internshipTitle}</Text>
                            <Text style={styles.studentEmail}>{student.email}</Text>
                        </View>
                        <View style={styles.mentorStudentStats}>
                            {(() => {
                                const stats = getAttendanceStats(student.id);
                                return (
                                    <>
                                        <Text style={styles.mentorStatText}>
                                            Attendance: {stats.attendanceRate}%
                                        </Text>
                                        <View style={styles.mentorQuickStats}>
                                            <View style={[styles.mentorStatDot, { backgroundColor: '#10b981' }]} />
                                            <Text style={styles.mentorStatNumber}>{stats.presentCount}</Text>
                                            <View style={[styles.mentorStatDot, { backgroundColor: '#f59e0b' }]} />
                                            <Text style={styles.mentorStatNumber}>{stats.lateCount}</Text>
                                            <View style={[styles.mentorStatDot, { backgroundColor: '#ef4444' }]} />
                                            <Text style={styles.mentorStatNumber}>{stats.absentCount}</Text>
                                        </View>
                                    </>
                                );
                            })()}
                        </View>
                    </View>
                    <Icon name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    // Individual Student Attendance View for Mentor
    const IndividualStudentView = ({ student }: { student: Student }) => {
        const studentRecords = attendanceRecords.filter(record => record.studentId === student.id);

        return (
            <View style={styles.container}>
                {/* Student Header */}
                <View style={styles.individualStudentHeader}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            setSelectedStudentForMentor(null);
                            setShowStudentList(true);
                        }}
                    >
                        <Icon name="arrow-left" size={20} color="#3b82f6" />
                        <Text style={styles.backButtonText}>Back to Students</Text>
                    </TouchableOpacity>

                    <View style={styles.studentHeaderInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                        <View style={styles.studentHeaderDetails}>
                            <Text style={styles.studentHeaderName}>{student.name}</Text>
                            <Text style={styles.studentHeaderTitle}>{student.internshipTitle}</Text>
                            <Text style={styles.studentHeaderEmail}>{student.email}</Text>
                        </View>
                    </View>
                </View>

                {/* View Toggle */}
                <View style={styles.viewToggle}>
                    <TouchableOpacity
                        style={[styles.toggleButton, !showCalendar && styles.toggleButtonActive]}
                        onPress={() => setShowCalendar(false)}
                    >
                        <Icon name="list" size={16} color={!showCalendar ? '#fff' : '#64748b'} />
                        <Text style={[styles.toggleButtonText, !showCalendar && styles.toggleButtonTextActive]}>
                            List View
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, showCalendar && styles.toggleButtonActive]}
                        onPress={() => setShowCalendar(true)}
                    >
                        <Icon name="calendar" size={16} color={showCalendar ? '#fff' : '#64748b'} />
                        <Text style={[styles.toggleButtonText, showCalendar && styles.toggleButtonTextActive]}>
                            Calendar View
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                        <Text style={styles.statNumber}>{stats.presentCount}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                        <Text style={styles.statNumber}>{stats.lateCount}</Text>
                        <Text style={styles.statLabel}>Late</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
                        <Text style={styles.statNumber}>{stats.absentCount}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
                        <Text style={styles.statNumber}>{stats.attendanceRate}%</Text>
                        <Text style={styles.statLabel}>Rate</Text>
                    </View>
                </View>

                {/* Calendar or List View */}
                <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
                    {showCalendar ? (
                        <>
                            <CalendarComponent />
                            {/* Selected Date Details */}
                            {selectedDate && (
                                <View style={styles.selectedDateSection}>
                                    <Text style={styles.selectedDateTitle}>
                                        {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                    {(() => {
                                        const dayRecord = studentRecords.find(record => record.date === selectedDate);
                                        if (dayRecord) {
                                            return <StudentAttendanceHistoryCard record={dayRecord} />;
                                        } else {
                                            return (
                                                <View style={styles.noAttendanceCard}>
                                                    <Icon name="calendar-times-o" size={24} color="#9ca3af" />
                                                    <Text style={styles.noAttendanceText}>No attendance record for this date</Text>
                                                </View>
                                            );
                                        }
                                    })()}
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Attendance History</Text>
                            {studentRecords
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((record) => (
                                    <StudentAttendanceHistoryCard key={record.id} record={record} />
                                ))}
                        </>
                    )}
                </ScrollView>
            </View>
        );
    };

    // Calendar Component
    const CalendarComponent = () => (
        <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.calendarNavButton}>
                    <Icon name="chevron-left" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <Text style={styles.calendarMonthYear}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.calendarNavButton}>
                    <Icon name="chevron-right" size={20} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekDays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
                ))}
            </View>

            <View style={styles.calendarGrid}>
                {calendarDays.map((day, index) => (
                    <CalendarDayComponent key={`${day.date}-${index}`} day={day} />
                ))}
            </View>

            <View style={styles.calendarLegend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.legendText}>Present</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={styles.legendText}>Late</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>Absent</Text>
                </View>
            </View>
        </View>
    );

    const todayRecords = attendanceRecords.filter(record => record.date === selectedDate);
    const stats = getAttendanceStats();

    // Student View - Show their own attendance history with calendar
    if (user?.role === 'student') {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>My Attendance</Text>
                    <Text style={styles.subtitle}>Track your internship attendance record</Text>
                </View>

                {/* View Toggle */}
                <View style={styles.viewToggle}>
                    <TouchableOpacity
                        style={[styles.toggleButton, !showCalendar && styles.toggleButtonActive]}
                        onPress={() => setShowCalendar(false)}
                    >
                        <Icon name="list" size={16} color={!showCalendar ? '#fff' : '#64748b'} />
                        <Text style={[styles.toggleButtonText, !showCalendar && styles.toggleButtonTextActive]}>
                            List View
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, showCalendar && styles.toggleButtonActive]}
                        onPress={() => setShowCalendar(true)}
                    >
                        <Icon name="calendar" size={16} color={showCalendar ? '#fff' : '#64748b'} />
                        <Text style={[styles.toggleButtonText, showCalendar && styles.toggleButtonTextActive]}>
                            Calendar View
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                        <Text style={styles.statNumber}>{stats.presentCount}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                        <Text style={styles.statNumber}>{stats.lateCount}</Text>
                        <Text style={styles.statLabel}>Late</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
                        <Text style={styles.statNumber}>{stats.absentCount}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
                        <Text style={styles.statNumber}>{stats.attendanceRate}%</Text>
                        <Text style={styles.statLabel}>Rate</Text>
                    </View>
                </View>

                {/* Calendar or List View */}
                <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
                    {showCalendar ? (
                        <>
                            <CalendarComponent />
                            {/* Selected Date Details */}
                            {selectedDate && (
                                <View style={styles.selectedDateSection}>
                                    <Text style={styles.selectedDateTitle}>
                                        {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                    {(() => {
                                        const dayRecord = attendanceRecords.find(record => record.date === selectedDate);
                                        if (dayRecord) {
                                            return <StudentAttendanceHistoryCard record={dayRecord} />;
                                        } else {
                                            return (
                                                <View style={styles.noAttendanceCard}>
                                                    <Icon name="calendar-times-o" size={24} color="#9ca3af" />
                                                    <Text style={styles.noAttendanceText}>No attendance record for this date</Text>
                                                </View>
                                            );
                                        }
                                    })()}
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Attendance History</Text>
                            {attendanceRecords
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((record) => (
                                    <StudentAttendanceHistoryCard key={record.id} record={record} />
                                ))}
                        </>
                    )}
                </ScrollView>
            </View>
        );
    }

    // Mentor View - Show individual student attendance or student list
    if (user?.role === 'mentor') {
        if (selectedStudentForMentor && !showStudentList) {
            return <IndividualStudentView student={selectedStudentForMentor} />;
        }

        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Student Attendance</Text>
                    <Text style={styles.subtitle}>View attendance records of your mentees</Text>
                </View>

                <StudentListForMentor />
            </View>
        );
    }

    // Recruiter View - Show all students attendance for selected date
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Attendance Tracking</Text>
                <Text style={styles.subtitle}>Mark daily attendance for your interns</Text>
            </View>

            {/* Date Selector */}
            <View style={styles.dateSelector}>
                <Text style={styles.dateLabel}>Date:</Text>
                <TouchableOpacity style={styles.dateButton}>
                    <Icon name="calendar" size={16} color="#8b5cf6" />
                    <Text style={styles.dateText}>{selectedDate}</Text>
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                    <Text style={styles.statNumber}>{todayRecords.filter(r => r.status === 'present').length}</Text>
                    <Text style={styles.statLabel}>Present</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                    <Text style={styles.statNumber}>{todayRecords.filter(r => r.status === 'late').length}</Text>
                    <Text style={styles.statLabel}>Late</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
                    <Text style={styles.statNumber}>{todayRecords.filter(r => r.status === 'absent').length}</Text>
                    <Text style={styles.statLabel}>Absent</Text>
                </View>
            </View>

            {/* Students List */}
            <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
                {students.map((student) => (
                    <StudentAttendanceCard key={student.id} student={student} />
                ))}
            </ScrollView>

            {/* Notes Modal - Only show for recruiters */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Add Notes for {selectedStudent?.name}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icon name="times" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.notesInput}
                            placeholder="Add any notes about attendance, performance, or issues..."
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={saveNotes}
                            >
                                <Text style={styles.saveButtonText}>Save Notes</Text>
                            </TouchableOpacity>
                        </View>
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
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    dateLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginRight: 12,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 8,
    },
    dateText: {
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
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
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#8b5cf6',
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
        marginBottom: 4,
    },
    internshipTitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    checkInTime: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '500',
    },
    attendanceActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    statusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
    },
    activeButton: {
        opacity: 1,
        transform: [{ scale: 1.1 }],
    },
    presentButton: {
        backgroundColor: '#10b981',
    },
    lateButton: {
        backgroundColor: '#f59e0b',
    },
    absentButton: {
        backgroundColor: '#ef4444',
    },
    notesButton: {
        padding: 8,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 12,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
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
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        marginRight: 16,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
        minHeight: 120,
        marginBottom: 20,
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
    cancelButton: {
        backgroundColor: '#f3f4f6',
    },
    saveButton: {
        backgroundColor: '#8b5cf6',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
        marginTop: 8,
        paddingHorizontal: 4,
    },
    attendanceHistoryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    attendanceHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    attendanceDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    attendanceDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    attendanceDetailText: {
        fontSize: 14,
        color: '#64748b',
    },
    // Calendar Styles
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        margin: 20,
        borderRadius: 8,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        gap: 6,
    },
    toggleButtonActive: {
        backgroundColor: '#3b82f6',
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    toggleButtonTextActive: {
        color: '#fff',
    },
    calendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    calendarNavButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
    },
    calendarMonthYear: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    calendarWeekDays: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    calendarWeekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        paddingVertical: 8,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: width / 7 - 20 / 7,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 8,
    },
    calendarDayInactive: {
        opacity: 0.3,
    },
    calendarDayToday: {
        backgroundColor: '#3b82f6',
        borderRadius: 20,
    },
    calendarDayPresent: {
        backgroundColor: '#10b98115',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#10b981',
    },
    calendarDayLate: {
        backgroundColor: '#f59e0b15',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#f59e0b',
    },
    calendarDayAbsent: {
        backgroundColor: '#ef444415',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ef4444',
    },
    calendarDayText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1e293b',
    },
    calendarDayTextInactive: {
        color: '#9ca3af',
    },
    calendarDayTextToday: {
        color: '#fff',
        fontWeight: '700',
    },
    calendarDayTextWithStatus: {
        fontWeight: '600',
    },
    calendarStatusDot: {
        position: 'absolute',
        bottom: 2,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    calendarLegend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    selectedDateSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    selectedDateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    noAttendanceCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        gap: 8,
    },
    noAttendanceText: {
        fontSize: 16,
        color: '#9ca3af',
        textAlign: 'center',
    },
    // Mentor-specific styles
    mentorBanner: {
        backgroundColor: '#dbeafe',
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    mentorBannerText: {
        fontSize: 14,
        color: '#1e40af',
        flex: 1,
        fontWeight: '500',
    },
    readOnlyAttendanceInfo: {
        alignItems: 'flex-end',
        gap: 8,
    },
    readOnlyNotes: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
        maxWidth: 200,
    },
    readOnlyNotesText: {
        fontSize: 12,
        color: '#64748b',
        flex: 1,
    },
    // New Mentor-specific styles
    mentorStudentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mentorStudentStats: {
        alignItems: 'flex-end',
        marginLeft: 'auto',
        marginRight: 16,
    },
    mentorStatText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    mentorQuickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    mentorStatDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    mentorStatNumber: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginRight: 8,
    },
    studentEmail: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 2,
    },
    individualStudentHeader: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#3b82f6',
    },
    studentHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentHeaderDetails: {
        flex: 1,
        marginLeft: 16,
    },
    studentHeaderName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    studentHeaderTitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 2,
    },
    studentHeaderEmail: {
        fontSize: 14,
        color: '#9ca3af',
    },
});
