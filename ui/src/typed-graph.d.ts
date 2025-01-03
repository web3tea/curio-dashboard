export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends Record<string, unknown>> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends Record<string, unknown>, K extends keyof T> = Partial<Record<K, never>>;
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
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
  Uint64: { input: any; output: any; }
}

export interface Actor {
  __typename?: 'Actor';
  actorAvailableBalance: Scalars['BigInt']['output'];
  actorBalance: Scalars['BigInt']['output'];
  address: Scalars['Address']['output'];
  deadlines?: Maybe<Maybe<ActorDeadline>[]>;
  id: Scalars['ID']['output'];
  layers?: Maybe<Scalars['String']['output'][]>;
  qualityAdjustedPower: Scalars['BigInt']['output'];
  rawBytePower: Scalars['BigInt']['output'];
  workerBalance: Scalars['BigInt']['output'];
}

export interface ActorDeadline {
  __typename?: 'ActorDeadline';
  current: Scalars['Boolean']['output'];
  empty: Scalars['Boolean']['output'];
  faulty: Scalars['Boolean']['output'];
  partFaulty: Scalars['Boolean']['output'];
  proven: Scalars['Boolean']['output'];
}

export interface Alert {
  __typename?: 'Alert';
  id: Scalars['Int']['output'];
  machineName: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface Config {
  __typename?: 'Config';
  config: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  usedBy: Maybe<MachineDetail>[];
}

export interface GaugeCountValue {
  __typename?: 'GaugeCountValue';
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
}

export interface Global {
  __typename?: 'Global';
  genesisTimestamp: Scalars['Int']['output'];
  networkName: Scalars['String']['output'];
}

export interface Machine {
  __typename?: 'Machine';
  cpu: Scalars['Int']['output'];
  detail?: Maybe<MachineDetail>;
  gpu: Scalars['Float']['output'];
  hostAndPort: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastContact: Scalars['Time']['output'];
  metrics?: Maybe<MachineMetrics>;
  ram: Scalars['Int']['output'];
  storages?: Maybe<Maybe<StoragePath>[]>;
  taskHistories?: Maybe<Maybe<TaskHistory>[]>;
  tasks?: Maybe<Maybe<Task>[]>;
}


export interface MachineTaskHistoriesArgs {
  last: Scalars['Int']['input'];
}

export interface MachineDetail {
  __typename?: 'MachineDetail';
  id: Scalars['Int']['output'];
  layers: Scalars['String']['output'];
  layersArray?: Maybe<Scalars['String']['output'][]>;
  machineId: Scalars['Int']['output'];
  machineName: Scalars['String']['output'];
  miners: Scalars['String']['output'];
  minersArray?: Maybe<Scalars['String']['output'][]>;
  startupTime: Scalars['Time']['output'];
  tasks: Scalars['String']['output'];
  tasksArray?: Maybe<Scalars['String']['output'][]>;
}

export interface MachineMetrics {
  __typename?: 'MachineMetrics';
  activeTasks: Maybe<GaugeCountValue>[];
  addedTasks: Maybe<GaugeCountValue>[];
  cpuUsage: Scalars['Float']['output'];
  goRoutines: Scalars['Int']['output'];
  goThreads: Scalars['Int']['output'];
  goVersion: Scalars['String']['output'];
  gpuUsage: Scalars['Float']['output'];
  processCpuSecondsTotal: Scalars['Int']['output'];
  processMaxFds: Scalars['Int']['output'];
  processOpenFds: Scalars['Int']['output'];
  processResidentMemoryBytes: Scalars['Int']['output'];
  processStartTimeSeconds: Scalars['Int']['output'];
  processVirtualMemoryBytes: Scalars['Int']['output'];
  ramUsage: Scalars['Float']['output'];
  tasksCompleted: Maybe<GaugeCountValue>[];
  tasksStarted: Maybe<GaugeCountValue>[];
}

export interface MachineSummary {
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
}

export interface MessageSend {
  __typename?: 'MessageSend';
  fromKey: Scalars['String']['output'];
  nonce?: Maybe<Scalars['Int']['output']>;
  sendError?: Maybe<Scalars['String']['output']>;
  sendReason: Scalars['String']['output'];
  sendSuccess?: Maybe<Scalars['Boolean']['output']>;
  sendTaskId: Scalars['Int']['output'];
  sendTime?: Maybe<Scalars['Time']['output']>;
  signedCid?: Maybe<Scalars['String']['output']>;
  signedData?: Maybe<Scalars['ByteArray']['output']>;
  signedJson?: Maybe<Scalars['JSONB']['output']>;
  toAddr: Scalars['String']['output'];
  unsignedCid: Scalars['String']['output'];
  unsignedData: Scalars['ByteArray']['output'];
}

export interface MetricsActiveTask {
  __typename?: 'MetricsActiveTask';
  name: Scalars['String']['output'];
  series?: Maybe<Scalars['Float']['output'][][]>;
}

export interface Miner {
  __typename?: 'Miner';
  balance?: Maybe<MinerBalance>;
  id: Scalars['Address']['output'];
  info?: Maybe<MinerInfo>;
  power?: Maybe<MinerPower>;
}

export interface MinerBalance {
  __typename?: 'MinerBalance';
  available: Scalars['BigInt']['output'];
  balance: Scalars['BigInt']['output'];
  id: Scalars['Address']['output'];
  initialPledge: Scalars['BigInt']['output'];
  preCommitDeposits: Scalars['BigInt']['output'];
  vesting: Scalars['BigInt']['output'];
}

export interface MinerBeneficiaryTerm {
  __typename?: 'MinerBeneficiaryTerm';
  expiration: Scalars['Int']['output'];
  quota: Scalars['BigInt']['output'];
  usedQuota: Scalars['BigInt']['output'];
}

export interface MinerInfo {
  __typename?: 'MinerInfo';
  beneficiary: Scalars['Address']['output'];
  beneficiaryTerm?: Maybe<MinerBeneficiaryTerm>;
  consensusFaultElapsed: Scalars['Int']['output'];
  controlAddresses?: Maybe<Scalars['Address']['output'][]>;
  multiAddrs?: Maybe<Scalars['String']['output'][]>;
  newWorker: Scalars['Address']['output'];
  owner: Scalars['Address']['output'];
  peerId: Scalars['String']['output'];
  pendingBeneficiaryChange?: Maybe<MinerPendingBeneficiaryChange>;
  pendingOwnerAddress: Scalars['Address']['output'];
  sectorSize: Scalars['Int']['output'];
  windowPoStPartitionSectors: Scalars['Int']['output'];
  windowPoStProofType: Scalars['Int']['output'];
  worker: Scalars['Address']['output'];
  workerChangeEpoch: Scalars['Int']['output'];
}

export interface MinerPendingBeneficiaryChange {
  __typename?: 'MinerPendingBeneficiaryChange';
  approvedByBeneficiary: Scalars['Boolean']['output'];
  approvedByNominee: Scalars['Boolean']['output'];
  newBeneficiary: Scalars['Address']['output'];
  newExpiration: Scalars['Int']['output'];
  newQuota: Scalars['BigInt']['output'];
}

export interface MinerPower {
  __typename?: 'MinerPower';
  hasMinPower: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  minerPower: PowerClaim;
  totalPower: PowerClaim;
}

export interface MiningCount {
  __typename?: 'MiningCount';
  exclude: Scalars['Int']['output'];
  include: Scalars['Int']['output'];
}

export interface MiningCountAggregated {
  __typename?: 'MiningCountAggregated';
  included: Scalars['Int']['output'];
  time: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
  won: Scalars['Int']['output'];
}

export interface MiningCountSummary {
  __typename?: 'MiningCountSummary';
  end: Scalars['Time']['output'];
  included: Scalars['Int']['output'];
  previous?: Maybe<MiningCountSummary>;
  start: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
  won: Scalars['Int']['output'];
}

export interface MiningSummaryDay {
  __typename?: 'MiningSummaryDay';
  day: Scalars['Time']['output'];
  miner: Scalars['ActorID']['output'];
  wonBlock: Scalars['Int']['output'];
}

export interface MiningTask {
  __typename?: 'MiningTask';
  baseComputeTime: Scalars['Time']['output'];
  epoch: Scalars['Int']['output'];
  included?: Maybe<Scalars['Boolean']['output']>;
  minedAt?: Maybe<Scalars['Time']['output']>;
  minedCid?: Maybe<Scalars['String']['output']>;
  minedHeader?: Maybe<Scalars['JSONB']['output']>;
  spId: Scalars['ActorID']['output'];
  submittedAt?: Maybe<Scalars['Time']['output']>;
  taskId: Scalars['ID']['output'];
  won: Scalars['Boolean']['output'];
}

export enum MiningTaskAggregateInterval {
  Day = 'day',
  Hour = 'hour'
}

export interface Mutation {
  __typename?: 'Mutation';
  createConfig?: Maybe<Config>;
  dealSealNow: Scalars['Boolean']['output'];
  removeConfig?: Maybe<Config>;
  removeSector: Scalars['Boolean']['output'];
  restartAllFailedSectors: Scalars['Boolean']['output'];
  restartSector: Scalars['Boolean']['output'];
  updateConfig?: Maybe<Config>;
}


export interface MutationCreateConfigArgs {
  config: Scalars['String']['input'];
  title: Scalars['String']['input'];
}


export interface MutationDealSealNowArgs {
  miner: Scalars['ActorID']['input'];
  sectorNumber: Scalars['Uint64']['input'];
}


export interface MutationRemoveConfigArgs {
  title: Scalars['String']['input'];
}


export interface MutationRemoveSectorArgs {
  miner: Scalars['ActorID']['input'];
  sectorNumber: Scalars['Int']['input'];
}


export interface MutationRestartSectorArgs {
  miner: Scalars['ActorID']['input'];
  sectorNumber: Scalars['Int']['input'];
}


export interface MutationUpdateConfigArgs {
  config: Scalars['String']['input'];
  title: Scalars['String']['input'];
}

export interface NodeInfo {
  __typename?: 'NodeInfo';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  layers: Scalars['String']['output'][];
  reachable: Scalars['Boolean']['output'];
  syncState: Scalars['String']['output'];
  version: Scalars['String']['output'];
}

export interface OpenSectorPiece {
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
}

export interface PipelineSummary {
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
}

export interface Porep {
  __typename?: 'Porep';
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
  status: PorepStatus;
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
  userSectorDurationEpochs?: Maybe<Scalars['Int']['output']>;
}

export enum PorepStatus {
  Active = 'Active',
  ClearCache = 'ClearCache',
  CommitMsg = 'CommitMsg',
  CommitMsgWait = 'CommitMsgWait',
  Failed = 'Failed',
  MoveStorage = 'MoveStorage',
  OnChain = 'OnChain',
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

export interface PowerClaim {
  __typename?: 'PowerClaim';
  qualityAdjPower?: Maybe<Scalars['BigInt']['output']>;
  rawBytePower?: Maybe<Scalars['BigInt']['output']>;
}

export interface Query {
  __typename?: 'Query';
  actor?: Maybe<Actor>;
  actors?: Maybe<Maybe<Actor>[]>;
  alerts?: Maybe<Maybe<Alert>[]>;
  config?: Maybe<Config>;
  configs?: Maybe<Maybe<Config>[]>;
  dealsPending?: Maybe<Maybe<OpenSectorPiece>[]>;
  global: Global;
  machine?: Maybe<Machine>;
  machineSummary?: Maybe<MachineSummary>;
  machines?: Maybe<Maybe<Machine>[]>;
  messageSend?: Maybe<MessageSend>;
  messageSends?: Maybe<Maybe<MessageSend>[]>;
  messageSendsCount: Scalars['Int']['output'];
  metricsActiveTasks?: Maybe<Maybe<MetricsActiveTask>[]>;
  miner?: Maybe<Miner>;
  minerPower?: Maybe<MinerPower>;
  miningCount: MiningCount;
  miningCountAggregate?: Maybe<Maybe<MiningCountAggregated>[]>;
  miningCountSummary?: Maybe<MiningCountSummary>;
  miningSummaryByDay?: Maybe<Maybe<MiningSummaryDay>[]>;
  miningWins?: Maybe<Maybe<MiningTask>[]>;
  miningWinsCount: Scalars['Int']['output'];
  nodesInfo?: Maybe<Maybe<NodeInfo>[]>;
  pipelinesSummary?: Maybe<Maybe<PipelineSummary>[]>;
  porep?: Maybe<Porep>;
  poreps?: Maybe<Maybe<Porep>[]>;
  sector?: Maybe<Sector>;
  sectors?: Maybe<Maybe<Sector>[]>;
  sectorsCount: Scalars['Int']['output'];
  storage?: Maybe<Storage>;
  storagePaths?: Maybe<Maybe<StoragePath>[]>;
  storageStats?: Maybe<Maybe<StorageStats>[]>;
  task?: Maybe<Task>;
  taskHistories?: Maybe<Maybe<TaskHistory>[]>;
  taskHistoriesAggregate?: Maybe<Maybe<TaskAggregate>[]>;
  taskHistoriesCount: Scalars['Int']['output'];
  taskNames?: Maybe<Scalars['String']['output'][]>;
  tasks?: Maybe<Maybe<Task>[]>;
  tasksCount: Scalars['Int']['output'];
  tasksStats?: Maybe<Maybe<TaskStats>[]>;
}


export interface QueryActorArgs {
  address: Scalars['Address']['input'];
}


export interface QueryConfigArgs {
  layer: Scalars['String']['input'];
}


export interface QueryMachineArgs {
  id: Scalars['Int']['input'];
}


export interface QueryMessageSendArgs {
  fromKey?: InputMaybe<Scalars['String']['input']>;
  nonce?: InputMaybe<Scalars['Int']['input']>;
  sendTaskId?: InputMaybe<Scalars['Int']['input']>;
  signedCID?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryMessageSendsArgs {
  account?: InputMaybe<Scalars['Address']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}


export interface QueryMessageSendsCountArgs {
  account?: InputMaybe<Scalars['Address']['input']>;
}


export interface QueryMetricsActiveTasksArgs {
  lastDays: Scalars['Int']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryMinerArgs {
  address: Scalars['Address']['input'];
}


export interface QueryMinerPowerArgs {
  address?: InputMaybe<Scalars['Address']['input']>;
}


export interface QueryMiningCountArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
}


export interface QueryMiningCountAggregateArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  end: Scalars['Time']['input'];
  interval: MiningTaskAggregateInterval;
  start: Scalars['Time']['input'];
}


export interface QueryMiningCountSummaryArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
}


export interface QueryMiningSummaryByDayArgs {
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
}


export interface QueryMiningWinsArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  end?: InputMaybe<Scalars['Time']['input']>;
  include?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  start?: InputMaybe<Scalars['Time']['input']>;
}


export interface QueryMiningWinsCountArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  end?: InputMaybe<Scalars['Time']['input']>;
  include?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Time']['input']>;
}


export interface QueryPorepArgs {
  sectorNumber: Scalars['Int']['input'];
  sp: Scalars['ActorID']['input'];
}


export interface QuerySectorArgs {
  actor: Scalars['ActorID']['input'];
  sectorNumber: Scalars['Int']['input'];
}


export interface QuerySectorsArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sectorNumber?: InputMaybe<Scalars['Int']['input']>;
}


export interface QuerySectorsCountArgs {
  actor?: InputMaybe<Scalars['ActorID']['input']>;
}


export interface QueryStorageArgs {
  id: Scalars['String']['input'];
}


export interface QueryTaskArgs {
  id: Scalars['Int']['input'];
}


export interface QueryTaskHistoriesArgs {
  end?: InputMaybe<Scalars['Time']['input']>;
  hostPort?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  offset: Scalars['Int']['input'];
  result?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Time']['input']>;
}


export interface QueryTaskHistoriesAggregateArgs {
  end: Scalars['Time']['input'];
  interval: TaskHistoriesAggregateInterval;
  start: Scalars['Time']['input'];
}


export interface QueryTaskHistoriesCountArgs {
  end?: InputMaybe<Scalars['Time']['input']>;
  hostPort?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Time']['input']>;
}


export interface QueryTasksStatsArgs {
  end: Scalars['Time']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
  start: Scalars['Time']['input'];
}

export interface Sector {
  __typename?: 'Sector';
  events: Maybe<TaskHistory>[];
  id: Scalars['ID']['output'];
  locations: Maybe<SectorLocation>[];
  meta?: Maybe<SectorMeta>;
  pieces: Maybe<SectorMetaPiece>[];
  porep?: Maybe<Porep>;
  sectorNum: Scalars['Int']['output'];
  spID: Scalars['ActorID']['output'];
  status: PorepStatus;
  tasks: Maybe<Task>[];
}

export interface SectorLocation {
  __typename?: 'SectorLocation';
  isPrimary?: Maybe<Scalars['Boolean']['output']>;
  minerId: Scalars['ActorID']['output'];
  readRefs: Scalars['Int']['output'];
  readTs?: Maybe<Scalars['String']['output']>;
  sectorFiletype: Scalars['Int']['output'];
  sectorNum: Scalars['Int']['output'];
  storage?: Maybe<Storage>;
  storageId: Scalars['String']['output'];
  writeLockOwner?: Maybe<Scalars['String']['output']>;
  writeTs?: Maybe<Scalars['String']['output']>;
}

export interface SectorMeta {
  __typename?: 'SectorMeta';
  curSealedCid: Scalars['String']['output'];
  curUnsealedCid: Scalars['String']['output'];
  expirationEpoch?: Maybe<Scalars['Int']['output']>;
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
}

export interface SectorMetaPiece {
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
}

export interface Storage {
  __typename?: 'Storage';
  id: Scalars['String']['output'];
  liveness?: Maybe<StorageLiveness>;
  path?: Maybe<StoragePath>;
}

export interface StorageLiveness {
  __typename?: 'StorageLiveness';
  lastChecked: Scalars['Time']['output'];
  lastDead?: Maybe<Scalars['Time']['output']>;
  lastDeadReason?: Maybe<Scalars['String']['output']>;
  lastLive?: Maybe<Scalars['Time']['output']>;
  storageId: Scalars['String']['output'];
  url: Scalars['String']['output'];
}

export interface StoragePath {
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
}

export interface StorageStats {
  __typename?: 'StorageStats';
  totalAvailable: Scalars['Int']['output'];
  totalCapacity: Scalars['Int']['output'];
  totalFsAvailable: Scalars['Int']['output'];
  totalReserved: Scalars['Int']['output'];
  totalUsed: Scalars['Int']['output'];
  type: StorageType;
}

export enum StorageType {
  Hybrid = 'Hybrid',
  Readonly = 'Readonly',
  Seal = 'Seal',
  Store = 'Store'
}

export interface StorageUsage {
  __typename?: 'StorageUsage';
  available: Scalars['Int']['output'];
  fsAvailable: Scalars['Int']['output'];
  reserved: Scalars['Int']['output'];
  time: Scalars['Time']['output'];
  used: Scalars['Int']['output'];
}

export interface Subscription {
  __typename?: 'Subscription';
  alerts: Alert;
  completedTask: TaskHistory;
  newTask: Task;
}


export interface SubscriptionAlertsArgs {
  offset: Scalars['Int']['input'];
}


export interface SubscriptionCompletedTaskArgs {
  last: Scalars['Int']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
}


export interface SubscriptionNewTaskArgs {
  last: Scalars['Int']['input'];
  machineID?: InputMaybe<Scalars['Int']['input']>;
}

export interface Task {
  __typename?: 'Task';
  addedBy: Machine;
  addedByID: Scalars['Int']['output'];
  histories?: Maybe<Maybe<TaskHistory>[]>;
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
}

export interface TaskAggregate {
  __typename?: 'TaskAggregate';
  failure: Scalars['Int']['output'];
  success: Scalars['Int']['output'];
  time: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
}

export enum TaskHistoriesAggregateInterval {
  Day = 'day',
  Hour = 'hour'
}

export interface TaskHistory {
  __typename?: 'TaskHistory';
  completedBy?: Maybe<Machine>;
  completedByHostAndPort: Scalars['String']['output'];
  err?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  posted: Scalars['Time']['output'];
  result: Scalars['Boolean']['output'];
  taskId: Scalars['Int']['output'];
  workEnd: Scalars['Time']['output'];
  workStart: Scalars['Time']['output'];
}

export interface TaskNameAggregate {
  __typename?: 'TaskNameAggregate';
  failure: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
}

export interface TaskStats {
  __typename?: 'TaskStats';
  failure: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
}

export interface TaskSummary {
  __typename?: 'TaskSummary';
  falseCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  totalCount: Scalars['Int']['output'];
  trueCount: Scalars['Int']['output'];
}

export interface TaskSummaryDay {
  __typename?: 'TaskSummaryDay';
  day: Scalars['Time']['output'];
  falseCount: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  trueCount: Scalars['Int']['output'];
}


      export interface PossibleTypesResultData {
  "possibleTypes": {}
}
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    