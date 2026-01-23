// Test script to diagnose Cloudinary configuration issues
// Run with: node scripts/test-cloudinary.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function testCloudinaryConfig() {
  console.log('🔍 Testing Cloudinary Configuration...\n');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  console.log('Configuration:');
  console.log(`  Cloud Name: ${cloudName || 'NOT SET'}`);
  console.log(`  Upload Preset: ${uploadPreset || 'NOT SET'}\n`);

  if (!cloudName) {
    console.error('❌ ERROR: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    console.log('   Please add it to your .env.local file');
    return;
  }

  if (!uploadPreset) {
    console.error('❌ ERROR: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set');
    console.log('   Please add it to your .env.local file');
    return;
  }

  // Test the upload preset by making a request
  console.log('Testing upload preset...');

  try {
    // Create a simple test request to check if the preset exists
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          upload_preset: uploadPreset,
          file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log('✅ Upload preset is working!');
      console.log(`   Test image uploaded: ${responseData.secure_url}`);
    } else {
      console.error('❌ Upload preset test failed!');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log('   Error details:', responseData);

      if (response.status === 400) {
        console.log('\n🔧 Possible solutions:');
        console.log('   1. Check if upload preset name is correct');
        console.log('   2. Ensure upload preset allows unsigned uploads');
        console.log('   3. Verify cloud name is correct');
        console.log('   4. Check if upload preset has proper permissions');
      } else if (response.status === 401) {
        console.log('\n🔧 Possible solutions:');
        console.log('   1. Verify upload preset exists');
        console.log('   2. Check if upload preset is enabled');
      } else if (response.status === 403) {
        console.log('\n🔧 Possible solutions:');
        console.log('   1. Upload preset must allow unsigned uploads');
        console.log('   2. Check upload preset permissions');
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n🔧 Check your internet connection and Cloudinary API status');
  }
}

testCloudinaryConfig();