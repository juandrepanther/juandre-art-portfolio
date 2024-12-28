interface IContact {
  icon: string
  title: string
  url?: string
  email?: string
}

import faceBookIcon from '../../assets/icons/facebookIcon.png'
import instagramIcon from '../../assets/icons/instagramIcon.png'
import linkedinIcon from '../../assets/icons/linkedin.png'
import emailIcon from '../../assets/icons/emailIcon.png'

export const ContactsData: IContact[] = [
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
