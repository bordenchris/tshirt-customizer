'use client'

import React from 'react'
import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack gap={8} textAlign="center">
        <Box position="relative" width="400px" height="200px">
          <Image
            src="/images/artcraft-logo.png"
            alt="Artcraft Sports Apparel Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Text fontSize="xl" color="gray.600" maxW="2xl">
          Your one-stop shop for custom t-shirts. Design your perfect t-shirt with our easy-to-use customization tools.
        </Text>
        <Link href="/collection" passHref>
          <Button colorScheme="blue" size="lg">
            Browse Collection
          </Button>
        </Link>
      </VStack>
    </Container>
  )
} 