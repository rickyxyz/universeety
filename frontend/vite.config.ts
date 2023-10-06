import react from "@vitejs/plugin-react-swc";

export default {
  plugins: [react()],

  server: {
    host: false,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
