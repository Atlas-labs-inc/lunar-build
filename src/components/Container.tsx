import { Flex, FlexProps } from '@chakra-ui/react'

export const Container = (props: FlexProps) => (
  <Flex
    h='100vh'
    // maxHeight={'100vh'}
    width="100%"
    direction="row"
    alignItems="center"
    justifyContent="flex-start"
    bg={props.bg || "#202020"}
    color="black"
    _style={{
      overflow: 'hidden',
    }}
    _dark={{
      bg: '#202020',
      color: 'white',
    }}
    transition="all 0.15s ease-out"
    {...props}
  />
)