import {
  ApprovalForAll as ApprovalForAllEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
  ticketMinted as ticketMintedEvent,
  ticketSet as ticketSetEvent,
  ticketWithdraw as ticketWithdrawEvent
} from "../generated/TicketErc1155/TicketErc1155"
import {
  ApprovalForAll,
  TransferBatch,
  TransferSingle,
  URI,
  ticketMinted,
  ticketSet,
  ticketWithdraw
} from "../generated/schema"

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.TicketErc1155_id = event.params.id
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.value = event.params.value
  entity.TicketErc1155_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleticketMinted(event: ticketMintedEvent): void {
  let entity = new ticketMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleticketSet(event: ticketSetEvent): void {
  let entity = new ticketSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId
  entity.baseMetadataURIPrefix = event.params.baseMetadataURIPrefix
  entity.feeAddress = event.params.feeAddress
  entity.feeAmount = event.params.feeAmount
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime
  entity.eventTime = event.params.eventTime
  entity.mintLimit = event.params.mintLimit

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleticketWithdraw(event: ticketWithdrawEvent): void {
  let entity = new ticketWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId
  entity.salesPaid = event.params.salesPaid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
