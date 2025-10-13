// import React from 'react';

// interface LogoIconProps {
//   variant?: 'default' | 'white' | 'gradient' | 'colored';
//   className?: string;
//   size?: number;
// }

// export const LogoIcon: React.FC<LogoIconProps> = ({
//   variant = 'default',
//   className,
//   size = 32,
// }) => {
//   const getColors = () => {
//     switch (variant) {
//       case 'white':
//         return {
//           primary: '#ffffff',
//           secondary: '#ffffff',
//           accent: '#ffffff'
//         };
//       case 'colored':
//         return {
//           primary: '#1e40af', // Blue-700
//           secondary: '#dc2626', // Red-600
//           accent: '#059669'    // Emerald-600
//         };
//       case 'gradient':
//         return {
//           primary: 'url(#vfGradient)',
//           secondary: 'url(#vfGradient)',
//           accent: 'url(#vfGradient)'
//         };
//       default:
//         return {
//           primary: 'currentColor',
//           secondary: 'currentColor',
//           accent: 'currentColor'
//         };
//     }
//   };

//   const colors = getColors();

//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 32 32"
//       fill="none"
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {variant === 'gradient' && (
//         <defs>
//           <linearGradient id="vfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#3b82f6" />
//             <stop offset="50%" stopColor="#8b5cf6" />
//             <stop offset="100%" stopColor="#06b6d4" />
//           </linearGradient>
//         </defs>
//       )}

//       {/* Background circle for better logo cohesion */}
//       <circle
//         cx="16"
//         cy="16"
//         r="15"
//         fill="none"
//         stroke={colors.accent}
//         strokeWidth="0.5"
//         opacity="0.2"
//       />

//       {/* Letter V - Clean geometric design */}
//       <path
//         d="M4 7 L7 7 L11 19 L15 7 L18 7 L12.5 23 L9.5 23 L4 7 Z"
//         fill={colors.primary}
//         stroke="none"
//       />

//       {/* Letter F - Clear and visible design */}
//       <path
//         d="M20 7 L29 7 L29 10 L23 10 L23 13 L27 13 L27 16 L23 16 L23 25 L20 25 L20 7 Z"
//         fill={colors.secondary}
//         stroke="none"
//       />

//       {/* Connecting element - represents forging/connection */}
//       <rect
//         x="16"
//         y="14.5"
//         width="6"
//         height="3"
//         rx="1.5"
//         fill={colors.accent}
//         opacity="0.7"
//       />

//       {/* Small accent dots for premium feel */}
//       <circle cx="8" cy="6" r="1" fill={colors.accent} opacity="0.6" />
//       <circle cx="26" cy="6" r="1" fill={colors.accent} opacity="0.6" />
//     </svg>
//   );
// };

// // Demo component to show different variants
// const LogoDemo: React.FC = () => {
//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">VendorForge Logo Variants</h1>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
//         <div className="text-center">
//           <div className="bg-white p-6 rounded-lg shadow-md mb-4">
//             <LogoIcon variant="default" size={64} className="text-gray-800 mx-auto" />
//           </div>
//           <p className="text-sm font-medium text-gray-600">Default</p>
//         </div>

//         <div className="text-center">
//           <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-4">
//             <LogoIcon variant="white" size={64} className="mx-auto" />
//           </div>
//           <p className="text-sm font-medium text-gray-600">White</p>
//         </div>

//         <div className="text-center">
//           <div className="bg-white p-6 rounded-lg shadow-md mb-4">
//             <LogoIcon variant="gradient" size={64} className="mx-auto" />
//           </div>
//           <p className="text-sm font-medium text-gray-600">Gradient</p>
//         </div>

//         <div className="text-center">
//           <div className="bg-white p-6 rounded-lg shadow-md mb-4">
//             <LogoIcon variant="colored" size={64} className="mx-auto" />
//           </div>
//           <p className="text-sm font-medium text-gray-600">Colored</p>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold mb-4">Different Sizes</h2>
//         <div className="flex items-center gap-6">
//           <LogoIcon variant="colored" size={24} />
//           <LogoIcon variant="colored" size={32} />
//           <LogoIcon variant="colored" size={48} />
//           <LogoIcon variant="colored" size={64} />
//           <LogoIcon variant="colored" size={96} />
//         </div>
//       </div>

//       <div className="bg-gray-900 p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-white">Dark Background Test</h2>
//         <div className="flex items-center gap-6">
//           <LogoIcon variant="white" size={48} />
//           <LogoIcon variant="gradient" size={48} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LogoDemo;
// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// interface LogoIconProps {
//   variant?: 'default' | 'white' | 'colored';
//   size?: number;
// }

// export const LogoIcon: React.FC<LogoIconProps> = ({
//   variant = 'default',
//   size = 32,
// }) => {
//   const getColors = () => {
//     switch (variant) {
//       case 'white':
//         return {
//           primary: '#ffffff',
//           secondary: '#ffffff',
//           accent: '#ffffff'
//         };
//       case 'colored':
//         return {
//           primary: '#1e40af', // Blue-700
//           secondary: '#dc2626', // Red-600
//           accent: '#059669'    // Emerald-600
//         };
//       default:
//         return {
//           primary: '#000000',
//           secondary: '#000000',
//           accent: '#000000'
//         };
//     }
//   };

//   const colors = getColors();
//   const scale = size / 32; // Scale factor based on desired size

//   const styles = StyleSheet.create({
//     container: {
//       width: size,
//       height: size,
//       position: 'relative',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },

//     // Letter V components
//     vLeftStroke: {
//       position: 'absolute',
//       width: 3 * scale,
//       height: 18 * scale,
//       backgroundColor: colors.primary,
//       left: 4 * scale,
//       top: 7 * scale,
//       transform: [{ rotate: '15deg' }],
//       borderRadius: 1.5 * scale,
//     },
//     vRightStroke: {
//       position: 'absolute',
//       width: 3 * scale,
//       height: 18 * scale,
//       backgroundColor: colors.primary,
//       right: 4 * scale,
//       top: 7 * scale,
//       transform: [{ rotate: '-15deg' }],
//       borderRadius: 1.5 * scale,
//     },

//     // Letter F components
//     fVerticalBar: {
//       position: 'absolute',
//       width: 3 * scale,
//       height: 18 * scale,
//       backgroundColor: colors.secondary,
//       right: 9 * scale,
//       top: 7 * scale,
//       borderRadius: 1.5 * scale,
//     },
//     fTopBar: {
//       position: 'absolute',
//       width: 8 * scale,
//       height: 3 * scale,
//       backgroundColor: colors.secondary,
//       right: 3 * scale,
//       top: 7 * scale,
//       borderRadius: 1.5 * scale,
//     },
//     fMiddleBar: {
//       position: 'absolute',
//       width: 6 * scale,
//       height: 3 * scale,
//       backgroundColor: colors.secondary,
//       right: 3 * scale,
//       top: 14 * scale,
//       borderRadius: 1.5 * scale,
//     },

//     // Connection element
//     connector: {
//       position: 'absolute',
//       width: 4 * scale,
//       height: 2 * scale,
//       backgroundColor: colors.accent,
//       opacity: 0.8,
//       top: 15 * scale,
//       left: 14 * scale,
//       borderRadius: 1 * scale,
//     },

//     // Accent dots
//     accentDotLeft: {
//       position: 'absolute',
//       width: 2 * scale,
//       height: 2 * scale,
//       backgroundColor: colors.accent,
//       borderRadius: 1 * scale,
//       opacity: 0.6,
//       left: 7 * scale,
//       top: 5 * scale,
//     },
//     accentDotRight: {
//       position: 'absolute',
//       width: 2 * scale,
//       height: 2 * scale,
//       backgroundColor: colors.accent,
//       borderRadius: 1 * scale,
//       opacity: 0.6,
//       right: 5 * scale,
//       top: 5 * scale,
//     },

//     // Background circle (optional)
//     backgroundCircle: {
//       position: 'absolute',
//       width: size - 2,
//       height: size - 2,
//       borderRadius: (size - 2) / 2,
//       borderWidth: 0.5,
//       borderColor: colors.accent,
//       opacity: 0.2,
//     },
//   });

//   return (
//     <View style={styles.container}>
//       {/* Background circle */}
//       <View style={styles.backgroundCircle} />

//       {/* Letter V */}
//       <View style={styles.vLeftStroke} />
//       <View style={styles.vRightStroke} />

//       {/* Letter F */}
//       <View style={styles.fVerticalBar} />
//       <View style={styles.fTopBar} />
//       <View style={styles.fMiddleBar} />

//       {/* Connection element */}
//       <View style={styles.connector} />

//       {/* Accent dots */}
//       <View style={styles.accentDotLeft} />
//       <View style={styles.accentDotRight} />
//     </View>
//   );
// };

// // Alternative simpler version without geometric complexity:
// export const SimpleLogoIcon: React.FC<LogoIconProps> = ({
//   variant = 'default',
//   size = 32,
// }) => {
//   const getColors = () => {
//     switch (variant) {
//       case 'white':
//         return { primary: '#ffffff', secondary: '#ffffff' };
//       case 'colored':
//         return { primary: '#1e40af', secondary: '#dc2626' };
//       default:
//         return { primary: '#000000', secondary: '#000000' };
//     }
//   };

//   const colors = getColors();
//   const scale = size / 32;

//   const simpleStyles = StyleSheet.create({
//     container: {
//       width: size,
//       height: size,
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     vShape: {
//       width: 0,
//       height: 0,
//       borderLeftWidth: 8 * scale,
//       borderRightWidth: 8 * scale,
//       borderBottomWidth: 16 * scale,
//       borderLeftColor: 'transparent',
//       borderRightColor: 'transparent',
//       borderBottomColor: colors.primary,
//       marginRight: 4 * scale,
//     },
//     fContainer: {
//       width: 12 * scale,
//       height: 20 * scale,
//     },
//     fVertical: {
//       width: 3 * scale,
//       height: 20 * scale,
//       backgroundColor: colors.secondary,
//       position: 'absolute',
//     },
//     fTop: {
//       width: 10 * scale,
//       height: 3 * scale,
//       backgroundColor: colors.secondary,
//       position: 'absolute',
//       top: 0,
//     },
//     fMiddle: {
//       width: 8 * scale,
//       height: 3 * scale,
//       backgroundColor: colors.secondary,
//       position: 'absolute',
//       top: 8 * scale,
//     },
//   });

//   return (
//     <View style={simpleStyles.container}>
//       <View style={simpleStyles.vShape} />
//       <View style={simpleStyles.fContainer}>
//         <View style={simpleStyles.fVertical} />
//         <View style={simpleStyles.fTop} />
//         <View style={simpleStyles.fMiddle} />
//       </View>
//     </View>
//   );
// };

// // Usage Examples:
// /*
// import { LogoIcon, SimpleLogoIcon } from './LogoIcon';

// // Regular version
// <LogoIcon variant="colored" size={50} />

// // Simple version (cleaner, easier to render)
// <SimpleLogoIcon variant="colored" size={50} />

// // In a header:
// <View style={{backgroundColor: '#1e40af', padding: 16, alignItems: 'center'}}>
//   <LogoIcon variant="white" size={40} />
// </View>
// */


// import React from 'react';
// import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

// interface LogoIconProps {
//   variant?: 'default' | 'white' | 'gradient' | 'colored';
//   size?: number;
// }

// export const LogoIcon: React.FC<LogoIconProps> = ({
//   variant = 'default',
//   size = 32,
// }) => {
//   // Colors based on variant
//   const getColors = () => {
//     switch (variant) {
//       case 'white':
//         return {
//           primary: '#ffffff',
//           secondary: '#ffffff',
//           accent: '#ffffff',
//         };
//       case 'colored':
//         return {
//           primary: '#1e40af', // Blue-700
//           secondary: '#dc2626', // Red-600
//           accent: '#059669',    // Emerald-600
//         };
//       case 'gradient':
//         return {
//           primary: 'url(#vfGradient)',
//           secondary: 'url(#vfGradient)',
//           accent: 'url(#vfGradient)',
//         };
//       default:
//         return {
//           primary: '#000000',
//           secondary: '#000000',
//           accent: '#000000',
//         };
//     }
//   };

//   const colors = getColors();

//   return (
//     <Svg
//       width={size}
//       height={size}
//       viewBox="0 0 32 32"
//       fill="none"
//     >
//       {variant === 'gradient' && (
//         <Defs>
//           <LinearGradient id="vfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <Stop offset="0%" stopColor="#3b82f6" />
//             <Stop offset="50%" stopColor="#8b5cf6" />
//             <Stop offset="100%" stopColor="#06b6d4" />
//           </LinearGradient>
//         </Defs>
//       )}

//       {/* Background circle */}
//       <Circle
//         cx="16"
//         cy="16"
//         r="15"
//         fill="none"
//         stroke={variant === 'gradient' ? 'url(#vfGradient)' : colors.accent}
//         strokeWidth={0.5}
//         opacity={0.2}
//       />

//       {/* Letter V */}
//       <Path
//         d="M4 7 L7 7 L11 19 L15 7 L18 7 L12.5 23 L9.5 23 L4 7 Z"
//         fill={variant === 'gradient' ? 'url(#vfGradient)' : colors.primary}
//         stroke="none"
//       />

//       {/* Letter F */}
//       <Path
//         d="M20 7 L29 7 L29 10 L23 10 L23 13 L27 13 L27 16 L23 16 L23 25 L20 25 L20 7 Z"
//         fill={variant === 'gradient' ? 'url(#vfGradient)' : colors.secondary}
//         stroke="none"
//       />

//       {/* Connecting element */}
//       <Rect
//         x="16"
//         y="14.5"
//         width="6"
//         height="3"
//         rx="1.5"
//         fill={variant === 'gradient' ? 'url(#vfGradient)' : colors.accent}
//         opacity={0.7}
//       />

//       {/* Accent dots */}
//       <Circle
//         cx="8"
//         cy="6"
//         r="1"
//         fill={variant === 'gradient' ? 'url(#vfGradient)' : colors.accent}
//         opacity={0.6}
//       />
//       <Circle
//         cx="26"
//         cy="6"
//         r="1"
//         fill={variant === 'gradient' ? 'url(#vfGradient)' : colors.accent}
//         opacity={0.6}
//       />
//     </Svg>
//   );
// };


// VendorForge Professional Logo Icon (Monogram VF)


import React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

export const PrashiskhanLogo: React.FC<{ variant?: 'default' | 'white' | 'gradient' | 'colored', size?: number }> = ({
  variant = 'default',
  size = 32,
}) => {
  // Colors
  const getColors = () => {
    switch (variant) {
      case 'white':
        return { text: '#fff', bg: 'transparent', border: '#fff' };
      case 'colored':
        return { text: '#fff', bg: '#1e40af', border: '#1e40af' };
      case 'gradient':
        return { text: '#fff', bg: 'url(#bgGradient)', border: 'none' };
      default:
        return { text: '#fff', bg: '#111827', border: '#111827' };
    }
  };
  const colors = getColors();

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {variant === 'gradient' && (
        <Defs>
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1e40af" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>
      )}

      {/* Background container */}
      <Rect x="1" y="1" width="30" height="30" rx="30"
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth={colors.border === 'none' ? 0 : 1}
      />

      {/* Clean "P" initial - modern and professional */}
      <Path
        d="M 10 26 L 10 8 L 19 8 Q 22 8 22 12 Q 22 18 17 18 L 10 18"
        fill="none"
        stroke={colors.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};