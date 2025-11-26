# Quick Start: Test Resend Integration

## Option 1: Quick Environment Check ✅

Run the test script to verify your configuration:

```bash
cd medusa-raqueto-backend
node test-resend.js
```

Expected output if working:
```
🔍 Testing Resend Integration...
Step 1: Checking environment variables...
✅ RESEND_API_KEY is set
✅ RESEND_FROM_EMAIL is set: your-email@domain.com
Step 2: Initializing Resend client...
✅ Resend client initialized
Step 3: Attempting to send test email...
✅ Email sent successfully!
   Email ID: xxxxx
📧 Check your inbox at: your-email@domain.com
```

---

## Option 2: Test via Admin User Invite (Easiest) 🚀

This is the fastest way to test if everything is working:

1. **Start your Medusa backend:**
   ```bash
   cd medusa-raqueto-backend
   npm run dev
   ```

2. **Open admin dashboard:**
   - Go to http://localhost:9000/app
   - Login with your admin credentials

3. **Invite a test user:**
   - Click **Settings** in the sidebar
   - Click **The Team**
   - Click **Invite users** button
   - Enter your email address
   - Click **Invite**

4. **Check your logs:**
   Look for this in your terminal:
   ```
   info: Processing invite.created which has 1 subscribers
   ```

5. **Check your email:**
   You should receive a user invitation email!

---

## Option 3: Test via Order Placement (Full E2E) 🛒

This tests the complete order flow:

1. **Start backend:**
   ```bash
   cd medusa-raqueto-backend
   npm run dev
   ```

2. **Start storefront (in new terminal):**
   ```bash
   cd nextjs-starter-medusa
   npm run dev
   ```

3. **Place an order:**
   - Go to http://localhost:8000
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - **Important**: Use your Resend account email in shipping address
   - Complete the order

4. **Verify:**
   - Check backend logs for: `Processing order.placed which has 1 subscribers`
   - Check your email for order confirmation

---

## Option 4: Test Password Reset 🔐

1. **Start your backend**

2. **Go to admin login page:**
   http://localhost:9000/app/login

3. **Click "Forgot your password?"**

4. **Enter your email and submit**

5. **Check your inbox** for the password reset email

---

## Troubleshooting 🔧

### No email received?

1. **Check Resend Dashboard:**
   - Go to https://resend.com/emails
   - See if the email appears there
   - Check for any error messages

2. **Check Backend Logs:**
   - Look for "Failed to send email" errors
   - Check if subscribers are being triggered

3. **Verify Environment Variables:**
   ```bash
   # In medusa-raqueto-backend directory
   cat .env | grep RESEND
   ```
   
   Should show:
   ```
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=your-email@domain.com
   ```

4. **Domain Issues:**
   - If using custom domain: Verify DNS records in Resend dashboard
   - For testing: Use `onboarding@resend.dev` as FROM email

5. **Restart Backend:**
   ```bash
   # Stop current process (Ctrl+C)
   npm run dev
   ```

### Common Errors:

| Error | Solution |
|-------|----------|
| `RESEND_API_KEY is not set` | Add `RESEND_API_KEY` to `.env` file |
| `Option 'api_key' is required` | Restart backend after adding env vars |
| `Failed to send email: 403` | Invalid API key, regenerate in Resend |
| `Failed to send email: 400` | Check domain verification or use `onboarding@resend.dev` |
| No subscriber logs | Event might not be triggering, check event name |

---

## Expected Email Templates 📧

Your integration includes these email templates:

1. **Order Placed** (`order-placed`)
   - Triggered by: `order.placed` event
   - Template: `src/modules/resend/emails/order-placed.tsx`

2. **User Invited** (`user-invited`)
   - Triggered by: `invite.created`, `invite.resent` events
   - Template: `src/modules/resend/emails/user-invited.tsx`

3. **Password Reset** (`password-reset`)
   - Triggered by: `auth.password_reset` event
   - Template: `src/modules/resend/emails/password-reset.tsx`

---

## Next Steps 🎯

Once testing is successful:

1. ✅ Set up custom domain in Resend (for production)
2. ✅ Update `RESEND_FROM_EMAIL` to your branded email
3. ✅ Customize email templates in `src/modules/resend/emails/`
4. ✅ Test in production environment
5. ✅ Monitor email sending in Resend dashboard

---

## Need Help?

- Resend Docs: https://resend.com/docs
- Medusa Docs: https://docs.medusajs.com
- Resend Dashboard: https://resend.com/emails







