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
  Address: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  ByteArray: { input: any; output: any; }
  FIL: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONB: { input: any; output: any; }
  Time: { input: any; output: any; }
  Uint64: { input: any; output: any; }
};

export type Actor = {
  __typename?: 'Actor';
  actorAvailableBalance: Scalars['BigInt']['output'];
  actorBalance: Scalars['BigInt']['output'];
  address: Scalars['Address']['output'];
  deadlines?: Maybe<Array<Maybe<ActorDeadline>>>;
  id: Scalars['ID']['output'];
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

export type GaugeCountValue = {
  __typename?: 'GaugeCountValue';
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Global = {
  __typename?: 'Global';
  genesisTimestamp: Scalars['Int']['output'];
  networkName: Scalars['String']['output'];
};

export type Machine = {
  __typename?: 'Machine';
  cpu: Scalars['Int']['output'];
  detail?: Maybe<MachineDetail>;
  gpu: Scalars['Float']['output'];
  hostAndPort: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastContact: Scalars['Time']['output'];
  metrics?: Maybe<MachineMetrics>;
  ram: Scalars['Int']['output'];
  storages?: Maybe<Array<Maybe<StoragePath>>>;
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

export type MachineMetrics = {
  __typename?: 'MachineMetrics';
  activeTasks: Array<Maybe<GaugeCountValue>>;
  addedTasks: Array<Maybe<GaugeCountValue>>;
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
  tasksCompleted: Array<Maybe<GaugeCountValue>>;
  tasksStarted: Array<Maybe<GaugeCountValue>>;
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

export type MarketBalance = {
  __typename?: 'MarketBalance';
  balance: Scalars['FIL']['output'];
  balances?: Maybe<Array<WalletBalance>>;
  miner: Scalars['Address']['output'];
};

export type MarketMk12StorageAsk = {
  __typename?: 'MarketMk12StorageAsk';
  createdAt: Scalars['Int']['output'];
  expiry: Scalars['Int']['output'];
  maxSize: Scalars['Int']['output'];
  minSize: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  sequence: Scalars['Int']['output'];
  spId: Scalars['Address']['output'];
  verifiedPrice: Scalars['Int']['output'];
};

export type MarketMk12StorageAskInput = {
  expiry: Scalars['Int']['input'];
  maxSize: Scalars['Int']['input'];
  minSize: Scalars['Int']['input'];
  price: Scalars['Int']['input'];
  spId: Scalars['Address']['input'];
  verifiedPrice: Scalars['Int']['input'];
};

export type MessageSend = {
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
};

export type MetricsActiveTask = {
  __typename?: 'MetricsActiveTask';
  name: Scalars['String']['output'];
  series?: Maybe<Array<Array<Scalars['Float']['output']>>>;
};

export type Miner = {
  __typename?: 'Miner';
  balance?: Maybe<MinerBalance>;
  id: Scalars['Address']['output'];
  info?: Maybe<MinerInfo>;
  power?: Maybe<MinerPower>;
};

export type MinerBalance = {
  __typename?: 'MinerBalance';
  available: Scalars['BigInt']['output'];
  balance: Scalars['BigInt']['output'];
  id: Scalars['Address']['output'];
  initialPledge: Scalars['BigInt']['output'];
  preCommitDeposits: Scalars['BigInt']['output'];
  vesting: Scalars['BigInt']['output'];
};

export type MinerBeneficiaryTerm = {
  __typename?: 'MinerBeneficiaryTerm';
  expiration: Scalars['Int']['output'];
  quota: Scalars['BigInt']['output'];
  usedQuota: Scalars['BigInt']['output'];
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
  peerId: Scalars['String']['output'];
  pendingBeneficiaryChange?: Maybe<MinerPendingBeneficiaryChange>;
  pendingOwnerAddress: Scalars['Address']['output'];
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
  newBeneficiary: Scalars['Address']['output'];
  newExpiration: Scalars['Int']['output'];
  newQuota: Scalars['BigInt']['output'];
};

export type MinerPower = {
  __typename?: 'MinerPower';
  hasMinPower: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  minerPower: PowerClaim;
  totalPower: PowerClaim;
};

export type MiningCount = {
  __typename?: 'MiningCount';
  exclude: Scalars['Int']['output'];
  include: Scalars['Int']['output'];
};

export type MiningCountAggregated = {
  __typename?: 'MiningCountAggregated';
  included: Scalars['Int']['output'];
  time: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
  won: Scalars['Int']['output'];
};

export type MiningCountSummary = {
  __typename?: 'MiningCountSummary';
  end: Scalars['Time']['output'];
  included: Scalars['Int']['output'];
  previous?: Maybe<MiningCountSummary>;
  start: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
  won: Scalars['Int']['output'];
};

export type MiningSummaryDay = {
  __typename?: 'MiningSummaryDay';
  day: Scalars['Time']['output'];
  miner: Scalars['Address']['output'];
  wonBlock: Scalars['Int']['output'];
};

export type MiningTask = {
  __typename?: 'MiningTask';
  baseComputeTime: Scalars['Time']['output'];
  epoch: Scalars['Int']['output'];
  included?: Maybe<Scalars['Boolean']['output']>;
  minedAt?: Maybe<Scalars['Time']['output']>;
  minedCid?: Maybe<Scalars['String']['output']>;
  minedHeader?: Maybe<Scalars['JSONB']['output']>;
  spId: Scalars['Address']['output'];
  submittedAt?: Maybe<Scalars['Time']['output']>;
  taskId: Scalars['ID']['output'];
  won: Scalars['Boolean']['output'];
};

export enum MiningTaskAggregateInterval {
  Day = 'day',
  Hour = 'hour'
}

export type Mutation = {
  __typename?: 'Mutation';
  createConfig?: Maybe<Config>;
  dealSealNow: Scalars['Boolean']['output'];
  marketAddBalance?: Maybe<MarketBalance>;
  removeConfig?: Maybe<Config>;
  removeSector: Scalars['Boolean']['output'];
  restartAllFailedSectors: Scalars['Boolean']['output'];
  restartSector: Scalars['Boolean']['output'];
  updateConfig?: Maybe<Config>;
  updateMarketMk12StorageAsk?: Maybe<MarketMk12StorageAsk>;
};


export type MutationCreateConfigArgs = {
  config: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationDealSealNowArgs = {
  miner: Scalars['Address']['input'];
  sectorNumber: Scalars['Uint64']['input'];
};


export type MutationMarketAddBalanceArgs = {
  amount: Scalars['FIL']['input'];
  miner: Scalars['Address']['input'];
  wallet: Scalars['Address']['input'];
};


export type MutationRemoveConfigArgs = {
  title: Scalars['String']['input'];
};


export type MutationRemoveSectorArgs = {
  miner: Scalars['Address']['input'];
  sectorNumber: Scalars['Int']['input'];
};


export type MutationRestartSectorArgs = {
  miner: Scalars['Address']['input'];
  sectorNumber: Scalars['Int']['input'];
};


export type MutationUpdateConfigArgs = {
  config: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationUpdateMarketMk12StorageAskArgs = {
  input: MarketMk12StorageAskInput;
};

export type NodeInfo = {
  __typename?: 'NodeInfo';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  layers: Array<Scalars['String']['output']>;
  reachable: Scalars['Boolean']['output'];
  syncState: Scalars['String']['output'];
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
  spID: Scalars['Address']['output'];
};

export type PipelineSummary = {
  __typename?: 'PipelineSummary';
  commitMsg: Scalars['Int']['output'];
  done: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  id: Scalars['Address']['output'];
  porep: Scalars['Int']['output'];
  precommitMsg: Scalars['Int']['output'];
  sdr: Scalars['Int']['output'];
  trees: Scalars['Int']['output'];
  waitSeed: Scalars['Int']['output'];
};

export type Porep = {
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
  spId: Scalars['Address']['output'];
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
};

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
  global: Global;
  machine?: Maybe<Machine>;
  machineSummary?: Maybe<MachineSummary>;
  machines?: Maybe<Array<Maybe<Machine>>>;
  marketBalance?: Maybe<MarketBalance>;
  marketBalances?: Maybe<Array<MarketBalance>>;
  marketMk12StorageAsk?: Maybe<MarketMk12StorageAsk>;
  marketMk12StorageAsks?: Maybe<Array<Maybe<MarketMk12StorageAsk>>>;
  marketMk12StorageAsksCount: Scalars['Int']['output'];
  messageSend?: Maybe<MessageSend>;
  messageSends?: Maybe<Array<Maybe<MessageSend>>>;
  messageSendsCount: Scalars['Int']['output'];
  metricsActiveTasks?: Maybe<Array<Maybe<MetricsActiveTask>>>;
  miner?: Maybe<Miner>;
  minerPower?: Maybe<MinerPower>;
  miningCount: MiningCount;
  miningCountAggregate?: Maybe<Array<Maybe<MiningCountAggregated>>>;
  miningCountSummary?: Maybe<MiningCountSummary>;
  miningSummaryByDay?: Maybe<Array<Maybe<MiningSummaryDay>>>;
  miningWins?: Maybe<Array<Maybe<MiningTask>>>;
  miningWinsCount: Scalars['Int']['output'];
  nodesInfo?: Maybe<Array<Maybe<NodeInfo>>>;
  pipelinesSummary?: Maybe<Array<Maybe<PipelineSummary>>>;
  porep?: Maybe<Porep>;
  poreps?: Maybe<Array<Maybe<Porep>>>;
  sector?: Maybe<Sector>;
  sectors?: Maybe<Array<Maybe<Sector>>>;
  sectorsCount: Scalars['Int']['output'];
  storage?: Maybe<Storage>;
  storagePaths?: Maybe<Array<Maybe<StoragePath>>>;
  storageStats?: Maybe<Array<Maybe<StorageStats>>>;
  task?: Maybe<Task>;
  taskHistories?: Maybe<Array<Maybe<TaskHistory>>>;
  taskHistoriesAggregate?: Maybe<Array<Maybe<TaskAggregate>>>;
  taskHistoriesCount: Scalars['Int']['output'];
  taskNames?: Maybe<Array<Scalars['String']['output']>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  tasksCount: Scalars['Int']['output'];
  tasksStats?: Maybe<Array<Maybe<TaskStats>>>;
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


export type QueryMarketBalanceArgs = {
  miner: Scalars['Address']['input'];
};


export type QueryMarketMk12StorageAskArgs = {
  spId: Scalars['Address']['input'];
};


export type QueryMessageSendArgs = {
  fromKey?: InputMaybe<Scalars['String']['input']>;
  nonce?: InputMaybe<Scalars['Int']['input']>;
  sendTaskId?: InputMaybe<Scalars['Int']['input']>;
  signedCID?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMessageSendsArgs = {
  account?: InputMaybe<Scalars['Address']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryMessageSendsCountArgs = {
  account?: InputMaybe<Scalars['Address']['input']>;
};


export type QueryMetricsActiveTasksArgs = {
  lastDays: Scalars['Int']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMinerArgs = {
  address: Scalars['Address']['input'];
};


export type QueryMinerPowerArgs = {
  address?: InputMaybe<Scalars['Address']['input']>;
};


export type QueryMiningCountArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
};


export type QueryMiningCountAggregateArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
  end: Scalars['Time']['input'];
  interval: MiningTaskAggregateInterval;
  start: Scalars['Time']['input'];
};


export type QueryMiningCountSummaryArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
};


export type QueryMiningSummaryByDayArgs = {
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
};


export type QueryMiningWinsArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
  end?: InputMaybe<Scalars['Time']['input']>;
  include?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  start?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryMiningWinsCountArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
  end?: InputMaybe<Scalars['Time']['input']>;
  include?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryPorepArgs = {
  sectorNumber: Scalars['Int']['input'];
  sp: Scalars['Address']['input'];
};


export type QuerySectorArgs = {
  actor: Scalars['Address']['input'];
  sectorNumber: Scalars['Int']['input'];
};


export type QuerySectorsArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sectorNumber?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySectorsCountArgs = {
  actor?: InputMaybe<Scalars['Address']['input']>;
};


export type QueryStorageArgs = {
  id: Scalars['String']['input'];
};


export type QueryTaskArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTaskHistoriesArgs = {
  end?: InputMaybe<Scalars['Time']['input']>;
  hostPort?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  offset: Scalars['Int']['input'];
  result?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryTaskHistoriesAggregateArgs = {
  end: Scalars['Time']['input'];
  interval: TaskHistoriesAggregateInterval;
  start: Scalars['Time']['input'];
};


export type QueryTaskHistoriesCountArgs = {
  end?: InputMaybe<Scalars['Time']['input']>;
  hostPort?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryTasksStatsArgs = {
  end: Scalars['Time']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
  start: Scalars['Time']['input'];
};

export type Sector = {
  __typename?: 'Sector';
  events: Array<Maybe<TaskHistory>>;
  id: Scalars['ID']['output'];
  locations: Array<Maybe<SectorLocation>>;
  meta?: Maybe<SectorMeta>;
  pieces: Array<Maybe<SectorMetaPiece>>;
  porep?: Maybe<Porep>;
  sectorNum: Scalars['Int']['output'];
  spID: Scalars['Address']['output'];
  status: PorepStatus;
  tasks: Array<Maybe<Task>>;
};

export type SectorLocation = {
  __typename?: 'SectorLocation';
  isPrimary?: Maybe<Scalars['Boolean']['output']>;
  minerId: Scalars['Address']['output'];
  readRefs: Scalars['Int']['output'];
  readTs?: Maybe<Scalars['String']['output']>;
  sectorFiletype: Scalars['Int']['output'];
  sectorNum: Scalars['Int']['output'];
  storage?: Maybe<Storage>;
  storageId: Scalars['String']['output'];
  writeLockOwner?: Maybe<Scalars['String']['output']>;
  writeTs?: Maybe<Scalars['String']['output']>;
};

export type SectorMeta = {
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
  spId: Scalars['Address']['output'];
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
  spID: Scalars['Address']['output'];
  startEpoch?: Maybe<Scalars['Int']['output']>;
};

export type Storage = {
  __typename?: 'Storage';
  id: Scalars['String']['output'];
  liveness?: Maybe<StorageLiveness>;
  path?: Maybe<StoragePath>;
};

export type StorageLiveness = {
  __typename?: 'StorageLiveness';
  lastChecked: Scalars['Time']['output'];
  lastDead?: Maybe<Scalars['Time']['output']>;
  lastDeadReason?: Maybe<Scalars['String']['output']>;
  lastLive?: Maybe<Scalars['Time']['output']>;
  storageId: Scalars['String']['output'];
  url: Scalars['String']['output'];
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
  newTask: Task;
};


export type SubscriptionAlertsArgs = {
  offset: Scalars['Int']['input'];
};


export type SubscriptionCompletedTaskArgs = {
  last: Scalars['Int']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionNewTaskArgs = {
  last: Scalars['Int']['input'];
  machineID?: InputMaybe<Scalars['Int']['input']>;
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
  time: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
};

export enum TaskHistoriesAggregateInterval {
  Day = 'day',
  Hour = 'hour'
}

export type TaskHistory = {
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
};

export type TaskNameAggregate = {
  __typename?: 'TaskNameAggregate';
  failure: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TaskStats = {
  __typename?: 'TaskStats';
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

export type WalletBalance = {
  __typename?: 'WalletBalance';
  address: Scalars['Address']['output'];
  balance: Scalars['FIL']['output'];
};


      export type PossibleTypesResultData = {
  "possibleTypes": {}
};
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    