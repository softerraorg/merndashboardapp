import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import {NavLink} from 'react-router-dom';
// Testcode
export function NavigationBar() {
    return (
        <div className="navmenu-section">
            <ul>
                <li title="Home">
                    <NavLink to="/" className={({isActive}) => isActive ? 'active': ''}>
                    <HomeIcon/>
                    </NavLink>
                </li>
                <li title="Menu">
                    <NavLink to="/menu" className={({isActive}) => isActive ? 'active': ''}>
                     <MenuIcon/>
                    </NavLink>
                </li>
                <li title="Search">
                    <NavLink to="/search" className={({isActive}) => isActive ? 'active': ''}>
                        <SearchIcon/>
                    </NavLink>
                </li>
                <li title="Chat">
                    <NavLink to="/chat" className={({isActive}) => isActive ? 'active': ''}>
                        <ChatBubbleOutlineIcon/>
                    </NavLink>
                </li>
                <li title="About Us">
                    <NavLink to="/about" className={({isActive}) => isActive ? 'active': ''}>
                        <InfoIcon/>
                    </NavLink>
                </li>
                <li title="Graphs">
                    <NavLink to="/graph" className={({isActive}) => isActive ? 'active': ''}>
                        <BarChartIcon/>
                    </NavLink>
                </li>
                <li title="Statistics">
                    <NavLink to="/statistics" className={({isActive}) => isActive ? 'active': ''}>
                        <TrendingUpIcon/>
                    </NavLink>
                </li>
                    <li title="Users">
                        <NavLink to="/users" className={({isActive}) => isActive ? 'active': ''}>
                            <PeopleIcon/>
                        </NavLink>
                    </li>
                    <li title="Settings">   
                        <NavLink to="/settings" className={({isActive}) => isActive ? 'active': ''}>
                            <SettingsIcon/>
                        </NavLink>
                    </li>
                    <li title="Products">
                        <NavLink to="/products" className={({isActive}) => isActive ? 'active': ''}>
                      
                        </NavLink>
                    </li>
                    <li title="Metafields">
                        <NavLink to="/metafields" className={({isActive}) => isActive ? 'active': ''}>
                            <SettingsIcon/>
                        </NavLink>
                    </li>
            </ul>
        </div>
    )
}
