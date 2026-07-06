import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PhotoPickerGrid } from '../components/PhotoPickerGrid';
import {
  disciplineLabels,
  experienceLabels,
  genderLabels,
  intensityLabels,
} from '../constants/labels';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { emptyDraft, useAuthStore } from '../store/useAuthStore';
import {
  Discipline,
  ExperienceLevel,
  Gender,
  ProfileSetupDraft,
  SparringIntensity,
} from '../types';

const STEPS = ['Personal', 'Physical', 'Fighting', 'Photos'] as const;

export function ProfileSetupScreen() {
  const { completeProfile } = useAuthStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ProfileSetupDraft>(emptyDraft());

  const updateDraft = (partial: Partial<ProfileSetupDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const toggleDiscipline = (d: Discipline) => {
    const disciplines = draft.disciplines.includes(d)
      ? draft.disciplines.filter((x) => x !== d)
      : [...draft.disciplines, d];
    updateDraft({ disciplines });
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return draft.name.trim().length > 0 && draft.age.trim().length > 0 && draft.gender !== null;
      case 1:
        return draft.heightCm.trim().length > 0 && draft.weightKg.trim().length > 0;
      case 2:
        return (
          draft.disciplines.length > 0 &&
          draft.experience !== null &&
          draft.intensity !== null
        );
      default:
        return draft.photos.length > 0;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      completeProfile(draft);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progress}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.progressItem}>
            <View style={[styles.dot, i <= step && styles.dotActive]} />
            <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {step === 0 && (
          <>
            <Text style={styles.title}>About You</Text>
            <Input
              label="Name"
              placeholder="Your name"
              value={draft.name}
              onChangeText={(name) => updateDraft({ name })}
            />
            <Input
              label="Age"
              placeholder="25"
              value={draft.age}
              onChangeText={(age) => updateDraft({ age })}
              keyboardType="number-pad"
            />
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.chipRow}>
              {Object.values(Gender).map((g) => (
                <Pressable
                  key={g}
                  style={[styles.chip, draft.gender === g && styles.chipActive]}
                  onPress={() => updateDraft({ gender: g })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      draft.gender === g && styles.chipTextActive,
                    ]}
                  >
                    {genderLabels[g]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.title}>Physical Stats</Text>
            <Text style={styles.hint}>
              Weight is crucial for safe matchmaking. Be honest — fighters cut and gain.
            </Text>
            <Input
              label="Height (cm)"
              placeholder="175"
              value={draft.heightCm}
              onChangeText={(heightCm) => updateDraft({ heightCm })}
              keyboardType="number-pad"
            />
            <Input
              label="Weight (kg)"
              placeholder="77"
              value={draft.weightKg}
              onChangeText={(weightKg) => updateDraft({ weightKg })}
              keyboardType="number-pad"
            />
            <Input
              label="Bio (optional)"
              placeholder="Tell partners about your style..."
              value={draft.bio}
              onChangeText={(bio) => updateDraft({ bio })}
              multiline
              numberOfLines={3}
              style={styles.bioInput}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Fighting Profile</Text>
            <Text style={styles.fieldLabel}>Disciplines</Text>
            <View style={styles.chipRow}>
              {Object.values(Discipline).map((d) => (
                <Pressable
                  key={d}
                  style={[
                    styles.chip,
                    draft.disciplines.includes(d) && styles.chipActive,
                  ]}
                  onPress={() => toggleDiscipline(d)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      draft.disciplines.includes(d) && styles.chipTextActive,
                    ]}
                  >
                    {disciplineLabels[d]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Experience Level</Text>
            <View style={styles.chipRow}>
              {Object.values(ExperienceLevel).map((e) => (
                <Pressable
                  key={e}
                  style={[styles.chip, draft.experience === e && styles.chipActive]}
                  onPress={() => updateDraft({ experience: e })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      draft.experience === e && styles.chipTextActive,
                    ]}
                  >
                    {experienceLabels[e]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Sparring Intensity</Text>
            <View style={styles.chipRow}>
              {Object.values(SparringIntensity).map((i) => (
                <Pressable
                  key={i}
                  style={[styles.chip, draft.intensity === i && styles.chipActive]}
                  onPress={() => updateDraft({ intensity: i })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      draft.intensity === i && styles.chipTextActive,
                    ]}
                  >
                    {intensityLabels[i]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Input
              label="Home Gym"
              placeholder="e.g. Elite Combat TLV, Kings Gym..."
              value={draft.gym}
              onChangeText={(gym) => updateDraft({ gym })}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Photos</Text>
            <Text style={styles.hint}>
              Add at least 1 photo — in gear or at the gym works best. Tap to take a photo or choose from your library.
            </Text>
            <PhotoPickerGrid
              photos={draft.photos}
              onChange={(photos) => updateDraft({ photos })}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <Button
            title="Back"
            variant="outline"
            onPress={() => setStep(step - 1)}
            style={styles.backBtn}
          />
        )}
        <Button
          title={step === STEPS.length - 1 ? 'Complete Profile' : 'Continue'}
          onPress={handleNext}
          disabled={!canProceed()}
          style={styles.nextBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.text,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
