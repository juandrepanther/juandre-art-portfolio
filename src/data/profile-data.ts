import awsImg from 'assets/icons/aws.png'
import emailIcon from 'assets/icons/emailIcon.png'
import faceBookIcon from 'assets/icons/facebookIcon.png'
import instagramIcon from 'assets/icons/instagramIcon.png'
import linkedinIcon from 'assets/icons/linkedin.png'
import reactReduxImg from 'assets/icons/reactRedux.png'
import threeJsImg from 'assets/icons/threeJsLogo.png'
import ue5Img from 'assets/icons/ue5.png'

export const sectionTitles = [
  'ABOUT ME',
  'EXPERIENCE',
  'MY SKILLS',
  'EDUCATION & COURSES',
  'CERTIFICATES'
]

export const aboutParagraphs = [
  `Full Stack Engineer with wealth of
  experience in building scalable and
  user-friendly web applications.
  Proficient in front-end and back-end
  development, utilizing various
  technologies. Proven track record of
  delivering high-quality code and
  meeting project deadlines. `,
  `
  Whatever time it will take - I will find the
  solution! Addicted from the deep
  learning and passion for the details.`
]

interface IExperienceStep {
  title: string
  place?: string
  year: string
  responsibilities: string[]
}

export const experienceSteps: IExperienceStep[] = [
  {
    title: 'FRONTEND DEVELOPER',
    place: 'IF Insurance, Latvia, Riga',
    year: '2024/06 - Current',
    responsibilities: [
      `Designing and implementing new software features, improving the existing ones.`,
      `Work with software performance tune and code optimization`,
      `Participation in the design, re-design and development of applications`
    ]
  },
  {
    title: 'FULL STACK ENGINEER',
    place: 'Supliful, Latvia, Riga',
    year: '2024/02 - 2024/03',
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
      `Developed scalable full-stack web applications using technologies like React, Typescript, Material UI and more.`,
      `Designed and implemented RESTful APIs using Node.js and Express, MongoDB for seamless data communication.`,
      `Develop modern, interactive, high-quality UI for user-facing and enterprise applications using React using modern front-end engineering tools and practices.`
    ]
  },
  {
    title: 'FULLSTACK WEB DEVELOPER',
    place: 'Freelance',
    year: '2018 - current',
    responsibilities: [
      `Developed responsive websites using HTML, CSS, and JavaScript for optimal user experience.`,
      `Optimized website performance through code optimization and use of best practices.`
    ]
  }
]

interface IMySkill {
  tech: string
}

export const mySkills: IMySkill[] = [
  { tech: 'JAVASCRIPT' },
  { tech: 'REACT' },
  { tech: 'TYPESCRIPT' },
  { tech: 'SPEC DRIVEN DEVELOPMENT' },
  { tech: 'COPILOT' },
  { tech: 'REDUX (RTK)' },
  { tech: 'MATERIAL UI' },
  { tech: 'STYLED COMPONENTS' },
  { tech: 'THREE.JS' },
  { tech: 'MONGODB' },
  { tech: 'POSTGRESQL' },
  { tech: 'NODE' },
  { tech: 'BLENDER' },
  { tech: 'UE 5' }
]

export const generalSkills =
  'Docker | Linux | Nginx | Html | css/scss | git | react/three-fiber | zustand | vite.js | cannon.js | python | Adobe XD | Figma | Express.js | Oclif | Rapier | Angular | Prisma ORM'

interface IEducationItem {
  title: string
  place: string
  year: string
}

export const educationAndCourses: IEducationItem[] = [
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

interface IContactDetail {
  title: string
  data: string
}

export const contactDetails: IContactDetail[] = [
  { title: 'Email:', data: 'juandre@inbox.lv' },
  { title: 'Website:', data: 'https://ee-ze.com/' }
]

interface ICertificate {
  title: string
  logo: string
  id?: string
  url?: string
}

export const certificatesData: ICertificate[] = [
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

interface IContactLink {
  icon: string
  title: string
  url?: string
  email?: string
}

export const contactLinks: IContactLink[] = [
  {
    icon: faceBookIcon,
    title: 'FACEBOOK',
    url: 'https://www.facebook.com/janisdregeris1/'
  },
  {
    icon: instagramIcon,
    title: 'INSTAGRAM',
    url: 'https://www.instagram.com/dregeris_janis/'
  },
  {
    icon: linkedinIcon,
    title: 'LINKEDIN',
    url: 'https://www.linkedin.com/in/j%C4%81nis-dr%C4%93%C4%A3eris-384b65236'
  },
  { icon: emailIcon, title: 'EMAIL', email: 'juandre@inbox.lv' }
]
