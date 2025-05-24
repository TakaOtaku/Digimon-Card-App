import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

export const DigimonPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}', // Button Primary Text Color
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#1f2d40',
          50: '#1f2d40',
          100: '{sky.950}', // Hover
          200: '#1f2d40',
          300: '#ffffff', // Border
          400: '{sky.400}',
          500: '#ffffff', // Text
          600: '{sky.600}',
          700: '#ffffff', // Text Color
          800: '#ffffff',
          900: '{sky.900}',
          950: '#17212f', // Default: {sky.950} Background MultiSelect
        },
      },
      dark: {
        surface: {
          0: '#ffffff', //#1f2d40
          50: '#1f2d40',
          100: '{sky.950}', // Hover
          200: '#1f2d40',
          300: '#ffffff', // Border
          400: '#ffffff',
          500: '#ffffff', // Text
          600: '{sky.600}',
          700: '#ffffff', // Text Color
          800: '#ffffff',
          900: '{sky.900}',
          950: '#17212f', // Default: {sky.950} Background MultiSelect
        },
      },
    },
  },
});
