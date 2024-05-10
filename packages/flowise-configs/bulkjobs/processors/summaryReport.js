// const summaryReport = {
//     name: 'summaryReport',
//     description: 'Creates a CSV file of all of the fields the user wants to see in a report.',
//     sourceContentTypeId: 'originalDocuments',
//     filters: {
//         'fields.typeOfDocument': 'Correspondence'
//     },
//     reportDataFields: ['date', 'typeOfDocument', 'peopleInvolved', 'shortSummary', 'evidenceSupporting', 'originalDocument']
// }

// module.exports = summaryReport

// const summaryReport = {
//     name: 'summaryReport',
//     description: 'Creates a CSV file of all of the fields the user wants to see in a report.',
//     sourceContentTypeId: 'glossaryTerms',
//     reportDataFields: [
//         'sys.id',
//         'term',
//         'definition',
//         'glossaryArticle.fields.title',
//         'glossaryArticle.sys.id',
//         'table.fields.internalTitle',
//         'table.sys.id'
//     ]
// }
const summaryReport = {
    name: 'summaryReport',
    description: 'Creates a CSV file of all of the fields the user wants to see in a report.',
    sourceContentTypeId: 'jiraSummary',
    reportDataFields: ['sys.id', 'title', 'aiSummaryAccountManagement', 'aiSummarySupport'],
    filters: {
        'fields.accountName': 'IAS Billing'
    }
}

module.exports = summaryReport