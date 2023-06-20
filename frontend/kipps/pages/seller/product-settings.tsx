import { Box, Button, FormControl, FormLabel, Input, Image, Select } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/Header'
import { ChainId, useAddress, useChainId} from '@thirdweb-dev/react';
const { ethers } = require('ethers');
import abiTicketJson from '../../abi/ticket.json';

const ProductSettings = () => {
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');
  const [discription, setDiscription] = useState('');
  const [id, setId] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('https://dao-org.4attraem.com/assets/no_image.jpeg');
  const router = useRouter();

  //Control On-chain tx
  const contractAddress='0x565a38C71AeAc5Ed9c439E300B26Cc86e630b881';
  const contractAbi=abiTicketJson.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [loading, setLoading] = useState(false);

  const fetchCurrentId = async() => {
    // Get Current Id
    const contract = new ethers.Contract(contractAddress,contractAbi,provider);
    const result = await contract.ticketCount();
    console.log(parseInt(result.toString()))
    const tmpId = parseInt(result.toString()) * 10;
    setId(tmpId);
  }
 
  useEffect(() => {
    fetchCurrentId();
    window
  },[]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDiscriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscription(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file){
      setImage(file)
    };
  };

  const handleSubmit = async () => {
    try {
        // Get Current Id
        const contract = new ethers.Contract(contractAddress,contractAbi,provider);
        const result = await contract.ticketCount();
        console.log(parseInt(result.toString()))
        const tmpId = parseInt(result.toString()) * 10;
        setId(tmpId);

        // Upload Metadata via AWS
        let tmpFile;
        if (!image) {
          tmpFile = 'https://dao-org.4attraem.com/assets/no_image.jpeg'
        } else {
          tmpFile = image;
        }
        setLoading(true);
        const response = await axios.post(
          'https://1vlevj4eak.execute-api.ap-northeast-1.amazonaws.com/demo/chainlink/metadata-ipfs',
          {
            'image': tmpFile,
            'chainId': '8001',
            'name': name,
            'description': discription,
            'attributes': [
              {'value': 'Ticket','trait_type': 'Type'},
              {'value': 'Tokyo','trait_type': 'Location'}
            ],
            'animation_url': '',
            'nft_contract_address': contractAddress,
            'token_id': id
          }
        ).then((res)=>{
          console.log(res?.data.body);
          //register metadataULR to contract
          handleMetadataTx(res?.data.body.r1, res?.data.body.r2)
        });
    } catch (error) {
        console.error(error);
    }
  };
  const handleMetadataTx = async(_url01:string, _url02:string) => {
    
    try {
      const signer = await provider.getSigner();
      const tokenABI = [{
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_ticketId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_uri01",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_uri02",
            "type": "string"
          }
        ],
        "name": "setTokenURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]
      const contract = new ethers.Contract(
        contractAddress,
        tokenABI,
        signer
      );
      console.log(contract)
      const tx = await contract.setTokenURI(
          id,
          _url01,
          _url02
      ); 
      await tx.wait();
    } catch(error){
      console.error(error);
    } finally {
      setLoading(false);
      setRegistered(true);
    }  
  }
  const handleUploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      console.error('写真を選択してください');
      return;
    }

    //Encode base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        // Get Current Id
        const response = await axios.post(
          'https://1vlevj4eak.execute-api.ap-northeast-1.amazonaws.com/demo/projects/image', 
          {
            'image_data': JSON.stringify({ photo: base64data })
          }
        );
        console.log(response.data.body);
        setImage(response.data.body);
        setImageUrl(response.data.body);
      } catch (error) {
        console.error(error);
      }
    };
  }

  return (
    <Box>
      <Header/>
      <Box>
        <Box padding={4} backgroundColor='#F2F1EF' marginBottom={4}>
          <form onSubmit={handleUploadImage}>
            <FormControl marginBottom={4}>
              <FormLabel>Image</FormLabel>
              <Input type='file' accept='image/*' onChange={handleImageChange}/>
            </FormControl>
            <Image src={imageUrl} alt="Ticket Image" height={200} width={300} marginBottom={3}/>
            <Button type='submit' backgroundColor='#8C7370' color='white'>
              Upload Image
            </Button>
          </form>
        </Box>
        <Box padding={4} backgroundColor='#F2F1EF'>
          <form onSubmit={handleSubmit}>
            <FormControl marginBottom={4}>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={handleNameChange} backgroundColor='white' />
            </FormControl>
            <FormControl marginBottom={4}>
              <FormLabel>discription</FormLabel>
              <Input value={discription} onChange={handleDiscriptionChange} backgroundColor='white' />
            </FormControl>
            <Button 
              backgroundColor='#8C7370' 
              color='white' 
              onClick={handleSubmit}
              isLoading={loading} 
              loadingText="Loading..." 
            >
              Register Info
            </Button>
            {registered && (
              <Button 
                backgroundColor='#8C7370' 
                marginLeft={3} 
                color='white' 
                onClick={() => router.push(`/seller/price/${id}`)}>
                Next
              </Button>
            )}
          </form>
        </Box>
        
      </Box>
    </Box>
  );
};

export default ProductSettings;
