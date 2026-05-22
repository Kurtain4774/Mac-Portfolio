// ─── Edit this file to customize all portfolio content ───────────────────────

export const profile = {
  name: 'Kurtis',
  title: 'Software Engineer',
  bio: 'CS graduate from Colorado School of Mines passionate about building clean, performant web applications. I love working across the full stack and turning complex problems into intuitive user experiences.',
  school: 'Colorado School of Mines',
  location: 'Denver, CO',
  focus: 'Full-Stack Web Dev',
  // Drop your photo at public/avatar.jpg then set this to '/MacPortfolio/avatar.jpg'
  avatarUrl: '',
};

export const techStack = [
  { name: 'React', color: '#61DAFB' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Express', color: '#888888' },
  { name: 'Git', color: '#F05032' },
  { name: 'SQL', color: '#4479A1' },
  { name: 'Java', color: '#007396' },
  { name: 'C++', color: '#00599C' },
];

export const experience = [
  {
    role: 'Software Engineering Intern',
    company: 'Your Company Here',
    dates: 'May 2024 – Aug 2024',
    bullets: [
      'Built and maintained internal tooling with React and TypeScript',
      'Collaborated with a team of engineers in an Agile environment',
      'Reduced page load time by 30% through code-splitting and caching improvements',
    ],
  },
  {
    role: 'Teaching Assistant — Data Structures',
    company: 'Colorado School of Mines',
    dates: 'Jan 2023 – May 2023',
    bullets: [
      'Held weekly office hours for 40+ students on algorithms and complexity',
      'Graded assignments and provided written feedback on implementations',
    ],
  },
];

export const education = {
  school: 'Colorado School of Mines',
  degree: 'B.S. Computer Science',
  dates: '2020 – 2024',
  gpa: '3.7 / 4.0',
  notes: 'Coursework: Data Structures, Algorithms, Operating Systems, Computer Networks, Web Development, Software Engineering',
};

export const projects = [
  {
    id: 'soundsage',
    name: 'SoundSage (Sonata)',
    description: 'Mood-based music discovery powered by Spotify and Google Gemini AI. Analyzes listening habits and surfaces tracks matched to your current vibe.',
    tech: ['React', 'Gemini API', 'MongoDB', 'Spotify API'],
    github: 'https://github.com/kurtismquant/sonata',
    demo: '',
  },
  {
    id: 'tft-dualytics',
    name: 'TFT Dualytics',
    description: 'Stat tracker for Teamfight Tactics Double Up. Pull live match data, compare duo performance, and surface win-rate trends over time.',
    tech: ['React', 'Riot Games API', 'Express'],
    github: 'https://github.com/kurtismquant/tft-dualytics',
    demo: '',
  },
  {
    id: 'quoted',
    name: 'Quoted',
    description: 'Pinterest-style platform for discovering and saving quotes. Features infinite scroll, tagging, and curated user collections.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/kurtismquant/quoted',
    demo: '',
  },
  {
    id: 'habitflow',
    name: 'HabitFlow',
    description: 'Habit tracking app with streak visualization, daily reminders, and progress analytics to keep you consistently on track.',
    tech: ['React', 'TypeScript', 'Node.js'],
    github: 'https://github.com/kurtismquant/habitflow',
    demo: '',
  },
];

export const contact = {
  email: 'kurtismquant@gmail.com',
  linkedin: 'https://linkedin.com/in/kurtis',   // update with real URL
  github: 'https://github.com/kurtismquant',
};
