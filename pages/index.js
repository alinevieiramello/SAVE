import Head from 'next/head'
import { Container, VStack, Heading, Button, Text, useColorModeValue } from '@chakra-ui/react'
import { FaGithub, FaFacebook, FaGoogle } from 'react-icons/fa'
import { signIn, getSession } from 'next-auth/react'
import { createIcon } from '@chakra-ui/icons'

const BachelorHatIcon = createIcon({
  displayName: 'BachelorHatIcon',
  viewBox: '0 0 1024 1024',
  d: 'M965.63712 383.17056l-434.45248-227.46112a40.96512 40.96512 0 0 0-37.99552 0L58.74176 383.17056a40.95488 40.95488 0 0 0-21.78048 32.768A41.30816 41.30816 0 0 0 36.4032 422.4v307.2a40.96 40.96 0 0 0 81.92 0V480.22528l101.40672 41.3184a40.71424 40.71424 0 0 0-4.5056 18.61632v204.8a40.8576 40.8576 0 0 0 13.11232 30.03904c40.8832 67.51744 168.576 97.96096 283.84768 97.96096 115.26144 0 242.944-30.4384 283.83744-97.95072a40.84224 40.84224 0 0 0 13.12256-30.04928v-204.8a40.71424 40.71424 0 0 0-4.5056-18.61632l157.44512-64.1536a40.97024 40.97024 0 0 0 3.55328-74.21952z m-238.40768 346.7008a17.96096 17.96096 0 0 0-0.256 0.67072c-8.17152 21.71392-86.93248 60.49792-214.78912 60.49792-127.86176 0-206.6176-38.784-214.78912-60.49792l-0.25088-0.65536v-176.7936l199.58272 81.32096a40.86784 40.86784 0 0 0 30.91456 0l199.58272-81.32096v176.77824z m-215.04-177.62304L174.90944 414.8224l337.28-176.5888 337.28 176.5888-337.28 137.42592z',
})

export default function Home() {
  
  return (
    <>
      <Head>
        <title>SAVE - Egress@s</title>
        <meta
          name='description'
          content='Sistema de Acompanhamento da Vida do Egresso'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container maxW={'md'} as={'main'}>
        <VStack spacing={4} py={{ base: 20, md: 18 }}>
          <BachelorHatIcon fontSize={'5xl'} boxSize={'200px'} color={useColorModeValue('gray.800', 'gray.200')} />
          <Heading>Login</Heading>
          <Text>Comece a fazer a diferença agora mesmo.</Text>
          <Button
            w={'full'}
            colorScheme={'teal'}
            leftIcon={<FaGoogle />}
            size={'lg'}
            onClick={() => signIn('google')}
          >
            Entrar com Google
          </Button>
          <Button
            w={'full'}
            colorScheme={'teal'}
            leftIcon={<FaFacebook />}
            size={'lg'}
            onClick={() => signIn('facebook')}
          >
            Entrar com Facebook
          </Button>
          <Button
            w={'full'}
            colorScheme={'teal'}
            leftIcon={<FaGithub />}
            size={'lg'}
            onClick={() => signIn('github')}
          >
            Entrar com Github
          </Button>
        </VStack>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
