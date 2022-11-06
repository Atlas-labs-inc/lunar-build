import { useEffect } from 'react'
import { useColorMode } from '@chakra-ui/react';


export function ForceDarkMode(props: { children: JSX.Element }) {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "dark") return;
    toggleColorMode();
  }, [colorMode]);

  return props.children;
}