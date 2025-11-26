/**
 * Quick Resend Integration Test Script
 * 
 * This script verifies that your Resend integration is properly configured
 * by checking the required dependencies and attempting to send a test email.
 * 
 * Usage:
 *   node test-resend.js
 */

require('dotenv').config();
const { Resend } = require('resend');

async function testResendIntegration() {
  console.log('🔍 Testing Resend Integration...\n');

  // Step 1: Check environment variables
  console.log('Step 1: Checking environment variables...');
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not set in your .env file');
    return;
  }
  console.log('✅ RESEND_API_KEY is set');

  if (!fromEmail) {
    console.error('❌ RESEND_FROM_EMAIL is not set in your .env file');
    return;
  }
  console.log(`✅ RESEND_FROM_EMAIL is set: ${fromEmail}\n`);

  // Step 2: Initialize Resend client
  console.log('Step 2: Initializing Resend client...');
  const resend = new Resend(apiKey);
  console.log('✅ Resend client initialized\n');

  // Step 3: Send test email
  console.log('Step 3: Attempting to send test email...');
  console.log(`   From: ${fromEmail}`);
  console.log(`   To: ${fromEmail}`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [fromEmail],
      subject: '✅ Resend Integration Test - MedusaCore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">✅ Success!</h1>
          <p>Your Resend integration with Medusa is working correctly!</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <h2>Integration Details:</h2>
          <ul>
            <li><strong>From Email:</strong> ${fromEmail}</li>
            <li><strong>API Key:</strong> ${apiKey.substring(0, 10)}...</li>
            <li><strong>Test Date:</strong> ${new Date().toISOString()}</li>
          </ul>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is a test email sent from your Medusa application to verify the Resend integration.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Failed to send email:');
      console.error('   Error:', error);
      console.error('\n💡 Common issues:');
      console.error('   - Invalid API key');
      console.error('   - Unverified domain (use onboarding@resend.dev for testing)');
      console.error('   - Email address not allowed (check Resend dashboard)');
      return;
    }

    if (data) {
      console.log('✅ Email sent successfully!');
      console.log(`   Email ID: ${data.id}`);
      console.log(`\n📧 Check your inbox at: ${fromEmail}`);
      console.log(`📊 View in Resend Dashboard: https://resend.com/emails/${data.id}\n`);
      console.log('🎉 Your Resend integration is working correctly!');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testResendIntegration().catch(console.error);







