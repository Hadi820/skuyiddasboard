import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAccountForm } from "@/components/user-account-form"
import { UserProfileForm } from "@/components/user-profile-form"
import { AdminDataManager } from "@/components/admin-data-manager"

const SettingsPage = () => {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <UserProfileForm />
        </TabsContent>
        <TabsContent value="account" className="space-y-6">
          <UserAccountForm />
        </TabsContent>
        <TabsContent value="data" className="space-y-6">
          <AdminDataManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage
