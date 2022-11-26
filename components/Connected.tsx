import { FC, MouseEventHandler, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { CandyMachine, Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useRouter } from "next/router"

const Connected: FC = () => {
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachine>()
  const [isMinting, setIsMinting] = useState(false)

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  const fetchCandyMachine = async () => {
    try {
      const candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ADDRESS ?? "") })
        .run()
      
      setCandyMachine(candyMachine)
    } catch (e) {
      alert("Please submit a valid CMv2 address.")
      console.log(e)
    }
  }

  useEffect(() => {
    if (!metaplex) return
    // fetchCandyMachine();
    
    metaplex
      .candyMachines()
      .findByAddress({
        address: new PublicKey(
          process.env.NEXT_PUBLIC_CANDY_MACHINE_ADDRESS ?? ""
        ),
      }).run()
      
      .then((candyMachine: any) => {
        console.log(candyMachine)
        setCandyMachine(candyMachine)
      })
      .catch((error: any) => {
        alert(error)
      })
  }, [metaplex])

  const router = useRouter()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return

      if (!walletAdapter.connected || !candyMachine) {
        return
      }

      try {
        setIsMinting(true)
        // const nft = await metaplex.candyMachines().mint({ candyMachine })
        // console.log(candyMachine,"mint")
        const nft = await metaplex.candyMachines().mint({candyMachine}).run()

        // console.log(nft)
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
      } catch (error) {
        alert(error)
      } finally {
        setIsMinting(false)
      }
    },
    [metaplex, walletAdapter, candyMachine]
  )

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Dower.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each enemy is randomly generated and can be staked to receive
            <Text as="b"> $ESPACE</Text> Use your <Text as="b"> $ESPACE</Text> to
            upgrade your enemy and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px" onClick={handleClick}>
        <HStack>
          <Text>mint enemy</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  )
}

export default Connected