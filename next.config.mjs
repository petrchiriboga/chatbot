/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'storage.googleapis.com',
      protocol: 'https',
      pathname: '/devtest-petcircle-user-assets/pet-profile-images/**'
    }],
  }
};

export default nextConfig;
