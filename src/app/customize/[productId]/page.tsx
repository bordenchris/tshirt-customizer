'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Button,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
  SimpleGrid,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Product } from '@/data/products';
import Image from 'next/image';

interface CustomizationState {
  selectedColor: string;
  imageUrl: string;
  imagePosition: { x: number; y: number };
  imageScale: number;
  imageRotation: number;
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

const fonts = [
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Poppins', value: 'Poppins' },
];

export default function CustomizePage({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CustomizationState>({
    selectedColor: '#FFFFFF',
    imageUrl: '',
    imagePosition: { x: 0, y: 0 },
    imageScale: 1,
    imageRotation: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('Roboto');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [textSize, setTextSize] = useState<number>(24);
  const [textRotation, setTextRotation] = useState<number>(0);

  useEffect(() => {
    if (params.productId) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/inventory/${params.productId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Product not found');
          }
          return res.json();
        })
        .then((data) => {
          setProduct(data);
          setSelectedImage(data.colors[0].image);
          // Set initial color if available
          if (data.colors && data.colors.length > 0) {
            setCustomization(prev => ({
              ...prev,
              selectedColor: data.colors[0].name
            }));
          }
        })
        .catch((error) => {
          setError('Failed to load product details');
          toast({
            title: 'Error',
            description: 'Failed to load product details',
            status: 'error',
            duration: 3000,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params.productId, toast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !product) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCanvas = () => {
      // Set canvas dimensions to match container
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the T-shirt mockup
      const mockupImage = new window.Image();
      mockupImage.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        const aspectRatio = mockupImage.width / mockupImage.height;
        const maxHeight = canvas.height * 0.8; // Use 80% of canvas height
        const maxWidth = canvas.width * 0.8; // Use 80% of canvas width
        
        let drawWidth = maxWidth;
        let drawHeight = drawWidth / aspectRatio;
        
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = drawHeight * aspectRatio;
        }

        // Center the image
        const drawX = (canvas.width - drawWidth) / 2;
        const drawY = (canvas.height - drawHeight) / 2;

        // Draw the mockup
        ctx.drawImage(mockupImage, drawX, drawY, drawWidth, drawHeight);

        // Draw uploaded image if available
        if (customization.imageUrl) {
          const uploadedImage = new window.Image();
          uploadedImage.onload = () => {
            ctx.save();
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.translate(centerX + customization.imagePosition.x, centerY + customization.imagePosition.y);
            ctx.rotate(customization.imageRotation * Math.PI / 180);
            ctx.scale(customization.imageScale, customization.imageScale);
            const imgWidth = uploadedImage.width;
            const imgHeight = uploadedImage.height;
            ctx.drawImage(uploadedImage, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            ctx.restore();
          };
          uploadedImage.src = customization.imageUrl;
        }

        // Draw text if available
        if (customText) {
          ctx.save();
          ctx.font = `${textSize}px ${selectedFont}`;
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Apply text rotation
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate(textRotation * Math.PI / 180);
          ctx.fillText(customText, 0, 0);
          ctx.restore();
        }
      };

      // Get the appropriate mockup image based on color
      const colorName = customization.selectedColor.toLowerCase();
      const selectedColorData = product.colors.find(c => c.name.toLowerCase() === colorName);
      const mockupImagePath = selectedColorData?.image || product.colors[0].image;
      mockupImage.src = mockupImagePath;
    };

    // Initial draw and redraw on customization changes
    drawCanvas();

    // Add resize listener
    const handleResize = () => {
      drawCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [product, customization, customText, selectedFont, textColor, textSize, textRotation, canvasRef]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomization((prev) => ({
          ...prev,
          imageUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    console.log('Selected color:', color); // Debug log
    setCustomization((prev) => ({
      ...prev,
      selectedColor: color,
    }));
    setSelectedImage(product?.colors.find(c => c.name === color)?.image || '');
  };

  const handlePositionChange = (x: number, y: number) => {
    setCustomization((prev) => ({
      ...prev,
      imagePosition: { x, y },
    }));
  };

  const handleScaleChange = (scale: number) => {
    setCustomization((prev) => ({
      ...prev,
      imageScale: scale,
    }));
  };

  const handleRotationChange = (rotation: number) => {
    setCustomization((prev) => ({
      ...prev,
      imageRotation: rotation,
    }));
  };

  const handleSave = () => {
    // Here you would typically save the customization to your backend
    toast({
      title: 'Success',
      description: 'Customization saved successfully',
      status: 'success',
      duration: 3000,
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!customization.imageUrl) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is within the image bounds
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const imgX = centerX + customization.imagePosition.x;
    const imgY = centerY + customization.imagePosition.y;

    // Simple hit detection - you might want to make this more precise
    const distance = Math.sqrt(
      Math.pow(x - imgX, 2) + Math.pow(y - imgY, 2)
    );
    
    if (distance < 50) { // 50px radius around image center
      setCustomization(prev => ({
        ...prev,
        isDragging: true,
        dragStart: { x, y }
      }));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!customization.isDragging || !customization.imageUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - customization.dragStart.x;
    const deltaY = y - customization.dragStart.y;

    setCustomization(prev => ({
      ...prev,
      imagePosition: {
        x: prev.imagePosition.x + deltaX,
        y: prev.imagePosition.y + deltaY
      },
      dragStart: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setCustomization(prev => ({
      ...prev,
      isDragging: false
    }));
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading product details...</Text>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Text color="red.500">{error || 'Product not found'}</Text>
          <Button onClick={() => router.push('/catalog')}>
            Return to Catalog
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
        <Box>
          <Box
            position="relative"
            width="100%"
            height="500px"
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
          >
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </Box>
        </Box>

        <VStack spacing={6} align="stretch">
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Customize Your Design
            </Text>

            <VStack spacing={4} align="stretch">
              {/* Color Selection */}
              <FormControl>
                <FormLabel>Color</FormLabel>
                <SimpleGrid columns={2} spacing={2}>
                  {product?.colors.map((color) => (
                    <Button
                      key={color.name}
                      onClick={() => handleColorChange(color.name)}
                      bg={color.code}
                      color={color.code === '#FFFFFF' ? 'black' : 'white'}
                      borderWidth={1}
                      borderColor="gray.200"
                      _hover={{ opacity: 0.8 }}
                    >
                      {color.name}
                    </Button>
                  ))}
                </SimpleGrid>
              </FormControl>

              {/* Image Upload */}
              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <Button
                  as="label"
                  htmlFor="image-upload"
                  colorScheme="blue"
                  width="100%"
                  height="50px"
                  fontSize="lg"
                  leftIcon={<span>📁</span>}
                >
                  Upload Image
                </Button>
              </FormControl>

              {/* Image Controls */}
              {customization.imageUrl && (
                <>
                  <FormControl>
                    <FormLabel>Image Size</FormLabel>
                    <HStack spacing={4}>
                      <Button
                        onClick={() => handleScaleChange(Math.max(0.1, customization.imageScale - 0.1))}
                        size="sm"
                      >
                        -
                      </Button>
                      <Slider
                        value={customization.imageScale}
                        onChange={handleScaleChange}
                        min={0.1}
                        max={2}
                        step={0.1}
                        flex={1}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Button
                        onClick={() => handleScaleChange(Math.min(2, customization.imageScale + 0.1))}
                        size="sm"
                      >
                        +
                      </Button>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {Math.round(customization.imageScale * 100)}%
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Image Rotation</FormLabel>
                    <HStack spacing={4}>
                      <Button
                        onClick={() => handleRotationChange((customization.imageRotation - 15 + 360) % 360)}
                        size="sm"
                      >
                        ↺
                      </Button>
                      <Slider
                        value={customization.imageRotation}
                        onChange={handleRotationChange}
                        min={0}
                        max={360}
                        step={1}
                        flex={1}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Button
                        onClick={() => handleRotationChange((customization.imageRotation + 15) % 360)}
                        size="sm"
                      >
                        ↻
                      </Button>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {customization.imageRotation}°
                    </Text>
                  </FormControl>

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Tip: Click and drag the image to position it
                  </Text>
                </>
              )}

              {/* Text Controls */}
              <FormControl>
                <FormLabel>Add Text</FormLabel>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter your text"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.375rem',
                  }}
                />
              </FormControl>

              {customText && (
                <>
                  <FormControl>
                    <FormLabel>Font</FormLabel>
                    <Select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                    >
                      {fonts.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Text Color</FormLabel>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{ width: '100%', height: '40px' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Text Size</FormLabel>
                    <HStack spacing={4}>
                      <Button
                        onClick={() => setTextSize(Math.max(12, textSize - 2))}
                        size="sm"
                      >
                        -
                      </Button>
                      <Slider
                        value={textSize}
                        onChange={setTextSize}
                        min={12}
                        max={72}
                        step={1}
                        flex={1}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Button
                        onClick={() => setTextSize(Math.min(72, textSize + 2))}
                        size="sm"
                      >
                        +
                      </Button>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {textSize}px
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Text Rotation</FormLabel>
                    <HStack spacing={4}>
                      <Button
                        onClick={() => setTextRotation((textRotation - 15 + 360) % 360)}
                        size="sm"
                      >
                        ↺
                      </Button>
                      <Slider
                        value={textRotation}
                        onChange={setTextRotation}
                        min={0}
                        max={360}
                        step={1}
                        flex={1}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Button
                        onClick={() => setTextRotation((textRotation + 15) % 360)}
                        size="sm"
                      >
                        ↻
                      </Button>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {textRotation}°
                    </Text>
                  </FormControl>
                </>
              )}

              <Button
                colorScheme="blue"
                onClick={handleSave}
                mt={4}
                size="lg"
              >
                Save Design
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Grid>
    </Container>
  );
} 