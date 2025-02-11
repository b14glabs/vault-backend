/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
    BaseContract,
    BigNumberish,
    BytesLike,
    FunctionFragment,
    Result,
    Interface,
    EventFragment,
    AddressLike,
    ContractRunner,
    ContractMethod,
    Listener,
  } from "ethers";
  import type {
    TypedContractEvent,
    TypedDeferredTopicFilter,
    TypedEventLog,
    TypedLogDescription,
    TypedListener,
    TypedContractMethod,
  } from "./common";
  
  export interface DualCoreInterface extends Interface {
    getFunction(
      nameOrSignature:
        | "acceptOwnership"
        | "allowance"
        | "approve"
        | "balanceOf"
        | "burn"
        | "coreVault"
        | "decimals"
        | "decreaseAllowance"
        | "increaseAllowance"
        | "mint"
        | "name"
        | "owner"
        | "pendingOwner"
        | "renounceOwnership"
        | "setCoreVaultAddress"
        | "symbol"
        | "totalSupply"
        | "transfer"
        | "transferFrom"
        | "transferOwnership"
    ): FunctionFragment;
  
    getEvent(
      nameOrSignatureOrTopic:
        | "Approval"
        | "OwnershipTransferStarted"
        | "OwnershipTransferred"
        | "SetCoreVaultAddress"
        | "Transfer"
    ): EventFragment;
  
    encodeFunctionData(
      functionFragment: "acceptOwnership",
      values?: undefined
    ): string;
    encodeFunctionData(
      functionFragment: "allowance",
      values: [AddressLike, AddressLike]
    ): string;
    encodeFunctionData(
      functionFragment: "approve",
      values: [AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(
      functionFragment: "balanceOf",
      values: [AddressLike]
    ): string;
    encodeFunctionData(
      functionFragment: "burn",
      values: [AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(functionFragment: "coreVault", values?: undefined): string;
    encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
    encodeFunctionData(
      functionFragment: "decreaseAllowance",
      values: [AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(
      functionFragment: "increaseAllowance",
      values: [AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(
      functionFragment: "mint",
      values: [AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(
      functionFragment: "pendingOwner",
      values?: undefined
    ): string;
    encodeFunctionData(
      functionFragment: "renounceOwnership",
      values?: undefined
    ): string;
    encodeFunctionData(
      functionFragment: "setCoreVaultAddress",
      values: [AddressLike]
    ): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(
      functionFragment: "totalSupply",
      values?: undefined
    ): string;
    encodeFunctionData(
      functionFragment: "transfer",
      values: [AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(
      functionFragment: "transferFrom",
      values: [AddressLike, AddressLike, BigNumberish]
    ): string;
    encodeFunctionData(
      functionFragment: "transferOwnership",
      values: [AddressLike]
    ): string;
  
    decodeFunctionResult(
      functionFragment: "acceptOwnership",
      data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "coreVault", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
    decodeFunctionResult(
      functionFragment: "decreaseAllowance",
      data: BytesLike
    ): Result;
    decodeFunctionResult(
      functionFragment: "increaseAllowance",
      data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(
      functionFragment: "pendingOwner",
      data: BytesLike
    ): Result;
    decodeFunctionResult(
      functionFragment: "renounceOwnership",
      data: BytesLike
    ): Result;
    decodeFunctionResult(
      functionFragment: "setCoreVaultAddress",
      data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(
      functionFragment: "totalSupply",
      data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
    decodeFunctionResult(
      functionFragment: "transferFrom",
      data: BytesLike
    ): Result;
    decodeFunctionResult(
      functionFragment: "transferOwnership",
      data: BytesLike
    ): Result;
  }
  
  export namespace ApprovalEvent {
    export type InputTuple = [
      owner: AddressLike,
      spender: AddressLike,
      value: BigNumberish
    ];
    export type OutputTuple = [owner: string, spender: string, value: bigint];
    export interface OutputObject {
      owner: string;
      spender: string;
      value: bigint;
    }
    export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    export type Filter = TypedDeferredTopicFilter<Event>;
    export type Log = TypedEventLog<Event>;
    export type LogDescription = TypedLogDescription<Event>;
  }
  
  export namespace OwnershipTransferStartedEvent {
    export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    export type OutputTuple = [previousOwner: string, newOwner: string];
    export interface OutputObject {
      previousOwner: string;
      newOwner: string;
    }
    export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    export type Filter = TypedDeferredTopicFilter<Event>;
    export type Log = TypedEventLog<Event>;
    export type LogDescription = TypedLogDescription<Event>;
  }
  
  export namespace OwnershipTransferredEvent {
    export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    export type OutputTuple = [previousOwner: string, newOwner: string];
    export interface OutputObject {
      previousOwner: string;
      newOwner: string;
    }
    export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    export type Filter = TypedDeferredTopicFilter<Event>;
    export type Log = TypedEventLog<Event>;
    export type LogDescription = TypedLogDescription<Event>;
  }
  
  export namespace SetCoreVaultAddressEvent {
    export type InputTuple = [operator: AddressLike, coreVault: AddressLike];
    export type OutputTuple = [operator: string, coreVault: string];
    export interface OutputObject {
      operator: string;
      coreVault: string;
    }
    export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    export type Filter = TypedDeferredTopicFilter<Event>;
    export type Log = TypedEventLog<Event>;
    export type LogDescription = TypedLogDescription<Event>;
  }
  
  export namespace TransferEvent {
    export type InputTuple = [
      from: AddressLike,
      to: AddressLike,
      value: BigNumberish
    ];
    export type OutputTuple = [from: string, to: string, value: bigint];
    export interface OutputObject {
      from: string;
      to: string;
      value: bigint;
    }
    export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    export type Filter = TypedDeferredTopicFilter<Event>;
    export type Log = TypedEventLog<Event>;
    export type LogDescription = TypedLogDescription<Event>;
  }
  
  export interface DualCore extends BaseContract {
    connect(runner?: ContractRunner | null): DualCore;
    waitForDeployment(): Promise<this>;
  
    interface: DualCoreInterface;
  
    queryFilter<TCEvent extends TypedContractEvent>(
      event: TCEvent,
      fromBlockOrBlockhash?: string | number | undefined,
      toBlock?: string | number | undefined
    ): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(
      filter: TypedDeferredTopicFilter<TCEvent>,
      fromBlockOrBlockhash?: string | number | undefined,
      toBlock?: string | number | undefined
    ): Promise<Array<TypedEventLog<TCEvent>>>;
  
    on<TCEvent extends TypedContractEvent>(
      event: TCEvent,
      listener: TypedListener<TCEvent>
    ): Promise<this>;
    on<TCEvent extends TypedContractEvent>(
      filter: TypedDeferredTopicFilter<TCEvent>,
      listener: TypedListener<TCEvent>
    ): Promise<this>;
  
    once<TCEvent extends TypedContractEvent>(
      event: TCEvent,
      listener: TypedListener<TCEvent>
    ): Promise<this>;
    once<TCEvent extends TypedContractEvent>(
      filter: TypedDeferredTopicFilter<TCEvent>,
      listener: TypedListener<TCEvent>
    ): Promise<this>;
  
    listeners<TCEvent extends TypedContractEvent>(
      event: TCEvent
    ): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(
      event?: TCEvent
    ): Promise<this>;
  
    acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;
  
    allowance: TypedContractMethod<
      [owner: AddressLike, spender: AddressLike],
      [bigint],
      "view"
    >;
  
    approve: TypedContractMethod<
      [spender: AddressLike, amount: BigNumberish],
      [boolean],
      "nonpayable"
    >;
  
    balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;
  
    burn: TypedContractMethod<
      [account: AddressLike, amount: BigNumberish],
      [void],
      "nonpayable"
    >;
  
    coreVault: TypedContractMethod<[], [string], "view">;
  
    decimals: TypedContractMethod<[], [bigint], "view">;
  
    decreaseAllowance: TypedContractMethod<
      [spender: AddressLike, subtractedValue: BigNumberish],
      [boolean],
      "nonpayable"
    >;
  
    increaseAllowance: TypedContractMethod<
      [spender: AddressLike, addedValue: BigNumberish],
      [boolean],
      "nonpayable"
    >;
  
    mint: TypedContractMethod<
      [account: AddressLike, amount: BigNumberish],
      [void],
      "nonpayable"
    >;
  
    name: TypedContractMethod<[], [string], "view">;
  
    owner: TypedContractMethod<[], [string], "view">;
  
    pendingOwner: TypedContractMethod<[], [string], "view">;
  
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
  
    setCoreVaultAddress: TypedContractMethod<
      [_coreVault: AddressLike],
      [void],
      "nonpayable"
    >;
  
    symbol: TypedContractMethod<[], [string], "view">;
  
    totalSupply: TypedContractMethod<[], [bigint], "view">;
  
    transfer: TypedContractMethod<
      [to: AddressLike, amount: BigNumberish],
      [boolean],
      "nonpayable"
    >;
  
    transferFrom: TypedContractMethod<
      [from: AddressLike, to: AddressLike, amount: BigNumberish],
      [boolean],
      "nonpayable"
    >;
  
    transferOwnership: TypedContractMethod<
      [newOwner: AddressLike],
      [void],
      "nonpayable"
    >;
  
    getFunction<T extends ContractMethod = ContractMethod>(
      key: string | FunctionFragment
    ): T;
  
    getFunction(
      nameOrSignature: "acceptOwnership"
    ): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(
      nameOrSignature: "allowance"
    ): TypedContractMethod<
      [owner: AddressLike, spender: AddressLike],
      [bigint],
      "view"
    >;
    getFunction(
      nameOrSignature: "approve"
    ): TypedContractMethod<
      [spender: AddressLike, amount: BigNumberish],
      [boolean],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "balanceOf"
    ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(
      nameOrSignature: "burn"
    ): TypedContractMethod<
      [account: AddressLike, amount: BigNumberish],
      [void],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "coreVault"
    ): TypedContractMethod<[], [string], "view">;
    getFunction(
      nameOrSignature: "decimals"
    ): TypedContractMethod<[], [bigint], "view">;
    getFunction(
      nameOrSignature: "decreaseAllowance"
    ): TypedContractMethod<
      [spender: AddressLike, subtractedValue: BigNumberish],
      [boolean],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "increaseAllowance"
    ): TypedContractMethod<
      [spender: AddressLike, addedValue: BigNumberish],
      [boolean],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "mint"
    ): TypedContractMethod<
      [account: AddressLike, amount: BigNumberish],
      [void],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "name"
    ): TypedContractMethod<[], [string], "view">;
    getFunction(
      nameOrSignature: "owner"
    ): TypedContractMethod<[], [string], "view">;
    getFunction(
      nameOrSignature: "pendingOwner"
    ): TypedContractMethod<[], [string], "view">;
    getFunction(
      nameOrSignature: "renounceOwnership"
    ): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(
      nameOrSignature: "setCoreVaultAddress"
    ): TypedContractMethod<[_coreVault: AddressLike], [void], "nonpayable">;
    getFunction(
      nameOrSignature: "symbol"
    ): TypedContractMethod<[], [string], "view">;
    getFunction(
      nameOrSignature: "totalSupply"
    ): TypedContractMethod<[], [bigint], "view">;
    getFunction(
      nameOrSignature: "transfer"
    ): TypedContractMethod<
      [to: AddressLike, amount: BigNumberish],
      [boolean],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "transferFrom"
    ): TypedContractMethod<
      [from: AddressLike, to: AddressLike, amount: BigNumberish],
      [boolean],
      "nonpayable"
    >;
    getFunction(
      nameOrSignature: "transferOwnership"
    ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  
    getEvent(
      key: "Approval"
    ): TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    getEvent(
      key: "OwnershipTransferStarted"
    ): TypedContractEvent<
      OwnershipTransferStartedEvent.InputTuple,
      OwnershipTransferStartedEvent.OutputTuple,
      OwnershipTransferStartedEvent.OutputObject
    >;
    getEvent(
      key: "OwnershipTransferred"
    ): TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    getEvent(
      key: "SetCoreVaultAddress"
    ): TypedContractEvent<
      SetCoreVaultAddressEvent.InputTuple,
      SetCoreVaultAddressEvent.OutputTuple,
      SetCoreVaultAddressEvent.OutputObject
    >;
    getEvent(
      key: "Transfer"
    ): TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  
    filters: {
      "Approval(address,address,uint256)": TypedContractEvent<
        ApprovalEvent.InputTuple,
        ApprovalEvent.OutputTuple,
        ApprovalEvent.OutputObject
      >;
      Approval: TypedContractEvent<
        ApprovalEvent.InputTuple,
        ApprovalEvent.OutputTuple,
        ApprovalEvent.OutputObject
      >;
  
      "OwnershipTransferStarted(address,address)": TypedContractEvent<
        OwnershipTransferStartedEvent.InputTuple,
        OwnershipTransferStartedEvent.OutputTuple,
        OwnershipTransferStartedEvent.OutputObject
      >;
      OwnershipTransferStarted: TypedContractEvent<
        OwnershipTransferStartedEvent.InputTuple,
        OwnershipTransferStartedEvent.OutputTuple,
        OwnershipTransferStartedEvent.OutputObject
      >;
  
      "OwnershipTransferred(address,address)": TypedContractEvent<
        OwnershipTransferredEvent.InputTuple,
        OwnershipTransferredEvent.OutputTuple,
        OwnershipTransferredEvent.OutputObject
      >;
      OwnershipTransferred: TypedContractEvent<
        OwnershipTransferredEvent.InputTuple,
        OwnershipTransferredEvent.OutputTuple,
        OwnershipTransferredEvent.OutputObject
      >;
  
      "SetCoreVaultAddress(address,address)": TypedContractEvent<
        SetCoreVaultAddressEvent.InputTuple,
        SetCoreVaultAddressEvent.OutputTuple,
        SetCoreVaultAddressEvent.OutputObject
      >;
      SetCoreVaultAddress: TypedContractEvent<
        SetCoreVaultAddressEvent.InputTuple,
        SetCoreVaultAddressEvent.OutputTuple,
        SetCoreVaultAddressEvent.OutputObject
      >;
  
      "Transfer(address,address,uint256)": TypedContractEvent<
        TransferEvent.InputTuple,
        TransferEvent.OutputTuple,
        TransferEvent.OutputObject
      >;
      Transfer: TypedContractEvent<
        TransferEvent.InputTuple,
        TransferEvent.OutputTuple,
        TransferEvent.OutputObject
      >;
    };
  }