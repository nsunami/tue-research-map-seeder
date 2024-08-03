export interface PersonsResponseData {
  count: number
  pageInformation: PageInformation
  items: Person[]
}

export interface Person {
  pureId: number
  uuid: string
  createdBy: CreatedBy
  createdDate: Date
  modifiedBy: string
  modifiedDate: Date
  portalUrl: string
  version: string
  name: NameName
  orcid?: string
  staffOrganizationAssociations: StaffOrganizationAssociation[]
  visibility: Visibility
  identifiers: Identifier[]
  systemName: ItemSystemName
  profileInformation?: ProfileInformation[]
  titles?: ProfileInformation[]
  names?: NameElement[]
  links?: Link[]
  profilePhotos?: ProfilePhoto[]
  keywordGroups?: KeywordGroup[]
}

export enum CreatedBy {
  SyncUser = "sync_user",
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
  SynchronisedUnifiedPerson = "synchronisedUnifiedPerson",
}

export interface Type {
  uri: string
  term: NameClass
}

export interface NameClass {
  en_GB: string
  nl_NL: string
}

export enum IdentifierTypeDiscriminator {
  ClassifiedID = "ClassifiedId",
  PrimaryID = "PrimaryId",
}

export interface KeywordGroup {
  typeDiscriminator: string
  pureId: number
  logicalName: string
  name: NameClass
  classifications: Type[]
}

export interface Link {
  pureId: number
  url: string
  description: ValueClass
}

export interface ValueClass {
  nl_NL: string
}

export interface NameName {
  firstName: string
  lastName: string
}

export interface NameElement {
  pureId: number
  name: NameName
  type: Type
}

export interface ProfileInformation {
  pureId: number
  value: ValueClass
  type: Type
}

export interface ProfilePhoto {
  pureId: number
  fileId: string
  fileName: string
  mimeType: string
  size: number
  url: string
  fileStoreLocations: FileStoreLocations
  type: Type
}

export interface FileStoreLocations {}

export interface StaffOrganizationAssociation {
  typeDiscriminator: string
  pureId: number
  employmentType: Type
  organization: Organization
  emails?: Email[]
  period: Period
  primaryAssociation?: boolean
  contractType?: Type
  fte?: number
  jobDescription?: Description
  jobTitle?: Type
  staffType?: Type
}

export interface Organization {
  systemName: OrganizationSystemName
  uuid: string
}

export interface Email {
  pureId: number
  value: string
  type: Type
}

export enum OrganizationSystemName {
  Organization = "Organization",
}

export interface Period {
  startDate: Date
  endDate?: Date
}

export interface Description {
  en_GB: string
  nl_NL: string
}

export enum StaffOrganizationAssociationTypeDiscriminator {
  StaffOrganizationAssociation = "StaffOrganizationAssociation",
}

export enum ItemSystemName {
  Person = "Person",
}

export interface Visibility {
  key: Key
  description: NameClass
}

export enum Key {
  Free = "FREE",
}

export interface PageInformation {
  offset: number
  size: number
}
