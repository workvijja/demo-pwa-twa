
export type Course = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
  }[]
}
// Mock data - in a real app, this would be API calls
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Jane Smith',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
    duration: '8 weeks',
    level: 'Beginner',
    image: '/course-web-dev.jpg',
    lessons: [
      { id: 'l1', title: 'Getting Started with HTML', duration: '45 min' },
      { id: 'l2', title: 'Styling with CSS', duration: '60 min' },
      { id: 'l3', title: 'JavaScript Basics', duration: '75 min' },
      { id: 'l4', title: 'Building Your First Website', duration: '90 min' },
    ]
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    instructor: 'John Doe',
    description: 'Master advanced React patterns and best practices for building scalable applications.',
    duration: '6 weeks',
    level: 'Advanced',
    image: '/course-react.jpg',
    lessons: [
      { id: 'r1', title: 'React Hooks Deep Dive', duration: '60 min' },
      { id: 'r2', title: 'Context API & State Management', duration: '75 min' },
      { id: 'r3', title: 'Performance Optimization', duration: '90 min' },
    ]
  }
];

export const getCourse = async (id: string) => {
  // Simulate API delay
  console.log(id)
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCourses[0] || null;
};

export const getCourses = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCourses;
};
