/**
 * LandingCarousel Component
 * 
 * An intelligent carousel with the following features:
 * - Auto-scrolls every 2.5 seconds when user is not interacting
 * - Pauses auto-scroll when user manually swipes
 * - Stops completely when screen is not focused (memory optimization)
 * - Animated dot indicators
 * - Optimized for performance
 */
import React, { FC, useCallback, memo, useState, useRef, useEffect } from "react";
import { FlatList, View, Image, Dimensions, StyleSheet, ListRenderItem, Animated, Easing, AppState } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

const CompanyHiring = require('../../assets/images/company_hiring.webp');
const RecruitersSearching = require('../../assets/images/Recruiters_searching.webp');
const DashboardPeopleDigital = require('../../assets/images/Dashboard_people_digital.webp');
const Searching = require('../../assets/images/searching.webp');
const InternResume = require('../../assets/images/intern_resume.webp');
const WeAreHiring = require('../../assets/images/we_are_hiring.webp');
const MatchHive = require('../../assets/images/match_hive.webp');


const { width, height } = Dimensions.get('window');

const ITEM_SPACING = 20;
const ITEM_WIDTH = width - ITEM_SPACING * 2;
const ITEM_HEIGHT = 400;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;

const CAROUSEL_DATA = [
    { id: 3, image: DashboardPeopleDigital },
    { id: 6, image: WeAreHiring },
    { id: 5, image: InternResume },
    { id: 4, image: Searching },
    { id: 1, image: CompanyHiring },
    { id: 2, image: RecruitersSearching },
    { id: 7, image: MatchHive },
];

const CarouselItem = memo<{ item: { id: number; image: any } }>(({ item }) => (
    <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
    </View>
));

CarouselItem.displayName = 'CarouselItem';

export const LandingCarousel: FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScreenFocused, setIsScreenFocused] = useState(true);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Animated value to animate active dot
    const animatedValue = useRef(new Animated.Value(0)).current;

    const renderItem: ListRenderItem<typeof CAROUSEL_DATA[0]> = useCallback(
        ({ item }) => <CarouselItem item={item} />,
        []
    );

    const keyExtractor = useCallback(
        (item: { id: number }) => item.id.toString(),
        []
    );

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: SNAP_INTERVAL,
            offset: SNAP_INTERVAL * index,
            index,
        }),
        []
    );

    // Function to start auto-scroll
    const startAutoScroll = useCallback(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Only start if screen is focused and user is not interacting
        if (isScreenFocused && !isUserInteracting) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % CAROUSEL_DATA.length;
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: true
                    });
                    return nextIndex;
                });
            }, 2500);
        }
    }, [isScreenFocused, isUserInteracting]);

    // Function to stop auto-scroll
    const stopAutoScroll = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Function to handle user interaction start
    const handleUserInteractionStart = useCallback(() => {
        setIsUserInteracting(true);
        stopAutoScroll();

        // Clear existing timeout
        if (userInteractionTimeoutRef.current) {
            clearTimeout(userInteractionTimeoutRef.current);
        }
    }, [stopAutoScroll]);

    // Function to handle user interaction end (restart auto-scroll after delay)
    const handleUserInteractionEnd = useCallback(() => {
        // Clear existing timeout
        if (userInteractionTimeoutRef.current) {
            clearTimeout(userInteractionTimeoutRef.current);
        }

        // Re-enable auto-scroll after 3 seconds of no user interaction
        userInteractionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
        }, 3000);
    }, []);

    // Animate the active dot when currentIndex changes
    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: currentIndex,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [currentIndex, animatedValue]);

    // Start auto-scroll when conditions change
    useEffect(() => {
        if (isScreenFocused && !isUserInteracting) {
            startAutoScroll();
        } else {
            stopAutoScroll();
        }

        return stopAutoScroll;
    }, [isScreenFocused, isUserInteracting, startAutoScroll, stopAutoScroll]);

    // Handle screen focus changes (React Navigation)
    useFocusEffect(
        useCallback(() => {
            setIsScreenFocused(true);
            return () => {
                setIsScreenFocused(false);
                stopAutoScroll();
            };
        }, [stopAutoScroll])
    );

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active') {
                setIsScreenFocused(true);
            } else {
                setIsScreenFocused(false);
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAutoScroll();
            if (userInteractionTimeoutRef.current) {
                clearTimeout(userInteractionTimeoutRef.current);
            }
        };
    }, [stopAutoScroll]);

    // Update currentIndex on scroll and handle user interaction end
    const onMomentumScrollEnd = useCallback((event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / SNAP_INTERVAL);
        setCurrentIndex(newIndex);

        // User finished scrolling, start the timeout to re-enable auto-scroll
        handleUserInteractionEnd();
    }, [handleUserInteractionEnd]);

    // Handle user scroll begin (manual swiping)
    const onScrollBeginDrag = useCallback(() => {
        handleUserInteractionStart();
    }, [handleUserInteractionStart]);

    // Handle touch start (user touching the carousel)
    const onTouchStart = useCallback(() => {
        handleUserInteractionStart();
    }, [handleUserInteractionStart]);

    // Handle scroll end drag (when user releases finger but scroll continues)
    const onScrollEndDrag = useCallback(() => {
        // Don't immediately restart auto-scroll here, wait for momentum to end
        // This is handled in onMomentumScrollEnd
    }, []);

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                ref={flatListRef}
                data={CAROUSEL_DATA}
                horizontal
                pagingEnabled={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                contentContainerStyle={styles.contentContainer}
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                windowSize={5}
                initialNumToRender={2}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
                onTouchStart={onTouchStart}
            />

            {/* Animated Dot Indicators */}
            <View style={styles.dotsContainer}>
                {CAROUSEL_DATA.map((_, index) => {
                    const inputRange = [index - 1, index, index + 1];
                    // Width interpolation: active dot wider
                    const dotWidth = animatedValue.interpolate({
                        inputRange,
                        outputRange: [10, 20, 10],
                        extrapolate: 'clamp',
                    });
                    // Color interpolation: active dot darker
                    const backgroundColor = animatedValue.interpolate({
                        inputRange,
                        outputRange: ['#bbb', '#333', '#bbb'],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={`dot-${index}`}
                            style={[
                                styles.dot,
                                { width: dotWidth, backgroundColor },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
    },
    imageContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT * 6 / 7,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#fff',
        // elevation: 5,
        // shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginRight: ITEM_SPACING,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        resizeMode: 'cover',
    },
    contentContainer: {
        paddingLeft: ITEM_SPACING,
        paddingRight: 0,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
});