import * as MuiIcons from '@mui/icons-material';
import { ReactElement, createElement } from 'react';

export default function getMuiIcon(iconName: string): ReactElement {
  const iconsMap: { [key: string]: keyof typeof MuiIcons } = {
    HomeIcon: 'Home',
    AppsOutlinedIcon: 'AppsOutlined',
    WysiwygOutlinedIcon: 'WysiwygOutlined',
    ContactMailOutlinedIcon: 'ContactMailOutlined',
    GroupsOutlinedIcon: 'GroupsOutlined',
    VpnKeyOutlinedIcon: 'VpnKeyOutlined',
    AssessmentOutlinedIcon: 'AssessmentOutlined',
    HelpOutlineIcon: 'HelpOutline',
    HowToRegOutlinedIcon: 'HowToRegOutlined',
    SchoolOutlinedIcon: 'SchoolOutlined',
  };

  const iconComponent = iconsMap[iconName] || 'HelpOutline';

  return createElement(MuiIcons[iconComponent as keyof typeof MuiIcons]);
}
