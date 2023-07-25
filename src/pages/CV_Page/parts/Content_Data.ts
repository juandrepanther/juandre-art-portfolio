export const section_titles = [
  'ABOUT ME',
  'EXPERIENCE',
  'MY SKILLS',
  'EDUCATION & COURSES',
  'CERTIFICATES'
]

// About Me section data

export const paragraph1 =
  'Overall coding experience 5+ years. Keep forward on Interactive 3D animations mostly using Three.js and React-three-fiber libraries.'

export const paragraph2 =
  'Always Passionate about intensive deep-learning on new Technologies to expand knowledge and find most efficient solutions.'

// Experience section

interface IExperienceSteps {
  title: string
  place?: string
  year: string
  responsibilities: string[]
}

export const experienceSteps: IExperienceSteps[] = [
  {
    title: 'SENIOR ANALYST',
    place: 'Accenture - Baltics, Latvia, Riga',
    year: '2022/01 - current',
    responsibilities: [
      'Develop modern, interactive, high quality UI for user-facing and enterprise applications using React using modern front-end engineering tools and practices.',
      'Work as a member of a team specializing in design, build and test of responsive user interfaces, SPAs & websites using React framework.',
      'Integrate applications with existing tools used in a company.',
      'Work closely with the design team on creating solutions which improves business value.',
      'Work closely with client stakeholders to clarify requirements and functionality.'
    ]
  },
  {
    title: 'FREELANCE DEVELOPMENT',
    year: '2018 - 2021/12',
    responsibilities: [
      'Build Client-side from Design (Figma) and connect to back-end point.',
      'Cooperate with the client for delivering high quality web products.'
    ]
  },
  {
    title: 'FORENSIC DOC EXPERT',
    place: 'State Border Guard HQ - Latvia',
    year: '2009 - 2022',
    responsibilities: [
      'Physical and Electronic Document Component Forensic Investigations. As a Software engineer Developed Full-stack Information System of world Travel documents using HTML, CSS, Vanilla JavaScript, PowerShell, VBA (Excel), XML. '
    ]
  }
]

// My Skills Section

interface IMySkills {
  tech: string
  level: number
}

export const mySkills: IMySkills[] = [
  { tech: 'JAVASCRIPT', level: 90 },
  { tech: 'REACT', level: 88 },
  { tech: 'TYPESCRIPT', level: 80 },
  { tech: 'REDUX (RTK)', level: 85 },
  { tech: 'MATERIAL UI', level: 91 },
  { tech: 'THREE.JS', level: 70 },
  { tech: 'MONGODB', level: 70 },
  { tech: 'NODE', level: 50 },
  { tech: 'BLENDER', level: 50 },
  { tech: 'UE 5', level: 45 }
]

export const generalSKills =
  'Docker | Html | css/scss | git | react/three-fiber | zustand | vite.js | cannon.js | python | Adobe XD | Figma | Express.js | Oclif | Rapier'

// Education & Courses section

interface IEducation {
  title: string
  place: string
  year: string
}

export const educationAndCourses: IEducation[] = [
  {
    title: 'UNREAL ENGINE 5: CINEMATICS',
    place: 'Udemy',
    year: '2023'
  },
  {
    title: 'AWS CERTIFIED CLOUD PRACTITIONER',
    place: 'Baltic Computer Academy',
    year: '2022'
  },
  {
    title: 'ADVANCED REACT AND REDUX',
    place: 'Udemy',
    year: '2021'
  },
  {
    title: 'BACHELOR`S DEGREE',
    place: 'Rezekne Academy of Technologies',
    year: '2014 - 2016'
  }
]

// Contacts section

interface IContacts {
  title: string
  data: string
}

export const contact_details: IContacts[] = [
  { title: 'DOB:', data: '23/12/1989' },
  { title: 'Email:', data: 'juandre@inbox.lv' },
  { title: 'Website:', data: 'www.janisdregeris.com' }
]

// Certificates section
import awsImg from '../../../assets/icons/aws.png'
import reactReduxImg from '../../../assets/icons/reactRedux.png'
import ue5Img from '../../../assets/icons/ue5.png'
import threeJsImg from '../../../assets/icons/threeJsLogo.png'

interface ICertificates {
  title: string
  logo: string
  id?: string
  url?: string
}

export const certificates_data: ICertificates[] = [
  {
    title: 'AWS CERTIFIED CLOUD PRACTITIONER',
    logo: awsImg,
    id: 'RPJ025G1ZEFQQLWJ',
    url: 'https://aws.amazon.com/verification'
  },
  {
    title: 'REACT & REDUX',
    logo: reactReduxImg,
    url: 'https://www.udemy.com/certificate/UC-23aa18d2-dad3-442b-aa0d-643e37be6c09/'
  },
  {
    title: 'UNREAL ENGINE 5',
    logo: ue5Img,
    url: 'https://www.udemy.com/certificate/UC-675514df-9ae3-4e25-b346-cee05ed47cda/'
  },
  {
    title: 'THREE.JS JOURNEY',
    logo: threeJsImg,
    url: 'https://threejs-journey.com/certificate/view/14767'
  }
]
