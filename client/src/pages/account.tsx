import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/UserContext";
import { SubscriptionTier, TIER_LIMITS } from "@/lib/types";
import { Shield, User, Phone, MapPin, Globe, Calendar, Rocket } from "lucide-react";

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'] as const;
const GOAL_OPTIONS = ['Income', 'Growth', 'Preservation', 'Speculation'] as const;
const RISK_OPTIONS = ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'] as const;

export default function AccountPage() {
  const { user, updateProfile, upgradeTier } = useUser();

  const [contactForm, setContactForm] = useState({
    displayName: "",
    dob: "",
    nationality: "",
    address: "",
    phone: "",
  });

  const [prefsForm, setPrefsForm] = useState({
    experienceLevel: "Beginner",
    tradingGoal: "Growth",
    riskTolerance: "Moderate",
  });

  useEffect(() => {
    if (!user) return;
    setContactForm({
      displayName: user.displayName || "",
      dob: user.dob || "",
      nationality: user.nationality || "",
      address: user.address || "",
      phone: user.phone || "",
    });
    setPrefsForm({
      experienceLevel: user.experienceLevel,
      tradingGoal: user.tradingGoal,
      riskTolerance: user.riskTolerance,
    });
  }, [user]);

  const currentTier: SubscriptionTier = user?.subscriptionTier ?? "FREE";
  const tierLimits = TIER_LIMITS[currentTier];
  const usageUsed = user?.dailyUsageCount ?? 0;
  const dailyLimit = tierLimits.maxDailyScans;
  const usageProgress = dailyLimit ? Math.min((usageUsed / dailyLimit) * 100, 100) : 0;

  const tierButtons = useMemo(
    () =>
      (["FREE", "PRO", "MAX"] as SubscriptionTier[]).map((tier) => ({
        tier,
        label: TIER_LIMITS[tier].label,
      })),
    []
  );

  const handleSaveContact = () => {
    updateProfile(contactForm);
  };

  const handleSavePrefs = () => {
    updateProfile(prefsForm);
  };

  const handleTierChange = (tier: SubscriptionTier) => {
    upgradeTier(tier);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">You need to sign in to manage your account.</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Account</p>
          <h1 className="text-3xl font-semibold">User Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, preferences, and subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 bg-card/80 border-border/70 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-fin-accent text-white flex items-center justify-center text-xl font-semibold">
                {user.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="outline" className="border-fin-accent text-fin-accent">
                {tierLimits.label}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>DOB: {user.dob || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Nationality: {user.nationality || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Address: {user.address || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Phone: {user.phone || "Not set"}</span>
              </div>
            </div>
            <div>
              {dailyLimit !== null ? (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Daily scans</span>
                    <span>
                      {usageUsed}/{dailyLimit}
                    </span>
                  </div>
                  <Progress value={usageProgress} />
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Unlimited scans on this plan.</p>
              )}
            </div>
          </Card>

          <Card className="p-5 bg-card/80 border-border/70 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-fin-accent" />
              <h2 className="text-lg font-semibold">Contact details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={contactForm.displayName}
                  onChange={(e) => setContactForm((p) => ({ ...p, displayName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={contactForm.dob}
                  onChange={(e) => setContactForm((p) => ({ ...p, dob: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={contactForm.nationality}
                  onChange={(e) => setContactForm((p) => ({ ...p, nationality: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={contactForm.address}
                  onChange={(e) => setContactForm((p) => ({ ...p, address: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveContact}>Save contact</Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 bg-card/80 border-border/70 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-fin-accent" />
              <h2 className="text-lg font-semibold">Trading preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Experience</Label>
                <Select
                  value={prefsForm.experienceLevel}
                  onValueChange={(v) => setPrefsForm((p) => ({ ...p, experienceLevel: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Goal</Label>
                <Select
                  value={prefsForm.tradingGoal}
                  onValueChange={(v) => setPrefsForm((p) => ({ ...p, tradingGoal: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Risk tolerance</Label>
                <Select
                  value={prefsForm.riskTolerance}
                  onValueChange={(v) => setPrefsForm((p) => ({ ...p, riskTolerance: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSavePrefs}>Save preferences</Button>
            </div>
          </Card>

          <Card className="p-5 bg-card/80 border-border/70 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-fin-accent" />
              <h2 className="text-lg font-semibold">Subscription</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Current plan: <span className="font-semibold">{tierLimits.label}</span>
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                {tierLimits.maxDailyScans
                  ? `${tierLimits.maxDailyScans} daily scans`
                  : "Unlimited daily scans"}
              </p>
              <p>{tierLimits.groundingEnabled ? "Grounding enabled" : "Grounding disabled"}</p>
              <p>Strategies: {tierLimits.allowedStrategies.length === Object.values(TIER_LIMITS).length ? 'All' : `${tierLimits.allowedStrategies.length} allowed`}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tierButtons.map(({ tier, label }) => (
                <Button
                  key={tier}
                  size="sm"
                  variant={tier === currentTier ? "secondary" : "outline"}
                  onClick={() => handleTierChange(tier)}
                  disabled={tier === currentTier}
                >
                  {tier === currentTier ? `Current: ${label}` : `Switch to ${label}`}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

