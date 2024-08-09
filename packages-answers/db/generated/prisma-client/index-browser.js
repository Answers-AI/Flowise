
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.18.0
 * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
 */
Prisma.prismaVersion = {
  client: "5.18.0",
  engine: "4c784e32044a8a016d99474bd02a3b6123742169"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ChatAppScalarFieldEnum = {
  id: 'id',
  apiKey: 'apiKey',
  name: 'name',
  organizationId: 'organizationId',
  userId: 'userId'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  role: 'role',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  invited: 'invited',
  image: 'image',
  appSettings: 'appSettings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.ApiKeyScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  organizationId: 'organizationId',
  type: 'type',
  key: 'key'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  appSettings: 'appSettings'
};

exports.Prisma.ContextFieldScalarFieldEnum = {
  id: 'id',
  fieldId: 'fieldId',
  helpText: 'helpText',
  fieldType: 'fieldType',
  fieldTextValue: 'fieldTextValue',
  organizationId: 'organizationId',
  userId: 'userId'
};

exports.Prisma.SidekickScalarFieldEnum = {
  id: 'id',
  isGlobal: 'isGlobal',
  isSystem: 'isSystem',
  isSharedWithOrg: 'isSharedWithOrg',
  isFavoriteByDefault: 'isFavoriteByDefault',
  chatflow: 'chatflow',
  chatflowApiKey: 'chatflowApiKey',
  chatflowDomain: 'chatflowDomain',
  organizationId: 'organizationId',
  label: 'label',
  tags: 'tags',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  temperature: 'temperature',
  frequency: 'frequency',
  presence: 'presence',
  maxCompletionTokens: 'maxCompletionTokens',
  aiModel: 'aiModel',
  systemPromptTemplate: 'systemPromptTemplate',
  userPromptTemplate: 'userPromptTemplate',
  contextStringRender: 'contextStringRender',
  placeholder: 'placeholder'
};

exports.Prisma.WebDocumentScalarFieldEnum = {
  id: 'id',
  url: 'url',
  domain: 'domain',
  content: 'content',
  pageTitle: 'pageTitle',
  pageLastUpdatedAt: 'pageLastUpdatedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  source: 'source',
  title: 'title',
  domain: 'domain',
  url: 'url',
  content: 'content',
  metadata: 'metadata',
  status: 'status',
  lastSyncedAt: 'lastSyncedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentPermissionScalarFieldEnum = {
  id: 'id',
  documentId: 'documentId',
  organizationId: 'organizationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  refresh_token_expires_in: 'refresh_token_expires_in',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state',
  state: 'state',
  ok: 'ok'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.ChatScalarFieldEnum = {
  id: 'id',
  title: 'title',
  promptId: 'promptId',
  journeyId: 'journeyId',
  ownerId: 'ownerId',
  chatflowChatId: 'chatflowChatId',
  organizationId: 'organizationId',
  filters: 'filters',
  deleted: 'deleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JourneyScalarFieldEnum = {
  id: 'id',
  title: 'title',
  goal: 'goal',
  completedAt: 'completedAt',
  filters: 'filters',
  organizationId: 'organizationId',
  deleted: 'deleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PromptScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  usages: 'usages',
  likes: 'likes',
  dislikes: 'dislikes',
  deleted: 'deleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tags: 'tags'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  role: 'role',
  content: 'content',
  contextSourceFilesUsed: 'contextSourceFilesUsed',
  context: 'context',
  sidekickJson: 'sidekickJson',
  promptId: 'promptId',
  userId: 'userId',
  chatId: 'chatId',
  likes: 'likes',
  dislikes: 'dislikes',
  deleted: 'deleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  aiRequestId: 'aiRequestId'
};

exports.Prisma.MessageFeedbackScalarFieldEnum = {
  id: 'id',
  rating: 'rating',
  content: 'content',
  tags: 'tags',
  userId: 'userId',
  messageId: 'messageId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppSettingsScalarFieldEnum = {
  id: 'id',
  jiraSettingsId: 'jiraSettingsId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppServiceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  enabled: 'enabled',
  appSettingsId: 'appSettingsId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JiraSettingsScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JiraProjectSettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  enabled: 'enabled',
  jiraSettingsId: 'jiraSettingsId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiRequestScalarFieldEnum = {
  id: 'id',
  type: 'type',
  method: 'method',
  model: 'model',
  tokensUsed: 'tokensUsed',
  tokensUsedUser: 'tokensUsedUser',
  costUsdTotal: 'costUsdTotal',
  costUsdTotalUser: 'costUsdTotalUser',
  userId: 'userId',
  request: 'request',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  tokenLimit: 'tokenLimit'
};

exports.Prisma.UserPlanHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  planId: 'planId',
  renewalDate: 'renewalDate',
  tokensLeft: 'tokensLeft',
  startDate: 'startDate',
  endDate: 'endDate',
  gpt3RequestCount: 'gpt3RequestCount',
  gpt4RequestCount: 'gpt4RequestCount',
  stripeSubscriptionId: 'stripeSubscriptionId'
};

exports.Prisma.ActiveUserPlanScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  planId: 'planId',
  renewalDate: 'renewalDate',
  tokensLeft: 'tokensLeft',
  startDate: 'startDate',
  gpt3RequestCount: 'gpt3RequestCount',
  gpt4RequestCount: 'gpt4RequestCount',
  stripeSubscriptionId: 'stripeSubscriptionId',
  shouldRenew: 'shouldRenew'
};

exports.Prisma.TasksScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  completed: 'completed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.ApiKeyType = exports.$Enums.ApiKeyType = {
  USER: 'USER',
  ORGANIZATION: 'ORGANIZATION'
};

exports.Rating = exports.$Enums.Rating = {
  thumbsUp: 'thumbsUp',
  thumbsDown: 'thumbsDown'
};

exports.Prisma.ModelName = {
  ChatApp: 'ChatApp',
  User: 'User',
  ApiKey: 'ApiKey',
  Organization: 'Organization',
  ContextField: 'ContextField',
  Sidekick: 'Sidekick',
  WebDocument: 'WebDocument',
  Document: 'Document',
  DocumentPermission: 'DocumentPermission',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  Chat: 'Chat',
  Journey: 'Journey',
  Prompt: 'Prompt',
  Message: 'Message',
  MessageFeedback: 'MessageFeedback',
  AppSettings: 'AppSettings',
  AppService: 'AppService',
  JiraSettings: 'JiraSettings',
  JiraProjectSetting: 'JiraProjectSetting',
  AiRequest: 'AiRequest',
  Plan: 'Plan',
  UserPlanHistory: 'UserPlanHistory',
  ActiveUserPlan: 'ActiveUserPlan',
  Tasks: 'Tasks'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
