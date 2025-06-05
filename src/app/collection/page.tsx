'use client'

import { Container, Heading, SimpleGrid, Box, VStack, Text, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { products } from '@/data/products'

export default function CollectionPage() {
  const router = useRouter()

  return (
    <Container maxW="container.xl" py={8} px={4}>
      <Heading mb={8}>Our Collection</Heading>
      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={8}
        width="100%"
        maxW="1200px"
        mx="auto"
      >
        {products.map((product) => (
          <Box
            key={product.id}
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
            p={4}
            height="450px"
            display="flex"
            flexDirection="column"
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <VStack spacing={4} align="stretch" flex={1}>
              <Box 
                position="relative" 
                width="100%" 
                height="300px"
                bg="gray.50"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ 
                    objectFit: 'contain',
                    padding: '1rem'
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </Box>
              <Text fontSize="xl" fontWeight="bold">
                {product.name}
              </Text>
              <Text color="gray.600" noOfLines={2}>
                {product.description}
              </Text>
              <Text fontSize="lg" fontWeight="semibold">
                ${product.price.toFixed(2)}
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => router.push(`/customize/${product.id}`)}
                mt="auto"
              >
                Customize
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  )
} 