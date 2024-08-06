import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Select, MenuItem, List, ListItem, ListItemText, Paper, Box, Grid, Divider, useTheme, Button } from '@mui/material'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { IconEraser, IconX } from '@tabler/icons-react'
import useConfirm from '@/hooks/useConfirm'
import useNotifier from '@/utils/useNotifier'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import chatmessageApi from '@/api/chatmessage'
import { getLocalStorageChatflow, removeLocalStorageChatHistory } from '@/utils/genericHelper'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import journeysApi from '@/api/journeys'

// Hooks
import useApi from '@/hooks/useApi'

// Components
import { ChatMessage } from '../chatmessage/ChatMessage'

const JourneyDetails = () => {
    const theme = useTheme()
    const { id } = useParams()
    const dispatch = useDispatch()
    const { confirm } = useConfirm()
    const customization = useSelector((state) => state.customization)

    const [journeyDetails, setJourneyDetails] = useState(null)
    const [journeyChatflows, setJourneyChatflows] = useState([])
    const [selectedChatflow, setSelectedChatflow] = useLocalStorage(`lastSelectedChatflow_${id}`, '')
    const [isChatOpen, setIsChatOpen] = useState(false)
    const chatContainerRef = useRef(null)
    const [previews, setPreviews] = useState([])

    const getJourneyApi = useApi(journeysApi.getSpecificJourney)

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const scrollToBottom = useCallback(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [])

    const clearChat = async () => {
        console.log('Clear chat initiated')
        try {
            const confirmPayload = {
                title: `Clear Chat History`,
                description: `Are you sure you want to clear all chat history?`,
                confirmButtonName: 'Clear',
                cancelButtonName: 'Cancel'
            }
            console.log('Showing confirmation dialog')
            const isConfirmed = await confirm(confirmPayload)
            console.log('Confirmation result:', isConfirmed)

            if (isConfirmed) {
                if (!selectedChatflow) {
                    console.log('No chatflow selected')
                    enqueueSnackbar({
                        message: 'No chatflow selected',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'warning',
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </Button>
                            )
                        }
                    })
                    return
                }
                const objChatDetails = getLocalStorageChatflow(selectedChatflow)
                if (!objChatDetails.chatId) {
                    console.log('No chat history found')
                    return
                }
                console.log('Deleting chat messages')
                await chatmessageApi.deleteChatmessage(selectedChatflow, { chatId: objChatDetails.chatId, chatType: 'INTERNAL' })
                removeLocalStorageChatHistory(selectedChatflow)
                // You might need to implement resetChatDialog() function
                // resetChatDialog()
                setPreviews([])
                enqueueSnackbar({
                    message: 'Successfully cleared all chat history',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            } else {
                console.log('Chat clear cancelled by user')
            }
        } catch (error) {
            console.error('Error in clearChat:', error)
            enqueueSnackbar({
                message: error.message || 'An error occurred while clearing chat history',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    useEffect(() => {
        if (selectedChatflow) {
            setIsChatOpen(true)
        }
    }, [selectedChatflow])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [selectedChatflow, isChatOpen])

    useEffect(() => {
        scrollToBottom()
    }, [scrollToBottom, selectedChatflow, isChatOpen])

    // Add this new effect to handle initial load and updates
    useEffect(() => {
        if (getJourneyApi.data) {
            // Delay the scroll to ensure content is rendered
            setTimeout(scrollToBottom, 100)
        }
    }, [getJourneyApi.data, scrollToBottom])

    useEffect(() => {
        if (id) {
            getJourneyApi.request(id)
        }
        if (selectedChatflow) {
            setIsChatOpen(true)
        }
    }, [id, selectedChatflow])

    useEffect(() => {
        if (getJourneyApi.data) {
            setJourneyDetails(getJourneyApi.data)
            setJourneyChatflows(getJourneyApi.data.chatflows || [])

            // If there's no selected chatflow, select the first one by default
            if (!selectedChatflow && getJourneyApi.data.chatflows && getJourneyApi.data.chatflows.length > 0) {
                setSelectedChatflow(getJourneyApi.data.chatflows[0].id)
                setIsChatOpen(true)
            }
        }
    }, [getJourneyApi.data, selectedChatflow, setSelectedChatflow])

    const handleChatflowChange = (event) => {
        const selectedId = event.target.value
        setSelectedChatflow(selectedId)
        setIsChatOpen(true)
    }

    if (!journeyDetails) {
        return <Typography>Loading...</Typography>
    }

    const { documents = [], tools = [] } = journeyDetails

    return (
        <Box sx={{ flexGrow: 1, p: 3, height: 'calc(100vh - 64px)' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant='h4' gutterBottom>
                        {journeyDetails.title}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                        {journeyDetails.goal}
                    </Typography>
                </Box>
                {customization.isDarkMode ? (
                    <StyledButton
                        variant='outlined'
                        color='error'
                        title='Clear Conversation'
                        onClick={clearChat}
                        startIcon={<IconEraser />}
                    >
                        Clear Chat
                    </StyledButton>
                ) : (
                    <Button variant='outlined' color='error' title='Clear Conversation' onClick={clearChat} startIcon={<IconEraser />}>
                        Clear Chat
                    </Button>
                )}
            </Box>
            <Divider sx={{ borderColor: theme.palette.primary.main, borderWidth: 2, my: 2 }} />
            <Grid container spacing={2} sx={{ height: 'calc(100% - 50px)' }}>
                <Grid item xs={12} md={9} sx={{ height: '100%' }}>
                    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedChatflow && (
                            <Box ref={chatContainerRef} sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                                <ChatMessage
                                    open={isChatOpen}
                                    chatflowid={selectedChatflow}
                                    isAgentCanvas={false}
                                    isDialog={false}
                                    previews={previews}
                                    setPreviews={setPreviews}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                    <Paper elevation={3} sx={{ height: '100%', p: 2, overflow: 'auto' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant='subtitle1' gutterBottom>
                                Sidekicks
                            </Typography>
                            <Select fullWidth value={selectedChatflow} onChange={handleChatflowChange} displayEmpty size='small'>
                                <MenuItem value=''>
                                    <em>Select a Sidekick</em>
                                </MenuItem>
                                {journeyChatflows.map((chatflow) => (
                                    <MenuItem key={chatflow.id} value={chatflow.id}>
                                        {chatflow.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant='subtitle1' gutterBottom>
                                Document Loaders
                            </Typography>
                            <List dense>
                                {documents.map((doc, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={doc.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box>
                            <Typography variant='subtitle1' gutterBottom>
                                Tools
                            </Typography>
                            <List dense>
                                {tools.map((tool, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={tool.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <ConfirmDialog />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default JourneyDetails
