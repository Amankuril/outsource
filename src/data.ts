import avatarKundan from './assets/avatar-kundan.webp'
import avatarRohit from './assets/avatar-rohit.webp'
import hotelExterior from './assets/hotel-exterior.webp'
import hotelRestaurant from './assets/hotel-restaurant.webp'
import listingRestaurant from './assets/listing-restaurant.webp'
import postReception from './assets/post-reception.webp'

export type User = {
  id: string
  name: string
  handle: string
  avatar: string
}

export const currentUser = {
  id: 'kundan',
  name: 'Kundan Patil',
  firstName: 'Kundan',
  handle: 'Kundan',
  avatar: avatarKundan,
  role: 'Hospitality Student',
  location: 'Pune, India',
  posts: 2,
  impactPoints: 20,
  rank: 18,
  totalPoints: 482,
  weeklyRankGain: 4,
  progress: 0.64,
}

export const users: Record<string, User> = {
  rohit: { id: 'rohit', name: 'Rohit Patil', handle: 'Rohit', avatar: avatarRohit },
  kundan: { id: 'kundan', name: 'Kundar Patil', handle: 'Kundar', avatar: avatarKundan },
}

export type Post = {
  id: string
  authorId: string
  date: string
  body: string
  tags: string[]
  image?: string
  likes: number
  comments: number
  shares: number
}

export const initialPosts: Post[] = [
  {
    id: 'p1',
    authorId: 'rohit',
    date: '22 Sept 2026',
    body: 'Hello! Today is my first day of Front Office training at Regal Grand Pune.\nReally excited to learn from an amazing team and be part of the guest experience!\nAny tips for a great Start?',
    tags: ['FrontOffice', 'Training', 'HospitalityLife'],
    image: postReception,
    likes: 12,
    comments: 4,
    shares: 1,
  },
  {
    id: 'p2',
    authorId: 'kundan',
    date: '20 Sept 2026',
    body: 'TechLiniked 2026 will be here soon! Excited to connect, learn and collaborate\nWith fellow hospitality students and professionals.',
    tags: ['FrontOffice', 'Training', 'HospitalityLife'],
    likes: 12,
    comments: 4,
    shares: 250,
  },
]

export type Suggestion = {
  id: string
  kind: 'INTERNSHIP' | 'FULL-TIME'
  title: string
  company: string
  city: string
  duration: string
  image: string
}

export const suggestions: Suggestion[] = [
  {
    id: 'l1',
    kind: 'INTERNSHIP',
    title: 'Front Office Trainee',
    company: 'Regal Grand Pune',
    city: 'Pune',
    duration: '3 months',
    image: hotelExterior,
  },
  {
    id: 'l5',
    kind: 'FULL-TIME',
    title: 'F&B Associate',
    company: 'Sahara Business Hotel',
    city: 'Mumbai',
    duration: 'Permanent',
    image: hotelRestaurant,
  },
]

export const upcomingEvent = {
  id: 'e1',
  month: 'OCT',
  day: '05',
  title: 'Hospitality Careers Webiner',
  subtitle: 'Learn from industry Professiionals',
  mode: 'Online',
  time: '5:00 PM - 6:00 PM',
  going: 120,
}

export type ListingType = 'Job' | 'Internship' | 'Part-time' | 'Training'
export type ListingStatus = 'Open' | 'In Progress' | 'Completed'
export type Category =
  | 'Hotel Operations'
  | 'Guest Experience'
  | 'Sustainability'
  | 'Food & Beverage'
  | 'Travel & Tourism'
  | 'Event Management'
export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export type Listing = {
  id: string
  title: string
  company: string
  city: string
  type: ListingType
  workMode: string
  experience: string
  salary: string
  skills: string[]
  applicants: number
  posted: string
  status: ListingStatus
  category: Category
  level: Level
  image: string
  about: string
  tasks: string[]
  duration: string
  startDate: string
  openings: string
  deadline: string
  postedByMe?: boolean
}

const frontOffice: Omit<Listing, 'id'> = {
  title: 'Front Office Trainee',
  company: 'Taj Hotel',
  city: 'Pune',
  type: 'Internship',
  workMode: 'On-site',
  experience: '0-1 Years',
  salary: '₹ 12,000 / month',
  skills: ['Front Office', 'Hospitality Operations', 'Guest Service'],
  applicants: 98,
  posted: '1 day ago',
  status: 'Open',
  category: 'Hotel Operations',
  level: 'Beginner',
  image: listingRestaurant,
  about:
    'Support the front office team in delivering seamless guest experiences, assisting with check-ins, reservations\nand guest enquiries while learning hotel operations.',
  tasks: [
    'Assist with guest check-in and check-out.',
    'Handle reservations and respond to guest requests.',
    'Coordinate with housekeeping and other hotel teams.',
  ],
  duration: '6 months',
  startDate: 'Inediate',
  openings: '4 Positions',
  deadline: '30 Nov 2026',
}

export const initialListings: Listing[] = [
  { id: 'l1', ...frontOffice },
  { id: 'l2', ...frontOffice },
  { id: 'l3', ...frontOffice },
  {
    id: 'l4',
    title: 'Housekeeping Supervisor',
    company: 'Regal Grand',
    city: 'Pune',
    type: 'Job',
    workMode: 'On-site',
    experience: '1-2 Years',
    salary: '₹ 24,000 / month',
    skills: ['Housekeeping', 'Team Coordination', 'Quality Checks'],
    applicants: 41,
    posted: '3 days ago',
    status: 'Open',
    category: 'Hotel Operations',
    level: 'Intermediate',
    image: hotelExterior,
    about:
      'Lead a small housekeeping crew to keep rooms and public areas guest-ready, following brand standards and audit checklists.',
    tasks: [
      'Plan daily room assignments for the housekeeping team.',
      'Inspect rooms and public areas before guest arrival.',
      'Track linen and amenity stock with the stores team.',
    ],
    duration: 'Permanent',
    startDate: '1 Dec 2026',
    openings: '2 Positions',
    deadline: '20 Nov 2026',
  },
  {
    id: 'l5',
    title: 'F&B Associate',
    company: 'Sahara Business Hotel',
    city: 'Mumbai',
    type: 'Job',
    workMode: 'On-site',
    experience: '0-1 Years',
    salary: '₹ 18,000 / month',
    skills: ['Food Service', 'Guest Service', 'POS'],
    applicants: 64,
    posted: '2 days ago',
    status: 'Open',
    category: 'Food & Beverage',
    level: 'Beginner',
    image: hotelRestaurant,
    about:
      'Serve guests across the all-day dining restaurant and banquets, ensuring warm, efficient service at every table.',
    tasks: [
      'Take orders and serve food and beverages to guests.',
      'Set up and reset tables to brand standards.',
      'Handle billing on the restaurant POS.',
    ],
    duration: 'Permanent',
    startDate: 'Inediate',
    openings: '6 Positions',
    deadline: '15 Nov 2026',
  },
  {
    id: 'l6',
    title: 'Guest Relations Executive',
    company: 'ITC Grand Central',
    city: 'Mumbai',
    type: 'Job',
    workMode: 'On-site',
    experience: '2-3 Years',
    salary: '₹ 32,000 / month',
    skills: ['Guest Experience', 'Communication', 'Concierge'],
    applicants: 120,
    posted: '5 days ago',
    status: 'Open',
    category: 'Guest Experience',
    level: 'Intermediate',
    image: listingRestaurant,
    about:
      'Be the face of the hotel for VIP and loyalty guests, curating personalised arrival experiences and resolving feedback.',
    tasks: [
      'Welcome VIP guests and manage special requests.',
      'Follow up on guest feedback and service recovery.',
      'Coordinate experiences with the concierge desk.',
    ],
    duration: 'Permanent',
    startDate: '1 Jan 2027',
    openings: '1 Position',
    deadline: '10 Dec 2026',
  },
  {
    id: 'l7',
    title: 'Banquet Assistant',
    company: 'The Westin',
    city: 'Pune',
    type: 'Part-time',
    workMode: 'On-site',
    experience: '0-1 Years',
    salary: '₹ 600 / shift',
    skills: ['Banquets', 'Event Setup', 'Guest Service'],
    applicants: 23,
    posted: '1 week ago',
    status: 'In Progress',
    category: 'Event Management',
    level: 'Beginner',
    image: hotelRestaurant,
    about: 'Support weekend weddings and conferences with setup, service and breakdown of banquet halls.',
    tasks: [
      'Set up banquet halls as per the event order.',
      'Serve guests during plated and buffet events.',
      'Help the team with post-event breakdown.',
    ],
    duration: 'Weekends',
    startDate: 'Inediate',
    openings: '10 Positions',
    deadline: '05 Nov 2026',
  },
  {
    id: 'l8',
    title: 'Sustainability Intern',
    company: 'Lemon Tree Hotels',
    city: 'Remote',
    type: 'Internship',
    workMode: 'Remote',
    experience: '0-1 Years',
    salary: '₹ 10,000 / month',
    skills: ['Sustainability', 'Reporting', 'Research'],
    applicants: 57,
    posted: '2 weeks ago',
    status: 'Completed',
    category: 'Sustainability',
    level: 'Advanced',
    image: hotelExterior,
    about: 'Measure energy, water and waste across properties and propose practical green initiatives.',
    tasks: [
      'Collect monthly utility and waste data from hotels.',
      'Benchmark properties against green standards.',
      'Draft an initiatives report for leadership.',
    ],
    duration: '3 months',
    startDate: 'Inediate',
    openings: '2 Positions',
    deadline: '01 Nov 2026',
  },
]

// Totals shown on the type tabs (server-side counts in the design).
export const typeTabs: { label: string; type: ListingType | 'All'; count: number }[] = [
  { label: 'All', type: 'All', count: 182 },
  { label: 'Job', type: 'Job', count: 96 },
  { label: 'Internships', type: 'Internship', count: 34 },
  { label: 'Part-time', type: 'Part-time', count: 16 },
  { label: 'Training', type: 'Training', count: 0 },
]

export const statusOptions: ListingStatus[] = ['Open', 'In Progress', 'Completed']
export const categoryOptions: Category[] = [
  'Hotel Operations',
  'Guest Experience',
  'Sustainability',
  'Food & Beverage',
  'Travel & Tourism',
  'Event Management',
]
export const levelOptions: Level[] = ['Beginner', 'Intermediate', 'Advanced']

export const notifications = [
  { id: 'n1', text: 'Rohit Patil liked your post', time: '2m' },
  { id: 'n2', text: 'New internship matches your profile: Front Office Trainee', time: '1h' },
  { id: 'n3', text: 'Hospitality Careers Webiner starts on Oct 05', time: '1d' },
]
