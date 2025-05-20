import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  base: 'https://dasu2313.github.io/movies-react/',
  plugins: [react()],
})
