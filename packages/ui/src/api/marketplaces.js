import client from './client'

const getAllChatflowsMarketplaces = () => client.get('/marketplaces/chatflows')
const getAllToolsMarketplaces = () => client.get('/marketplaces/tools')
const getAllTemplatesFromMarketplaces = () => client.get('/marketplaces/templates')
const getAllMarketplaceTemplates = () => client.get('/chatflows?visibility=Marketplace')
const getSpecificMarketplaceTemplate = (id) => client.get(`/chatflows/${id}`)

export default {
    getAllChatflowsMarketplaces,
    getAllToolsMarketplaces,
    getAllTemplatesFromMarketplaces,
    getAllMarketplaceTemplates,
    getSpecificMarketplaceTemplate
}
