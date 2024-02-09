export const section_titles = [
  'ABOUT ME',
  'EXPERIENCE',
  'MY SKILLS',
  'EDUCATION & COURSES',
  'CERTIFICATES'
]

// About Me section data

export const paragraph1 = `Fullstack Developer with wealth of
  experience in building scalable and
  user-friendly web applications.
  Proficient in front-end and back-end
  development, utilizing various
  technologies. Proven track record of
  delivering high-quality code and
  meeting project deadlines. `

export const paragraph2 = `Overall coding experience 6+ years.
  Whatever time it will take - I will find the
  solution! Addicted from the deep
  learning and passion for the details.`

// Experience section

interface IExperienceSteps {
  title: string
  place?: string
  year: string
  responsibilities: string[]
}

export const experienceSteps: IExperienceSteps[] = [
  {
    title: 'FULL STACK ENGINEER',
    place: 'Supliful, Latvia, Riga',
    year: '2024/02 - current',
    responsibilities: [
      `Developing of the new features and maintaining the existing ones for the Supliful platform.`,
      `Backend development using PostgreSQL, GraphQL, Prisma, MongoDB and more`,
      `Frontend development using Next.js, Typescript, Chakra UI and more.`
    ]
  },
  {
    title: 'SENIOR WEB DEVELOPER',
    place: 'Accenture - Baltics, Latvia, Riga',
    year: '2022/01 - 2024/01',
    responsibilities: [
      `Developed scalable full-stack web applications using technologies
      like React, Typescript, Material UI and more.`,
      `Designed and implemented RESTful APIs using Node.js and Express, MongoDB for seamless data communication.
      `,
      `Develop modern, interactive, high-quality UI for user-facing and
      enterprise applications using React using modern front-end
      engineering tools and practices.`
    ]
  },
  {
    title: 'FULLSTACK WEB DEVELOPER',
    place: 'Freelance',
    year: '2018 - current',
    responsibilities: [
      `Developed responsive websites using HTML, CSS, and JavaScript for optimal user experience.`,
      `Optimized website performance through code optimization and use of best practices.
      `
    ]
  }
  // {
  //   title: 'FORENSIC DOC EXPERT',
  //   place: 'State Border Guard HQ - Latvia',
  //   year: '2009 - 2022',
  //   responsibilities: [
  //     'Physical and Electronic Document Component Forensic Investigations. As a Software engineer Developed Full-stack Information System of world Travel documents using HTML, CSS, Vanilla JavaScript, PowerShell, VBA (Excel), XML. '
  //   ]
  // }
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
  { tech: 'STYLED COMPONENTS', level: 91 },
  { tech: 'THREE.JS', level: 70 },
  { tech: 'MONGODB', level: 70 },
  { tech: 'POSTGRESQL', level: 70 },
  { tech: 'NODE', level: 50 },
  { tech: 'BLENDER', level: 50 },
  { tech: 'UE 5', level: 45 }
]

export const generalSKills =
  'Docker | Linux | Nginx | Html | css/scss | git | react/three-fiber | zustand | vite.js | cannon.js | python | Adobe XD | Figma | Express.js | Oclif | Rapier'

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
  { title: 'Email:', data: 'juandre@inbox.lv' },
  { title: 'Website:', data: 'https://ee-ze.com/' }
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
