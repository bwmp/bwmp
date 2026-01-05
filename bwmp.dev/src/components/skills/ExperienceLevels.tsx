import { component$ } from '@builder.io/qwik';
import { skills, type Skill } from './TechShowcase';

interface ExperienceLevel {
  level: 'expert' | 'advanced' | 'intermediate' | 'learning';
  title: string;
  color: string;
  bgColor: string;
  description: string;
}

const experienceLevels: ExperienceLevel[] = [
  {
    level: 'expert',
    title: 'Expert',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    description: '5+ Years',
  },
  {
    level: 'advanced',
    title: 'Advanced',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    description: '3+ Years',
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    description: '2+ Years',
  },
  {
    level: 'learning',
    title: 'Learning',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    description: 'Active',
  },
];

function groupSkillsByLevel(skills: Skill[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {
    expert: [],
    advanced: [],
    intermediate: [],
    learning: [],
  };

  skills.forEach((skill) => {
    grouped[skill.level].push(skill.name);
  });

  return grouped;
}

export default component$(() => {
  const groupedSkills = groupSkillsByLevel(skills);

  return (
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {experienceLevels.map((level) => {
        const skillsForLevel = groupedSkills[level.level];
        if (skillsForLevel.length === 0) return null;

        return (
          <div key={level.level} class="text-center">
            <div class={`mb-3 rounded-full ${level.bgColor} p-4 ${level.color}`}>
              <div class="text-2xl font-bold">{level.title}</div>
            </div>
            <h4 class="mb-2 font-semibold text-gray-200">{level.description}</h4>
            <p class="text-sm text-gray-400">{skillsForLevel.join(', ')}</p>
          </div>
        );
      })}
    </div>
  );
});
