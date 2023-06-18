import { 
  Box, Button, Image, Heading, Text, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import Header from '../../../components/Header'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ChainId, useAddress, useChainId} from '@thirdweb-dev/react';
const { ethers } = require('ethers');
import { Network, Alchemy, NftTokenType } from "alchemy-sdk";
import abiTicketJson from '../../../abi/ticket.json';
import abiErc20Json from '../../../abi/token.json';


const settings = {
  apiKey: "XfoX4Vg1rQjEG85P719b85NCn98wVEFG",
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(settings);

const ProductDetailContent = () => {
  const address = useAddress();
  const contractAddress='0x4C874CCacA16f482b872Cb323174bc0D3636E3Bb';
  const contractAbi=abiTicketJson.abi;
  const erc20Abi = abiErc20Json.abi;
  const router = useRouter();
  let { id } = router.query;
  const [name, setName] = useState<any>('Loading...');
  const [image, setImage] = useState<any>('');
  const [discription, setDiscription] = useState<any>('Loading...');
  const [price, setPrice] = useState(0);

  //Control Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.push('/');
  };

  const handleId = (_id:any) => {
    return _id
  }

  const fetchTickt = async() => {
    try {
      const _id = handleId(id);
      await alchemy.nft
        .getNftMetadata(
          "0x4C874CCacA16f482b872Cb323174bc0D3636E3Bb", 
          handleId(_id)
        ).then((res)=>{
          console.log("get!!!");
          console.log(res.rawMetadata);
          if(typeof(res.rawMetadata) != 'undefined'){
            setName(res.rawMetadata.name);
            setImage(res.rawMetadata.image);
            setDiscription(res.rawMetadata.description);
          }
        });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    
      const contract = new ethers.Contract(contractAddress,contractAbi,provider);
      const result = await contract.ticketList(id);
      console.log(result)
      const tokenPrice = parseInt(result.feeAmount.toString()) / (10**18);
      setPrice(tokenPrice);
    } catch (error) {
        console.error(error);
    }
  }

  const handleSubmit = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
      );
      console.log(contract);
      const tx = await contract.useTicket(id);
      await tx.wait();
      onOpen();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickt();
  },[]);

  return (
    <Box padding={4}>
      <Button onClick={handleBack} marginBottom={4}>
        Back
      </Button>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Image src={image} alt={name} height={300} />
      </Box>
      <Box marginTop={4}>
        <Heading as="h2" size="xl" marginBottom={2}>
          {name}
        </Heading>
        <Text fontSize="lg" marginBottom={4}>
          Price: {price}.00 Link
        </Text>
        <Text>{discription}</Text>
      </Box>
      <Button isLoading={loading} loadingText="Loading..." backgroundColor='#8C7370' color='white' onClick={handleSubmit}>
        Use Ticket
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
          <ModalContent>
            <ModalHeader>Transaction Complete</ModalHeader>
            <ModalBody>
                Transaction has been successfully completed.
            </ModalBody>
            <ModalFooter>
                <Button backgroundColor='#8C7370' color='white' onClick={()=>router.push(`/`)}>
                    Close
                </Button>
            </ModalFooter>
          </ModalContent>
      </Modal>
    </Box>
  );
};

const ProductDetail = () => {
  const router = useRouter();
  return (
    <Box>
      <Header />
      <ProductDetailContent />
    </Box>
  )
}

export default ProductDetail;
