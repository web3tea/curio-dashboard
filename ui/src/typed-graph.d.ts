export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ActorID: { input: any; output: any; }
  Address: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  ByteArray: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONB: { input: any; output: any; }
  Time: { input: any; output: any; }
};

export type Actor = {
  __typename?: 'Actor';
  actorAvailableBalance: Scalars['BigInt']['output'];
  actorBalance: Scalars['BigInt']['output'];
  address: Scalars['Address']['output'];
  deadlines?: Maybe<Array<Maybe<ActorDeadline>>>;
  layers?: Maybe<Array<Scalars['String']['output']>>;
  qualityAdjustedPower: Scalars['BigInt']['output'];
  rawBytePower: Scalars['BigInt']['output'];
  workerBalance: Scalars['BigInt']['output'];
};

export type ActorDeadline = {
  __typename?: 'ActorDeadline';
  current: Scalars['Boolean']['output'];
  empty: Scalars['Boolean']['output'];
  faulty: Scalars['Boolean']['output'];
  partFaulty: Scalars['Boolean']['output'];
  proven: Scalars['Boolean']['output'];
};

export type Alert = {
  __typename?: 'Alert';
  id: Scalars['Int']['output'];
  machineName: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Config = {
  __typename?: 'Config';
  config: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  usedBy: Array<Maybe<MachineDetail>>;
};

export type Machine = {
  __typename?: 'Machine';
  cpu: Scalars['Int']['output'];
  detail?: Maybe<MachineDetail>;
  gpu: Scalars['Float']['output'];
  hostAndPort: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastContact: Scalars['Time']['output'];
  ram: Scalars['Int']['output'];
  taskHistories?: Maybe<Array<Maybe<TaskHistory>>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
};


export type MachineTaskHistoriesArgs = {
  last: Scalars['Int']['input'];
};

export type MachineDetail = {
  __typename?: 'MachineDetail';
  id: Scalars['Int']['output'];
  layers: Scalars['String']['output'];
  layersArray?: Maybe<Array<Scalars['String']['output']>>;
  machineId: Scalars['Int']['output'];
  machineName: Scalars['String']['output'];
  miners: Scalars['String']['output'];
  minersArray?: Maybe<Array<Scalars['String']['output']>>;
  startupTime: Scalars['Time']['output'];
  tasks: Scalars['String']['output'];
  tasksArray?: Maybe<Array<Scalars['String']['output']>>;
};

export type MachineSummary = {
  __typename?: 'MachineSummary';
  total: Scalars['Int']['output'];
  totalCpu: Scalars['Int']['output'];
  totalDown: Scalars['Int']['output'];
  totalGpu: Scalars['Float']['output'];
  totalRam: Scalars['Int']['output'];
  totalUp: Scalars['Int']['output'];
  uniqueHostsDown: Scalars['Int']['output'];
  uniqueHostsTotal: Scalars['Int']['output'];
  uniqueHostsUp: Scalars['Int']['output'];
};

export type MetricsActiveTask = {
  __typename?: 'MetricsActiveTask';
  name: Scalars['String']['output'];
  series?: Maybe<Array<Array<Scalars['Float']['output']>>>;
};

export type Miner = {
  __typename?: 'Miner';
  availableBalance?: Maybe<Scalars['BigInt']['output']>;
  info?: Maybe<MinerInfo>;
  power?: Maybe<PowerClaim>;
};

export type MinerBeneficiaryTerm = {
  __typename?: 'MinerBeneficiaryTerm';
  expiration: Scalars['Int']['output'];
  quota: Scalars['BigInt']['output'];
  usedQuota: Scalars['Int']['output'];
};

export type MinerInfo = {
  __typename?: 'MinerInfo';
  beneficiary: Scalars['Address']['output'];
  beneficiaryTerm?: Maybe<MinerBeneficiaryTerm>;
  consensusFaultElapsed: Scalars['Int']['output'];
  controlAddresses?: Maybe<Array<Scalars['Address']['output']>>;
  multiAddrs?: Maybe<Array<Scalars['String']['output']>>;
  newWorker: Scalars['Address']['output'];
  owner: Scalars['Address']['output'];
  peerId?: Maybe<Scalars['String']['output']>;
  pendingBeneficiaryChange?: Maybe<MinerPendingBeneficiaryChange>;
  pendingOwnerAddress?: Maybe<Scalars['Address']['output']>;
  sectorSize: Scalars['Int']['output'];
  windowPoStPartitionSectors: Scalars['Int']['output'];
  windowPoStProofType: Scalars['Int']['output'];
  worker: Scalars['Address']['output'];
  workerChangeEpoch: Scalars['Int']['output'];
};

export type MinerPendingBeneficiaryChange = {
  __typename?: 'MinerPendingBeneficiaryChange';
  approvedByBeneficiary: Scalars['Boolean']['output'];
  approvedByNominee: Scalars['Boolean']['output'];
  newBeneficiary?: Maybe<Scalars['Address']['output']>;
  newExpiration: Scalars['Int']['output'];
  newQuota: Scalars['BigInt']['output'];
};

export type MiningSummaryDay = {
  __typename?: 'MiningSummaryDay';
  day: Scalars['Time']['output'];
  sp_id: Scalars['ActorID']['output'];
  won: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createConfig?: Maybe<Config>;
  updateConfig?: Maybe<Config>;
};


export type MutationCreateConfigArgs = {
  config: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationUpdateConfigArgs = {
  config: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type NodeInfo = {
  __typename?: 'NodeInfo';
  address: Scalars['String']['output'];
  behind: Scalars['Int']['output'];
  epoch: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  peersToPublishBlocks: Scalars['Int']['output'];
  peersToPublishMsgs: Scalars['Int']['output'];
  reachability: Scalars['Boolean']['output'];
  version: Scalars['String']['output'];
};

export type OpenSectorPiece = {
  __typename?: 'OpenSectorPiece';
  createdAt: Scalars['Time']['output'];
  dataDeleteOnFinalize: Scalars['Boolean']['output'];
  dataHeaders: Scalars['JSON']['output'];
  dataRawSize: Scalars['Int']['output'];
  dataURL: Scalars['String']['output'];
  directEndEpoch?: Maybe<Scalars['Int']['output']>;
  directPieceActivationManifest?: Maybe<Scalars['JSON']['output']>;
  directStartEpoch?: Maybe<Scalars['Int']['output']>;
  f05DealEndEpoch?: Maybe<Scalars['Int']['output']>;
  f05DealID?: Maybe<Scalars['Int']['output']>;
  f05DealProposal?: Maybe<Scalars['JSON']['output']>;
  f05DealStartEpoch?: Maybe<Scalars['Int']['output']>;
  f05PublishCID?: Maybe<Scalars['String']['output']>;
  isSnap: Scalars['Boolean']['output'];
  pieceCID: Scalars['String']['output'];
  pieceIndex: Scalars['Int']['output'];
  pieceSize: Scalars['Int']['output'];
  sectorNumber: Scalars['Int']['output'];
  spID: Scalars['ActorID']['output'];
};

export type Pipeline = {
  __typename?: 'Pipeline';
  afterCommitMsg: Scalars['Boolean']['output'];
  afterCommitMsgSuccess: Scalars['Boolean']['output'];
  afterFinalize: Scalars['Boolean']['output'];
  afterMoveStorage: Scalars['Boolean']['output'];
  afterPorep: Scalars['Boolean']['output'];
  afterPrecommitMsg: Scalars['Boolean']['output'];
  afterPrecommitMsgSuccess: Scalars['Boolean']['output'];
  afterSdr: Scalars['Boolean']['output'];
  afterSynth: Scalars['Boolean']['output'];
  afterTreeC: Scalars['Boolean']['output'];
  afterTreeD: Scalars['Boolean']['output'];
  afterTreeR: Scalars['Boolean']['output'];
  commitMsgCid?: Maybe<Scalars['String']['output']>;
  commitMsgTsk?: Maybe<Scalars['ByteArray']['output']>;
  createTime: Scalars['Time']['output'];
  currentTask?: Maybe<Task>;
  failed: Scalars['Boolean']['output'];
  failedAt?: Maybe<Scalars['Time']['output']>;
  failedReason: Scalars['String']['output'];
  failedReasonMsg: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  porepProof?: Maybe<Scalars['ByteArray']['output']>;
  precommitMsgCid?: Maybe<Scalars['String']['output']>;
  precommitMsgTsk?: Maybe<Scalars['ByteArray']['output']>;
  regSealProof: Scalars['Int']['output'];
  sectorNumber: Scalars['Int']['output'];
  seedEpoch?: Maybe<Scalars['Int']['output']>;
  seedValue?: Maybe<Scalars['ByteArray']['output']>;
  spId: Scalars['ActorID']['output'];
  status: PipelineStatus;
  taskIdCommitMsg?: Maybe<Scalars['Int']['output']>;
  taskIdFinalize?: Maybe<Scalars['Int']['output']>;
  taskIdMoveStorage?: Maybe<Scalars['Int']['output']>;
  taskIdPorep?: Maybe<Scalars['Int']['output']>;
  taskIdPrecommitMsg?: Maybe<Scalars['Int']['output']>;
  taskIdSdr?: Maybe<Scalars['Int']['output']>;
  taskIdSynth?: Maybe<Scalars['Int']['output']>;
  taskIdTreeC?: Maybe<Scalars['Int']['output']>;
  taskIdTreeD?: Maybe<Scalars['Int']['output']>;
  taskIdTreeR?: Maybe<Scalars['Int']['output']>;
  ticketEpoch?: Maybe<Scalars['Int']['output']>;
  ticketValue?: Maybe<Scalars['ByteArray']['output']>;
  treeDCid?: Maybe<Scalars['String']['output']>;
  treeRCid?: Maybe<Scalars['String']['output']>;
};

export enum PipelineStatus {
  ClearCache = 'ClearCache',
  CommitMsg = 'CommitMsg',
  CommitMsgWait = 'CommitMsgWait',
  Failed = 'Failed',
  MoveStorage = 'MoveStorage',
  PoRep = 'PoRep',
  PreCommitMsg = 'PreCommitMsg',
  PreCommitMsgWait = 'PreCommitMsgWait',
  Sdr = 'SDR',
  Success = 'Success',
  Synthetic = 'Synthetic',
  TreeD = 'TreeD',
  TreeRc = 'TreeRC',
  Unknown = 'Unknown',
  WaitSeed = 'WaitSeed'
}

export type PipelineSummary = {
  __typename?: 'PipelineSummary';
  commitMsg: Scalars['Int']['output'];
  done: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  id: Scalars['ActorID']['output'];
  porep: Scalars['Int']['output'];
  precommitMsg: Scalars['Int']['output'];
  sdr: Scalars['Int']['output'];
  trees: Scalars['Int']['output'];
  waitSeed: Scalars['Int']['output'];
};

export type PowerClaim = {
  __typename?: 'PowerClaim';
  qualityAdjPower?: Maybe<Scalars['BigInt']['output']>;
  rawBytePower?: Maybe<Scalars['BigInt']['output']>;
};

export type Query = {
  __typename?: 'Query';
  actor?: Maybe<Actor>;
  actors?: Maybe<Array<Maybe<Actor>>>;
  alerts?: Maybe<Array<Maybe<Alert>>>;
  config?: Maybe<Config>;
  configs?: Maybe<Array<Maybe<Config>>>;
  dealsPending?: Maybe<Array<Maybe<OpenSectorPiece>>>;
  machine?: Maybe<Machine>;
  machineSummary?: Maybe<MachineSummary>;
  machines?: Maybe<Array<Maybe<Machine>>>;
  metricsActiveTasks?: Maybe<Array<Maybe<MetricsActiveTask>>>;
  miner?: Maybe<Miner>;
  miningSummaryByDay?: Maybe<Array<Maybe<MiningSummaryDay>>>;
  nodesInfo?: Maybe<Array<Maybe<NodeInfo>>>;
  pipelines?: Maybe<Array<Maybe<Pipeline>>>;
  pipelinesSummary?: Maybe<Array<Maybe<PipelineSummary>>>;
  sector?: Maybe<Sector>;
  sectors?: Maybe<Array<Maybe<Sector>>>;
  sectorsCount: Scalars['Int']['output'];
  storagePaths?: Maybe<Array<Maybe<StoragePath>>>;
  storageStats?: Maybe<Array<Maybe<StorageStats>>>;
  task?: Maybe<Task>;
  taskAggregatesByDay?: Maybe<Array<Maybe<TaskAggregate>>>;
  taskAggregatesByHour?: Maybe<Array<Maybe<TaskAggregate>>>;
  taskHistories?: Maybe<Array<Maybe<TaskHistory>>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  tasksCount: Scalars['Int']['output'];
};


export type QueryActorArgs = {
  address: Scalars['Address']['input'];
};


export type QueryConfigArgs = {
  layer: Scalars['String']['input'];
};


export type QueryMachineArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMetricsActiveTasksArgs = {
  lastDays: Scalars['Int']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMinerArgs = {
  address: Scalars['Address']['input'];
};


export type QueryMiningSummaryByDayArgs = {
  lastDays: Scalars['Int']['input'];
};


export type QuerySectorArgs = {
  actor: Scalars['ActorID']['input'];
  sectorNumber: Scalars['Int']['input'];
};


export type QuerySectorsArgs = {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sectorNumber?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySectorsCountArgs = {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
};


export type QueryTaskArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTaskAggregatesByDayArgs = {
  lastDays: Scalars['Int']['input'];
};


export type QueryTaskAggregatesByHourArgs = {
  lastHours: Scalars['Int']['input'];
};


export type QueryTaskHistoriesArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type Sector = {
  __typename?: 'Sector';
  events: Array<Maybe<TaskHistory>>;
  id: Scalars['ID']['output'];
  locations: Array<Maybe<SectorLocation>>;
  meta?: Maybe<SectorMeta>;
  pieces: Array<Maybe<SectorMetaPiece>>;
  tasks: Array<Maybe<Task>>;
};

export type SectorLocation = {
  __typename?: 'SectorLocation';
  isPrimary?: Maybe<Scalars['Boolean']['output']>;
  minerId: Scalars['ActorID']['output'];
  readRefs: Scalars['Int']['output'];
  readTs?: Maybe<Scalars['String']['output']>;
  sectorFiletype: Scalars['Int']['output'];
  sectorNum: Scalars['Int']['output'];
  storageId: Scalars['String']['output'];
  writeLockOwner?: Maybe<Scalars['String']['output']>;
  writeTs?: Maybe<Scalars['String']['output']>;
};

export type SectorMeta = {
  __typename?: 'SectorMeta';
  curSealedCid: Scalars['String']['output'];
  curUnsealedCid: Scalars['String']['output'];
  expirationEpoch: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isCC: Scalars['Boolean']['output'];
  msgCidCommit?: Maybe<Scalars['String']['output']>;
  msgCidPrecommit?: Maybe<Scalars['String']['output']>;
  msgCidUpdate?: Maybe<Scalars['String']['output']>;
  origSealedCid: Scalars['String']['output'];
  origUnsealedCid: Scalars['String']['output'];
  regSealProof: Scalars['Int']['output'];
  sectorNum: Scalars['Int']['output'];
  seedEpoch: Scalars['Int']['output'];
  seedValue?: Maybe<Scalars['ByteArray']['output']>;
  spId: Scalars['ActorID']['output'];
  ticketEpoch: Scalars['Int']['output'];
  ticketValue?: Maybe<Scalars['ByteArray']['output']>;
};

export type SectorMetaPiece = {
  __typename?: 'SectorMetaPiece';
  ddoPam?: Maybe<Scalars['JSONB']['output']>;
  f05DealID?: Maybe<Scalars['Int']['output']>;
  f05DealProposal?: Maybe<Scalars['JSONB']['output']>;
  origEndEpoch?: Maybe<Scalars['Int']['output']>;
  pieceCID: Scalars['String']['output'];
  pieceNum: Scalars['Int']['output'];
  pieceSize: Scalars['Int']['output'];
  rawDataSize?: Maybe<Scalars['Int']['output']>;
  requestedKeepData: Scalars['Boolean']['output'];
  sectorNum: Scalars['Int']['output'];
  spID: Scalars['ActorID']['output'];
  startEpoch?: Maybe<Scalars['Int']['output']>;
};

export type StoragePath = {
  __typename?: 'StoragePath';
  allowMiners: Scalars['String']['output'];
  allowTo?: Maybe<Scalars['String']['output']>;
  allowTypes?: Maybe<Scalars['String']['output']>;
  available: Scalars['Int']['output'];
  canSeal: Scalars['Boolean']['output'];
  canStore: Scalars['Boolean']['output'];
  capacity: Scalars['Int']['output'];
  denyMiners: Scalars['String']['output'];
  denyTypes?: Maybe<Scalars['String']['output']>;
  fsAvailable: Scalars['Int']['output'];
  groups?: Maybe<Scalars['String']['output']>;
  heartbeatErr?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastHeartbeat: Scalars['Time']['output'];
  maxStorage: Scalars['Int']['output'];
  reserved: Scalars['Int']['output'];
  storageId: Scalars['String']['output'];
  type: StorageType;
  urls: Scalars['String']['output'];
  used: Scalars['Int']['output'];
  weight: Scalars['Int']['output'];
};

export type StorageStats = {
  __typename?: 'StorageStats';
  totalAvailable: Scalars['Int']['output'];
  totalCapacity: Scalars['Int']['output'];
  totalFsAvailable: Scalars['Int']['output'];
  totalReserved: Scalars['Int']['output'];
  totalUsed: Scalars['Int']['output'];
  type: StorageType;
};

export enum StorageType {
  Hybrid = 'Hybrid',
  Readonly = 'Readonly',
  Seal = 'Seal',
  Store = 'Store'
}

export type StorageUsage = {
  __typename?: 'StorageUsage';
  available: Scalars['Int']['output'];
  fsAvailable: Scalars['Int']['output'];
  reserved: Scalars['Int']['output'];
  time: Scalars['Time']['output'];
  used: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  alerts: Alert;
  completedTask: TaskHistory;
};


export type SubscriptionAlertsArgs = {
  offset: Scalars['Int']['input'];
};


export type SubscriptionCompletedTaskArgs = {
  last: Scalars['Int']['input'];
};

export type Task = {
  __typename?: 'Task';
  addedBy: Machine;
  addedByID: Scalars['Int']['output'];
  histories?: Maybe<Array<Maybe<TaskHistory>>>;
  id: Scalars['Int']['output'];
  initiatedBy?: Maybe<Machine>;
  initiatedByID?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<Machine>;
  ownerId?: Maybe<Scalars['Int']['output']>;
  postedTime: Scalars['Time']['output'];
  previousTask?: Maybe<TaskHistory>;
  previousTaskID?: Maybe<Scalars['Int']['output']>;
  updateTime: Scalars['Time']['output'];
};

export type TaskAggregate = {
  __typename?: 'TaskAggregate';
  failure: Scalars['Int']['output'];
  success: Scalars['Int']['output'];
  tasks: Array<Maybe<TaskNameAggregate>>;
  time: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
};

export type TaskHistory = {
  __typename?: 'TaskHistory';
  completedByHostAndPort: Scalars['String']['output'];
  err?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  posted: Scalars['Time']['output'];
  result: Scalars['Boolean']['output'];
  taskId: Scalars['Int']['output'];
  workEnd: Scalars['Time']['output'];
  workStart: Scalars['Time']['output'];
};

export type TaskNameAggregate = {
  __typename?: 'TaskNameAggregate';
  failure: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TaskSummary = {
  __typename?: 'TaskSummary';
  falseCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  totalCount: Scalars['Int']['output'];
  trueCount: Scalars['Int']['output'];
};

export type TaskSummaryDay = {
  __typename?: 'TaskSummaryDay';
  day: Scalars['Time']['output'];
  falseCount: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  trueCount: Scalars['Int']['output'];
};


      export type PossibleTypesResultData = {
  "possibleTypes": {}
};
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    