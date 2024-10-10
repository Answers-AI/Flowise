'use client'
import { useState } from 'react'
import useMarketplaceLanding from '@/hooks/useMarketplaceLanding'
import PropTypes from 'prop-types'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Box,
    Chip,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
    Paper,
    Alert
} from '@mui/material'
import { useNavigate } from '@/utils/navigation'
import { IconArrowLeft, IconStar } from '@tabler/icons-react'
import MarketplaceCanvas from './MarketplaceCanvas'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ErrorBoundary from '@/ErrorBoundary'

const MarketplaceLanding = ({ templateId }) => {
    const navigate = useNavigate()
    const { isLoading, error, template } = useMarketplaceLanding(templateId)

    const [isSignInPromptOpen, setIsSignInPromptOpen] = useState(false)
    const [actionType, setActionType] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)
    const [tabValue, setTabValue] = useState(0)

    const handleAction = (type) => {
        if (type === 'new') {
            if (!template) return

            const isAgentCanvas = (template.flowData?.nodes || []).some(
                (node) => node.data.category === 'Multi Agents' || node.data.category === 'Sequential Agents'
            )
            navigate(`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}`, {
                state: {
                    templateFlowData: typeof template.flowData === 'string' ? template.flowData : JSON.stringify(template.flowData),
                    templateName: template.name,
                    parentChatflowId: template.id
                }
            })
        } else {
            setActionType(type)
            setIsSignInPromptOpen(true)
        }
    }

    const toggleFavorite = () => {
        if (isFavorite) {
            setIsFavorite(false)
        } else {
            handleAction('favorite')
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <ErrorBoundary error={error} />
    if (!template) return <div>Template not found</div>

    const renderTemplateDetails = () => (
        <>
            <Typography variant='h6' gutterBottom fontWeight='bold'>
                About this template
            </Typography>
            <Typography variant='body2' paragraph>
                {template.description}
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant='subtitle1' gutterBottom fontWeight='bold'>
                    Category
                </Typography>
                <Chip label={template.category} color='primary' />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant='subtitle1' gutterBottom fontWeight='bold'>
                    Usage Count
                </Typography>
                <Typography variant='body2'>{template.analytic ? JSON.parse(template.analytic).usageCount : 0} times</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant='subtitle1' gutterBottom fontWeight='bold'>
                    Requirements
                </Typography>
                {template.apikeyid ? (
                    <Alert severity='warning' sx={{ mt: 1 }}>
                        This flow requires personal API tokens or credentials. You must create a new flow in your account to use and
                        configure it properly.
                    </Alert>
                ) : (
                    <Typography variant='body2'>No special requirements</Typography>
                )}
            </Box>
            {template.tags && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant='subtitle1' gutterBottom fontWeight='bold'>
                        Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {template.tags.map((tag, index) => (
                            <Chip key={index} label={tag} variant='outlined' size='small' />
                        ))}
                    </Box>
                </Box>
            )}
        </>
    )

    const content = (
        <Paper
            elevation={0}
            sx={{ maxWidth: 1200, mx: 'auto', p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant='h4' component='h1' gutterBottom fontWeight='bold'>
                        {template.name}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' paragraph>
                        {template.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label={template.category} variant='outlined' size='small' color='primary' />
                        <Chip
                            label={`Used ${template.analytic ? JSON.parse(template.analytic).usageCount : 0} times`}
                            variant='outlined'
                            size='small'
                        />
                        {template.apikeyid && <Chip label='Requires Personal Tokens' color='error' size='small' />}
                    </Box>
                    <Typography variant='body2' color='text.secondary'>
                        Created on {new Date(template.createdDate).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <StyledButton color='primary' variant='contained' onClick={() => handleAction('new')}>
                        Use as New Flow
                    </StyledButton>
                    <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                        <IconButton onClick={toggleFavorite} color={isFavorite ? 'secondary' : 'default'}>
                            <IconStar />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label='Details' />
                <Tab label='Preview' />
            </Tabs>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {tabValue === 0 && renderTemplateDetails()}
                {tabValue === 1 && (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6' gutterBottom fontWeight='bold'>
                            Flow Preview
                        </Typography>
                        <Typography variant='body2' paragraph>
                            This preview shows the structure of the flow. To use and customize this template, click &quot;Use as New
                            Flow&quot; above.
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <MarketplaceCanvas template={template} />
                        </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    )

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position='static' elevation={0} color='transparent'>
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='back' sx={{ mr: 2 }} onClick={() => navigate('/chatflows')}>
                        <IconArrowLeft />
                    </IconButton>
                    <Typography variant='body1' sx={{ flexGrow: 1 }}>
                        Explore Chatflows
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component='main' sx={{ flexGrow: 1, overflow: 'hidden' }}>
                {content}
            </Box>
            <Dialog open={isSignInPromptOpen} onClose={() => setIsSignInPromptOpen(false)}>
                <DialogTitle>Quick Login Required</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'new'
                            ? "To create your personalized flow based on this template, please log in. You'll be able to customize it and add your own API keys for full functionality."
                            : "To add this flow to your favorites for easy access, please log in. You'll find all your favorite templates in one convenient place."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSignInPromptOpen(false)} color='primary'>
                        Not Now
                    </Button>
                    <Button
                        onClick={() => {
                            console.log('Redirecting to login page...')
                        }}
                        color='primary'
                        variant='contained'
                    >
                        Log In
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

MarketplaceLanding.propTypes = {
    templateId: PropTypes.string.isRequired
}

export default MarketplaceLanding
