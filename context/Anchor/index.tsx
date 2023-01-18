import { createContext, useContext } from "react"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import { AnchorNftStaking, IDL } from "./anchor_nft_staking"
//import { MovieReview, IDL } from "./movie_review"
import { Connection, PublicKey } from "@solana/web3.js"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import MockWallet from "./MockWallet"
const WorkspaceContext = createContext({})
const programId = new PublicKey("EtEk7WdfMfEyaeAyyAQqd5NKUUtZoupsUjxesBhoFZL6")

interface WorkSpace {
  connection?: Connection
  provider?: AnchorProvider
  program?: Program<AnchorNftStaking>
}

const WorkspaceProvider = ({ children }: any) => {
  const wallet = useAnchorWallet() || MockWallet
  const { connection } = useConnection()

  const provider = new AnchorProvider(connection, wallet, {})

  setProvider(provider)
  const program = new Program(IDL as Idl, programId)
  const workspace = {
    connection,
    provider,
    program,
  }

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  )

  
}

const useWorkspace = (): WorkSpace => {
  return useContext(WorkspaceContext)

} 


//http://localhost:3000/newMint?mint=EKtEsv41fPXB1U3zgkNB3Sc5CBWTVuSeYxXDW8ZyEkym
export { WorkspaceProvider, useWorkspace }