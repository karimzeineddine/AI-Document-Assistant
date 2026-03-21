"use client"

import { useState } from "react"
import { Bell, Moon, Sun, User, Shield, CreditCard, Key, Globe } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <DashboardHeader
          title="Settings"
          description="Manage your account and preferences"
        />
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row">
              {/* Settings Navigation */}
              <nav className="w-full lg:w-56 shrink-0">
                <div className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-1 pb-2 lg:pb-0 -mx-1 px-1 scrollbar-none">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 rounded-md px-2.5 sm:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <section.icon className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline lg:inline">{section.label}</span>
                      <span className="sm:hidden lg:hidden">{section.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Settings Content */}
              <div className="flex-1 space-y-6">
                {activeSection === "profile" && (
                  <Card className="border-border bg-card">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-foreground text-base sm:text-lg">Profile Information</CardTitle>
                      <CardDescription className="text-sm">Update your personal details and profile picture</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback className="text-lg">JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 text-center sm:text-left">
                          <Button variant="outline" size="sm">Change Photo</Button>
                          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="firstName" className="text-sm">First Name</Label>
                          <Input id="firstName" defaultValue="John" className="h-9 sm:h-10" />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" className="h-9 sm:h-10" />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                          <Label htmlFor="email" className="text-sm">Email</Label>
                          <Input id="email" type="email" defaultValue="john@company.com" className="h-9 sm:h-10" />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                          <Label htmlFor="company" className="text-sm">Company</Label>
                          <Input id="company" defaultValue="Acme Inc." className="h-9 sm:h-10" />
                        </div>
                      </div>
                      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        <Button className="w-full sm:w-auto">Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSection === "notifications" && (
                  <Card className="border-border bg-card">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-foreground text-base sm:text-lg">Notification Preferences</CardTitle>
                      <CardDescription className="text-sm">Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <Label className="text-sm">Email Notifications</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} className="shrink-0" />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <Label className="text-sm">Push Notifications</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">Receive push notifications in browser</p>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} className="shrink-0" />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <Label className="text-sm">Weekly Digest</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">Get a weekly summary of your documents</p>
                        </div>
                        <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} className="shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSection === "appearance" && (
                  <Card className="border-border bg-card">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-foreground text-base sm:text-lg">Appearance</CardTitle>
                      <CardDescription className="text-sm">Customize how DocuMind looks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          {darkMode ? <Moon className="h-5 w-5 text-muted-foreground shrink-0" /> : <Sun className="h-5 w-5 text-muted-foreground shrink-0" />}
                          <div className="space-y-0.5 min-w-0">
                            <Label className="text-sm">Dark Mode</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">Use dark theme across the app</p>
                          </div>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} className="shrink-0" />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-sm">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10">
                            <Globe className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSection === "security" && (
                  <Card className="border-border bg-card">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-foreground text-base sm:text-lg">Security Settings</CardTitle>
                      <CardDescription className="text-sm">Manage your password and security options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm">Current Password</Label>
                        <Input id="currentPassword" type="password" className="h-9 sm:h-10" />
                      </div>
                      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                          <Input id="newPassword" type="password" className="h-9 sm:h-10" />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                          <Input id="confirmPassword" type="password" className="h-9 sm:h-10" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="w-full sm:w-auto">Update Password</Button>
                      </div>
                      <Separator />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Two-Factor Authentication</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto">Enable 2FA</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSection === "billing" && (
                  <Card className="border-border bg-card">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-foreground text-base sm:text-lg">Billing & Subscription</CardTitle>
                      <CardDescription className="text-sm">Manage your subscription and payment methods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground text-sm sm:text-base">Pro Plan</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">$29/month - billed monthly</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">Change Plan</Button>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="mb-3 font-medium text-foreground text-sm sm:text-base">Payment Method</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-3 sm:p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-secondary">
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm sm:text-base">Visa ending in 4242</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Expires 12/2025</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto">Edit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSection === "api" && (
                  <Card className="border-border bg-card">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-foreground text-base sm:text-lg">API Keys</CardTitle>
                      <CardDescription className="text-sm">Manage your API keys for integrations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="rounded-lg border border-border p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base">Production Key</p>
                            <p className="font-mono text-xs sm:text-sm text-muted-foreground truncate">dm_prod_****************************</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="ghost" size="sm">Copy</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Revoke</Button>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base">Development Key</p>
                            <p className="font-mono text-xs sm:text-sm text-muted-foreground truncate">dm_dev_****************************</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="ghost" size="sm">Copy</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Revoke</Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Key className="mr-2 h-4 w-4" />
                        Generate New Key
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
