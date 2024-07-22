export interface OrganizationResponseData {
  count: number
  pageInformation: PageInformation
  items: Organization[]
}

export interface Organization {
  pureId: number
  uuid: string
  createdBy: CreatedBy
  createdDate: Date
  modifiedBy: string
  modifiedDate: Date
  portalUrl: string
  version: string
  name: Name
  type: Type
  identifiers: Identifier[]
  nameVariants: NameVariant[]
  profileInformations?: NameVariant[]
  lifecycle: Lifecycle
  keywordGroups?: KeywordGroup[]
  visibility: Visibility
  customDefinedFields: CustomDefinedFields
  systemName: SystemName
  parents?: Parent[]
  photos?: Photo[]
  previousUuids?: string[]
  addresses?: Address[]
  phoneNumbers?: Email[]
  emails?: Email[]
  webAddresses?: NameVariant[]
}

export interface Address {
  pureId: number
  addressType: Type
  addressLines?: string
  street?: string
  building: string
  postalcode: string
  city: City
  country: Type
}

export interface Type {
  uri: string
  term: Name
}

export interface Name {
  en_GB?: string
  nl_NL?: string
}

export enum City {
  CityEINDHOVEN = "EINDHOVEN",
  Eindhoven = "Eindhoven",
}

export enum CreatedBy {
  SyncUser = "sync_user",
}

export interface CustomDefinedFields {}

export interface Email {
  pureId: number
  value: string
  type: Type
}

export interface Identifier {
  typeDiscriminator: IdentifierTypeDiscriminator
  idSource?: IDSource
  value?: string
  pureId?: number
  id?: string
  type?: Type
}

export enum IDSource {
  SynchronisedUnifiedOrganisation = "synchronisedUnifiedOrganisation",
}

export enum IdentifierTypeDiscriminator {
  ClassifiedID = "ClassifiedId",
  ID = "Id",
  PrimaryID = "PrimaryId",
}

export interface KeywordGroup {
  typeDiscriminator: KeywordGroupTypeDiscriminator
  pureId: number
  logicalName: LogicalName
  name: Name
  classifications: Type[]
}

export enum LogicalName {
  Sustainabledevelopmentgoals = "sustainabledevelopmentgoals",
}

export enum KeywordGroupTypeDiscriminator {
  ClassificationsKeywordGroup = "ClassificationsKeywordGroup",
}

export interface Lifecycle {
  startDate: Date
}

export interface NameVariant {
  pureId: number
  value?: Name
  type: Type
}

export interface Parent {
  systemName: SystemName
  uuid: string
}

export enum SystemName {
  Organization = "Organization",
}

export interface Photo {
  pureId: number
  fileId: string
  fileName: string
  mimeType: string
  size: number
  url: string
  fileStoreLocations: CustomDefinedFields
  type?: Type
}

export interface Visibility {
  key: Key
  description: Name
}

export enum Key {
  Free = "FREE",
}

export interface PageInformation {
  offset: number
  size: number
}
