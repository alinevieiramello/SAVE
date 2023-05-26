import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Stack,
  Link,
  Button,
  useColorMode,
  Switch,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { GoSignOut } from 'react-icons/go'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useContext } from 'react'
import { SurveyContext } from '../SurveyContext'

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    admin: false,
  },
  {
    name: 'Gerenciar questionários',
    href: '/survey/manage',
    admin: true,
  },
  {
    name: 'Criar novo questionário',
    href: '/survey/create',
    admin: true,
  },
  {
    name: 'Relatório',
    href: '/relatorio',
    admin: true,
  },
]

const successToast = {
  title: 'Sucesso',
  description: 'Questionário salvo com sucesso!',
  status: 'success',
  duration: 5000,
}

const errorToast = {
  title: 'Erro',
  description: 'Não foi possível salvar o questionário.',
  status: 'error',
  duration: 5000,
}

function DesktopNavigation({ colorMode }) {
  const router = useRouter()
  const toast = useToast()
  const context = useContext(SurveyContext)
  const { data: session } = useSession() 
  const { surveyJSON, survId } = context.state
  const saveMethod = survId ? 'PATCH' : 'POST'
  const routes = ['/survey/manage/[surveyId]', '/survey/create']

  return (
    <>
      <Stack direction={'row'} spacing={4}>
        {session && session.user.role === 'admin' &&
          NAV_ITEMS.map((item) => (
            <Box key={item.name}>
              <NextLink href={item.href} passHref>
                <Link
                  rounded={'md'}
                  py={2}
                  px={2}
                  _hover={{
                    textDecoration: 'none',
                    bg: colorMode === 'light' ? 'gray.200' : 'gray.700',
                  }}
                  onClick={
                    item.href === '/survey/create'
                      ? () => context.setSurvId(null)
                      : 123 // TODO: consertar isso
                  }
                >
                  {item.name}
                </Link>
              </NextLink>
            </Box>
          ))}
        {session && session.user.role === 'user' &&
          NAV_ITEMS.filter((item) => !item.admin).map((item) => (
            <Box key={item.name}>
              <NextLink href={item.href} passHref>
                <Link
                  rounded={'md'}
                  py={2}
                  px={2}
                  _hover={{
                    textDecoration: 'none',
                    bg: colorMode === 'light' ? 'gray.200' : 'gray.700',
                  }}
                >
                  {item.name}
                </Link>
              </NextLink>
            </Box>
          ))}
      </Stack>
      <Stack direction={'row'} ml={4}>
        {routes.includes(router.pathname) && (
          <Box>
            <Link
              rounded={'md'}
              py={2}
              px={2}
              bg={colorMode === 'light' ? 'teal.500' : 'teal.200'}
              color={colorMode === 'light' ? 'white' : 'gray.800'}
              _hover={{
                textDecoration: 'none',
                bg: colorMode === 'light' ? 'teal.700' : 'teal.400',
              }}
              onClick={async () => {
                await fetch(`/api/surveycreator/${survId}`, {
                  method: saveMethod,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(surveyJSON),
                }).then((res) => {
                  if (res.status === 200) {
                    router.push('/survey/manage')
                    toast(successToast)
                  } else {
                    toast(errorToast)
                  }
                })
              }}
            >
              Salvar questionário
            </Link>
          </Box>
        )}
      </Stack>
    </>
  )
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  const { data: session } = useSession()

  return (
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}
        >
          <Flex
            flex={{ base: 1 }}
            justify={{ base: 'center', md: 'start' }}
            align={{ base: 'center' }}
          >
            <NextLink href={'/'} passHref>
              <Text
                fontFamily={'heading'}
                textAlign={useBreakpointValue({ md: 'left' })}
                color={useColorModeValue('gray.800', 'white')}
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight={'bold'}
                _hover={{ cursor: 'pointer' }}
              >
                SAVE
              </Text>
            </NextLink>
            <Flex ml={10}>
              <DesktopNavigation colorMode={colorMode} />
            </Flex>
          </Flex>
          <Stack
            align={'center'}
            direction={'row'}
            justify={{ base: 'center', md: 'end' }}
          >
            {isLargerThan720 && (
              <Switch
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
                colorScheme={'teal'}
              />
            )}
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
            </Button>
            {session && (
              <Button leftIcon={<GoSignOut />} onClick={() => signOut()}>
                Sair
              </Button>
            )}
          </Stack>
        </Flex>
      </Box>
  )
}
