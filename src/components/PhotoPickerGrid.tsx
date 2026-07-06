import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { pickImageFromLibrary, takePhotoWithCamera } from '../utils/pickImage';

interface PhotoPickerGridProps {
  photos: string[];
  maxPhotos?: number;
  onChange: (photos: string[]) => void;
}

export function PhotoPickerGrid({
  photos,
  maxPhotos = 3,
  onChange,
}: PhotoPickerGridProps) {
  const handleSlotPress = (index: number) => {
    const hasPhoto = Boolean(photos[index]);

    Alert.alert('Add Photo', 'Choose a source', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const uri = await takePhotoWithCamera();
          if (uri) updatePhotoAt(index, uri);
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const uri = await pickImageFromLibrary();
          if (uri) updatePhotoAt(index, uri);
        },
      },
      ...(hasPhoto
        ? [
            {
              text: 'Remove',
              style: 'destructive' as const,
              onPress: () => {
                const next = [...photos];
                next.splice(index, 1);
                onChange(next);
              },
            },
          ]
        : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const updatePhotoAt = (index: number, uri: string) => {
    const next = [...photos];
    if (index < next.length) {
      next[index] = uri;
    } else {
      next.push(uri);
    }
    onChange(next.slice(0, maxPhotos));
  };

  return (
    <View style={styles.grid}>
      {Array.from({ length: maxPhotos }).map((_, index) => {
        const uri = photos[index];
        const isPrimary = index === 0;

        return (
          <Pressable
            key={index}
            style={[styles.slot, isPrimary && styles.primarySlot]}
            onPress={() => handleSlotPress(index)}
          >
            {uri ? (
              <>
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                <View style={styles.editBadge}>
                  <Ionicons name="camera" size={14} color={colors.text} />
                </View>
              </>
            ) : (
              <View style={styles.empty}>
                <Ionicons name="add" size={28} color={colors.textMuted} />
                {isPrimary && (
                  <Text style={styles.primaryLabel}>Main photo</Text>
                )}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  slot: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  primarySlot: {
    flex: 1.2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  primaryLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  editBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
});
