import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import { type CSSProperties, useState } from 'react'
import LegendToggleIcon from '@mui/icons-material/LegendToggle'
import InsightsIcon from '@mui/icons-material/Insights'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import FeedIcon from '@mui/icons-material/Feed'
import CategoryIcon from '@mui/icons-material/Category'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useNavigate } from 'react-router-dom'

const AdminSideNavBar = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(true)
    const navigate = useNavigate()
    const overviewData = [
        {
            title: 'Ứng dụng',
            icon: <LegendToggleIcon />,
            url: '/admin',
        },
        {
            title: 'Thống kê',
            icon: <InsightsIcon />,
            url: '/admin/analytic',
        },
    ]
    const managementData = [
        {
            title: 'Người dùng',
            icon: <ManageAccountsIcon />,
            url: '/admin/user',
        },
        {
            title: 'Bài đăng',
            icon: <FeedIcon />,
            url: '/admin/post',
        },
        {
            title: 'Danh mục',
            icon: <CategoryIcon />,
            url: '/admin/category',
        },
    ]

    const headingStyle: CSSProperties = {
        paddingLeft: 10,
    }

    const toggleDrawer =
        (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return
            }

            setOpen(state)
        }

    return (
        <Drawer
            anchor="left"
            variant="permanent"
            sx={{ width: 200 }}
            open={open}
            PaperProps={{ sx: { width: '10%', minWidth: 200 } }}
        >
            <Accordion
                disableGutters
                defaultExpanded
                elevation={0}
                onClick={toggleDrawer(true)}
                onKeyDown={toggleDrawer(true)}
            >
                <AccordionSummary>
                    <Typography style={headingStyle} variant={'h4'}>
                        Tổng quan
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {overviewData.map((x, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        navigate(x.url)
                                    }}
                                >
                                    <ListItemIcon>{x.icon}</ListItemIcon>
                                    <ListItemText primary={x.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters defaultExpanded elevation={0}>
                <AccordionSummary>
                    <Typography style={headingStyle} variant={'h4'}>
                        Quản lý
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {managementData.map((x, index) => (
                            <ListItem key={index} disablePadding>
                                <Accordion disableGutters elevation={0}>
                                    <AccordionSummary>
                                        <ListItemButton
                                            onClick={() => {
                                                navigate(x.url)
                                            }}
                                        >
                                            <ListItemIcon>{x.icon}</ListItemIcon>
                                            <ListItemText primary={x.title} />
                                        </ListItemButton>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List>
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <AddIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Tạo mới" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <ListIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Danh sách" />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Drawer>
    )
}

export default AdminSideNavBar
