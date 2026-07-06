import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors, fontSize } from '../constants/theme';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const sizes: Record<NonNullable<AppLogoProps['size']>, TextStyle> = {
  sm: { fontSize: fontSize.lg },
  md: { fontSize: fontSize.xl },
  lg: { fontSize: fontSize.xxl },
};

export function AppLogo({ size = 'md', style }: AppLogoProps) {
  return (
    <Text style={[styles.logo, sizes[size], style]}>SparrMatch</Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    color: colors.primary,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});
