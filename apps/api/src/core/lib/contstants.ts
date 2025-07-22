import { LessonDifficulty, LessonDifficultyStats, UserStats } from '@repo/database';

export type AchievementConditionData = Pick<
  UserStats,
  | 'totalLessonsCompleted'
  | 'totalPerfectLessons'
  | 'highestOverallWPM'
  | 'highestOverallAccuracy'
  | 'currentStreak'
  | 'longestStreak'
  | 'totalExperience'
> & {
  difficultyStats: LessonDifficultyStats[];
};

export interface AchievementTemplate {
  baseId: string;
  nameTemplate: string;
  descriptionTemplate: string;
  icon?: string;
  conditionGenerator: (value: number, difficulty?: LessonDifficulty) => (data: AchievementConditionData) => boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (data: AchievementConditionData) => boolean;
  icon?: string;
}

export const ACHIEVEMENT_TEMPLATES: AchievementTemplate[] = [
  {
    baseId: 'TOTAL_LESSONS_COMPLETED',
    nameTemplate: 'Marathoner ({value})',
    descriptionTemplate: 'Complete {value} lessons.',
    conditionGenerator: (value: number) => (data) => data.totalLessonsCompleted >= value
  },
  // remake later,
  // {
  //   baseId: 'OVERALL_WPM',
  //   nameTemplate: 'Speed of Light ({value} WPM)',
  //   descriptionTemplate: 'Reach {value} WPM in any lesson.',
  //   conditionGenerator: (value: number) => (data) => data.highestOverallWPM >= value
  // },
  // {
  //   baseId: 'OVERALL_ACCURACY',
  //   nameTemplate: 'Accuracy Champion ({value}%)',
  //   descriptionTemplate: 'Achieve {value}% accuracy in any lesson (best result).',
  //   conditionGenerator: (value: number) => (data) => data.highestOverallAccuracy >= value / 100
  // },
  // {
  //   baseId: 'TOTAL_PERFECT_LESSONS',
  //   nameTemplate: 'Perfect Lessons ({value})',
  //   descriptionTemplate: 'Complete {value} lessons without any mistakes.',
  //   conditionGenerator: (value: number) => (data) => data.totalPerfectLessons >= value
  // },
  {
    baseId: 'TOTAL_EXPERIENCE',
    nameTemplate: 'Experienced User ({value} XP)',
    descriptionTemplate: 'Earn {value} XP.',
    conditionGenerator: (value: number) => (data) => data.totalExperience >= value
  },
  {
    baseId: 'STREAK',
    nameTemplate: '{value}-Day Streak',
    descriptionTemplate: 'Train for {value} consecutive days.',
    conditionGenerator: (value: number) => (data) => data.currentStreak >= value
  },
  {
    baseId: 'LONGEST_STREAK',
    nameTemplate: 'Legendary Streak ({value} Days)',
    descriptionTemplate: 'Reach a longest streak of {value} days.',
    conditionGenerator: (value: number) => (data) => data.longestStreak >= value
  },

  {
    baseId: 'DIFFICULTY_LESSONS_COMPLETED',
    nameTemplate: '{difficulty} Master ({value} Lessons)',
    descriptionTemplate: 'Complete {value} {difficulty} level lessons.',
    conditionGenerator: (value: number, difficulty?: LessonDifficulty) => (data) => {
      const stats = data.difficultyStats.find((s) => s.difficulty === difficulty);
      return stats ? stats.lessonsCompleted >= value : false;
    }
  },
  {
    baseId: 'DIFFICULTY_PERFECT_LESSONS',
    nameTemplate: 'Perfect {difficulty} ({value} Lessons)',
    descriptionTemplate: 'Complete {value} {difficulty} level lessons without mistakes.',
    conditionGenerator: (value: number, difficulty?: LessonDifficulty) => (data) => {
      const stats = data.difficultyStats.find((s) => s.difficulty === difficulty);
      return stats ? stats.perfectLessons >= value : false;
    }
  },
  {
    baseId: 'DIFFICULTY_HIGHEST_WPM',
    nameTemplate: '{difficulty} Speed Demon ({value} WPM)',
    descriptionTemplate: 'Reach {value} WPM in a {difficulty} level lesson.',
    conditionGenerator: (value: number, difficulty?: LessonDifficulty) => (data) => {
      const stats = data.difficultyStats.find((s) => s.difficulty === difficulty);
      return stats ? stats.highestWPM >= value : false;
    }
  },
  {
    baseId: 'DIFFICULTY_HIGHEST_ACCURACY',
    nameTemplate: 'Precise {difficulty} ({value}%)',
    descriptionTemplate: 'Achieve {value}% accuracy in a {difficulty} level lesson.',
    conditionGenerator: (value: number, difficulty?: LessonDifficulty) => (data) => {
      const stats = data.difficultyStats.find((s) => s.difficulty === difficulty);
      return stats ? stats.highestAccuracy >= value / 100 : false;
    }
  }
];

export const ACHIEVEMENT_TIERS: {
  templateId: string;
  values: number[];
  difficulty?: LessonDifficulty;
  customNames?: { [value: number]: string };
  customDescriptions?: { [value: number]: string };
}[] = [
  { templateId: 'TOTAL_LESSONS_COMPLETED', values: [1, 5, 10, 25, 50, 100] },
  // { templateId: 'OVERALL_WPM', values: [50, 70, 90, 110, 130] },
  // { templateId: 'OVERALL_ACCURACY', values: [98, 99, 99.5] },
  // { templateId: 'TOTAL_PERFECT_LESSONS', values: [1, 5, 10, 25, 50] },
  { templateId: 'TOTAL_EXPERIENCE', values: [1000, 5000, 10000, 50000, 100000] },
  { templateId: 'STREAK', values: [2, 7, 14, 30, 60] },
  { templateId: 'LONGEST_STREAK', values: [60, 90, 180, 365] },

  {
    templateId: 'DIFFICULTY_LESSONS_COMPLETED',
    difficulty: LessonDifficulty.BEGINNER,
    values: [5, 10, 20]
  },
  {
    templateId: 'DIFFICULTY_PERFECT_LESSONS',
    difficulty: LessonDifficulty.BEGINNER,
    values: [1, 3, 5]
  },
  {
    templateId: 'DIFFICULTY_HIGHEST_WPM',
    difficulty: LessonDifficulty.BEGINNER,
    values: [30, 40, 50]
  },
  {
    templateId: 'DIFFICULTY_HIGHEST_ACCURACY',
    difficulty: LessonDifficulty.BEGINNER,
    values: [95, 98, 99]
  },

  {
    templateId: 'DIFFICULTY_LESSONS_COMPLETED',
    difficulty: LessonDifficulty.INTERMEDIATE,
    values: [5, 10, 15]
  },
  {
    templateId: 'DIFFICULTY_PERFECT_LESSONS',
    difficulty: LessonDifficulty.INTERMEDIATE,
    values: [1, 5, 10]
  },
  {
    templateId: 'DIFFICULTY_HIGHEST_WPM',
    difficulty: LessonDifficulty.INTERMEDIATE,
    values: [50, 60, 70]
  },
  {
    templateId: 'DIFFICULTY_HIGHEST_ACCURACY',
    difficulty: LessonDifficulty.INTERMEDIATE,
    values: [97, 98, 99]
  },

  {
    templateId: 'DIFFICULTY_LESSONS_COMPLETED',
    difficulty: LessonDifficulty.ADVANCED,
    values: [5, 10, 20]
  },
  {
    templateId: 'DIFFICULTY_PERFECT_LESSONS',
    difficulty: LessonDifficulty.ADVANCED,
    values: [1, 5, 10]
  },
  {
    templateId: 'DIFFICULTY_HIGHEST_WPM',
    difficulty: LessonDifficulty.ADVANCED,
    values: [80, 100, 120]
  },
  {
    templateId: 'DIFFICULTY_HIGHEST_ACCURACY',
    difficulty: LessonDifficulty.ADVANCED,
    values: [98, 99, 99.5]
  }
];

export function generateAchievements(): Achievement[] {
  const achievements: Achievement[] = [];

  for (const tierDef of ACHIEVEMENT_TIERS) {
    const template = ACHIEVEMENT_TEMPLATES.find((t) => t.baseId === tierDef.templateId);
    if (!template) {
      console.warn(`Achievement template with baseId ${tierDef.templateId} not found.`);
      continue;
    }

    for (const value of tierDef.values) {
      const difficultySuffix = tierDef.difficulty ? `_${tierDef.difficulty.toUpperCase()}` : '';
      const id = `${template.baseId}_${value}${difficultySuffix}`.toUpperCase();

      let name = template.nameTemplate.replace('{value}', value.toString());
      let description = template.descriptionTemplate.replace('{value}', value.toString());

      if (tierDef.customNames && tierDef.customNames[value]) {
        name = tierDef.customNames[value];
      }
      if (tierDef.customDescriptions && tierDef.customDescriptions[value]) {
        description = tierDef.customDescriptions[value];
      }

      if (tierDef.difficulty) {
        name = name.replace('{difficulty}', tierDef.difficulty);
        description = description.replace('{difficulty}', tierDef.difficulty);
      }

      achievements.push({
        id: id,
        name: name,
        description: description,
        condition: template.conditionGenerator(value, tierDef.difficulty),
        icon: template.icon
      });
    }
  }

  return achievements;
}

export const ACHIEVEMENTS = generateAchievements();
