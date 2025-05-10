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
  Bytes: { input: any; output: any; }
  FIL: { input: any; output: any; }
  Int64: { input: any; output: any; }
  JSON: { input: any; output: any; }
  NullBool: { input: any; output: any; }
  NullInt64: { input: any; output: any; }
  NullString: { input: any; output: any; }
  NullTime: { input: any; output: any; }
  PeerID: { input: any; output: any; }
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

export type ChainHead = {
  __typename?: 'ChainHead';
  height: Scalars['Uint64']['output'];
  timestamp: Scalars['Uint64']['output'];
};

export type ClientFilter = {
  __typename?: 'ClientFilter';
  active: Scalars['Boolean']['output'];
  info: Scalars['String']['output'];
  maxDealSizePerHour: Scalars['Int']['output'];
  maxDealsPerHour: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  peers: Array<Scalars['PeerID']['output']>;
  pricingFilters: Array<Scalars['String']['output']>;
  wallets: Array<Scalars['Address']['output']>;
};

export type ClientFilterInput = {
  active: Scalars['Boolean']['input'];
  info: Scalars['String']['input'];
  maxDealSizePerHour: Scalars['Int']['input'];
  maxDealsPerHour: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  peers: Array<Scalars['PeerID']['input']>;
  pricingFilters: Array<Scalars['String']['input']>;
  wallets: Array<Scalars['Address']['input']>;
};

export type Config = {
  __typename?: 'Config';
  config: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  usedBy: Array<Maybe<MachineDetail>>;
};

export type DealCountSummary = {
  __typename?: 'DealCountSummary';
  boost: Scalars['Int']['output'];
  direct: Scalars['Int']['output'];
  legacy: Scalars['Int']['output'];
};

export type DealInfo = {
  __typename?: 'DealInfo';
  announceToIpni: Scalars['Boolean']['output'];
  chainDealId: Scalars['NullInt64']['output'];
  clientPeerId: Scalars['PeerID']['output'];
  createdAt: Scalars['Time']['output'];
  endEpoch: Scalars['Int64']['output'];
  error: Scalars['String']['output'];
  fastRetrieval: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  indexed: Scalars['NullBool']['output'];
  isDdo: Scalars['Boolean']['output'];
  isLegacy: Scalars['Boolean']['output'];
  miner: Scalars['String']['output'];
  offline: Scalars['Boolean']['output'];
  pieceCid: Scalars['String']['output'];
  pieceSize: Scalars['Int64']['output'];
  publishCid: Scalars['NullString']['output'];
  sector: Scalars['NullInt64']['output'];
  signedProposalCid: Scalars['String']['output'];
  spId: Scalars['ActorID']['output'];
  startEpoch: Scalars['Int64']['output'];
  url: Scalars['NullString']['output'];
  urlHeaders: Scalars['JSON']['output'];
  urls: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

export type GaugeCountValue = {
  __typename?: 'GaugeCountValue';
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type IpniAdvertisement = {
  __typename?: 'IPNIAdvertisement';
  adCid: Scalars['String']['output'];
  addresses: Scalars['String']['output'];
  contextId: Scalars['Bytes']['output'];
  entries: Scalars['String']['output'];
  isRm: Scalars['Boolean']['output'];
  isSkip: Scalars['Boolean']['output'];
  orderNumber: Scalars['Int']['output'];
  pieceCid: Scalars['String']['output'];
  pieceSize: Scalars['Int']['output'];
  previous: Scalars['NullString']['output'];
  provider?: Maybe<IpniPeerId>;
  providerPeerID: Scalars['String']['output'];
  signature: Scalars['Bytes']['output'];
};

export type IpniHead = {
  __typename?: 'IPNIHead';
  head: Scalars['String']['output'];
  provider: Scalars['String']['output'];
};

export type IpniPeerId = {
  __typename?: 'IPNIPeerID';
  peerID: Scalars['String']['output'];
  spID: Scalars['ActorID']['output'];
};

export type IpniProvider = {
  __typename?: 'IPNIProvider';
  adCount: Scalars['Int']['output'];
  head: Scalars['String']['output'];
  peerID: Scalars['String']['output'];
  spID: Scalars['ActorID']['output'];
  status: IpniProviderStatus;
};

export type IpniProviderStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'UNKNOWN';

export type IpniStats = {
  __typename?: 'IPNIStats';
  indexed: Scalars['Int']['output'];
  pendingTasks: Scalars['Int']['output'];
  previousIndexed: Scalars['Int']['output'];
  previousPendingTasks: Scalars['Int']['output'];
  previousProviders: Scalars['Int']['output'];
  previousSkipped: Scalars['Int']['output'];
  previousTotalAdvertisements: Scalars['Int']['output'];
  providers: Scalars['Int']['output'];
  skipped: Scalars['Int']['output'];
  totalAdvertisements: Scalars['Int']['output'];
};

export type IpniTask = {
  __typename?: 'IPNITask';
  complete: Scalars['Boolean']['output'];
  contextId?: Maybe<Scalars['Bytes']['output']>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  isRm?: Maybe<Scalars['Boolean']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  regSealProof?: Maybe<Scalars['Int']['output']>;
  sector?: Maybe<Scalars['Int']['output']>;
  sectorOffset: Scalars['Int']['output'];
  spId?: Maybe<Scalars['ActorID']['output']>;
  taskId: Scalars['Int']['output'];
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
  layers: Scalars['NullString']['output'];
  layersArray?: Maybe<Array<Scalars['String']['output']>>;
  machineId: Scalars['NullInt64']['output'];
  machineName: Scalars['NullString']['output'];
  miners: Scalars['NullString']['output'];
  minersArray?: Maybe<Array<Scalars['String']['output']>>;
  startupTime: Scalars['NullTime']['output'];
  tasks: Scalars['NullString']['output'];
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
  updatedAt: Scalars['Time']['output'];
};

export type MarketAllowFilter = {
  __typename?: 'MarketAllowFilter';
  status: Scalars['Boolean']['output'];
  wallet: Scalars['Address']['output'];
};

export type MarketBalance = {
  __typename?: 'MarketBalance';
  balance: Scalars['FIL']['output'];
  balances?: Maybe<Array<WalletBalance>>;
  miner: Scalars['Address']['output'];
};

export type MarketMk12Deal = {
  __typename?: 'MarketMk12Deal';
  announceToIpni: Scalars['Boolean']['output'];
  chainDealId: Scalars['NullInt64']['output'];
  clientPeerId: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  endEpoch: Scalars['Int64']['output'];
  error: Scalars['NullString']['output'];
  fastRetrieval: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['Bytes']['output']>;
  offline: Scalars['Boolean']['output'];
  pieceCid: Scalars['String']['output'];
  pieceSize: Scalars['Uint64']['output'];
  proposal: Scalars['JSON']['output'];
  proposalCid: Scalars['String']['output'];
  proposalSignature: Scalars['Bytes']['output'];
  publishCid: Scalars['NullString']['output'];
  signedProposalCid: Scalars['String']['output'];
  spId: Scalars['ActorID']['output'];
  startEpoch: Scalars['Int64']['output'];
  url: Scalars['NullString']['output'];
  urlHeaders: Scalars['JSON']['output'];
  uuid: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

export type MarketMk12DealFilterInput = {
  pieceCid?: InputMaybe<Scalars['String']['input']>;
  proposalCid?: InputMaybe<Scalars['String']['input']>;
  signedProposalCid?: InputMaybe<Scalars['String']['input']>;
  spId?: InputMaybe<Scalars['ActorID']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
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
  signedData?: Maybe<Scalars['Bytes']['output']>;
  signedJson?: Maybe<Scalars['JSON']['output']>;
  toAddr: Scalars['String']['output'];
  unsignedCid: Scalars['String']['output'];
  unsignedData: Scalars['Bytes']['output'];
};

export type Metadata = {
  __typename?: 'Metadata';
  genesisTimestamp: Scalars['Uint64']['output'];
  networkName: Scalars['String']['output'];
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
  actor?: Maybe<Scalars['Address']['output']>;
  end: Scalars['Time']['output'];
  included: Scalars['Int']['output'];
  previous?: Maybe<MiningCountSummary>;
  start: Scalars['Time']['output'];
  total: Scalars['Int']['output'];
  won: Scalars['Int']['output'];
};

export type MiningStatusSummay = {
  __typename?: 'MiningStatusSummay';
  included: Scalars['Int']['output'];
  lastMinedAt: Scalars['NullInt64']['output'];
  total: Scalars['Int']['output'];
  won: Scalars['Int']['output'];
  wonChangeRate: Scalars['Float']['output'];
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
  minedHeader?: Maybe<Scalars['JSON']['output']>;
  spId: Scalars['Address']['output'];
  submittedAt?: Maybe<Scalars['Time']['output']>;
  taskId: Scalars['ID']['output'];
  won: Scalars['Boolean']['output'];
};

export type MiningTaskAggregateInterval =
  | 'day'
  | 'hour';

export type Mutation = {
  __typename?: 'Mutation';
  createConfig?: Maybe<Config>;
  dealSealNow: Scalars['Boolean']['output'];
  marketAddBalance?: Maybe<MarketBalance>;
  marketAddClientFilter: Scalars['Boolean']['output'];
  marketAddPriceFilter: Scalars['Boolean']['output'];
  marketDeleteAllowFilter: Scalars['Boolean']['output'];
  marketDeleteClientFilter: Scalars['Boolean']['output'];
  marketDeletePriceFilter: Scalars['Boolean']['output'];
  marketSetAllowFilter?: Maybe<MarketAllowFilter>;
  marketToggleAllowFilter: Scalars['Boolean']['output'];
  marketToggleClientFilter: Scalars['Boolean']['output'];
  marketUpdateClientFilter?: Maybe<ClientFilter>;
  marketUpdatePriceFilter?: Maybe<PriceFilter>;
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


export type MutationMarketAddClientFilterArgs = {
  input: ClientFilterInput;
};


export type MutationMarketAddPriceFilterArgs = {
  input: PriceFilterInput;
};


export type MutationMarketDeleteAllowFilterArgs = {
  wallet: Scalars['Address']['input'];
};


export type MutationMarketDeleteClientFilterArgs = {
  name: Scalars['String']['input'];
};


export type MutationMarketDeletePriceFilterArgs = {
  name: Scalars['String']['input'];
};


export type MutationMarketSetAllowFilterArgs = {
  status: Scalars['Boolean']['input'];
  wallet: Scalars['Address']['input'];
};


export type MutationMarketToggleAllowFilterArgs = {
  wallet: Scalars['Address']['input'];
};


export type MutationMarketToggleClientFilterArgs = {
  name: Scalars['String']['input'];
};


export type MutationMarketUpdateClientFilterArgs = {
  input: ClientFilterInput;
};


export type MutationMarketUpdatePriceFilterArgs = {
  input: PriceFilterInput;
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

export type NodeHealthSummary = {
  __typename?: 'NodeHealthSummary';
  offlineNodes: Scalars['Int']['output'];
  onlineNodes: Scalars['Int']['output'];
  unscheduledNodes: Scalars['Int']['output'];
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
  commitMsgTsk?: Maybe<Scalars['Bytes']['output']>;
  commitReadyAt?: Maybe<Scalars['Time']['output']>;
  compactStages: Array<TaskCompactStage>;
  createTime: Scalars['Time']['output'];
  currentTask?: Maybe<Task>;
  failed: Scalars['Boolean']['output'];
  failedAt?: Maybe<Scalars['Time']['output']>;
  failedReason: Scalars['String']['output'];
  failedReasonMsg: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  porepProof?: Maybe<Scalars['Bytes']['output']>;
  precommitMsgCid?: Maybe<Scalars['String']['output']>;
  precommitMsgTsk?: Maybe<Scalars['Bytes']['output']>;
  precommitReadyAt?: Maybe<Scalars['Time']['output']>;
  regSealProof: Scalars['Int']['output'];
  sectorNumber: Scalars['Int']['output'];
  seedEpoch?: Maybe<Scalars['Int']['output']>;
  seedValue?: Maybe<Scalars['Bytes']['output']>;
  spId: Scalars['Address']['output'];
  stage: PorepStage;
  status: TaskStatus;
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
  ticketValue?: Maybe<Scalars['Bytes']['output']>;
  treeDCid?: Maybe<Scalars['String']['output']>;
  treeRCid?: Maybe<Scalars['String']['output']>;
  userSectorDurationEpochs?: Maybe<Scalars['Int']['output']>;
};

export type PorepStage =
  | 'CommitMsg'
  | 'CommitMsgWait'
  | 'Finalize'
  | 'MoveStorage'
  | 'Porep'
  | 'PrecommitMsg'
  | 'PrecommitMsgWait'
  | 'SDR'
  | 'Synthetic'
  | 'TreeC'
  | 'TreeD'
  | 'TreeR'
  | 'WaitSeed';

export type PowerClaim = {
  __typename?: 'PowerClaim';
  qualityAdjPower?: Maybe<Scalars['BigInt']['output']>;
  rawBytePower?: Maybe<Scalars['BigInt']['output']>;
};

export type PriceFilter = {
  __typename?: 'PriceFilter';
  maxDurationDays: Scalars['Int']['output'];
  maximumSize: Scalars['Int']['output'];
  minDurationDays: Scalars['Int']['output'];
  minimumSize: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  verified: Scalars['Boolean']['output'];
};

export type PriceFilterInput = {
  maxDurationDays: Scalars['Int']['input'];
  maximumSize: Scalars['Int']['input'];
  minDurationDays: Scalars['Int']['input'];
  minimumSize: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  verified: Scalars['Boolean']['input'];
};

export type PrometheusResponse = {
  __typename?: 'PrometheusResponse';
  data: Scalars['JSON']['output'];
};

export type Query = {
  __typename?: 'Query';
  actor?: Maybe<Actor>;
  actors?: Maybe<Array<Maybe<Actor>>>;
  alerts?: Maybe<Array<Maybe<Alert>>>;
  config?: Maybe<Config>;
  configs?: Maybe<Array<Maybe<Config>>>;
  dealsPending?: Maybe<Array<Maybe<OpenSectorPiece>>>;
  ipniAdvertisement?: Maybe<IpniAdvertisement>;
  ipniAdvertisements: Array<IpniAdvertisement>;
  ipniAdvertisementsCount: Scalars['Int']['output'];
  ipniProviders: Array<IpniProvider>;
  ipniStats: IpniStats;
  ipniTask?: Maybe<IpniTask>;
  ipniTasks: Array<IpniTask>;
  ipniTasksCount: Scalars['Int']['output'];
  machine?: Maybe<Machine>;
  machineByHostAndPort?: Maybe<Machine>;
  machineSummary?: Maybe<MachineSummary>;
  machines?: Maybe<Array<Maybe<Machine>>>;
  makretPriceFilters?: Maybe<Array<PriceFilter>>;
  marketAllowDefault: Scalars['Boolean']['output'];
  marketAllowFilter?: Maybe<MarketAllowFilter>;
  marketAllowFilters?: Maybe<Array<MarketAllowFilter>>;
  marketBalance?: Maybe<MarketBalance>;
  marketBalances?: Maybe<Array<MarketBalance>>;
  marketCheckClientFilter: Scalars['Boolean']['output'];
  marketCheckPriceFilter: Scalars['Boolean']['output'];
  marketClientFilter?: Maybe<ClientFilter>;
  marketClientFilters?: Maybe<Array<ClientFilter>>;
  marketDealCountSummary?: Maybe<DealCountSummary>;
  marketDealInfo?: Maybe<DealInfo>;
  marketMk12Deals: Array<MarketMk12Deal>;
  marketMk12DealsCount: Scalars['Int']['output'];
  marketMk12StorageAsk?: Maybe<MarketMk12StorageAsk>;
  marketMk12StorageAsks?: Maybe<Array<Maybe<MarketMk12StorageAsk>>>;
  marketMk12StorageAsksCount: Scalars['Int']['output'];
  marketPriceFilter?: Maybe<PriceFilter>;
  messageSend?: Maybe<MessageSend>;
  messageSends?: Maybe<Array<Maybe<MessageSend>>>;
  messageSendsCount: Scalars['Int']['output'];
  metadata: Metadata;
  miner?: Maybe<Miner>;
  minerPower?: Maybe<MinerPower>;
  miningCount: MiningCount;
  miningCountAggregate?: Maybe<Array<Maybe<MiningCountAggregated>>>;
  miningCountSummary?: Maybe<MiningCountSummary>;
  miningStatusSummay?: Maybe<MiningStatusSummay>;
  miningSummaryByDay?: Maybe<Array<Maybe<MiningSummaryDay>>>;
  miningWins?: Maybe<Array<Maybe<MiningTask>>>;
  miningWinsCount: Scalars['Int']['output'];
  nodeHealthSummary?: Maybe<NodeHealthSummary>;
  nodesInfo?: Maybe<Array<Maybe<NodeInfo>>>;
  pipelinesSummary?: Maybe<Array<Maybe<PipelineSummary>>>;
  porep?: Maybe<Porep>;
  poreps?: Maybe<Array<Maybe<Porep>>>;
  prometheusQuery: PrometheusResponse;
  prometheusQueryRange: PrometheusResponse;
  runningTaskSummary?: Maybe<RunningTaskSummary>;
  sector?: Maybe<Sector>;
  sectorSummary?: Maybe<SectorSummary>;
  sectors?: Maybe<Array<Maybe<Sector>>>;
  sectorsCount: Scalars['Int']['output'];
  storage?: Maybe<Storage>;
  storageStats?: Maybe<Array<Maybe<StorageStats>>>;
  storages: Array<Storage>;
  task?: Maybe<Task>;
  taskDurationStats?: Maybe<TaskDurationStats>;
  taskHistories?: Maybe<Array<Maybe<TaskHistory>>>;
  taskHistoriesAggregate?: Maybe<Array<Maybe<TaskAggregate>>>;
  taskHistoriesCount: Scalars['Int']['output'];
  taskNames?: Maybe<Array<Scalars['String']['output']>>;
  taskSuccessRate?: Maybe<TaskSuccessRate>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  tasksCount: Scalars['Int']['output'];
  tasksDurationStats: Array<TaskDurationStats>;
  tasksStats?: Maybe<Array<Maybe<TaskStats>>>;
};


export type QueryActorArgs = {
  address: Scalars['Address']['input'];
};


export type QueryConfigArgs = {
  layer: Scalars['String']['input'];
};


export type QueryIpniAdvertisementArgs = {
  orderNumber: Scalars['Int']['input'];
};


export type QueryIpniAdvertisementsArgs = {
  isRemoved?: InputMaybe<Scalars['Boolean']['input']>;
  isSkip?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  provider?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIpniAdvertisementsCountArgs = {
  isRemoved?: InputMaybe<Scalars['Boolean']['input']>;
  isSkip?: InputMaybe<Scalars['Boolean']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIpniTaskArgs = {
  taskId: Scalars['Int']['input'];
};


export type QueryIpniTasksArgs = {
  isRm?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  spId?: InputMaybe<Scalars['ActorID']['input']>;
};


export type QueryIpniTasksCountArgs = {
  isRm?: InputMaybe<Scalars['Boolean']['input']>;
  spId?: InputMaybe<Scalars['ActorID']['input']>;
};


export type QueryMachineArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMachineByHostAndPortArgs = {
  hostAndPort: Scalars['String']['input'];
};


export type QueryMarketAllowFilterArgs = {
  wallet: Scalars['Address']['input'];
};


export type QueryMarketBalanceArgs = {
  miner: Scalars['Address']['input'];
};


export type QueryMarketCheckClientFilterArgs = {
  name: Scalars['String']['input'];
};


export type QueryMarketCheckPriceFilterArgs = {
  name: Scalars['String']['input'];
};


export type QueryMarketClientFilterArgs = {
  name: Scalars['String']['input'];
};


export type QueryMarketDealInfoArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketMk12DealsArgs = {
  filter: MarketMk12DealFilterInput;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryMarketMk12DealsCountArgs = {
  filter: MarketMk12DealFilterInput;
};


export type QueryMarketMk12StorageAskArgs = {
  spId: Scalars['Address']['input'];
};


export type QueryMarketPriceFilterArgs = {
  name: Scalars['String']['input'];
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


export type QueryMiningStatusSummayArgs = {
  end: Scalars['Time']['input'];
  spID?: InputMaybe<Scalars['ActorID']['input']>;
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


export type QueryPrometheusQueryArgs = {
  query: Scalars['String']['input'];
  time?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryPrometheusQueryRangeArgs = {
  end: Scalars['Time']['input'];
  query: Scalars['String']['input'];
  start: Scalars['Time']['input'];
  step: Scalars['Int']['input'];
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


export type QueryTaskDurationStatsArgs = {
  end: Scalars['Time']['input'];
  name: Scalars['String']['input'];
  start: Scalars['Time']['input'];
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


export type QueryTaskSuccessRateArgs = {
  end: Scalars['Time']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  start: Scalars['Time']['input'];
};


export type QueryTasksDurationStatsArgs = {
  end: Scalars['Time']['input'];
  start: Scalars['Time']['input'];
};


export type QueryTasksStatsArgs = {
  end: Scalars['Time']['input'];
  machine?: InputMaybe<Scalars['String']['input']>;
  start: Scalars['Time']['input'];
};

export type RunningTaskSummary = {
  __typename?: 'RunningTaskSummary';
  averageWaitTime: Scalars['Float']['output'];
  queued: Scalars['Int']['output'];
  running: Scalars['Int']['output'];
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
  status: TaskStatus;
  tasks: Array<Maybe<Task>>;
};

export type SectorLocation = {
  __typename?: 'SectorLocation';
  isPrimary: Scalars['NullBool']['output'];
  minerId: Scalars['Address']['output'];
  readRefs: Scalars['Int']['output'];
  readTs: Scalars['NullString']['output'];
  sectorFiletype: Scalars['Int']['output'];
  sectorNum: Scalars['Int']['output'];
  storage?: Maybe<Storage>;
  storageId: Scalars['String']['output'];
  writeLockOwner: Scalars['NullString']['output'];
  writeTs: Scalars['NullString']['output'];
};

export type SectorMeta = {
  __typename?: 'SectorMeta';
  curSealedCid: Scalars['String']['output'];
  curUnsealedCid: Scalars['String']['output'];
  deadline: Scalars['NullInt64']['output'];
  expirationEpoch: Scalars['NullInt64']['output'];
  id: Scalars['String']['output'];
  isCC: Scalars['Boolean']['output'];
  msgCidCommit: Scalars['NullString']['output'];
  msgCidPrecommit: Scalars['NullString']['output'];
  msgCidUpdate: Scalars['NullString']['output'];
  origSealedCid: Scalars['String']['output'];
  origUnsealedCid: Scalars['String']['output'];
  partition: Scalars['NullInt64']['output'];
  regSealProof: Scalars['Int']['output'];
  sectorNum: Scalars['Int']['output'];
  seedEpoch: Scalars['Int']['output'];
  seedValue?: Maybe<Scalars['Bytes']['output']>;
  spId: Scalars['Address']['output'];
  ticketEpoch: Scalars['Int']['output'];
  ticketValue?: Maybe<Scalars['Bytes']['output']>;
};

export type SectorMetaPiece = {
  __typename?: 'SectorMetaPiece';
  ddoPam?: Maybe<Scalars['JSON']['output']>;
  f05DealID?: Maybe<Scalars['Int']['output']>;
  f05DealProposal?: Maybe<Scalars['JSON']['output']>;
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

export type SectorSummary = {
  __typename?: 'SectorSummary';
  active: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  sealing: Scalars['Int']['output'];
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
  allowMiners: Scalars['NullString']['output'];
  allowTo: Scalars['NullString']['output'];
  allowTypes: Scalars['NullString']['output'];
  available: Scalars['NullInt64']['output'];
  canSeal: Scalars['NullBool']['output'];
  canStore: Scalars['NullBool']['output'];
  capacity: Scalars['NullInt64']['output'];
  denyMiners: Scalars['NullString']['output'];
  denyTypes: Scalars['NullString']['output'];
  fsAvailable: Scalars['NullInt64']['output'];
  groups: Scalars['NullString']['output'];
  heartbeatErr: Scalars['NullString']['output'];
  id: Scalars['ID']['output'];
  lastHeartbeat: Scalars['NullTime']['output'];
  maxStorage: Scalars['NullInt64']['output'];
  reserved: Scalars['NullInt64']['output'];
  storageId: Scalars['NullString']['output'];
  type: StorageType;
  urls: Scalars['NullString']['output'];
  used: Scalars['NullInt64']['output'];
  weight: Scalars['NullInt64']['output'];
};

export type StorageStats = {
  __typename?: 'StorageStats';
  totalAvailable: Scalars['Int64']['output'];
  totalCapacity: Scalars['Int64']['output'];
  totalFsAvailable: Scalars['Int64']['output'];
  totalReserved: Scalars['Int64']['output'];
  totalUsed: Scalars['Int64']['output'];
  type: StorageType;
};

export type StorageType =
  | 'Hybrid'
  | 'Readonly'
  | 'Seal'
  | 'Store';

export type StorageUsage = {
  __typename?: 'StorageUsage';
  available: Scalars['Int64']['output'];
  fsAvailable: Scalars['Int64']['output'];
  reserved: Scalars['Int64']['output'];
  time: Scalars['Time']['output'];
  used: Scalars['Int64']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  alerts: Alert;
  chainHead: ChainHead;
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

export type TaskCompactStage = {
  __typename?: 'TaskCompactStage';
  name: Scalars['String']['output'];
  status: TaskStatus;
  taskId?: Maybe<Scalars['Int']['output']>;
};

export type TaskDurationStats = {
  __typename?: 'TaskDurationStats';
  avgDurationSeconds: Scalars['Float']['output'];
  maxDurationSeconds: Scalars['Float']['output'];
  medianDurationSeconds: Scalars['Float']['output'];
  minDurationSeconds: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  p90DurationSeconds: Scalars['Float']['output'];
  p95DurationSeconds: Scalars['Float']['output'];
  p99DurationSeconds: Scalars['Float']['output'];
  totalTasks: Scalars['Int']['output'];
};

export type TaskHistoriesAggregateInterval =
  | 'day'
  | 'hour';

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

export type TaskStatus =
  | 'Completed'
  | 'Failed'
  | 'Pending'
  | 'Running';

export type TaskSuccessRate = {
  __typename?: 'TaskSuccessRate';
  failure: Scalars['Int']['output'];
  success: Scalars['Int']['output'];
  successRate: Scalars['Float']['output'];
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

export type TimeRangeType =
  | 'DAY_7'
  | 'DAY_30'
  | 'DAY_90'
  | 'DAY_180'
  | 'DAY_365'
  | 'HOUR_1'
  | 'HOUR_24';

export type TrendType =
  | 'DOWN'
  | 'GOOD'
  | 'NORMAL'
  | 'UP'
  | 'WARNING';

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
    