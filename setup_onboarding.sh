#!/bin/bash

echo "================================================"
echo "  QUANTICAST AI - Firebase Auth Setup Script"
echo "================================================"
echo ""

echo "[1/3] Installing Firebase SDK..."
npm install firebase

echo ""
echo "[2/3] Creating Firebase config file..."

cat > client/src/firebaseConfig.ts << 'EOF'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
EOF

echo ""
echo "[3/3] Setup complete!"
echo ""
echo "================================================"
echo "  NEXT STEPS:"
echo "================================================"
echo ""
echo "1. Open client/src/firebaseConfig.ts"
echo "2. Replace placeholder values with your Firebase credentials"
echo "   (Get these from https://console.firebase.google.com/)"
echo ""
echo "3. Update client/src/components/Onboarding.tsx:"
echo ""
echo "   // Add imports:"
echo "   import { signInWithPopup } from 'firebase/auth';"
echo "   import { auth, provider } from '../firebaseConfig';"
echo ""
echo "   // Replace handleGoogleLogin:"
echo "   const handleGoogleLogin = async () => {"
echo "     setIsLoading(true);"
echo "     try {"
echo "       const result = await signInWithPopup(auth, provider);"
echo "       const user = result.user;"
echo "       login(user.email || '', user.displayName || '', user.photoURL || undefined);"
echo "       setStep('SURVEY_1');"
echo "     } catch (error) {"
echo "       console.error(error);"
echo "     } finally {"
echo "       setIsLoading(false);"
echo "     }"
echo "   };"
echo ""
echo "================================================"
