
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: '#E5E5E5',
				input: '#E5E5E5',
				ring: '#000000',
				background: '#FFFFFF', // White background
				foreground: '#000000', // Black text
				primary: {
					DEFAULT: '#10B981', // Supabase green
					foreground: '#FFFFFF' // White
				},
				secondary: {
					DEFAULT: '#F9F9F9', // Light Gray
					foreground: '#000000' // Black
				},
				accent: {
					DEFAULT: '#3ECF8E', // Lighter Supabase green
					foreground: '#000000' // Black
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: '#F1F1F1', // Light Gray
					foreground: '#737373' // Dark Gray
				},
				popover: {
					DEFAULT: '#FFFFFF', // White
					foreground: '#000000' // Black
				},
				card: {
					DEFAULT: '#FFFFFF', // White
					foreground: '#000000' // Black
				},
				sidebar: {
					DEFAULT: '#FFFFFF', // White
					foreground: '#000000', // Black
					primary: '#10B981', // Supabase green
					'primary-foreground': '#FFFFFF', // White
					accent: '#F1F1F1', // Light Gray
					'accent-foreground': '#000000', // Black
					border: '#E5E5E5', // Light Gray
					ring: '#3ECF8E' // Light Green
				},
				gradient: {
					'green-black': 'linear-gradient(90deg, #10B981 0%, #000000 100%)',
					'black-green': 'linear-gradient(90deg, #000000 0%, #10B981 100%)',
					'green-white': 'linear-gradient(90deg, #10B981 0%, #FFFFFF 100%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'open-sans': ['Open Sans', 'sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '.5' }
				},
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'blink': {
					'50%': { borderColor: 'transparent' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'typing': 'typing 3.5s steps(40, end)',
				'blink': 'blink 1s step-end infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
